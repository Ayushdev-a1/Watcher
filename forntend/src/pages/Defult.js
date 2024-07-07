import React, { useContext } from 'react';
import DefultImg from '../assets/default1.png';
import { AuthContext } from '../context/AuthContext';

export default function Defult() {
  const {profileData} = useContext(AuthContext);
  if (profileData.name=== undefined) return <div>Loading...</div>;
  return (
    <>
      <div className="defualtimg">
        <img src={DefultImg} alt="default" />
        <p>Hi👋{profileData.name}</p>
        <h1>Watch & chat ∼ Watcher</h1>
      </div>
    </>
  );
}
