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
    zIndex: "100 !important",
    transition: "0.2s ease-out",
    "&:hover": {
      backgroundColor: "rgba(232, 223, 224, 0.96)",
      zIndex: "1 !important"
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

const NutritionHighlights = props => {
  const classes = useStyles();
  const {
    recentSearches,
    savedAnalysis,
    history,
    getNutritionQuery
    // showNutritionAnalysis
  } = props;

  // console.log({ recentSearches, savedAnalysis });

  const shiftViewToNutrition = query => {
    history.push("/nutrition/analysis");
    getNutritionQuery(query);
  };

  const getNutritionAnalysis = nutriAnalysis => {
    //* decide whether to redirect & fetch nutriiton data once again
    //* or show here the nutrition details Modal with the prefetched data

    history.push("/nutrition/analysis");
    getNutritionQuery(nutriAnalysis.parsedQuery || nutriAnalysis.title);
    // showNutritionAnalysis(nutriAnalysis);
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Nutrition Highlights
      </Typography>
      <Grid container spacing={3} justify="space-around">
        <Grid item>
          <Card className={classes.card} raised>
            <CardHeader
              title={"Saved Nutrition Analysis"}
              subheader={`What analysis have you recently saved`}
            />
            <CardContent className={classes.CardContent}>
              <List component="div" className={classes.mainNutrients}>
                {savedAnalysis
                  .sort((a, b) => moment(a.date).isBefore(b.date))
                  .filter((q, index) => index < 10)
                  .map((query, index) => (
                    <ListItem
                      key={`${query.parsedQuery || query.title}-${index}`}
                      className={classes.genericItem}
                      divider
                    >
                      <Button
                        variant="text"
                        onClick={getNutritionAnalysis.bind(this, query)}
                        className={classes.button}
                      >
                        <Typography variant="body2">
                          {query.parsedQuery || query.title} -{" "}
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
        <Grid item>
          <Card className={classes.card} raised>
            <CardHeader
              title={"Recent Nutrition Queries"}
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
                        onClick={shiftViewToNutrition.bind(this, query)}
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

export default NutritionHighlights;
