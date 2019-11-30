import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

import { updateObjProp } from "../../../utils/updateObjHelpers";

const styles = theme => ({
  preferencesPanel: {
    width: "100%"
  },
  panelHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  panelSecondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  checkboxForm: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  },
  checkBoxesConatiner: {
    display: "flex",
    flexFlow: "row wrap"
  },
  excludeIngsTextForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  excludeIngsTextField: {
    width: "90%",
    alignSelf: "flex-end"
  }
});

class SearchPreferences extends Component {
  state = {
    cuisineState: {
      African: { checked: false, value: "African" },
      American: { checked: false, value: "American" },
      British: { checked: false, value: "British" },
      Cajun: { checked: false, value: "Cajun" },
      Caribbean: { checked: false, value: "Caribbean" },
      Chinese: { checked: false, value: "Chinese" },
      "Eastern European": { checked: false, value: "Eastern European" },
      European: { checked: false, value: "European" },
      French: { checked: false, value: "French" },
      German: { checked: false, value: "German" },
      Greek: { checked: false, value: "Greek" },
      Indian: { checked: false, value: "Indian" },
      Irish: { checked: false, value: "Irish" },
      Italian: { checked: false, value: "Italian" },
      Japanese: { checked: false, value: "Japanese" },
      Jewish: { checked: false, value: "Jewish" },
      Korean: { checked: false, value: "Korean" },
      "Latin American": { checked: false, value: "American" },
      Mediterranean: { checked: false, value: "Mediterranean" },
      Mexican: { checked: false, value: "Mexican" },
      "Middle Eastern": { checked: false, value: "Middle Eastern" },
      Nordic: { checked: false, value: "Nordic" },
      Southern: { checked: false, value: "Southern" },
      Spanish: { checked: false, value: "Spanish" },
      Thai: { checked: false, value: "Thai" },
      Vietnamese: { checked: false, value: "Vietnamese" }
    },
    dietState: {
      "Gluten Free": { checked: false, value: "Gluten Free" },
      Ketogenic: { checked: false, value: "Ketogenic" },
      Vegetarian: { checked: false, value: "Vegetarian" },
      "Lacto-Vegetarian": { checked: false, value: "Lacto-Vegetarian" },
      "Ovo-Vegetarian": { checked: false, value: "Ovo-Vegetarian" },
      Vegan: { checked: false, value: "Vegan" },
      Pescetarian: { checked: false, value: "Pescetarian" },
      Paleo: { checked: false, value: "Paleo" },
      Primal: { checked: false, value: "Primal" },
      Whole30: { checked: false, value: "Whole30" }
    },
    intoleranceState: {
      Dairy: { checked: false, value: "Dairy" },
      Egg: { checked: false, value: "Egg" },
      Gluten: { checked: false, value: "Gluten" },
      Grain: { checked: false, value: "Grain" },
      Peanut: { checked: false, value: "Peanut" },
      Seafood: { checked: false, value: "Seafood" },
      Sesame: { checked: false, value: "Sesame" },
      Shellfish: { checked: false, value: "Shellfish" },
      Soy: { checked: false, value: "Soy" },
      Sulfite: { checked: false, value: "Sulfite" },
      "Tree Nut": { checked: false, value: "Tree Nut" },
      Wheat: { checked: false, value: "Wheat" }
    },
    excludeIngsState: ""
  };

