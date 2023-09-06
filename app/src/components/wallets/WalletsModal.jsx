import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { SecondaryCloseIcon } from "../../assets";
import { IconButton as MUIconButton, Button, styled } from "@mui/material";
import { Modal } from "../UI/modal/Modal";
import { PinItem } from "../pins/PinItem";
import { IconButton } from "../UI/IconButton";
import { walletstore } from "../../walletstore";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import { stopIcon } from "../../assets";

export const WalletsModal = ({ isOpen, onClose }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};

  const [wallets, setWallets] = useState([]);
  const [currentWalletId, setCurrentWalletId] = useState("");

  const load = async () => {
    const r = await walletstore.listWallets();
    setCurrentWalletId(r.currentAlias || "");
    const wallets = Object.values(r).filter(v => typeof v === 'object');
    setWallets(wallets);
  };
  
  useEffect(() => {
    load ();
  }, [isOpen]);

  const onAdd = async () => {
    try {
      const r = await walletstore.addWallet();
      console.log("add result", JSON.stringify(r));
    } catch (e) {
      window.plugins.toast.showShortBottom(`Operation failed: ${e}`);      
    }
    load();
  };

  const onDelete = async (w) => {
    console.log("delete", w.id);
    const r = await walletstore.deleteWallet(w.id);
    console.log("delete result", JSON.stringify(r));
    load();
  };

  const onSelect = async (id) => {
    console.log("select", id);
    await walletstore.selectWallet(id);
    load();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Container>
	<header>
	  <h3>Wallets</h3>
	  <StyledIconButton onClick={onClose}>
	    <SecondaryCloseIcon />
	  </StyledIconButton>
	</header>
	<main>
	  <WalletsContainer>
	    {wallets.length > 0 && (
	      <>
		<h3>Current wallet:</h3>
		{!currentWalletId && (
		  <div style={{margin: "0.5rem 0 1rem 0"}}>
		    Select a wallet to make it current and accessible to apps. 
		  </div>
		)}
		{wallets.filter(w => w.id === currentWalletId).map(w => (
		  <List>
		    <ListItem
		      secondaryAction={
			<MUIconButton edge="end" aria-label="deselect" onClick={() => onSelect("")}>
			  <img src={stopIcon} width={"24px"} />
			</MUIconButton>
		      }
		    >
		      <ListItemText
			primary={w.name}
				secondary={w.relay}
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
		<h3>{currentWalletId ? "Other wallets" : "Your wallets"}:</h3>
		<List >
		  {!wallets.length && ("No wallets yet.")}
		  {wallets.length > 0 && wallets.filter(w => w.id !== currentWalletId).map(w => (
		    <ListItem
		      onClick={() => onSelect(w.id)}
		      secondaryAction={
			<MUIconButton edge="end" aria-label="delete" onClick={() => onDelete(w)}>
			  <img src={stopIcon} width={"24px"} />
			</MUIconButton>
		      }
		    >
		      <ListItemText
			primary={w.name}
				secondary={w.relay}
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
		  ))}
		</List>
	      </>
	    )}
	    <Button variant="contained" className="button" onClick={onAdd}>
	      Add wallet
	    </Button>
	  </WalletsContainer>
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

const WalletsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",

  "& .button": {
    background: "#363636",
    fontFamily: "inherit",
    fontSize: "17px",
    fontWeight: 600,
    textTransform: "initial",
    padding: "4px auto",
    borderRadius: "72px",
    minWidth: "115px",
    "&:hover, &:active": {
      background: "#363636",
    },
  }    
}));
