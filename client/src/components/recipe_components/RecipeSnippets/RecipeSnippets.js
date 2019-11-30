import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  recipesActions,
  uiStateActions,
  appStateActions
} from "../../../store/actions";
// import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";
// import ShareIcon from "@material-ui/icons/Share";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeftTwoTone";
import ChevronRightIcon from "@material-ui/icons/ChevronRightTwoTone";
import Link from "../../../ui/Link/Link";
import { withSnackbar } from "notistack";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
  },
  recipeSnippetsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  gridPaper: {
    padding: theme.spacing(3, 2)
  },
  card: {
    maxWidth: 345,
    padding: 0,
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
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: 20,
    padding: 20
  }
});

class RecipeSnippets extends Component {
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
      prevProps.errorMessagePrimary !== this.props.errorMessagePrimary &&
      this.props.errorMessagePrimary
    ) {
      this.props.enqueueSnackbar(`Error getting recipes. Try Again`, {
        variant: "error"
      });
    }
  };

  componentWillUnmount = () => {
    console.log("Recipe Snippets unmounting!");
    this.props.clearSyncRecipesAppState();
  };

  saveRecipe = (recipeId, title) => {
    this.props.handleSaveRecipe(recipeId, title);
  };

  requestRecipeDetail = recipeId => {
    const { history, pushHistoryToRecipe, addRecipeToMealPlanner } = this.props;
    this.props.requestRecipeDetail(recipeId);
    if (addRecipeToMealPlanner) {
      this.props.setDateAndTimePickerUI({ recipeId });
    }
    if (pushHistoryToRecipe) {
      console.log(pushHistoryToRecipe);
      history && history.push(pushHistoryToRecipe);
      // history && history.push(`/recipes/recipeDetail/${recipeId}`);
    }
  };

  requestSearchResultsPageChange = direction => {
    let prevOffset = this.props.searchData.finalQuery.pagination.offset;
    let newOffset = direction === "next" ? prevOffset + 1 : prevOffset - 1;
    this.props.requestRecipes({
      ...this.props.searchData.finalQuery,
      pagination: {
        ...this.props.searchData.finalQuery.pagination,
        offset: newOffset
      }
    });
  };

  render() {
    const {
      classes,
      authenticated,
      errorMessagePrimary,
      // history,
      searchData
      // pushHistoryToRecipe,
      // addRecipeToMealPlanner
    } = this.props;

    let recipes, finalQuery, queryMeta, searchListPagination;
    if (searchData) {
      // console.log(searchData);
      ({ recipes, finalQuery, queryMeta } = searchData);
      if (queryMeta) {
        searchListPagination = {
          prev: queryMeta.number * queryMeta.offset > 0,
          next:
            queryMeta.totalResults - (queryMeta.offset + 1) * queryMeta.number >
            0
        };
      }
    }
    return (
      <div className={classes.root}>
        {!recipes && finalQuery && !errorMessagePrimary ? (
          <Typography variant="h5">{"Fetching your recipes..."}</Typography>
        ) : !recipes && errorMessagePrimary ? (
          <Typography variant="h5">{`Error getting recipes. Try Again`}</Typography>
        ) : (
          recipes && (
            <>
              <div className={classes.recipeSnippetsHeader}>
                <Typography variant="h5" gutterBottom>
                  Recipe results {finalQuery && "for "}
                  <em>{finalQuery ? finalQuery.searchQuery : null}</em>
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {`Results page ${queryMeta.offset + 1}/${Math.floor(
                    queryMeta.totalResults / queryMeta.number
                  ) + 1}`}
                </Typography>
              </div>
              <Paper className={classes.gridPaper}>
                <Grid container spacing={3}>
                  {recipes.map(recipe => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                      <Card className={classes.card}>
                        <CardHeader
                          title={recipe.title}
                          subheader={`ready in ${recipe.readyInMinutes} mins, servings: ${recipe.servings}`}
                          action={
                            <IconButton
                              aria-label="show recipe detail"
                              onClick={this.requestRecipeDetail.bind(
                                this,
                                recipe.id
                              )}
                            >
                              <ChevronRightIcon />
                            </IconButton>
                          }
                        />
                        <CardMedia
                          className={classes.media}
                          image={`${queryMeta.baseUri}/${recipe.image}`}
                          title={recipe.title}
                        />
                        <CardContent></CardContent>
                        <CardActions>
                          {authenticated ? (
                            <IconButton
                              aria-label="add to favorites"
                              onClick={this.saveRecipe.bind(
                                this,
                                recipe.id,
                                recipe.title
                              )}
                            >
                              <FavoriteIcon />
                            </IconButton>
                          ) : (
                            <Link to="/">Login to Save Recipes</Link>
                          )}
                          <Button
                            variant="text"
                            aria-label="show recipe detail"
                            onClick={this.requestRecipeDetail.bind(
                              this,
                              recipe.id
                            )}
                          >
                            Get Full Recipe
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <div className={classes.paginationContainer}>
                  <IconButton
                    aria-label="show prev page of search results"
                    onClick={this.requestSearchResultsPageChange.bind(
                      this,
                      "prev"
                    )}
                    disabled={
                      !(searchListPagination && searchListPagination.prev)
                    }
                  >
                    <ChevronLeftIcon />
                    {` Prev Results`}
                  </IconButton>
                  <IconButton
                    aria-label="show next page of search results"
                    onClick={this.requestSearchResultsPageChange.bind(
                      this,
                      "next"
                    )}
                    disabled={
                      !(searchListPagination && searchListPagination.next)
                    }
                  >
                    {`Next Results `}
                    <ChevronRightIcon />
                  </IconButton>
                </div>
              </Paper>
            </>
          )
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.appData.auth.token,
  errorMessagePrimary: state.appState.primary.errorMessage,
  successDataRecipesSync: state.appState.recipesSync.successData,
  errorMessageRecipesSync: state.appState.recipesSync.errorMessage,

  searchData: state.appData.userData.recipes.current.list

  // userSettings: state.appData.userData.settings
});

const enhance = compose(
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, {
    requestRecipes: recipesActions.getRecipes,
    requestRecipeDetail: recipesActions.getRecipeDetail,
    handleSaveRecipe: recipesActions.saveRecipeToFavorites,

    setDateAndTimePickerUI: uiStateActions.setUIStateHelperTwo,
    clearSyncRecipesAppState: appStateActions.clearSyncRecipesAppState
  })
);

export default enhance(RecipeSnippets);
