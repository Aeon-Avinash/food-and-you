import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  nutritionSummary: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "rgba(232, 223, 224, 0.64)"
  }
}));
const MealPlanSnippet = ({ entryData, daySummary }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.nutritionSummary}>
      <Typography variant="h6" gutterBottom>
        Meal Plan Highlights
      </Typography>
      <div>
        <Typography
          variant="h6"
          display="inline"
          color="textSecondary"
          gutterBottom
        >
          {"Meal Slot - "}
        </Typography>
        <Typography
          variant="h6"
          display="inline"
          color="textPrimary"
          gutterBottom
        >
          {!daySummary
            ? moment(entryData.start).format("ddd, hh:mm A")
            : "all day"}
        </Typography>
      </div>
      <div>
        <Typography
          variant="h6"
          display="inline"
          color="textSecondary"
          gutterBottom
        >
          {!daySummary ? "Recipe/Dish - " : null}
        </Typography>
        <Typography
          variant="h6"
          display="inline"
          color="textPrimary"
          gutterBottom
        >
          {entryData.mealRecipe || entryData.title}
        </Typography>
      </div>
      <div>
        <Typography
          variant="h6"
          display="inline"
          color="textSecondary"
          gutterBottom
        >
          {!daySummary ? "Meal" : "Total"}
          {" Calorie Count - "}
        </Typography>
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
          {" Cal"}
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
    </Paper>
  );
};

export default MealPlanSnippet;
