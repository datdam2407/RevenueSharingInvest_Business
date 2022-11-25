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
import { UploadPhoto } from 'components/upload';

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
type PressUpdateLinkDetailProps = {
  project: Project;
  currentField?: ProjectEntityFormValues;
  closeDialog: () => void;
};

export default function EntityPressUpdate({ project: p, closeDialog }: PressUpdateLinkDetailProps) {
  const { projectEntityDetail } = useSelector((state: RootState) => state.projectEntity);
  const { enqueueSnackbar } = useSnackbar();
  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const part = projectEntityDetail?.description?.split('\\gg20p');
  // if (!part) {
  //   retrun;
  // }
  // if (!part) return;
  // const newspaperName = part[0];
  // const publicDate = part[1].substring(0, 10).trim();
  // const newLink = part[2];

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
    title: Yup.string().required('Yêu cầu nhập tên truyền thông')
  });

  const formik = useFormik({
    initialValues: {
      type: 'PRESS',
      title: projectEntityDetail?.title ?? '',
      link: projectEntityDetail?.link ?? '',
      content: projectEntityDetail?.content ?? '',
      // description: projectEntityDetail?.description.split('\\gg20p') ?? '',
      newspaperName: projectEntityDetail?.description.split('\\gg20')[0] ?? '',
      datePublic:
        projectEntityDetail?.description.split('\\gg20')[1].toString().substring(0, 10) ?? '',
      newsLink: projectEntityDetail?.description.split('\\gg20')[2] ?? ''
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
    }
  });

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
          style={{ width: '700px', height: '920px' }}
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
              {/* <TextField
                sx={{ mx: 3, my: 3 }}
                disabled
                fullWidth
                {...getFieldProps('datePublic')}
                error={Boolean(touched.datePublic && errors.datePublic)}
                helperText={touched.datePublic && errors.datePublic}
              /> */}
              {/* <DatePicker
                label="Ngày đăng"
                inputFormat="dd/MM/yyyy"
                value={value}
                // minDate={valueMin!}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />{' '} */}
            </Stack>
            <Typography variant="h6">Ảnh bìa:</Typography>
            <UploadPhoto
              sx={{ mx: 5, my: 3, width: '650px', height: '300px' }}
              accept="image/*"
              file={values.link}
              maxSize={3145728}
              onDrop={handleDrop}
            />
          </Stack>
          <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3 }}>
            <Button
              color="error"
              variant="contained"
              size="large"
              onClick={closeDialog}
              sx={{ mr: 1.5, mb: 3 }}
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
