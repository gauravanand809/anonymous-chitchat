import React from 'react';
import ActiveUsers from '@/components/ActiveUsers';

const UserDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <h2 style={{ marginBottom: '10px', color: '#333' }}>User Dashboard</h2>
      <div style={{marginTop: '10px'}}>
        <ActiveUsers />
      </div>
    </div>
  );
};

export default UserDashboard;
