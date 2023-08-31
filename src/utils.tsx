import {
  ChronometerState,
  GameMode,
  GameState,
  GridSize,
  MatchRecord,
  TableDirection,
  Tile,
} from "./interfaces";

export const shuffleInPlace = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
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
  Ascending: "Ascending",
  Descending: "Descending",
};
export const directionToDisplay = (direction: TableDirection) =>
  directionToDisplayLookUp[direction];

export const tileArray = (gridSize: GridSize) =>
  gridSizeToArray(gridSize).map(
    (number): Tile => ({ value: number, checked: false })
  );

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
  [GameMode.Vanilla]: "Vanilla",
  [GameMode.Reverse]: "Reverse",
  [GameMode.Memory]: "Memory",
  [GameMode.Reaction]: "Reaction",
};
export const gameModeToDisplay = (gameMode: GameMode) =>
  gameModeToDisplayLookUp[gameMode];

const gameStateToChronometerStateLookup: {
  [key in GameState]: ChronometerState;
} = {
  NotStarted: "Idle",
  Playing: "Active",
  Completed: "DisplayResult",
  Countdown: "Idle",
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
