import React, { useState, useEffect } from "react";

const ProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName || "");
      setName(userData.name || "");
      setBio(userData.bio || "");
      setEmail(userData.email || "");
    }
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ fullName, name, bio });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
            value={email}
            disabled
          />
          <textarea
            placeholder="Bio"
            className="w-full border p-2 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
