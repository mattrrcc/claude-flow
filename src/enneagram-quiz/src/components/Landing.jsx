import React from "react";
import "../styles/landing.css";

export default function Landing({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-badge">Free · Private · Takes ~5 minutes</div>
        <h1 className="landing-title">
          Discover Your <span className="gradient-text">Enneagram Type</span>
        </h1>
        <p className="landing-subtitle">
          The Enneagram is one of the most powerful tools for understanding yourself — why you
          react the way you do, what drives your decisions, and how you relate to the people
          around you.
        </p>
        <button className="btn-primary btn-large" onClick={onStart}>
          Take the Free Quiz →
        </button>
        <p className="landing-privacy">Your answers are never stored or shared.</p>
      </div>

      <section className="what-is">
        <h2>What is the Enneagram?</h2>
        <p>
          The Enneagram (pronounced <em>ANY-uh-gram</em>) is a personality system that describes
          nine distinct ways of seeing and moving through the world. Unlike surface-level
          personality tests, the Enneagram goes deeper — it maps your{" "}
          <strong>core motivations, fears, and desires</strong>, not just your behaviors.
        </p>
        <p>
          Knowing your type helps you understand why you get stuck in certain patterns, how you
          handle stress, what you need to thrive, and how you can grow into the best version of
          yourself.
        </p>
      </section>

      <section className="types-grid-preview">
        <h2>The 9 Types at a Glance</h2>
        <div className="types-preview-grid">
          {[
            { n: 1, name: "The Reformer", emoji: "⚖️", color: "#2ecc71" },
            { n: 2, name: "The Helper", emoji: "🤝", color: "#e74c3c" },
            { n: 3, name: "The Achiever", emoji: "🏆", color: "#f39c12" },
            { n: 4, name: "The Individualist", emoji: "🎨", color: "#9b59b6" },
            { n: 5, name: "The Investigator", emoji: "🔍", color: "#3498db" },
            { n: 6, name: "The Loyalist", emoji: "🛡️", color: "#1abc9c" },
            { n: 7, name: "The Enthusiast", emoji: "🌟", color: "#f1c40f" },
            { n: 8, name: "The Challenger", emoji: "💪", color: "#e67e22" },
            { n: 9, name: "The Peacemaker", emoji: "☮️", color: "#95a5a6" },
          ].map((t) => (
            <div
              key={t.n}
              className="type-preview-card"
              style={{ borderTop: `4px solid ${t.color}` }}
            >
              <span className="type-emoji">{t.emoji}</span>
              <span className="type-number">Type {t.n}</span>
              <span className="type-name">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div>
              <strong>Answer honestly</strong>
              <p>36 simple questions about how you typically think, feel, and act.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div>
              <strong>Get your type</strong>
              <p>See your Enneagram type with a full description, strengths, and challenges.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div>
              <strong>Grow and share</strong>
              <p>Use insights for personal growth — and share the quiz with friends and family.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-bottom">
        <button className="btn-primary btn-large" onClick={onStart}>
          Find My Type →
        </button>
      </div>
    </div>
  );
}
