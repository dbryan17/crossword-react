import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import commonTrie from "../public/data/commonTrie.json";
import HomePage from "./pages/home/page";
import GenerateCwsPage from "./pages/generateCws/page";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  console.log(commonTrie["2"]);

  return (
    <>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/generate">Generate Crosswords</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GenerateCwsPage />} />
      </Routes>
    </>
  );
}

export default App;
