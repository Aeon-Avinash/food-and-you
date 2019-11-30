import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  nutritionSummary: {
    marginBottom: 10,
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    border: "1px solid #444444"
  },
  nutritionFactsTitle: {
    // fontSize: "",
    fontWeight: "bolder",
    letterSpacing: "0.1rem"
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
  alignLeft: {
    justifyContent: "flex-start"
  },
  alignRight: {
    justifyContent: "flex-end"
  },
  nestedList: {
    paddingTop: 0,
    paddingBottom: 0
  },
  nestedItem: {
    paddingLeft: "40px",
    paddingTop: 0,
    paddingBottom: 0
  },
  vitaminsList: {
    paddingTop: 0,
    paddingBottom: 0
  },
  vitaminsRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 0,
    paddingBottom: 0,
    position: "relative"
  },
  bullet: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    fontWeight: "bold"
  },
  genericItem: {
    paddingTop: 0,
    paddingBottom: 0
  },
  percentDaily: {
    textAlign: "center",
    paddingTop: 0,
    paddingBottom: 0
  },
  mediumDivider: {
    height: "5px"
  },
  thickDivider: {
    height: "10px"
  }
}));
const NutriDetails = ({ selectionData, selectedSnippetType }) => {
  const classes = useStyles();

  const notVitaminList = [
    "Calories",
    "Fat",
    "Saturated Fat",
    "Trans Fat",
    "Cholesterol",
    "Sodium",
    "Potassium",
    "Carbohydrates",
    "Fiber",
    "Sugar",
    "Protein"
  ];
  const vitaminList =
    selectionData &&
    Object.keys(selectionData.completeNutrition).reduce((acc, nutritionKey) => {
      if (!notVitaminList.includes(nutritionKey)) {
        acc.push(nutritionKey);
      }
      return acc;
    }, []);

  return (
    <Paper className={classes.nutritionSummary}>
      <Typography variant="h3" className={classes.nutritionFactsTitle}>
        Nutrition Facts
      </Typography>
      <List component="div" className={classes.mainNutrients}>
        <ListItem className={classes.genericItem}>
          <Typography
            variant="body2"
            display="inline"
            className={classes.colorTextSecondary}
            color="textSecondary"
          >
            {(selectedSnippetType === "ENTRIES" &&
              "Serving Size: 1 Serving (360g)") ||
              (selectedSnippetType === "DAYS" &&
                `Number of Entries: ${selectionData.numEntries}`)}
          </Typography>
        </ListItem>
        <Divider className={classes.thickDivider} />
        <ListItem
          divider
          className={clsx(classes.alignLeft, classes.genericItem)}
        >
          <Typography
            variant="caption"
            display="inline"
            className={classes.colorTextPrimary}
            color="textPrimary"
          >
            Amount Per Serving
          </Typography>
        </ListItem>
        <ListItem className={classes.nutrientRow}>
          <div>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextPrimary}
              color="textPrimary"
            >
              {"Calories "}
            </Typography>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextSecondary}
              color="textSecondary"
            >
              {selectionData.ENERC_KCAL.toFixed(2)}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              display="inline"
              color="textSecondary"
              className={clsx(classes.alignRight, classes.colorTextSecondary)}
            >
              Calories from Fat{" "}
              {(
                (selectionData.percentFat / 100) *
                selectionData.ENERC_KCAL
              ).toFixed(2)}
            </Typography>
          </div>
        </ListItem>
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
            % Daily Value*
          </Typography>
        </ListItem>
        <ListItem divider className={classes.nutrientRow}>
          <div>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextPrimary}
              color="textPrimary"
            >
              {"Total Fat "}
            </Typography>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextSecondary}
              color="textSecondary"
            >
              {selectionData.completeNutrition.Fat
                ? selectionData.completeNutrition.Fat.amount
                : 0}
              {selectionData.completeNutrition.Fat
                ? selectionData.completeNutrition.Fat.unit
                : "g"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              display="inline"
              color="textPrimary"
              className={clsx(classes.alignRight, classes.colorTextPrimary)}
            >
              {selectionData.completeNutrition.Fat ? (
                <>
                  {selectionData.completeNutrition.Fat.percentOfDailyNeeds}
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.colorTextSecondary}
                    color="textSecondary"
                  >
                    %
                  </Typography>
                </>
              ) : null}
            </Typography>
          </div>
        </ListItem>
        <List className={classes.nestedList}>
          <ListItem
            className={clsx(classes.nestedItem, classes.nutrientRow)}
            divider
          >
            <div>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {"Saturated Fat "}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {selectionData.completeNutrition["Saturated Fat"]
                  ? selectionData.completeNutrition["Saturated Fat"].amount
                  : 0}
                {selectionData.completeNutrition["Saturated Fat"]
                  ? selectionData.completeNutrition["Saturated Fat"].unit
                  : "g"}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                display="inline"
                color="textPrimary"
                className={clsx(classes.alignRight, classes.colorTextPrimary)}
              >
                {selectionData.completeNutrition["Saturated Fat"] ? (
                  <>
                    {
                      selectionData.completeNutrition["Saturated Fat"]
                        .percentOfDailyNeeds
                    }
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.colorTextSecondary}
                      color="textSecondary"
                    >
                      %
                    </Typography>
                  </>
                ) : null}
              </Typography>
            </div>
          </ListItem>
          <ListItem
            className={clsx(classes.nestedItem, classes.nutrientRow)}
            divider
          >
            <div>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {"Trans Fat "}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {selectionData.completeNutrition["Trans Fat"]
                  ? selectionData.completeNutrition["Trans Fat"].amount
                  : 0}
                {selectionData.completeNutrition["Trans Fat"]
                  ? selectionData.completeNutrition["Trans Fat"].unit
                  : "g"}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                display="inline"
                color="textPrimary"
                className={clsx(classes.alignRight, classes.colorTextPrimary)}
              >
                {selectionData.completeNutrition["Trans Fat"] ? (
                  <>
                    {
                      selectionData.completeNutrition["Trans Fat"]
                        .percentOfDailyNeeds
                    }
                    `
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.colorTextSecondary}
                      color="textSecondary"
                    >
                      %
                    </Typography>
                  </>
                ) : null}
              </Typography>
            </div>
          </ListItem>
        </List>
        <ListItem divider className={classes.nutrientRow}>
          <div>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextPrimary}
              color="textPrimary"
            >
              {"Cholesterol "}
            </Typography>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextSecondary}
              color="textSecondary"
            >
              {selectionData.completeNutrition.Cholesterol
                ? selectionData.completeNutrition.Cholesterol.amount
                : 0}
              {selectionData.completeNutrition.Cholesterol
                ? selectionData.completeNutrition.Cholesterol.unit
                : "mg"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              display="inline"
              color="textPrimary"
              className={clsx(classes.alignRight, classes.colorTextPrimary)}
            >
              {selectionData.completeNutrition.Cholesterol ? (
                <>
                  {
                    selectionData.completeNutrition.Cholesterol
                      .percentOfDailyNeeds
                  }
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.colorTextSecondary}
                    color="textSecondary"
                  >
                    %
                  </Typography>
                </>
              ) : null}
            </Typography>
          </div>
        </ListItem>
        <ListItem divider className={classes.nutrientRow}>
          <div>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextPrimary}
              color="textPrimary"
            >
              {"Sodium "}
            </Typography>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextSecondary}
              color="textSecondary"
            >
              {selectionData.completeNutrition.Sodium
                ? selectionData.completeNutrition.Sodium.amount
                : 0}
              {selectionData.completeNutrition.Sodium
                ? selectionData.completeNutrition.Sodium.unit
                : "mg"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              display="inline"
              color="textPrimary"
              className={clsx(classes.alignRight, classes.colorTextPrimary)}
            >
              {selectionData.completeNutrition.Sodium ? (
                <>
                  {selectionData.completeNutrition.Sodium.percentOfDailyNeeds}
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.colorTextSecondary}
                    color="textSecondary"
                  >
                    %
                  </Typography>
                </>
              ) : null}
            </Typography>
          </div>
        </ListItem>
        <ListItem divider className={classes.nutrientRow}>
          <div>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextPrimary}
              color="textPrimary"
            >
              {"Potassium "}
            </Typography>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextSecondary}
              color="textSecondary"
            >
              {selectionData.completeNutrition.Potassium
                ? selectionData.completeNutrition.Potassium.amount
                : 0}
              {selectionData.completeNutrition.Potassium
                ? selectionData.completeNutrition.Potassium.unit
                : "mg"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              display="inline"
              color="textPrimary"
              className={clsx(classes.alignRight, classes.colorTextPrimary)}
            >
              {selectionData.completeNutrition.Potassium ? (
                <>
                  {
                    selectionData.completeNutrition.Potassium
                      .percentOfDailyNeeds
                  }
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.colorTextSecondary}
                    color="textSecondary"
                  >
                    %
                  </Typography>
                </>
              ) : null}
            </Typography>
          </div>
        </ListItem>
        <ListItem divider className={classes.nutrientRow}>
          <div>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextPrimary}
              color="textPrimary"
            >
              {"Total Carbohydrate "}
            </Typography>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextSecondary}
              color="textSecondary"
            >
              {selectionData.completeNutrition.Carbohydrates
                ? selectionData.completeNutrition.Carbohydrates.amount
                : 0}
              {selectionData.completeNutrition.Carbohydrates
                ? selectionData.completeNutrition.Carbohydrates.unit
                : "mg"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              display="inline"
              color="textPrimary"
              className={clsx(classes.alignRight, classes.colorTextPrimary)}
            >
              {selectionData.completeNutrition.Carbohydrates ? (
                <>
                  {
                    selectionData.completeNutrition.Carbohydrates
                      .percentOfDailyNeeds
                  }
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.colorTextSecondary}
                    color="textSecondary"
                  >
                    %
                  </Typography>
                </>
              ) : null}
            </Typography>
          </div>
        </ListItem>
        <List className={classes.nestedList}>
          <ListItem
            className={clsx(classes.nestedItem, classes.nutrientRow)}
            divider
          >
            <div>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {"Dietary Fiber "}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {selectionData.completeNutrition.Fiber
                  ? selectionData.completeNutrition.Fiber.amount
                  : 0}
                {selectionData.completeNutrition.Fiber
                  ? selectionData.completeNutrition.Fiber.unit
                  : "g"}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                display="inline"
                color="textPrimary"
                className={clsx(classes.alignRight, classes.colorTextPrimary)}
              >
                {selectionData.completeNutrition.Fiber ? (
                  <>
                    {selectionData.completeNutrition.Fiber.percentOfDailyNeeds}
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.colorTextSecondary}
                      color="textSecondary"
                    >
                      %
                    </Typography>
                  </>
                ) : null}
              </Typography>
            </div>
          </ListItem>
          <ListItem
            className={clsx(classes.nestedItem, classes.nutrientRow)}
            divider
          >
            <div>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {"Sugars "}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {selectionData.completeNutrition.Sugar
                  ? selectionData.completeNutrition.Sugar.amount
                  : 0}
                {selectionData.completeNutrition.Sugar
                  ? selectionData.completeNutrition.Sugar.unit
                  : "g"}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                display="inline"
                color="textPrimary"
                className={clsx(classes.alignRight, classes.colorTextPrimary)}
              >
                {selectionData.completeNutrition.Sugar ? (
                  <>
                    {selectionData.completeNutrition.Sugar.percentOfDailyNeeds}
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.colorTextSecondary}
                      color="textSecondary"
                    >
                      %
                    </Typography>
                  </>
                ) : null}
              </Typography>
            </div>
          </ListItem>
        </List>
        <ListItem divider className={classes.nutrientRow}>
          <div>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextPrimary}
              color="textPrimary"
            >
              {"Protein "}
            </Typography>
            <Typography
              variant="body2"
              display="inline"
              className={classes.colorTextSecondary}
              color="textSecondary"
            >
              {selectionData.completeNutrition.Protein
                ? selectionData.completeNutrition.Protein.amount
                : 0}
              {selectionData.completeNutrition.Protein
                ? selectionData.completeNutrition.Protein.unit
                : "g"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              display="inline"
              color="textPrimary"
              className={clsx(classes.alignRight, classes.colorTextPrimary)}
            >
              {selectionData.completeNutrition.Protein ? (
                <>
                  {selectionData.completeNutrition.Protein.percentOfDailyNeeds}
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.colorTextSecondary}
                    color="textSecondary"
                  >
                    %
                  </Typography>
                </>
              ) : null}
            </Typography>
          </div>
        </ListItem>
        <Divider className={classes.thickDivider} />
      </List>
      <List className={classes.vitaminsList}>
        {vitaminList.reduce((acc, vItem, index, vArr) => {
          let vitamin_1 = vItem;
          let vitamin_2 = vArr[index + 1];
          let vitaminRow = (
            <ListItem divider className={classes.vitaminsRow} key={vItem}>
              <Typography
                variant="caption"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {vitamin_1}{" "}
                {selectionData.completeNutrition[vitamin_1] ? (
                  <>
                    {
                      selectionData.completeNutrition[vitamin_1]
                        .percentOfDailyNeeds
                    }
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.colorTextSecondary}
                      color="textSecondary"
                    >
                      %
                    </Typography>
                  </>
                ) : null}
              </Typography>
              {vitamin_2 ? (
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.bullet}
                  color="textPrimary"
                >
                  &bull;
                </Typography>
              ) : null}

              <Typography
                variant="caption"
                display="inline"
                className={classes.colorTextSecondary}
                color="textSecondary"
              >
                {vitamin_2}{" "}
                {selectionData.completeNutrition[vitamin_2] ? (
                  <>
                    {
                      selectionData.completeNutrition[vitamin_2]
                        .percentOfDailyNeeds
                    }
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.colorTextSecondary}
                      color="textSecondary"
                    >
                      %
                    </Typography>
                  </>
                ) : null}
              </Typography>
            </ListItem>
          );
          acc.push(vitaminRow);
          vArr.splice(index + 1, 1);
          return acc;
        }, [])}
      </List>

      <Typography
        variant="caption"
        display="block"
        className={clsx(classes.percentDaily, classes.colorTextSecondary)}
        color="textSecondary"
      >
        * Percent Daily Values are based on a 2,000 calorie diet.
      </Typography>
    </Paper>
  );
};

export default NutriDetails;
