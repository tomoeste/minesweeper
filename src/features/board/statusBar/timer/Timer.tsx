import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  gameStates,
  incrementElapsedTime,
  selectElapsedTime,
  selectGameState,
} from "../../boardSlice";
import styles from "./Timer.module.css";

export function Timer() {
  const seconds = useSelector(selectElapsedTime);
  const gameState = useSelector(selectGameState);
  let timerInt = React.useRef<any>();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (gameState === gameStates.running) {
      timerInt.current = setInterval(() => {
        dispatch(incrementElapsedTime());
      }, 1000);
    } else {
      if (timerInt.current) clearInterval(timerInt.current);
    }
    return () => {
      if (timerInt.current) clearInterval(timerInt.current);
    };
  }, [dispatch, gameState]);

  return <div className={styles.row}>{String(seconds).padStart(3, "0")}</div>;
}
