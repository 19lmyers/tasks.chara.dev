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
	import dayjs from 'dayjs';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog, Icon, IconStyle } from '$lib/component';
	import type { Task } from '$lib/type';

	import {
		checkbox,
		chip,
		chips,
		details,
		hoverAction,
		label,
		ordinal,
		spacer,
		taskContainer,
		taskContents,
		taskItem,
		text
	} from './TaskItem.css';
	import { error } from '../../../routes/styles.css';

	export let task: Task;

	export let onEditClicked: (() => void) | null = null;
	export let onDeleteClicked: (() => void) | null = null;

	export let indexNumber: number | null = null;

	export let showPersistentActions = false;

	const queryClient = useQueryClient();

	const updateTask = createMutation<undefined, Error, Task>({
		mutationFn: async (task: Task) => {
			await api().updateTask(task);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['tasks']);
		}
	});

	$: isReminderDatePassed = dayjs(task.reminderDate ?? dayjs()).isBefore(dayjs());
	$: isDueDatePassed = dayjs(task.dueDate ?? dayjs()).isBefore(dayjs().startOf('day'));
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

<li class={taskContainer}>
	{#if indexNumber}
		<p class={ordinal}>{indexNumber}</p>
	{/if}

	<div class={taskItem}>
		<div class={taskContents}>
			<Button
				style={ButtonStyle.Icon}
				onClick={() => {
					let editedTask = clone(task);
					editedTask.isCompleted = !editedTask.isCompleted;
					editedTask.lastModified = new Date();

					$updateTask.mutate(editedTask);
				}}
			>
				{#if task.isCompleted}
					<Icon>check_box</Icon>
				{:else}
					<Icon style={IconStyle.Outlined}>check_box_outline_blank</Icon>
				{/if}
			</Button>
			<div class={text}>
				<p class={label}>{task.label}</p>
				{#if task.details}
					<p class={details}>{task.details}</p>
				{/if}
			</div>
			<span class={spacer} />
			{#if showPersistentActions}
				<Button style={ButtonStyle.Icon} onClick={onEditClicked}>
					<Icon>edit</Icon>
				</Button>
				<Button style={ButtonStyle.Icon} onClick={onDeleteClicked}>
					<Icon>delete</Icon>
				</Button>
			{:else}
				<span class={hoverAction}>
					<Button style={ButtonStyle.Icon} onClick={onEditClicked}>
						<Icon>edit</Icon>
					</Button>
				</span>
			{/if}
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
		</div>
		<div class={chips}>
			{#if task.reminderDate}
				{#if isReminderDatePassed}
					<p class="{chip} {error}">
						<Icon>notifications</Icon>
						{dayjs(task.reminderDate).format('ddd, MMM DD, YYYY, h:mm A')}
					</p>
				{:else}
					<p class={chip}>
						<Icon>notifications</Icon>
						{dayjs(task.reminderDate).format('ddd, MMM DD, YYYY, h:mm A')}
					</p>
				{/if}
			{/if}
			{#if task.dueDate}
				{#if isDueDatePassed}
					<p class="{chip} {error}">
						<Icon>event</Icon>
						{dayjs(task.dueDate).format('ddd, MMM DD, YYYY')}
					</p>
				{:else}
					<p class={chip}>
						<Icon>event</Icon>
						{dayjs(task.dueDate).format('ddd, MMM DD, YYYY')}
					</p>
				{/if}
			{/if}
		</div>
	</div>
</li>
