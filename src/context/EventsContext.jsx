import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { tablesDB } from "../appwrite";

const EventsContext = createContext();

export function useEvents() {
  return useContext(EventsContext);
}

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  async function refreshEvents() {
    setEventsLoading(true);

    try {
      const response = await tablesDB.listRows({
        databaseId: "db",
        tableId: "events",
      });

      console.log("All events:", response.rows);

      setEvents(response.rows);

    } catch (error) {
      console.error("Failed loading events:", error);

      setEvents([]);

    } finally {
      setEventsLoading(false);
    }
  }

  useEffect(() => {
    refreshEvents();
  }, []);

  const now = new Date();

  const upcomingEvents = events
    .filter((event) => {
      if (!event.deadline) {
        return false;
      }

      return new Date(event.deadline) > now;
    })
    .sort((a, b) => {
      return (
        new Date(a.deadline) -
        new Date(b.deadline)
      );
    });

  const previousEvents = events
    .filter((event) => {
      if (!event.deadline) {
        return false;
      }

      return new Date(event.deadline) <= now;
    })
    .sort((a, b) => {
      return (
        new Date(b.deadline) -
        new Date(a.deadline)
      );
    });

  return (
    <EventsContext.Provider
      value={{
        events,
        upcomingEvents,
        previousEvents,
        eventsLoading,
        refreshEvents,
        setEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}