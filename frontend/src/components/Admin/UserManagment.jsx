import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  clearError,
  clearSuccess
} from "../../redux/slices/adminSlice";

function UserManagement() {
  const dispatch = useDispatch();
  const { users, loading, error, success, operation } = useSelector((state) => state.admin);
  const {user}=useSelector((state)=>state.auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    if(user && user.role==="admin"){
      dispatch(getAllUsers());
    }

  }, [dispatch,user]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
    if (success) {
      dispatch(clearSuccess());
      // Reset form on successful creation
      if (operation === 'creating_user') {
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "customer",
        });
      }
    }
  }, [error, success, operation, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createUser(formData)).unwrap();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleTableRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUser({
        userId,
        userData: { role: newRole }
      })).unwrap();
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Operation completed successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add new user form */}
      <div className="p-6 rounded-lg mb-6 border">
        <h3 className="text-lg font-bold mb-4">Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="w-full rounded p-2 border"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="w-full rounded p-2 border"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="w-full rounded p-2 border"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded p-2 border"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
            type="submit"
            disabled={loading && operation === 'creating_user'}
          >
            {loading && operation === 'creating_user' ? 'Adding User...' : 'Add User'}
          </button>
        </form>
      </div>

      {/* User list management */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && operation === 'fetching_users' ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading users...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleTableRoleChange(user._id, e.target.value)}
                      className="p-2 border rounded"
                      disabled={loading && operation === 'updating_user'}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={loading && operation === 'deleting_user'}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;