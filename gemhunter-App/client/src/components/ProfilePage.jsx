import React, { useState } from "react";
import "./css/ProfilePage.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
  });

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setUserData({
      ...userData,
      name: formData.name,
      email: formData.email,
    });
    setEditing(false);
  };

  return (
    <div className="profile-container">
      <h1>Il Mio Profilo</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          {/* Icona della persona */}
          <img
            src="https://via.placeholder.com/150/0000FF/FFFFFF?text=User" // Icona utente stilizzata
            alt="Avatar"
            className="avatar-icon"
          />
          <h2 className="user-name">{userData.name}</h2>
        </div>

        {!editing ? (
          <div className="profile-info">
            <p className="user-email">{userData.email}</p>
            <button onClick={handleEditToggle} className="edit-button">
              Modifica Profilo
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="save-button">
              Salva
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="cancel-button"
            >
              Annulla
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
