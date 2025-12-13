import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { firebaseApp } from './firebase';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const auth = getAuth(firebaseApp);

type AuthRouteProps = React.PropsWithChildren<{
  path: string;
  exact?: boolean
}>;

const AuthRoute: React.FC<AuthRouteProps> = ({
  children, path, exact,
}: AuthRouteProps) => {
  const [user] = useAuthState(auth);
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
