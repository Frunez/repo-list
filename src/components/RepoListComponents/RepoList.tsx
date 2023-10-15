import "../../App.css";

import React from "react";

import { Sort, SortDirection } from "../../services/octokit";
import RepoListItem from "./RepoListItem";

import type { Repository } from "@octokit/webhooks-types";

interface SortIconProps {
  item: Sort;
  sortKey: Sort;
  sortDirection: SortDirection;
}

interface RepoListProps {
  repos: Repository[];
  sortKey: Sort;
  sortDirection: SortDirection;
  handleSort: (sort: Sort) => unknown;
}

const SortIcon = ({ item, sortKey, sortDirection }: SortIconProps) => {
  if (item !== sortKey) return null;
  return sortDirection === SortDirection.Asc ? (
    <span className="sort-icon">▼</span>
  ) : (
    <span className="sort-icon">▲</span>
  );
};

export default function RepoList({ repos, sortKey, sortDirection, handleSort }: RepoListProps) {
  return (
    <div>
      <ul className="list">
        <li className="list-header" key={"header"}>
          <div onClick={() => handleSort(Sort.Full_name)} className="list-column clickable" style={{ flex: 2 }}>
            Name &nbsp; <SortIcon item={Sort.Full_name} sortKey={sortKey} sortDirection={sortDirection} />
          </div>
          <div onClick={() => handleSort(Sort.Created)} className="list-column clickable" style={{ flex: 1 }}>
            Created &nbsp; <SortIcon item={Sort.Created} sortKey={sortKey} sortDirection={sortDirection} />
          </div>
          <div onClick={() => handleSort(Sort.Updated)} className="list-column clickable" style={{ flex: 1 }}>
            Updated &nbsp; <SortIcon item={Sort.Updated} sortKey={sortKey} sortDirection={sortDirection} />
          </div>
          <div onClick={() => handleSort(Sort.Pushed)} className="list-column clickable" style={{ flex: 1 }}>
            Pushed &nbsp; <SortIcon item={Sort.Pushed} sortKey={sortKey} sortDirection={sortDirection} />
          </div>
        </li>
        {repos.map((repo: Repository) => (
          <RepoListItem key={repo.id} repo={repo} />
        ))}
      </ul>
    </div>
  );
}
