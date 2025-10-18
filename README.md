# D&D Game Master Toolkit

A comprehensive Dungeons & Dragons 5th Edition Game Master tool built with Svelte 5 and SvelteKit. This application helps Dungeon Masters efficiently manage multiple characters, track combat turns, manage positions on the battlefield, and roll dice—all in one intuitive interface.

## 🎲 Overview

The D&D GM Toolkit is designed to streamline the game master experience by providing a centralized hub for managing all aspects of character tracking during gameplay. Whether you're running a combat encounter with multiple NPCs or keeping track of your party's stats, this tool keeps everything organized and accessible.

## ✨ Key Features

### 📋 Character Management
- **Complete Character Sheets**: Store all standard D&D 5e character data including:
  - Basic info (name, race, class, level, background)
  - Ability scores (STR, DEX, CON, INT, WIS, CHA) with automatic modifier calculation
  - Combat stats (AC, HP, initiative, speed)
  - Saving throws and skills with proficiency tracking
  - Equipment, weapons, and inventory
  - Spells and spell slots
  - Features, traits, and notes
  
- **Multi-Character Tabbed Interface**: Easily switch between multiple characters using an intuitive tab system. Perfect for managing:
  - Player characters (PCs)
  - Non-player characters (NPCs)
  - Monsters and enemies
  - Allies and companions

### ⚔️ Combat Management
- **Turn Sequence Tracker**: Visual turn order with checkboxes to track:
  - Initiative order (automatically sorted)
  - Current turn indicator
  - Action, Bonus Action, Movement, and Reaction status
  - Concentration tracking
  - Conditions and status effects
  
- **Map Position Tracking**: Keep track of where each character is positioned on the battlefield with:
  - Grid-based positioning system
  - Distance calculator
  - Quick reference for movement ranges
  - Visual indicators for character locations

### 🎲 Integrated Dice Roller
- **Quick Dice Picker**: Right-side panel with instant access to:
  - Standard polyhedral dice (d4, d6, d8, d10, d12, d20, d100)
  - Multiple dice rolls (e.g., 2d6, 3d8)
  - Modifier support (+/- to rolls)
  - Advantage/Disadvantage for d20 rolls
  - Roll history log
  - Quick roll buttons for common checks

### 🗂️ Navigation Menu
- **Left-Side Menu**: Quick access to:
  - Character list with search/filter
  - Add new character
  - Import/Export characters
  - Combat tracker toggle
  - Settings and preferences
  - Help and quick reference

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm (or npm/yarn)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start the development server**
   ```bash
   pnpm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
pnpm run build
```

The built files will be ready to deploy to any static hosting service or adapter-specific platform.

## 📖 How to Use

### Creating Your First Character

1. **Open the Menu**: Click the menu icon (☰) on the left side
2. **Add Character**: Click the "+ New Character" button
3. **Fill in Details**: Enter character information:
   - Start with basic info (name, class, race, level)
   - Set ability scores (the app will calculate modifiers automatically)
   - Add combat stats (AC, HP, initiative bonus)
   - Fill in skills, saving throws, and proficiencies
4. **Save**: The character is automatically saved to local storage

### Managing Multiple Characters

- **Switch Characters**: Click on character tabs at the top to switch between sheets
- **Reorder Tabs**: Drag and drop tabs to reorder them
- **Close Tabs**: Click the × on a tab to close it (character data is preserved)
- **Search Characters**: Use the menu search to quickly find and open characters

### Running Combat

1. **Start Initiative**:
   - Open the combat tracker from the menu
   - Roll initiative for all characters (or enter manually)
   - Characters are automatically sorted by initiative

2. **Track Turns**:
   - The current turn is highlighted
   - Check off actions as they're used:
     - ☐ Action
     - ☐ Bonus Action
     - ☐ Movement
     - ☐ Reaction
   - Click "Next Turn" to advance to the next character
   - All checkboxes reset at the start of each character's turn

3. **Manage Positions**:
   - Click "Map View" to see the battlefield grid
   - Drag character tokens to move them
   - Distance is calculated automatically
   - Right-click for quick actions (attack, move, etc.)

### Rolling Dice

