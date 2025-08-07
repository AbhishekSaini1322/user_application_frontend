import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAxiosHelper from '../../api/axiosHelper';
import { ApiPaths } from '../../api/endpoints';
import { toastSuccess, toastError } from '../../utils/toast';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { AxiosPost } = useAxiosHelper();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  async function handleRegister() {
    const { name, email, password, confirmPassword } = formData;
  
    if (name?.length > 0 && email?.length > 0 && password?.length > 0 && confirmPassword?.length > 0) {
      if (password !== confirmPassword) {
        toastError("Passwords do not match");
        return;
      }
  
      setLoading(true);
      try {
        const body = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        };
  
        const res = await AxiosPost(ApiPaths.register, body);
  
        // ✅ Always show message from response
        if (res?.success || res?.status === 200) {
          toastSuccess(res?.message || "Registration successful!");
          navigate("/login");
        } else {
          toastError(res?.message || "Registration failed");
        }
      } catch (error) {
        // ✅ Show message from error response if available
        const errorMsg = error?.response?.data?.message || error?.message || "Registration failed";
        toastError(errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      toastError("Please fill all fields");
    }
  }
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div className="login-link">
            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login here</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
