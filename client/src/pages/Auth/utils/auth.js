import axios from "axios";
import toast from "react-hot-toast";
import handleError from "../../tools";

async function registerUser(event, data) {
  event.preventDefault();
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("image", data.image);

  try {
    const response = await axios.post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.error) {
      toast.error(response.data.error);
      return false;
    } else {
      toast.success("User registered successfully");
      return true;
    }
  } catch (error) {
    handleError("Register error", error);
    return false;
  }
}

async function loginUser(data) {
  let isLoggedIn = false;
  try {
    const response = await axios.post("/login", data);
    if (response.data.error) {
      toast.error(response.data.error);
      return { isLoggedIn };
    } else if (response.data) {
      isLoggedIn = true;
      const user = response.data;
      // Convert the admin status to a boolean
      const isAdmin = response.data.admin === "true";
      toast.success("You are logged in successfully");
      return { isLoggedIn, isAdmin, user, status: user.status };
    }
  } catch (error) {
    handleError("Login error", error);
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.status
    ) {
      return { isLoggedIn, status: error.response.data.status };
    }
    return { isLoggedIn };
  }
}

async function logoutUser(setUser) {
  try {
    const response = await axios.get("/logout");
    if (response.data.error) toast.error(response.data.error);
    else {
      setUser(null);
      toast.success("logged out successfully");
    }
  } catch (error) {
    handleError("Logout error", error);
  }
}

export { loginUser, registerUser, logoutUser };
