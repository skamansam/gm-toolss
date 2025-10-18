<script lang="ts">
	import { charactersStore } from '$lib/stores/characters.svelte';

	function closeTab(id: string, event: Event) {
		event.stopPropagation();
		charactersStore.closeTab(id);
	}
</script>

<div class="flex-1 flex items-center gap-2 overflow-x-auto">
	{#each charactersStore.openTabs as tabId}
		{@const character = charactersStore.getCharacter(tabId)}
		{#if character}
			<div
				class="flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap {charactersStore.activeTabId ===
				tabId
					? 'bg-gray-900 text-white'
					: 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
			>
				<button
					onclick={() => charactersStore.setActiveTab(tabId)}
					class="flex items-center gap-2 flex-1"
				>
					<span class="w-2 h-2 rounded-full" style="background-color: {character.color}"></span>
					<span class="font-medium">{character.name}</span>
				</button>
				<button
					onclick={(e) => closeTab(tabId, e)}
					class="ml-1 p-1 hover:bg-gray-600 rounded transition-colors"
					aria-label="Close tab"
				>
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{/if}
	{/each}
</div>
