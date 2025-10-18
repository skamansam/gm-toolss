<script lang="ts">
	import { diceStore } from '$lib/stores/dice.svelte';
	import type { DiceType } from '$lib/types';

	const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

	function rollDice(type: DiceType) {
		diceStore.roll(type);
		diceStore.resetModifiers();
	}

	function formatTime(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<aside class="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
	<!-- Header -->
	<div class="p-4 border-b border-gray-700">
		<h3 class="text-lg font-bold text-purple-400">Dice Roller</h3>
	</div>

	<!-- Modifiers -->
	<div class="p-4 border-b border-gray-700 space-y-3">
		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-400">Count:</span>
			<div class="flex items-center gap-2">
				<button
					onclick={() => diceStore.setDiceCount(Math.max(1, diceStore.diceCount - 1))}
					class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
				>
					-
				</button>
				<span class="w-8 text-center font-semibold">{diceStore.diceCount}</span>
				<button
					onclick={() => diceStore.setDiceCount(diceStore.diceCount + 1)}
					class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
				>
					+
				</button>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-400">Modifier:</span>
			<div class="flex items-center gap-2">
				<button
					onclick={() => diceStore.decrementModifier()}
					class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
				>
					-
				</button>
				<span class="w-8 text-center font-semibold"
					>{diceStore.modifier >= 0 ? '+' : ''}{diceStore.modifier}</span
				>
				<button
					onclick={() => diceStore.incrementModifier()}
					class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
				>
					+
				</button>
			</div>
		</div>

		<div class="flex gap-2">
			<button
				onclick={() => diceStore.toggleAdvantage()}
				class="flex-1 px-3 py-2 rounded transition-colors {diceStore.advantage
					? 'bg-green-600 hover:bg-green-700'
					: 'bg-gray-700 hover:bg-gray-600'}"
			>
				<div class="text-xs font-semibold">ADV</div>
			</button>
			<button
				onclick={() => diceStore.toggleDisadvantage()}
				class="flex-1 px-3 py-2 rounded transition-colors {diceStore.disadvantage
					? 'bg-red-600 hover:bg-red-700'
					: 'bg-gray-700 hover:bg-gray-600'}"
			>
				<div class="text-xs font-semibold">DIS</div>
			</button>
		</div>
	</div>

	<!-- Dice Buttons -->
	<div class="p-4 border-b border-gray-700">
		<div class="grid grid-cols-2 gap-2">
			{#each diceTypes as diceType}
				<button
					onclick={() => rollDice(diceType)}
					class="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors text-lg"
				>
					{diceType.toUpperCase()}
				</button>
			{/each}
		</div>
	</div>

	<!-- Roll History -->
	<div class="flex-1 overflow-y-auto p-4">
		<div class="flex items-center justify-between mb-2">
			<h4 class="text-sm font-semibold text-gray-400 uppercase">History</h4>
			{#if diceStore.history.length > 0}
				<button
					onclick={() => diceStore.clearHistory()}
					class="text-xs text-red-400 hover:text-red-300"
				>
					Clear
				</button>
			{/if}
		</div>

		<div class="space-y-2">
			{#each diceStore.history as roll}
				<div class="p-2 bg-gray-700 rounded text-sm">
					<div class="flex items-center justify-between mb-1">
						<span class="font-mono font-semibold text-purple-400">{roll.dice}</span>
						<span class="text-xs text-gray-400">{formatTime(roll.timestamp)}</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="text-xs text-gray-400">
							{#if roll.advantage}
								<span class="text-green-400">ADV</span>
							{:else if roll.disadvantage}
								<span class="text-red-400">DIS</span>
							{/if}
							{#if roll.rolls.length > 1}
								[{roll.rolls.join(', ')}]
							{/if}
						</div>
						<span class="text-2xl font-bold">{roll.result}</span>
					</div>
					{#if roll.characterName}
						<div class="text-xs text-gray-500 mt-1">{roll.characterName}</div>
					{/if}
					{#if roll.purpose}
						<div class="text-xs text-gray-500">{roll.purpose}</div>
					{/if}
				</div>
			{/each}

			{#if diceStore.history.length === 0}
				<div class="text-center text-gray-500 text-sm py-8">No rolls yet</div>
			{/if}
		</div>
	</div>
</aside>
