import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from 'layouts/dashboard';
import DashboardProjectLayout from 'layouts/dashboardProject';
import LogoOnlyLayout from 'layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
import RoleBasedGuard from 'guards/RoleBasedGuard';
import Project from 'redux/slices/krowd_slices/project';
import PageSuccess from 'pages/PageSuccess';
// ----------------------------------------------------------------------

const Loadable = (Component: React.ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },
    {
      path: 'projectBoard',
      element: (
        <AuthGuard>
          <DashboardProjectLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/projectBoard/project" replace /> },
        { path: 'project/projectDetail', element: <ProjectDetails /> },
        { path: 'project/projectDetail/:id', element: <ProjectDetails /> },
        { path: 'project/daily_revenue', element: <ReportDailyProject /> },
        { path: 'project/bills/daily', element: <BillReportDailyProject /> },
        { path: 'project/project-investments', element: <InvestmentProject /> },
        { path: 'project/stage-project', element: <StageProjectList /> },
        { path: 'project/stage-report', element: <StageReportProject /> },
        { path: 'project/investment-wallet', element: <GeneralBanking /> },
        { path: 'project/project-investor', element: <InvestorList /> },
        { path: 'project/payment-wallet', element: <WalletI4Project /> }
      ]
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'transaction',
          children: [{ element: <Navigate to="/dashboard/account-transaction" replace /> }]
        },
        {
          path: 'other',
          children: [
            { element: <Navigate to="/dashboard/other/field" replace /> },
            {
              path: 'risk/:id',
              element: <RiskManagement />
            },
            { path: 'area', element: <AreasManagement /> },
            { path: 'role', element: <RolesManagement /> },
            { path: 'risks', element: <RiskTypesManagement /> }
          ]
        },
        {
          path: 'project',
          children: [
            { element: <Navigate to="/dashboard/project" replace /> },
            {
              path: 'projectKrowd',
              element: (
                <RoleBasedGuard>
                  <ProjectList />
                </RoleBasedGuard>
              )
            },
            { path: 'PoM_project-Krowd', element: <PoMProjectList /> },
            { path: 'draft', element: <DraftProjectList /> },

            { path: 'waiting-to-approval', element: <WaitingToApprovalProjectList /> },

            { path: 'waiting-to-publish', element: <WaitingToPublishProjectList /> },

            { path: 'calling-for-investment', element: <CallingProjectList /> },

            { path: 'waiting-to-active', element: <WaitingToActiveProjectList /> },

            { path: 'active', element: <ActiveProjectList /> },

            { path: 'closed', element: <CloseProjectList /> },

            { path: 'calling-time-is-over', element: <CallingTimeIsOverProjectList /> },

            { path: 'denied', element: <DeniedProjectList /> },

            { path: 'myProject', element: <ProjectDetails /> },

            { path: 'project-investments', element: <InvestmentProjecForAll /> },

            { path: 'voucher/list', element: <VoucherProjectList /> }
          ]
        },
        {
          path: 'wallet',
          children: [
            { element: <Navigate to="/dashboard/wallet" replace /> },
            { path: 'system-wallet', element: <SystemWalletList /> },
            { path: 'transaction-wallet', element: <SystemWalletList /> },
            { path: 'all-wallet', element: <SystemWalletList /> }
            // { path: 'project/:name', element: <KrowdProjectDetails /> }
          ]
        },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace /> },
            { path: 'details', element: <BusinessDetails /> }
          ]
        },
        {
          path: 'business',
          children: [
            { element: <Navigate to="/dashboard/business/profile" replace /> },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'account', element: <UserAccount /> },
            { path: 'myBusiness', element: <MyBusiness /> }
          ]
        },
        {
          path: 'admin',
          children: [
            { element: <Navigate to="/dashboard/admin/profile" replace /> },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list_project_owner', element: <PMList /> },
            { path: 'account', element: <UserAccount /> }
          ]
        },

        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace /> },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> }
          ]
        },
        {
          path: 'chat',
          children: [
            { element: <Chat /> },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Login /> },
        { path: '500', element: <Page500 /> },
        { path: 'page-success', element: <PageSuccess /> }
      ]
    }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));

