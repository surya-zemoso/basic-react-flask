import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import io from "socket.io-client";
// const socket = io("http://localhost:5000");

ReactDOM.render(<App />, document.getElementById("root"));
