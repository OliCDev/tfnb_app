<script lang="ts">
	// Server
	// export let data;

	// imports
	// import { PUBLIC_API_URL } from '$env/static/public';
	// import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	// Svelte
	import { Alert } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	// form data from server
	let { form } = $props<{ form?: any }>();

	// error handlign and stuff
	$effect(() => {
		if (form?.username) {
			login_state.user_creds.username = form.username;
		}
	});

	// State
	const login_state = $state({
		user_creds: {
			name: '',
			username: '',
			password: '',
			confirm_password: '',
			email: '',
			pfp_url:
				'https://res.cloudinary.com/dxsjva9e0/image/upload/v1761835316/user_avatar_ry4fdr.png'
		},
		logged_in: false,
		signup_mode: false,
		posting: false,
		success: '',
		error: '',
		invitation: {
			token: '',
			email: ''
		}
	});

	import fnb_logo from '$lib/assets/img/tfnb_logo.png';

	const signIn = async () => {
		login_state.signup_mode = false;
		console.log(`Signing in user: ${login_state.user_creds.username}`);
		try {
			const res = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: login_state.user_creds.email,
					password: login_state.user_creds.password
				})
			});
			const data = await res.json();
			if (data.success) {
				let res = await data.user;
				login_state.error = '';
				login_state.success =
					await `Welcome back, ${data.user.user_metadata.first_name ? data.user.user_metadata.first_name : snip_name(data.user.user_metadata.full_name) || 'comrade'}!`;

				/* {user?.user_metadata?.first_name
				? user?.user_metadata?.first_name
				: firstName(user?.user_metadata?.full_name || '')}! */
				login_state.logged_in = true;
				console.log('User signed in:', data);
				// save to locals or store as needed

				// // Small delay to ensure cookies are set, then reload
				setTimeout(() => {
					if (login_state.success?.length) {
						window.location.href = '/dashboard';
					}
				}, 100);
			} else {
				login_state.error = data.error || 'Failed to sign in.';
			}
		} catch (error) {
			// I hate this so, so, so damn much.

			let err = String(error);
			console.log('err string:', err);
			if (!err?.includes(`TypeError: Cannot read properties of undefined (reading 'split')`)) {
				login_state.error = `An error occurred during sign in: ${error}`;
			} else {
				login_state.success = 'Welcome back, podster!';
				login_state.logged_in = true;
				window.location.href = '/dashboard';
			}
		} finally {
			// window.location.href = '/dashboard';
			login_state.posting = false;
		}
	};

	const randomNameGenerator = () => {
		const adjectives = ['Swift', 'Silent', 'Mighty', 'Brave', 'Clever'];
		const animals = ['Tiger', 'Eagle', 'Shark', 'Panther', 'Wolf'];
		const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		const animal = animals[Math.floor(Math.random() * animals.length)];
		return `${adjective} ${animal}`;
	};

	// snip full name into first name only:
	const snip_name = (full_name: string) => {
		return full_name.split(' ')[0];
	};

	const detect_signup_mode = () => {
		const urlParams = new URLSearchParams(window.location.search);
		const signup_mode = urlParams.get('signup');
		if (signup_mode) {
			login_state.signup_mode = true;
		}
	};
</script>

<!-- Tailwind gradient bg -->
<div
	class="dark:from-indego-800 flex h-[100vh] w-full flex-col justify-center bg-linear-to-tr from-indigo-100 via-white to-indigo-100 dark:via-indigo-900 dark:to-black"
>
	<div
		class="align-center mx-auto flex w-96 flex-col justify-center rounded-lg bg-white p-8 shadow-xl dark:bg-indigo-900"
	>
		<img src={fnb_logo} alt="" />
		{#if login_state.signup_mode}
			<div class="flex flex-col">
				<input
					name="name"
					bind:value={login_state.user_creds.name}
					onkeydown={(e) => {
						login_state.error = '';
					}}
					type="text"
					placeholder={`Your name (e.g. ${randomNameGenerator()})`}
					class="mb-2 rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400"
				/>
				<input
					name="email"
					bind:value={login_state.user_creds.email}
					onkeydown={(e) => {
						login_state.error = '';
					}}
					type="email"
					placeholder="Email"
					class="mb-2 rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400"
				/>

				<input
					name="password"
					bind:value={login_state.user_creds.password}
					onkeydown={(e) => {
						login_state.error = '';
					}}
					type="password"
					placeholder="Password"
					class="mb-2 rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400"
				/>
				<input
					name="address_line_1"
					bind:value={login_state.user_creds.confirm_password}
					onkeydown={(e) => {
						login_state.error = '';
					}}
					type="password"
					placeholder="Please confirm your password"
					class="mb-2 rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400"
				/>

				<!-- Success/Error Messages -->
				{#if login_state.success}
					<div in:fade out:fade={{ duration: 400 }}>
						<Alert color="green" class="mt-2">
							<span>{login_state.success}</span>
						</Alert>
					</div>
				{/if}
				{#if login_state.error}
					<div in:fade out:fade={{ duration: 400 }}>
						<Alert color="red" class="mt-2">
							<span>{login_state.error}</span>
						</Alert>
					</div>
				{/if}
			</div>
			<div class="flex w-full flex-col text-center">
				<p class="mt-4 text-slate-600 dark:text-slate-300">
					Already have an account?
					<button
						class="cursor-pointer text-slate-800 underline hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-400"
						onclick={() => (login_state.signup_mode = false)}
					>
						Sign in
					</button>
				</p>
			</div>
		{:else}
			<div class="flex flex-col">
				<input
					name="email"
					bind:value={login_state.user_creds.email}
					type="text"
					placeholder="Email"
					onkeydown={(e) => {
						login_state.error = '';
					}}
					class="mb-2 rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400"
				/>
				<input
					name="password"
					bind:value={login_state.user_creds.password}
					type="password"
					placeholder="Password"
					class="cursor-pointer rounded-md border border-slate-300 p-2 focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-slate-400"
					onkeydown={(e) => {
						login_state.error = '';
						if (e.key === 'Enter') {
							signIn();
						}
					}}
				/>
				<button
					onclick={signIn}
					class="mt-4 cursor-pointer rounded-md bg-orange-600 p-2 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
				>
					Sign In
				</button>
				<!-- Server-side Error Messages from form action -->
				<!-- {#if login_state.error}
					<div in:fade out:fade={{ duration: 400 }}>
						<Alert color="red" class="mt-2">
							<span>{login_state.error}</span>
						</Alert>
					</div>
				{/if} -->
				<!-- Client-side Success/Error Messages -->
				{#if login_state.success}
					<div in:fade out:fade={{ duration: 400 }}>
						<Alert color="green" class="mt-2">
							<span>{login_state.success}</span>
						</Alert>
					</div>
				{/if}
				{#if login_state.error}
					<div in:fade out:fade={{ duration: 400 }}>
						<Alert color="red" class="mt-2">
							<span>{login_state.error}</span>
						</Alert>
					</div>
				{/if}
			</div>
			<div class="flex w-full flex-col text-center">
				<p class="mt-4 text-slate-600 dark:text-slate-300">
					Don't have an account? Reach out to K.
				</p>
				<p class="mt-2 text-xs text-slate-600 dark:text-slate-300">
					Forgot your password? No worries!
					<a
						href="/forgot-password"
						class="cursor-pointer text-slate-800 underline hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-400"
					>
						Reset here.
					</a>
				</p>
			</div>
		{/if}
	</div>
</div>
