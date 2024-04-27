import { useState } from "react";
export default function Grid({ height, width }) {
  /*
  functionality:
    - highlight the cell you are brightly xxxxx
    - highlight the rest of row or column a duller color xxxxxxx
    - tab and shift tab to change highlhgited row or col
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
  const [isInsertingBlackSqaures, setIsInsertingBlackSquares] = useState(false);

  /* fcns */
  /////////////

  // isForward is if it is tab
  const changeSelectedRowFromKey = (isForward) => {
    if (isForward) {
      // go to next one
      if (selectedRow.isActive) {
        // on the last row
        if (selectedRow.idx === height - 1) {
          // go to first coloumn
        }
      }
    }
  };

  const handleClick = (evt, rowIdx, colIdx) => {
    if (isInsertingBlackSqaures) {
      let newGridValues = [...gridValues];
      newGridValues[rowIdx][colIdx] = "_";
      setGridValues(newGridValues);
      return;
    }
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
  /////////////

  const handleKeyDown = (evt, rowIdx, colIdx) => {
    if (evt.ctrlKey || evt.metaKey || evt.altKey) {
      return;
    }
    evt.preventDefault();
    if (gridValues[rowIdx][colIdx] === "_") {
      return;
    }

    let newGridValues = [...gridValues];
    const key = evt.key;

    // key entering a letter
    if (/[a-zA-Z]/.test(key) && key.length === 1) {
      newGridValues[rowIdx][colIdx] = key.toUpperCase();
      // tab - go down to next row or col
    }

    // now for tabs and arrows
    switch (key) {
      case "Tab":
        // move row or col to next one, if on end of row or col, go to first of the opposite

        // oppposite for shift tab
        if (evt.shiftKey) {
        }
    }

    setGridValues(newGridValues);
  };

  const handleBlackSquareBtnClick = () => {
    setIsInsertingBlackSquares((oldVal) => !oldVal);
    setSelectedRow({
      idx: null,
      isActive: false,
    });
    setSelectedCol({
      idx: null,
      isActive: false,
    });
    setSelectedCell({
      rowIdx: null,
      colIdx: null,
    });
  };

  return (
    <div>
      <br />
      <button
        className="button"
        onClick={() => {
          handleBlackSquareBtnClick();
        }}
      >
        {isInsertingBlackSqaures ? "Insert letters" : "Insert black squares"}
      </button>
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
                          cell === "_"
                            ? "cellInput has-background-black"
                            : selectedCell.rowIdx === rowIdx &&
                              selectedCell.colIdx === colIdx
                            ? "cellInput has-background-info"
                            : (selectedRow.isActive &&
                                selectedRow.idx === rowIdx) ||
                              (selectedCol.isActive &&
                                selectedCol.idx === colIdx)
                            ? "cellInput has-background-link"
                            : "cellInput"
                        }
                        // this is just here so it registers key downs
                        contentEditable
                        suppressContentEditableWarning={true}
                        onKeyDown={(evt) => handleKeyDown(evt, rowIdx, colIdx)}
                        onClick={(evt) => handleClick(evt, rowIdx, colIdx)}
                      >
                        {cell === "_" ? "" : cell}
                      </div>
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
