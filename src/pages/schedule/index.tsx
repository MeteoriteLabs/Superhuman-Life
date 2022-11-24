import { useLocation } from "react-router-dom";

export default function SchedulePage() {
  const location = useLocation();

  return (
    <div>
      <h2>Schedules Page</h2>
      <p>
        No content available for <code>{location.pathname}</code>
      </p>
    </div>
  );
}
