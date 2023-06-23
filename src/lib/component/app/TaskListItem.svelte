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
	import { createQuery } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Icon, TaskItem } from '$lib/component';
	import type { Task, TaskList } from '$lib/type';
	import { themeFromListColor } from '$lib/theme';

	import { bullet, header, divider, taskListItem, progress } from './TaskListItem.css';

	export let taskList: TaskList;

	let showCompletedTasks = false;

	function toggleShowCompleted() {
		showCompletedTasks = !showCompletedTasks;
	}

	interface TasksResult {
		current: Task[];
		completed: Task[];
	}

	const tasks = createQuery<TasksResult, Error>({
		queryKey: ['tasks'],
		queryFn: async () => {
			const tasks = await api().getTasks(taskList.id);
			return {
				current: tasks.filter((task) => !task.isCompleted),
				completed: tasks.filter((task) => task.isCompleted)
			};
		}
	});
</script>

<section class="{taskListItem} {themeFromListColor(taskList.color)}">
	<div class={header}>
		<Icon>checklist</Icon>
		<h2>{taskList.title}</h2>
		<Icon>edit</Icon>
	</div>
	{#if taskList.description}
		<p>{taskList.description}</p>
	{/if}
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
						Completed ({$tasks.data.completed.length})
						<Icon>expand_less</Icon>
					</button>
					{#each $tasks.data.completed as task}
						<TaskItem {task} />
					{/each}
				{:else}
					<button class={divider} on:click={toggleShowCompleted}>
						Completed ({$tasks.data.completed.length})
						<Icon>expand_more</Icon>
					</button>
				{/if}
			{/if}
		</ul>
	{/if}
</section>
