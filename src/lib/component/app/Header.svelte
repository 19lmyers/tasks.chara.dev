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
	import { Button, ButtonStyle, Icon } from '$lib/component';
	import { auth, profile } from '$lib/stores';
	import { getDisplayName, getProfilePhoto } from '$lib/profile';

	import { header, profileButton, profilePhoto } from './Header.css';
	import Dropdown from '$lib/component/base/Dropdown.svelte';

	function logout() {
		profile.set(null);
		auth.set(null);
	}
</script>

<header class={header}>
	<h1>Tasks</h1>
	<Dropdown>
		<button slot='label' class={profileButton}>
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
