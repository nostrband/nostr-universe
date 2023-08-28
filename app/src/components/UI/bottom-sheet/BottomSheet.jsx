import { GlobalStyles } from "@mui/material";
import React, { useRef, useState } from "react";
import { BottomSheet as DefaultBottomSheet } from "react-spring-bottom-sheet";

import "react-spring-bottom-sheet/dist/style.css";

export const BottomSheet = () => {
  const [expandOnContentDrag, setExpandOnContentDrag] = useState(true);
  const focusRef = useRef();
  const sheetRef = useRef();

  console.log(sheetRef.current);
  return (
    <React.Fragment>
      <DefaultBottomSheet
        open
        skipInitialTransition
        //   sibling={<CloseExample className="z-10" />}
        ref={sheetRef}
        initialFocusRef={focusRef}
        defaultSnap={({ maxHeight }) => maxHeight / 10}
        snapPoints={({ maxHeight }) => [
          maxHeight - maxHeight / 10,
          maxHeight / 10,
          // maxHeight * 0.9,
        ]}
        expandOnContentDrag={expandOnContentDrag}
        //   onDismiss={() => setExpandOnContentDrag(false)}
        blocking={false}
        onSpringStart={() => console.log("SPRING START")}
        onSpringEnd={() => console.log("SPRING END")}
        onSpringCancel={() => console.log("SPRING CANCEL")}
        scrollLocking
      >
        <div
          onTouchMove={() => setExpandOnContentDrag(false)}
          style={{ color: "black" }}
        >
          smooth-scroll-into-view-if-needed'
        </div>
      </DefaultBottomSheet>

      <GlobalStyles
        styles={{
          body: {
            overflow: expandOnContentDrag ? "auto !important" : "hidden",
          },
        }}
      />
    </React.Fragment>
  );
};
