import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import {
  ControlPanelEventCallbacks,
  GameMode,
  GameState,
  GridSize,
  MatchRecord,
  MatchRecordAction,
  MemoryTable,
  MemoryTableAction,
  MemoryTile,
  Table,
  TableAction,
  TableDirection,
} from "./interfaces";
import {
  directionToDisplay,
  findLastPlayedRecord,
  findPersonalBestRecord,
  findSettingSpecificMatches,
  gameModeToDisplay,
  gameStateToChronometerState,
  getExpectedNumberOfDirection,
  gridSizeToDisplay,
  memoryTileArray,
  progressedExpectedNumberWithDirection,
  shuffleInPlace,
  tileArray,
} from "./utils";
import VanillaSchulteTable from "./components/VanillaSchulteTable";
import ReactionSchulteTable from "./components/ReactionSchulteTable";
import MemorySchulteTable from "./components/MemorySchulteTable";

// ideas:
//   add compensation (auto aim) for mobile use.
//   make animations more satisfying
//   display special effect when pr is achieved (confetti).

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

  const resetMatches = () => setMatches([]);

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
    const tiles = tileArray(gridSize);
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

        // win condition
        const everyTileIsChecked = tiles.every((tile) => tile.checked);
        if (everyTileIsChecked) {
          matchRecordDispatch({
            type: "SaveRecord",
            tableSettings: tableState.settings,
          });
          return {
            ...tableState,
            state: "Completed",
            expectedNumber: newExpectedNumber,
          };
        }

        return {
          ...tableState,
          expectedNumber: newExpectedNumber,
        };

      default:
        throw new Error("Unexpected table action.");
    }

    return tableState;
  };

  const initializeMemoryTableState = (
    gridSize: GridSize = GridSize.Size4x4,
    direction: TableDirection = "Ascending"
  ): MemoryTable => {
    const tiles = memoryTileArray(gridSize);
    const expectedNumber = getExpectedNumberOfDirection(direction, tiles);
    const state: GameState = "NotStarted";
    const memoryTable = {
      tiles: tiles,
      expectedNumber: expectedNumber,
      state: state,
      settings: { direction: direction, gridSize: gridSize },
    };
    return memoryTable;
  };

  const memoryTableReducer = (
    tableState: MemoryTable,
    tableAction: MemoryTableAction
  ): MemoryTable => {
    const { expectedNumber, tiles, state, settings } = tableState;
    const { direction, gridSize } = settings;
    switch (tableAction.type) {
      case "Start":
        if (state !== "Countdown") {
          throw new Error(
            "Start action on memory table reducer when state wasn't countdown."
          );
        }
        matchRecordDispatch({ type: "Mark" });
        return {
          ...tableState,
          state: "Playing",
        };

      case "StartCountDown":
        const initialMemoryTable = initializeMemoryTableState(
          gridSize,
          direction
        );
        shuffleInPlace(initialMemoryTable.tiles);
        return { ...initialMemoryTable, state: "Countdown" };

      case "ChangeGridSize":
        if (!(state === "NotStarted" || state === "Completed")) {
          break;
        }
        return initializeMemoryTableState(tableAction.gridSize, direction);

      case "ChangeDirection":
        if (!(state === "NotStarted" || state === "Completed")) {
          break;
        }
        return initializeMemoryTableState(gridSize, tableAction.direction);

      case "Reset":
        if (state !== "Completed") {
          break;
        }
        return initializeMemoryTableState(gridSize, direction);

      case "Restart":
        if (state !== "Completed") {
          break;
        }
        const resettedTable = initializeMemoryTableState(gridSize, direction);
        shuffleInPlace(resettedTable.tiles);
        return { ...resettedTable, state: "Countdown" };

      case "StopAnimation":
        const tileOfStopAnimation = tableState.tiles.find(
          (tile) => tile.value === tableAction.value
        );
        if (!tileOfStopAnimation) {
          throw new Error("tileOfStopAnimation must not be undefined.");
        }
        tileOfStopAnimation.animationPlaying = false;
        tileOfStopAnimation.timeoutId = undefined;
        return { ...tableState };

      case "InputNumber":
        if (state !== "Playing") {
          break;
        }
        // if the number is wrong, set tile animationIsPlaying to true
        if (tableAction.inputtedNumber !== expectedNumber) {
          const tileToBeAnimated = tableState.tiles.find(
            (tile) => tile.value === tableAction.inputtedNumber
          );
          if (!tileToBeAnimated) {
            throw new Error("tileToBeAnimated must not be undefined.");
          }
          tileToBeAnimated.animationPlaying = true;

          return { ...tableState };
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

        // win condition
        const everyTileIsChecked = tiles.every((tile) => tile.checked);
        if (everyTileIsChecked) {
          matchRecordDispatch({
            type: "SaveRecord",
            tableSettings: tableState.settings,
          });
          return {
            ...tableState,
            state: "Completed",
            expectedNumber: newExpectedNumber,
          };
        }

        return {
          ...tableState,
          expectedNumber: newExpectedNumber,
        };

      default:
        throw new Error("Unexpected table action.");
    }

    return tableState;
  };

  const gameModeToTableReducer = (gameMode: GameMode) => {
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

  const initializeTableWithGameMode = (
    gameMode: GameMode
  ): Table | MemoryTable => {
    switch (gameMode) {
      case GameMode.Vanilla:
      case GameMode.Reaction:
        return initializeTableState();

      case GameMode.Memory:
        return initializeMemoryTableState();

      default:
        throw new Error("Unexpected game mode.");
    }
  };

  const reducer = gameModeToTableReducer(gameMode);
  const initialTable = initializeTableWithGameMode(gameMode);

  const [table, tableDispatch] = useReducer(reducer, initialTable);

  // memory table animation controller
  useEffect(() => {
    if (gameMode === GameMode.Memory) {
      const memoryTiles = table.tiles as MemoryTile[];
      if (table.state !== "Playing") {
        // if the game isn't playing, clear animations.
        memoryTiles.forEach((tile) => {
          if (tile.timeoutId) {
            clearTimeout(tile.timeoutId);
          }
        });
      } else {
        memoryTiles.forEach((tile) => {
          if (tile.animationPlaying && !tile.timeoutId) {
            tile.timeoutId = setTimeout(() => {
              tableDispatch({ type: "StopAnimation", value: tile.value });
            }, 3000);
          }
        });
      }
    }
  }, [table, gameMode]);

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
          <MemorySchulteTable
            gameState={table.state}
            tiles={table.tiles as MemoryTile[]}
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
    tableDispatch({ type: "ChangeGridSize", gridSize: gridSize });
  };

  const changeDirection = (direction: TableDirection): void => {
    tableDispatch({ type: "ChangeDirection", direction: direction });
  };

  // to save match records to local storage.
  useEffect(() => {
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  }, [matches]);

  // to solve the problem of async dispatch to start the game in memory mode.
  useEffect(() => {
    if (table.state !== "Countdown") {
      return;
    }
    setTimeout(() => {
      tableDispatch({ type: "Start" });
    }, 3000);
  }, [table]);

  const settingSpecificMatches = findSettingSpecificMatches(
    matches,
    table.settings.gridSize,
    gameMode,
    table.settings.direction
  );

  const lastPlayedRecord = findLastPlayedRecord(settingSpecificMatches);
  const personalBestRecord = findPersonalBestRecord(settingSpecificMatches);

  const matchesInfoToDisplay = {
    lastPlayedRecord: lastPlayedRecord,
    personalBestRecord: personalBestRecord,
    recordCategoryToDisplay: `${gameModeToDisplay(
      gameMode
    )} ${gridSizeToDisplay(table.settings.gridSize)} ${directionToDisplay(
      table.settings.direction
    )}`,
  };

  const controlPanelEventCallbacks: ControlPanelEventCallbacks = {
    onExposePanels: () => setHidePanels(false),
    onHidePanels: () => setHidePanels(true),
    onGridSizeChange: changeGridSize,
    onGameModeChange: changeGameMode,
    onDirectionChange: changeDirection,
  };

  return (
    <div className={`App ${hidePanels ? "dimmed" : ""}`}>
      <ControlPanel
        gameState={table.state}
        tableSettings={table.settings}
        gameMode={gameMode}
        hidden={hidePanels}
        eventCallbacks={controlPanelEventCallbacks}
      />

      <Statistics
        hidden={hidePanels}
        chronometerState={gameStateToChronometerState(table.state)}
        matchesInfoToDisplay={matchesInfoToDisplay}
        onResetMatches={resetMatches}
      />

      <div className="tableContainer">{renderGameModeTable(gameMode)}</div>
    </div>
  );
};

export default App;
