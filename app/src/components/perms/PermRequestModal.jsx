import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../../store/app-context";
import { SecondaryCloseIcon } from "../../assets";
import {
  IconButton as MUIconButton,
  Button,
  Switch,
  FormControlLabel,
  styled,
  Container,
  Avatar,
  Typography,
} from "@mui/material";
import { Modal } from "../UI/modal/Modal";

export const PermRequestModal = ({ isOpen, onClose }) => {
  const contextData = useContext(AppContext);
  const { currentPermRequest, getTab, replyCurrentPermRequest } =
    contextData || {};

  const [isRemember, setIsRemember] = useState(false);

  useEffect(() => {
    setIsRemember(false);
  }, [currentPermRequest]);

  const req = currentPermRequest;

  const tab = getTab(req?.tabId);

  const prepareLabelAndPayload = useCallback(() => {
    if (!req) {
      return {
        label: "",
        payload: "",
      };
    }
    const { perm, event, plainText, cipherText } = req || {};
    let label = "";
    let payload = null;
    if (perm === "pubkey") label = "Read your public key";
    else if (perm.startsWith("sign:")) {
      label = "Sign event of kind " + perm.split(":")[1] + ":";
      payload = JSON.stringify(event, null, 2);
    } else if (perm === "encrypt") {
      label = "Encrypt a message:";
      // FIXME add pubkey
      payload = plainText;
    } else if (perm === "decrypt") {
      label = "Decrypt a message:";
      // FIXME add pubkey
      payload = cipherText;
    }
    return { label, payload };
  }, [req]);

  const { label, payload } = prepareLabelAndPayload();

  const onDisallow = async () => {
    await replyCurrentPermRequest(false, isRemember);
  };

  const onAllow = async () => {
    await replyCurrentPermRequest(true, isRemember);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <StyledContainer>
        <StyledHeader>
          <h1>Permission request</h1>
          <StyledIconButton onClick={onClose}>
            <SecondaryCloseIcon />
          </StyledIconButton>
        </StyledHeader>
        {req && (
          <ContentWrapper>
            <AvatarContainer>
              <Avatar className="avatar" src={tab.icon || ""} />
              <Typography className="title" variant="h5">
                {tab.title}
              </Typography>
            </AvatarContainer>

            <RequestContainer>
              <h5>{label}</h5>
              <pre>{payload}</pre>
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={isRemember}
                    onChange={(e) => setIsRemember(e.target.checked)}
                  />
                }
                label="Remember, don't ask again"
                className="form_control"
              />
            </RequestContainer>

            <ButtonContainer>
              <Button
                variant="contained"
                className="button"
                onClick={onDisallow}
              >
                Disallow
              </Button>
              <Button
                variant="contained"
                className="button"
                color="success"
                onClick={onAllow}
              >
                Allow
              </Button>
            </ButtonContainer>
          </ContentWrapper>
        )}
      </StyledContainer>
    </Modal>
  );
};

const StyledContainer = styled(Container)(() => ({
  paddingTop: "6px",
  paddingBottom: "1rem",
  display: "flex",
  flexDirection: "column",
}));

const StyledHeader = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "2rem",
  h1: {
    fontWeight: 500,
    fontSize: "28px",
  },
}));

const ContentWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

const AvatarContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& .avatar": {
    width: 72,
    height: 72,
    borderRadius: "10px",
    marginBottom: "0.5rem",
  },
  "& .title": {
    fontFamily: "inherit",
  },
}));

const StyledIconButton = styled(MUIconButton)(() => ({
  width: "44px",
  height: "44px",
  "&:hover": {
    backgroundColor: "rgba(251, 251, 251, 0.08)",
  },
}));

const RequestContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  margin: "1rem 0",
  "& pre": {
    flexGrow: "1",
    maxWidth: "100%",
    minHeight: "10rem",
    maxHeight: "10rem",
    background: "#36363679",
    borderRadius: "6px",
    overflowY: "scroll",
  },
  "& .form_control": {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    marginLeft: "0",
    fontFamily: "inherit",
  },
}));

const ButtonContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  margin: "1rem 0",
  gap: "0.5rem",
  "& .button": {
    background: "#363636",
    fontFamily: "inherit",
    fontSize: "17px",
    fontWeight: 600,
    textTransform: "initial",
    padding: "4px auto",
    borderRadius: "72px",
    width: "50%",
    "&:active": {
      background: "#363636",
    },
  },
}));

const StyledSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#CF82FF" : "#CF82FF",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#CF82FF",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#363636",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
