import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAxiosHelper from '../../api/axiosHelper';
import { ApiPaths } from '../../api/endpoints';
import { toastError } from '../../utils/toast';
import './profile.css';

const Profile = () => {
    const { AxiosGet } = useAxiosHelper();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
  
    const location = useLocation();
    const autoShow = location.state?.autoShow;
  
    const handleProfile = async () => {
      setLoading(true);
      try {
        const res = await AxiosGet(ApiPaths.getProfile);
        if (res?.success || res?.status === 200) {
          setProfile({
            name: res.user.name,
            username: res.user.username,
            email: res.user.email,
          });
          setShowPopup(true);
        } else {
          toastError(res?.message || "Failed to fetch profile");
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || "Error fetching profile";
        toastError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    const handleClose = () => {
      setShowPopup(false);
    };
  
    // 🔥 Automatically show profile when coming from Dashboard
    React.useEffect(() => {
      if (autoShow) {
        handleProfile();
      }
    }, [autoShow]);
  
    return (
      <div className="profile-container-custom">
        <button className="profile-btn-custom" onClick={handleProfile} disabled={loading}>
          {loading ? 'Loading...' : 'Show Profile'}
        </button>
  
        {showPopup && (
          <div className="profile-popup-overlay-custom" onClick={handleClose}>
            <div className="profile-popup-content-custom" onClick={(e) => e.stopPropagation()}>
              <h3 className="profile-title-custom">User Profile</h3>
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Username:</strong> {profile?.username}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <button className="profile-close-btn-custom" onClick={handleClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default Profile;
