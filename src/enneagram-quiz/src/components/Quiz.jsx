import React, { useState } from "react";
import { questions } from "../data/questions";
import "../styles/quiz.css";

const SCALE = [
  { value: 1, label: "Not at all like me" },
  { value: 2, label: "Rarely like me" },
  { value: 3, label: "Sometimes like me" },
  { value: 4, label: "Often like me" },
  { value: 5, label: "Very much like me" },
];

export default function Quiz({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("forward");

  const total = questions.length;
  const progress = Math.round((Object.keys(answers).length / total) * 100);
  const q = questions[current];
  const answered = answers[q.id] !== undefined;

  function handleAnswer(value) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (current < total - 1) {
      setDirection("forward");
      setTimeout(() => setCurrent((c) => c + 1), 200);
    }
  }

  function goBack() {
    if (current > 0) {
      setDirection("back");
      setCurrent((c) => c - 1);
    }
  }

  function handleSubmit() {
    // Tally scores per type
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer == null) return;
      Object.entries(q.scoring).forEach(([type, weight]) => {
        scores[parseInt(type)] += answer * weight;
      });
    });
    onComplete(scores);
  }

  const allAnswered = Object.keys(answers).length === total;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="quiz-progress-text">
          {Object.keys(answers).length} of {total} answered
        </p>
      </div>

      <div className={`quiz-card ${direction}`} key={q.id}>
        <div className="question-counter">Question {current + 1} of {total}</div>
        <h2 className="question-text">{q.text}</h2>

        <div className="scale-options">
          {SCALE.map((s) => (
            <button
              key={s.value}
              className={`scale-btn ${answers[q.id] === s.value ? "selected" : ""}`}
              onClick={() => handleAnswer(s.value)}
            >
              <span className="scale-value">{s.value}</span>
              <span className="scale-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-nav">
        <button
          className="btn-secondary"
          onClick={goBack}
          disabled={current === 0}
        >
          ← Back
        </button>

        {current < total - 1 ? (
          <button
            className="btn-primary"
            onClick={() => {
              setDirection("forward");
              setCurrent((c) => c + 1);
            }}
            disabled={!answered}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn-primary btn-submit"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {allAnswered ? "See My Results →" : `Answer all questions (${total - Object.keys(answers).length} left)`}
          </button>
        )}
      </div>

      {!allAnswered && current === total - 1 && (
        <p className="quiz-skip-hint">
          You have unanswered questions.{" "}
          <button
            className="link-btn"
            onClick={() => {
              const firstUnanswered = questions.findIndex((q) => answers[q.id] === undefined);
              if (firstUnanswered !== -1) setCurrent(firstUnanswered);
            }}
          >
            Jump to first unanswered
          </button>
        </p>
      )}
    </div>
  );
}
