import { Container } from '@mui/material';

import Page from '../../../../../components/Page';

import RoleTable from 'components/table/other-table/RoleTable';

// ----------------------------------------------------------------------

export default function RolesManagement() {
  return (
    <Page title="Vai trò: Danh sách | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <RoleTable />
      </Container>
    </Page>
  );
}
