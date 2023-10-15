import React from "react";
import { fireEvent, getAllByRole, render, screen } from "@testing-library/react";
import RepoSearch from "./RepoSearch";
import { AppContext } from "../AppContext";
import OctokitService from "../services/octokit";
import { act } from "react-dom/test-utils";

test("renders correct starting state", () => {
  const mockOctokitService = {
    listOrgRepos: jest.fn(),
    listUserRepos: jest.fn(),
  } as unknown as OctokitService;

  render(
    <AppContext.Provider value={{ octokitService: mockOctokitService }}>
      <RepoSearch />
    </AppContext.Provider>
  );

  const typeDropdownElement = screen.getByText("organization");
  const searchInputElement = screen.getByTestId("search-input");
  const repoTypeDropdownElement = screen.getByText("all");

  expect(mockOctokitService.listOrgRepos).not.toHaveBeenCalled();
  expect(mockOctokitService.listUserRepos).not.toHaveBeenCalled();
  expect(searchInputElement.textContent).toBe("");
  expect(typeDropdownElement).toBeInTheDocument();
  expect(repoTypeDropdownElement).toBeInTheDocument();
  expect(() => screen.getByTestId("error-message")).toThrow();
  expect(() => screen.getByTestId("repo-list")).toThrow();
  expect(() => screen.getByTestId("repo-list-page-control")).toThrow();
});

test("renders error message when no repos found", async () => {
  const mockOctokitService = {
    listOrgRepos: jest.fn().mockResolvedValue({ data: [] }),
    listUserRepos: jest.fn().mockResolvedValue({ data: [] }),
  } as unknown as OctokitService;

  render(
    <AppContext.Provider value={{ octokitService: mockOctokitService }}>
      <RepoSearch />
    </AppContext.Provider>
  );
  const searchInputElement = screen.getByTestId("search-input");
  const searchButtonElement = screen.getByTestId("search-button");
  fireEvent.change(searchInputElement, { target: { value: "test" } });

  act(() => {
    searchButtonElement.click();
  });

  const errorMessageElement = await screen.findByTestId("error-message");
  expect(errorMessageElement.textContent).toBe("No repositories found for test");
  expect(mockOctokitService.listOrgRepos).toHaveBeenCalledTimes(1);
  expect(mockOctokitService.listOrgRepos).toHaveBeenCalledWith("test", "all", "full_name", "asc", 1);
  expect(mockOctokitService.listUserRepos).toHaveBeenCalledTimes(0);
});

test("renders error message when no repos found", async () => {
  const mockOctokitService = {
    listOrgRepos: jest.fn().mockResolvedValue({ data: [] }),
    listUserRepos: jest.fn().mockResolvedValue({ data: [] }),
  } as unknown as OctokitService;

  render(
    <AppContext.Provider value={{ octokitService: mockOctokitService }}>
      <RepoSearch />
    </AppContext.Provider>
  );
  const searchInputElement = screen.getByTestId("search-input");
  const searchButtonElement = screen.getByTestId("search-button");
  fireEvent.change(searchInputElement, { target: { value: "test" } });

  act(() => {
    searchButtonElement.click();
  });

  const errorMessageElement = await screen.findByTestId("error-message");
  expect(errorMessageElement.textContent).toBe("No repositories found for test");
  expect(mockOctokitService.listOrgRepos).toHaveBeenCalledTimes(1);
  expect(mockOctokitService.listOrgRepos).toHaveBeenCalledWith("test", "all", "full_name", "asc", 1);
  expect(mockOctokitService.listUserRepos).toHaveBeenCalledTimes(0);
});

test("renders error message when no repos found", async () => {
  const mockOctokitService = {
    listOrgRepos: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          full_name: "test",
          created_at: "2023-08-31T17:12:16Z",
          updated_at: "2023-09-17T17:12:16Z",
          pushed_at: "2023-12-03T17:12:16Z",
        },
      ],
    }),
    listUserRepos: jest.fn().mockResolvedValue({ data: [] }),
  } as unknown as OctokitService;

  render(
    <AppContext.Provider value={{ octokitService: mockOctokitService }}>
      <RepoSearch />
    </AppContext.Provider>
  );
  const searchInputElement = screen.getByTestId("search-input");
  const searchButtonElement = screen.getByTestId("search-button");
  fireEvent.change(searchInputElement, { target: { value: "test" } });

  act(() => {
    searchButtonElement.click();
  });

  const repoListElement = await screen.findByTestId("repo-list");
  expect(repoListElement).toBeInTheDocument();
  expect(screen.getByText("Aug 31, 2023")).toBeInTheDocument();
  expect(mockOctokitService.listOrgRepos).toHaveBeenCalledTimes(1);
  expect(mockOctokitService.listOrgRepos).toHaveBeenCalledWith("test", "all", "full_name", "asc", 1);
  expect(mockOctokitService.listUserRepos).toHaveBeenCalledTimes(0);
});

/**
 * TODO: Add tests for:
 * - When user selects "user" from type dropdown, listUserPepos is called with expected params
 * - When user selects "user" from type dropdown, repo type dropdown displays correct options
 * - When user selects "public" from repo type dropdown, listOrgRepos is called with public type filter
 * - When user clicks next page, listOrgRepos is called with expected page number
 * - When user clicks next page, the button is disabled when there are less than 10 repos
 * - Error if there are 10 repos and user clicks next page (Potential QoL improvement)
 * - When user clicks prev page, the button is disabled when on the first page
 * - When user clicks prev page, listOrgRepos is called with expected page number
 * - When user clicks on name in the list header, listOrgRepos is called with expected params
 * - all other sort options and directions
 */
