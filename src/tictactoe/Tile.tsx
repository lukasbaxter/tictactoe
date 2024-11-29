import { useState } from "react";
import styled from "styled-components";

export default function Tile(props: {
  currentPlayer: string;
  symbol: string;
  onClick: () => void;
  showGhost: boolean;
}) {
  const [hovering, setHovering] = useState(false);

  const showGhost = hovering && !props.symbol && props.showGhost;
  const showActive = props.symbol;

  return (
    <TileWrapper>
      <Container
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={props.onClick}
      >
        {showGhost && <GhostSymbol>{props.currentPlayer}</GhostSymbol>}
        {showActive && <ActiveSymbol>{props.symbol}</ActiveSymbol>}
      </Container>
    </TileWrapper>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const GhostSymbol = styled.h1`
  color: #808080;
  cursor: default;
`;

const ActiveSymbol = styled.h1`
  color: white;
`;

const TileWrapper = styled.div`
  width: 128px;
  height: 128px;

  border: 3px solid transparent;
  border-radius: 6px;

  &:nth-child(-n + 3) {
    border-bottom-color: #0074a6;
  }
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    border-top-color: #0074a6;
    border-bottom-color: #0074a6;
  }
  &:nth-child(7),
  &:nth-child(8),
  &:nth-child(9) {
    border-top-color: #0074a6;
  }
  &:nth-child(3n + 1) {
    border-right-color: #0074a6;
  }
  &:nth-child(3n + 2) {
    border-right-color: #0074a6;
    border-left-color: #0074a6;
  }
  &:nth-child(3n + 3) {
    border-left-color: #0074a6;
  }
`;
