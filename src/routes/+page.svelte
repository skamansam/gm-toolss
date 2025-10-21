<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DiceRoller from '$lib/components/DiceRoller.svelte';
	import CharacterTabs from '$lib/components/CharacterTabs.svelte';
	import CharacterSheet from '$lib/components/CharacterSheet.svelte';
	import DynamicCharacterSheet from '$lib/components/DynamicCharacterSheet.svelte';
	import CombatTracker from '$lib/components/CombatTracker.svelte';
	import ConfigEditor from '$lib/components/ConfigEditor.svelte';
	import { charactersStore } from '$lib/stores/characters.svelte';
	import { combatStore } from '$lib/stores/combat.svelte';

	let sidebarOpen = $state(false);
	let combatTrackerOpen = $state(false);
	let configEditorOpen = $state(false);
	let useDynamicSheet = $state(true);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleCombatTracker() {
		combatTrackerOpen = !combatTrackerOpen;
	}

	function toggleConfigEditor() {
		configEditorOpen = !configEditorOpen;
	}
</script>

<div class="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
	<!-- Sidebar -->
	<Sidebar bind:open={sidebarOpen} {toggleCombatTracker} />

	<!-- Main Content Area -->
	<div class="flex-1 flex flex-col min-w-0">
		<!-- Header with Tabs -->
		<div class="bg-gray-800 border-b border-gray-700">
			<div class="flex items-center px-4 py-2">
				<button
					onclick={toggleSidebar}
					class="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
					aria-label="Toggle menu"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
				
				<CharacterTabs />

				<button
					onclick={toggleConfigEditor}
					class="ml-auto p-2 hover:bg-gray-700 rounded-lg transition-colors"
					title="Configure Character Sheet"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Content -->
		<div class="flex-1 flex overflow-hidden">
			<!-- Character Sheet / Combat Tracker -->
			<div class="flex-1 overflow-auto p-6">
				{#if combatTrackerOpen}
					<CombatTracker onClose={toggleCombatTracker} />
				{:else if charactersStore.activeCharacter}
					{#if useDynamicSheet}
						<DynamicCharacterSheet character={charactersStore.activeCharacter} />
					{:else}
						<CharacterSheet character={charactersStore.activeCharacter} />
					{/if}
				{:else}
					<div class="flex items-center justify-center h-full">
						<div class="text-center">
							<h2 class="text-3xl font-bold text-gray-400 mb-4">No Character Selected</h2>
							<p class="text-gray-500 mb-6">Create a new character or select one from the menu</p>
							<button
								onclick={toggleSidebar}
								class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
							>
								Open Menu
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Dice Roller Sidebar -->
			<DiceRoller />
		</div>
	</div>
</div>

<!-- Config Editor Modal -->
{#if configEditorOpen}
	<ConfigEditor onClose={toggleConfigEditor} />
{/if}
