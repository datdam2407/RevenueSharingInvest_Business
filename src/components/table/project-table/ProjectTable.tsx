import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { getProjectList } from 'redux/slices/krowd_slices/project';
import { dispatch, RootState, useSelector } from 'redux/store';
import { PATH_DASHBOARD_PROJECT } from 'routes/paths';
import { ACTION_TYPE, DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import { Box, Typography } from '@mui/material';
import { fCurrency } from 'utils/formatNumber';
import eyeFill from '@iconify/icons-eva/eye-fill';

const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'left' },
  { id: 'name', label: 'TÊN DỰ ÁN', align: 'left' },
  { id: 'fieldName', label: 'LĨNH VỰC', align: 'left' },
  { id: 'investmentTargetCapital', label: 'MỤC TIÊU KÊU GỌI', align: 'left' },
  { id: 'createDate', label: 'NGÀY TẠO', align: 'left' },
  { id: 'status', label: 'TRẠNG THÁI', align: 'left' },
  { id: '', label: 'THAO TÁC', align: 'center' }
];

const action = [
  {
    nameAction: 'view',
    action: PATH_DASHBOARD_PROJECT.project.root,
    icon: eyeFill,
    color: '#14b7cc',
    type: ACTION_TYPE.LINK
  }
];
export default function ProjectTable() {
  const { BusinessProject } = useSelector((state: RootState) => state.project);
  const { listOfProject: list, isLoadingPoM, numOfProject } = BusinessProject;
  const { user } = useAuth();
  const { businessDetailState } = useSelector((state: RootState) => state.business);
  const { businessDetail, isLoading } = businessDetailState;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    dispatch(getProjectList(user?.businessId, '', pageIndex, 10));
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
            name: 'fieldName',
            value: _item.fieldName,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'investmentTargetCapital',
            value: `${fCurrency(_item.investmentTargetCapital)}đ`,
            type: DATA_TYPE.NUMBER,
            textColor: '#14b7cc'
          },

          {
            name: 'createDate',
            value: _item.createDate,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'status',
            value:
              (_item.status === 'CLOSED' && 'Đã đóng') ||
              (_item.status === 'ACTIVE' && 'Đang hoạt động') ||
              (_item.status === 'WAITING_TO_ACTIVATE' && 'Đang chờ hoạt động') ||
              (_item.status === 'CALLING_TIME_IS_OVER' && 'Đã quá hạn đầu tư') ||
              (_item.status === 'CALLING_FOR_INVESTMENT' && 'Đang kêu gọi đầu tư') ||
              (_item.status === 'WAITING_TO_PUBLISH' && 'Đang chờ công khai') ||
              (_item.status === 'DENIED' && 'Đã bị từ chối') ||
              (_item.status === 'WAITING_FOR_APPROVAL' && 'Đang chờ duyệt') ||
              (_item.status === 'DRAFT' && 'Bản nháp'),
            type: DATA_TYPE.TEXT,
            textColor:
              (_item.status === 'CALLING_FOR_INVESTMENT' && '#14b7cc') ||
              (_item.status === 'DRAFT' && 'black') ||
              (_item.status === 'WAITING_FOR_APPROVAL' && '#eacb00') ||
              (_item.status === 'WAITING_TO_ACTIVATE' && '#4dc0b5') ||
              (_item.status === 'ACTIVE' && 'green') ||
              (_item.status === 'WAITING_TO_PUBLISH' && '#f66d9b') ||
              (_item.status === 'CLOSED' && '#6574cd') ||
              (_item.status === 'DENIED' && 'red') ||
              (_item.status === 'CALLING_TIME_IS_OVER' ? 'red' : 'black')
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
        headingTitle="tất cả dự án"
        header={TABLE_HEAD}
        getData={getData}
        isLoading={isLoadingPoM}
        // viewPath={PATH_DASHBOARD_PROJECT.project.root}
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
