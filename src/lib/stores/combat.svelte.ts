import type { CombatTracker } from '$lib/types';
import { charactersStore } from './characters.svelte';

// Svelte 5 runes-based store for combat tracking
class CombatStore {
	tracker = $state<CombatTracker>({
		active: false,
		round: 0,
		currentTurnIndex: 0,
		participants: []
	});

	// Start combat
	startCombat(characterIds: string[]) {
		// Roll initiative for all participants
		const participants = characterIds.map(id => {
			const character = charactersStore.getCharacter(id);
			const initiativeBonus = character?.initiativeBonus || 0;
			const roll = this.rollD20() + initiativeBonus;
			
			// Update character's initiative roll
			if (character) {
				charactersStore.updateCharacter(id, { initiativeRoll: roll });
			}
			
			return {
				characterId: id,
				initiative: roll
			};
		});

		// Sort by initiative (highest first)
		participants.sort((a, b) => b.initiative - a.initiative);

		this.tracker = {
			active: true,
			round: 1,
			currentTurnIndex: 0,
			participants
		};

		// Reset turn status for all participants
		this.resetAllTurnStatuses();
	}

	// End combat
	endCombat() {
		this.tracker = {
			active: false,
			round: 0,
			currentTurnIndex: 0,
			participants: []
		};

		// Clear initiative rolls
		charactersStore.characters.forEach(char => {
			charactersStore.updateCharacter(char.id, { initiativeRoll: null });
		});
	}

	// Next turn
	nextTurn() {
		if (!this.tracker.active) return;

		// Reset current character's turn status
		this.resetCurrentTurnStatus();

		this.tracker.currentTurnIndex++;
		
		// If we've gone through all participants, start new round
		if (this.tracker.currentTurnIndex >= this.tracker.participants.length) {
			this.tracker.currentTurnIndex = 0;
			this.tracker.round++;
		}
	}

	// Previous turn
	previousTurn() {
		if (!this.tracker.active) return;

		this.tracker.currentTurnIndex--;
		
		if (this.tracker.currentTurnIndex < 0) {
			this.tracker.round = Math.max(1, this.tracker.round - 1);
			this.tracker.currentTurnIndex = this.tracker.participants.length - 1;
		}
	}

	// Get current character
	get currentCharacter() {
		if (!this.tracker.active || this.tracker.participants.length === 0) {
			return null;
		}
		const participantId = this.tracker.participants[this.tracker.currentTurnIndex]?.characterId;
		return participantId ? charactersStore.getCharacter(participantId) : null;
	}

	// Toggle turn status
	toggleAction(characterId: string) {
		const character = charactersStore.getCharacter(characterId);
		if (character) {
			charactersStore.updateCharacter(characterId, {
				turnStatus: {
					...character.turnStatus,
					action: !character.turnStatus.action
				}
			});
		}
	}

	toggleBonusAction(characterId: string) {
		const character = charactersStore.getCharacter(characterId);
		if (character) {
			charactersStore.updateCharacter(characterId, {
				turnStatus: {
					...character.turnStatus,
					bonusAction: !character.turnStatus.bonusAction
				}
			});
		}
	}

	toggleMovement(characterId: string) {
		const character = charactersStore.getCharacter(characterId);
		if (character) {
			charactersStore.updateCharacter(characterId, {
				turnStatus: {
					...character.turnStatus,
					movement: !character.turnStatus.movement
				}
			});
		}
	}

	toggleReaction(characterId: string) {
		const character = charactersStore.getCharacter(characterId);
		if (character) {
			charactersStore.updateCharacter(characterId, {
				turnStatus: {
					...character.turnStatus,
					reaction: !character.turnStatus.reaction
				}
			});
		}
	}

	// Reset turn status for current character
	private resetCurrentTurnStatus() {
		const current = this.currentCharacter;
		if (current) {
			charactersStore.updateCharacter(current.id, {
				turnStatus: {
					action: false,
					bonusAction: false,
					movement: false,
					reaction: false
				}
			});
		}
	}

	// Reset turn status for all participants
	private resetAllTurnStatuses() {
		this.tracker.participants.forEach(p => {
			charactersStore.updateCharacter(p.characterId, {
				turnStatus: {
					action: false,
					bonusAction: false,
					movement: false,
					reaction: false
				}
			});
		});
	}

	// Add participant to ongoing combat
	addParticipant(characterId: string) {
		if (!this.tracker.active) return;

		const character = charactersStore.getCharacter(characterId);
		if (!character) return;

		const initiativeBonus = character.initiativeBonus || 0;
		const roll = this.rollD20() + initiativeBonus;

		charactersStore.updateCharacter(characterId, { initiativeRoll: roll });

		const newParticipant = {
			characterId,
			initiative: roll
		};

		// Insert in initiative order
		let inserted = false;
		for (let i = 0; i < this.tracker.participants.length; i++) {
			if (roll > this.tracker.participants[i].initiative) {
				this.tracker.participants.splice(i, 0, newParticipant);
				inserted = true;
				
				// Adjust current turn index if needed
				if (i <= this.tracker.currentTurnIndex) {
					this.tracker.currentTurnIndex++;
				}
				break;
			}
		}

		if (!inserted) {
			this.tracker.participants.push(newParticipant);
		}
	}

	// Remove participant
	removeParticipant(characterId: string) {
		const index = this.tracker.participants.findIndex(p => p.characterId === characterId);
		if (index !== -1) {
			this.tracker.participants.splice(index, 1);
			
			// Adjust current turn index if needed
			if (index < this.tracker.currentTurnIndex) {
				this.tracker.currentTurnIndex--;
			} else if (index === this.tracker.currentTurnIndex) {
				// If removing current turn, move to next (or wrap)
				if (this.tracker.currentTurnIndex >= this.tracker.participants.length) {
					this.tracker.currentTurnIndex = 0;
				}
			}
		}
	}

	// Helper: Roll d20
	private rollD20(): number {
		return Math.floor(Math.random() * 20) + 1;
	}
}

// Export singleton instance
export const combatStore = new CombatStore();
