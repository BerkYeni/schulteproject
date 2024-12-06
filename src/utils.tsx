import {
  ChronometerState,
  GameMode,
  GameState,
  GridSize,
  MatchRecord,
  MemoryTile,
  TableDirection,
  Tile,
  SchulteTile, // Added SchulteTile here
} from "./interfaces";

const sortRandom = (array: any[]) => {
  array.sort(() => Math.random() - 0.5)
}

export const shuffleInPlace = (array: any[], gameMode: GameMode = GameMode.Vanilla) => {
  if (gameMode === GameMode.Line) {
    const lineIndices = []
    const lineAmount = Math.sqrt(array.length)
    const rowAmount = lineAmount
    let temp = []
    for (let i = 0; i < lineAmount; i++) {
      for (let k = 0; k < rowAmount; k++) {
        temp.push(k + (i * lineAmount))
      }
      lineIndices.push(temp)
      temp = []
    }
    for (const line of lineIndices) {
      sortRandom(line)
    }
    const indices = lineIndices.flat(1)
    const copy = [...array]
    for (let i = 0; i < array.length; i++) {
      const indexToWrite = indices[i]
      array[indexToWrite] = copy[i]
    }
  } else {
    sortRandom(array)
  }
};

export const formatMatchDuration = (match: MatchRecord) => {
  const matchMilliseconds = match.durationInMilliseconds;
  return formatMillisecondsToSeconds(matchMilliseconds);
};

export const formatMillisecondsToSeconds = (milliseconds: number) =>
  (milliseconds / 1000).toFixed(2);

export const numberArray = (
  start: number,
  end: number,
  step: number
): number[] => {
  const numbers = [];
  for (let index = start; index < end; index += step) {
    numbers.push(index);
  }
  return numbers;
};

export const gridSizeToArray = (gridSize: GridSize) =>
  numberArray(1, gridSize + 1, 1);

const gridSizeToCssLookUp: { [key in GridSize]: string } = {
  [GridSize.Size3x3]: "grid3x3",
  [GridSize.Size4x4]: "grid4x4",
  [GridSize.Size5x5]: "grid5x5",
};
export const gridSizeToCss = (gridSize: GridSize) =>
  gridSizeToCssLookUp[gridSize];

const gridSizeToDisplayLookUp: { [key in GridSize]: string } = {
  [GridSize.Size3x3]: "3 x 3",
  [GridSize.Size4x4]: "4 x 4",
  [GridSize.Size5x5]: "5 x 5",
};
export const gridSizeToDisplay = (gridSize: GridSize) =>
  gridSizeToDisplayLookUp[gridSize];

const directionToDisplayLookUp: { [key in TableDirection]: string } = {
  Ascending: "Start from 1",
  Descending: "Towards 1",
};
export const directionToDisplay = (direction: TableDirection) =>
  directionToDisplayLookUp[direction];

export const tileArray = (gridSize: GridSize) =>
  gridSizeToArray(gridSize).map(
    (number): Tile => ({ value: number, checked: false })
  );

export const memoryTileArray = (gridSize: GridSize) =>
  gridSizeToArray(gridSize).map(
    (number): MemoryTile => ({
      value: number,
      checked: false,
      animationPlaying: false,
      timeoutId: undefined,
    })
  );

export const isMemoryTile = (memoryTile: Tile): memoryTile is MemoryTile => {
  return (
    memoryTile.hasOwnProperty("animationPlaying") &&
    memoryTile.hasOwnProperty("timeoutId")
  );
};

export const isMemoryTileArray = (
  memoryTileArray: Tile[]
): memoryTileArray is MemoryTile[] => {
  return isMemoryTile(memoryTileArray[0]);
};

export const numbersFromTiles = (tiles: Tile[]) =>
  tiles.map((tile) => tile.value);

export const last = <T,>(arr: T[]): T | undefined => arr[arr.length - 1];

export const findLastPlayedRecord = (matches: MatchRecord[]) =>
  matches.length
    ? matches.reduce((previousMatch, currentMatch) =>
        previousMatch.startTime.getTime() > currentMatch.startTime.getTime()
          ? previousMatch
          : currentMatch
      )
    : undefined;

