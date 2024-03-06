// react imports
import React, { useState, useEffect } from "react";

function App() {
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [gameArray, setGameArray] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [copyGameArray, setCopyGameArray] = useState<number[]>(gameArray)
  const [score, setScore] = useState<number>(0);

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

  return (
    <div className="App">
      <header className="App-header" />
      <div>score: {score}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: "1px",
          maxWidth: "20%",
        }}
      >
        {gameArray.map((num: number, i: number) => {
          return (
            <div
              key={`div_${i}`}
              style={{
                backgroundColor: "lightgrey",
                padding: "30px",
                textAlign: "center",
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "20%",
          alignItems: "center",
          fontSize: 32,
          paddingTop: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "lightgrey",
            width: "15%",
            padding: 5,
            textAlign: "center",
          }}
          onClick={() => arrowButtonsHandler("u")}
        >
          &#8593;
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            paddingTop: 10,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "lightgrey",
              width: "15%",
              padding: 5,
              textAlign: "center",
            }}
            onClick={() => arrowButtonsHandler("l")}
          >
            &#8592;
          </div>
          <div
            style={{
              backgroundColor: "lightgrey",
              width: "15%",
              padding: 5,
              textAlign: "center",
            }}
            onClick={() => arrowButtonsHandler("d")}
          >
            &#8595;
          </div>
          <div
            style={{
              backgroundColor: "lightgrey",
              width: "15%",
              padding: 5,
              textAlign: "center",
            }}
            onClick={() => arrowButtonsHandler("r")}
          >
            &#8594;
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
