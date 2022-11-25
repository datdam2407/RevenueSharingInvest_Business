import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Box, Grid, Card, Stack, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks

// utils
// @types
import { User } from '../../../../@types/account';
//
import { dispatch } from 'redux/store';
import { UserKrowd } from '../../../../@types/krowd/users';
import { getMainUserProfile } from 'redux/slices/krowd_slices/users';
import { UploadAPI } from '_apis_/krowd_apis/upload';
import { UploadAvatar, UploadPhoto } from 'components/upload';
import { Project } from '../../../../@types/krowd/project';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';

// ----------------------------------------------------------------------

interface InitialState extends Omit<User, 'password' | 'id' | 'role'> {
  afterSubmit?: string;
}
type AccountGeneralProps = {
  project: Project;
  closeDialog: () => void;
};
export default function UploadAlbum({ project: p, closeDialog }: AccountGeneralProps) {
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const formikImage = useFormik({
    enableReinitialize: true,
    initialValues: {
      photoURL: ''
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        setSubmitting(true);
        await UploadAPI.postAlbum({ id: p.id, file: fileUpload })
          .then(() => {
            enqueueSnackbar('Cập nhật ảnh thành công', {
              variant: 'success'
            });
            closeDialog();
            dispatch(getProjectId(p?.id));
          })
          .catch(() => {
            enqueueSnackbar('Cập nhật ảnh thất bại', {
              variant: 'error'
            });
            setFileUpload(null);
            setFieldValueImage('photoURL', null);
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const {
    errors: errorsImage,
    values: valuesImage,
    touched: touchedImage,
    handleSubmit: handleSubmitImage,
    isSubmitting: isSubmittingImage,
    setFieldValue: setFieldValueImage,
    getFieldProps: getFieldPropsImage
  } = formikImage;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValueImage('photoURL', {
          ...file,
          preview: URL.createObjectURL(file)
        });
        setFileUpload(file);
      }
    },
    [setFieldValueImage]
  );
  return (
    <FormikProvider value={formikImage}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmitImage}>
        <UploadPhoto
          sx={{ mx: 5, my: 3 }}
          accept="image/*"
          file={valuesImage.photoURL}
          maxSize={3145728}
          onDrop={handleDrop}
          error={Boolean(touchedImage.photoURL && errorsImage.photoURL)}
        />
        <Box>
          {!fileUpload && (
            <Button
              sx={{ my: 3, mx: 5, width: 500 }}
              color="error"
              fullWidth
              variant="contained"
              onClick={closeDialog}
            >
              Hủy
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 5 }}>
          <Box>
            {fileUpload && (
              <Button sx={{ my: 3, mx: 3 }} color="error" variant="contained" onClick={closeDialog}>
                Đóng
              </Button>
            )}
          </Box>

          <Box>
            {fileUpload && (
              <Box display="flex" my={3} justifyContent="space-evenly">
                <LoadingButton
                  color="warning"
                  type="submit"
                  variant="contained"
                  loading={isSubmittingImage}
                >
                  Lưu ảnh vào album
                </LoadingButton>
              </Box>
            )}
          </Box>
        </Box>
      </Form>
    </FormikProvider>
  );
}
