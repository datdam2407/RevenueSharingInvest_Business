import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useSnackbar } from 'notistack';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Rating, TextField, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import fakeRequest from '../../../../utils/fakeRequest';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadiusMd,
  backgroundColor: theme.palette.background.neutral
}));

// ----------------------------------------------------------------------

type ProductDetailsReviewFormProps = {
  onClose: VoidFunction;
  id?: string;
};

export default function ProductDetailsReviewForm({
  onClose,
  id,
  ...other
}: ProductDetailsReviewFormProps) {
  const { enqueueSnackbar } = useSnackbar();

  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    review: Yup.string().required('Review is required'),
    name: Yup.string().required('Yêu cầu nhập tên'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      rating: null,
      review: '',
      name: '',
      email: ''
    },
    validationSchema: ReviewSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await fakeRequest(500);
      alert(JSON.stringify(values, null, 2));
      onClose();
      resetForm();
      setSubmitting(false);
      enqueueSnackbar('Verify success', { variant: 'success' });
    }
  });

  const { errors, touched, resetForm, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const onCancel = () => {
    onClose();
    resetForm();
  };

  return (
    <RootStyle {...other} id={id}>
      <Typography variant="subtitle1" gutterBottom>
        Add Review
      </Typography>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2" sx={{ mr: 1.5 }}>
              Your review about this product:
            </Typography>
            <Rating
              {...getFieldProps('rating')}
              onChange={(event, value) => setFieldValue('rating', Number(value))}
            />
          </Box>
          {errors.rating && (
            <FormHelperText error>{touched.rating && errors.rating}</FormHelperText>
          )}

          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={5}
            label="Review *"
            {...getFieldProps('review')}
            error={Boolean(touched.review && errors.review)}
            helperText={touched.review && errors.review}
            sx={{ mt: 3 }}
          />

          <TextField
            fullWidth
            label="Name *"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
            sx={{ mt: 3 }}
          />

          <TextField
            fullWidth
            label="Email *"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
            sx={{ mt: 3 }}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              color="inherit"
              variant="outlined"
              onClick={onCancel}
              sx={{ mr: 1.5 }}
            >
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Post review
            </LoadingButton>
          </Box>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}
