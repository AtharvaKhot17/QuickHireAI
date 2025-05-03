import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UploadCandidates.css";

const UploadCandidates = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Check if interviewId exists
    if (!interviewId) {
      setError("No interview selected. Please create an interview first.");
      // Redirect to create interview page after 3 seconds
      const timer = setTimeout(() => {
        navigate('/company-dashboard/create-interview');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [interviewId, navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          selectedFile.type === "application/vnd.ms-excel") {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid Excel file (.xlsx or .xls)");
        setFile(null);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!interviewId) {
      setError("No interview selected. Please create an interview first.");
      return;
    }

    if (!file) {
      setError("Please select an Excel file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to upload candidates");
      }

      const response = await fetch(`http://localhost:5000/api/interviews/${interviewId}/upload-candidates`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload candidates");
      }

      setCandidates(data.candidates);
      setSuccess(data.message || "Candidates uploaded successfully!");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("excel-file");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCodes = () => {
    if (!candidates.length) return;

    const csvContent = [
      ["Name", "Email", "Mobile", "Interview Code"],
      ...candidates.map(candidate => [
        candidate.name,
        candidate.email,
        candidate.mobile,
        candidate.code
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview_codes_${interviewId}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadTemplate = () => {
    const headers = ["Email Address", "Student Full Name", "Phone Number"];
    const sampleData = [
      ["student@example.com", "John Doe", "1234567890"],
      ["jane@example.com", "Jane Smith", "9876543210"]
    ];

    const csvContent = [
      headers,
      ...sampleData
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidate_template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!interviewId) {
    return (
      <div className="upload-candidates">
        <div className="error-message">
          No interview selected. Redirecting to create interview page...
        </div>
      </div>
    );
  }

  return (
    <div className="upload-candidates">
      <h1>Upload Candidates</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="upload-section">
        <button 
          className="download-template" 
          onClick={downloadTemplate}
        >
          <i className="fas fa-download"></i>
          Download Template
        </button>

        <div 
          className={`file-input-container ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="file-input-label" htmlFor="excel-file">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>Drag & drop your Excel file here or click to browse</span>
            <p>
              Required columns: <strong>Email Address</strong>, <strong>Student Full Name</strong>, <strong>Phone Number</strong><br />
              Accepted formats: .xlsx, .xls
            </p>
            {file && <p className="selected-file">Selected: {file.name}</p>}
          </label>
          <input
            type="file"
            id="excel-file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={loading}
            className="file-input"
          />
        </div>

        <div className="action-buttons">
          <button 
            className="action-button secondary"
            onClick={() => navigate('/company-dashboard/create-interview')}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Create Interview
          </button>
          <button 
            className="action-button primary"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Uploading...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i>
                Upload Candidates
              </>
            )}
          </button>
        </div>
      </div>

      {candidates.length > 0 && (
        <div className="preview-section">
          <h3>Uploaded Candidates</h3>
          <div className="table-container">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Interview Code</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={index}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.mobile}</td>
                    <td>
                      <code>{candidate.code}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="action-buttons">
            <button 
              className="action-button primary"
              onClick={downloadCodes}
            >
              <i className="fas fa-download"></i>
              Download Interview Codes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCandidates; 