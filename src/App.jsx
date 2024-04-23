import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import commonTrie from "../public/data/400.json";
import HomePage from "./pages/home/page";
import GenerateCwsPage from "./pages/generateCws/page";
import NavBar from "./navbar/navbar";

function App() {
  const [count, setCount] = useState(0);
  // console.log(commonTrie["2"]["a"]);

  return (
    <>
      <div id="appContainer">
        <NavBar />
      </div>
    </>
  );
}

export default App;
