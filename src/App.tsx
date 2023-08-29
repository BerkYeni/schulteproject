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
  StartGameAction,
  Table,
  TableAction,
  Tile,
} from "./interfaces";
import {
  findLastPlayedRecord,
  findPersonalBestRecord,
  findSettingSpecificMatches,
  gameModeToDisplay,
  gameStateToChronometerState,
  gridSizeToArray,
  gridSizeToDisplay,
  last,
  numbersFromTiles,
  shuffleInPlace,
  tileArray,
} from "./utils";
import VanillaSchulteTable from "./components/VanillaSchulteTable";
import ReactionSchulteTable from "./components/ReactionSchulteTable";

// TODO: fix being able to change game mode while the game is ongoing
// TODO: add direction and impl

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

  const initializeTableState = (): Table => {
    const gridSize = GridSize.Size4x4;
    const tiles = tileArray(gridSize);
    const expectedNumber = Math.min(...numbersFromTiles(tiles));
    return {
      tiles: tiles,
      expectedNumber: expectedNumber,
      state: "NotStarted",
      settings: { direction: "Ascending", gridSize: gridSize },
    };
  };

  const vanillaTableReducer = (
    tableState: Table,
    tableAction: TableAction
  ): Table => {
    const { expectedNumber, tiles, state } = tableState;
    switch (tableAction.type) {
      case "Start":
        if (state !== "NotStarted") {
          break;
        }
        shuffleInPlace(tiles);
        matchRecordDispatch({ type: "Mark" });
        return { ...tableState, state: "Playing", tiles: tiles };

      case "ChangeGridSize":
        if (state !== "NotStarted") {
          break;
        }
        return {
          ...tableState,
          tiles: tileArray(tableAction.gridSize),
          settings: { ...tableState.settings, gridSize: tableAction.gridSize },
        };

      case "Restart":
        if (state !== "Completed") {
          break;
        }
        shuffleInPlace(tiles);
        matchRecordDispatch({ type: "Mark" });
        return {
          ...tableState,
          tiles: tiles.map((tile) => ({ ...tile, checked: false })),
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
        if (tiles.every((tile) => tile.checked)) {
          matchRecordDispatch({
            type: "SaveRecord",
            tableSettings: tableState.settings,
          });
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

  const reactionTableReducer = (
    tableState: Table,
    tableAction: TableAction
  ): Table => {
    const { expectedNumber, tiles, state } = tableState;
    switch (tableAction.type) {
      case "Start":
        if (state !== "NotStarted") {
          break;
        }
        shuffleInPlace(tiles);
        matchRecordDispatch({ type: "Mark" });
        return { ...tableState, state: "Playing", tiles: tiles };

      case "ChangeGridSize":
        if (state !== "NotStarted") {
          break;
        }
        return {
          ...tableState,
          tiles: tileArray(tableAction.gridSize),
          settings: { ...tableState.settings, gridSize: tableAction.gridSize },
        };

      case "Restart":
        if (state !== "Completed") {
          break;
        }
        shuffleInPlace(tiles);
        matchRecordDispatch({ type: "Mark" });
        return {
          ...tableState,
          tiles: tiles.map((tile) => ({ ...tile, checked: false })),
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
        if (tiles.every((tile) => tile.checked)) {
          matchRecordDispatch({
            type: "SaveRecord",
            tableSettings: tableState.settings,
          });
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

  // const gameModeToGameProfile = (gameMode: GameMode): GameProfile => {
  //   const component = propsGivenSchulteTables(gameMode);

  //   switch (gameMode) {
  //     case GameMode.Vanilla:
  //       return { reducer: vanillaTableReducer, component: component };

  //     case GameMode.Reaction:
  //       return {
  //         reducer: reactionTableReducer,
  //         component: component,
  //       };

  //     default:
  //       throw new Error("Unexpected gamemode.");
  //   }
  // };

  // const gameProfile = gameModeToGameProfile(gameMode);

  const gameModeToTableReducer = (gameMode: GameMode) => {
    switch (gameMode) {
      case GameMode.Vanilla:
        return vanillaTableReducer;
      case GameMode.Reaction:
        return reactionTableReducer;
      default:
        throw new Error("Unexpected game mode.");
    }
  };

  const [table, tableDispatch] = useReducer(
    gameModeToTableReducer(gameMode),
    initializeTableState()
  );

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
    }
  };

  // const propsGivenSchulteTables = (gameMode: GameMode): ReactNode => {
  //   switch (gameMode) {
  //     case GameMode.Vanilla:
  //       return (
  //         <VanillaSchulteTable
  //           gameState={table.state}
  //           tiles={table.tiles}
  //           gridSize={table.settings.gridSize}
  //           onStart={() => tableDispatch({ type: "Start" })}
  //           onRestart={() => tableDispatch({ type: "Restart" })}
  //           onNumberInput={(inputtedNumber: number) =>
  //             tableDispatch({
  //               type: "InputNumber",
  //               inputtedNumber: inputtedNumber,
  //             })
  //           }
  //         />
  //       );

  //     case GameMode.Reaction:
  //       return (
  //         <ReactionSchulteTable
  //           gameState={table.state}
  //           tiles={table.tiles}
  //           gridSize={table.settings.gridSize}
  //           onStart={() => tableDispatch({ type: "Start" })}
  //           onRestart={() => tableDispatch({ type: "Restart" })}
  //           onNumberInput={(inputtedNumber: number) =>
  //             tableDispatch({
  //               type: "InputNumber",
  //               inputtedNumber: inputtedNumber,
  //             })
  //           }
  //           expectedNumber={table.expectedNumber}
  //         />
  //       );

  //     default:
  //       throw new Error("Unexpected game mode.");
  //   }
  // };

  const changeGameMode = (gameMode: GameMode) => {
    if (table.state !== "NotStarted") {
      return;
    }
    setGameMode(gameMode);
  };

  const changeGridSize = (gridSize: GridSize): void => {
    // setGridSize(gridSize);
    tableDispatch({ type: "ChangeGridSize", gridSize: gridSize });
  };

  // i can get rid of this
  useEffect(() => {
    localStorage.setItem(matchesKey, JSON.stringify(matches));
  }, [matches]);

  const settingSpecificMatches = findSettingSpecificMatches(
    matches,
    table.settings.gridSize,
    gameMode
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
        changeGameMode={changeGameMode}
        onGameModeChange={changeGameMode}
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

      <div className="tableContainer">
        {renderGameModeTable(gameMode)}
        {/* <ReactionSchulteTable
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
        /> */}
      </div>
    </div>
  );
};

export default App;
