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
    name: Yup.string().required('Y??u c???u nh???p t??n'),
    managerId: Yup.string().required('Y??u c???u nh???p ng?????i qu???n l??'),
    fieldId: Yup.string().required('Y??u c???u nh???p l??nh v???c'),
    areaId: Yup.string().required('Y??u c???u nh???p th??nh ph??? v?? khu v???c'),
    address: Yup.string().required('Y??u c???u nh???p ?????a ch???'),
    description: Yup.string().required('Y??u c???u nh???p m?? t??? d??? ??n'),
    investmentTargetCapital: Yup.number().required('Y??u c???u nh???p v???n m???c ti??u ?????u t??'),
    sharedRevenue: Yup.number()
      .required('Y??u c???u nh???p doanh thu chia s???')
      .min(0.1, 'Doanh thu chia s??? t???i thi???u l?? 0,1 %')
      .max(100, 'Doanh thu chia s??? t???i ??a l?? 100 %'),
    multiplier: Yup.number()
      .required('Y??u c???u nh???p h??? s??? nh??n')
      .min(1, 'H??? s??? nh??n t???i thi???u l?? 1.0'),
    duration: Yup.number().required('Y??u c???u nh???p k??? h???n').min(1, 'K??? h???n t???i thi???u l?? 1 th??ng'),
    startDate: Yup.string().required('Y??u c???u nh???p ng??y t???o'),
    endDate: Yup.string().required('Y??u c???u nh???p ng??y k???t th??c'),
    numOfStage: Yup.number()
      .required('Y??u c???u nh???p s??? k?? thanh to??n')
      .min(1, 'K??? h???n t???i thi???u l?? 1 k???')
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
            enqueueSnackbar('T???o m???i th??nh c??ng', {
              variant: 'success'
            });
            dispatch(getProjectByPoM(user?.businessId, '', pageIndex, 10));
          })
          .catch(() => {
            enqueueSnackbar('C???p nh???t s??? d?? th???t b???i', {
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
        T???o d??? ??n m???i
      </Button>
      <Dialog
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth={false}
      >
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <DialogTitle>T???o d??? ??n m???i</DialogTitle>
            <DialogContent>
              <Box my={3}>
                <DialogContentText>
                  ??i???n c??c th??ng tin ban ?????u ????? ph???c v??? cho qu?? tr??nh k??u g???i cho d??? ??n c???a b???n.
                </DialogContentText>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>T???ng quan d??? ??n</LabelStyle>
                      <TextField
                        required
                        label="T??n d??? ??n"
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
                              label="L??nh v???c"
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
                        label="M?? t??? kh??i qu??t d??? ??n"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    </Stack>
                  </Box>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>Khu v???c d??? ??n</LabelStyle>

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
                              label="T???nh/Th??nh ph???"
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
                              label="Qu???n/Huy???n"
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
                          label="?????a ch???"
                          {...getFieldProps('address')}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                  <Box my={3}>
                    <LabelStyle>(1) Th???i gian k??u g???i</LabelStyle>
                    <Grid container display="flex" justifyContent={'space-around'} py={2}>
                      <Grid xs={12} md={6}>
                        <DatePicker
                          label="Ng??y b???t ?????u *"
                          inputFormat="dd/MM/yyyy"
                          value={value}
                          minDate={valueMin!}
                          onChange={handleChange}
                          renderInput={(params) => (
                            <Tooltip
                              title="Th???i gian ????? h??? th???ng duy???t d??? ??n kho???ng 2-3 ng??y, b???n n??n d??nh m???t kho???ng th???i gian ng???n ????? duy???t d??? ??n."
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
                          label="Ng??y k???t th??c *"
                          inputFormat="dd/MM/yyyy"
                          value={valueEnd}
                          minDate={value!}
                          maxDate={valueMaxDate!}
                          onChange={handleChangeEndDate}
                          renderInput={(params) => (
                            <Tooltip
                              title="Th???i gian ????? h??? th???ng duy???t d??? ??n kho???ng 2-3 ng??y, b???n n??n d??nh m???t kho???ng th???i gian ng???n ????? duy???t d??? ??n."
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
                        (1) Th???i gian ????? h??? th???ng duy???t d??? ??n kho???ng 2-3 ng??y, b???n n??n d??nh m???t
                        kho???ng th???i gian ng???n ????? duy???t d??? ??n. <br />
                        <br />
                        Th???i gian k???t th??c nhi???u h??n so v???i th???i gian k??u g???i t??? 7-10 ng??y b???n n??n
                        d??nh m???t kho???ng th???i gian ????? k??u g???i d??? ??n.
                      </Typography>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>(2) C??c th??ng s??? c???a d??? ??n</LabelStyle>
                      <Stack spacing={3}>
                        <Box>
                          <Tooltip
                            title="Doanh thu chia s???: L?? % doanh thu b???n s??? chia s??? cho c??c nh?? ?????u t?? m???i k???. 
                    V?? d???: Doanh thu k??? c???a b???n l?? 1,000,000,000 (VN??), doanh thu chia s??? 8%, v???y ti???n ph???i thanh to??n l?? 1,000,000,000 * 8% = 80,000,000 (VN??)"
                            placement="right"
                          >
                            <TextField
                              required
                              fullWidth
                              label="Doanh thu chia s???"
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
                            (2) H??? th???ng s??? t??? ?????ng l??m tr??n 1 ch??? s??? sau d???u ph???y <br />
                            V?? d???: 1.34 s??? l??m tr??n th??nh 1.3
                            <br />
                            1.35 l??m tr??n th??nh 1.4
                            <br />
                          </Typography>
                        </Box>
                        <Tooltip
                          title="M???c ti??u k??u g???i: L?? s??? ti???n b???n c???n k??u g???i ????? x??y d???ng d??? ??n. V?? d???: 1,000,000,000 (VN??)"
                          placement="right"
                        >
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="M???c ti??u k??u g???i"
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
                          suffix={'  (VN??)'}
                        />
                        <Tooltip
                          title="H??? s??? nh??n: L?? ch??? s??? quy???t ?????nh s??? ti???n t???i ??a b???n ph???i chia s??? cho c??c nh?? ?????u t??. 
                    V?? d???: M???c ti??u k??u g???i l?? 1,000,000,000 (VN??), h??? s??? nh??n l?? 1.6 th?? s??? ti???n b???n ph???i chia s??? 
                    l???i cho c??c nh?? ?????u t?? l?? 1,000,000,000 x 1.6 = 1,600,000,000 (VN??)"
                          placement="right"
                        >
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="H??? s??? nh??n"
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
                          title="K??? h???n: L?? kho???ng th???i gian t???i ??a b???n ph???i thanh to??n to??n b??? s??? ti???n cho c??c nh?? ?????u t??"
                          placement="right"
                        >
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="K??? h???n"
                            {...getFieldProps('duration')}
                            error={Boolean(touched.duration && errors.duration)}
                            helperText={touched.duration && errors.duration}
                            InputProps={{
                              inputProps: { step: 1 },
                              endAdornment: 'th??ng'
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title="S??? k??? thanh to??n: L?? s??? k??? b???n d??? ki???n s??? thanh to??n ti???n cho c??c nh?? ?????u t??"
                          placement="right"
                        >
                          <TextField
                            required
                            fullWidth
                            type="number"
                            label="S??? k??? thanh to??n"
                            {...getFieldProps('numOfStage')}
                            error={Boolean(touched.numOfStage && errors.numOfStage)}
                            helperText={touched.numOfStage && errors.numOfStage}
                            InputProps={{
                              inputProps: { step: 1, min: 1 },
                              endAdornment: 'k???'
                            }}
                          />
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={5.9}>
                    {/* <LabelStyle>Ph??n t??ch</LabelStyle> */}
                    <Stack spacing={3}>
                      <Stack spacing={2}>
                        <Box>
                          <LabelStyle>T???ng thanh kho???n</LabelStyle>
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
                            title="T???ng thanh kho???n: L?? t???ng s??? ti???n b???n ph???i thanh to??n cho c??c nh?? ?????u t??"
                            placeholder="T???ng thanh kho???n"
                            value={
                              parseFloat(values.multiplier) * Number(values.investmentTargetCapital)
                            }
                            suffix={'   (VN??)'}
                          />
                        </Box>

                        <Box>
                          <LabelStyle>Th???i gian m???i k???</LabelStyle>
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
                            placeholder="T???ng thanh kho???n"
                            value={parseInt(values.duration) / parseInt(values.numOfStage)}
                            suffix={'   (th??ng/k???)'}
                          />
                        </Box>

                        <Box>
                          <LabelStyle>S??? ti???n thanh to??n t???i thi???u m???i k???</LabelStyle>
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
                            placeholder="T???ng thanh kho???n"
                            value={Math.ceil(
                              (parseFloat(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.numOfStage)
                            )}
                            suffix={'   (VN??/k???)'}
                          />
                        </Box>

                        <Box>
                          <LabelStyle>Doanh thu b???n c???n ?????t ???????c m???i k???</LabelStyle>
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
                            placeholder="T???ng thanh kho???n"
                            value={Math.ceil(
                              ((parseFloat(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.numOfStage) /
                                Number(values.sharedRevenue)) *
                                100
                            )}
                            suffix={'   (VN??/k???)'}
                          />
                        </Box>
                        <Box>
                          <LabelStyle>S??? ti???n d??? ??n b???n c???n ki???m ???????c m???i th??ng</LabelStyle>
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
                            placeholder="T???ng thanh kho???n"
                            value={
                              Math.ceil(
                                (parseFloat(values.multiplier) *
                                  Number(values.investmentTargetCapital)) /
                                  Number(values.duration) /
                                  Number(values.sharedRevenue)
                              ) * 100
                            }
                            suffix={'   (VN??/th??ng)'}
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
                ????ng
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                T???o d??? ??n m???i
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </>
  );
}
