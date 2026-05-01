"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#faf7f2", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card {
          background: #fff;
          border: 1.5px solid #d4ccc0;
          border-radius: 4px;
          padding: 40px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .card:hover {
          border-color: #13294B;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(19,41,75,0.12);
        }
        .accent-bar {
          height: 3px;
          width: 32px;
          background: #E84A27;
          border-radius: 2px;
        }
        .card-icon {
          font-size: 36px;
          line-height: 1;
        }
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .card-desc {
          font-size: 15px;
          color: #5a5248;
          font-weight: 300;
          line-height: 1.65;
        }
        .card-cta {
          margin-top: auto;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9a8e7e;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card:hover .card-cta {
          color: #E84A27;
        }
      `}</style>

      {/* Top bar */}
      <div style={{ background: "#13294B", color: "#faf7f2", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.6 }}>University of Illinois · Urbana-Champaign</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.04em" }}>ANYHOO</span>
        <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.6 }}>Guided Project</span>
      </div>

      {/* Hero */}
      <div style={{ background: "#e8e0d4", borderBottom: "2px solid #13294B", padding: "64px 48px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a6e5f", marginBottom: 16 }}>✦ AI Tools · Spring 2026</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.05, color: "#1a1a1a", maxWidth: 640 }}>
            What would you like to <em style={{ fontStyle: "italic", color: "#E84A27" }}>explore</em>?
          </h1>
          <p style={{ marginTop: 20, fontSize: 16, color: "#5a5248", maxWidth: 480, lineHeight: 1.65, fontWeight: 300 }}>
            Two tools built for UIUC students — find the right gen-ed course or check your bus before you leave.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        <div className="card" onClick={() => router.push("/courses")}>
          <div className="accent-bar"></div>
          <div className="card-icon">📚</div>
          <div className="card-title">Gen-Ed Course Finder</div>
          <div className="card-desc">
            Find UIUC gen-ed courses that fit your schedule, credit requirements, and interests — filtered from real catalog data.
          </div>
          <div className="card-cta">Open tool →</div>
        </div>

        <div className="card" onClick={() => router.push("/bus.html")}>
          <div className="accent-bar"></div>
          <div className="card-icon">🚌</div>
          <div className="card-title">Bus Delay Predictor</div>
          <div className="card-desc">
            Check expected delays for the 4 MTD routes — Gold, Illini, Silver, and Teal — based on historical data by hour of day.
          </div>
          <div className="card-cta">Open tool →</div>
        </div>

      </div>
    </div>
  );
}
