import { Octokit } from "octokit";

export default class OctokitService {
  octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({});
  }

  async listOrgRepos(org: string) {
    return this.octokit.request(`GET /orgs/{org}/repos`, {
      org,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  }

  async listUserRepos(user: string) {
    return this.octokit.request("GET /users/{username}/repos", {
      username: user,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  }
}
