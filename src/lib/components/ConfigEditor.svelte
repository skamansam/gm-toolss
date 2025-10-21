<script lang="ts">
	import { characterConfigStore } from '$lib/config/character-config.svelte';
	import type { SectionConfig, FieldConfig } from '$lib/config/character-config.svelte';

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();

	let editingSection: SectionConfig | null = $state(null);
	let newSectionName = $state('');
	let newFieldName = $state('');
	let newFieldType = $state<FieldConfig['type']>('text');

	function addNewSection() {
		if (!newSectionName.trim()) return;
		
		const newSection: SectionConfig = {
			id: `custom-${Date.now()}`,
			title: newSectionName,
			columns: 1,
			fields: []
		};
		
		characterConfigStore.addSection(newSection);
		newSectionName = '';
	}

	function removeSection(sectionId: string) {
		if (confirm('Are you sure you want to remove this section?')) {
			characterConfigStore.removeSection(sectionId);
		}
	}

	function addFieldToSection(sectionId: string) {
		if (!newFieldName.trim()) return;
		
		const newField: FieldConfig = {
			id: `${sectionId}-${Date.now()}`,
			label: newFieldName,
			type: newFieldType,
			defaultValue: newFieldType === 'number' ? 0 : ''
		};
		
		characterConfigStore.addField(sectionId, newField);
		newFieldName = '';
		newFieldType = 'text';
	}

	function removeField(sectionId: string, fieldId: string) {
		if (confirm('Are you sure you want to remove this field?')) {
			characterConfigStore.removeField(sectionId, fieldId);
		}
	}

	function exportConfig() {
		const data = characterConfigStore.exportConfig();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `character-config-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function importConfig() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const data = e.target?.result as string;
					if (characterConfigStore.importConfig(data)) {
						alert('Configuration imported successfully!');
					} else {
						alert('Failed to import configuration.');
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}

	function resetToDefault() {
		if (confirm('Reset to default D&D 5e configuration? This will remove all custom sections and fields.')) {
			characterConfigStore.resetToDefault();
		}
	}

	function moveSectionUp(index: number) {
		if (index === 0) return;
		const newOrder = [...characterConfigStore.config.order];
		[newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
		characterConfigStore.reorderSections(newOrder);
	}

	function moveSectionDown(index: number) {
		if (index === characterConfigStore.config.order.length - 1) return;
		const newOrder = [...characterConfigStore.config.order];
		[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
		characterConfigStore.reorderSections(newOrder);
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
	<div class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
		<!-- Header -->
		<div class="flex items-center justify-between p-6 border-b border-gray-700">
			<h2 class="text-2xl font-bold text-purple-400">Character Sheet Configuration</h2>
			<button
				onclick={onClose}
				class="p-2 hover:bg-gray-700 rounded transition-colors"
				aria-label="Close"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-6 space-y-6">
			<!-- Actions -->
			<div class="flex gap-2 flex-wrap">
				<button
					onclick={exportConfig}
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
				>
					Export Config
				</button>
				<button
					onclick={importConfig}
					class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
				>
					Import Config
				</button>
				<button
					onclick={resetToDefault}
					class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
				>
					Reset to Default
				</button>
			</div>

			<!-- Add New Section -->
			<div class="bg-gray-700 rounded-lg p-4">
				<h3 class="text-lg font-semibold mb-3">Add New Section</h3>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={newSectionName}
						placeholder="Section name..."
						class="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
					/>
					<button
						onclick={addNewSection}
						class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
					>
						Add Section
					</button>
				</div>
			</div>

			<!-- Sections List -->
			<div class="space-y-4">
				{#each characterConfigStore.getOrderedSections() as section, index}
					<div class="bg-gray-700 rounded-lg p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-lg font-semibold">{section.title}</h3>
							<div class="flex gap-2">
								<button
									onclick={() => moveSectionUp(index)}
									disabled={index === 0}
									class="p-2 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									title="Move up"
								>
									↑
								</button>
								<button
									onclick={() => moveSectionDown(index)}
									disabled={index === characterConfigStore.config.order.length - 1}
									class="p-2 hover:bg-gray-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									title="Move down"
								>
									↓
								</button>
								<button
									onclick={() => removeSection(section.id)}
									class="p-2 text-red-400 hover:bg-gray-600 rounded transition-colors"
									title="Remove section"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>

						<!-- Section Settings -->
						<div class="grid grid-cols-2 gap-3 mb-3 text-sm">
							<div>
								<label class="block text-gray-400 mb-1">Columns</label>
								<input
									type="number"
									value={section.columns || 1}
									oninput={(e) => characterConfigStore.updateSection(section.id, { columns: parseInt(e.currentTarget.value) || 1 })}
									min="1"
									max="4"
									class="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded"
								/>
							</div>
							<div class="flex items-end">
								<label class="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={section.collapsible || false}
										onchange={(e) => characterConfigStore.updateSection(section.id, { collapsible: e.currentTarget.checked })}
										class="w-4 h-4"
									/>
									<span class="text-gray-400">Collapsible</span>
								</label>
							</div>
						</div>

						<!-- Fields -->
						<div class="space-y-2 mb-3">
							<h4 class="text-sm font-semibold text-gray-400">Fields</h4>
							{#each section.fields as field}
								<div class="flex items-center gap-2 p-2 bg-gray-600 rounded">
									<span class="flex-1">{field.label}</span>
									<span class="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded">{field.type}</span>
									<button
										onclick={() => removeField(section.id, field.id)}
										class="p-1 text-red-400 hover:bg-gray-700 rounded transition-colors"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							{/each}
						</div>

						<!-- Add Field -->
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={newFieldName}
								placeholder="Field name..."
								class="flex-1 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm"
							/>
							<select
								bind:value={newFieldType}
								class="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-sm"
							>
								<option value="text">Text</option>
								<option value="number">Number</option>
								<option value="textarea">Textarea</option>
								<option value="checkbox">Checkbox</option>
								<option value="select">Select</option>
							</select>
							<button
								onclick={() => addFieldToSection(section.id)}
								class="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
							>
								Add Field
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
