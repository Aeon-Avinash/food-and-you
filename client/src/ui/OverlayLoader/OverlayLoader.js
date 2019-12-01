import React from "react";
import LoadingOverlay from "react-loading-overlay";
// import CircularProgress from "@material-ui/core/CircularProgress";
import MDSpinner from "react-md-spinner";

const OverlayLoader = ({ active, text, children }) => {
  return (
    <LoadingOverlay
      active={active}
      spinner={<MDSpinner size={50} />}
      text={text}
    >
      {children}
    </LoadingOverlay>
  );
};

export default OverlayLoader;
