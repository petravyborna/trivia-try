import React, { useEffect, useState } from "react";

const decodeText = (text) => {
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/html").body.textContent;
};

function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=50&category=9&type=multiple") // Only fetches 10 questions
      .then(response => response.json())
      .then(data => setQuestions(data.results)) // Ensures correct API structure
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  if (!questions.length) return <div>Loading...</div>;
  if (gameOver) return <div><h2>Game Over! 🎉 Final Score: {score} / 10</h2></div>;

  const question = questions[index];

  const handleAnswerClick = (answer) => {
    if (answer === question.correct_answer) {
      setScore(score + 1);
    }
    if (index + 1 < 10) { // Limits to 10 questions
      setIndex(index + 1);
    } else {
      setGameOver(true);
    }
  };

  return (
    <div>
      <h2>{decodeText(question.question)}</h2>
      {[...question.incorrect_answers, question.correct_answer]
        .sort(() => Math.random() - 0.5)
        .map((answer, i) => (
          <button key={i} onClick={() => handleAnswerClick(answer)}>
            {decodeText(answer)}
          </button>
        ))}
      <p>Score: {score}</p>
    </div>
  );
}

export default TriviaGame;
