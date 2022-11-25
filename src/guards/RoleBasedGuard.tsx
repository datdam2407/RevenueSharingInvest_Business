import { ReactNode } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { ROLE_USER_TYPE } from '../@types/krowd/users';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  children: ReactNode | string;
};

const useCurrentRole = () => {
  // Logic here to get current user role
  const role = ROLE_USER_TYPE.BUSINESS_MANAGER;
  return role;
};

export default function RoleBasedGuard({ children }: RoleBasedGuardProp) {
  const currentRole = useCurrentRole();
  const { user } = useAuth();
  if (!user || user.role !== currentRole) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
