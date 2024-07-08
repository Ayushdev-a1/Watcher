import React, { useEffect, useState } from 'react';
import unfriend from '../assets/unfriend.png'
export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await fetch(`http://localhost:5000/api/friends/getFriends?email=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFriends(data.friends);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching friends:', error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{height:"100%" , width:"100%"}}>
      {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul className='AddedFriend'>
          {friends.map(friend => (
            <li key={friend._id}>
              <span className='DP'></span>
              <p style={{display:"flex" , alignItems:"center" , justifyContent:"space-around"}}>
                {friend.name} 
                <img title="Unfriend" src={unfriend} alt="unfriend" style={{width:"8%"}}/>
              </p>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
