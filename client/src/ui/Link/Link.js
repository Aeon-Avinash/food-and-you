import React from "react";
import { Link as RouterLink } from "react-router-dom";
import UILink from "@material-ui/core/Link";

const Link = props => {
  const { children, to, className } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <RouterLink to={to} {...linkProps} ref={ref} />
      )),
    [to]
  );

  return (
    <UILink className={className} component={renderLink}>
      {children}
    </UILink>
  );
};

export default Link;
