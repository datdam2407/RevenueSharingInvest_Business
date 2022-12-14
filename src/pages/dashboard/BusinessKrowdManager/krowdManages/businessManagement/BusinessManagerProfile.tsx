import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  Grid,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker, LoadingButton } from '@mui/lab';

// redux
import { RootState, useDispatch, useSelector } from 'redux/store';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// hooks
import useSettings from 'hooks/useSettings';
// components
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { AccountGeneral } from 'components/_dashboard/user/account';
import { getMainUserProfile, getUserKrowdDetail } from 'redux/slices/krowd_slices/users';
import useAuth from 'hooks/useAuth';
import { FormikProvider, Form, useFormik } from 'formik';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { UserAPI } from '_apis_/krowd_apis/user';
import { fDateTime, fDateTimeSuffix, fDateTimeSuffix2 } from 'utils/formatTime';

// ----------------------------------------------------------------------

export default function BusinessManagerProfile() {
  const [open, setOpen] = useState(false);
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: authUser } = useAuth();
  const { mainUserState } = useSelector((state: RootState) => state.userKrowd);
  const { isLoading, user: mainUser, error } = mainUserState;
  const [value, setValue] = useState<Date | null>(new Date('dd-mm-yyyy'));
  const [valueMinDate, setMinDate] = useState<Date | null>(new Date('1950-12-31'));
  const [valueMaxDate, setMaxDate] = useState<Date | null>(new Date('2003-12-31'));
  const GENDER_OPTION = ['N/A', 'Nam', 'N???', 'Kh??c'];

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
    setFieldValue('dateOfBirth', fDateTimeSuffix2(newValue!));
  };
  useEffect(() => {
    dispatch(getMainUserProfile(authUser?.id));
  }, [dispatch]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const EditBusinessManagerSchema = Yup.object().shape({
    firstName: Yup.string().required('Y??u c???u nh???p h???'),
    lastName: Yup.string().required('Y??u c???u nh???p t??n'),
    phoneNum: Yup.string().required('Y??u c???u nh???p s??? ??i???n tho???i'),
    district: Yup.string().required('Y??u c???u nh???p qu???n'),
    city: Yup.string().required('Y??u c???u nh???p th??nh ph???'),
    idCard: Yup.string().required('Y??u c???u nh???p CMND/CCCD'),
    taxIdentificationNumber: Yup.string().required('Y??u c???u nh???p m?? s??? thu???'),
    bankName: Yup.string().required('Y??u c???u nh???p t??n ng??n h??ng'),
    bankAccount: Yup.string().required('Y??u c???u nh???p t??i kho???n ng??n h??ng'),
    address: Yup.string().required('Y??u c???u nh???p ?????a ch???')
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: mainUser?.firstName ?? '',
      lastName: mainUser?.lastName ?? '',
      phoneNum: mainUser?.phoneNum ?? '',
      address: mainUser?.address ?? '',
      gender: mainUser?.gender ?? '',
      idCard: mainUser?.idCard ?? '',
      district: mainUser?.district ?? '',
      city: mainUser?.city ?? '',
      bankName: mainUser?.bankName ?? '',
      bankAccount: mainUser?.bankAccount ?? '',
      taxIdentificationNumber: mainUser?.taxIdentificationNumber ?? '',
      dateOfBirth: mainUser?.dateOfBirth ?? ''
    },
    validationSchema: EditBusinessManagerSchema,

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (mainUser === null) {
          throw new Error('User null');
        }
        setSubmitting(true);
        const {
          firstName,
          lastName,
          phoneNum,
          address,
          district,
          city,
          bankAccount,
          bankName,
          dateOfBirth,
          idCard,
          gender,
          taxIdentificationNumber
        } = values;
        await UserAPI.putMyProfile({
          id: mainUser.id,
          firstName: firstName,
          lastName: lastName,
          phoneNum: phoneNum,
          address: address,
          city: city,
          district: district,
          dateOfBirth: dateOfBirth,
          idCard: idCard,
          gender: gender,
          taxIdentificationNumber: taxIdentificationNumber,
          bankAccount: bankAccount,
          bankName: bankName
        })
          .then(() => {
            enqueueSnackbar('C???p nh???t th??nh c??ng', {
              variant: 'success'
            });
            // dispatch(getUserKrowdDetail(mainUser.id));
            dispatch(getMainUserProfile(mainUser.id));
          })
          .catch(() => {
            enqueueSnackbar('C???p nh???t th???t b???i', {
              variant: 'error'
            });
          })
          .finally(() => {
            resetForm();
            handleClose();
          });
      } catch (error) {
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
    <Page title="T??i kho???n | Krowd d??nh cho qu???n l??">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="T??i kho???n c???a b???n"
          links={[{ name: 'B???ng ??i???u khi???n', href: PATH_DASHBOARD.root }, { name: 'Th??ng tin' }]}
          action={
            <Box>
              <Button
                variant="contained"
                onClick={handleClickOpen}
                startIcon={<Icon icon={editTwotone} />}
                color={'warning'}
              >
                C???p nh???t th??ng tin
              </Button>
              <Dialog
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <FormikProvider value={formik}>
                  <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <DialogTitle>C???p nh???t th??ng tin</DialogTitle>
                    <DialogContent>
                      <Box my={3}>
                        <DialogContentText>C???p nh???t th??ng tin c???a b???n ??? b??n d?????i</DialogContentText>
                        <Typography variant="caption" color="#B78103">
                          * Nh???ng th??ng tin tr???ng vui l??ng ??i???n "N/A".
                        </Typography>
                      </Box>
                      <Stack spacing={{ xs: 2, md: 3 }}>
                        <Typography>Th??ng tin c?? nh??n:</Typography>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField
                            required
                            label="H???"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('firstName')}
                            error={Boolean(touched.firstName && errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                          />
                          <TextField
                            required
                            label="T??n"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('lastName')}
                            error={Boolean(touched.lastName && errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                          />
                          {/* <RadioGroup {...getFieldProps('gender')} row>
                            <Stack spacing={1} direction="row">
                              {GENDER_OPTION.map((gender) => (
                                <FormControlLabel
                                  key={gender}
                                  value={gender}
                                  control={<Radio />}
                                  label={gender}
                                />
                              ))}
                            </Stack>
                          </RadioGroup> */}

                          <FormControl sx={{ width: '270px' }}>
                            <InputLabel>Gi???i t??nh</InputLabel>
                            <Select
                              label="Gi???i t??nh"
                              native
                              {...getFieldProps('gender')}
                              value={values.gender}
                            >
                              {GENDER_OPTION.map((category, i) => (
                                <option key={i} value={category}>
                                  {category}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <Grid xs={12} md={5}>
                            <DatePicker
                              label="Ng??y sinh"
                              inputFormat="dd/MM/yyyy"
                              value={value}
                              minDate={valueMinDate!}
                              maxDate={valueMaxDate!}
                              onChange={handleChange}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Grid>
                          <TextField
                            required
                            label="S??T"
                            variant="outlined"
                            {...getFieldProps('phoneNum')}
                            error={Boolean(touched.phoneNum && errors.phoneNum)}
                            helperText={touched.phoneNum && errors.phoneNum}
                          />
                          <TextField
                            required
                            label="CMND/CCCD"
                            variant="outlined"
                            {...getFieldProps('idCard')}
                            error={Boolean(touched.idCard && errors.idCard)}
                            helperText={touched.idCard && errors.idCard}
                          />
                        </Stack>
                        <Typography>?????a ch???:</Typography>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField
                            required
                            label="S??? nh??, t??n ???????ng"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('address')}
                            error={Boolean(touched.address && errors.address)}
                            helperText={touched.address && errors.address}
                          />
                          <TextField
                            required
                            label="Th??nh ph???"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('city')}
                            error={Boolean(touched.city && errors.city)}
                            helperText={touched.city && errors.city}
                          />
                          <TextField
                            required
                            label="Qu???n"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('district')}
                            error={Boolean(touched.district && errors.district)}
                            helperText={touched.district && errors.district}
                          />
                        </Stack>
                        <Typography>Ng??n h??ng</Typography>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                          <TextField
                            required
                            label="T??n ng??n h??ng"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('bankName')}
                            error={Boolean(touched.bankName && errors.bankName)}
                            helperText={touched.bankName && errors.bankName}
                          />
                          <TextField
                            required
                            label="S??? t??i kho???n"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('bankAccount')}
                            error={Boolean(touched.bankAccount && errors.bankAccount)}
                            helperText={touched.bankAccount && errors.bankAccount}
                          />
                          <TextField
                            required
                            label="M?? s??? thu???"
                            fullWidth
                            variant="outlined"
                            {...getFieldProps('taxIdentificationNumber')}
                            error={Boolean(
                              touched.taxIdentificationNumber && errors.taxIdentificationNumber
                            )}
                            helperText={
                              touched.taxIdentificationNumber && errors.taxIdentificationNumber
                            }
                          />
                        </Stack>
                      </Stack>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>????ng</Button>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        L??u
                      </LoadingButton>
                    </DialogActions>
                  </Form>
                </FormikProvider>
              </Dialog>
            </Box>
          }
        />
        {(isLoading && (
          <Box>
            <CircularProgress
              size={100}
              sx={{ margin: '0px auto', padding: '1rem', display: 'flex' }}
            />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
              ??ang t???i d??? li???u, vui l??ng ?????i gi??y l??t...
            </Typography>
          </Box>
        )) ||
          (mainUser && <AccountGeneral user={mainUser} />)}
      </Container>
    </Page>
  );
}
