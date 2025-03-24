import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const ActiveUsers: React.FC = () => {
  const { user } = useFirebaseAuth();
  const userId = user?.uid;
  const { activeUsersCount, onlineUsers } = useOnlineStatus(userId); // Get onlineUsers as well

  console.log("ActiveUsers Component - Online Users Data:", onlineUsers); // Log onlineUsers data

  return (
    <div>
      Active Users: {activeUsersCount}
    </div>
  );
};

export default ActiveUsers;
