// material

import {
  Container,
  Tab,
  Box,
  Tabs,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
  Autocomplete,
  Avatar,
  Card,
  Grid,
  Divider,
  CardHeader
} from '@mui/material';
// components
import Page from '../../../../../components/Page';
import { dispatch, RootState, useSelector } from 'redux/store';
import { useLocation, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { getMyProject, getProjectId, submitProject } from 'redux/slices/krowd_slices/project';
import useAuth from 'hooks/useAuth';
import { ROLE_USER_TYPE } from '../../../../../@types/krowd/users';
import { Project } from '../../../../../@types/krowd/project';

import { PlanFreeIcon, PlanPremiumIcon, PlanStarterIcon, SeverErrorIllustration } from 'assets';

import BusinessProjectForm from './BusinessProjectForm';
import ProjectDetailHeading from '../../details/ProjectDetailHeading';
import ProjectDetailCard from '../../details/ProjectDetailCard';
import { Icon } from '@iconify/react';
import starFilled from '@iconify/icons-ant-design/star-filled';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import bookTwotone from '@iconify/icons-ant-design/book-twotone';

import BusinessProjectFormUpdate from '../../details/BusinessProjectFormUpdate';
import { getFieldList } from 'redux/slices/krowd_slices/field';
import ProjectDetailExtension from '../../details/ProjectDetailExtension';
import ProjectDetailDocument from '../../details/ProjectDetailDocument';
import EntityHighLight from '../../enitities/EntityHighLight';
import ProjectDetailHighlight from '../../details/ProjectDetailHighlight';
import ProjectDetailPitch from '../../details/ProjectDetailPitch';
import { PATH_DASHBOARD } from 'routes/paths';
import ProjectPackage from './ProjectPackage';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import Step1 from '@iconify/icons-eva/image-outline';
import Step2 from '@iconify/icons-eva/heart-fill';
import Step3 from '@iconify/icons-eva/pantone-fill';
import Step4 from '@iconify/icons-eva/globe-2-outline';
import Step5 from '@iconify/icons-eva/file-text-outline';
import Step6 from '@iconify/icons-eva/gift-outline';
import Step7 from '@iconify/icons-eva/facebook-outline';
import Step8 from '@iconify/icons-eva/hash-outline';
import Step9 from '@iconify/icons-eva/question-mark-outline';
import Step10 from '@iconify/icons-eva/activity-outline';
import Step11 from '@iconify/icons-eva/trending-up-outline';
import circleXFill from '@iconify/icons-akar-icons/circle-x-fill';
import { useSnackbar } from 'notistack';
import {
  getAllProjectStage,
  getProjectStageID,
  getProjectStageList
} from 'redux/slices/krowd_slices/stage';
import { KrowdProjectStage } from 'components/_dashboard/general-app';
import StageListKrowdTable from 'components/table/user-table/StageListKrowdTable';
// icon
import chartMedian from '@iconify/icons-carbon/chart-median';
import tableIcon from '@iconify/icons-codicon/table';
import EntityUpdatePitch from '../../enitities/EntityUpdatePitch';
import EntityPitch from '../../enitities/EntityPitch';
import EmptyContent from 'components/EmptyContent';
import EntityDocument from '../../enitities/EntityDocument';
import EntityExtension from '../../enitities/EntityExtension';
import ProjectDetailAboutBusiness from '../../details/ProjectDetailAboutBusiness';
import ProjectDetailPressBusiness from '../../details/ProjectDetailPressBusiness';
import EntityPress from '../../enitities/EntityPress';
import ProjectDetailFAQsBusiness from '../../details/ProjectDetailFAQsBusiness';
import EntityFaqs from '../../enitities/EntityFaqs';
import ProjectDetailHowItWorks from '../../details/ProjectDetailHowItWorks';
import EnityHowItWork from '../../enitities/EnityHowItWork';
import { alpha, styled } from '@mui/material/styles';
import EntityUpdateNews from '../../enitities/EntityUpdateNews';
import ProjectDetailUpdateNews from '../../details/ProjectDetailUpdateNews';

//

// ----------------------------------------------------------------------

export default function ProjectKrowdDetails() {
  const { id = '' } = useParams();
  const { projectDetailBYID: businessProjectDetail, myProjects: PMMyProject } = useSelector(
    (state: RootState) => state.project
  );
  useEffect(() => {
    if (id) {
      dispatch(getProjectId(id));
    } else {
      dispatch(getProjectId(`${localStorage.getItem('projectId')}`));
    }
  }, []);

  const { projectDetail } = businessProjectDetail;

  const renderProjectDetail = () => {
    return businessProjectDetail.isLoadingID ? (
      <Box>
        <CircularProgress
          size={100}
          sx={{ margin: '0px auto', padding: '1rem', display: 'flex' }}
        />
        <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
          Đang tải dữ liệu, vui lòng đợi giây lát...
        </Typography>
      </Box>
    ) : (
      (projectDetail && <ProjectDetail project={projectDetail} />) || (
        <ErrorProject type="UNKNOWN ERROR" />
      )
    );
  };
  return <Page title="Chi tiết: Dự án | Krowd dành cho dự án">{renderProjectDetail()}</Page>;
}

function ProjectDetail({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const [openHighLight, setOpenHighLight] = useState(false);
  const [openUpdateNews, setOpenUpdateNews] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openPitch, setOpenPitch] = useState(false);
  const [openStage, setOpenStage] = useState('table');
  const { user } = useAuth();
  useEffect(() => {
    dispatch(getProjectStageList(project.id));
    // dispatch(getAllProjectStage(project.id ?? '', 1));
    // dispatch(getProjectId(project.id));
  }, [dispatch]);

  const { listOfChartStage } = useSelector((state: RootState) => state.stage);
  const { isLoading, packageLists } = useSelector((state: RootState) => state.projectEntity);

  const getEntityList = (
    type:
      | 'PITCH'
      | 'EXTENSION'
      | 'DOCUMENT'
      | 'ALBUM'
      | 'ABOUT'
      | 'HIGHLIGHT'
      | 'FAQ'
      | 'PRESS'
      | 'HOW_IT_WORKS'
      | 'UPDATE'
  ) => {
    return (
      project?.projectEntity && project?.projectEntity.find((pe) => pe.type === type)?.typeItemList
    );
  };
  const { pitchs, extensions, documents, abouts, album, highlights, faqs, press, hows, updates } = {
    pitchs: getEntityList('PITCH'),
    extensions: getEntityList('EXTENSION'),
    documents: getEntityList('DOCUMENT'),
    updates: getEntityList('UPDATE'),
    abouts: getEntityList('ABOUT'),
    faqs: getEntityList('FAQ'),
    album: [
      project.image,
      ...getEntityList('ALBUM')!
        .map((_image) => _image.link)
        .filter(notEmpty)
    ],
    highlights: getEntityList('HIGHLIGHT'),
    press: getEntityList('PRESS'),
    hows: getEntityList('HOW_IT_WORKS')
  };
  function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    dispatch(getFieldList());
    setOpen(true);
  };
  const handleClickOpenGuide = () => {
    setOpenGuide(true);
  };
  const handleCloseGuide = () => {
    setOpenGuide(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenSubmit = () => {
    setOpenSubmit(true);
  };
  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };
  const handleSubmitProject = () => {
    dispatch(submitProject(project.id));
    enqueueSnackbar('Đăng dự án thành công', {
      variant: 'success'
    });
    setOpenSubmit(false);
  };
  //=========================PITCH=========================
  const handleClickOpenUpdateNews = () => {
    setOpenUpdateNews(true);
  };
  const handleCloseUpdateNews = () => {
    setOpenUpdateNews(false);
  };
  //=========================HIGHLIGHT=========================
  const handleClickOpenHighLight = () => {
    setOpenHighLight(true);
  };
  const handleCloseHighLight = () => {
    setOpenHighLight(false);
  };
  //=========================PITCH=========================
  const handleClickOpenPitch = () => {
    setOpenPitch(true);
  };
  const handleClosePitch = () => {
    setOpenPitch(false);
  };
  const handleClickOpenStage = () => {
    setOpenStage('table');
    window.scrollTo(700, document.body.scrollHeight);
  };
  const handleCloseOpenStage = () => {
    setOpenStage('chart');
    window.scrollTo(700, document.body.scrollHeight);
  };
  const [openDocument, setOpenDocument] = useState(false);

  const handleClickOpenDocuments = () => {
    setOpenDocument(true);
  };
  const handleCloseDocument = () => {
    setOpenDocument(false);
  };
  const [openExtension, setOpenExtension] = useState(false);
  const handleClickOpenExtension = () => {
    setOpenExtension(true);
  };
  const handleCloseExtension = () => {
    setOpenExtension(false);
  };
  const [openPress, setOpenPress] = useState(false);
  const handleClickOpenPress = () => {
    setOpenPress(true);
  };
  const handleClosePress = () => {
    setOpenPress(false);
  };
  const [openFAQs, setOpenFAQs] = useState(false);
  const handleClickOpenFAQs = () => {
    setOpenFAQs(true);
  };
  const handleCloseFAQs = () => {
    setOpenFAQs(false);
  };
  const [openHOW, setOpenHOW] = useState(false);
  const handleClickOpenHOW = () => {
    setOpenHOW(true);
  };
  const handleCloseHOW = () => {
    setOpenHOW(false);
  };
  const ButtonGuide = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontSize: '15px'
  }));
  return (
    <Container maxWidth={false}>
      {/* Details of project name , description*/}

      <ProjectDetailHeading p={project} />

      {/* ButtonGuide Edit of project*/}
      {((user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT') ||
        project.status === 'DENIED') && (
        <HeaderBreadcrumbs
          heading="Dự án của bạn"
          links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }, { name: 'Thông tin' }]}
          action={
            <Box>
              <ButtonGuide
                variant="contained"
                onClick={handleClickOpenGuide}
                startIcon={<Icon icon={bookTwotone} />}
                sx={{ mr: 1 }}
              >
                Hướng dẫn
              </ButtonGuide>
              <ButtonGuide
                variant="contained"
                onClick={handleClickOpen}
                startIcon={<Icon icon={editTwotone} />}
                color={'warning'}
              >
                Cập nhật thông tin
              </ButtonGuide>
              <Dialog open={open} onClose={handleClose}>
                <BusinessProjectFormUpdate project={project} closeDialog={handleClose} />
              </Dialog>

              <ButtonGuide
                variant="contained"
                onClick={handleClickOpenSubmit}
                startIcon={<Icon icon={checkmarkFill} />}
                color={'success'}
                sx={{ ml: 1 }}
              >
                Đăng dự án{' '}
              </ButtonGuide>
              <Dialog
                open={openSubmit}
                onClose={handleClickOpenSubmit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <DialogTitle>Bạn có muốn đăng dự án?</DialogTitle>

                <Box sx={{ width: '400px', height: '650px', p: 2 }}>
                  <Typography sx={{ paddingLeft: 2 }} variant="body1">
                    Thông tin cơ bản của dự án:
                  </Typography>
                  {album && album?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Ảnh của dự án (*)
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Ảnh của dự án (*)
                    </ButtonGuide>
                  )}
                  {highlights && highlights?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Thông tin nổi bật cho dự án
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Thông tin nổi bật cho dự án
                    </ButtonGuide>
                  )}
                  {pitchs && pitchs?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Thông tin tiêu diểm cho dự án
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Thông tin tiêu diểm cho dự án
                    </ButtonGuide>
                  )}
                  {extensions && extensions?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Thông tin mở rộng của dự án
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Thông tin mở rộng của dự án
                    </ButtonGuide>
                  )}
                  {documents && documents?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Thông tin tài liệu của dự án
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Thông tin tài liệu của dự án
                    </ButtonGuide>
                  )}
                  {packageLists.listOfPackage.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Thông tin các gói đầu tư của dự án (*)
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Thông tin các gói đầu tư của dự án (*)
                    </ButtonGuide>
                  )}
                  {/* {listOfChartStage &&
                    listOfChartStage.find((c) =>
                      c.lineList.find((line) => line.data.find((d) => d.valueOf() !== 0))
                    ) ? (
                      <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                        Cập nhật giai đoạn của dự án
                      </ButtonGuide>
                    ) : (
                      <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                        Cập nhật giai đoạn của dự án
                      </ButtonGuide>
                    )} */}

                  <Typography sx={{ paddingLeft: 2, pt: 2 }} variant="body1">
                    Thông tin bổ sung:
                  </Typography>

                  {abouts && abouts?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Thông tin về doanh nghiệp của bạn
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Thông tin về doanh nghiệp của bạn
                    </ButtonGuide>
                  )}
                  {press && press?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Đã thêm các bài viết liên quan tới dự án
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Đã thêm các bài viết liên quan tới dự án
                    </ButtonGuide>
                  )}
                  {faqs && faqs?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Đã thêm các câu hỏi thường gặp
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Đã thêm các câu hỏi thường gặp
                    </ButtonGuide>
                  )}
                  {hows && hows?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Đã thêm các câu cách thức hoạt động
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Đã thêm các câu cách thức hoạt động
                    </ButtonGuide>
                  )}

                  <Typography sx={{ paddingLeft: 2, pt: 2, color: '#9c8515' }} variant="h6">
                    Lưu ý:
                  </Typography>

                  <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                    (*) Những thông tin của dự án: (Tên dự án , mô tả , Các thông số của dự án ,
                    Tổng thanh khoản, Thời gian kêu gọi, Gói dự án đầu tư) không được chỉnh sủa khi
                    dự án đã được duyệt.
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
                    Đăng dự án
                  </ButtonGuide>
                </DialogActions>
              </Dialog>
              <Dialog
                open={openGuide}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <DialogTitle>Các bước tạo dự án đầu tư</DialogTitle>

                <Box sx={{ width: '600px', height: '690px', p: 2.5 }}>
                  <Typography sx={{ paddingLeft: 2, fontWeight: 600 }} variant="body1">
                    Thông tin cơ bản của dự án:
                  </Typography>
                  <ButtonGuide startIcon={<Icon icon={Step1} />}>
                    Bước 1: Cập nhật ảnh của dự án
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step1} />}>
                    Bước 2: Cập nhật album ảnh của dự án
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step2} />}>
                    Bước 3: Cập nhật thông tin nổi bật cho dự án
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step3} />}>
                    Bước 4: Cập nhật thông tin tiêu diểm cho dự án
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step4} />}>
                    Bước 5: Cập nhật thông tin mở rộng của dự án
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step5} />}>
                    Bước 6: Cập nhật thông tin tài liệu của dự án
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step6} />}>
                    Bước 7: Cập nhật gói đầu tư của dự án (tối đa: 3 gói)
                  </ButtonGuide>

                  <Typography sx={{ paddingLeft: 2, pt: 2, fontWeight: 600 }} variant="body1">
                    Thông tin bổ sung:
                  </Typography>
                  <ButtonGuide startIcon={<Icon icon={Step7} />}>
                    Bước 8: Cập nhật thông tin về doanh nghiệp của bạn (About us)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step8} />}>
                    Bước 9: Cập nhật thông tin các bài viết liên quan tới dự án (Press)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step9} />}>
                    Bước 10: Cập nhật thông tin các câu hỏi thường gặp (Faq)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step10} />}>
                    Bước 11: Cập nhật thông tin các cách thức hoạt động (How it works)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step11} />}>
                    Bước 12: Cập nhật thông tin giai đoạn của dự án (*)
                  </ButtonGuide>

                  <Typography sx={{ paddingLeft: 2, pt: 2, color: '#9c8515' }} variant="h6">
                    Lưu ý:
                  </Typography>

                  <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                    (*) Những thông tin của dự án: (Tên dự án , mô tả , Các thông số của dự án ,
                    Tổng thanh khoản, Thời gian kêu gọi, Gói dự án đầu tư) không được chỉnh sủa khi
                    dự án đã được duyệt.
                  </Typography>
                  <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                    (*) Những thông tin này sẽ được công khai cho các nhà đầu tư nhìn thấy hãy đảm
                    bảo thông tin của bạn điền
                  </Typography>
                </Box>

                <DialogActions>
                  <ButtonGuide color="error" variant="contained" onClick={handleCloseGuide}>
                    Đóng
                  </ButtonGuide>
                </DialogActions>
              </Dialog>
            </Box>
          }
        />
      )}

      <Card sx={{ pt: 5, px: 5 }}>
        {/* Details of project with card*/}
        {project && <ProjectDetailCard project={project} />}
      </Card>
      <Box sx={{ pt: 5, px: 5, mt: 5 }}>
        {/* All project entity */}
        <Grid container justifyContent="space-between">
          {/* HightLight entity */}
          <Grid xs={12} sm={7} md={6} lg={8}>
            <Grid container>
              <Grid xs={12} sm={9} md={9} lg={9}>
                <Typography variant="h4" sx={{ mr: 3 }} color={'#666'} height={50}>
                  <Icon
                    icon={starFilled}
                    style={{
                      marginRight: 10,
                      marginBottom: 5,
                      color: '#14B7CC'
                    }}
                  />
                  Nổi bật
                  <Box width={'8%'}>
                    <Divider variant="fullWidth" sx={{ my: 1, opacity: 0.1 }} />
                  </Box>
                </Typography>
              </Grid>
              <Grid>
                {highlights && highlights.length === 0 && (
                  <HeaderBreadcrumbs
                    heading={''}
                    links={[{ name: `` }]}
                    action={
                      <Grid>
                        <ButtonGuide
                          variant="contained"
                          onClick={handleClickOpenHighLight}
                          color={'primary'}
                          sx={{ mx: 3 }}
                        >
                          + Thêm mới nổi bật
                        </ButtonGuide>
                        <Dialog maxWidth={false} open={openHighLight}>
                          <EntityHighLight project={project} closeDialog={handleCloseHighLight} />
                        </Dialog>
                      </Grid>
                    }
                  />
                )}
              </Grid>
            </Grid>
            {highlights && highlights.length > 0 && (
              <ProjectDetailHighlight project={project} highlights={highlights} />
            )}
            <Box width={'95%'}>
              <Divider variant="fullWidth" sx={{ my: 3, opacity: 0.1 }} />
            </Box>
            <Grid container>
              <Grid xs={12} sm={9} md={9} lg={9}>
                <Typography variant="h4" sx={{ mr: 3 }} color={'#666'} height={50}>
                  <Icon
                    icon={starFilled}
                    style={{
                      marginRight: 10,
                      marginBottom: 5,
                      color: '#14B7CC'
                    }}
                  />
                  Bản tin mới
                  <Box width={'13%'}>
                    <Divider variant="fullWidth" sx={{ my: 1, opacity: 0.1 }} />
                  </Box>
                </Typography>
              </Grid>
              <Grid>
                {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'ACTIVE' && (
                  <Grid>
                    <ButtonGuide
                      sx={{ mx: 3 }}
                      variant="contained"
                      onClick={handleClickOpenUpdateNews}
                      color={'primary'}
                    >
                      + Thêm mới bản tin
                    </ButtonGuide>
                    <Dialog maxWidth={false} open={openUpdateNews}>
                      <EntityUpdateNews project={project} closeDialog={handleCloseUpdateNews} />
                    </Dialog>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {updates && updates.length > 0 && (
              <ProjectDetailUpdateNews updates={updates} project={project} />
            )}
            <Box width={'95%'}>
              <Divider variant="fullWidth" sx={{ my: 3, opacity: 0.1 }} />
            </Box>
            {/*Pitch enities */}
            <Grid container sx={{ mt: 7 }}>
              <Grid xs={12} sm={9} md={9} lg={9}>
                <Typography variant="h4" color={'#666'} height={50}>
                  <Icon
                    icon={starFilled}
                    style={{
                      marginRight: 10,
                      marginBottom: 5,
                      color: '#14B7CC'
                    }}
                  />
                  Tiêu điểm dự án
                  <Box width={'7%'}>
                    <Divider variant="fullWidth" sx={{ my: 1, opacity: 0.1 }} />
                  </Box>
                </Typography>{' '}
              </Grid>
              <Grid>
                {/* {((user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT') ||
                  project.status === 'DENIED') && ( */}
                {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
                  <Grid>
                    <ButtonGuide
                      sx={{ mx: 3 }}
                      variant="contained"
                      onClick={handleClickOpenPitch}
                      color={'primary'}
                    >
                      + Thêm mới tiêu điểm
                    </ButtonGuide>
                    <Dialog maxWidth={false} open={openPitch}>
                      <EntityPitch project={project} closeDialog={handleClosePitch} />
                    </Dialog>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {pitchs && pitchs.length > 0 && (
              <ProjectDetailPitch pitchs={pitchs} project={project} />
            )}
          </Grid>
          {/* Extension entity and document*/}
          <Grid xs={12} sm={4} md={5} lg={4}>
            {/* Extension entity */}
            <Grid container>
              <Grid>
                <Typography variant="h4" sx={{ mt: 0.1 }} color={'#666'}>
                  Thông tin mở rộng
                </Typography>
                <Box width={'15%'}>
                  <Divider variant="fullWidth" sx={{ my: 1 }} />
                </Box>
              </Grid>
            </Grid>
            {extensions && extensions.length > 0 && (
              <ProjectDetailExtension extensions={extensions} project={project} />
            )}
            {((user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT') ||
              project.status === 'DENIED') && (
              <Grid lg={12} my={3}>
                <ButtonGuide
                  fullWidth
                  variant="contained"
                  onClick={handleClickOpenExtension}
                  color={'primary'}
                >
                  + Mở rộng
                </ButtonGuide>
                <Dialog maxWidth={false} open={openExtension}>
                  <EntityExtension project={project} closeDialog={handleCloseExtension} />
                </Dialog>
              </Grid>
            )}

            {/* Document entity */}
            <Grid container sx={{ mt: 7 }}>
              <Grid>
                <Typography variant="h5" color={'#666'}>
                  Tài liệu dự án
                </Typography>
                <Box width={'15%'}>
                  <Divider variant="fullWidth" sx={{ my: 1 }} />
                </Box>
              </Grid>
            </Grid>
            {documents && documents.length > 0 && (
              <ProjectDetailDocument project={project} documents={documents} />
            )}
            {((user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT') ||
              project.status === 'DENIED') && (
              <Grid xs={12} sm={12} md={12} lg={12}>
                <ButtonGuide
                  fullWidth
                  variant="contained"
                  onClick={handleClickOpenDocuments}
                  color={'primary'}
                >
                  + Tài liệu
                </ButtonGuide>
                <Dialog maxWidth={false} open={openDocument}>
                  <EntityDocument project={project} closeDialog={handleCloseDocument} />
                </Dialog>
              </Grid>
            )}

            {/*PACKAGE */}
            {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
              <Grid sx={{ my: 5 }}>
                <Typography variant="h5" color={'#666'}>
                  Gói đầu tư
                </Typography>
                <Box width={'15%'}>
                  <Divider variant="fullWidth" sx={{ my: 1 }} />
                </Box>
                <ProjectPackage project={project} />
              </Grid>
            )}

            {/*HOW IT WORKS */}
            <Grid container sx={{ mt: 7 }}>
              <Grid>
                <Typography variant="h5" color={'#666'}>
                  Cách thức hoạt động
                </Typography>
                <Box width={'15%'}>
                  <Divider variant="fullWidth" sx={{ my: 1 }} />
                </Box>
              </Grid>
            </Grid>
            {hows && hows.length > 0 && <ProjectDetailHowItWorks project={project} hows={hows} />}
            {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
              <Grid xs={12} sm={12} md={12} lg={12}>
                <ButtonGuide
                  sx={{ my: 2 }}
                  variant="contained"
                  onClick={handleClickOpenHOW}
                  color={'primary'}
                >
                  + Thêm mới cách thức hoạt động
                </ButtonGuide>
                <Dialog maxWidth={false} open={openHOW}>
                  <EnityHowItWork project={project} closeDialog={handleCloseHOW} />
                </Dialog>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ pt: 5, px: 5, mt: 5 }}>
        <ProjectDetailAboutBusiness abouts={abouts} project={project} />
        <ProjectDetailPressBusiness press={press} project={project} />
        {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
          <Grid lg={12} my={3}>
            <Typography sx={{ textAlign: 'center', width: 'auto' }}>
              <ButtonGuide
                sx={{ width: 300, textAlign: 'center' }}
                variant="contained"
                onClick={handleClickOpenPress}
                color={'primary'}
              >
                Thêm mới một bài viết
              </ButtonGuide>
            </Typography>

            <Dialog maxWidth={false} open={openPress}>
              <EntityPress project={project} closeDialog={handleClosePress} />
            </Dialog>
          </Grid>
        )}
        <Box>
          <Divider variant="fullWidth" sx={{ my: 5 }} />
        </Box>
        <ProjectDetailFAQsBusiness faqs={faqs} project={project} />
        {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
          <Grid lg={12} my={3}>
            <Typography sx={{ textAlign: 'center', width: 'auto' }}>
              <ButtonGuide
                sx={{ width: 300, textAlign: 'center' }}
                variant="contained"
                onClick={handleClickOpenFAQs}
                color={'primary'}
              >
                Thêm mới một câu hỏi
              </ButtonGuide>
            </Typography>

            <Dialog maxWidth={false} open={openFAQs}>
              <EntityFaqs project={project} closeDialog={handleCloseFAQs} />
            </Dialog>
          </Grid>
        )}
        <Typography sx={{ mt: 5 }} />
      </Box>
      <Card sx={{ pt: 5, px: 5, mt: 5 }}>
        <Grid
          container
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          mb={5}
        >
          <Grid lg={9}>
            <Typography variant="h4" sx={{ mr: 3 }} color={'#666'}>
              <Icon
                icon={starFilled}
                style={{
                  marginRight: 10,
                  marginBottom: 5,
                  color: '#14B7CC'
                }}
              />
              Giai đoạn
            </Typography>
          </Grid>
          <Grid lg={3}>
            <Grid container display={'flex'} alignItems={'center'} justifyContent={'space-evenly'}>
              <Grid>
                <ButtonGuide variant="outlined" onClick={handleClickOpenStage}>
                  <Typography variant="h4" color={'#666'} height={30}>
                    <Icon
                      icon={tableIcon}
                      style={{
                        marginRight: 10,
                        marginBottom: 5,
                        color: '#14B7CC'
                      }}
                    />
                  </Typography>
                  Dạng bảng
                </ButtonGuide>
              </Grid>
              <Grid>
                <ButtonGuide variant="outlined" onClick={handleCloseOpenStage}>
                  <Typography variant="h4" color={'#666'} height={30}>
                    <Icon
                      icon={chartMedian}
                      style={{
                        marginRight: 10,
                        marginBottom: 5,
                        color: '#14B7CC'
                      }}
                    />
                  </Typography>
                  Dạng biểu đồ
                </ButtonGuide>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && */}
        {openStage === 'chart' && listOfChartStage && listOfChartStage.length > 0 && (
          <KrowdProjectStage project={project} />
        )}

        {openStage === 'table' && listOfChartStage && listOfChartStage.length > 0 && (
          <StageListKrowdTable project={project} />
        )}
      </Card>
    </Container>
  );
}

export function ErrorProject({ type }: { type: 'EMPTY' | 'UNKNOWN ERROR' }) {
  const content =
    type === 'EMPTY'
      ? {
          title: 'BẠN CHƯA CÓ DỰ ÁN',
          advise: 'Hãy Tạo dự án mới',
          ButtonGuide: true
        }
      : {
          title: 'CHỜ KROWD DUYỆT DOANH NGHIỆP CHO BẠN NHA!',
          advise: 'Hãy thử lại sau khi chúng tôi duyệt doanh nghiệp của bạn',
          ButtonGuide: false
        };

  return (
    <Container>
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center', py: 10 }}>
        <Typography variant="h6" paragraph>
          {content.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>{content.advise}</Typography>

        <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />

        {content.ButtonGuide && <BusinessProjectForm />}
      </Box>
    </Container>
  );
}
