import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import uuid from "uuid/v4";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
// import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
// import MUISelect from "@material-ui/core/Select";
// import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import TimePicker from "react-time-picker";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import SelectReactMUI from "../../../ui/SelectReactMUI/SelectReactMUI";

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
  reminderGroup: {
    width: "90%",
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start"
  },
  formControl: {
    marginRight: 50
  },
  reminderFormControl: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20
  },
  removeButton: {
    marginLeft: 50
  },
  submitButton: {
    marginTop: 20
  }
});

const tracker_LengthValue_Options = Array(180)
  .fill(1)
  .map((length, index) => ({
    value: length + index,
    label: length + index,
    name: "tracker_lengthValue"
  }));
const tracker_LengthUnit_Options = [
  "days",
  "weeks",
  "months",
  "years"
].map(unit => ({ value: unit, label: unit, name: "tracker_lengthUnit" }));

class TrackerPreferencesForm extends Component {
  state = {
    reminders: [],
    tracker_title: "",
    tracker_goal: "",
    tracked_meals: [],
    trackedMealsOptions: [],
    tracker_lengthValue: undefined,
    tracker_lengthUnit: undefined
  };

  componentDidMount() {
    if (
      // this.props.trackerData &&
      // this.props.trackerData._id &&
      this.props.trackerPreferences
    ) {
      const {
        tracker_title,
        tracker_goal,
        reminders,
        tracked_meals,
        trackedMealsOptions,
        tracker_lengthValue,
        tracker_lengthUnit
      } = this.props.trackerPreferences;
      this.setState({
        tracker_title,
        tracker_goal,
        reminders,
        tracked_meals,
        trackedMealsOptions,
        tracker_lengthValue,
        tracker_lengthUnit
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.trackerPreferences &&
      this.props.trackerPreferences !== prevProps.trackerPreferences
    ) {
      const {
        tracker_title,
        tracker_goal,
        reminders,
        tracked_meals,
        trackedMealsOptions,
        tracker_lengthValue,
        tracker_lengthUnit
      } = this.props.trackerPreferences;
      this.setState({
        tracker_title,
        tracker_goal,
        reminders,
        tracked_meals,
        trackedMealsOptions,
        tracker_lengthValue,
        tracker_lengthUnit
      });
    }
  };

  handleChange = event => {
    if (event) {
      this.setState({
        [(event.target && event.target.name) || event.name]:
          (event.target && event.target.value) || event.value
      });
    }
  };

  handleCreateCustomOption = newOption => {
    const trackedMealsOptions = [...this.state.trackedMealsOptions, newOption];
    this.setState({ trackedMealsOptions });
  };

  handleRemoveCustomOption = removeOption => {
    const trackedMealsOptions = this.state.trackedMealsOptions.filter(
      option => option.key !== removeOption.key
    );
    this.setState({ trackedMealsOptions });
  };

  onTimePickerChange = (time, reminderId) => {
    console.log(time);
    const reminders = this.state.reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, value: time } : reminder
    );
    this.setState({ reminders });
  };

  handleRemoveReminder = reminderId => {
    const reminders = this.state.reminders.filter(
      reminder => reminder.id !== reminderId
    );
    this.setState({ reminders });
  };

  handleAddReminder = () => {
    const reminders = [...this.state.reminders, { id: uuid(), time: "10:00" }];
    this.setState({ reminders });
  };

  saveTrackerPreferences = event => {
    event.preventDefault();
    console.log(this.state);
    this.props.updateTrackerPreferences(this.state);
  };

  render() {
    const { classes } = this.props;
    const {
      reminders,
      tracker_title,
      tracker_goal,
      tracked_meals,
      trackedMealsOptions,
      tracker_lengthValue,
      tracker_lengthUnit
    } = this.state;
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h5" gutterBottom>
            Edit{" "}
            {(this.props.trackerPreferences &&
              this.props.trackerPreferences.tracker_title) ||
              "tracker"}{" "}
            preferences
          </Typography>
          <ValidatorForm
            className={classes.inputForm}
            onSubmit={this.saveTrackerPreferences}
            onError={err => console.log(err)}
          >
            <Typography variant="body1" gutterBottom>
              Update tracker preferences and reminder settings
            </Typography>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="Tracker Title"
                onChange={this.handleChange}
                name="tracker_title"
                value={tracker_title || ""}
                validators={["required", "maxStringLength:50"]}
                errorMessages={[
                  "this field is required",
                  "max length exceeded!"
                ]}
              />
            </div>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="Tracker Goal"
                onChange={this.handleChange}
                name="tracker_goal"
                value={tracker_goal || ""}
                validators={["maxStringLength:100"]}
                errorMessages={["max length exceeded!"]}
              />
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-tracked-meals"}
                  name={"tracked_meals"}
                  label={"Tracked Meals"}
                  options={trackedMealsOptions}
                  createCustomOption={this.handleCreateCustomOption}
                  removeCustomOption={this.handleRemoveCustomOption}
                  value={tracked_meals}
                  updateSelection={this.handleChange}
                  isMulti
                  creatableSelect
                />
                <FormHelperText>
                  Planning enables tracking with reminders
                </FormHelperText>
              </FormControl>
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-tracker-lengthValue"}
                  name={"tracker_lengthValue"}
                  label={"Tracker Timeframe"}
                  options={tracker_LengthValue_Options}
                  value={tracker_lengthValue}
                  updateSelection={this.handleChange}
                />
                <FormHelperText>Setup timeframe for the tracker</FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-tracker-lengthUnit"}
                  name={"tracker_lengthUnit"}
                  label={"Timeframe Unit"}
                  options={tracker_LengthUnit_Options}
                  value={tracker_lengthUnit}
                  updateSelection={this.handleChange}
                />
                <FormHelperText>Change tracker's timeframe unit</FormHelperText>
              </FormControl>
            </div>
            <div className={classes.reminderGroup}>
              {reminders.map((reminder, index) => (
                <FormControl
                  className={classes.reminderFormControl}
                  key={index}
                >
                  <TimePicker
                    onChange={time =>
                      this.onTimePickerChange(time, reminder.id)
                    }
                    value={reminder.time}
                    format="hh:mm a"
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    className={classes.removeButton}
                    onClick={this.handleRemoveReminder.bind(this, reminder.id)}
                  >
                    Remove
                  </Button>
                </FormControl>
              ))}
              <Button
                type="button"
                variant="outlined"
                onClick={this.handleAddReminder}
              >
                Add New Reminder
              </Button>
            </div>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Save Tracker Preferences
            </Button>
          </ValidatorForm>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(TrackerPreferencesForm);
