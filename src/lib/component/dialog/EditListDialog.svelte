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
	import { isAxiosError } from 'axios';
	import { useQueryClient } from '@tanstack/svelte-query';

	import { Button, ButtonStyle, Card, Dialog } from '$lib/component';
	import type { TaskList } from '$lib/type';
	import { api } from '$lib/api';
	import { themeFromListColor } from '$lib/theme';

	const queryClient = useQueryClient();

	export let taskList: TaskList | null = null;

	let isPending = false;

	let errorMessage: string | null = null;

	function cancel() {
		taskList = null;
	}

	async function save() {
		if (taskList) {
			try {
				isPending = true;

				const result = await api().updateList(taskList);
				if (result) {
					queryClient.setQueryData(['lists'], (cachedLists: TaskList[] | undefined) => {
						if (cachedLists) {
							return cachedLists.map((cachedList: TaskList) => {
								if (cachedList.id === taskList?.id) {
									return taskList;
								} else {
									return cachedList;
								}
							});
						}
					});

					isPending = false;
					taskList = null;
				}
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					errorMessage = error.response.data;
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}

				isPending = false;
			}
		}
	}
</script>

{#if errorMessage}
	<Dialog>
		<Card>
			<svelte:fragment slot="content">
				<h1>An error occurred</h1>
				<p>{errorMessage}</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={() => (errorMessage = null)}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

{#if taskList}
	<Dialog className={themeFromListColor(taskList.color)}>
		<form on:submit|preventDefault={save}>
			<Card>
				<svelte:fragment slot="content">
					<h1>Edit list</h1>
					{#if isPending}
						<progress />
					{/if}
					<label>
						Title
						<input
							name="title"
							type="text"
							bind:value={taskList.title}
							disabled={isPending}
							required
						/>
					</label>
					<!-- TODO icon, color -->
					<label>
						Description
						<textarea name="description" bind:value={taskList.description} disabled={isPending} />
					</label>
					<label>
						Pin to dashboard
						<input
							name="pin-to-dashboard"
							type="checkbox"
							bind:checked={taskList.isPinned}
							disabled={isPending}
						/>
					</label>
					<label>
						Show list numbers
						<input
							name="show-list-numbers"
							type="checkbox"
							bind:checked={taskList.showIndexNumbers}
							disabled={isPending}
						/>
					</label>
				</svelte:fragment>
				<svelte:fragment slot="actions">
					<Button style={ButtonStyle.Text} onClick={cancel} disabled={isPending}>Cancel</Button>
					<Button style={ButtonStyle.Tonal} type="submit" disabled={isPending}>Save</Button>
				</svelte:fragment>
			</Card>
		</form>
	</Dialog>
{/if}
