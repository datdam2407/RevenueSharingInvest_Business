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
type AboutUpdateLinkDetailProps = {
  project: Project;
  currentField?: ProjectEntityFormValues;
  closeDialog: () => void;
};

export default function EntityAboutUpdate({ project: p, closeDialog }: AboutUpdateLinkDetailProps) {
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
    title: Yup.string().required('Y??u c???u nh???p t??n truy???n th??ng')
  });
  const formik = useFormik<UpdateProjectEntityFormValues>({
    initialValues: {
      type: 'ABOUT',
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
            enqueueSnackbar('C???p nh???t th??nh c??ng', {
              variant: 'success'
            });
          })
          .catch(() => {
            enqueueSnackbar('C???p nh???t th???t b???i', {
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
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form
          style={{ width: '700px', height: '380px' }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3} sx={{ p: 3 }}>
            <LabelStyle>Truy???n th??ng</LabelStyle>
            <Typography sx={{ mb: 2 }}>C???p nh???t th??ng tin truy???n th??ng c???a b???n!</Typography>
            <TextField
              sx={{ legend: { span: { mt: 1 } }, mx: 3, my: 3 }}
              label="T??n"
              fullWidth
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              variant="outlined"
            />
            {/* <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="M?? t??? th??ng tin"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            /> */}
            <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="???????ng d???n"
              {...getFieldProps('link')}
              error={Boolean(touched.link && errors.link)}
              helperText={touched.link && errors.link}
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
              ????ng
            </Button>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              C???p nh???t
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
