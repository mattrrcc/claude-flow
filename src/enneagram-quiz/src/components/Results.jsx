import React, { useState } from "react";
import { enneagramTypes, wings } from "../data/enneagramTypes";
import "../styles/results.css";

function getTopTypes(scores) {
  return Object.entries(scores)
    .map(([type, score]) => ({ type: parseInt(type), score }))
    .sort((a, b) => b.score - a.score);
}

function getWing(primaryType, secondType) {
  const adj = [secondType - 1, secondType + 1];
  if (adj.includes(primaryType) || (primaryType === 1 && secondType === 9) || (primaryType === 9 && secondType === 1)) {
    const key = `${primaryType}w${secondType}`;
    return wings[key] || null;
  }
  // Check natural wings (adjacent types)
  const candidates = [
    `${primaryType}w${primaryType === 1 ? 9 : primaryType - 1}`,
    `${primaryType}w${primaryType === 9 ? 1 : primaryType + 1}`,
  ];
  return wings[candidates[0]] || wings[candidates[1]] || null;
}

export default function Results({ scores, onRetake }) {
  const [showAll, setShowAll] = useState(false);
  const ranked = getTopTypes(scores);
  const primary = ranked[0];
  const typeData = enneagramTypes[primary.type];
  const secondType = ranked[1].type;
  const wingKey = `${primary.type}w${secondType}`;
  const wingDesc = wings[wingKey];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://enneagram.app";
  const shareText = `I just discovered I'm an Enneagram Type ${primary.type}: ${typeData.name}! Find out your type:`;

  function copyLink() {
    navigator.clipboard?.writeText(shareUrl).then(() => alert("Link copied!"));
  }

  return (
    <div className="results-container">
      <div className="results-hero" style={{ background: `linear-gradient(135deg, ${typeData.color}22, ${typeData.color}44)` }}>
        <div className="results-type-badge" style={{ background: typeData.color }}>
          Type {primary.type}
        </div>
        <div className="results-emoji">{typeData.emoji}</div>
        <h1 className="results-title">{typeData.name}</h1>
        <p className="results-nickname">"{typeData.nickname}"</p>
        <p className="results-tagline">{typeData.tagline}</p>
      </div>

      <div className="results-body">
        <section className="result-section">
          <h2>Who You Are</h2>
          <p>{typeData.description}</p>
        </section>

        <div className="core-grid">
          <div className="core-card desire">
            <h3>Core Desire</h3>
            <p>{typeData.coreDesire}</p>
          </div>
          <div className="core-card fear">
            <h3>Core Fear</h3>
            <p>{typeData.coreFear}</p>
          </div>
        </div>

        <section className="result-section strengths-challenges">
          <div className="strengths">
            <h3>Your Strengths</h3>
            <ul>
              {typeData.strengths.map((s) => (
                <li key={s}><span className="check">✓</span> {s}</li>
              ))}
            </ul>
          </div>
          <div className="challenges">
            <h3>Growth Edges</h3>
            <ul>
              {typeData.challenges.map((c) => (
                <li key={c}><span className="arrow">→</span> {c}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="result-section growth-path">
          <h2>Your Path to Growth</h2>
          <blockquote>{typeData.growthPath}</blockquote>
        </section>

        {wingDesc && (
          <section className="result-section wing-section">
            <h2>Your Wing: {wingKey}</h2>
            <p>{wingDesc}</p>
            <p className="wing-note">
              Your second-highest score was Type {secondType}, suggesting you borrow some qualities
              from that type — this is called your "wing."
            </p>
          </section>
        )}

        <section className="result-section famous">
          <h2>Famous Type {primary.type}s</h2>
          <div className="famous-list">
            {typeData.famousExamples.map((name) => (
              <span key={name} className="famous-chip">{name}</span>
            ))}
          </div>
        </section>

        <section className="result-section score-breakdown">
          <button className="link-btn show-all-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Hide" : "Show"} full score breakdown
          </button>
          {showAll && (
            <div className="score-bars">
              {ranked.map(({ type, score }) => {
                const maxScore = ranked[0].score || 1;
                const pct = Math.round((score / maxScore) * 100);
                return (
                  <div key={type} className="score-bar-row">
                    <span className="score-label">
                      {enneagramTypes[type].emoji} Type {type}
                    </span>
                    <div className="score-bar-track">
                      <div
                        className="score-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: enneagramTypes[type].color,
                        }}
                      />
                    </div>
                    <span className="score-num">{score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="result-section share-section">
          <h2>Share With Someone You Love</h2>
          <p>
            Understanding personality types can transform relationships. Share this quiz so friends
            and family can discover their own type.
          </p>
          <div className="share-buttons">
            <button className="btn-primary" onClick={copyLink}>
              📋 Copy Quiz Link
            </button>
            <a
              className="btn-secondary share-link"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              Share on X/Twitter
            </a>
          </div>
          <p className="privacy-note">
            This quiz is completely private. No data is collected or stored.
          </p>
        </section>

        <div className="retake-section">
          <button className="btn-secondary" onClick={onRetake}>
            ↩ Retake the Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
