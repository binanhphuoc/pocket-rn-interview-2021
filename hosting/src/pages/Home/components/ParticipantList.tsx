import { Badge } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    colorPrimary: {
      color: "#fff",
      backgroundColor: "#00cc00"
    }
  }),
);

type Props = {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    isOrganizer: boolean;
    decision: "accepted" | "maybe" | "declined";
  }[];
};

const ACCEPTED = "✓";
const DECLINED = "✗";

export default function ParticipantList(props: Props) {
  const classes = useStyles();
  const { data } = props;
  console.log(data);

  return (
    <List className={classes.root}>
      {data.map(({ email, isOrganizer, decision }) => (
        <ListItem key={email} alignItems="flex-start">
          <ListItemAvatar>
            <React.Fragment>
              { decision === "maybe" && <Avatar /> }
              { decision !== "maybe" && 
                <Badge 
                  badgeContent={decision === "accepted" ? ACCEPTED : DECLINED} 
                  color={decision === "accepted" ? "primary" : "secondary"}
                  classes={{
                    colorPrimary: classes.colorPrimary
                  }}
                >
                  <Avatar />
                </Badge> 
              }
            </React.Fragment>
          </ListItemAvatar>
          <ListItemText
            primary={email}
            secondary={
              <React.Fragment>
                {isOrganizer && "Organizer"}
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}