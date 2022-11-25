import { useEffect, useState } from 'react';
import { fCurrency2 } from 'utils/formatNumber';
import { getWalletTransactionList } from 'redux/slices/krowd_slices/transaction';
import { dispatch, RootState, useSelector } from 'redux/store';
import { DATA_TYPE, KrowdTable, RowData } from 'components/table/krowd-table/KrowdTable';

const TABLE_HEAD = [
  { id: 'ID', label: 'STT', align: 'left' },
  { id: 'description', label: 'MÔ TẢ', align: 'left' },
  { id: 'type', label: 'LOẠI', align: 'left' },
  { id: 'amount', label: 'SỐ TIỀN', align: 'right' },
  { id: '', label: '', align: 'left' }
];

export default function PMWalletTransactionTable({ type }: { type: 'ALL' | 'ID' }) {
  const { walletTransactionState } = useSelector((state: RootState) => state.transaction);
  const {
    isLoading,
    listOfWalletTransaction: list,
    numOfWalletTransaction
  } = walletTransactionState;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (type == 'ALL') dispatch(getWalletTransactionList('', pageIndex, 5));
  }, [dispatch, pageIndex]);
  const getData = (): RowData[] => {
    if (!list) return [];
    return list.map<RowData>((_item, _idx) => {
      return {
        id: _item.id,
        items: [
          {
            name: 'ID',
            value: _idx + 1,
            type: DATA_TYPE.TEXT
          },
          {
            name: 'description',
            value:
              (_item.description === 'Receive money from P5 wallet to P1 wallet' &&
                'vÍ TẠM THỜI nhận tiền từ VÍ THU TIỀN') ||
              (_item.description === 'Transfer money from P5 wallet to P1 wallet' &&
                'Chuyển tiền từ VÍ THU TIỀN sang VÍ TẠM THỜI của bạn') ||
              (_item.description === 'Transfer money from P2 wallet to P1 wallet' &&
                'Chuyển tiền từ VÍ THANH TOÁN CHUNG sang VÍ TẠM THỜI của bạn') ||
              (_item.description === 'Receive money from P2 wallet to P1 wallet' &&
                'vÍ TẠM THỜI nhận tiền từ VÍ THANH TOÁN CHUNG') ||
              (_item.description === 'Transfer money from I1 wallet to I2 wallet' &&
                'Chuyển tiền từ VÍ TẠM THỜI sang VÍ ĐẦU TƯ CHUNG của bạn') ||
              (_item.description === 'Receive money from I1 wallet to I2 wallet' &&
                'Nhận tiền từ VÍ TẠM THỜI sang VÍ ĐẦU TƯ CHUNG của bạn') ||
              (_item.description === 'Transfer money from I4 wallet to I5 wallet' &&
                'Chuyển tiền từ VÍ DỰ ÁN THANH TOÁN sang VÍ THU TIỀN của bạn') ||
              (_item.description === 'Transfer money from I5 wallet to I2 wallet' &&
                'Chuyển tiền từ VÍ THU TIỀN sang VÍ ĐẦU TƯ CHUNG của bạn') ||
              (_item.description === 'Withdraw money out of I1 wallet' &&
                'Rút tiền từ VÍ TẠM THỜI') ||
              (_item.description ===
                'Transfer money from I3 wallet to P3 wallet to prepare for activation' &&
                'Chuyển tiền từ VÍ TẠM ỨNG của bạn sang VÍ ĐẦU TƯ DỰ ÁN') ||
              (_item.description === 'Receive money from I2 wallet to I3 wallet to invest' &&
                'Nhận tiền đầu tư từ VÍ ĐẦU TƯ CHUNG của bạn sang VÍ TẠM ỨNG của bạn') ||
              (_item.description === 'Transfer money from I2 wallet to I3 wallet to invest' &&
                'Chuyển tiền đầu tư từ VÍ ĐẦU TƯ CHUNG của bạn sang VÍ TẠM ỨNG') ||
              (_item.description ===
                'Recieve money from I3 wallet to P3 wallet to prepare for activation' &&
                'Nhận tiền từ VÍ TẠM ỨNG của bạn sang VÍ ĐẦU TƯ DỰ ÁN') ||
              (_item.description ===
                'Receive money from I3 wallet to P3 wallet for stage payment' &&
                'Nhận tiền từ VÍ TẠM ỨNG của bạn sang VÍ ĐẦU TƯ DỰ ÁN cho giai đoạn') ||
              (_item.description ===
                'Transfer money from I3 wallet to P3 wallet for stage payment' &&
                'Chuyển tiền từ VÍ TẠM ỨNG của bạn sang VÍ ĐẦU TƯ DỰ ÁN') ||
              (_item.description === 'Transfer money from P3 wallet to P5 wallet' &&
                'Chuyển tiền từ VÍ ĐẦU TƯ DỰ ÁN sang VÍ THU TIỀN') ||
              (_item.description === 'Receive money from P3 wallet to P5 wallet' &&
                'VÍ THU TIỀN  nhận tiền từ VÍ ĐẦU TƯ DỰ ÁN') ||
              (_item.description === 'Transfer money from P5 wallet to P2 wallet' &&
                'Chuyển tiền từ VÍ THU TIỀN sang VÍ THANH TOÁN CHUNG') ||
              (_item.description === 'Receive money from P5 wallet to P2 wallet' &&
                'VÍ THANH TOÁN CHUNG nhận tiền từ VÍ THU TIỀN ') ||
              (_item.description === 'Receive money from P2 wallet to P4 wallet' &&
                ' VÍ THANH TOÁN DỰ ÁN nhận tiền từ VÍ THANH TOÁN CHUNG') ||
              (_item.description === 'Transfer money from P2 wallet to P4 wallet' &&
                'VÍ THANH TOÁN CHUNG chuyển tiền sang VÍ THANH TOÁN DỰ ÁN') ||
              (_item.description === 'Withdraw money out of P1 wallet' &&
                'Rút tiền từ VÍ TẠM THỜI') ||
              (_item.description === 'Deposit money into P1 wallet' &&
                'Nạp tiền vào VÍ TẠM THỜI') ||
              (_item.description === 'Transfer money from P1 wallet to P2 wallet' &&
                'Chuyển tiền từ VÍ TẠM THỜI sang VÍ THANH TOÁN CHUNG') ||
              (_item.description === 'Receive money from P1 wallet to P2 wallet' &&
                'VÍ THANH TOÁN CHUNG nhận tiền từ VÍ TẠM THỜI') ||
              (_item.description ===
                'Transfer money from P4 wallet to I4 wallet for stage payment' &&
                'VÍ THANH TOÁN DỰ ÁN chuyển tiền sang VÍ DỰ ÁN THANH TOÁN của nhà đầu tư') ||
              (_item.description ===
                'Receive money from I3 wallet to P3 wallet to prepare for activation' &&
                'VÍ ĐẦU TƯ DỰ ÁN của quản lý nhận tiền từ VÍ ĐẦU TƯ DỰ ÁN của nhà đầu tư') ||
              (_item.description ===
                'Receive money from P4 wallet to I4 wallet for stage payment' &&
                'VÍ DỰ ÁN THANH TOÁN của nhà đầu tư nhận tiền từ VÍ THANH TOÁN DỰ ÁN'),

            type: DATA_TYPE.TEXT
          },
          {
            name: 'type',
            value:
              (_item.type === 'CASH_IN' && 'Tiền vào') ||
              (_item.type === 'DEPOSIT' && 'Nạp tiền') ||
              (_item.type === 'WITHDRAW' && 'Rút tiền') ||
              (_item.type === 'CASH_OUT' && 'Tiền ra'),
            type: DATA_TYPE.TEXT,
            textColor:
              (_item.type === 'CASH_IN' && 'green') ||
              (_item.type === 'DEPOSIT' && 'green') ||
              (_item.type === 'WITHDRAW' && 'red') ||
              (_item.type === 'CASH_IN' ? 'green' : 'red')
          },
          {
            name: 'amount',
            value: `${fCurrency2(_item.amount)}đ`,
            type: DATA_TYPE.NUMBER_FORMAT,
            textColor: '#14b7cc'
          }
        ]
      };
    });
  };

  return (
    <KrowdTable
      headingTitle="Lịch sử giao dịch"
      header={TABLE_HEAD}
      getData={getData}
      isLoading={isLoading}
      // paging={{
      //   pageIndex,
      //   pageSize: pageSize,
      //   numberSize: numOfWalletTransaction,
      //   handleNext() {
      //     setPageIndex(pageIndex + 1);
      //   },
      //   handlePrevious() {
      //     setPageIndex(pageIndex - 1);
      //   }
      // }}
    />
  );
}
