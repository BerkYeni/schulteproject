import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";
import {
  GameMode,
  GameState,
  GridSize,
  MatchRecord,
  MatchRecordAction,
  MemoryTable,
  MemoryTableAction,
  MemoryTile,
  MemoryTileAnimationTracker,
  Table,
  TableAction,
  TableDirection,
  Tile,
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
  isMemoryTile,
  isMemoryTileArray,
  memoryTileArray,
  progressedExpectedNumberWithDirection,
  shuffleInPlace,
  tileArray,
} from "./utils";
import VanillaSchulteTable from "./components/VanillaSchulteTable";
import ReactionSchulteTable from "./components/ReactionSchulteTable";
import MemorySchulteTable from "./components/MemorySchulteTable";

// TODO: implement memory table reducer, either find a way to
// implement async dispatch or find a different way to impl.
// TODO: implement chronometer countdown
// TODO: adjust css for mobile.

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
// misc: change mini icon/favicon.
// misc: change background color when panels are hidden.
// misc: make reset match records button have svg in it instead of "reset".
// misc: don't forget about hide panels button with responsive css.
// misc: add grid size settings container etc.
// misc: readress the media query breakpoints
// misc: change tile border radius to percentage
// misc: add "responsive design" to project description

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

  // const animationTracker = (tiles: Tile[]): MemoryTileAnimationTracker[] =>
  //   tiles.map((tile) => ({
  //     value: tile.value,
  //     timeoutId: undefined,
  //   }));

  // const [tileAnimationTracker, setTileAnimationTracker] = useState(
  //   animationTracker(tileArray(GridSize.Size4x4))
  // );

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

  const initializeMemoryTableState = (
    gridSize: GridSize = GridSize.Size4x4,
    direction: TableDirection = "Ascending"
  ): MemoryTable => {
    const tiles = memoryTileArray(gridSize);
    console.log("TESTING");
    console.log(tiles);
    const expectedNumber = getExpectedNumberOfDirection(direction, tiles);
    const state: GameState = "NotStarted";
    const memoryTable = {
      tiles: tiles,
      expectedNumber: expectedNumber,
      state: state,
      settings: { direction: direction, gridSize: gridSize },
    };
    console.log(memoryTable);
    return memoryTable;
  };

  const memoryTableReducer = (
    tableState: MemoryTable,
    tableAction: MemoryTableAction
  ): MemoryTable => {
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
        console.log(tiles);
        return {
          ...tableState,
          state: "Playing",
        };

      case "StartCountDown":
        // shuffleInPlace(tiles);
        // after the countdown ends, start game is called with useEffect
        const initialMemoryTable = initializeMemoryTableState(
          tableState.settings.gridSize,
          tableState.settings.direction
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
        matchRecordDispatch({ type: "Mark" });
        return { ...resettedTable, state: "Playing" };

      case "StopAnimation":
        const tileOfStopAnimation = tableState.tiles.find(
          (tile) => tile.value === tableAction.value
        );
        if (!tileOfStopAnimation) {
          throw new Error("tileOfStopAnimation must not be undefined.");
        }
        tileOfStopAnimation.animationPlaying = false;
        tileOfStopAnimation.timeoutId = undefined;
        return tableState;

      case "InputNumber":
        if (state !== "Playing") {
          break;
        }
        // if the number is wrong, set tile animationIsPlaying to true
        if (tableAction.inputtedNumber !== expectedNumber) {
          const tileToBeAnimated = tableState.tiles.find(
            (tile) => tile.value === tableAction.inputtedNumber
          );
          console.log(tileToBeAnimated);
          if (!tileToBeAnimated) {
            throw new Error("tileToBeAnimated must not be undefined.");
          }
          tileToBeAnimated.animationPlaying = true;

          return tableState;
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
        console.log("THIS IS WORKING");
        return initializeMemoryTableState();

      default:
        throw new Error("Unexpected game mode.");
    }
  };

  const [table, tableDispatch] = useReducer(
    gameModeToTableReducer(gameMode),
    initializeTableWithGameMode(gameMode)
  );

  console.log(table);

  useEffect(() => {
    if (gameMode === GameMode.Memory) {
      const memoryTiles = table.tiles as MemoryTile[];
      memoryTiles.forEach((tile) => {
        if (tile.animationPlaying) {
          tile.timeoutId = setTimeout(() => {
            tableDispatch({ type: "StopAnimation", value: tile.value });
          }, 3000);
        }
      });
    }
  }, [table]);

  // useEffect(() => {
  //   setTileAnimationTracker(animationTracker(table.tiles));
  // }, [table.tiles]);

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
        // const memoryTiles = table.tiles;
        // if (!isMemoryTileArray(memoryTiles)) {
        //   throw new Error("table tiles must be MemoryTile in memory gamemode.");
        // }
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
    // tableDispatch({ type: "Reset" });
  };

  const changeGridSize = (gridSize: GridSize): void => {
    tableDispatch({ type: "ChangeGridSize", gridSize: gridSize });
  };

  const changeDirection = (direction: TableDirection): void => {
    tableDispatch({ type: "ChangeDirection", direction: direction });
  };

  // i can get rid of this
  useEffect(() => {
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  }, [matches]);

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
          )} ${gridSizeToDisplay(table.settings.gridSize)} ${directionToDisplay(
            table.settings.direction
          )}`,
        }}
        onResetMatches={resetMatches}
      />

      <div className="tableContainer">{renderGameModeTable(gameMode)}</div>
    </div>
  );
};

export default App;
