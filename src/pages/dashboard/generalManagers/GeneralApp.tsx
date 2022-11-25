// material
import { Card, Container, Divider, Grid, Stack, Typography } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import {
  AppWelcome,
  AppWidgets1,
  AppWidgets2,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  KrowdProjectStage,
  AppTotalDownloads,
  AppTotalInstalled,
  AppCurrentDownload,
  AppTotalActiveUsers,
  AppTopInstalledCountries
} from '../../../components/_dashboard/general-app';
import { dispatch, RootState, useSelector } from 'redux/store';
import { Link, useParams } from 'react-router-dom';
import {
  BankingExpenses,
  BankingIncome,
  WalletI5,
  PMWalletTransactionTable,
  WalletI3Table,
  WalletI4Table
} from 'components/_dashboard/general-banking';
import { useEffect } from 'react';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';

import { ROLE_USER_TYPE } from '../../../@types/krowd/users';
import BusinessDetails from '../BusinessKrowdManager/krowdManages/businessManagement/BusinessDetails';
import { ChartPie } from 'components/charts';
import { getBusinessById } from 'redux/slices/krowd_slices/business';
import TotalAsset from 'components/_dashboard/general-banking/TotalAsset';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  useEffect(() => {
    user?.role === 'BUSINESS_MANAGER'
      ? dispatch(getBusinessById(user?.businessId))
      : dispatch(getMyProject());
  }, [dispatch]);

  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;

  return (
    <Page title="Trang chủ doanh nghiệp | Krowd dành cho quản lý">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {user?.role === 'PROJECT_MANAGER' && (
            <>
              <Grid item xs={12} md={3}>
                <AppWelcome user={user} business={businessDetail} />
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography variant="h4" sx={{ my: 3 }}>
                  Ví của dự án
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <TotalAsset />
                  <BankingIncome />
                </Stack>
                <Grid sx={{ mt: 2 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <BankingExpenses />
                    <WalletI5 />
                  </Stack>
                </Grid>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" sx={{ my: 3 }}></Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={6}>
                    <Stack direction={{ xs: 'column', sm: 'column' }} spacing={3}>
                      <WalletI3Table />
                    </Stack>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Stack direction={{ xs: 'column', sm: 'column' }} spacing={3}>
                      <WalletI4Table />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              {/* <Grid item xs={12} md={12}>
                <PMWalletTransactionTable type={'ALL'} />
              </Grid> */}

              <Grid item xs={4} md={4}>
                <Stack direction={{ xs: 'column', sm: 'column' }} spacing={3}></Stack>
              </Grid>
            </>
          )}
          {user?.role === 'BUSINESS_MANAGER' && (
            <>{businessDetail && <BusinessDetails currentBusiness={businessDetail} />}</>
          )}
          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidgets1 />
              <AppWidgets2 />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
