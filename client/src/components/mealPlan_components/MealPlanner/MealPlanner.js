import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  recipesActions,
  trackerActions,
  uiStateActions,
  appStateActions
} from "../../../store/actions";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { createMealPlan } from "../../../helperData/trackerCalculations";
import { views } from "../../../helperData/constants";
import RecipeSnippets from "../../recipe_components/RecipeSnippets/RecipeSnippets";
import RecipeDetail from "../../recipe_components/RecipeDetail/RecipeDetail";
import SelectionDetailSnippet from "../../tracker_components/SelectionDetailSnippet/SelectionDetailSnippet";
import DateTimePicker from "../../tracker_components/DateTimePicker/DateTimePicker";
import { withSnackbar } from "notistack";
import OverlayLoader from "../../../ui/OverlayLoader/OverlayLoader";

const styles = theme => ({
  rootPaper: {
    marginTop: 20,
    marginBottom: 10
  },
  nutritionSummary: {
    marginBottom: 10
  },
  dateTimePickerRoot: {
    padding: 10,
    position: "relative",
    backgroundColor: "rgba(232, 223, 224, 0.64)"
  },
  dateTimePickerButtonGroup: {
    padding: 10
  },
  dateTimePickerCloseButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    margin: 10
  }
});

class MealPlanner extends Component {
  componentDidMount = () => {};

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.successDataRecipesSync !== this.props.successDataRecipesSync &&
      this.props.successDataRecipesSync
    ) {
      this.props.enqueueSnackbar(`Recipe has been saved to your favorites`, {
        variant: "default"
      });
    }
  };

  componentWillUnmount = () => {
    this.props.setEntryModalVisibility(false);
    this.props.setConfirmTimeSlotSelection(false);
    this.props.setTargetNewEntrySlot();
    this.props.clearCurrentRecipesData();
    this.props.clearPrimaryAppState();
    this.props.clearSecondaryAppState();
    console.log("MealPlanner unmounting!");
  };

  backToRecipeSnippets = () => {
    this.props.setCurrentRecipeDetail(undefined);
  };

  handleSaveRecipe = () => {
    const recipeDetail =
      this.props.currentRecipeDetail &&
      this.props.currentRecipeDetail.recipeDetail;
    this.props.saveRecipe(recipeDetail.id, recipeDetail.title);
  };

  requestDetailRecipeNurition = () => {
    this.props.setDetailsModalVisibility(true);
  };

  hideDetailsModal = () => {
    this.props.setDetailsModalVisibility(false);
  };

  initiateSlotSelectForEntry = () => {
    this.props.setDateTimePickerVisibility(true);
  };

  confirmSlotSelectForEntry = () => {
    this.props.setLoaderState(true);
    this.props.setConfirmTimeSlotSelection(true);
    // this.props.setDateTimePickerVisibility(false);
  };

  requestAddEntryToTracker = (finalEntry, entryDate) => {
    if (
      this.props.currentRecipeDetail &&
      this.props.currentRecipeDetail.recipeDetail &&
      !this.props.errorMessageSecondary
    ) {
      const entryData = createMealPlan(
        this.props.currentRecipeDetail.recipeDetail
      );
      // console.log({ ...entryData, ...finalEntry });

      this.props.setLoaderState(true);
      this.props.addEntryToTracker({ ...entryData, ...finalEntry }, () => {
        console.log("redirect after new tracker entry saved successful");
        if (this.props.match.url !== "/tracker/timeline") {
          this.props.history.push("/tracker/timeline");
        }
        this.props.setDateTimePickerVisibility(false);
        this.props.setCurrentTimelineView(views.AGENDA);
        this.props.setCurrentTimelineDate(entryDate);
        this.props.setTargetNewEntrySlot();
        this.props.setEntryModalVisibility(false);
        this.props.clearCurrentRecipesData();
        this.props.clearPrimaryAppState();
        this.props.setLoaderState(false);
      });
    }
  };

  render() {
    const {
      classes,
      // authenticated,
      errorMessagePrimary,
      dateTimePickerVisibility,
      openDetailsModal,
      currentRecipeDetail,
      targetEntrySlot,
      confirmTimeSlotSelection,
      overlayLoaderState
    } = this.props;

    const recipeDetail =
      currentRecipeDetail && currentRecipeDetail.recipeDetail;
    // (selectedSnippetData && selectedSnippetData.recipeDetail);
    console.log({ recipeDetail });
    return (
      <OverlayLoader
        active={overlayLoaderState}
        text={"adding your new meal plan..."}
      >
        <Paper className={classes.rootPaper}>
          {errorMessagePrimary ? (
            <Typography variant="h5">{errorMessagePrimary}</Typography>
          ) : (
            <>
              {!recipeDetail ? (
                <>
                  <RecipeSnippets addRecipeToMealPlanner />
                </>
              ) : null}
              {recipeDetail ? (
                <>
                  <RecipeDetail
                    backToRecipeSnippets={this.backToRecipeSnippets}
                  />
                  {recipeDetail && dateTimePickerVisibility ? (
                    <DateTimePicker
                      targetEntrySlot={targetEntrySlot}
                      dateTimePickerVisibility={dateTimePickerVisibility}
                      setDateTimePickerVisibility={
                        this.props.setDateTimePickerVisibility
                      }
                      confirmTimeSlotSelection={confirmTimeSlotSelection}
                      requestAddEntryToTracker={this.requestAddEntryToTracker}
                      isMealPlanner
                    />
                  ) : null}

                  {recipeDetail ? (
                    <div className={classes.buttonGroup}>
                      <Button
                        className={classes.button}
                        variant="contained"
                        color="default"
                        onClick={this.handleSaveRecipe}
                      >
                        Save Recipe but don't add to Meal-Planner
                      </Button>
                      <Button
                        className={classes.button}
                        variant="contained"
                        color="default"
                        onClick={this.requestDetailRecipeNurition}
                      >
                        View Detailed Recipe Nutrition
                      </Button>
                      {!dateTimePickerVisibility ? (
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="default"
                          onClick={this.initiateSlotSelectForEntry}
                        >
                          Select Time Slot to Add to the Tracker
                        </Button>
                      ) : (
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="primary"
                          onClick={this.confirmSlotSelectForEntry}
                        >
                          Confirm Add MealPlan to My Tracker
                        </Button>
                      )}
                    </div>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </Paper>
        {openDetailsModal && recipeDetail ? (
          <SelectionDetailSnippet
            openDetailsModal={openDetailsModal}
            showDetailsModal={this.requestDetailRecipeNurition}
            hideDetailsModal={this.hideDetailsModal}
            selectionData={createMealPlan(recipeDetail)}
          />
        ) : null}
      </OverlayLoader>
    );
  }
}

const mapStateToProps = state => ({
  // authenticated: state.appData.auth.token,
  errorMessagePrimary: state.appState.primary.errorMessage,
  errorMessageSecondary: state.appState.secondary.errorMessage,
  successDataRecipesSync: state.appState.recipesSync.successData,
  errorMessageRecipesSync: state.appState.recipesSync.errorMessage,

  currentRecipeDetail: state.appData.userData.recipes.current.detail,
  confirmTimeSlotSelection:
    state.appData.tracker.targetTimeline.confirmTimeSlotSelectionMealPlan,

  targetEntryId: state.appData.tracker.targetTimeline.targetEntryId,
  targetEntrySlot: state.appData.tracker.targetTimeline.targetEntrySlot,

  openDetailsModal: state.uiState.uiModalTwoHelper.isVisible,
  dateTimePickerVisibility: state.uiState.uiStateMealplanHelper.isVisible,
  overlayLoaderState: state.uiState.uiLoader.uiState
});

const enhance = compose(
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, {
    addEntryToTracker: trackerActions.addEntryToTracker,
    saveRecipe: recipesActions.saveRecipeToFavorites,
    setCurrentRecipeDetail: recipesActions.setCurrentRecipeDetail,
    clearCurrentRecipesData: recipesActions.clearCurrentRecipesData,

    setCurrentTimelineView: trackerActions.setCurrentTimelineView,
    setCurrentTimelineDate: trackerActions.setCurrentTimelineDate,
    setTargetNewEntrySlot: trackerActions.setTargetNewEntrySlot,
    setConfirmTimeSlotSelection:
      trackerActions.setConfirmTimeSlotSelectionMealPlan,

    setEntryModalVisibility: uiStateActions.setModalOneVisibility,
    setDetailsModalVisibility: uiStateActions.setModalTwoVisibility,
    setDateTimePickerVisibility: uiStateActions.setMealplanHelperVisibility,
    setLoaderState: uiStateActions.setLoaderState,

    clearPrimaryAppState: appStateActions.clearPrimaryAppState,
    clearSecondaryAppState: appStateActions.clearSecondaryAppState
  })
);

export default enhance(MealPlanner);
