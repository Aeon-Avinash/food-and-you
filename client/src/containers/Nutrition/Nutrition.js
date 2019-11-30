import React, { Component } from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { compose } from "redux";
import { Switch, Route } from "react-router-dom";
// import { nutritionActions } from "../../store/actions";
import QueryForm from "../../components/nutrition_components/QueryForm/QueryFormAutoComplete";
import NutriAnalysis from "../../components/nutrition_components/NutriAnalysis/NutriAnalysis";

class Nutrition extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.errorMessageNutritionSync !==
        this.props.errorMessageNutritionSync &&
      this.props.errorMessageNutritionSync
    ) {
      this.props.enqueueSnackbar(this.props.errorMessageNutritionSync, {
        variant: "error"
      });
    }
  };

  render() {
    const { history, match, location } = this.props;
    const routeProps = { history, match, location };
    return (
      <div>
        <QueryForm
          // handleNutritionQuery={this.props.getNutrition}
          // clearCurrentNutritionData={this.props.clearCurrentNutritionData}
          pushHistoryToLocation={`${match.url}/analysis`}
          {...routeProps}
        />
        <Switch>
          <Route
            exact
            path={`${match.url}/analysis`}
            render={routeProps => <NutriAnalysis {...routeProps} />}
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errorMessageNutritionSync: state.appState.nutritionSync.errorMessage
});

const enhance = compose(
  withSnackbar,
  connect(mapStateToProps, {
    // getNutrition: nutritionActions.getNutrition,
    // clearCurrentNutritionData: nutritionActions.clearCurrentNutritionData
  })
);

export default enhance(Nutrition);
