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
import EntityPressUpdate from '../enitities/EntityPressUpdate';
import { ProjectAPI } from '_apis_/krowd_apis/project';
import { useSnackbar } from 'notistack';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';
import { MotionInView, varFadeIn } from 'components/animate';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import EntityFAQsUpdate from '../enitities/EntityFAQsUpdate';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';
type FAQSProps = {
  id: string;
  title: string;
  content: string | null;
  link: string | null;
  description: string | null;
};
type FAQSListProps = {
  faqs: FAQSProps[] | undefined;
  project: Project;
};
function ProjectDetailFAQsBusiness({ faqs, project }: FAQSListProps) {
  const [openPressUpdateLink, setOpenPressUpdateLink] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [openFAQs, setOpenopenFAQs] = useState(false);
  const { user } = useAuth();
  const handleClickOpenFAQs = async (v: FAQSProps) => {
    await dispatch(getProjectEntityID(v.id));
    setOpenopenFAQs(true);
  };
  const handleCloseFAQs = () => {
    setOpenopenFAQs(false);
  };
  const handleClickOpenFAQsDelete = async (v: FAQSProps) => {
    try {
      await ProjectAPI.delProjectEntityID({ id: v.id })
        .then(() => {
          enqueueSnackbar('Xóa câu hỏi thành công', {
            variant: 'success'
          });
        })
        .catch(() => {
          enqueueSnackbar('Xóa câu hỏi thất bại', {
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
      <Container maxWidth={false} sx={{ paddingBottom: '5rem' }}>
        {faqs && faqs.length > 0 && (
          <Box mb={7}>
            <Typography textAlign="center" py={1} color={'#666'} variant="h4">
              Câu hỏi thắc mắc
            </Typography>
            <Box mx="auto" width={'10%'}>
              <Divider sx={{ my: 1, borderBottomWidth: 'thick', color: 'primary.main' }} />
            </Box>
          </Box>
        )}
        {faqs &&
          faqs.map((fqs, i) => (
            <>
              <Grid key={i} container>
                <Grid lg={3}></Grid>
                <Grid lg={6}>
                  <MotionInView variants={varFadeIn}>
                    <Accordion>
                      <AccordionSummary
                        style={{ paddingTop: '1rem', paddingBottom: '1rem', color: '#251E18' }}
                        expandIcon={<Icon icon={arrowIosDownwardFill} width={20} height={20} />}
                      >
                        <Typography variant="subtitle1">+ {fqs.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{fqs.content}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  </MotionInView>
                </Grid>
                {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
                  <Grid lg={1}>
                    <Box>
                      <Button
                        onClick={() => handleClickOpenFAQs(fqs)}
                        sx={{ color: '#ffc107', mt: 2.5 }}
                        startIcon={<Icon icon={editTwotone} />}
                      >
                        Cập nhật
                      </Button>
                      <Dialog maxWidth={false} open={openFAQs} onClose={handleCloseFAQs}>
                        <EntityFAQsUpdate project={project} closeDialog={handleCloseFAQs} />
                      </Dialog>
                    </Box>
                    <Grid>
                      <Button onClick={() => handleClickOpenFAQsDelete(fqs)} sx={{ color: 'red' }}>
                        Xóa câu hỏi
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          ))}
      </Container>
    </>
  );
}
export default ProjectDetailFAQsBusiness;
