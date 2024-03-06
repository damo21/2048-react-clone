// react imports
import React, { useState, useEffect } from "react";

type RGB = { r: number; g: number; b: number };


function App() {
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [gameArray, setGameArray] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [copyGameArray, setCopyGameArray] = useState<number[]>(gameArray)
  const [score, setScore] = useState<number>(0);
  const [animatedIndices, setAnimatedIndices] = useState<number[]>([]);


  useEffect(() => {
    if (!hasGameStarted) {
      setHasGameStarted(!hasGameStarted);
      const startIndex = Math.floor(Math.random() * 4) + gameArray.length - 4;
      const newGameArray = [...gameArray];
      newGameArray[startIndex] = 2;
      setGameArray(newGameArray);
    }
  }, []);

  useEffect(() => {
    const latestScore: number = gameArray.reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );
    if (latestScore > 2) {
      setScore(latestScore);
    }

    setCopyGameArray(gameArray);
  }, [gameArray]);

  useEffect(() => {
    if (animatedIndices.length > 0) {
      const timeoutId = setTimeout(() => {
        setAnimatedIndices([]);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [animatedIndices]);


  const arrowButtonsHandler = (direction: string) => {

    let merge: number[][] | null;

    switch (direction) {
      case "u":
        merge = handleMerges(true, splitArrayIntoVerticalChunks(gameArray));
        handleGame(mergeVerticalChunksIntoArray(merge));
        break;
      case "l":
        merge = handleMerges(true, splitArrayIntoHorizontalChunks(gameArray));
        handleGame([].concat(...merge! as any));
        break;
      case "d":
        merge = handleMerges(false, splitArrayIntoVerticalChunks(gameArray));
        handleGame(mergeVerticalChunksIntoArray(merge));
        break;
      case "r":
        merge = handleMerges(false, splitArrayIntoHorizontalChunks(gameArray));
        handleGame([].concat(...merge! as any));
        break;
    }
  };

  const handleMerges = (isLeft: boolean, splitChunks: number[][]): number[][] => {

    return splitChunks.map((arr: number[]) => {
      return isLeft ? moveArrayValues(arr) : moveArrayValues(arr.reverse()).reverse();
    });
  };

  const handleGame = (mergedArray: number[]) => {
    if (!compareArrays(mergedArray, copyGameArray)) {
      const finalArr: number[] = spawnNewNumber(mergedArray);
      setGameArray(finalArr);
    }
  }

  const moveArrayValues = (arr: number[]): number[] => {

    for (let i: number = 0; i < arr.length; i++) {
      const curVal: number = arr[i];
      if (curVal === 0) continue;
      let movedBack: number = 0;

      while (movedBack <= i) {
        const checkValToMoveTo: number = arr[(i - 1) - movedBack];
        if (checkValToMoveTo > curVal) break;

        if (checkValToMoveTo === 0) {
          movedBack === 0 ? arr[i] = 0 : arr[(i - movedBack)] = 0;
          arr[(i - 1) - movedBack] = curVal;
        } else if (checkValToMoveTo === curVal) {
          movedBack === 0 ? arr[i] = 0 : arr[(i - movedBack)] = 0;
          arr[(i - 1) - movedBack] = checkValToMoveTo + curVal
        }
        movedBack++;
      }
    }
    return arr;
  }

  const splitArrayIntoHorizontalChunks = (arr: number[]): number[][] => {
    return arr.reduce(
      (preVal: number[][], currVal: number, i: number) => {
        const chunk: number = Math.floor(i / 4);
        preVal[chunk] = (preVal[chunk] || []).concat(currVal);
        return preVal;
      },
      []
    );
  }

  const splitArrayIntoVerticalChunks = (arr: number[]): number[][] => {
    const result: number[][] = [];
    const numOfSubArrays: number = arr.length / 4;

    for (let i: number = 0; i < 4; i++) {
      const subArray: number[] = [];
      for (let j = 0; j < numOfSubArrays; j++) {
        subArray.push(arr[j * 4 + i]);
      }
      result.push(subArray);
    }

    return result;
  }

  const mergeVerticalChunksIntoArray = (arrays: number[][]): number[] => {
    const result: number[] = [];
    const maxLength: number = Math.max(...arrays.map(arr => arr.length));

    for (let i: number = 0; i < maxLength; i++) {
      for (const array of arrays) {
        if (i < array.length) {
          result.push(array[i]);
        } else {
          result.push(0);
        }
      }
    }
    return result;
  }

  const compareArrays = (a: number[], b: number[]): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  const spawnNewNumber = (arr: number[]) => {
    const copy = splitArrayIntoHorizontalChunks(arr).reverse();

    for (let i: number = 0; i < copy.length; i++) {
      if (!copy[i].includes(0)) continue;

      const zeroIndices: number[] = copy[i].reduce((finalVal: number[], currVal: number, index: number) => {
        if (currVal === 0) {
          finalVal.push(index);
        }
        return finalVal;
      }, []);

      const randomIndex: number = zeroIndices[Math.floor(Math.random() * zeroIndices.length)];

      const newValue = Math.random() < 0.5 ? 2 : 4;
      copy[i][randomIndex] = newValue;
      copy.reverse();
      break;
    }

    return [].concat(...copy as any);
  }

  const getColorBetween = (num: number, startColor: string, endColor: string): string => {
    const start = hexToRgb(startColor);
    const end = hexToRgb(endColor);
    const ratio = num / 516;

    const interpolated: RGB = {
      r: Math.floor(start.r + (end.r - start.r) * ratio),
      g: Math.floor(start.g + (end.g - start.g) * ratio),
      b: Math.floor(start.b + (end.b - start.b) * ratio),
    };

    return rgbToHex(interpolated);
  }

  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : { r: 0, g: 0, b: 0 };
  }

  const rgbToHex = (rgb: RGB): string => {
    return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
  }


  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center max-w-[50%] px-24 pt-10">
        <div className="w-full text-center text-[26px] text-white">Score: {score}</div>
        <div className="grid grid-cols-4 grid-rows-4 gap-1 bg-lighterDark p-1 rounded">
          {gameArray.map((num: number, i: number) => {
            return (
              <div
                key={`div_${i}`}
                className={`bg-gray-200 py-12 px-16 text-center text-[28px] rounded font-bold`}
                style={{ backgroundColor: `${num === 0 ? `transparent` : getColorBetween(num, `#FFFFCC`, `#FF6600`)}` }}
              >
                {num === 0 ? "" : num}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col max-w-1/5 items-center text-[48px] pt-2">
          <div
            className="bg-lighterDark w-15 p-1 text-center select-none cursor-pointer rounded text-white "
            onClick={() => arrowButtonsHandler("u")}
          >
            &#8593;
          </div>
          <div className="flex gap-2 justify-center pt-2.5 w-full">
            <div
              className="bg-lighterDark w-15 p-1 text-center select-none cursor-pointer rounded text-white"
              onClick={() => arrowButtonsHandler("l")}
            >
              &#8592;
            </div>
            <div
              className="bg-lighterDark w-15 p-1 text-center select-none cursor-pointer rounded text-white"
              onClick={() => arrowButtonsHandler("d")}
            >
              &#8595;
            </div>
            <div
              className="bg-lighterDark w-15 p-1 text-center select-none cursor-pointer rounded text-white"
              onClick={() => arrowButtonsHandler("r")}
            >
              &#8594;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
