import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { SecondaryCloseIcon } from "../../assets";
import {
  IconButton as MUIconButton,
  Button,
  Switch,
  FormControlLabel,
  styled,
  Container,
} from "@mui/material";
import { Modal } from "../UI/modal/Modal";
import { IconButton } from "../UI/IconButton";

export const PermRequestModal = ({ isOpen, onClose }) => {
  const contextData = useContext(AppContext);
  const { currentPermRequest, getTab, replyCurrentPermRequest } =
    contextData || {};

  const [isRemember, setIsRemember] = useState(false);

  useEffect(() => {
    setIsRemember(false);
  }, [currentPermRequest]);

  const req = currentPermRequest;
  console.log(req, JSON.stringify(req), "REQ IN PermRequestModal component");

  const tab = getTab(req?.tabId);

  let label = "";
  let payload = null;
  if (req?.perm === "pubkey") label = "Read your public key";
  else if (req?.perm.startsWith("sign:")) {
    label = "Sign event of kind " + req?.perm.split(":")[1];
    payload = JSON.stringify(req.event);
  } else if (req?.perm === "encrypt") {
    label = "Encrypt a message";
    // FIXME add pubkey
    payload = req.plainText;
  } else if (req?.perm === "decrypt") {
    label = "Decrypt a message";
    // FIXME add pubkey
    payload = req.cipherText;
  }

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
          <div>
            <center>
              <IconButton
                data={{ title: tab.title, img: tab.icon }}
                size="big"
              />
            </center>

            <RequestContainer>
              <h5>{label}</h5>
              <pre>{payload}</pre>

              <FormControlLabel
                control={
                  <Switch
                    checked={isRemember}
                    onChange={(e) => setIsRemember(e.target.checked)}
                  />
                }
                label="Remember, don't ask again"
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
          </div>
        )}
      </StyledContainer>
    </Modal>
  );
};

const StyledHeader = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  h1: {
    fontWeight: 500,
    fontSize: "28px",
  },
}));

const StyledContainer = styled(Container)(() => ({
  paddingTop: "6px",
  paddingBottom: "1rem",
  display: "flex",
  flexDirection: "column",
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
  margin: "1rem",
  "& pre": {
    flexGrow: "1",
    maxWidth: "100%",
    minHeight: "10rem",
    // FIXME make text wrap and add vertical scrolling
  },
}));

const ButtonContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  margin: "1rem",
  gap: "5px",

  "& .button": {
    background: "#363636",
    fontFamily: "inherit",
    fontSize: "17px",
    fontWeight: 600,
    textTransform: "initial",
    padding: "4px auto",
    borderRadius: "72px",
    width: "50%",
    "&:hover, &:active": {
      background: "#363636",
    },
  },
}));
