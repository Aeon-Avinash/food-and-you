import React from "react";
import { NavLink } from "react-router-dom";
import UserMetaData from "../UserMetaData/UserMetaData";
import NutritionHighlights from "../NutritionHighlights/NutritionHighlights";
import RecipeHighlights from "../RecipeHighlights/RecipeHighlights";
// import TrackerHighlights from "../TrackerHighlights/TrackerHighlights";
import TrackerHighlights from "../../tracker_components/RecentActivity/RecentActivity";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@mdi/react";
import {
  mdiNutrition,
  mdiChefHat,
  mdiCalendarClock,
  mdiSettings
} from "@mdi/js";

const useStyles = makeStyles(theme => ({
  dashboardRoot: {},
  navLinksContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  navLink: {
    textDecoration: "none !important"
  },
  navLinkContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  navLinkText: {
    textDecoration: "none !important",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main
    }
  }
}));

const Dashboard = props => {
  const classes = useStyles();
  return (
    <div className={classes.dashboardRoot}>
      <Paper component="nav" className={classes.navLinksContainer}>
        <NavLink exact to="/nutrition" className={classes.navLink}>
          <div className={classes.navLinkContent}>
            <Icon path={mdiNutrition} size={5} color="#888" />
            <Typography className={classes.navLinkText}>
              Get Nutrition
            </Typography>
          </div>
        </NavLink>
        <NavLink exact to="/recipes" className={classes.navLink}>
          <div className={classes.navLinkContent}>
            <Icon path={mdiChefHat} size={5} color="#888" />
            <Typography className={classes.navLinkText}>Get Recipes</Typography>
          </div>
        </NavLink>

        <NavLink exact to="/tracker" className={classes.navLink}>
          <div className={classes.navLinkContent}>
            <Icon path={mdiCalendarClock} size={5} color="#888" />
            <Typography className={classes.navLinkText}>Tracker</Typography>
          </div>
        </NavLink>
        <NavLink exact to="/settings" className={classes.navLink}>
          <div className={classes.navLinkContent}>
            <Icon path={mdiSettings} size={5} color="#888" />
            <Typography className={classes.navLinkText}>
              User Settings
            </Typography>
          </div>
        </NavLink>
      </Paper>

      <main>
        <TrackerHighlights
          history={props.history}
          trackerData={props.trackerData}
          allTrackers={props.allTrackers}
          trackerMetaInfo={props.trackerMetaInfo}
          trackerCalculations={props.trackerCalculations}
          setCurrentTimelineView={props.setCurrentTimelineView}
          setCurrentTimelineDate={props.setCurrentTimelineDate}
        />
        <NutritionHighlights
          history={props.history}
          recentSearches={props.savedNutrition.recentSearches}
          savedAnalysis={props.savedNutrition.savedAnalysis}
          getNutritionQuery={props.getNutritionQuery}
          showNutritionAnalysis={props.showNutritionAnalysis}
        />
        <RecipeHighlights
          history={props.history}
          recentSearches={props.savedRecipes.recentSearches}
          recentRecipes={props.savedRecipes.recentRecipes}
          favoriteRecipes={props.savedRecipes.favoriteRecipes}
          getRecipeSearch={props.getRecipeSearch}
          getRecipeDetail={props.getRecipeDetail}
        />
        <UserMetaData
          history={props.history}
          userMetaData={props.userMetaData}
        />
      </main>
      {/* {props.showNutritionDetail ? <></> : null} */}
    </div>
  );
};

export default Dashboard;
