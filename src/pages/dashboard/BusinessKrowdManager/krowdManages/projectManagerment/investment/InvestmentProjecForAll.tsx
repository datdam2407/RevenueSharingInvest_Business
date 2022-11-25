// material
import { Box, CircularProgress, Container, Typography } from '@mui/material';

import Page from 'components/Page';
import ProjectOfInvestmentAll from 'components/table/investment-project/ProjectOfInvestmentAll';

// ----------------------------------------------------------------------

export default function InvestmentProjecForAll() {
  return (
    <Page title="Danh sách đầu tư | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <ProjectOfInvestmentAll />
      </Container>
    </Page>
  );
}
