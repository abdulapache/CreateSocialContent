import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [formData, setFormData] = useState({
    title: '',
    tone: 'Professional',
    wordLength: '50-100',
    platform: 'LinkedIn',
    language: 'English'
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('https://elitesocialcontent.runasp.net/api/generate-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to connect to production backend");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setResult((prevText) => prevText + chunk);
      }

    } catch (error) {
      console.error("Streaming error:", error);
      setResult("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column text-dark app-font">

      {/* ⚡ NAVIGATION BAR */}
      <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="navbar-brand d-flex align-items-center gap-2 m-0 h5 fw-bold text-dark">
            <span>⚡</span>
            <span>Elite<span className="text-primary">Content</span></span>
            <span className="badge bg-primary-light text-primary rounded-pill fs-7 ms-2 py-1 px-2 fw-semibold">v1.0 Beta</span>
          </div>
          <div className="navbar-nav">
            <span className="nav-link text-primary fw-semibold active fs-6" style={{ cursor: 'pointer' }}>Workspace</span>
          </div>
        </div>
      </nav>


      <div className="container py-5 flex-grow-1">
        <div className="row g-4 align-items-stretch flex-wrap-reverse">

          <div className="col-12 col-xl-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100">
              <div className="border-bottom pb-3 mb-4">
                <h2 className="h5 fw-bold text-dark mb-1">Content Parameters</h2>
                <p className="small text-muted mb-0">Configure your AI generation settings below</p>
              </div>

              <form onSubmit={handleGenerate} className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <label className="form-label small fw-bold text-dark mb-0">What is your topic or title?</label>
                  <textarea
                    className="form-control bg-light border px-3 py-2.5 rounded-3 fs-6 text-dark"
                    rows="5"
                    placeholder="Describe your post topic or paste a title here..."
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6 d-flex flex-column gap-2">
                    <label className="form-label small fw-bold text-dark mb-0">Social Account</label>
                    <select className="form-select bg-light border px-3 py-2.5 rounded-3 fs-6 text-dark" value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })}>
                      <option>LinkedIn</option>
                      <option>Instagram</option>
                      <option>Twitter</option>
                      <option>Facebook</option>
                      <option>SnapChat</option>
                      <option>Website/Blog</option>
                    </select>
                  </div>

                  <div className="col-12 col-sm-6 d-flex flex-column gap-2">
                    <label className="form-label small fw-bold text-dark mb-0">Tone of Voice</label>
                    <select className="form-select bg-light border px-3 py-2.5 rounded-3 fs-6 text-dark" value={formData.tone} onChange={e => setFormData({ ...formData, tone: e.target.value })}>
                      <option>Professional</option>
                      <option>Friendly</option>
                      <option>Humorous</option>
                      <option>Casual</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6 d-flex flex-column gap-2">
                    <label className="form-label small fw-bold text-dark mb-0">Output Language</label>
                    <select className="form-select bg-light border px-3 py-2.5 rounded-3 fs-6 text-dark" value={formData.language || 'English'} onChange={e => setFormData({ ...formData, language: e.target.value })}>
                      <option>English</option>
                      <option>Urdu</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Korean</option>
                      <option>Chinese</option>
                      <option>Arabic</option>
                      <option>German</option>
                      <option>Russian</option>
                      <option>Hindi</option>
                    </select>
                  </div>

                  <div className="col-12 col-sm-6 d-flex flex-column gap-2">
                    <label className="form-label small fw-bold text-dark mb-0">Word Length</label>
                    <select className="form-select bg-light border px-3 py-2.5 rounded-3 fs-6 text-dark" value={formData.wordLength} onChange={e => setFormData({ ...formData, wordLength: e.target.value })}>
                      <option>1-50 words</option>
                      <option>50-100 words</option>
                      <option>100-200 words</option>
                      <option>Custom (Detailed Content)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-100 mt-2 py-2.5 rounded-3 fw-bold fs-6 shadow-sm d-flex justify-content-center align-items-center gap-2">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Generating Magic...</span>
                    </>
                  ) : 'Generate Content'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-12 col-xl-7 d-flex flex-column">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100 d-flex flex-column">

              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start border-bottom pb-3 mb-4 gap-2">
                <div>
                  <h2 className="h5 fw-bold text-dark mb-1">Generated Output Preview</h2>
                  <p className="small text-muted mb-0">Real-time copy tailored for your audience</p>
                </div>
                <div className="d-flex gap-2">
                  <span className="badge bg-light border text-secondary rounded-3 px-3 py-2 fw-bold text-uppercase fs-7">{formData.language}</span>
                  <span className="badge bg-light border text-secondary rounded-3 px-3 py-2 fw-bold text-uppercase fs-7">{formData.platform}</span>
                </div>
              </div>

              {/* Output Display Area Container */}
              <div className="bg-light border rounded-3 flex-grow-1 d-flex flex-column" style={{ minHeight: '440px' }}>
                {result ? (
                  <div className="p-4 overflow-auto">
                    <p className="lh-lg text-dark fs-6 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {result}
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 p-5 text-center my-auto">
                    <div className="display-6 mb-3">📝</div>
                    <h3 className="h6 fw-bold text-dark mb-2">No content generated yet</h3>
                    <p className="small text-muted mx-auto mb-0" style={{ maxWidth: '340px' }}>
                      Fill in the configuration details on the right and click generate to stream your copy instantly.
                    </p>
                  </div>
                )}
              </div>

              {result && !loading && (
                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-outline-secondary px-4 py-2 rounded-3 fw-bold fs-6 shadow-sm" onClick={() => navigator.clipboard.writeText(result)}>
                    <span className="me-2">📋</span> Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 👈 RIGHT PANEL: Form Configuration */}


        </div>
      </div>

    </div>
  );
}

// Global visual system & premium font delivery
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    .app-font {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif !important;
    }
    .fs-7 {
      font-size: 0.75rem;
    }
    .bg-primary-light {
      background-color: #eef2ff !important;
    }
    .rounded-4 {
      border-radius: 1rem !important;
    }
    
    /* Smooth focus states for Bootstrap fields */
    .form-control:focus, .form-select:focus {
      background-color: #ffffff !important;
      border-color: #0d6efd !important;
      box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15) !important;
    }
    
    /* Interactive button transition styling */
    .btn-primary {
      transition: all 0.2s ease-in-out;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25) !important;
    }
  `;
  document.head.appendChild(styleSheet);
}