import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  tablesDB,
} from "../appwrite";

import {
  Query,
} from "appwrite";

import {
  useUser,
} from "./UserContext.jsx";

import {
  useEvents,
} from "./EventsContext.jsx";


const RegisteredContext = createContext();


export function useRegistered() {

  return useContext(RegisteredContext);

}


export function RegisteredProvider({ children }) {

  const {
    user,
    userLoading,
  } = useUser();


  const {
    events,
    eventsLoading,
  } = useEvents();


  const [account, setAccount] = useState(null);

  const [registrations, setRegistrations] = useState([]);

  const [
    registeredLoading,
    setRegisteredLoading,
  ] = useState(true);


  // --------------------------------
  // Load registrations
  // --------------------------------

  async function refreshRegistered() {

    setRegisteredLoading(true);

    try {

      // --------------------------------
      // No logged-in user
      // --------------------------------

      if (!user) {

        setAccount(null);

        setRegistrations([]);

        return;

      }


      // --------------------------------
      // No upcoming events
      // --------------------------------

      if (!events?.length) {

        setAccount(null);

        setRegistrations([]);

        return;

      }


      // --------------------------------
      // 1. Find account
      // --------------------------------

      const accountResponse =
        await tablesDB.listRows({

          databaseId: "db",

          tableId: "accounts",

          queries: [

            Query.equal(
              "userId",
              user.$id
            ),

            Query.limit(1),

          ],

        });


      const accountRow =
        accountResponse.rows[0] ?? null;


      setAccount(accountRow);


      // --------------------------------
      // No account found
      // --------------------------------

      if (!accountRow) {

        setRegistrations([]);

        return;

      }


      // --------------------------------
      // 2. Get event IDs
      // --------------------------------

      const eventIds = events.map(
        event => event.$id
      );


      // --------------------------------
      // 3. Find registrations
      // --------------------------------

      const registeredResponse =
        await tablesDB.listRows({

          databaseId: "db",

          tableId: "registered",

          queries: [

            Query.equal(
              "discordId",
              accountRow.$id
            ),

            Query.equal(
              "eventId",
              eventIds
            ),

            Query.limit(5000),

          ],

        });


      setRegistrations(
        registeredResponse.rows
      );


    } catch (error) {

      console.error(
        "Failed loading registrations:",
        error
      );


      setAccount(null);

      setRegistrations([]);


    } finally {

      // This MUST run even if one of
      // the conditions above returned.

      setRegisteredLoading(false);

    }

  }


  // --------------------------------
  // Watch dependencies
  // --------------------------------

  useEffect(() => {

    // Wait until user loading is finished.

    if (userLoading) {

      return;

    }


    // Wait until events loading is finished.

    if (eventsLoading) {

      return;

    }


    refreshRegistered();


  }, [
    user,
    userLoading,
    events,
    eventsLoading,
  ]);


  // --------------------------------
  // Check registration
  // --------------------------------

  function isRegistered(eventId) {

    return registrations.some(
      registration =>
        registration.eventId === eventId
    );

  }


  // --------------------------------
  // Get registration
  // --------------------------------

  function getRegistration(eventId) {

    return registrations.find(
      registration =>
        registration.eventId === eventId
    ) ?? null;

  }


  // --------------------------------
  // Register
  // --------------------------------

  async function register(
    eventId,
    gameName
  ) {

    // Eventually call your Appwrite
    // Function here.

    // Example:
    //
    // await registerFunction({
    //   eventId,
    //   gameName,
    // });


    await refreshRegistered();

  }


  // --------------------------------
  // Unregister
  // --------------------------------

  async function unregister(eventId) {

    // Eventually call your Appwrite
    // Function here.

    // Example:
    //
    // await unregisterFunction({
    //   eventId,
    // });


    await refreshRegistered();

  }


  // --------------------------------
  // Provider
  // --------------------------------

  return (

    <RegisteredContext.Provider
      value={{

        account,

        registrations,

        registeredLoading,

        refreshRegistered,

        isRegistered,

        getRegistration,

        register,

        unregister,

      }}
    >

      {children}

    </RegisteredContext.Provider>

  );

}