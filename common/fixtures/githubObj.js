import { get } from "lodash";

/**
 * @class GitHubOrganization represents a GitHub Organization
 */
export class GitHubOrganization {
  constructor(params = {}) {
    Object.assign(this, params);
  }

  /**
   * from assigns raw GitHub response into business-specific GitHub Organization object
   * @param {*} json Raw JSON params to this object
   * @returns {GitHubOrganization} GitHub Organization object
   */
  static from(json) {
    const login = get(json, "login");
    const description = get(json, "description");
    const avatarURL = get(json, "avatar_url");
    const githubURL = get(json, "html_url");
    const name = get(json, "name");
    return new GitHubOrganization({
      login,
      description,
      avatarURL,
      githubURL,
      name,
    });
  }
}

/**
 * @class GitHubRepository represents a GitHub Repository
 */
export class GitHubRepository {
  constructor(params = {}) {
    Object.assign(this, params);
  }

  /**
   * from assigns raw GitHub response into business-specific GitHub Repository object
   * @param {*} json Raw JSON params to this object
   * @returns {GitHubRepository} GitHub Repository object
   */
  static from(json) {
    const name = get(json, "name");
    const fullName = get(json, "full_name");
    const githubURL = get(json, "html_url");
    const stargazersCount = get(json, "stargazers_count", 0);
    const forksCount = get(json, "forks_count", 0);
    const watchersCount = get(json, "watchers_count", 0);
    const openIssuesCount = get(json, "open_issues_count", 0);
    const size = get(json, "size", 0);
    const language = get(json, "language");

    return new GitHubRepository({
      name,
      fullName,
      githubURL,
      stargazersCount,
      forksCount,
      watchersCount,
      openIssuesCount,
      size,
      language,
    });
  }
}

/**
 * @class GitHubCommit represents a GitHub Commit object
 */
export class GitHubCommit {
  constructor(params = {}) {
    Object.assign(this, params);
  }

  /**
   * from assigns raw GitHub response into business-specific GitHub Commit object
   * @param {*} json Raw JSON params to this object
   * @returns {GitHubCommit} GitHub Commit object
   */
  static from(json) {
    const sha = get(json, "sha");
    const githubURL = get(json, "html_url");
    const message = get(json, "commit.message");
    const author = get(json, "commit.author");
    const authorDetail = get(json, "author");
    const authorLogin = get(authorDetail, "login");
    const authorURL = get(authorDetail, "html_url");
    const avatarURL = get(authorDetail, "avatar_url");
    Object.assign(author, {
      login: authorLogin,
      authorURL,
      avatarURL,
    });
    return new GitHubCommit({
      sha,
      githubURL,
      author,
      message,
    });
  }
}
