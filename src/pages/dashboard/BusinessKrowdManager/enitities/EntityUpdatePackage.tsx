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
  Box
} from '@mui/material';
// utils
import { useNavigate } from 'react-router-dom';
// @types
import {
  newPackageFormValues,
  NewProjectEntityFormValues,
  Project
} from '../../../../@types/krowd/project';
//
import { useSelector } from 'react-redux';
import { PATH_DASHBOARD } from 'routes/paths';
import { dispatch, RootState } from 'redux/store';
import { getMyProject } from 'redux/slices/krowd_slices/project';
import { REACT_APP_API_URL } from 'config';
import axios from 'axios';
import { getProjectPackage } from 'redux/slices/krowd_slices/projectEnity';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type PackageDetailProps = {
  project: Project;
  //   album: string[];
  closeDialog: () => void;
};
export default function EntityUpdatePackage({ project: p, closeDialog }: PackageDetailProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { projectPackageDetails } = useSelector((state: RootState) => state.projectEntity);
  const [content, setContent] = useState('');
  const [inputList, setInputList] = useState(
    projectPackageDetails?.descriptionList.map((_e) => {
      return { description: _e };
    }) ?? [{ description: '' }]
  );
  const NewPackageSchema = Yup.object().shape({
    projectId: Yup.string().required('Yêu cầu nhập dự án'),
    name: Yup.string().required('Yêu cầu nhập tên'),
    price: Yup.string().required('Yêu cầu nhập giá'),
    quantity: Yup.string().required('Yêu cầu nhập số lượng')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.target;
    const list = [...inputList];
    list[index].description = value;
    setInputList(list);
    setContent(
      `${inputList.map((_value) => `${_value.description}\\li`)}`
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
        .replace('\\li,', '\\li')
    );

    setFieldValue('descriptionList', `${content}`);
  };
  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { description: '' }]);
  };
  function getHeaderFormData() {
    const token = getToken();
    return { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` };
  }

  const formik = useFormik<newPackageFormValues>({
    initialValues: {
      projectId: p.id,
      name: projectPackageDetails?.name ?? '',
      price: projectPackageDetails?.price ?? 0,
      image: '',
      quantity: projectPackageDetails?.quantity ?? 0,
      descriptionList: projectPackageDetails?.descriptionList ?? []
    },
    validationSchema: NewPackageSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        const formData = new FormData();
        formData.append('projectId', p.id);
        formData.append('name', values.name);
        formData.append('price', `${values.price}`);
        formData.append('quantity', `${values.quantity}`);
        formData.append('description', content);
        await axios({
          method: 'put',
          url: REACT_APP_API_URL + `/packages/${projectPackageDetails?.id}`,
          data: formData,
          headers: headers
        })
          .then(() => {
            enqueueSnackbar('Cập nhật thành công', {
              variant: 'success'
            });
            setSubmitting(true);
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật thất bại', {
              variant: 'error'
            });
          })
          .finally(() => {
            resetForm();
            setSubmitting(true);
            dispatch(getProjectPackage(p.id));
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
          style={{ width: '1000px', height: '610px' }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3} sx={{ p: 3 }}>
            <LabelStyle>Cập nhật thông tin gói dự án {p.name}</LabelStyle>

            <TextField
              sx={{ legend: { span: { mt: 1 } }, mx: 3, my: 3 }}
              label="Tên"
              {...getFieldProps('name')}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
              variant="outlined"
            />
            <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="Giá"
              {...getFieldProps('price')}
              error={Boolean(touched.price && errors.price)}
              helperText={touched.price && errors.price}
            />
            <TextField
              sx={{ mx: 3, my: 3 }}
              fullWidth
              label="Số lượng"
              {...getFieldProps('quantity')}
              error={Boolean(touched.quantity && errors.quantity)}
              helperText={touched.quantity && errors.quantity}
            />
            {inputList.map((x, i) => (
              <>
                <TextField
                  label={`Mô tả ${i + 1}`}
                  multiline
                  fullWidth
                  minRows={2}
                  variant="outlined"
                  value={x.description}
                  onChange={(e) => handleInputChange(e, i)}
                  sx={{ mx: 3, my: 3, width: '950px' }}
                />
                <Box sx={{ display: 'flex', alignContent: 'flex-end' }}>
                  {inputList.length !== 1 && (
                    <Button className="mr10" onClick={() => handleRemoveClick(i)}>
                      Xóa
                    </Button>
                  )}
                  {inputList.length - 1 === i && (
                    <Button onClick={handleAddClick}>Thêm mới mô tả</Button>
                  )}
                </Box>
              </>
            ))}
          </Stack>

          {/* {inputList &&
            inputList.map((x, i) => (
              <>
                <TextField
                  label={`Mô tả ${i + 1}`}
                  multiline
                  fullWidth
                  minRows={2}
                  variant="outlined"
                  value={x.description}
                  onChange={(e) => handleInputChange(e, i)}
                  error={Boolean(touched.descriptionList && errors.descriptionList)}
                  helperText={touched.descriptionList && errors.descriptionList}
                  sx={{ mx: 3, my: 3, width: '950px' }}
                />
                <Box sx={{ textAlign: 'right' }}>
                  {inputList.length !== 1 && (
                    <Button className="mr10" onClick={() => handleRemoveClick(i)}>
                      Xóa đặc quyền
                    </Button>
                  )}
                  {inputList.length - 1 === i && (
                    <Button onClick={handleAddClick}>Thêm đặc quyền</Button>
                  )}
                </Box>
              </>
            ))} */}

          <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3, my: 3, pb: 3 }}>
            <Button
              color="error"
              variant="contained"
              size="large"
              onClick={closeDialog}
              sx={{ mr: 1.5 }}
            >
              Đóng
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              onClick={closeDialog}
            >
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
