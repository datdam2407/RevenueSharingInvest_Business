// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_PROJECT } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';
import { NavItemProps } from 'components/NavSection';
import { ROLE_USER_TYPE } from '../../@types/krowd/users';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  business: getIcon('ic_business'),
  project: getIcon('ic_project'),
  wallet: getIcon('ic_wallet'),
  dayOverview: getIcon('ic_dayOverview'),
  banking: getIcon('ic_banking'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  accountTransaction: getIcon('ic_accountTransaction'),
  bankTransaction: getIcon('ic_bankTransaction'),
  daily: getIcon('ic_dailyRevenue'),
  customer: getIcon('ic_customer'),

  term: getIcon('ic_termRevenue'),
  PeriodRevenueHistory: getIcon('ic_historyTransaction')
};

const SidebarProjectConfig = [
  {
    subheader: 'Dự án',
    items: [
      {
        title: `Chi tiết dự án`,
        path: PATH_DASHBOARD_PROJECT.project.root,
        icon: ICONS.dashboard,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      }

      // {
      //   title: 'Tình hình thường kì',
      //   path: PATH_DASHBOARD_PROJECT.project.stageProject,
      //   icon: ICONS.term,
      //   accessiableRole: [ROLE_USER_TYPE.PROJECT_MANAGER]
      // }
    ]
  },
  {
    subheader: 'Ví dự án',
    items: [
      {
        title: 'Ví đầu tư dự án',
        path: PATH_DASHBOARD_PROJECT.wallet_project.walletP3,
        icon: ICONS.wallet,
        accessiableRole: [ROLE_USER_TYPE.PROJECT_MANAGER]
      },
      {
        title: 'Ví thanh toán dự án',
        path: PATH_DASHBOARD_PROJECT.wallet_project.walletP4,
        icon: ICONS.wallet,
        accessiableRole: [ROLE_USER_TYPE.PROJECT_MANAGER]
      }
    ]
  },
  {
    subheader: 'Quản lý đầu tư',
    items: [
      {
        title: 'Lịch sử đầu tư',
        path: PATH_DASHBOARD_PROJECT.project.Project_Investment,
        icon: ICONS.accountTransaction,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      },
      {
        title: 'Nhà đầu tư',
        // path: PATH_DASHBOARD_PROJECT.project.Project_Investor,
        path: PATH_DASHBOARD_PROJECT.project.Project_Investor,

        icon: ICONS.customer,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      }
    ]
  },
  {
    subheader: 'Báo cáo dự án',
    items: [
      {
        title: 'Doanh thu hằng ngày',
        path: PATH_DASHBOARD_PROJECT.project.reportRevenue,
        icon: ICONS.daily,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      },

      {
        title: 'Giai đoạn thanh toán',
        path: PATH_DASHBOARD_PROJECT.project.stageReport,
        icon: ICONS.term,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      }
    ]
  }
];

export default SidebarProjectConfig;
