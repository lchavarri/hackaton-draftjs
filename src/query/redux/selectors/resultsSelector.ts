export const hasResults = (state: any): boolean => {
  const { filters } = state;
  return filters.count && filters.count > 0;
};

export const hasCypher = (state: any): boolean => {
  const { filters } = state;
  return filters.displayResults && filters.displayResults.length > 0;
};
