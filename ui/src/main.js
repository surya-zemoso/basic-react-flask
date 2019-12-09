import React, { Component, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import "./App.css";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import TextField from "@material-ui/core/TextField";
import Datatable from "./datatable";
import Generateplot from "./generateplot";
import Switch from "@material-ui/core/Switch";
import Input from "@material-ui/core/Input";
// var socket = io.connect("http://localhost:5000");

const BootstrapInput = withStyles(theme => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  }
}))(InputBase);
const Options = ["Liquor", "Tobaco"];
const Moods = ["Happy", "Sad", "Normal"];
const LiquorBrand = ["Heineken", "Budwiser", "Corona"];
const tobacoBrand = ["Marlboro", "Black", "Gold flake"];
var brands = [];
var data = [];
export default function Main(props) {
  let user = props.user;
  if (!Object.keys(user).length) {
    return;
  }
  if (user.report.length) {
    data = JSON.parse("[" + user.report + "]");
  }
  const [datasets, setDatasets] = useState(
    user && user.report.length ? JSON.parse("[" + user.report + "]") : []
  );
  const [date, setDate] = useState(new Date());
  const handleDelete = index => {
    fetch(`http://localhost:5000/delete/${user.uuid}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ index: index })
    })
      .then(function(response, d) {
        if (!response.ok) {
          throw new Error("User can not delete the report");
        }
        return response.json();
      })
      .then(function(data) {
        setDatasets(jsonToArray(data.data.report));
        console.log("data", data);
      });
  };

  const submit = function(event) {
    let obj = {};
    obj["mood"] = event.target["mood"]["value"];
    obj["type"] = event.target["type"]["value"];
    obj["date"] = event.target["date"]["value"];
    obj["brand"] = event.target["brand"]["value"];
    obj["quantity"] = event.target["quantity"]["value"];
    obj["amount"] = event.target["amount"]["value"];
    data.push(obj);
    setDatasets(data.map(d => d));
    var dataToStore = data.map(d => JSON.stringify(d));

    event.persist();
    fetch(`http://localhost:5000/addreport/${user.uuid}`, {
      // mode: "no-cors",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(obj)
    })
      .then(function(response, d) {
        if (!response.ok) {
          throw new Error("Bad status code from server.");
        }
        return response.json();
      })
      .then(function(data) {
        setDatasets(jsonToArray(data.data.report));
        console.log("data", data);
      });
    event.preventDefault();
  };
  const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    margin: {
      margin: theme.spacing(1)
    },
    marginDate: {
      margin: theme.spacing(3)
    },
    marginSubmit: {
      margin: theme.spacing(4)
    }
  }));
  const classes = useStyles();
  const [type, setType] = React.useState("");
  const [selected, setSelected] = React.useState(null);
  const [drawplot, setDrawplot] = React.useState(false);

  const [mood, setMood] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const generateplot = value => setDrawplot(value);
  const typeChange = event => {
    setType(event.target.value);
    brands = event.target.value == "Liquor" ? LiquorBrand : tobacoBrand;
  };
  const moodChange = event => {
    setMood(event.target.value);
  };
  const brandChange = function(event) {
    setBrand(event.target.value);
  };
  const switchplot = function() {
    setDrawplot(!drawplot);
  };
  function jsonToArray(data) {
    return JSON.parse("[" + data + "]");
  }
  const getDate = () => new Date().getDate();
  return (
    <div className="App2">
      <div className="formBody">
        <div>
          <h1>Smoking & alcohol consumptions</h1>
        </div>
        <div>
          <p>Enter text in the input field to add item in your list</p>
        </div>
        <div>
          <p>Click (Remove) for remove item from list</p>
        </div>
        <form id="myForm" name="myForm" onSubmit={submit}>
          <FormControl className="formInput" required>
            <InputLabel htmlFor="mood-customized-native-simple">
              Mood
            </InputLabel>
            <Select
              required
              value={mood}
              onChange={moodChange}
              input={<Input name="mood" id="mood-customized-native-simple" />}
            >
              {Moods.map(function(name, index) {
                return (
                  <MenuItem value={name} key={index.toString()}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className="formInput" required>
            <InputLabel htmlFor="type-customized-native-simple">
              Type
            </InputLabel>
            <Select
              //  native
              //  required
              value={type}
              displayEmpty
              onChange={typeChange}
              input={<Input name="type" id="type-customized-native-simple" />}
            >
              {Options.map(function(name, index) {
                return (
                  <MenuItem value={name} key={index.toString()}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl className="formInput formDate">
            <TextField
              id="date"
              label="Date"
              required
              type="date"
              defaultValue={date}
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl required={true} className="formInput">
            <InputLabel htmlFor="brand-customized-simple">Brand</InputLabel>
            <Select
              // native
              // required
              value={brand}
              onChange={brandChange}
              input={<Input name="brand" id="brand-customized-simple" />}
            >
              {brands.map((brand, index) => (
                <MenuItem value={brand} key={index.toString()}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl required={true} className="formInput">
            <InputLabel htmlFor="quantity-customized-input">
              Quantity
            </InputLabel>
            <Input name="quantity" id="quantity-customized-input" />
          </FormControl>
          <FormControl required={true} className="formInput">
            <InputLabel htmlFor="amount-customized-input">Amount</InputLabel>
            <Input name="amount" id="amount-customized-input" />
          </FormControl>
          <FormControl required={true} className="formButton">
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </FormControl>
        </form>
      </div>
      <div className="layoutRow">
        <div className="dataTable">
          <Datatable rows={datasets} onDelete={handleDelete} />
        </div>
        <div className="switchButton">
          <h3>Generate Plot</h3>
          <Switch
            checked={drawplot}
            value={drawplot}
            onChange={switchplot}
            color="primary"
          />
          <div id="plot">{drawplot && <Generateplot rows={datasets} />}</div>
        </div>
      </div>
    </div>
  );
}
