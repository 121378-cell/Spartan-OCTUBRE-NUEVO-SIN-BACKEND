// A key for storing the routine in localStorage. Using a constant prevents typos.
const LAST_ROUTINE_KEY = 'lastRoutine';

/**
 * Saves the last loaded routine to the browser's localStorage.
 *
 * @param {object} routine - The routine object to be saved.
 */
export function saveLastRoutine(routine: object): void {
  try {
    // localStorage can only store strings, so we serialize the object to JSON.
    const serializedRoutine = JSON.stringify(routine);
    localStorage.setItem(LAST_ROUTINE_KEY, serializedRoutine);
    console.log('Routine saved to localStorage.');
  } catch (error) {
    // This could happen if the object is not serializable or localStorage is full.
    console.error('Failed to save routine to localStorage:', error);
  }
}

/**
 * Loads the last saved routine from the browser's localStorage.
 *
 * @returns {object | null} The saved routine object, or null if not found or if
 *                          there's an error parsing the data.
 */
export function loadLastRoutine(): object | null {
  try {
    const serializedRoutine = localStorage.getItem(LAST_ROUTINE_KEY);

    // If no routine is found in storage, return null.
    if (serializedRoutine === null) {
      console.log('No routine found in localStorage.');
      return null;
    }

    // Parse the JSON string back into an object.
    const routine = JSON.parse(serializedRoutine);
    console.log('Routine loaded from localStorage:', routine);
    return routine;
  } catch (error) {
    // This could happen if the stored data is not valid JSON.
    console.error('Failed to load or parse routine from localStorage:', error);
    return null;
  }
}