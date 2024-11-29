import Board from "./tictactoe/Board";
import GetUser from "./tictactoe/GetUser";
import { useState } from "react";
import WaitingRoom from "./tictactoe/WaitingRoom";

export default function Tictactoe() {
  const [page, setPage] = useState("getuser");
  const [user, setUser] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [gameID, setGameID] = useState("");

  return (
    <>
      {page === "getuser" && <GetUser setUser={setUser} setPage={setPage} />}

      {page === "waitingroom" && (
        <WaitingRoom
          setGameID={setGameID}
          user={user}
          setPlayerId={setPlayerId}
          setPage={setPage}
        />
      )}

      {page === "board" && (
        <Board playerId={playerId} user={user} gameID={gameID} />
      )}
    </>
  );
}
