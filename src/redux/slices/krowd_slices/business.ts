import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import { Business, TempBusiness } from '../../../@types/krowd/business';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import { REACT_APP_API_URL } from 'config';
import FirebaseService from 'api/firebase';
import { Project } from '../../../@types/krowd/project';
import { BusinessAPI } from '_apis_/krowd_apis/business';
import { ProjectAPI } from '_apis_/krowd_apis/project';

// ----------------------------------------------------------------------

export type BusinessState = {
  businessState: {
    isLoading: boolean;
    businessLists: {
      numOfBusiness: number;
      listOfBusiness: Business[];
    };
    error: boolean;
  };
  tempBusinessState: {
    isLoading: boolean;
    tempBusinessList: TempBusiness[];
    tempBusiness: TempBusiness | null;
    error: boolean;
  };
  businessDetailState: {
    isLoading: boolean;
    businessDetail: Business | null;
    error: boolean;
  };
  projectsOfBusinessState: {
    isLoading: boolean;
    projectsOfBusiness: {
      numOfProject: number;
      listOfProject: Project[];
    };
    error: boolean;
  };
};

const initialState: BusinessState = {
  businessState: {
    isLoading: false,
    businessLists: {
      numOfBusiness: 0,
      listOfBusiness: []
    },
    error: false
  },
  tempBusinessState: {
    isLoading: false,
    tempBusinessList: [],
    tempBusiness: null,
    error: false
  },
  businessDetailState: {
    isLoading: false,
    businessDetail: null,
    error: false
  },
  projectsOfBusinessState: {
    isLoading: false,
    projectsOfBusiness: {
      numOfProject: 0,
      listOfProject: []
    },
    error: false
  }
};

const slice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    //-------------------BUSINESS------------------
    // START LOADING
    startBusinessLoading(state) {
      state.businessState.isLoading = true;
    },

    // GET MANAGE BUSINESS
    getBusinessListSuccess(state, action) {
      state.businessState.isLoading = false;
      state.businessState.businessLists = action.payload;
    },

    // HAS ERROR
    hasBusinessError(state, action) {
      state.businessState.isLoading = false;
      state.businessState.error = action.payload;
    },
    //-------------------TEMP BUSINESS------------------
    // START LOADING
    startTempBusinessLoading(state) {
      state.tempBusinessState.isLoading = true;
    },

    // GET MANAGE TEMP BUSINESS
    getAllTempBusinessSuccess(state, action) {
      state.tempBusinessState.isLoading = false;
      state.tempBusinessState.tempBusinessList = action.payload;
    },
    getTempBusinessIDSuccess(state, action) {
      state.tempBusinessState.isLoading = false;
      state.tempBusinessState.tempBusiness = action.payload;
    },

    // HAS ERROR
    hasTempBusinessError(state, action) {
      state.tempBusinessState.isLoading = false;
      state.tempBusinessState.error = action.payload;
    },

    //-------------------DETAIL OF BUSINESS------------------
    // START LOADING
    startBusinessDetailLoading(state) {
      state.businessDetailState.isLoading = true;
    },

    // GET MANAGE BUSINESS DETAIL
    getBusinessDetailSuccess(state, action) {
      state.businessDetailState.isLoading = false;
      state.businessDetailState.businessDetail = action.payload;
    },
    // HAS ERROR
    hasBusinessDetailError(state, action) {
      state.businessDetailState.isLoading = false;
      state.businessDetailState.error = action.payload;
    },

    //-------------------PROJECTS OF BUSINESS------------------
    // START LOADING
    startProjectsOfBusinessLoading(state) {
      state.projectsOfBusinessState.isLoading = true;
    },

    // GET MANAGE PROJECT OF BUSINESS
    getProjectsOfBusiness(state, action) {
      state.projectsOfBusinessState.isLoading = false;
      state.projectsOfBusinessState.projectsOfBusiness = action.payload;
    },
    // HAS ERROR
    hasProjectsOfBusinessError(state, action) {
      state.projectsOfBusinessState.isLoading = false;
      state.projectsOfBusinessState.error = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const token = window.localStorage.getItem('accessToken');
const headers = { Authorization: `token ${token}` };
export function getBusinessList(temp_field_role: 'ADMIN') {
  return async () => {
    dispatch(slice.actions.startBusinessLoading());
    try {
      const response = await axios.get(REACT_APP_API_URL + 'businesses', {
        params: { temp_field_role }
      });
      dispatch(slice.actions.getBusinessListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasBusinessError(error));
    }
  };
}

export function getAllTempBusiness() {
  return async () => {
    dispatch(slice.actions.startTempBusinessLoading());
    try {
      const res = await FirebaseService.getAllTempBusiness();
      dispatch(slice.actions.getAllTempBusinessSuccess(res));
    } catch (error) {
      dispatch(slice.actions.hasTempBusinessError(error));
    }
  };
}
export function getTempBusinessById(uid: string) {
  return async () => {
    dispatch(slice.actions.startTempBusinessLoading());
    try {
      const res = await FirebaseService.getTempBusinessID(uid);
      dispatch(slice.actions.getTempBusinessIDSuccess(res));
    } catch (error) {
      dispatch(slice.actions.hasTempBusinessError(error));
    }
  };
}

export function getBusinessById(businessId?: string) {
  return async () => {
    dispatch(slice.actions.startBusinessDetailLoading());
    try {
      if (!businessId) {
        dispatch(slice.actions.getBusinessDetailSuccess(null));
        return;
      }
      const response = await BusinessAPI.get({ id: businessId });
      dispatch(slice.actions.getBusinessDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasBusinessDetailError(error));
    }
  };
}

export function getProjectByBusinessID(
  businessId: string,
  status: string,
  pageIndex: number,
  pageSize: 10
) {
  return async () => {
    dispatch(slice.actions.startProjectsOfBusinessLoading());
    try {
      const response = await ProjectAPI.gets({
        businessId: businessId,
        status: status,
        pageIndex: pageIndex,
        pageSize: 10
      });
      dispatch(slice.actions.getProjectsOfBusiness(response.data));
    } catch (error) {
      dispatch(slice.actions.hasProjectsOfBusinessError(error));
    }
  };
}
