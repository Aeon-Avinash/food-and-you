import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import NutriSnippet from "../../nutrition_components/NutriSnippet/NutriSnippet";
import DialogModal from "../../../ui/DialogModal/DialogModal";
// import { resourceTypes } from "../../timeline_components/utils/constants";
// import MealPlanSnippet from "../../mealPlan_components/MealPlanSnippet/MealPlanSnippet";
import RecipeDetail from "../../recipe_components/RecipeDetail/RecipeDetail";

const useStyles = makeStyles(theme => ({
  rootDialogContent: {
    margin: 0,
    padding: theme.spacing(2)
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
    marginRight: 10
  }
}));

const RecipeTimelineSnippet = props => {
  const classes = useStyles();
  const {
    openRecipeModal,
    showRecipeModal,
    hideRecipeModal,
    currentTimelineRecipeDetail
  } = props;

  const recipeDetail =
    currentTimelineRecipeDetail && currentTimelineRecipeDetail.recipeDetail
      ? currentTimelineRecipeDetail.recipeDetail
      : currentTimelineRecipeDetail;

  const handleRequestEntryDetails = () => {
    // console.log(`Request Detailed Nutrition for ${props.recipeDetail.title}`);
    props.showDetailsModal();
    props.setSelectedSnippetData(recipeDetail);
  };

  return (
    <DialogModal
      openDialogModal={openRecipeModal}
      showDialogModal={showRecipeModal}
      hideDialogModal={hideRecipeModal}
      DialogTitleChildren={() => (
        <>
          <Typography gutterBottom className={classes.dialogTitle}>
            {recipeDetail && recipeDetail.title}
          </Typography>
        </>
      )}
      DialogContentChildren={() => (
        <div className={classes.rootDialogContent}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              {recipeDetail ? <RecipeDetail /> : null}
            </CardContent>
          </Card>
        </div>
      )}
      DialogActionChildren={() => (
        <>
          <Button
            className={classes.button}
            variant="contained"
            color="default"
            onClick={handleRequestEntryDetails}
          >
            View Detailed Nutrition Analysis
          </Button>
        </>
      )}
    />
  );
};

export default RecipeTimelineSnippet;
