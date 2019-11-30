import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import clsx from "clsx";
import uuid from "uuid/v4";
import { makeStyles, useTheme, emphasize } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
// import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDownRounded";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    // height: 250,
    width: "auto",
    marginTop: 10,
    marginBottom: 0
  },
  input: {
    display: "flex",
    padding: 0,
    height: "auto"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    bottom: 6,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  }
}));

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * Props to be passed on to the wrapper.
   */
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ])
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps }
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  /**
   * Children to render.
   */
  children: PropTypes.node,
  /**
   * The mouse down event and the innerRef to pass down to the controller element.
   */
  innerProps: PropTypes.shape({
    onMouseDown: PropTypes.func.isRequired
  }).isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ]).isRequired,
  selectProps: PropTypes.object.isRequired
};

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    tabIndex: PropTypes.number.isRequired
  }).isRequired,
  /**
   * Inner ref to DOM Node
   */
  innerRef: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.any.isRequired
    })
  ]),
  /**
   * Whether the option is focused.
   */
  isFocused: PropTypes.bool.isRequired,
  /**
   * Whether the option is selected.
   */
  isSelected: PropTypes.bool.isRequired
};

function Placeholder(props) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
}

Placeholder.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
};

function SingleValue(props) {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography className={selectProps.classes.singleValue} {...innerProps}>
      {children}
    </Typography>
  );
}

SingleValue.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  /**
   * Props passed to the wrapping element for the group.
   */
  innerProps: PropTypes.any,
  selectProps: PropTypes.object.isRequired
};

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

MultiValue.propTypes = {
  children: PropTypes.node,
  isFocused: PropTypes.bool.isRequired,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onTouchEnd: PropTypes.func.isRequired
  }).isRequired,
  selectProps: PropTypes.object.isRequired
};

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired
};

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

Menu.propTypes = {
  /**
   * The children to be rendered.
   */
  children: PropTypes.element.isRequired,
  /**
   * Props to be passed to the menu wrapper.
   */
  innerProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  MultiValue,
  ValueContainer
  // DropdownIndicator: ArrowDropDownIcon
};

export default function IntegrationReactSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    id,
    name,
    label,
    options,
    value,
    updateSelection,
    isMulti,
    creatableSelect,
    createCustomOption,
    removeCustomOption
  } = props;
  const [single, setSingle] = React.useState(null);
  const [multi, setMulti] = React.useState(null);

  var creatableRef = React.useRef(null);

  const handleChangeSingle = val => {
    setSingle(val);
    updateSelection(val);
  };

  const handleChangeMulti = vals => {
    setMulti(vals);
    if (!vals) {
      updateSelection({ value: null, label, name });
    } else {
      let newOption, difference;
      if (creatableSelect) {
        // console.log({ vals });
        newOption = vals.find(
          val =>
            !options.map(option => option.value).includes(val.value) &&
            val.__isNew__
        );
        // console.log({ newOption });
        if (newOption) createCustomOption({ ...newOption, name, key: uuid() });

        let customOptions = options.filter(option => option.__isNew__);
        // console.log({ customOptions });
        if (!newOption && customOptions.length > 0) {
          difference = customOptions.find(
            opt => !vals.map(val => val.value).includes(opt.value)
          );
          // console.log({ difference });
          if (difference) removeCustomOption(difference);
        }
      }
      let multiValue = [];
      let multiLabel = [];
      vals.forEach(val => {
        multiValue.push(val.value);
        multiLabel.push(val.label);
      });
      updateSelection({ value: multiValue, label: multiLabel, name });
    }
  };

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };

  return !creatableSelect ? (
    <div className={classes.root}>
      <Select
        classes={classes}
        styles={selectStyles}
        inputId={id}
        name={name}
        TextFieldProps={{
          label: `${(isMulti ? multi : single) ? label : ""}`,
          InputLabelProps: {
            htmlFor: { id },
            shrink: true
          }
        }}
        noOptionsMessage={() => <span>Invalid</span>}
        backspaceRemovesValue
        placeholder={label}
        options={options}
        innerProps={{}}
        components={components}
        value={
          isMulti
            ? // multi ||
              options.filter(option => value && value.includes(option.value))
            : options.filter(option => option.value === value)
        }
        onChange={isMulti ? handleChangeMulti : handleChangeSingle}
        isMulti={isMulti}
      />
    </div>
  ) : (
    <div className={classes.root}>
      <CreatableSelect
        ref={creatableRef}
        classes={classes}
        styles={selectStyles}
        inputId={id}
        name={name}
        TextFieldProps={{
          label: `${(isMulti ? multi : single) ? label : ""}`,
          InputLabelProps: {
            htmlFor: { id },
            shrink: true
          }
        }}
        noOptionsMessage={() => <span>Invalid</span>}
        backspaceRemovesValue
        placeholder={label}
        options={options}
        innerProps={{}}
        components={components}
        value={
          isMulti
            ? // multi ||
              options.filter(option => value && value.includes(option.value))
            : options.filter(option => option.value === value)
        }
        onChange={isMulti ? handleChangeMulti : handleChangeSingle}
        isMulti={isMulti}
      />
    </div>
  );
}
