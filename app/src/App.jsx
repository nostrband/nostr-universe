import { useState } from "react";
import { db } from "./db";
import { Header } from "./layout/Header";
import { TrendingProfiles } from "./components/trending-profiles/TrendingProfiles";
import { AppsList } from "./components/apps/AppsList";
import { Footer } from "./layout/Footer";
import { SearchModal } from "./components/search-modal/SearchModal";
import { EditKeyModal } from "./components/edit-key-modal/EditKeyModal";
import "./App.css";
import { PinAppModal } from "./components/pin-app-modal/PinAppModal";

const App = () => {
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const toggleSearchModalVisibility = () => {
    setIsSearchModalVisible((prevState) => !prevState);
  };

  const [isEditKeyModalVisible, setIsEditKeyModalVisible] = useState(false);
  const toggleEditKeyModalVisibility = () => {
    setIsEditKeyModalVisible((prevState) => !prevState);
  };

  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const togglePinModalVisibility = () => {
    setIsPinModalVisible((prevState) => !prevState);
  };

  return (
    <>
      <Header
        onOpenSearchModal={toggleSearchModalVisibility}
        onOpenEditKeyModal={toggleEditKeyModalVisibility}
      />
      <main>
        {false && <button onClick={() => db.delete()}>Delete DB</button>}

        <TrendingProfiles />

        {true && <AppsList />}

        <EditKeyModal
          isOpen={isEditKeyModalVisible}
          onClose={toggleEditKeyModalVisibility}
        />

        <SearchModal
          isOpen={isSearchModalVisible}
          onClose={toggleSearchModalVisibility}
        />

        <PinAppModal
          isOpen={isPinModalVisible}
          onClose={togglePinModalVisibility}
        />
      </main>
      <Footer onOpenPinModal={togglePinModalVisibility} />
    </>
  );
};

export default App;
