import { useState } from "react";
import { findNextPrevOpenSpace, findWord } from "./utils/gridSearch";
export default function Grid({ height, width }) {
  /*
  functionality:
    - highlight the cell you are brightly xxxxx
    - highlight the rest of row or column a duller color xxxxxxx
    - tab and shift tab to change highlhgited row or col 
      tab:
        - if you are in row highlight, it will find the next row "word" that has empty spaces
          - if there are none, it will go to the first column "word" with empty spaces
        - same for column
      shift tab:
      - same for tab but going backwards
    
      
  */

  /* states */

  const [gridValues, setGridValues] = useState(
    Array.from({ length: width }, (_, i) => i).map((_) =>
      Array.from({ length: height }, (_) => "")
    )
  );
  const [selectedCell, setSelectedCell] = useState({
    rowIdx: null,
    colIdx: null,
  });
  const [selectedWord, setSelectedWord] = useState({
    startIdx: null,
    endIdx: null,
    otherIdx: null,
    isRow: true,
  });

  const [isInsertingBlackSqaures, setIsInsertingBlackSquares] = useState(false);

  /* fcns */
  /////////////

  /* 
  function to handle a click on a cell
  - inserts or uninserts black squares in insert squares mode
  - does nothing if clicking black sqaure when not in insert sqaures mode
  - if click on cell not currenttly selected, highlight and adjust word highlight
  - if click on cell that is currently selected, swap word highlight
  */
  const handleClick = (evt, rowIdx, colIdx) => {
    // handle if in insert black sqaure mode
    if (isInsertingBlackSqaures) {
      let newGridValues = [...gridValues];
      if (newGridValues[rowIdx][colIdx] === "_")
        newGridValues[rowIdx][colIdx] = "";
      else newGridValues[rowIdx][colIdx] = "_";
      setGridValues(newGridValues);
      return;
    }
    // if the clicked cell is a balck sqaure, do nothing
    if (gridValues[rowIdx][colIdx] === "_") {
      return;
    }
    // switch to opposite if it is a double click

    let isSameCell =
      selectedCell.rowIdx === rowIdx && selectedCell.colIdx === colIdx;
    let newIsRow = isSameCell ? !selectedWord.isRow : selectedWord.isRow;

    let { startIdx, endIdx } = findWord(gridValues, rowIdx, colIdx, newIsRow);

    // dont need this
    if (!isSameCell) {
      setSelectedCell({ rowIdx: rowIdx, colIdx: colIdx });
    }

    setSelectedWord({
      startIdx: startIdx,
      endIdx: endIdx,
      otherIdx: newIsRow ? rowIdx : colIdx,
      isRow: newIsRow,
    });
  };

  /////////////

  /*
  called from handle key down to calculate new highlighted word
  TODO 
  */
  const handleWordHighlightChange = (isForward, rowIdx, colIdx) => {
    // find the current word
    let { startIdx, endIdx } = findWord(
      gridValues,
      rowIdx,
      colIdx,
      selectedWord.isRow
    );
    let idxFromFindWord = isForward ? endIdx : startIdx;
    let {
      rowIdx: newRowIdx,
      colIdx: newColIdx,
      isRowHighlight,
    } = findNextPrevOpenSpace(
      gridValues,
      selectedWord.isRow ? rowIdx : idxFromFindWord,
      selectedWord.isRow ? idxFromFindWord : colIdx,
      isForward,
      selectedWord.isRow,
      false
    );

    // now to set the new highlight
    // get the new word
    let {
      word,
      startIdx: newStartIdx,
      endIdx: newEndIdx,
    } = findWord(gridValues, newRowIdx, newColIdx, isRowHighlight);

    setSelectedWord({
      startIdx: newStartIdx,
      endIdx: newEndIdx,
      otherIdx: isRowHighlight ? newRowIdx : newColIdx,
      isRow: isRowHighlight,
    });
    // now to set the new cell highlight
    // want to highlight the first cell in the word that is empty - always has one
    let firstEmptyIdx = word.indexOf(" ") + newStartIdx;
    console.log(word);
    setSelectedCell({
      rowIdx: isRowHighlight ? newRowIdx : firstEmptyIdx,
      colIdx: isRowHighlight ? firstEmptyIdx : newColIdx,
    });

    return;
  };

  /*
  handles key presses on cells
  TODO
  */
  const handleKeyDown = (evt, rowIdx, colIdx) => {
    // need to change these because the highlighted cell won't
    // always be the one that was last clicked
    // ex. tabbing to change focus
    rowIdx = selectedCell.rowIdx;
    colIdx = selectedCell.colIdx;
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
      // now go to next open space
    }

    // now for tabs and arrows
    switch (key) {
      case "Tab":
        // oppposite for shift tab
        if (evt.shiftKey) {
          handleWordHighlightChange(false, rowIdx, colIdx);
        } else {
          // move row or col to next one, if on end of row or col, go to first of the opposite
          handleWordHighlightChange(true, rowIdx, colIdx);
        }
        return;
    }

    setGridValues(newGridValues);
    return;
  };

  const handleBlackSquareBtnClick = () => {
    setIsInsertingBlackSquares((oldVal) => !oldVal);

    setSelectedWord({
      startIdx: null,
      endIdx: null,
      otherIdx: null,
      isRow: true,
    });

    setSelectedCell({
      rowIdx: null,
      colIdx: null,
    });
  };

  // checks if a given cell is in the word highlight
  const checkCellInHighlight = (rowIdx, colIdx) => {
    // hasn't been set, none are in
    if (selectedWord.startIdx === null) return false;
    // row needs to be within start and end idx
    if (selectedWord.isRow) {
      // colIdx must be between start and end, other must match rowIdx
      return (
        rowIdx === selectedWord.otherIdx &&
        colIdx >= selectedWord.startIdx &&
        colIdx <= selectedWord.endIdx
      );
    } else {
      // col word
      return (
        colIdx === selectedWord.otherIdx &&
        rowIdx >= selectedWord.startIdx &&
        rowIdx <= selectedWord.endIdx
      );
    }
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
                          // check black sqaure
                          cell === "_"
                            ? // is black sqaure
                              "cellInput has-background-black"
                            : // checked if selected
                            selectedCell.rowIdx === rowIdx &&
                              selectedCell.colIdx === colIdx
                            ? // is selected
                              "cellInput has-background-info"
                            : // check if in highlighted word
                            checkCellInHighlight(rowIdx, colIdx)
                            ? // in highlight
                              "cellInput has-background-link"
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
