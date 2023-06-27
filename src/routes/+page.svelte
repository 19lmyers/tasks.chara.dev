<script lang='ts'>
	import { createQuery } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, CenterLayout, Header, TaskListItem } from '$lib/component';
	import { isAuthenticated } from '$lib/stores';
	import type { TaskList } from '$lib/type';

	import { error, main, navHeader } from '$lib/styles.css';

	const taskLists = createQuery<TaskList[], Error>({
		queryKey: ['lists'],
		queryFn: async () => api().getLists()
	});
</script>

<svelte:head>
	<title>Tasks (chara.dev)</title>
</svelte:head>

{#if $isAuthenticated}
	<Header />
	<main class={main}>
		{#if $taskLists.status === 'loading'}
			<progress />
		{:else if $taskLists.status === 'error'}
			<span>Error: {$taskLists.error.message}</span>
		{:else}
			{#each $taskLists.data as taskList}
				<TaskListItem {taskList} />
			{/each}
		{/if}
	</main>
{:else}
	<CenterLayout>
		<Card>
			<svelte:fragment slot='content'>
				<h1 class={navHeader}>Welcome to Tasks</h1>
				<p>TODO onboarding goes here</p>
				<p class={error}>
					NOTE: Tasks for web is currently in alpha. Expect major changes in this space.
				</p>
			</svelte:fragment>
			<svelte:fragment slot='actions'>
				<Button style={ButtonStyle.Text} href='./login'>Sign in</Button>
				<Button style={ButtonStyle.Tonal} href='./register'>Sign up</Button>
			</svelte:fragment>
		</Card>
	</CenterLayout>
{/if}
