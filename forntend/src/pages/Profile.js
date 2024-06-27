import React, { useState, useEffect } from 'react';

export default function Profile({ fetchProfileData , profileData , error}) {
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  } 
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
