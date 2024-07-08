import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DisplayPicture from '../assets/default1.png'
import { MdEdit } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
export default function Profile() {
  const { profileData , setProfileData } = useContext(AuthContext);
  const [name, setName] = useState(profileData.name);
  const [bio, setBio] = useState('Always stay blessed');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const handleNameChange = (e) => setName(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);

  const toggleEditName = () => setIsEditingName(!isEditingName);
  const toggleEditBio = () => setIsEditingBio(!isEditingBio);

 
  const updateProfile = async () => {
    console.log(`updateProfile called with name: ${name}`);
    try {
      const URL = "http://localhost:5000/api/auth/profile";
      const requestBody = { name };

      console.log("Request Body:", requestBody);

      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log("Backend response:", data);
      setProfileData(data);
      if (response.ok) {
        alert("Profile Updated Successfully");
      } else {
        console.error("Failed to update profile, response not ok:", data);
        alert("Failed to Update Profile");
      }
      setIsEditingName(false);
      setIsEditingBio(false);

    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  const choosePic = () => {
    // Code to choose a picture
  };
  return (
    <>
      <div className="profileSection">
        <h1 className='ProfileHeading'>Profile</h1>
        <div className="PofilePic">
          <span className='changepic'>
          <img src={DisplayPicture} alt="UserProfile"  />
          <span className='updatePic' onClick={choosePic}>
          <FaCamera />
          </span>
          </span>  
        </div>
        <div className='UserDetails'>
        <span className="Name">
          <label htmlFor="YourName">Your Name</label>
          <p>
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onKeyPress={(e) => e.key === 'Enter' && updateProfile()}
                />
                <FaCheck onClick={updateProfile} style={{ cursor: "pointer" }} />
              </>
            ) : (
              <>
                {name} <MdEdit onClick={toggleEditName} style={{ cursor: "pointer" }} />
              </>
            )}
          </p>
        </span>
        <span className="ProfileInfo">
          This is not your username and pin. This name will be visible to your account.
        </span>
        <span className="About">
          <label htmlFor="About">About You</label>
          <p>
            {isEditingBio ? (
              <>
                <input
                  type="text"
                  value={bio}
                  onChange={handleBioChange}
                  onBlur={toggleEditBio}
                  autoFocus
                />
                <FaCheck style={{ cursor: "pointer" }} />
              </>
            ) : (
              <>
                {bio} <MdEdit onClick={toggleEditBio} style={{ cursor: "pointer" }} />
              </>
            )}
          </p>
        </span>
      </div>

      </div>
    </>
  );
}
