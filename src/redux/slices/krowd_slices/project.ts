import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch, store } from '../../store';
// utils
import axios from 'axios';
import { useSnackbar } from 'notistack';
import closeFill from '@iconify/icons-eva/close-fill';
import {
  ALL_Project_Business,
  newPackageFormValues,
  Project,
  ProjectStatus,
  Voucher
} from '../../../@types/krowd/project';
import { REACT_APP_API_URL } from '../../../config';
import { ProjectAPI } from '_apis_/krowd_apis/project';
import business from './business';
// ----------------------------------------------------------------------

type ProjectState = {
  isLoading: boolean;
  error: boolean;
  projectLists: {
    numOfProject: number;
    listOfProject: Project[];
  };
  PoMProject: {
    numOfProject: number;
    isLoadingPoM: boolean;
    errorPoM: boolean;
    listOfProject: ALL_Project_Business[];
  };
  BusinessProject: {
    numOfProject: number;
    isLoadingPoM: boolean;
    error: boolean;
    listOfProject: ALL_Project_Business[];
  };
  projectDetailBYID: { isLoadingID: boolean; projectDetail: Project | null };
  //----------------------Voucher---------------------------
  voucherProject: {
    numOfVoucher: number;
    isLoadingVoucher: boolean;
    errorVoucher: boolean;
    listOfVoucher: Voucher[];
  };
  voucherProjectDetail: { isLoadingID: boolean; voucherDetail: Voucher | null };
  //====================POM==================================
  myProjects: {
    isLoading: boolean;
    numOfProject: number | null;
    listOfProject: Project[];
  };
  projects: Project[];
  project: Project | null;
  sortBy: Project | null;
  filters: {
    areaId: string;
    status: string[];
  };
};

const initialState: ProjectState = {
  isLoading: false,
  error: false,
  projectDetailBYID: { isLoadingID: false, projectDetail: null },
  projectLists: { numOfProject: 0, listOfProject: [] },
  PoMProject: { numOfProject: 0, listOfProject: [], isLoadingPoM: false, errorPoM: false },
  BusinessProject: { numOfProject: 0, listOfProject: [], isLoadingPoM: false, error: false },
  voucherProject: {
    numOfVoucher: 0,
    isLoadingVoucher: false,
    errorVoucher: false,
    listOfVoucher: []
  },
  voucherProjectDetail: { isLoadingID: false, voucherDetail: null },

  projects: [],
  myProjects: { isLoading: false, numOfProject: null, listOfProject: [] },
  project: null,
  sortBy: null,
  filters: {
    areaId: 'HCM',
    status: []
  }
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    startMyProjectLoading(state) {
      state.myProjects.isLoading = true;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET MANAGE USERS
    getProjectListSuccess(state, action) {
      state.isLoading = false;
      state.projectLists = action.payload;
    },
    //GET PROJECT BY ID
    startLoadingDetailByID(state) {
      state.projectDetailBYID.isLoadingID = true;
    },
    getProjectDetailSuccess(state, action) {
      state.projectDetailBYID.isLoadingID = false;
      state.projectDetailBYID.projectDetail = action.payload;
    },

    //-------------1st- GET ALL PROJECT BUSINESS --------------------------

    startLoadingAllProjectByPoM(state) {
      state.PoMProject.isLoadingPoM = true;
    },
    getAllProjectByPoMSuccess(state, action) {
      state.PoMProject.isLoadingPoM = false;
      state.PoMProject = action.payload;
    },

    hasErrorAllProjectByPoM(state, action) {
      state.PoMProject.isLoadingPoM = false;
      state.PoMProject.errorPoM = action.payload;
    },
    //-------------1st- GET ALL PROJECT BUSINESS --------------------------

    startLoadingAllProjectByBussiness(state) {
      state.BusinessProject.isLoadingPoM = true;
    },
    getAllProjectByBusinessSuccess(state, action) {
      state.BusinessProject.isLoadingPoM = false;
      state.BusinessProject = action.payload;
    },

    hasErrorAllProjectByBusiness(state, action) {
      state.BusinessProject.isLoadingPoM = false;
      state.BusinessProject.error = action.payload;
    },
    //------------------- GET ALL VOUCHER --------------------------

    startLoadingAllProjectVoucher(state) {
      state.PoMProject.isLoadingPoM = true;
    },
    getAllProjectVoucherSuccess(state, action) {
      state.PoMProject.isLoadingPoM = false;
      state.PoMProject = action.payload;
    },

    hasErrorProjectVoucher(state, action) {
      state.PoMProject.isLoadingPoM = false;
      state.PoMProject.errorPoM = action.payload;
    },
    //------------------- GET ALL VOUCHER BY ID --------------------------
    // code here
    //---------------------------------------------------------------------

    //---------------------------------------------------------------------

    getMyProjectsSuccess(state, action) {
      state.myProjects.isLoading = false;
      state.myProjects = action.payload;
    },
    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.areaId = action.payload.areaId;
      state.filters.status = action.payload.status;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { sortByProducts, filterProducts } = slice.actions;
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export function getToken() {
  return window.localStorage.getItem('accessToken');
}

export function getHeaderFormData() {
  const token = getToken();
  return { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` };
}
export function getHeader() {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
}
export function getProjectList(
  businessId: string | null | undefined,
  status: string,
  pageIndex: number,
  pageSize: 10
) {
  return async () => {
    dispatch(slice.actions.startLoadingAllProjectByBussiness());
    try {
      if (!businessId) {
        dispatch(slice.actions.getAllProjectByPoMSuccess([]));
        return;
      }
      const response = await ProjectAPI.gets({
        businessId: businessId,
        status: status,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      dispatch(slice.actions.getAllProjectByBusinessSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasErrorAllProjectByBusiness(error));
    }
  };
}
export function getProjectByPoM(
  businessId: string | null | undefined,
  status: string,
  pageIndex: number,
  pageSize: 10
) {
  return async () => {
    dispatch(slice.actions.startLoadingAllProjectByPoM());
    try {
      if (!businessId) {
        return;
      }
      const response = await ProjectAPI.gets({
        businessId: businessId,
        status: status,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      dispatch(slice.actions.getAllProjectByPoMSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasErrorAllProjectByPoM(error));
    }
  };
}
export function getMyProject() {
  return async () => {
    dispatch(slice.actions.startMyProjectLoading());
    try {
      const response = await ProjectAPI.gets();
      dispatch(slice.actions.getMyProjectsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getProjectId(projectId: string) {
  return async () => {
    dispatch(slice.actions.startLoadingDetailByID());
    try {
      const response = await ProjectAPI.get({ id: projectId });

      dispatch(slice.actions.getProjectDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function submitProject(projectId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const headers = getHeader();
    try {
      const response = await ProjectAPI.submitProject({
        id: projectId
      });
      dispatch(getProjectId(projectId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function changeStatusProject(projectId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    const headers = getHeader();
    try {
      const response = await ProjectAPI.changeStatusProject({
        id: projectId
      });
      dispatch(getProjectId(projectId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getAllVoucher() {
  return async () => {
    dispatch(slice.actions.startLoadingAllProjectVoucher());
    try {
      const response = await ProjectAPI.getAllProjectVoucher();
      dispatch(slice.actions.getAllProjectVoucherSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasErrorProjectVoucher(error));
    }
  };
}
