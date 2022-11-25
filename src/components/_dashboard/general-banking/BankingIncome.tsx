import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
import diagonalArrowRightUpFill from '@iconify/icons-eva/diagonal-arrow-right-up-fill';
import walletIcon from '@iconify/icons-fontisto/wallet';

// material
import { styled, useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, Grid, Box } from '@mui/material';
// utils
import { fCurrency, fPercent } from '../../../utils/formatNumber';
//
import BaseOptionChart from '../../charts/BaseOptionChart';
import { dispatch, RootState, useSelector } from 'redux/store';
import { useEffect } from 'react';
import { getWalletList } from 'redux/slices/krowd_slices/wallet';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  backgroundSize: 'cover',
  padding: theme.spacing(3),
  backgroundRepeat: 'no-repeat',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  color: 'white',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

// ----------------------------------------------------------------------

export default function BankingIncome() {
  useEffect(() => {
    dispatch(getWalletList());
  }, [dispatch]);

  const theme = useTheme();
  const { isLoading, walletList } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;
  return (
    <>
      {listOfProjectWallet && (
        <RootStyle>
          <Grid container sx={{ alignItems: 'center' }}>
            <Grid lg={8}>
              <Box display={'flex'}>
                <Icon icon={walletIcon} width={24} height={24} />
                <Typography sx={{ typography: 'subtitle2', mx: 1 }}>
                  {listOfProjectWallet.p1.walletType.name}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography sx={{ typography: 'h3' }}>
              {fCurrency(listOfProjectWallet.p1.balance)}
            </Typography>
            <Stack direction="row" alignItems="center" flexWrap="wrap">
              <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}></Typography>
            </Stack>
          </Stack>
        </RootStyle>
      )}
    </>
  );
}
