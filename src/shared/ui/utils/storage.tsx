import * as applicationContext from './applicationContext';

export function get(name: string) {
  if (applicationContext.isQuipApp())
    return applicationContext.getUserPreferences(name);
  else return getLocalStorage(name);
}

export function set(name: string, value: string) {
  if (applicationContext.isQuipApp())
    applicationContext.setUserPreferences(name, value);
  else setLocalStorage(name, value);
}

function getLocalStorage(name: string) {
  return localStorage.getItem(name);
}

function setLocalStorage(name: string, value: string) {
  localStorage.setItem(name, value);
}
