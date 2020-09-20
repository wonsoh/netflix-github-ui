import { mapValues } from "lodash";
import axios from "axios";
import Cors from "cors";
import getGithubClientInstance, {
  PaginationParams,
} from "../../common/client/github";
import axiosErrorHandler from "../../common/axiosErrorHandler";

const githubClient = getGithubClientInstance();
const ROUTE_NAME = "/api/github";

// we will perform this in an RPC style
const cors = Cors({
  methods: ["POST"],
});

// maps operations to request-response handlers
const apiMap = {
  listOrgs: async (req, res) => {
    const response = await githubClient.listOrganizations();
    const { status, data } = response;
    res.status(status);
    res.send(data);
  },
  getOrgByLogin: async (req, res) => {
    const { login } = req.body.payload;
    const response = await githubClient.getOrganizationByLogin(login);
    const { status, data } = response;
    res.status(status);
    res.send(data);
  },
  getReposForOrg: async (req, res) => {
    const { login } = req.body.payload;
    const { paginationParams } = req.body;
    const response = await githubClient.getRepositoriesForOrganization(
      login,
      PaginationParams.from(paginationParams)
    );
    const { status, data } = response;
    res.status(status);
    res.send(data);
  },
  getCommitsForRepo: async (req, res) => {
    const { repositoryFullName } = req.body.payload;
    const { paginationParams } = req.body;
    const response = await githubClient.getCommitsForRepository(
      repositoryFullName,
      PaginationParams.from(paginationParams)
    );
    const { status, data } = response;
    res.status(status);
    res.send(data);
  },
};

export const API_OPERATIONS = Object.freeze(
  mapValues(apiMap, (_, operation) => operation)
);

/**
 * Performs validation to only allow requests with certain types
 * @param {Request} req Request type for an API
 * @param {Response} res Response type for an API
 */
function validateRequest(req, res) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      if (!req.body || !req.body.payload || !apiMap[req.body.operation]) {
        // unsupported operation
        return reject(new Error("Unsupported operation"));
      }
      return resolve(result);
    });
  });
}

/**
 * Sends GitHub API Request for the middleware server--to be shared with browser-side client
 * @param {string} operation Type of operation to execute
 * @param {*} payload Payload to pass in
 * @param {PaginationParams} paginationParams Optional params for paginated requests
 */
export async function sendGitHubAPIRequest(
  operation,
  payload = {},
  paginationParams = new PaginationParams()
) {
  return axios.post(ROUTE_NAME, {
    operation,
    payload,
    paginationParams,
  });
}

export default async (req, res) => {
  try {
    await validateRequest(req, res);
    await apiMap[req.body.operation](req, res);
  } catch (error) {
    axiosErrorHandler(error, req, res);
  }
};
