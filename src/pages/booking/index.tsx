import { useLocation } from "react-router-dom";

export default function BookingPage() {
  const location = useLocation();

  return (
    <div>
      <h3>Bookings Page</h3>
      <p>
        No content available for <code>{location.pathname}</code>
      </p>
    </div>
  );
}
