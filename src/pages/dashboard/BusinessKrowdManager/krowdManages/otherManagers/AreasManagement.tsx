// material
import { Container } from '@mui/material';
// redux
// import { getUserList, deleteUser } from '../../redux/slices/user';
// routes
// hooks
// @types
// import { UserManager } from '../../@types/user';
// components
import Page from '../../../../../components/Page';

import AreaTable from 'components/table/other-table/AreaTable';

export default function FieldManagement() {
  return (
    <Page title="Khu vực: Danh sách | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <AreaTable />
      </Container>
    </Page>
  );
}
