import type { Repository } from "@octokit/webhooks-types";
import React from "react";

interface RepoListItemProps {
  repo: Repository;
}

export default function RepoListItem({ repo }: RepoListItemProps) {
  const formatDate = (date: string | number) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <li style={{ display: "flex" }} key={repo.id}>
      <a
        className="list-column link"
        style={{ flex: 2 }}
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {repo.name}
      </a>
      <span className="list-column" style={{ flex: 1 }}>
        {formatDate(repo.created_at)}
      </span>
      <span className="list-column" style={{ flex: 1 }}>
        {formatDate(repo.updated_at)}
      </span>
      <span className="list-column" style={{ flex: 1 }}>
        {repo.pushed_at && formatDate(repo.pushed_at)}
      </span>
    </li>
  );
}
