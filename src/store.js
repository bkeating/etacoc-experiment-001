import { writable, derived } from 'svelte/store';


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
export const showDock = writable(storedShowDock);
export const showDrawer = writable(storedShowDrawer);

/**
 * A place where it's OK to be sloppy. GFY.
 */

export const mapComponent = writable(null);
export const mapStyle = writable('mapbox://styles/mapbox/outdoors-v11');
export const lng = writable(-88.4051);
export const lat = writable(42.7853);
export const pitch = writable(12);
export const bearing = writable(-17);

