import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import Main from "./main";
import Grid from "@material-ui/core/Grid";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link
} from "react-router-dom";
import ChatIcon from "@material-ui/icons/Chat";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Login from "./login";
import SignUp from "./signup";
import Profile from "./profile";
import Chat from "./chat";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import HomeIcon from "@material-ui/icons/Home";

const SomeComponent = withRouter(props => <App {...props} />);

function Createstyle(Comp) {
  return function WrappedComponent(props) {
    const style = makeStyles(theme => ({
      "@global": {
        body: {
          backgroundColor: theme.palette.common.white
        }
      },
      root: {
        flexGrow: 0
      },
      menuButton: {
        marginRight: theme.spacing(2)
      },
      title: {
        flexGrow: 2,
        display: "inline"
      },
      list: {
        width: 450
      },
      fullList: {
        width: "auto"
      }
    }));
    return <Comp {...props} style={style} />;
  };
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      loggedIn: false,
      loggedOut: false,
      user: null,
      signedUp: null,
      title: "Welcome",
      left: false,
      username: "UNKNOWN",
      avatar: ""

      // profile: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.loginClicked = this.loginClicked.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.signupUser = this.signupUser.bind(this);
    this.changeMenu = this.changeMenu.bind(this);
    this.updateProfile = this.updateProfile.bind(this);

    // this.setProfile = this.setProfile.bind(this);
  }
  updateProfile() {
    this.getUpdatedData();
  }
  handleChange(event) {
    // event.persist()
    this.setState({ loggedIn: event.currentTarget });
  }

  handleMenu(event) {
    // event.persist()
    this.setState({ anchorEl: event.currentTarget });
  }
  signupUser() {
    this.setState({ signedUp: true });
  }
  loginUser(data) {
    this.setState({
      user: data,
      title: `Welcome ${data.first_name}`,
      username: data.first_name,
      avatar: data.image
    });
    this.setState({ loggedIn: true });
    this.setState({ loggedOut: false });
  }
  logoutUser() {
    fetch(`http://localhost:5000/signout/${this.state.user.uuid}`, {
      // mode: "no-cors",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    })
      .then(function(response, d) {
        if (!response.ok) {
          throw new Error("Bad status code from server.");
        }
        return response.json();
      })
      .then(
        function(data) {
          this.setState({ title: `Welcome` });
          this.setState({ anchorEl: null });
          this.setState({ loggedIn: false });
          this.setState({ loggedOut: true });
          this.setState({ user: null });
        }.bind(this)
      );
    event.preventDefault();
  }
  handleClose(event) {
    // event.persist()
    this.setState({ anchorEl: null });
  }
  setProfile() {
    this.setState({ profile: true });
  }
  loginClicked() {
    alert("logged in");
  }
  toggleDrawer = open =>
    function(event) {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }

      this.setState({ left: open });
    }.bind(this);
  componentDidMount() {
    this.getUpdatedData();
  }
  getUpdatedData() {
    let self = this;
    if (window.location.pathname.includes("/user")) {
      let id = window.location.pathname
        .replace("/user:", "")
        .replace("/home", "")
        .replace("/profile", "")
        .replace("/chat", "");

      fetch(`http://localhost:5000/getuser/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      })
        .then(function(response, d) {
          if (!response.ok) {
            throw new Error("Bad status code from server.");
          }
          return response.json();
        })
        .then(
          function(data) {
            if (!Object.keys(data.data).length) {
              this.setState({ title: `Welcome` });
              this.setState({ anchorEl: null });
              this.setState({ loggedIn: false });
              this.setState({ loggedOut: true });
              return;
            }
            this.setState({ user: data.data });
            this.setState({
              title: `Welcome ${data.data.first_name}`,
              username: data.data.first_name,
              avatar: data.data.image
            });
            this.setState({ loggedIn: true, loggedOut: false });
          }.bind(this)
        );
    }
  }
  changeMenu() {
    this.setState({ anchorEl: null });
    this.getUpdatedData();
  }

  render() {
    const classes = this.props.style;
    const self = this;
    const open = Boolean(this.state.anchorEl);
    const homePath = this.state.user
      ? `/user:${this.state.user.uuid}/home`
      : `/user/`;
    const profilePath = this.state.user
      ? `/user:${this.state.user.uuid}/profile`
      : `/user/profile`;
    const chatPath = this.state.user
      ? `/user:${this.state.user.uuid}/chat`
      : `/user/chat`;
    // const chatPath = `/user/chat`;
    console.log("chatPath is", chatPath);
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Router>
          <AppBar position="static">
            <Toolbar>
              <div className="font-icon-wrapper">
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  onClick={this.toggleDrawer(true)}
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
              </div>
              <Typography
                variant="h6"
                className={classes.title}
                style={{
                  display: "inline",
                  width: "100%",
                  textTransform: "capitalize"
                }}
              >
                {this.state.title}
              </Typography>

              {this.state.loggedIn ? (
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-end"
                >
                  {this.state.user.image ? (
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <Avatar
                        src={this.state.user.image}
                        className={classes.bigAvatar}
                      />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <Avatar className={classes.avatar}>
                        <AccountCircle />
                      </Avatar>
                    </IconButton>
                  )}
                </Grid>
              ) : (
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-end"
                >
                  <Link to="/login/" style={{ textDecoration: "none" }}>
                    <Button variant="contained">Login</Button>
                  </Link>
                  <Link
                    to="/signup/"
                    style={{ textDecoration: "none", paddingLeft: "10px" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => this.setState({ signedUp: false })}
                    >
                      SignUp
                    </Button>
                  </Link>
                </Grid>
              )}
            </Toolbar>
          </AppBar>
          <div>
            <Route
              path={homePath}
              render={() =>
                this.state.loggedOut && !this.state.loggedIn ? (
                  <Redirect from={homePath} to="/" />
                ) : (
                  <Main user={this.state.user} />
                )
              }
            />
          </div>
          <div>
            <Route
              path="/login/"
              render={() =>
                this.state.loggedIn ? (
                  <Redirect from="/login/" to={homePath} />
                ) : (
                  <Login loginUser={this.loginUser} />
                )
              }
            />
          </div>
          <div>
            <Route
              path={profilePath}
              render={() => (
                <Profile
                  user={this.state.user}
                  updateProfile={this.updateProfile}
                />
              )}
            />
          </div>
          <div>
            <Route path="/" />
          </div>
          <div>
            <Route
              path={chatPath}
              render={() => <Chat user={this.state.user} />}
            />
          </div>
          <div>
            <Route
              path="/signup/"
              render={() =>
                this.state.signedUp ? (
                  <Redirect from="/signup/" to="/login/" />
                ) : (
                  <SignUp signupUser={this.signupUser} />
                )
              }
            />
          </div>
          <div>
            <Drawer open={this.state.left} onClose={this.toggleDrawer(false)}>
              {this.state.loggedIn ? (
                <div
                  className={this.props.style.list}
                  role="presentation"
                  onClick={this.toggleDrawer(false)}
                  onKeyDown={this.toggleDrawer(false)}
                >
                  <List>
                    <Link
                      to={homePath}
                      variant="body2"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem button>
                        <ListItemIcon>
                          <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Home"} />
                      </ListItem>
                    </Link>
                    <Link
                      to={profilePath}
                      variant="body2"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem button>
                        <ListItemIcon>
                          <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary={"Profile"} />
                      </ListItem>
                    </Link>
                    <Link
                      to="/"
                      variant="body2"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem button onClick={this.logoutUser}>
                        <ListItemIcon>
                          <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Logout"} />
                      </ListItem>
                    </Link>
                    <Link
                      to={chatPath}
                      variant="body2"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <ListItem button>
                        <ListItemIcon>
                          <ChatIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Chat Room"} />
                      </ListItem>
                    </Link>
                  </List>
                  <Divider />
                </div>
              ) : (
                <List />
              )}
            </Drawer>
          </div>
        </Router>
      </div>
    );
  }
}
App = Createstyle(App);
export default App;
