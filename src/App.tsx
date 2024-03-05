// react imports
import React, { useState, useEffect } from "react";

function App() {
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [gameArray, setGameArray] = useState<number[]>([
    0, 4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [score, setScore] = useState<number>(0);
  const [haveAnyMerged, setHaveAnyMerged] = useState<boolean>(false);

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
  }, [gameArray]);

  const arrowButtonsHandler = (direction: string) => {
    switch (direction) {
      case "u":
        break;
      case "l":
        handleHorizontalDirection(true);
        break;
      case "r":
        break;
      case "d":
        break;
    }
  };

  const handleHorizontalDirection = (isLeft: boolean) => {
    const copyGameArray: number[] = [...gameArray];

    const chunkedArray: number[][] = copyGameArray.reduce(
      (preVal: number[][], currVal: number, i: number) => {
        const chunk: number = Math.floor(i / 4);
        preVal[chunk] = (preVal[chunk] || []).concat(currVal);
        return preVal;
      },
      []
    );

    const arr1: number[] = chunkedArray[0];
    const arr2: number[] = chunkedArray[1];
    const arr3: number[] = chunkedArray[2];
    const arr4: number[] = chunkedArray[3];

    console.log({ starting: arr1 });
    console.log(moveAndSum(arr1));
  };

  const moveAndSum = (arr: number[]) => {
    arr.reverse();
    let i = 0;
    while (i < arr.length - 1) {
      // Find the next non-zero element
      while (arr[i] === 0 && i < arr.length - 1) {
        i++;
      }
      // If the next element is a zero, move the current non-zero value to it
      if (arr[i] !== 0 && arr[i + 1] === 0) {
        arr[i + 1] = arr[i];
        arr[i] = 0;
      } else if (arr[i] === arr[i + 1]) {
        // If the current and next elements are equal
        arr[i + 1] = arr[i] + arr[i + 1]; // Add them together
        arr[i] = 0; // Set the current element to 0
      }
      i++; // Move to the next element
    }
    return arr.reverse();
  };

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
        >
          &#8593;
          {/* UP */}
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
            {/* LEFT */}
          </div>
          <div
            style={{
              backgroundColor: "lightgrey",
              width: "15%",
              padding: 5,
              textAlign: "center",
            }}
          >
            &#8595;
            {/* DOWN */}
          </div>
          <div
            style={{
              backgroundColor: "lightgrey",
              width: "15%",
              padding: 5,
              textAlign: "center",
            }}
          >
            &#8594;
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
