import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/template_slice/mail';
import chatReducer from './slices/template_slice/chat';
import blogReducer from './slices/template_slice/blog';
import userReducer from './slices/template_slice/user';
import businessReducer from './slices/krowd_slices/business';
import userKrowdReducer from './slices/krowd_slices/users';
import fieldKrowdReducer from './slices/krowd_slices/field';
import AreaKrowdReducer from './slices/krowd_slices/area';
import RiskReducer from './slices/krowd_slices/riskType';
import InvestmentReducer from './slices/krowd_slices/investment';
import WalletReducer from './slices/krowd_slices/wallet';
import ProjectStageReducer from './slices/krowd_slices/stage';
import projectReducer from './slices/krowd_slices/project';
import projectEntityReducer from './slices/krowd_slices/projectEnity';
import RolesReducer from './slices/krowd_slices/roles';
import TransactionReducer from './slices/krowd_slices/transaction';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  user: userReducer,
  business: businessReducer,
  userKrowd: userKrowdReducer,
  fieldKrowd: fieldKrowdReducer,
  areaKrowd: AreaKrowdReducer,
  riskKrowd: RiskReducer,
  roleKrowd: RolesReducer,
  wallet: WalletReducer,
  investment: InvestmentReducer,
  stage: ProjectStageReducer,
  project: projectReducer,
  projectEntity: projectEntityReducer,
  transaction: TransactionReducer

  // product: persistReducer(productPersistConfig, productReducer)
});

export { rootPersistConfig, rootReducer };
