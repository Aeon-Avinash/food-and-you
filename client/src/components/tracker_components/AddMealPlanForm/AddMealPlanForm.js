import React, { Component } from "react";
import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
import { compose } from "redux";
import clsx from "clsx";
// import { nutritionActions } from "../../../store/actions";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EntryModal from "../../../ui/DialogModal/DialogModal";
import SearchFormComp from "../../recipe_components/SearchForm/SearchForm";
import MealPlannerComp from "../../mealPlan_components/MealPlanner/MealPlanner";
import { resourceTypes } from "../../../helperData/constants";

const MealPlanner = withRouter(MealPlannerComp);
const SearchForm = withRouter(SearchFormComp);

const styles = theme => ({
  rootDialogContent: {
    margin: 0,
    padding: theme.spacing(2)
  },
  switchButton: {
    color: "#3174ad",
    "&:hover": {
      backgroundColor: "#3174ad",
      color: "#fff"
    }
  }
});

class AddMealPlanForm extends Component {
  componentWillUnmount = () => {
    console.log("AddMealPlanForm unmounting!");
  };

  requestSwitchEntryModalState = () => {
    this.props.switchAddEntryForm(
      this.props.targetEntrySlot,
      resourceTypes.dietEntry
    );
    this.props.setEntryModalState(resourceTypes.dietEntry);
  };

  render() {
    const {
      classes,
      openEntryModal,
      showEntryModal,
      hideEntryModal
      // entryModalState,
      // userSettings
    } = this.props;
    return (
      <EntryModal
        openDialogModal={openEntryModal}
        showDialogModal={showEntryModal}
        hideDialogModal={hideEntryModal}
        DialogTitleChildren={() => (
          <>
            <Typography gutterBottom className="dialogTitle">
              Add meal plan to your tracker
            </Typography>
          </>
        )}
        DialogContentChildren={() => (
          <div className={classes.rootDialogContent}>
            <SearchForm addRecipeToMealPlanner />
            <MealPlanner />
          </div>
        )}
        DialogActionChildren={() => (
          <Button
            className={clsx(classes.button, classes.switchButton)}
            variant="outlined"
            color="default"
            onClick={this.requestSwitchEntryModalState}
          >
            Switch to Diet Entry
          </Button>
        )}
      />
    );
  }
}

const enhance = compose(withRouter, withStyles(styles));

export default enhance(AddMealPlanForm);
