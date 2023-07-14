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

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, CenterLayout, Icon } from '$lib/component';

	import { error, navHeader } from '../styles.css';
	import { auth, isAuthenticated, profile } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let email: string | null = null;
	let displayName: string | null = null;
	let password: string | null = null;

	let isPending = false;

	let errorMessage: string | null = null;

	async function signup() {
		if (email && displayName && password) {
			errorMessage = null;
			isPending = true;

			try {
				const result = await api().createUser(email, displayName, password);
				if (result) {
					const tokens = await api().authenticateUser(email, password);
					auth.set(tokens);

					if (tokens) {
						const userProfile = await api().getUserProfile();
						profile.set(userProfile);

						isPending = false;

						await goto('/');
					}
				}
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					errorMessage = error.response.data;
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}

				password = '';

				isPending = false;
			}
		}
	}

	onMount(async () => {
		if (get(isAuthenticated)) {
			await goto('/');
		}
	});
</script>

<svelte:head>
	<title>Sign up</title>
</svelte:head>

<CenterLayout>
	<form on:submit|preventDefault={signup}>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={navHeader}>
					<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
						<Icon>arrow_back</Icon>
					</Button>
					<span>Sign up</span>
				</h1>
				{#if isPending}
					<progress />
				{/if}
				<label>
					Email
					<input
						name="email"
						type="email"
						bind:value={email}
						autocomplete="email"
						disabled={isPending}
						required
					/>
				</label>
				<label>
					Display Name
					<input
						name="display-name"
						type="text"
						bind:value={displayName}
						autocomplete="name"
						disabled={isPending}
						required
					/>
				</label>
				<label>
					Password
					<input
						name="password"
						type="password"
						bind:value={password}
						autocomplete="new-password"
						disabled={isPending}
						required
					/>
				</label>
				{#if errorMessage}
					<p class={error}>{errorMessage}</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Tonal} type="submit" disabled={isPending}>Sign up</Button>
			</svelte:fragment>
		</Card>
	</form>
</CenterLayout>
