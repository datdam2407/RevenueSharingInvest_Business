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
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  other: getIcon('ic_other'),
  customer: getIcon('ic_customer'),
  business: getIcon('ic_business'),
  project: getIcon('ic_project'),
  wallet: getIcon('ic_wallet'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  dayOverview: getIcon('ic_dayOverview'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  daily: getIcon('ic_dailyRevenue'),

  accountTransaction: getIcon('ic_accountTransaction'),
  bankTransaction: getIcon('ic_bankTransaction'),
  PeriodRevenueHistory: getIcon('ic_historyTransaction')
};

const sidebarConfig = [
  {
    items: [
      {
        title: 'Ví của bạn',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      }
    ]
  },
  {
    subheader: 'Thương hiệu của tôi',
    items: [
      {
        title: 'Thương hiệu',
        path: PATH_DASHBOARD.business.myBusiness,
        icon: ICONS.business,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      }
    ]
  },
  {
    subheader: 'Quản lý dự án',
    items: [
      // {
      //   title: 'Dự án của tôi',
      //   path: PATH_DASHBOARD.projects.myProject,
      //   icon: ICONS.business,
      //   accessiableRole: [ROLE_USER_TYPE.PROJECT_MANAGER]
      // },
      {
        title: 'Dự án của tôi',
        path: PATH_DASHBOARD.projects.PoM_project_Krowd,
        icon: ICONS.project,
        accessiableRole: [ROLE_USER_TYPE.PROJECT_MANAGER]
      },
      {
        title: 'Lịch sử đầu tư',
        path: PATH_DASHBOARD.projects.Project_Investment,
        icon: ICONS.daily,
        accessiableRole: [ROLE_USER_TYPE.PROJECT_MANAGER]
      },
      // {
      //   title: 'Gói khuyến mãi',
      //   path: PATH_DASHBOARD.projects.voucherProject,
      //   icon: ICONS.project,
      //   accessiableRole: [ROLE_USER_TYPE.PROJECT_MANAGER]
      // },
      {
        title: 'Tất cả dự án',
        path: PATH_DASHBOARD.projects.projectKrowd,
        icon: ICONS.project,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
      },
      {
        title: 'Theo từng giai đoạn',
        icon: ICONS.project,
        children: [
          {
            title: 'Khởi tạo dự án',
            path: PATH_DASHBOARD.projects.DRAFT,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },
          {
            title: 'Đang chờ duyệt',
            path: PATH_DASHBOARD.projects.WAITING_FOR_APPROVAL,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },

          {
            title: 'Đang chờ công khai',
            path: PATH_DASHBOARD.projects.WAITING_TO_PUBLISH,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },
          {
            title: 'Đang kêu gọi đầu tư',
            path: PATH_DASHBOARD.projects.CALLING_FOR_INVESTMENT,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },
          {
            title: 'Đang chờ kích hoạt',
            path: PATH_DASHBOARD.projects.WAITING_TO_ACTIVATE,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },
          {
            title: 'Đang hoạt động',
            path: PATH_DASHBOARD.projects.ACTIVE,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },

          {
            title: 'Bị từ chối',
            path: PATH_DASHBOARD.projects.DENIED,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },
          {
            title: 'Quá hạn đầu tư',
            path: PATH_DASHBOARD.projects.CALLING_TIME_IS_OVER,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          },

          {
            title: 'Đã kết thúc',
            path: PATH_DASHBOARD.projects.CLOSED,
            accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
          }
        ],
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
      }
    ]
  },
  {
    subheader: 'Danh sách người dùng',
    items: [
      // {
      //   title: 'Người đầu tư',
      //   path: PATH_DASHBOARD_PROJECT.project.Project_Investor,
      //   icon: ICONS.customer,
      //   accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER, ROLE_USER_TYPE.PROJECT_MANAGER]
      // },
      {
        title: 'Chủ dự án',
        path: PATH_DASHBOARD.userKrowd.listProjectOwner,
        icon: ICONS.customer,
        accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
      }
    ]
  }

  // {
  //   subheader: 'Quản lý giao dịch',
  //   items: [
  //     {
  //       title: 'Giao dịch ngân hàng',
  //       path: PATH_DASHBOARD.transaction.accountTransaction,
  //       icon: ICONS.bankTransaction
  //     }
  //   ]
  // },
  // {
  //   subheader: 'Quản lý khác',
  //   items: [
  //     {
  //       title: 'Quản lý khác',
  //       icon: ICONS.other,
  //       children: [{ title: 'Rủi ro', path: PATH_DASHBOARD.other.risk }],
  //       accessiableRole: [ROLE_USER_TYPE.BUSINESS_MANAGER]
  //     }
  //   ]
  // }
];

export default sidebarConfig;
