import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import {
  Container,
  Tab,
  Box,
  Tabs,
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
  Autocomplete,
  Avatar,
  Card,
  Grid
} from '@mui/material';
// redux
import { dispatch, RootState, useDispatch, useSelector } from 'redux/store';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// hooks
import useSettings from 'hooks/useSettings';
// components
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { AccountGeneral } from 'components/_dashboard/user/account';
import { getMainUserProfile } from 'redux/slices/krowd_slices/users';
import useAuth from 'hooks/useAuth';
import { getBusinessById } from 'redux/slices/krowd_slices/business';
import SeverErrorIllustration from 'assets/illustration_500';
import { LoadingButton } from '@mui/lab';
import { FormikProvider, Form, useFormik, Field } from 'formik';
import field, { getFieldList } from 'redux/slices/krowd_slices/field';
import { useLocation, useNavigate } from 'react-router';
import {
  Business,
  BUSINESS_STATUS_ENUM,
  NewBusinessFormValues
} from '../../../../../@types/krowd/business';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
import { BusinessAPI } from '_apis_/krowd_apis/business';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import Label from 'components/Label';
import { UploadAvatar } from 'components/upload';
import { UploadAPI } from '_apis_/krowd_apis/upload';
import { ROLE_USER_TYPE } from '../../../../../@types/krowd/users';

// ----------------------------------------------------------------------

export default function MyBusiness() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;

  useEffect(() => {
    dispatch(getBusinessById(user?.businessId));
  }, [dispatch]);

  return (
    <Page title="th????ng hi???u| Krowd d??nh cho qu???n l??">
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
        (businessDetail && <BusinessDetail business={businessDetail} />) || <EmptyBusiness />}
    </Page>
  );
}

type BusinessManagerProps = {
  business: Business;
};

