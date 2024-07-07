import React, { useState, useEffect ,useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
export default function Profile() {
  
  const{profileData} = useContext(AuthContext)
 
  return (
    <>
      <h1>Profile</h1>
      <div>
        <p>Name: {profileData.name}</p>
        <p>Email: {profileData.email}</p>
        {/* Add other profile details here */}
      </div>
    </>
  );
}
