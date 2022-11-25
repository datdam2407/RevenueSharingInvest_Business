import profileOutlined from '@iconify/icons-ant-design/profile-outlined';
import { Icon } from '@iconify/react';
import {
  Box,
  Divider,
  Typography,
  Link as MuiLink,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogTitle
} from '@mui/material';
import { Project } from '../../../../@types/krowd/project';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { useState } from 'react';
import EntityDocument from '../enitities/EntityDocument';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';
import EnityUpdateDocumnet from '../enitities/EnityUpdateDocumnet';
import { dispatch, RootState } from 'redux/store';
import { getProjectEntityID } from 'redux/slices/krowd_slices/projectEnity';
import { ProjectAPI } from '_apis_/krowd_apis/project';
import { useSnackbar } from 'notistack';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';

type DocumentProps = {
  id: string;
  title: string;
  link: string;
  content: string;
  description: string;
};
type DocumentListProps = {
  documents: DocumentProps[];
  project: Project;
};
function ProjectDetailDocument({ documents, project }: DocumentListProps) {
  const { user } = useAuth();
  const [openDelDocument, setDeleteDocument] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { projectEntityDetail } = useSelector((State: RootState) => State.projectEntity);
  //Document
  const handleClickOpenDocumentDeleteModal = async (v: DocumentProps) => {
    try {
      dispatch(getProjectEntityID(v.id));

      await ProjectAPI.delProjectEntityID({ id: v.id })
        .then(() => {
          enqueueSnackbar('Xóa tài liệu thành công', {
            variant: 'success'
          });
        })
        .catch(() => {
          enqueueSnackbar('Xóa tài liệu thất bại', {
            variant: 'error'
          });
        })
        .finally(() => {
          setDeleteDocument(false);
          dispatch(getProjectId(project?.id));
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpenDocumentDelete = async (v: DocumentProps) => {
    try {
      dispatch(getProjectEntityID(v.id));

      await ProjectAPI.delProjectEntityID({ id: v.id })
        .then(() => {
          enqueueSnackbar('Xóa thành công', {
            variant: 'success'
          });
        })
        .catch(() => {
          enqueueSnackbar('Xóa thất bại', {
            variant: 'error'
          });
        })
        .finally(() => {
          setDeleteDocument(false);
          dispatch(getProjectId(project?.id));
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleCloseDocumentDelete = () => {
    setDeleteDocument(false);
  };
  return (
    <>
      <Box border={'thin double'} borderRadius={1} borderColor="#eee" py={2} px={2} my={3}>
        <Typography variant="body2" color={'text.secondary'} py={2}>
          Tài liệu doanh nghiệp
        </Typography>
        {documents.map((v, i) => (
          <Box display={'flex'} key={i} my={2} height={50} alignItems="center">
            <Grid container>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <MuiLink
                  color={'text.primary'}
                  fontWeight="bold"
                  underline="none"
                  href={v.link || '#'}
                  target="_blank"
                >
                  <Icon icon={profileOutlined} width={30} style={{ marginRight: '15px' }} />
                  {v.title}
                </MuiLink>
              </Grid>

              {((user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT') ||
                project.status === 'DENIED') && (
                <Grid xs={12} sm={6} md={6} lg={6}>
                  <HeaderBreadcrumbs
                    heading={''}
                    links={[{ name: `` }]}
                    action={
                      <Box>
                        <Button
                          sx={{ color: '#ff3030' }}
                          startIcon={<Icon icon={trash2Fill} />}
                          onClick={() => handleClickOpenDocumentDeleteModal(v)}
                        />
                        <Dialog open={openDelDocument} onClose={handleCloseDocumentDelete}>
                          <DialogTitle>Bạn có chắc xóa tài liệu này {v.title} ?</DialogTitle>
                          <DialogActions>
                            <Button
                              color="error"
                              variant="contained"
                              onClick={handleCloseDocumentDelete}
                            >
                              Đóng
                            </Button>
                            <LoadingButton
                              type="submit"
                              variant="contained"
                              onClick={() => handleClickOpenDocumentDelete(v)}
                            >
                              Xóa tài liệu
                            </LoadingButton>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        ))}
        {/* {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT' && (
          <Grid xs={12} sm={12} md={12} lg={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleClickOpenDocuments}
              color={'primary'}
            >
              + Tài liệu
            </Button>
            <Dialog maxWidth={false} open={openDocument} onClose={handleCloseDocument}>
              <EntityDocument project={project} closeDialog={handleCloseDocument} />
            </Dialog>
          </Grid>
        )} */}
      </Box>
    </>
  );
}
export default ProjectDetailDocument;
