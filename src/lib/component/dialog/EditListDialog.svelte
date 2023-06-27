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

<script lang='ts'>
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { Button, ButtonStyle, Card, Dialog, Icon } from '$lib/component';
	import type { TaskList } from '$lib/type';
	import { api } from '$lib/api';
	import { themeFromListColor } from '$lib/theme';
	import { ListColor, ListIcon } from '$lib/type';

	import { header, listIcon } from './EditListDialog.css';
	import { iconFromListIcon } from '$lib/util';

	export let taskList: TaskList | null = null;

	function cancel() {
		taskList = null;
	}

	const queryClient = useQueryClient()

	const updateList = createMutation<string, Error, TaskList>({
		mutationFn: async (taskList: TaskList) => {
			await api().updateList(taskList);
			return taskList.id;
		},
		onSuccess: (listId: string) => {
			queryClient.invalidateQueries(['lists'])
			queryClient.invalidateQueries(['tasks', listId])
		}
	});

	function save() {
		if (taskList) {
			taskList.lastModified = new Date();

			$updateList.mutate(taskList);

			taskList = null;
		}
	}
</script>

{#if $updateList.error}
	<Dialog dismiss={$updateList.reset}>
		<Card>
			<svelte:fragment slot='content'>
				<h1>An error occurred</h1>
				<p>{$updateList.error.message}</p>
			</svelte:fragment>
			<svelte:fragment slot='actions'>
				<span />
				<Button style={ButtonStyle.Text} onClick={$updateList.reset}>OK</Button>
			</svelte:fragment>
		</Card>
	</Dialog>
{/if}

{#if taskList}
	<Dialog className={themeFromListColor(taskList.color)} dismiss={() => taskList = null}>
		<form on:submit|preventDefault={save}>
			<Card>
				<svelte:fragment slot='content'>
					<h1 class={header}>
						<Icon className={listIcon}>{iconFromListIcon(taskList.icon)}</Icon>
						Edit list
					</h1>
					{#if $updateList.isLoading}
						<progress />
					{/if}
					<label>
						Title
						<input
							name='title'
							type='text'
							bind:value={taskList.title}
							disabled={$updateList.isLoading}
							required
						/>
					</label>
					<label>
						Icon
						<select name='icon' bind:value={taskList.icon}>
							<option value={null}>Default</option>
							{#each Object.values(ListIcon) as icon}
								<option value={icon}>
									{icon}
								</option>
							{/each}
						</select>
					</label>
					<label>
						Color
						<select name='color' bind:value={taskList.color}>
							<option value={null}>Default</option>
							{#each Object.values(ListColor) as color}
								<option value={color}>
									{color}
								</option>
							{/each}
						</select>
					</label>
					<label>
						Description
						<textarea name='description' bind:value={taskList.description} disabled={$updateList.isLoading} />
					</label>
					<label>
						Pin to dashboard
						<input
							name='pin-to-dashboard'
							type='checkbox'
							bind:checked={taskList.isPinned}
							disabled={$updateList.isLoading}
						/>
					</label>
					<label>
						Show list numbers
						<input
							name='show-list-numbers'
							type='checkbox'
							bind:checked={taskList.showIndexNumbers}
							disabled={$updateList.isLoading}
						/>
					</label>
				</svelte:fragment>
				<svelte:fragment slot='actions'>
					<Button style={ButtonStyle.Text} onClick={cancel} disabled={$updateList.isLoading}>Cancel</Button>
					<Button style={ButtonStyle.Tonal} type='submit' disabled={$updateList.isLoading}>Save</Button>
				</svelte:fragment>
			</Card>
		</form>
	</Dialog>
{/if}