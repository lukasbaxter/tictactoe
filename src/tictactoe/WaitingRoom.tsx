import { onValue, ref, set } from "firebase/database";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { db } from "../firebaseConfig";
import { v7 } from "uuid";
const EMPTY_BOARD = ["", "", "", "", "", "", "", "", ""];

export default function WaitingRoom(props: {
  user: string;
  setPage: (page: string) => void;
  setPlayerId: (playerId: string) => void;
  setGameID: (gameID: string) => void;
}) {
  const onceRef = useRef(false);
  useEffect(() => {
    if (onceRef.current) {
      return;
    }
    const playerListRef = ref(db, "/waiting");
    const playerRef = ref(db, `/waiting/${props.user}`);
    set(playerRef, true);
    onValue(playerListRef, (snapshot) => {
      const waiting = snapshot.val();
      if (!waiting) {
        return;
      }
      const players = Object.keys(waiting);
      players.sort();
      const waitingPlayers = players.filter(
        (player) => waiting[player] === true
      );
      const player1 = waitingPlayers[0];
      const player2 = waitingPlayers[1];

      if (player2) {
        console.log("2 players", player1, player2);
        if (player1 === props.user) {
          startGame(player1, player2);
          return;
        }
      }
      if (waiting[props.user] !== true) {
        props.setGameID(waiting[props.user]);
        props.setPlayerId("player2");
        props.setPage("board");
      }
    });

    onceRef.current = true;
  }, []);

  function startGame(player1: string, player2: string) {
    const gameID = v7();
    console.log(gameID);
    const gameRef = ref(db, `/sessions/${gameID}`);
    let player1Symbol = "O";
    let player2Symbol = "X";
    if (Math.random() > 0.5) {
      player1Symbol = "X";
      player2Symbol = "O";
    }

    const game = {
      board: EMPTY_BOARD,
      meta: {
        player1: { symbol: player1Symbol, username: player1 },
        player2: { symbol: player2Symbol, username: player2 },
        turn: "player1",
      },
    };
    set(gameRef, game);
    const player1Ref = ref(db, `/waiting/${player1}`);
    const player2Ref = ref(db, `/waiting/${player2}`);

    set(player1Ref, gameID);
    set(player2Ref, gameID);

    props.setGameID(gameID);
    props.setPlayerId("player1");
    props.setPage("board");
  }
  return (
    <Main>
      <Container>
        <Username>{props.user}</Username>
        <Activity>Waiting for opponent...</Activity>
      </Container>
    </Main>
  );
}
const Main = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;
const Username = styled.h1`
  color: white;
`;
const Activity = styled.h2`
  color: white;
`;
