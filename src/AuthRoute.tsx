import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AuthRouteProps = React.PropsWithChildren<{
  path: string;
  exact?: boolean
}>;

const AuthRoute: React.FC<AuthRouteProps> = ({
  children, path, exact,
}: AuthRouteProps) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null;
  }
  
  return (
    <Route
      path={path}
      exact={exact}
    >
      { user ? children : <Redirect to="/signin" /> }
    </Route>
  )
};

export default AuthRoute;
