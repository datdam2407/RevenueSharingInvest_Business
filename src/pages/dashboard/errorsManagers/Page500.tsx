import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
// material
import { Box, Button, Typography, Container } from '@mui/material';
// components
import Page from 'components/Page';
import { SeverErrorIllustration } from 'assets';
import useAuth from 'hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <RootStyle title="500 Internal Server Error | Krowd dành cho quản lý">
      <Container>
        <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
          <Typography variant="h4" paragraph>
            BẠN KHÔNG CÓ QUYỀN TRUY CẬP
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Tài khoản của bạn không nằm trong hệ thống KROWD
          </Typography>

          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            QUAY LẠI
          </Button>
        </Box>
      </Container>
    </RootStyle>
  );
}
