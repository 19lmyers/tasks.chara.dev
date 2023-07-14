<!--
  - MIT License
  -
  - Copyright (c) 2023 Luke Myers
  -
  - Permission is hereby granted, free of charge, to any person obtaining a copy
  - of this software and associated documentation files (the "Software"), to deal
  - in the Software without restriction, including without limitation the rights
  - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  - copies of the Software, and to permit persons to whom the Software is
  - furnished to do so, subject to the following conditions:
  -
  - The above copyright notice and this permission notice shall be included in all
  - copies or substantial portions of the Software.
  -
  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  - SOFTWARE.
  -->

<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { page } from '$app/stores';

	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { clone } from 'lodash';

	import { api } from '$lib/api';
	import {
		Button,
		ButtonStyle,
		Card,
		CenterLayout,
		DeleteTaskDialog,
		EditListDialog,
		EditTaskDialog,
		Icon,
		ListHeader,
		PageTitle,
		SortModeDialog,
		TaskItem
	} from '$lib/component';
	import type { Task, TaskList } from '$lib/type';
	import { SortDirection, SortType } from '$lib/type';
	import { themeFromListColor } from '$lib/theme';
	import {
		iconFromSortDirection,
		iconFromSortType,
		labelFromSortDirection,
		labelFromSortType,
		sortTasks
	} from '$lib/util';

	import {
		tasksContainer,
		listPage,
		sort,
		divider,
		tasksGroup,
		paneLayout,
		completedTasks,
		dividerPlaceholder
	} from './styles.css';

	import { navHeader } from '../styles.css';

	const listId: string = $page.url.searchParams.get('id') ?? '';

	const queryClient = useQueryClient();

	const taskListQuery = createQuery<TaskList, Error, TaskList>({
		queryKey: ['lists', { listId: listId }],
		queryFn: async () => {
			return await api()
				.getList(listId)
				.catch(() => {
					throw error(404, { message: 'No list with ID' });
				});
		}
	});

	let taskList: TaskList;

	interface TasksResult {
		current: Task[];
		completed: Task[];
	}

	const tasks = createQuery<TasksResult, Error, TasksResult>({
		queryKey: ['tasks', { listId: listId }],
		queryFn: async () => {
			const tasks = await api().getTasks(listId);
			return {
				current: sortTasks(
					tasks.filter((task) => !task.isCompleted),
					taskList.sortType,
					taskList.sortDirection
				),
				completed: sortTasks(
					tasks.filter((task) => task.isCompleted),
					taskList.sortType,
					taskList.sortDirection
				)
			};
		}
	});

	$: {
		if ($taskListQuery.data) {
			taskList = $taskListQuery.data;
			$tasks.refetch({ throwOnError: true });
		}
	}

	let listToEdit: TaskList | null = null;
	let listToSort: TaskList | null = null;

	let taskToCreate: Task | null = null;
	let taskToEdit: Task | null = null;

	let taskToDelete: Task | null = null;

	function showCreate() {
		taskToCreate = {
			id: '',
			listId: taskList.id,
			label: '',
			isCompleted: false,
			isStarred: false,
			dateCreated: new Date(),
			lastModified: new Date(),
			ordinal: 0
		};
	}

	async function toggleSortDirection() {
		if (taskList.sortDirection != SortDirection.DESCENDING) {
			taskList.sortDirection = SortDirection.DESCENDING;
		} else {
			taskList.sortDirection = SortDirection.ASCENDING;
		}
		taskList.lastModified = new Date();

		$updateList.mutate(taskList);
	}

	const updateList = createMutation<string, Error, TaskList>({
		mutationFn: async (taskList: TaskList) => {
			await api().updateList(taskList);
			return taskList.id;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries(['lists']);
			queryClient.invalidateQueries(['tasks', { listId: listId }]);
		},
		onError: () => {
			if (taskList.sortDirection != SortDirection.DESCENDING) {
				taskList.sortDirection = SortDirection.DESCENDING;
			} else {
				taskList.sortDirection = SortDirection.ASCENDING;
			}
		}
	});

	let showCompletedTasks = false;
