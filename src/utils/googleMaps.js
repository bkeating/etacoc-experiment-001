/**
 * getLongName - get the long name of a place
 *
 * Google Maps queries return a payload that breaks down the users street
 * address into an array of objects. This is a helper to query that array.
 */
export const getLongName = (a, type) => {
  try {
    return a.filter((x) => x.types.some((g) => [type].includes(g)))[0].long_name;
  } catch (error) {
    return '';
  }
};
