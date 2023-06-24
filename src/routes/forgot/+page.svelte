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
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, CenterLayout, Dialog, Icon } from '$lib/component';

	import { error, navHeader } from '$lib/styles.css';
	import { isAuthenticated } from '$lib/stores';

	let email: string | null = null;

	let isPending = false;
	let isSuccess = false;

	let errorMessage: string | null = null;

	async function forgot() {
		if (email) {
			isPending = true;

			try {
				const result = await api().requestPasswordResetEmail(email);
				if (result) {
					isSuccess = true;
					isPending = false;
				}
			} catch (error) {
				if (isAxiosError(error) && error.response) {
					errorMessage = error.response.data;
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}

				email = '';

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

{#if isSuccess}
	<Dialog>
		<Card>
			<svelte:fragment slot="content">
				<h1>Password reset email sent</h1>
				<p>An email with a password reset link should be arriving shortly.</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={() => history.back()}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

<CenterLayout>
	<form on:submit|preventDefault={forgot}>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={navHeader}>
					<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
						<Icon>arrow_back</Icon>
					</Button>
					<span>Forgot password?</span>
				</h1>
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
				{#if errorMessage}
					<p class={error}>{errorMessage}</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Tonal} type="submit" disabled={isPending}>Confirm</Button>
			</svelte:fragment>
		</Card>
	</form>
</CenterLayout>
