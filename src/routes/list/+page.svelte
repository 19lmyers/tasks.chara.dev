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
	import type { Task, TaskList, TaskListPrefs } from '$lib/type';
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
		sort,
		divider,
		tasksGroup,
		paneLayout,
		completedTasks,
		dividerPlaceholder
	} from './styles.css';

	import { navHeader, themeBox } from '../styles.css';
	import { themeVariant } from '$lib/stores';
	import ShareListDialog from '$lib/component/dialog/ShareListDialog.svelte';

	const listId: string = $page.url.searchParams.get('id') ?? '';

	const queryClient = useQueryClient();

	interface TaskListResult {
		taskList: TaskList;
		prefs: TaskListPrefs;
	}

	const taskListQuery = createQuery<TaskListResult, Error, TaskListResult>({
		queryKey: ['lists', { listId: listId }],
		queryFn: async () => {
			const list = await api()
				.getList(listId)
				.catch(() => {
					throw error(404, { message: 'No list with ID' });
				});
			const prefs = await api().getListPrefs(listId);
			return {
				taskList: list,
				prefs: prefs
			};
		}
	});

	let taskList: TaskList;
	let prefs: TaskListPrefs;

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
					prefs.sortType,
					prefs.sortDirection
				),
				completed: sortTasks(
					tasks.filter((task) => task.isCompleted),
					prefs.sortType,
					prefs.sortDirection
				)
			};
		}
	});

	$: {
		if ($taskListQuery.data) {
			const data = $taskListQuery.data;

			taskList = data.taskList;
			prefs = data.prefs;

			$tasks.refetch({ throwOnError: true });
		}
	}

	let listToEdit: TaskList | null = null;
	let prefsToEdit: TaskListPrefs | null = null;

	let listToSort: TaskList | null = null;
	let prefsToSort: TaskListPrefs | null = null;

	let taskToCreate: Task | null = null;
	let taskToEdit: Task | null = null;

	let taskToDelete: Task | null = null;

	let showShareDialog: boolean = false;

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
		if (prefs.sortDirection != SortDirection.DESCENDING) {
			prefs.sortDirection = SortDirection.DESCENDING;
		} else {
			prefs.sortDirection = SortDirection.ASCENDING;
		}
		taskList.lastModified = new Date();

		$updateList.mutate({
			taskList: taskList,
			prefs: prefs
		});
	}

	interface TaskListInput {
		taskList: TaskList;
		prefs: TaskListPrefs;
	}

	const updateList = createMutation<string, Error, TaskListInput>({
		mutationFn: async (input: TaskListInput) => {
			await api().updateList(input.taskList);
			await api().updateListPrefs(input.prefs);
			return taskList.id;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries({ queryKey: ['lists'] });
			queryClient.invalidateQueries({ queryKey: ['tasks', { listId: listId }] });
		},
		onError: () => {
			if (prefs) {
				if (prefs.sortDirection != SortDirection.DESCENDING) {
					prefs.sortDirection = SortDirection.DESCENDING;
				} else {
					prefs.sortDirection = SortDirection.ASCENDING;
				}
			}
		}
	});

	let showCompletedTasks = false;
</script>

{#if $taskListQuery.status === 'pending'}
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

	<EditListDialog bind:taskList={listToEdit} bind:prefs={prefsToEdit} />
	<SortModeDialog bind:taskList={listToSort} bind:prefs={prefsToSort} />

	{#if showShareDialog}
		<ShareListDialog bind:taskList onDismiss={() => (showShareDialog = false)} />
	{/if}

	<EditTaskDialog mode="create" bind:task={taskToCreate} oldListId={taskList.id} />
	<EditTaskDialog bind:task={taskToEdit} oldListId={taskList.id} />

	<div style={themeFromListColor(taskList.color, $themeVariant)} class={themeBox}>
		<DeleteTaskDialog bind:task={taskToDelete} />

		<ListHeader
			{taskList}
			onEditClicked={() => {
				listToEdit = clone(taskList);
				prefsToEdit = clone(prefs);
			}}
			onShareClicked={() => {
				showShareDialog = true;
			}}
			onCreateClicked={showCreate}
		/>
		{#if $tasks.status === 'pending'}
			<progress />
		{:else if $tasks.status === 'error'}
			<span>Error: {$tasks.error.message}</span>
		{:else}
			<main class={paneLayout}>
				<section class={tasksContainer}>
					{#if $tasks.data.current.length > 0}
						<ul class={tasksGroup}>
							{#each $tasks.data.current as task, index (task.id)}
								{#if prefs.showIndexNumbers}
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
					{:else}
						<button class={divider} on:click={() => (showCompletedTasks = true)}>
							<span>Completed ({$tasks.data.completed.length})</span>
							<Icon>expand_more</Icon>
						</button>
					{/if}
				</div>
			</main>
		{/if}
		<div class={sort}>
			<Button
				style={ButtonStyle.Text}
				onClick={() => {
					listToSort = clone(taskList);
					prefsToSort = clone(prefs);
				}}
			>
				<Icon>{iconFromSortType(prefs.sortType)}</Icon>
				{labelFromSortType(prefs.sortType)}
			</Button>
			{#if prefs.sortType !== SortType.ORDINAL}
				<Button
					style={ButtonStyle.Text}
					onClick={toggleSortDirection}
					disabled={$updateList.isPending}
				>
					<Icon>{iconFromSortDirection(prefs.sortDirection)}</Icon>
					{labelFromSortDirection(prefs.sortDirection)}
				</Button>
			{/if}
		</div>
	</div>
{/if}