// Thống kê toàn bộ hệ thống
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/generalManagers/GeneralApp')));
const GeneralEcommerce = Loadable(
  lazy(() => import('../pages/dashboard/generalManagers/GeneralEcommerce'))
);
const GeneralAnalytics = Loadable(
  lazy(() => import('../pages/dashboard/generalManagers/GeneralAnalytics'))
);
const GeneralBanking = Loadable(
  lazy(() => import('../pages/dashboard/generalManagers/GeneralBooking'))
);
const GeneralBooking = Loadable(
  lazy(() => import('../pages/dashboard/generalManagers/GeneralBooking'))
);

// Thuộc về quản lý giao dịch
// const AccountTransactionDetails = Loadable(
//   lazy(
//     () => import('../pages/dashboard/krowdManages/transactionManagement/AccountTransactionDetails')
//   )
// );
//----------------------------
//Thuộc về quản lý khác

const AreasManagement = Loadable(
  lazy(
    () =>
      import('../pages/dashboard/BusinessKrowdManager/krowdManages/otherManagers/AreasManagement')
  )
);
const RolesManagement = Loadable(
  lazy(
    () =>
      import('../pages/dashboard/BusinessKrowdManager/krowdManages/otherManagers/RolesManagement')
  )
);
const RiskTypesManagement = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/otherManagers/RiskTypesManagement'
      )
  )
);

const BusinessDetails = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/businessManagement/BusinessDetails'
      )
  )
);
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/templateManagers/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/templateManagers/UserCards')));
const ProjectList = Loadable(
  lazy(
    () =>
      import('../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/ProjectList')
  )
);
const PoMProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/PoMProjectList'
      )
  )
);

const WalletI3Project = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/wallet-project/WalletI3Project'
      )
  )
);
const WalletI4Project = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/wallet-project/WalletI4Project'
      )
  )
);
const DraftProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/DraftProjectList'
      )
  )
);
const WaitingToActiveProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/WaitingToActiveProjectList'
      )
  )
);
const WaitingToPublishProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/WaitingToPublishProjectList'
      )
  )
);
const CallingTimeIsOverProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/CallingTimeIsOverProjectList'
      )
  )
);
const WaitingToApprovalProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/WaitingToApprovalProjectList'
      )
  )
);
const DeniedProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/DeniedProjectList'
      )
  )
);

const CallingProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/CallingProjectList'
      )
  )
);

const ActiveProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/ActiveProjectList'
      )
  )
);
//====================================================REPORT OF PROJECT============================================================
const ReportDailyProject = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/report-revenue/ReportDailyProject'
      )
  )
);
const BillReportDailyProject = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/report-revenue/BillReportDailyProject'
      )
  )
);
//====================================================INVESTMENT OF PROJECT============================================================

const InvestmentProject = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/investment/InvestmentProject'
      )
  )
);
const InvestmentProjecForAll = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/investment/InvestmentProjecForAll'
      )
  )
);
const StageReportProject = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/report-revenue/StageReportProject'
      )
  )
);
const StageProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/report-revenue/StageProjectList'
      )
  )
);
//===============================================================================================================================

const VoucherProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/VoucherProjectList'
      )
  )
);
const CloseProjectList = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/filter-project-list/CloseProjectList'
      )
  )
);

const ProjectDetails = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/projectManagerment/ProjectDetails'
      )
  )
);

const SystemWalletList = Loadable(
  lazy(
    () =>
      import('../pages/dashboard/BusinessKrowdManager/krowdManages/walletManagement/SystemWallet')
  )
);

const UserAccount = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/businessManagement/BusinessManagerProfile'
      )
  )
);
const InvestorList = Loadable(
  lazy(
    () =>
      import('../pages/dashboard/BusinessKrowdManager/krowdManages/usersManagement/InvestorList')
  )
);
const PMList = Loadable(
  lazy(() => import('../pages/dashboard/BusinessKrowdManager/krowdManages/usersManagement/PMList'))
);
const RiskManagement = Loadable(
  lazy(
    () =>
      import(
        '../pages/dashboard/BusinessKrowdManager/krowdManages/otherManagers/RiskTypesManagement'
      )
  )
);
const MyBusiness = Loadable(
  lazy(
    () => import('../pages/dashboard/BusinessKrowdManager/krowdManages/usersManagement/MyBusiness')
  )
);

const Chat = Loadable(lazy(() => import('../pages/dashboard/templateManagers/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/templateManagers/Mail')));

// Quản lý lỗi hệ thống
const ComingSoon = Loadable(lazy(() => import('../pages/dashboard/errorsManagers/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/dashboard/errorsManagers/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/dashboard/errorsManagers/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/dashboard/errorsManagers/Page404')));

// Phần quản lý doanh nghiệp
