import React from "react";
import mockStore from "redux-mock-store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Counter } from "./Counter";

describe("Counter", () => {
  let store: any;
  beforeEach(() => {
    store = mockStore([])({
      board: {
        totalMines: 20,
        totalFlags: 10,
      },
    });
  });

  test("renders Counter", () => {
    const { getByText } = render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );

    expect(getByText("010")).toBeInTheDocument();
  });
});
