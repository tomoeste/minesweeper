import React from "react";
import mockStore from "redux-mock-store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Timer } from "./Timer";

describe("Timer", () => {
  let store: any;
  beforeEach(() => {
    store = mockStore([])({
      board: {
        elapsedTime: 10,
      },
    });
  });

  test("renders timer", () => {
    const { getByText } = render(
      <Provider store={store}>
        <Timer />
      </Provider>
    );

    expect(getByText("010")).toBeInTheDocument();
  });
});
