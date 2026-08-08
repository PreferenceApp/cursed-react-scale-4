import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { EventsProvider } from "./context/EventsContext";
import { RegisteredProvider } from "./context/RegisteredContext";
import { DataProvider } from "./context/DataContext";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <EventsProvider>
          <RegisteredProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </RegisteredProvider>
        </EventsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}