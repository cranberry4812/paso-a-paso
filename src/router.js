// The router decides which page to show, based on the part of the
// address after "#". Examples:
//   https://pasoapaso.org/#/            -> Home
//   https://pasoapaso.org/#/families    -> Families
//   https://pasoapaso.org/#/missions/3  -> Missions, scrolled to Mission 3
//
// Why "#/" addresses (hash routing)?
//   - Everything after "#" stays in the browser; the server always sends the
//     same index.html. So it works on any static host with no server setup,
//     and it keeps working offline in Step 12.
//   - The trade-off is slightly less pretty addresses.

const routes = new Map();
let notFound = null;

/**
 * Registers a page.
 *   path: 'families' (or '' for Home)
 *   page: a function (param) => { title, node, scrollTo? }
 */
export function addRoute(path, page) {
  routes.set(path, page);
}

export function setNotFound(page) {
  notFound = page;
}

/** Reads the current address: '#/missions/3' -> { path: 'missions', param: '3' } */
export function currentRoute() {
  const hash = window.location.hash;
  const [path = '', param = null] = hash.replace(/^#\/?/, '').split('/');
  return { path, param };
}

/** Builds the address of a page, for links: href('families') -> '#/families' */
export function href(path, param) {
  return param ? `#/${path}/${param}` : `#/${path}`;
}

/** Finds the page for the current address and returns what it renders. */
export function resolve() {
  const { path, param } = currentRoute();
  const page = routes.get(path) ?? notFound;
  return { path: routes.has(path) ? path : null, ...page(param) };
}

/**
 * Old prototype links look like "#families" (no slash).
 * Turn them into "#/families" so shared links keep working.
 */
export function fixOldLinks() {
  const hash = window.location.hash;
  if (/^#[a-z]/.test(hash) && routes.has(hash.slice(1))) {
    window.location.replace(`#/${hash.slice(1)}`);
    return true;
  }
  return false;
}
