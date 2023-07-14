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
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog, Icon, IconStyle } from '$lib/component';
	import type { Task } from '$lib/type';

	import { checkbox, details, edit, label, spacer, taskItem, text } from './TaskItem.css';

	export let task: Task;

	export let onEditClicked: (() => void) | null = null;

	const queryClient = useQueryClient();

	const updateTask = createMutation<undefined, Error, Task>({
		mutationFn: async (task: Task) => {
			await api().updateTask(task);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['tasks']);
		}
	});
</script>

{#if $updateTask.error}
	<Dialog dismiss={$updateTask.reset}>
		<Card>
			<svelte:fragment slot="content">
				<h1>An error occurred</h1>
				<p>{$updateTask.error.message}</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={$updateTask.reset}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

<li class={taskItem}>
	<input
		class={checkbox}
		type="checkbox"
		checked={task.isCompleted}
		on:click={(e) => {
			let editedTask = clone(task);
			editedTask.isCompleted = !editedTask.isCompleted;
			editedTask.lastModified = new Date();

			$updateTask.mutate(editedTask);

			e.preventDefault();
		}}
	/>
	<div class={text}>
		<p class={label}>{task.label}</p>
		{#if task.details}
			<p class={details}>{task.details}</p>
		{/if}
	</div>
	<span class={spacer} />
	<span class={edit}>
		<Button style={ButtonStyle.Icon} onClick={onEditClicked}>
			<Icon>edit</Icon>
		</Button>
	</span>
	<Button
		style={ButtonStyle.Icon}
		onClick={() => {
			let editedTask = clone(task);
			editedTask.isStarred = !editedTask.isStarred;
			editedTask.lastModified = new Date();

			$updateTask.mutate(editedTask);
		}}
	>
		{#if task.isStarred}
			<Icon>star</Icon>
		{:else}
			<Icon style={IconStyle.Outlined}>star</Icon>
		{/if}
	</Button>
</li>
