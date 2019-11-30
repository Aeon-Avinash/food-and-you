import React, { Component } from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { compose } from "redux";
import { Switch, Route } from "react-router-dom";
import {
  appStateActions,
  recipesActions,
  trackerActions,
  uiStateActions
} from "../../store/actions";
import moment from "moment";
import SearchForm from "../../components/recipe_components/SearchForm/SearchForm";
import RecipeSnippets from "../../components/recipe_components/RecipeSnippets/RecipeSnippets";
import RecipeDetail from "../../components/recipe_components/RecipeDetail/RecipeDetail";
import { resourceTypes } from "../../helperData/constants";

class Recipe extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.errorMessageRecipesSync !==
        this.props.errorMessageRecipesSync &&
      this.props.errorMessageRecipesSync
    ) {
      this.props.enqueueSnackbar(this.props.errorMessageRecipesSync, {
        variant: "error"
      });
    }
  };

  componentWillUnmount = () => {
    console.log("umounting Recipes!");
    if (!this.props.currentTimelineRecipeDetail) {
      this.props.clearCurrentRecipesData();
    }
    this.props.clearAllAppState();
  };

  redirectToCreateMealPlan = () => {
    this.props.setEntryModalState(resourceTypes.mealPlan);
    this.props.setTargetNewEntrySlot({
      action: "trackerMenu",
      start: new Date(moment(this.props.currentTimelineDate).add(1, "day")),
      end: new Date(
        moment(this.props.currentTimelineDate)
          .add(1, "day")
          .add(15, "minutes")
      )
    });

    this.props.setCurrentTimelineRecipeDetail(this.props.currentRecipeDetail);
    this.props.setSelectedSnippetType("NEW");
    this.props.setEntryModalVisibility(true);
    setTimeout(() => {
      this.props.history.push("/tracker/timeline");
    }, 0);
    //? The order matters, push history at the very end with a minimum timeout
    //? to prevent unmounting before other updates
  };

  render() {
    const {
      history,
      match,
      location
      // authenticated,
      // currentRecipeDetail
    } = this.props;
    const routeProps = { history, match, location };
    return (
      <div>
        <SearchForm
          pushHistoryToRecipe={`${match.url}/recipeSnippets`}
          {...routeProps}
        />
        <Switch>
          <Route
            exact
            path={`${match.url}/recipeSnippets`}
            render={routeProps => (
              <RecipeSnippets
                pushHistoryToRecipe={`${match.url}/recipeDetail`}
                {...routeProps}
              />
            )}
          />
          <Route
            exact
            path={`${match.url}/recipeDetail`}
            render={routeProps => (
              <RecipeDetail
                createMealPlanWithRecipe={this.redirectToCreateMealPlan}
                {...routeProps}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  errorMessageRecipesSync: state.appState.recipesSync.errorMessage,
  currentRecipeDetail: state.appData.userData.recipes.current.detail,

  currentTimelineRecipeDetail:
    state.appData.userData.recipes.current.timelineDetail
});

const enhance = compose(
  withSnackbar,
  connect(mapStateToProps, {
    setTargetNewEntrySlot: trackerActions.setTargetNewEntrySlot,
    setSelectedSnippetType: trackerActions.setSelectedSnippetType,
    setEntryModalState: uiStateActions.setModalOneState,
    setEntryModalVisibility: uiStateActions.setModalOneVisibility,

    setCurrentTimelineRecipeDetail:
      recipesActions.setCurrentTimelineRecipeDetail,

    clearAllAppState: appStateActions.clearAllAppState,
    clearCurrentRecipesData: recipesActions.clearCurrentRecipesData
  })
);

export default enhance(Recipe);
