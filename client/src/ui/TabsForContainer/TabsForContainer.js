import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const LinkTab = props => {
  const { to, type, onClick } = props;
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <RouterLink to={to} {...linkProps} ref={ref} />
      )),
    [to]
  );
  if (type === "button") {
    return <Tab onClick={onClick} {...props} />;
  } else {
    return <Tab wrapped component={renderLink} {...props} />;
  }
};

LinkTab.propTypes = {
  to: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func
};

const setTabToCurrentLocation = (currentLocation, children) => {
  const newLocationValue = children
    .map(child => child && child.props.to)
    .findIndex(path => path === currentLocation);
  return newLocationValue === -1 ? 0 : newLocationValue;
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const TabsForContainers = props => {
  const classes = useStyles();
  const { currentLocation, children } = props;
  const [value, setValue] = React.useState(0);
  const handleTabChange = (event, value) => {
    setValue(value);
  };

  const newValue = setTabToCurrentLocation(currentLocation, children);

  // console.log(value, newValue, currentLocation);

  if (
    (newValue !== 0 || currentLocation === "/tracker/timeline") &&
    value !== newValue
  ) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleTabChange}
          aria-label="container nav tabs"
        >
          {/* //* Tab Links from the Container */}
          {props.children.map(
            (childLink, index) =>
              childLink && (
                <LinkTab
                  to={childLink.props.to}
                  type={childLink.props.type}
                  onClick={childLink.props.onClick}
                  key={index}
                  label={childLink.props.children}
                  id={`nav-tab-${index}`}
                  aria-controls={`nav-tabpanel-${index}`}
                />
              )
          )}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default TabsForContainers;
