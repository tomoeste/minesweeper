import React from "react";
import { useSelector } from "react-redux";
import { selectTotalFlags, selectTotalMines } from "../../boardSlice";
import styles from "./Counter.module.css";

export function Counter() {
  const countFlags = useSelector(selectTotalFlags);
  const countMines = useSelector(selectTotalMines);

  return (
    <div className={styles.row}>
      {String(countMines - countFlags).padStart(3, "0")}
    </div>
  );
}
