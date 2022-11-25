import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { dispatch, RootState, useSelector } from 'redux/store';
import { PATH_DASHBOARD_PROJECT } from 'routes/paths';
import { ACTION_TYPE, DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import { getProjectByPoM } from 'redux/slices/krowd_slices/project';
import { fCurrency2 } from 'utils/formatNumber';
import BusinessProjectForm from 'pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/BusinessProjectForm';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { getProjectStageID } from 'redux/slices/krowd_slices/stage';

const TABLE_HEAD = [
  { id: 'name', label: 'TÊN DỰ ÁN', align: 'left' },
  { id: 'fieldName', label: 'LĨNH VỰC', align: 'left' },
  { id: 'investmentTargetCapital', label: 'MỤC TIÊU KÊU GỌI', align: 'left' },
  { id: 'buinvestedCapitalsinessName', label: 'SỐ TIỀN ĐÃ KÊU GỌI', align: 'left' },
  { id: 'remainingPayableAmount', label: 'PHẢI TRẢ TỐI THIỂU', align: 'left' },
  { id: 'remainingMaximumPayableAmount', label: 'PHẢI TRẢ TỐI ĐA', align: 'left' },
  { id: 'status', label: 'TRẠNG THÁI', align: 'left' },
  { id: '', label: 'CHI TIẾT', align: 'center' }
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
export default function ProjectTablePoM() {
  const { PoMProject } = useSelector((state: RootState) => state.project);
  const { listOfProject: list, isLoadingPoM, numOfProject } = PoMProject;
  const { user } = useAuth();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    dispatch(getProjectByPoM(user?.businessId, '', pageIndex, 10));
  }, [dispatch]);

  const getData = (): RowData[] => {
    if (!list) return [];
    return list.map<RowData>((_item, _idx) => {
      return {
        id: _item.id,
        items: [
          {
            name: 'name',
            value: _item.name,
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
          },
          {
            name: 'fieldName',
            value: _item.fieldName,
            type: DATA_TYPE.TEXT
          },

          {
            name: 'investmentTargetCapital',
            value: `${fCurrency2(_item.investmentTargetCapital)}đ`,
            type: DATA_TYPE.NUMBER_FORMAT,
            textColor: '#14b7cc'
          },
          {
            name: 'investedCapital',
            value: `${fCurrency2(_item.investedCapital)}đ`,
            type: DATA_TYPE.NUMBER_FORMAT,
            textColor: '#14b7cc'
          },
          {
            name: 'remainingPayableAmount',
            value: `${fCurrency2(_item.remainingPayableAmount)}đ`,
            type: DATA_TYPE.NUMBER_FORMAT,
            textColor: '#000000'
          },
          {
            name: 'remainingMaximumPayableAmount',
            value: `${fCurrency2(_item.paidAmount)}đ`,
            type: DATA_TYPE.NUMBER_FORMAT,
            textColor: '#000000'
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
    <KrowdTable
      headingTitle="tất cả dự án của bạn"
      header={TABLE_HEAD}
      action={<BusinessProjectForm />}
      getData={getData}
      isLoading={isLoadingPoM}
      actionsButton={action}
      paging={{
        pageIndex,
        pageSize: pageSize,
        numberSize: numOfProject,

        handleNext() {
          setPageIndex(pageIndex + 1);
          setPageSize(pageSize + 8);
        },
        handlePrevious() {
          setPageIndex(pageIndex - 1);
          setPageSize(pageSize - 8);
        }
      }}
    />
  );
}
