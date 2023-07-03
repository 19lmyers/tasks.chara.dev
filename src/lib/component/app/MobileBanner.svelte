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
	import { Button, ButtonStyle, Card, Icon } from '$lib/component';
	import { mobileBannerDismissed } from '$lib/stores';

	import { aside, buttons, buttonsRight, description, title } from './MobileBanner.css';
	import { error } from '$lib/styles.css';
</script>

{#if !$mobileBannerDismissed}
	<aside class={aside}>
		<Card>
			<svelte:fragment slot="content">
				<h2 class={title}>
					<Icon>download</Icon>
					Download the app
				</h2>
				<p class={description}>Tasks (chara.dev) is also available as an iOS and Android app!</p>
				<p class={description}>
					Download the app now to access your tasks offline, receive reminder notifications, and
					unlock platform-exclusive customization features.
				</p>
				<p class="{description} {error}">
					NOTE: The mobile apps are currently in private beta. Store submission coming soon!
				</p>
			</svelte:fragment>
			<div class={buttons} slot="actions">
				<Button style={ButtonStyle.Text} onClick={() => mobileBannerDismissed.set(true)}
					>Dismiss</Button
				>
				<div class={buttonsRight}>
					<Button style={ButtonStyle.Tonal} href="#">Download for Android</Button>
					<Button style={ButtonStyle.Tonal} href="#">Download for iOS</Button>
				</div>
			</div>
		</Card>
	</aside>
{/if}
