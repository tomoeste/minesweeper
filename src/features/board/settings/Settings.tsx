import React from "react";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Spacer } from "../../common/Spacer";
import {
  newGame,
  selectHeight,
  selectTotalMines,
  selectWidth,
} from "../boardSlice";
import styles from "./Settings.module.css";

export function Settings(props: any) {
  const height = useSelector(selectHeight);
  const width = useSelector(selectWidth);
  const mines = useSelector(selectTotalMines);
  const dispatch = useDispatch();

  const settingsSchema = Yup.object({
    height: Yup.number().required().integer().max(128).min(4),
    width: Yup.number().required().integer().max(128).min(4),
    mines: Yup.number().required().integer().max(999).min(1),
  });

  return (
    <div
      style={{
        zIndex: 2,
        position: "absolute",
        height: "calc(100% - 20px)",
        width: "calc(100% - 20px)",
        backgroundColor: "whitesmoke",
        padding: "10px",
        visibility: props.showSettings ? "inherit" : "hidden",
        border: "4px solid rgb(201, 201, 201)",
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          height: height,
          width: width,
          mines: mines,
        }}
        validationSchema={settingsSchema}
        onSubmit={(values, actions) => {
          console.log("form submit");
          const totalCells = values.height * values.width;
          if (values.mines > totalCells - 1) {
            actions.setFieldError(
              "mines",
              `mines must be less than height times width (${totalCells})`
            );
          } else {
            dispatch(newGame(values.height, values.width, values.mines));
            props.setShowSettings(false);
          }
          actions.setSubmitting(false);
        }}
      >
        {(formikProps) => {
          return (
            <Form className={styles.form}>
              <label htmlFor="height" className={styles.label}>
                Height
              </label>
              <Field id="height" name="height" className={styles.textField} />
              <span className={styles.error}>
                <ErrorMessage name="height" />
              </span>
              <label htmlFor="width" className={styles.label}>
                Width
              </label>
              <Field id="width" name="width" className={styles.textField} />
              <span className={styles.error}>
                <ErrorMessage name="width" />
              </span>
              <label htmlFor="mines" className={styles.label}>
                Mines
              </label>
              <Field id="mines" name="mines" className={styles.textField} />
              <span className={styles.error}>
                <ErrorMessage name="mines" />
              </span>
              <Spacer />
              <span className={styles.inlineButtonGroup}>
                <Spacer />
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => {
                    props.setShowSettings(false);
                    formikProps.resetForm();
                  }}
                >
                  Cancel
                </button>
                <button className={styles.button} type="submit">
                  New game
                </button>
              </span>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
