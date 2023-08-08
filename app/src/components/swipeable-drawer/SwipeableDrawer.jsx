import React from "react";

import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Divider, SwipeableDrawer as MuiSwipeableDrawer } from "@mui/material";

const drawerBleeding = 78;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  background: "#000",
}));

const StyledBox = styled(Box)(({ theme }) => ({}));

const Puller = styled(Box)(() => ({
  width: "64px",
  height: 4,
  backgroundColor: " #FFFFFF26",
  borderRadius: 59,
  position: "absolute",
  top: 6,
  left: "calc(50% - 32px)",
}));

export const SwipeableDrawer = (props) => {
  const { window } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Temporary solution
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      {/* <CssBaseline /> */}
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(90% - ${drawerBleeding}px)`,
            overflow: "visible",
            background: "#111111",
          },
        }}
      />

      <MuiSwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={200}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: "2rem",
            borderTopRightRadius: "2rem",
            visibility: "visible",
            right: 0,
            left: 0,
            background: "#111111",
            height: `${drawerBleeding + 1}px`,
            boxShadow: "0px -4px 8px 0px #00000033",
          }}
        >
          <Puller />
        </StyledBox>
        {open && (
          <Divider
            sx={{ opacity: 1, borderColor: "#282828", borderWidth: "1px" }}
          />
        )}
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            overflow: "auto",
            background: "#111111",
            height: `100%`,
          }}
        >
          <Skeleton variant="rectangular" height="100%" />
        </StyledBox>
      </MuiSwipeableDrawer>
    </Root>
  );
};
