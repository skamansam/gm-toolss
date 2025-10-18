import type { DiceRoll, DiceType } from '$lib/types';

// Svelte 5 runes-based store for dice rolling
class DiceStore {
	history = $state<DiceRoll[]>([]);
	modifier = $state<number>(0);
	advantage = $state<boolean>(false);
	disadvantage = $state<boolean>(false);
	diceCount = $state<number>(1);

	// Roll dice
	roll(
		diceType: DiceType,
		count: number = this.diceCount,
		mod: number = this.modifier,
		adv: boolean = this.advantage,
		dis: boolean = this.disadvantage,
		characterName?: string,
		purpose?: string
	): DiceRoll {
		const sides = parseInt(diceType.substring(1));
		const rolls: number[] = [];

		// Handle advantage/disadvantage for d20
		if (diceType === 'd20' && (adv || dis)) {
			const roll1 = this.rollDie(sides);
			const roll2 = this.rollDie(sides);
			rolls.push(roll1, roll2);
			
			// Take higher for advantage, lower for disadvantage
			const selectedRoll = adv ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
			const result = selectedRoll + mod;

			const diceRoll: DiceRoll = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				dice: `1${diceType}${mod !== 0 ? (mod > 0 ? `+${mod}` : mod) : ''}`,
				result,
				rolls: [selectedRoll],
				modifier: mod,
				advantage: adv,
				disadvantage: dis,
				characterName,
				purpose
			};

			this.addToHistory(diceRoll);
			return diceRoll;
		}

		// Normal roll
		for (let i = 0; i < count; i++) {
			rolls.push(this.rollDie(sides));
		}

		const sum = rolls.reduce((a, b) => a + b, 0);
		const result = sum + mod;

		const diceRoll: DiceRoll = {
			id: crypto.randomUUID(),
			timestamp: Date.now(),
			dice: `${count}${diceType}${mod !== 0 ? (mod > 0 ? `+${mod}` : mod) : ''}`,
			result,
			rolls,
			modifier: mod,
			advantage: false,
			disadvantage: false,
			characterName,
			purpose
		};

		this.addToHistory(diceRoll);
		return diceRoll;
	}

	// Roll from string (e.g., "2d6+3")
	rollFromString(diceString: string, characterName?: string, purpose?: string): DiceRoll | null {
		const match = diceString.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
		if (!match) return null;

		const count = parseInt(match[1]);
		const sides = parseInt(match[2]);
		const mod = match[3] ? parseInt(match[3]) : 0;

		const diceType = `d${sides}` as DiceType;
		return this.roll(diceType, count, mod, false, false, characterName, purpose);
	}

	// Quick roll methods
	rollD4(count: number = 1) { return this.roll('d4', count); }
	rollD6(count: number = 1) { return this.roll('d6', count); }
	rollD8(count: number = 1) { return this.roll('d8', count); }
	rollD10(count: number = 1) { return this.roll('d10', count); }
	rollD12(count: number = 1) { return this.roll('d12', count); }
	rollD20(count: number = 1) { return this.roll('d20', count); }
	rollD100(count: number = 1) { return this.roll('d100', count); }

	// Set modifiers
	setModifier(value: number) {
		this.modifier = value;
	}

	incrementModifier() {
		this.modifier++;
	}

	decrementModifier() {
		this.modifier--;
	}

	setAdvantage(value: boolean) {
		this.advantage = value;
		if (value) this.disadvantage = false;
	}

	setDisadvantage(value: boolean) {
		this.disadvantage = value;
		if (value) this.advantage = false;
	}

	toggleAdvantage() {
		this.setAdvantage(!this.advantage);
	}

	toggleDisadvantage() {
		this.setDisadvantage(!this.disadvantage);
	}

	setDiceCount(count: number) {
		this.diceCount = Math.max(1, count);
	}

	// Reset modifiers
	resetModifiers() {
		this.modifier = 0;
		this.advantage = false;
		this.disadvantage = false;
		this.diceCount = 1;
	}

	// History management
	private addToHistory(roll: DiceRoll) {
		this.history.unshift(roll);
		
		// Keep only last 50 rolls
		if (this.history.length > 50) {
			this.history = this.history.slice(0, 50);
		}

		this.saveHistory();
	}

	clearHistory() {
		this.history = [];
		this.saveHistory();
	}

	// Storage
	private saveHistory() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('dnd-dice-history', JSON.stringify(this.history));
		}
	}

	loadHistory() {
		if (typeof window !== 'undefined') {
			const data = localStorage.getItem('dnd-dice-history');
			if (data) {
				this.history = JSON.parse(data);
			}
		}
	}

	// Helper: Roll a single die
	private rollDie(sides: number): number {
		return Math.floor(Math.random() * sides) + 1;
	}
}

// Export singleton instance
export const diceStore = new DiceStore();

// Load history on initialization
if (typeof window !== 'undefined') {
	diceStore.loadHistory();
}
