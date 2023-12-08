const findAdjacentIndices = (
  originIndex: number,
  length: number,
): Array<number> => {
  const adjacentIndices: Array<number> = [];
  for (let index = originIndex - 1; index <= originIndex + length; index++) {
    if (index >= 0) adjacentIndices.push(index);
  }
  return adjacentIndices;
};

type SchematicArticle = {
  value: string;
  originIndex: number;
  length: number;
  occupancyIndices: Array<number>;
  adjacentIndices: Array<number>;
};

const scanSchematicLine = (
  line: string,
  regex: RegExp,
): Array<SchematicArticle> =>
  Array.from(line.matchAll(regex), (regexMatch) => {
    const adjacentIndices = findAdjacentIndices(
      regexMatch.index!,
      regexMatch.at(0)!.length,
    );
    return {
      value: regexMatch.at(0)!,
      originIndex: regexMatch.index!,
      length: regexMatch.at(0)!.length,
      occupancyIndices: adjacentIndices.slice(1, -1),
      adjacentIndices,
    } as SchematicArticle;
  });

type EngineSchematic = {
  numberElements: Array<Array<SchematicArticle>>;
  symbolElements: Array<Array<SchematicArticle>>;
  gearElements: Array<Array<SchematicArticle>>;
};

const findNeighbourElements = (
  lineIndex: number,
  elements: Array<Array<SchematicArticle>>,
) => {
  const previousIndex = lineIndex - 1;
  const nextIndex = lineIndex + 1;
  return [
    ...elements[lineIndex]!,
    ...(previousIndex >= 0 ? elements[previousIndex]! : []),
    ...(nextIndex <= elements.length - 1 ? elements[nextIndex]! : []),
  ];
};

const main = async () => {
  console.log("-- Advent of Code 2023, Day-3 Puzzle --");

  const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text();

  const engineSchematic: EngineSchematic = {
    numberElements: [],
    symbolElements: [],
    gearElements: [],
  };

  for (const line of inputText.split("\n")) {
    engineSchematic.numberElements.push(scanSchematicLine(line, /\d+/g));
    engineSchematic.symbolElements.push(scanSchematicLine(line, /[^.\d]/g));
    engineSchematic.gearElements.push(scanSchematicLine(line, /\*/g));
  }

  const partNumberSum = engineSchematic.numberElements.reduce(
    (partNumberSum, currentLine, currentLineIndex) => {
      const symbolNeighbours = findNeighbourElements(
        currentLineIndex,
        engineSchematic.symbolElements,
      );

      return (
        partNumberSum +
        currentLine
          .filter((numberElement) =>
            symbolNeighbours.some((symbolElement) =>
              numberElement.adjacentIndices.includes(symbolElement.originIndex),
            ),
          )
          .map((numberElement) => Number(numberElement.value))
          .reduce((previous, current) => previous + current, 0)
      );
    },
    0,
  );

  console.log(`Sum of part numbers = ${partNumberSum}`);

  const gearRatioSum = engineSchematic.gearElements.reduce(
    (gearRatioSum, currentLine, currentLineIndex) => {
      const numberNeighbours = findNeighbourElements(
        currentLineIndex,
        engineSchematic.numberElements,
      );

      if (numberNeighbours.length < 2) {
        return gearRatioSum;
      }

      return currentLine.reduce((gearRatioSum, currentGearElement) => {
        const adjacentNumbers = numberNeighbours
          .filter((numberElement) =>
            currentGearElement.adjacentIndices.some((index) =>
              numberElement.occupancyIndices.includes(index),
            ),
          )
          .map((element) => Number(element.value));

        if (adjacentNumbers.length === 2) {
          gearRatioSum += (adjacentNumbers[0] ?? 1) * (adjacentNumbers[1] ?? 1);
        }

        return gearRatioSum;
      }, gearRatioSum);
    },
    0,
  );

  console.log(`Sum of gear ratios = ${gearRatioSum}`);
};

export default main;
