import { CaseData, ChatMessage } from '../types';

const CURRENT_CASE_KEY = 'verum_omnis_current_case';
const CASES_LIST_KEY = 'verum_omnis_cases';

export const caseService = {
  // Get current active case
  getCurrentCase(): CaseData | null {
    try {
      const caseJson = localStorage.getItem(CURRENT_CASE_KEY);
      if (!caseJson) return null;
      return JSON.parse(caseJson);
    } catch (error) {
      console.error('Error loading current case:', error);
      return null;
    }
  },

  // Save current case
  saveCurrentCase(caseData: CaseData): void {
    try {
      caseData.updatedAt = new Date().toISOString();
      localStorage.setItem(CURRENT_CASE_KEY, JSON.stringify(caseData));
      
      // Also update in cases list
      this.updateCaseInList(caseData);
    } catch (error) {
      console.error('Error saving case:', error);
    }
  },

  // Create a new case
  createNewCase(name?: string): CaseData {
    const now = new Date().toISOString();
    const newCase: CaseData = {
      id: `case_${Date.now()}`,
      name: name || `Case ${new Date().toLocaleDateString()}`,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    
    this.saveCurrentCase(newCase);
    return newCase;
  },

  // Clear current case (start fresh)
  clearCurrentCase(): void {
    try {
      localStorage.removeItem(CURRENT_CASE_KEY);
    } catch (error) {
      console.error('Error clearing case:', error);
    }
  },

  // Get all saved cases
  getAllCases(): CaseData[] {
    try {
      const casesJson = localStorage.getItem(CASES_LIST_KEY);
      if (!casesJson) return [];
      return JSON.parse(casesJson);
    } catch (error) {
      console.error('Error loading cases:', error);
      return [];
    }
  },

  // Update case in the list
  updateCaseInList(caseData: CaseData): void {
    try {
      const cases = this.getAllCases();
      const index = cases.findIndex(c => c.id === caseData.id);
      
      if (index >= 0) {
        cases[index] = caseData;
      } else {
        cases.push(caseData);
      }
      
      localStorage.setItem(CASES_LIST_KEY, JSON.stringify(cases));
    } catch (error) {
      console.error('Error updating case list:', error);
    }
  },

  // Load a specific case
  loadCase(caseId: string): CaseData | null {
    const cases = this.getAllCases();
    const caseData = cases.find(c => c.id === caseId);
    
    if (caseData) {
      localStorage.setItem(CURRENT_CASE_KEY, JSON.stringify(caseData));
      return caseData;
    }
    
    return null;
  },

  // Delete a case
  deleteCase(caseId: string): void {
    try {
      const cases = this.getAllCases();
      const filtered = cases.filter(c => c.id !== caseId);
      localStorage.setItem(CASES_LIST_KEY, JSON.stringify(filtered));
      
      // If deleting current case, clear it
      const current = this.getCurrentCase();
      if (current && current.id === caseId) {
        this.clearCurrentCase();
      }
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  },

  // Build context string for AI from case history
  buildCaseContext(caseData: CaseData): string {
    if (!caseData.messages || caseData.messages.length === 0) {
      return '';
    }

    const messagesSummary = caseData.messages
      .slice(0, 10) // Include up to 10 most recent messages for context
      .map((msg, idx) => {
        const role = msg.role === 'user' ? 'User' : 'Verum Omnis';
        const timestamp = msg.timestamp ? ` [${new Date(msg.timestamp).toLocaleString()}]` : '';
        return `${idx + 1}. ${role}${timestamp}: ${msg.text.substring(0, 200)}${msg.text.length > 200 ? '...' : ''}`;
      })
      .join('\n');

    return `
ONGOING CASE CONTEXT:
Case Name: ${caseData.name}
Started: ${new Date(caseData.createdAt).toLocaleString()}
Total Messages: ${caseData.messages.length}

Recent Conversation History:
${messagesSummary}

Continue the analysis based on this ongoing case context.`;
  },
};
