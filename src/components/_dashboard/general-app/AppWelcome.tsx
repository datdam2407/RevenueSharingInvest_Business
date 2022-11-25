import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent, CardProps, Box, Avatar } from '@mui/material';
import { SeoIllustration } from '../../../assets';
import { fullName } from 'utils/mock-data/name';
import { Business } from '../../../@types/krowd/business';
import { ROLE_USER_TYPE } from '../../../@types/krowd/users';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'space-evenly',
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

// ----------------------------------------------------------------------

interface AppWelcomeProps extends CardProps {
  business?: Business | null;
  user?: any;
}

export default function AppWelcome({ user, business }: AppWelcomeProps) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          p: { md: 2 },
          color: 'grey.800'
        }}
      >
        <Typography gutterBottom variant="h4" sx={{ textAlign: 'center' }}>
          Chào mừng trở lại,
          <br />
          {user.fullName}
        </Typography>
        <Avatar
          src={user.image}
          sx={{
            p: 3,
            width: 300,
            height: 300,
            mx: 2
          }}
        />
      </CardContent>
    </RootStyle>
  );
}
