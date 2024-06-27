import React, { useState, useEffect } from "react";

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const getRandomPosition = () => {
  const x = Math.floor(Math.random() * (WIDTH / CELL_SIZE));
  const y = Math.floor(Math.random() * (HEIGHT / CELL_SIZE));
  return { x, y };
};

const Index = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key]) {
        setDirection(DIRECTIONS[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (
          head.x < 0 ||
          head.x >= WIDTH / CELL_SIZE ||
          head.y < 0 ||
          head.y >= HEIGHT / CELL_SIZE ||
          newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomPosition());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl text-center mb-4">Snake Game</h1>
        <div
          style={{
            position: "relative",
            width: WIDTH,
            height: HEIGHT,
            background: "#000",
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: "#0f0",
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              width: CELL_SIZE,
              height: CELL_SIZE,
              background: "#f00",
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            }}
          />
        </div>
        {gameOver && <p className="text-center mt-4 text-red-500">Game Over</p>}
      </div>
    </div>
  );
};

export default Index;