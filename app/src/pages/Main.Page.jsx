import React, { useState, useContext } from "react";
import { db } from "../db";
import { Header } from "../layout/Header";
import { TrendingProfiles } from "../components/trending-profiles/TrendingProfiles";
import { ContactList } from "../components/contact-list/ContactList";
import { AppsList } from "../components/apps/AppsList";
import { EditKeyModal } from "../components/edit-key-modal/EditKeyModal";
import { SearchModal } from "../components/search-modal/SearchModal";
import { PinAppModal } from "../components/pin-app-modal/PinAppModal";
import { EventAppsModal } from "../components/event-apps-modal/EventAppsModal";
import { TabMenuModal } from "../components/tab-menu-modal/TabMenuModal";
import { ContextMenuModal } from "../components/context-menu-modal/ContextMenuModal";
import { Footer } from "../layout/Footer";
import { styled } from "@mui/material";
import { AppContext } from "../store/app-context";
import { stringToBech32 } from "../nostr";
import { useSearchParams } from "react-router-dom";

const MainPage = () => {
  const contextData = useContext(AppContext);
  const {
    onOpenBlank,
    contextInput,
    setContextInput,
    clearLastCurrentTab,
    openAddr,
    setOpenAddr,
    updateLastContact
  } = contextData || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const isSearchModalVisible = Boolean(searchParams.get("search"));

  const toggleSearchModalVisibility = () => {
    if (!isSearchModalVisible) {
      searchParams.set("search", true);
      return setSearchParams(searchParams);
    }
    searchParams.delete("search");
    return setSearchParams(searchParams, { replace: true });
  };

  const [isEditKeyModalVisible, setIsEditKeyModalVisible] = useState(false);

  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const togglePinModalVisibility = () => {
    setIsPinModalVisible((prevState) => !prevState);
  };

  const onOpenedEvent = () => {
    setOpenAddr("");
  };

  const setContactOpenAddr = (addr) => {
    updateLastContact(addr);
    setOpenAddr(addr);
  };
  
  const [showTabMenu, setShowTabMenu] = useState(false);

  const onSearch = (str) => {

    clearLastCurrentTab();

    try {
      const url = new URL("/", str);
      if (url) {
	// need async launch to let the search modal close itself
	setTimeout(() => onOpenBlank({url: str}), 0);
	return true;
      }
    } catch {}
  
    const b32 = stringToBech32(str);
    if (b32) {
      setOpenAddr(b32);
      return true;
    }
    
    return false;
  };

  return (
    <Container>
      <Header
        onSearchClick={toggleSearchModalVisibility}
        onOpenEditKeyModal={() => setIsEditKeyModalVisible(true)}
        onOpenTabMenuModal={() => setShowTabMenu(true)}
      />
      <main>
        {false && <button onClick={() => db.delete()}>Delete DB</button>}

	<TrendingProfiles onOpenProfile={setOpenAddr} />

	<ContactList onOpenProfile={setContactOpenAddr} />

	{true && <AppsList />}

	<EditKeyModal
	  isOpen={isEditKeyModalVisible}
	  onClose={() => setIsEditKeyModalVisible(false)}
	/>

	<SearchModal
	  isOpen={isSearchModalVisible}
	  onSearch={onSearch}
	  onClose={toggleSearchModalVisibility}
	  onOpenEvent={setOpenAddr}
	  onOpenContact={setContactOpenAddr}
	/>

	<PinAppModal
	  isOpen={isPinModalVisible}
	  onClose={togglePinModalVisibility}
	/>

	<EventAppsModal
	  isOpen={openAddr != ""}
	  onClose={() => setOpenAddr("")}
	  addr={openAddr}
	  onSelect={onOpenedEvent}
	/>

	<TabMenuModal
	  isOpen={showTabMenu}
	  onClose={() => setShowTabMenu(false)}
	  onOpenWith={setOpenAddr}
	  onOpenPinAppModal={togglePinModalVisibility}
	/>

	<ContextMenuModal
	  isOpen={!!contextInput}
	  onClose={() => setContextInput("")}
	  input={contextInput}
	  onOpenWith={(id) => {
            setContextInput("");
            setTimeout(() => setOpenAddr(id), 0);
	  }}
	/>
      </main>

      <Footer onOpenPinModal={togglePinModalVisibility} />
    </Container>
  );
};

const Container = styled("div")`
  min-height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "main"
    "footer";

  & > header {
    grid-area: header;
  }

  & > main {
    grid-area: main;
    overflow: auto;
  }

  & > footer {
    grid-area: footer;
    overflow: auto;
    scrollbar-width: thin;
  }
`;

export default MainPage;
