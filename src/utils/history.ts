import { SavedNote, ModuleId } from '../types/clinical';

const STORAGE_KEY = 'enfermeria_notes_history_v1';
const MAX_HISTORY = 30;

export function getSavedNotes(): SavedNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading saved notes from localStorage:', err);
    return [];
  }
}

export function saveNoteToHistory(
  moduleId: ModuleId,
  moduleName: string,
  noteText: string,
  summary: string = ''
): SavedNote {
  const current = getSavedNotes();
  const newNote: SavedNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    moduleId,
    moduleName,
    timestamp: Date.now(),
    noteText,
    summary: summary || noteText.substring(0, 100).replace(/\n/g, ' ') + '...',
  };

  // Avoid identical consecutive duplicates
  if (current.length > 0 && current[0].noteText.trim() === noteText.trim()) {
    return current[0];
  }

  const updated = [newNote, ...current].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving note to localStorage:', err);
  }

  return newNote;
}

export function deleteSavedNote(id: string): SavedNote[] {
  const current = getSavedNotes();
  const updated = current.filter((n) => n.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting note from localStorage:', err);
  }
  return updated;
}

export function clearAllSavedNotes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing notes from localStorage:', err);
  }
}
