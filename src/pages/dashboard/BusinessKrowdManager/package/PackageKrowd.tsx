// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Switch,
  Container,
  Typography,
  Stack,
  Divider,
  Button,
  Dialog,
  Chip
} from '@mui/material';
import Page from 'components/Page';
import { PlanFreeIcon, PlanPremiumIcon, PlanStarterIcon } from 'assets';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'routes/paths';
import { Icon } from '@iconify/react';
// components
//
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import { useEffect, useState } from 'react';
import ProjectDetailHeading from '../details/ProjectDetailHeading';
import { useSelector } from 'react-redux';
import { dispatch, RootState } from 'redux/store';
import { Project, PROJECT_STATUS } from '../../../../@types/krowd/project';
import { MHidden } from 'components/@material-extend';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';
import PricingPlanPackageKrowd from './PricingPlanPackageKrowd';

const StyleStatus = [
  { name: PROJECT_STATUS.DRAFT, bgcolor: 'primary.main', vn: 'BẢN NHÁP' },
  { name: PROJECT_STATUS.ACTIVE, bgcolor: 'primary.success', vn: 'KÊU GỌI THÀNH CÔNG' }
];
// ----------------------------------------------------------------------

const PLANS = [
  {
    name: 'Cơ bản',
    price: 500000,
    quantity: 50,
    descriptionList: ['Phần thưởng 1', 'Phần thưởng 2', 'Phần thưởng 3']
  },
  {
    name: 'starter',
    // icon: <PlanStarterIcon />,
    price: 2000000,
    quantity: 20,
    lists: ['Phần thưởng 1', 'Phần thưởng 2']
  },
  {
    name: 'Premium',
    // icon: <PlanPremiumIcon />,
    price: 5000000,
    quantity: 50,
    lists: ['Ưu đãi đặc biệt', 'Ưu đãi đặc biệt']
  }
];

const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(7),
  paddingBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

export default function PackageProject() {
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   dispatch(getMyProject());
  // }, [dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RootStyle title="Gói ưu đãi | Krowd">
      <HeaderBreadcrumbs
        heading={''}
        links={[
          { name: 'Thông tin', href: PATH_DASHBOARD.projects.myProject },
          { name: 'Gói dự án', href: PATH_DASHBOARD.projects.myPackage },
          { name: '' }
        ]}
        action={
          <Box>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              startIcon={<Icon icon={editTwotone} />}
              color={'warning'}
            >
              Cập nhật gói dự án
            </Button>
            <Dialog open={open} onClose={handleClose}>
              {/* <BusinessProjectFormUpdate p={project} /> */}
            </Dialog>
          </Box>
        }
      />
      <Container maxWidth="lg" sx={{ paddingBottom: '5rem' }}>
        <Box>
          <Typography textAlign="center" py={5} color={'#666'} variant="h3">
            Các loại gói đầu tư
          </Typography>
          <Box mx="auto" width={'10%'} pb={3}>
            <Divider sx={{ my: 1, borderBottomWidth: 'thick', color: 'primary.main' }} />
          </Box>
        </Box>
        <Grid container spacing={3}>
          {PLANS.map((card) => (
            <Grid item xs={12} md={4} key={card.name}>
              {/* <PricingPlanPackageKrowd /> */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}
