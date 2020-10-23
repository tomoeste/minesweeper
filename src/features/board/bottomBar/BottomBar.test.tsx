import React from "react";
import mockStore from "redux-mock-store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BottomBar } from "./BottomBar";

describe("BottomBar", () => {
  let store: any;
  beforeEach(() => {
    store = mockStore([])({
      board: {
        totalMines: 20,
        totalFlags: 10,
      },
    });
  });

  test("renders settings button in BottomBar", () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <BottomBar />
      </Provider>
    );

    expect(getByLabelText("settings")).toBeInTheDocument();
  });
});