  componentDidMount() {
    // console.log({ preferences: this.props.preferences });
    if (this.props.preferences) {
      let {
        diet: dietOptions,
        intolerances: intoleranceOptions,
        cuisine: cuisineOptions,
        excludeIngredients: excludeIngsOptions
      } = this.props.preferences;

      this.setState(
        {
          dietState: Object.keys(this.state.dietState).reduce((accum, diet) => {
            if ((dietOptions || "").includes(diet)) {
              accum[diet].checked = true;
            }
            return accum;
          }, this.state.dietState),
          intoleranceState: Object.keys(this.state.intoleranceState).reduce(
            (accum, intolerance) => {
              if ((intoleranceOptions || "").includes(intolerance)) {
                accum[intolerance].checked = true;
              }
              return accum;
            },
            this.state.intoleranceState
          ),
          cuisineState: Object.keys(this.state.cuisineState).reduce(
            (accum, cuisine) => {
              if ((cuisineOptions || "").includes(cuisine)) {
                accum[cuisine].checked = true;
              }
              return accum;
            },
            this.state.cuisineState
          ),
          excludeIngsState: excludeIngsOptions || ""
        },
        () => {
          this.getCurrentPreferences();
        }
      );
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.getCurrentPreferences();
  };

  getCurrentPreferences = () => {
    const {
      cuisineState,
      dietState,
      intoleranceState
      // excludeIngsState
    } = this.state;
    if (cuisineState && dietState && intoleranceState) {
      const {
        cuisine,
        intolerances,
        diet,
        excludeIngredients
      } = this.getPreferencesAsCSV();
      this.props.setSearchPreferences({
        // cuisineState,
        // dietState,
        // intoleranceState,
        // excludeIngsState,
        cuisine,
        intolerances,
        diet,
        excludeIngredients
      });
    }
  };

  handleCuisineChange = name => event => {
    this.setState({
      cuisineState: updateObjProp(
        this.state.cuisineState,
        event.target.checked,
        name,
        "checked"
      )
    });
  };

  handleDietChange = name => event => {
    this.setState({
      dietState: updateObjProp(
        this.state.dietState,
        event.target.checked,
        name,
        "checked"
      )
    });
  };

  handleIntoleranceChange = name => event => {
    this.setState({
      intoleranceState: updateObjProp(
        this.state.intoleranceState,
        event.target.checked,
        name,
        "checked"
      )
    });
  };

  handleExcludeIngsTextChange = event => {
    this.setState({ excludeIngsState: event.target.value });
  };

  getPreferencesAsCSV = () => {
    const {
      cuisineState,
      dietState,
      intoleranceState,
      excludeIngsState
    } = this.state;
    const cuisine = Object.keys(cuisineState)
      .filter(pref => cuisineState[pref].checked === true)
      .map(pref => cuisineState[pref].value)
      .join(",");
    const intolerances = Object.keys(intoleranceState)
      .filter(pref => intoleranceState[pref].checked === true)
      .map(pref => intoleranceState[pref].value)
      .join(",");
    const diet =
      Object.keys(dietState).find(pref => dietState[pref].checked === true) ||
      "";
    const excludeIngredients = excludeIngsState.trim().toLowerCase();
    return {
      cuisine,
      intolerances,
      diet,
      excludeIngredients
    };
  };

  render() {
    const {
      classes,
      expanded,
      handleSearchPreferencesPanelExpansion
    } = this.props;
    const {
      cuisineState,
      dietState,
      intoleranceState,
      excludeIngsState
    } = this.state;

    const error =
      dietState &&
      Object.keys(dietState).map(diet => dietState[diet].checked === true)
        .length > 1;

    return (
      <>
        <ExpansionPanel
          expanded={expanded === "panel1"}
          onChange={handleSearchPreferencesPanelExpansion("panel1")}
          className={classes.preferencesPanel}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.panelHeading}>
              Select Cuisines
            </Typography>
            <Typography className={classes.panelSecondaryHeading}>
              Search recipes from specific cusines
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {cuisineState && (
              <div className={classes.checkboxForm}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Select cuisine</FormLabel>
                  <FormGroup className={classes.checkBoxesConatiner}>
                    {Object.keys(cuisineState).map(cuisine => (
                      <FormControlLabel
                        key={cuisine}
                        control={
                          <Checkbox
                            checked={cuisineState[cuisine].checked}
                            onChange={this.handleCuisineChange(
                              cuisineState[cuisine].value
                            )}
                            value={cuisineState[cuisine].value}
                          />
                        }
                        label={cuisineState[cuisine].value}
                      />
                    ))}
                  </FormGroup>
                  <FormHelperText>Be Specific</FormHelperText>
                </FormControl>
              </div>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === "panel2"}
          onChange={handleSearchPreferencesPanelExpansion("panel2")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.panelHeading}>
              Set Diet Restrictions
            </Typography>
            <Typography className={classes.panelSecondaryHeading}>
              Search recipes from specific diet categories
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {
              <div className={classes.checkboxForm}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel error={error} component="legend">
                    Select diet preference
                  </FormLabel>
                  <FormGroup className={classes.checkBoxesConatiner}>
                    {dietState &&
                      Object.keys(dietState).map(diet => (
                        <FormControlLabel
                          key={diet}
                          control={
                            <Checkbox
                              checked={dietState[diet].checked}
                              onChange={this.handleDietChange(
                                dietState[diet].value
                              )}
                              value={dietState[diet].value}
                            />
                          }
                          label={dietState[diet].value}
                        />
                      ))}
                  </FormGroup>
                  <FormHelperText>Pick only one*</FormHelperText>
                </FormControl>
              </div>
            }
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === "panel3"}
          onChange={handleSearchPreferencesPanelExpansion("panel3")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.panelHeading}>
              Select Interolerances
            </Typography>
            <Typography className={classes.panelSecondaryHeading}>
              Search recipes with allergens to avoid
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {intoleranceState && (
              <div className={classes.checkboxForm}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">
                    Select allergens/intolerances to avoid
                  </FormLabel>
                  <FormGroup className={classes.checkBoxesConatiner}>
                    {Object.keys(intoleranceState).map(intolerance => (
                      <FormControlLabel
                        key={intolerance}
                        control={
                          <Checkbox
                            checked={intoleranceState[intolerance].checked}
                            onChange={this.handleIntoleranceChange(
                              intoleranceState[intolerance].value
                            )}
                            value={intoleranceState[intolerance].value}
                          />
                        }
                        label={intoleranceState[intolerance].value}
                      />
                    ))}
                  </FormGroup>
                  <FormHelperText>Be Specific</FormHelperText>
                </FormControl>
              </div>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === "panel4"}
          onChange={handleSearchPreferencesPanelExpansion("panel4")}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography className={classes.panelHeading}>
              Exclude Ingredients
            </Typography>
            <Typography className={classes.panelSecondaryHeading}>
              Provide list of ingredients to avoid
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            (
            <div className={classes.excludeIngsTextForm}>
              <Typography>
                Provide a comma-separated list of ingredients that the recipes
                must not conatin
              </Typography>
              <TextField
                label="Ingredients to exclude"
                className={classes.excludeIngsTextField}
                value={excludeIngsState}
                onChange={this.handleExcludeIngsTextChange}
                margin="normal"
              />
            </div>
            )
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </>
    );
  }
}

export default withStyles(styles)(SearchPreferences);
