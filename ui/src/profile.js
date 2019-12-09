import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Main from "./main";
import { Route, Redirect } from "react-router";
import FaceIcon from "@material-ui/icons/Face";
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

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  bigAvatar: {
    margin: 10,
    width: 160,
    height: 160
  }
}));

export default function Profile(props) {
  let user = props.user;
  const classes = useStyles();
  const [imgUrl, setImgUrl] = React.useState(user.image);
  const readFile = function(event) {
    event.persist();
    var file = event.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
    reader.onloadend = function(e) {
      fetch(`http://localhost:5000/updateprofile/${user.uuid}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ image: reader.result })
      })
        .then(function(response, d) {
          if (!response.ok) {
            throw new Error("User can not update profile");
          }
          return response.json();
        })
        .then(function(data) {
          setImgUrl(reader.result);
          props.updateProfile();
        });
    };
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {user.image ? (
          <Avatar src={imgUrl} className={classes.bigAvatar} />
        ) : (
          <Avatar className={classes.avatar}>
            <FaceIcon />
          </Avatar>
        )}
        <Typography component="h1" variant="h5">
          My Profile
        </Typography>
        <form className={classes.form} noValidate>
          <h4>First name: {user.first_name}</h4>
          <h4>Last name: {user.last_name}</h4>
          <h4>Email: {user.email}</h4>
          <Grid container>
            <Grid item>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={readFile}
                onClick={event => {
                  event.target.value = null;
                }}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                >
                  Upload profile
                </Button>
              </label>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>{/* <Copyright /> */}</Box>
    </Container>
  );
}
