import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { SecondaryCloseIcon } from "../../assets";
import { IconButton as MUIconButton, styled } from "@mui/material";
import { Modal } from "../UI/modal/Modal";
import { PinItem } from "../pins/PinItem";
import { IconButton } from "../UI/IconButton";

export const TabsModal = ({ isOpen, onClose }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace, getTab, onOpenTab, clearLastCurrentTab } = contextData || {};

  const onClick = (tab) => {
    // to make sure onClose doesn't re-open the calling tab
    clearLastCurrentTab();
    onClose();
    onOpenTab(tab);
  };

  if (!currentWorkspace)
    return;
  
  const tgs = Object.values(currentWorkspace.tabGroups).filter(tg => tg.tabs.length > 0);
  tgs.sort((a, b) => b.lastActive - a.lastActive);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Container>
	<header>
          <h3>Tabs</h3>
          <StyledIconButton onClick={onClose}>
            <SecondaryCloseIcon />
          </StyledIconButton>
	</header>
	<main>
	  {tgs.map(tg => {
	    const tabs = tg.tabs.map(id => getTab(id));
	    tabs.sort((a, b) => b.lastActive - a.lastActive);
	    
	    return (
	      <TabGroup key={tg.id}>
		<Title>
		  <IconButton
		    data={{ title: "", img: tg.info.icon }}
		    size="small"
		  />
		  
		  <div className="label">{tg.info.title}</div>
		</Title>
		<TabsContainer>
		  {tabs.map(tab => (
		    <Card key={tab.id} onClick={() => onClick(tab)}>
		      <img src={tab.screenshot || ""} alt={tab.title} width="150" />
		    </Card>
		  ))}
		</TabsContainer>
	      </TabGroup>
	    )
	  })}
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
    padding-bottom: 2rem;
  }
`;

const TabGroup = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  marginTop: "0.5rem",
}));


const Title = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  margin: "0.5rem 1rem",
  "& .label": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
    flexGrow: "1",
    marginLeft: "0.5rem",
    marginTop: "0.5rem",
    fontWeight: 600,
  }
}));
  
const TabsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
}));

// from TrendingProfileItem
const Card = styled("div")(() => ({
  padding: "0.75rem",
  borderRadius: "24px",
  backgroundColor: "#222222",
  minHeight: "170px",
  minWidth: "170px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  marginRight: "0.75rem",
  "&:first-of-type": {
    marginLeft: "0.75rem",
  },
  "& > img": {
    borderRadius: "1rem",
  },
}));

const StyledIconButton = styled(MUIconButton)(() => ({
  width: "44px",
  height: "44px",
  "&:hover": {
    backgroundColor: "rgba(251, 251, 251, 0.08)",
  },
}));
