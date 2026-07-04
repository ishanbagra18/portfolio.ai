import React from "react";

const PersonalInfoForm = ({ data = {}, onChange }) => {
  return (
    <section className="py-20 border-b border-gray-900">
      <div className="flex items-end gap-4 mb-16">
        <span
          className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          style={{ WebkitTextStroke: "1px #374151", color: "transparent" }}
        >
          01
        </span>

        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          Personal Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Full Name
          </label>

          <input
            type="text"
            name="full_name"
            value={data.full_name ?? ""}
            onChange={onChange}
            placeholder="e.g. Ishan Bagra"
            className="bg-transparent border-b-2 border-gray-800 text-2xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Email Address
          </label>

          <input
            type="email"
            name="email_id"
            value={data.email_id ?? ""}
            onChange={onChange}
            placeholder="hello@example.com"
            className="bg-transparent border-b-2 border-gray-800 text-2xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
            required
          />
        </div>

        {/* Age */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Age
          </label>

          <input
            type="number"
            name="age"
            value={data.age ?? ""}
            onChange={onChange}
            placeholder="e.g. 21"
            className="bg-transparent border-b-2 border-gray-800 text-2xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Address
          </label>

          <input
            type="text"
            name="address"
            value={data.address ?? ""}
            onChange={onChange}
            placeholder="e.g. Kota, Rajasthan, India"
            className="bg-transparent border-b-2 border-gray-800 text-2xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
          />
        </div>

        {/* Main Title */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Main Title
          </label>

          <input
            type="text"
            name="main_title"
            value={data.main_title ?? ""}
            onChange={onChange}
            placeholder="e.g. Full-Stack Software Developer"
            className="bg-transparent border-b-2 border-gray-800 text-2xl text-white py-3 focus:outline-none focus:border-white transition-colors placeholder:text-gray-700"
            required
          />
        </div>

      </div>
    </section>
  );
};

export default PersonalInfoForm;