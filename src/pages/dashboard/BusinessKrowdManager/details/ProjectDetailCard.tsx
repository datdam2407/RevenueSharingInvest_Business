import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  LinearProgress,
  linearProgressClasses,
  styled,
  Typography
} from '@mui/material';
import { Project } from '../../../../@types/krowd/project';
import { fCurrency } from 'utils/formatNumber';
import { Link } from 'react-scroll';
// import { ProjectDetailAlbumCarousel } from 'components/_external-pages/project-detail/index';
import { PATH_PAGE } from 'routes/paths';
import ProjectDetailAlbumCarousel from './ProjectDetailAlbumCarousel';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import UploadAlbum from './UploadAlbum';
import UploadImageProject from './UploadImageProject';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';
import roundAddAPhoto from '@iconify/icons-ic/round-add-a-photo';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 700]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#14B7CC'
  }
}));

type ProjectDetailCardProps = {
  project: Project;
};
function ProjectDetailCard({ project: p }: ProjectDetailCardProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [openImageProject, setOpenImageProject] = useState(false);
  const handleClickOpenImageProject = () => {
    setOpenImageProject(true);
  };
  const handleCloseImageProject = () => {
    setOpenImageProject(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getEntityList = (
    type: 'PITCH' | 'EXTENSION' | 'DOCUMENT' | 'ALBUM' | 'ABOUT' | 'HIGHLIGHT' | 'PRESS' | 'FAQ'
  ) => {
    return p.projectEntity.find((pe) => pe.type === type)?.typeItemList;
  };
  const album = [
    p.image,
    ...getEntityList('ALBUM')!
      .map((_image) => _image.link)
      .filter(notEmpty)
  ];

  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }
  const PlaceholderStyle = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.neutral,
    transition: theme.transitions.create('opacity', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&:hover': { opacity: 0.72 },
    margin: 'auto'
  }));

  return (
    <>
      <Grid container>
        <Grid
          px={{ lg: 0, md: 0, sm: 5, xs: 2 }}
          sx={{ pr: 5 }}
          py={{ lg: 0, md: 3, sm: 3 }}
          item
          xs={12}
          sm={12}
          md={7}
          lg={8}
        >
          {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && p.status === 'DRAFT' && (
            <HeaderBreadcrumbs
              heading={''}
              links={[{ name: `` }]}
              action={
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleClickOpenImageProject}
                    startIcon={<Icon icon={editTwotone} />}
                    color={'warning'}
                  >
                    Cập nhật ảnh
                  </Button>
                  <Dialog open={openImageProject} onClose={handleCloseImageProject}>
                    <UploadImageProject project={p} closeDialog={handleCloseImageProject} />
                  </Dialog>
                </Box>
              }
            />
          )}
          {p?.image === null && (
            <PlaceholderStyle>
              <Box component={Icon} icon={roundAddAPhoto} sx={{ width: 440, height: 440, p: 10 }} />
            </PlaceholderStyle>
          )}
          <img style={{ width: '100%' }} src={p.image} />
          {p.image &&
            album &&
            user?.role === ROLE_USER_TYPE.PROJECT_MANAGER &&
            p.status === 'DRAFT' && (
              <HeaderBreadcrumbs
                sx={{ my: 3 }}
                heading={''}
                links={[{ name: `` }]}
                action={
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleClickOpen}
                      startIcon={<Icon icon={editTwotone} />}
                      color={'warning'}
                    >
                      Cập nhật album ảnh
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                      <UploadAlbum project={p} closeDialog={handleClose} />
                    </Dialog>
                  </Box>
                }
              />
            )}
          {album && <ProjectDetailAlbumCarousel album={album} />}
        </Grid>
        <Grid
          px={{ lg: 5, md: 5, sm: 5, xs: 2 }}
          py={{ lg: 5, md: 3, sm: 3, xs: 3 }}
          item
          xs={12}
          sm={12}
          md={5}
          lg={4}
        >
          <Box sx={{ my: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: '0.5rem'
              }}
            >
              <Typography
                paragraph
                sx={{
                  color: '#251E18',
                  marginBottom: '0.2rem'
                }}
              >
                <strong>Đã đầu tư</strong>
              </Typography>
              <Typography
                paragraph
                sx={{
                  color: '#251E18',
                  marginBottom: '0.2rem'
                }}
              >
                <strong>Mục tiêu</strong>
              </Typography>
            </Box>
            <BorderLinearProgress
              variant="determinate"
              value={(p && (p.investedCapital / p.investmentTargetCapital) * 100) ?? 0}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                my: '0.5rem'
              }}
            >
              <Typography
                paragraph
                sx={{
                  color: '#14B7CC'
                }}
              >
                <strong>{fCurrency(p.investedCapital)}</strong>
              </Typography>
              <Typography
                paragraph
                sx={{
                  color: '#FF7F56'
                }}
              >
                <strong>{fCurrency(p.investmentTargetCapital)}</strong>
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ color: 'text.disabled' }} />

          <Box
            sx={{
              my: 1.5,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{ mt: 0.2, fontSize: '25px', fontWeight: '900' }}>
              {p.sharedRevenue}
              <span>%</span>
              <Typography color="text.disabled" variant="subtitle2">
                Doanh thu chia sẻ
              </Typography>
            </Typography>
          </Box>
          <Divider sx={{ color: 'text.disabled' }} />

          <Box
            sx={{
              my: 1.5,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{ mt: 0.2, fontSize: '25px', fontWeight: '900' }}>
              <span>x</span>
              {p.multiplier}
              <Typography color="text.disabled" variant="subtitle2">
                Hệ số nhân
              </Typography>
            </Typography>
          </Box>
          <Divider sx={{ color: 'text.disabled' }} />

          <Box
            sx={{
              my: 1.5,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{ mt: 0.2, fontSize: '25px', fontWeight: '900' }}>
              {p.duration} <span> tháng </span>
              <Typography color="text.disabled" variant="subtitle2">
                Thanh toán đầu tư
              </Typography>
            </Typography>
          </Box>
          <Divider sx={{ color: 'text.disabled' }} />

          <Box
            sx={{
              my: 1.5,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{ mt: 0.2, fontSize: '25px', fontWeight: '900' }}>
              {p.numOfStage} <span> kì</span>
              <Typography color="text.disabled" variant="subtitle2">
                Số kì thanh toán
              </Typography>
            </Typography>
          </Box>
        </Grid>

        {/* <Typography variant="h4" sx={{ my: 5 }}>
          Album ảnh của dự án:
        </Typography> */}
        {/* <UploadAlbum project={p} closeDialog={handleClickOpen} /> */}
      </Grid>
    </>
  );
}
export default ProjectDetailCard;
