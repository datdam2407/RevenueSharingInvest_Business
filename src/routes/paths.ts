// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_DASHBOARD_PROJECT = '/projectBoard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  page404: '/404',
  page500: '/500'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking')
  },

  //Quản lý dự án
  projects: {
    root: path(ROOTS_DASHBOARD, '/project/projectKrowd'),
    projectKrowd: path(ROOTS_DASHBOARD, '/project/projectKrowd'),
    PoM_project_Krowd: path(ROOTS_DASHBOARD, '/project/PoM_project-Krowd'),
    Project_Investment: path(ROOTS_DASHBOARD, '/project/project-investments'),
    projectDetails: path(ROOTS_DASHBOARD, '/project/projectDetails'),
    projectDetails2: path(ROOTS_DASHBOARD, '/project/projectDetails2'),

    DRAFT: path(ROOTS_DASHBOARD, '/project/draft'),

    WAITING_FOR_APPROVAL: path(ROOTS_DASHBOARD, '/project/waiting-to-approval'),

    WAITING_TO_PUBLISH: path(ROOTS_DASHBOARD, '/project/waiting-to-publish'),

    CALLING_FOR_INVESTMENT: path(ROOTS_DASHBOARD, '/project/calling-for-investment'),

    WAITING_TO_ACTIVATE: path(ROOTS_DASHBOARD, '/project/waiting-to-active'),

    ACTIVE: path(ROOTS_DASHBOARD, '/project/active'),

    CLOSED: path(ROOTS_DASHBOARD, '/project/closed'),

    CALLING_TIME_IS_OVER: path(ROOTS_DASHBOARD, '/project/calling-time-is-over'),

    DENIED: path(ROOTS_DASHBOARD, '/project/denied'),

    myProject: path(ROOTS_DASHBOARD, '/project/myProject'),
    myPackage: path(ROOTS_DASHBOARD, '/project/myPackage'),
    voucherProject: path(ROOTS_DASHBOARD, '/project/voucher/list')
  },

  //doanh nghiệp
  business: {
    root: path(ROOTS_DASHBOARD, '/business'),
    profile: path(ROOTS_DASHBOARD, '/business/profile'),
    cards: path(ROOTS_DASHBOARD, '/business/cards'),
    list: path(ROOTS_DASHBOARD, '/business/list'),
    newUser: path(ROOTS_DASHBOARD, '/business/new'),
    createBusiness: path(ROOTS_DASHBOARD, '/business/tempBusiness/new'),
    tempBusiness: path(ROOTS_DASHBOARD, '/business/tempBusiness/details'),
    editById: path(ROOTS_DASHBOARD, `/business/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/business/account'),
    myBusiness: path(ROOTS_DASHBOARD, '/business/myBusiness'),
    details: path(ROOTS_DASHBOARD, '/business/details')
  },
  //Người dùng
  admin: {
    root: path(ROOTS_DASHBOARD, '/admin'),
    profile: path(ROOTS_DASHBOARD, '/admin/profile'),
    cards: path(ROOTS_DASHBOARD, '/admin/cards'),

    newUser: path(ROOTS_DASHBOARD, '/admin/new'),
    userKrowd: path(ROOTS_DASHBOARD, `/admin/userKrowd`),
    account: path(ROOTS_DASHBOARD, '/admin/account')
  },
  // giao dịch
  transaction: {
    root: path(ROOTS_DASHBOARD, '/transaction/account-transaction'),
    walletTransaction: path(ROOTS_DASHBOARD, '/transaction/wallet'),
    accountTransaction: path(ROOTS_DASHBOARD, '/transaction/account-transaction'),
    PeriodRevenueHistory: path(ROOTS_DASHBOARD, '/transaction/account')
  },
  //Ví
  wallet: {
    root: path(ROOTS_DASHBOARD, '/wallet'),
    system: path(ROOTS_DASHBOARD, '/wallet/system-wallet'),
    transaction: path(ROOTS_DASHBOARD, '/wallet/transaction-wallet'),
    allWallet: path(ROOTS_DASHBOARD, '/wallet/all-wallet')
  },
  //Quản lý khác
  other: {
    root: path(ROOTS_DASHBOARD, '/other'),
    list: path(ROOTS_DASHBOARD, '/other/list'),
    fields: path(ROOTS_DASHBOARD, '/other/fields'),
    newRiskType: path(ROOTS_DASHBOARD, '/other/risk_type-new'),
    field: path(ROOTS_DASHBOARD, '/other/field'),
    area: path(ROOTS_DASHBOARD, '/other/area'),
    role: path(ROOTS_DASHBOARD, '/other/role'),
    risk: path(ROOTS_DASHBOARD, '/other/risk'),
    investment: path(ROOTS_DASHBOARD, '/other/investment')
  },
  //tạm thời k xài
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
    productById: path(ROOTS_DASHBOARD, 'projectDetailst'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice')
  },
  //tạm thời k xài
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post')
  },
  //tạm thời k xài
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey')
  },

  // Tách Doanh nghiệp
  //Quản lý dự án business
  projectsBusiness: {
    root: path(ROOTS_DASHBOARD, '/projectsBusiness'),
    projectBusinessKrowd: path(ROOTS_DASHBOARD, '/projectsBusiness/projectBusinessKrowd'),
    projectBusinessDetails: path(ROOTS_DASHBOARD, '/projectsBusiness/projectDetails'),
    newProjectBusiness: path(ROOTS_DASHBOARD, '/projectsBusiness/new-project'),
    projectBusinessById: path(ROOTS_DASHBOARD, '/projectsBusiness/nike-air-force-1-ndestrukt'),
    newProjectEntity: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectEntity'),
    newProjectHighLight: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectHighLight'),
    newProjectExtension: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectExtension'),
    newProjectAbout: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectAbout'),
    newProjectDocument: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectDocument'),
    newProjectMedia: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectMedia'),
    newProjectFAQ: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectFAQ'),
    newProjectOwner: path(ROOTS_DASHBOARD, '/projectsBusiness/new-projectOwner'),
    projectEntityDetails: path(ROOTS_DASHBOARD, '/projectsBusiness/projectEntityDetails')
  },
  userKrowd: {
    root: path(ROOTS_DASHBOARD, '/userKrowd'),
    profile: path(ROOTS_DASHBOARD, '/userKrowd/profile'),
    cards: path(ROOTS_DASHBOARD, '/userKrowd/cards'),
    list: path(ROOTS_DASHBOARD, '/userKrowd/list'),
    newUser: path(ROOTS_DASHBOARD, '/userKrowd/new'),
    editById: path(ROOTS_DASHBOARD, `/userKrowd/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/userKrowd/account'),
    listInvestor: path(ROOTS_DASHBOARD, '/admin/list_investor'),
    listProjectOwner: path(ROOTS_DASHBOARD, '/admin/list_project_owner')
  }
};
export const PATH_DASHBOARD_PROJECT = {
  root: ROOTS_DASHBOARD_PROJECT,
  project: {
    root: path(ROOTS_DASHBOARD_PROJECT, `/project/projectDetail`),
    reportRevenue: path(ROOTS_DASHBOARD_PROJECT, '/project/daily_revenue'),
    stageProject: path(ROOTS_DASHBOARD_PROJECT, '/project/stage-project'),
    billDailyReport: path(ROOTS_DASHBOARD_PROJECT, '/project/bills/daily'),
    Project_Investment: path(ROOTS_DASHBOARD_PROJECT, '/project/project-investments'),
    Project_Investor: path(ROOTS_DASHBOARD_PROJECT, '/project/project-investor'),
    stageReport: path(ROOTS_DASHBOARD_PROJECT, '/project/stage-report')
  },
  wallet_project: {
    walletP3: path(ROOTS_DASHBOARD_PROJECT, '/project/investment-wallet'),
    walletP4: path(ROOTS_DASHBOARD_PROJECT, '/project/payment-wallet')
  }
};
export const PATH_DETAILS = '/details';
