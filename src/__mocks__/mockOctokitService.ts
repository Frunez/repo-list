import { DefaultRepoType, OrgRepoType, Sort, SortDirection, UserRepoType } from "../services/octokit";

const headers = {
  "X-GitHub-Api-Version": "mock",
};

interface MockOctokit {
  request: jest.Mock;
}

class MockOctokit {
  request;

  constructor() {
    this.request = jest.fn();
  }
}

export default class OctokitService {
  octokit: MockOctokit;

  constructor() {
    this.octokit = new MockOctokit();
  }

  async listOrgRepos(
    org: string,
    type: DefaultRepoType | OrgRepoType,
    sort: Sort,
    direction: SortDirection,
    page: number
  ) {
    const repos = await this.octokit.request(`GET /orgs/{org}/repos`, {
      org,
      type,
      sort,
      direction: direction === SortDirection.Default ? undefined : direction,
      per_page: 10,
      page,
      headers,
    });

    return repos;
  }

  async listUserRepos(
    username: string,
    type: DefaultRepoType | UserRepoType,
    sort: Sort,
    direction: SortDirection,
    page: number
  ) {
    const repos = await this.octokit.request("GET /users/{username}/repos", {
      username,
      type,
      sort,
      direction: direction === SortDirection.Default ? undefined : direction,
      per_page: 10,
      page,
      headers,
    });

    return repos;
  }
}
