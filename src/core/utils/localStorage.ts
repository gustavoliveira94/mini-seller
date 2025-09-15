export const STORAGE_KEYS = {
  FILTER_STATE: "seller-console-filters",
  OPPORTUNITIES: "seller-console-opportunities",
};

export const saveToStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);

  return item ? JSON.parse(item) : defaultValue;
};
