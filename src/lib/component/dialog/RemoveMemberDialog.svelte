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
	import { createMutation } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog } from '$lib/component';

	import { actions, header } from './base.css';
	import type { Profile } from '$lib/type';

	export let listId: string | null = null;
	export let profile: Profile | null = null;

	function cancel() {
		profile = null;
	}

	const removeMember = createMutation<boolean, Error, string>({
		mutationFn: async (memberId: string) => {
			return await api().removeMemberFromList(listId!, memberId);
		}
	});

	async function confirm() {
		if (listId && profile) {
			$removeMember.mutate(profile?.id);
		}
	}
</script>

{#if $removeMember.error}
	<Dialog dismiss={$removeMember.reset}>
		<Card>
			<svelte:fragment slot="content">
				<h1>An error occurred</h1>
				<p>{$removeMember.error.message}</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={$removeMember.reset}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

{#if listId && profile}
	<Dialog dismiss={cancel}>
		<form on:submit|preventDefault={confirm}>
			<Card>
				<svelte:fragment slot="content">
					<h1 class={header}>Remove {profile?.displayName}?</h1>
					{#if $removeMember.isPending}
						<progress />
					{/if}
				</svelte:fragment>
				<div slot="actions" class={actions}>
					<Button style={ButtonStyle.Text} onClick={cancel} disabled={$removeMember.isPending}>
						Cancel
					</Button>
					<Button style={ButtonStyle.Tonal} type="submit" disabled={$removeMember.isPending}>
						Delete
					</Button>
				</div>
			</Card>
		</form>
	</Dialog>
{/if}
