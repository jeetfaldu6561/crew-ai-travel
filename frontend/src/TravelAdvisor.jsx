import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'html2pdf.js';

const TravelAdvisor = () => {
  const [fromCity, setFromCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [interests, setInterests] = useState('');
  const [travelPlan, setTravelPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!fromCity || !destinationCity || !dateFrom || !dateTo || !interests) {
      setError('⚠️ Please fill in all fields before generating your travel plan.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_city: fromCity,
          destination_city: destinationCity,
          date_from: dateFrom,
          date_to: dateTo,
          interests
        })
      });
      const data = await response.json();
      setTravelPlan(data.travel_plan?.raw || 'No plan returned.');
    } catch (err) {
      setError('Something went wrong while generating the plan.');
    } finally {
      setLoading(false);
    }
  };

const downloadPdfFile = async () => {
  const html2pdf = await import('html2pdf.js');
  const element = document.getElementById('travel-plan-content');

  if (element) {
    // Backup original styles
    const originalMaxHeight = element.style.maxHeight;
    const originalOverflowY = element.style.overflowY;

    // Expand content to capture all in PDF
    element.style.maxHeight = "none";
    element.style.overflowY = "visible";

    await html2pdf.default()
      .set({
        margin: 10,
        filename: `Travel_Plan_${destinationCity || 'Trip'}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save();

    // Restore original styles
    element.style.maxHeight = originalMaxHeight;
    element.style.overflowY = originalOverflowY;
  }
};


  return (
    <div style={styles.page}>
      <>
  <style>
    {`
      @keyframes floatText {
        0% { transform: translateX(0); }
        50% { transform: translateX(30px); }
        100% { transform: translateX(0); }
      }
    `}
  </style>

  <div style={styles.headerRow}>
    <h1 style={styles.title}>🌍 TravelGenie</h1>
    <p style={{ ...styles.subtitle, animation: "floatText 3s ease-in-out infinite" }}>
      You don't just plan a trip — you plan an experience, tailored by AI.
    </p>
  </div>
</>
      <div style={styles.contentWrapper}>
        <div style={styles.leftPane}>
          <Input label="🏡 From" value={fromCity} onChange={setFromCity} />
          <Input label="✈️ Destination" value={destinationCity} onChange={setDestinationCity} />
          <Input type="date" label="📅 Departure Date" value={dateFrom} onChange={setDateFrom} />
          <Input type="date" label="📅 Return Date" value={dateTo} onChange={setDateTo} />
          <div>
            <label style={styles.label}>🎯 Your Interests:</label>
            <textarea
              rows="4"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              style={{ ...styles.input, resize: "vertical" }}
              placeholder="e.g., beaches, history, food, hiking"
            />
          </div>
          <button onClick={handleSubmit} style={styles.button} disabled={loading}>
            🚀 Generate Travel Plan
          </button>
          {loading && <p style={styles.info}>⏳ AI is preparing your itinerary...</p>}
          {error && <p style={styles.error}>{error}</p>}
        </div>

        <div style={styles.rightPane}>
          {travelPlan ? (
            <>
              <h2 style={styles.sectionHeader}>✅ Your Travel Plan</h2>
              <div id="travel-plan-content" style={styles.planBox}>
                <ReactMarkdown>{travelPlan}</ReactMarkdown>
              </div>
              <button onClick={downloadPdfFile} style={{ ...styles.button, marginTop: "1rem" }}>
                📝 Download as PDF
              </button>
            </>
          ) : (
            <>
  <style>
    {`
 @keyframes fadeInItem {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}
  </style>

  <div style={styles.placeholderBox}>
    <h2 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "1rem" }}>
      ✨ Why use TravelGenie?
    </h2>
    <ul style={styles.bulletList}>
      <li style={{ ...styles.bulletItem, animationDelay: "0s" }}>
        🧠 Personalized trip plans tailored to your interests
      </li>
      <li style={{ ...styles.bulletItem, animationDelay: "1.5s" }}>
        🌐 Real-time AI-powered suggestions for any destination
      </li>
      <li style={{ ...styles.bulletItem, animationDelay: "3s" }}>
        📅 Ideal for quick, efficient itinerary generation
      </li>
      <li style={{ ...styles.bulletItem, animationDelay: "4.5s" }}>
        🧳 Great for solo, group, or family travel
      </li>
      <li style={{ ...styles.bulletItem, animationDelay: "6s" }}>
        📥 Download your travel plan as a ready-to-go PDF
      </li>
    </ul>
  </div>
</>

          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label style={styles.label}>{label}:</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.input}
    />
  </div>
);

// Styles
const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: "url('./Images/hero.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  headerRow: {
  display: "flex",
  width: "100%",
  marginBottom: "2rem"
},
  title: {
    flex: "0 0 30%",
  fontSize: "4rem",
  fontWeight: "bold",
  color: "#000000", // black
  margin: 0,
    animation: "fadeIn 2s ease-in-out"
  },
  subtitle: {
    flex: "0 0 70%",
  fontSize: "2.5rem",
  display: "flex",
  alignItems: "center",
  color: "#000000", // black
  margin: 0,
  paddingLeft: "1rem",
  animation: "floatText 3s ease-in-out infinite"
  },
  contentWrapper: {
    display: "flex",
    width: "100%",
    maxWidth: "1200px",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  },
  leftPane: {
    flex: 1,
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  rightPane: {
    flex: 1,
    padding: "2rem",
    borderLeft: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  label: {
    display: "block",
    marginBottom: "0.3rem",
    fontWeight: "600",
    color: "#334155"
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    backgroundColor: "#f8fafc"
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
  },
  error: {
    marginTop: "1rem",
    color: "#dc2626",
    fontWeight: "500"
  },
  info: {
    marginTop: "1rem",
    color: "#1d4ed8",
    fontWeight: "500"
  },
  sectionHeader: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#0f172a"
  },
  planBox: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    maxHeight: "400px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    color: "#1e293b"
  },
  placeholderBox: {
    backgroundColor: "#f1f5f9",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px dashed #cbd5e1",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#334155",
  },
  bulletList: {
    listStyleType: "none",
    paddingLeft: 0,
    lineHeight: "1.8",
    fontSize: "1.4rem"
  },

bulletItem: {
  fontSize: "1.5rem",
  marginBottom: "1rem",
  opacity: 0,
  animation: "fadeInItem 1s forwards",
}
};

export default TravelAdvisor;
