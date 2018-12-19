import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class Password extends React.Component {
  state = {
    open: false,
    password: ""
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleAccept = () => {
    this.props.handlePassword(this.state.password);
    this.handleClose();
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Access
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Access denied</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To continue, please enter the password here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label=""
              type="password"
              fullWidth
              onChange={event => this.handlePassword(event)}
              onKeyPress={ev => {
                if (ev.key === "Enter") {
                  this.handleAccept();
                  ev.preventDefault();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.handleAccept()} color="primary">
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
