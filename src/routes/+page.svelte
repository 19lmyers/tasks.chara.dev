<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import {
		Button,
		ButtonStyle,
		Card,
		CenterLayout,
		EditListDialog,
		Icon,
		MobileBanner,
		SiteHeader,
		TaskListItem
	} from '$lib/component';
	import { isAuthenticated, themeVariant } from '$lib/stores';
	import type { TaskList } from '$lib/type';

	import { error, main, masonry, navHeader, themeBox } from './styles.css';
	import { SortDirection, SortType } from '$lib/type';
	import { themeFromVariant } from '$lib/theme';

	const taskLists = createQuery<TaskList[], Error, TaskList[]>({
		queryKey: ['lists'],
		queryFn: async () => {
			const lists = await api().getLists()
			return lists.sort((a, b) => a.ordinal < b.ordinal ? -1 : 1);
		}
	});

	let listToCreate: TaskList | null = null;

	function showCreate() {
		listToCreate = {
			id: '',
			title: '',
			showIndexNumbers: false,
			sortType: SortType.ORDINAL,
			sortDirection: SortDirection.ASCENDING,
			dateCreated: new Date(),
			lastModified: new Date(),
			ordinal: 0,
		};
	}
</script>

<svelte:head>
	<title>Tasks (chara.dev)</title>
</svelte:head>

{#if $isAuthenticated}
	<div class={themeBox} style={themeFromVariant($themeVariant)}>
		<EditListDialog mode="create" bind:taskList={listToCreate} />

		<SiteHeader onCreateClicked={showCreate} />
		<MobileBanner />
		<main class={main}>
			{#if $taskLists.status === 'loading'}
				<progress />
			{:else if $taskLists.status === 'error'}
				<span>Error: {$taskLists.error.message}</span>
			{:else}
				<div class={masonry}>
					{#each $taskLists.data as taskList (taskList.id)}
						<TaskListItem {taskList} />
					{/each}
				</div>
			{/if}
		</main>
	</div>
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
