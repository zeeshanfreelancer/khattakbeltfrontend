import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, dbRef, onValue, update } from '../../Firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import API from '../../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profileData, setProfileData] = useState(null);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const {data: userData} = await API.get('/auth/me');

      setUser(userData); // or setUser(data.user) based on your API response

      setProfilePic(userData.profilePic || null);
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
      console.error(error);
      setUser(null);
      setProfilePic(null);
      setProfileData(null);
    }
  };

  fetchUserData();
}, []);


  const updateProfile = async (newData) => {
    try {
      await update(dbRef(db, `users/${user.uid}`), newData);
      setProfileData(prev => ({ ...prev, ...newData }));
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const updateProfilePicture = async (file) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;
        await update(dbRef(db, `users/${user.uid}`), { profilePic: base64Image });
        setProfilePic(base64Image);
        toast.success('Profile picture updated!');
      };
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser, // ✅ expose setUser to context
      profilePic,
      profileData,
      updateProfile,
      updateProfilePicture,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
