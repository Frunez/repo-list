import "./App.css";
import { AppProvider } from "./AppContext";
import RepoList from "./components/RepoList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Repo List</h1>
      </header>
      <AppProvider>
        <RepoList />
      </AppProvider>
    </div>
  );
}

export default App;
