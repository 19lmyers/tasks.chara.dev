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
	import { goto } from '$app/navigation';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog, Icon } from '$lib/component';

	import { actions, header, icon } from './base.css';

	export let listId: string | null = null;

	function cancel() {
		listId = null;
	}

	const queryClient = useQueryClient();

	const deleteList = createMutation<string, Error, string>({
		mutationFn: async (listId: string) => {
			await api().deleteList(listId);
			return listId;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries(['lists']);
			queryClient.invalidateQueries(['tasks', { listId: listId }]);
		}
	});

	async function confirm() {
		if (listId) {
			$deleteList.mutate(listId);

			listId = null;

			await goto('/');
		}
	}
</script>

{#if $deleteList.error}
	<Dialog dismiss={$deleteList.reset}>
		<Card>
			<svelte:fragment slot="content">
				<h1>An error occurred</h1>
				<p>{$deleteList.error.message}</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={$deleteList.reset}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

{#if listId}
	<Dialog dismiss={cancel}>
		<form on:submit|preventDefault={confirm}>
			<Card>
				<svelte:fragment slot="content">
					<h1 class={header}>
						<Icon className={icon}>delete</Icon>
						Delete list?
					</h1>
					<p>All tasks in this list will be permanently deleted</p>
					{#if $deleteList.isLoading}
						<progress />
					{/if}
				</svelte:fragment>
				<div slot="actions" class={actions}>
					<Button style={ButtonStyle.Text} onClick={cancel} disabled={$deleteList.isLoading}>
						Cancel
					</Button>
					<Button style={ButtonStyle.Tonal} type="submit" disabled={$deleteList.isLoading}>
						Delete
					</Button>
				</div>
			</Card>
		</form>
	</Dialog>
{/if}
