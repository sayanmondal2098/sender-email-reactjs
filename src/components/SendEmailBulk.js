import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import { getToken, getTemplates, sendEmail } from "./utils/api";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { senders, nameByEmail } from "./utils/senders";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Password from "./Password";

const styles = {
  formControl: {
    minWidth: 120,
    margin: 8
  },
  buttonProgress: {
    color: "blue",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },
  wrapper: {
    position: "relative"
  },
  snack_success: {
    backgroundColor: "red"
  }
};

class SendEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      name: "",
      email: "",
      subject: "",
      template: "",
      loading: false,
      sending: false,
      from: "",
      status: "",
      templates: [],
      show: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    getToken().then(
      response => {
        getTemplates(response.data.access_token).then(
          response => {
            this.setState({
              loading: false,
              templates: response.data
            });
          },
          error => {
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }

  handleChange = event => {
    const name = event.target.name;

    this.setState({
      [name]: event.target.value
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleBulk = () => {
    if (this.state.from === "") {
      // alert("Email From is required.");
      this.setState({ open: true, status: "Email From is required" });
      return;
    }

    if (this.state.template === "") {
      // alert("Template is required.");
      this.setState({ open: true, status: "Template is required" });
      return;
    }

    const emails = this.state.email.split(",");

    emails.map(e => this.handleSendEmail(e.trim()));
  };

  handleSendEmail = e => {
    const email = {
      html: "",
      text: "",
      template: {
        id: this.state.template
      },
      subject: this.state.subject,
      from: {
        name: nameByEmail(this.state.from),
        email: this.state.from
      },
      to: [
        {
          name: this.state.name,
          email: e
        }
      ]
    };

    this.setState({ sending: true });
    getToken().then(
      response => {
        sendEmail(email, response.data.access_token).then(
          response => {
            this.setState({
              email: "",
              name: "",
              subject: "",
              from: [],
              template: "",
              sending: false,
              open: true,
              status: "The email was sended correctly"
            });
          },
          error => {
            console.log("error", response);
            this.setState({
              sending: false,
              open: true,
              status: error.toString()
            });
          }
        );
      },
      error => {
        alert(error);
      }
    );
  };

  handlePassword = password => {
    if (password === process.env.REACT_APP_PASSWORD) {
      this.setState({ show: true });
    } else {
      alert("The password is wrong!");
    }
  };

  renderSendEmail() {
    return (
      <div>
        <ValidatorForm onSubmit={() => this.handleBulk()}>
          <TextValidator
            variant="outlined"
            label="Email To"
            multiline
            style={{ margin: 8 }}
            placeholder="Enter here the email account..."
            name="email"
            value={this.state.email}
            fullWidth
            margin="normal"
            onChange={this.handleChange}
            validators={["required"]}
            errorMessages={["Email is required", "Email is not valid"]}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextValidator
            variant="outlined"
            label="Name To"
            style={{ margin: 8 }}
            placeholder="Enter here the name..."
            name="name"
            value={this.state.name}
            helperText=""
            fullWidth
            margin="normal"
            onChange={this.handleChange}
            validators={["required"]}
            errorMessages={["Name is required"]}
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextValidator
            variant="outlined"
            label="Subject"
            style={{ margin: 8 }}
            placeholder="Enter here the subject..."
            name="subject"
            value={this.state.subject}
            helperText=""
            fullWidth
            margin="normal"
            onChange={this.handleChange}
            validators={["required"]}
            errorMessages={["Subject is required"]}
            InputLabelProps={{
              shrink: true
            }}
          />

          <FormControl variant="outlined" style={styles.formControl} fullWidth>
            <InputLabel
              value={this.state.from}
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-from-simple"
            >
              From
            </InputLabel>

            <Select
              value={this.state.from}
              onChange={this.handleChange}
              name="from"
              input={
                <OutlinedInput
                  name="from"
                  id="outlined-from-simple"
                  labelWidth={40}
                />
              }
            >
              {senders.map((s, index) => (
                <MenuItem key={index} value={s.email}>
                  {`${s.name} - (${s.email})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={styles.formControl} fullWidth>
            <InputLabel
              value={this.state.template}
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-template-simple"
            >
              Template
            </InputLabel>
            <Select
              value={this.state.template}
              onChange={this.handleChange}
              name="template"
              input={
                <OutlinedInput
                  name="template"
                  id="outlined-template-simple"
                  labelWidth={70}
                />
              }
            >
              {this.state.templates.map(m => (
                <MenuItem key={m.real_id} value={m.real_id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
            disabled={this.state.sending}
          >
            <div style={styles.wrapper}>
              Send email
              {this.state.sending && (
                <CircularProgress size={24} style={styles.buttonProgress} />
              )}
            </div>
          </Button>
        </ValidatorForm>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.status}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
  render() {
    return (
      <React.Fragment>
        <h2>Send Email Bulk</h2>
        {this.state.show ? (
          <div>
            {this.state.loading ? (
              <h1>
                <CircularProgress />
              </h1>
            ) : (
              this.renderSendEmail()
            )}
          </div>
        ) : (
          <Password handlePassword={this.handlePassword} />
        )}
      </React.Fragment>
    );
  }
}

export default SendEmail;
