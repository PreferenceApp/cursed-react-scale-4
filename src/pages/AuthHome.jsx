import { useEvents } from "../context/EventsContext";
import { useRegistered } from "../context/RegisteredContext";

export default function AuthHome() {

  const { events } = useEvents();

  const { isRegistered } = useRegistered();

  console.log("events:", events);
  console.log("events.length:", events?.length);

  return (
    <main>

      <h1>Upcoming Events</h1>

      {!events.length ? (

        <p>
          There are no upcoming events.
        </p>

      ) : (

        <div>

          {events.map(event => {

            const registered =
              isRegistered(event.$id);

            return (
              <div
                key={event.$id}
                style={{
                  border:
                    "1px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "12px",
                }}
              >

                <h2>
                  {event.eventName}
                </h2>

                <p>
                  Registration deadline:{" "}
                  {new Date(
                    event.deadline
                  ).toLocaleString()}
                </p>

                <p>
                  {registered
                    ? "✓ Registered"
                    : "Not registered"}
                </p>

              </div>
            );

          })}

        </div>

      )}

    </main>
  );

}