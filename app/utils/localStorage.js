export const saveToLS = (name, value) => window.localStorage.setItem(name, value);
export const getFromLS = name => window.localStorage.getItem(name);
