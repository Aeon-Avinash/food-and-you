import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import DialogModal from "../../../ui/DialogModal/DialogModal";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: 0,
    paddingTop: 20,
    maxWidth: "100%",
    overflow: "visible"
  },
  card: {
    width: "100%",
    height: "100%",
    padding: 0,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    transition: "0.2s ease-out",
    "&:hover": {
      backgroundColor: "rgba(232, 223, 224, 0.96)"
    }
  },
  cardContent: {
    paddingTop: 2,
    paddingBottom: 4,
    marginBottom: 0
  },
  title: {
    fontSize: 14,
    marginTop: 0
  },
  cardActions: {
    paddingTop: 0,
    marginTop: 0
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
    textTransform: "capitalize"
  }
}));

const RecipeHighlights = props => {
  const classes = useStyles();
  const {
    favoriteRecipes,
    recentRecipes,
    recentSearches,
    history,
    getRecipeSearch,
    getRecipeDetail
  } = props;
  // console.log({ favoriteRecipes, recentRecipes, recentSearches });

  const shiftViewToRecipeSearch = searchQuery => {
    history.push("/recipes/recipeSnippets");
    getRecipeSearch(searchQuery);
  };

  const shiftViewToRecipeDetail = recipeId => {
    history.push("/recipes/recipeDetail");
    getRecipeDetail(recipeId);
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Recipe Highlights
      </Typography>
      <Grid container spacing={3} justify="space-around">
        <Grid item>
          <Card className={classes.card} raised>
            <CardHeader
              title={"Favorite Recipes"}
              subheader={`What have you saved as your favorites`}
            />
            <CardContent className={classes.CardContent}>
              <List component="div" className={classes.mainNutrients}>
                {favoriteRecipes
                  .sort((a, b) => moment(a.date).isBefore(b.date))
                  .filter((q, index) => index < 10)
                  .map((recipe, index) => (
                    <ListItem
                      key={`${recipe.recipeId}-${index}`}
                      className={classes.genericItem}
                      divider
                    >
                      <Button
                        variant="text"
                        onClick={shiftViewToRecipeDetail.bind(
                          this,
                          recipe.recipeId
                        )}
                        className={classes.button}
                      >
                        <Typography variant="body2">
                          {recipe.title} -{" "}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {moment(recipe.date).format("ddd, hA")}
                        </Typography>
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.card} raised>
            <CardHeader
              title={"Recent Full Recipes"}
              subheader={`Which full recipes have you recently visited`}
            />
            <CardContent className={classes.CardContent}>
              <List component="div" className={classes.mainNutrients}>
                {recentRecipes
                  .sort((a, b) => moment(a.date).isBefore(b.date))
                  .filter((q, index) => index < 10)
                  .map((recipe, index) => (
                    <ListItem
                      key={`${recipe.recipeId}-${index}`}
                      className={classes.genericItem}
                      divider
                    >
                      <Button
                        variant="text"
                        onClick={shiftViewToRecipeDetail.bind(
                          this,
                          recipe.recipeId
                        )}
                        className={classes.button}
                      >
                        <Typography variant="body2">
                          {recipe.title} -{" "}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {moment(recipe.date).format("ddd, hA")}
                        </Typography>
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.card} raised>
            <CardHeader
              title={"Recent Recipe Search Tags"}
              subheader={`What have you recently searched for`}
            />
            <CardContent className={classes.CardContent}>
              <List component="div" className={classes.mainNutrients}>
                {recentSearches
                  .sort((a, b) => moment(a.date).isBefore(b.date))
                  .filter((q, index) => index < 10)
                  .map((query, index) => (
                    <ListItem
                      key={`${query.searchQuery}-${index}`}
                      className={classes.genericItem}
                      divider
                    >
                      <Button
                        variant="text"
                        onClick={shiftViewToRecipeSearch.bind(this, query)}
                        className={classes.button}
                      >
                        <Typography variant="body2">
                          {query.searchQuery} -{" "}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {moment(query.date).format("ddd, hA")}
                        </Typography>
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecipeHighlights;
