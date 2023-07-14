<script lang="ts">
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { PageData } from './$types';

	import { baseTheme } from '$lib/theme';

	import './styles.css';
	export let data: PageData;
</script>

<div id="base" class={baseTheme}>
	<QueryClientProvider client={data.queryClient}>
		<slot />
	</QueryClientProvider>
</div>
