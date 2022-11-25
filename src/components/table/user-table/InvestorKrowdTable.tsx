import { ROLE_USER_TYPE } from '../../../@types/krowd/users';
import { useEffect, useState } from 'react';
import { getInvestorList, getUserKrowdList } from 'redux/slices/krowd_slices/users';
import { dispatch, RootState, useSelector } from 'redux/store';
import { DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
import useAuth from 'hooks/useAuth';

const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'center' },
  { id: 'image', label: 'ẢNH', align: 'left' },
  { id: 'fullName', label: 'HỌ TÊN', align: 'left' },
  { id: 'city', label: 'ĐỊA CHỈ', align: 'left' },
  { id: 'phone', label: 'SĐT', align: 'left' },
  { id: 'email', label: 'EMAIL', align: 'left' },
  { id: '', label: '', align: 'left' }
];

export default function InvestorKrowdTable() {
  const { user } = useAuth();
  const { userKrowdListState } = useSelector((state: RootState) => state.userKrowd);
  const { userLists, isLoading } = userKrowdListState;
  const { listOfUser: list, numOfUser } = userLists;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState('');
  useEffect(() => {
    dispatch(getInvestorList(pageIndex, 5, localStorage.getItem('projectId') ?? '', status));
  }, [dispatch, pageIndex, status]);

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
            name: 'image',
            value: _item.image,
            type: DATA_TYPE.IMAGE
          },
          {
            name: 'fullname',
            value: `${_item.firstName} ${_item.lastName}`,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'city',
            value: `${_item.city}`,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'phoneNum',
            value: _item.phoneNum ? _item.phoneNum : 'chưa cập nhật',
            type: DATA_TYPE.TEXT,
            textColor: _item.phoneNum === null ? 'red' : 'black'
          },

          {
            name: 'email',
            value: _item.email ? '****************@gmail.com' : 'Chưa cập nhật',
            type: DATA_TYPE.TEXT
          }
        ]
      };
    });
  };

  return (
    <KrowdTable
      headingTitle="người đầu tư"
      header={TABLE_HEAD}
      getData={getData}
      isLoading={isLoading}
      paging={{
        pageIndex,
        pageSize: pageSize,
        numberSize: numOfUser,

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
