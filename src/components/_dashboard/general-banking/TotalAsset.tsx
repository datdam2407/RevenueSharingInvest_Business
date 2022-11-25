import { Icon } from '@iconify/react';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
import walletIcon from '@iconify/icons-fontisto/wallet';
import dolarMoney from '@iconify/icons-ant-design/dollar-circle-outlined';
import InfoRecieve from '@iconify/icons-ant-design/solution-outline';
import secureInfo from '@iconify/icons-ant-design/security-scan-outlined';
import question from '@iconify/icons-bi/question-circle';
import * as Yup from 'yup';
import moneyBillTransfer from '@iconify/icons-fa6-solid/money-bill-transfer';
import shieldCheck from '@iconify/icons-bi/shield-check';

// material
import { styled } from '@mui/material/styles';
import {
  Card,
  Typography,
  Stack,
  Grid,
  Box,
  Button,
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  TextField,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox
} from '@mui/material';
// utils
import { fCurrency, fPercent } from '../../../utils/formatNumber';
import { Form, FormikProvider, useFormik } from 'formik';

//
import { dispatch, RootState, useSelector } from 'redux/store';
import { getWalletByID, getWalletList } from 'redux/slices/krowd_slices/wallet';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
import { getWalletTransactionList } from 'redux/slices/krowd_slices/transaction';

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

export default function TotalAsset() {
  const { isLoading, walletList } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;
  const [openWithDraw, setOpenWithDraw] = useState(false);

  const [openModalTransfer, setOpenModalTransfer] = useState(false);

  return (
    <>
      {listOfProjectWallet && (
        <RootStyle>
          <Grid container sx={{ alignItems: 'center' }}>
            <Grid lg={6}>
              <Box display={'flex'}>
                <Icon icon={walletIcon} width={24} height={24} />
                <Typography sx={{ typography: 'subtitle2', mx: 1 }}>Tổng tài sản</Typography>
              </Box>
            </Grid>
          </Grid>

          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography sx={{ typography: 'h3' }}>{fCurrency(walletList.totalAsset)}</Typography>
            <Stack direction="row" alignItems="center" flexWrap="wrap">
              <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}>
                {/* &nbsp;Chưa cập nhật */}
              </Typography>
            </Stack>
          </Stack>
        </RootStyle>
      )}
    </>
  );
}
