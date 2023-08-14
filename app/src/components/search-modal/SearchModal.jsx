import React, { useState } from "react";
import { Modal } from "../UI/modal/Modal";

import { BsArrowRightCircle } from "react-icons/bs";
import { IconButton, InputBase, styled } from "@mui/material";
import { Header } from "../../layout/Header";
import { SearchIcon } from "../../assets";

export const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    onSearch(searchValue);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} direction="left">
      <Container>
        <Header searchMode onClose={onClose} />
        <Form onSubmit={submitHandler}>
          <StyledInput
            placeholder="Search"
            endAdornment={<SearchIcon />}
            onChange={({ target }) => setSearchValue(target.value)}
            autoFocus={true}
            inputProps={{
              autoFocus: true,
            }}
          />
          <IconButton type="submit">
            <BsArrowRightCircle color="white" size={30} />
          </IconButton>
        </Form>
      </Container>
    </Modal>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

const Form = styled("form")(() => ({
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  padding: "0 1rem",
}));

const StyledInput = styled(InputBase)(() => ({
  background: "#222222",
  width: "100%",
  borderRadius: "16px",
  color: "#fff",
  fontFamily: "Outfit",
  fontSize: "16px",
  fontWeight: 400,
  padding: "11px 16px",
  "&:placeholder": {
    color: "#C9C9C9",
  },
  gap: "0.5rem",
}));
