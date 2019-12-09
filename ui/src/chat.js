import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Main from "./main";
import { Route, Redirect } from "react-router";
import FaceIcon from "@material-ui/icons/Face";
import io from "socket.io-client";
import $ from "jquery";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import SendIcon from "@material-ui/icons/Send"; // import Createstyle from "./app";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { renderToString } from "react-dom/server";
import { mergeClasses } from "@material-ui/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Tooltip from "@material-ui/core/Tooltip";

// var socket = io.connect("http://" + document.domain + ":" + location.port);
// var socket = io("http://localhost:5000", {
//   path: "/user/chat"
// });
const socket = io("http://localhost:5000");

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {". Built with "}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI.
      </Link>
    </Typography>
  );
}

function Createstyle(Comp) {
  return function WrappedComponent(props) {
    const style = makeStyles(theme => ({
      button: {
        margin: theme.spacing(1),
        float: "right"
      },
      rightIcon: {
        marginLeft: theme.spacing(1)
      },
      form: {
        marginTop: "100px"
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 500
      },
      paper: {
        maxWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2)
      }
    }));
    return <Comp {...props} style={style} />;
  };
}
class Chat extends Component {
  constructor() {
    super();
    this.state = { message: "" };
    this.joinRoom = this.joinRoom.bind(this);
    this.setSocketListner = this.setSocketListner.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    this.changeMessage = this.changeMessage.bind(this);
  }
  joinRoom(event) {
    event.preventDefault();
    if (!event.target["message"]["value"]) {
      return;
    }
    let self = this;
    socket.emit("my_event", {
      user_name: self.props.user.first_name,
      message: event.target["message"]["value"],
      uuid: self.props.user.uuid,
      avatar: self.props.user.image
    });
    this.setState({ message: "" });
  }
  changeMessage(event) {
    if (!event) return;
    this.setState({ message: event.target["value"] });
  }
  componentDidMount() {
    this.setSocketListner();
    this.loadMessage();
  }
  getList(msg) {
    const classes = this.props.style;
    if (msg.uuid == this.props.user.uuid) {
      return renderToString(
        <div className="admin-message">
          <Grid item>
            {/* <Avatar>W</Avatar> */}
            <Tooltip title={msg.user_name} placement="top">
              {msg.avatar ? (
                <Avatar src={msg.avatar} className={classes.bigAvatar} />
              ) : (
                <Avatar className={classes.avatar}>
                  <AccountCircle />
                </Avatar>
              )}
            </Tooltip>
          </Grid>
          <div className="admin-list-message">
            <Typography>{msg.message}</Typography>
          </div>
        </div>
      );
    } else {
      return renderToString(
        <div className="user-message">
          <div style={{ float: "right", display: "flex" }}>
            <div className="user-list-message">
              <Typography>{msg.message}</Typography>
            </div>
            <Grid item style={{ float: "right" }}>
              {/* <Avatar>W</Avatar> */}
              <Tooltip title={msg.user_name} placement="top">
                {msg.avatar ? (
                  <Avatar src={msg.avatar} className={classes.bigAvatar} />
                ) : (
                  <Avatar className={classes.avatar}>
                    <AccountCircle />
                  </Avatar>
                )}
              </Tooltip>
            </Grid>
          </div>
        </div>
      );
    }
  }
  setSocketListner() {
    let self = this;
    socket.on("connect", function() {
      socket.emit("my_event", {
        data: "User Connected"
      });
    });
    socket.on("my_response", function(msg) {
      let x = self.getList(msg);
      if (typeof msg.user_name !== "undefined") {
        $("h3").remove();
        $("div.message_holder").append(x);
      }
    });
  }
  loadMessage() {}
  render() {
    const classes = this.props.style;
    return (
      <React.Fragment>
        <CssBaseline />
        <Container fixed maxWidth="sm">
          <Typography
            component="div"
            style={{
              backgroundColor: "#F5F5F5",
              height: "75vh",
              borderRadius: "10px",
              position: "relative"
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: "30px",
                backgroundColor: "#3f51b5",
                height: "60px",
                borderRadius: "10px 10px 0px 0px"
              }}
            >
              <h4 style={{ marginBottom: "0px", padding: "8px 0px 0px 10px" }}>
                Chat Bot ...
              </h4>
            </div>
            <div className="message_holder"></div>
            <div
              style={{
                bottom: "0px",
                position: "absolute",
                // borderTop: "1px solid",
                width: "100%",
                backgroundColor: "#e8e8e8",
                borderRadius: "0px 0px 10px 10px"
              }}
            >
              <form action="" onSubmit={this.joinRoom} method="POST">
                <TextField
                  id="standard-name"
                  placeholder="Type a message..."
                  style={{ width: "90%" }}
                  name="message"
                  value={this.state.message}
                  onChange={this.changeMessage}
                  className={classes.textField}
                  margin="normal"
                />
                <IconButton
                  aria-label="send"
                  type="submit"
                  className={classes.button}
                >
                  <SendIcon className={classes.rightIcon}></SendIcon>
                </IconButton>
              </form>
            </div>
          </Typography>
        </Container>
      </React.Fragment>
    );
  }
}
Chat = Createstyle(Chat);
export default Chat;
