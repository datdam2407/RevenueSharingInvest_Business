import { useEffect, useState } from 'react';
import { dispatch, RootState, useSelector } from 'redux/store';
import { DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import { getAllProjectStage, getProjectStageList } from 'redux/slices/krowd_slices/stage';
import { Project } from '../../../@types/krowd/project';

import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
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
  Tooltip
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
import { fCurrency } from 'utils/formatNumber';
const TABLE_HEAD = [
  { id: 'name', label: 'GIAI ĐOẠN', align: 'left' },
  { id: 'Optimistic_Expected_Amount', label: 'LẠC QUAN', align: 'right' },
  { id: 'Normal_Expected_Amount', label: 'BÌNH THƯỜNG', align: 'right' },
  { id: 'Pessimistic_Expected_Amount', label: 'BI QUAN', align: 'right' },
  { id: 'Optimistic_Expected_Ratio', label: 'LẠC QUAN(%)', align: 'right' },
  { id: 'Normal_Expected_Ratio', label: 'BÌNH THƯỜNG(%)', align: 'right' },
  { id: 'Pessimistic_Expected_Ratio', label: 'BI QUAN(%)', align: 'right' },
  { id: 'startDate', label: 'NGÀY BẮT ĐẦU', align: 'left' },
  { id: 'endDate', label: 'NGÀY KÊT THÚC', align: 'left' },
  { id: '', label: 'THAO TÁC', align: 'center' }
];

export default function StageListKrowdTable({ project }: { project: Project }) {
  const { isLoading, projectStageList } = useSelector((state: RootState) => state.stage);
  const { listOfStage: list, numOfStage } = projectStageList;

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(getAllProjectStage(localStorage.getItem('projectId') ?? '', pageIndex ?? 1, ''));
  }, [dispatch, pageIndex]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  function getToken() {
    return window.localStorage.getItem('accessToken');
  }
  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const { stageDetail } = useSelector((state: RootState) => state.stage);
  const { StageId } = stageDetail;
  const formik = useFormik({
    initialValues: {
      name: StageId?.name ?? '',
      description: StageId?.description ?? '',
      pessimisticExpectedAmount: StageId?.pessimisticExpectedAmount ?? '',
      normalExpectedAmount: StageId?.normalExpectedAmount ?? '',
      optimisticExpectedAmount: StageId?.optimisticExpectedAmount ?? '',
      pessimisticExpectedRatio: StageId?.pessimisticExpectedRatio ?? '',
      normalExpectedRatio: StageId?.normalExpectedRatio ?? '',
      optimisticExpectedRatio: StageId?.optimisticExpectedRatio ?? ''
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        const headers = getHeaderFormData();
        await axios
          .put(REACT_APP_API_URL + `/stages/${StageId?.id}`, values, {
            headers: headers
          })
          .then(() => {
            enqueueSnackbar('Cập nhật thành công', {
              variant: 'success'
            });
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật thất bại', {
              variant: 'error'
            });
          })
          .finally(() => {
            resetForm();
            handleClose();
            dispatch(getAllProjectStage(project?.id ?? '', pageIndex ?? 1, ''));
            dispatch(getProjectStageList(project?.id));
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
            name: 'name',
            value: `${_item.name} `,
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'Optimistic_Expected_Amount',
            value: fCurrency(_item.optimisticExpectedAmount)
              ? fCurrency(_item.optimisticExpectedAmount)
              : 'Chưa cập nhật',
            type: DATA_TYPE.NUMBER_FORMAT
          },
          {
            name: 'Normal_Expected_Amount',
            value: fCurrency(_item.normalExpectedAmount)
              ? fCurrency(_item.normalExpectedAmount)
              : 'Chưa cập nhật',
            type: DATA_TYPE.NUMBER_FORMAT
          },
          {
            name: 'Pessimistic_Expected_Amount',
            value: fCurrency(_item.pessimisticExpectedAmount)
              ? fCurrency(_item.pessimisticExpectedAmount)
              : 'Chưa cập nhật',
            type: DATA_TYPE.NUMBER_FORMAT
          },
          {
            name: 'Optimistic_Expected_Ratio',
            value: _item.optimisticExpectedRatio ? _item.optimisticExpectedRatio : 'Chưa cập nhật',
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'Normal_Expected_Ratio',
            value: _item.normalExpectedRatio ? _item.normalExpectedRatio : 'Chưa cập nhật',
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'Pessimistic_Expected_Ratio',
            value: _item.pessimisticExpectedRatio
              ? _item.pessimisticExpectedRatio
              : 'Chưa cập nhật',
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'stateDate',
            value: _item.startDate.toString().substring(0, 10),
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'endDate',
            value: _item.endDate.toString().substring(0, 10),
            type: DATA_TYPE.NUMBER
          }
        ]
      };
    });
  };

  return (
    <>
      <KrowdTable
        headingTitle="thống kê các kỳ"
        action={
          <Box>
            <Dialog
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <FormikProvider value={formik}>
                <Form style={{ width: 600 }} noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <DialogTitle>Cập nhật thông tin giai đoạn của bạn</DialogTitle>
                  <DialogContent>
                    <Box my={3}></Box>
                    <Stack spacing={{ xs: 2, md: 3 }}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField disabled fullWidth label="Tên" {...getFieldProps('name')} />
                      </Stack>
                      <Typography variant="subtitle1">Số tiền dự kiến</Typography>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Tooltip
                          title="Số tiền dự kiến lạc quan: Là doanh thu bạn thu được cao nhất ở kỳ hiện tại."
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type={'number'}
                            label="Lạc quan"
                            {...getFieldProps('optimisticExpectedAmount')}
                            error={Boolean(
                              touched.optimisticExpectedAmount && errors.optimisticExpectedAmount
                            )}
                            helperText={
                              touched.optimisticExpectedAmount && errors.optimisticExpectedAmount
                            }
                            InputProps={{
                              inputProps: { step: 0.1, min: 0.1, max: 100 },
                              endAdornment: 'VND'
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title="Số tiền dự kiến bình thường: Là doanh thu bạn thu được ở mức tầm trung ở kỳ hiện tại."
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type={'number'}
                            label="Bình thường"
                            // value={stageDetail?.normalExpectedAmount}
                            // onChange={() => getFieldProps('normalExpectedAmount')}
                            // onChange={(val) => setFieldValue('normalExpectedAmount', val)}
                            {...getFieldProps('normalExpectedAmount')}
                            error={Boolean(
                              touched.normalExpectedAmount && errors.normalExpectedAmount
                            )}
                            helperText={touched.normalExpectedAmount && errors.normalExpectedAmount}
                            InputProps={{
                              inputProps: { step: 0.1, min: 0.1, max: 100 },
                              endAdornment: 'VND'
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title="Số tiền dự kiến bi quan: Là doanh thu của bạn gặp phải rủi ro thu được ở mức thấp nhất ở kỳ hiện tại."
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type={'number'}
                            label="Bi quan"
                            {...getFieldProps('pessimisticExpectedAmount')}
                            error={Boolean(
                              touched.pessimisticExpectedAmount && errors.pessimisticExpectedAmount
                            )}
                            helperText={
                              touched.pessimisticExpectedAmount && errors.pessimisticExpectedAmount
                            }
                            InputProps={{
                              inputProps: { step: 0.1, min: 0.1, max: 100 },
                              endAdornment: 'VND'
                            }}
                          />
                        </Tooltip>
                      </Stack>
                      <Typography variant="subtitle1">Tỷ lệ thành công</Typography>

                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Tooltip
                          title="Tỷ lệ thành công lạc quan: Là tỷ lệ phần trăm cao nhất bạn sẽ thu được mức lợi nhuận ở kỳ hiện tại."
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type={'number'}
                            label="Lạc quan"
                            {...getFieldProps('optimisticExpectedRatio')}
                            error={Boolean(
                              touched.optimisticExpectedRatio && errors.optimisticExpectedRatio
                            )}
                            helperText={
                              touched.optimisticExpectedRatio && errors.optimisticExpectedRatio
                            }
                            InputProps={{
                              inputProps: { step: 0.1, min: 0.1, max: 100 },
                              endAdornment: '%'
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title="Tỷ lệ thành công bình thường: Là tỷ lệ phần trăm trung bình bạn sẽ thu được mức lợi nhuận ở kỳ hiện tại."
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type={'number'}
                            label="Bình thường"
                            {...getFieldProps('normalExpectedRatio')}
                            error={Boolean(
                              touched.normalExpectedRatio && errors.normalExpectedRatio
                            )}
                            helperText={touched.normalExpectedRatio && errors.normalExpectedRatio}
                            InputProps={{
                              inputProps: { step: 0.1, min: 0.1, max: 100 },
                              endAdornment: '%'
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title="Tỷ lệ thành công bi quan: Là tỷ lệ phần trăm rủi ro ở kỳ hiện tại."
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type={'number'}
                            label="Bi quan"
                            {...getFieldProps('pessimisticExpectedRatio')}
                            error={Boolean(
                              touched.pessimisticExpectedRatio && errors.pessimisticExpectedRatio
                            )}
                            helperText={
                              touched.pessimisticExpectedRatio && errors.pessimisticExpectedRatio
                            }
                            InputProps={{
                              inputProps: { step: 0.1, min: 0.1, max: 100 },
                              endAdornment: '%'
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
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Cập nhật
                    </LoadingButton>
                  </DialogActions>
                </Form>
              </FormikProvider>
            </Dialog>
          </Box>
        }
        header={TABLE_HEAD}
        getData={getData}
        isLoading={isLoading}
        openUpdateDialog={() => handleClickOpen()}
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
