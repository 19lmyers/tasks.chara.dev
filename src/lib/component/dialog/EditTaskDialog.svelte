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
	import { Button, ButtonStyle, Card, Dialog } from '$lib/component';
	import type { Task } from '$lib/type';

	export let task: Task | null = null;

	function cancel() {
		task = null;
	}

	const queryClient = useQueryClient();

	const updateTask = createMutation<string, Error, Task>({
		mutationFn: async (task: Task) => {
			await api().updateTask(task);
			return task.listId;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries(['lists']);
			queryClient.invalidateQueries(['tasks', listId]);
		}
	});

	function save() {
		if (task) {
			task.lastModified = new Date();

			$updateTask.mutate(task);

			task = null;
		}
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
	<Dialog dismiss={() => (task = null)}>
		<form on:submit|preventDefault={save}>
			<Card>
				<svelte:fragment slot="content">
					<h1>Edit task</h1>
					{#if $updateTask.isLoading}
						<progress />
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="actions">
					<Button style={ButtonStyle.Text} onClick={cancel} disabled={$updateTask.isLoading}
						>Cancel</Button
					>
					<Button style={ButtonStyle.Tonal} type="submit" disabled={$updateTask.isLoading}
						>Save</Button
					>
				</svelte:fragment>
			</Card>
		</form>
	</Dialog>
{/if}
