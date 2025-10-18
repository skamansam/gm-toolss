<script lang="ts">
	import type { Character } from '$lib/types';
	import { charactersStore } from '$lib/stores/characters.svelte';
	import { diceStore } from '$lib/stores/dice.svelte';
	import { getAllModifiers, formatModifier, getSkillModifier } from '$lib/utils/dnd';

	interface Props {
		character: Character;
	}

	let { character }: Props = $props();

	const modifiers = $derived(getAllModifiers(character.abilityScores));

	function updateCharacter(updates: Partial<Character>) {
		charactersStore.updateCharacter(character.id, updates);
	}

	function rollAbilityCheck(ability: keyof typeof character.abilityScores) {
		const modifier = modifiers[ability];
		diceStore.roll('d20', 1, modifier, false, false, character.name, `${ability.toUpperCase()} Check`);
	}

	function rollSavingThrow(ability: keyof typeof character.abilityScores) {
		const save = character.savingThrows[ability];
		const abilityMod = modifiers[ability];
		const modifier = save.proficient ? abilityMod + character.proficiencyBonus : abilityMod;
		diceStore.roll('d20', 1, modifier, false, false, character.name, `${ability.toUpperCase()} Save`);
	}

	function rollSkill(skillName: string) {
		const skill = character.skills.find(s => s.name === skillName);
		if (!skill) return;

		const abilityScore = character.abilityScores[skill.ability];
		const modifier = getSkillModifier(abilityScore, skill.proficient, skill.expertise, character.proficiencyBonus);
		diceStore.roll('d20', 1, modifier, false, false, character.name, `${skillName} Check`);
	}

	function rollInitiative() {
		const modifier = modifiers.dex + character.initiativeBonus;
		const result = diceStore.roll('d20', 1, modifier, false, false, character.name, 'Initiative');
		updateCharacter({ initiativeRoll: result.result });
	}
</script>

