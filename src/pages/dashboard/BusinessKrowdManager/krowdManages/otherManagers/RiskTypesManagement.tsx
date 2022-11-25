import { Container } from '@mui/material';
// redux

import Page from '../../../../../components/Page';

import RiskTypeTable from 'components/table/other-table/RiskTypeTable';

// ----------------------------------------------------------------------

export default function RiskManagement() {
  return (
    <Page title="Các loại rủi ro: Danh sách | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <RiskTypeTable />
      </Container>
    </Page>
  );
}
