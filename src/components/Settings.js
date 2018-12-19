import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Password from "./Password";

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      api_host: "",
      api_key: "",
      open: false,
      show: false,
      status: ""
    };
  }

  componentDidMount() {
    let api_host = localStorage.getItem("api_host") || "";
    let api_key = localStorage.getItem("api_key") || "";

    this.setState({
      api_host,
      api_key
    });
  }

  handleSave = event => {
    event.preventDefault();
    window.localStorage.setItem("api_host", this.state.api_host);
    window.localStorage.setItem("api_key", this.state.api_key);

    this.setState({ open: true, status: "Success!" });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClose = reason => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  handlePassword = password => {
    console.log(process.env.REACT_APP_PASSWORD);
    if (password === process.env.REACT_APP_PASSWORD) {
      this.setState({ show: true, open: true, status: "Success!" });
    } else {
      //this.setState({ open: true, status: "Password wrong!" });
      alert("The password is wrong!");
    }
  };

  renderSettings() {
    return (
      <form noValidate autoComplete="off" onSubmit={this.handleSave}>
        <TextField
          label="API Host"
          style={{ margin: 8 }}
          name="api_host"
          value={this.state.api_host}
          fullWidth
          margin="normal"
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true
          }}
        />

        <TextField
          label="API Key"
          style={{ margin: 8 }}
          name="api_key"
          value={this.state.api_key}
          helperText=""
          fullWidth
          margin="normal"
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Save
        </Button>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          variant="success"
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.status}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={styles.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </form>
    );
  }

  render() {
    return (
      <React.Fragment>
        <h2>Settings</h2>
        {this.state.show ? (
          this.renderSettings()
        ) : (
          <Password handlePassword={this.handlePassword} />
        )}
      </React.Fragment>
    );
  }
}

export default Settings;