<div class="max-w-5xl mx-auto space-y-6">
	<!-- Header -->
	<div class="bg-gray-800 rounded-lg p-6">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<label class="block text-xs text-gray-400 mb-1">Character Name</label>
				<input
					type="text"
					value={character.name}
					oninput={(e) => updateCharacter({ name: e.currentTarget.value })}
					class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>
			</div>
			<div>
				<label class="block text-xs text-gray-400 mb-1">Class & Level</label>
				<div class="flex gap-2">
					<input
						type="text"
						value={character.class}
						oninput={(e) => updateCharacter({ class: e.currentTarget.value })}
						placeholder="Class"
						class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>
					<input
						type="number"
						value={character.level}
						oninput={(e) => updateCharacter({ level: parseInt(e.currentTarget.value) || 1 })}
						class="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>
				</div>
			</div>
			<div>
				<label class="block text-xs text-gray-400 mb-1">Race</label>
				<input
					type="text"
					value={character.race}
					oninput={(e) => updateCharacter({ race: e.currentTarget.value })}
					class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>
			</div>
		</div>
	</div>

	<!-- Ability Scores & Combat Stats -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Ability Scores -->
		<div class="lg:col-span-2 bg-gray-800 rounded-lg p-6">
			<h3 class="text-lg font-bold mb-4 text-purple-400">Ability Scores</h3>
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
				{#each Object.entries(character.abilityScores) as [ability, score]}
					<div class="text-center">
						<button
							onclick={() => rollAbilityCheck(ability as keyof typeof character.abilityScores)}
							class="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
						>
							<div class="text-xs text-gray-400 uppercase mb-1">{ability}</div>
							<div class="text-3xl font-bold mb-1">{formatModifier(modifiers[ability as keyof typeof modifiers])}</div>
							<input
								type="number"
								value={score}
								oninput={(e) => {
									const newScores = { ...character.abilityScores };
									newScores[ability as keyof typeof character.abilityScores] = parseInt(e.currentTarget.value) || 10;
									updateCharacter({ abilityScores: newScores });
								}}
								onclick={(e) => e.stopPropagation()}
								class="w-16 mx-auto px-2 py-1 bg-gray-800 border border-gray-600 rounded text-center text-sm"
							/>
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Combat Stats -->
		<div class="bg-gray-800 rounded-lg p-6">
			<h3 class="text-lg font-bold mb-4 text-purple-400">Combat</h3>
			<div class="space-y-4">
				<div>
					<label class="block text-xs text-gray-400 mb-1">Armor Class</label>
					<input
						type="number"
						value={character.ac}
						oninput={(e) => updateCharacter({ ac: parseInt(e.currentTarget.value) || 10 })}
						class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-2xl font-bold text-center"
					/>
				</div>
				<div>
					<label class="block text-xs text-gray-400 mb-1">Hit Points</label>
					<div class="flex gap-2">
						<input
							type="number"
							value={character.hp.current}
							oninput={(e) => {
								const newHp = { ...character.hp, current: parseInt(e.currentTarget.value) || 0 };
								updateCharacter({ hp: newHp });
							}}
							class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-xl font-bold text-center"
						/>
						<span class="text-2xl text-gray-500">/</span>
						<input
							type="number"
							value={character.hp.max}
							oninput={(e) => {
								const newHp = { ...character.hp, max: parseInt(e.currentTarget.value) || 0 };
								updateCharacter({ hp: newHp });
							}}
							class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-xl font-bold text-center"
						/>
					</div>
				</div>
				<div>
					<label class="block text-xs text-gray-400 mb-1">Initiative</label>
					<button
						onclick={rollInitiative}
						class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded font-bold transition-colors"
					>
						Roll {formatModifier(modifiers.dex + character.initiativeBonus)}
					</button>
					{#if character.initiativeRoll !== null}
						<div class="text-center text-2xl font-bold mt-2">{character.initiativeRoll}</div>
					{/if}
				</div>
				<div>
					<label class="block text-xs text-gray-400 mb-1">Speed</label>
					<input
						type="number"
						value={character.speed}
						oninput={(e) => updateCharacter({ speed: parseInt(e.currentTarget.value) || 30 })}
						class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-center"
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Saving Throws & Skills -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Saving Throws -->
		<div class="bg-gray-800 rounded-lg p-6">
			<h3 class="text-lg font-bold mb-4 text-purple-400">Saving Throws</h3>
			<div class="space-y-2">
				{#each Object.entries(character.savingThrows) as [ability, save]}
					<button
						onclick={() => rollSavingThrow(ability as keyof typeof character.abilityScores)}
						class="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
					>
						<input
							type="checkbox"
							checked={save.proficient}
							onchange={(e) => {
								const newSaves = { ...character.savingThrows };
								newSaves[ability as keyof typeof character.savingThrows].proficient = e.currentTarget.checked;
								updateCharacter({ savingThrows: newSaves });
							}}
							onclick={(e) => e.stopPropagation()}
							class="w-4 h-4"
						/>
						<span class="flex-1 text-left uppercase text-sm">{ability}</span>
						<span class="font-bold">
							{formatModifier(
								save.proficient
									? modifiers[ability as keyof typeof modifiers] + character.proficiencyBonus
									: modifiers[ability as keyof typeof modifiers]
							)}
						</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Skills -->
		<div class="bg-gray-800 rounded-lg p-6">
			<h3 class="text-lg font-bold mb-4 text-purple-400">Skills</h3>
			<div class="space-y-1 max-h-96 overflow-y-auto">
				{#each character.skills as skill, index}
					<button
						onclick={() => rollSkill(skill.name)}
						class="w-full flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
					>
						<input
							type="checkbox"
							checked={skill.proficient}
							onchange={(e) => {
								const newSkills = [...character.skills];
								newSkills[index].proficient = e.currentTarget.checked;
								updateCharacter({ skills: newSkills });
							}}
							onclick={(e) => e.stopPropagation()}
							class="w-4 h-4"
						/>
						<input
							type="checkbox"
							checked={skill.expertise}
							onchange={(e) => {
								const newSkills = [...character.skills];
								newSkills[index].expertise = e.currentTarget.checked;
								updateCharacter({ skills: newSkills });
							}}
							onclick={(e) => e.stopPropagation()}
							class="w-4 h-4"
							title="Expertise"
						/>
						<span class="flex-1 text-left">{skill.name}</span>
						<span class="text-xs text-gray-400 uppercase">{skill.ability}</span>
						<span class="font-bold w-12 text-right">
							{formatModifier(
								getSkillModifier(
									character.abilityScores[skill.ability],
									skill.proficient,
									skill.expertise,
									character.proficiencyBonus
								)
							)}
						</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Notes -->
	<div class="bg-gray-800 rounded-lg p-6">
		<h3 class="text-lg font-bold mb-4 text-purple-400">Notes</h3>
		<textarea
			value={character.notes}
			oninput={(e) => updateCharacter({ notes: e.currentTarget.value })}
			placeholder="Character notes, features, equipment, etc..."
			class="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
		></textarea>
	</div>
</div>
