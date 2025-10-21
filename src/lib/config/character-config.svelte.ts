// Configurable character sheet structure

export interface FieldConfig {
	id: string;
	label: string;
	type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'ability' | 'skill' | 'save';
	placeholder?: string;
	options?: string[];
	defaultValue?: any;
	width?: 'full' | 'half' | 'third' | 'quarter';
	rollable?: boolean;
	calculated?: boolean;
}

export interface SectionConfig {
	id: string;
	title: string;
	icon?: string;
	fields: FieldConfig[];
	columns?: number;
	collapsible?: boolean;
	defaultCollapsed?: boolean;
}

export interface LayoutConfig {
	sections: SectionConfig[];
	order: string[]; // section IDs in display order
}

// Default D&D 5e configuration
export const defaultCharacterConfig: LayoutConfig = {
	sections: [
		{
			id: 'basic-info',
			title: 'Basic Information',
			columns: 3,
			fields: [
				{ id: 'name', label: 'Character Name', type: 'text', width: 'full', defaultValue: 'New Character' },
				{ id: 'class', label: 'Class', type: 'text', width: 'half', defaultValue: '' },
				{ id: 'level', label: 'Level', type: 'number', width: 'half', defaultValue: 1 },
				{ id: 'race', label: 'Race', type: 'text', width: 'half', defaultValue: '' },
				{ id: 'background', label: 'Background', type: 'text', width: 'half', defaultValue: '' },
				{ id: 'alignment', label: 'Alignment', type: 'select', width: 'half', 
					options: ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'],
					defaultValue: '' 
				},
			]
		},
		{
			id: 'ability-scores',
			title: 'Ability Scores',
			columns: 3,
			fields: [
				{ id: 'str', label: 'Strength', type: 'ability', rollable: true, defaultValue: 10 },
				{ id: 'dex', label: 'Dexterity', type: 'ability', rollable: true, defaultValue: 10 },
				{ id: 'con', label: 'Constitution', type: 'ability', rollable: true, defaultValue: 10 },
				{ id: 'int', label: 'Intelligence', type: 'ability', rollable: true, defaultValue: 10 },
				{ id: 'wis', label: 'Wisdom', type: 'ability', rollable: true, defaultValue: 10 },
				{ id: 'cha', label: 'Charisma', type: 'ability', rollable: true, defaultValue: 10 },
			]
		},
		{
			id: 'combat-stats',
			title: 'Combat Stats',
			columns: 1,
			fields: [
				{ id: 'ac', label: 'Armor Class', type: 'number', defaultValue: 10 },
				{ id: 'hp-current', label: 'Current HP', type: 'number', defaultValue: 10 },
				{ id: 'hp-max', label: 'Max HP', type: 'number', defaultValue: 10 },
				{ id: 'hp-temp', label: 'Temp HP', type: 'number', defaultValue: 0 },
				{ id: 'initiative', label: 'Initiative Bonus', type: 'number', defaultValue: 0 },
				{ id: 'speed', label: 'Speed', type: 'number', defaultValue: 30 },
				{ id: 'proficiency', label: 'Proficiency Bonus', type: 'number', calculated: true, defaultValue: 2 },
			]
		},
		{
			id: 'saving-throws',
			title: 'Saving Throws',
			columns: 2,
			fields: [
				{ id: 'save-str', label: 'Strength', type: 'save', rollable: true },
				{ id: 'save-dex', label: 'Dexterity', type: 'save', rollable: true },
				{ id: 'save-con', label: 'Constitution', type: 'save', rollable: true },
				{ id: 'save-int', label: 'Intelligence', type: 'save', rollable: true },
				{ id: 'save-wis', label: 'Wisdom', type: 'save', rollable: true },
				{ id: 'save-cha', label: 'Charisma', type: 'save', rollable: true },
			]
		},
		{
			id: 'skills',
			title: 'Skills',
			columns: 2,
			collapsible: true,
			fields: [
				{ id: 'skill-acrobatics', label: 'Acrobatics', type: 'skill', rollable: true },
				{ id: 'skill-animal-handling', label: 'Animal Handling', type: 'skill', rollable: true },
				{ id: 'skill-arcana', label: 'Arcana', type: 'skill', rollable: true },
				{ id: 'skill-athletics', label: 'Athletics', type: 'skill', rollable: true },
				{ id: 'skill-deception', label: 'Deception', type: 'skill', rollable: true },
				{ id: 'skill-history', label: 'History', type: 'skill', rollable: true },
				{ id: 'skill-insight', label: 'Insight', type: 'skill', rollable: true },
				{ id: 'skill-intimidation', label: 'Intimidation', type: 'skill', rollable: true },
				{ id: 'skill-investigation', label: 'Investigation', type: 'skill', rollable: true },
				{ id: 'skill-medicine', label: 'Medicine', type: 'skill', rollable: true },
				{ id: 'skill-nature', label: 'Nature', type: 'skill', rollable: true },
				{ id: 'skill-perception', label: 'Perception', type: 'skill', rollable: true },
				{ id: 'skill-performance', label: 'Performance', type: 'skill', rollable: true },
				{ id: 'skill-persuasion', label: 'Persuasion', type: 'skill', rollable: true },
				{ id: 'skill-religion', label: 'Religion', type: 'skill', rollable: true },
				{ id: 'skill-sleight-of-hand', label: 'Sleight of Hand', type: 'skill', rollable: true },
				{ id: 'skill-stealth', label: 'Stealth', type: 'skill', rollable: true },
				{ id: 'skill-survival', label: 'Survival', type: 'skill', rollable: true },
			]
		},
		{
			id: 'features',
			title: 'Features & Traits',
			columns: 1,
			collapsible: true,
			fields: [
				{ id: 'features', label: 'Features & Traits', type: 'textarea', width: 'full', defaultValue: '' },
			]
		},
		{
			id: 'equipment',
			title: 'Equipment',
			columns: 1,
			collapsible: true,
			defaultCollapsed: true,
			fields: [
				{ id: 'equipment', label: 'Equipment & Inventory', type: 'textarea', width: 'full', defaultValue: '' },
			]
		},
		{
			id: 'spells',
			title: 'Spells',
			columns: 1,
			collapsible: true,
			defaultCollapsed: true,
			fields: [
				{ id: 'spells', label: 'Spells', type: 'textarea', width: 'full', defaultValue: '' },
			]
		},
		{
			id: 'notes',
			title: 'Notes',
			columns: 1,
			collapsible: true,
			defaultCollapsed: true,
			fields: [
				{ id: 'notes', label: 'Additional Notes', type: 'textarea', width: 'full', defaultValue: '' },
			]
		}
	],
	order: ['basic-info', 'ability-scores', 'combat-stats', 'saving-throws', 'skills', 'features', 'equipment', 'spells', 'notes']
};

