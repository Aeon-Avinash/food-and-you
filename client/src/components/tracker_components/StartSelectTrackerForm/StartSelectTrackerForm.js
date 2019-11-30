import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import TextField from "@material-ui/core/TextField";
// import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
// import MUISelect from "@material-ui/core/Select";
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
  formControl: {
    marginRight: 50
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

class StartSelectTrackerForm extends Component {
  state = {
    default_tracker: undefined,
    tracker_title: "",
    tracker_goal: "",
    tracked_meals: ["all"],
    tracker_lengthValue: "30",
    tracker_lengthUnit: "days",
    trackedMealsOptions: [
      "all",
      "breakfast",
      "lunch",
      "evening snack",
      "dinner",
      "midnight snack"
    ].map(meal => ({
      value: meal,
      label: meal,
      name: "tracked_meals",
      key: meal
    })),
    availableTrackers: []
  };

  componentDidMount() {
    if (this.props.allTrackers && this.props.lastUsedDefaultTracker) {
      if (
        this.props.allTrackers.find(
          tracker => tracker._id === this.props.lastUsedDefaultTracker
        )
      )
        this.setState({
          default_tracker: this.props.lastUsedDefaultTracker
        });
    }
    if (this.props.allTrackers) {
      const availableTrackers = this.props.allTrackers.map(tracker => ({
        value: tracker._id,
        label: tracker.title,
        name: "default_tracker"
      }));
      this.setState({
        availableTrackers
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.allTrackers !== this.props.allTrackers &&
      this.props.allTrackers
    ) {
      const availableTrackers = this.props.allTrackers.map(tracker => ({
        value: tracker._id,
        label: tracker.title,
        name: "default_tracker"
      }));
      this.setState({
        availableTrackers
      });
    }

    if (
      prevProps.successDataTrackerSync !== this.props.successDataTrackerSync &&
      this.props.successDataTrackerSync
    ) {
      this.props.history.push("/tracker/timeline");
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

  handleChange = event => {
    if (event) {
      this.setState({
        [(event.target && event.target.name) || event.name]:
          (event.target && event.target.value) || event.value
      });
    }
  };

  requestStartNewTracker = event => {
    event.preventDefault();
    const {
      tracker_title,
      tracker_goal,
      tracked_meals,
      tracker_lengthValue,
      tracker_lengthUnit,
      trackedMealsOptions
    } = this.state;
    this.props.handleStartNewTracker({
      tracker_title,
      tracker_goal,
      tracked_meals,
      tracker_lengthValue,
      tracker_lengthUnit,
      trackedMealsOptions
    });
  };

  requestSelectTracker = event => {
    event.preventDefault();
    if (this.state.default_tracker)
      this.props.handleSelectTracker(this.state.default_tracker);
  };

  render() {
    const {
      classes,
      // allTrackers,
      successDataTrackerSync,
      errorMessageTrackerSync
    } = this.props;
    // console.log({ allTrackers });
    const {
      default_tracker,
      tracker_title,
      tracker_goal,
      tracked_meals,
      tracker_lengthValue,
      tracker_lengthUnit,
      trackedMealsOptions,
      availableTrackers
    } = this.state;
    // console.log({ tracked_meals });
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h5" gutterBottom>
            Select or Setup a new Diet Tracker
          </Typography>
          <form
            className={classes.inputForm}
            onSubmit={this.requestSelectTracker}
          >
            <Typography variant="body1" gutterBottom>
              Select from previously created Trackers
            </Typography>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-default-tracker"}
                  name={"default_tracker"}
                  label={"Set Default Tracker"}
                  options={availableTrackers}
                  value={default_tracker}
                  updateSelection={this.handleChange}
                />
                <FormHelperText>
                  Select from your previous trackers for quick setup
                </FormHelperText>
              </FormControl>
            </div>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Select Tracker
            </Button>
          </form>
          <ValidatorForm
            className={classes.inputForm}
            onSubmit={this.requestStartNewTracker}
            onError={err => console.log(err)}
          >
            <Typography variant="body1" gutterBottom>
              Customize and create new Tracker
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
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Start New Tracker
            </Button>
          </ValidatorForm>
          <Typography variant="body1" gutterBottom color="secondary">
            {!successDataTrackerSync && errorMessageTrackerSync
              ? errorMessageTrackerSync
              : null}
          </Typography>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(StartSelectTrackerForm);
