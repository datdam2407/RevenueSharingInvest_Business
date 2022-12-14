import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react';
import trendingUpFill from '@iconify/icons-eva/close-fill';
import shieldCheck from '@iconify/icons-bi/shield-check';
import question from '@iconify/icons-bi/question-circle';

import walletIcon from '@iconify/icons-fontisto/wallet';

// material
import { styled, useTheme } from '@mui/material/styles';
import {
  Card,
  Typography,
  Stack,
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  DialogContent,
  DialogContentText,
  Checkbox,
  FormHelperText
} from '@mui/material';
// utils
import { fCurrency, fPercent } from '../../../utils/formatNumber';
//
import { dispatch, RootState, useSelector } from 'redux/store';
import { useEffect, useState } from 'react';

import { getWalletList, getWalletByID } from 'redux/slices/krowd_slices/wallet';
import { PATH_DASHBOARD } from 'routes/paths';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { REACT_APP_API_URL } from 'config';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getMainUserProfile } from 'redux/slices/krowd_slices/users';
import useAuth from 'hooks/useAuth';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  backgroundSize: 'cover',
  padding: theme.spacing(3),
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#ff9b26e0',
  display: 'flex',
  color: 'white',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));
// ----------------------------------------------------------------------

export default function BankingExpenses() {
  useEffect(() => {
    dispatch(getWalletList());
    dispatch(getMainUserProfile(user?.id));
  }, [dispatch]);
  const { mainUserState } = useSelector((state: RootState) => state.userKrowd);
  const { user: mainUser } = mainUserState;
  const [walletIDWithDraw, setWalletIDWithDraw] = useState('');

  const { user } = useAuth();

  const [openWithDraw, setOpenWithDraw] = useState(false);
  const [check, setCheck] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleOpenTopUp = () => {
    setOpen(true);
  };
  const handleClickWithDraw = async (id: string) => {
    setWalletIDWithDraw(id);
    setOpenWithDraw(true);
  };

  const handleCloseTopUp = () => {
    setOpen(false);
  };
  const handleCheckBox = async () => {
    if (check === false) {
      setCheck(true);
      setFieldValueWithDraw('bankName', mainUser?.bankName);
      setFieldValueWithDraw('bankAccount', mainUser?.bankAccount);
      setFieldValueWithDraw('accountName', `${mainUser?.lastName} ${mainUser?.firstName}`);
    } else {
      setCheck(false);
      setFieldValueWithDraw('bankName', '');
      setFieldValueWithDraw('bankAccount', '');
      setFieldValueWithDraw('accountName', '');
    }
  };
  const handleCloseWithDraw = () => {
    setOpenWithDraw(false);
  };
  const { isLoading, walletList, walletDetail } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;

  const WithDrawSchema = Yup.object().shape({
    bankName: Yup.string().required('Y??u c???u nh???p t??n ng??n h??ng'),
    bankAccount: Yup.string().required('Y??u c???u nh???p t??i kho???n ng??n h??ng'),
    accountName: Yup.string().required('Y??u c???u nh???p t??n ch??? kho???n'),
    amount: Yup.number()
      .required('Vui l??ng nh???p s??? ti???n b???n c???n r??t')
      .min(100000, 'Y??u c???u t???i thi???u m???i l???n r??t l?? 100,000??')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }
  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const formikWithdraw = useFormik({
    initialValues: {
      fromWalletId: walletIDWithDraw,
      bankName: '',
      accountName: '',
      bankAccount: '',
      amount: 0
    },
    enableReinitialize: true,
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
            setOpenWithDraw(false);
            setSubmitting(true);
            dispatch(getWalletList());
          })
          .catch(() => {
            enqueueSnackbar('G???i y??u c???u r??t ti???n th???t b???i vui l??ng ki???m tra l???i s??? d?? c???a b???n', {
              variant: 'error'
            });
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const {
    errors: errorsWithDraw,
    touched: touchedWithDraw,
    isSubmitting: isSubmittingWithdraw,
    handleSubmit: handleSubmitWithDraw,
    getFieldProps: getFieldPropsWithDraw,
    setFieldValue: setFieldValueWithDraw
  } = formikWithdraw;

  //N???p ti???n
  const TopUpSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Vui l??ng nh???p s??? ti???n b???n c???n r??t')
      .min(100000, 'Y??u c???u t???i thi???u m???i l???n r??t l?? 100,000??')
  });
  const formik = useFormik({
    initialValues: {
      amount: 0
    },
    validationSchema: TopUpSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();
        const header = getHeaderFormData();
        formData.append('amount', `${values.amount}`);
        await axios({
          method: 'post',
          url: REACT_APP_API_URL + '/momo/request',
          data: formData,
          headers: header
        })
          .then((res) => {
            window.location.replace(res.data.result.payUrl);
          })
          .catch(() => {
            enqueueSnackbar('C???p nh???t s??? d?? th???t b???i', {
              variant: 'error'
            });
          })
          .finally(() => {});
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      {listOfProjectWallet?.p2 && (
        <RootStyle>
          <Grid container sx={{ alignItems: 'center' }}>
            <Grid lg={7}>
              <Box display={'flex'}>
                <Icon icon={walletIcon} width={24} height={24} />
                <Typography sx={{ typography: 'subtitle2', mx: 1 }}>
                  {listOfProjectWallet?.p2 && listOfProjectWallet.p2.walletType.name}
                </Typography>
              </Box>
            </Grid>

            <Grid>
              <Button
                sx={{ mx: 1, borderColor: 'white' }}
                onClick={handleOpenTopUp}
                color="inherit"
                variant="outlined"
              >
                N???p ti???n
              </Button>
              <Button
                sx={{ borderColor: 'white' }}
                onClick={() => handleClickWithDraw(listOfProjectWallet.p2.id)}
                color="inherit"
                variant="outlined"
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
                    S??? d?? v??: <strong> {fCurrency(listOfProjectWallet.p2.balance)}</strong>
                  </Typography>
                  <FormikProvider value={formikWithdraw}>
                    <Form noValidate autoComplete="off" onSubmit={handleSubmitWithDraw}>
                      <TextField
                        required
                        fullWidth
                        label="T??n ng??n h??ng"
                        {...getFieldPropsWithDraw('bankName')}
                        sx={{ mt: 2 }}
                      />
                      {touchedWithDraw.bankName && errorsWithDraw.bankName && (
                        <FormHelperText error sx={{ px: 2 }}>
                          {touchedWithDraw.bankName && errorsWithDraw.bankName}
                        </FormHelperText>
                      )}
                      <TextField
                        required
                        fullWidth
                        label="T??i kho???n ng??n h??ng"
                        {...getFieldPropsWithDraw('bankAccount')}
                        sx={{ mt: 2 }}
                      />
                      {touchedWithDraw.bankAccount && errorsWithDraw.bankAccount && (
                        <FormHelperText error sx={{ px: 2 }}>
                          {touchedWithDraw.bankAccount && errorsWithDraw.bankAccount}
                        </FormHelperText>
                      )}
                      <TextField
                        required
                        fullWidth
                        label="T??n ch??? t??i kho???n"
                        {...getFieldPropsWithDraw('accountName')}
                        sx={{ mt: 2 }}
                      />
                      {touchedWithDraw.accountName && errorsWithDraw.accountName && (
                        <FormHelperText error sx={{ px: 2 }}>
                          {touchedWithDraw.accountName && errorsWithDraw.accountName}
                        </FormHelperText>
                      )}
                      <Tooltip title="Giao d???ch t???i thi???u l?? 100,000??" placement="bottom-end">
                        <TextField
                          required
                          fullWidth
                          type={'number'}
                          label="S??? ti???n VND"
                          {...getFieldPropsWithDraw('amount')}
                          sx={{ mt: 2 }}
                          InputProps={{
                            endAdornment: <Icon color="#ff9b26e0" icon={question} />
                          }}
                        />
                      </Tooltip>
                      {touchedWithDraw.amount && errorsWithDraw.amount && (
                        <FormHelperText error sx={{ px: 2 }}>
                          {touchedWithDraw.amount && errorsWithDraw.amount}
                        </FormHelperText>
                      )}
                      <Box display={'flex'} alignItems={'center'}>
                        <Checkbox onClick={handleCheckBox} />
                        <Typography>S??? d???ng th??ng tin hi???n c??</Typography>
                      </Box>
                      <RadioGroup row sx={{ my: 2 }} {...getFieldPropsWithDraw('amount')}>
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
                      {listOfProjectWallet.p2.balance > 0 ? (
                        <LoadingButton
                          fullWidth
                          type="submit"
                          variant="contained"
                          size="large"
                          loading={isSubmittingWithdraw}
                        >
                          R??t ti???n
                        </LoadingButton>
                      ) : (
                        <LoadingButton
                          disabled
                          fullWidth
                          type="submit"
                          variant="contained"
                          size="large"
                          loading={isSubmittingWithdraw}
                        >
                          R??t ti???n
                        </LoadingButton>
                      )}
                    </Form>
                  </FormikProvider>
                </DialogContent>
              </Dialog>
            </Grid>
            <Dialog open={open} fullWidth maxWidth="sm">
              <Box sx={{ maxWidth: 500, height: 650, margin: 'auto', textAlign: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    my: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end'
                  }}
                >
                  Thanh to??n ti???n d???ng v???i Momo
                  <DialogActions>
                    <Button color="error" onClick={handleCloseTopUp}>
                      <Icon height={30} icon={trendingUpFill} />
                    </Button>
                  </DialogActions>
                </Typography>

                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      backgroundColor: '#80808021',
                      borderRadius: '5px'
                    }}
                  >
                    <img
                      style={{ width: '40px', height: '40px' }}
                      src="/static/icons/navbar/momo.jpg"
                    />
                    <Typography>
                      S??? d?? v??: {listOfProjectWallet && fCurrency(listOfProjectWallet.p2.balance)}
                    </Typography>
                  </Box>
                </Box>
                <FormikProvider value={formik}>
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Tooltip title="H???n m???c t???i ??a: 50,000,000??" placement="bottom-end">
                      <TextField
                        fullWidth
                        label="S??? ti???n VND"
                        {...getFieldProps('amount')}
                        sx={{ mt: 5 }}
                        InputProps={{
                          endAdornment: <Icon color="#ff9b26e0" icon={question} />
                        }}
                      />
                    </Tooltip>
                    {touched.amount && errors.amount && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.amount && errors.amount}
                      </FormHelperText>
                    )}
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
                      N???p ti???n
                    </LoadingButton>
                  </Form>
                </FormikProvider>
              </Box>
            </Dialog>
          </Grid>

          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography sx={{ typography: 'h3' }}>
              {fCurrency(listOfProjectWallet.p2.balance)}
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
