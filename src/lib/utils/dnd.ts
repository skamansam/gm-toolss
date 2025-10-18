import type { AbilityScores, Character } from '$lib/types';

// Calculate ability modifier from score
export function getAbilityModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

// Get all ability modifiers
export function getAllModifiers(scores: AbilityScores) {
	return {
		str: getAbilityModifier(scores.str),
		dex: getAbilityModifier(scores.dex),
		con: getAbilityModifier(scores.con),
		int: getAbilityModifier(scores.int),
		wis: getAbilityModifier(scores.wis),
		cha: getAbilityModifier(scores.cha)
	};
}

// Format modifier with + or -
export function formatModifier(modifier: number): string {
	return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Calculate proficiency bonus from level
export function getProficiencyBonus(level: number): number {
	return Math.ceil(level / 4) + 1;
}

// Calculate skill modifier
export function getSkillModifier(
	abilityScore: number,
	proficient: boolean,
	expertise: boolean,
	proficiencyBonus: number
): number {
	const abilityMod = getAbilityModifier(abilityScore);
	let bonus = abilityMod;
	
	if (expertise) {
		bonus += proficiencyBonus * 2;
	} else if (proficient) {
		bonus += proficiencyBonus;
	}
	
	return bonus;
}

// Calculate saving throw modifier
export function getSavingThrowModifier(
	abilityScore: number,
	proficient: boolean,
	proficiencyBonus: number
): number {
	const abilityMod = getAbilityModifier(abilityScore);
	return proficient ? abilityMod + proficiencyBonus : abilityMod;
}

// Calculate spell save DC
export function getSpellSaveDC(
	spellcastingAbilityScore: number,
	proficiencyBonus: number
): number {
	return 8 + getAbilityModifier(spellcastingAbilityScore) + proficiencyBonus;
}

// Calculate spell attack bonus
export function getSpellAttackBonus(
	spellcastingAbilityScore: number,
	proficiencyBonus: number
): number {
	return getAbilityModifier(spellcastingAbilityScore) + proficiencyBonus;
}

// Calculate initiative modifier
export function getInitiativeModifier(dexScore: number): number {
	return getAbilityModifier(dexScore);
}

// Calculate passive perception
export function getPassivePerception(
	wisScore: number,
	proficient: boolean,
	proficiencyBonus: number
): number {
	const perceptionMod = getSkillModifier(wisScore, proficient, false, proficiencyBonus);
	return 10 + perceptionMod;
}

// D&D 5e Skills list
export const SKILLS = [
	{ name: 'Acrobatics', ability: 'dex' as const },
	{ name: 'Animal Handling', ability: 'wis' as const },
	{ name: 'Arcana', ability: 'int' as const },
	{ name: 'Athletics', ability: 'str' as const },
	{ name: 'Deception', ability: 'cha' as const },
	{ name: 'History', ability: 'int' as const },
	{ name: 'Insight', ability: 'wis' as const },
	{ name: 'Intimidation', ability: 'cha' as const },
	{ name: 'Investigation', ability: 'int' as const },
	{ name: 'Medicine', ability: 'wis' as const },
	{ name: 'Nature', ability: 'int' as const },
	{ name: 'Perception', ability: 'wis' as const },
	{ name: 'Performance', ability: 'cha' as const },
	{ name: 'Persuasion', ability: 'cha' as const },
	{ name: 'Religion', ability: 'int' as const },
	{ name: 'Sleight of Hand', ability: 'dex' as const },
	{ name: 'Stealth', ability: 'dex' as const },
	{ name: 'Survival', ability: 'wis' as const }
];

// Common D&D conditions
export const CONDITIONS = [
	'Blinded',
	'Charmed',
	'Deafened',
	'Frightened',
	'Grappled',
	'Incapacitated',
	'Invisible',
	'Paralyzed',
	'Petrified',
	'Poisoned',
	'Prone',
	'Restrained',
	'Stunned',
	'Unconscious'
];

// Damage types
export const DAMAGE_TYPES = [
	'Acid',
	'Bludgeoning',
	'Cold',
	'Fire',
	'Force',
	'Lightning',
	'Necrotic',
	'Piercing',
	'Poison',
	'Psychic',
	'Radiant',
	'Slashing',
	'Thunder'
];

// Create a blank character template
export function createBlankCharacter(): Character {
	const now = Date.now();
	return {
		id: crypto.randomUUID(),
		name: 'New Character',
		race: '',
		class: '',
		level: 1,
		background: '',
		alignment: '',
		experiencePoints: 0,
		
		abilityScores: {
			str: 10,
			dex: 10,
			con: 10,
			int: 10,
			wis: 10,
			cha: 10
		},
		
		hp: {
			current: 10,
			max: 10,
			temp: 0
		},
		ac: 10,
		initiativeBonus: 0,
		speed: 30,
		
		proficiencyBonus: 2,
		savingThrows: {
			str: { ability: 'str', proficient: false },
			dex: { ability: 'dex', proficient: false },
			con: { ability: 'con', proficient: false },
			int: { ability: 'int', proficient: false },
			wis: { ability: 'wis', proficient: false },
			cha: { ability: 'cha', proficient: false }
		},
		skills: SKILLS.map(skill => ({
			name: skill.name,
			ability: skill.ability,
			proficient: false,
			expertise: false
		})),
		
		weapons: [],
		
		spellcastingAbility: null,
		spellSaveDC: 0,
		spellAttackBonus: 0,
		spells: [],
		spellSlots: {
			level1: { current: 0, max: 0 },
			level2: { current: 0, max: 0 },
			level3: { current: 0, max: 0 },
			level4: { current: 0, max: 0 },
			level5: { current: 0, max: 0 },
			level6: { current: 0, max: 0 },
			level7: { current: 0, max: 0 },
			level8: { current: 0, max: 0 },
			level9: { current: 0, max: 0 }
		},
		
		equipment: [],
		currency: {
			cp: 0,
			sp: 0,
			ep: 0,
			gp: 0,
			pp: 0
		},
		
		features: [],
		traits: [],
		
		position: null,
		initiativeRoll: null,
		turnStatus: {
			action: false,
			bonusAction: false,
			movement: false,
			reaction: false
		},
		conditions: [],
		concentrating: false,
		
		notes: '',
		
		color: '#8b5cf6',
		isNPC: false,
		createdAt: now,
		updatedAt: now
	};
}

// Calculate distance between two positions (in grid squares)
export function calculateDistance(
	pos1: { x: number; y: number },
	pos2: { x: number; y: number }
): number {
	// Using D&D 5e diagonal movement rules (every other diagonal costs 2 squares)
	const dx = Math.abs(pos2.x - pos1.x);
	const dy = Math.abs(pos2.y - pos1.y);
	
	const diagonals = Math.min(dx, dy);
	const straight = Math.max(dx, dy) - diagonals;
	
	// Every other diagonal costs 2 squares
	const diagonalCost = Math.floor(diagonals / 2) * 3 + (diagonals % 2);
	
	return straight + diagonalCost;
}
