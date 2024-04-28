// this finds the next open space based on a position and if it is in row/col highlight
// CAVEAT: if the grid is full, it will just find the next space that isn't a black sqaure
const findNextPrevOpenSpace = (
  grid,
  rowIdx,
  colIdx,
  isNext,
  isRowHighlight,
  hasBacktracked
) => {
  // first, check if grid is full\
  let fullGrid = false;
  if (gridIsFull(grid)) {
    fullGrid = true;
  }
  if (isRowHighlight) {
    // we are on row highlight
    // find next space
    if (isNext) {
      // first, get the next space which is colIdx + 1 unles end of row
      // this will handle last square on its own, and should also handle black squares
      let currCol = colIdx + 1 >= grid[0].length ? 0 : colIdx + 1;
      let currRow = colIdx + 1 >= grid[0].length ? rowIdx + 1 : rowIdx;
      while (currRow < grid.length) {
        while (currCol < grid[0].length) {
          if (
            grid[currRow][currCol] === "" ||
            (grid[currRow][currCol] !== "_" && fullGrid)
          ) {
            return {
              rowIdx: currRow,
              colIdx: currCol,
              isRowHighlight: true,
              fullGrid: fullGrid,
            };
          }
          currCol++;
        }
        currCol = 0;
        currRow++;
      }
      // reched here means we reached the end of the grid, want to highlight first column
      // if we've already ran through this once, the grid is filled
      if (hasBacktracked) {
        return false;
      }
      // want to highlight first column
      return findNextPrevOpenSpace(grid, -1, 0, true, false, true);

      // find prev space
    } else {
      let currCol = colIdx === 0 ? grid[0].length - 1 : colIdx - 1;
      let currRow = colIdx === 0 ? rowIdx - 1 : rowIdx;
      while (currRow > -1) {
        while (currCol > -1) {
          if (
            grid[currRow][currCol] === "" ||
            (grid[currRow][currCol] !== "_" && fullGrid)
          ) {
            return {
              rowIdx: currRow,
              colIdx: currCol,
              isRowHighlight: true,
              fullGrid: fullGrid,
            };
          }
          currCol--;
        }
        currCol = grid[0].length - 1;
        currRow--;
      }
      // reached beginning of grid,
      if (hasBacktracked) {
        return false;
      }
      // want highlight last column
      return findNextPrevOpenSpace(
        grid,
        grid.length,
        grid[0].length - 1,
        false,
        false,
        true
      );
    }
    // we are on col highlight
  } else {
    // find next space
    if (isNext) {
      // get the next space, row + 1 unless end of col
      let currRow = rowIdx + 1 >= grid.length ? 0 : rowIdx + 1;
      let currCol = rowIdx + 1 >= grid.length ? colIdx + 1 : colIdx;
      while (currCol < grid[0].length) {
        while (currRow < grid.length) {
          if (
            grid[currRow][currCol] === "" ||
            (grid[currRow][currCol] !== "_" && fullGrid)
          ) {
            return {
              rowIdx: currRow,
              colIdx: currCol,
              isRowHighlight: false,
              fullGrid: fullGrid,
            };
          }
          currRow++;
        }
        currRow = 0;
        currCol++;
      }
      // reached end of grid
      if (hasBacktracked) {
        return false;
      }
      // want to highlight first row
      return findNextPrevOpenSpace(grid, 0, -1, true, true, true);

      // find previous space
    } else {
      // get previous space, row - 1 unless at start of col
      let currRow = rowIdx - 1 === 0 ? grid.length - 1 : rowIdx - 1;
      let currCol = rowIdx - 1 === 0 ? colIdx - 1 : colIdx;
      while (currCol > -1) {
        while (currRow > -1) {
          if (
            grid[currRow][currCol] === "" ||
            (grid[currRow][currCol] !== "_" && fullGrid)
          ) {
            return {
              rowIdx: currRow,
              colIdx: currCol,
              isRowHighlight: false,
              fullGrid: fullGrid,
            };
          }
          currRow--;
        }
        currRow = grid.length - 1;
        currCol--;
      }
      if (hasBacktracked) {
        return false;
      }
      // want to highlight last row
      return findNextPrevOpenSpace(
        grid,
        grid.length - 1,
        grid[0].length,
        false,
        true,
        true
      );
    }
  }
};

// get word from positon for row or column
// first, find what is currently there
// go up until you hit the end of the puzzle or black sqaure, then go down, simple
const findWord = (grid, rowIdx, colIdx, isRowWord) => {
  let currWord = grid[rowIdx][colIdx];
  if (currWord === "") {
    currWord = " ";
  }

  // "above"
  let i = isRowWord ? colIdx - 1 : rowIdx - 1;
  while (i >= 0) {
    let letter = grid[isRowWord ? rowIdx : i][isRowWord ? i : colIdx];
    if (letter === "_") {
      break;
    }
    if (letter === "") {
      letter = " ";
    }
    currWord = letter + currWord;
    i--;
  }
  let startIdx = i + 1;

  // "below"
  i = isRowWord ? colIdx + 1 : rowIdx + 1;
  // row lengths will all be the same, so could use 0 instead of row
  while (isRowWord ? i < grid[rowIdx].length : i < grid.length) {
    let letter = grid[isRowWord ? rowIdx : i][isRowWord ? i : colIdx];
    if (letter === "_") {
      break;
    }
    if (letter === "") {
      letter = " ";
    }
    currWord = currWord + letter;
    i++;
  }
  let endIdx = i - 1;

  return { word: currWord, startIdx: startIdx, endIdx: endIdx };
};

const gridIsFull = (grid) => {
  let isFull = true;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell === "") {
        isFull = false;
        return;
      }
    });
    if (isFull) {
      return;
    }
  });
  return isFull;
};

export { findNextPrevOpenSpace, findWord };
