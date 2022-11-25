import * as Yup from 'yup';
import React, { ChangeEvent } from 'react';
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
  Dialog
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
import axios from 'axios';
import { REACT_APP_API_URL } from 'config';
import _default from '@mui/utils/elementTypeAcceptingRef';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type ProjectEntityNewFormProps = {
  isEdit: boolean;
  currentField?: NewProjectEntityFormValues;
};

type ProjectDetailCardProps = {
  project: Project;
  //   album: string[];
  closeDialog: () => void;
};
export default function EntityHighLightUpdate({ project: p, closeDialog }: ProjectDetailCardProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { projectEntityDetail } = useSelector((state: RootState) => state.projectEntity);
  const [content, setContent] = useState('');

  const [inputList, setInputList] = useState(
    projectEntityDetail?.content
      ? projectEntityDetail?.content.split('</li><li>').map((_e, i, a) => {
          if (i === 0) {
            return { content: _e.replace('<ul><li>', '') };
          } else if (i === a.length - 1) {
            return { content: _e.replace('</li></ul>', '') };
          } else {
            return { content: _e };
          }
        })
      : [{ content: '' }]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.target;
    const list = [...inputList];
    list[index].content = value;
    setInputList(list);
    setContent(
      `<ul>${inputList.map((_value) => `<li>${_value.content}</li>`)}</ul>`
        .split('</li>,<li>')
        .join('</li><li>')
    );
    setFieldValue('content', content);
  };
  const handleRemoveClick = (index: number) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { content: '' }]);
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
  const formik = useFormik<NewProjectEntityFormValues>({
    initialValues: {
      projectId: p.id,
      type: 'HIGHLIGHT',
      title: 'List',
      link: projectEntityDetail?.link ?? '',
      content: projectEntityDetail?.content ?? '',
      description: projectEntityDetail?.description ?? ''
    },
    enableReinitialize: true,
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        await axios({
          method: 'put',
          url: REACT_APP_API_URL + `/project_entities/${projectEntityDetail?.id}`,
          data: {
            title: 'List',
            content: content,
            type: 'HIGHLIGHT'
          },
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
        <Typography sx={{ textAlign: 'center', fontWeight: '700', mt: 3 }} variant="body1">
          Cập nhật nổi bật cho dự án của bạn
        </Typography>
        <Form
          style={{ width: '1000px', height: '1500px' }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {inputList.map((x, i) => (
            <>
              <TextField
                label={`Nổi bật về dự án ${i + 1}`}
                multiline
                minRows={2}
                variant="outlined"
                value={x.content}
                onChange={(e) => handleInputChange(e, i)}
                error={Boolean(touched.content && errors.content)}
                helperText={touched.content && errors.content}
                sx={{ mx: 3, my: 3, width: '950px' }}
              />
              <Box sx={{ textAlign: 'right' }}>
                {inputList.length !== 1 && (
                  <Button className="mr10" onClick={() => handleRemoveClick(i)}>
                    Xóa
                  </Button>
                )}
                {inputList.length - 1 === i && (
                  <Button onClick={handleAddClick}>Thêm nổi bật</Button>
                )}
              </Box>
            </>
          ))}
          <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3, my: 3 }}>
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
    </>
  );
}
