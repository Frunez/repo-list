import { useContext, useState } from "react";
import { AppContext } from "../AppContext";

export default function RepoList() {
  const appContext = useContext(AppContext);

  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [repos, setRepos] = useState([] as any[]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setRepos([]);
    try {
      const userRepos = appContext?.octokitService.listUserRepos(searchInput);
      const orgRepos = appContext?.octokitService.listOrgRepos(searchInput);

      const repo = await Promise.any([orgRepos, userRepos]);

      if (repo?.data) {
        if (repo!.data.length > 0) setRepos(repo!.data);
        if (repo!.data.length > 0) setRepos(repo!.data);
        return;
      }

      setError(`No repositories found for ${setSearchInput}`);
    } catch (error: any) {
      if (error.message === "All promises were rejected") {
        setError("Organization or user not found");
      }
    }
  };

  const handleInputChange = (e: any) => {
    setError("");
    setSearchInput(e.target.value);
  };

  return (
    <div>
      <form>
        <input type="text" value={searchInput} onChange={handleInputChange} />
        <button type="submit" onClick={handleSubmit}>
          Get Repos
        </button>
      </form>

      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}

      {repos.length > 0 && (
        <div>
          <h2>Repositories</h2>
          <ul>
            {repos.map((repo: any) => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
