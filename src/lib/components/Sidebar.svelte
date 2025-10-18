<script lang="ts">
	import { charactersStore } from '$lib/stores/characters.svelte';
	import { createBlankCharacter } from '$lib/utils/dnd';

	interface Props {
		open: boolean;
		toggleCombatTracker: () => void;
	}

	let { open = $bindable(), toggleCombatTracker }: Props = $props();

	let searchQuery = $state('');

	const filteredCharacters = $derived(
		charactersStore.characters.filter(char =>
			char.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function createNewCharacter() {
		const newChar = createBlankCharacter();
		charactersStore.addCharacter(newChar);
	}

	function openCharacter(id: string) {
		charactersStore.openTab(id);
		open = false;
	}

	function deleteCharacter(id: string) {
		if (confirm('Are you sure you want to delete this character?')) {
			charactersStore.deleteCharacter(id);
		}
	}

	function exportData() {
		const data = charactersStore.exportCharacters();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `dnd-characters-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function importData() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const data = e.target?.result as string;
					if (charactersStore.importCharacters(data)) {
						alert('Characters imported successfully!');
					} else {
						alert('Failed to import characters. Please check the file format.');
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}
</script>

<!-- Overlay -->
{#if open}
	<button
		class="fixed inset-0 bg-black bg-opacity-50 z-40"
		onclick={() => (open = false)}
		aria-label="Close menu"
	></button>
{/if}

<!-- Sidebar -->
<aside
	class="fixed left-0 top-0 h-full w-80 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 {open
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<div class="flex flex-col h-full">
		<!-- Header -->
		<div class="p-4 border-b border-gray-700">
			<h2 class="text-2xl font-bold text-purple-400">D&D GM Toolkit</h2>
		</div>

		<!-- Search -->
		<div class="p-4">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search characters..."
				class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
			/>
		</div>

		<!-- Actions -->
		<div class="px-4 pb-4 space-y-2">
			<button
				onclick={createNewCharacter}
				class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				New Character
			</button>

			<button
				onclick={toggleCombatTracker}
				class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
				Combat Tracker
			</button>
		</div>

		<!-- Character List -->
		<div class="flex-1 overflow-y-auto px-4">
			<h3 class="text-sm font-semibold text-gray-400 mb-2 uppercase">Characters</h3>
			<div class="space-y-2">
				{#each filteredCharacters as character}
					<div
						class="flex items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
					>
						<button
							onclick={() => openCharacter(character.id)}
							class="flex-1 text-left"
						>
							<div class="font-semibold">{character.name}</div>
							<div class="text-sm text-gray-400">
								{character.class} {character.level} • {character.race}
							</div>
						</button>
						<button
							onclick={() => deleteCharacter(character.id)}
							class="p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label="Delete character"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Footer Actions -->
		<div class="p-4 border-t border-gray-700 space-y-2">
			<button
				onclick={exportData}
				class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
			>
				Export Characters
			</button>
			<button
				onclick={importData}
				class="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
			>
				Import Characters
			</button>
		</div>
	</div>
</aside>
