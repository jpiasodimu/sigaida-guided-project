"use client";

import { useState } from "react";
import ReactMarkdown from 'react-markdown';

const days = ["M", "T", "W", "R", "F"];
const terms = ["A", "B", "Full Semester"];
  
const GENED_TREE = [
  {
    id: "ac",
    label: "Advanced Composition",
    subs: []
  },
  {
    id: "cs",
    label: "Cultural Studies",
    subs: [
      { id: "cs-usm", label: "Cultural Studies - US Minority", note: "" },
      { id: "cs-nw",  label: "Cultural Studies - Non-West", note: "" },
      { id: "cs-wcc", label: "Cultural Studies - Western", note: "" },
    ],
  },
  {
    id: "ha",
    label: "Humanities & the Arts",
    subs: [
      { id: "ha-hpp", label: "Humanities - Hist & Phil", note: "" },
      { id: "ha-la",  label: "Humanities - Lit & Arts", note: "" },
    ],
  },
  {
    id: "ns",
    label: "Natural Sciences & Technology",
    subs: [
      { id: "ns-ps", label: "Nat Sci & Tech - Phys Sciences", note: "" },
      { id: "ns-ls", label: "Nat Sci & Tech - Life Sciences", note: "" },
    ],
  },
  {
    id: "qr",
    label: "Quantitative Reasoning",
    subs: [
      { id: "qr-1", label: "Quantitative Reasoning I", note: "" },
      { id: "qr-2", label: "Quantitative Reasoning II", note: "" },
    ],
  },
  {
    id: "sb",
    label: "Social & Behavioral Sciences",
    subs: [
      { id: "sb-ss", label: "Social & Beh Sci - Soc Sci", note: "" },
      { id: "sb-bs", label: "Social & Beh Sci - Beh Sci", note: "" },
    ],
  },
];

