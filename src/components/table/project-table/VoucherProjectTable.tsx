import { Icon } from '@iconify/react';
import useAuth from 'hooks/useAuth';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  TextField,
  Autocomplete,
  DialogActions,
  Stack,
  Button,
  Box
} from '@mui/material';
import plusFill from '@iconify/icons-eva/plus-fill';

import { useEffect, useState } from 'react';
import { getAllVoucher } from 'redux/slices/krowd_slices/project';
import { dispatch, RootState, useSelector } from 'redux/store';
import { PATH_DASHBOARD } from 'routes/paths';
import { DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import { UserAPI } from '_apis_/krowd_apis/user';
import { ProjectAPI } from '_apis_/krowd_apis/project';
const STATUS = 'ACTIVE';

const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'name', label: 'GÓI KHUYẾN MÃI', align: 'left' },
  { id: 'createDate', label: 'NGÀY TẠO', align: 'left' },
  { id: 'status', label: 'TRẠNG THÁI', align: 'left' },
  { id: '', label: 'THAO TÁC', align: 'center' }
];

export default function VoucherProjectTable() {
  const { voucherProject } = useSelector((state: RootState) => state.project);
  const { listOfVoucher: list, isLoadingVoucher } = voucherProject;
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getAllVoucher());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      projectId: '',
      name: '',
      code: '',
      quantity: '',
      description: ''
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        const { projectId, name, code, quantity, description } = values;
        await ProjectAPI.postVoucher({
          projectId: projectId,
          name: name,
          code: code,
          quantity: quantity,
          description: description
        })
          .then(() => {
            enqueueSnackbar('Tạo mới gói khuyến mãi thành công', {
              variant: 'success'
            });
            dispatch(getAllVoucher());
          })
          .catch(() => {
            enqueueSnackbar('Tạo mới thất bại', {
              variant: 'error'
            });
          })
          .finally(() => {
            resetForm();
            handleClose();
          });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    resetForm,
    getFieldProps
  } = formik;

  const getData = (): RowData[] => {
    if (!list) return [];
    return list
      .filter((_item) => _item.status === STATUS)
      .map<RowData>((_item, _idx) => {
        return {
          id: _item.id,
          items: [
            {
              name: 'idx',
              value: _idx + 1,
              type: DATA_TYPE.NUMBER
            },
            {
              name: 'id',
              value: _item.id,
              type: DATA_TYPE.TEXT
            },
            {
              name: 'name',
              value: _item.name,
              type: DATA_TYPE.TEXT
            },

            {
              name: 'createDate',
              value: _item.createDate,
              type: DATA_TYPE.TEXT
            },
            {
              name: 'status',
              value: _item.status,
              type: DATA_TYPE.TEXT
            }
          ]
        };
      });
  };

  return (
    <KrowdTable
      headingTitle="Danh sách các gói khuyến mãi của dự án"
      action={
        <Box>
          <Button
            startIcon={<Icon icon={plusFill} width={16} height={16} />}
            onClick={handleClickOpen}
            size="medium"
            variant="contained"
          >
            Tạo mới gói khuyến mãi
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>Gói khuyến mãi</DialogTitle>
                <DialogContent>
                  <Box my={3}>
                    <DialogContentText>
                      Điền thông tin gói khuyến mãi bạn muốn tạo.
                    </DialogContentText>
                  </Box>
                  <Stack spacing={{ xs: 2, md: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <TextField fullWidth label="Tên voucher" {...getFieldProps('name')} />
                      <TextField fullWidth label="Mã khuyến mãi" {...getFieldProps('code')} />
                    </Stack>
                    <TextField fullWidth label="Số lượng voucher" {...getFieldProps('quantity')} />
                    <TextField
                      multiline
                      minRows={5}
                      fullWidth
                      label="Mô tả"
                      {...getFieldProps('description')}
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="error" onClick={handleClose}>
                    Đóng
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Tạo mới gói khuyến mãi
                  </LoadingButton>
                </DialogActions>
              </Form>
            </FormikProvider>
          </Dialog>
        </Box>
      }
      header={TABLE_HEAD}
      getData={getData}
      isLoading={isLoadingVoucher}
      viewPath={PATH_DASHBOARD.projects.projectDetails}
    />
  );
}
