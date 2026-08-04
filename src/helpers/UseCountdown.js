import { useState, useEffect } from 'react';

export function UseCountdown(event) {
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Return early if there is no event or deadline
    if (!event || !event.deadline) {
      setTimeLeft("");
      return;
    }

    if (event.hasStarted) {
      setHasStarted(true);
      setTimeLeft("is live!");
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(event.deadline) - new Date();

      if (difference <= 0) {
        setTimeLeft("is live!");
        setHasStarted(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
      const minutes = Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, "0");
      const seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, "0");

      // Optional: Choose this compact format ("01d 05h...") or the verbose one below
      // const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      
      const parts = [];
      if (parseInt(days) > 0) parts.push(`${parseInt(days)} day${parseInt(days) > 1 ? 's' : ''}`);
      if (parseInt(hours) > 0) parts.push(`${parseInt(hours)} hour${parseInt(hours) > 1 ? 's' : ''}`);
      if (parseInt(minutes) > 0) parts.push(`${parseInt(minutes)} minute${parseInt(minutes) > 1 ? 's' : ''}`);
      if (parseInt(seconds) > 0 || parts.length === 0) {
        parts.push(`${parseInt(seconds)} second${parseInt(seconds) > 1 ? 's' : ''}`);
      }

      const finalString = parts.length > 1 
        ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` 
        : parts[0];

      if (finalString === "0 second") {
        setTimeLeft("is starting");
      } else {
        setTimeLeft(`is in ${finalString}`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [event]); // Re-run effect if the event object changes

  return { timeLeft, hasStarted };
}