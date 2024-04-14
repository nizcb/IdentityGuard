import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import "./dashboard.css";
import handleError from "../tools";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/admin/usersInfo");
        const usersWithAdditionalProps = response.data.map((user) => ({
          ...user,
          dateOfBirth: "",
          isReasonFieldShown: false,
          reason: "",
        }));
        setUsers(usersWithAdditionalProps);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const toggleReasonField = (email) => {
    setUsers(
      users.map((user) =>
        user.email === email
          ? { ...user, isReasonFieldShown: !user.isReasonFieldShown }
          : user
      )
    );
  };

  const handleReasonChange = (email, reason) => {
    setUsers(
      users.map((user) => (user.email === email ? { ...user, reason } : user))
    );
  };

  const sendAge = async (dateOfBirth, email) => {
    await axios.post("/admin/accept", {
      dateOfBirth: dateOfBirth,
      email: email,
    });
  };

  const sendAccept = async (email) => {
    setIsSending(true);
    const user = users.find((user) => user.email === email);
    if (!user) {
      console.error("User not found");
      return;
    }
    try {
      const response = await axios.post("/admin/accept", {
        email: user.email,
        status: user.status,
        dateOfBirth: user.dateOfBirth,
      });
      const newUsers = users.filter((u) => u.email !== email);
      setUsers(newUsers);
      toast.success(response.data.message);
    } catch (error) {
      handleError("sendAccept error: ", error);
    }
    setIsSending(false);
  };

  const sendRefuse = async (email) => {
    setIsSending(true);
    const user = users.find((user) => user.email === email);
    if (!user) {
      console.error("User not found");
      return;
    }
    try {
      const response = await axios.post("/admin/refuse", {
        email: user.email,
        status: user.status,
        refuseReason: user.reason,
      });
      const newUsers = users.filter((u) => u.email !== email);
      setUsers(newUsers);
      toast.success(response.data.message);
    } catch (error) {
      handleError("sendRefuse error: ", error);
    }
    setIsSending(false);
  };

  const handleDateOfBirthChange = (email, dateOfBirth) => {
    const newusers = users.map((user) => {
      if (user.email === email) {
        return { ...user, dateOfBirth: dateOfBirth };
      } else {
        return user;
      }
    });
    setUsers(newusers);
  };

  return (
    <>
      <div className="container dashboardContainer">
        {users.map((user) => (
          <div className="dashboardCard" key={user.email}>
            <img
              src={`${axios.defaults.baseURL}/admin/uploads/${user.imagePath}`}
              alt={user.email}
              className="dashboardImage"
            />
            <h6>{user.email}</h6>
            <div className="form-floating mb-3 mt-2">
              <input
                type="date"
                value={user.dateOfBirth}
                onChange={(e) =>
                  handleDateOfBirthChange(user.email, e.target.value)
                }
                className="form-control"
                id={`dateOfBirth-${user.email}`}
                name="dateOfBirth"
              />
              <label htmlFor={`dateOfBirth-${user.email}`}>Date of Birth</label>
            </div>
            <div className="dashboardButtons">
              <button
                type="button"
                className="btn btn-primary dashboardBtn"
                onClick={() => sendAccept(user.email)}
                disabled={isSending}
              >
                Accept
              </button>
              <button
                type="button"
                className="btn btn-danger dashboardBtn"
                onClick={() => toggleReasonField(user.email)}
              >
                Reject
              </button>
            </div>
            <div
              className={`reasonField ${user.isReasonFieldShown ? "show" : ""}`}
            >
              <input
                type="text"
                className="form-control reasonInput"
                value={user.reason}
                onChange={(e) => handleReasonChange(user.email, e.target.value)}
                placeholder="Reason"
                aria-label="Reason"
              />
              <button
                type="button"
                className="btn btn-warning dashboardBtn"
                onClick={() => sendRefuse(user.email)}
                disabled={isSending}
              >
                Submit Reason
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
