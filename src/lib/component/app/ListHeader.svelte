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
		Dropdown,
		Icon
	} from '$lib/component';
	import { auth, profile } from '$lib/stores';
	import { getDisplayName, getProfilePhoto } from '$lib/profile';
	import type { TaskList } from '$lib/type';

	import {
		description,
		header,
		headerFill,
		headerFlex,
		headerRight,
		headerWrap,
		icon,
		profileButton,
		profilePhoto
	} from './ListHeader.css';

	export let taskList: TaskList;

	export let onEditClicked: (() => void) | null = null;
	export let onCreateClicked: (() => void) | null = null;

	function logout() {
		profile.set(null);
		auth.set(null);
	}

	let idToClear: string | null = null;
	let idToDelete: string | null = null;
</script>

<DeleteCompletedTasksDialog bind:listId={idToClear} />
<DeleteListDialog bind:listId={idToDelete} />

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
			<div class={headerFlex}>
				<Button style={ButtonStyle.Tonal} onClick={onEditClicked}>
					<Icon>edit</Icon>
					Edit list
				</Button>
				<Button style={ButtonStyle.Tonal} onClick={onCreateClicked}>
					<Icon>add</Icon>
					New task
				</Button>
			</div>
			<div class={headerFlex}>
				<Button style={ButtonStyle.Tonal} onClick={() => (idToClear = taskList.id)}>
					<Icon>check_circle</Icon>
					Delete completed tasks
				</Button>
				<Button style={ButtonStyle.Tonal} onClick={() => (idToDelete = taskList.id)}>
					<Icon>delete</Icon>
					Delete list
				</Button>
			</div>
		</div>
	</div>
	<Dropdown>
		<button slot="label" class={profileButton}>
			<img src={getProfilePhoto()} alt={getDisplayName()} class={profilePhoto} />
		</button>
		<ul slot="content">
			<li>
				<Button href="./profile" style={ButtonStyle.Text}>
					<Icon>person</Icon>
					<p>Edit profile</p>
				</Button>
			</li>
			<li>
				<Button href="./settings" style={ButtonStyle.Text}>
					<Icon>settings</Icon>
					<p>Settings</p>
				</Button>
			</li>
			<li>
				<Button onClick={logout} style={ButtonStyle.Text}>
					<Icon>logout</Icon>
					<p>Sign out</p>
				</Button>
			</li>
		</ul>
	</Dropdown>
</header>
