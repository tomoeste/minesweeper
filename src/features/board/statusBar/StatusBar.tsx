import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spacer } from "../../common/Spacer";
import {
  gameStates,
  newGame,
  selectGameState,
  selectHeight,
  selectTotalMines,
  selectWidth,
} from "../boardSlice";
import { Counter } from "./counter/Counter";
import styles from "./StatusBar.module.css";
import { Timer } from "./timer/Timer";

export function StatusBar() {
  const gameState = useSelector(selectGameState);
  const height = useSelector(selectHeight);
  const width = useSelector(selectWidth);
  const mines = useSelector(selectTotalMines);
  const dispatch = useDispatch();

  const resetClick = () => {
    dispatch(newGame(height, width, mines));
  };

  return (
    <div className={styles.statusBar}>
      <Counter />
      <Spacer />
      <div style={{ display: "flex" }}>
        <button className={styles.button} onClick={resetClick}>
          <span role="img" aria-label="reset">
            {gameState === gameStates.lost
              ? `🤕`
              : gameState === gameStates.won
              ? `😎`
              : `😀`}
          </span>
        </button>
      </div>
      <Spacer />
      <Timer />
    </div>
  );
}
