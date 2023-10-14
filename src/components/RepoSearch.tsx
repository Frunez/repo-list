import "react-dropdown/style.css";
import "./RepoSearch.css";
import "../App.css";

import React, { useContext, useEffect, useState } from "react";
import Dropdown from "react-dropdown";

import { AppContext } from "../AppContext";
import { DefaultRepoType, OrgRepoType, Sort, SortDirection, UserRepoType } from "../services/octokit";
import ErrorMessage from "./common/ErrorMessage";
import RepoList from "./RepoListComponents/RepoList";

enum SearchType {
  User = "user",
  Org = "organization",
}

enum PageDirection {
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

  async function getRepoList(): Promise<void> {
    const repos =
      type === SearchType.Org
        ? await appContext?.octokitService.listOrgRepos(searchRequest, repoType, sort, direction, page)
        : await appContext?.octokitService.listUserRepos(searchRequest, repoType, sort, direction, page);

    if (repos?.data && repos.data.length > 0) {
      setError(null);
      setRepos(repos.data);
      return;
    }

    setError(`No repositories found for ${searchRequest}`);
  }

  useEffect(() => {
    if (searchRequest.length === 0) return;

    getRepoList().catch(() => {
      setRepos([]);
      setError("Organization or user not found");
    });
  }, [searchRequest, page, type, repoType, sort, direction]);

  const handleTypeDropdownChange = (e: any) => {
    setType(e.value as SearchType);
    setRepoType(DefaultRepoType.All);
  };

  const handleInputChange = (e: any) => {
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

  const handleClickPageChange = (e: any, pageDirection: PageDirection) => {
    e.preventDefault();
    const nextPage = pageDirection === PageDirection.Next ? page + 1 : page - 1;
    setPage(nextPage);
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
          <input className="input" type="text" value={searchInput} onChange={handleInputChange} />
          <button className="button" type="submit" onClick={handleSubmit}>
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
        <div style={{ display: "flex" }}>
          <h2>Repositories</h2>
          <div className="Repo-List-flex-item flex-0 center">
            <button
              className="button"
              type="button"
              disabled={page === 1}
              onClick={(e) => handleClickPageChange(e, PageDirection.Prev)}
            >
              prev
            </button>
            <div className="flex-0 center">{page}</div>
            <button
              className="button"
              type="button"
              disabled={!!error}
              onClick={(e) => handleClickPageChange(e, PageDirection.Next)}
            >
              next
            </button>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {!error && repos.length > 0 && <RepoList repos={repos} sortKey={sort} sortDirection={direction} handleSort={handleSort} />}
    </div>
  );
}
