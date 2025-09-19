import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function UserManagment() {
  const users = [
    {
      _id: 1234,
      name: "Jhon Doe",
      email: "jhon@TbBrandGmail.com",
      role: "admin",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", //default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    console.log("Form Submitted:", formData);
    e.preventDefault();
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  // Separate handler for Select component
  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleTableRoleChange = (userId, newRole) => {
    console.log({ id: userId, role: newRole });
  };

  const handleDeleteUser=(userId)=>{
    if(window.confirm("Are you sure you want to delete this user?")){
        console.log("Deleting user:",userId)
    }
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Managment</h2>
      {/* add new user form  */}
      <div className="p-6 rounded-lg mb-6">
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
            <Select
              name="role"
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            type="submit"
          >
            Add User
          </button>
        </form>
      </div>
      {/* <div className="mt-4 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold">Current Form Data:</h4>
        <pre>{JSON.stringify(formData,null,2)}</pre>
      </div> */}

      {/* User list managmeent  */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-00">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">email</th>
              <th className="py-3 px-4">role</th>
              <th className="py-3 px-4">actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}{" "}
                </td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleTableRoleChange(user._id, e.target.value)
                    }
                    className="p-2 border rounded"
                  >
                    <option value="customer">customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagment;
