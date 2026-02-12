
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmail,
  getFirstName,
  getLastName,
  getName,
  setPassword,
  setThemeBackend,
  updateProfile,
} from "../services/appServices";
import { setTheme } from "../store/themeSlice";

import { useNavigate } from "react-router-dom";

function Settings() {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isChange, setChange] = useState(false);
  const [email, setEmail] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const showData = async () => {
      const fullname = await getName(userId);
      const firstname = await getFirstName(userId);
      const lastname = await getLastName(userId);
      const registeredEmail = await getEmail(userId);
      setName(fullname);
      setFirstname(firstname || "");
      setLastname(lastname || "");
      setEmail(registeredEmail);
    };
    if (userId) showData();
  }, [userId]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const response = await setPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response?.ok) {
        setShowPasswordModal(false);
        setShowSuccessModal(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response?.error);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteAccount(userId);
      if (response?.ok) {
        setShowDeleteModal(false);
        setShowDeleteSuccessModal(true);
        dispatch(logout());
      }
    } catch {
      alert("Failed to delete account");
    }
  }

  const handleSaveProfile = async () => {
  try {
    await updateProfile(firstname, lastname);
    setChange(false);
  } catch {
    alert("Failed to update profile");
  }
};

  const handleThemeChange = async (e) => {
    const selectedTheme = e.target.value;
    dispatch(setTheme(selectedTheme));
    await setThemeBackend(selectedTheme);
  };

  useEffect(() => {
    if (!showDeleteSuccessModal) return;

    const timer = setTimeout(() => {
      navigate("/login");
    }, 4000);

    return () => clearTimeout(timer);
  }, [showDeleteSuccessModal, navigate]);

  return (
    <div
      className={`max-w-3xl mx-auto p-6 space-y-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Account */}
      <div
        className={`p-6 rounded-xl shadow-sm space-y-4 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold">Account</h2>
        <input
          type="text"
          className={`w-full p-3 border rounded-lg ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          value={firstname}
          onChange={(e) => {
            setFirstname(e.target.value);
            setChange(true);
          }}
          placeholder="First Name"
        />
        <input
          type="text"
          className={`w-full p-3 border rounded-lg ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          value={lastname}
          onChange={(e) => {
            setLastname(e.target.value);
            setChange(true);
          }}
          placeholder="Last Name"
        />

        <input
          type="email"
          className={`w-full p-3 border rounded-lg ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-400"
              : "bg-gray-100 border-gray-300 text-gray-500"
          }`}
          value={email}
          disabled
        />

        <div className="flex gap-3 pt-2">
          <button
            className="px-4 py-2 border rounded-lg text-sm"
            onClick={() => setShowConfirmModal(true)}
          >
            Change Password
          </button>

          <button 
            className="px-4 py-2 border border-red-400 text-red-500 rounded-lg text-sm"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Change Password</h3>
            <p className="mb-4">
              Are you sure you want to change your password?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowPasswordModal(true);
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {[currentPassword, newPassword, confirmPassword].map(
                (value, i) => (
                  <input
                    key={i}
                    type="password"
                    className={`w-full p-3 border rounded-lg ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder={
                      ["Current Password", "New Password", "Confirm Password"][i]
                    }
                    value={value}
                    onChange={(e) => {
                      [setCurrentPassword, setNewPassword, setConfirmPassword][
                        i
                      ](e.target.value);
                      setError("");
                    }}
                    required
                  />
                )
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 text-center ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold text-green-500 mb-2">
              Password Updated
            </h3>
            <p className="mb-4">
              Your password has been changed successfully.
            </p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold text-red-500 mb-2">
              Delete Account
            </h3>

            <p className="mb-4 text-sm">
              This action is <span className="font-semibold">permanent</span>.
              Your account and all associated data will be deleted and cannot be
              recovered.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 border rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 text-center ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold text-red-500 mb-2">
              Account Deleted
            </h3>

            <p className="mb-4 text-sm">
              Your account has been permanently deleted.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Redirecting to login in 4 seconds...
            </p>

            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                setShowDeleteSuccessModal(false);
                navigate("/login");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}



      {/* Appearance */}
      <div
        className={`p-6 rounded-xl shadow-sm ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-3">Appearance</h2>

        <select
          className={`w-40 p-2 border rounded-lg ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-white border-gray-300"
          }`}
          value={theme}
          onChange={handleThemeChange}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button
        onClick={handleSaveProfile}
        disabled={!isChange}
        className={`px-6 py-3 rounded-lg ${
          isChange
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-black cursor-not-allowed"
        }`}
      >
        Save Changes
      </button>
    </div>
  );
}

export default Settings;

