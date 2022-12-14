import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { MIconButton } from 'components/@material-extend';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { getAreasList } from 'redux/slices/krowd_slices/area';
import { dispatch, RootState, useSelector } from 'redux/store';
import { PATH_DASHBOARD } from 'routes/paths';
import { DATA_TYPE, KrowdTable, RowData } from '../krowd-table/KrowdTable';
const FOCUS_AREA_CITY = 'Hồ Chí Minh';
const TABLE_HEAD = [
  { id: 'idx', label: 'STT', align: 'center' },
  { id: 'city', label: 'THÀNH PHỐ', align: 'left' },
  { id: 'district', label: 'QUẬN', align: 'left' },
  { id: 'createDate', label: 'NGÀY TẠO', align: 'left' },
  { id: 'updateDate', label: 'NGÀY CẬP NHẬT', align: 'left' }
];

export default function AreaTable() {
  const { areaList: list, isLoading } = useSelector((state: RootState) => state.areaKrowd);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getAreasList());
  }, [dispatch]);

  const getData = (): RowData[] => {
    if (!list) return [];
    return list
      .filter((_item) => _item.city === FOCUS_AREA_CITY)
      .map<RowData>((_item, _idx) => {
        return {
          id: _item.id,
          items: [
            {
              name: 'idx',
              value: _idx + 1,
              type: DATA_TYPE.NUMBER
            },
            {
              name: 'city',
              value: _item.city,
              type: DATA_TYPE.TEXT
            },
            {
              name: 'district',
              value: _item.district,
              type: DATA_TYPE.TEXT
            },

            {
              name: 'createDate',
              value: _item.createDate,
              type: DATA_TYPE.TEXT
            },
            {
              name: 'updateDate',
              value: _item.updateDate,
              type: DATA_TYPE.TEXT
            }
          ]
        };
      });
  };

  return (
    <KrowdTable
      headingTitle="Danh sách khu vực"
      header={TABLE_HEAD}
      getData={getData}
      isLoading={isLoading}
    />
  );
}
