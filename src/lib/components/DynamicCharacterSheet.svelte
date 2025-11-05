<script lang="ts">
	import type { Character } from '$lib/types';
	import { charactersStore } from '$lib/stores/characters.svelte';
	import { characterConfigStore } from '$lib/config/character-config.svelte';
	import type { SectionConfig, FieldConfig, ListItemProperty } from '$lib/config/character-config.svelte';

	interface Props {
		character: Character;
	}

	let { character }: Props = $props();

	let collapsedSections = $state<Set<string>>(new Set());

	function toggleSection(sectionId: string) {
		if (collapsedSections.has(sectionId)) {
			collapsedSections.delete(sectionId);
		} else {
			collapsedSections.add(sectionId);
		}
		collapsedSections = new Set(collapsedSections);
	}

	function updateCharacter(updates: Partial<Character>) {
		charactersStore.updateCharacter(character.id, updates);
	}

	function getFieldValue(fieldId: string): any {
		// Map field IDs to character properties
		const mapping: Record<string, any> = {
			'name': character.name,
			'class': character.class,
			'level': character.level,
			'race': character.race,
			'background': character.background,
			'alignment': character.alignment,
			'str': character.abilityScores.str,
			'dex': character.abilityScores.dex,
			'con': character.abilityScores.con,
			'int': character.abilityScores.int,
			'wis': character.abilityScores.wis,
			'cha': character.abilityScores.cha,
			'ac': character.ac,
			'hp-current': character.hp.current,
			'hp-max': character.hp.max,
			'hp-temp': character.hp.temp,
			'initiative': character.initiativeBonus,
			'speed': character.speed,
			'proficiency': character.proficiencyBonus,
			'notes': character.notes,
		};
		return mapping[fieldId];
	}

	function setFieldValue(fieldId: string, value: any) {
		const updates: Partial<Character> = {};
		
		// Map field IDs to character properties
		switch (fieldId) {
			case 'name': updates.name = value; break;
			case 'class': updates.class = value; break;
			case 'level': updates.level = parseInt(value) || 1; break;
			case 'race': updates.race = value; break;
			case 'background': updates.background = value; break;
			case 'alignment': updates.alignment = value; break;
			case 'str':
			case 'dex':
			case 'con':
			case 'int':
			case 'wis':
			case 'cha':
				updates.abilityScores = { ...character.abilityScores, [fieldId]: parseInt(value) || 10 };
				break;
			case 'ac': updates.ac = parseInt(value) || 10; break;
			case 'hp-current':
				updates.hp = { ...character.hp, current: parseInt(value) || 0 };
				break;
			case 'hp-max':
				updates.hp = { ...character.hp, max: parseInt(value) || 0 };
				break;
			case 'hp-temp':
				updates.hp = { ...character.hp, temp: parseInt(value) || 0 };
				break;
			case 'initiative': updates.initiativeBonus = parseInt(value) || 0; break;
			case 'speed': updates.speed = parseInt(value) || 30; break;
			case 'proficiency': updates.proficiencyBonus = parseInt(value) || 2; break;
			case 'notes': updates.notes = value; break;
		}
		
		if (Object.keys(updates).length > 0) {
			updateCharacter(updates);
		}
	}


	function getFieldWidth(width?: string, sectionColumns?: number): string {
		const cols = sectionColumns || 1;
		
		switch (width) {
			case 'full': return 'col-span-full';
			case 'half': return 'col-span-full sm:col-span-2';
			case 'third': return 'col-span-full sm:col-span-2 md:col-span-1';
			case 'quarter': return 'col-span-full md:col-span-1';
			default: return '';
		}
	}

	function getListItems(fieldId: string): Record<string, unknown>[] {
		const items = getFieldValue(fieldId);
		return Array.isArray(items) ? items : [];
	}

	function addListItem(fieldId: string, properties: ListItemProperty[]) {
		const items = getListItems(fieldId);
		const newItem: Record<string, unknown> = { id: Date.now().toString() };
		
		// Initialize with default values
		properties.forEach(prop => {
			switch (prop.type) {
				case 'checkbox':
					newItem[prop.id] = false;
					break;
				case 'number':
					newItem[prop.id] = 0;
					break;
				default:
					newItem[prop.id] = '';
			}
		});
		
		items.push(newItem);
		setFieldValue(fieldId, items);
	}

	function removeListItem(fieldId: string, itemId: string) {
		const items = getListItems(fieldId);
		const filteredItems = items.filter(item => item.id !== itemId);
		setFieldValue(fieldId, filteredItems);
	}

	function updateListItem(fieldId: string, itemId: string, propertyId: string, value: unknown) {
		const items = getListItems(fieldId);
		const item = items.find(item => item.id === itemId);
		if (item) {
			item[propertyId] = value;
			setFieldValue(fieldId, items);
		}
	}
