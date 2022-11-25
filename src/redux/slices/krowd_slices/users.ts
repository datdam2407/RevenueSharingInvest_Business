import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import { NotificationDetail, ROLE_USER_TYPE, UserKrowd } from '../../../@types/krowd/users';
import axios from 'axios';
import { SnackbarKey, useSnackbar } from 'notistack';
import { REACT_APP_API_URL } from 'config';
import { UserAPI } from '_apis_/krowd_apis/user';

// ----------------------------------------------------------------------

export type UserKrowdState = {
  mainUserState: {
    isLoading: boolean;
    user: UserKrowd | null;
    error: boolean;
  };
  userKrowdListState: {
    isLoading: boolean;
    userLists: {
      numOfUser: number;
      listOfUser: UserKrowd[];
    };
    error: boolean;
  };
  NotificationDetailState: {
    isLoading: boolean;
    new: number;
    total: number;
    details: NotificationDetail[];
    error: boolean;
  };
  userKrowdDetailState: {
    isLoading: boolean;
    userKrowdDetail: UserKrowd | null;
    error: boolean;
  };
};

const initialState: UserKrowdState = {
  //AUTH_USER
  mainUserState: {
    isLoading: false,
    user: null,
    error: false
  },

  //USER_LIST
  userKrowdListState: {
    isLoading: false,
    userLists: {
      numOfUser: 0,
      listOfUser: []
    },
    error: false
  },
  NotificationDetailState: {
    isLoading: false,
    new: 0,
    total: 0,
    details: [],
    error: false
  },

  //DETAILS
  userKrowdDetailState: {
    isLoading: false,
    userKrowdDetail: null,
    error: false
  }
};

