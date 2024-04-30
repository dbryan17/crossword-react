import { useUserEnteredDictsStore } from "../../store/dictionariesStore";
import { outerFillCw } from "./utils/fillGrid";
export default function GenerateCwButton({ gridValues, setGridValues }) {
  const dicts = useUserEnteredDictsStore((state) => state.dicts);
  const handleGenerateClick = () => {
    let cw = outerFillCw(gridValues, dicts[0]);
    setGridValues(cw);
  };

  return (
    <button className="button is-primary" onClick={() => handleGenerateClick()}>
      Generate
    </button>
  );
}
