import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Divider,
  Grid,
  styled,
  Typography,
  Link,
  CardMedia
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
import { ROLE_USER_TYPE } from '../../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';

type PressProps = {
  id: string;
  title: string;
  content: string | null;
  link: string | null;
  description: string | null;
};
type PressListProps = {
  press: PressProps[] | undefined;
  project: Project;
};
function ProjectDetailPressBusiness({ press, project }: PressListProps) {
  const [openPressUpdateLink, setOpenPressUpdateLink] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const handleClickOpenPressUpdateLink = async (ab: PressProps) => {
    await dispatch(getProjectEntityID(ab.id));
    setOpenPressUpdateLink(true);
  };
  const handleClosePressUpdateLink = () => {
    setOpenPressUpdateLink(false);
  };
  const handleClickOpenPressDelete = async (v: PressProps) => {
    try {
      await ProjectAPI.delProjectEntityID({ id: v.id })
        .then(() => {
          enqueueSnackbar('Xóa bài viết thành công', {
            variant: 'success'
          });
        })
        .catch(() => {
          enqueueSnackbar('Xóa bài viết thất bại', {
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
        {press && press.length > 0 && (
          <Box mb={7}>
            <Typography textAlign="center" py={1} color={'#666'} variant="h4">
              Bài viết liên quan
            </Typography>
            <Box mx="auto" width={'10%'}>
              <Divider sx={{ my: 1, borderBottomWidth: 'thick', color: 'primary.main' }} />
            </Box>
          </Box>
        )}
        <Grid container gap={1} justifyContent={'space-evenly'} maxWidth={'false'}>
          {press &&
            press.map((f, i) => {
              const part = f.description?.split('\\gg20p');
              if (!part) return;
              const newspaperName = part[0];
              const publicDate = part[1].substring(0, 10).trim();
              const newLink = part[2];
              const content = f.content?.substring(0, 150).concat('...');
              return (
                <>
                  <Grid xs={12} sm={5} md={3} lg={3}>
                    <Link key={i} href={`${newLink}`} target="_blank" underline="none">
                      <Card
                        sx={{
                          width: '100%',
                          minHeight: 520,
                          maxHeight: 520,
                          boxShadow: '40px 40px 80px 0 20%',
                          alignItems: 'center'
                        }}
                      >
                        <CardMedia
                          style={{
                            display: 'center'
                          }}
                          component="img"
                          height={240}
                          src={`${f.link}`}
                        />
                        <Typography px={2} mt={2} mb={1} variant="h6">
                          {f.title}
                        </Typography>
                        <Typography px={2} mb={1} variant="body1" color={'text.disabled'}>
                          {newspaperName} · {publicDate}
                        </Typography>
                        <Typography px={2} mb={1} pb={2} variant="body2" color={'text.primary'}>
                          {content}
                        </Typography>
                      </Card>
                    </Link>
                    {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
                      <Grid container>
                        <Grid lg={6}></Grid>
                        <Grid container>
                          <Grid xs={8} sm={8} md={8} lg={8}>
                            <Button
                              sx={{ float: 'right', p: 2, color: '#ffc107' }}
                              onClick={() => handleClickOpenPressUpdateLink(f)}
                            >
                              Cập nhật
                            </Button>
                            <Dialog maxWidth={false} open={openPressUpdateLink}>
                              <EntityPressUpdate
                                project={project}
                                closeDialog={handleClosePressUpdateLink}
                              />
                            </Dialog>
                          </Grid>
                          <Grid xs={4} sm={4} md={4} lg={4}>
                            <Button
                              onClick={() => handleClickOpenPressDelete(f)}
                              sx={{ float: 'right', p: 2, color: 'red' }}
                            >
                              Xóa bài viết
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </>
              );
            })}
        </Grid>
      </Container>

      {/* Press */}
    </>
  );
}
export default ProjectDetailPressBusiness;
