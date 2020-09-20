import axios from "axios";
import { map } from "lodash";
import {
  GitHubOrganization,
  GitHubRepository,
  GitHubCommit,
} from "../fixtures/githubObj";

const GITHUB_BASE_URL = "https://api.github.com";
const DEFAULT_ACCEPT_GITHUB_PARAM = "application/vnd.github.v3+json";
const MAX_RESULTS_PER_PAGE = 100;

let githubBaseRestClient = null;
let githubClientInstance = null;

/**
 * buildGithubBaseRestClient constructs base RESTful client for GitHub API
 * @returns {AxiosInstance} axios instance with wrapped GitHub API configurations
 */
const buildGithubBaseRestClient = () => {
  const headers = {
    Accept: DEFAULT_ACCEPT_GITHUB_PARAM,
    // you can supply your own GitHub for higher rate-limits
  };
  if (process.env.GITHUB_AUTH_TOKEN) {
    Object.assign(headers, {
      Authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`,
    });
  }
  if (!githubBaseRestClient) {
    githubBaseRestClient = axios.create({
      baseURL: GITHUB_BASE_URL,
      headers,
    });
  }
  return githubBaseRestClient;
};

/**
 * PaginationParams defines a pagination parameters
 * @param {Number} pageNum current page number
 * @param {Number} resultsPerPage Maximum results per page
 */
export function PaginationParams(
  pageNum = 1,
  resultsPerPage = MAX_RESULTS_PER_PAGE
) {
  this.pageNum = pageNum;
  this.resultsPerPage = resultsPerPage;
  this.parameterize = () => ({
    page: this.pageNum,
    per_page: this.resultsPerPage,
  });
}
/**
 * Creates a new instance of PaginationParams from the parameter object
 * @param {PaginationParams | *} params PaginationParams-like plain object
 */
PaginationParams.from = (params = new PaginationParams()) =>
  new PaginationParams(params.pageNum, params.resultsPerPage);

/**
 * @class GitHubClient is the data fetching client from GitHub API
 */
class GitHubClient {
  constructor() {
    this.restCli = buildGithubBaseRestClient();
  }

  /**
   * listOrganizations lists default organizations given from GitHub's "landing" root
   */
  async listOrganizations() {
    const { restCli } = this;
    const result = await restCli.get("/organizations");
    const { data, status } = result;
    const res = map(data, GitHubOrganization.from);
    return {
      data: res,
      status,
    };
  }

  /**
   * getOrganizationByLogin retrieves a particular organization by login name
   * @param {string} login Login of the organization
   */
  async getOrganizationByLogin(login) {
    const { restCli } = this;
    const result = await restCli.get(`/orgs/${login}`);
    const { data, status } = result;
    const res = GitHubOrganization.from(data);
    return {
      data: res,
      status,
    };
  }

  /**
   * getRepositoriesForOrganization retrieves a particular organization's repositories
   * by its login name
   * @param {string} login Login of the organization
   * @param {PaginationParams} paginationParams defines parameterizations of pagination informations
   */
  async getRepositoriesForOrganization(
    login,
    paginationParams = new PaginationParams()
  ) {
    const { restCli } = this;
    const result = await restCli.get(`/orgs/${login}/repos`, {
      params: {
        ...paginationParams.parameterize(),
      },
    });
    const { data, status } = result;
    const res = map(data, GitHubRepository.from);
    return {
      data: res,
      status,
    };
  }

  /**
   * getCommitsForRepository returns commits for repository given a full name of repository
   * @param {string} repositoryFullName Full name of the repository in <org/repo_name> format
   * @param {PaginationParams} paginationParams defines parameterizations of pagination informations
   */
  async getCommitsForRepository(
    repositoryFullName,
    paginationParams = new PaginationParams()
  ) {
    const { restCli } = this;
    const result = await restCli.get(`repos/${repositoryFullName}/commits`, {
      params: {
        ...paginationParams.parameterize(),
      },
    });
    const { data, status } = result;
    const res = map(data, GitHubCommit.from);
    return {
      data: res,
      status,
    };
  }
}

/**
 * getGitHubClientInstance returns GitHub Client singleton instance;
 * only constructs when not initialized
 */
export default function getGitHubClientInstance() {
  if (!githubClientInstance) {
    githubClientInstance = new GitHubClient();
  }
  return githubClientInstance;
}
