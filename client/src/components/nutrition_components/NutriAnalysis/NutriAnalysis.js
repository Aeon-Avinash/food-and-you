import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import {
  nutritionActions,
  recipesActions,
  trackerActions,
  uiStateActions,
  appStateActions
} from "../../../store/actions";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Link from "../../../ui/Link/Link";
import { createEntry } from "../../../helperData/trackerCalculations";
import { views, resourceTypes } from "../../../helperData/constants";
import SelectionDetailSnippet from "../../tracker_components/SelectionDetailSnippet/SelectionDetailSnippet";
import NutriSnippet from "../NutriSnippet/NutriSnippet";
import RecipeNutriSnippet from "../RecipeNutriSnippet/RecipeNutriSnippet";
import RecipeList from "../../recipe_components/RecipeList/RecipeList";
import RecipeDetail from "../../recipe_components/RecipeDetail/RecipeDetail";
import DateTimePicker from "../../tracker_components/DateTimePicker/DateTimePicker";
import { createMealPlan } from "../../../helperData/trackerCalculations";

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
  button: {
    margin: 10
  }
});

class NutriAnalysis extends Component {
  componentDidMount = () => {};

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.successDataNutritionSync !==
        this.props.successDataNutritionSync &&
      this.props.successDataNutritionSync
    ) {
      this.props.enqueueSnackbar(`Nutrition analysis has been saved`, {
        variant: "default"
      });
    }
    if (
      prevProps.errorMessagePrimary !== this.props.errorMessagePrimary &&
      this.props.errorMessagePrimary
    ) {
      this.props.enqueueSnackbar(`Nutrition analysis request failed`, {
        variant: "error"
      });
    }
  };

  componentWillUnmount = () => {
    this.props.setEntryModalVisibility(false);
    this.props.setConfirmTimeSlotSelection(false);
    this.props.setTargetNewEntrySlot();
    this.props.setShowNutritionDetail(false);
    this.props.setShowRecipeDetail(false);

    this.props.clearCurrentNutritionData();
    this.props.clearCurrentRecipesData();
    this.props.clearPrimaryAppState();
    this.props.clearSyncNutritionAppState();
    console.log("NutriAnalysis unmounting!");
  };

  handleSaveNutritionAnalysis = () => {
    console.log(this.props.currentNutritionData);
    let entryData;
    if (
      this.props.currentNutritionData &&
      this.props.currentNutritionData.resData &&
      !this.props.errorMessagePrimary
    ) {
      entryData = createEntry(this.props.currentNutritionData.resData);
      this.props.saveNutritionAnalysis(entryData);
    }
    if (
      this.props.currentRecipeDetail &&
      this.props.currentRecipeDetail.recipeDetail &&
      !this.props.errorMessagePrimary
    ) {
      entryData = createMealPlan(
        this.props.currentRecipeDetail.recipeDetail,
        resourceTypes.dietEntry
      );
      this.props.saveNutritionAnalysis(entryData);
    }
  };

  requestDetailNuritionAnalysisModal = () => {
    this.props.setNutriModalVisibility(true);
  };

  hideDetailsModal = () => {
    this.props.setNutriModalVisibility(false);
  };

  initiateSlotSelectForEntry = () => {
    this.props.setDateTimePickerVisibility(true);
  };

  confirmSlotSelectForEntry = () => {
    this.props.setConfirmTimeSlotSelection(true);
    // this.props.setNutriModalVisibility(true);
  };

  handleRequestRecipeDetail = recipeId => {
    this.props.setShowRecipeDetail(true);
    this.props.setShowNutritionDetail(false);
    this.props.getRecipeDetail(recipeId);
  };

  handleRequestRecipeNutrition = recipeId => {
    this.props.setShowRecipeDetail(false);
    this.props.setShowNutritionDetail(true);
    this.props.getRecipeDetail(recipeId);
  };

  backToRecipeSnippets = () => {
    this.props.setCurrentRecipeDetail(undefined);
    this.props.setShowRecipeDetail(false);
    this.props.setShowNutritionDetail(false);
  };

  requestAddEntryToTracker = (finalEntry, entryDate) => {
    let entryData;
    if (
      this.props.currentNutritionData &&
      this.props.currentNutritionData.resData &&
      !this.props.errorMessagePrimary
    ) {
      entryData = createEntry(this.props.currentNutritionData.resData);
    }
    if (
      this.props.currentRecipeDetail &&
      this.props.currentRecipeDetail.recipeDetail &&
      !this.props.errorMessagePrimary
    ) {
      entryData = createMealPlan(
        this.props.currentRecipeDetail.recipeDetail,
        resourceTypes.dietEntry
      );
    }

    if (!entryData) return;
    console.log({ ...entryData, ...finalEntry });

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

      this.props.clearCurrentNutritionData();
      this.props.clearCurrentRecipesData();
      this.props.setShowNutritionDetail(false);
      this.props.setShowRecipeDetail(false);
      this.props.clearPrimaryAppState();
    });
  };

  render() {
    const {
      classes,
      authenticated,
      currentNutritionData,
      currentRecipeDetail,
      currentRecipeList,
      errorMessagePrimary,
      showNutritionDetail,
      showRecipeDetail,
      // saveNutritionAnalysis,
      dateTimePickerVisibility,
      openNutriModal,
      targetEntrySlot,
      confirmTimeSlotSelection
    } = this.props;

    let entryData, recipeList, nutritionDetail, recipeDetail;
    if (currentNutritionData && currentNutritionData.resData) {
      entryData = createEntry(currentNutritionData.resData);
    }
    if (currentRecipeList && currentRecipeList.recipes) {
      recipeList = currentRecipeList.recipes;
    }
    if (
      currentRecipeDetail &&
      currentRecipeDetail.recipeDetail &&
      showRecipeDetail
    ) {
      recipeDetail = currentRecipeDetail.recipeDetail;
    }
    if (
      currentRecipeDetail &&
      currentRecipeDetail.recipeDetail &&
      showNutritionDetail
    ) {
      nutritionDetail = createMealPlan(
        currentRecipeDetail.recipeDetail,
        resourceTypes.dietEntry
      );
    }
    console.log({ entryData, recipeList, recipeDetail, nutritionDetail });
    return (
      <div>
        <Paper className={classes.rootPaper}>
          {errorMessagePrimary ? (
            <>
              {!errorMessagePrimary ? (
                <Typography variant="h5" gutterBottom>
                  Nutrition analysis
                </Typography>
              ) : (
                <Typography variant="h5" gutterBottom>
                  Nutrition analysis request failed. Please try again.
                </Typography>
              )}
            </>
          ) : (
            <>
              {entryData && !recipeList && (
                <>
                  <Typography variant="h5" gutterBottom>
                    Nutrition analysis{" "}
                    {entryData ? `for ${entryData.title}` : null}
                  </Typography>
                  <NutriSnippet entryData={entryData} />
                  {!authenticated && (
                    <Link to="/">Login to Save Nutrition Analysis</Link>
                  )}
                </>
              )}

              {!entryData &&
                recipeList &&
                !showNutritionDetail &&
                !showRecipeDetail && (
                  <>
                    <Typography variant="h5" gutterBottom>
                      Select Recipe for nutrition details
                    </Typography>
                    <RecipeList
                      searchData={currentRecipeList}
                      requestRecipes={this.props.getRecipes}
                      requestRecipeDetail={this.handleRequestRecipeDetail}
                      requestRecipeNutrition={this.handleRequestRecipeNutrition}
                    />
                  </>
                )}

              {!entryData && nutritionDetail && showNutritionDetail && (
                <>
                  <Typography variant="h5" gutterBottom>
                    Nutrition analysis for {nutritionDetail.title}
                  </Typography>
                  <RecipeNutriSnippet
                    entryData={nutritionDetail}
                    requestRecipeDetail={this.handleRequestRecipeDetail.bind(
                      this,
                      currentRecipeDetail.recipeDetail.id
                    )}
                  />
                </>
              )}

              {!entryData && recipeDetail && showRecipeDetail && (
                <>
                  <Typography variant="h5" gutterBottom>
                    Detail recipe for {recipeDetail.title}
                  </Typography>
                  <RecipeDetail
                    backToRecipeSnippets={this.backToRecipeSnippets}
                  />
                </>
              )}

              {entryData || recipeDetail || nutritionDetail ? (
                <>
                  {authenticated && dateTimePickerVisibility ? (
                    <DateTimePicker
                      targetEntrySlot={targetEntrySlot}
                      dateTimePickerVisibility={dateTimePickerVisibility}
                      setDateTimePickerVisibility={
                        this.props.setDateTimePickerVisibility
                      }
                      confirmTimeSlotSelection={confirmTimeSlotSelection}
                      requestAddEntryToTracker={this.requestAddEntryToTracker}
                    />
                  ) : null}

                  {authenticated ? (
                    <div className={classes.buttonGroup}>
                      <Button
                        className={classes.button}
                        variant="contained"
                        color="default"
                        onClick={this.handleSaveNutritionAnalysis}
                      >
                        Save Query but don't add to tracker
                      </Button>
                      {showNutritionDetail ? (
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="default"
                          onClick={this.handleRequestRecipeDetail.bind(
                            this,
                            currentRecipeDetail.recipeDetail.id
                          )}
                        >
                          View Detailed Recipe
                        </Button>
                      ) : (
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="default"
                          onClick={this.requestDetailNuritionAnalysisModal}
                        >
                          View Detailed Nutrition Analysis
                        </Button>
                      )}
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
                          Confirm Add Entry to My Tracker
                        </Button>
                      )}
                    </div>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </Paper>
        {(openNutriModal && entryData) || recipeDetail ? (
          <SelectionDetailSnippet
            openDetailsModal={openNutriModal}
            showDetailsModal={this.requestDetailNuritionAnalysisModal}
            hideDetailsModal={this.hideDetailsModal}
            selectionData={
              (entryData &&
                createEntry(this.props.currentNutritionData.resData)) ||
              (recipeDetail && createMealPlan(recipeDetail))
            }
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  successDataNutritionSync: state.appState.nutritionSync.successData,
  errorMessageNutritionSync: state.appState.nutritionSync.errorMessage,
  errorMessagePrimary: state.appState.primary.errorMessage,

  currentNutritionData: state.appData.userData.nutrition.current,
  currentRecipeDetail: state.appData.userData.recipes.current.detail,
  currentRecipeList: state.appData.userData.recipes.current.list,
  showNutritionDetail: state.appData.userData.nutrition.showNutritionDetail,
  showRecipeDetail: state.appData.userData.nutrition.showRecipeDetail,

  confirmTimeSlotSelection:
    state.appData.tracker.targetTimeline.confirmTimeSlotSelectionDietEntry,
  targetEntryId: state.appData.tracker.targetTimeline.targetEntryId,
  targetEntrySlot: state.appData.tracker.targetTimeline.targetEntrySlot,

  openNutriModal: state.uiState.uiNutriModalHelper.isVisible,
  dateTimePickerVisibility: state.uiState.uiStateNutriHelper.isVisible
});

const enhance = compose(
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, {
    saveNutritionAnalysis: nutritionActions.saveNutritionAnalysis,
    clearCurrentNutritionData: nutritionActions.clearCurrentNutritionData,
    clearCurrentRecipesData: recipesActions.clearCurrentRecipesData,
    getRecipes: recipesActions.getRecipes,
    getRecipeDetail: recipesActions.getRecipeDetail,
    setCurrentRecipeDetail: recipesActions.setCurrentRecipeDetail,
    setShowNutritionDetail: nutritionActions.setShowNutritionDetail,
    setShowRecipeDetail: nutritionActions.setShowRecipeDetail,

    addEntryToTracker: trackerActions.addEntryToTracker,
    setCurrentTimelineView: trackerActions.setCurrentTimelineView,
    setCurrentTimelineDate: trackerActions.setCurrentTimelineDate,
    setSelectedSnippetData: trackerActions.setSelectedSnippetData,
    setTargetNewEntrySlot: trackerActions.setTargetNewEntrySlot,
    setConfirmTimeSlotSelection:
      trackerActions.setConfirmTimeSlotSelectionDietEntry,

    setEntryModalVisibility: uiStateActions.setModalOneVisibility,
    setNutriModalVisibility: uiStateActions.setNutriModalVisibility,
    setDateTimePickerVisibility: uiStateActions.setNutriHelperVisibility,

    clearPrimaryAppState: appStateActions.clearPrimaryAppState,
    clearSyncNutritionAppState: appStateActions.clearSyncNutritionAppState
  })
);

export default enhance(NutriAnalysis);
