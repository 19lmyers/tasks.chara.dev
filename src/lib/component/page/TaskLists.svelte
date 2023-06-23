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
	import { createQuery } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, TaskListItem } from '$lib/component';
	import { auth, profile } from '$lib/stores';
	import type { TaskList } from '$lib/type';

	import { progress, main, header } from './TaskLists.css';

	const taskLists = createQuery<TaskList[], Error>({
		queryKey: ['lists'],
		queryFn: async () => api().getLists()
	});

	function logout() {
		profile.set(null);
		auth.set(null);
	}
</script>

<header class={header}>
	<h1>Tasks</h1>
	{#if $profile}
		<h2>Welcome, {$profile.displayName}</h2>
	{/if}
</header>
<Button onClick={logout}>Sign out</Button>
<main class={main}>
	{#if $taskLists.status === 'loading'}
		<progress class={progress}></progress>
	{:else if $taskLists.status === 'error'}
		<span>Error: {$taskLists.error.message}</span>
	{:else}
		{#each $taskLists.data as taskList}
			<TaskListItem {taskList} />
		{/each}
	{/if}
</main>
