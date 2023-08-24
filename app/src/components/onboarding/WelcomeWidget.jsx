import { Button, styled } from "@mui/material";
import { SectionTitle } from "../UI/SectionTitle";

export const WelcomeWidget = ({ onAdd, onImport }) => {
  
  return (
    <StyledSection>
      <SectionTitle color="#a3dfe8">Welcome, Guest!</SectionTitle>
      <Container>
	<Card>
	  <div>
	    This app works best if you log in.
	  </div>
	  <ButtonsContainer>
            <Button variant="contained" className="button" onClick={onImport}>
	      Login with npub
            </Button>
            <Button variant="contained" className="button" onClick={onAdd}>
	      Add keys
            </Button>
	  </ButtonsContainer>
	</Card>
      </Container>
    </StyledSection>
  );
};

const StyledSection = styled("section")(() => ({
  marginTop: "1rem",
  minHeight: "5rem",
}));

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  overflow: "scroll",
}));

const Card = styled("div")(() => ({
  padding: "0.5rem 0.75rem 0.75rem",
  borderRadius: "1rem",
  backgroundColor: "#222222",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginRight: "0.75rem",
  "&:first-of-type": {
    marginLeft: "0.75rem",
  },
  "& div": {
    marginBottom: "0.2rem",
  },
}));

const ButtonsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  gap: "4px",

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
  },
}));
