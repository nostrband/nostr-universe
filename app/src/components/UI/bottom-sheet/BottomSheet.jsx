import { Backdrop, GlobalStyles, styled } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { BottomSheet as DefaultBottomSheet } from "react-spring-bottom-sheet";

import "react-spring-bottom-sheet/dist/style.css";
import { PinsList } from "../../pins/PinsList";
import { AppContext } from "../../../store/app-context";
import { PinItem } from "../../pins/PinItem";

export const BottomSheet = () => {
  const [expandOnContentDrag, setExpandOnContentDrag] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const focusRef = useRef();
  const sheetRef = useRef();
  const maxHeightRef = useRef();
  const minHeightRef = useRef();

  const contextData = useContext(AppContext);
  const { currentWorkspace, onOpenTabGroup } = contextData || {};
  const { tabGroups = {} } = currentWorkspace || {};
  const keys = Object.keys(tabGroups);

  return (
    <React.Fragment>
      <DefaultBottomSheet
        open
        skipInitialTransition
        ref={sheetRef}
        initialFocusRef={focusRef}
        sibling={
          <Backdrop
            open={isExpanded}
            onClick={() =>
              sheetRef.current.snapTo(({ snapPoints }) =>
                Math.min(...snapPoints)
              )
            }
            transitionDuration={0}
            sx={{ background: "transparent" }}
          />
        }
        defaultSnap={({ maxHeight }) => {
          return maxHeight / 10;
        }}
        snapPoints={({ maxHeight, minHeight }) => {
          minHeightRef.current = minHeight;
          maxHeightRef.current = Math.round(maxHeight - maxHeight / 10);
          return [maxHeight - maxHeight / 10, maxHeight / 10];
        }}
        expandOnContentDrag={expandOnContentDrag}
        blocking={false}
        onSpringStart={() => {
          if (sheetRef.current.height === maxHeightRef.current) {
            return setIsExpanded(false);
          }
          setIsExpanded(true);
        }}
        onSpringCancel={() => {
          if (sheetRef.current.height === maxHeightRef.current) {
            return setIsExpanded(true);
          }
          setIsExpanded(false);
        }}
        onSpringEnd={() => {
          if (sheetRef.current.height === maxHeightRef.current) {
            return setIsExpanded(true);
          }
          setIsExpanded(false);
        }}
        scrollLocking
        className="sheet"
      >
        <div onTouchMove={() => setExpandOnContentDrag(false)}>
          {!isExpanded && <PinsList drawerBleeding={minHeightRef.current} />}
          {isExpanded && (
            <TabsContainer length={Object.keys(tabGroups).length}>
              {keys.map((id) => {
                const tg = tabGroups[id];
                return (
                  <PinItem
                    key={tg.info.id}
                    image={tg.info.icon}
                    {...tg.info}
                    onClick={() => onOpenTabGroup(tg)}
                    withTitle
                    active={tg.tabs.length > 0}
                  />
                );
              })}
            </TabsContainer>
          )}
        </div>
      </DefaultBottomSheet>

      <GlobalStyles
        styles={{
          body: {
            overflow: isExpanded ? "hidden !important" : "auto !important",
          },
        }}
      />
    </React.Fragment>
  );
};

const TabsContainer = styled("div")(({ length }) => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fill, minmax(56px, 1fr))`,
  gap: "1rem",
  padding: "1rem",
  overflowY: "hidden",
  "& > .item": {
    width: "100%",
    minHeight: "56px",
  },
}));
