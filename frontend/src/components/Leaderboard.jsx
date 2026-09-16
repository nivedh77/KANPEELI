import React, {
  useEffect,
  useState
} from "react";
import { getLeaderboard, clearLeaderboardApi } from "../services/api";

function Leaderboard({ refreshTrigger }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("lashes");
  const [showMovieTwins, setShowMovieTwins] = useState(true);

  useEffect(() => {
    fetchScores();
  }, [refreshTrigger]);

  async function fetchScores() {
    setLoading(true);
    let serverScores = [];
    try {
      const data = await getLeaderboard();
      serverScores = Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn("Could not fetch remote leaderboard, displaying local record:", err);
    }

    try {
      const localScores = JSON.parse(localStorage.getItem("kanpeeli_leaderboard") || localStorage.getItem("kannpeeli_leaderboard") || "[]");
      const combined = [...localScores, ...serverScores];
      const seen = new Set();
      const deduplicated = [];
      for (const item of combined) {
        const key = item.id || `${item.name}-${item.lashes}-${item.timestamp}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduplicated.push(item);
        }
      }
      setEntries(deduplicated);
    } catch (e) {
      setEntries(serverScores);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearLeaderboard() {
    if (window.confirm("Are you sure you want to clear past participants from the leaderboard?")) {
      try {
        localStorage.removeItem("kanpeeli_leaderboard");
        localStorage.removeItem("kannpeeli_leaderboard");
        await clearLeaderboardApi();
      } catch (err) {
        console.warn("Remote clear failed:", err);
      }
      setEntries([]);
    }
  }

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === "lashes") return (b.lashes || 0) - (a.lashes || 0);
    if (sortBy === "score") return (b.score || 0) - (a.score || 0);
    return 0;
  });

  const maxLashes = Math.max(...sortedEntries.map(e => e.lashes || 0), 250);

  function getTier(lashes) {
    if (lashes >= 200) return "elite";
    if (lashes >= 150) return "solid";
    if (lashes >= 80) return "modest";
    return "minimal";
  }

  return (
    <section className="leaderboard-section" id="rankings">
      <div className="rankings-header-row">
        <div>
          <span className="section-tag coral">03 / THE PUBLIC RECORD</span>
          <h2 className="rankings-title">
            The lash<br />
            <span className="coral-highlight">rankings.</span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          {/* Toggle Movie Twins */}
          <button
            type="button"
            className={`btn-neo ${showMovieTwins ? "btn-lime" : "btn-cream"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            onClick={() => setShowMovieTwins(!showMovieTwins)}
          >
            {showMovieTwins ? "👁️ Hide Movie Eyes" : "🎭 Show Movie Twins"}
          </button>

          {/* Reset Leaderboard */}
          <button
            type="button"
            className="btn-neo btn-cream"
            style={{ padding: "0.5rem 0.85rem", fontSize: "0.85rem", color: "var(--coral-accent)" }}
            onClick={handleClearLeaderboard}
            title="Reset all past participant entries"
          >
            🗑️ Clear Board
          </button>

          <div className="sort-select-box">
            <span>SORT BY</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="select-styled"
            >
              <option value="lashes">Most lashes</option>
              <option value="score">Highest score</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ranking-cards-list">
        {loading && entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", fontFamily: "var(--font-mono)" }}>
            Loading the public record...
          </div>
        ) : sortedEntries.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            background: "#ffffff",
            border: "var(--border-thick)",
            borderRadius: "16px",
            boxShadow: "var(--shadow-neo-sm)"
          }}>
            <span style={{ fontSize: "2.5rem" }}>👁️</span>
            <h4 style={{ fontFamily: "var(--font-display)", margin: "0.5rem 0", fontSize: "1.3rem" }}>
              Leaderboard is Empty
            </h4>
            <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem" }}>
              No past participant data showing. Be the very first to submit your eyelashes!
            </p>
          </div>
        ) : (
          sortedEntries.map((item, index) => {
            const rank = index + 1;
            const count = item.lashes || 0;
            const widthPct = Math.min(Math.max((count / maxLashes) * 100, 15), 100);
            const tier = item.classification === "elite" || item.classification === "solid"
              ? item.classification
              : getTier(count);

            const movieChar = item.movie_character || "Dashamoolam Damu";
            const movieTitle = item.character_movie || "Chattambinadu";
            const eyeImage = item.character_image || "/memes/damu_eyes.jpg";

            return (
              <div className="ranking-card-item" key={item.id || index}>
                <span className="rank-index">{String(rank).padStart(2, "0")}</span>
                
                <div style={{ display: "flex", flexDirection: "column", minWidth: "160px" }}>
                  <span className="rank-subject-name" title={item.name}>{item.name}</span>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--ink-muted)" }}>
                    {item.timestamp || "Just now"}
                  </span>
                </div>

                {/* Show Movie Character & Eye Strip if enabled */}
                {showMovieTwins && (
                  <div className="leaderboard-movie-match">
                    <div className="leaderboard-eye-thumb">
                      <img
                        src={eyeImage}
                        alt={movieChar}
                        className="leaderboard-eye-img"
                        onError={(e) => {
                          e.target.src = "/memes/damu_eyes.jpg";
                        }}
                      />
                    </div>
                    <div className="leaderboard-movie-meta">
                      <span className="leaderboard-character-name">🎭 {movieChar}</span>
                      <span className="leaderboard-film-name">{movieTitle}</span>
                    </div>
                  </div>
                )}

                <div className="rank-bar-track">
                  <div
                    className="rank-bar-fill"
                    style={{ width: `${widthPct}%` }}
                  ></div>
                </div>

                <span className="rank-tier-tag">{tier}</span>

                <span className="rank-count-val">
                  {count} <span>lashes</span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Leaderboard;