import React, { createContext, useEffect, useReducer, useState } from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import {
  GameMode,
  GameState,
  GridSize,
  MatchRecord,
  StartGameAction,
  Table,
  TableAction,
  Tile,
} from "./interfaces";
import {
  gridSizeToArray,
  numbersFromTiles,
  shuffleInPlace,
  tileArray,
} from "./utils";

// misc: add a "linear" gamemode, where numbers are in a 1x16 grid for example.
// misc: memory game modes animation is flawed in many ways, meybe revisit.
// misc: instead of making reverse a gamemode, add a direction setting.
// misc: refactor the gamemode code, try to decouple different gamemodes.
// misc: refactor in general.
// misc: make a state machine.
// misc: add special effect when pr is achieved.
// misc: add help features, accessibility features...
// misc: add indicator for the expected value.
// misc: add indicator for current game settings (grid size, gamemode etc).
// misc: make selected game settings buttons styled differently.
// misc: make selected game settings styled differently.
// misc: change mini icon

export const tableContext = createContext<Table | null>(null);
export const MatchesContext = createContext<MatchRecord[] | null>(null);
export const GridSizeContext = createContext<GridSize | null>(null);

export const matchesKey = "matches";
const getMatchesFromLocalStorage = (matchesKey: string): MatchRecord[] => {
  const matches = localStorage.getItem(matchesKey);
  if (matches === null) {
    localStorage.setItem(matchesKey, JSON.stringify([]));
    return [];
  }
  return JSON.parse(matches) as MatchRecord[];
};

const App = () => {
  const [matches, setMatches] = useState<MatchRecord[]>(() =>
    getMatchesFromLocalStorage(matchesKey)
  );
  const [roundStartTimestamp, setRoundStartTimestamp] = useState<
    number | undefined
  >();
  const [hidePanels, setHidePanels] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Vanilla);

  // // direction
  // const [gameState, setGameState] = useState<GameState>("NotStarted");
  // const [tiles, setNumbers] = useState<number[] | undefined>();
  // // don't know if i need grid size
  // const [gridSize, setGridSize] = useState<GridSize>(GridSize.Size4x4);
  // const [expectedNumber, setExpectedNumber] = useState<number>(
  //   Math.min(...gridSizeToArray(gridSize))
  // );

  const initializeTableState = (): Table => {
    const gridSize = GridSize.Size4x4;
    const tiles = tileArray(gridSize);
    const expectedNumber = Math.min(...numbersFromTiles(tiles));
    return {
      tiles: tiles,
      expectedNumber: expectedNumber,
      gridSize: gridSize,
      state: "NotStarted",
    };
  };

  const tableReducer = (tableState: Table, tableAction: TableAction): Table => {
    const { expectedNumber, tiles, state } = tableState;
    switch (tableAction.type) {
      case "Start":
        if (state !== "NotStarted") {
          break;
        }
        shuffleInPlace(tiles);
        return { ...tableState, state: "Playing", tiles: tiles };

      case "Restart":
        if (state !== "Completed") {
          break;
        }
        shuffleInPlace(tiles);
        return {
          ...tableState,
          tiles: tiles,
          state: "Playing",
          expectedNumber: Math.min(...numbersFromTiles(tiles)),
        };

      case "InputNumber":
        if (state !== "Playing") {
          break;
        }
        if (tableAction.inputtedNumber !== expectedNumber) {
          break;
        }
        // win condition
        // if (expectedNumber === Math.max(...tiles)) {
        if (tiles.every((tile) => tile.checked)) {
          return {
            ...tableState,
            state: "Completed",
            expectedNumber: expectedNumber + 1,
          };
        }
        // increment expected number when inputted correct number
        // make the corresponding tile checked
        const tile = tiles.find(
          (tile) => tile.value === tableAction.inputtedNumber
        );
        if (!tile)
          throw new Error("Failed to find inputted number, tile value match.");
        tile.checked = true;

        return {
          ...tableState,
          expectedNumber: expectedNumber + 1,
        };

      default:
        throw new Error("Unexpected table action.");
    }

    return tableState;
  };

  const [table, tableDispatch] = useReducer(
    tableReducer,
    initializeTableState()
  );

  const [roundStartTimestamp, matchRecordDispatch] = useReducer(
    matchRecordReducer,
    null
  );

  // const resetExpectedNumber = (): void => {
  //   // setExpectedNumber(Math.min(...gridSizeToArray(gridSize)));
  //   const orderedNumbers = gridSizeToArray(gridSize);
  //   switch (gameMode) {
  //     case GameMode.Vanilla:
  //     case GameMode.Reaction:
  //     case GameMode.Memory:
  //       setExpectedNumber(Math.min(...orderedNumbers));
  //       break;
  //     case GameMode.Reverse:
  //       setExpectedNumber(Math.max(...orderedNumbers));
  //       console.log(expectedNumber);
  //       break;
  //   }
  // };

  // const shuffleTable = (): void =>
  //   setNumbers(shuffleInPlace(gridSizeToArray(gridSize)));

  // const resetGame = (): void => {
  //   resetExpectedNumber();
  // };

  // const startGame = (): void => {
  //   resetGame();
  //   if (gameMode !== GameMode.Memory) {
  //     shuffleTable();
  //   }
  //   setGameState("Playing");
  //   setRoundStartTimestamp(new Date().getTime());
  // };

  // const endGame = (): void => {
  //   setGameState("Completed");
  //   if (!roundStartTimestamp)
  //     throw new Error("Round start time can't be undefined.");
  //   const temporaryRoundTime = new Date().getTime() - roundStartTimestamp;
  //   // setCurrentRoundTime(temporaryRoundTime);
  //   const record: MatchRecord = {
  //     durationInMilliseconds: temporaryRoundTime,
  //     gridSize: gridSize,
  //     gameMode: gameMode,
  //   };
  //   setMatches((previousMatches) => [...previousMatches, record]);
  // };

  // const handleStart = (): void => {
  //   if (gameMode === GameMode.Memory) {
  //     shuffleTable();
  //     setGameState("Countdown");
  //     setTimeout(() => {
  //       startGame();
  //     }, 3000);
  //     return;
  //   }
  //   startGame();
  // };

  const changeGameMode = (gameMode: GameMode): void => {
    setGameMode(gameMode);
  };

  useEffect(() => {
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  }, [matches]);

  return (
    <div className="App">
      <ControlPanel
        onStart={() => tableDispatch({ type: "Start" })}
        gameState={table.state}
        onExposePanels={() => setHidePanels(false)}
        onHidePanels={() => setHidePanels(true)}
        hidden={hidePanels}
        changeGameMode={changeGameMode}
      />
      <div className="tableContainer">
        <SchulteTable
          gameState={table.state}
          tiles={table.tiles}
          gridSize={table.gridSize}
          onStart={() => tableDispatch({ type: "Start" })}
          onNumberInput={(inputtedNumber: number) =>
            tableDispatch({
              type: "InputNumber",
              inputtedNumber: inputtedNumber,
            })
          }
        />
      </div>
      <GridSizeContext.Provider value={table.gridSize}>
        <MatchesContext.Provider value={matches}>
          <tableContext.Provider value={table}>
            <Statistics hidden={hidePanels} />
          </tableContext.Provider>
        </MatchesContext.Provider>
      </GridSizeContext.Provider>
    </div>
  );
};

export default App;
