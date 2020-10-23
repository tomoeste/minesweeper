import React from "react";
import mockStore from "redux-mock-store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Cell } from "./Cell";
import { cellStates, CellType } from "../boardSlice";

describe("Cell", () => {
  let store: any;
  beforeEach(() => {
    store = mockStore([])({
      board: {
        totalMines: 20,
        totalFlags: 10,
      },
    });
  });

  test("renders Cell", () => {
    let x = 1;
    let y = 1;
    let cell: CellType = {
      state: cellStates.covered,
      hasMine: false,
      adjacentMines: 0,
    };
    const { getByRole } = render(
      <Provider store={store}>
        <Cell cell={cell} x={x} y={y} />
      </Provider>
    );

    expect(getByRole("button")).toBeInTheDocument();
  });
});
