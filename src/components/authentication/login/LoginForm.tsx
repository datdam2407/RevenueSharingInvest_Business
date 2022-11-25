import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_DASHBOARD, PATH_PAGE } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
//
import { MIconButton } from '../../@material-extend';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import ClassNameGenerator from '@mui/utils/ClassNameGenerator';
import { setSession } from 'utils/jwt';
import { ErrorMessage } from 'formik';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleLoginGoogle = async () => {
    try {
      await login();
      navigate(PATH_DASHBOARD.root);
    } catch (error) {
      if (!404) {
        navigate(PATH_AUTH.login);
      } else {
        // navigate(PATH_PAGE.page500);
      }
    }
  };

  return (
    <Box p={7}>
      <Typography variant="h4" sx={{ color: '#ffffff', textAlign: 'center' }}>
        Đăng nhập vào KROWD
      </Typography>
      <LoadingButton
        style={{
          backgroundColor: '#FFF',
          color: 'black',
          marginTop: '2rem',
          paddingRight: '2rem'
        }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleLoginGoogle}
      >
        <img
          src={`/static/icons/navbar/ic_google.svg`}
          style={{ paddingRight: '1rem' }}
          height={24}
        />{' '}
        Đăng nhập với Google
      </LoadingButton>
    </Box>
  );
}
