import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { compose } from "redux";
import { recipesActions } from "../../../store/actions";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import * as R from "ramda";
import SearchPreferences from "../SearchPreferences/SearchPreferences";

const styles = theme => ({
  rootPaper: {
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 100,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  divider: {
    height: theme.spacing(2)
  },
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
  submitButton: {
    marginTop: 20
  }
});

const renderInputComponent = inputProps => {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
};

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.title, query);
  const parts = parse(suggestion.title, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={`${part.text}-${part.highlight}-${part.text}`}
            style={{ fontWeight: part.highlight ? 500 : 400 }}
          >
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
};

class SearchForm extends Component {
  state = {
    searchQuery: "",
    // suggestions: [],
    expanded: false,
    diet: undefined,
    intolerances: undefined,
    cuisine: undefined,
    excludeIngredients: undefined
  };

  handleChange = (event, { newValue }) => {
    // const searchQuery = event.target.value;
    this.setState({ searchQuery: newValue });
  };

  shouldRenderSuggestions = value => {
    return value.trim().length >= 1;
  };

  onSuggestionsFetchRequested = ({ value, reason }) => {
    if (value.length >= 2) {
      this.getSuggestions(value);
    }
  };

  onSuggestionsClearRequested = () => {
    this.props.getRecipeAutocompleteSuggestions();
  };

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, method }
  ) => {
    event.preventDefault();
    const { diet, intolerances, cuisine, excludeIngredients } = this.state;

    this.setState({ expanded: false });
    //* with formState generate formData
    this.props.handleRecipeSearch({
      searchQuery: suggestionValue,
      diet,
      intolerances,
      cuisine,
      excludeIngredients,
      pagination: { offset: 0, number: 12 }
    });
    this.props.clearCurrentRecipesData();

    //? for Recipe Routes
    //? also for Meal planner modal
    this.props.history &&
      this.props.pushHistoryToRecipe &&
      this.props.history.push(this.props.pushHistoryToRecipe);
  };

  handleManualSubmit = event => {
    event.preventDefault();
    const {
      searchQuery,
      diet,
      intolerances,
      cuisine,
      excludeIngredients
    } = this.state;
    console.log("manual entry");

    if (searchQuery.trim().length > 0) {
      this.setState({ expanded: false });

      this.props.handleRecipeSearch({
        searchQuery,
        diet,
        intolerances,
        cuisine,
        excludeIngredients,
        pagination: { offset: 0, number: 12 }
      });

      console.log({ method: "manual", searchQuery: searchQuery });
    }
  };

  getSuggestions = partialQuery => {
    this.props.getRecipeAutocompleteSuggestions(
      partialQuery ? partialQuery : null
    );
  };

  getSuggestionValue = suggestion => suggestion.title;

  handleSearchPreferencesPanelExpansion = panel => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  handleSearchPreferencesSelection = searchPreferences => {
    // console.log(searchPreferences);
    const { diet, intolerances, cuisine, excludeIngredients } = this.state;
    if (
      !R.equals(
        {
          diet: searchPreferences.diet,
          intolerances: searchPreferences.intolerances,
          cuisine: searchPreferences.cuisine,
          excludeIngredients: searchPreferences.excludeIngredients
        },
        { diet, intolerances, cuisine, excludeIngredients }
      )
    ) {
      this.setState({ ...searchPreferences });
    }
  };

  render() {
    const { searchQuery, expanded } = this.state;
    const { classes, preferences, addRecipeToMealPlanner } = this.props;
    const suggestions = this.props.suggestions || [];

    const autoSuggestProps = {
      renderInputComponent: props =>
        renderInputComponent({
          ...props
          // onClick: this.handleSearchPreferencesPanelExpansion()
        }),
      suggestions,
      onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      onSuggestionSelected: this.onSuggestionSelected,
      getSuggestionValue: this.getSuggestionValue,
      shouldRenderSuggestions: this.shouldRenderSuggestions,
      renderSuggestion,
      highlightFirstSuggestion: true
    };

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          {!addRecipeToMealPlanner
            ? "Get recipes for a dish or an ingredient"
            : "Meal Planner"}
        </Typography>
        <form onSubmit={this.handleManualSubmit}>
          <Paper className={classes.rootPaper}>
            <Typography variant="body1" gutterBottom>
              What do you want to make?
            </Typography>

            <Autosuggest
              {...autoSuggestProps}
              inputProps={{
                classes,
                label: "Recipe",
                placeholder: "What do you want to make?",
                value: searchQuery,
                onChange: this.handleChange
              }}
              theme={{
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion
              }}
              renderSuggestionsContainer={options => (
                <Paper {...options.containerProps} square>
                  {options.children}
                </Paper>
              )}
            />
            <SearchPreferences
              expanded={expanded}
              preferences={preferences}
              handleSearchPreferencesPanelExpansion={
                this.handleSearchPreferencesPanelExpansion
              }
              preferenceOutputType={"String"}
              setSearchPreferences={this.handleSearchPreferencesSelection}
            />
            <Button
              className={classes.submitButton}
              variant="contained"
              color="default"
              type="submit"
              fullWidth
            >
              Get Recipes
            </Button>
          </Paper>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  suggestions: state.appData.userData.recipes.current.suggestions,

  userSettings: state.appData.userData.settings,
  preferences: state.appData.userData.settings.preferences
});

const enhance = compose(
  withStyles(styles),
  connect(mapStateToProps, {
    handleRecipeSearch: recipesActions.getRecipes,
    getRecipeAutocompleteSuggestions: recipesActions.getRecipeAutocompletions,
    clearCurrentRecipesData: recipesActions.clearCurrentRecipesData
  })
);

export default enhance(SearchForm);
