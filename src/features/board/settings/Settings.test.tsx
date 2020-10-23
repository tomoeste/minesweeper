import React from "react";
import mockStore from "redux-mock-store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Settings } from "./Settings";

describe("Settings", () => {
  let store: any;
  beforeEach(() => {
    store = mockStore([])({
      board: {
        totalMines: 20,
        totalFlags: 10,
      },
    });
  });

  test("renders Settings", () => {
    const { getByLabelText, getByText } = render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(getByLabelText(/Height/i)).toBeInTheDocument();
    expect(getByLabelText(/Width/i)).toBeInTheDocument();
    expect(getByLabelText(/Mines/i)).toBeInTheDocument();
    expect(getByText(/Cancel/i)).toBeInTheDocument();
    expect(getByText(/New game/i)).toBeInTheDocument();
  });
});
