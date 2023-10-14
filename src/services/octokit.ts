import { Octokit } from "octokit";

export enum DefaultRepoType {
  All = "all",
}

export enum OrgRepoType {
  Public = "public",
  Private = "private",
  Forks = "forks",
  Sources = "sources",
  Member = "member",
}

export enum UserRepoType {
  Owner = "owner",
  Member = "member",
}

export enum Sort {
  Full_name = "full_name",
  Created = "created",
  Updated = "updated",
  Pushed = "pushed",
}
export enum SortDirection {
  Default = "default",
  Asc = "asc",
  Desc = "desc",
}

const headers = {
  "X-GitHub-Api-Version": "2022-11-28",
};

export default class OctokitService {
  octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({});
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
