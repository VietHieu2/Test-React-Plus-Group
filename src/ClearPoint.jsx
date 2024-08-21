import React, { useState, useEffect } from "react";

const ClearPointsGame = () => {
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const [circles, setCircles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [numCircles, setNumCircles] = useState();
  const [nextCorrectId, setNextCorrectId] = useState(1);
  const [gameStatus, setGameStatus] = useState("");

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      generateCircles(numCircles);
    }
  }, [isPlaying, numCircles]);

  const generateCircles = (num) => {
    let tempCircles = [];
    for (let i = 1; i <= num; i++) {
      tempCircles.push({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 300,
      });
    }
    setCircles(tempCircles);
  };

  const handleCircleClick = (id) => {
    if (!isPlaying || gameStatus !== "") return;

    if (id === nextCorrectId) {
      setCircles(
        circles.map((circle) =>
          circle.id === id ? { ...circle, clicked: true } : circle
        )
      );
      setPoints(points + 1);
      setNextCorrectId(nextCorrectId + 1);

      setTimeout(() => {
        setCircles((prevCircles) =>
          prevCircles.filter((circle) => circle.id !== id)
        );
      }, 300);

      if (id === numCircles) {
        setGameStatus("Winner");
        setIsPlaying(false);
      }
    } else {
      setGameStatus("Game Over");
      setIsPlaying(false); // Stop the game
    }
  };

  const handleRestart = () => {
    setPoints(0);
    setTime(0);
    setNextCorrectId(1);
    setGameStatus("");
    setIsPlaying(true);
    generateCircles(numCircles);
  };
  const handlePlay = () => {
    setIsPlaying(true);
    generateCircles(numCircles);
  };
  return (
    <div>
      {gameStatus && <h2>{gameStatus}</h2>}
      <h1>Let's Play</h1>
      <div>
        <label>Number of Points: </label>
        <input
          type="number"
          value={numCircles}
          onChange={(e) => setNumCircles(Number(e.target.value))}
          min="1"
        />
      </div>

      <div>Points: {points}</div>
      <div>Time: {time.toFixed(1)}s</div>

      {time > 0.1 ? (
        <button onClick={handleRestart}>Restart</button>
      ) : (
        <button onClick={handlePlay}>Play</button>
      )}
      <div
        style={{
          border: "1px solid black",
          width: "400px",
          height: "400px",
          position: "relative",
          margin: "20px auto",
        }}
      >
        {circles.map((circle) => (
          <div
            key={circle.id}
            onClick={() => handleCircleClick(circle.id)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: circle.clicked ? "red" : "lightgray",
              textAlign: "center",
              lineHeight: "40px",
              position: "absolute",
              left: circle.x,
              top: circle.y,
              cursor: "pointer",
              pointerEvents: circle.clicked ? "none" : "auto",
            }}
          >
            {circle.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClearPointsGame;
