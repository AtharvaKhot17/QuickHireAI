import { useState } from "react";
import "../styles/UploadCandidates.css";

const UploadCandidates = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  const [candidates, setCandidates] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // TODO: Implement Excel parsing
      // For now, we'll just show a success message
      setUploadStatus({
        loading: false,
        success: true,
        error: null
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploadStatus({ loading: true, success: false, error: null });

    try {
      // TODO: Implement actual file upload and processing
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      const mockCandidates = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "SDE", code: "ABC123" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Frontend", code: "DEF456" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Backend", code: "GHI789" }
      ];

      setCandidates(mockCandidates);
      setUploadStatus({
        loading: false,
        success: true,
        error: null
      });
    } catch (error) {
      setUploadStatus({
        loading: false,
        success: false,
        error: "Failed to upload file. Please try again."
      });
    }
  };

  const handleDownloadTemplate = () => {
    // TODO: Implement template download
    console.log("Downloading template...");
  };

  return (
    <div className="upload-candidates-container">
      <div className="upload-header">
        <h1>Upload Candidates</h1>
        <p>Upload your candidate list via Excel and generate unique interview codes</p>
      </div>

      <div className="upload-section">
        <div className="upload-box">
          <div className="upload-icon">
            <i className="fas fa-file-excel"></i>
          </div>
          <h3>Upload Excel File</h3>
          <p>Supported format: .xlsx, .xls</p>
          
          <form onSubmit={handleUpload} className="upload-form">
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-upload"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="file-upload" className="file-label">
                Choose File
              </label>
              {file && <span className="file-name">{file.name}</span>}
            </div>

            <button
              type="submit"
              className="upload-button"
              disabled={!file || uploadStatus.loading}
            >
              {uploadStatus.loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-upload"></i>
                  Upload & Generate Codes
                </>
              )}
            </button>
          </form>

          <button
            onClick={handleDownloadTemplate}
            className="template-button"
          >
            <i className="fas fa-download"></i>
            Download Template
          </button>
        </div>

        {uploadStatus.error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {uploadStatus.error}
          </div>
        )}

        {uploadStatus.success && candidates.length > 0 && (
          <div className="candidates-list">
            <h3>Generated Interview Codes</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Interview Code</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => (
                    <tr key={candidate.id}>
                      <td>{candidate.name}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.role}</td>
                      <td className="code-cell">{candidate.code}</td>
                      <td>
                        <span className="status-badge pending">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCandidates; 