import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

import { get, ref, set, onDisconnect } from "firebase/database";
import { db } from "../firebaseConfig";

function login(username: string) {
  return new Promise((resolve) => {
    const statusRef = ref(db, `/status/${username}`);
    const waitingRef = ref(db, `/waiting/${username}`);
    get(statusRef).then((snapshot) => {
      const result = snapshot.val();
      if (!result || result.state === "offline") {
        onDisconnect(statusRef).set({ state: "offline" });
        onDisconnect(waitingRef).remove();
        set(statusRef, { state: "online" });

        resolve(true);
      }
      resolve(false);
    });
  });
}

export default function GetUser(props: {
  setPage: (page: string) => void;
  setUser: (user: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null); // Explicitly typing the ref

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus only if the ref is not null
    }
  }, []); // Runs once on mount

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function continueLogin() {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setError("");
    if (await login(username)) {
      props.setPage("waitingroom");
      props.setUser(username);
    } else {
      setError("Name is in use");
    }
  }

  return (
    <Container>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          continueLogin();
        }}
      >
        <InputContainer>
          <Input
            type="text"
            ref={inputRef}
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </InputContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
      <Button type="button" onClick={continueLogin}>
        Continue
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  height: 100vh;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 300px;
  border-bottom: 2px solid #ffffff30;
  margin-bottom: 20px;
`;

const Input = styled.input`
  border: none;
  background: none;
  outline: none;
  color: #ffffff;
  font-size: 28pt;
  text-align: center;
  width: 100%;
  caret-color: #ffffff;

  &::placeholder {
  }
`;

const Button = styled.button`
  background: none;
  border: 2px solid #ffffff;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 20px; /* Larger padding for better appearance */
  text-transform: uppercase; /* Optional styling for text */
  border-radius: 5px; /* Rounded corners for a modern look */
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  color: #ffffff;
  font-size: 14px;
  text-align: center; /* Center error messages */
`;
