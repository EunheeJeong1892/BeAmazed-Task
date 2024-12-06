import React, { useState } from "react";
import axios from "axios";

const IntroGenerator: React.FC = () => {
  const [script, setScript] = useState("");
  const [intro, setIntro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIntro = async () => {
    if (!script.trim()) return alert("Please paste a video script.");

    setLoading(true);
    setError(null);
    setIntro(null);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional YouTube content creator. Write a catchy intro from a given video script.",
            },
            { role: "user", content: script },
          ],
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedIntro = response.data.choices[0].message.content.trim();
      setIntro(generatedIntro);
    } catch (err) {
      setError("Failed to generate intro. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const copyIntro = () => {
    if (intro) {
      navigator.clipboard
        .writeText(intro)
        .then(() => {
          alert("Intro copied to clipboard!");
        })
        .catch((err) => {
          alert("Failed to copy text: " + err);
        });
    }
  };

  return (
    <div className="intro-generator">
      <h1 className="title">🎥 YouTube Intro Generator</h1>
      <div className="content-container">
        <div className="input-section">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your video script here..."
            rows={30}
          ></textarea>
          <button onClick={generateIntro} disabled={loading}>
            {loading ? "Generating..." : "Generate Intro"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="result-section">
          {loading && (
            <div className="progress-container">
              <div className="progress-bar"></div>
            </div>
          )}
          {intro && (
            <>
              <div className="result">
                <h2>Generated Intro:</h2>
                <p>{intro}</p>
              </div>
              <button onClick={copyIntro} disabled={loading}>
                Copy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroGenerator;
