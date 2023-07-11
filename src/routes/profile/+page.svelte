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

<script lang='ts'>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	import { isAxiosError } from 'axios';
	import { clone } from 'lodash';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, CenterLayout, Icon, ProfileItem } from '$lib/component';
	import { isAuthenticated, profile } from '$lib/stores';
	import type { Profile } from '$lib/type';

	import { error, navHeader } from '$lib/styles.css';

	let profileToEdit: Profile | null = null;
	profileToEdit = clone($profile);

	let isPending = false;

	let errorMessage: string | null = null;

	onMount(async () => {
		if (!get(isAuthenticated)) {
			await goto('/');
		}
	});

	async function save() {
		if (profileToEdit?.displayName) {
			isPending = true;

			try {
				const result = await api().updateUserProfile(profileToEdit);
				if (result) {
					const userProfile = await api().getUserProfile();
					profile.set(userProfile);

					isPending = false;
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

<svelte:head>
	<title>Profile</title>
</svelte:head>

<CenterLayout>
	<form on:submit|preventDefault={save}>
		<Card>
			<svelte:fragment slot='content'>
				<h1 class={navHeader}>
					<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
						<Icon>close</Icon>
					</Button>
					<span>Edit profile</span>
				</h1>
				{#if profileToEdit}
					<ProfileItem profile={profileToEdit} />
					<label>
						Display Name
						<input type='text' bind:value={profileToEdit.displayName} />
					</label>
				{/if}
				{#if errorMessage}
					<p class={error}>{errorMessage}</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot='actions'>
				<span />
				<Button
					style={ButtonStyle.Filled}
					type='submit'
					disabled={isPending || !profileToEdit ||
						profileToEdit.displayName.trim().length === 0 ||
						profileToEdit.displayName.localeCompare($profile?.displayName ?? '') === 0}
				>Save
				</Button>
			</svelte:fragment>
		</Card>
	</form>
</CenterLayout>
