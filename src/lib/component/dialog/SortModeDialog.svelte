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
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { Button, ButtonStyle, Card, Dialog, Icon } from '$lib/component';
	import { themeFromListColor } from '$lib/theme';
	import { SortType, type TaskListPrefs } from '$lib/type';
	import type { TaskList } from '$lib/type';
	import { iconFromSortType, labelFromSortType } from '$lib/util';

	import { header, icon } from './base.css';
	import { themeVariant } from '$lib/stores';

	const queryClient = useQueryClient();

	export let taskList: TaskList | null = null;
	export let prefs: TaskListPrefs | null = null;

	const updateListPrefs = createMutation<string, Error, TaskListPrefs>({
		mutationFn: async (prefs: TaskListPrefs) => {
			await api().updateListPrefs(prefs);
			return prefs.listId;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries({ queryKey: ['lists'] });
			queryClient.invalidateQueries({ queryKey: ['tasks', { listId: listId }] });
		}
	});

	async function setSortType(type: SortType) {
		if (prefs) {
			prefs.sortType = type;
			prefs.lastModified = new Date();

			$updateListPrefs.mutate(prefs);

			taskList = null;
			prefs = null;
		}
	}
</script>

{#if $updateListPrefs.error}
	<Dialog dismiss={$updateListPrefs.reset}>
		<Card>
			<svelte:fragment slot="content">
				<h1>An error occurred</h1>
				<p>{$updateListPrefs.error.message}</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<span />
				<Button style={ButtonStyle.Text} onClick={$updateListPrefs.reset}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

{#if taskList && prefs}
	<Dialog style={themeFromListColor(taskList.color, $themeVariant)} dismiss={() => (prefs = null)}>
		<Card>
			<svelte:fragment slot="content">
				<h1 class={header}>
					<Button style={ButtonStyle.Icon} onClick={() => (taskList = null)}>
						<Icon className={icon}>close</Icon>
					</Button>
					Sort by
				</h1>
				{#if $updateListPrefs.isPending}
					<progress />
				{/if}
				<div>
					{#each Object.values(SortType) as type}
						<Button
							style={ButtonStyle.Text}
							onClick={() => setSortType(type)}
							disabled={$updateListPrefs.isPending}
						>
							<Icon>{iconFromSortType(type)}</Icon>
							<span>{labelFromSortType(type)}</span>
						</Button>
					{/each}
				</div>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}
