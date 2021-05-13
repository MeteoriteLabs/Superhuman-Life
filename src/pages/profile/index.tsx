import { useLocation } from "react-router-dom";

export default function ProfilePage() {
  const location = useLocation();

  return (
    <div>
      <h3>Profile Page</h3>
      <p>
        No content available for <code>{location.pathname}</code>
      </p>
    </div>
  );
}
