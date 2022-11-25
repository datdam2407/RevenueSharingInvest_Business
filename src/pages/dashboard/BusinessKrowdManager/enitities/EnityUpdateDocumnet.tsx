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
  Autocomplete,
  Input
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
import { getProjectEntityID } from 'redux/slices/krowd_slices/projectEnity';

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
type DocumentDetailProps = {
  project: Project;
  closeDialog: () => void;
  //   album: string[];
};
export default function EnityUpdateDocumnet({ project: p, closeDialog }: DocumentDetailProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  //   useEffect(() => {
  //     dispatch(getProjectEntityID(projectEntityDetail?.id ?? ''));
  //   });
  const { projectEntityDetail } = useSelector((state: RootState) => state.projectEntity);

  const handleOpenPreview = () => {};

  const NewProjectSchema = Yup.object().shape({
    projectId: Yup.string().required('Yêu cầu nhập dự án'),
    title: Yup.string().required('Yêu cầu nhập tên'),
    description: Yup.string().required('Yêu cầu nhập mô tả'),
    link: Yup.string().required('Yêu cầu nhập đường dẫn')
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
      type: 'DOCUMENT',
      title: projectEntityDetail?.title ?? '',
      link: projectEntityDetail?.link ?? '',
      content: projectEntityDetail?.content ?? '',
      description: projectEntityDetail?.description ?? ''
    },
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        await axios
          .put(REACT_APP_API_URL + `/project_entities/${projectEntityDetail?.id}`, values, {
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
            setSubmitting(true);
            dispatch(getProjectId(p?.id));
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
        <Form
          style={{ width: '700px', height: '420px' }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3} sx={{ p: 3 }}>
            <LabelStyle>Tài liệu</LabelStyle>

            <TextField
              sx={{ legend: { span: { mt: 1 } }, mx: 3, my: 3 }}
              label="Tên"
              fullWidth
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              variant="outlined"
            />
            <Input type={'file'} sx={{ mx: 3, my: 3 }} fullWidth {...getFieldProps('link')} />
            <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="Mô tả thông tin"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3 }}>
            <Button
              fullWidth
              type="button"
              color="inherit"
              variant="outlined"
              size="large"
              onClick={closeDialog}
              sx={{ mr: 1.5 }}
            >
              Hủy
            </Button>
            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              Lưu
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
