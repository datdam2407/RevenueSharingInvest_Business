// material
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { Project } from '../../../../../../@types/krowd/project';

import Page from 'components/Page';
import StageReportPeriodRevenue from 'components/table/report/StageReportPeriodRevenue';
import StageListKrowdTable from 'components/table/user-table/StageListKrowdTable';

// ----------------------------------------------------------------------

export default function StageProjectList({ project }: { project: Project }) {
  return (
    <Page title="Giai đoạn | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <StageListKrowdTable project={project} />
      </Container>
    </Page>
  );
}
