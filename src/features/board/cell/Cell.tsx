import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CellType,
  cellStates,
  unconverCell,
  selectGameState,
  toggleFlag,
  gameStates,
} from "../boardSlice";
import styles from "./Cell.module.css";

interface cellProps {
  cell: CellType;
  x: number;
  y: number;
}

export const Cell = React.memo((props: cellProps) => {
  const [exploded, setExploded] = React.useState(false);
  const gameState = useSelector(selectGameState);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (gameState !== gameStates.lost) setExploded(false);
  }, [gameState]);

  const isLeftClick = (type: string) => type === `click`;
  const isRightClick = (type: string) => type === `contextmenu`;

  const clickCell = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (gameState === gameStates.initial || gameState === gameStates.running) {
      const { cell, x, y } = props;
      if (isLeftClick(ev.type)) {
        if (cell.state === cellStates.covered) {
          if (cell.hasMine) setExploded(true);
          dispatch(unconverCell([x, y]));
        }
      } else if (isRightClick(`contextmenu`)) {
        dispatch(toggleFlag([x, y]));
        ev.preventDefault();
        return false;
      }
    }
  };

  return (
    <div className={styles.row}>
      <button
        data-testid={`cell-${props.x}-${props.y}`}
        className={`${styles.button} ${
          props.cell.state === cellStates.uncovered ? styles.uncovered : ``
        }`}
        onClick={clickCell}
        onContextMenu={clickCell}
        style={{
          backgroundColor:
            exploded && props.cell.hasMine && gameState === gameStates.lost
              ? `tomato`
              : ``,
        }}
      >
        <span
          data-testid={`inner-${props.x}-${props.y}`}
          role="img"
          aria-label="cell"
        >
          {(gameState === gameStates.lost ||
            props.cell.state === cellStates.uncovered) &&
            (props.cell.hasMine ? `💣` : ``)}
          {gameState === gameStates.won && (props.cell.hasMine ? `🚩` : ``)}
          {props.cell.state === cellStates.uncovered &&
            (props.cell.adjacentMines > 0 ? props.cell.adjacentMines : ``)}
          {(gameState === gameStates.running ||
            gameState === gameStates.initial) &&
            props.cell.state === cellStates.flagged &&
            `🚩`}
        </span>
      </button>
    </div>
  );
});
