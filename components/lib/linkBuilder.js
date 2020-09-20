const PATHNAMES = Object.freeze({
  ORG: "/org",
  COMMITS: "/commits",
});

/**
 * Generates link for org page
 * @param login Login parameter for organization
 */
export function generateOrgLink(login) {
  return `${PATHNAMES.ORG}/${login}`;
}

/**
 * Generates link for commits page
 * @param repo Full name of the repository
 */
export function generateCommitsLink(repo) {
  return `${PATHNAMES.COMMITS}/${repo}`;
}
