import { useLocation } from "react-router-dom";

export default function SchedulePage() {
  const location = useLocation();

  return (
    <div>
      <h3>Schedules Page</h3>
      <p>
        No content available for <code>{location.pathname}</code>
      </p>
    </div>
  );
}
