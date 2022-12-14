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
    name: Yup.string().required('Y??u c???u nh???p t??n'),
    managerId: Yup.string().required('Y??u c???u nh???p ng?????i qu???n l??'),
    address: Yup.string().required('Y??u c???u nh???p ?????a ch???'),
    investmentTargetCapital: Yup.number().required('Y??u c???u nh???p v???n m???c ti??u ?????u t??'),
    sharedRevenue: Yup.number()
      .required('Y??u c???u nh???p doanh thu chia s???')
      .min(0.1, 'Doanh thu chia s??? t???i thi???u l?? 0,1 %'),
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
        enqueueSnackbar('C???p nh???t th??nh c??ng', {
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
            <DialogTitle>Th??ng tin d??? ??n c???a b???n</DialogTitle>
            <DialogContent>
              <Box my={2}>
                <DialogContentText>
                  C???p nh???t th??ng tin cho d??? ??n c???a b???n b??n d?????i.
                </DialogContentText>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>T???ng quan d??? ??n</LabelStyle>
                      <TextField
                        label="T??n d??? ??n"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        variant="outlined"
                      />
                      <TextField
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
                    <LabelStyle>Th???i gian b???t ?????u: {p.startDate}</LabelStyle>
                    <LabelStyle>Th???i gian k???t th??c: {p.endDate}</LabelStyle>
                    <Grid container gap={3} display="flex" justifyContent={'space-around'} py={2}>
                      <Grid xs={12} md={5}>
                        <DatePicker
                          label="Ng??y b???t ?????u"
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
                      <Grid xs={12} md={5}>
                        <DatePicker
                          label="Ng??y k???t th??c"
                          inputFormat="dd/MM/yyyy"
                          value={valueEndDate}
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
                    </Grid>
                    <Typography sx={{ my: 2, color: '#e96100', fontSize: '13px' }}>
                      L??u ??: Th???i gian k??u g???i d??? ??n s??? kh??ng thay ?????i n???u nh?? b???n kh??ng c???p nh???t
                      l???i th???i gian <br />
                      <br />
                      Th???i gian k???t th??c nhi???u h??n so v???i th???i gian k??u g???i t??? 7-10 ng??y b???n n??n
                      d??nh m???t kho???ng th???i gian ????? k??u g???i d??? ??n.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Box my={3}>
                    <Stack spacing={3}>
                      <LabelStyle>C??c th??ng s??? c???a d??? ??n</LabelStyle>
                      <Stack spacing={3}>
                        <Tooltip
                          title="Doanh thu chia s???: L?? % doanh thu b???n s??? chia s??? cho c??c nh?? ?????u t?? m???i k???. 
                    V?? d???: Doanh thu k??? c???a b???n l?? 1,000,000,000 (VN??), doanh thu chia s??? 8%, v???y ti???n ph???i thanh to??n l?? 1,000,000,000 * 8% = 80,000,000 (VN??)"
                          placement="right"
                        >
                          <TextField
                            fullWidth
                            label="Doanh thu chia s???"
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
                          title="M???c ti??u k??u g???i: L?? s??? ti???n b???n c???n k??u g???i ????? x??y d???ng d??? ??n. V?? d???: 1,000,000,000 (VN??)"
                          placement="right"
                        >
                          <TextField
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
                              Number(values.multiplier) * Number(values.investmentTargetCapital)
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
                            value={Number(values.duration) / Number(values.numOfStage)}
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
                            value={
                              (Number(values.multiplier) * Number(values.investmentTargetCapital)) /
                              Number(values.numOfStage)
                            }
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
                            value={
                              ((Number(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.numOfStage) /
                                Number(values.sharedRevenue)) *
                              100
                            }
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
                              ((Number(values.multiplier) *
                                Number(values.investmentTargetCapital)) /
                                Number(values.duration) /
                                Number(values.sharedRevenue)) *
                              100
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
              <Button color="error" variant="contained" onClick={closeDialog}>
                ????ng
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                C???p nh???t
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </>
  );
}