const slice = createSlice({
  name: 'userKrowd',
  initialState,
  reducers: {
    //---------------MAIN USER-----------------
    startMainUserLoading(state) {
      state.mainUserState.isLoading = true;
    },
    // GET MANAGE INVESTOR
    getMainUserSuccess(state, action) {
      state.mainUserState.isLoading = false;
      state.mainUserState.user = action.payload;
    },
    // HAS ERROR
    hasMainUserError(state, action) {
      state.mainUserState.isLoading = false;
      state.mainUserState.error = action.payload;
    },
    //---------------MAIN INVESTOR-----------------
    startInvestorLoading(state) {
      state.mainUserState.isLoading = true;
    },
    // GET MANAGE INVESTOR
    getInvestorListSuccess(state, action) {
      state.mainUserState.isLoading = false;
      state.mainUserState.user = action.payload;
    },
    // HAS ERROR
    hasInvestorError(state, action) {
      state.mainUserState.isLoading = false;
      state.mainUserState.error = action.payload;
    },

    //------------USER LIST -------------
    // START LOADING
    startUserKrowdListLoading(state) {
      state.userKrowdListState.isLoading = true;
    },
    // GET MANAGE INVESTOR
    getUserKrowdListSuccess(state, action) {
      state.userKrowdListState.isLoading = false;
      state.userKrowdListState.userLists = action.payload;
    },
    // HAS ERROR
    hasUserKrowdListError(state, action) {
      state.userKrowdListState.isLoading = false;
      state.userKrowdListState.error = action.payload;
    },

    //-------------------DETAIL OF KROWD USER------------------
    // START LOADING
    startUserKrowdDetailLoading(state) {
      state.userKrowdDetailState.isLoading = true;
    },

    // GET MANAGE userKrowd DETAIL
    getUserKrowdDetailSuccess(state, action) {
      state.userKrowdDetailState.isLoading = false;
      state.userKrowdDetailState.userKrowdDetail = action.payload;
    },
    deleteUserKrowdDetailSuccess(state) {
      state.userKrowdDetailState.isLoading = false;
    },
    updateEmailUserKrowdDetailSuccess(state) {
      state.userKrowdDetailState.isLoading = false;
    },
    // HAS ERROR
    hasUserKrowdDetailError(state, action) {
      state.userKrowdDetailState.isLoading = false;
      state.userKrowdDetailState.error = action.payload;
    },
    //-------------------DETAIL OF NOTIFICATION------------------
    // START LOADING
    startNotificationLoading(state) {
      state.NotificationDetailState.isLoading = true;
    },

    // GET MANAGE USER DETAIL
    gettNotificationListSuccess(state, action) {
      state.NotificationDetailState.isLoading = false;
      state.NotificationDetailState = action.payload;
    },
    // HAS ERROR
    hasUsertNotificationError(state, action) {
      state.NotificationDetailState.isLoading = false;
      state.NotificationDetailState.error = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const token = window.localStorage.getItem('accessToken');
const headers = { Authorization: `Bearer ${token}` };

export function getMainUserProfile(id: string) {
  return async () => {
    dispatch(slice.actions.startMainUserLoading());
    try {
      const response = await UserAPI.getUserID({ id });
      dispatch(slice.actions.getMainUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasMainUserError(error));
    }
  };
}
export function getInvestorList(
  pageIndex: number,
  pageSize: number,
  projectId: string,
  status: string
) {
  return async () => {
    dispatch(slice.actions.startUserKrowdListLoading());
    try {
      const response = await UserAPI.getInvestorList({
        pageIndex: pageIndex,
        pageSize: pageSize,
        projectId: projectId,
        status: status
      });
      dispatch(slice.actions.getUserKrowdListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasUserKrowdListError(error));
    }
  };
}
export function getProjectManagerList(
  pageIndex: number,
  pageSize: number,
  businessId: string,
  projectId: string,
  status: string
) {
  return async () => {
    dispatch(slice.actions.startUserKrowdListLoading());
    try {
      const response = await UserAPI.getProjectManagerList({
        pageIndex: pageIndex,
        pageSize: pageSize,
        businessId: businessId,
        projectId: projectId,
        status: status
      });
      dispatch(slice.actions.getUserKrowdListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasUserKrowdListError(error));
    }
  };
}
export function getNotification(userId: string, seen: boolean) {
  return async () => {
    dispatch(slice.actions.startNotificationLoading());
    try {
      const response = await UserAPI.getNotification({ userId: userId, seen: seen });
      dispatch(slice.actions.gettNotificationListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasUsertNotificationError(error));
    }
  };
}
export function getUserKrowdList(businessId: string, role: ROLE_USER_TYPE) {
  return async () => {
    dispatch(slice.actions.startUserKrowdListLoading());
    try {
      if (!businessId) {
        dispatch(slice.actions.getUserKrowdListSuccess([]));
        return;
      }
      const response = await axios.get(REACT_APP_API_URL + '/users', {
        params: { businessId: businessId ?? 'null', role: role },
        headers: headers
      });
      dispatch(slice.actions.getUserKrowdListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasUserKrowdListError(error));
    }
  };
}

export function getUserKrowdDetail(userID: string) {
  return async () => {
    dispatch(slice.actions.startUserKrowdDetailLoading());
    try {
      const response = await axios.get(
        `https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/v1.0/users/${userID}`,
        {
          headers: headers
        }
      );
      dispatch(slice.actions.getUserKrowdDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasUserKrowdDetailError(error));
    }
  };
}
export function deleteUser(userID: string) {
  return async () => {
    dispatch(slice.actions.startUserKrowdDetailLoading());
    try {
      await axios
        .delete(
          `https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/v1.0/users/${userID}`
        )
        .then(() => dispatch(slice.actions.deleteUserKrowdDetailSuccess()));
    } catch (error) {
      dispatch(slice.actions.hasUserKrowdDetailError(error));
    }
  };
}
export function updateEmailUser(userID: string, email: string) {
  return async () => {
    dispatch(slice.actions.startUserKrowdDetailLoading());
    try {
      const bodyFormData = new FormData();
      bodyFormData.append('email', email);
      await axios({
        method: 'put',
        url: `https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/v1.0/users/${userID}`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(slice.actions.updateEmailUserKrowdDetailSuccess());
    } catch (error) {
      dispatch(slice.actions.hasUserKrowdDetailError(true));
    }
  };
}
