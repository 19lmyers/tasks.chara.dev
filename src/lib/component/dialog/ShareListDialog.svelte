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
	import { createMutation, createQuery } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog, Icon, IconStyle, ProfileItem } from '$lib/component';
	import { themeFromListColor } from '$lib/theme';
	import type { Profile, TaskList } from '$lib/type';

	import { actions, copyLink, header } from './base.css';
	import { profile, themeVariant } from '$lib/stores';
	import RemoveMemberDialog from '$lib/component/dialog/RemoveMemberDialog.svelte';
	import { clone } from 'lodash';

	export let taskList: TaskList;

	export let onDismiss: () => void;

	interface ListDetails {
		owner: Profile;
		members: Profile[];
	}

	const members = createQuery<ListDetails, Error, ListDetails>({
		queryKey: ['listMembers', { listId: taskList.id }],
		queryFn: async () => {
			const owner = await api().getUserProfileFor(taskList.ownerId);
			const members = await api().getListMembers(taskList.id);
			return {
				owner: owner,
				members: members
			};
		}
	});

	const getInviteToken = createMutation<string, Error, void>({
		mutationFn: async () => {
			return await api().requestListInvite(taskList.id);
		}
	});

	let inviteBtn: HTMLButtonElement;

	let memberToRemove: Profile | null = null;
</script>

{#if memberToRemove}
	<div style={themeFromListColor(taskList.color, $themeVariant)}>
		<RemoveMemberDialog listId={taskList.id} profile={memberToRemove} />
	</div>
{/if}

<Dialog style={themeFromListColor(taskList.color, $themeVariant)} dismiss={onDismiss}>
	<form on:submit|preventDefault>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={header}>Share list</h1>
				{#if $members.status === 'pending'}
					<progress />
				{:else if $members.status === 'error'}
					<span>Error: {$members.error.message}</span>
				{:else}
					<ProfileItem profile={$members.data.owner}>Owner</ProfileItem>
					{#each $members.data.members as member}
						<ProfileItem profile={member}>
							{#if taskList.ownerId === $profile?.id}
								<Button
									style={ButtonStyle.Icon}
									onClick={() => {
										memberToRemove = clone(member);
									}}
								>
									<Icon>close</Icon>
								</Button>
							{/if}
						</ProfileItem>
					{/each}
					{#if $getInviteToken.data}
						<button
							type="button"
							class={copyLink}
							bind:this={inviteBtn}
							on:click={async () => {
								inviteBtn.focus();
								await navigator.clipboard.writeText(
									`I've shared a list with you! Join at: https://tasks.chara.dev/join?token=${$getInviteToken.data}`
								);
								window.alert('Link copied to clipboard');
								onDismiss();
							}}
						>
							<Icon style={IconStyle.Outlined}>content_copy</Icon>
							I've shared a list with you! Join at: https://tasks.chara.dev/join?token={$getInviteToken.data}
						</button>
					{/if}
				{/if}
			</svelte:fragment>
			<div slot="actions" class={actions}>
				<Button style={ButtonStyle.Text} onClick={onDismiss}>Cancel</Button>
				<Button
					style={ButtonStyle.Tonal}
					onClick={() => {
						$getInviteToken.mutate();
					}}
					disabled={$getInviteToken.data !== undefined}
				>
					Share
				</Button>
			</div>
		</Card>
	</form>
</Dialog>