export const findPersonalBestRecord = (matches: MatchRecord[]) =>
  matches.length
    ? matches.reduce((previousMatch, currentMatch) =>
        previousMatch.durationInMilliseconds <
        currentMatch.durationInMilliseconds
          ? previousMatch
          : currentMatch
      )
    : undefined;

export const findSettingSpecificMatches = (
  matches: MatchRecord[],
  gridSize: GridSize,
  gameMode: GameMode,
  direction: TableDirection
) =>
  matches.filter(
    (match) =>
      match.gridSize === gridSize &&
      match.gameMode === gameMode &&
      match.direction === direction
  );

const gameModeToDisplayLookUp: { [key in GameMode]: string } = {
  [GameMode.Vanilla]: "Classic",
  [GameMode.Memory]: "Memory",
  [GameMode.Reaction]: "Reaction",
  [GameMode.Line]: "Line",
};
export const gameModeToDisplay = (gameMode: GameMode) =>
  gameModeToDisplayLookUp[gameMode];

export const gridSizes = [GridSize.Size3x3, GridSize.Size4x4, GridSize.Size5x5];
export const gameModes = [GameMode.Vanilla, GameMode.Reaction, GameMode.Memory, GameMode.Line];
export const directions: TableDirection[] = ["Ascending", "Descending"];

const gameStateToChronometerStateLookup: {
  [key in GameState]: ChronometerState;
} = {
  NotStarted: "Idle",
  Playing: "Active",
  Completed: "DisplayResult",
  Countdown: "Countdown",
};
export const gameStateToChronometerState = (gameState: GameState) =>
  gameStateToChronometerStateLookup[gameState];

export const smallestExpectedNumber = (tiles: Tile[]): number =>
  Math.min(...numbersFromTiles(tiles));

export const highestExpectedNumber = (tiles: Tile[]): number =>
  Math.max(...numbersFromTiles(tiles));

export const getExpectedNumberOfDirection = (
  direction: TableDirection,
  tiles: Tile[]
) =>
  direction === "Ascending"
    ? smallestExpectedNumber(tiles)
    : highestExpectedNumber(tiles);

export const progressedExpectedNumberWithDirection = (
  direction: TableDirection,
  expectedNumber: number
) => (direction === "Ascending" ? expectedNumber + 1 : expectedNumber - 1);

// TODO: make this a component, possibly
export const renderSchulteTile = (
  tile: SchulteTile,
  index: number,
  gameMode: GameMode,
  gameState: GameState,
  tableDirection: TableDirection,
  onNumberInput: (num: number) => void,
  expectedNumber: number | undefined
) => {
  switch (gameMode) {
    case GameMode.Vanilla:
    case GameMode.Line:
      return (
        <button
          className={`tile smoothTransition ${tile.checked ? "clicked" : "unclicked"} ${gameState !== "Playing" ? "dontClick" : ""}`}
          onMouseDown={() => onNumberInput(tile.value)}
          key={index}
        >
          <div className="tileText">{tile.value}</div>
        </button>
      );
    case GameMode.Reaction:
      return (
        <button
          className={`tile smoothTransition ${tile.checked ? "clicked" : "unclicked"} ${gameState !== "Playing" ? "dontClick" : ""}`}
          onMouseDown={() => onNumberInput(tile.value)}
          key={index}
        >
          <div className={`tileText ${
            expectedNumber === undefined 
            ? "" 
            : tableDirection === "Ascending" && tile.value <= expectedNumber 
            ? "" 
            : tableDirection === "Descending" && tile.value >= expectedNumber 
            ? ""
            : "hidden"}`}>{tile.value}</div>
        </button>
      );
    case GameMode.Memory:
      const memoryTile = tile as MemoryTile;
      return (
        <button
          className={`tile smoothTransition ${memoryTile.checked ? "clicked" : "unclicked"} ${gameState !== "Playing" ? "dontClick" : ""}`}
          onMouseDown={() => onNumberInput(memoryTile.value)}
          key={index}
        >
          <div
            className={`tileText ${
              gameState !== "Playing"
                ? ""
                : memoryTile.checked
                ? ""
                : memoryTile.animationPlaying
                ? "revealTileShortly transparent"
                : "hidden"
            }`}
          >
            {memoryTile.value}
          </div>
        </button>
      );
    default:
      return null;
  }
};
