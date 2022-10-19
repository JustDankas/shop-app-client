import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [recent, setRecent] = useState([]);
  const [cart, setCart] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (user !== null) {
      setIsFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/cart/${user.username}`)
        .then((res) => {
          console.log(res.data);
          setCart(res.data.cart);
        })
        .catch((e) => console.log(e));
    }
  }, [user]);

  const login = (user) => {
    setUser(user);
    setRecent(user.recentItems);
  };
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setRecent([]);
  };
  const setFetching = (bool) => {
    setIsFetching(bool);
  };
  const handleSetRecent = (recent) => {
    console.log(recent);
    setRecent(recent);
  };
  console.log("cart Context", cart);
  return (
    <UserContext.Provider
      value={{
        user,
        isFetching,
        recent,
        cart,
        login,
        logout,
        setFetching,
        handleSetRecent,
        setCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export default UserContext;
