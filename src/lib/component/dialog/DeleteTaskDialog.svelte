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
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog, Icon } from '$lib/component';
	import type { Task } from '$lib/type';

	import { actions, header, icon } from './base.css';

	export let task: Task | null = null;

	function cancel() {
		task = null;
	}

	const queryClient = useQueryClient();

	interface DeleteTaskArgs {
		listId: string;
		taskId: string;
	}

	const deleteTask = createMutation<string, Error, DeleteTaskArgs>({
		mutationFn: async (args: DeleteTaskArgs) => {
			await api().deleteTask(args.listId, args.taskId);
			return args.listId;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries(['tasks', { listId: listId }]);
		}
	});

	async function confirm() {
		if (task) {
			$deleteTask.mutate({
				listId: task.listId,
				taskId: task.id
			});

			task = null;
		}
	}
</script>

{#if $deleteTask.error}
	<Dialog dismiss={$deleteTask.reset}>
		<Card>
			<svelte:fragment slot="content">
				<h1>An error occurred</h1>
				<p>{$deleteTask.error.message}</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={$deleteTask.reset}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

{#if task}
	<Dialog dismiss={cancel}>
		<form on:submit|preventDefault={confirm}>
			<Card>
				<svelte:fragment slot="content">
					<h1 class={header}>
						<Icon className={icon}>delete</Icon>
						Delete task?
					</h1>
					<p>This task will be permanently deleted</p>
					{#if $deleteTask.isLoading}
						<progress />
					{/if}
				</svelte:fragment>
				<div slot="actions" class={actions}>
					<Button style={ButtonStyle.Text} onClick={cancel} disabled={$deleteTask.isLoading}>
						Cancel
					</Button>
					<Button style={ButtonStyle.Tonal} type="submit" disabled={$deleteTask.isLoading}>
						Delete
					</Button>
				</div>
			</Card>
		</form>
	</Dialog>
{/if}
