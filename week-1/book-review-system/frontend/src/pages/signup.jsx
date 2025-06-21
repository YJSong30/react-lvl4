import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    interests: [],
  });
  const navigate = useNavigate();

  const availableInterests = [
    "sci-fi",
    "fantasy",
    "mystery",
    "thriller",
    "romance",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInterestsChange = (e) => {
    const { name, value, checked } = e.target;
    const { interests } = formData;

    let updatedInterests;

    if (checked) {
      updatedInterests = [...interests, value];
    } else {
      updatedInterests = interests.filter((interest) => interest !== value);
    }

    setFormData({
      ...formData,
      interests: updatedInterests,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("error signing up", data.error);
        return;
      }

      alert("account created successfully");
      navigate("/login");
    } catch (error) {
      alert("signup failed", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ position: "relative" }}
    >
      <Link
        to="/"
        className="btn btn-primary"
        style={{ position: "absolute", top: "10px", left: "10px" }}
      >
        Home
      </Link>

      <div className="card" style={{ width: "24rem" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Interests</label>
              {availableInterests.map((interest) => {
                return (
                  <div className="form-check" key={interest}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={interest}
                      onChange={handleInterestsChange}
                      checked={formData.interests.includes(interest)}
                    />
                    <label className="form-check-label">{interest}</label>
                  </div>
                );
              })}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