1. **Quick Rolls**: Click any dice button on the right panel
   - Single click: Roll once
   - Number input: Roll multiple dice (e.g., "3" then d6 = 3d6)
   
2. **Modifiers**: 
   - Use the +/- buttons to add modifiers
   - Or type directly (e.g., "1d20+5")

3. **Advantage/Disadvantage**:
   - Click "ADV" or "DIS" before rolling d20
   - Automatically rolls twice and takes higher/lower

4. **Roll from Sheet**:
   - Click any skill, save, or attack on a character sheet
   - The dice roller automatically sets up the correct roll

### Saving and Loading

- **Auto-Save**: All changes are automatically saved to browser local storage
- **Export Characters**: Menu → Export → Download JSON file
- **Import Characters**: Menu → Import → Select JSON file
- **Backup**: Regularly export your characters as a backup

## 🎨 Interface Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [☰ Menu]  [Character Tabs: Fighter | Wizard | Goblin | +] │
├──────┬──────────────────────────────────────────────┬───────┤
│      │                                              │       │
│ Menu │         Character Sheet Content              │ Dice  │
│      │                                              │ Roll  │
│ - PC │  ┌────────────────────────────────────┐     │       │
│ - NPC│  │ Name: Thorin Ironforge             │     │ d20   │
│ - Add│  │ Race: Dwarf  Class: Fighter  Lvl:5 │     │ d12   │
│      │  ├────────────────────────────────────┤     │ d10   │
│ Comb │  │ STR: 16 (+3)  DEX: 14 (+2)        │     │ d8    │
│ Track│  │ CON: 15 (+2)  INT: 10 (+0)        │     │ d6    │
│      │  │ WIS: 12 (+1)  CHA:  8 (-1)        │     │ d4    │
│ Map  │  ├────────────────────────────────────┤     │       │
│      │  │ AC: 18  HP: 45/45  Init: +2       │     │ [Mod] │
│ Sett │  │ Speed: 25ft                        │     │ [ADV] │
│      │  └────────────────────────────────────┘     │ [DIS] │
│      │                                              │       │
│      │  Turn Tracker:                              │ Hist: │
│      │  ☑ Action  ☐ Bonus  ☐ Move  ☐ React       │ 18    │
└──────┴──────────────────────────────────────────────┴───────┘
```

## 🔧 Technical Details

### Built With
- **Svelte 5**: Latest version with runes for reactive state management
- **SvelteKit**: Full-stack framework for routing and SSR capabilities
- **TypeScript**: Type-safe code for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Fast build tool and dev server
- **LocalStorage API**: Persistent data storage in the browser

### Data Structure
Characters are stored as JSON objects with the following structure:
```typescript
{
  id: string,
  name: string,
  race: string,
  class: string,
  level: number,
  abilityScores: { str, dex, con, int, wis, cha },
  hp: { current, max, temp },
  ac: number,
  initiative: number,
  // ... and more
}
```

## 🎯 Roadmap

Future features planned:
- [ ] Cloud sync for character data
- [ ] Shared sessions for remote play
- [ ] Monster stat block library
- [ ] Spell card database
- [ ] Custom dice macros
- [ ] Combat log export
- [ ] Dark mode theme
- [ ] Mobile responsive design
- [ ] PDF character sheet export

## 💡 Tips for Game Masters

1. **Pre-load NPCs**: Create common NPC stat blocks before your session
2. **Use Templates**: Duplicate similar characters to save time
3. **Color Code**: Use the character color picker to distinguish PCs from NPCs
4. **Quick Reference**: Keep the PHB quick reference in the notes section
5. **Initiative Macros**: Save common initiative modifiers for quick combat setup

## 🆘 Troubleshooting

**Characters not saving?**
- Check browser local storage isn't disabled
- Try exporting characters as backup
- Clear browser cache and reload

**Dice roller not working?**
- Refresh the page
- Check browser console for errors
- Ensure JavaScript is enabled

**Performance issues?**
- Limit open character tabs to 5-10
- Clear roll history periodically
- Use a modern browser

---

**Happy Gaming! May your rolls be high and your players engaged! 🎲⚔️🐉**
