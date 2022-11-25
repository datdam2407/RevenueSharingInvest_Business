import { Box, Button, Card, Container, Dialog, Divider, Grid, Typography } from '@mui/material';
import { Project } from '../../../../@types/krowd/project';
import { dispatch, RootState, useSelector } from 'redux/store';
import { useState } from 'react';
import { getProjectEntityID } from 'redux/slices/krowd_slices/projectEnity';
import { Icon } from '@iconify/react';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import EntityAboutUpdate from '../enitities/EntityAboutUpdate';
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';

type AboutProps = {
  id: string;
  title: string;
  content: string | null;
  link: string | null;
  description: string | null;
};
type AboutListProps = {
  abouts: AboutProps[] | undefined;
  project: Project;
};
function ProjectDetailAboutBusiness({ abouts, project }: AboutListProps) {
  const { projectDetailBYID } = useSelector((state: RootState) => state.project);
  const [openAboutUpdateLink, setOpenAboutUpdateLink] = useState(false);
  const { user } = useAuth();
  const handleClickOpenAboutUpdateLink = async (ab: AboutProps) => {
    await dispatch(getProjectEntityID(ab.id));
    setOpenAboutUpdateLink(true);
  };
  const handleCloseAboutUpdateLink = () => {
    setOpenAboutUpdateLink(false);
  };
  return (
    <>
      {/* About */}
      <Container maxWidth={'lg'} sx={{ paddingBottom: '3rem' }}>
        <Box mb={7}>
          <Typography textAlign="center" py={1} color={'#666'} variant="h4">
            Về chúng tôi
          </Typography>
          <Box mx="auto" width={'10%'}>
            <Divider sx={{ my: 1, borderBottomWidth: 'thick', color: 'primary.main' }} />
          </Box>
        </Box>
        <Grid container display={'flex'} justifyContent={'space-evenly'}>
          <Grid>
            <Box
              mx={'auto'}
              mb={2}
              sx={{
                position: 'relative',
                width: '200px',
                height: '200px',
                overflow: 'hidden',
                borderRadius: '50%'
              }}
            >
              <img src={project?.business.image} style={{ width: '100%', height: 'auto' }} />
            </Box>

            <Typography
              variant="h4"
              textAlign={'center'}
            >{` ${project?.manager.firstName} ${project?.manager.lastName}`}</Typography>
            <Typography textAlign={'center'} py={1} color={'text.disabled'} variant="body1">
              Quản lý dự án
            </Typography>
          </Grid>
          <Grid>
            {abouts &&
              abouts
                .filter((ab) => ab.title !== 'Truyền thông')
                .slice(0, 3)
                .map((ab, i) => (
                  <Box key={i}>
                    <Button
                      href={`${ab.link}`}
                      target="_blank"
                      disabled={ab.link === null}
                      sx={{ opacity: ab.link ? 1 : 0.4 }}
                    >
                      <Card sx={{ borderRadius: '45% 0% 0% 45%', height: 100 }}>
                        <Grid
                          container
                          display={'flex'}
                          alignItems="center"
                          justifyContent={'center'}
                        >
                          <Grid sx={{ mt: 2.6 }}>
                            <img
                              style={{ borderRadius: '50%', width: 60 }}
                              src={`/static/icons/navbar/${ab.title}.png`}
                            />
                          </Grid>
                          <Grid>
                            <Typography textAlign={'center'} sx={{ mx: 2, mt: 4, width: 200 }}>
                              Theo dõi chúng tôi qua{' '}
                              <Typography textAlign={'center'} sx={{ fontWeight: '700' }}>
                                {ab.title}
                              </Typography>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Card>
                    </Button>
                    {/* {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && project.status === 'DRAFT' && ( */}
                    {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
                      <Box>
                        <Button
                          onClick={() => handleClickOpenAboutUpdateLink(ab)}
                          sx={{ color: '#ffc107' }}
                          startIcon={<Icon icon={editTwotone} />}
                        >
                          Cập nhật
                        </Button>

                        <Dialog maxWidth={false} open={openAboutUpdateLink}>
                          <EntityAboutUpdate
                            project={project}
                            closeDialog={handleCloseAboutUpdateLink}
                          />
                        </Dialog>
                      </Box>
                    )}
                  </Box>
                ))}
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ mb: 7 }}>
        <Divider variant="fullWidth" />
      </Box>
      {/* Press */}
    </>
  );
}
export default ProjectDetailAboutBusiness;
