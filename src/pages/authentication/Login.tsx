// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography, Tabs, Tab } from '@mui/material';

// components
import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';
import { LoginForm } from '../../components/authentication/login';

const RootStyle = styled(Page)(({ theme }) => ({
  backgroundImage: 'url(/static/background/login_background_business.jpg)',
  objectFit: 'cover',
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

export default function Login() {
  return (
    <RootStyle title="Đăng nhập | Krowd dành cho quản lý">
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5, mx: 'auto' }}>
            Krowd Doanh Nghiệp
          </Typography>
          <img src="/static/illustrations/illustration_business_login.svg" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={3}
            sx={{
              height: 250,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '8%'
            }}
          >
            <LoginForm />
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
