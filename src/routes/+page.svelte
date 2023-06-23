<script lang="ts">
	import { Button, ButtonStyle, Card, CenterLayout, TaskLists } from '$lib/component';
	import { isAuthenticated } from '$lib/stores';
</script>

<svelte:head>
	<title>Tasks (chara.dev)</title>
</svelte:head>

{#if $isAuthenticated}
	<TaskLists />
{:else}
	<CenterLayout>
		<Card>
			<svelte:fragment slot="content">
				<h1>Welcome to Tasks</h1>
				<p>TODO onboarding goes here</p>
			</svelte:fragment>
			<svelte:fragment slot="actions">
				<Button style={ButtonStyle.Text} href="./login">Sign in</Button>
				<Button style={ButtonStyle.Tonal} href="./register">Sign up</Button>
			</svelte:fragment>
		</Card>
	</CenterLayout>
{/if}
