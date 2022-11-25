// material

import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Button,
  Stack,
  Card,
  Divider,
  Dialog
} from '@mui/material';
// components
import { dispatch, RootState, useSelector } from 'redux/store';
import { Project } from '../../../../../@types/krowd/project';
import Label from 'components/Label';
import {
  delProjectPackageID,
  getPackageID,
  getProjectEntityID,
  getProjectPackage
} from 'redux/slices/krowd_slices/projectEnity';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/system';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { Icon } from '@iconify/react';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import EntityPackage from '../../enitities/EntityPackage';
import EntityUpdatePackage from '../../enitities/EntityUpdatePackage';
import { fCurrency } from 'utils/formatNumber';
import { ProjectAPI } from '_apis_/krowd_apis/project';
import { useSnackbar } from 'notistack';
import { getMyProject, getProjectId } from 'redux/slices/krowd_slices/project';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: theme.spacing(3)
  // [theme.breakpoints.up(414)]: {
  //   padding: theme.spacing(7)
  // }
}));
type Package = {
  id: string;
  name: string;
  projectId: string;
  price: number;
  quantity: number;
  descriptionList: string[];
};

export default function ProjectPackage({ project }: { project: Project }) {
  const [openPackage, setOpenPackage] = useState(false);
  const [openPackage2, setOpenPackage2] = useState(false);
  const { isLoading, packageLists } = useSelector((state: RootState) => state.projectEntity);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getProjectPackage(project.id));
  }, [dispatch]);

  // console.log(packageLists.listOfPackage);
  //Package

  const handleClickOpenPackage = () => {
    setOpenPackage(true);
  };
  const handleClosePackage = () => {
    setOpenPackage(false);
  };
  const handleClickOpenPackage2 = async (v: Package) => {
    await dispatch(getPackageID(v.id));
    setOpenPackage2(true);
  };
  const handleClickDeletePackage2 = async (v: Package) => {
    try {
      await ProjectAPI.delPackageID({ id: v.id })
        .then(() => {
          enqueueSnackbar('Xóa gói đầu tư thành công', {
            variant: 'success'
          });
        })
        .catch(() => {
          enqueueSnackbar('Xóa gói đầu tư thất bại', {
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
  const handleClosePackage2 = () => {
    setOpenPackage2(false);
  };
  return (
    <>
      <RootStyle>
        {/* {(isLoading && (
          <Box>
            <CircularProgress
              size={100}
              sx={{ margin: '0px auto', padding: '1rem', display: 'flex' }}
            />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
              Đang tải dữ liệu, vui lòng đợi giây lát...
            </Typography>
          </Box>
        )) || ( */}
        <Grid>
          <Grid sx={{ mt: 1, my: 3 }}>
            {packageLists.listOfPackage &&
              packageLists.listOfPackage.length > 0 &&
              packageLists.listOfPackage.map((e, index) => (
                <Grid sx={{ p: 2 }} item key={index} xs={12} sm={12} md={12} lg={12}>
                  <Typography
                    variant="overline"
                    sx={{ display: 'flex', color: 'text.secondary', justifyContent: 'center' }}
                  >
                    {e.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    {index === 1 || index === 2 ? (
                      <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}></Typography>
                    ) : (
                      ''
                    )}
                    <Typography variant="h4" sx={{ mx: 1 }}>
                      {e.price === 0 ? 'Free' : fCurrency(e.price)}
                    </Typography>
                    {index === 1 || index === 2 ? (
                      <Typography
                        gutterBottom
                        component="span"
                        variant="subtitle2"
                        sx={{
                          alignSelf: 'flex-end',
                          color: 'text.secondary'
                        }}
                      ></Typography>
                    ) : (
                      ''
                    )}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      textTransform: 'capitalize',
                      justifyContent: 'center',
                      display: 'flex'
                    }}
                  >
                    (VND)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'primary.main',
                      textTransform: 'capitalize',
                      justifyContent: 'center',
                      display: 'flex'
                    }}
                  >
                    Số lượng {e.quantity}
                  </Typography>

                  <Stack
                    paddingLeft={0}
                    textAlign={'left'}
                    component="ul"
                    spacing={2}
                    sx={{ my: 5, width: 1 }}
                  >
                    {e.descriptionList.map((item, i) => (
                      <Stack
                        key={i}
                        component="li"
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{
                          typography: 'body2'
                        }}
                      >
                        <Box>
                          <Box
                            component={Icon}
                            icon={checkmarkFill}
                            sx={{ width: 20, height: 20 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2">{item}</Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                  {(project.status === 'DRAFT' || project.status === 'DENIED') && (
                    <Stack direction="row" justifyContent="flex-end" sx={{ mx: 3, mb: 3 }}>
                      <Button
                        size="large"
                        color="error"
                        startIcon={<Icon icon={trash2Fill} />}
                        onClick={() => handleClickDeletePackage2(e)}
                      >
                        Xóa
                      </Button>
                      <Button
                        size="large"
                        color={'warning'}
                        startIcon={<Icon icon={editTwotone} />}
                        onClick={() => handleClickOpenPackage2(e)}
                      >
                        Cập nhật
                      </Button>
                      <Dialog maxWidth={false} open={openPackage2} onClose={handleClosePackage2}>
                        <EntityUpdatePackage project={project} closeDialog={handleClosePackage2} />
                      </Dialog>
                    </Stack>
                  )}
                  <Divider sx={{ my: 3 }} variant="fullWidth" />
                </Grid>
              ))}
          </Grid>
        </Grid>
        {/* )} */}
        {(project.status === 'DRAFT' || project.status === 'DENIED') &&
          packageLists.listOfPackage.length < 3 && (
            <Box width={'100%'}>
              <Button
                fullWidth
                sx={{ mb: 2 }}
                variant="contained"
                onClick={handleClickOpenPackage}
                color={'primary'}
              >
                + Gói đầu tư
              </Button>
              <Dialog maxWidth={false} open={openPackage} onClose={handleClosePackage}>
                <EntityPackage project={project} closeDialog={handleClosePackage} />
              </Dialog>
            </Box>
          )}
      </RootStyle>
    </>
  );
}
