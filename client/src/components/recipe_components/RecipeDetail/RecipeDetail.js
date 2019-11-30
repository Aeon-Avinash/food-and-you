import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  recipesActions,
  uiStateActions,
  appStateActions
} from "../../../store/actions";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreIcon from "@material-ui/icons/UnfoldMoreRounded";
import LeftIcon from "@material-ui/icons/ChevronLeftRounded";
import TimerIcon from "@material-ui/icons/Timer";
import Link from "../../../ui/Link/Link";
import SelectionDetailSnippet from "../../tracker_components/SelectionDetailSnippet/SelectionDetailSnippet";
import { createMealPlan } from "../../../helperData/trackerCalculations";
import { withSnackbar } from "notistack";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
  },
  gridPaper: {
    padding: theme.spacing(3, 2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  recipeDetailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  card: {
    maxWidth: "90%",
    padding: 20,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    transition: "0.2s ease-out",
    "&:hover": {
      backgroundColor: "rgba(232, 223, 224, 0.96)",
      boxShadow: "8px 16px 32px 8px rgba(0, 0, 0, 0.2)",
      transform: "translate(1px, 1px)"
    }
    // cursor: "pointer"
  },
  media: {
    width: "auto",
    height: "auto",
    paddingBottom: theme.spacing(3),
    display: "inline"
    // [theme.breakpoints.down("md")]: {
    //   display: "block",
    //   padding: "0 !important"
    // }
  },
  CardContent: {
    display: "flex",
    flexFlow: "row"
  },
  instructionsContent: {
    display: "inline"
  },
  CardActions: {
    display: "flex",
    justifyContent: "space-between"
  },
  colorTextPrimary: {
    fontWeight: "bold"
  },
  colorTextSecondary: {
    fontWeight: "normal",
    color: "#444444"
  },
  mainNutrients: {
    paddingTop: 0,
    paddingBottom: 0
  },
  nutrientRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 0,
    paddingBottom: 0
  },
  alignRight: {
    justifyContent: "flex-end"
  },
  genericItem: {
    paddingTop: 0,
    paddingBottom: 0
  },
  mediumDivider: {
    height: "5px"
  },
  iconParent: {
    position: "relative"
  },
  timerIcon: {
    // lineHeight: "0.5",
    width: "0.75em",
    height: "0.75em",
    position: "absolute",
    top: "2px"
  },
  iconAfter: {
    color: "rgba(232, 223, 224, 0.64)"
  },
  recipeTagChips: {
    fontWeight: "bold",
    marginLeft: 10
  }
});

