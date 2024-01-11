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
	import { goto } from '$app/navigation';

	import {
		Button,
		ButtonStyle,
		DeleteCompletedTasksDialog,
		DeleteListDialog,
		LeaveListDialog,
		Dropdown,
		Icon
	} from '$lib/component';
	import type { TaskList } from '$lib/type';

	import {
		description,
		header,
		headerFill,
		headerFlex,
		headerRight,
		headerWrap,
		icon
	} from './ListHeader.css';
	import { profile } from '$lib/stores';

	export let taskList: TaskList;

	export let onEditClicked: (() => void) | null = null;
	export let onShareClicked: (() => void) | null = null;
	export let onCreateClicked: (() => void) | null = null;

	let idToClear: string | null = null;
	let idToDelete: string | null = null;
	let idToLeave: string | null = null;
</script>

<DeleteCompletedTasksDialog bind:listId={idToClear} />
<DeleteListDialog bind:listId={idToDelete} />
<LeaveListDialog bind:listId={idToLeave} />

<header class={header}>
	<div class="{headerFlex} {headerFill} {headerWrap}">
		<div class={icon}>
			<Button style={ButtonStyle.Icon} onClick={() => goto('/')}>
				<Icon>arrow_back</Icon>
			</Button>
			<div class={headerFill}>
				<h1>
					{taskList.title}
				</h1>
				{#if taskList.description}
					<p class={description}>{taskList.description}</p>
				{/if}
			</div>
		</div>
		<div class="{headerFlex} {headerRight} {headerFill} {headerWrap}">
			<Button style={ButtonStyle.Tonal} onClick={onEditClicked}>
				<Icon>edit</Icon>
				Edit list
			</Button>
			<Button style={ButtonStyle.Tonal} onClick={onShareClicked}>
				<Icon>share</Icon>
				Share list
			</Button>
			<Button style={ButtonStyle.Tonal} onClick={onCreateClicked}>
				<Icon>add</Icon>
				New task
			</Button>
			<Dropdown>
				<Button slot="label" style={ButtonStyle.Icon}>
					<Icon>more_vert</Icon>
				</Button>
				<ul slot="content">
					<li>
						<Button style={ButtonStyle.Text} onClick={() => (idToClear = taskList.id)}>
							<Icon>check_circle</Icon>
							Delete completed tasks
						</Button>
					</li>
					<li>
						{#if taskList.ownerId === $profile?.id}
							<Button style={ButtonStyle.Text} onClick={() => (idToDelete = taskList.id)}>
								<Icon>delete</Icon>
								Delete list
							</Button>
						{:else}
							<Button style={ButtonStyle.Text} onClick={() => (idToLeave = taskList.id)}>
								<Icon>exit_to_app</Icon>
								Leave list
							</Button>
						{/if}
					</li>
				</ul>
			</Dropdown>
		</div>
	</div>
</header>
