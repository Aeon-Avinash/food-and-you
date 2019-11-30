import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { nutritionActions } from "../../../store/actions";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { updateObjProp } from "../../../utils/updateObjHelpers";

const styles = theme => ({
  rootPaper: {
    marginBottom: 20
  },
  queryForm: {
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
    // alignItems: "center"
  },
  inputGroup: {},
  formControl: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: theme.spacing(3),
    marginBottom: 20,
    marginRight: 50
  },
  checkboxLegend: {
    // maxWidth: 150,
    fontSize: "18px",
    paddingBottom: 20
  },
  checkBoxesConatiner: {
    display: "flex",
    flexFlow: "column wrap"
  },
  helperTextConatiner: {
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "space-between"
  },
  helperText: {
    fontSize: "18px",
    paddingBottom: 20
  },
  submitButton: {
    marginTop: 20
  }
});

class QueryForm extends Component {
  state = {
    query: "",
    searchTypeState: {
      ingredient: { checked: true, value: "ingredient" },
      recipe: { checked: false, value: "recipe" }
    }
  };

  handleChange = event => {
    const query = event.target.value;
    this.setState({ query });
  };

  handleCheckboxChange = name => event => {
    let newCheckedvalue = event.target.checked;
    this.setState(
      {
        //?  Checking selected choice
        searchTypeState: updateObjProp(
          this.state.searchTypeState,
          newCheckedvalue,
          name,
          "checked"
        )
      },
      () => {
        Object.keys(this.state.searchTypeState)
          .filter(checkKey => checkKey !== name)
          .forEach(checkKey => {
            this.setState({
              //?  Unchecking other choices
              searchTypeState: updateObjProp(
                this.state.searchTypeState,
                !newCheckedvalue,
                checkKey,
                "checked"
              )
            });
          });
      }
    );
  };

  requestNutritionQuery = e => {
    e.preventDefault();

    //* with formState generate formData
    this.props.getNutrition({ query: this.state.query });
    this.props.clearCurrentNutritionData();
    this.props.history &&
      this.props.pushHistoryToLocation &&
      this.props.history.push(this.props.pushHistoryToLocation);
  };

  render() {
    const { query, searchTypeState } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h4" gutterBottom>
            Get nutrition analysis for your meal
          </Typography>
          <ValidatorForm
            className={classes.queryForm}
            onSubmit={this.requestNutritionQuery}
            onError={err => console.log(err)}
          >
            <Typography variant="body1" gutterBottom>
              What did you eat or want to eat?
            </Typography>
            <TextValidator
              label="Food Query"
              onChange={this.handleChange}
              value={query}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <FormControl className={classes.formControl}>
              <FormLabel component="legend" className={classes.checkboxLegend}>
                Select the type of search query
              </FormLabel>
              <FormGroup className={classes.checkBoxesConatiner}>
                {Object.keys(searchTypeState).map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={searchTypeState[type].checked}
                        onChange={this.handleCheckboxChange(
                          searchTypeState[type].value
                        )}
                        value={searchTypeState[type].value}
                      />
                    }
                    label={searchTypeState[type].value}
                  />
                ))}
              </FormGroup>
              <div className={classes.helperTextConatiner}>
                <FormHelperText className={classes.helperText}>
                  Select <strong>ingredient</strong> to search with ingredient /
                  grocery / product name...
                </FormHelperText>
                <FormHelperText className={classes.helperText}>
                  Select <strong>recipe</strong> to search with recipe /
                  food-dish name ...
                </FormHelperText>
              </div>
            </FormControl>
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
            >
              Get Nutrition Analysis
            </Button>
          </ValidatorForm>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  errorMessagePrimary: state.appState.primary.errorMessage
});

const enhance = compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, {
    getNutrition: nutritionActions.getNutrition,
    clearCurrentNutritionData: nutritionActions.clearCurrentNutritionData
  })
);

export default enhance(QueryForm);
