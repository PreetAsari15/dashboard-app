import { useContext, createContext, useState, useEffect } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Courier } from "../models";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  // auth user coming from auth module and db user from database
  const [authUser, setAuthUser] = useState(null);
  const [dbCourier, setDbCourier] = useState(null);
  const sub = authUser?.attributes?.sub;

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  }, []);

  useEffect(() => {
    DataStore.query(Courier, (courier) => courier.sub.eq(sub)).then(
      (couriers) => setDbCourier(couriers[0])
    );
  }, [sub]);

  console.log(dbCourier);

  return (
    <AuthContext.Provider value={{ authUser, dbCourier, sub, setDbCourier }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
