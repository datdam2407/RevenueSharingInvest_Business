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
  backgroundColor: '#ff9b26e0',
  display: 'flex',
  color: 'white',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

// ----------------------------------------------------------------------

export default function WalletI5() {
  const { isLoading, walletList } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;
  const [openWithDraw, setOpenWithDraw] = useState(false);

  const [walletIDTranferFrom, setWalletIDTranferFrom] = useState('');
  const [openModalTransfer, setOpenModalTransfer] = useState(false);
  const [check, setCheck] = useState(false);

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
  const ToWalletId = (listOfProjectWallet && listOfProjectWallet.p2.id) ?? '';
  // CHuyển tiền
  const { mainUserState } = useSelector((state: RootState) => state.userKrowd);
  const { user: mainUser } = mainUserState;
  const TransferSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Vui lòng nhập số tiền bạn cần chuyển')
      .min(100000, 'Yêu cầu tối thiểu mỗi lần chuyển là 100,000đ')
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
            enqueueSnackbar('Chuyển tiền thành công', {
              variant: 'success'
            });
            resetForm();
            setOpenModalTransfer(false);
            dispatch(getWalletList());
            dispatch(getWalletTransactionList('', 1, 5));
          })
          .catch(() => {
            enqueueSnackbar('Chuyển tiền thất bại vui lòng kiểm tra lại số dư của bạn', {
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

  //RÚT TIỀN

  const handleOpenWithDraw = () => {
    setOpenWithDraw(true);
  };
  const handleCloseWithDraw = () => {
    setOpenWithDraw(false);
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
  const WithDrawSchema = Yup.object().shape({
    bankName: Yup.string().required('Yêu cầu nhập tên ngân hàng'),
    bankAccount: Yup.string().required('Yêu cầu nhập tài khoản ngân hàng'),
    accountName: Yup.string().required('Yêu cầu nhập tên chủ khoản'),
    amount: Yup.number()
      .required('Vui lòng nhập số tiền bạn cần rút')
      .min(100000, 'Yêu cầu tối thiểu mỗi lần rút là 100,000đ')
  });

  const formikWithdraw = useFormik({
    initialValues: {
      fromWalletId: listOfProjectWallet?.p2.id,
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
            setOpenWithDraw(false);
            resetForm();
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

  return (
    <>
      {listOfProjectWallet && (
        <RootStyle>
          <Grid container sx={{ alignItems: 'center' }}>
            <Grid lg={6}>
              <Box display={'flex'}>
                <Icon icon={walletIcon} width={24} height={24} />
                <Typography sx={{ typography: 'subtitle2', mx: 1 }}>
                  {listOfProjectWallet.p5.walletType.name}
                </Typography>
              </Box>
            </Grid>

            <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                sx={{ mx: 2, borderColor: 'white' }}
                onClick={() => handleClickTranferMoney(listOfProjectWallet.p5.id ?? '')}
                color="inherit"
                variant="outlined"
              >
                Chuyển tiền
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
                      Tạo lệnh chuyển tiền
                    </DialogContentText>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Typography>
                    Số dư ví :<strong>{fCurrency(listOfProjectWallet.p5?.balance ?? '')}</strong>
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

                      <Box sx={{ color: '#d58311' }}>
                        <Typography sx={{ my: 1, fontWeight: 500 }}>Lưu ý:</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box>
                            <Icon color="#d58311" width={20} height={20} icon={InfoRecieve} />
                          </Box>
                          <Box>
                            <Typography sx={{ textAlign: 'left', ml: 1 }}>
                              Số tiền trong VÍ THU TIỀN của bạn sẽ được chuyển vào VÍ THANH TOÁN
                              CHUNG.
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
                              Bạn cần giao dịch chuyển tiền tối thiểu là 100,000đ
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
                        Chuyển tiền
                      </LoadingButton>
                    </Form>
                  </FormikProvider>
                </DialogContent>
              </Dialog>
              <Button
                sx={{ borderColor: 'white' }}
                onClick={handleOpenWithDraw}
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
                    Số dư ví: <strong> {fCurrency(listOfProjectWallet.p5.balance)}</strong>
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
                      {listOfProjectWallet.p5.balance > 0 ? (
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
          </Grid>

          <Stack spacing={1} sx={{ p: 3 }}>
            <Typography sx={{ typography: 'h3' }}>
              {fCurrency(listOfProjectWallet.p5.balance)}
            </Typography>
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
