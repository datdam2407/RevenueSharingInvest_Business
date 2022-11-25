import * as Yup from 'yup';
import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  FormHelperText,
  Autocomplete
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
import { QuillEditor } from 'components/editor';
import axios from 'axios';
import { REACT_APP_API_URL } from 'config';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type EntityPitchDetailProps = {
  project: Project;
  closeDialog: () => void;
};
export default function EntityPitch({ project: p, closeDialog }: EntityPitchDetailProps) {
  const { enqueueSnackbar } = useSnackbar();

  const NewProjectSchema = Yup.object().shape({
    projectId: Yup.string().required('Yêu cầu nhập dự án'),
    type: Yup.string().required('Yêu cầu nhập thể loại'),
    title: Yup.string().required('Yêu cầu nhập tên'),
    content: Yup.string().min(10).required('Yêu cầu nhập nội dung chi tiết tối thiểu 10 ký tự')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }

  function getHeaderFormData() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const formik = useFormik<NewProjectEntityFormValues>({
    initialValues: {
      projectId: p.id,
      type: 'PITCH',
      title: '',
      link: '',
      content: '',
      description: ''
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();

        await axios
          .post(REACT_APP_API_URL + '/project_entities', values, { headers: headers })
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
            closeDialog();
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <LabelStyle>Tiêu diểm</LabelStyle>

            <TextField
              sx={{ legend: { span: { mt: 1 } } }}
              label="Tên"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              variant="outlined"
            />
          </Stack>
          <div>
            <LabelStyle sx={{ py: 4, p: 3 }}>Mô tả thông tin</LabelStyle>
            <QuillEditor
              sx={{ mx: 3 }}
              id="pitch-content"
              value={values.content}
              onChange={(val) => setFieldValue('content', val)}
              error={Boolean(touched.content && errors.content)}
            />
            {touched.content && errors.content && (
              <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                {touched.content && errors.content}
              </FormHelperText>
            )}
          </div>

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, mx: 3, my: 3 }}>
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
    </>
  );
}
