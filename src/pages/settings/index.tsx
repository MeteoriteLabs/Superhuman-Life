import { useLocation } from "react-router-dom";

export default function SettingsPage() {
    const location = useLocation();

    return (
        <div>
            <h3>Settings Page</h3>
            <p>
                No content available for <code>{location.pathname}</code>
            </p>
        </div>
    );
}
