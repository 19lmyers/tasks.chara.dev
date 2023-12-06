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
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	import { clone } from 'lodash';

	import { api } from '$lib/api';
	import {
		Button,
		ButtonStyle,
		Card,
		CenterLayout,
		Dialog,
		Icon,
		ProfileItem
	} from '$lib/component';
	import { isAuthenticated, profile, themeVariant } from '$lib/stores';
	import { themeFromVariant } from '$lib/theme';
	import type { Profile } from '$lib/type';

	import { error, navHeader } from '../styles.css';
	import { headline, listItem, supporting } from './styles.css';
	import { header } from '$lib/component/dialog/base.css';

	let profileToEdit: Profile | null = null;
	profileToEdit = clone($profile);

	let isPending = false;

	let errorMessage: string | null = null;

	onMount(async () => {
		if (!get(isAuthenticated)) {
			await goto('/');
		}
	});

	let profilePhotoInput: HTMLInputElement | null = null;
	let profilePhotoFiles: FileList | null = null;

	let photoUploadSuccess = false;

	$: if (profilePhotoFiles) {
		uploadProfilePhoto(profilePhotoFiles[0]);
		profilePhotoFiles = null;
	}

	async function uploadProfilePhoto(file: File) {
		isPending = true;

		try {
			const result = await api().uploadProfilePhoto(file);
			if (result) {
				const userProfile = await api().getUserProfile();
				profile.set(userProfile);
				profileToEdit = clone(userProfile);

				isPending = false;
				photoUploadSuccess = true;
			}
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}

			isPending = false;
		}
	}

	async function removeProfilePhoto() {
		if (profileToEdit) {
			profileToEdit.profilePhotoUri = undefined;
			photoUploadSuccess = await save();
		}
	}

	async function save() {
		if (profileToEdit?.displayName) {
			isPending = true;

			try {
				const result = await api().updateUserProfile(profileToEdit);
				if (result) {
					const userProfile = await api().getUserProfile();
					profile.set(userProfile);

					isPending = false;
					return true;
				}
			} catch (error) {
				if (error instanceof Error) {
					errorMessage = error.message;
				}

				isPending = false;
				return false;
			}
		}
		return false;
	}
</script>

<svelte:head>
	<title>Edit profile</title>
</svelte:head>

<input
	type="file"
	bind:this={profilePhotoInput}
	bind:files={profilePhotoFiles}
	accept="image/*"
	style="display:none"
/>

{#if photoUploadSuccess}
	<Dialog style={themeFromVariant($themeVariant)}>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={header}>Profile photo changed</h1>
				<p>Changes may require a refresh to take effect.</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={() => (photoUploadSuccess = false)}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

<CenterLayout>
	<form on:submit|preventDefault={save}>
		<Card>
			<svelte:fragment slot="content">
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
						<input type="text" bind:value={profileToEdit.displayName} />
					</label>
					{#if profileToEdit.profilePhotoUri}
						<Button
							style={ButtonStyle.Text}
							onClick={() => profilePhotoInput?.click()}
							disabled={isPending}
						>
							<Icon>add_circle</Icon>
							Change profile picture
						</Button>
						<Button style={ButtonStyle.Text} onClick={removeProfilePhoto} disabled={isPending}>
							<Icon>remove_circle</Icon>
							Remove profile picture
						</Button>
					{:else}
						<Button
							style={ButtonStyle.Text}
							onClick={() => profilePhotoInput?.click()}
							disabled={isPending}
						>
							<Icon>add_circle</Icon>
							Add profile picture
						</Button>
					{/if}
					<Button
						style={ButtonStyle.Text}
						href={profileToEdit.emailVerified ? '/profile/email' : null}
						disabled={!profileToEdit.emailVerified}
					>
						<Icon>alternate_email</Icon>
						<div class={listItem}>
							<p class={headline}>{profileToEdit.email}</p>
							{#if profileToEdit.emailVerified}
								<p class={supporting}>Tap to change</p>
							{:else}
								<p class={supporting}>Unverified</p>
							{/if}
						</div>
					</Button>
					{#if profileToEdit.emailVerified}
						<Button style={ButtonStyle.Text} href="/profile/password" disabled={isPending}>
							<Icon>password</Icon>
							Change password
						</Button>
					{/if}
				{/if}
				{#if errorMessage}
					<p class={error}>{errorMessage}</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button
					style={ButtonStyle.Filled}
					type="submit"
					disabled={isPending ||
						!profileToEdit ||
						profileToEdit.displayName.trim().length === 0 ||
						profileToEdit.displayName.localeCompare($profile?.displayName ?? '') === 0}
					>Save
				</Button>
			</svelte:fragment>
		</Card>
	</form>
</CenterLayout>
