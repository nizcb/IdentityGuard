import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import { logoutUser } from "../Auth/utils/auth";
import { useNavigate } from "react-router-dom";

const RefusedDashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // State for storing image preview URL
  const [refuseReason, setRefuseReason] = useState("");

  useEffect(() => {
    if (user) {
      const fetchReason = async () => {
        const response = await axios.post("/refused/getReason", {
          email: user.email,
        });
        setRefuseReason(response.data.refuseReason);
      };

      fetchReason();
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);

      // Create an image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("email", user.email);

    try {
      await axios.post("/refused/sendImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Identity card submitted successfully.");
      logoutUser(setUser);
      navigate("/");
    } catch (error) {
      console.error("Error submitting identity card:", error);
      toast.error("Failed to submit identity card.");
    }
  };

  if (!user) {
    return (
      <div className="alert alert-danger justify-content-center" role="alert">
        You must be logged in to view this page.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        Hello {user.name}
        <br />
        Your account creation demand has been refused.
        <br />
        Reason: {refuseReason || "No specific reason provided."}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="custom-file mb-3">
          <input
            id="identityCardInput"
            type="file"
            className="custom-file-input"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {imagePreview && (
          <div className="image-preview mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="img-thumbnail"
              width="300"
              height="170"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RefusedDashboard;
