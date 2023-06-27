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

<script lang='ts'>
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Icon, TaskItem } from '$lib/component';
	import type { Task, TaskList } from '$lib/type';
	import { themeFromListColor } from '$lib/theme';

	import { bullet, header, divider, taskListItem, progress, description, sort } from './TaskListItem.css';
	import {
		iconFromListIcon,
		iconFromSortDirection,
		iconFromSortType,
		labelFromSortDirection,
		labelFromSortType,
		sortTasks
	} from '$lib/util';

	import { SortDirection, SortType } from '$lib/type';

	export let taskList: TaskList;

	export let onEditClicked: (() => void) | null = null;
	export let onSortClicked: (() => void) | null = null;

	let showCompletedTasks = false;

	function toggleShowCompleted() {
		showCompletedTasks = !showCompletedTasks;
	}

	interface TasksResult {
		current: Task[];
		completed: Task[];
	}

	const tasks = createQuery<TasksResult, Error>({
		queryKey: ['tasks', taskList.id],
		queryFn: async () => {
			const tasks = await api().getTasks(taskList.id);
			return {
				current: sortTasks(tasks.filter((task) => !task.isCompleted),
					taskList.sortType,
					taskList.sortDirection),
				completed: sortTasks(tasks.filter((task) => task.isCompleted),
					taskList.sortType,
					taskList.sortDirection)
			};
		}
	});

	async function toggleSortDirection() {
		if (taskList.sortDirection != SortDirection.DESCENDING) {
			taskList.sortDirection = SortDirection.DESCENDING;
		} else {
			taskList.sortDirection = SortDirection.ASCENDING;
		}
		taskList.lastModified = new Date();

		$updateList.mutate(taskList);
	}

	const queryClient = useQueryClient();

	const updateList = createMutation<string, Error, TaskList>({
		mutationFn: async (taskList: TaskList) => {
			await api().updateList(taskList);
			return taskList.id;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries(['lists']);
			queryClient.invalidateQueries(['tasks', listId]);
		},
		onError: () => {
			if (taskList.sortDirection != SortDirection.DESCENDING) {
				taskList.sortDirection = SortDirection.DESCENDING;
			} else {
				taskList.sortDirection = SortDirection.ASCENDING;
			}
		}
	});

</script>

<section class='{taskListItem} {themeFromListColor(taskList.color)}'>
	<div class={header}>
		<Button style={ButtonStyle.Icon} onClick={onEditClicked}>
			<Icon>{iconFromListIcon(taskList.icon)}</Icon>
		</Button>
		<div>
			<h2>{taskList.title}</h2>
			{#if taskList.description}
				<p class={description}>{taskList.description}</p>
			{/if}
		</div>
		<Button style={ButtonStyle.Icon}>
			<Icon>add</Icon>
		</Button>
	</div>
	{#if $tasks.status === 'loading'}
		<progress class={progress} />
	{:else if $tasks.status === 'error'}
		<span>Error: {$tasks.error.message}</span>
	{:else}
		<ul class={bullet}>
			{#each $tasks.data.current as task}
				<TaskItem {task} />
			{/each}
			{#if $tasks.data.completed.length > 0}
				{#if showCompletedTasks}
					<button class={divider} on:click={toggleShowCompleted}>
						<span>Completed ({$tasks.data.completed.length})</span>
						<Icon>expand_less</Icon>
					</button>
					{#each $tasks.data.completed as task}
						<TaskItem {task} />
					{/each}
				{:else}
					<button class={divider} on:click={toggleShowCompleted}>
						<span>Completed ({$tasks.data.completed.length})</span>
						<Icon>expand_more</Icon>
					</button>
				{/if}
			{/if}
		</ul>
		<div class='{sort}'>
			<Button style='{ButtonStyle.Text}' onClick={onSortClicked}>
				<Icon>{iconFromSortType(taskList.sortType)}</Icon>
				{labelFromSortType(taskList.sortType)}
			</Button>
			{#if taskList.sortType !== SortType.ORDINAL}
				<Button style='{ButtonStyle.Text}' onClick={toggleSortDirection} disabled={$updateList.isLoading}>
					<Icon>{iconFromSortDirection(taskList.sortDirection)}</Icon>
					{labelFromSortDirection(taskList.sortDirection)}
				</Button>
			{/if}
		</div>
	{/if}
</section>
