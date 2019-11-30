import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
// import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
// import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeftTwoTone";
import ChevronRightIcon from "@material-ui/icons/ChevronRightTwoTone";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 20
  },
  recipeListHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline"
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
  },
  cardActions: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10
  }
});

class RecipeList extends Component {
  componentWillUnmount = () => {
    console.log("Recipe List unmounting!");
  };

  requestRecipeDetail = recipeId => {
    this.props.requestRecipeDetail(recipeId);
  };

  requestRecipeNutrition = recipeId => {
    this.props.requestRecipeNutrition(recipeId);
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
    const { classes, errorMessage, searchData } = this.props;

    let recipes, finalQuery, queryMeta, searchListPagination;
    if (searchData) {
      console.log(searchData);
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
        {!recipes && finalQuery && !errorMessage ? (
          <Typography variant="h5">{"Fetching your recipes..."}</Typography>
        ) : !recipes && errorMessage ? (
          <Typography variant="h5">{errorMessage}</Typography>
        ) : (
          recipes && (
            <>
              <div className={classes.recipeListHeader}>
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
                <Typography variant="h5" gutterBottom>
                  Recipe results {finalQuery && "for "}
                  <em>{finalQuery ? finalQuery.searchQuery : null}</em>
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {`Results page ${queryMeta.offset + 1}/${Math.floor(
                    queryMeta.totalResults / queryMeta.number
                  ) + 1}`}
                </Typography>
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
              <Paper className={classes.gridPaper}>
                <Grid container spacing={3}>
                  {recipes.map(recipe => (
                    <Grid item xs={4} sm={4} md={2} lg={1} key={recipe.id}>
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.media}
                          image={`${queryMeta.baseUri}/${recipe.image}`}
                          title={recipe.title}
                        />
                        <CardHeader
                          title={recipe.title}
                          titleTypographyProps={{ variant: "body2" }}
                          onClick={this.requestRecipeNutrition.bind(
                            this,
                            recipe.id
                          )}
                        />
                        <CardActions className={classes.cardActions}>
                          <Button
                            variant="text"
                            aria-label="Get recipe nutrition"
                            onClick={this.requestRecipeNutrition.bind(
                              this,
                              recipe.id
                            )}
                            size="small"
                          >
                            Get Nutrition
                          </Button>
                          <Button
                            variant="text"
                            aria-label="show recipe detail"
                            onClick={this.requestRecipeDetail.bind(
                              this,
                              recipe.id
                            )}
                            size="small"
                          >
                            Get Recipe
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </>
          )
        )}
      </div>
    );
  }
}

export default withStyles(styles)(RecipeList);
