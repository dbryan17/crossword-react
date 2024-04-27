import { useState } from "react";
export default function Grid({ height, width }) {
  /*
  functionality:
    - highlight the cell you are brightly xxxxx
    - highlight the rest of row or column a duller color
  */

  /* states */
  const [gridValues, setGridValues] = useState(
    Array.from({ length: width }, (_, i) => i).map((_) =>
      Array.from({ length: height }, (_, i) => "")
    )
  );
  const [selectedCell, setSelectedCell] = useState({
    rowIdx: null,
    colIdx: null,
  });
  const [selectedRow, setSelectedRow] = useState({
    idx: null,
    isActive: false,
  });
  const [selectedCol, setSelectedCol] = useState({
    idx: null,
    isActive: false,
  });

  console.log(selectedRow);

  /* fcns */
  const handleClick = (evt, rowIdx, colIdx) => {
    // todo calculate selected grid or column, switch to other one if click on the same one

    // switch to opposite if it is a double click
    if (selectedCell.rowIdx === rowIdx && selectedCell.colIdx === colIdx) {
      if (selectedRow.isActive) {
        setSelectedRow({ idx: null, isActive: false });
        setSelectedCol({ idx: colIdx, isActive: true });
      } else {
        setSelectedCol({ idx: null, isActive: false });
        setSelectedRow({ idx: rowIdx, isActive: true });
      }
      // if row is currently selected, stick with row
    } else if (selectedRow.isActive) {
      // todo - make this (oldState) => oldState.idx = rowIdx to only edit the thing I need to
      setSelectedRow({ idx: rowIdx, isActive: true });
      // if col is currently active, stick with it
    } else if (selectedCol.isActive) {
      setSelectedCol({ idx: colIdx, isActive: true });
      // neither are selected, at start, start with row
    } else {
      setSelectedRow({ idx: rowIdx, isActive: true });
    }

    setSelectedCell({ rowIdx: rowIdx, colIdx: colIdx });
  };

  const handleKeyDown = (evt, rowIdx, colIdx) => {
    if (evt.ctrlKey || evt.metaKey || evt.altKey) {
      return;
    }
    evt.preventDefault();

    const newGridValues = [...gridValues];
    const key = evt.key;

    if (/[a-zA-Z]/.test(key)) {
      newGridValues[rowIdx][colIdx] = key.toUpperCase();
    }

    setGridValues(newGridValues);
    // else if()

    // if (evt.key === "Backspace") {
    //   // set cell to nothing
    //   setGridValues(
    //     gridValues.map((row, rowIdx) =>
    //       row.map((cell, colIdx) => {
    //         if (rowIdx === cellRowIdx && colIdx === colRowIdx) {
    //           if (cell === "") {
    //             shouldChangeFocus = true;
    //             // todo - check if you are in an across or a down
    //             // todo - calculate back based on that
    //             // todo - need a state to store if you are in across or down
    //             return cell;
    //           } else {
    //             return "";
    //           }
    //         } else {
    //           return cell;
    //         }
    //       })
    //     )
    //   );
    //   return;
    //   // don't fill cell on tab off
    // } else if (evt.key === "Tab") {
    //   return;
    // } else {
    //   setGridValues(
    //     gridValues.map((row, rowIdx) =>
    //       row.map((cell, colIdx) => {
    //         if (rowIdx === cellRowIdx && colIdx === colRowIdx) {
    //           return evt.key.toUpperCase();
    //         } else {
    //           return cell;
    //         }
    //       })
    //     )
    //   );
    // }
    // if (shouldChangeFocus) {
    // }
  };

  return (
    <div>
      <table className="has-background-grey-dark" id="gridTable">
        <tbody>
          {gridValues.map((row, rowIdx) => {
            return (
              <tr id={"row" + rowIdx} key={"row" + rowIdx}>
                {row.map((cell, colIdx) => {
                  return (
                    <td
                      id={"cell" + rowIdx + colIdx}
                      key={"cell" + rowIdx + colIdx}
                      className="cellTd"
                    >
                      <div
                        id={"cellText" + rowIdx + colIdx}
                        className={
                          selectedCell.rowIdx === rowIdx &&
                          selectedCell.colIdx === colIdx
                            ? "cellInput has-background-info"
                            : (selectedRow.isActive &&
                                selectedRow.idx === rowIdx) ||
                              (selectedCol.isActive &&
                                selectedCol.idx === colIdx)
                            ? "cellInput has-background-link"
                            : "cellInput"
                        }
                        contentEditable
                        suppressContentEditableWarning={true}
                        onKeyDown={(evt) => handleKeyDown(evt, rowIdx, colIdx)}
                        onClick={(evt) => handleClick(evt, rowIdx, colIdx)}
                      >
                        {cell}
                      </div>
                      {/* <div className="cellTextCont"> */}
                      {/* <input
                        type="text"
                        maxLength="1"
                        autoComplete="off"
                        className="cellInput input"
                        id={"cellInput" + rowIdx + colIdx}
                        onKeyDown={handleKeyDown}
                      ></input> */}
                      {/* </div> */}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
