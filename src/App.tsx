import React, {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import {
  GameMode,
  GameState,
  GridSize,
  MatchRecord,
  MatchRecordAction,
  MemoryTableAction,
  StartGameAction,
  Table,
  TableAction,
  TableDirection,
  Tile,
} from "./interfaces";
import {
  findLastPlayedRecord,
  findPersonalBestRecord,
  findSettingSpecificMatches,
  gameModeToDisplay,
  gameStateToChronometerState,
  getExpectedNumberOfDirection,
  gridSizeToArray,
  gridSizeToDisplay,
  highestExpectedNumber,
  last,
  numbersFromTiles,
  progressedExpectedNumberWithDirection,
  shuffleInPlace,
  smallestExpectedNumber,
  tileArray,
} from "./utils";
import VanillaSchulteTable from "./components/VanillaSchulteTable";
import ReactionSchulteTable from "./components/ReactionSchulteTable";

// TODO: fix being able to change game mode while the game is ongoing.
// TODO: adjust css for mobile.
// TODO: add direction to mathecs info.
// TODO: consider getting rid of different reducers and hook them up
// with the vanilla reducer since all of them have the same logic.

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
// misc: change mini icon/favicon

export const matchesKey = "matches";
const getMatchesFromLocalStorage = (matchesKey: string): MatchRecord[] => {
  const matches = localStorage.getItem(matchesKey);
  if (matches === null) {
    localStorage.setItem(matchesKey, JSON.stringify([]));
    return [];
  }
  const unconstructed = JSON.parse(matches) as MatchRecord[];
  const constructed = unconstructed.map((match) => ({
    ...match,
    startTime: new Date(match.startTime),
  }));
  return constructed as MatchRecord[];
};

const App = () => {
  const [matches, setMatches] = useState<MatchRecord[]>(() =>
    getMatchesFromLocalStorage(matchesKey)
  );
  const [hidePanels, setHidePanels] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Vanilla);

  // TODO: come back to this
  const resetMatches = () => setMatches([]);

  // TODO: convert this to something else
  const matchRecordReducer = (
    roundStartTimestampState: null | Date,
    matchRecordAction: MatchRecordAction
  ): null | Date => {
    switch (matchRecordAction.type) {
      case "Mark":
        if (roundStartTimestampState)
          throw new Error(
            "Tried to mark start time when it was already marked."
          );
        return new Date();
      case "SaveRecord":
        if (!roundStartTimestampState)
          throw new Error("Tried to save record without marking.");
        setMatches([
          ...matches,
          {
            durationInMilliseconds:
              new Date().getTime() - roundStartTimestampState.getTime(),
            gameMode: gameMode,
            gridSize: matchRecordAction.tableSettings.gridSize,
            startTime: roundStartTimestampState,
            direction: matchRecordAction.tableSettings.direction,
          },
        ]);
        return null;
      default:
        throw new Error("Unexpected match record action.");
    }
  };

  const [roundStartTimestamp, matchRecordDispatch] = useReducer(
    matchRecordReducer,
    null
  );

  const initializeTableState = (
    gridSize: GridSize = GridSize.Size4x4,
    direction: TableDirection = "Ascending"
  ): Table => {
    // const gridSize = GridSize.Size4x4;
    const tiles = tileArray(gridSize);
    // const direction: TableDirection = "Ascending";
    const expectedNumber = getExpectedNumberOfDirection(direction, tiles);
    return {
      tiles: tiles,
      expectedNumber: expectedNumber,
      state: "NotStarted",
      settings: { direction: direction, gridSize: gridSize },
    };
  };

  const vanillaTableReducer = (
    tableState: Table,
    tableAction: TableAction
  ): Table => {
    const { expectedNumber, tiles, state, settings } = tableState;
    const { direction, gridSize } = settings;
    switch (tableAction.type) {
      case "Start":
        if (state !== "NotStarted") {
          break;
        }
        shuffleInPlace(tiles);
        matchRecordDispatch({ type: "Mark" });
        return {
          ...tableState,
          state: "Playing",
          tiles: tiles,
        };

      case "ChangeGridSize":
        if (!(state === "NotStarted" || state === "Completed")) {
          break;
        }
        return initializeTableState(tableAction.gridSize, direction);

      case "ChangeDirection":
        if (!(state === "NotStarted" || state === "Completed")) {
          break;
        }
        return initializeTableState(gridSize, tableAction.direction);

      case "Reset":
        if (state !== "Completed") {
          break;
        }
        return initializeTableState(gridSize, direction);

      case "Restart":
        if (state !== "Completed") {
          break;
        }
        const resettedTable = initializeTableState(gridSize, direction);
        shuffleInPlace(resettedTable.tiles);
        matchRecordDispatch({ type: "Mark" });
        return { ...resettedTable, state: "Playing" };

      case "InputNumber":
        if (state !== "Playing") {
          break;
        }
        if (tableAction.inputtedNumber !== expectedNumber) {
          break;
        }
        // win condition
        if (tiles.every((tile) => tile.checked)) {
          matchRecordDispatch({
            type: "SaveRecord",
            tableSettings: tableState.settings,
          });
          return {
            ...tableState,
            state: "Completed",
            expectedNumber: progressedExpectedNumberWithDirection(
              direction,
              expectedNumber
            ),
          };
        }
        // increment or decrement expected number when inputted correct number
        // based on direction
        // make the corresponding tile checked
        const tile = tiles.find(
          (tile) => tile.value === tableAction.inputtedNumber
        );
        if (!tile)
          throw new Error("Failed to find inputted number, tile value match.");
        tile.checked = true;

        const newExpectedNumber = progressedExpectedNumberWithDirection(
          direction,
          expectedNumber
        );
        return {
          ...tableState,
          expectedNumber: newExpectedNumber,
        };

      default:
        throw new Error("Unexpected table action.");
    }

    return tableState;
  };

  const memoryTableReducer = (
    tableState: Table,
    tableAction: MemoryTableAction
  ): Table => {
    const { expectedNumber, tiles, state, settings } = tableState;
    const { direction, gridSize } = settings;
    const countDownDurationInMilliseconds = 3000;
    switch (tableAction.type) {
      case "Start":
        if (state !== "Countdown") {
          throw new Error(
            "Start action on memory table reducer when state wasn't countdown."
          );
        }
        // shuffleInPlace(tiles);
        matchRecordDispatch({ type: "Mark" });
        return {
          ...tableState,
          state: "Playing",
          tiles: tiles,
        };

      case "StartCountDown":
        setTimeout(() => {
          console.log(tableState.state);
          startGame();
          console.log(tableState.state);
        }, countDownDurationInMilliseconds);
        shuffleInPlace(tiles);
        return { ...tableState, state: "Countdown" };

      case "ChangeGridSize":
        if (!(state === "NotStarted" || state === "Completed")) {
          break;
        }
        return initializeTableState(tableAction.gridSize, direction);

      case "ChangeDirection":
        if (!(state === "NotStarted" || state === "Completed")) {
          break;
        }
        return initializeTableState(gridSize, tableAction.direction);

      case "Reset":
        if (state !== "Completed") {
          break;
        }
        return initializeTableState(gridSize, direction);

      case "Restart":
        if (state !== "Completed") {
          break;
        }
        const resettedTable = initializeTableState(gridSize, direction);
        shuffleInPlace(resettedTable.tiles);
        matchRecordDispatch({ type: "Mark" });
        return { ...resettedTable, state: "Playing" };

      case "InputNumber":
        if (state !== "Playing") {
          break;
        }
        if (tableAction.inputtedNumber !== expectedNumber) {
          break;
        }
        // win condition
        if (tiles.every((tile) => tile.checked)) {
          matchRecordDispatch({
            type: "SaveRecord",
            tableSettings: tableState.settings,
          });
          return {
            ...tableState,
            state: "Completed",
            expectedNumber: progressedExpectedNumberWithDirection(
              direction,
              expectedNumber
            ),
          };
        }
        // increment or decrement expected number when inputted correct number
        // based on direction
        // make the corresponding tile checked
        const tile = tiles.find(
          (tile) => tile.value === tableAction.inputtedNumber
        );
        if (!tile)
          throw new Error("Failed to find inputted number, tile value match.");
        tile.checked = true;

        const newExpectedNumber = progressedExpectedNumberWithDirection(
          direction,
          expectedNumber
        );
        return {
          ...tableState,
          expectedNumber: newExpectedNumber,
        };

      default:
        throw new Error("Unexpected table action.");
    }

    return tableState;
  };

  const gameModeToTableReducer = (
    gameMode: GameMode
  ):
    | ((tableState: Table, tableAction: MemoryTableAction) => Table)
    | ((tableState: Table, tableAction: TableAction) => Table) => {
    switch (gameMode) {
      case GameMode.Vanilla:
      case GameMode.Reaction:
        return vanillaTableReducer;

      case GameMode.Memory:
        return memoryTableReducer;

      default:
        throw new Error("Unexpected game mode.");
    }
  };

  const [table, tableDispatch] = useReducer(
    gameModeToTableReducer(gameMode),
    initializeTableState()
  );

  function startGame() {
    tableDispatch({ type: "Start" });
  }

  const renderGameModeTable = (gameMode: GameMode) => {
    switch (gameMode) {
      case GameMode.Vanilla:
        return (
          <VanillaSchulteTable
            gameState={table.state}
            tiles={table.tiles}
            gridSize={table.settings.gridSize}
            onStart={() => tableDispatch({ type: "Start" })}
            onRestart={() => tableDispatch({ type: "Restart" })}
            onNumberInput={(inputtedNumber: number) =>
              tableDispatch({
                type: "InputNumber",
                inputtedNumber: inputtedNumber,
              })
            }
          />
        );

      case GameMode.Reaction:
        return (
          <ReactionSchulteTable
            gameState={table.state}
            tiles={table.tiles}
            gridSize={table.settings.gridSize}
            onStart={() => tableDispatch({ type: "Start" })}
            onRestart={() => tableDispatch({ type: "Restart" })}
            onNumberInput={(inputtedNumber: number) =>
              tableDispatch({
                type: "InputNumber",
                inputtedNumber: inputtedNumber,
              })
            }
            expectedNumber={table.expectedNumber}
          />
        );

      case GameMode.Memory:
        return (
          <VanillaSchulteTable
            gameState={table.state}
            tiles={table.tiles}
            gridSize={table.settings.gridSize}
            onStart={() => tableDispatch({ type: "StartCountDown" })}
            onRestart={() => tableDispatch({ type: "Restart" })}
            onNumberInput={(inputtedNumber: number) =>
              tableDispatch({
                type: "InputNumber",
                inputtedNumber: inputtedNumber,
              })
            }
          />
        );
    }
  };

  const changeGameMode = (gameMode: GameMode) => {
    if (table.state !== "NotStarted" && table.state !== "Completed") {
      return;
    }
    setGameMode(gameMode);
    tableDispatch({ type: "Reset" });
  };

  const changeGridSize = (gridSize: GridSize): void => {
    // setGridSize(gridSize);
    tableDispatch({ type: "ChangeGridSize", gridSize: gridSize });
  };

  const changeDirection = (direction: TableDirection): void => {
    tableDispatch({ type: "ChangeDirection", direction: direction });
  };

  // i can get rid of this
  useEffect(() => {
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  }, [matches]);

  const settingSpecificMatches = findSettingSpecificMatches(
    matches,
    table.settings.gridSize,
    gameMode,
    table.settings.direction
  );

  const lastPlayedRecord = findLastPlayedRecord(settingSpecificMatches);
  const personalBestRecord = findPersonalBestRecord(settingSpecificMatches);

  return (
    <div className="App">
      <ControlPanel
        onStart={() => tableDispatch({ type: "Start" })}
        onRestart={() => tableDispatch({ type: "Restart" })}
        gameState={table.state}
        onExposePanels={() => setHidePanels(false)}
        onHidePanels={() => setHidePanels(true)}
        hidden={hidePanels}
        onGridSizeChange={changeGridSize}
        onGameModeChange={changeGameMode}
        onDirectionChange={changeDirection}
      />

      <Statistics
        hidden={hidePanels}
        chronometerState={gameStateToChronometerState(table.state)}
        matchesInfoToDisplay={{
          lastPlayedRecord: lastPlayedRecord,
          personalBestRecord: personalBestRecord,
          recordCategoryToDisplay: `${gameModeToDisplay(
            gameMode
          )} ${gridSizeToDisplay(table.settings.gridSize)}`,
        }}
        onResetMatches={resetMatches}
      />

      <div className="tableContainer">{renderGameModeTable(gameMode)}</div>
    </div>
  );
};

export default App;