export default function Page() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [openCats, setOpenCats] = useState<string[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [credits, setCredits] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const toggle = (arr: string[], setArr: (arr: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    const allSubs = GENED_TREE.flatMap(cat =>
      cat.subs.length === 0 ? [{ id: cat.id, label: cat.label, note: "" }] : cat.subs
    ); //puts all categories into one array
    const finalSelectedSubs = new Array(selectedSubs.length);
    for (let i = 0; i < selectedSubs.length; i++) {
      const match = allSubs.find(sub => sub.id === selectedSubs[i]);
      if (match === undefined) {
        finalSelectedSubs[i]= "";
      } else {
        finalSelectedSubs[i] = match.label;
      }
    }
    const finalSelectedTerms = selectedTerms.map(term => term === "Full Semester" ? "1" : term);
    try {
      const response = await fetch("http://localhost:5001/filter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          selectedSubs: finalSelectedSubs,
          credits: credits,
          selectedDays: selectedDays,
          selectedTerms: finalSelectedTerms,
          startTime: startTime,
          endTime: endTime
          }),
      });
      const courses = await response.json();
      let courseData = "";
      if (courses.length === 0) {
        courseData = "No courses found matching the student's preferences.";
      } else {
        courseData = courses.map((course: any)  => { return `${course.Subject} ${course.Number} - ${course.Name} 
        Type: ${course.Type} | Days: ${course["Days of Week"]} 
        Time: ${course["Start Time"]} - ${course["End Time"]} 
        Credits: ${course["Credit Hours"]} | Degree Attributes: ${course["Degree Attributes"]}
        Building: ${course.Building} | Room: ${course.Room}
        Instructor: ${course.Instructors}`}).join("\n\n");
      }
      
      
      const prompt = `You are a helpful UIUC course advisor. A student is looking for gen-ed course recommendations. 
      Your job is to engage with the student in a warm, friendly tone, and provide course recommendations 
      tailored to their specified preferences in the form they will complete. 

      Here are the courses matching the student's filtered preferences:
      ${courseData}
      (each course will include the Subject, Course Number, Name, Credit Hours, Days of Week, Start Time, End Time, Degree Attributes, Type, Instructors, Building, Room #)

      Only recommend 3-5 courses from the list provided above, don't suggest courses not in the given data.
      Using the course description provided, provide a course summary about the highlights of the class - specifically anything that aligns with the student's "Extra Preferences."
      The summary should implement a warm, lively tone, that will excite the student about the course! Also, provide additional information about the course, preferably in this format.
      "Based on your preferences, I would suggest these courses..."
      {**Subject** **Course Number**: **Name** | **Course Type**} 
      **Meeting Days**: Days of Week 
      **Location**: {Building} + {**Room** #}
      **Time**: Start Time - End Time
      **Credit Hours**: {Credit Hours}
      **Instructor**: {Instructor}
      Brief Description here: {Description} - If the description is brief, provide a description based on the Course Subject and Degree Attributes
      If the student provides any extra preferences, explain how each course aligns with those preferences specifically.

      Their preferences:
      - Gen-ed subcategories: ${selectedSubs.length ? selectedSubs.join(", ") : "Any"}
      - Credit hours: ${credits || "Any"}
      - Part of term: ${selectedTerms.length ? selectedTerms.join(", ") : "Any"}
      - Preferred days: ${selectedDays.length ? selectedDays.join(", ") : "Any"}
      - Preferred time range: ${startTime && endTime ? `${startTime} – ${endTime}` : "Any"}
      - Extra preferences: ${extra || "None"}
      For courses with multiple parts, such as Discussion/Recitation and Lectures, provide a brief disclaimer that the student will need to check Course Explorer 
      to verify that the other parts will align with their schedule.
      Feel free to add in a few emojis (appropriate for school/course context) to keep things lively!
      Please avoid unnecessary spacing between lines.
      If there are no matches, apologize and suggest that the user change their filters slightly to find courses that may better match their needs.
      `;

        //this is calling Claude to get a response for the user
      const res = await fetch("http://localhost:5001/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({prompt: prompt})});
        const data = await res.json();
        const text = data.response;
        setResult(text);   
  } catch (e) {
    setResult("Something went wrong. Please try again.");
  }
    setLoading(false);

  };
  

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", background: "#faf7f2", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #faf7f2; }

        .page { font-family: 'DM Sans', sans-serif; }

        .hero-bar {
          background: #13294B;
          color: #faf7f2;
          padding: 14px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hero-bar-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .hero-bar-logo {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .hero {
          background: #e8e0d4;
          border-bottom: 2px solid #13294B;
          padding: 64px 48px 56px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: "✦";
          position: absolute;
          right: 60px;
          top: 40px;
          font-size: 96px;
          color: #c5b89a;
          opacity: 0.5;
          line-height: 1;
        }
        .hero-kicker {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #7a6e5f;
          margin-bottom: 16px;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900;
          line-height: 1.05;
          color: #1a1a1a;
          max-width: 640px;
        }
        .hero-title em {
          font-style: italic;
          color: #E84A27;
        }
        .hero-sub {
          margin-top: 20px;
          font-size: 16px;
          color: #5a5248;
          max-width: 480px;
          line-height: 1.65;
          font-weight: 300;
        }

        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px 80px;
          align-items: start;
        }
        @media (max-width: 820px) {
          .layout { grid-template-columns: 1fr; padding: 0 24px 60px; }
          .hero { padding: 40px 24px; }
          .hero-bar { padding: 14px 24px; }
        }

        .form-col {
          padding: 48px 48px 48px 0;
          border-right: 1.5px solid #d4ccc0;
        }
        @media (max-width: 820px) {
          .form-col { border-right: none; padding: 40px 0 0; }
        }

        .result-col {
          padding: 48px 0 48px 48px;
          position: sticky;
          top: 24px;
        }
        @media (max-width: 820px) {
          .result-col { padding: 32px 0 0; }
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9a8e7e;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #d4ccc0;
        }

        .field-group {
          margin-bottom: 32px;
        }

        .field-label {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
          display: block;
        }

        .styled-select {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231a1a1a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 18px center;
          border: 1.5px solid #c5bdb0;
          border-radius: 4px;
          padding: 13px 44px 13px 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .styled-select:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(26,26,26,0.08);
        }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chip {
          border: 1.5px solid #c5bdb0;
          background: #fff;
          border-radius: 3px;
          padding: 8px 18px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          user-select: none;
          font-weight: 400;
          color: #5a5248;
        }
        .chip:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .chip.active {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #faf7f2;
        }

        .time-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .time-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9a8e7e;
          margin-bottom: 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .styled-time {
          width: 100%;
          border: 1.5px solid #c5bdb0;
          background: #fff;
          border-radius: 4px;
          padding: 12px 14px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          transition: border-color 0.2s;
        }
        .styled-time:focus {
          outline: none;
          border-color: #1a1a1a;
        }

        .styled-textarea {
          width: 100%;
          border: 1.5px solid #c5bdb0;
          background: #fff;
          border-radius: 4px;
          padding: 14px 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          resize: vertical;
          line-height: 1.6;
          transition: border-color 0.2s;
        }
        .styled-textarea:focus {
          outline: none;
          border-color: #1a1a1a;
        }
        .styled-textarea::placeholder { color: #b0a898; }

        .submit-btn {
          width: 100%;
          background: #1a1a1a;
          color: #faf7f2;
          border: none;
          border-radius: 4px;
          padding: 16px 24px;
          font-size: 15px;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn:hover:not(:disabled) { background: #3d352c; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .result-placeholder {
          border: 1.5px dashed #c5bdb0;
          border-radius: 4px;
          padding: 40px 32px;
          text-align: center;
          color: #b0a898;
        }
        .result-placeholder-icon { font-size: 36px; margin-bottom: 12px; }
        .result-placeholder-text { font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic; }
        .result-placeholder-sub { font-size: 13px; margin-top: 6px; font-family: 'DM Sans', sans-serif; }

        .result-card {
          background: #fff;
          border: 1.5px solid #d4ccc0;
          border-radius: 4px;
          overflow: hidden;
        }
        .result-card-header {
          background: #1a1a1a;
          color: #faf7f2;
          padding: 16px 24px;
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .result-card-body {
          padding: 24px;
          font-size: 14.5px;
          line-height: 1.75;
          color: #3d352c;
          font-family: 'DM Sans', sans-serif;
          white-space: pre-wrap;
          max-height: 620px;
          overflow-y: auto;
        }
        
        .result-card-body strong {
          font-weight: bold;
        }

        .result-card-body h3 {
           font-size: 1.2em;
           font-weight: bold;
        }


        .loading-dots span {
          display: inline-block;
          width: 6px; height: 6px;
          background: #faf7f2;
          border-radius: 50%;
          margin: 0 2px;
          animation: bounce 1.2s infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        .divider { height: 1.5px; background: #d4ccc0; margin: 28px 0; }

        .ornament {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #c5b89a;
          font-size: 12px;
          letter-spacing: 0.3em;
          margin-bottom: 28px;
        }
        .ornament::before, .ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #d4ccc0;
        }
      `}</style>

      <div className="page">
        {/* Top bar */}
        <div className="hero-bar">
          <span className="hero-bar-label">University of Illinois · Urbana-Champaign</span>
          <span className="hero-bar-logo">GEN•ED</span>
          <span className="hero-bar-label">Course Finder</span>
        </div>

        {/* Hero */}
        <div className="hero">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p className="hero-kicker">✦ AI-Powered Advising Tool · Spring 2026</p>
            <h1 className="hero-title">Find your next <em>great</em> gen-ed course.</h1>
            <p className="hero-sub">
              Share your schedule constraints and interests — our AI advisor will match you with the best-fit options from the UIUC catalog.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="layout">
          {/* Form */}
          <div className="form-col">
            <div className="ornament">PREFERENCES</div>

            <div className="field-group">
              <span className="section-label">Category</span>
              <label className="field-label">Gen-Ed Requirement</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {GENED_TREE.map(cat => {
                  const isOpen = openCats.includes(cat.id);
                  const isSingle = cat.subs.length === 0;
                  const isSelected = isSingle && selectedSubs.includes(cat.id);
                  const anySubSelected = isSingle ? isSelected : cat.subs.some(s => selectedSubs.includes(s.id));
                  const handleCatClick = () => {
                    if (isSingle) {
                      setSelectedSubs(isSelected ? selectedSubs.filter(id => id !== cat.id) : [...selectedSubs, cat.id]);
                    } else {
                      setOpenCats(isOpen ? openCats.filter(id => id !== cat.id) : [...openCats, cat.id]);
                    }
                  };
                  return (
                    <div key={cat.id} style={{ border: "1.5px solid", borderColor: anySubSelected ? "#1a1a1a" : "#c5bdb0", borderRadius: 4, overflow: "hidden", background: "#fff" }}>
                      <div
                        onClick={handleCatClick}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", cursor: "pointer", background: anySubSelected ? "#1a1a1a" : "#fff", transition: "background 0.15s" }}
                      >
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: anySubSelected ? 600 : 400, color: anySubSelected ? "#faf7f2" : "#1a1a1a" }}>{cat.label}</span>
                        {isSingle
                          ? <div style={{ width: 16, height: 16, border: "1.5px solid", borderColor: isSelected ? "#faf7f2" : "#c5bdb0", borderRadius: 3, background: isSelected ? "#faf7f2" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{isSelected && <span style={{ color: "#1a1a1a", fontSize: 10 }}>✓</span>}</div>
                          : <span style={{ fontSize: 10, color: anySubSelected ? "#c5b89a" : "#9a8e7e", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
                        }
                      </div>
                      {isOpen && (
                        <div style={{ borderTop: "1px solid #e8e0d4", padding: "10px 16px 12px", display: "flex", flexDirection: "column", gap: 8, background: "#faf7f2" }}>
                          {cat.subs.map(sub => {
                            const checked = selectedSubs.includes(sub.id);
                            return (
                              <label key={sub.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                                <div
                                  onClick={() => setSelectedSubs(checked ? selectedSubs.filter(id => id !== sub.id) : [...selectedSubs, sub.id])}
                                  style={{ marginTop: 2, width: 16, height: 16, border: "1.5px solid", borderColor: checked ? "#1a1a1a" : "#c5bdb0", borderRadius: 3, background: checked ? "#1a1a1a" : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                                >
                                  {checked && <span style={{ color: "#faf7f2", fontSize: 10, lineHeight: 1 }}>✓</span>}
                                </div>
                                <div>
                                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#3d352c" }}>{sub.label}</span>
                                  {sub.note && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9a8e7e", marginTop: 2, lineHeight: 1.5 }}>{sub.note}</p>}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="field-group">
              <span className="section-label">Load</span>
              <label className="field-label">Credit Hours</label>
              <select className="styled-select" value={credits} onChange={e => setCredits(e.target.value)}>
                <option value="">Any credit count</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} credit{n > 1 ? "s" : ""}</option>)} 
              </select>  
            </div>

            <div className="field-group">
              <span className="section-label">Semester Portion</span>
              <label className="field-label">Part of Term</label>
              <div className="chip-row">
                {terms.map(t => (
                  <div
                    key={t}
                    className={`chip${selectedTerms.includes(t) ? " active" : ""}`}
                    onClick={() => toggle(selectedTerms, setSelectedTerms, t)}
                  >{t}</div>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div className="field-group">
              <span className="section-label">Schedule</span>
              <label className="field-label">Days of the Week</label>
              <div className="chip-row">
                {days.map(d => (
                  <div
                    key={d}
                    className={`chip${selectedDays.includes(d) ? " active" : ""}`}
                    onClick={() => toggle(selectedDays, setSelectedDays, d)}
                    style={{ minWidth: 48, textAlign: "center" }}
                  >{d}</div>
                ))}
              </div>
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
                {[
                  ["M", "Monday"],
                  ["T", "Tuesday"],
                  ["W", "Wednesday"],
                  ["R", "Thursday"],
                  ["F", "Friday"],
                ].map(([key, full]) => (
                  <span key={key} style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: "#9a8e7e", letterSpacing: "0.04em" }}>
                    <span style={{ fontWeight: 600, color: "#6b5d4f" }}>{key}</span> = {full}
                  </span>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Preferred Time Window</label>
              <div className="time-row">
                <div>
                  <p className="time-label">Earliest Start</p>
                  <input type="time" className="styled-time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div>
                  <p className="time-label">Latest End</p>
                  <input type="time" className="styled-time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#9a8e7e", marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
                e.g. 10:00 – 14:00 filters out early morning &amp; evening sections
              </p>
            </div>

            <div className="divider" />

            <div className="field-group">
              <span className="section-label">Open-Ended</span>
              <label className="field-label">Additional Preferences</label>
              <textarea
                className="styled-textarea"
                rows={4}
                placeholder="e.g. I want a light workload, something interesting for an international student, no Friday classes…"
                value={extra}
                onChange={e => setExtra(e.target.value)}
              />
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>Thinking <span className="loading-dots"><span/><span/><span/></span></>
              ) : (
                <>✦ &nbsp; Ask AI for Recommendations</>
              )}
            </button>
          </div>

          {/* Result */}
          <div className="result-col">
            <div className="ornament">RECOMMENDATIONS</div>

            {!result && !loading && (
              <div className="result-placeholder">
                <div className="result-placeholder-icon">✦</div>
                <div className="result-placeholder-text">Your recommendations will appear here.</div>
                <div className="result-placeholder-sub">Fill in the form and click the button to get started.</div>
              </div>
            )}

            {loading && (
              <div className="result-placeholder">
                <div className="result-placeholder-icon" style={{ animation: "bounce 1s infinite" }}>◎</div>
                <div className="result-placeholder-text">Consulting the course catalog…</div>
                <div className="result-placeholder-sub">Finding the best matches for you.</div>
              </div>
            )}

            {result && (
              <div className="result-card">
                <div className="result-card-header">
                  ✦ &nbsp; AI Course Recommendations
                </div>
                <div className="result-card-body"><ReactMarkdown>{result}</ReactMarkdown></div>
              </div>
            )}

            {!result && (
              <div style={{ marginTop: 32, padding: "24px 0", borderTop: "1.5px solid #d4ccc0" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: "italic", color: "#9a8e7e", lineHeight: 1.7 }}>
                  "The purpose of a liberal education is not to teach you a trade, but to teach you to think."
                </p>
                <p style={{ fontSize: 11, color: "#b0a898", marginTop: 8, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>
                  — On gen-ed requirements
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