function BusinessDetail({ business }: BusinessManagerProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const EditBusinessSchema = Yup.object().shape({
    email: Yup.string().required('Y??u c???u nh???p email th????ng hi???u').email('Email ch??a h???p l???'),
    name: Yup.string().required('Y??u c???u nh???p t??n'),
    phoneNum: Yup.string().required('Y??u c???u nh???p s??? ??i???n tho???i'),
    address: Yup.string().required('Y??u c???u nh???p ?????a ch???')
  });
  const formikProfile = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: business.email,
      name: business.name,
      phoneNum: business.phoneNum,
      address: business.address,
      taxIdentificationNumber: business.taxIdentificationNumber,
      description: business.description
    },
    validationSchema: EditBusinessSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        setSubmitting(true);
        const { email, name, phoneNum, address, taxIdentificationNumber, description } = values;
        await BusinessAPI.put({
          id: business.id,
          email: email,
          name: name,
          phoneNum: phoneNum,
          address: address,
          taxIdentificationNumber: taxIdentificationNumber,
          description: description
        })
          .then(() => {
            enqueueSnackbar('C???p nh???t th??nh c??ng', {
              variant: 'success'
            });
            dispatch(getBusinessById(business.id));
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
    errors: errorsProfile,
    values: valuesProfile,
    touched: touchedProfile,
    handleSubmit: handleSubmitProfile,
    isSubmitting: isSubmittingProfile,
    setFieldValue: setFieldValueProfile,
    getFieldProps: getFieldPropsProfile
  } = formikProfile;
  const handleClickOpen = () => {
    dispatch(getFieldList());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formikImage = useFormik({
    enableReinitialize: true,
    initialValues: {
      photoURL: business.image
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        setSubmitting(true);
        await UploadAPI.postBusinessLogo({ businessId: business.id, file: fileUpload })
          .then(() => {
            enqueueSnackbar('C???p nh???t ???nh th??nh c??ng', {
              variant: 'success'
            });
            dispatch(getBusinessById(business.id));
          })
          .catch(() => {
            enqueueSnackbar('C???p nh???t ???nh th???t b???i', {
              variant: 'error'
            });
            setFileUpload(null);
            setFieldValueImage('photoURL', null);
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const {
    errors: errorsImage,
    values: valuesImage,
    touched: touchedImage,
    handleSubmit: handleSubmitImage,
    isSubmitting: isSubmittingImage,
    setFieldValue: setFieldValueImage,
    getFieldProps: getFieldPropsImage
  } = formikImage;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValueImage('photoURL', {
          ...file,
          preview: URL.createObjectURL(file)
        });
        setFileUpload(file);
      }
    },
    [setFieldValueImage]
  );

  return (
    <Page title="Chi ti???t qu???n l?? th????ng hi???u | Krowd d??nh cho qu???n l??">
      <Container maxWidth={'lg'}>
        <HeaderBreadcrumbs
          heading={'Chi ti???t qu???n l?? th????ng hi???u'}
          links={[{ name: 'B???ng ??i???u khi???n', href: PATH_DASHBOARD.root }, { name: business.name }]}
          action={
            <Box>
              {user?.role === ROLE_USER_TYPE.BUSINESS_MANAGER && (
                <>
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
                    <FormikProvider value={formikProfile}>
                      <Form noValidate autoComplete="off" onSubmit={handleSubmitProfile}>
                        <DialogTitle>C???p nh???t th??ng tin th????ng hi???u</DialogTitle>
                        <DialogContent>
                          <Box my={3}>
                            <DialogContentText>??i???n th??ng tin b???n mu???n c???p nh???t</DialogContentText>
                          </Box>
                          <Stack spacing={{ xs: 2, md: 3 }}>
                            <TextField
                              label="T??n th????ng hi???u"
                              required
                              fullWidth
                              variant="outlined"
                              {...getFieldPropsProfile('name')}
                              error={Boolean(touchedProfile.name && errorsProfile.name)}
                              helperText={touchedProfile.name && errorsProfile.name}
                            />
                            <TextField
                              label="Email th????ng hi???u"
                              required
                              fullWidth
                              variant="outlined"
                              {...getFieldPropsProfile('email')}
                              error={Boolean(touchedProfile.email && errorsProfile.email)}
                              helperText={touchedProfile.email && errorsProfile.email}
                            />
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                              <TextField
                                label="S??? ??i???n tho???i"
                                required
                                fullWidth
                                variant="outlined"
                                {...getFieldPropsProfile('phoneNum')}
                                error={Boolean(touchedProfile.phoneNum && errorsProfile.phoneNum)}
                                helperText={touchedProfile.phoneNum && errorsProfile.phoneNum}
                              />
                              <TextField
                                label="M?? s??? thu???"
                                required
                                fullWidth
                                variant="outlined"
                                {...getFieldPropsProfile('taxIdentificationNumber')}
                                error={Boolean(
                                  touchedProfile.taxIdentificationNumber &&
                                    errorsProfile.taxIdentificationNumber
                                )}
                                helperText={
                                  touchedProfile.taxIdentificationNumber &&
                                  errorsProfile.taxIdentificationNumber
                                }
                              />
                            </Stack>
                            <TextField
                              label="?????a ch???"
                              required
                              fullWidth
                              variant="outlined"
                              {...getFieldPropsProfile('address')}
                              error={Boolean(touchedProfile.address && errorsProfile.address)}
                              helperText={touchedProfile.address && errorsProfile.address}
                            />
                            <Stack spacing={3}>
                              <TextField
                                label="M?? t???"
                                required
                                multiline
                                minRows={5}
                                fullWidth
                                variant="outlined"
                                {...getFieldPropsProfile('description')}
                                error={Boolean(
                                  touchedProfile.description && errorsProfile.description
                                )}
                                helperText={touchedProfile.description && errorsProfile.description}
                              />
                            </Stack>
                          </Stack>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>????ng</Button>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isSubmittingProfile}
                          >
                            L??u
                          </LoadingButton>
                        </DialogActions>
                      </Form>
                    </FormikProvider>
                  </Dialog>
                </>
              )}
            </Box>
          }
        />

        <Card sx={{ p: 5 }}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Box my={3}>
                {business.status === 'INACTIVE' ? (
                  <Label color="warning" sx={{ textTransform: 'uppercase', mb: 1 }}>
                    {business.status === BUSINESS_STATUS_ENUM.INACTIVE
                      ? 'CH??A HO???T ?????NG'
                      : '??ANG HO???T ?????NG'}
                  </Label>
                ) : (
                  <Label color="success" sx={{ textTransform: 'uppercase', mb: 1 }}>
                    {business.status === BUSINESS_STATUS_ENUM.ACTIVE
                      ? '??ANG HO???T ?????NG'
                      : 'CH??A HO???T ?????NG'}{' '}
                  </Label>
                )}
              </Box>
              <Box>
                <Stack spacing={{ xs: 2, md: 3 }}>
                  <TextField fullWidth disabled label="T??n th????ng hi???u" value={business.name} />

                  <TextField
                    fullWidth
                    disabled
                    label="Email"
                    value={business.email ?? '<Ch??a c???p nh???t>'}
                  />
                  <TextField
                    fullWidth
                    disabled
                    label="Hotline"
                    value={business.phoneNum ?? '<Ch??a c???p nh???t>'}
                  />

                  <TextField
                    fullWidth
                    disabled
                    label="?????a ch???"
                    value={business.address ?? '<Ch??a c???p nh???t>'}
                  />
                  <TextField
                    fullWidth
                    disabled
                    label="M?? s??? thu???"
                    value={business.taxIdentificationNumber ?? '<Ch??a c???p nh???t>'}
                  />

                  <TextField
                    fullWidth
                    disabled
                    label="L??nh v???c"
                    value={business.fieldList[0].name ?? '<Ch??a c???p nh???t>'}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    disabled
                    label="M?? t???"
                    value={business.description ?? '<Ch??a c???p nh???t>'}
                  />
                </Stack>
              </Box>
            </Grid>
            <Grid
              display={'flex'}
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              item
              xs={12}
              sm={6}
            >
              <Box my={3}>
                <FormikProvider value={formikImage}>
                  <Form noValidate autoComplete="off" onSubmit={handleSubmitImage}>
                    {user?.role === ROLE_USER_TYPE.BUSINESS_MANAGER ? (
                      <UploadAvatar
                        accept="image/*"
                        file={valuesImage.photoURL}
                        maxSize={3145728}
                        onDrop={handleDrop}
                        error={Boolean(touchedImage.photoURL && errorsImage.photoURL)}
                      />
                    ) : (
                      <UploadAvatar
                        disabled
                        accept="image/*"
                        file={valuesImage.photoURL}
                        maxSize={3145728}
                        onDrop={handleDrop}
                        error={Boolean(touchedImage.photoURL && errorsImage.photoURL)}
                      />
                    )}

                    {fileUpload && (
                      <Box display="flex" my={3} justifyContent="space-evenly">
                        <LoadingButton
                          color="warning"
                          type="submit"
                          variant="contained"
                          loading={isSubmittingImage}
                        >
                          L??u
                        </LoadingButton>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => {
                            setFileUpload(null);
                            setFieldValueImage('photoURL', business.image);
                          }}
                        >
                          H???y
                        </Button>
                      </Box>
                    )}
                  </Form>
                </FormikProvider>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}

export function EmptyBusiness() {
  const { fieldList } = useSelector((state: RootState) => state.fieldKrowd);
  const { listOfField } = fieldList;
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { mainUserState } = useSelector((state: RootState) => state.userKrowd);
  const { user: businessDetail } = mainUserState;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    dispatch(getFieldList());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const NewBusinessSchema = Yup.object().shape({
    name: Yup.string().required('Y??u c???u nh???p t??n'),
    email: Yup.string().required('Y??u c???u nh???p email').email('Email c???a b???n ch??a h???p l???'),
    fieldId: Yup.string().required('Y??u c???u nh???p l??nh v???c'),
    phoneNum: Yup.string().required('Y??u c???u nh???p s??? ??i???n tho???i'),
    address: Yup.string().required('Y??u c???u nh???p ?????a ch???'),
    taxIdentificationNumber: Yup.string().required('Y??u c???u nh???p m?? th????ng hi???u')
  });

  const formik = useFormik<NewBusinessFormValues>({
    initialValues: {
      name: '',
      fieldId: '',
      address: '',
      email: '',
      phoneNum: '',
      taxIdentificationNumber: ''
    },
    validationSchema: NewBusinessSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        BusinessAPI.post({
          name: values.name,
          address: values.address,
          email: values.email,
          phoneNum: values.phoneNum,
          taxIdentificationNumber: values.taxIdentificationNumber,
          fieldId: values.fieldId
        })
          .then(async () => {
            enqueueSnackbar('T???o m???i th??nh c??ng', {
              variant: 'success'
            });
            await dispatch(getMainUserProfile(user?.id));
            dispatch(getBusinessById(businessDetail?.id));
            window.location.reload();
          })
          .catch(() => {
            enqueueSnackbar('T???o m???i th???t b???i', {
              variant: 'error'
            });
          })
          .finally(() => {
            resetForm();
            handleClose();
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
    resetForm,
    getFieldProps
  } = formik;

  return (
    <Container>
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center', py: 10 }}>
        <Typography variant="h5" paragraph>
          B???N CH??A C?? th????ng hi???u
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>H??y t???o m???i th????ng hi???u c???a b???n</Typography>

        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />

        <Button onClick={handleClickOpen} size="large" variant="contained">
          T???o m???i
        </Button>
        <Dialog
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <DialogTitle>T???o m???i th????ng hi???u</DialogTitle>
              <DialogContent>
                <Box my={3}>
                  <DialogContentText>??i???n th??ng tin th????ng hi???u c???a b???n.</DialogContentText>
                  <Typography variant="caption" color="#B78103">
                    * Nh???ng th??ng tin tr???ng vui l??ng ??i???n "N/A".
                  </Typography>
                </Box>
                <Stack spacing={{ xs: 2, md: 3 }}>
                  <TextField
                    fullWidth
                    required
                    label="T??n th????ng hi???u"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      required
                      label="Hotline"
                      {...getFieldProps('phoneNum')}
                      error={Boolean(touched.phoneNum && errors.phoneNum)}
                      helperText={touched.phoneNum && errors.phoneNum}
                    />
                    <TextField
                      fullWidth
                      required
                      label="M?? s??? thu???"
                      {...getFieldProps('taxIdentificationNumber')}
                      error={Boolean(
                        touched.taxIdentificationNumber && errors.taxIdentificationNumber
                      )}
                      helperText={touched.taxIdentificationNumber && errors.taxIdentificationNumber}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    required
                    label="?????a ch???"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                  <Stack spacing={3}>
                    <Autocomplete
                      onChange={(_, newValue) => {
                        setFieldValue('fieldId', newValue?.id);
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
                          error={Boolean(touched.fieldId && errors.fieldId)}
                          helperText={touched.fieldId && errors.fieldId}
                        />
                      )}
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
    </Container>
  );
}
