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

	import { Button, ButtonStyle, Card, CenterLayout, Icon } from '$lib/component';
	import { isAuthenticated, themeVariant } from '$lib/stores';

	import { navHeader } from '../styles.css';
	import { ThemeVariant } from '$lib/type';
	import { labelFromThemeVariant } from '$lib/util';

	onMount(async () => {
		if (!get(isAuthenticated)) {
			await goto('/');
		}
	});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<CenterLayout>
	<Card>
		<svelte:fragment slot="content">
			<h1 class={navHeader}>
				<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
					<Icon>arrow_back</Icon>
				</Button>
				<span>Settings</span>
			</h1>
			<label>
				Color scheme
				<select name="themeVariant" bind:value={$themeVariant}>
					{#each Object.values(ThemeVariant) as variant}
						<option value={variant}>
							{labelFromThemeVariant(variant)}
						</option>
					{/each}
				</select>
			</label>
		</svelte:fragment>
	</Card>
</CenterLayout>
