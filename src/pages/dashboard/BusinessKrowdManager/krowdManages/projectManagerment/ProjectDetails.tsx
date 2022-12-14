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
          ??ang t???i d??? li???u, vui l??ng ?????i gi??y l??t...
        </Typography>
      </Box>
    ) : (
      (projectDetail && <ProjectDetail project={projectDetail} />) || (
        <ErrorProject type="UNKNOWN ERROR" />
      )
    );
  };
  return <Page title="Chi ti???t: D??? ??n | Krowd d??nh cho d??? ??n">{renderProjectDetail()}</Page>;
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
    enqueueSnackbar('????ng d??? ??n th??nh c??ng', {
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
          heading="D??? ??n c???a b???n"
          links={[{ name: 'B???ng ??i???u khi???n', href: PATH_DASHBOARD.root }, { name: 'Th??ng tin' }]}
          action={
            <Box>
              <ButtonGuide
                variant="contained"
                onClick={handleClickOpenGuide}
                startIcon={<Icon icon={bookTwotone} />}
                sx={{ mr: 1 }}
              >
                H?????ng d???n
              </ButtonGuide>
              <ButtonGuide
                variant="contained"
                onClick={handleClickOpen}
                startIcon={<Icon icon={editTwotone} />}
                color={'warning'}
              >
                C???p nh???t th??ng tin
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
                ????ng d??? ??n{' '}
              </ButtonGuide>
              <Dialog
                open={openSubmit}
                onClose={handleClickOpenSubmit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <DialogTitle>B???n c?? mu???n ????ng d??? ??n?</DialogTitle>

                <Box sx={{ width: '400px', height: '650px', p: 2 }}>
                  <Typography sx={{ paddingLeft: 2 }} variant="body1">
                    Th??ng tin c?? b???n c???a d??? ??n:
                  </Typography>
                  {album && album?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      ???nh c???a d??? ??n (*)
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      ???nh c???a d??? ??n (*)
                    </ButtonGuide>
                  )}
                  {highlights && highlights?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Th??ng tin n???i b???t cho d??? ??n
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Th??ng tin n???i b???t cho d??? ??n
                    </ButtonGuide>
                  )}
                  {pitchs && pitchs?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Th??ng tin ti??u di???m cho d??? ??n
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Th??ng tin ti??u di???m cho d??? ??n
                    </ButtonGuide>
                  )}
                  {extensions && extensions?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Th??ng tin m??? r???ng c???a d??? ??n
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Th??ng tin m??? r???ng c???a d??? ??n
                    </ButtonGuide>
                  )}
                  {documents && documents?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Th??ng tin t??i li???u c???a d??? ??n
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Th??ng tin t??i li???u c???a d??? ??n
                    </ButtonGuide>
                  )}
                  {packageLists.listOfPackage.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Th??ng tin c??c g??i ?????u t?? c???a d??? ??n (*)
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Th??ng tin c??c g??i ?????u t?? c???a d??? ??n (*)
                    </ButtonGuide>
                  )}
                  {/* {listOfChartStage &&
                    listOfChartStage.find((c) =>
                      c.lineList.find((line) => line.data.find((d) => d.valueOf() !== 0))
                    ) ? (
                      <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                        C???p nh???t giai ??o???n c???a d??? ??n
                      </ButtonGuide>
                    ) : (
                      <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                        C???p nh???t giai ??o???n c???a d??? ??n
                      </ButtonGuide>
                    )} */}

                  <Typography sx={{ paddingLeft: 2, pt: 2 }} variant="body1">
                    Th??ng tin b??? sung:
                  </Typography>

                  {abouts && abouts?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      Th??ng tin v??? doanh nghi???p c???a b???n
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      Th??ng tin v??? doanh nghi???p c???a b???n
                    </ButtonGuide>
                  )}
                  {press && press?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      ???? th??m c??c b??i vi???t li??n quan t???i d??? ??n
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      ???? th??m c??c b??i vi???t li??n quan t???i d??? ??n
                    </ButtonGuide>
                  )}
                  {faqs && faqs?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      ???? th??m c??c c??u h???i th?????ng g???p
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      ???? th??m c??c c??u h???i th?????ng g???p
                    </ButtonGuide>
                  )}
                  {hows && hows?.length > 0 ? (
                    <ButtonGuide startIcon={<Icon icon={checkmarkFill} />}>
                      ???? th??m c??c c??u c??ch th???c ho???t ?????ng
                    </ButtonGuide>
                  ) : (
                    <ButtonGuide color="error" startIcon={<Icon icon={circleXFill} />}>
                      ???? th??m c??c c??u c??ch th???c ho???t ?????ng
                    </ButtonGuide>
                  )}

                  <Typography sx={{ paddingLeft: 2, pt: 2, color: '#9c8515' }} variant="h6">
                    L??u ??:
                  </Typography>

                  <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                    (*) Nh???ng th??ng tin c???a d??? ??n: (T??n d??? ??n , m?? t??? , C??c th??ng s??? c???a d??? ??n ,
                    T???ng thanh kho???n, Th???i gian k??u g???i, G??i d??? ??n ?????u t??) kh??ng ???????c ch???nh s???a khi
                    d??? ??n ???? ???????c duy???t.
                  </Typography>
                  <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                    (*) Nh???ng th??ng tin kh??ng c?? ????nh d???u * c?? th??? ???????c ch???nh s???a khi d??? ??n ???? duy???t
                    b???i KROWD.
                  </Typography>
                </Box>

                <DialogActions>
                  <ButtonGuide color="error" variant="contained" onClick={handleCloseSubmit}>
                    ????ng
                  </ButtonGuide>
                  <ButtonGuide type="submit" variant="contained" onClick={handleSubmitProject}>
                    ????ng d??? ??n
                  </ButtonGuide>
                </DialogActions>
              </Dialog>
              <Dialog
                open={openGuide}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <DialogTitle>C??c b?????c t???o d??? ??n ?????u t??</DialogTitle>

                <Box sx={{ width: '600px', height: '690px', p: 2.5 }}>
                  <Typography sx={{ paddingLeft: 2, fontWeight: 600 }} variant="body1">
                    Th??ng tin c?? b???n c???a d??? ??n:
                  </Typography>
                  <ButtonGuide startIcon={<Icon icon={Step1} />}>
                    B?????c 1: C???p nh???t ???nh c???a d??? ??n
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step1} />}>
                    B?????c 2: C???p nh???t album ???nh c???a d??? ??n
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step2} />}>
                    B?????c 3: C???p nh???t th??ng tin n???i b???t cho d??? ??n
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step3} />}>
                    B?????c 4: C???p nh???t th??ng tin ti??u di???m cho d??? ??n
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step4} />}>
                    B?????c 5: C???p nh???t th??ng tin m??? r???ng c???a d??? ??n
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step5} />}>
                    B?????c 6: C???p nh???t th??ng tin t??i li???u c???a d??? ??n
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step6} />}>
                    B?????c 7: C???p nh???t g??i ?????u t?? c???a d??? ??n (t???i ??a: 3 g??i)
                  </ButtonGuide>

                  <Typography sx={{ paddingLeft: 2, pt: 2, fontWeight: 600 }} variant="body1">
                    Th??ng tin b??? sung:
                  </Typography>
                  <ButtonGuide startIcon={<Icon icon={Step7} />}>
                    B?????c 8: C???p nh???t th??ng tin v??? doanh nghi???p c???a b???n (About us)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step8} />}>
                    B?????c 9: C???p nh???t th??ng tin c??c b??i vi???t li??n quan t???i d??? ??n (Press)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step9} />}>
                    B?????c 10: C???p nh???t th??ng tin c??c c??u h???i th?????ng g???p (Faq)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step10} />}>
                    B?????c 11: C???p nh???t th??ng tin c??c c??ch th???c ho???t ?????ng (How it works)
                  </ButtonGuide>
                  <ButtonGuide startIcon={<Icon icon={Step11} />}>
                    B?????c 12: C???p nh???t th??ng tin giai ??o???n c???a d??? ??n (*)
                  </ButtonGuide>

                  <Typography sx={{ paddingLeft: 2, pt: 2, color: '#9c8515' }} variant="h6">
                    L??u ??:
                  </Typography>

                  <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                    (*) Nh???ng th??ng tin c???a d??? ??n: (T??n d??? ??n , m?? t??? , C??c th??ng s??? c???a d??? ??n ,
                    T???ng thanh kho???n, Th???i gian k??u g???i, G??i d??? ??n ?????u t??) kh??ng ???????c ch???nh s???a khi
                    d??? ??n ???? ???????c duy???t.
                  </Typography>
                  <Typography sx={{ paddingLeft: 0.4, pt: 2, color: '#9c8515' }} variant="body2">
                    (*) Nh???ng th??ng tin n??y s??? ???????c c??ng khai cho c??c nh?? ?????u t?? nh??n th???y h??y ?????m
                    b???o th??ng tin c???a b???n ??i???n
                  </Typography>
                </Box>

                <DialogActions>
                  <ButtonGuide color="error" variant="contained" onClick={handleCloseGuide}>
                    ????ng
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
                  N???i b???t
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
                          + Th??m m???i n???i b???t
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
                  B???n tin m???i
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
                      + Th??m m???i b???n tin
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
                  Ti??u ??i???m d??? ??n
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
                      + Th??m m???i ti??u ??i???m
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
                  Th??ng tin m??? r???ng
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
                  + M??? r???ng
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
                  T??i li???u d??? ??n
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
                  + T??i li???u
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
                  G??i ?????u t??
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
                  C??ch th???c ho???t ?????ng
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
                  + Th??m m???i c??ch th???c ho???t ?????ng
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
                Th??m m???i m???t b??i vi???t
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
                Th??m m???i m???t c??u h???i
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
              Giai ??o???n
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
                  D???ng b???ng
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
                  D???ng bi???u ?????
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
          title: 'B???N CH??A C?? D??? ??N',
          advise: 'H??y T???o d??? ??n m???i',
          ButtonGuide: true
        }
      : {
          title: 'CH??? KROWD DUY???T DOANH NGHI???P CHO B???N NHA!',
          advise: 'H??y th??? l???i sau khi ch??ng t??i duy???t doanh nghi???p c???a b???n',
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
