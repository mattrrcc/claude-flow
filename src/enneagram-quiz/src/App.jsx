import React, { useState } from "react";
import Landing from "./components/Landing";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import "./styles/global.css";

export default function App() {
  const [view, setView] = useState("landing"); // landing | quiz | results
  const [scores, setScores] = useState(null);

  function handleQuizComplete(scores) {
    setScores(scores);
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRetake() {
    setScores(null);
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <button className="logo-btn" onClick={handleRetake}>
            <span className="logo-icon">☯</span>
            <span className="logo-text">EnneaDiscover</span>
          </button>
          {view !== "landing" && (
            <button className="btn-ghost" onClick={handleRetake}>
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {view === "landing" && <Landing onStart={() => setView("quiz")} />}
        {view === "quiz" && <Quiz onComplete={handleQuizComplete} />}
        {view === "results" && scores && (
          <Results scores={scores} onRetake={handleRetake} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          EnneaDiscover · Free &amp; Private · Built to help you understand yourself
        </p>
        <p className="footer-note">
          The Enneagram is a tool for self-discovery, not a definitive label. Use it with
          curiosity and compassion.
        </p>
      </footer>
    </div>
  );
}
