import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";

export enum cellStates {
  covered,
  uncovered,
  flagged,
}

export enum gameStates {
  initial,
  running,
  won,
  lost
}

export interface CellType {
  state: cellStates;
  hasMine: boolean;
  adjacentMines: number;
}

interface BoardState {
  height: number;
  width: number;
  totalMines: number;
  totalFlags: number;
  elapsedTime: number;
  gameState: gameStates;
  cells: CellType[][];
}

export const initialState: BoardState = {
  height: 16,
  width: 16,
  totalMines: 40,
  totalFlags: 0,
  elapsedTime: 0,
  gameState: gameStates.initial,
  cells: [],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setCells: (state, action) => {
      state.cells = action.payload;
    },
    setHeight: (state, action) => {
      state.height = action.payload;
    },
    setWidth: (state, action) => {
      state.width = action.payload;
    },
    setTotalMines: (state, action) => {
      state.totalMines = action.payload;
    },
    resetGame: (state) => {
      state.totalFlags = 0;
      state.elapsedTime = 0;
      state.gameState = gameStates.initial;
    },
    unconverCell: (state, action) => {      
      if (cellHasMine(action.payload, state.cells) && state.gameState !== gameStates.initial) {
          state.gameState = gameStates.lost;     
      } else {
        if (cellHasMine(action.payload, state.cells) && state.gameState === gameStates.initial) {
          state.cells = moveMine(action.payload, state.cells, state.width, state.height);
        }
        state.gameState = gameStates.running;
        state.cells = recursivelyUncoverCells(action.payload, state.cells);
        if (countCoveredAndFlaggedCells(state.cells) === state.totalMines) {
          state.gameState = gameStates.won;
          state.totalFlags = state.totalMines;
        }
      }
    },
    toggleFlag: (state, action) => {
      if (cellHasFlag(action.payload, state.cells)) {
        state.cells = toggleCellFlag(action.payload, state.cells);
        state.totalFlags -= 1;
      } else if (state.totalFlags < state.totalMines) {
        state.cells = toggleCellFlag(action.payload, state.cells);
        state.totalFlags += 1;
      }
    },
    setElapsedTime: (state, action) => {
      state.elapsedTime = action.payload;
    },
    incrementElapsedTime: (state) => {
      state.elapsedTime += 1;
    },
  },
});

export const {
  setCells,
  setHeight,
  setWidth,
  setTotalMines,
  resetGame,
  toggleFlag,
  unconverCell,
  setElapsedTime,
  incrementElapsedTime,
} = boardSlice.actions;

const neighborOffsets = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const nearNeighborOffsets = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
];

const generateBoard = (height: number, width: number, mines: number) => {
  let cells = new Array(height).fill(null).map((value) => {
    return new Array(width).fill(null).map((value) => {
      return {
        state: cellStates.covered,
        hasMine: false,
        adjacentMines: 0,
      } as CellType;
    });
  });

  const buryMine = () => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (cells[y][x].hasMine) {
      buryMine();
    } else {
      cells[y][x].hasMine = true;
      neighborOffsets.forEach((offset) => {
        const [xOffset, yOffset] = offset;
        try {
          cells[y + yOffset][x + xOffset].adjacentMines += 1;
        } catch (e) {}
      });
    }
  };

  for (let i = 1; i <= mines; i++) {
    buryMine();
  }
  return cells;
};

export const newGame = (
  height: number,
  width: number,
  mines: number
): AppThunk => (dispatch) => {
  dispatch(setHeight(Number(height)));
  dispatch(setWidth(Number(width)));
  dispatch(setTotalMines(Number(mines)));
  dispatch(resetGame());
  dispatch(setCells(generateBoard(Number(height), Number(width), Number(mines))));
};

const toggleCellFlag = (coordinates: [number, number], cells: CellType[][]) => {
  const [x, y] = coordinates;
  cells[y][x].state = cellHasFlag(coordinates, cells)
    ? cellStates.covered
    : cellStates.flagged;
  return cells;
};

const cellHasFlag = (coordinates: [number, number], cells: CellType[][]) => {
  const [x, y] = coordinates;
  return cells[y][x].state === cellStates.flagged;
};

const cellHasMine = (coordinates: [number, number], cells: CellType[][]) => {
  const [x, y] = coordinates;
  return cells[y][x].hasMine;
};

const moveMine = (coordinates: [number, number], cells: CellType[][], width: number, height: number) => {
  let newCells = cells;
  const [x, y] = coordinates;

  const buryMine = () => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    if (newCells[y][x].hasMine) {
      buryMine();
    } else {
      newCells[y][x].hasMine = true;
      neighborOffsets.forEach((offset) => {
        const [xOffset, yOffset] = offset;
        try {
          newCells[y + yOffset][x + xOffset].adjacentMines += 1;
        } catch (e) {}
      });
    }
  };

  buryMine();
  newCells[y][x].hasMine = false;
  neighborOffsets.forEach((offset) => {
    const [xOffset, yOffset] = offset;
    try {
      newCells[y + yOffset][x + xOffset].adjacentMines -= 1;
    } catch (e) {}
  });

  return newCells;
};

const countCoveredAndFlaggedCells = (cells: CellType[][]) => {
  let count = 0;
  cells.forEach(row => {
    count += row.filter(cell => cell.state === cellStates.covered || cell.state === cellStates.flagged).length
  });
  return count;
}

const recursivelyUncoverCells = (
  coordinates: [number, number],
  cells: CellType[][]
) => {
  const [x, y] = coordinates;

  if (cells[y][x].state === cellStates.covered && !cells[y][x].hasMine) {
    cells[y][x].state = cellStates.uncovered;

    if (cells[y][x].adjacentMines === 0) {
      nearNeighborOffsets.forEach((offset) => {
        const [xOffset, yOffset] = offset;
        try {
          cells = recursivelyUncoverCells([x + xOffset, y + yOffset], cells);
        } catch {}
      });
    }
  }
  return cells;
};

export const selectHeight = (state: RootState) => state.board.height;
export const selectWidth = (state: RootState) => state.board.width;
export const selectTotalMines = (state: RootState) => state.board.totalMines;
export const selectTotalFlags = (state: RootState) => state.board.totalFlags;
export const selectElapsedTime = (state: RootState) => state.board.elapsedTime;
export const selectCells = (state: RootState) => state.board.cells;
export const selectGameState = (state: RootState) => state.board.gameState;

export default boardSlice.reducer;
