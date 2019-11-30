import PropTypes from "prop-types";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import {
  resourceMap,
  resourceTitleAccessor
} from "../../../helperData/constants";

const useStyles = makeStyles(theme => ({
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(232, 223, 224, 0.64)",
    zIndex: "100 !important",
    transition: "0.3s",
    "&:hover": {
      backgroundColor: "rgba(135, 206, 250, 0.64)",
      zIndex: "1 !important"
    },
    boxSizing: "border-box",
    boxShadow: "16px 16px 16px 16px rgba(0, 0, 0, 0.2)"
  },
  cardContent: {
    padding: "0 !important",
    margin: 0,
    width: "100%"
  },
  headerColorMealPlan: {
    backgroundColor: "rgba(255, 225, 220, 0.96)"
  },
  headerColorDietEntry: {
    backgroundColor: "rgba(255, 245, 220, 0.96)"
  },
  headerBody: {
    lineHeight: 0.8,
    fontWeight: "normal"
  },
  headerLabel: {
    marginTop: 0,
    paddingTop: 10
  }
}));

const ResourceHeader = ({ label }) => {
  const classes = useStyles();
  const resourceLabels = resourceMap.map(res => res[resourceTitleAccessor]);
  return (
    <Card className={classes.card} raised>
      <CardContent
        className={clsx(
          classes.cardContent,
          resourceLabels[0] === label
            ? classes.headerColorMealPlan
            : classes.headerColorDietEntry
        )}
      >
        <Typography variant="caption">{label}</Typography>
      </CardContent>
    </Card>
  );
};

ResourceHeader.propTypes = {
  label: PropTypes.node,
  index: PropTypes.number,
  resource: PropTypes.object
};

export default ResourceHeader;
