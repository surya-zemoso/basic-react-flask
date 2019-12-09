import Plot from "react-plotly.js";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export default function Generateplot(props) {
  return (
    <div id="plot">
      <Plot
        data={[
          {
            type: "bar",
            x: props.rows.map(data => data.date),
            y: props.rows.map(data => data.amount)
          }
        ]}
        layout={{ width: 520, height: 380, title: "Date & Spend mount plot" }}
      />
    </div>
  );
}
