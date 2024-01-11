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
	import { clone } from 'lodash';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import {
		Button,
		ButtonStyle,
		Card,
		Dialog,
		EditTaskDialog,
		Icon,
		SortModeDialog,
		TaskItem
	} from '$lib/component';
	import { SortDirection, SortType, type TaskListPrefs } from '$lib/type';
	import type { Task, TaskList } from '$lib/type';
	import { themeFromListColor } from '$lib/theme';
	import {
		iconFromListIcon,
		iconFromSortDirection,
		iconFromSortType,
		labelFromSortDirection,
		labelFromSortType,
		sortTasks
	} from '$lib/util';

	import {
		bullet,
		header,
		taskListItem,
		progress,
		description,
		sort,
		title,
		headerText,
		placeholder,
		divider
	} from './TaskListItem.css';
	import { themeVariant } from '$lib/stores';

	export let taskList: TaskList;

	const queryClient = useQueryClient();

	interface TasksResult {
		prefs: TaskListPrefs;
		current: Task[];
		completed: Task[];
	}

	const tasks = createQuery<TasksResult, Error, TasksResult>({
		queryKey: ['tasks', { listId: taskList.id }],
		queryFn: async () => {
			const prefs = await api().getListPrefs(taskList.id);
			const tasks = await api().getTasks(taskList.id);
			return {
				prefs: prefs,
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

	let prefs: TaskListPrefs | null = null;

	$: {
		if ($tasks.data) {
			const data = $tasks.data;
			prefs = data.prefs;
		}
	}

	async function toggleSortDirection() {
		if (!prefs) {
			return;
		}

		if (prefs.sortDirection != SortDirection.DESCENDING) {
			prefs.sortDirection = SortDirection.DESCENDING;
		} else {
			prefs.sortDirection = SortDirection.ASCENDING;
		}
		taskList.lastModified = new Date();
		prefs.lastModified = new Date();

		$updateList.mutate({
			taskList: taskList,
			prefs: prefs
		});
	}

	let listToSort: TaskList | null = null;

	let taskToCreate: Task | null = null;
	let taskToEdit: Task | null = null;

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

	const TOP_TASK_COUNT = 3;
</script>

<SortModeDialog bind:taskList={listToSort} bind:prefs />

<EditTaskDialog mode="create" bind:task={taskToCreate} oldListId={taskList.id} />
<EditTaskDialog bind:task={taskToEdit} oldListId={taskList.id} />

{#if $updateList.error}
	<Dialog dismiss={$updateList.reset}>
		<Card>
			<svelte:fragment slot="content">
				<h1>An error occurred</h1>
				<p>{$updateList.error.message}</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={$updateList.reset}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

<section class={taskListItem} style={themeFromListColor(taskList.color, $themeVariant)}>
	<div>
		<div class={header}>
			<Button style={ButtonStyle.Icon} href="/list?id={taskList.id}">
				<Icon>{iconFromListIcon(taskList.icon)}</Icon>
			</Button>
			<div class={headerText}>
				<h2><a class={title} href="/list?id={taskList.id}">{taskList.title}</a></h2>
			</div>
			<Button style={ButtonStyle.Icon} onClick={showCreate}>
				<Icon>add</Icon>
			</Button>
		</div>
		{#if taskList.description}
			<p class={description}>{taskList.description}</p>
		{/if}
		{#if $tasks.status === 'pending'}
			<progress class={progress} />
		{:else if $tasks.status === 'error'}
			<span>Error: {$tasks.error.message}</span>
		{:else}
			{#if $tasks.data.current.length > 0}
				<ul class={bullet}>
					{#each $tasks.data.current.slice(0, TOP_TASK_COUNT) as task, index (task.id)}
						{#if prefs?.showIndexNumbers}
							<TaskItem
								{task}
								indexNumber={index + 1}
								onEditClicked={() => (taskToEdit = clone(task))}
							/>
						{:else}
							<TaskItem {task} onEditClicked={() => (taskToEdit = clone(task))} />
						{/if}
					{/each}
				</ul>
			{/if}
			{#if $tasks.data.current.length - TOP_TASK_COUNT > 0}
				<a class={divider} href="/list?id={taskList.id}">
					<span>View {$tasks.data.current.length - TOP_TASK_COUNT} more</span>
					<Icon>open_in_new</Icon>
				</a>
			{:else if $tasks.data.completed.length > 0}
				<a class={divider} href="/list?id={taskList.id}">
					<span>Completed ({$tasks.data.completed.length})</span>
					<Icon>open_in_new</Icon>
				</a>
			{:else if $tasks.data.current.length === 0}
				<p class={placeholder}>All tasks complete!</p>
			{/if}
		{/if}
	</div>
	<div class={sort}>
		<Button style={ButtonStyle.Text} onClick={() => (listToSort = clone(taskList))}>
			<Icon>{iconFromSortType(prefs?.sortType)}</Icon>
			{labelFromSortType(prefs?.sortType)}
		</Button>
		{#if prefs?.sortType !== SortType.ORDINAL}
			<Button
				style={ButtonStyle.Text}
				onClick={toggleSortDirection}
				disabled={$updateList.isPending}
			>
				<Icon>{iconFromSortDirection(prefs?.sortDirection)}</Icon>
				{labelFromSortDirection(prefs?.sortDirection)}
			</Button>
		{/if}
	</div>
</section>