class RecipeDetail extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.successDataRecipesSync !== this.props.successDataRecipesSync &&
      this.props.successDataRecipesSync
    ) {
      this.props.enqueueSnackbar(`Recipe has been saved to your favorites`, {
        variant: "default"
      });
    }
    if (
      prevProps.errorMessageSecondary !== this.props.errorMessageSecondary &&
      this.props.errorMessageSecondary
    ) {
      this.props.enqueueSnackbar(`Error getting detail recipe. Try Again`, {
        variant: "error"
      });
    }
  };

  componentWillUnmount = () => {
    console.log("Recipe Detail unmounting!");
    this.props.clearSyncRecipesAppState();
  };

  showNutritionDetails = () => {
    this.props.setNutriModalVisibility(true);
  };

  hideDetailsModal = () => {
    this.props.setNutriModalVisibility(false);
  };

  navigateBackToRecipeSnippets = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.backToRecipeSnippets) {
      this.props.backToRecipeSnippets();
    }
  };

  render() {
    const {
      classes,
      authenticated,
      errorMessageSecondary,
      currentRecipeDetail,
      currentTimelineRecipeDetail,
      handleSaveRecipe,
      openNutriModal
      // setNutriModalVisibility
    } = this.props;

    let recipeDetail, recipeTags, recipeNutrition;

    // console.log({ currentRecipeDetail, currentTimelineRecipeDetail });

    if (currentRecipeDetail && currentRecipeDetail.recipeDetail)
      recipeDetail = currentRecipeDetail.recipeDetail;
    if (currentTimelineRecipeDetail && currentTimelineRecipeDetail.recipeDetail)
      recipeDetail = currentTimelineRecipeDetail.recipeDetail;
    if (recipeDetail) {
      console.log(recipeDetail);
      recipeTags = recipeDetail.recipeTags
        ? recipeDetail.recipeTags
        : Object.keys(recipeDetail).filter(
            recipeDetailKey => String(recipeDetail[recipeDetailKey]) === "true"
          );
      recipeNutrition = recipeDetail.nutrition
        ? recipeDetail.nutrition
        : recipeDetail.rawNutritionData[recipeDetail.title];
    }

    // console.log({ openNutriModal, recipeDetail });

    return (
      <div className={classes.root}>
        {!currentTimelineRecipeDetail ? (
          <div className={classes.recipeDetailHeader}>
            {recipeDetail ? (
              <IconButton
                aria-label="Back to Recipe Search List"
                onClick={this.navigateBackToRecipeSnippets}
              >
                <LeftIcon />
                {" Back to Recipe Search List"}
              </IconButton>
            ) : null}
            <Typography variant="h5" gutterBottom>
              {recipeDetail ? recipeDetail.title : "Recipe Detail"}
            </Typography>
          </div>
        ) : null}
        {!errorMessageSecondary && !recipeDetail ? (
          <Typography variant="h5">{"Fetching your recipe..."}</Typography>
        ) : errorMessageSecondary && !recipeDetail ? (
          <Typography variant="h5">{`Error getting detail recipe. Try Again`}</Typography>
        ) : (
          <Paper className={classes.gridPaper}>
            <Card className={classes.card} raised>
              <CardHeader
                title={recipeDetail.title}
                subheader={`Author: ${recipeDetail.creditsText}`}
                action={
                  <IconButton
                    aria-label="show recipe nutrition"
                    onClick={this.showNutritionDetails}
                    title={"show recipe nutrition"}
                  >
                    {"Get Nutrition "} <MoreIcon />
                  </IconButton>
                }
              />

              <CardContent className={classes.CardContent}>
                <Grid container spacing={3} justify="space-around">
                  <Grid item md={12} lg={8}>
                    <div className={classes.media}>
                      <img src={recipeDetail.image} alt={recipeDetail.title} />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4}>
                    <List component="div" className={classes.mainNutrients}>
                      <ListItem className={classes.genericItem} divider>
                        <Typography
                          variant="body2"
                          display="inline"
                          className={classes.colorTextSecondary}
                          color="textSecondary"
                        >
                          {`servings: ${recipeDetail.servings}`}
                        </Typography>
                      </ListItem>
                      <ListItem className={classes.genericItem} divider>
                        <Typography
                          variant="body2"
                          display="inline"
                          className={classes.colorTextSecondary}
                          color="textSecondary"
                        >
                          ready in total {"  "}
                          <span className={classes.iconParent}>
                            <TimerIcon className={classes.timerIcon} />
                          </span>
                          <span className={classes.iconAfter}>{" . : . "}</span>
                          {recipeDetail.readyInMinutes} mins.
                        </Typography>
                      </ListItem>
                      {recipeDetail.preparationMinutes &&
                      recipeDetail.preparationMinutes !== 0 ? (
                        <ListItem className={classes.genericItem} divider>
                          <Typography
                            variant="body2"
                            display="inline"
                            className={clsx(classes.colorTextSecondary)}
                            color="textSecondary"
                          >
                            preparation {"  "}
                            <span className={classes.iconParent}>
                              <TimerIcon className={classes.timerIcon} />
                            </span>
                            <span className={classes.iconAfter}>
                              {" . : . "}
                            </span>
                            {recipeDetail.preparationMinutes} mins.
                          </Typography>
                        </ListItem>
                      ) : null}
                      {recipeDetail.cookingMinutes &&
                      recipeDetail.cookingMinutes !== 0 ? (
                        <ListItem className={classes.genericItem} divider>
                          <Typography
                            variant="body2"
                            display="inline"
                            className={clsx(classes.colorTextSecondary)}
                            color="textSecondary"
                          >
                            cooking {"  "}
                            <span className={classes.iconParent}>
                              <TimerIcon className={classes.timerIcon} />
                            </span>
                            <span className={classes.iconAfter}>
                              {" . : . "}
                            </span>
                            {recipeDetail.cookingMinutes} mins.
                          </Typography>
                        </ListItem>
                      ) : null}
                      <Divider className={classes.mediumDivider} />
                      <ListItem
                        divider
                        className={clsx(
                          classes.genericItem,
                          classes.nutrientRow
                        )}
                      >
                        <div>
                          <Typography
                            variant="caption"
                            display="inline"
                            className={classes.colorTextPrimary}
                            color="textPrimary"
                          >
                            Ingredients
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="caption"
                            display="inline"
                            color="textPrimary"
                            className={clsx(
                              classes.alignRight,
                              classes.nutrientRow,
                              classes.colorTextPrimary
                            )}
                          >
                            Amount
                          </Typography>
                        </div>
                      </ListItem>
                      {recipeNutrition.ingredients.map((ingredient, index) => (
                        <ListItem
                          className={classes.nutrientRow}
                          key={index}
                          divider
                        >
                          <div>
                            <Typography
                              variant="body2"
                              display="inline"
                              className={classes.colorTextSecondary}
                              color="textSecondary"
                            >
                              {ingredient.name}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="body2"
                              display="inline"
                              color="textSecondary"
                              className={clsx(
                                classes.alignRight,
                                classes.colorTextSecondary
                              )}
                            >
                              {`${ingredient.amount} ${ingredient.unit.replace(
                                recipeNutrition.ingredients[0].amount === 1 &&
                                  /s$/,
                                ""
                              )}`}
                            </Typography>
                          </div>
                        </ListItem>
                      ))}
                      <Divider className={classes.mediumDivider} />
                      <ListItem divider className={classes.genericItem}>
                        <Typography
                          variant="caption"
                          display="inline"
                          color="textPrimary"
                          className={clsx(
                            classes.alignRight,
                            classes.nutrientRow,
                            classes.colorTextPrimary
                          )}
                        >
                          Caloric BreakDown
                        </Typography>
                      </ListItem>
                      <ListItem className={classes.nutrientRow}>
                        <div>
                          <Typography
                            variant="body2"
                            display="inline"
                            className={classes.colorTextSecondary}
                            color="textSecondary"
                          >
                            {recipeNutrition.nutrients[0].title}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="body2"
                            display="inline"
                            color="textSecondary"
                            className={clsx(
                              classes.alignRight,
                              classes.colorTextSecondary
                            )}
                          >
                            {`${
                              recipeNutrition.nutrients[0].amount
                            } ${recipeNutrition.nutrients[0].unit.replace(
                              recipeNutrition.nutrients[0].amount === 1 && /s$/,
                              ""
                            )}`}
                          </Typography>
                        </div>
                      </ListItem>
                      {Object.keys(recipeNutrition.caloricBreakdown).map(
                        (ingredientKey, index) => (
                          <ListItem
                            className={classes.nutrientRow}
                            key={index}
                            divider
                          >
                            <div>
                              <Typography
                                variant="body2"
                                display="inline"
                                className={classes.colorTextSecondary}
                                color="textSecondary"
                              >
                                {ingredientKey.replace(/^percent/, "")}
                              </Typography>
                            </div>
                            <div>
                              <Typography
                                variant="body2"
                                display="inline"
                                color="textSecondary"
                                className={clsx(
                                  classes.alignRight,
                                  classes.colorTextSecondary
                                )}
                              >
                                {
                                  recipeNutrition.caloricBreakdown[
                                    ingredientKey
                                  ]
                                }
                                {"%"}
                              </Typography>
                            </div>
                          </ListItem>
                        )
                      )}
                    </List>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" component="span" gutterBottom>
                      {"Health Score: "}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      component="span"
                      gutterBottom
                    >
                      {recipeDetail.healthScore}{" "}
                    </Typography>
                    {recipeTags.map(tag => (
                      <Chip
                        label={tag}
                        color="primary"
                        variant="outlined"
                        // component="strong"
                        className={classes.recipeTagChips}
                        clickable
                        size="small"
                        key={tag}
                        title={tag}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>
                      {recipeDetail.instructions}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions className={classes.CardActions}>
                <div>
                  {authenticated ? (
                    <IconButton
                      aria-label="add to favorites"
                      onClick={handleSaveRecipe.bind(
                        this,
                        recipeDetail.id,
                        recipeDetail.title
                      )}
                      title={"add to favorites"}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  ) : (
                    <Link to="/">Login to Save Recipes</Link>
                  )}
                  <IconButton
                    aria-label="share recipe"
                    onClick={() => console.log("share this Recipe. Yay!")}
                    title={"share recipe"}
                  >
                    <ShareIcon />
                  </IconButton>
                </div>
                <div>
                  {authenticated && this.props.createMealPlanWithRecipe ? (
                    <Button
                      variant="text"
                      aria-label="show recipe nutrition"
                      onClick={this.props.createMealPlanWithRecipe}
                    >
                      Create a Meal Plan with Recipe
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      aria-label="show recipe nutrition"
                      onClick={this.showNutritionDetails}
                    >
                      Get Recipe Nutrition Detail
                    </Button>
                  )}
                </div>
              </CardActions>
            </Card>
          </Paper>
        )}
        {openNutriModal && recipeDetail ? (
          <SelectionDetailSnippet
            openDetailsModal={openNutriModal}
            showDetailsModal={this.requestDetailNuritionAnalysisModal}
            hideDetailsModal={this.hideDetailsModal}
            selectionData={createMealPlan(recipeDetail)}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  errorMessageSecondary: state.appState.secondary.errorMessage,
  successDataRecipesSync: state.appState.recipesSync.successData,
  errorMessageRecipesSync: state.appState.recipesSync.errorMessage,

  currentRecipeDetail: state.appData.userData.recipes.current.detail,
  currentTimelineRecipeDetail:
    state.appData.userData.recipes.current.timelineDetail,

  openNutriModal: state.uiState.uiNutriModalHelper.isVisible
});

const enhance = compose(
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, {
    requestRecipeDetail: recipesActions.getRecipeDetail,
    handleSaveRecipe: recipesActions.saveRecipeToFavorites,

    setNutriModalVisibility: uiStateActions.setNutriModalVisibility,
    clearSyncRecipesAppState: appStateActions.clearSyncRecipesAppState
  })
);

export default enhance(RecipeDetail);
