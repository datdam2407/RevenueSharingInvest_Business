import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  styled,
  Typography
} from '@mui/material';
import exclamationCircleOutlined from '@iconify/icons-ant-design/exclamation-circle-outlined';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import EntityExtension from '../enitities/EntityExtension';
import { Project, ProjectEntityUpdate } from '../../../../@types/krowd/project';
import { useLocation, useParams } from 'react-router';
import { paramCase } from 'change-case';
import { dispatch, RootState } from 'redux/store';
import {
  getAllProjectEntity,
  getProjectEntityID,
  getProjectEntityIDUpdate
} from 'redux/slices/krowd_slices/projectEnity';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'react-redux';
import EntityExtensionUpdate from '../enitities/EntityExtensionUpdate';
const AccordionStyle = styled(Accordion)(() => ({
  '&.noBorder': {
    boxShadow: 'none',
    paddingLeft: 0
  }
}));
type ExtensionProps = {
  id: string;
  title: string;
  link: string;
  content: string;
  description: string;
  priority: number;
};
type ExtensionListProps = {
  extensions: ExtensionProps[];
  project: Project;
};
function ProjectDetailExtension({ extensions, project }: ExtensionListProps) {
  const [expanded, setExpanded] = useState(-1);
  const [openExtension, setOpenExtension] = useState(false);
  const [openExtension2, setOpenExtension2] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    dispatch(getAllProjectEntity(project.id));
  }, [dispatch]);

  const handleClickOpenExtension2 = async (v: ExtensionProps) => {
    await dispatch(getProjectEntityID(v.id));
    setOpenExtension2(true);
  };
  const handleClickOpenExtension = () => {
    setOpenExtension(true);
  };
  const handleCloseExtension = () => {
    setOpenExtension(false);
  };
  const handleCloseExtension2 = () => {
    setOpenExtension2(false);
  };
  const handleChange = (panel: number, isCollapse: boolean) => {
    if (isCollapse || panel === -1) setExpanded(panel);
  };
  return (
    <>
      <Box>
        {extensions.map((v, i) => {
          const isHaveDescription = v.description !== null;
          const isExpanded = expanded === i;
          return (
            <Box key={i} my={1}>
              <Grid container>
                <Grid lg={11}>
                  <AccordionStyle
                    elevation={0}
                    expanded={isExpanded}
                    onMouseOver={() => handleChange(i, isHaveDescription)}
                    classes={{ root: 'noBorder' }}
                    onMouseLeave={() => handleChange(-1, isHaveDescription)}
                  >
                    <AccordionSummary id={v.title} sx={{ p: 0 }}>
                      <Box>
                        <Box display={'flex'} alignItems={'flex-end'}>
                          <Typography variant="body2">{v.title}</Typography>
                          {isHaveDescription && (
                            <Typography
                              ml={1}
                              color={isExpanded ? 'primary.main' : 'text.secondary'}
                            >
                              <Icon icon={exclamationCircleOutlined} width={17} />
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body1" fontWeight={'bold'} mt={1}>
                          {v.content}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    {isHaveDescription && (
                      <AccordionDetails sx={{ p: 0 }}>
                        <Typography>{v.description}</Typography>
                      </AccordionDetails>
                    )}
                  </AccordionStyle>
                </Grid>

                {((user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT') ||
                  project.status === 'DENIED') && (
                  <Grid lg={1}>
                    <Box>
                      <Button
                        onClick={() => handleClickOpenExtension2(v)}
                        sx={{ color: '#ffc107' }}
                        startIcon={<Icon icon={editTwotone} />}
                      />
                      <Dialog
                        maxWidth={false}
                        open={openExtension2}
                        onClose={handleCloseExtension2}
                      >
                        <EntityExtensionUpdate
                          project={project}
                          closeDialog={handleCloseExtension2}
                        />
                      </Dialog>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Box width={'50%'}>
                <Divider sx={{ color: 'text.disabled', my: 0.5 }} variant="fullWidth" />
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT' && (
        <Grid lg={12} my={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleClickOpenExtension}
            color={'primary'}
          >
            + Mở rộng
          </Button>
          <Dialog maxWidth={false} open={openExtension} onClose={handleCloseExtension}>
            <EntityExtension project={project} closeDialog={handleCloseExtension} />
          </Dialog>
        </Grid>
      )} */}
    </>
  );
}
export default ProjectDetailExtension;
