// material
import { Box, CircularProgress, Container, Typography } from '@mui/material';
// redux
// routes
// hooks
import Page from '../../../../../components/Page';

import InvestorKrowdTable from 'components/table/user-table/InvestorKrowdTable';
import { SeverErrorIllustration } from 'assets';
import useAuth from 'hooks/useAuth';
import { dispatch, RootState, useSelector } from 'redux/store';
import { useEffect } from 'react';
import { getBusinessById } from 'redux/slices/krowd_slices/business';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function InvestorList() {
  const { user } = useAuth();
  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;
  useEffect(() => {
    dispatch(getBusinessById(user?.businessId));
  }, [dispatch]);
  return (
    <Page title="Danh sách người đầu tư | Krowd dành cho quản lý">
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
        )) || <InvestorKrowdTable /> || <ErrorProject type="UNKNOWN ERROR" />}
      </Container>
    </Page>
  );
}
export function ErrorProject({ type }: { type: 'EMPTY' | 'UNKNOWN ERROR' }) {
  const content =
    type === 'EMPTY'
      ? {
          title: 'BẠN CHƯA CÓ DỰ ÁN',
          advise: 'Hãy Tạo dự án mới',
          button: true
        }
      : {
          title: 'CHỜ KROWD DUYỆT DOANH NGHIỆP CHO BẠN NHA!',
          advise: 'Hãy thử lại sau khi chúng tôi duyệt doanh nghiệp của bạn',
          button: false
        };

  return (
    <Container>
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center', py: 10 }}>
        <Typography variant="h6" paragraph>
          {content.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>{content.advise}</Typography>

        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
      </Box>
    </Container>
  );
}
