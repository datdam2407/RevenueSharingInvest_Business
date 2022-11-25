import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  DialogActions,
  Stack,
  Button,
  Box,
  Tooltip,
  Card,
  Divider
} from '@mui/material';
import total from '@iconify/icons-eva/text-outline';
import time from '@iconify/icons-eva/clock-outline';
import done from '@iconify/icons-eva/checkmark-circle-2-outline';
import paytime from '@iconify/icons-eva/bell-outline';
import warning from '@iconify/icons-eva/bell-fill';

import { dispatch, RootState, useSelector } from 'redux/store';
import { DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';

import { useSnackbar } from 'notistack';
import { fCurrency } from 'utils/formatNumber';
import { REACT_APP_API_URL } from 'config';
import { getAllProjectStage } from 'redux/slices/krowd_slices/stage';
import { getWalletList } from 'redux/slices/krowd_slices/wallet';
import { SeverErrorIllustration } from 'assets';
import { Icon } from '@iconify/react';

import Scrollbar from 'components/Scrollbar';
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'center' },
  { id: 'name', label: 'GIAI ĐOẠN', align: 'left' },
  { id: 'actualAmount', label: 'DOANH THU THỰC TẾ', align: 'right' },
  { id: 'paidAmount', label: 'SỐ TIỀN ĐÃ TRẢ', align: 'right' },
  { id: 'sharedAmount', label: 'DOANH THU CHIA SẺ', align: 'right' },
  { id: 'isOverDue', label: 'TÌNH TRẠNG THANH TOÁN', align: 'left' },
  { id: 'endDate', label: 'THỜI GIAN THANH TOÁN', align: 'left' },
  { id: 'endDate', label: 'TRẠNG THÁI', align: 'left' },
  { id: '', label: 'THAO TÁC', align: 'center' }
];
const note = [
  {
    name: 'Lưu ý:'
  },
  {
    name: 'Khi kỳ hạn tới thời hạn thanh toán bạn mới có thể thanh toán tiền cho các nhà đầu tư'
  },
  {
    name: 'Bạn không cần thiết phải thanh toán một lần mà có thể thanh toán nhiều lần (Bạn chỉ có thể thanh toán trong vòng 3 ngày)'
  },
  {
    name: 'Số tiền bạn thanh toán phải bằng với doanh thu chia sẻ'
  },
  {
    name: 'Mọi thông tin bạn chưa nắm rõ có thể liên hệ với admin'
  }
];
const STATUS_ENUM = {
  ALL: '',
  UNDUE: 'UNDUE',
  DUE: 'DUE',
  INACTIVE: 'INACTIVE',
  DONE: 'DONE'
};
const actionFilter = [
  {
    nameAction: 'Tất cả',
    icon: total,
    color: '#14b7cc',
    action: () => {
      dispatch(getAllProjectStage(localStorage?.getItem('projectId') ?? '', 1, STATUS_ENUM.ALL));
      localStorage.setItem('statusReport', '');
    }
  },
  {
    nameAction: 'Chưa kích hoạt',
    icon: warning,
    color: 'red',
    action: () => {
      dispatch(
        getAllProjectStage(localStorage?.getItem('projectId') ?? '', 1, STATUS_ENUM.INACTIVE)
      );
      localStorage.setItem('statusReport', STATUS_ENUM.INACTIVE);
    }
  },
  {
    nameAction: 'Chưa tới hạn',
    icon: time,
    action: () => {
      dispatch(getAllProjectStage(localStorage?.getItem('projectId') ?? '', 1, STATUS_ENUM.UNDUE));
      localStorage.setItem('statusReport', STATUS_ENUM.UNDUE);
    },
    color: '#fc980b'
  },
  {
    nameAction: 'Tới thời hạn thanh toán',
    icon: paytime,
    action: () => {
      dispatch(getAllProjectStage(localStorage?.getItem('projectId') ?? '', 1, STATUS_ENUM.DUE));
      localStorage.setItem('statusReport', STATUS_ENUM.DUE);
    },
    color: '#14b7cc'
  },

  {
    nameAction: 'Đã xong',
    icon: done,
    color: 'green',
    action: () => {
      dispatch(getAllProjectStage(localStorage?.getItem('projectId') ?? '', 1, STATUS_ENUM.DONE));
      localStorage.setItem('statusReport', STATUS_ENUM.DONE);
    }
  }
];
export default function StageReportPeriodRevenue() {
  const { isLoading, projectStageList } = useSelector((state: RootState) => state.stage);
  const { listOfStage: list, numOfStage, filterCount } = projectStageList;

  const { walletList } = useSelector((state: RootState) => state.wallet);
  const { listOfProjectWallet } = walletList;
  const walletId = listOfProjectWallet?.p4List.find(
    (e: any) => e.projectId === localStorage.getItem('projectId')
  );
  const { projectDetailBYID } = useSelector((state: RootState) => state.project);
  const { stageDetail } = useSelector((state: RootState) => state.stage);
  const { StageId } = stageDetail;

  const { enqueueSnackbar } = useSnackbar();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  // const status = actionFilter.find((e) => e.nameAction === 'Chưa tới hạn');

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  useEffect(() => {
    dispatch(getWalletList());
    dispatch(
      getAllProjectStage(
        localStorage?.getItem('projectId') ?? '',
        pageIndex ?? 1,
        localStorage.getItem('statusReport') ?? 'DUE'
      )
    );
    // dispatch(getProjectId(`${localStorage.getItem('projectId')}`));
  }, [dispatch, pageIndex, localStorage.getItem('statusReport')]);
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }
  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }

  const formik = useFormik({
    initialValues: {
      stageId: StageId?.id ?? '',
      amount: ''
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        const headers = getHeaderFormData();
        await axios
          .post(REACT_APP_API_URL + `/period_revenue_histories`, values, {
            headers: headers
          })
          .then(() => {
            enqueueSnackbar('Thanh toán cho kỳ thành công', {
              variant: 'success'
            });
            resetForm();
            handleClose();
            dispatch(
              getAllProjectStage(localStorage?.getItem('projectId') ?? '', pageIndex ?? 1, '')
            );
            dispatch(getWalletList());
          })
          .catch(() => {
            enqueueSnackbar('Thanh toán cho kỳ thất bại vui lòng kiểm tra số tiền bạn nhập', {
              variant: 'error'
            });
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const { errors, touched, handleSubmit, isSubmitting, resetForm, getFieldProps } = formik;
  const getData = (): RowData[] => {
    if (!list) return [];
    return list.map<RowData>((_item, _idx) => {
      return {
        id: _item.id,
        items: [
          {
            name: 'idx',
            value: _idx + 1,
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'name',
            value: `${_item.name}`,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'actualAmount',
            value: fCurrency(_item.actualAmount),
            type: DATA_TYPE.NUMBER_FORMAT
          },
          {
            name: 'paidAmount',
            value: fCurrency(_item.paidAmount),
            type: DATA_TYPE.NUMBER_FORMAT
          },

          {
            name: 'sharedAmount',
            value: fCurrency(_item.sharedAmount),
            type: DATA_TYPE.NUMBER_FORMAT
          },

          {
            name: 'isOverDue',
            value:
              (_item.isOverDue === 'TRUE' && 'Đã quá hạn') ||
              (_item.isOverDue === 'FALSE' && 'Tới thời hạn thanh toán') ||
              (_item.isOverDue === null && _item.status === 'DONE' && 'Đã xong') ||
              (_item.isOverDue === null && _item.status === 'DUE' && 'Đang cập nhật') ||
              (_item.isOverDue === null && 'Chưa tới hạn'),
            type: DATA_TYPE.TEXT,
            textColor:
              (_item.isOverDue === null && _item.status === 'DONE' && 'green') ||
              (_item.isOverDue === 'FALSE' && '#14b7cc') ||
              (_item.isOverDue === null && _item.status === 'DUE' && '#14b7cc') ||
              (_item.isOverDue === null && '#fc980b') ||
              (_item.isOverDue === 'TRUE' ? 'red' : 'black')
          },
          {
            name: 'endDate',
            value: `${
              _item.name === 'Giai đoạn thanh toán nợ'
                ? '**/**/****'
                : _item.endDate.toString().substring(0, 10)
            }`,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'status',
            value:
              (_item.status === 'DONE' && 'Đã xong') ||
              (_item.status === 'DUE' && 'Tới thời gian thanh toán') ||
              (_item.status === 'UNDUE' && 'Chưa tới thời gian thanh toán') ||
              (_item.status === 'INACTIVE' && 'Chưa hoạt động'),
            type: DATA_TYPE.TEXT,
            textColor:
              (_item.status === 'DONE' && 'green') ||
              (_item.status === 'DUE' && '#14b7cc') ||
              (_item.status === 'UNDUE' && '#fc980b') ||
              (_item.status === 'INACTIVE' ? 'red' : 'black')
          }
        ]
      };
    });
  };
  return (
    <>
      {' '}
      <Scrollbar sx={{ mb: 4 }}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 5,
            width: '1500px',
            minWidth: 1000
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '300px'
            }}
            gap={2}
          >
            <Box>
              <Icon icon={total} height={40} width={40} color={'#14b7cc'} />
            </Box>
            <Box>
              <Typography sx={{ py: 0.5, fontSize: '700', color: '#14b7cc' }}>TẤT CẢ</Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
                Tổng {numOfStage} kỳ
              </Typography>
            </Box>
          </Box>
          <Divider
            variant="fullWidth"
            sx={{
              borderWidth: '120px medium 1px 0px',
              borderColor: '#14b7cc',
              height: 'auto',
              alignSelf: 'stretch',
              borderStyle: 'dashed'
            }}
          />{' '}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '300px'
            }}
            gap={2}
          >
            <Box>
              <Icon icon={warning} height={40} width={40} color={'red'} />
            </Box>
            <Box>
              <Typography sx={{ py: 0.5, fontSize: '700', color: 'red' }}>
                CHƯA KÍCH HOẠT
              </Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
                {filterCount?.inactive} kỳ chưa kích hoạt{' '}
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              borderWidth: '120px medium 1px 0px',
              borderColor: '#14b7cc',
              height: 'auto',
              alignSelf: 'stretch',
              borderStyle: 'dashed'
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '300px'
            }}
            gap={2}
          >
            <Box>
              <Icon icon={time} height={40} width={40} color={'#fc980b'} />
            </Box>
            <Box>
              <Typography sx={{ py: 0.5, fontSize: '700', color: '#fc980b' }}>
                CHƯA TỚI HẠN
              </Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
                {filterCount?.undue} kỳ chưa tới hạn
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              borderWidth: '120px medium 1px 0px',
              borderColor: '#14b7cc',
              height: 'auto',
              alignSelf: 'stretch',
              borderStyle: 'dashed'
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '300px'
            }}
            gap={2}
          >
            <Box>
              <Icon icon={paytime} height={40} width={40} color={'#14b7cc'} />
            </Box>
            <Box>
              <Typography sx={{ py: 0.5, fontSize: '700', color: '#14b7cc' }}>
                TỚI THỜI HẠN THANH TOÁN
              </Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
                {filterCount?.due} kỳ tới thời hạn
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              borderWidth: '120px medium 1px 0px',
              borderColor: '#14b7cc',
              height: 'auto',
              alignSelf: 'stretch',
              borderStyle: 'dashed'
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '300px'
            }}
            gap={2}
          >
            <Box>
              <Icon icon={done} height={40} width={40} color={'green'} />
            </Box>
            <Box>
              <Typography sx={{ py: 0.5, fontSize: '700', color: 'green' }}>ĐÃ XONG</Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
                {filterCount?.done} kỳ
              </Typography>
              <Typography sx={{ py: 0.5 }}>
                <span style={{ fontWeight: 700 }}> Đã thanh toán:</span>{' '}
                {fCurrency(projectDetailBYID.projectDetail?.paidAmount ?? '')}
              </Typography>
              <Typography sx={{ py: 0.5, fontWeight: 500 }}>
                <span style={{ fontWeight: 700 }}> Còn lại: </span>{' '}
                {fCurrency(
                  (projectDetailBYID.projectDetail &&
                    projectDetailBYID.projectDetail?.investmentTargetCapital *
                      projectDetailBYID.projectDetail?.multiplier -
                      projectDetailBYID.projectDetail?.paidAmount) ??
                    ''
                )}{' '}
              </Typography>{' '}
            </Box>
          </Box>
        </Card>
      </Scrollbar>
      <KrowdTable
        headingTitle={`thống kê giai đoạn các kỳ`}
        filterStatus={actionFilter}
        action={
          <Box>
            <Dialog
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              {StageId?.name === 'Giai đoạn thanh toán nợ' && StageId.status !== 'DUE' ? (
                <Box p={3}>
                  <Typography variant="h6">
                    Bạn không thể thực hiện thao tác này ngay bây giờ
                  </Typography>
                  <Box>
                    <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                  </Box>
                  <DialogActions>
                    <Button fullWidth variant="contained" color="error" onClick={handleClose}>
                      Đóng
                    </Button>
                  </DialogActions>
                </Box>
              ) : (
                <FormikProvider value={formik}>
                  <Form
                    style={{ width: 600 }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}
                  >
                    <DialogTitle>Ví thanh toán dự án của bạn</DialogTitle>
                    <Box p={3}>
                      <Typography variant="h6">
                        Số dư ví : {fCurrency(walletId?.balance ?? '')}
                      </Typography>
                      <Typography variant="h6">
                        Doanh thu chia sẻ: {fCurrency(StageId?.sharedAmount ?? '')}
                      </Typography>
                    </Box>
                    <DialogContent>
                      <Stack spacing={{ xs: 2, md: 3 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <Tooltip title="Số tiền bạn muốn trả lãi" placement="right">
                            <TextField
                              fullWidth
                              type={'number'}
                              label="Số tiền thanh toán"
                              {...getFieldProps('amount')}
                              error={Boolean(touched.amount && errors.amount)}
                              helperText={touched.amount && errors.amount}
                              InputProps={{
                                inputProps: { step: 0.1, min: 0.1, max: 100 },
                                endAdornment: 'VND'
                              }}
                            />
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </DialogContent>
                    <DialogActions>
                      <Button variant="contained" color="error" onClick={handleClose}>
                        Đóng
                      </Button>
                      {walletId && walletId?.balance > 0 && (
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                          Thanh toán
                        </LoadingButton>
                      )}
                    </DialogActions>
                  </Form>
                </FormikProvider>
              )}
            </Dialog>
          </Box>
        }
        openPaymentPeriodRevenueHistory={() => handleClickOpen()}
        header={TABLE_HEAD}
        getData={getData}
        isLoading={isLoading}
        noteTable={note}
        paging={{
          pageIndex,
          pageSize: pageSize,
          numberSize: numOfStage,

          handleNext() {
            setPageIndex(pageIndex + 1);
          },
          handlePrevious() {
            setPageIndex(pageIndex - 1);
          }
        }}
      />
    </>
  );
}
