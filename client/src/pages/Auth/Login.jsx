import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./utils/auth";
import { Input } from "../../components/Input";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    const { isLoggedIn, isAdmin, user, status } = await loginUser(data);
    if (isLoggedIn) {
      setData({});
      setUser(user);
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else if (status == "Accepted") {
        navigate("/dashboard");
      } else if (status == "Refused") {
        navigate("/refusedDashboard");
      }
    } else if (status == "Pending") {
      setData({});
      setIsPending(true);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form className="col-5 mt-5" onSubmit={handleLogin}>
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {isPending && (
          <div className="alert alert-warning mt-3" role="alert">
            Your account is pending approval.
            <br /> An administrator will review your information shortly. Once
            approved, you can then log in to your account. Thank you for your
            patience.
          </div>
        )}
      </form>
    </div>
  );
}
