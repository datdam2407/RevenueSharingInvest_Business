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
import {
  NewProjectEntityFormValues,
  Project,
  ProjectEntityFormValues,
  UpdateProjectEntityFormValues
} from '../../../../@types/krowd/project';
//
import { useSelector } from 'react-redux';
import { PATH_DASHBOARD } from 'routes/paths';
import { dispatch, RootState } from 'redux/store';
import project, { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
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
type ExtensionDetailProps = {
  //   album: string[];
  project: Project;
  currentField?: ProjectEntityFormValues;
  closeDialog: () => void;
};

// type ExtensionDetailProps = {
//   title: string;
//   content: string | null;
//   link: string | null;
//   description: string | null;
// };
// type ExtensionListProps = {
//   extensions: ExtensionDetailProps[];
//   project: Project;
// };
// export default function ProjectEntitytForm({ isEdit, currentField }: ProjectEntityNewFormProps) {
export default function EntityExtensionUpdate({ project: p, closeDialog }: ExtensionDetailProps) {
  const { projectEntityDetail } = useSelector((state: RootState) => state.projectEntity);
  const { enqueueSnackbar } = useSnackbar();

  function getToken() {
    return window.localStorage.getItem('accessToken');
  }

  function getHeaderFormData() {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }
  const NewProjectSchema = Yup.object().shape({
    projectId: Yup.string().required('Yêu cầu nhập dự án'),
    title: Yup.string().required('Yêu cầu nhập tên'),
    description: Yup.string().required('Yêu cầu nhập mô tả')
  });
  const formik = useFormik<UpdateProjectEntityFormValues>({
    initialValues: {
      type: 'EXTENSION',
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
            dispatch(getProjectEntityID(projectEntityDetail?.id ?? ''));
            closeDialog();
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
      // } else {
      //   try {
      //     const headers = getHeaderFormData();
      //     await axios
      //       .post(REACT_APP_API_URL + '/project_entities', values, { headers: headers })
      //       .then(() => {
      //         enqueueSnackbar('Tạo mới thành công', {
      //           variant: 'success'
      //         });
      //       })
      //       .catch(() => {
      //         enqueueSnackbar('Cập nhật thất bại', {
      //           variant: 'error'
      //         });
      //       })
      //       .finally(() => {
      //         resetForm();
      //         setSubmitting(true);
      //         dispatch(getMyProject());
      //       });
      //   } catch (error) {
      //     console.error(error);
      //     setSubmitting(false);
      //   }
      // }
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
            <LabelStyle>Mở rộng</LabelStyle>

            <TextField
              sx={{ legend: { span: { mt: 1 } }, mx: 3, my: 3 }}
              label="Tên"
              fullWidth
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              variant="outlined"
            />
            <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="Mô tả thông tin"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
            <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="Nội dung"
              {...getFieldProps('content')}
              error={Boolean(touched.content && errors.content)}
              helperText={touched.content && errors.content}
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3, mb: 3 }}>
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
              Cập nhật
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
