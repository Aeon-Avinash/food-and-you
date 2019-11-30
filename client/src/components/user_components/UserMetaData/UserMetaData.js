import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import DialogModal from "../../../ui/DialogModal/DialogModal";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: 0,
    paddingTop: 20,
    maxWidth: "100%",
    overflow: "visible"
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
    marginRight: 10,
    textTransform: "capitalize"
  }
}));

const UserMetaData = props => {
  const classes = useStyles();
  const { userMetaData, history } = props;

  // console.log(userMetaData);

  const shiftViewToUserSettings = settingkey => {
    history.push("/settings/metaData");
    // props.requestUpdateUserSettings(settingkey);
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        User Diet Info
      </Typography>
      <Grid container spacing={3} justify="space-around">
        <Grid item>
          <Card className={classes.card} raised>
            <CardHeader
              title={"Your diet profile"}
              subheader={`Accuracy helps with better analysis`}
            />
            <CardContent className={classes.CardContent}>
              <List component="div" className={classes.mainNutrients}>
                {Object.keys(userMetaData).map(
                  (metaKey, index) =>
                    metaKey !== "lastUpdated" && (
                      <ListItem
                        key={index}
                        className={classes.genericItem}
                        divider
                      >
                        <Button
                          variant="text"
                          onClick={shiftViewToUserSettings.bind(this, metaKey)}
                          className={classes.button}
                        >
                          <Typography variant="body2">
                            {userMetaData[metaKey]} -{" "}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                            {metaKey}
                          </Typography>
                        </Button>
                      </ListItem>
                    )
                )}
              </List>
              <Typography variant="subtitle2" color="textSecondary">
                {moment(userMetaData.lastUpdated).format("ddd, hA")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserMetaData;
