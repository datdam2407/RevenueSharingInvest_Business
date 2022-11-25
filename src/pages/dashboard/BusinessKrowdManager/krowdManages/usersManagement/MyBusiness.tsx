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
    <Page title="thương hiệu| Krowd dành cho quản lý">
      {(isLoading && (
        <Box>
          <CircularProgress
            size={100}
            sx={{ margin: '0px auto', padding: '1rem', display: 'flex' }}
          />
          <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
            Đang tải dữ liệu, vui lòng đợi giây lát...
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
    email: Yup.string().required('Yêu cầu nhập email thương hiệu').email('Email chưa hợp lệ'),
    name: Yup.string().required('Yêu cầu nhập tên'),
    phoneNum: Yup.string().required('Yêu cầu nhập số điện thoại'),
    address: Yup.string().required('Yêu cầu nhập địa chỉ')
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
            enqueueSnackbar('Cập nhật thành công', {
              variant: 'success'
            });
            dispatch(getBusinessById(business.id));
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật thất bại', {
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
            enqueueSnackbar('Cập nhật ảnh thành công', {
              variant: 'success'
            });
            dispatch(getBusinessById(business.id));
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật ảnh thất bại', {
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
    <Page title="Chi tiết quản lý thương hiệu | Krowd dành cho quản lý">
      <Container maxWidth={'lg'}>
        <HeaderBreadcrumbs
          heading={'Chi tiết quản lý thương hiệu'}
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: business.name }]}
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
                    Cập nhật thông tin
                  </Button>
                  <Dialog
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <FormikProvider value={formikProfile}>
                      <Form noValidate autoComplete="off" onSubmit={handleSubmitProfile}>
                        <DialogTitle>Cập nhật thông tin thương hiệu</DialogTitle>
                        <DialogContent>
                          <Box my={3}>
                            <DialogContentText>Điền thông tin bạn muốn cập nhật</DialogContentText>
                          </Box>
                          <Stack spacing={{ xs: 2, md: 3 }}>
                            <TextField
                              label="Tên thương hiệu"
                              required
                              fullWidth
                              variant="outlined"
                              {...getFieldPropsProfile('name')}
                              error={Boolean(touchedProfile.name && errorsProfile.name)}
                              helperText={touchedProfile.name && errorsProfile.name}
                            />
                            <TextField
                              label="Email thương hiệu"
                              required
                              fullWidth
                              variant="outlined"
                              {...getFieldPropsProfile('email')}
                              error={Boolean(touchedProfile.email && errorsProfile.email)}
                              helperText={touchedProfile.email && errorsProfile.email}
                            />
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                              <TextField
                                label="Số điện thoại"
                                required
                                fullWidth
                                variant="outlined"
                                {...getFieldPropsProfile('phoneNum')}
                                error={Boolean(touchedProfile.phoneNum && errorsProfile.phoneNum)}
                                helperText={touchedProfile.phoneNum && errorsProfile.phoneNum}
                              />
                              <TextField
                                label="Mã số thuế"
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
                              label="Địa chỉ"
                              required
                              fullWidth
                              variant="outlined"
                              {...getFieldPropsProfile('address')}
                              error={Boolean(touchedProfile.address && errorsProfile.address)}
                              helperText={touchedProfile.address && errorsProfile.address}
                            />
                            <Stack spacing={3}>
                              <TextField
                                label="Mô tả"
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
                          <Button onClick={handleClose}>Đóng</Button>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isSubmittingProfile}
                          >
                            Lưu
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
                      ? 'CHƯA HOẠT ĐỘNG'
                      : 'ĐANG HOẠT ĐỘNG'}
                  </Label>
                ) : (
                  <Label color="success" sx={{ textTransform: 'uppercase', mb: 1 }}>
                    {business.status === BUSINESS_STATUS_ENUM.ACTIVE
                      ? 'ĐANG HOẠT ĐỘNG'
                      : 'CHƯA HOẠT ĐỘNG'}{' '}
                  </Label>
                )}
              </Box>
              <Box>
                <Stack spacing={{ xs: 2, md: 3 }}>
                  <TextField fullWidth disabled label="Tên thương hiệu" value={business.name} />

                  <TextField
                    fullWidth
                    disabled
                    label="Email"
                    value={business.email ?? '<Chưa cập nhật>'}
                  />
                  <TextField
                    fullWidth
                    disabled
                    label="Hotline"
                    value={business.phoneNum ?? '<Chưa cập nhật>'}
                  />

                  <TextField
                    fullWidth
                    disabled
                    label="Địa chỉ"
                    value={business.address ?? '<Chưa cập nhật>'}
                  />
                  <TextField
                    fullWidth
                    disabled
                    label="Mã số thuế"
                    value={business.taxIdentificationNumber ?? '<Chưa cập nhật>'}
                  />

                  <TextField
                    fullWidth
                    disabled
                    label="Lĩnh vực"
                    value={business.fieldList[0].name ?? '<Chưa cập nhật>'}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    disabled
                    label="Mô tả"
                    value={business.description ?? '<Chưa cập nhật>'}
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
                          Lưu
                        </LoadingButton>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => {
                            setFileUpload(null);
                            setFieldValueImage('photoURL', business.image);
                          }}
                        >
                          Hủy
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
    name: Yup.string().required('Yêu cầu nhập tên'),
    email: Yup.string().required('Yêu cầu nhập email').email('Email của bạn chưa hợp lệ'),
    fieldId: Yup.string().required('Yêu cầu nhập lĩnh vực'),
    phoneNum: Yup.string().required('Yêu cầu nhập số điện thoại'),
    address: Yup.string().required('Yêu cầu nhập địa chỉ'),
    taxIdentificationNumber: Yup.string().required('Yêu cầu nhập mã thương hiệu')
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
            enqueueSnackbar('Tạo mới thành công', {
              variant: 'success'
            });
            await dispatch(getMainUserProfile(user?.id));
            dispatch(getBusinessById(businessDetail?.id));
            window.location.reload();
          })
          .catch(() => {
            enqueueSnackbar('Tạo mới thất bại', {
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
          BẠN CHƯA CÓ thương hiệu
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>Hãy tạo mới thương hiệu của bạn</Typography>

        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />

        <Button onClick={handleClickOpen} size="large" variant="contained">
          Tạo mới
        </Button>
        <Dialog
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <DialogTitle>Tạo mới thương hiệu</DialogTitle>
              <DialogContent>
                <Box my={3}>
                  <DialogContentText>Điền thông tin thương hiệu của bạn.</DialogContentText>
                  <Typography variant="caption" color="#B78103">
                    * Những thông tin trống vui lòng điền "N/A".
                  </Typography>
                </Box>
                <Stack spacing={{ xs: 2, md: 3 }}>
                  <TextField
                    fullWidth
                    required
                    label="Tên thương hiệu"
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
                      label="Mã số thuế"
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
                    label="Địa chỉ"
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
                          label="Lĩnh vực"
                          error={Boolean(touched.fieldId && errors.fieldId)}
                          helperText={touched.fieldId && errors.fieldId}
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Đóng</Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Lưu
                </LoadingButton>
              </DialogActions>
            </Form>
          </FormikProvider>
        </Dialog>
      </Box>
    </Container>
  );
}
