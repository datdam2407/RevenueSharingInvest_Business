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
  //   album: string[];\
  closeDialog: () => void;
};

export default function EntityHighLight({ project: p, closeDialog }: ProjectDetailCardProps) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { projectEntityDetail } = useSelector((state: RootState) => state.projectEntity);
  const [inputList, setInputList] = useState([{ content: '' }]);

  const [content, setContent] = useState('');

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
    projectId: Yup.string().required('Y??u c???u nh???p d??? ??n')
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
    validationSchema: NewProjectSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeaderFormData();
        await axios
          .post(REACT_APP_API_URL + '/project_entities', values, { headers: headers })
          .then(() => {
            enqueueSnackbar('T???o m???i th??nh c??ng', {
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
          Th??m n???i b???t cho d??? ??n c???a b???n
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
                label={`N???i b???t v??? d??? ??n ${i + 1}`}
                multiline
                minRows={2}
                variant="outlined"
                value={x.content}
                onChange={(e) => handleInputChange(e, i)}
                error={Boolean(touched.content && errors.content)}
                helperText={touched.content && errors.content}
                sx={{ mx: 3, my: 3, width: '950px' }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {inputList.length !== 1 && (
                  <Button className="mr10" onClick={() => handleRemoveClick(i)}>
                    X??a
                  </Button>
                )}
                {inputList.length - 1 === i && (
                  <Button onClick={handleAddClick}>Th??m n???i b???t</Button>
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
              ????ng
            </Button>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              T???o m???i
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
