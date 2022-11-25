import view from '@iconify/icons-eva/eye-fill';
// material
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  TableContainer,
  Box,
  Typography,
  Button,
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  TextField,
  FormHelperText,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { Form, FormikProvider, useFormik } from 'formik';

//
import dolarMoney from '@iconify/icons-ant-design/dollar-circle-outlined';
import InfoRecieve from '@iconify/icons-ant-design/solution-outline';
import secureInfo from '@iconify/icons-ant-design/security-scan-outlined';
import question from '@iconify/icons-bi/question-circle';
import Scrollbar from '../../Scrollbar';
import { MIconButton } from '../../@material-extend';
import { dispatch, RootState, useSelector } from 'redux/store';
import { PATH_DASHBOARD } from 'routes/paths';
import { Icon } from '@iconify/react';
import moneyBillTransfer from '@iconify/icons-fa6-solid/money-bill-transfer';
import { useState } from 'react';
import { getWalletByID, getWalletList } from 'redux/slices/krowd_slices/wallet';
import { LoadingButton } from '@mui/lab';
import { REACT_APP_API_URL } from 'config';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { getWalletTransactionList } from 'redux/slices/krowd_slices/transaction';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
type Transfer = {
  id: string;
};
export default function WalletI3Table() {
  const theme = useTheme();
  const { isLoading, walletList, walletDetail } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;
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

  const handleClickTranferMoney = (v: Transfer) => {
    setWalletIDTranferFrom(v.id);
    dispatch(getWalletByID(v.id));
    setOpenModalTransfer(true);
  };
  const ToWalletId = (listOfProjectWallet && listOfProjectWallet.p5.id) ?? '';
  // CHuyển tiền

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
  return (
    <Card>
      <CardHeader title="VÍ ĐẦU TƯ DỰ ÁN" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên dự án </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>Số dư</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>Chuyển tiền</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {listOfProjectWallet &&
                listOfProjectWallet.p3List.length > 0 &&
                listOfProjectWallet.p3List.map((row) => (
                  <TableRow key={row.id} sx={{ justifyContent: 'center' }}>
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{fCurrency(row.balance)}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button onClick={() => handleClickTranferMoney(row)}>
                        <Icon height={20} width={20} icon={moneyBillTransfer} />
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
                            Số dư ví của {walletDetail.ProjectWallet?.projectName}:{' '}
                            <strong>{fCurrency(walletDetail.ProjectWallet?.balance ?? '')}</strong>
                          </Typography>
                          <FormikProvider value={formikTranfer}>
                            <Form noValidate autoComplete="off" onSubmit={handleSubmitTranfer}>
                              <Tooltip
                                title="Giao dịch tối thiểu là 100,000đ"
                                placement="bottom-end"
                              >
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
                                    <Icon
                                      color="#d58311"
                                      width={20}
                                      height={20}
                                      icon={InfoRecieve}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                      Số tiền trong VÍ ĐẦU TƯ DỰ ÁN{' '}
                                      {walletDetail.ProjectWallet?.projectName} của bạn sẽ được
                                      chuyển vào VÍ THU TIỀN.
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Box>
                                    <Icon
                                      color="#d58311"
                                      width={20}
                                      height={20}
                                      icon={dolarMoney}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                      Số tiền bạn chuyển không vượt quá số dư trong ví hiện tại.
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Box>
                                    <Icon
                                      color="#d58311"
                                      width={20}
                                      height={20}
                                      icon={secureInfo}
                                    />
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
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />
    </Card>
  );
}
