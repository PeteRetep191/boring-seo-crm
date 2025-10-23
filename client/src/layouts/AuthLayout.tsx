import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {

  return (
     <div className="min-h-screen flex items-center justify-center bg-foreground-100">
        <Outlet />
      </div>
  );
}

export default AuthLayout;