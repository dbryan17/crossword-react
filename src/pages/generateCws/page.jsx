import Header from "../../components/header/header";
import { useState } from "react";
import Grid from "./grid";
import GenerateCwButton from "./generation";
export default function GenerateCwsPage() {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [widthIsInvalid, setWidthIsInvalid] = useState(false);
  const [heightIsInvalid, setHeightIsInvalid] = useState(false);

  // state for a grid values to be passed down
  const [gridValues, setGridValues] = useState([]);

  /* fcns */
  const handleGenerateClick = () => {
    let isError = false;
    if (width === null || width < 3) {
      setWidthIsInvalid(true);
      isError = true;
    }
    if (height === null || height < 3) {
      setHeightIsInvalid(true);
      isError = true;
    }
    if (!isError) {
      setGridValues(
        Array.from({ length: width }, (_, i) => i).map((_) =>
          Array.from({ length: height }, (_) => "")
        )
      );
    }
  };

  console.log(gridValues);

  const handleDimensionInput = (isWidth, number) => {
    if (isWidth) {
      setWidth(number);
      if (widthIsInvalid && number >= 3) {
        setWidthIsInvalid(false);
      }
    } else {
      setHeight(number);
      if (heightIsInvalid && number >= 3) {
        setHeightIsInvalid(false);
      }
    }
  };

  return (
    <div className="pageContainer">
      <Header
        title="Generate Crosswords"
        subtitle="Create a grid with the option to include black squares and some words. Then, selected the dicitionaries you would like to use. The algorithm will generate the rest of the crossword, or determine that it is impossible with the given dictionaries. You can choose to fill the grid randomly, or optimized for fastest performance."
      />
      <div id="girdPageDiv">
        <h1 className="is-size-4">Create Grid</h1>
        <div className="field">
          <label className="label">Width:</label>
          <div className="control">
            <input
              className={widthIsInvalid ? "input is-danger" : "input"}
              type="number"
              min="3"
              onChange={(evt) => handleDimensionInput(true, evt.target.value)}
            ></input>
          </div>
          {widthIsInvalid ? (
            <p className="help is-danger">Width must be 3 or greater</p>
          ) : (
            ""
          )}
        </div>
        <div className="field">
          <label className="label">Height:</label>
          <div className="control">
            <input
              className={heightIsInvalid ? "input is-danger" : "input"}
              type="number"
              min="3"
              onChange={(evt) => handleDimensionInput(false, evt.target.value)}
            ></input>
          </div>
          {heightIsInvalid ? (
            <p className="help is-danger">Height must be 3 or greater</p>
          ) : (
            ""
          )}
        </div>
        <button
          className="button is-primary mr-3"
          onClick={() => handleGenerateClick()}
        >
          Generate
        </button>
        {gridValues.length > 0 ? (
          <Grid gridValues={gridValues} setGridValues={setGridValues} />
        ) : (
          ""
        )}
      </div>
      <br />
      <div>
        <h1 className="is-size-4">Select Dictionary</h1>
      </div>
      <div>
        <GenerateCwButton
          gridValues={gridValues}
          setGridValues={setGridValues}
        />
      </div>
    </div>
  );
}
