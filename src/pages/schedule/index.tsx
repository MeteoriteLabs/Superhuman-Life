import React from 'react';
import { useLocation } from 'react-router-dom';

const SchedulePage: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <h2>Schedules Page</h2>
      <p>
        No content available for <code>{location.pathname}</code>
      </p>
    </div>
  );
};

export default SchedulePage;
