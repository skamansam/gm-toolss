# Character Sheet Configuration Guide

The D&D GM Toolkit now supports fully configurable character sheets! You can customize trait categories, field names, and the entire UI layout to match your game system or preferences.

## Features

### ✨ Configurable Elements

- **Sections**: Create, remove, and reorder sections (e.g., "Basic Info", "Combat Stats", "Skills")
- **Fields**: Add custom fields with different types (text, number, textarea, checkbox, select)
- **Layout**: Control column counts and field widths
- **Collapsible Sections**: Make sections expandable/collapsible
- **Field Order**: Drag and drop to reorder sections

### 🎮 How to Configure

1. **Open Configuration Editor**
   - Click the ⚙️ (gear) icon in the top-right of the header
   - This opens the Character Sheet Configuration modal

2. **Add New Section**
   - Enter a section name in the "Add New Section" field
   - Click "Add Section"
   - The new section appears at the bottom of the list

3. **Configure Section Settings**
   - **Columns**: Set how many columns the section uses (1-4)
   - **Collapsible**: Toggle whether users can collapse/expand the section

4. **Add Fields to Section**
   - In each section, enter a field name
   - Select the field type:
     - **Text**: Single-line text input
     - **Number**: Numeric input
     - **Textarea**: Multi-line text area
     - **Checkbox**: Boolean checkbox
     - **Select**: Dropdown with options
   - Click "Add Field"

5. **Reorder Sections**
   - Use the ↑ and ↓ buttons to move sections up or down
   - The order determines how they appear on the character sheet

6. **Remove Elements**
   - Click the 🗑️ (trash) icon to remove sections or fields
   - Confirm the deletion when prompted

### 💾 Import/Export

**Export Configuration**
- Click "Export Config" to download your configuration as JSON
- Save this file to back up your custom layout
- Share with other GMs using the same system

**Import Configuration**
- Click "Import Config" and select a JSON file
- The configuration will replace your current setup
- Useful for loading pre-made configurations

**Reset to Default**
- Click "Reset to Default" to restore the D&D 5e configuration
- This removes all custom sections and fields

## Configuration Structure

### Field Types

```typescript
type FieldType = 
  | 'text'      // Single-line text input
  | 'number'    // Numeric input
  | 'textarea'  // Multi-line text area
  | 'checkbox'  // Boolean checkbox
  | 'select'    // Dropdown with options
  | 'ability'   // Special: Ability score with modifier
  | 'skill'     // Special: Skill with proficiency
  | 'save'      // Special: Saving throw
```

### Section Structure

```typescript
{
  id: string,              // Unique identifier
  title: string,           // Display name
  columns: number,         // 1-4 columns
  collapsible: boolean,    // Can be collapsed
  defaultCollapsed: boolean, // Start collapsed
  fields: FieldConfig[]    // Array of fields
}
```

### Field Structure

```typescript
{
  id: string,              // Unique identifier
  label: string,           // Display name
  type: FieldType,         // Field type
  placeholder?: string,    // Placeholder text
  options?: string[],      // For select fields
  defaultValue?: any,      // Default value
  width?: 'full' | 'half' | 'third' | 'quarter',
  rollable?: boolean,      // Can be clicked to roll dice
  calculated?: boolean     // Auto-calculated value
}
```

## Example Configurations

### Pathfinder 2e

```json
{
  "sections": [
    {
      "id": "basic-info",
      "title": "Character Details",
      "columns": 3,
      "fields": [
        { "id": "name", "label": "Name", "type": "text" },
        { "id": "ancestry", "label": "Ancestry", "type": "text" },
        { "id": "heritage", "label": "Heritage", "type": "text" },
        { "id": "class", "label": "Class", "type": "text" },
        { "id": "level", "label": "Level", "type": "number" }
      ]
    }
  ]
}
```

### Call of Cthulhu

```json
{
  "sections": [
    {
      "id": "characteristics",
      "title": "Characteristics",
      "columns": 2,
      "fields": [
        { "id": "str", "label": "Strength", "type": "number" },
        { "id": "con", "label": "Constitution", "type": "number" },
        { "id": "dex", "label": "Dexterity", "type": "number" },
        { "id": "int", "label": "Intelligence", "type": "number" },
        { "id": "pow", "label": "Power", "type": "number" },
        { "id": "app", "label": "Appearance", "type": "number" },
        { "id": "edu", "label": "Education", "type": "number" },
        { "id": "san", "label": "Sanity", "type": "number" }
      ]
    }
  ]
}
```

### Custom Homebrew

You can create completely custom sections for your homebrew system:

- **Reputation Tracks**: Add fields for different faction reputations
- **Stress & Trauma**: Track mental/physical stress separately
- **Custom Resources**: Mana, ki, rage, inspiration, etc.
- **Relationships**: Track bonds with NPCs
- **Quest Tracking**: Built-in quest log fields

## Storage

- Configurations are saved to browser localStorage
- Each browser/device has its own configuration
- Export your config to sync across devices
- Character data remains separate from configuration

## Tips

1. **Start Simple**: Begin with the default D&D 5e config and modify it
2. **Test Changes**: Create a test character to see how fields appear
3. **Back Up**: Export your config before making major changes
4. **Share**: Create configs for popular systems and share with the community
5. **Iterate**: You can always add/remove fields as your needs change

## Limitations

- Some field types (ability, skill, save) are tied to D&D 5e mechanics
- Custom field types cannot be created (yet)
- Field validation is basic - more complex rules require code changes
- Maximum 4 columns per section for layout purposes

## Future Enhancements

Planned features for future versions:

- [ ] Custom field types with formulas
- [ ] Conditional field visibility
- [ ] Field dependencies and calculations
- [ ] Templates for popular game systems
- [ ] Visual layout editor (drag & drop)
- [ ] Field validation rules
- [ ] Multi-page character sheets
- [ ] Print-friendly layouts

---

**Need Help?** Open an issue on GitHub or check the README for more information.
