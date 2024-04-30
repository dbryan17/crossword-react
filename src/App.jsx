import "./App.css";
import NavBar from "./components/navbar/navbar";
import { useUserEnteredDictsStore } from "./store/dictionariesStore";
import commonWordsTrie from "./data/4000-common-words-trie.json";

function App() {
  const addTrieToDict = useUserEnteredDictsStore((state) => state.addDict);
  addTrieToDict(commonWordsTrie);

  return (
    <>
      <div id="appContainer">
        <NavBar />
      </div>
    </>
  );
}

export default App;
