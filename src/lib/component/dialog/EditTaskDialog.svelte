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
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import dayjs from 'dayjs';

	import utc from 'dayjs/plugin/utc';

	dayjs.extend(utc);

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog } from '$lib/component';
	import { themeFromListColor } from '$lib/theme';
	import type { Task, TaskList } from '$lib/type';

	import { actions, header } from './EditTaskDialog.css';

	export let task: Task | null = null;

	let reminderDate: string | null = null;
	let dueDate: string | null = null;

	const taskLists = createQuery<TaskList[], Error>({
		queryKey: ['lists'],
		queryFn: async () => api().getLists()
	});

	$: taskList = ($taskLists.data as TaskList[]).find((list) => list.id === task?.listId);

	export let mode: 'create' | 'edit' = 'edit';

	function cancel() {
		task = null;

		reminderDate = null;
		dueDate = null;
	}

	const queryClient = useQueryClient();

	const updateTask = createMutation<string, Error, Task>({
		mutationFn: async (task: Task) => {
			if (mode === 'create') {
				await api().createTask(task);
			} else {
				await api().updateTask(task);
			}
			return task.listId;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries(['lists']);
			queryClient.invalidateQueries(['tasks', { listId: listId }]);
		}
	});

	function save() {
		if (task) {
			if (!task.dateCreated) {
				task.dateCreated = new Date();
			}
			task.lastModified = new Date();

			if (reminderDate) {
				task.reminderDate = dayjs(reminderDate).utc().toDate();
			} else {
				task.reminderDate = undefined;
			}

			if (dueDate) {
				task.dueDate = dayjs(dueDate).utc().toDate();
			} else {
				task.dueDate = undefined;
			}

			$updateTask.mutate(task);

			task = null;

			reminderDate = null;
			dueDate = null;
		}
	}

	function minDate() {
		return dayjs().add(1, 'day').format('YYYY-MM-DD');
	}

	function minDateTime() {
		return dayjs().format('YYYY-MM-DDTHH:mm');
	}
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

{#if task}
	<Dialog className={themeFromListColor(taskList?.color)} dismiss={cancel}>
		<form on:submit|preventDefault={save}>
			<Card>
				<svelte:fragment slot="content">
					<h1 class={header}>
						{#if mode === 'create'}
							New task
						{:else}
							Edit task
						{/if}
					</h1>
					{#if $updateTask.isLoading}
						<progress />
					{/if}
					<label>
						Label
						<input
							name="label"
							type="text"
							bind:value={task.label}
							disabled={$updateTask.isLoading}
							required
						/>
					</label>
					<label>
						List
						<select name="taskList" bind:value={task.listId}>
							{#if $taskLists.isSuccess}
								{#each $taskLists.data as list}
									<option value={list.id}>
										{list.title}
									</option>
								{/each}
							{/if}
						</select>
					</label>
					<label>
						Remind me
						<input type="datetime-local" bind:value={reminderDate} min={minDateTime()} />
					</label>
					<label>
						Set due date
						<input type="date" bind:value={dueDate} min={minDate()} />
					</label>
				</svelte:fragment>
				<div slot="actions" class={actions}>
					<Button style={ButtonStyle.Text} onClick={cancel} disabled={$updateTask.isLoading}
						>Cancel
					</Button>
					<Button
						style={ButtonStyle.Tonal}
						type="submit"
						disabled={$updateTask.isLoading ||
							task.label === undefined ||
							task.label.trim().length === 0}
						>Save
					</Button>
				</div>
			</Card>
		</form>
	</Dialog>
{/if}
