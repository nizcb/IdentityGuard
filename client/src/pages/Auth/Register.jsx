import { useState } from "react";
import { registerUser } from "./utils/auth";
import { Input } from "../../components/Input";

export default function Register() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });
  const [fileName, setFileName] = useState(""); // Ajouté pour stocker le nom du fichier
  const [imagePreview, setImagePreview] = useState(""); // State to hold the preview URL

  const handleRegister = async (e) => {
    e.preventDefault(); // Ajouté pour prévenir le rechargement de la page
    if (await registerUser(e, data)) {
      setData({
        name: "",
        email: "",
        password: "",
        image: "",
      });
      setFileName("");
      setImagePreview(false);
      setIsRegistered(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setData({ ...data, image: file });
      setFileName(file ? file.name : ""); // Update the file name when a file is selected

      // Update the image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview("");
      }
    } else {
      setData({ ...data, [name]: value });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form className="col-5 mt-5" onSubmit={handleRegister}>
        <Input
          type="text"
          name="name"
          label="Name"
          value={data.name}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          label="Email address"
          value={data.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          value={data.password}
          onChange={handleChange}
        />
        <div className="custom-file mt-3">
          <input
            type="file"
            className="custom-file-input"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        {imagePreview && ( // Display image preview if available
          <div className="image-preview mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="img-thumbnail"
              width="300"
              height="170"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
        {isRegistered && (
          <div className="alert alert-success mt-3" role="alert">
            Congratulations on successfully registering!
            <br /> An administrator will review your information shortly. Once
            approved, you can then log in to your account. Thank you for your
            patience.
          </div>
        )}
      </form>
    </div>
  );
}
