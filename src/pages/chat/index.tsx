import { useLocation } from 'react-router-dom';

export default function ChatPage(): JSX.Element {
    const location = useLocation();

    return (
        <div>
            <h3>Chats Page</h3>
            <p>
                No content available for <code>{location.pathname}</code>
            </p>
        </div>
    );
}
