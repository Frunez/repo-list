import React from "react";
import { PageDirection } from "../RepoSearch";

export default function RepoListPageControl({
  disableNext,
  page,
  handleClickPageChange,
}: {
  disableNext: boolean;
  page: number;
  handleClickPageChange: (e: any, pageDirection: PageDirection) => void;
}) {
  return (
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
        disabled={disableNext}
        onClick={(e) => handleClickPageChange(e, PageDirection.Next)}
      >
        next
      </button>
    </div>
  );
}
