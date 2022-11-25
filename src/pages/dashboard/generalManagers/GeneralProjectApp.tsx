// material
import { Container, Grid, Stack, Typography } from '@mui/material';
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
import { BankingExpenses, BankingIncome, WalletI5 } from 'components/_dashboard/general-banking';
import { useEffect } from 'react';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';

import { ROLE_USER_TYPE } from '../../../@types/krowd/users';

// ----------------------------------------------------------------------

export default function GeneralProjectApp() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { id = '' } = useParams();

  useEffect(() => {
    user?.role === 'BUSINESS_MANAGER'
      ? businessProjectDetail && dispatch(getProjectId(id))
      : dispatch(getMyProject());
  }, [dispatch]);

  const { projectDetailBYID: businessProjectDetail, myProjects: PMMyProject } = useSelector(
    (state: RootState) => state.project
  );
  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;

  return (
    <Page title="Trang chủ doanh nghiệp | Krowd dành cho quản lý">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <AppWelcome user={user} business={businessDetail} />
          </Grid>{' '}
          {user?.role === 'PROJECT_MANAGER' && (
            <>
              <Grid item xs={12} md={7}>
                <Typography variant="h4" sx={{ my: 3 }}>
                  Ví của bạn
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <BankingIncome />
                  <BankingExpenses />
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}></Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h4" sx={{ my: 3 }}>
                  Ví của dự án
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  {/* <WalletI4 /> */}
                  <WalletI5 />
                </Stack>
              </Grid>
            </>
          )}{' '}
          {/* <Grid item xs={12} md={4}>
          //   <AppTotalInstalled />
          // </Grid>
          {user?.role === 'BUSINESS_MANAGER' && (
            <>
              <Grid item xs={12} md={4}>
                <AppTotalDownloads />
              </Grid>
              <Grid item xs={12} lg={8}>
                <AppNewInvoice />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <AppTopRelated />
              </Grid>
            </>
          )}
          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid> */}
          {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
            <Grid item xs={12} md={12} lg={12}>
              {businessProjectDetail.projectDetail && (
                <KrowdProjectStage project={businessProjectDetail.projectDetail} />
              )}
            </Grid>
          )}
          {/* 
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
