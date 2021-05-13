import { useLocation } from "react-router-dom";

export default function CommunityPage() {
  const location = useLocation();

  return (
    <div>
      <h3>Community Page</h3>
      <p>
        No content available for <code>{location.pathname}</code>
      </p>
    </div>
  );
}
