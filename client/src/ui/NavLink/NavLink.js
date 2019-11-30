import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import UILink from "@material-ui/core/Link";

const NavLink = props => {
  const { children, to, className, activeClassName, exact } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <RouterNavLink
          to={to}
          activeClassName={activeClassName}
          exact={exact}
          {...linkProps}
          ref={ref}
        />
      )),
    [to, activeClassName, exact]
  );

  return (
    <UILink className={className} component={renderLink}>
      {children}
    </UILink>
  );
};

export default NavLink;
