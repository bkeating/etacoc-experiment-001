import { writable } from 'svelte/store';

/**
 * localStorage definitions; used to store data further below in localStorage
 */

const storedAppearance = localStorage.getItem('appearance') || 'light';
const storedShowDock = localStorage.getItem('showDock') || false;
const storedShowDrawer = localStorage.getItem('showDrawer') || false;

/**
 * Application state definitions; all things UI related
 */

export const appearance = writable(storedAppearance);
export const showSplash = writable(true);
export const showDock = writable(storedShowDock);
export const showDrawer = writable(storedShowDrawer);
export const currentDrawerSlug = writable('');

/**
 * Map / Geo-specific state definitions;
 */

export const mapComponent = writable(null);
export const mapStyle = writable('mapbox://styles/mapbox/satellite-v9');
export const isRotating = writable(false);

/**
 * A place where it's OK to be sloppy. GFY; xo.
 */

export const lng = writable(-88.4051);
export const lat = writable(42.7853);
export const pitch = writable(12);
export const bearing = writable(-17);


/**
 * Subscriptions / Side-effects
 */

appearance.subscribe(value => {
  localStorage.setItem("appearance", value)
  if (value === 'dark') {
    document.documentElement.classList.add('dark');
    // mapStyle.set('mapbox://styles/mapbox/dark-v10');
  } else {
    document.documentElement.classList.remove('dark');
    // mapStyle.set('mapbox://styles/mapbox/outdoors-v11');
  };
});
