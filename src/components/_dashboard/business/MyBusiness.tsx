import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  Box,
  Grid,
  Card,
  Stack,
  Switch,
  TextField,
  FormControlLabel,
  Typography,
  FormHelperText
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
// utils
// @types
//
import { dispatch, RootState, useSelector } from 'redux/store';
import MyAvatar from 'components/MyAvatar';
import { Business } from '../../../@types/krowd/business';

// ----------------------------------------------------------------------

type MyBusinessProps = {
  business: Business;
};
export default function MyBusiness({ business }: MyBusinessProps) {
  const { id, name, phoneNum, image, description, taxIdentificationNumber, address, email } =
    business;
  return (
    // <FormikProvider value={formik}>
    //   <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        md={4}
        sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <MyAvatar sx={{ width: 200, height: 200, fontSize: 100 }} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={{ xs: 2, md: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField fullWidth disabled label="Họ và tên" value={`${name}`} />
              <TextField fullWidth disabled label="Email" value={email} />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField fullWidth disabled label="Số điện thoại" value={phoneNum} />
              <TextField fullWidth disabled label="Địa chỉ" value={address} />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField fullWidth disabled label="Mô tả" value={description} />
              <TextField
                fullWidth
                disabled
                label="Mã doanh nghiệp"
                value={taxIdentificationNumber}
              />
              {/* <TextField fullWidth disabled label="Vai trò" value={role.name} /> */}
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </Grid>
    //   </Form>
    // </FormikProvider>
  );
}