</script>

<div class="max-w-5xl mx-auto space-y-6">
	{#each characterConfigStore.getOrderedSections() as section}
		<div class="bg-gray-800 rounded-lg overflow-hidden">
			<!-- Section Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-700">
				<h3 class="text-lg font-bold text-purple-400">{section.title}</h3>
				{#if section.collapsible}
					<button
						onclick={() => toggleSection(section.id)}
						class="p-2 hover:bg-gray-700 rounded transition-colors"
					>
						<svg
							class="w-5 h-5 transition-transform {collapsedSections.has(section.id) ? '' : 'rotate-180'}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				{/if}
			</div>

			<!-- Section Content -->
			{#if !section.collapsible || !collapsedSections.has(section.id)}
				<div class="p-6">
					<div class="grid grid-cols-4 gap-4">
						{#each section.fields as field}
							<div data-width={field.width} data-field={JSON.stringify(field)} data-section={JSON.stringify(section)} class="{getFieldWidth(field.width, section.columns)}">
								<label for={field.id} class="block text-xs text-gray-400 mb-1">{field.label}</label>
								
								{#if field.type === 'text'}
									<input
										type="text"
										value={getFieldValue(field.id) || ''}
										oninput={(e) => setFieldValue(field.id, e.currentTarget.value)}
										placeholder={field.placeholder}
										class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								{:else if field.type === 'number'}
									<input
										type="number"
										value={getFieldValue(field.id) || 0}
										oninput={(e) => setFieldValue(field.id, e.currentTarget.value)}
										class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
								{:else if field.type === 'textarea'}
									<textarea
										value={getFieldValue(field.id) || ''}
										oninput={(e) => setFieldValue(field.id, e.currentTarget.value)}
										placeholder={field.placeholder}
										class="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
									></textarea>
								{:else if field.type === 'select' && field.options}
									<select
										value={getFieldValue(field.id) || ''}
										onchange={(e) => setFieldValue(field.id, e.currentTarget.value)}
										class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
									>
										<option value="">Select...</option>
										{#each field.options as option}
											<option value={option}>{option}</option>
										{/each}
									</select>
								{:else if field.type === 'checkbox'}
									<label class="flex items-center gap-2">
										<input
											type="checkbox"
											checked={getFieldValue(field.id) || false}
											onchange={(e) => setFieldValue(field.id, e.currentTarget.checked)}
											class="w-5 h-5"
										/>
										<span class="text-sm">{field.label}</span>
									</label>
								{:else if field.type === 'ability'}
									<div class="text-center p-4 bg-gray-700 rounded-lg">
										<div class="text-3xl font-bold mb-2">
											{Math.floor((getFieldValue(field.id) - 10) / 2) >= 0 ? '+' : ''}{Math.floor((getFieldValue(field.id) - 10) / 2)}
										</div>
										<input
											type="number"
											value={getFieldValue(field.id) || 10}
											oninput={(e) => setFieldValue(field.id, e.currentTarget.value)}
											class="w-16 mx-auto px-2 py-1 bg-gray-800 border border-gray-600 rounded text-center text-sm"
										/>
									</div>
								{:else if field.type === 'save'}
									{@const abilityScore = getFieldValue(field.id.replace('save-', '')) || 10}
									{@const modifier = Math.floor((abilityScore - 10) / 2)}
									{@const profBonus = getFieldValue('proficiency') || 2}
									{@const isProficient = getFieldValue(`${field.id}-prof`) || false}
									{@const total = modifier + (isProficient ? profBonus : 0)}
									<div class="flex items-center gap-2">
										<input
											type="checkbox"
											checked={isProficient}
											onchange={(e) => setFieldValue(`${field.id}-prof`, e.currentTarget.checked)}
											class="w-4 h-4"
										/>
										<div class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-center">
											{total >= 0 ? '+' : ''}{total}
										</div>
									</div>
								{:else if field.type === 'skill'}
									{@const skillToAbility = {
										'skill-acrobatics': 'dex',
										'skill-animal-handling': 'wis',
										'skill-arcana': 'int',
										'skill-athletics': 'str',
										'skill-deception': 'cha',
										'skill-history': 'int',
										'skill-insight': 'wis',
										'skill-intimidation': 'cha',
										'skill-investigation': 'int',
										'skill-medicine': 'wis',
										'skill-nature': 'int',
										'skill-perception': 'wis',
										'skill-performance': 'cha',
										'skill-persuasion': 'cha',
										'skill-religion': 'int',
										'skill-sleight-of-hand': 'dex',
										'skill-stealth': 'dex',
										'skill-survival': 'wis'
									}}
									{@const abilityKey = skillToAbility[field.id] || 'int'}
									{@const abilityScore = getFieldValue(abilityKey) || 10}
									{@const modifier = Math.floor((abilityScore - 10) / 2)}
									{@const profBonus = getFieldValue('proficiency') || 2}
									{@const isProficient = getFieldValue(`${field.id}-prof`) || false}
									{@const total = modifier + (isProficient ? profBonus : 0)}
									<div class="flex items-center gap-2">
										<input
											type="checkbox"
											checked={isProficient}
											onchange={(e) => setFieldValue(`${field.id}-prof`, e.currentTarget.checked)}
											class="w-4 h-4"
										/>
										<div class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-center">
											{total >= 0 ? '+' : ''}{total}
										</div>
									</div>
								{:else if field.type === 'list' && field.listProperties}
									<div class="space-y-4">
										<!-- Add Item Button -->
										<button
											onclick={() => addListItem(field.id, field.listProperties!)}
											class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
											</svg>
											{field.addButtonText || 'Add Item'}
										</button>

										<!-- List Items -->
										{#each getListItems(field.id) as item}
											<div class="p-4 bg-gray-700 rounded-lg border border-gray-600">
												<div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
													{#each field.listProperties as property}
														<div class="{getFieldWidth(property.width, 4)}">
															<label class="block text-xs text-gray-400 mb-1">{property.label}</label>
															
															{#if property.type === 'text'}
																<input
																	type="text"
																	value={item[property.id] || ''}
																	oninput={(e) => updateListItem(field.id, item.id, property.id, e.currentTarget.value)}
																	placeholder={property.placeholder}
																	class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
																/>
															{:else if property.type === 'number'}
																<input
																	type="number"
																	value={item[property.id] || 0}
																	oninput={(e) => updateListItem(field.id, item.id, property.id, e.currentTarget.value)}
																	class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
																/>
															{:else if property.type === 'textarea'}
																<textarea
																	value={item[property.id] || ''}
																	oninput={(e) => updateListItem(field.id, item.id, property.id, e.currentTarget.value)}
																	placeholder={property.placeholder}
																	class="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
																></textarea>
															{:else if property.type === 'select' && property.options}
																<select
																	value={item[property.id] || ''}
																	onchange={(e) => updateListItem(field.id, item.id, property.id, e.currentTarget.value)}
																	class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
																>
																	<option value="">Select...</option>
																	{#each property.options as option}
																		<option value={option}>{option}</option>
																	{/each}
																</select>
															{:else if property.type === 'checkbox'}
																<label class="flex items-center gap-2 mt-1">
																	<input
																		type="checkbox"
																		checked={item[property.id] || false}
																		onchange={(e) => updateListItem(field.id, item.id, property.id, e.currentTarget.checked)}
																		class="w-4 h-4"
																	/>
																	<span class="text-sm text-gray-300">{property.label}</span>
																</label>
															{/if}
														</div>
													{/each}
												</div>
												
												<!-- Remove Item Button -->
												<button
													onclick={() => removeListItem(field.id, item.id)}
													class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors flex items-center gap-1"
												>
													<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
													Remove
												</button>
											</div>
										{/each}
									</div>
								{:else}
									<div class="text-gray-500 text-sm">Unsupported field type: {field.type}</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
