// Helper function to generate a unique ID (alternatively use uuid package)
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Helper function to reorder an array of items
export const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper function to move an item from one array to another
export const move = <T>(
  source: T[],
  destination: T[],
  sourceIndex: number,
  destinationIndex: number
): { source: T[]; destination: T[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(sourceIndex, 1);

  destClone.splice(destinationIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
};