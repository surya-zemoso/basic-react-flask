import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

export default function Datatable(props) {
  const useStyles = makeStyles(theme => ({
    root: {
      // width: "100%",
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
      overflowX: "auto"
    },
    table: {
      width: 832
    }
  }));
  console.log("props of rows.....", props.rows);
  const remove = index => {
    props.onDelete(index);
  };
  const classes = useStyles();
  return (
    <Paper
      className={classes.root}
      style={{ overflow: "auto", maxHeight: "550px" }}
    >
      <Table className={classes.table}>
        <TableHead>
          <TableRow
            style={{
              backgroundColor: "aliceblue",
              height: "40px",
              fontSize: "25px",
              fontWeight: "500"
            }}
          >
            <TableCell>Mood</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow
              key={row.name}
              style={{
                backgroundColor: "aliceblue"
              }}
            >
              <TableCell component="th" scope="row">
                {row.mood}
              </TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.brand}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell align="right">
                {
                  <Button
                    onClick={() => remove(index)}
                    variant="outlined"
                    color="secondary"
                  >
                    Remove
                  </Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
