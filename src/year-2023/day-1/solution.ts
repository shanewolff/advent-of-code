const digitMap: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

type RegexInfo = { regex: RegExp; index: number };

const regexMap: Record<string, RegexInfo> = {
  regex1: {
    regex: new RegExp(/\d/g),
    index: 0,
  },
  regex2: {
    regex: new RegExp(`(?=(\\d|${Object.keys(digitMap).join("|")}))`, "g"),
    index: 1,
  },
};

type ConvertStrToNum = (inputString: string) => number;
const convertStrToNum: ConvertStrToNum = (inputStr) =>
  digitMap.hasOwnProperty(inputStr)
    ? Number(digitMap[inputStr])
    : Number(inputStr);

const extractNum = (
  calibrationValue: string,
  regexInfo: RegexInfo,
  converter: ConvertStrToNum,
): number => {
  const nums = Array.from(
    calibrationValue.matchAll(regexInfo.regex),
    (regexOutput) => converter(regexOutput.at(regexInfo.index) as string),
  );
  return nums.length > 0 ? Number(`${nums.at(0)}${nums.at(-1)}`) : 0;
};

const main = async () => {
  console.log("-- Advent of Code 2023, Day-1 Puzzle --");
  const inputText = await Bun.file(`${import.meta.dir}/input.txt`).text();
  let sum1 = 0,
    sum2 = 0;
  for (const line of inputText.split("\n")) {
    sum1 += extractNum(line, regexMap.regex1!, convertStrToNum);
    sum2 += extractNum(line, regexMap.regex2!, convertStrToNum);
  }
  console.log(`Sum of calibration values (Part-1) = ${sum1}`);
  console.log(`Sum of calibration values (Part-2) = ${sum2}`);
};

export default main;
