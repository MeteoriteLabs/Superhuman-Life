import { useLocation } from 'react-router-dom';

export default function ClientPage() {
    const location = useLocation();

    return (
        <div>
            <h3>Clients Page</h3>
            <p>
                No content available for <code>{location.pathname}</code>
            </p>
        </div>
    );
}
