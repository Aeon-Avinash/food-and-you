import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MUISelect from "@material-ui/core/Select";
import moment from "moment";
import { updateObjProp } from "../../../utils/updateObjHelpers";

const styles = theme => ({
  rootPaper: {
    marginTop: 20,
    marginBottom: 20
  },
  inputForm: {
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
    // alignItems: "center"
  },
  inputGroup: {
    width: "90%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  formControl: {
    margin: theme.spacing(3),
    marginRight: 50
  },
  checkBoxesConatiner: {
    display: "flex",
    flexFlow: "row wrap"
  },
  submitButton: {
    marginTop: 20
  }
});

class GlobalSettings extends Component {
  state = {
    unitsState: {
      si: { checked: true, value: "si" },
      imperial: { checked: false, value: "imperial" }
    },
    dNDState: {
      true: { checked: false, value: "true" },
      false: { checked: true, value: "false" }
    },
    units: undefined, //default, options: si || imperial
    doNotDisturb: undefined, //default, options: false || true
    lastSynced: undefined,
    syncFrequency: "" // default, options: ""(i.e. no sync) || hour || day || week
  };

  componentDidMount = () => {
    if (this.props.userSettings) {
      this.setState(this.props.userSettings);
    }
    this.getCheckboxValues();
  };

  componentDidUpdate(prevProps, prevState) {
    const units = Object.keys(this.state.unitsState).find(
      units => this.state.unitsState[units].checked === true
    );
    const doNotDisturb = Object.keys(this.state.dNDState).find(
      checkKey => this.state.dNDState[checkKey].checked === true
    );
    if (prevState.units !== units || prevState.doNotDisturb !== doNotDisturb) {
      this.getCheckboxValues();
    }
  }

  getCheckboxValues = () => {
    this.setState({
      units: Object.keys(this.state.unitsState).find(
        units => this.state.unitsState[units].checked === true
      ),
      doNotDisturb: Object.keys(this.state.dNDState).find(
        checkKey => this.state.dNDState[checkKey].checked === true
      )
    });
  };

  handleChange = event => {
    this.setState({
      [(event.target && event.target.name) || event.name]:
        (event.target && event.target.value) || event.value
    });
  };

  handleCheckboxChange = stateSlice => name => event => {
    let newCheckedvalue = event.target.checked;
    this.setState(
      {
        //?  Checking selected choice
        [stateSlice]: updateObjProp(
          this.state[stateSlice],
          newCheckedvalue,
          name,
          "checked"
        )
      },
      () => {
        Object.keys(this.state[stateSlice])
          .filter(checkKey => checkKey !== name)
          .forEach(checkKey => {
            this.setState({
              //?  Unchecking other choices
              [stateSlice]: updateObjProp(
                this.state[stateSlice],
                !newCheckedvalue,
                checkKey,
                "checked"
              )
            });
          });
      }
    );
  };

  editUserSettings = event => {
    event.preventDefault();
    const {
      units,
      doNotDisturb,
      syncFrequency,
      unitsState,
      dNDState
    } = this.state;
    this.props.handleSetUserSettings({
      globalSettings: {
        units,
        doNotDisturb,
        syncFrequency,
        unitsState,
        dNDState
      }
    });
  };

  render() {
    const { classes } = this.props;
    const {
      unitsState,
      dNDState,
      // units,
      // doNotDisturb,
      // currentReminders,
      lastSynced,
      syncFrequency
    } = this.state;
    const warning =
      Object.keys(dNDState).find(checkKey => dNDState[checkKey].checked) ===
      "true";
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h5" gutterBottom>
            Setup your app preferences
          </Typography>
          <form className={classes.inputForm} onSubmit={this.editUserSettings}>
            <Typography variant="body1" gutterBottom>
              Update global app settings
            </Typography>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <FormLabel component="legend">
                  Select units preference
                </FormLabel>
                <FormGroup className={classes.checkBoxesConatiner}>
                  {Object.keys(unitsState).map(unit => (
                    <FormControlLabel
                      key={unit}
                      control={
                        <Checkbox
                          checked={unitsState[unit].checked}
                          onChange={this.handleCheckboxChange("unitsState")(
                            unitsState[unit].value
                          )}
                          value={unitsState[unit].value}
                        />
                      }
                      label={unitsState[unit].value}
                    />
                  ))}
                </FormGroup>
                <FormHelperText>
                  Select SI for Kilograms, Grams, ...
                </FormHelperText>
                <FormHelperText>
                  Select Imperial for Pounds, Ounces, ...
                </FormHelperText>
              </FormControl>
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <FormLabel error={warning} component="legend">
                  Select Do not disturb preference
                </FormLabel>
                <FormGroup className={classes.checkBoxesConatiner}>
                  {Object.keys(dNDState).map(state => (
                    <FormControlLabel
                      key={state}
                      control={
                        <Checkbox
                          checked={dNDState[state].checked}
                          onChange={this.handleCheckboxChange("dNDState")(
                            dNDState[state].value
                          )}
                          value={dNDState[state].value}
                        />
                      }
                      label={dNDState[state].value}
                    />
                  ))}
                </FormGroup>
                <FormHelperText>*Stops all app notifications</FormHelperText>
              </FormControl>
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <InputLabel id="select-syncFrequency-label">
                  Sync frequency
                </InputLabel>
                <MUISelect
                  name="syncFrequency"
                  label="Do Not Disturb"
                  id="select-syncFrequency"
                  value={syncFrequency || ""}
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>don't sync</em>
                  </MenuItem>
                  <MenuItem value={"hour"}>hour</MenuItem>
                  <MenuItem value={"day"}>day</MenuItem>
                  <MenuItem value={"week"}>week</MenuItem>
                </MUISelect>
                <FormHelperText>Set data sync frequency</FormHelperText>
                <FormHelperText>
                  last synced: {lastSynced ? moment(lastSynced) : null}
                </FormHelperText>
              </FormControl>
            </div>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Save App Settings
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(GlobalSettings);
