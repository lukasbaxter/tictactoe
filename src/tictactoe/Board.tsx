import styled from "styled-components";
import Tile from "./Tile";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { onValue, ref, set } from "firebase/database";

const BOARD = ["", "", "", "", "", "", "", "", ""];

const WIN_CONDITIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function boardWinner(board: string[]) {
  for (let i = 0; i < WIN_CONDITIONS.length; i++) {
    const [pos1, pos2, pos3] = WIN_CONDITIONS[i];
    const filledWithSymbol = checkAllSame(board, pos1, pos2, pos3);
    if (filledWithSymbol) {
      return {
        symbol: filledWithSymbol,
        index: i,
      };
    }
  }
  return false;
}

function checkFull(board: string[]) {
  console.log("checking", board);
  if (board.every(isFilled)) {
    console.log("stalemate");
  }
}

function isFilled(cell: string) {
  return cell !== "";
}

function checkAllSame(
  board: string[],
  pos1: number,
  pos2: number,
  pos3: number
) {
  if (board[pos1] === board[pos2] && board[pos2] === board[pos3]) {
    return board[pos1];
  }
  return false;
}

export default function Board(props: {
  user: string;
  playerId: string;
  gameID: string;
}) {
  const [board, setBoard] = useState(BOARD);
  const [turn, setTurn] = useState("");
  const [yourSymbol, setYourSymbol] = useState("");
  const [opponent, setOpponent] = useState("");
  const gameRef = ref(db, `/sessions/${props.gameID}`);
  const boardRef = ref(db, `/sessions/${props.gameID}/board`);
  const turnRef = ref(db, `/sessions/${props.gameID}/meta/turn`);

  useEffect(() => {
    onValue(gameRef, (snapshot) => {
      const game = snapshot.val();
      setBoard(game.board);
      console.log("got game", game, "props.playerId is", props.playerId);
      setYourSymbol(game.meta[props.playerId].symbol);
      setTurn(game.meta.turn);
      const opponentID = props.playerId === "player1" ? "player2" : "player1";
      setOpponent(game.meta[opponentID].username);
    });
  }, []);

  function newGame() {
    set(boardRef, BOARD);
  }

  function tileClicked(index: number) {
    const winner = boardWinner(board);
    if (winner) {
      return;
    }

    if (turn === props.playerId) {
      console.log("clicked", index);
      // 1. copy it
      const copy = board.slice();

      // 2. modify it
      copy[index] = yourSymbol;

      // 3. set it
      setBoard(copy);
      set(boardRef, copy);

      checkFull(copy);

      const nextPlayer = props.playerId === "player1" ? "player2" : "player1";
      set(turnRef, nextPlayer);
    }
  }
  const winner = boardWinner(board);
  let Strike = null;
  if (winner) {
    Strike = Strikes[winner.index];
  }
  const myTurn = turn === props.playerId;

  return (
    <Container>
      <Title>Tic Tac Toe</Title>

      <Wrapper>
        {/* if strike is true (&&) blah */}
        {Strike && <Strike />}

        <CellContainer>
          {board.map((symbol, index) => (
            <Tile
              key={index}
              onClick={() => tileClicked(index)}
              currentPlayer={yourSymbol}
              showGhost={!winner}
              symbol={symbol}
            />
          ))}
        </CellContainer>
      </Wrapper>

      <NameTag>Playing as: {props.user}</NameTag>
      <SymbolTag>Symbol: {yourSymbol}</SymbolTag>
      <TurnTag>Turn: {myTurn ? props.user : opponent}</TurnTag>

      <NewGame onClick={newGame}>New Game</NewGame>
    </Container>
  );
}

const NameTag = styled.h2`
  color: white;
`;
const SymbolTag = styled.h2`
  color: white;
`;
const TurnTag = styled.h2`
  color: white;
`;

const NewGame = styled.button``;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  position: relative;
`;

const CellContainer = styled.div`
  display: inline-grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 128px 128px 128px;
  grid-template-rows: 128px 128px 128px;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 4vh;
`;

const Strike = styled.div`
  position: absolute;
  height: 0px;
  border: 2px solid orange;
`;

const Strikes = [
  //---------------------------------- ROWS
  styled(Strike)`
    width: 100%;
    top: 64px;
  `,
  styled(Strike)`
    width: 100%;
    top: 192px;
  `,
  styled(Strike)`
    width: 100%;
    top: 320px;
  `,
  //---------------------------------- COLUMNS
  styled(Strike)`
    width: 100%;
    transform: translateX(-128px) translateY(-192px) rotate(90deg);
    transform-origin: bottom;
    bottom: 0;
  `,
  styled(Strike)`
    width: 100%;
    transform: translateY(-192px) rotate(90deg);
    transform-origin: bottom;
    bottom: 0;
  `,

  styled(Strike)`
    width: 100%;
    transform: translateX(128px) translateY(-192px) rotate(90deg);
    transform-origin: bottom;
    bottom: 0;
  `,

  //---------------------------------- DIAGONALS
  styled(Strike)`
    width: 140%;
    transform: translateX(0) translateY(-4px) rotate(45deg);
    transform-origin: top left;
  `,
  styled(Strike)`
    width: 140%;
    transform: translateX(-152px) translateY(-4px) rotate(-45deg);
    transform-origin: top right;
  `,
];
