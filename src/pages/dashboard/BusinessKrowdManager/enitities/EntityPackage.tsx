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
  Box,
  RadioGroup,
  FormControlLabel,
  Radio
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
export default function EntityPackage({ project: p, closeDialog }: PackageDetailProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [content, setContent] = useState('');
  const [inputList, setInputList] = useState([{ descriptionList: '' }]);

  const NewPackageSchema = Yup.object().shape({
    name: Yup.string().required('Yêu cầu nhập tên gói'),
    price: Yup.number().required('Yêu cầu nhập giá').max(100000000, 'Không quá 100,000,000 VND'),
    quantity: Yup.number().required('Yêu cầu nhập số lượng').max(10000, 'Không quá 10000 gói')
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
    list[index].descriptionList = value;
    setInputList(list);
    setContent(
      `${inputList.map((_value) => `${_value.descriptionList}\\li`)}`.split('\\li,').join('\\li')
    );

    setFieldValue('description', `${content}`);
  };
  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { descriptionList: '' }]);
  };
  function getHeaderFormData() {
    const token = getToken();
    return { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` };
  }

  const formik = useFormik<newPackageFormValues>({
    initialValues: {
      projectId: p.id,
      name: '',
      price: 1000,
      image: '',
      quantity: 1,
      descriptionList: []
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
          method: 'post',
          url: REACT_APP_API_URL + `/packages`,
          data: formData,
          headers: headers
        })
          .then(() => {
            enqueueSnackbar('Tạo mới thành công', {
              variant: 'success'
            });
            resetForm();
            closeDialog();
            setSubmitting(true);
          })
          .catch(() => {
            enqueueSnackbar('Tạo mới gói thất bại kiểm tra lại các thông tin', {
              variant: 'error'
            });
            setSubmitting(false);
          })
          .finally(() => {
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
          style={{ width: '770px', height: '810px' }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3}>
            <LabelStyle sx={{ p: 3 }}>Nhập thông tin gói dự án {p.name}</LabelStyle>
            <Stack>
              <TextField
                required
                sx={{ mx: 3, my: 1 }}
                label="Tên"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
                variant="outlined"
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} sx={{ alignItems: 'center' }}>
              <Box>
                <TextField
                  sx={{ mx: 3, my: 3, pr: 2 }}
                  label="Giá"
                  fullWidth
                  {...getFieldProps('price')}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                />
                <Typography sx={{ px: 3, fontWeight: 500 }}>
                  Có thể lựa chọn các gợi ý dưới đây cho gói của bạn:
                </Typography>
                <RadioGroup row sx={{ my: 2 }} {...getFieldProps('price')}>
                  <FormControlLabel
                    value="500000"
                    control={<Radio />}
                    label="500,000đ"
                    sx={{ pl: 3 }}
                  />
                  <FormControlLabel value="1000000" control={<Radio />} label="1,000,000đ" />
                  <FormControlLabel value="5000000" control={<Radio />} label="5,000,000đ" />
                </RadioGroup>
              </Box>
              <Box>
                <TextField
                  sx={{ mx: 3, my: 3 }}
                  label="Số lượng"
                  required
                  fullWidth
                  {...getFieldProps('quantity')}
                  error={Boolean(touched.quantity && errors.quantity)}
                  helperText={touched.quantity && errors.quantity}
                />{' '}
                {/* <Typography sx={{ px: 3 }}> .{}'</Typography> */}
                <br />
                <br />
                <RadioGroup row sx={{ my: 2 }} {...getFieldProps('quantity')}>
                  <FormControlLabel value="10" control={<Radio />} label="10 Gói" sx={{ pl: 3 }} />
                  <FormControlLabel value="50" control={<Radio />} label="50 Gói" />
                  <FormControlLabel value="100" control={<Radio />} label="100 Gói" />
                </RadioGroup>
              </Box>
            </Stack>
          </Stack>
          <Stack>
            {inputList.map((x, i) => (
              <>
                <TextField
                  required
                  label={`Mô tả ${i + 1}`}
                  multiline
                  fullWidth
                  minRows={2}
                  variant="outlined"
                  value={x.descriptionList}
                  onChange={(e) => handleInputChange(e, i)}
                  // error={Boolean(touched.descriptionList && errors.descriptionList)}
                  // helperText={touched.descriptionList && errors.descriptionList}
                  sx={{ mx: 3, my: 3, width: '720px' }}
                />
                <Box sx={{ textAlign: 'right' }}>
                  {inputList.length !== 1 && (
                    <Button className="mr10" onClick={() => handleRemoveClick(i)}>
                      Xóa mô tả
                    </Button>
                  )}
                  {inputList.length - 1 === i && (
                    <Button onClick={handleAddClick}>Thêm mới mô tả</Button>
                  )}
                </Box>
              </>
            ))}
            <Typography sx={{ pl: 3, fontWeight: 500, color: '#f4a85d' }}>*Lưu ý:</Typography>

            <Typography sx={{ pl: 3, fontWeight: 500, color: '#f4a85d' }}>
              Bạn vui lòng điền đầy đủ các thông tin cơ bản (Tên gói , Giá, Số lượng và các mô tả).
              <br />
              Bạn sẽ không được chỉnh sửa thông tin các gói này khi dự án đã được đăng lên trang
              chủ.
              <br /> Mọi thông tin của gói sẽ được công khai cho các nhà đầu tư.
            </Typography>
          </Stack>

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
