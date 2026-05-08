<script lang="ts">
	// Svelte
	import { Alert, select } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	// Components
	import { Modal, Toggle, Spinner } from 'flowbite-svelte';

	// form data from server and layout data
	let { data } = $props<{ data?: any }>();

	// Access user and profile from layout data
	const user = $derived(data?.user);

	// Log when user is available
	$effect(() => {
		if (user) {
			console.log('Dashboard - User:', user);
			// console.log('Dashboard - Profile:', profile);
		}
	});

	// Stores

	// State
	const now = new Date();
	const state = $state({
		error: '',
		success: '',
		clock: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
		loading: {
			leading: true,
			member: true
		}
	});

	// Functions
	const firstName = (fullName: string) => {
		return fullName.split(' ')[0];
	};
	const clock = () => {
		setInterval(() => {
			const now = new Date();
			state.clock = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}, 1000);
	};
	clock();
</script>

<div
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 200 }}
	class="container mx-auto flex min-h-[100vh] w-full flex-col justify-center gap-4 p-4 pb-[8rem] md:left-[7rem] lg:absolute lg:left-[8rem] 2xl:static"
>
	<div
		id="greetbox"
		class="mx-auto mt-8 flex w-full flex-col rounded-lg bg-white/60 p-6 shadow-xl dark:bg-white/10"
	>
		<h1 class="text-6xl font-bold text-neutral-600 md:text-9xl dark:text-neutral-200">
			Hello,
			{user?.user_metadata?.first_name
				? user?.user_metadata?.first_name
				: firstName(user?.user_metadata?.full_name || '')}!
		</h1>
		<p class="my-2 text-2xl font-thin text-neutral-600 md:text-6xl dark:text-neutral-200">
			{state.clock}
		</p>
	</div>
</div>
