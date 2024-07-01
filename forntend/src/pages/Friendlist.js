import React, { useEffect, useState } from 'react';

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
    <div>
      {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={friend._id}>
              <p>Name: {friend.name}</p>
              <p>Email: {friend.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
