import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import NutriPieChart from "../NutriPieChart/NutriPieChart";
import NutriDetails from "../NutriDetails/NutriDetails";

const useStyles = makeStyles(theme => ({
  nutritionSummary: {
    marginBottom: 10,
    padding: "0, 10",
    backgroundColor: "rgba(232, 223, 224, 0.64)"
  },
  gridContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    margin: 0,
    padding: 0
  },
  snippetTextContainer: {
    // paddingLeft: 10
  },
  pieChartContainer: {
    maxWidth: 250,
    maxHeight: 250
  },
  nutritionDetailContainer: {}
}));
const NutriSnippet = ({ entryData, requestRecipeDetail }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.nutritionSummary}>
      <Grid container spacing={3} className={classes.gridContainer}>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant="h6" gutterBottom>
            Nutrition Anaysis Breakdown
          </Typography>
          <div className={classes.snippetTextContainer}>
            <Typography
              variant="h6"
              display="inline"
              color="textPrimary"
              gutterBottom
            >
              {Number(entryData.ENERC_KCAL).toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              display="inline"
              color="textSecondary"
              gutterBottom
            >
              {" Calories"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="h6"
              display="inline"
              color="textPrimary"
              gutterBottom
            >
              {Number(entryData.percentCarbs).toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              display="inline"
              color="textSecondary"
              gutterBottom
            >
              {" % Carbs"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="h6"
              display="inline"
              color="textPrimary"
              gutterBottom
            >
              {Number(entryData.percentFat).toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              display="inline"
              color="textSecondary"
              gutterBottom
            >
              {" % Fat"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="h6"
              display="inline"
              color="textPrimary"
              gutterBottom
            >
              {Number(entryData.percentProtein).toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              display="inline"
              color="textSecondary"
              gutterBottom
            >
              {" % Protein"}
            </Typography>
          </div>
          <div className={classes.pieChartContainer}>
            <NutriPieChart data={entryData} />
          </div>
          <Button
            className={classes.button}
            variant="contained"
            color="default"
            onClick={requestRecipeDetail}
          >
            View Detailed Recipe
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <div className={classes.nutritionDetailContainer}>
            <NutriDetails selectionData={entryData} />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NutriSnippet;
