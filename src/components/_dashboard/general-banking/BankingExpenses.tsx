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
    bankName: Yup.string().required('Yêu cầu nhập tên ngân hàng'),
    bankAccount: Yup.string().required('Yêu cầu nhập tài khoản ngân hàng'),
    accountName: Yup.string().required('Yêu cầu nhập tên chủ khoản'),
    amount: Yup.number()
      .required('Vui lòng nhập số tiền bạn cần rút')
      .min(100000, 'Yêu cầu tối thiểu mỗi lần rút là 100,000đ')
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
            enqueueSnackbar('Gửi yêu cầu rút tiền thành công', {
              variant: 'success'
            });
            resetForm();
            setOpenWithDraw(false);
            setSubmitting(true);
            dispatch(getWalletList());
          })
          .catch(() => {
            enqueueSnackbar('Gửi yêu cầu rút tiền thất bại vui lòng kiểm tra lại số dư của bạn', {
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

  //Nạp tiền
  const TopUpSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Vui lòng nhập số tiền bạn cần rút')
      .min(100000, 'Yêu cầu tối thiểu mỗi lần rút là 100,000đ')
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
            enqueueSnackbar('Cập nhật số dư thất bại', {
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
                Nạp tiền
              </Button>
              <Button
                sx={{ borderColor: 'white' }}
                onClick={() => handleClickWithDraw(listOfProjectWallet.p2.id)}
                color="inherit"
                variant="outlined"
              >
                Rút tiền
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
                      Tạo lệnh rút tiền
                    </DialogContentText>
                  </Box>
                  <Typography>
                    Số dư ví: <strong> {fCurrency(listOfProjectWallet.p2.balance)}</strong>
                  </Typography>
                  <FormikProvider value={formikWithdraw}>
                    <Form noValidate autoComplete="off" onSubmit={handleSubmitWithDraw}>
                      <TextField
                        required
                        fullWidth
                        label="Tên ngân hàng"
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
                        label="Tài khoản ngân hàng"
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
                        label="Tên chủ tài khoản"
                        {...getFieldPropsWithDraw('accountName')}
                        sx={{ mt: 2 }}
                      />
                      {touchedWithDraw.accountName && errorsWithDraw.accountName && (
                        <FormHelperText error sx={{ px: 2 }}>
                          {touchedWithDraw.accountName && errorsWithDraw.accountName}
                        </FormHelperText>
                      )}
                      <Tooltip title="Giao dịch tối thiểu là 100,000đ" placement="bottom-end">
                        <TextField
                          required
                          fullWidth
                          type={'number'}
                          label="Số tiền VND"
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
                        <Typography>Sử dụng thông tin hiện có</Typography>
                      </Box>
                      <RadioGroup row sx={{ my: 2 }} {...getFieldPropsWithDraw('amount')}>
                        <FormControlLabel
                          value="300000"
                          control={<Radio />}
                          label="300,000đ"
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
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Icon color="green" width={30} height={30} icon={shieldCheck} />
                        <Typography sx={{ mt: 3, textAlign: 'left', ml: 1 }}>
                          Mọi thông tin khách hàng đều được mã hóa để bảo mật thông tin khách hàng.
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
                          Rút tiền
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
                          Rút tiền
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
                  Thanh toán tiện dụng với Momo
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
                      Số dư ví: {listOfProjectWallet && fCurrency(listOfProjectWallet.p2.balance)}
                    </Typography>
                  </Box>
                </Box>
                <FormikProvider value={formik}>
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Tooltip title="Hạn mức tối đa: 50,000,000đ" placement="bottom-end">
                      <TextField
                        fullWidth
                        label="Số tiền VND"
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
                        label="300,000đ"
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <Icon color="green" width={30} height={30} icon={shieldCheck} />
                      <Typography sx={{ mt: 3, textAlign: 'left', ml: 1 }}>
                        Mọi thông tin khách hàng đều được mã hóa để bảo mật thông tin khách hàng.
                      </Typography>
                    </Box>
                    <LoadingButton
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                    >
                      Nạp tiền
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
