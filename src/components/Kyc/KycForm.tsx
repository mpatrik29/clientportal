"use client";

import React, { useState } from "react";

export default function KycForm() {
  const [formData, setFormData] = useState({
    legalName: "",
    nationality: "",
    proofOfIdentity: "Passport",
    file1: null as File | null,
    file2: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">KYC Form</h1>

      {/* Legal Name */}
      <div className="mb-4">
        <label htmlFor="legalName" className="block text-sm font-medium text-gray-700">
          Legal Name
        </label>
        <input
          type="text"
          id="legalName"
          name="legalName"
          value={formData.legalName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Nationality */}
      <div className="mb-4">
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
          Nationality
        </label>
        <input
          type="text"
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {/* Proof of Identity */}
      <div className="mb-4">
        <label htmlFor="proofOfIdentity" className="block text-sm font-medium text-gray-700">
          Proof of Identity
        </label>
        <select
          id="proofOfIdentity"
          name="proofOfIdentity"
          value={formData.proofOfIdentity}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="Passport">Passport</option>
          <option value="National ID">National ID</option>
        </select>
      </div>

      {/* File Upload 1 */}
      <div className="mb-4">
        <label htmlFor="file1" className="block text-sm font-medium text-gray-700">
          Upload Document 1
        </label>
        <input
          type="file"
          id="file1"
          name="file1"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          required
        />
      </div>

      {/* File Upload 2 */}
      <div className="mb-4">
        <label htmlFor="file2" className="block text-sm font-medium text-gray-700">
          Upload Document 2
        </label>
        <input
          type="file"
          id="file2"
          name="file2"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          required
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </form>
  );
}