import React, { useState } from "react";
import { Input } from "./SignupForm";
import { useNavigate } from "react-router-dom";
import axiosInstances from "../utils/axiosInstance";
import { AlarmPlus } from "lucide-react";
import { API_PATHS } from "../utils/apiPath";
const CreateResumeForm = () => {
  const [title, settitle] = useState("");
  const [error, seterror] = useState(null);
  const navigate = useNavigate();
  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!title) {
      seterror("Please Enter Resume Title");
      return;
    }
    seterror("");
    try {
      const response = await axiosInstances.post(API_PATHS.RESUME.CREATE, {
        title,
      });
      if (response.data?._id) {
        navigate(`/resume/${response.data?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        seterror(error.response.data.message);
      } else {
        seterror("Something Went Wrong Please try Again");
      }
    }
  };
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-50 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Let's Begin</h3>
      <p className="text-gray-600 mb-8">
        Give Your Resume a Title to get Started. You can Customize Everything
        later
      </p>
      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({ target }) => settitle(target.value)}
          label="Resume Title"
          placeholder="e.g., Rohit Sharma - Cricketer"
          type="text"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl
        hover:shadow-xl hover:shadow-rose-200 transition-all"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
