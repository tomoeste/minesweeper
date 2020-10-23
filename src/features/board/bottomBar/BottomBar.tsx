import React from "react";
import { Spacer } from "../../common/Spacer";
import styles from "./BottomBar.module.css";

export function BottomBar(props: any) {
  const resetClick = () => {
    props.setShowSettings(!props.showSettings);
  };

  return (
    <div className={styles.statusBar}>
      <Spacer />
      <div style={{ display: "flex" }}>
        <button className={styles.button} onClick={resetClick}>
          <span role="img" aria-label="settings">
            ⚙️
          </span>
        </button>
      </div>
    </div>
  );
}
