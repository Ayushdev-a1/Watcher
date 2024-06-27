import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [login, isLogin] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let nav = useNavigate();

  const movetoForgotpassword = () => {
    nav('/forgotpassword');
  };

  const movetoRegister = () => {
    nav('/register');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = {
        email,
        password,
      };
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.token) {
        localStorage.setItem('token', json.token);
        isLogin(true);
        nav('/');
      } else {
        alert(json.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="LoginBox">
      <div className="loginForm">
        <form method="post" onSubmit={onSubmit}>
          <h1>Login</h1>
          <span className='formInput'>
            <input type="text" placeholder='Username' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className="buttons">
              <button type="submit" className="login">Login</button>
              <p style={{ color: '#FF6347', fontFamily: 'cursive', display: 'inline-block', cursor: 'pointer' }} onClick={movetoForgotpassword} >
                Forgot Password?
              </p>
            </span>
          </span>
          <span className="do_not_register">
            <p>Don't have an account?</p>
            <p
              style={{
                color: '#FF6347',
                fontFamily: 'cursive',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              onClick={movetoRegister}
            >
              Register
            </p>
          </span>
        </form>
      </div>
    </div>
  );
}
