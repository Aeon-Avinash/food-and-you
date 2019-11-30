import React, { Component } from "react";
import * as R from "ramda";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import SearchPreferences from "../../recipe_components/SearchPreferences/SearchPreferences";

const styles = theme => ({
  rootPaper: {
    flexGrow: 1,
    marginTop: 20,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    padding: 20
  },
  paper: {
    padding: theme.spacing(3, 2)
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 20
  },
  submitButton: {
    margin: 20,
    alignSelf: "flex-end"
  }
});

class Preferences extends Component {
  state = {
    expanded: false,
    diet: undefined,
    intolerances: undefined,
    cuisine: undefined,
    excludeIngredients: undefined
  };

  editUserSettings = event => {
    event.preventDefault();
    const { diet, intolerances, cuisine, excludeIngredients } = this.state;
    this.setState({ expanded: false });
    this.props.handleSetUserSettings({
      preferences: {
        diet,
        intolerances,
        cuisine,
        excludeIngredients
      }
    });
  };

  handleSearchPreferencesPanelExpansion = panel => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  handleSearchPreferencesSelection = searchPreferences => {
    // console.log(searchPreferences);
    const { diet, intolerances, cuisine, excludeIngredients } = this.state;
    if (
      !R.equals(
        { ...searchPreferences },
        {
          diet,
          intolerances,
          cuisine,
          excludeIngredients
        }
      )
    ) {
      this.setState({ ...searchPreferences });
    }
  };

  render() {
    const { expanded } = this.state;
    const { classes } = this.props;
    return (
      <Paper className={classes.rootPaper}>
        <Typography variant="h5" gutterBottom>
          Set your diet choices &amp; restrictions
        </Typography>
        <form onSubmit={this.editUserSettings} className={classes.form}>
          <legend>
            <Typography variant="body1" gutterBottom>
              Update your diet Preferences <em>(default choices)</em>
            </Typography>
          </legend>
          <SearchPreferences
            expanded={expanded}
            preferenceOutputType={"Object"}
            preferences={this.props.userSettings}
            handleSearchPreferencesPanelExpansion={
              this.handleSearchPreferencesPanelExpansion
            }
            setSearchPreferences={this.handleSearchPreferencesSelection}
          />
          <Button
            className={classes.submitButton}
            variant="contained"
            type="submit"
          >
            Save Diet Preferences
          </Button>
        </form>
      </Paper>
    );
  }
}

export default withStyles(styles)(Preferences);
