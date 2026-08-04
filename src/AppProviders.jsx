import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { EventProvider } from "./context/EventContext";
import { PlayerProvider } from "./context/PlayerContext";
import { DataProvider } from "./context/DataContext";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <EventProvider>
          <PlayerProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </PlayerProvider>
        </EventProvider>
      </UserProvider>
    </ThemeProvider>
  );
}