import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../api/constraints'; 

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    industry: '',
    planType: '',
  });

  const navigate = useNavigate();
  const togglePassword = () => setShowPassword(prev => !prev);

  const validateField = (field, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^\d{10}$/;

    switch (field) {
      case 'name':
        if (!value || !nameRegex.test(value)) return 'Valid name required';
        break;
      case 'lastName':
        if (!value || !nameRegex.test(value)) return 'Valid last name required';
        break;
      case 'email':
        if (!emailRegex.test(value)) return 'Invalid email format';
        break;
      case 'phone':
        if (!phoneRegex.test(value)) return 'Phone number must be exactly 10 digits';
        break;
      case 'password':
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (value !== form.password) return 'Passwords do not match';
        break;
      case 'industry':
        if (!value) return 'Please select a business type';
        break;
      case 'planType':
        if (!value) return 'Please select a plan type';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    const fieldError = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  const validateAllFields = () => {
    const newErrors = {};
    for (const field in form) {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    }

    // Validate plan
    const selectedPlan = plans.find(plan => plan.plan_id.toString() === form.planType);
    if (!selectedPlan || !selectedPlan.bactive || selectedPlan.is_default) {
      newErrors.planType = 'Please choose a valid non-default plan to register.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const isValid = validateAllFields();

    if (isValid) {
      const requestBody = {
        cEmail: form.email,
        cPassword: form.password,
        plan_id: parseInt(form.planType),
      };

      try {
        const response = await fetch(ENDPOINTS.RESELLER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          navigate('/leads');
        } else {
          const errorText = await response.text();
          alert('Registration failed: ' + errorText);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert('Network error. Please try again.');
      }
    } else {
      alert('Validation failed. Please check your inputs.');
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(ENDPOINTS.PLAN_TYPE);
        const data = await response.json();
        const filteredPlans = data.filter(plan => plan.bactive && !plan.is_default);
        setPlans(filteredPlans);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      }
    };
    fetchPlans();
  }, []);

  const inputStyle = (field) =>
    `border-2 mt-2 rounded-md w-full px-4 py-1 focus:ring-2 ${
      errors[field] ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'
    }`;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="flex flex-col md:flex-row w-full max-w-[1200px] md:h-[640px] mt-[-40px] rounded-xl overflow-hidden">
        {/* Left Section */}
        <div className="relative w-full md:w-1/2 bg-[radial-gradient(circle,#2563eb,#164CA1,_#164CA1)] mb-6 md:mb-0 mt-6 md:mt-10 rounded-2xl flex items-center justify-center p-2 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md z-10 rounded-2xl"></div>
          <img
            src="/images/signup/signup.png"
            alt="Illustration"
            className="relative z-10 max-w-[240px] md:max-w-[300px] h-[350px]"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 md:mt-[30px] py-4 bg-white md:ms-10 p-6 md:p-10">
          <h2 className="text-xl font-medium text-center text-gray-900">
            Hey <span className="animate-waving-hand">👋</span>, Hi there!
          </h2>
          <h1 className="text-2xl font-bold text-gray-800 mt-2 text-center mb-6">Create your account to get started.</h1>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 mt-10 w-full gap-4">
            {['name', 'lastName', 'email', 'phone', 'password', 'confirmPassword'].map((field, i) => (
              <div key={field} className={i === 4 ? 'relative' : ''}>
                <label className="text-sm text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  name={field}
                  type={field.toLowerCase().includes('password') ? (field === 'password' && showPassword ? 'text' : 'password') : field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'confirmPassword' ? 'Confirm your password' : field.charAt(0).toUpperCase() + field.slice(1)}
                  className={inputStyle(field)}
                />
                {field === 'password' && (
                  <button type="button" onClick={togglePassword} className="absolute right-3 top-[43px] text-sm text-black">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}

            {/* Industry */}
            <div>
              <label className="text-sm text-gray-700">Industry</label>
              <select name="industry" value={form.industry} onChange={handleChange} className={inputStyle('industry')}>
                <option value="">Select Industry</option>
                <option value="retail">Retail</option>
                <option value="service">Service</option>
              </select>
              {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
            </div>

            {/* Plan Type */}
            <div>
              <label className="text-sm text-gray-700">Plan Type</label>
              <select name="planType" value={form.planType} onChange={handleChange} className={inputStyle('planType')}>
                <option value="">Select Plan</option>
                {plans.map(plan => (
                  <option key={plan.plan_id} value={plan.plan_id}>
                    {plan.plan_name}
                  </option>
                ))}
              </select>
              {errors.planType && <p className="text-red-500 text-sm mt-1">{errors.planType}</p>}
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 mt-4 flex justify-center">
              <button type="submit"
                      className="w-[150px] flex items-center justify-center bg-black text-white py-2 font-semibold rounded-md hover:bg-gray-900">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;