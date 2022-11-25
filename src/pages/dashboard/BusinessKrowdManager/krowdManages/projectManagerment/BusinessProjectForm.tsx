import * as Yup from 'yup';
import React, { useCallback, useEffect, useState } from 'react';
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
  Tooltip,
  Container,
  FormHelperText
} from '@mui/material';
// utils
import { useNavigate } from 'react-router-dom';
// @types

//
import { dispatch, RootState, useSelector } from 'redux/store';
import { getFieldListFollowbyBusinessID } from 'redux/slices/krowd_slices/field';
import { filterAreas, getAreasList } from 'redux/slices/krowd_slices/area';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { fDateTimeSuffix } from 'utils/formatTime';
import useAuth from 'hooks/useAuth';
import NumberFormat, { InputAttributes } from 'react-number-format';
import { REACT_APP_API_URL } from 'config';
import { getMyProject, getProjectByPoM } from 'redux/slices/krowd_slices/project';
// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

export default function BusinessProjectForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { fieldList } = useSelector((state: RootState) => state.fieldKrowd);
  const { areaList, areaListFilter } = useSelector((state: RootState) => state.areaKrowd);
  const { listOfField } = fieldList;
  const cityList = areaList
    .map((value) => value.city)
    .filter((value, index, self) => self.indexOf(value) === index);

  const milliSecs = 86400000 * 3;
  const milliSecs2 = 86400000 * 10;
  const [valueMin, setValueMin] = useState<Date | null>(new Date(Date.now() + milliSecs));
  const [value, setValue] = useState<Date | null>(new Date(Date.now() + milliSecs));
  const [valueEnd, setvalueEnd] = useState<Date | null>(new Date(Date.now() + milliSecs2));
  const [valueEndDate, setValueEndDate] = useState<Date | null>(new Date(''));
  const [valueMaxDate, setMaxDate] = useState<Date | null>(new Date('2030-12-31 12:00:00'));
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    dispatch(getFieldListFollowbyBusinessID());
    setOpen(true);
  };
  const [pageIndex, setPageIndex] = useState(1);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
    setFieldValue('startDate', fDateTimeSuffix(newValue!));
  };
  const handleChangeEndDate = (newValue2: Date | null) => {
    setvalueEnd(newValue2);
    setFieldValue('endDate', fDateTimeSuffix(newValue2!));
  };

  useEffect(() => {
    dispatch(getAreasList());
  }, [dispatch]);

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required('Yêu cầu nhập tên'),
    managerId: Yup.string().required('Yêu cầu nhập người quản lý'),
    fieldId: Yup.string().required('Yêu cầu nhập lĩnh vực'),
    areaId: Yup.string().required('Yêu cầu nhập thành phố và khu vực'),
    address: Yup.string().required('Yêu cầu nhập địa chỉ'),
    description: Yup.string().required('Yêu cầu nhập mô tả dự án'),
    investmentTargetCapital: Yup.number().required('Yêu cầu nhập vốn mục tiêu đầu tư'),
    sharedRevenue: Yup.number()
      .required('Yêu cầu nhập doanh thu chia sẻ')
      .min(0.1, 'Doanh thu chia sẻ tối thiểu là 0,1 %')
      .max(100, 'Doanh thu chia sẻ tối đa là 100 %'),
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
      name: '',
      managerId: user?.id,
      fieldId: '',
      areaId: '',
      address: '',
      description: '',
      investmentTargetCapital: '',
      sharedRevenue: 0.1,
      multiplier: '1.0',
      duration: '1',
      startDate: fDateTimeSuffix(value ?? ''),
      endDate: fDateTimeSuffix(valueEnd ?? ''),
      numOfStage: '1'
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        const formData = new FormData();
        formData.append('managerId', values.managerId);
        formData.append('name', values.name);
        formData.append('fieldId', values.fieldId);
        formData.append('areaId', values.areaId);
        formData.append('address', values.address);
        formData.append('description', values.description);
        formData.append('investmentTargetCapital', values.investmentTargetCapital);
        formData.append('sharedRevenue', `${values.sharedRevenue}`);

        formData.append('multiplier', values.multiplier);
        formData.append('duration', values.duration);
        formData.append('numOfStage', values.numOfStage);
        formData.append('startDate', `${values.startDate}`);
        formData.append('endDate', `${values.endDate}`);
        await axios({
          method: 'POST',
          url: REACT_APP_API_URL + `/projects`,
          data: formData,
          headers: headers
        })
          .then((res) => {
            resetForm();
            setSubmitting(true);
            setOpen(false);
            enqueueSnackbar('Tạo mới thành công', {
              variant: 'success'
            });
            dispatch(getProjectByPoM(user?.businessId, '', pageIndex, 10));
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật số dư thất bại', {
              variant: 'error'
            });
          })
          .finally(() => {
            resetForm();
          });
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
      <Button onClick={handleClickOpen} size="large" variant="contained">
        Tạo dự án mới
      </Button>
      <Dialog
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth={false}
      >
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <DialogTitle>Tạo dự án mới</DialogTitle>
            <DialogContent>
              <Box my={3}>
                <DialogContentText>
                  Điền các thông tin ban đầu để phục vụ cho quá trình kêu gọi cho dự án của bạn.
                </DialogContentText>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>Tổng quan dự án</LabelStyle>
                      <TextField
                        required
                        label="Tên dự án"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                      />
                      <Stack spacing={3}>
                        <Autocomplete
                          onChange={(_, newValue) => {
                            setFieldValue('fieldId', newValue?.id ?? '');
                          }}
                          options={listOfField}
                          getOptionLabel={(option) => option.name}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option.name}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                              label="Lĩnh vực"
                            />
                          )}
                        />
                        {touched.fieldId && errors.fieldId && (
                          <FormHelperText error sx={{ px: 2 }}>
                            {touched.fieldId && errors.fieldId}
                          </FormHelperText>
                        )}
                      </Stack>
                      <TextField
                        required
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
                    <Stack spacing={3}>
                      <LabelStyle>Khu vực dự án</LabelStyle>

                      <Stack spacing={3}>
                        <Autocomplete
                          onChange={(_, newValue) => {
                            dispatch(filterAreas(areaList, newValue));
                          }}
                          options={cityList}
                          getOptionLabel={(option) => option}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              label="Tỉnh/Thành phố"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        {touched.areaId && errors.areaId && (
                          <FormHelperText error sx={{ px: 2 }}>
                            {touched.areaId && errors.areaId}
                          </FormHelperText>
                        )}
                      </Stack>
                      <Stack spacing={3}>
                        <Autocomplete
                          onChange={(_, newValue) => {
                            setFieldValue('areaId', newValue?.id ?? '');
                          }}
                          options={areaListFilter}
                          getOptionLabel={(option) => option.district}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option.district}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              label="Quận/Huyện"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        {touched.areaId && errors.areaId && (
                          <FormHelperText error sx={{ px: 2 }}>
                            {touched.areaId && errors.areaId}
                          </FormHelperText>
                        )}
                        <TextField
                          fullWidth
                          required
                          label="Địa chỉ"
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                  <Box my={3}>
                    <LabelStyle>(1) Thời gian kêu gọi</LabelStyle>
                    <Grid container display="flex" justifyContent={'space-around'} py={2}>
                      <Grid xs={12} md={6}>
                        <DatePicker
                          label="Ngày bắt đầu *"
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
                      <Grid xs={12} md={6}>
                        <DatePicker
                          label="Ngày kết thúc *"
                          inputFormat="dd/MM/yyyy"
                          value={valueEnd}
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
                      <Typography sx={{ my: 2, color: '#e96100', fontSize: '13px' }}>
                        (1) Thời gian để hệ thống duyệt dự án khoảng 2-3 ngày, bạn nên dành một
                        khoảng thời gian ngắn để duyệt dự án. <br />
                        <br />
                        Thời gian kết thúc nhiều hơn so với thời gian kêu gọi từ 7-10 ngày bạn nên
                        dành một khoảng thời gian để kêu gọi dự án.
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>(2) Các thông số của dự án</LabelStyle>
                      <Stack spacing={3}>
                        <Box>
                          <Tooltip
                            title="Doanh thu chia sẻ: Là % doanh thu bạn sẽ chia sẻ cho các nhà đầu tư mỗi kỳ. 
                    Ví dụ: Doanh thu kỳ của bạn là 1,000,000,000 (VNĐ), doanh thu chia sẻ 8%, vậy tiền phải thanh toán là 1,000,000,000 * 8% = 80,000,000 (VNĐ)"
                            placement="right"
                          >
                            <TextField
                              required
                              fullWidth
                              label="Doanh thu chia sẻ"
                              type="number"
                              {...getFieldProps('sharedRevenue')}
                              error={Boolean(touched.sharedRevenue && errors.sharedRevenue)}
                              helperText={touched.sharedRevenue && errors.sharedRevenue}
                              inputProps={{
                                maxLength: 10
                              }}
                              InputProps={{
                                maxRows: 4,
                                inputProps: { step: 0.1, min: 0.1, max: 100 },
                                disableUnderline: true,

                                endAdornment: '%'
                              }}
                            />
                          </Tooltip>
                          <Typography sx={{ fontSize: '12px', color: '#e96100', paddingLeft: 2 }}>
                            (2) Hệ thống sẽ tự động làm tròn 1 chữ số sau dấu phẩy <br />
                            Ví dụ: 1.34 sẽ làm tròn thành 1.3
                            <br />
                            1.35 làm tròn thành 1.4
                            <br />
                          </Typography>
                        </Box>
                        <Tooltip
                          title="Mục tiêu kêu gọi: Là số tiền bạn cần kêu gọi để xây dựng dự án. Ví dụ: 1,000,000,000 (VNĐ)"
                          placement="right"
                        >
                          <TextField
                            required
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
                            required
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
                            required
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
                            required
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
                    {/* <LabelStyle>Phân tích</LabelStyle> */}
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
                              parseFloat(values.multiplier) * Number(values.investmentTargetCapital)
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
                            value={parseInt(values.duration) / parseInt(values.numOfStage)}
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
                            value={Math.ceil(
                              (parseFloat(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.numOfStage)
                            )}
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
                            value={Math.ceil(
                              ((parseFloat(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.numOfStage) /
                                Number(values.sharedRevenue)) *
                                100
                            )}
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
                              Math.ceil(
                                (parseFloat(values.multiplier) *
                                  Number(values.investmentTargetCapital)) /
                                  Number(values.duration) /
                                  Number(values.sharedRevenue)
                              ) * 100
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
              <Button variant="contained" color="error" onClick={handleClose}>
                Đóng
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Tạo dự án mới
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </>
  );
}
