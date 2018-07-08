// https://stackoverflow.com/a/34750146
/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function mergeDeep(target, source) {
  if (isObject(target) && isObject(source)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}

/**
 * Given the file, retrieve the correct path for development & production
 * @param file
 * @returns {string}
 */
export function getPathFor(file) {
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/${file}`
    : `file://${__dirname}/${file}`;
}
