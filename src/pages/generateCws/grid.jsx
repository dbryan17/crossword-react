import { useState } from "react";
import { findNextPrevOpenSpace, findWord } from "./utils/gridSearch";
export default function Grid({ height, width }) {
  /*
  functionality:
    - highlight the cell you are brightly xxxxx
    - highlight the rest of row or column a duller color xxxxxxx
    - tab and shift tab to change highlhgited row or col  xxxxxxxxxxxxx
      tab:
        - if you are in row highlight, it will find the next row "word" that has empty spaces
          - if there are none, it will go to the first column "word" with empty spaces
        - same for column
      shift tab:
      - same for tab but going backwards
      - if the grid is full, tab jumps to first non black square start of word
    - arrow keys: xxxxxxx
      - if it is a direction you are not highlighting (i.e.) up/down with highlighting cols
        - it switches the direction 
      - moves to next non black sqaure space that is in that direction, stops at the end 
    - typing a letter xxxxxxxx
      - enters letter into current space 
      - goes to next empty space in word forward, if there are no empty spaces forward, goes to first empty space in word
      - if all spaces in word are full, stays where it is
    - backspaces xxxxxx 
      - if the current cell has something, delete it, don't move highlight
      - if the cell has nothing, and it is the start of a word, do nothing
      - if the cell has nothing, and the previous cell has nothing, shift highlight to previous cell
      - if the cell has nothing, and the previous cell has something, delete prev cell and shift highlight to it

    
      
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

    handleHighlight(rowIdx, colIdx, newIsRow);
    return;
  };

  /////////////

  /* 
  helper function to do new highlights 
  takes rowIdx, colIdx, and if its a row or col,
  then highlights the new cell, and highlights the new word 
  */
  const handleHighlight = (
    rowIdx,
    colIdx,
    isRowHighlight,
    shouldHighlightFirstEmpty,
    shouldHighlightFirstLetter
  ) => {
    let { word, startIdx, endIdx } = findWord(
      gridValues,
      rowIdx,
      colIdx,
      isRowHighlight
    );
    if (shouldHighlightFirstEmpty) {
      let firstEmptyIdx = word.indexOf(" ") + startIdx;
      setSelectedCell({
        rowIdx: isRowHighlight ? rowIdx : firstEmptyIdx,
        colIdx: isRowHighlight ? firstEmptyIdx : colIdx,
      });
    } else if (shouldHighlightFirstLetter) {
      setSelectedCell({
        rowIdx: isRowHighlight ? rowIdx : startIdx,
        colIdx: isRowHighlight ? startIdx : colIdx,
      });
    } else {
      setSelectedCell({ rowIdx: rowIdx, colIdx: colIdx });
    }
    setSelectedWord({
      startIdx: startIdx,
      endIdx: endIdx,
      otherIdx: isRowHighlight ? rowIdx : colIdx,
      isRow: isRowHighlight,
    });
  };

  /*
  called from handle key down to calculate new highlighted word when the user presses tab or shift tab
  - works indentical to new york times crossword
  - if you are on row or col highlight, stick with it
  - find the next word that has an empty space (for tab) previous for shift tab
  - if there are none in the rest of the grid for row or col, switch
    - so if you are find next row, and there are no more rows that have empty spaces, find first col with empty space
  */
  const handleWordHighlightChangeForTabs = (isForward, rowIdx, colIdx) => {
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
      fullGrid,
    } = findNextPrevOpenSpace(
      gridValues,
      selectedWord.isRow ? rowIdx : idxFromFindWord,
      selectedWord.isRow ? idxFromFindWord : colIdx,
      isForward,
      selectedWord.isRow,
      false
    );
    // if the grid is full, cycle through with tab the same but no longer matters about empties, just black sqaures
    // now to set the new highlight, only highlight first empty if full grid, if full grid, highlight first in letter
    handleHighlight(
      newRowIdx,
      newColIdx,
      isRowHighlight,
      fullGrid ? false : true,
      fullGrid ? true : false
    );

    return;
  };

  /* handles arrow key pressses */
  const handleArrowPress = (isHorizontal, isForward) => {
    // do nothing if there is no current highlight
    if (selectedWord.otherIdx === null) {
      return;
    }
    // check if the current highlight does not match the direction
    if (selectedWord.isRow !== isHorizontal) {
      // switch direction
      // get word for new direction
      handleHighlight(selectedCell.rowIdx, selectedCell.colIdx, isHorizontal);
      return;
    }

    // going with the current direction of highlight
    // could do this with a more gnarly turner
    if (isHorizontal) {
      let rowIdx = selectedCell.rowIdx;
      let i = selectedCell.colIdx + (isForward ? +1 : -1);
      while (isForward ? i < gridValues[0].length : i > -1) {
        if (gridValues[rowIdx][i] !== "_") {
          handleHighlight(rowIdx, i, true);
          return;
        }
        isForward ? i++ : i--;
      }
      // vetical
    } else {
      let colIdx = selectedCell.colIdx;
      let i = selectedCell.rowIdx + (isForward ? +1 : -1);
      while (isForward ? i < gridValues.length : i > -1) {
        if (gridValues[i][colIdx] !== "_") {
          handleHighlight(i, colIdx, false);
          return;
        }
        isForward ? i++ : i--;
      }
    }

    return;
  };

  /*
  handles key presses on cells
  */
  const handleKeyDown = (evt, rowIdx, colIdx) => {
    if (evt.ctrlKey || evt.metaKey || evt.altKey) {
      return;
    }
    evt.preventDefault();
    //
    // if (isInsertingBlackSqaures) {
    //   return;
    // }
    // need to change these because the highlighted cell won't
    // always be the one that was last clicked
    // ex. tabbing to change focus
    rowIdx = selectedCell.rowIdx;
    colIdx = selectedCell.colIdx;
    // do nothing if inserting black sqaures
    if (isInsertingBlackSqaures) {
      return;
    }

    let newGridValues = [...gridValues];
    const key = evt.key;

    // key entering a letter or single key
    if (key.length === 1) {
      // spaces enter blanks
      if (key !== " ") {
        newGridValues[rowIdx][colIdx] = key.toUpperCase();
      }
      // now to update cell highlight
      let { word, startIdx, endIdx } = findWord(
        newGridValues,
        rowIdx,
        colIdx,
        selectedWord.isRow
      );
      // TODO - can prob get rid of some turners by finding next row and new col once maybe not CHECK
      if (word.includes("")) {
        // need to find next blank
        let i = selectedWord.isRow
          ? (colIdx - startIdx + 1) % word.length
          : (rowIdx - startIdx + 1) % word.length;

        while (
          i !== (selectedWord.isRow ? colIdx - startIdx : rowIdx - startIdx)
        ) {
          if (
            newGridValues[selectedWord.isRow ? rowIdx : i + startIdx][
              selectedWord.isRow ? i + startIdx : colIdx
            ] === ""
          ) {
            // set highlight
            setSelectedCell({
              rowIdx: selectedWord.isRow
                ? rowIdx
                : (i % word.length) + startIdx,
              colIdx: selectedWord.isRow
                ? (i % word.length) + startIdx
                : colIdx,
            });
            return;
          }
          i = (i + 1) % word.length;
        }
      }
      return;
      // now go to next open space in the current word if there is one, and if not, do nothing
    } else if (key === "Backspace") {
      // simple case, the cell has a value, simply delete and don't move highlight
      if (newGridValues[rowIdx][colIdx] !== "") {
        newGridValues[rowIdx][colIdx] = "";
      } else {
        // first get word
        let { startIdx } = findWord(
          newGridValues,
          rowIdx,
          colIdx,
          selectedWord.isRow
        );
        // we already know that this cell is blank, so if we are at the start of the word do nothing
        if (!(selectedWord.isRow ? colIdx === startIdx : rowIdx === startIdx)) {
          // now we know we are not at the start of the word, so can safely check the previous cell
          // always set the previous cell to nothing, if it already is it was unnesccary, but saves an if
          let currRow = selectedWord.isRow ? rowIdx : rowIdx - 1;
          let currCol = selectedWord.isRow ? colIdx - 1 : colIdx;
          newGridValues[currRow][currCol] = "";
          // then shift highlight to it
          setSelectedCell({ rowIdx: currRow, colIdx: currCol });
        }
      }
    }
    setGridValues(newGridValues);

    // now for tabs/enters and arrows
    switch (key) {
      case "Tab":
        // oppposite for shift tab
        if (evt.shiftKey) {
          handleWordHighlightChangeForTabs(false, rowIdx, colIdx);
        } else {
          // move row or col to next one, if on end of row or col, go to first of the opposite
          handleWordHighlightChangeForTabs(true, rowIdx, colIdx);
        }
        return;
      // ennter same as shift
      case "Enter":
        if (evt.shiftKey) {
          handleWordHighlightChangeForTabs(false, rowIdx, colIdx);
        } else {
          // move row or col to next one, if on end of row or col, go to first of the opposite
          handleWordHighlightChangeForTabs(true, rowIdx, colIdx);
        }
        return;

      case "ArrowRight":
        handleArrowPress(true, true);
        return;
      case "ArrowLeft":
        handleArrowPress(true, false);
        return;
      case "ArrowDown":
        handleArrowPress(false, true);
        return;
      case "ArrowUp":
        handleArrowPress(false, false);
        return;
    }

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