// Configuration store
class CharacterConfigStore {
	config = $state<LayoutConfig>(defaultCharacterConfig);

	loadConfig() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('dnd-character-config');
			if (saved) {
				try {
					this.config = JSON.parse(saved);
				} catch (e) {
					console.error('Failed to load config:', e);
					this.config = defaultCharacterConfig;
				}
			}
		}
	}

	saveConfig() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('dnd-character-config', JSON.stringify(this.config));
		}
	}

	updateSection(sectionId: string, updates: Partial<SectionConfig>) {
		const section = this.config.sections.find(s => s.id === sectionId);
		if (section) {
			Object.assign(section, updates);
			this.saveConfig();
		}
	}

	addSection(section: SectionConfig) {
		this.config.sections.push(section);
		this.config.order.push(section.id);
		this.saveConfig();
	}

	removeSection(sectionId: string) {
		this.config.sections = this.config.sections.filter(s => s.id !== sectionId);
		this.config.order = this.config.order.filter(id => id !== sectionId);
		this.saveConfig();
	}

	reorderSections(newOrder: string[]) {
		this.config.order = newOrder;
		this.saveConfig();
	}

	addField(sectionId: string, field: FieldConfig) {
		const section = this.config.sections.find(s => s.id === sectionId);
		if (section) {
			section.fields.push(field);
			this.saveConfig();
		}
	}

	removeField(sectionId: string, fieldId: string) {
		const section = this.config.sections.find(s => s.id === sectionId);
		if (section) {
			section.fields = section.fields.filter(f => f.id !== fieldId);
			this.saveConfig();
		}
	}

	updateField(sectionId: string, fieldId: string, updates: Partial<FieldConfig>) {
		const section = this.config.sections.find(s => s.id === sectionId);
		if (section) {
			const field = section.fields.find(f => f.id === fieldId);
			if (field) {
				Object.assign(field, updates);
				this.saveConfig();
			}
		}
	}

	resetToDefault() {
		this.config = defaultCharacterConfig;
		this.saveConfig();
	}

	exportConfig(): string {
		return JSON.stringify(this.config, null, 2);
	}

	importConfig(jsonData: string): boolean {
		try {
			const imported = JSON.parse(jsonData);
			this.config = imported;
			this.saveConfig();
			return true;
		} catch (e) {
			console.error('Failed to import config:', e);
			return false;
		}
	}

	getSectionById(id: string): SectionConfig | undefined {
		return this.config.sections.find(s => s.id === id);
	}

	getOrderedSections(): SectionConfig[] {
		return this.config.order
			.map(id => this.getSectionById(id))
			.filter(s => s !== undefined) as SectionConfig[];
	}
}

export const characterConfigStore = new CharacterConfigStore();

// Load config on initialization
if (typeof window !== 'undefined') {
	characterConfigStore.loadConfig();
}
