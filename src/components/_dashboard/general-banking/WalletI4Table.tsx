import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';

// material
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
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
  DialogActions
} from '@mui/material';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import dolarMoney from '@iconify/icons-ant-design/dollar-circle-outlined';
import InfoRecieve from '@iconify/icons-ant-design/solution-outline';
import secureInfo from '@iconify/icons-ant-design/security-scan-outlined';
import question from '@iconify/icons-bi/question-circle';
import moneyCheckDollar from '@iconify/icons-fa6-solid/money-check-dollar';

//
import Scrollbar from '../../Scrollbar';
import { dispatch, RootState, useSelector } from 'redux/store';
import { useState } from 'react';
import { getWalletByID, getWalletList } from 'redux/slices/krowd_slices/wallet';
import { LoadingButton } from '@mui/lab';
import { REACT_APP_API_URL } from 'config';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { getWalletTransactionList } from 'redux/slices/krowd_slices/transaction';
import { Form, FormikProvider, useFormik } from 'formik';
import { SeverErrorIllustration } from 'assets';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
type Transfer = {
  id: string;
  projectId: string | null;
};
export default function WalletI4Table() {
  const { walletList, walletDetail } = useSelector((state: RootState) => state.wallet);
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
  const FromWalletId = (listOfProjectWallet && listOfProjectWallet.p2.id) ?? '';
  // N???p ti???n

  const TransferSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Vui l??ng nh???p s??? ti???n b???n c???n chuy???n')
      .min(100000, 'Y??u c???u t???i thi???u m???i l???n chuy???n l?? 100,000??')
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
            enqueueSnackbar('N???p ti???n v??o v?? th??nh c??ng', {
              variant: 'success'
            });
            resetForm();
            setOpenModalTransfer(false);
            dispatch(getWalletList());
            dispatch(getWalletTransactionList('', 1, 5));
          })
          .catch(() => {
            enqueueSnackbar('N???p ti???n th???t b???i vui l??ng ki???m tra l???i s??? d?? c???a b???n', {
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
      <CardHeader title="V?? THANH TO??N D??? ??N" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>T??n d??? ??n </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>S??? d??</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>N???p ti???n</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {listOfProjectWallet &&
                listOfProjectWallet.p4List.length > 0 &&
                listOfProjectWallet.p4List.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.projectName}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{fCurrency(row.balance)}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button onClick={() => handleClickTranferMoney(row)}>
                        <Icon height={20} width={20} icon={moneyCheckDollar} />
                      </Button>

                      <Dialog fullWidth maxWidth="sm" open={openModalTransfer}>
                        {walletDetail.ProjectWallet?.projectStatus !== 'ACTIVE' ? (
                          <DialogContent>
                            <Box mt={1}>
                              <DialogContentText
                                sx={{
                                  textAlign: 'center',
                                  fontWeight: 900,
                                  fontSize: 20,
                                  mb: 5,
                                  color: 'red'
                                }}
                              >
                                B???N KH??NG TH??? N???P TI???N V??O D??? ??N CH??A K??U G???I TH??NH C??NG
                              </DialogContentText>
                            </Box>
                            <Box>
                              <Box>
                                <SeverErrorIllustration
                                  sx={{ height: 260, my: { xs: 5, sm: 10 } }}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ color: 'red' }}>
                              <Typography sx={{ my: 1, fontWeight: 500 }}>L??u ??:</Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box>
                                  <Icon color="red" width={20} height={20} icon={InfoRecieve} />
                                </Box>
                                <Box>
                                  <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                    D??? ??n c???a b???n ph???i k??u g???i th??nh c??ng m???i c?? th??? n???p ti???n
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box>
                                  <Icon color="red" width={20} height={20} icon={dolarMoney} />
                                </Box>
                                <Box>
                                  <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                    S??? ti???n b???n chuy???n kh??ng v?????t qu?? s??? d?? trong v?? hi???n t???i.
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box>
                                  <Icon color="red" width={20} height={20} icon={secureInfo} />
                                </Box>
                                <Box>
                                  <Typography sx={{ textAlign: 'left', ml: 1 }}>
                                    B???n c???n giao d???ch n???p ti???n t???i thi???u l?? 100,000??
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <DialogActions>
                              <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                onClick={() => setOpenModalTransfer(false)}
                              >
                                ????ng
                              </Button>
                            </DialogActions>
                          </DialogContent>
                        ) : (
                          <>
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
                              <Icon
                                color="#14b7cc"
                                height={60}
                                width={60}
                                icon={moneyCheckDollar}
                              />
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
                                  T???o l???nh n???p ti???n
                                </DialogContentText>
                              </Box>
                            </DialogTitle>
                            <DialogContent>
                              <Typography>
                                S??? d?? v?? c???a {listOfProjectWallet.p2.projectName}:{' '}
                                <strong>{fCurrency(listOfProjectWallet.p2.balance ?? '')}</strong>
                              </Typography>
                              <FormikProvider value={formikTranfer}>
                                <Form noValidate autoComplete="off" onSubmit={handleSubmitTranfer}>
                                  <Tooltip
                                    title="Giao d???ch t???i thi???u l?? 100,000??"
                                    placement="bottom-end"
                                  >
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
                                  <RadioGroup
                                    row
                                    sx={{ my: 2 }}
                                    {...getFieldPropsTranfer('amount')}
                                  >
                                    <FormControlLabel
                                      value="100000"
                                      control={<Radio />}
                                      label="100,000??"
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
                                  <Box sx={{ color: '#d58311' }}>
                                    <Typography sx={{ my: 1, fontWeight: 500 }}>L??u ??:</Typography>

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
                                          S??? ti???n s??? ???????c n???p t??? V?? THANH TO??N CHUNG
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
                                          S??? ti???n b???n chuy???n kh??ng v?????t qu?? s??? d?? trong v?? hi???n t???i.
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
                                          B???n c???n giao d???ch n???p ti???n t???i thi???u l?? 100,000??
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
                                    N???p ti???n
                                  </LoadingButton>
                                </Form>
                              </FormikProvider>
                            </DialogContent>
                          </>
                        )}
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
