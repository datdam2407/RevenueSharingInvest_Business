import React from 'react';
import {
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Scrollbar from 'components/Scrollbar';
import { PATH_DASHBOARD, PATH_DASHBOARD_PROJECT } from 'routes/paths';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import KrowdTableListHead from '../components/KrowdTableListHead';
import { fCurrency } from 'utils/formatNumber';
import editTwotone from '@iconify/icons-ant-design/edit-twotone';
import upload from '@iconify/icons-ant-design/upload-outline';
import Payment from '@iconify/icons-ic/twotone-payments';
import eyeFill from '@iconify/icons-ant-design/container-fill';
import eyeFill2 from '@iconify/icons-ant-design/eye-fill';
import reportScreen from '@iconify/icons-ant-design/fund-projection-screen';

import LoadingScreen from 'components/LoadingScreen';
import { dispatch } from 'redux/store';
import { getProjectStageID } from 'redux/slices/krowd_slices/stage';
import { getBillDailyReport, getDailyReportByID } from 'redux/slices/krowd_slices/transaction';
import BlogPostsSearch from 'components/_dashboard/blog/ProjectSearch';
import { ROLE_USER_TYPE } from '../../../@types/krowd/users';
import useAuth from 'hooks/useAuth';
import { eachYearOfInterval } from 'date-fns';
export enum DATA_TYPE {
  TEXT = 'text',
  CHIP_TEXT = 'chip_text',
  IMAGE = 'image',
  LIST_TEXT = 'list_text',
  NUMBER = 'number',
  WRAP_TEXT = 'wrap_text',
  DATE = 'date',
  CURRENCY = 'currency',
  NUMBER_FORMAT = 'number_format',
  TEXT_FORMAT = 'text_format'
}
export enum ACTION_TYPE {
  BUTTON = 'button',
  LINK = 'link'
}
export type RowData = {
  id: string;
  items: {
    name: string;
    value: any;
    type: DATA_TYPE;
    textColor?: string;
    textColorAny?: any;
    textMapColor?: { status: string; color: string }[];
  }[];
  status?: string;
};
export type KrowdTableProps = {
  headingTitle: string;
  action?: React.ReactNode;
  openUpdateDialog?: () => void;
  openKrowdReport?: () => void;
  openBill?: () => void;
  openPaymentPeriodRevenueHistory?: () => void;
  noteTable?: {
    name: string;
  }[];
  header: { id: string; label: string; align: string }[];
  getData: () => Array<RowData>;
  isLoading: boolean;
  actionsButton?: {
    nameAction: string;
    action: (() => void) | string;
    icon: any;
    color?: string;
    type: ACTION_TYPE;
  }[];
  filterStatus?: {
    action: (() => void) | string;
    nameAction: string;
    icon: any;
    color?: string;
    apicall?: string;
  }[];
  paging?: {
    pageSize: number;
    pageIndex: number;
    numberSize: number;
    handlePrevious: () => void;
    handleNext: () => void;
  };
  viewPath?: string;
};

export function KrowdTable({
  headingTitle,
  action,
  header,
  getData,
  isLoading,
  actionsButton,
  paging,
  filterStatus,
  openUpdateDialog,
  noteTable,
  openKrowdReport,
  openBill,
  openPaymentPeriodRevenueHistory,
  viewPath
}: KrowdTableProps) {
  const data = getData();
  const navigate = useNavigate();
  const { user } = useAuth();

  const openUpdateForm = async (id: string) => {
    await dispatch(getProjectStageID(id));
    if (openUpdateDialog) openUpdateDialog();
  };
  const openReportForm = async (id: string) => {
    await dispatch(getDailyReportByID(id));
    localStorage.setItem('DailyId', id);
    if (openKrowdReport) openKrowdReport();
  };
  const handleView = async (id: string) => {
    localStorage.setItem('DailyId', id);
    window.scrollTo(0, 12500);
    if (openBill) {
      openBill();
    }
    await dispatch(getBillDailyReport(localStorage?.getItem('DailyId') ?? '', 1));
  };
  const openPaymentPeriodRevenueHistoryForm = async (id: string) => {
    await dispatch(getProjectStageID(id));
    if (openPaymentPeriodRevenueHistory) openPaymentPeriodRevenueHistory();
  };
  return (
    <>
      <HeaderBreadcrumbs
        heading={`${headingTitle.toUpperCase()} `}
        links={[{ name: 'Bảng điều khiển', href: PATH_DASHBOARD.root }]}
        action={action}
      />{' '}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minWidth: '200px',
          my: 2
        }}
      >
        {filterStatus &&
          filterStatus.map((e) => {
            return (
              <Box
                key={`__$`}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  minWidth: '200px',
                  my: 2
                }}
              >
                <Button onClick={e.action as () => Promise<void>}>
                  <Box>
                    <Icon icon={e.icon} width={24} height={24} color={e.color} />
                  </Box>
                  <Box>
                    <Typography color={e.color}>{e.nameAction}</Typography>
                  </Box>
                </Button>
              </Box>
            );
          })}
      </Box>
      {/* <BlogPostsSearch /> */}
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <KrowdTableListHead
              headLabel={[
                { id: '__borderHeaderLeft', label: '', align: 'center' },
                ...header,
                { id: '__borderHeaderRight', label: '', align: 'center' }
              ]}
            />
            <TableBody>
              {!isLoading &&
                data.length > 0 &&
                data.map((data, index) => {
                  return (
                    <TableRow hover key={`__${data.id}`} tabIndex={-1} role="checkbox">
                      <TableCell
                        key={'__borderRowLeft'}
                        component="th"
                        scope="row"
                        padding="normal"
                        align="justify"
                        sx={{ bgcolor: '#ffffff' }}
                      ></TableCell>
                      {data.items.map((_item) => {
                        switch (_item.type) {
                          case DATA_TYPE.TEXT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    color={_item.textColor ?? 'text.primary'}
                                  >
                                    {_item.value}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.TEXT_FORMAT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack
                                  sx={{ textAlign: 'center' }}
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    color={_item.textColor ?? 'text.primary'}
                                  >
                                    {_item.value}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.CURRENCY:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    sx={{ color: _item.textColor ?? 'text.primary' }}
                                  >
                                    {fCurrency(_item.value)}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.WRAP_TEXT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2">{_item.value}</Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.NUMBER:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    mx="auto"
                                    color={_item.textColor ?? 'text.primary'}
                                  >
                                    {_item.value}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.DATE:
                            const date = String(_item.value).split(' ')[0];
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {date}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );

                          case DATA_TYPE.NUMBER_FORMAT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack
                                  display={'block'}
                                  direction="row"
                                  alignItems="right"
                                  spacing={2}
                                >
                                  <Typography
                                    sx={{ textAlign: 'right' }}
                                    variant="subtitle2"
                                    noWrap
                                    mx="auto"
                                    color={_item.textColor ?? 'text.primary'}
                                  >
                                    {fCurrency(_item.value)}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.IMAGE:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar alt={`__${_item.name}__${data.id}`} src={_item.value} />
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.LIST_TEXT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {[..._item.value].map((_o) => _o)}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                          case DATA_TYPE.CHIP_TEXT:
                            return (
                              <TableCell
                                key={`__${_item.name}__${data.id}`}
                                component="th"
                                scope="row"
                                padding="normal"
                              >
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    <Chip
                                      label={_item.value}
                                      sx={{
                                        bgcolor:
                                          _item.textMapColor?.find((v) => v.status === _item.value)
                                            ?.color || 'text.primary',
                                        color: '#ffffff'
                                      }}
                                    />
                                  </Typography>
                                </Stack>
                              </TableCell>
                            );
                        }
                      })}
                      <TableCell align="center" key={`__${data.id}`}>
                        {actionsButton &&
                          actionsButton.map((e) => {
                            switch (e.type) {
                              case ACTION_TYPE.BUTTON:
                                return (
                                  <Button onClick={e.action as () => void}>
                                    <Icon icon={e.icon} width={24} height={24} color={e.color} />
                                  </Button>
                                );
                              case ACTION_TYPE.LINK:
                                return (
                                  <Link to={(e.action as string) + `/${data.id}`}>
                                    <Icon icon={e.icon} width={24} height={24} color={e.color} />
                                  </Link>
                                );
                            }
                          })}{' '}
                        {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER && openUpdateDialog && (
                          <TableCell align="center">
                            <Button onClick={() => openUpdateForm(data.id)}>
                              <Icon
                                icon={editTwotone}
                                width={24}
                                height={24}
                                style={{ margin: '0px auto' }}
                                color={'#ffc107'}
                              />
                            </Button>
                          </TableCell>
                        )}
                        {openKrowdReport && (
                          <Tooltip title="Krowd">
                            <Button onClick={() => openReportForm(data.id)}>
                              <Icon
                                icon={reportScreen}
                                width={24}
                                height={24}
                                style={{ margin: '0px auto' }}
                                color={'rgb(255, 127, 80)'}
                              />
                            </Button>
                          </Tooltip>
                        )}
                        {openBill && (
                          <Tooltip title="Chi tiết đơn hàng">
                            <Button onClick={() => handleView(data.id)}>
                              <Icon
                                icon={eyeFill}
                                width={24}
                                height={24}
                                style={{ margin: '0px auto' }}
                                color={'rgb(255, 127, 80)'}
                              />
                            </Button>
                          </Tooltip>
                        )}{' '}
                        {user?.role === ROLE_USER_TYPE.PROJECT_MANAGER &&
                          openPaymentPeriodRevenueHistory && (
                            <Tooltip title="Thanh toán">
                              <Button onClick={() => openPaymentPeriodRevenueHistoryForm(data.id)}>
                                <Icon
                                  icon={Payment}
                                  width={24}
                                  height={24}
                                  style={{ margin: '0px auto' }}
                                  color={'rgb(255, 127, 80)'}
                                />
                              </Button>
                            </Tooltip>
                          )}
                      </TableCell>
                      <TableCell
                        key={'__borderRowRight'}
                        component="th"
                        scope="row"
                        padding="normal"
                        align="justify"
                        sx={{ bgcolor: '#ffffff' }}
                      ></TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>{' '}
        </TableContainer>{' '}
        {paging && (
          <Box sx={{ my: 1 }} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
            {paging.pageSize * (paging.pageIndex - 1) + paging.pageSize >= paging.numberSize ? (
              <Typography>
                {(paging.pageIndex - 1) * paging.pageSize + 1} - {paging.numberSize} trên{' '}
                {paging.numberSize}
              </Typography>
            ) : (
              <Typography>
                {(paging.pageIndex - 1) * paging.pageSize + 1} -{' '}
                {paging.pageSize * (paging.pageIndex - 1) + paging.pageSize} trên{' '}
                {paging.numberSize}
              </Typography>
            )}

            {/* {paging.pageIndex} - {paging.pageSize} trên {paging.numberSize} */}
            {paging.pageIndex > 1 ? (
              <Button onClick={paging.handlePrevious}>Trước</Button>
            ) : (
              <Button disabled onClick={paging.handlePrevious}>
                Trước
              </Button>
            )}
            <Typography sx={{ mx: 2, fontSize: '14px', fontWeight: 900 }}>
              Trang {paging.pageIndex}
            </Typography>

            {paging.pageSize * (paging.pageIndex - 1) + paging.pageSize < paging.numberSize ? (
              <Button onClick={paging.handleNext}>Sau</Button>
            ) : (
              <Button disabled onClick={paging.handleNext}>
                Sau
              </Button>
            )}
          </Box>
        )}
        <Box p={2}>
          {noteTable &&
            noteTable.map((_item) => {
              return (
                <Typography key={'_itme'} color="#f06f00">
                  {_item.name}
                </Typography>
              );
            })}
        </Box>
        {isLoading && (
          <Box>
            <LoadingScreen />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem', pt: 7 }}>
              KROWD đang tải dữ liệu, vui lòng đợi giây lát...
            </Typography>
          </Box>
        )}
        {!isLoading && data.length === 0 && (
          <Box>
            <img
              src="https://minimals.cc/assets/illustrations/illustration_empty_content.svg"
              style={{ margin: '0px auto', padding: '1rem' }}
            />
            <Typography variant="h5" sx={{ textAlign: 'center', padding: '1rem' }}>
              Không có bất kỳ tiêu đề nào có sẵn để hiển thị
            </Typography>
          </Box>
        )}
      </Scrollbar>
    </>
  );
}
