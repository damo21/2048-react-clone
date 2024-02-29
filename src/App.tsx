// react imports
import React, { useState, useEffect } from "react";

function App() {
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const [gameArray, setGameArray] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [score, setScore] = useState<number>(0);
  const [lastKey, setLastKey] = useState<string>("");

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
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameArray]);

  useEffect(() => {
    const latestScore: number = gameArray.reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );
    if (latestScore > 2) {
      setScore(latestScore);
    }
  }, [gameArray]);

  const handleKeyDown = async (event: KeyboardEvent) => {

    console.log(event.key);
    console.log(lastKey);

    if (event.key === lastKey) return;

    switch (event.key) {
      case "ArrowLeft":
        await handleLeftArrow();
        // handleLeftArrow().then((arr: number[]) => {
        //   setLastKey(event.key);
        // });
        break;
      case "ArrowRight":
        await handleRightArrow();
        // handleRightArrow().then((arr: number[]) => {
        //   setLastKey(event.key);
        // });
        console.log(event.key);
        break;
      case "ArrowUp":
        console.log(event.key);
        break;
      case "ArrowDown":
        console.log(event.key);
        break;
      default:
        break;
    }
    setLastKey(event.key);
  };

  const handleLeftArrow = async () => {
    const newGameArray: number[] = [...gameArray];

    const lastRowIndex: number = newGameArray.length - 4;
    const nonZeroIndices = [];
    for (let i: number = lastRowIndex; i < lastRowIndex + 4; i++) {
      if (newGameArray[i] !== 0) nonZeroIndices.push(i);
    }

    nonZeroIndices.sort().forEach((index: number) => {
      let targetIndex: number = lastRowIndex;
      while (newGameArray[targetIndex] !== 0) targetIndex++;
      newGameArray[targetIndex] = newGameArray[index];
      newGameArray[index] = 0;
    });

    for (let i: number = lastRowIndex; i < lastRowIndex + 3; i++) {
      if (newGameArray[i] === newGameArray[i + 1]) {
        newGameArray[i] *= 2;
        newGameArray[i + 1] = 0;
      }
    }
    setGameArray(newGameArray);
  };

  const handleRightArrow = async () => {
    const newGameArray: number[] = [...gameArray];

    const lastRowIndex: number = newGameArray.length - 4;
    const nonZeroIndices = [];
    for (let i: number = lastRowIndex; i < lastRowIndex + 4; i++) {
      if (newGameArray[i] !== 0) nonZeroIndices.push(i);
    }

    nonZeroIndices.sort().forEach((index: number) => {
      let targetIndex: number = lastRowIndex + 3;
      while (newGameArray[targetIndex] !== 0) targetIndex--;
      newGameArray[targetIndex] = newGameArray[index];
      newGameArray[index] = 0;
    });

    for (let i: number = lastRowIndex + 2; i >= lastRowIndex; i--) {
      if (newGameArray[i] === newGameArray[i - 1]) {
        newGameArray[i] *= 2;
        newGameArray[i - 1] = 0;
      }
    }

    setGameArray(newGameArray);
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
    </div>
  );
}

export default App;
