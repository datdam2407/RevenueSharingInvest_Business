import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import closeIcon from '@iconify/icons-ant-design/close-outline';

// material
import {
  Box,
  Card,
  Button,
  Typography,
  Grid,
  Stack,
  Autocomplete,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tooltip,
  Checkbox,
  FormHelperText
} from '@mui/material';
// utils
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
import shieldCheck from '@iconify/icons-bi/shield-check';
import question from '@iconify/icons-bi/question-circle';
import useAuth from 'hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import { getMainUserProfile } from 'redux/slices/krowd_slices/users';
import dolarMoney from '@iconify/icons-ant-design/dollar-circle-outlined';
import InfoRecieve from '@iconify/icons-ant-design/solution-outline';
import secureInfo from '@iconify/icons-ant-design/security-scan-outlined';
import moneyBillTransfer from '@iconify/icons-fa6-solid/money-bill-transfer';

// ----------------------------------------------------------------------

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
  const { mainUserState } = useSelector((state: RootState) => state.userKrowd);
  const { user: mainUser } = mainUserState;
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, walletList } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;
  const [openWithDraw, setOpenWithDraw] = useState(false);
  const { user } = useAuth();
  const [check, setCheck] = useState(false);
  const walletId = listOfProjectWallet?.p3List.find(
    (e: any) => e.projectId === localStorage.getItem('projectId')
  );

  const handleClickTranferMoney = (id: string) => {
    setWalletIDTranferFrom(id);
    dispatch(getWalletByID(id));
    setOpenModalTransfer(true);
  };
  const [pageIndex, setPageIndex] = useState(1);
  const [walletIDTranferFrom, setWalletIDTranferFrom] = useState('');
  const [openModalTransfer, setOpenModalTransfer] = useState(false);
  useEffect(() => {
    dispatch(getWalletList());
  }, [dispatch]);

  const handleOpenWithDraw = () => {
    setOpenWithDraw(true);
  };
  const handleCloseWithDraw = () => {
    setOpenWithDraw(false);
  };
  const handleCheckBox = async () => {
    dispatch(getMainUserProfile(user?.id));
    if (check === false) {
      setCheck(true);
      setFieldValue('bankName', mainUser?.bankName);
      setFieldValue('bankAccount', mainUser?.bankAccount);
      setFieldValue('accountName', `${mainUser?.lastName} ${mainUser?.firstName}`);
    } else {
      setCheck(false);
      setFieldValue('bankName', '');
      setFieldValue('bankAccount', '');
      setFieldValue('accountName', '');
    }
  };
  const WithDrawSchema = Yup.object().shape({
    bankName: Yup.string().required('Y??u c???u nh???p t??n ng??n h??ng'),
    bankAccount: Yup.string().required('Y??u c???u nh???p t??i kho???n ng??n h??ng'),
    accountName: Yup.string().required('Y??u c???u nh???p t??n ch??? kho???n'),
    amount: Yup.string().required('Y??u c???u nh???p s??? ti???n')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }

  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const formik = useFormik({
    initialValues: {
      fromWalletId: walletId?.id,
      bankName: '',
      accountName: '',
      bankAccount: '',
      amount: 0
    },
    validationSchema: WithDrawSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();

        await axios
          .post(REACT_APP_API_URL + `/withdraw_requests`, values, {
            headers: headers
          })
          .then(() => {
            enqueueSnackbar('G???i y??u c???u r??t ti???n th??nh c??ng', {
              variant: 'success'
            });
            resetForm();
            setSubmitting(true);
          })
          .catch(() => {
            enqueueSnackbar('G???i y??u c???u r??t ti???n th???t b???i vui l??ng ki???m tra l???i s??? d?? c???a b???n', {
              variant: 'error'
            });
          })
          .finally(() => {});
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const ToWalletId = (listOfProjectWallet && listOfProjectWallet.p5.id) ?? '';
  // CHuy???n ti???n

  const TransferSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Vui l??ng nh???p s??? ti???n b???n c???n chuy???n')
      .min(100000, 'Y??u c???u t???i thi???u m???i l???n chuy???n l?? 100,000??')
  });
  const formikTranfer = useFormik({
    initialValues: {
      fromWalletId: walletIDTranferFrom,
      toWalletId: ToWalletId ?? '',
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
            enqueueSnackbar('Chuy???n ti???n th??nh c??ng', {
              variant: 'success'
            });
            resetForm();
            setOpenModalTransfer(false);
            dispatch(getWalletList());
          })
          .catch(() => {
            enqueueSnackbar('Chuy???n ti???n th???t b???i vui l??ng ki???m tra l???i s??? d?? c???a b???n', {
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
    touched: touchedTranfer,
    isSubmitting: isSubmittingTranfer,
    handleSubmit: handleSubmitTranfer,
    getFieldProps: getFieldPropsTranfer
  } = formikTranfer;

  const renderElement = (listWalletP3: any): JSX.Element => {
    const wallet = listWalletP3.find((e: any) => e.projectId === localStorage.getItem('projectId'));
    dispatch(getWalletTransactionList(wallet.id, pageIndex, 200));

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
            <Button onClick={() => handleOpenWithDraw}></Button>
            <Button
              color="primary"
              sx={{ boxShadow: '0 8px 16px 0 rgb(34 52 54 / 24%)' }}
              variant="contained"
              onClick={() => handleClickTranferMoney(wallet.id)}
            >
              Chuy???n ti???n
            </Button>{' '}
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
                <Icon color="#14b7cc" height={60} width={60} icon={moneyBillTransfer} />
                <Box mt={1}>
                  <DialogContentText
                    sx={{
                      textAlign: 'center',
                      fontWeight: 900,
                      fontSize: 20,
                      color: 'black'
                    }}
                  >
                    T???o l???nh chuy???n ti???n
                  </DialogContentText>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Typography>
                  S??? d?? v?? :<strong>{fCurrency(wallet.balance ?? '')}</strong>
                </Typography>
                <FormikProvider value={formikTranfer}>
                  <Form noValidate autoComplete="off" onSubmit={handleSubmitTranfer}>
                    <Tooltip title="Giao d???ch t???i thi???u l?? 100,000??" placement="bottom-end">
                      <TextField
                        fullWidth
                        label="S??? ti???n VND"
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

                    <Box sx={{ color: '#d58311' }}>
                      <Typography sx={{ my: 1, fontWeight: 500 }}>L??u ??:</Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Icon color="#d58311" width={20} height={20} icon={InfoRecieve} />
                        </Box>
                        <Box>
                          <Typography sx={{ textAlign: 'left', ml: 1 }}>
                            S??? ti???n trong V?? ?????U T?? D??? ??N c???a b???n s??? ???????c chuy???n v??o V?? THU TI???N
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Icon color="#d58311" width={20} height={20} icon={dolarMoney} />
                        </Box>
                        <Box>
                          <Typography sx={{ textAlign: 'left', ml: 1 }}>
                            S??? ti???n b???n chuy???n kh??ng v?????t qu?? s??? d?? trong v?? hi???n t???i.
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Icon color="#d58311" width={20} height={20} icon={secureInfo} />
                        </Box>
                        <Box>
                          <Typography sx={{ textAlign: 'left', ml: 1 }}>
                            B???n c???n giao d???ch chuy???n ti???n t???i thi???u l?? 100,000??
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
                      Chuy???n ti???n
                    </LoadingButton>
                  </Form>
                </FormikProvider>
              </DialogContent>
            </Dialog>
            {/* <Button
              onClick={handleOpenWithDraw}
              color="primary"
              sx={{ boxShadow: '0 8px 16px 0 rgb(34 52 54 / 24%)' }}
              variant="contained"
            >
              R??t ti???n
            </Button>
            <Dialog fullWidth maxWidth="sm" open={openWithDraw}>
              <DialogTitle sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Box mt={1} display={'flex'} justifyContent={'flex-end'}>
                  <Box>
                    <Button variant="contained" color="error" onClick={handleCloseWithDraw}>
                      X
                    </Button>
                  </Box>
                </Box>
                <Icon color="#14b7cc" height={60} width={60} icon={walletIcon} />
              </DialogTitle>
              <DialogContent>
                <Box mt={1}>
                  <DialogContentText
                    sx={{
                      textAlign: 'center',
                      fontWeight: 900,
                      fontSize: 20,
                      color: 'black'
                    }}
                  >
                    T???o l???nh r??t ti???n
                  </DialogContentText>
                </Box>
                <Typography>
                  S??? d?? v??: <strong>{fCurrency(wallet?.balance ?? '')}</strong>
                </Typography>
                <FormikProvider value={formik}>
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <TextField
                      required
                      fullWidth
                      label="T??i kho???n ng??n h??ng"
                      {...getFieldProps('bankName')}
                      sx={{ mt: 2 }}
                    />

                    <TextField
                      required
                      fullWidth
                      label="T??i kho???n ng??n h??ng"
                      {...getFieldProps('bankAccount')}
                      sx={{ mt: 2 }}
                    />

                    <TextField
                      required
                      fullWidth
                      label="T??n ch??? t??i kho???n"
                      {...getFieldProps('accountName')}
                      sx={{ mt: 2 }}
                    />

                    <Tooltip title="Giao d???ch t???i thi???u l?? 10,000??" placement="bottom-end">
                      <TextField
                        fullWidth
                        label="S??? ti???n VND"
                        {...getFieldProps('amount')}
                        sx={{ mt: 2 }}
                        InputProps={{
                          endAdornment: <Icon color="#ff9b26e0" icon={question} />
                        }}
                      />
                    </Tooltip>
                    <Box display={'flex'} alignItems={'center'}>
                      <Checkbox onClick={handleCheckBox} />
                      <Typography>S??? d???ng th??ng tin hi???n c??</Typography>
                    </Box>
                    <RadioGroup row sx={{ my: 2 }} {...getFieldProps('amount')}>
                      <FormControlLabel
                        value="300000"
                        control={<Radio />}
                        label="300,000??"
                        sx={{ px: 2 }}
                      />
                      <FormControlLabel
                        value="500000"
                        control={<Radio />}
                        label="500,000??"
                        sx={{ px: 2.7 }}
                      />
                      <FormControlLabel
                        value="1000000"
                        control={<Radio />}
                        label="1,000,000??"
                        sx={{ px: 2 }}
                      />
                      <FormControlLabel
                        value="3000000"
                        control={<Radio />}
                        label="3,000,000??"
                        sx={{ px: 2 }}
                      />
                      <FormControlLabel
                        value="5000000"
                        control={<Radio />}
                        label="5,000,000??"
                        sx={{ px: 1 }}
                      />
                      <FormControlLabel
                        value="10000000"
                        control={<Radio />}
                        label="10,000,000??"
                        sx={{ px: 2.3 }}
                      />
                    </RadioGroup>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <Icon color="green" width={30} height={30} icon={shieldCheck} />
                      <Typography sx={{ mt: 3, textAlign: 'left', ml: 1 }}>
                        M???i th??ng tin kh??ch h??ng ?????u ???????c m?? h??a ????? b???o m???t th??ng tin kh??ch h??ng.
                      </Typography>
                    </Box>
                    <LoadingButton
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                    >
                      R??t ti???n
                    </LoadingButton>
                  </Form>
                </FormikProvider>
              </DialogContent>
            </Dialog> */}
            {/* <Button
              onClick={handleOpenHistoryTrans}
              color="primary"
              sx={{ boxShadow: '0 8px 16px 0 rgb(34 52 54 / 24%)' }}
              variant="contained"
            >
              Giao d???ch
            </Button> */}
          </Grid>
        </Grid>

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography sx={{ typography: 'h3' }}>{fCurrency(wallet?.balance ?? '')}</Typography>
          <Stack direction="row" alignItems="center" flexWrap="wrap">
            {/* <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}>
              &nbsp;Ch??a c???p nh???t
            </Typography> */}
          </Stack>
        </Stack>
      </>
    );
  };

  return (
    <>
      <Container maxWidth={'md'} sx={{ my: 5 }}>
        <RootStyle>
          {listOfProjectWallet &&
            listOfProjectWallet.p3List.length > 0 &&
            renderElement(listOfProjectWallet.p3List)}
        </RootStyle>
      </Container>

      <Container sx={{ my: 5 }} maxWidth={false}>
        <PMWalletTransactionTable type={'ID'} />
      </Container>
    </>
  );
}
