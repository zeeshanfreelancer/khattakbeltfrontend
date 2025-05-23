import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { db, dbRef, onValue, update } from '../../Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from '../../Firebase';
import { FaUser, FaEdit, FaSave, FaSignOutAlt, FaTrash, FaEye, FaEyeSlash, FaLock, FaGlobe } from 'react-icons/fa';
import '../styles/profile.css';
import API from '../../services/api';

export default function Profile() {
  const { user, profilePic, updateProfilePic } = useUser();
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    aboutMe: '',
    skills: '',
    experience: '',
    education: '',
    interests: ''
  });
  const [visibility, setVisibility] = useState({
    aboutMe: 'private',
    personalia: 'private',
    contact: 'private',
    skills: 'private',
    experience: 'private',
    education: 'private',
    certificates: 'private',
    interests: 'private'
  });
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function getUserData() {
    try {      
      const { data: userData } = await API.get('/auth/me');
      setProfileData({
        firstName: userData.firstName || 'Muhammad',
        lastName: userData.lastName || 'Zeeshan',
        aboutMe: userData.aboutMe || 'Web developer passionate about creating user-friendly applications',
        skills: userData.skills || 'React, Firebase, JavaScript',
        experience: userData.experience || '5 years of web development',
        education: userData.education || 'Computer Science Degree',
        interests: userData.interests || 'Programming, Hiking, Reading'
      });
    } catch (error) {
        console.error('error fetching profile data: ', error);
    }
  }
  useEffect(() => {
    if (user) {
      // const userRef = dbRef(db, `users/${user.uid}`);
      // onValue(userRef, (snapshot) => {
      //   const userData = snapshot.val() || {};
      //   setProfileData({
      //     firstName: userData.firstName || 'Muhammad',
      //     lastName: userData.lastName || 'Zeeshan',
      //     aboutMe: userData.aboutMe || 'Web developer passionate about creating user-friendly applications',
      //     skills: userData.skills || 'React, Firebase, JavaScript',
      //     experience: userData.experience || '5 years of web development',
      //     education: userData.education || 'Computer Science Degree',
      //     interests: userData.interests || 'Programming, Hiking, Reading'
      //   });
      //   setIsLoading(false);
      // });
      getUserData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (section) => {
    setVisibility(prev => ({
      ...prev,
      [section]: prev[section] === 'private' ? 'public' : 'private'
    }));
  };


const handleProfilePicUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 1 * 1024 * 1024) {
    toast.error('File size too large (max 1MB)');
    return;
  }

  const formData = new FormData();
  formData.append('profilePic', file);

  try {
    setUploading(true);

    const res = await API.put('/auth/update-profile-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });

    updateProfilePic(res.data.profilePic); // base64 or URL returned from backend
    toast.success('Profile picture updated successfully!');
  } catch (error) {
    toast.error(`Upload failed: ${error.response?.data?.message || error.message}`);
  } finally {
    setUploading(false);
  }
};


  const handleSave = async () => {
    try {
      setIsLoading(true);
      await update(dbRef(db, `users/${user.uid}`), profileData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error(`Error saving profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      toast.info('Account deletion functionality would be implemented here');
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      navigate('/');
      toast.success('Signed out successfully!');
    } catch (error) {
      toast.error(`Sign out failed: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic-container">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-pic-placeholder">
              <FaUser size={48} />
            </div>
          )}
          {editMode && (
            <div className="profile-pic-upload">
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile-pic-upload" className="upload-btn">
                {uploading ? (
                  <span className="upload-spinner"></span>
                ) : (
                  <>
                    <FaEdit />
                    <span>Change Photo</span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        <h2 className="profile-name">{profileData.firstName} {profileData.lastName}</h2>
        <p className="profile-title">For Account and Certificates</p>
      </div>

      <div className="profile-sections">
        {/* Account Information Card */}
        <div className="profile-card card-animate">
          <div className="card-header">
            <h3><FaUser className="icon" /> Account Information</h3>
            <div className="card-actions">
              {editMode ? (
                <>
                  <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? <span className="btn-spinner"></span> : <FaSave />}
                    <span>Save</span>
                  </button>
                  <button
                    className="edit-btn cancel"
                    onClick={() => setEditMode(false)}
                  >
                    <FaEdit />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="card-content">
            <div className="info-row">
              <label>First Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span>{profileData.firstName}</span>
              )}
            </div>

            <div className="info-row">
              <label>Last Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span>{profileData.lastName}</span>
              )}
            </div>

            <div className="info-row">
              <label>Email</label>
              <span className="email-value">{user.email}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="signout-btn"
              onClick={handleSignOut}
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
            <button
              className="delete-account-btn"
              onClick={handleDeleteAccount}
            >
              <FaTrash />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Profile Visibility Card */}
        <div className="profile-card card-animate">
          <div className="card-header">
            <h3>Profile Visibility</h3>
          </div>

          <div className="visibility-toggle">
            <div className="toggle-options">
              <span className={`toggle-option ${visibility.personalia === 'private' ? 'active' : ''}`}>
                <FaLock /> Private
              </span>
              <span className={`toggle-option ${visibility.personalia === 'public' ? 'active' : ''}`}>
                <FaGlobe /> Public
              </span>
            </div>
            <button
              className="toggle-btn"
              onClick={() => toggleVisibility('personalia')}
            >
              {visibility.personalia === 'private' ? 'Make Public' : 'Make Private'}
            </button>
          </div>
        </div>

        {/* About Me Card */}
        <div className="profile-card card-animate">
          <div className="card-header">
            <h3>About Me</h3>
            <button
              className={`visibility-btn ${visibility.aboutMe}`}
              onClick={() => toggleVisibility('aboutMe')}
            >
              {visibility.aboutMe === 'private' ? <FaLock /> : <FaGlobe />}
              {visibility.aboutMe === 'private' ? 'Private' : 'Public'}
            </button>
          </div>

          <div className="card-content">
            {editMode ? (
              <textarea
                name="aboutMe"
                value={profileData.aboutMe}
                onChange={handleInputChange}
                className="profile-textarea"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="about-me-text">{profileData.aboutMe}</p>
            )}
          </div>
        </div>

        {/* Skills Card */}
        <div className="profile-card card-animate">
          <div className="card-header">
            <h3>Skills</h3>
            <button
              className={`visibility-btn ${visibility.skills}`}
              onClick={() => toggleVisibility('skills')}
            >
              {visibility.skills === 'private' ? <FaLock /> : <FaGlobe />}
              {visibility.skills === 'private' ? 'Private' : 'Public'}
            </button>
          </div>

          <div className="card-content">
            {editMode ? (
              <input
                type="text"
                name="skills"
                value={profileData.skills}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="List your skills..."
              />
            ) : (
              <div className="skills-container">
                {profileData.skills.split(',').map((skill, index) => (
                  <span key={index} className="skill-tag">{skill.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Experience Card */}
        <div className="profile-card card-animate">
          <div className="card-header">
            <h3>Experience</h3>
            <button
              className={`visibility-btn ${visibility.experience}`}
              onClick={() => toggleVisibility('experience')}
            >
              {visibility.experience === 'private' ? <FaLock /> : <FaGlobe />}
              {visibility.experience === 'private' ? 'Private' : 'Public'}
            </button>
          </div>

          <div className="card-content">
            {editMode ? (
              <textarea
                name="experience"
                value={profileData.experience}
                onChange={handleInputChange}
                className="profile-textarea"
                placeholder="Describe your experience..."
              />
            ) : (
              <p className="experience-text">{profileData.experience}</p>
            )}
          </div>
        </div>

        {/* Education Card */}
        <div className="profile-card card-animate">
          <div className="card-header">
            <h3>Education</h3>
            <button
              className={`visibility-btn ${visibility.education}`}
              onClick={() => toggleVisibility('education')}
            >
              {visibility.education === 'private' ? <FaLock /> : <FaGlobe />}
              {visibility.education === 'private' ? 'Private' : 'Public'}
            </button>
          </div>

          <div className="card-content">
            {editMode ? (
              <input
                type="text"
                name="education"
                value={profileData.education}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Your education background..."
              />
            ) : (
              <p className="education-text">{profileData.education}</p>
            )}
          </div>
        </div>

        {/* Interests Card */}
        <div className="profile-card card-animate">
          <div className="card-header">
            <h3>Interests</h3>
            <button
              className={`visibility-btn ${visibility.interests}`}
              onClick={() => toggleVisibility('interests')}
            >
              {visibility.interests === 'private' ? <FaLock /> : <FaGlobe />}
              {visibility.interests === 'private' ? 'Private' : 'Public'}
            </button>
          </div>

          <div className="card-content">
            {editMode ? (
              <input
                type="text"
                name="interests"
                value={profileData.interests}
                onChange={handleInputChange}
                className="profile-input"
                placeholder="Your interests..."
              />
            ) : (
              <div className="interests-container">
                {profileData.interests.split(',').map((interest, index) => (
                  <span key={index} className="interest-tag">{interest.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}