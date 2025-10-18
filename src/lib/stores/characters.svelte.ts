import type { Character } from '$lib/types';

// Svelte 5 runes-based store for characters
class CharactersStore {
	characters = $state<Character[]>([]);
	openTabs = $state<string[]>([]); // character IDs
	activeTabId = $state<string | null>(null);

	constructor() {
		// Load from localStorage on initialization
		if (typeof window !== 'undefined') {
			this.loadFromStorage();
		}
	}

	// Add a new character
	addCharacter(character: Character) {
		this.characters.push(character);
		this.openTab(character.id);
		this.saveToStorage();
	}

	// Update an existing character
	updateCharacter(id: string, updates: Partial<Character>) {
		const index = this.characters.findIndex(c => c.id === id);
		if (index !== -1) {
			this.characters[index] = {
				...this.characters[index],
				...updates,
				updatedAt: Date.now()
			};
			this.saveToStorage();
		}
	}

	// Delete a character
	deleteCharacter(id: string) {
		this.characters = this.characters.filter(c => c.id !== id);
		this.closeTab(id);
		this.saveToStorage();
	}

	// Get character by ID
	getCharacter(id: string): Character | undefined {
		return this.characters.find(c => c.id === id);
	}

	// Get active character
	get activeCharacter(): Character | undefined {
		if (!this.activeTabId) return undefined;
		return this.getCharacter(this.activeTabId);
	}

	// Tab management
	openTab(id: string) {
		if (!this.openTabs.includes(id)) {
			this.openTabs.push(id);
		}
		this.activeTabId = id;
	}

	closeTab(id: string) {
		const index = this.openTabs.indexOf(id);
		if (index !== -1) {
			this.openTabs.splice(index, 1);
			
			// If closing active tab, switch to another
			if (this.activeTabId === id) {
				this.activeTabId = this.openTabs.length > 0 
					? this.openTabs[this.openTabs.length - 1] 
					: null;
			}
		}
	}

	setActiveTab(id: string) {
		if (this.openTabs.includes(id)) {
			this.activeTabId = id;
		}
	}

	// Reorder tabs
	reorderTabs(fromIndex: number, toIndex: number) {
		const [removed] = this.openTabs.splice(fromIndex, 1);
		this.openTabs.splice(toIndex, 0, removed);
	}

	// Storage methods
	private saveToStorage() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('dnd-characters', JSON.stringify(this.characters));
			localStorage.setItem('dnd-open-tabs', JSON.stringify(this.openTabs));
			localStorage.setItem('dnd-active-tab', this.activeTabId || '');
		}
	}

	private loadFromStorage() {
		if (typeof window !== 'undefined') {
			const charactersData = localStorage.getItem('dnd-characters');
			const tabsData = localStorage.getItem('dnd-open-tabs');
			const activeTabData = localStorage.getItem('dnd-active-tab');

			if (charactersData) {
				this.characters = JSON.parse(charactersData);
			}
			if (tabsData) {
				this.openTabs = JSON.parse(tabsData);
			}
			if (activeTabData) {
				this.activeTabId = activeTabData || null;
			}
		}
	}

	// Export/Import
	exportCharacters(): string {
		return JSON.stringify(this.characters, null, 2);
	}

	importCharacters(jsonData: string) {
		try {
			const imported = JSON.parse(jsonData) as Character[];
			this.characters = [...this.characters, ...imported];
			this.saveToStorage();
			return true;
		} catch (error) {
			console.error('Failed to import characters:', error);
			return false;
		}
	}

	// Clear all data
	clearAll() {
		this.characters = [];
		this.openTabs = [];
		this.activeTabId = null;
		this.saveToStorage();
	}
}

// Export singleton instance
export const charactersStore = new CharactersStore();
