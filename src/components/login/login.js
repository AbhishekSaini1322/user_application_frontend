import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAxiosHelper from '../../api/axiosHelper';
import { ApiPaths } from '../../api/endpoints';
import { toastSuccess, toastError } from '../../utils/toast';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { AxiosPost } = useAxiosHelper();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  async function handleLogin() {
    const { email, password } = formData;
  
    if (email?.length > 0 && password?.length > 0) {
      setLoading(true);
      try {
        const body = {
          password: password.trim(),
          email: email.trim(),
        };
  
        const res = await AxiosPost(ApiPaths.login, body);
  
        if (res?.success || res?.status === 200) {
          toastSuccess(res?.message || "Login successful!");
          localStorage.setItem("token", res?.token);
          // Store user information
          if (res?.user) {
            localStorage.setItem("userData", JSON.stringify({
              uid: res.user.userId, // Backend expects 'uid' but API returns 'userId'
              username: res.user.username,
              email: res.user.email
            }));
          } else {
            localStorage.removeItem("userData");
          }
          navigate("/dashboard");
        } else {
          toastError(res?.message || "Login failed");
        }
      } catch (error) {
        // ✅ Handle backend error message properly
        const errorMessage =
          error?.response?.data?.message || error?.message || "Login failed";
        toastError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      toastError("Please fill all fields");
    }
  }
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="register-link">
            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Register here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 