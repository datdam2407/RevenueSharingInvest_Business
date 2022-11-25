// material
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { SeverErrorIllustration } from 'assets';
import Page from 'components/Page';

import ProjectTablePoM from 'components/table/project-table/ProjectTablePoM';
// ----------------------------------------------------------------------

export default function PoMProjectList() {
  return (
    <Page title="Dự án: Danh sách | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <ProjectTablePoM />
      </Container>
    </Page>
  );
}
