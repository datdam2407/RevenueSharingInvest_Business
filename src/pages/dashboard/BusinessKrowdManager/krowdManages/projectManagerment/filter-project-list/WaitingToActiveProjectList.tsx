// material
import { Box, CircularProgress, Container, Typography } from '@mui/material';

import Page from 'components/Page';
import WaitingToActiveProjectTable from 'components/table/project-table/filter-project-table/WaitingToActiveProjectTable';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getBusinessById } from 'redux/slices/krowd_slices/business';
import { dispatch, RootState } from 'redux/store';
import { ErrorProject } from '../ProjectDetails';
// ----------------------------------------------------------------------

export default function WaitingToActiveProjectList() {
  const { user } = useAuth();
  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;

  useEffect(() => {
    dispatch(getBusinessById(user?.businessId));
  }, [dispatch]);
  return (
    <Page title="Dự án đang chờ kích hoạt | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        {(isLoading && (
          <Box>
            <CircularProgress
              size={100}
              sx={{ margin: '0px auto', padding: '1rem', display: 'flex' }}
            />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
              Đang tải dữ liệu, vui lòng đợi giây lát...
            </Typography>
          </Box>
        )) ||
          (businessDetail?.status === 'ACTIVE' && <WaitingToActiveProjectTable />) || (
            <ErrorProject type="UNKNOWN ERROR" />
          )}
      </Container>
    </Page>
  );
}
