import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    title: '',
    tone: 'Professional',
    wordLength: '50-100',
    platform: 'LinkedIn'
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(''); // Clear previous generation

    try {
      // Connect to your local .NET Minimal API streaming endpoint
      const response = await fetch('http://elitesocialcontent.runasp.net/api/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to connect to backend");

      // Set up the streaming reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: !done });
        
        // This instantly adds the new word chunk to the screen!
        setResult((prevText) => prevText + chunk);
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setResult("Error connecting to server. Make sure your .NET backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🚀 AI Content Engine</h1>
        <p>Generate optimized social media copies instantly</p>
      </header>

      <div style={styles.grid}>
        {/* Form Column */}
        <div style={styles.card}>
          <form onSubmit={handleGenerate} style={styles.form}>
            <div style={styles.group}>
              <label style={styles.label}>What is your content topic/title?</label>
              <textarea
                style={styles.textarea}
                placeholder="e.g., 5 key habits of successful software engineers..."
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Select Social Platform</label>
              <select style={styles.select} value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}>
                <option>LinkedIn</option>
                <option>Instagram</option>
                <option>Twitter</option>
                <option>Facebook</option>
                <option>SnapChat</option>
                <option>Website/Blog</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Tone of Voice</label>
              <select style={styles.select} value={formData.tone} onChange={e => setFormData({...formData, tone: e.target.value})}>
                <option>Professional</option>
                <option>Friendly</option>
                <option>Humorous</option>
                <option>Casual</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Word Length</label>
              <select style={styles.select} value={formData.wordLength} onChange={e => setFormData({...formData, wordLength: e.target.value})}>
                <option>1-50</option>
                <option>50-100</option>
                <option>100-200</option>
                <option>Custom (Detailed)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={loading ? styles.btnDisabled : styles.btn}>
              {loading ? 'AI is Writing...' : 'Generate Live Content'}
            </button>
          </form>
        </div>

        {/* Live Output Column */}
        <div style={styles.card}>
          <h2 style={styles.outputTitle}>🎯 Platform Live Output ({formData.platform})</h2>
          <div style={styles.outputArea}>
            {result ? (
              <p style={styles.outputText}>{result}</p>
            ) : (
              <p style={styles.placeholder}>Fill out the parameters and click generate to stream your live copy here...</p>
            )}
          </div>
          {result && !loading && (
            <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(result)}>
              Copy to Clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', color: '#333' },
  header: { textAlign: 'center', marginBottom: '40px' },
  grid: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  card: { flex: '1 1 450px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  group: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: '600', fontSize: '14px', color: '#555' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '100px', fontSize: '15px', resize: 'vertical' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px', background: '#fff' },
  btn: { background: '#0070f3', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' },
  btnDisabled: { background: '#ccc', color: '#666', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed' },
  outputTitle: { fontSize: '18px', marginBottom: '15px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px' },
  outputArea: { background: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '8px', padding: '20px', flexGrow: 1, minHeight: '250px' },
  outputText: { whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '15px', margin: 0 },
  placeholder: { color: '#999', fontStyle: 'italic', margin: 0 },
  copyBtn: { marginTop: '15px', padding: '10px', background: '#eaeaea', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};