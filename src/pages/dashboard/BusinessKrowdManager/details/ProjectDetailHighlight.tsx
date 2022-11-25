import { Icon } from '@iconify/react';
import { Box, Button, Dialog, Divider, Grid, styled, Typography } from '@mui/material';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';

import parse from 'html-react-parser';
import { useState } from 'react';
import EntityHighLight from '../enitities/EntityHighLight';
import { Project } from '../../../../@types/krowd/project';
import EntityHighLightUpdate from '../enitities/EntityHighLightUpdate';
import { dispatch } from 'redux/store';
import { getProjectEntityID } from 'redux/slices/krowd_slices/projectEnity';
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

type HighlightProps = {
  id: string;
  title: string;
  link: string;
  content: string;
  description: string;
};
type HighlightListProps = {
  highlights: HighlightProps[];
  project: Project;
};
function ProjectDetailHighlight({ highlights, project }: HighlightListProps) {
  const [openHighLight, setOpenHighLight] = useState(false);
  const [openHighLight2, setOpenHighLight2] = useState(false);
  const { user } = useAuth();

  //highlight
  const handleClickOpenHighLight = () => {
    setOpenHighLight(true);
  };
  const handleClickOpenHighLight2 = async (v: HighlightProps) => {
    await dispatch(getProjectEntityID(v.id));
    setOpenHighLight2(true);
  };
  const handleCloseHighLight = () => {
    setOpenHighLight2(false);
  };
  const getHighLightListByTitle = (title: 'List' | 'Card') => {
    if (!highlights) return;
    return highlights.find((value) => value.title === title);
  };

  const { list } = {
    list: getHighLightListByTitle('List')
  };
  return (
    <>
      {highlights &&
        highlights.length > 0 &&
        highlights.map((v, i) => {
          return (
            <Box key={i}>
              <Typography
                sx={{ pb: 0.1, pr: 5, my: 6 }}
                variant="h6"
                color={'text.secondary'}
                fontWeight={100}
              >
                {list && list.content && <FixQL>{parse(list.content)}</FixQL>}
              </Typography>
              <Grid container>
                <Grid xs={12} sm={9} md={9} lg={9}></Grid>

                <Grid>
                  <HeaderBreadcrumbs
                    heading={''}
                    links={[{ name: `` }]}
                    action={
                      <>
                        {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && (
                          <Box>
                            <Button
                              sx={{ mx: 3 }}
                              variant="contained"
                              onClick={() => handleClickOpenHighLight2(v)}
                              color={'warning'}
                              startIcon={<Icon icon={editTwotone} />}
                            >
                              Cập nhật nổi bật
                            </Button>
                            <Dialog maxWidth={false} open={openHighLight2}>
                              <EntityHighLightUpdate
                                closeDialog={handleCloseHighLight}
                                project={project}
                              />
                            </Dialog>
                          </Box>
                        )}
                      </>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          );
        })}
    </>
  );
}
export default ProjectDetailHighlight;
