import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  newGame,
  selectCells,
  selectHeight,
  selectTotalMines,
  selectWidth,
} from "./boardSlice";
import { Cell } from "./cell/Cell";
import styles from "./Board.module.css";
import { StatusBar } from "./statusBar/StatusBar";
import { BottomBar } from "./bottomBar/BottomBar";
import { Settings } from "./settings/Settings";

export function Board() {
  const [showSettings, setShowSettings] = useState(true);

  const cells = useSelector(selectCells);
  const height = useSelector(selectHeight);
  const width = useSelector(selectWidth);
  const mines = useSelector(selectTotalMines);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (cells.length === 0) dispatch(newGame(height, width, mines));
  }, [cells.length, dispatch, height, mines, width]);

  return (
    <div className={styles.board}>
      <Settings setShowSettings={setShowSettings} showSettings={showSettings} />
      <StatusBar />
      <div className={styles.cells}>
        {cells.map((row, rowIndex) => {
          return (
            <div className={styles.row} key={`row${rowIndex}`}>
              {row.map((cell, columnIndex) => {
                return (
                  <Cell
                    cell={cell}
                    key={`${rowIndex}-${columnIndex}`}
                    y={rowIndex}
                    x={columnIndex}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <BottomBar
        setShowSettings={setShowSettings}
        showSettings={showSettings}
      />
    </div>
  );
}
