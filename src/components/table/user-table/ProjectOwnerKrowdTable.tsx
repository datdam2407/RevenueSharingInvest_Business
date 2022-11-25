import { ROLE_USER_TYPE } from '../../../@types/krowd/users';
import { useEffect, useState } from 'react';
import {
  getMainUserProfile,
  getProjectManagerList,
  getUserKrowdList
} from 'redux/slices/krowd_slices/users';
import { dispatch, RootState, useSelector } from 'redux/store';
import { DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import useAuth from 'hooks/useAuth';
import { Form, FormikProvider, useFormik } from 'formik';
import { BusinessAPI } from '_apis_/krowd_apis/business';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
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
  Button
} from '@mui/material';
import { Box } from '@mui/system';
import plusFill from '@iconify/icons-eva/plus-fill';
import { UserAPI } from '_apis_/krowd_apis/user';
import { firstName } from 'utils/mock-data/name';
import axios from 'axios';
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'center' },
  { id: 'image', label: 'HÌNH ẢNH', align: 'left' },
  { id: 'fullName', label: 'HỌ VÀ TÊN', align: 'left' },
  { id: 'phoneNum', label: 'SỐ ĐIỆN THOẠI', align: 'left' },
  { id: 'email', label: 'EMAIL', align: 'left' },
  // { id: 'createDate', label: 'NGÀY TẠO', align: 'left' },
  { id: 'status', label: 'TRẠNG THÁI', align: 'left' },
  { id: '', label: '', align: 'center' }
];

export default function ProjectOwnerKrowdTable() {
  const { user: authUser } = useAuth();
  const { userKrowdListState } = useSelector((state: RootState) => state.userKrowd);
  const { userLists, isLoading } = userKrowdListState;
  const { mainUserState } = useSelector((state: RootState) => state.userKrowd);
  const { user: mainUser, error } = mainUserState;
  const { listOfUser: list, numOfUser } = userLists;
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    dispatch(getMainUserProfile(authUser?.id));
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const NewPMSchema = Yup.object().shape({
    firstName: Yup.string().required('Yêu cầu nhập họ'),
    lastName: Yup.string().required('Yêu cầu nhập tên'),
    email: Yup.string().required('Yêu cầu nhập email').email('Email của bạn chưa hợp lệ')
  });
  function getToken() {
    return window.localStorage.getItem('accessToken');
  }

  function getHeader() {
    const token = getToken();
    return { Authorization: `Bearer ${token}` };
  }
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      businessId: mainUser?.business.id
    },
    enableReinitialize: true,
    validationSchema: NewPMSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const headers = getHeader();
        setSubmitting(true);
        await axios
          .post(
            `https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/v1.0/users`,
            values,
            { headers: headers }
          )
          .then(() => {
            enqueueSnackbar('Tạo mới thành công', {
              variant: 'success'
            });
            dispatch(getUserKrowdList(authUser?.businessId, ROLE_USER_TYPE.PROJECT_MANAGER));
            handleClose();
            resetForm();
          })
          .catch(() => {
            enqueueSnackbar('Tạo mới thất bại', {
              variant: 'error'
            });
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

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState('');
  useEffect(() => {
    dispatch(getProjectManagerList(pageIndex, 5, '', '', status));
  }, [dispatch, pageIndex, status]);

  const getData = (): RowData[] => {
    if (!list) return [];
    return list.map<RowData>((_item, _idx) => {
      return {
        id: _item.id,
        items: [
          {
            name: 'idx',
            value: _idx + 1,
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'image',
            value: _item.image,
            type: DATA_TYPE.IMAGE
          },
          {
            name: 'fullname',
            value: `${_item.firstName} ${_item.lastName}`,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'phoneNum',
            value: _item.phoneNum,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'email',
            value: _item.email,
            type: DATA_TYPE.TEXT
          },
          // {
          //   name: 'createDate',
          //   value: _item.createDate,
          //   type: DATA_TYPE.DATE
          // },

          {
            name: 'status',
            value:
              (_item.status === 'ACTIVE' && 'Đang hoạt động') ||
              (_item.status === 'INACTIVE' && 'Chưa hoạt động'),
            type: DATA_TYPE.TEXT,
            textColor:
              _item.status === 'ACTIVE'
                ? 'green'
                : 'green' || _item.status === 'INACTIVE'
                ? 'black'
                : 'green'
          }
        ]
      };
    });
  };

  return (
    <KrowdTable
      headingTitle="Danh sách chủ dự án"
      action={
        <Box>
          <Button
            startIcon={<Icon icon={plusFill} width={16} height={16} />}
            onClick={handleClickOpen}
            size="medium"
            variant="contained"
          >
            Tạo mới chủ dự án
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>Tạo mới chủ dự án</DialogTitle>
                <DialogContent>
                  <Box my={3}>
                    <DialogContentText>Điền thông tin chủ dự án của bạn.</DialogContentText>
                  </Box>
                  <Stack spacing={{ xs: 2, md: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label="Họ"
                        {...getFieldProps('firstName')}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                      <TextField
                        fullWidth
                        label="Tên"
                        {...getFieldProps('lastName')}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Stack>
                    <TextField
                      fullWidth
                      label="Email"
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Đóng</Button>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Lưu
                  </LoadingButton>
                </DialogActions>
              </Form>
            </FormikProvider>
          </Dialog>
        </Box>
      }
      header={TABLE_HEAD}
      getData={getData}
      isLoading={isLoading}
      paging={{
        pageIndex,
        pageSize: pageSize,
        numberSize: numOfUser,

        handleNext() {
          setPageIndex(pageIndex + 1);
          setPageSize(pageSize + 8);
        },
        handlePrevious() {
          setPageIndex(pageIndex - 1);
          setPageSize(pageSize - 8);
        }
      }}
    />
  );
}
