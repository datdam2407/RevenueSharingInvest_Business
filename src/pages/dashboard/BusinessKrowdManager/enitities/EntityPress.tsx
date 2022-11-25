import * as Yup from 'yup';
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { DatePicker, LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  FormHelperText,
  Autocomplete,
  Box
} from '@mui/material';
// utils
import { useNavigate } from 'react-router-dom';
// @types
import { NewProjectEntityFormValues, Project } from '../../../../@types/krowd/project';
//
import { useSelector } from 'react-redux';
import { PATH_DASHBOARD } from 'routes/paths';
import { dispatch, RootState } from 'redux/store';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import { REACT_APP_API_URL } from 'config';
import axios from 'axios';
import { UploadAvatar, UploadPhoto } from 'components/upload';
import { fDateTimeSuffix } from 'utils/formatTime';
import { UploadAPI } from '_apis_/krowd_apis/upload';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type ProjectEntityNewFormProps = {
  isEdit: boolean;
  currentField?: NewProjectEntityFormValues;
};
type PressDetailProps = {
  project: Project;
  closeDialog: () => void;
  //   album: string[];
};
export default function EntityPress({ project: p, closeDialog }: PressDetailProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const [value, setValue] = useState<Date | null>(new Date(Date.now()));
  const [valueEndDate, setValueEndDate] = useState<Date | null>(new Date(''));
  const [valueMaxDate, setMaxDate] = useState<Date | null>(new Date('2030-12-31 12:00:00'));
  const [date, setDateExpress] = useState('');
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
    setFieldValue('datePublic', fDateTimeSuffix(newValue!));
  };

  const NewProjectSchema = Yup.object().shape({
    projectId: Yup.string().required('Yêu cầu nhập dự án')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }

  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const formik = useFormik({
    initialValues: {
      projectId: p.id,
      type: 'PRESS',
      title: '',
      link: '',
      content: '',
      newspaperName: '',
      datePublic: '',
      newsLink: ''
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        await UploadAPI.postPress({
          id: p.id,
          file: fileUpload,
          title: values.title,
          newspaperName: values.newspaperName,
          datePublic: values.datePublic,
          newsLink: values.newsLink,
          content: values.content
        })
          .then(() => {
            enqueueSnackbar('Tạo mới thành công', {
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
            setSubmitting(true);
            dispatch(getProjectId(p?.id));
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  // const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
  //   formik;
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('link', {
          ...file,
          preview: URL.createObjectURL(file)
        });
        setFileUpload(file);
      }
    },
    [setFieldValue]
  );

  return (
    <>
      <FormikProvider value={formik}>
        <Form
          style={{ width: '550px', height: '730px' }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3} sx={{ p: 3 }}>
            <LabelStyle>Bài viết liên quan</LabelStyle>

            <TextField
              sx={{ legend: { span: { mt: 1 } }, mx: 3, my: 3 }}
              label="Tên bài viết"
              fullWidth
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              variant="outlined"
            />

            <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              multiline
              minRows={5}
              label="Nội dung bài viết"
              {...getFieldProps('content')}
              error={Boolean(touched.content && errors.content)}
              helperText={touched.content && errors.content}
            />
            <Typography variant="h6">Nguồn trang:</Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên tờ báo"
                {...getFieldProps('newspaperName')}
                error={Boolean(touched.newspaperName && errors.newspaperName)}
                helperText={touched.newspaperName && errors.newspaperName}
              />
              <TextField
                sx={{ mx: 3, my: 3 }}
                fullWidth
                label="Đường dẫn"
                {...getFieldProps('newsLink')}
                error={Boolean(touched.newsLink && errors.newsLink)}
                helperText={touched.newsLink && errors.newsLink}
              />
              <DatePicker
                label="Ngày đăng"
                inputFormat="dd/MM/yyyy"
                value={value}
                // minDate={valueMin!}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />{' '}
            </Stack>
            <Typography variant="h6">Ảnh bìa:</Typography>
            <UploadPhoto
              sx={{ mx: 5, my: 3, width: '500px', height: '300px' }}
              accept="image/*"
              file={values.link}
              maxSize={3145728}
              onDrop={handleDrop}
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3, mb: 2, p: 2 }}>
            <Button
              color="error"
              variant="contained"
              size="large"
              onClick={closeDialog}
              sx={{ mr: 1.5 }}
            >
              Đóng
            </Button>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              Tạo mới
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>

      {/* <BlogNewPostPreview
        formik={formik}
        isOpenPreview={open}
        onClosePreview={handleClosePreview}
      /> */}
    </>
  );
}
