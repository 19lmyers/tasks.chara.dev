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
	import { SortDirection, SortType, type TaskList, type TaskListPrefs } from '$lib/type';

	import { error, main, masonry, navHeader, themeBox } from './styles.css';
	import { themeFromVariant } from '$lib/theme';

	const taskLists = createQuery<TaskList[], Error, TaskList[]>({
		queryKey: ['lists'],
		queryFn: async () => {
			return await api().getLists();
		}
	});

	let listToCreate: TaskList | null = null;
	let prefsToCreate: TaskListPrefs | null = null;

	function showCreate() {
		listToCreate = {
			id: '',
			ownerId: '',
			title: '',
			dateCreated: new Date(),
			lastModified: new Date()
		};

		prefsToCreate = {
			listId: '',
			showIndexNumbers: false,
			sortType: SortType.ORDINAL,
			sortDirection: SortDirection.ASCENDING,
			lastModified: new Date(),
			ordinal: 0
		};
	}
</script>

<svelte:head>
	<title>Tasks (chara.dev)</title>
</svelte:head>

{#if $isAuthenticated}
	<div class={themeBox} style={themeFromVariant($themeVariant)}>
		<EditListDialog mode="create" bind:taskList={listToCreate} bind:prefs={prefsToCreate} />

		<SiteHeader onCreateClicked={showCreate} />
		<MobileBanner />
		<main class={main}>
			{#if $taskLists.status === 'pending'}
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
