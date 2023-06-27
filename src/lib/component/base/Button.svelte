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
	import { ButtonStyle } from './types';
	import { elevated, filled, icon, outlined, text, tonal } from './Button.css';

	export let style: ButtonStyle = ButtonStyle.Filled;

	export let type: 'button' | 'reset' | 'submit' | null | undefined = 'button';

	export let href: string | null = null;

	export let disabled = false;
	export let onClick: ((e: Event) => void) | null = null;

	let styleClass: string;
	if (style === ButtonStyle.Filled) {
		styleClass = filled;
	} else if (style === ButtonStyle.Outlined) {
		styleClass = outlined;
	} else if (style === ButtonStyle.Tonal) {
		styleClass = tonal;
	} else if (style === ButtonStyle.Text) {
		styleClass = text;
	} else if (style === ButtonStyle.Icon) {
		styleClass = icon;
	} else {
		styleClass = elevated;
	}
</script>

{#if href}
	<a class={styleClass} {href}>
		<slot />
	</a>
{:else}
	<button on:click={onClick} {type} class={styleClass} {disabled}>
		<slot />
	</button>
{/if}
