import React from 'react';
import ActiveUsers from '@/components/ActiveUsers';

const UserDashboard: React.FC = () => {
  return (
    <div>
      <h2>User Dashboard</h2>
      <ActiveUsers />
    </div>
  );
};

export default UserDashboard;
