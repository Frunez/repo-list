import "react-dropdown/style.css";
import "./RepoSearch.css";
import "../App.css";

import React, { useContext, useEffect, useState } from "react";
import Dropdown from "react-dropdown";

import type { Repository } from "@octokit/webhooks-types";

import { AppContext } from "../AppContext";
import { DefaultRepoType, OrgRepoType, PER_PAGE_LIMIT, Sort, SortDirection, UserRepoType } from "../services/octokit";
import ErrorMessage from "./common/ErrorMessage";
import RepoList from "./RepoListComponents/RepoList";
import RepoListPageControl from "./RepoListComponents/RepoListPageControl";

enum SearchType {
  User = "user",
  Org = "organization",
}

export enum PageDirection {
  Prev = "prev",
  Next = "next",
}

export default function RepoSearch() {
  const appContext = useContext(AppContext);

  const [searchInput, setSearchInput] = useState("");
  const [searchRequest, setSearchRequest] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState([] as any[]);
  const [type, setType] = useState(SearchType.Org);
  const [repoType, setRepoType] = useState(DefaultRepoType.All);
  const [sort, setSort] = useState(Sort.Full_name);
  const [direction, setDirection] = useState(SortDirection.Desc);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (searchRequest.length === 0) return;

    getRepoList()
      .then((repos) => {
        if (repos && repos.length > 0) {
          setError(null);
          setRepos(repos);
          return;
        }

        setError(`No repositories found for ${searchRequest}`);
      })
      .catch(() => {
        setRepos([]);
        setError("Organization or user not found");
      });
  }, [searchRequest, page, type, repoType, sort, direction]);

  const handleTypeDropdownChange = (e: any) => {
    setType(e.value as SearchType);
    setRepoType(DefaultRepoType.All);
  };

  async function getRepoList(): Promise<Repository[] | undefined> {
    const response =
      type === SearchType.Org
        ? await appContext?.octokitService.listOrgRepos(searchRequest, repoType, sort, direction, page)
        : await appContext?.octokitService.listUserRepos(searchRequest, repoType, sort, direction, page);

    return response?.data as Repository[] | undefined;
  }

  const handleSearchInputChange = (e: any) => {
    e.preventDefault();
    setError("");
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (searchInput.length === 0) {
      setError("Please enter a search term");
      return;
    }

    if (searchInput === searchRequest) {
      return;
    }

    setPage(1);
    setRepos([]);
    setError(null);
    setSort(Sort.Full_name);
    setDirection(SortDirection.Asc);
    setSearchRequest(searchInput);
  };

  const handleSort = (sortKey: Sort) => {
    setPage(1);

    if (sortKey === sort) {
      setDirection(direction === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc);
      return;
    }

    sortKey === Sort.Full_name ? setDirection(SortDirection.Asc) : setDirection(SortDirection.Desc);
    setSort(sortKey);
  };

  const handleClickPageChange = (e: any, pageDirection: PageDirection) => {
    e.preventDefault();
    const nextPage = pageDirection === PageDirection.Next ? page + 1 : page - 1;
    setPage(nextPage);
  };

  return (
    <div className="Repo-List-container">
      <form className="Repo-List-form">
        <Dropdown
          className="Repo-List-flex-item flex-0 input"
          options={[SearchType.Org, SearchType.User]}
          onChange={handleTypeDropdownChange}
          value={SearchType.Org}
        />
        <div className="Repo-List-flex-item flex-1">
          <input
            className="input"
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            data-testid="search-input"
          />
          <button className="button" type="submit" onClick={handleSubmit} data-testid="search-button">
            Get Repositories
          </button>
        </div>
        <div className="Repo-List-flex-item flex-0">
          <div>type:</div>
          <Dropdown
            className="input"
            options={
              type === SearchType.Org
                ? [
                    DefaultRepoType.All,
                    OrgRepoType.Public,
                    OrgRepoType.Private,
                    OrgRepoType.Forks,
                    OrgRepoType.Sources,
                    OrgRepoType.Member,
                  ]
                : [DefaultRepoType.All, UserRepoType.Owner, UserRepoType.Member]
            }
            onChange={({ value }) => setRepoType(value as DefaultRepoType)}
            value={repoType}
          />
        </div>
      </form>

      {repos.length > 0 && (
        <div style={{ display: "flex" }} data-testid="repo-list-page-control">
          <h2>{`${searchRequest}'s`} repositories</h2>
          <RepoListPageControl
            disableNext={!!error || repos.length < PER_PAGE_LIMIT}
            page={page}
            handleClickPageChange={handleClickPageChange}
          />
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {!error && repos.length > 0 && (
        <RepoList repos={repos} sortKey={sort} sortDirection={direction} handleSort={handleSort} />
      )}
    </div>
  );
}
