import * as Yup from 'yup';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { DatePicker, LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Button,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Tooltip
} from '@mui/material';
// @types

//
import { dispatch } from 'redux/store';

import axios from 'axios';
import { fDateTimeSuffix } from 'utils/formatTime';
import useAuth from 'hooks/useAuth';
import NumberFormat from 'react-number-format';
import { REACT_APP_API_URL } from 'config';
import { Project } from '../../../../@types/krowd/project';
import { getProjectId } from 'redux/slices/krowd_slices/project';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------
type BusinessProjectProps = {
  project: Project;
  //   album: string[];
  closeDialog: () => void;
};
export default function BusinessProjectFormUpdate({
  project: p,
  closeDialog
}: BusinessProjectProps) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const milliSecs = 86400000 * 3;
  const milliSecs2 = 86400000 * 10;
  const [valueMin, setValueMin] = useState<Date | null>(new Date(Date.now() + milliSecs));
  const [value, setValue] = useState<Date | null>(new Date(Date.now() + milliSecs));
  const [valueEnd, setvalueEnd] = useState<Date | null>(new Date(Date.now() + milliSecs2));

  const [valueEndDate, setValueEndDate] = useState<Date | null>(new Date(`${p.endDate}`));
  const [valueMaxDate, setMaxDate] = useState<Date | null>(new Date('2030-12-31 12:00:00'));
  const [open, setOpen] = useState(true);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
    setFieldValue('startDate', fDateTimeSuffix(newValue!));
  };
  const handleChangeEndDate = (newValue2: Date | null) => {
    setValueEndDate(newValue2);
    setFieldValue('endDate', fDateTimeSuffix(newValue2!));
  };

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required('Yêu cầu nhập tên'),
    managerId: Yup.string().required('Yêu cầu nhập người quản lý'),
    address: Yup.string().required('Yêu cầu nhập địa chỉ'),
    investmentTargetCapital: Yup.number().required('Yêu cầu nhập vốn mục tiêu đầu tư'),
    sharedRevenue: Yup.number()
      .required('Yêu cầu nhập doanh thu chia sẻ')
      .min(0.1, 'Doanh thu chia sẻ tối thiểu là 0,1 %'),
    multiplier: Yup.number()
      .required('Yêu cầu nhập hệ số nhân')
      .min(1, 'Hệ số nhân tối thiểu là 1.0'),
    duration: Yup.number().required('Yêu cầu nhập kỳ hạn').min(1, 'Kỳ hạn tối thiểu là 1 tháng'),
    startDate: Yup.string().required('Yêu cầu nhập ngày tạo'),
    endDate: Yup.string().required('Yêu cầu nhập ngày kết thúc'),
    numOfStage: Yup.number()
      .required('Yêu cầu nhập số kì thanh toán')
      .min(1, 'Kỳ hạn tối thiểu là 1 kỳ')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }
  function getHeaderFormData() {
    const token = getToken();
    return { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` };
  }
  const formik = useFormik({
    initialValues: {
      name: p.name || '',
      managerId: user?.id,
      fieldId: p.field.id,
      // areaId: p.area,
      address: p.address || '',
      description: p.description || '',
      investmentTargetCapital: p?.investmentTargetCapital,
      sharedRevenue: p?.sharedRevenue,
      multiplier: p?.multiplier,
      duration: p?.duration,
      startDate: p?.startDate ?? '',
      endDate: p?.endDate ?? '',
      numOfStage: p.numOfStage
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (p === null) {
          throw new Error('Project null');
        }
        const headers = getHeaderFormData();
        const formData = new FormData();
        formData.append('managerId', values.managerId);
        formData.append('name', values.name);
        formData.append('fieldId', p.field.id);
        // formData.append('areaId', values.areaId);
        formData.append('address', values.address);
        formData.append('description', values.description);
        formData.append('investmentTargetCapital', `${values.investmentTargetCapital}`);
        formData.append('sharedRevenue', `${values.sharedRevenue}`);
        formData.append('multiplier', `${values.multiplier}`);
        formData.append('duration', `${values.duration}`);
        formData.append('numOfStage', `${values.numOfStage}`);
        formData.append('startDate', values.startDate);
        formData.append('endDate', `${values.endDate}`);
        await axios({
          method: 'PUT',
          url: REACT_APP_API_URL + `/projects/${p.id}`,
          data: formData,
          headers: headers
        });
        resetForm();
        setSubmitting(true);
        enqueueSnackbar('Cập nhật thành công', {
          variant: 'success'
        });
        closeDialog();
        dispatch(getProjectId(p?.id));
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
    resetForm
  } = formik;

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth={false}
      >
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <DialogTitle>Thông tin dự án của bạn</DialogTitle>
            <DialogContent>
              <Box my={2}>
                <DialogContentText>
                  Cập nhật thông tin cho dự án của bạn bên dưới.
                </DialogContentText>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>Tổng quan dự án</LabelStyle>
                      <TextField
                        label="Tên dự án"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                      />
                      <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label="Mô tả khái quát dự án"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    </Stack>
                  </Box>
                  <Box my={3}>
                    <LabelStyle>Thời gian bắt đầu: {p.startDate}</LabelStyle>
                    <LabelStyle>Thời gian kết thúc: {p.endDate}</LabelStyle>
                    <Grid container gap={3} display="flex" justifyContent={'space-around'} py={2}>
                      <Grid xs={12} md={5}>
                        <DatePicker
                          label="Ngày bắt đầu"
                          inputFormat="dd/MM/yyyy"
                          value={value}
                          minDate={valueMin!}
                          onChange={handleChange}
                          renderInput={(params) => (
                            <Tooltip
                              title="Thời gian để hệ thống duyệt dự án khoảng 2-3 ngày, bạn nên dành một khoảng thời gian ngắn để duyệt dự án."
                              placement="right"
                            >
                              <TextField
                                {...params}
                                error={Boolean(touched.startDate && errors.startDate)}
                              />
                            </Tooltip>
                          )}
                        />
                      </Grid>
                      <Grid xs={12} md={5}>
                        <DatePicker
                          label="Ngày kết thúc"
                          inputFormat="dd/MM/yyyy"
                          value={valueEndDate}
                          minDate={value!}
                          maxDate={valueMaxDate!}
                          onChange={handleChangeEndDate}
                          renderInput={(params) => (
                            <Tooltip
                              title="Thời gian để hệ thống duyệt dự án khoảng 2-3 ngày, bạn nên dành một khoảng thời gian ngắn để duyệt dự án."
                              placement="right"
                            >
                              <TextField
                                {...params}
                                error={Boolean(touched.endDate && errors.endDate)}
                              />
                            </Tooltip>
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Typography sx={{ my: 2, color: '#e96100', fontSize: '13px' }}>
                      Lưu ý: Thời gian kêu gọi dự án sẽ không thay đổi nếu như bạn không cập nhật
                      lại thời gian <br />
                      <br />
                      Thời gian kết thúc nhiều hơn so với thời gian kêu gọi từ 7-10 ngày bạn nên
                      dành một khoảng thời gian để kêu gọi dự án.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>Các thông số của dự án</LabelStyle>
                      <Stack spacing={3}>
                        <Tooltip
                          title="Doanh thu chia sẻ: Là % doanh thu bạn sẽ chia sẻ cho các nhà đầu tư mỗi kỳ. 
                    Ví dụ: Doanh thu kỳ của bạn là 1,000,000,000 (VNĐ), doanh thu chia sẻ 8%, vậy tiền phải thanh toán là 1,000,000,000 * 8% = 80,000,000 (VNĐ)"
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            label="Doanh thu chia sẻ"
                            type="number"
                            {...getFieldProps('sharedRevenue')}
                            error={Boolean(touched.sharedRevenue && errors.sharedRevenue)}
                            helperText={touched.sharedRevenue && errors.sharedRevenue}
                            InputProps={{
                              inputProps: { step: 0.1, min: 0.1, max: 100 },
                              endAdornment: '%'
                            }}
                          />
                        </Tooltip>

                        <Tooltip
                          title="Mục tiêu kêu gọi: Là số tiền bạn cần kêu gọi để xây dựng dự án. Ví dụ: 1,000,000,000 (VNĐ)"
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type="number"
                            label="Mục tiêu kêu gọi"
                            {...getFieldProps('investmentTargetCapital')}
                            error={Boolean(
                              touched.investmentTargetCapital && errors.investmentTargetCapital
                            )}
                            helperText={
                              touched.investmentTargetCapital && errors.investmentTargetCapital
                            }
                            InputProps={{
                              inputProps: { step: '1.000.000' }
                            }}
                          />
                        </Tooltip>
                        <NumberFormat
                          disabled
                          style={{
                            lineHeight: '52px',
                            fontSize: '16px',
                            fontWeight: 400,
                            boxSizing: 'border-box',
                            position: 'relative',
                            borderRadius: '8px',
                            paddingLeft: '14px',
                            width: '100%'
                          }}
                          {...getFieldProps('investmentTargetCapital')}
                          thousandSeparator={true}
                          suffix={'  (VNĐ)'}
                        />
                        <Tooltip
                          title="Hệ số nhân: Là chỉ số quyết định số tiền tối đa bạn phải chia sẻ cho các nhà đầu tư. 
                    Ví dụ: Mục tiêu kêu gọi là 1,000,000,000 (VNĐ), hệ số nhân là 1.6 thì số tiền bạn phải chia sẻ 
                    lại cho các nhà đầu tư là 1,000,000,000 x 1.6 = 1,600,000,000 (VNĐ)"
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type="number"
                            label="Hệ số nhân"
                            {...getFieldProps('multiplier')}
                            error={Boolean(touched.multiplier && errors.multiplier)}
                            helperText={touched.multiplier && errors.multiplier}
                            InputProps={{
                              inputProps: { step: 0.01, min: 1 },
                              endAdornment: 'x'
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title="Kỳ hạn: Là khoảng thời gian tối đa bạn phải thanh toán toàn bộ số tiền cho các nhà đầu tư"
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type="number"
                            label="Kỳ hạn"
                            {...getFieldProps('duration')}
                            error={Boolean(touched.duration && errors.duration)}
                            helperText={touched.duration && errors.duration}
                            InputProps={{
                              inputProps: { step: 1 },
                              endAdornment: 'tháng'
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title="Số kỳ thanh toán: Là số kỳ bạn dự kiến sẽ thanh toán tiền cho các nhà đầu tư"
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            type="number"
                            label="Số kỳ thanh toán"
                            {...getFieldProps('numOfStage')}
                            error={Boolean(touched.numOfStage && errors.numOfStage)}
                            helperText={touched.numOfStage && errors.numOfStage}
                            InputProps={{
                              inputProps: { step: 1, min: 1 },
                              endAdornment: 'kỳ'
                            }}
                          />
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={5.9}>
                    <Stack spacing={3}>
                      <Stack spacing={2}>
                        <Box>
                          <LabelStyle>Tổng thanh khoản</LabelStyle>
                          <NumberFormat
                            style={{
                              lineHeight: '52px',
                              fontSize: '16px',
                              fontWeight: 400,
                              boxSizing: 'border-box',
                              position: 'relative',
                              borderRadius: '8px',
                              paddingLeft: '14px',
                              width: '100%'
                            }}
                            thousandSeparator={true}
                            disabled
                            title="Tổng thanh khoản: Là tổng số tiền bạn phải thanh toán cho các nhà đầu tư"
                            placeholder="Tổng thanh khoản"
                            value={
                              Number(values.multiplier) * Number(values.investmentTargetCapital)
                            }
                            suffix={'   (VNĐ)'}
                          />
                        </Box>

                        <Box>
                          <LabelStyle>Thời gian mỗi kỳ</LabelStyle>
                          <NumberFormat
                            style={{
                              lineHeight: '52px',
                              fontSize: '16px',
                              fontWeight: 400,
                              boxSizing: 'border-box',
                              position: 'relative',
                              borderRadius: '8px',
                              paddingLeft: '14px',
                              width: '100%'
                            }}
                            thousandSeparator={true}
                            disabled
                            placeholder="Tổng thanh khoản"
                            value={Number(values.duration) / Number(values.numOfStage)}
                            suffix={'   (tháng/kỳ)'}
                          />
                        </Box>
                        <Box>
                          <LabelStyle>Số tiền thanh toán tối thiểu mỗi kỳ</LabelStyle>
                          <NumberFormat
                            style={{
                              lineHeight: '52px',
                              fontSize: '16px',
                              fontWeight: 400,
                              boxSizing: 'border-box',
                              position: 'relative',
                              borderRadius: '8px',
                              paddingLeft: '14px',
                              width: '100%'
                            }}
                            thousandSeparator={true}
                            disabled
                            placeholder="Tổng thanh khoản"
                            value={
                              (Number(values.multiplier) * Number(values.investmentTargetCapital)) /
                              Number(values.numOfStage)
                            }
                            suffix={'   (VNĐ/kỳ)'}
                          />
                        </Box>
                        <Box>
                          <LabelStyle>Doanh thu bạn cần đạt được mỗi kỳ</LabelStyle>
                          <NumberFormat
                            style={{
                              lineHeight: '52px',
                              fontSize: '16px',
                              fontWeight: 400,
                              boxSizing: 'border-box',
                              position: 'relative',
                              borderRadius: '8px',
                              paddingLeft: '14px',
                              width: '100%'
                            }}
                            thousandSeparator={true}
                            disabled
                            placeholder="Tổng thanh khoản"
                            value={
                              ((Number(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.numOfStage) /
                                Number(values.sharedRevenue)) *
                              100
                            }
                            suffix={'   (VNĐ/kỳ)'}
                          />
                        </Box>
                        <Box>
                          <LabelStyle>Số tiền dự án bạn cần kiếm được mỗi tháng</LabelStyle>
                          <NumberFormat
                            style={{
                              lineHeight: '52px',
                              fontSize: '16px',
                              fontWeight: 400,
                              boxSizing: 'border-box',
                              position: 'relative',
                              borderRadius: '8px',
                              paddingLeft: '14px',
                              width: '100%'
                            }}
                            thousandSeparator={true}
                            disabled
                            placeholder="Tổng thanh khoản"
                            value={
                              ((Number(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.duration) /
                                Number(values.sharedRevenue)) *
                              100
                            }
                            suffix={'   (VNĐ/tháng)'}
                          />
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="error" variant="contained" onClick={closeDialog}>
                Đóng
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Cập nhật
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </>
  );
}
