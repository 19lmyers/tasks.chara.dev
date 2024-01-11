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
	import type { Profile, TaskList } from '$lib/type';

	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	import { api } from '$lib/api';
	import {
		Button,
		ButtonStyle,
		Card,
		CenterLayout,
		Dialog,
		Icon,
		PageTitle,
		ProfileItem
	} from '$lib/component';
	import { isAuthenticated } from '$lib/stores';

	import { error, navHeader } from '../styles.css';
	import { page } from '$app/stores';
	import { listCard, listDescription, listIcon, listText } from './styles.css';
	import { createQuery } from '@tanstack/svelte-query';
	import { iconFromListIcon } from '$lib/util';

	const inviteToken = $page.url.searchParams.get('token') ?? '';

	let isPending = false;
	let isSuccess = false;

	let errorMessage: string | null = null;

	interface JoinInfoResult {
		list: TaskList;
		owner: Profile;
	}

	const joinInfoQuery = createQuery<JoinInfoResult, Error, JoinInfoResult>({
		queryKey: ['join', { inviteToken: inviteToken }],
		queryFn: async () => {
			const list = await api().getListInviteInfo(inviteToken);
			const owner = await api().getUserProfileFor(list.ownerId);
			return {
				list: list,
				owner: owner
			};
		}
	});

	async function join() {
		if (inviteToken) {
			isPending = true;
			try {
				const result = await api().requestListJoin(inviteToken);
				if (result) {
					isSuccess = true;
					isPending = false;
				}
			} catch (error) {
				if (error instanceof Error) {
					errorMessage = error.message;
				}

				isPending = false;
			}
		}
	}

	onMount(async () => {
		if (!get(isAuthenticated)) {
			await goto('/');
		}
	});
</script>

<svelte:head>
	<title>Join list</title>
</svelte:head>

{#if isSuccess}
	<Dialog>
		<Card>
			<svelte:fragment slot="content">
				<h1>List joined</h1>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={() => goto('/')}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

{#if $joinInfoQuery.status === 'pending'}
	<progress />
{:else if $joinInfoQuery.status === 'error'}
	<PageTitle title="Not Found" />
	<CenterLayout>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={navHeader}>
					<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
						<Icon>arrow_back</Icon>
					</Button>
					<span>Not Found</span>
				</h1>
				<p>List invite invalid or expired</p>
			</svelte:fragment>
		</Card>
	</CenterLayout>
{:else}
	<CenterLayout>
		<form on:submit|preventDefault={join}>
			<Card>
				<svelte:fragment slot="content">
					<h1 class={navHeader}>
						<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
							<Icon>arrow_back</Icon>
						</Button>
						<span>Join list</span>
					</h1>
					{#if isPending}
						<progress />
					{/if}

					<div class={listCard}>
						<Icon className={listIcon}>{iconFromListIcon($joinInfoQuery.data.list.icon)}</Icon>
						<div class={listText}>
							<p>{$joinInfoQuery.data.list.title}</p>
							{#if $joinInfoQuery.data.list.description}
								<p class={listDescription}>{$joinInfoQuery.data.list.description}</p>
							{/if}
						</div>

						<ProfileItem profile={$joinInfoQuery.data.owner} />
					</div>

					{#if errorMessage}
						<p class={error}>{errorMessage}</p>
					{/if}
				</svelte:fragment>
				<svelte:fragment slot="actions">
					<span />
					<Button style={ButtonStyle.Tonal} type="submit" disabled={isPending}>Join</Button>
				</svelte:fragment>
			</Card>
		</form>
	</CenterLayout>
{/if}
