import { Routes, Route, NavLink } from "react-router-dom";
import HomePage from "../../pages/home/page";
import GenerateCwsPage from "../../pages/generateCws/page";
import createTrie from "../../pages/createTrie/page";
import ChangeDictionaryPage from "../../pages/createTrie/page";

export default function NavBar() {
  return (
    <>
      <nav className="navbar has-background-black-ter		">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-item is-selected" : "navbar-item"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/generate"
          className={({ isActive }) =>
            isActive ? "navbar-item is-selected" : "navbar-item"
          }
        >
          Generate Crosswords
        </NavLink>
        <NavLink
          to="/changeDictionary"
          className={({ isActive }) =>
            isActive ? "navbar-item is-selected" : "navbar-item"
          }
        >
          Change dictionary
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GenerateCwsPage />} />
        <Route path="/changeDictionary" element={<ChangeDictionaryPage />} />
      </Routes>
    </>
  );
}
