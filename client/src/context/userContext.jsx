import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading as true

  useEffect(() => {
    axios
      .get("/Profile")
      .then(({ data }) => {
        setUser(data);
        console.log(`UserContextProvider data: ${user}`);
        setLoading(false); // Set loading to false upon receiving data
      })
      .catch((err) => {
        console.log(`UserContextProvider error: ${err}`);
        setLoading(false); // Also set loading to false on error
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border m-5" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
