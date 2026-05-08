<script lang="ts">
	import '../app.css';
	import '../app.scss';
	import favicon from '$lib/assets/favicon.svg';
	// Fontsource

	import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

	let { children, data } = $props();

	// Access the current logged-in user and session
	const session = $derived(data.session);
	const user = $derived(session?.user);

	// Components
	import Navbar from '$lib/components/template/Navbar.svelte';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main
	class="align-center relative flex min-h-[100vh] w-full flex-col overflow-hidden bg-linear-[80deg] from-indigo-100 from-45% to-indigo-200 bg-fixed lg:from-40% dark:from-indigo-900 dark:to-gray-900"
>
	{#if user}
		<Navbar {user} />
	{/if}
	{@render children?.()}
</main>
