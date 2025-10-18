<script lang="ts">
	import { combatStore } from '$lib/stores/combat.svelte';
	import { charactersStore } from '$lib/stores/characters.svelte';

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();

	let selectedCharacters = $state<string[]>([]);

	function toggleCharacterSelection(id: string) {
		if (selectedCharacters.includes(id)) {
			selectedCharacters = selectedCharacters.filter(cid => cid !== id);
		} else {
			selectedCharacters = [...selectedCharacters, id];
		}
	}

	function startCombat() {
		if (selectedCharacters.length > 0) {
			combatStore.startCombat(selectedCharacters);
		}
	}

	function endCombat() {
		if (confirm('Are you sure you want to end combat?')) {
			combatStore.endCombat();
			onClose();
		}
	}

	const sortedParticipants = $derived(
		combatStore.tracker.participants.map(p => ({
			...p,
			character: charactersStore.getCharacter(p.characterId)
		})).filter(p => p.character !== undefined)
	);
</script>

<div class="max-w-4xl mx-auto">
	<div class="bg-gray-800 rounded-lg p-6">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-bold text-purple-400">Combat Tracker</h2>
			<button
				onclick={onClose}
				class="p-2 hover:bg-gray-700 rounded transition-colors"
				aria-label="Close combat tracker"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		{#if !combatStore.tracker.active}
			<!-- Setup Phase -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold">Select Participants</h3>
				<div class="space-y-2">
					{#each charactersStore.characters as character}
						<label class="flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition-colors">
							<input
								type="checkbox"
								checked={selectedCharacters.includes(character.id)}
								onchange={() => toggleCharacterSelection(character.id)}
								class="w-5 h-5"
							/>
							<div class="flex-1">
								<div class="font-semibold">{character.name}</div>
								<div class="text-sm text-gray-400">
									{character.class} {character.level} • AC {character.ac} • HP {character.hp.current}/{character.hp.max}
								</div>
							</div>
						</label>
					{/each}
				</div>

				<button
					onclick={startCombat}
					disabled={selectedCharacters.length === 0}
					class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
				>
					Start Combat ({selectedCharacters.length} participants)
				</button>
			</div>
		{:else}
			<!-- Active Combat -->
			<div class="space-y-4">
				<!-- Round Counter -->
				<div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
					<div class="text-xl font-bold">Round {combatStore.tracker.round}</div>
					<div class="flex gap-2">
						<button
							onclick={() => combatStore.previousTurn()}
							class="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
						>
							← Previous
						</button>
						<button
							onclick={() => combatStore.nextTurn()}
							class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
						>
							Next Turn →
						</button>
						<button
							onclick={endCombat}
							class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
						>
							End Combat
						</button>
					</div>
				</div>

				<!-- Initiative Order -->
				<div class="space-y-2">
					{#each sortedParticipants as participant, index}
						{@const char = participant.character}
						{#if char}
							<div
								class="p-4 rounded-lg transition-all {index === combatStore.tracker.currentTurnIndex
									? 'bg-purple-900 border-2 border-purple-500 ring-2 ring-purple-500'
									: 'bg-gray-700'}"
							>
								<div class="flex items-center gap-4">
									<!-- Initiative -->
									<div class="text-center">
										<div class="text-2xl font-bold text-purple-400">{participant.initiative}</div>
										<div class="text-xs text-gray-400">Init</div>
									</div>

									<!-- Character Info -->
									<div class="flex-1">
										<div class="font-bold text-lg">{char.name}</div>
										<div class="text-sm text-gray-400">
											{char.class} {char.level} • AC {char.ac} • HP {char.hp.current}/{char.hp.max}
										</div>
									</div>

									<!-- Turn Status -->
									<div class="flex gap-2">
										<button
											onclick={() => combatStore.toggleAction(char.id)}
											class="px-3 py-2 rounded text-sm transition-colors {char.turnStatus.action
												? 'bg-green-600 hover:bg-green-700'
												: 'bg-gray-600 hover:bg-gray-500'}"
											title="Action"
										>
											A
										</button>
										<button
											onclick={() => combatStore.toggleBonusAction(char.id)}
											class="px-3 py-2 rounded text-sm transition-colors {char.turnStatus.bonusAction
												? 'bg-green-600 hover:bg-green-700'
												: 'bg-gray-600 hover:bg-gray-500'}"
											title="Bonus Action"
										>
											B
										</button>
										<button
											onclick={() => combatStore.toggleMovement(char.id)}
											class="px-3 py-2 rounded text-sm transition-colors {char.turnStatus.movement
												? 'bg-green-600 hover:bg-green-700'
												: 'bg-gray-600 hover:bg-gray-500'}"
											title="Movement"
										>
											M
										</button>
										<button
											onclick={() => combatStore.toggleReaction(char.id)}
											class="px-3 py-2 rounded text-sm transition-colors {char.turnStatus.reaction
												? 'bg-green-600 hover:bg-green-700'
												: 'bg-gray-600 hover:bg-gray-500'}"
											title="Reaction"
										>
											R
										</button>
									</div>

									<!-- HP Adjustment -->
									<div class="flex gap-2">
										<button
											onclick={() => {
												const newHp = { ...char.hp, current: Math.max(0, char.hp.current - 1) };
												charactersStore.updateCharacter(char.id, { hp: newHp });
											}}
											class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
										>
											-
										</button>
										<button
											onclick={() => {
												const newHp = { ...char.hp, current: Math.min(char.hp.max, char.hp.current + 1) };
												charactersStore.updateCharacter(char.id, { hp: newHp });
											}}
											class="px-3 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
										>
											+
										</button>
									</div>
								</div>

								{#if index === combatStore.tracker.currentTurnIndex}
									<div class="mt-2 text-sm text-purple-300 font-semibold">
										← Current Turn
									</div>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
