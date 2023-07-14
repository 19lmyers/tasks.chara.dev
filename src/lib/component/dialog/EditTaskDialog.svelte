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

	export let task: Task | null;

	export let oldListId: string | null = null;

	export let mode: 'create' | 'edit' = 'edit';

	const taskLists = createQuery<TaskList[], Error, TaskList[]>({
		queryKey: ['lists'],
		queryFn: async () => api().getLists()
	});

	let currentListId = '';

	const currentList = createQuery<TaskList, Error, TaskList>({
		queryKey: ['lists', { listId: currentListId }],
		queryFn: async () => api().getList(currentListId),
		enabled: false
	});

	$: {
		if (task) {
			currentListId = task.listId;
			$currentList.refetch({ throwOnError: true });
		}
	}

	function cancel() {
		task = null;
	}

	const queryClient = useQueryClient();

	const updateTask = createMutation<undefined, Error, Task>({
		mutationFn: async (task: Task) => {
			if (mode === 'create') {
				await api().createTask(task);
			} else if (oldListId && oldListId != task.listId) {
				await api().moveTask(oldListId, task.listId, task.id, new Date());
				await api().updateTask(task);
			} else {
				await api().updateTask(task);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['lists']);
			queryClient.invalidateQueries(['tasks']);
		}
	});

	function save() {
		if (task) {
			if (!task.dateCreated) {
				task.dateCreated = new Date();
			}
			task.lastModified = new Date();

			$updateTask.mutate(task);

			task = null;
		}
	}

	function dateFromString(date?: string) {
		if (date) {
			return dayjs(date).utc().toDate();
		} else {
			return undefined;
		}
	}

	function dateToString(format: string, date?: Date) {
		if (date) {
			return dayjs(date).format(format);
		} else {
			return undefined;
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

{#if task && $currentList.isSuccess}
	<Dialog className={themeFromListColor($currentList.data.color)} dismiss={cancel}>
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
						<input
							type="datetime-local"
							value={dateToString('YYYY-MM-DDTHH:mm', task.reminderDate)}
							on:input={(event) => {
								if (task) {
									return (task.reminderDate = dateFromString(event.currentTarget.value));
								}
							}}
							min={minDateTime()}
						/>
					</label>
					<label>
						Set due date
						<input
							type="date"
							value={dateToString('YYYY-MM-DD', task.dueDate)}
							on:input={(event) => {
								if (task) {
									return (task.dueDate = dateFromString(event.currentTarget.value));
								}
							}}
							min={minDate()}
						/>
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
