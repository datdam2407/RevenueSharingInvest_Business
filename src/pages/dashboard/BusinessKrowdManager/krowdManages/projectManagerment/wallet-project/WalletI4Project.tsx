import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
// material
import {
  Box,
  Menu,
  Card,
  Table,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardHeader,
  TableContainer,
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
  Grid,
  Stack
} from '@mui/material'; // utils
//
import { dispatch, RootState, useSelector } from 'redux/store';
import { fCurrency } from 'utils/formatNumber';
import { Container, styled } from '@mui/system';
import { getWalletByID, getWalletList } from 'redux/slices/krowd_slices/wallet';
import walletIcon from '@iconify/icons-fontisto/wallet';
import { getWalletTransactionList } from 'redux/slices/krowd_slices/transaction';
import { PMWalletTransactionTable } from 'components/_dashboard/general-banking';
import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

import dolarMoney from '@iconify/icons-ant-design/dollar-circle-outlined';
import InfoRecieve from '@iconify/icons-ant-design/solution-outline';
import secureInfo from '@iconify/icons-ant-design/security-scan-outlined';
import question from '@iconify/icons-bi/question-circle';
import moneyCheckDollar from '@iconify/icons-fa6-solid/money-check-dollar';
import { LoadingButton } from '@mui/lab';
import { getProjectId } from 'redux/slices/krowd_slices/project';
// ----------------------------------------------------------------------
type Transfer = {
  id: string;
};
// ----------------------------------------------------------------------
const RootStyle = styled(Card)(({ theme }) => ({
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

export default function WalletI3Project() {
  const [pageIndex, setPageIndex] = useState(1);
  const { walletList, walletDetail } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;

  useEffect(() => {
    dispatch(getWalletList());
  }, [dispatch]);
  const [walletIDTranferFrom, setWalletIDTranferFrom] = useState('');
  const [openModalTransfer, setOpenModalTransfer] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  function getToken() {
    return window.localStorage.getItem('accessToken');
  }
  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }

  const handleClickTranferMoney = (id: string) => {
    setWalletIDTranferFrom(id);
    dispatch(getWalletByID(id));
    setOpenModalTransfer(true);
  };
  const FromWalletId = (listOfProjectWallet && listOfProjectWallet.p2.id) ?? '';
  // Nạp tiền

  const TransferSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Vui lòng nhập số tiền bạn cần chuyển')
      .min(100000, 'Yêu cầu tối thiểu mỗi lần chuyển là 100,000đ')
  });
  const formikTranfer = useFormik({
    initialValues: {
      fromWalletId: FromWalletId,
      toWalletId: walletIDTranferFrom ?? '',
      amount: 0
    },
    enableReinitialize: true,
    validationSchema: TransferSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        await axios
          .put(REACT_APP_API_URL + `/wallets`, values, {
            headers: headers
          })
          .then((res) => {
            enqueueSnackbar('Nạp tiền vào ví thành công', {
              variant: 'success'
            });
            resetForm();
            setOpenModalTransfer(false);
            dispatch(getWalletList());
            dispatch(getWalletTransactionList('', 1, 5));
          })
          .catch(() => {
            enqueueSnackbar('Nạp tiền thất bại vui lòng kiểm tra lại số dư của bạn', {
              variant: 'error'
            });
          })
          .finally(() => {
            setSubmitting(true);
          });
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const {
    errors: errorsTranfer,
    values: valuesTranfer,
    touched: touchedTranfer,
    isSubmitting: isSubmittingTranfer,
    handleSubmit: handleSubmitTranfer,
    getFieldProps: getFieldPropsTranfer
  } = formikTranfer;
  const renderElement = (listWalletP3: any): JSX.Element => {
    const wallet = listWalletP3.find((e: any) => e.projectId === localStorage.getItem('projectId'));
    if (wallet) dispatch(getWalletTransactionList(wallet.id, pageIndex, 200));
    return (
      <>
        <Grid container sx={{ alignItems: 'center' }}>
          <Grid lg={7}>
            <Box display={'flex'}>
              <Icon icon={walletIcon} width={24} height={24} />
              <Typography sx={{ typography: 'subtitle2', mx: 1 }}>
                {wallet?.projectName ?? ''}
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} lg={5} gap={1}>
            {walletDetail.ProjectWallet?.projectStatus !== 'ACTIVE' ? (
              <></>
            ) : (
              <>
                <Button
                  color="primary"
                  sx={{ boxShadow: '0 8px 16px 0 rgb(34 52 54 / 24%)' }}
                  variant="contained"
                  onClick={() => handleClickTranferMoney(wallet.id)}
                >
                  Nạp tiền
                </Button>
                <Dialog fullWidth maxWidth="sm" open={openModalTransfer}>
                  <DialogTitle sx={{ alignItems: 'center', textAlign: 'center' }}>
                    <Box mt={1} display={'flex'} justifyContent={'flex-end'}>
                      <Box>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => setOpenModalTransfer(false)}
                        >
                          X
                        </Button>
                      </Box>
                    </Box>
                    <Icon color="#14b7cc" height={60} width={60} icon={moneyCheckDollar} />
                    <Box mt={1}>
                      <DialogContentText
                        sx={{
                          textAlign: 'center',
                          fontWeight: 900,
                          fontSize: 20,
                          mb: 5,
                          color: 'black'
                        }}
                      >
                        Tạo lệnh nạp tiền
                      </DialogContentText>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <Typography>
                      Số dư ví của {listOfProjectWallet && listOfProjectWallet.p2?.projectName}:{' '}
                      <strong>
                        {fCurrency((listOfProjectWallet && listOfProjectWallet.p2?.balance) ?? '')}
                      </strong>
                    </Typography>
                    <FormikProvider value={formikTranfer}>
                      <Form noValidate autoComplete="off" onSubmit={handleSubmitTranfer}>
                        <Tooltip title="Giao dịch tối thiểu là 100,000đ" placement="bottom-end">
                          <TextField
                            fullWidth
                            label="Số tiền VND"
                            {...getFieldPropsTranfer('amount')}
                            sx={{ my: 2 }}
                            InputProps={{
                              endAdornment: <Icon color="#ff9b26e0" icon={question} />
                            }}
                          />
                        </Tooltip>
                        {touchedTranfer.amount && errorsTranfer.amount && (
                          <FormHelperText error sx={{ px: 2 }}>
                            {touchedTranfer.amount && errorsTranfer.amount}
                          </FormHelperText>
                        )}
                        <RadioGroup row sx={{ my: 2 }} {...getFieldPropsTranfer('amount')}>
                          <FormControlLabel
                            value="100000"
                            control={<Radio />}
                            label="100,000đ"
                            sx={{ px: 2 }}
                          />
                          <FormControlLabel
                            value="500000"
                            control={<Radio />}
                            label="500,000đ"
                            sx={{ px: 2.7 }}
                          />
                          <FormControlLabel
                            value="1000000"
                            control={<Radio />}
                            label="1,000,000đ"
                            sx={{ px: 2 }}
                          />
                          <FormControlLabel
                            value="3000000"
                            control={<Radio />}
                            label="3,000,000đ"
                            sx={{ px: 2 }}
                          />
                          <FormControlLabel
                            value="5000000"
                            control={<Radio />}
                            label="5,000,000đ"
                            sx={{ px: 1 }}
                          />
                          <FormControlLabel
                            value="10000000"
                            control={<Radio />}
                            label="10,000,000đ"
                            sx={{ px: 2.3 }}
                          />
                        </RadioGroup>
                        <Box sx={{ color: '#d58311' }}>
                          <Typography sx={{ my: 1, fontWeight: 500 }}>Lưu ý:</Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box>
                              <Icon color="#d58311" width={20} height={20} icon={InfoRecieve} />
                            </Box>
                            <Box>
                              <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                Số tiền sẽ được nạp từ VÍ THANH TOÁN CHUNG
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box>
                              <Icon color="#d58311" width={20} height={20} icon={dolarMoney} />
                            </Box>
                            <Box>
                              <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                Số tiền bạn chuyển không vượt quá số dư trong ví hiện tại.
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box>
                              <Icon color="#d58311" width={20} height={20} icon={secureInfo} />
                            </Box>
                            <Box>
                              <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                Bạn cần giao dịch nạp tiền tối thiểu là 100,000đ
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <LoadingButton
                          fullWidth
                          type="submit"
                          variant="contained"
                          size="large"
                          loading={isSubmittingTranfer}
                        >
                          Nạp tiền
                        </LoadingButton>
                      </Form>
                    </FormikProvider>
                  </DialogContent>
                </Dialog>{' '}
              </>
            )}
          </Grid>
        </Grid>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography sx={{ typography: 'h3' }}>{fCurrency(wallet?.balance ?? '')}</Typography>
          <Stack direction="row" alignItems="center" flexWrap="wrap"></Stack>
        </Stack>
      </>
    );
  };

  return (
    <>
      <Typography pl={3} variant="h4">
        VÍ THANH TOÁN DỰ ÁN
      </Typography>
      <Container maxWidth={'md'} sx={{ my: 5 }}>
        <RootStyle>
          {listOfProjectWallet &&
            listOfProjectWallet.p4List.length > 0 &&
            renderElement(listOfProjectWallet.p4List)}
        </RootStyle>
      </Container>

      <Container sx={{ my: 5 }} maxWidth={false}>
        <PMWalletTransactionTable type={'ID'} />
      </Container>
    </>
  );
}
