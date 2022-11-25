import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Container,
  Box,
  Grid,
  Button,
  Dialog
} from '@mui/material';
import { height } from '@mui/system';
import { Project } from '../../../../@types/krowd/project';
import { dispatch, RootState, useSelector } from 'redux/store';
import { useState } from 'react';
import { getProjectEntityID } from 'redux/slices/krowd_slices/projectEnity';
import { Icon } from '@iconify/react';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import trash from '@iconify/icons-eva/trash-2-fill';
import EntityPressUpdate from '../enitities/EntityPressUpdate';
import { ProjectAPI } from '_apis_/krowd_apis/project';
import { useSnackbar } from 'notistack';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import { MotionInView, varFadeIn } from 'components/animate';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import EntityHOWSUpdate from '../enitities/EntityHOWSUpdate';
import useAuth from 'hooks/useAuth';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
type HOWSPROPS = {
  id: string;
  title: string;
  content: string | null;
  link: string | null;
  description: string | null;
};
type HOWSListProps = {
  hows: HOWSPROPS[] | undefined;
  project: Project;
};
function ProjectDetailHowItWorks({ hows, project }: HOWSListProps) {
  const [openPressUpdateLink, setOpenPressUpdateLink] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [openHOWS, setOpenopenHOWS] = useState(false);
  const { user } = useAuth();
  const handleClickOpenHOWS = async (v: HOWSPROPS) => {
    await dispatch(getProjectEntityID(v.id));
    setOpenopenHOWS(true);
  };
  const handleCloseHOWS = () => {
    setOpenopenHOWS(false);
  };
  const handleClickOpenHOWsDelete = async (v: HOWSPROPS) => {
    try {
      await ProjectAPI.delProjectEntityID({ id: v.id })
        .then(() => {
          enqueueSnackbar('Xóa cách thức hoạt động thành công', {
            variant: 'success'
          });
        })
        .catch(() => {
          enqueueSnackbar('Xóa cách thức hoạt độngthất bại', {
            variant: 'error'
          });
        })
        .finally(() => {
          dispatch(getProjectId(project?.id));
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {/* Press */}
      {hows &&
        hows.map((hiw, i) => (
          <>
            <Grid key={i} container>
              <Grid xs={11} sm={11} md={11} lg={11}>
                <MotionInView sx={{ pb: 2 }} variants={varFadeIn}>
                  <Accordion>
                    <AccordionSummary
                      style={{
                        color: '#251E18',
                        paddingLeft: '1rem',
                        display: 'inline-flex',
                        flexDirection: 'row-reverse'
                      }}
                      expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                    >
                      <Typography variant="subtitle1">{hiw.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{hiw.content}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </MotionInView>
              </Grid>
              {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
                <Grid lg={1}>
                  <Box>
                    <Button
                      onClick={() => handleClickOpenHOWS(hiw)}
                      sx={{ color: '#ffc107', mt: 2.5 }}
                      startIcon={<Icon icon={editTwotone} />}
                    />
                    <Dialog maxWidth={false} open={openHOWS} onClose={handleCloseHOWS}>
                      <EntityHOWSUpdate project={project} closeDialog={handleCloseHOWS} />
                    </Dialog>
                  </Box>
                  <Grid>
                    <Button
                      startIcon={<Icon icon={trash} />}
                      onClick={() => handleClickOpenHOWsDelete(hiw)}
                      sx={{ color: 'red' }}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </>
        ))}
    </>
  );
}
export default ProjectDetailHowItWorks;
