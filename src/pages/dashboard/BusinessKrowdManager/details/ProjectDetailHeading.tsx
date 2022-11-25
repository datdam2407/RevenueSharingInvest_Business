import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  Typography
} from '@mui/material';
import { Project, PROJECT_STATUS } from '../../../../@types/krowd/project';
import { MHidden } from 'components/@material-extend';
import { useState } from 'react';
import { styled } from '@mui/system';
import { dispatch } from 'redux/store';
import { useSnackbar } from 'notistack';
import { changeStatusProject } from 'redux/slices/krowd_slices/project';

const StyleStatus = [
  { name: PROJECT_STATUS.DRAFT, bgcolor: '#000000', vn: 'BẢN NHÁP' },

  { name: PROJECT_STATUS.DENIED, bgcolor: 'red', vn: 'BỊ TỪ CHỐI' },
  { name: PROJECT_STATUS.CLOSED, bgcolor: 'red', vn: 'DỰ ÁN ĐÃ ĐÓNG' },
  {
    name: PROJECT_STATUS.WAITING_FOR_APPROVAL,
    bgcolor: '#eacb00',
    vn: 'ĐANG CHỜ DUYỆT'
  },
  {
    name: PROJECT_STATUS.CALLING_FOR_INVESTMENT,
    bgcolor: 'primary.main',
    vn: 'ĐANG KÊU GỌI ĐẦU TƯ'
  },
  {
    name: PROJECT_STATUS.CALLING_TIME_IS_OVER,
    bgcolor: 'red',
    vn: 'DỰ ÁN ĐÃ QUÁ HẠN ĐẦU TƯ'
  },
  {
    name: PROJECT_STATUS.WAITING_TO_ACTIVATE,
    bgcolor: '#4dc0b5',
    vn: 'DỰ ÁN ĐANG CHỜ KÍCH HOẠT'
  },
  {
    name: PROJECT_STATUS.WAITING_TO_PUBLISH,
    bgcolor: '#f66d9b',
    vn: 'DỰ ÁN ĐANG CHỜ CÔNG KHAI'
  },
  { name: PROJECT_STATUS.ACTIVE, bgcolor: 'green', vn: 'KÊU GỌI THÀNH CÔNG' }
];
const ButtonGuide = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '15px'
}));
function ProjectDetailHeading({ p }: { p: Project }) {
  const [openSubmit, setOpenSubmit] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpenSubmit = () => {
    setOpenSubmit(true);
  };
  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };
  const handleSubmitProject = () => {
    dispatch(changeStatusProject(localStorage.getItem('projectId') ?? ''));
    enqueueSnackbar('Cập nhật dự án về Khởi tạo dự án-DRAFT', {
      variant: 'success'
    });
    setOpenSubmit(false);
  };
  return (
    <>
      <Box my={2} sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Typography>
          <img style={{ width: '80px' }} src={p.business.image} />
        </Typography>
        <Typography variant="h2">{p.name}</Typography>
      </Box>
      <Box my={2}>
        <Typography variant="body2" color={'#9E9E9E'}>
          {p.description}
        </Typography>
      </Box>
      <Box my={2} pb={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Chip
            label={<Typography variant="overline">{p.field.name}</Typography>}
            variant="filled"
            sx={{ borderRadius: '3px', color: 'rgba(0,0,0,0.6)' }}
          />
          <MHidden width="smDown">
            <Chip
              label={<Typography variant="overline">{p.field.description}</Typography>}
              variant="filled"
              sx={{ borderRadius: '3px', color: 'rgba(0,0,0,0.6)' }}
            />
          </MHidden>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Chip
            label={
              <Typography variant="overline">
                {StyleStatus.find((e) => e.name === p.status)?.vn}
              </Typography>
            }
            variant="filled"
            sx={{
              bgcolor: StyleStatus.find((e) => e.name === p.status)?.bgcolor,
              borderRadius: '3px',
              color: '#ffffff'
            }}
          />
        </Box>
      </Box>
      {p.status === 'DENIED' && (
        <>
          <Typography sx={{ textAlign: 'end', fontWeight: '700', py: 2 }}>
            <Button onClick={handleClickOpenSubmit} color="warning" variant="contained">
              Cập nhật lại trạng thái
            </Button>
            <Dialog
              open={openSubmit}
              onClose={handleClickOpenSubmit}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <DialogTitle>Bạn có muốn cập nhật lại dự án?</DialogTitle>

              <Box sx={{ width: '400px', height: '350px', p: 2 }}>
                <Typography sx={{ paddingLeft: 2, pt: 2, color: '#9c8515' }} variant="h6">
                  Lưu ý:
                </Typography>
                <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                  (*) Sau khi bạn bấm nút cập nhật lại dự án( Trạng thái dự án sẽ chuyển sang trạng
                  thái 'Đang khởi tạo - DRAFT' )
                </Typography>
                <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                  (*) Những thông tin của dự án: (Tên dự án , mô tả , Các thông số của dự án , Tổng
                  thanh khoản, Thời gian kêu gọi, Gói dự án đầu tư) không được chỉnh sủa khi dự án
                  đã được duyệt.
                </Typography>
                <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                  (*) Những thông tin không có đánh dấu * có thể được chỉnh sửa khi dự án đã duyệt
                  bởi KROWD.
                </Typography>
              </Box>

              <DialogActions>
                <ButtonGuide color="error" variant="contained" onClick={handleCloseSubmit}>
                  Đóng
                </ButtonGuide>
                <ButtonGuide type="submit" variant="contained" onClick={handleSubmitProject}>
                  Cập nhật lại dự án
                </ButtonGuide>
              </DialogActions>
            </Dialog>
          </Typography>
          <Typography sx={{ textAlign: 'end', fontWeight: '700' }}>
            * Chỉnh sửa thông tin của dự án của bạn
          </Typography>
        </>
      )}
    </>
  );
}
export default ProjectDetailHeading;
