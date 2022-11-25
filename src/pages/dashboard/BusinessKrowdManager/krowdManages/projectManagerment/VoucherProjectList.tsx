// material
import { Box, CircularProgress, Container, Typography } from '@mui/material';

import Page from 'components/Page';
import VoucherProjectTable from 'components/table/project-table/VoucherProjectTable';
import useAuth from 'hooks/useAuth';

// ----------------------------------------------------------------------

export default function VoucherProjectList() {
  const { user } = useAuth();
  return (
    <Page title="Dự án: Danh sách đang hoạt động| Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <VoucherProjectTable />
      </Container>
    </Page>
  );
}
