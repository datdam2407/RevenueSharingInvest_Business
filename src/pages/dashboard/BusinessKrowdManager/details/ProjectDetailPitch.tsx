import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Grid,
  styled,
  Typography
} from '@mui/material';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import parse from 'html-react-parser';
import { useState } from 'react';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import { Project } from '../../../../@types/krowd/project';
import EntityPitch from '../enitities/EntityPitch';
import EntityUpdatePitch from '../enitities/EntityUpdatePitch';
import { dispatch } from 'redux/store';
import { delProjectEntityID, getProjectEntityID } from 'redux/slices/krowd_slices/projectEnity';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import { ProjectAPI } from '_apis_/krowd_apis/project';
import _ from 'lodash';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';
const FixQL = styled('div')(() => ({
  '.ql-align-center': {
    textAlign: 'center'
  },
  '.ql-align-right': {
    textAlign: 'right'
  },
  '.ql-align-justify': {
    textAlign: 'justify'
  },
  blockquote: {
    background: '#f9f9f9',
    borderLeft: '10px solid #ccc',
    margin: '1.5em 10px',
    padding: '0.5em 10px',
    quotes: '201C 201D 2018 2019'
  },
  'blockquote:before': {
    color: '#ccc',
    content: 'open-quote',
    fontSize: '4em',
    lineHeight: '0.1em',
    marginRight: '0.25em',
    verticalAlign: '-0.4em'
  },
  'blockquote p': {
    display: 'inline'
  },
  '.ql-video': {
    width: '100%',
    height: '500px'
  }
}));
const NavbarTopAnchor = styled('div')(() => ({
  display: 'block',
  position: 'relative',
  top: '-100px',
  visibility: 'hidden'
}));
const NavbarBottomAnchor = styled('div')(() => ({
  display: 'block',
  position: 'relative',
  top: '10px',
  visibility: 'hidden'
}));
const NavbarTopClickAnchor = styled('div')(() => ({
  display: 'block',
  position: 'relative',
  top: '-140px',
  visibility: 'hidden'
}));
type PitchProps = {
  id: string;
  title: string;
  link: string;
  content: string;
  description: string;
};
type PitchListProps = {
  pitchs: PitchProps[];
  project: Project;
};
function ProjectDetailPitch({ pitchs, project }: PitchListProps) {
  const [openPitch, setOpenPitch] = useState(
    pitchs.map((_p) => {
      return {
        id: _p.id,
        open: false
      };
    }) ?? [{ id: '', open: false }]
  );
  const [openDeletePitch, setDeletePitch] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const handleClickOpenPitchUpdate = async (v: PitchProps) => {
    await dispatch(getProjectEntityID(v.id));
    const tempOpenPitchs = [...openPitch];
    tempOpenPitchs.find((_v) => _v.id === v.id)!.open = true;
    setOpenPitch(tempOpenPitchs);
  };
  const handleClickOpenPitchDelete = async (v: PitchProps) => {
    try {
      await ProjectAPI.delProjectEntityID({ id: v.id })
        .then(() => {
          enqueueSnackbar('Xóa tiêu điểm thành công', {
            variant: 'success'
          });
        })
        .catch(() => {
          enqueueSnackbar('Xóa tiêu điểm thất bại', {
            variant: 'error'
          });
        })
        .finally(() => {
          setDeletePitch(false);
          dispatch(getProjectId(project?.id));
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleClosePitchDelete = () => {
    setDeletePitch(false);
  };
  const handleClosePitchUpdate = (id: string) => {
    const tempOpenPitchs = [...openPitch];
    tempOpenPitchs.find((_v) => _v.id === id)!.open = false;
    setOpenPitch(tempOpenPitchs);
  };

  return (
    <>
      {pitchs &&
        pitchs.map(
          (v, i) =>
            v && (
              <Box key={i} my={5} py={0.4}>
                <Grid container>
                  <Box pb={2}>
                    <Typography variant="h4" color={'#666'} height={50}>
                      {`${i + 1}. ${v.title}`}
                      <Box width={'10%'}>
                        <NavbarTopClickAnchor
                          id={`__navbarTopClick_${v.id}`}
                        ></NavbarTopClickAnchor>
                        <Divider variant="fullWidth" sx={{ my: 1, opacity: 0.1 }} />
                      </Box>
                    </Typography>
                  </Box>
                  <Grid xs={12} sm={11} md={11} lg={11}>
                    {v.content && <FixQL>{parse(v.content)}</FixQL>}
                  </Grid>
                  {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
                    <Grid xs={12} sm={1} md={1} lg={1}>
                      <HeaderBreadcrumbs
                        heading={''}
                        links={[{ name: `` }]}
                        action={
                          <>
                            <Box>
                              <Button
                                data-target={`#dialog__${v.id}`}
                                onClick={() => handleClickOpenPitchUpdate(v)}
                                sx={{ color: '#ffc107' }}
                                startIcon={<Icon icon={editTwotone} />}
                              />
                              <Dialog
                                id={`dialog__${v.id}`}
                                maxWidth={false}
                                open={openPitch.find((_v) => _v.id === v.id)!.open ?? false}
                                onClose={() => handleClosePitchUpdate(v.id)}
                              >
                                <EntityUpdatePitch
                                  pitch={v}
                                  project={project}
                                  closeDialog={() => handleClosePitchUpdate(v.id)}
                                />
                              </Dialog>
                            </Box>
                            <Box>
                              <Button
                                sx={{ color: '#ff3030' }}
                                startIcon={<Icon icon={trash2Fill} />}
                                onClick={() => handleClickOpenPitchDelete(v)}
                                // onClick={() => setDeletePitch(true)}
                              />

                              {/* <Dialog
                                open={openDeletePitch}
                                onClose={handleClosePitchDelete}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                              >
                                <DialogTitle>Bạn có muốn xóa tiêu điểm?</DialogTitle>
                                <DialogActions>
                                  <Button onClick={handleClosePitchDelete}>Hủy</Button>
                                  <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    onClick={() => handleClickOpenPitchDelete(v)}
                                  >
                                    Xóa
                                  </LoadingButton>
                                </DialogActions>
                              </Dialog> */}
                            </Box>
                          </>
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            )
        )}
    </>
  );
}
export default ProjectDetailPitch;
