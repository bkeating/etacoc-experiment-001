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

// mapbox://styles/mapbox/outdoors-v11
// mapbox://styles/mapbox/satellite-v9
// mapbox://styles/mapbox/streets-v11
// mapbox://styles/mapbox/light-v10
// mapbox://styles/mapbox/dark-v10
// mapbox://styles/mapbox/satellite-streets-v11
// mapbox://styles/mapbox/navigation-preview-day-v4
// mapbox://styles/mapbox/navigation-preview-night-v4
export const mapStyle = writable('mapbox://styles/mapbox/satellite-v9');

/**
 * A place where it's OK to be sloppy. GFY; xo.
 */

export const mapComponent = writable(null);
export const lng = writable(-88.4051);
export const lat = writable(42.7853);
export const pitch = writable(12);
export const bearing = writable(-17);

