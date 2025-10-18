// D&D 5e Character Data Types

export interface AbilityScores {
	str: number;
	dex: number;
	con: number;
	int: number;
	wis: number;
	cha: number;
}

export interface HitPoints {
	current: number;
	max: number;
	temp: number;
}

export interface Skill {
	name: string;
	ability: keyof AbilityScores;
	proficient: boolean;
	expertise: boolean;
}

export interface SavingThrow {
	ability: keyof AbilityScores;
	proficient: boolean;
}

export interface Weapon {
	name: string;
	attackBonus: number;
	damage: string;
	damageType: string;
	properties: string[];
}

export interface Spell {
	name: string;
	level: number;
	school: string;
	castingTime: string;
	range: string;
	components: string;
	duration: string;
	description: string;
	prepared: boolean;
}

export interface SpellSlots {
	level1: { current: number; max: number };
	level2: { current: number; max: number };
	level3: { current: number; max: number };
	level4: { current: number; max: number };
	level5: { current: number; max: number };
	level6: { current: number; max: number };
	level7: { current: number; max: number };
	level8: { current: number; max: number };
	level9: { current: number; max: number };
}

export interface Equipment {
	name: string;
	quantity: number;
	weight: number;
	description: string;
}

export interface Feature {
	name: string;
	source: string; // class, race, feat, etc.
	description: string;
}

export interface Position {
	x: number;
	y: number;
}

export interface TurnStatus {
	action: boolean;
	bonusAction: boolean;
	movement: boolean;
	reaction: boolean;
}

export interface Character {
	id: string;
	name: string;
	race: string;
	class: string;
	level: number;
	background: string;
	alignment: string;
	experiencePoints: number;
	
	// Ability Scores
	abilityScores: AbilityScores;
	
	// Combat Stats
	hp: HitPoints;
	ac: number;
	initiativeBonus: number;
	speed: number;
	
	// Proficiencies
	proficiencyBonus: number;
	savingThrows: Record<keyof AbilityScores, SavingThrow>;
	skills: Skill[];
	
	// Combat
	weapons: Weapon[];
	
	// Spellcasting
	spellcastingAbility: keyof AbilityScores | null;
	spellSaveDC: number;
	spellAttackBonus: number;
	spells: Spell[];
	spellSlots: SpellSlots;
	
	// Inventory
	equipment: Equipment[];
	currency: {
		cp: number;
		sp: number;
		ep: number;
		gp: number;
		pp: number;
	};
	
	// Features & Traits
	features: Feature[];
	traits: string[];
	
	// Position & Combat Tracking
	position: Position | null;
	initiativeRoll: number | null;
	turnStatus: TurnStatus;
	conditions: string[];
	concentrating: boolean;
	
	// Notes
	notes: string;
	
	// Metadata
	color: string; // for visual distinction
	isNPC: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface DiceRoll {
	id: string;
	timestamp: number;
	dice: string; // e.g., "1d20", "2d6+3"
	result: number;
	rolls: number[]; // individual die results
	modifier: number;
	advantage: boolean;
	disadvantage: boolean;
	characterName?: string;
	purpose?: string; // e.g., "Attack", "Perception Check"
}

export interface CombatTracker {
	active: boolean;
	round: number;
	currentTurnIndex: number;
	participants: {
		characterId: string;
		initiative: number;
	}[];
}

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
