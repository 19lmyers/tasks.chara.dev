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
	import { Button, ButtonStyle, Card, CenterLayout, Icon } from '$lib/component';

	import { navHeader } from '$lib/styles.css';
</script>

<svelte:head>
	<title>Not Found</title>
</svelte:head>

<CenterLayout>
	<Card>
		<svelte:fragment slot="content">
			<h1 class={navHeader}>
				<Button onClick={() => history.back()} style={ButtonStyle.Icon}>
					<Icon>arrow_back</Icon>
				</Button>
				<span>Not Found</span>
			</h1>
			<p>We couldn't find what you're looking for.</p>
		</svelte:fragment>
	</Card>
</CenterLayout>
