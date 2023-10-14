import React from "react";
import "./App.css";

import { AppProvider } from "./AppContext";
import RepoSearch from "./components/RepoSearch";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Repo List</h1>
      </header>
      <AppProvider>
        <RepoSearch />
      </AppProvider>
    </div>
  );
}

export default App;
