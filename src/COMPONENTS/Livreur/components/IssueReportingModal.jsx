import React, { useState } from 'react';
import '../styles.css';

const IssueReportingModal = ({ taskId, onClose }) => {
  const [issueType, setIssueType] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedPhoto = e.target.files[0];
      setPhoto(selectedPhoto);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(selectedPhoto);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, make API call to submit issue
    // Example: axios.post('/api/tasks/issue', { taskId, issueType, details, photo })
    console.log({
      taskId,
      issueType,
      details,
      photo,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Report an Issue</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issueType">Issue Type</label>
            <select 
              id="issueType" 
              value={issueType} 
              onChange={(e) => setIssueType(e.target.value)} 
              required
            >
              <option value="">Select an issue type</option>
              <option value="Spoiled Food">Spoiled Food</option>
              <option value="Traffic Delay">Traffic Delay</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="details">Details (Optional)</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue..."
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="photo">Add Photo (Optional)</label>
            <input 
              type="file" 
              id="photo" 
              accept="image/*" 
              onChange={handlePhotoChange} 
            />
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Issue preview" />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueReportingModal;