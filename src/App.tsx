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
} from "./interfaces";
import { gridSizeToArray, shuffleInPlace } from "./utils";

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

export const GameStateContext = createContext<GameState>("NotStarted");
export const MatchesContext = createContext<MatchRecord[]>([]);
export const SetMatchesContext = createContext<React.Dispatch<
  React.SetStateAction<MatchRecord[]>
> | null>(null);
export const GridSizeContext = createContext<GridSize>(GridSize.Size4x4);
export const GameModeContext = createContext<GameMode>(GameMode.Vanilla);

export const matchesKey = "matches";
const getMatchesFromLocalStorage = (): MatchRecord[] => {
  const matches = localStorage.getItem(matchesKey);
  if (matches === null) {
    localStorage.setItem(matchesKey, JSON.stringify([]));
    return [];
  }
  return JSON.parse(matches) as MatchRecord[];
};

const App = () => {
  const [matches, setMatches] = useState<MatchRecord[]>(
    getMatchesFromLocalStorage
  );
  const [roundStartTimestamp, setRoundStartTimestamp] = useState<
    number | undefined
  >();
  const [displayOnlyTable, setDisplayOnlyTable] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Vanilla);

  // // direction
  // const [gameState, setGameState] = useState<GameState>("NotStarted");
  // const [numbers, setNumbers] = useState<number[] | undefined>();
  // // don't know if i need grid size
  // const [gridSize, setGridSize] = useState<GridSize>(GridSize.Size4x4);
  // const [expectedNumber, setExpectedNumber] = useState<number>(
  //   Math.min(...gridSizeToArray(gridSize))
  // );

  const initializeTableState = (): Table => {
    const gridSize = GridSize.Size4x4;
    const numbers = gridSizeToArray(gridSize);
    const expectedNumber = Math.min(...numbers);
    return {
      numbers: numbers,
      expectedNumber: expectedNumber,
      gridSize: gridSize,
      state: "NotStarted",
    };
  };

  const tableReducer = (tableState: Table, tableAction: TableAction): Table => {
    const { expectedNumber, gridSize, numbers, state } = tableState;
    switch (tableAction.type) {
      case "Start":
        if (state === "Playing") {
          break;
        }
        return { ...tableState, state: "Playing" };

      case "Restart":
        if (state !== "Completed") {
          break;
        }
        shuffleInPlace(numbers);
        return {
          ...tableState,
          numbers: numbers,
          state: "Playing",
          expectedNumber: Math.min(...numbers),
        };

      case "InputNumber":
        if (state !== "Playing") {
          break;
        }
        if (tableAction.inputtedNumber !== expectedNumber) {
          break;
        }
        // win condition
        if (expectedNumber === Math.max(...numbers)) {
          return {
            ...tableState,
            state: "Completed",
            expectedNumber: expectedNumber + 1,
          };
        }
        // increment expected number when inputted correct number
        return {
          ...tableState,
          expectedNumber: expectedNumber + 1,
        };

      default:
        throw new Error("Unexpected table action.");
    }

    return tableState;
  };

  const [table, dispatch] = useReducer(tableReducer, initializeTableState());

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
        // gameState={gameState}
        // setGameState={setGameState}
        // handleStart={handleStart}
        // setGridSize={setGridSize}
        // resetGame={resetGame}
        onStart={() => dispatch({ type: "Start" })}
        setRoundStartTimestamp={setRoundStartTimestamp}
        setDisplayOnlyTable={setDisplayOnlyTable}
        hidden={displayOnlyTable}
        changeGameMode={changeGameMode}
      />
      <div className="tableContainer">
        <SchulteTable
          gameState={gameState}
          expectedNumber={expectedNumber}
          setExpectedNumber={setExpectedNumber}
          numbers={numbers}
          gridSize={gridSize}
          endGame={endGame}
          handleStart={handleStart}
          gameMode={gameMode}
        />
      </div>
      <GameModeContext.Provider value={gameMode}>
        <GridSizeContext.Provider value={gridSize}>
          <MatchesContext.Provider value={matches}>
            <SetMatchesContext.Provider value={setMatches}>
              <GameStateContext.Provider value={gameState}>
                <Statistics hidden={displayOnlyTable} />
              </GameStateContext.Provider>
            </SetMatchesContext.Provider>
          </MatchesContext.Provider>
        </GridSizeContext.Provider>
      </GameModeContext.Provider>
    </div>
  );
};

export default App;
