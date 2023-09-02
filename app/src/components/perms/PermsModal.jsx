import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { SecondaryCloseIcon } from "../../assets";
import { IconButton as MUIconButton, Button, Switch, FormControlLabel, styled } from "@mui/material";
import { Modal } from "../UI/modal/Modal";
import { PinItem } from "../pins/PinItem";
import { IconButton } from "../UI/IconButton";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import { stopIcon } from "../../assets";

export const PermsModal = ({ isOpen, onClose }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace, apps: appList, deletePerms } = contextData || {};

  const perms = currentWorkspace?.perms || [];
  const apps = [...new Set(perms.map(p => p.app))].map(id => {
    const app = appList.find(app => app.naddr === id);
    console.log("app", id, app);
    let title = app?.name || id;
    try {
      const U = new URL(id);
      title = U.hostname.startsWith("www.")
            ? U.hostname.substring(4)
            : U.hostname;
    } catch {}
    
    return {
      id,
      title,
      icon: app?.picture,
      naddr: app?.naddr,
      perms: perms.filter(p => p.app === id),
    }
  });

  console.log("perm apps", apps);

  const onDeleteAppPerms = (a) => {
    deletePerms(a.id);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Container>
	<header>
	  <h3>App permissions</h3>
	  <StyledIconButton onClick={onClose}>
	    <SecondaryCloseIcon />
	  </StyledIconButton>
	</header>
	<main>
	  {!perms.length && ("No permissions given yet.")}
	  {perms.length > 0 && (
	    <PermsContainer>
	      {apps.map(a => (
		<List >
		  <ListItem
		    secondaryAction={
		      <MUIconButton edge="end" aria-label="delete" onClick={() => onDeleteAppPerms(a)}>
			<img src={stopIcon} width={"24px"} />
		      </MUIconButton>
		    }
		  >
		    <ListItemAvatar>
		      <Avatar src={a.icon}>
			{a.title[0].toUpperCase()}
		      </Avatar>
		    </ListItemAvatar>
		    <ListItemText
		      primary={a.title}
		      secondary={a.perms.length + " permissions"}
		      primaryTypographyProps={{
			overflow: "hidden",
			textOverflow: "ellipsis",
                      }}
		      secondaryTypographyProps={{
			color: "#fff",
			overflow: "hidden",
			textOverflow: "ellipsis",
                      }}
		    />
                  </ListItem>
		</List>
	      ))}
	    </PermsContainer>
	  )}
	</main>
      </Container>
    </Modal>
  );
};

const Container = styled("div")`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "main";

  & > header {
    grid-area: header;
    position: sticky;
    background: #000;
    z-index: 1199;
    top: 0;
    display: flex;
    flex-direction: row;

    & > h3 {
      margin-left: 1rem;
      margin-top: 0.3rem;
      flex-grow: 1;
    }
  }

  & > main {
    grid-area: main;
    overflow: scroll;
    max-height: 100%;
    padding: 1rem;
  }
`;

const StyledIconButton = styled(MUIconButton)(() => ({
  width: "44px",
  height: "44px",
  "&:hover": {
    backgroundColor: "rgba(251, 251, 251, 0.08)",
  },
}));

const PermsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));
