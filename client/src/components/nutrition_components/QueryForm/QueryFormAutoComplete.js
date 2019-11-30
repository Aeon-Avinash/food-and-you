import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  nutritionActions,
  recipesActions,
  appStateActions
} from "../../../store/actions";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { updateObjProp } from "../../../utils/updateObjHelpers";
import ingredientSuggestions from "../../../helperData/autocomplete_data/top_1K_ingredients";
import { searchWithIngredients } from "../../../helperData/searchTipsDefault";

const styles = theme => ({
  rootPaper: {
    marginBottom: 20
  },
  searchQueryForm: {
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
    // alignItems: "center"
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
  },
  searchTips: {
    paddingTop: 10,
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-between"
    // maxWidth: "70%"
  }
});

const getNutritionAutocompleteSuggestions = partialQuery => {
  if (!partialQuery) return [];
  const searchQueryvalue = partialQuery.trim().toLowerCase();
  return searchQueryvalue.length === 0
    ? []
    : ingredientSuggestions
        .filter(
          ing =>
            ing.title.toLowerCase().slice(0, searchQueryvalue.length) ===
            searchQueryvalue
        )
        .filter((ing, index) => index <= 9);
};

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

const renderSuggestion = (suggestion, { searchQuery, isHighlighted }) => {
  const matches = match(suggestion.title, searchQuery);
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

class QueryForm extends Component {
  state = {
    searchQuery: "",
    searchTypeState: {
      ingredient: { checked: true, value: "ingredient" },
      recipe: { checked: false, value: "recipe" }
    },
    ingredientSuggestions: [],
    recipeSuggestions: [],
    ingredientSearchTip: "ingredient-A, ingredient-B, ingredient-C"
  };

  componentWillUnmount() {
    clearInterval(this.autoRotateSearchTips);
  }

  getNutritionAutocompleteSuggestions = value => {
    const ingredientSuggestions = getNutritionAutocompleteSuggestions(value);
    this.setState({ ingredientSuggestions });
  };

  handleChange = (event, { newValue }) => {
    // console.log({ newValue });
    // console.log(event.target);
    let segments =
      event.target && event.target.value && event.target.value.split(",");
    let newSearchQuery =
      segments && segments.length > 1 ? event.target.value : newValue;
    this.setState({ searchQuery: newSearchQuery });
  };

  shouldRenderSuggestions = value => {
    let segments = value.split(",");
    // console.log(segments);
    return segments.length > 1
      ? segments[segments.length - 1].trim().length >= 1
      : value.trim().length >= 1;
  };

  onSuggestionsFetchRequested = ({ value, reason }) => {
    // console.log({ value, reason });
    let segments = value.split(",");
    let lastSegment = segments[segments.length - 1].trim();
    if (lastSegment.length >= 2) {
      this.getSuggestions(lastSegment);
    }
  };

  onSuggestionsClearRequested = () => {
    const searchType = Object.keys(this.state.searchTypeState).find(
      key => this.state.searchTypeState[key].checked === true
    );
    if (searchType === "recipe") {
      this.props.getRecipeAutocompleteSuggestions();
    } else {
      this.getNutritionAutocompleteSuggestions();
    }
  };

  getSuggestions = partialQuery => {
    const searchType = Object.keys(this.state.searchTypeState).find(
      key => this.state.searchTypeState[key].checked === true
    );
    // console.log({ partialQuery, searchType });
    if (searchType === "recipe") {
      this.props.getRecipeAutocompleteSuggestions(
        partialQuery ? partialQuery : null
      );
    } else {
      this.getNutritionAutocompleteSuggestions(
        partialQuery ? partialQuery : null
      );
    }
  };

  getSuggestionValue = suggestion => suggestion.title;

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, method }
  ) => {
    event.preventDefault();

    const searchType = Object.keys(this.state.searchTypeState).find(
      key => this.state.searchTypeState[key].checked === true
    );

    let newSearchQuery;

    if (method === "click" || (method === "enter" && searchType !== "recipe")) {
      let segments = this.state.searchQuery.split(",");
      newSearchQuery =
        segments.length > 1
          ? this.state.searchQuery
              .split(",")
              .map((sgmt, index, arr) =>
                index === arr.length - 1 ? suggestionValue : sgmt.trim()
              )
              .join(", ")
          : suggestionValue;
      this.setState({ searchQuery: newSearchQuery });
    }

    console.log({
      suggestionValue,
      method,
      searchQuery: this.state.searchQuery,
      searchType,
      newSearchQuery
    });

    if (searchType === "recipe") {
      this.handleAnalysisRequest(suggestionValue, searchType);
    } else {
      this.handleAnalysisRequest(newSearchQuery, searchType);
    }
  };

  handleManualSubmit = event => {
    event.preventDefault();
    const { searchQuery, searchTypeState } = this.state;

    const searchType = Object.keys(searchTypeState).find(
      key => searchTypeState[key].checked === true
    );

    console.log({ method: "manual", searchQuery: searchQuery, searchType });

    if (searchQuery.trim().length > 0) {
      this.handleAnalysisRequest(searchQuery, searchType);
    }
  };

  handleAnalysisRequest = (searchQueryValue, searchType) => {
    if (searchType === "recipe") {
      this.props.getRecipes({
        searchQuery: searchQueryValue,
        searchType,
        pagination: { offset: 0, number: 12 }
      });
    } else {
      this.props.getNutrition({
        searchQuery: searchQueryValue,
        searchType
      });
    }
    this.props.clearCurrentNutritionData();
    this.props.clearCurrentRecipesData();
    this.props.setShowNutritionDetail(false);
    this.props.setShowRecipeDetail(false);
    // this.props.clearAllAppState();

    //? for Nutrition Routes
    this.props.history &&
      this.props.pushHistoryToLocation &&
      this.props.history.push(this.props.pushHistoryToLocation);
  };

  handleCheckboxChange = name => event => {
    let newCheckedValue = event.target.checked;
    this.setState(
      {
        //?  Checking selected choice
        searchTypeState: updateObjProp(
          this.state.searchTypeState,
          newCheckedValue,
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
                !newCheckedValue,
                checkKey,
                "checked"
              )
            });
          });
      }
    );
  };

  autoRotateSearchTips = setInterval(() => {
    let rnd = Math.floor(Math.random() * searchWithIngredients.length);
    let searchTip = searchWithIngredients[rnd].tip;
    this.setState({ ingredientSearchTip: searchTip });
  }, 2000);

  render() {
    const {
      searchQuery,
      searchTypeState,
      // recipeSuggestions,
      ingredientSuggestions
    } = this.state;
    const searchType = Object.keys(this.state.searchTypeState).find(
      key => this.state.searchTypeState[key].checked === true
    );
    const { classes } = this.props;
    const recipeSuggestions = this.props.recipeSuggestions || [];

    const autoSuggestProps = {
      renderInputComponent: renderInputComponent,
      suggestions:
        searchType === "recipe" ? recipeSuggestions : ingredientSuggestions,
      onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      onSuggestionSelected: this.onSuggestionSelected,
      getSuggestionValue: this.getSuggestionValue,
      shouldRenderSuggestions: this.shouldRenderSuggestions,
      renderSuggestion,
      highlightFirstSuggestion: true
    };

    // console.log({ searchQuery });

    return (
      <div>
        <Paper className={classes.rootPaper}>
          <Typography variant="h4" gutterBottom>
            Get nutrition analysis for your meal
          </Typography>
          <form onSubmit={this.handleManualSubmit}>
            <Paper className={classes.searchQueryForm}>
              <Autosuggest
                {...autoSuggestProps}
                inputProps={{
                  classes,
                  label: "Food Query",
                  placeholder: "What did you eat or want to eat?",
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
              <div className={classes.searchTips}>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  {"note: "}
                  {"ingredients need to be comma separated"}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  {"e.g. "}
                  {this.state.ingredientSearchTip}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  {"unit: "}
                  {"default portion is 1 serving"}
                </Typography>
              </div>
              <FormControl className={classes.formControl}>
                <FormLabel
                  component="legend"
                  className={classes.checkboxLegend}
                >
                  Select the type of search searchQuery
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
                    Select <strong>ingredient</strong> to search with ingredient
                    / grocery / product name...
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
                fullWidth
              >
                Get Nutrition Analysis
              </Button>
            </Paper>
          </form>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  errorMessagePrimary: state.appState.primary.errorMessage,

  recipeSuggestions: state.appData.userData.recipes.current.suggestions
});

const enhance = compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, {
    getNutrition: nutritionActions.getNutrition,
    getRecipes: recipesActions.getRecipes,
    getRecipeAutocompleteSuggestions: recipesActions.getRecipeAutocompletions,
    setShowNutritionDetail: nutritionActions.setShowNutritionDetail,
    setShowRecipeDetail: nutritionActions.setShowRecipeDetail,
    clearCurrentNutritionData: nutritionActions.clearCurrentNutritionData,
    clearCurrentRecipesData: recipesActions.clearCurrentRecipesData,
    clearAllAppState: appStateActions.clearAllAppState
  })
);

export default enhance(QueryForm);
