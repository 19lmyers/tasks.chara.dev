<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { MasonryLayout } from 'svelte-masonry-layout';

	import { api } from '$lib/api';
	import {
		Button,
		ButtonStyle,
		Card,
		CenterLayout,
		EditListDialog,
		Header,
		Icon,
		MobileBanner,
		TaskListItem
	} from '$lib/component';
	import { isAuthenticated } from '$lib/stores';
	import type { TaskList } from '$lib/type';

	import { error, main, navHeader } from '$lib/styles.css';
	import { SortDirection, SortType } from '$lib/type';

	const taskLists = createQuery<TaskList[], Error>({
		queryKey: ['lists'],
		queryFn: async () => api().getLists()
	});

	let listToCreate: TaskList | null = null;
</script>

<svelte:head>
	<title>Tasks (chara.dev)</title>
</svelte:head>

{#if $isAuthenticated}
	<EditListDialog mode="create" bind:taskList={listToCreate} />

	<Header
		onCreateClicked={() =>
			(listToCreate = {
				id: '',
				title: '',
				isPinned: false,
				showIndexNumbers: false,
				sortType: SortType.ORDINAL,
				sortDirection: SortDirection.ASCENDING,
				dateCreated: new Date(),
				lastModified: new Date()
			})}
	/>
	<MobileBanner />
	<main class={main}>
		{#if $taskLists.status === 'loading'}
			<progress />
		{:else if $taskLists.status === 'error'}
			<span>Error: {$taskLists.error.message}</span>
		{:else}
			<MasonryLayout items={$taskLists.data}>
				{#each $taskLists.data as taskList (taskList.id)}
					<TaskListItem {taskList} />
				{/each}
			</MasonryLayout>
		{/if}
	</main>
{:else}
	<CenterLayout>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={navHeader}>
					<Icon>checklist</Icon>
					Welcome to Tasks
				</h1>
				<p>TODO onboarding goes here</p>
				<p class={error}>
					NOTE: Tasks for web is currently in alpha. Expect major changes in this space.
				</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<Button style={ButtonStyle.Text} href="./login">Sign in</Button>
				<Button style={ButtonStyle.Tonal} href="./register">Sign up</Button>
			</svelte:fragment>
		</Card>
	</CenterLayout>
{/if}
