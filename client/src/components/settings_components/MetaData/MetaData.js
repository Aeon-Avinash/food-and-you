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
import MUISelect from "@material-ui/core/Select";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import SelectReactMUI from "../../../ui/SelectReactMUI/SelectReactMUI";
import countryList from "../../../utils/countryList";

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
    marginBottom: 10,
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

const ageOptions = Array(90)
  .fill(10)
  .map((num, index) => ({
    value: num + index,
    label: num + index,
    name: "age"
  }));

const heightOptionsImperial = Array(150)
  .fill(80)
  .map((num, index) => ({
    value: num + index,
    label: num + index,
    name: "height"
  }));

const heightOptionsSI = Array(60)
  .fill(40)
  .map((num, index) => {
    let ht = num + index;
    let feet = Math.floor(ht / 12);
    let inches = ht % 12;
    return {
      value: `${feet}'${inches}''`,
      label: `${feet}'${inches}''`,
      name: "height"
    };
  });

const weightOptions = Array(300)
  .fill(20)
  .map((num, index) => ({
    value: num + index,
    label: num + index,
    name: "weight"
  }));

const countryOptions = countryList.map(country => ({
  value: country.Code,
  label: country.Name,
  name: "country"
}));

class MetaData extends Component {
  state = {
    name: "",
    // avatarImage: "",
    age: "",
    weight: "",
    weightUnit: "kgs", // kgs || pounds
    height: "",
    heightUnit: "inches", // inches || cms
    country: ""
  };

  componentDidMount() {
    if (this.props.userSettings) {
      const { heightUnit, height } = this.props.userSettings;

      this.setState({
        ...this.props.userSettings,
        height:
          heightUnit === "inches"
            ? `${Math.floor(height / 30.48)}'${Math.round(
                (height % 30.48) / 2.54
              )}''`
            : height
      });
    }
  }

  handleChange = event => {
    this.setState({
      [(event.target && event.target.name) || event.name]:
        (event.target && event.target.value) || event.value
    });
  };

  editUserSettings = event => {
    event.preventDefault();

    this.props.handleSetUserSettings({
      metaData: {
        ...this.state,
        height:
          this.state.heightUnit === "inches"
            ? Math.floor(
                Number(this.state.height.split("'")[0]) * 30.48 +
                  parseInt(this.state.height.split("'")[1]) * 2.54
              )
            : this.state.height
      }
    });
  };

  render() {
    const { classes } = this.props;
    const {
      name,
      age,
      height,
      heightUnit,
      weight,
      weightUnit,
      country
    } = this.state;
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h5" gutterBottom>
            Setup your user profile
          </Typography>
          <ValidatorForm
            className={classes.inputForm}
            onSubmit={this.editUserSettings}
            onError={err => console.log(err)}
          >
            <Typography variant="body1" gutterBottom>
              Update your personal info
            </Typography>
            <div className={classes.inputGroup}>
              <TextValidator
                className={classes.textField}
                label="Name"
                onChange={this.handleChange}
                name="name"
                value={name || ""}
                validators={["maxStringLength:50"]}
                errorMessages={["max length exceeded!"]}
              />
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-age"}
                  name={"age"}
                  label={"Age"}
                  options={ageOptions}
                  value={age}
                  updateSelection={this.handleChange}
                />
                <FormHelperText>Accuracy helps better analysis</FormHelperText>
              </FormControl>
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-height"}
                  name={"height"}
                  label={"Height"}
                  value={height}
                  options={
                    heightUnit === "inches"
                      ? heightOptionsSI
                      : heightOptionsImperial
                  }
                  updateSelection={this.handleChange}
                />
                <FormHelperText>As accurate as possible</FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-helper-label">
                  Unit
                </InputLabel>
                <MUISelect
                  name="heightUnit"
                  label="Unit for height"
                  id="demo-simple-select-helper"
                  value={heightUnit}
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"inches"}>ft-inches</MenuItem>
                  <MenuItem value={"cms"}>centimeters</MenuItem>
                </MUISelect>
                <FormHelperText>Set unit for height</FormHelperText>
              </FormControl>
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-weight"}
                  name={"weight"}
                  label={"Weight"}
                  options={weightOptions}
                  value={weight}
                  updateSelection={this.handleChange}
                />
                <FormHelperText>As accurate as possible</FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-helper-label">
                  Unit
                </InputLabel>
                <MUISelect
                  name="weightUnit"
                  label="Unit for weight"
                  id="demo-simple-select-helper"
                  value={weightUnit}
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"kgs"}>kilograms</MenuItem>
                  <MenuItem value={"pounds"}>pounds</MenuItem>
                </MUISelect>
                <FormHelperText>Set unit for Weight</FormHelperText>
              </FormControl>
            </div>
            <div className={classes.inputGroup}>
              <FormControl className={classes.formControl}>
                <SelectReactMUI
                  id={"select-country"}
                  name={"country"}
                  label={"Country"}
                  value={country}
                  options={countryOptions}
                  updateSelection={this.handleChange}
                />
                <FormHelperText>
                  Provide current country location
                </FormHelperText>
              </FormControl>
            </div>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Save Your Profile Data
            </Button>
          </ValidatorForm>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(MetaData);
