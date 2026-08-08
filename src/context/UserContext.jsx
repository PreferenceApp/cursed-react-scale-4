import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  account,
  OAuthProvider,
} from "../appwrite";


const UserContext = createContext();


export function useUser() {
  return useContext(UserContext);
}


export function UserProvider({ children }) {

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);


  async function refreshUser() {

    setUserLoading(true);

    try {

      const current = await account.get();
     // logout();
      setUser(current);

    } catch (error) {

      setUser(null);

    } finally {

      setUserLoading(false);

    }

  }


  async function login(endpoint = "success") {

    if (user) return;

    const redirect = window.location.origin;

    await account.createOAuth2Session({

      provider: OAuthProvider.Discord,

      success: `${redirect}/${endpoint}`,

      failure: `${redirect}/failure`,

      scopes: ["identify"],

    });

  }


  async function logout() {

    try {

      await account.deleteSession({
        sessionId: "current",
      });

    } catch (error) {

      console.error(
        "Failed logging out:",
        error
      );

    } finally {

      setUser(null);

    }

  }


  useEffect(() => {

    refreshUser();

  }, []);


  return (

    <UserContext.Provider
      value={{
        user,
        userLoading,
        login,
        logout,
        refreshUser,
      }}
    >

      {children}

    </UserContext.Provider>

  );

}