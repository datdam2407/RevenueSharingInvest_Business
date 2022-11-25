// material
import { Grid, Container, Stack, Typography, Box } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import {
  BookingTotal,
  BookingCheckIn,
  BookingDetails,
  BookingCheckOut,
  BookingBookedRoom,
  BookingTotalIncomes,
  BookingRoomAvailable,
  BookingNewestBooking,
  BookingCheckInWidgets,
  BookingCustomerReviews,
  BookingReservationStats
} from '../../../components/_dashboard/general-booking';
import { BankingExpenses, BankingIncome } from 'components/_dashboard/general-banking';
import WalletI3Project from '../BusinessKrowdManager/krowdManages/projectManagerment/wallet-project/WalletI3Project';
import WalletI4Project from '../BusinessKrowdManager/krowdManages/projectManagerment/wallet-project/WalletI4Project';
import { RootState, useSelector } from 'redux/store';

// ----------------------------------------------------------------------

export default function GeneralBooking() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Ví: Đầu tư dự án | Krowd dành cho quản lý">
      <Container maxWidth={false}>
        <Typography variant="h4">VÍ ĐẦU TƯ DỰ ÁN</Typography>
        <Grid container spacing={3}>
          <Grid container xs={12} md={12}>
            <Grid item xs={12} md={12}>
              <Box sx={{ my: 3 }}>
                <WalletI3Project />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
