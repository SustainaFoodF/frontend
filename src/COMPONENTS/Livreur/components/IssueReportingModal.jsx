import React, { useState } from 'react';
import { reportTaskIssue } from '../../../services/api';
import '../styles.css';
import './IssueReportingModal.css';

const IssueReportingModal = ({ taskId, onClose, onIssueReported }) => {
  const [issueType, setIssueType] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handlePhotoChange = (e) => {
    setError(null);
    const selectedPhoto = e.target.files[0];
    
    if (!selectedPhoto) return;
    
    // Validate file type
    if (!selectedPhoto.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }
    
    // Validate file size (2MB max)
    if (selectedPhoto.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setPhoto(selectedPhoto);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(selectedPhoto);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const issueData = {
        type: issueType,
        details,
        image: photo
      };
      
      const response = await reportTaskIssue(taskId, issueData);
      
      // Callback to parent component if needed
      if (onIssueReported) {
        onIssueReported(response.data);
      }
      
      onClose();
    } catch (err) {
      console.error("Error reporting issue:", err);
      setError(err.response?.data?.message || 'Failed to report issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        <h2>Report an Issue</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issueType">Issue Type *</label>
            <select 
              id="issueType" 
              value={issueType} 
              onChange={(e) => setIssueType(e.target.value)} 
              required
              aria-required="true"
            >
              <option value="">Select an issue type</option>
              <option value="Delivery Problem">Delivery Problem</option>
              <option value="Customer Issue">Customer Issue</option>
              <option value="Restaurant Issue">Restaurant Issue</option>
              <option value="App Problem">App Problem</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="details">Details *</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="photo">Add Photo</label>
            <input 
              type="file" 
              id="photo" 
              accept="image/*" 
              onChange={handlePhotoChange}
              aria-describedby="photoHelp"
            />
            <small id="photoHelp">Max size: 2MB (JPEG, PNG)</small>
            
            {photoPreview && (
              <div className="photo-preview-container">
                <img src={photoPreview} alt="Issue preview" className="photo-preview" />
                <button 
                  type="button" 
                  className="remove-photo-button" 
                  onClick={removePhoto}
                  aria-label="Remove photo"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting || !issueType || !details}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueReportingModal;