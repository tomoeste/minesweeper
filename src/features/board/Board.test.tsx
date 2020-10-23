import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider, useDispatch } from "react-redux";
import { Board } from "./Board";
import { store } from "../../app/store";
import { gameStates, initialState, newGame } from "./boardSlice";

describe("Board", () => {
  test("renders Board", () => {
    store.dispatch(newGame(4, 4, 4));

    const board = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    expect(board.getByLabelText(`reset`)).toHaveTextContent(`😀`);
  });

  test("renders correct number of cells (default)", async () => {
    store.dispatch(newGame(4, 4, 4));

    const board = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    const cells = await board.findAllByTestId(/cell/i);
    expect(cells).toHaveLength(16);
  });

  test("uncovers cell with no adjacent mines", async () => {
    store.dispatch(newGame(4, 4, 4));

    const board = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    let cellX = 0;
    let cellY = 0;
    store.getState().board.cells.some((row, y) => {
      return row.some((cell, x) => {
        if (cell.hasMine === false && cell.adjacentMines === 0) {
          cellX = x;
          cellY = y;
          return true;
        } else {
          return false;
        }
      });
    });

    const cell = await board.findByTestId(`cell-${cellX}-${cellY}`);
    fireEvent.click(cell);
    const uncoveredCells = await board.findAllByText(/\b\d\b/i);
    expect(uncoveredCells).not.toHaveLength(0);
  });

  test("uncovers cell with adjacent mines", async () => {
    store.dispatch(newGame(4, 4, 4));

    const board = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    let cellX = 0;
    let cellY = 0;
    let cellAdjacentmines = 0;
    store.getState().board.cells.some((row, y) => {
      return row.some((cell, x) => {
        if (cell.hasMine === false && cell.adjacentMines > 0) {
          cellX = x;
          cellY = y;
          cellAdjacentmines = cell.adjacentMines;
          return true;
        } else {
          return false;
        }
      });
    });

    let cell = await board.findByTestId(`cell-${cellX}-${cellY}`);

    fireEvent.click(cell);

    cell = await board.findByTestId(`inner-${cellX}-${cellY}`);

    await waitFor(() => {
      expect(cell).toHaveTextContent(cellAdjacentmines.toString());
    });
  });

  test("uncovers mine on first turn", async () => {
    store.dispatch(newGame(4, 4, 4));

    const board = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    let cellX = 0;
    let cellY = 0;
    store.getState().board.cells.some((row, y) => {
      return row.some((cell, x) => {
        if (cell.hasMine === true) {
          cellX = x;
          cellY = y;
          return true;
        } else {
          return false;
        }
      });
    });

    const cell = await board.findByTestId(`cell-${cellX}-${cellY}`);
    fireEvent.click(cell);
    const uncoveredCells = await board.findAllByText(/\b\d\b/i);
    expect(uncoveredCells).not.toHaveLength(0);
  });

  test("uncovers mine after first turn (lose condition)", async () => {
    store.dispatch(newGame(4, 4, 4));

    const board = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    expect(board.getByLabelText(`reset`)).toHaveTextContent(`😀`);

    let cellX = 0;
    let cellY = 0;
    store.getState().board.cells.some((row, y) => {
      return row.some((cell, x) => {
        if (cell.hasMine === false) {
          cellX = x;
          cellY = y;
          return true;
        } else {
          return false;
        }
      });
    });

    let cell = await board.findByTestId(`cell-${cellX}-${cellY}`);

    fireEvent.click(cell);
    expect(board.getByLabelText(`reset`)).toHaveTextContent(`😀`);

    store.getState().board.cells.some((row, y) => {
      return row.some((cell, x) => {
        if (cell.hasMine === true) {
          cellX = x;
          cellY = y;
          return true;
        } else {
          return false;
        }
      });
    });

    cell = await board.findByTestId(`cell-${cellX}-${cellY}`);

    fireEvent.click(cell);
    await waitFor(() => {
      expect(board.getByLabelText(`reset`)).toHaveTextContent(`🤕`);
    });
  });

  test("uncovers all non-mine cells (win condition)", async () => {
    store.dispatch(newGame(1, 2, 1));

    const board = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    expect(board.getByLabelText(`reset`)).toHaveTextContent(`😀`);

    store.getState().board.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.hasMine === false) {
          board
            .findByTestId(`cell-${x}-${y}`)
            .then((cell) => fireEvent.click(cell));
        }
      });
    });

    await waitFor(() => {
      expect(board.getByLabelText(`reset`)).toHaveTextContent(`😎`);
    });
  });
});