</script>

{#if $taskListQuery.status === 'loading'}
	<progress />
{:else if $taskListQuery.status === 'error'}
	<PageTitle title="Not Found" />
	<CenterLayout>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={navHeader}>
					<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
						<Icon>arrow_back</Icon>
					</Button>
					<span>Not Found</span>
				</h1>
				<p>No list could be found with that ID.</p>
			</svelte:fragment>
		</Card>
	</CenterLayout>
{:else}
	<PageTitle title={taskList.title} />

	<EditListDialog bind:taskList={listToEdit} />
	<SortModeDialog bind:taskList={listToSort} />

	<EditTaskDialog mode="create" bind:task={taskToCreate} />
	<EditTaskDialog bind:task={taskToEdit} oldListId={taskList.id} />

	<main class="{themeFromListColor(taskList.color)} {listPage}">
		<DeleteTaskDialog bind:task={taskToDelete} />

		<ListHeader
			{taskList}
			onEditClicked={() => (listToEdit = clone(taskList))}
			onCreateClicked={showCreate}
		/>
		{#if $tasks.status === 'loading'}
			<progress />
		{:else if $tasks.status === 'error'}
			<span>Error: {$tasks.error.message}</span>
		{:else}
			<div class={paneLayout}>
				<section class={tasksContainer}>
					{#if $tasks.data.current.length > 0}
						<ul class={tasksGroup}>
							{#each $tasks.data.current as task, index (task.id)}
								{#if taskList.showIndexNumbers}
									<TaskItem
										{task}
										indexNumber={index + 1}
										showPersistentActions={true}
										onEditClicked={() => (taskToEdit = clone(task))}
										onDeleteClicked={() => (taskToDelete = clone(task))}
									/>
								{:else}
									<TaskItem
										{task}
										showPersistentActions={true}
										onEditClicked={() => (taskToEdit = clone(task))}
										onDeleteClicked={() => (taskToDelete = clone(task))}
									/>
								{/if}
							{/each}
						</ul>
					{:else}
						<p class={dividerPlaceholder}>
							<span>All tasks complete!</span>
						</p>
					{/if}
				</section>
				<div class={completedTasks}>
					{#if $tasks.data.completed.length === 0}
						<p class={dividerPlaceholder}>
							<span>No completed tasks</span>
						</p>
					{:else if showCompletedTasks}
						<button class={divider} on:click={() => (showCompletedTasks = false)}>
							<span>Completed ({$tasks.data.completed.length})</span>
							<Icon>expand_less</Icon>
						</button>
						<section class={tasksContainer}>
							<ul class={tasksGroup}>
								{#each $tasks.data.completed as task (task.id)}
									<TaskItem
										{task}
										showPersistentActions={true}
										onEditClicked={() => (taskToEdit = clone(task))}
										onDeleteClicked={() => (taskToDelete = clone(task))}
									/>
								{/each}
							</ul>
						</section>
					{:else}
						<button class={divider} on:click={() => (showCompletedTasks = true)}>
							<span>Completed ({$tasks.data.completed.length})</span>
							<Icon>expand_more</Icon>
						</button>
					{/if}
				</div>
			</div>
		{/if}
		<div class={sort}>
			<Button style={ButtonStyle.Text} onClick={() => (listToSort = clone(taskList))}>
				<Icon>{iconFromSortType(taskList.sortType)}</Icon>
				{labelFromSortType(taskList.sortType)}
			</Button>
			{#if taskList.sortType !== SortType.ORDINAL}
				<Button
					style={ButtonStyle.Text}
					onClick={toggleSortDirection}
					disabled={$updateList.isLoading}
				>
					<Icon>{iconFromSortDirection(taskList.sortDirection)}</Icon>
					{labelFromSortDirection(taskList.sortDirection)}
				</Button>
			{/if}
		</div>
	</main>
{/if}
