import { Box, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { getProjectList } from 'redux/slices/krowd_slices/project';
import { dispatch, RootState, useSelector } from 'redux/store';
import { PATH_DASHBOARD, PATH_DASHBOARD_PROJECT } from 'routes/paths';
import { ACTION_TYPE, DATA_TYPE, KrowdTable, RowData } from '../../krowd-table/KrowdTable';
import eyeFill from '@iconify/icons-eva/eye-fill';

const STATUS = 'WAITING_TO_ACTIVATE';
const action = [
  {
    nameAction: 'view',
    action: PATH_DASHBOARD_PROJECT.project.root,
    icon: eyeFill,
    color: '#14b7cc',
    type: ACTION_TYPE.LINK
  }
];
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'center' },
  { id: 'name', label: 'TÊN DỰ ÁN', align: 'left' },
  { id: 'investedCapital', label: 'ĐÃ ĐẦU TƯ (VNĐ)', align: 'left' },
  { id: 'investmentTargetCapital', label: 'MỤC TIÊU (VNĐ)', align: 'left' },
  { id: 'startDate', label: 'NGÀY BẮT ĐẦU', align: 'left' },
  { id: 'endDate', label: 'NGÀY KẾT THÚC', align: 'left' },
  { id: '', label: 'THAO TÁC', align: 'center' }
];
export default function ActiveProjectTable() {
  const { BusinessProject } = useSelector((state: RootState) => state.project);
  const { listOfProject: list, isLoadingPoM, numOfProject } = BusinessProject;
  const { user } = useAuth();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;
  useEffect(() => {
    dispatch(getProjectList(user?.businessId, STATUS, pageIndex, 10));
  }, [dispatch]);

  const getData = (): RowData[] => {
    if (!list) return [];
    return list.map<RowData>((_item, _idx) => {
      return {
        id: _item.id,
        items: [
          {
            name: 'idx',
            value: _idx + 1,
            type: DATA_TYPE.NUMBER
          },
          {
            name: 'name',
            value: _item.name,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'investedCapital',
            value: _item.investedCapital,
            type: DATA_TYPE.NUMBER_FORMAT,
            textColor: 'primary.main'
          },
          {
            name: 'investmentTargetCapital',
            value: _item.investmentTargetCapital,
            type: DATA_TYPE.NUMBER_FORMAT,
            textColor: 'rgb(255, 127, 80)'
          },
          {
            name: 'startDate',
            value: _item.startDate,
            type: DATA_TYPE.DATE
          },
          {
            name: 'endDate',
            value: _item.endDate,
            type: DATA_TYPE.DATE
          }
        ]
      };
    });
  };

  return (
    <>
      <Box mb={7}>
        <Box my={2} sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Typography>
            <img style={{ width: '80px' }} src={businessDetail?.image} />
          </Typography>
          <Typography variant="h2">{businessDetail?.name}</Typography>
        </Box>
        <Box my={2}>
          <Typography variant="body2" color={'#9E9E9E'}>
            {businessDetail?.description}
          </Typography>
        </Box>
      </Box>
      <KrowdTable
        headingTitle="DỰ ÁN ĐANG CHỜ KÍCH HOẠT"
        header={TABLE_HEAD}
        getData={getData}
        isLoading={isLoadingPoM}
        viewPath={PATH_DASHBOARD.projects.projectDetails}
        actionsButton={action}
        paging={{
          pageIndex,
          pageSize: pageSize,
          numberSize: numOfProject,

          handleNext() {
            setPageIndex(pageIndex + 1);
          },
          handlePrevious() {
            setPageIndex(pageIndex - 1);
          }
        }}
      />
    </>
  );
}
