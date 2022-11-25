import { createSlice } from '@reduxjs/toolkit';
import { dispatch, store } from '../../store';
// utils
import axios from 'axios';
import {
  Package,
  ProjectEntityFormValues,
  ProjectEntityUpdate
} from '../../../@types/krowd/project';
import { ProjectAPI } from '_apis_/krowd_apis/project';
// ----------------------------------------------------------------------

type ProjectState = {
  isLoading: boolean;
  error: boolean;
  packageLists: {
    numOfPackage: number;
    listOfPackage: Package[];
  };
  projectPackageDetails: Package | null;
  projectEntity: ProjectEntityFormValues | null;
  projectEntityDetail: ProjectEntityUpdate | null;
};

const initialState: ProjectState = {
  isLoading: false,
  error: false,
  packageLists: {
    numOfPackage: 0,
    listOfPackage: []
  },
  projectPackageDetails: null,
  projectEntityDetail: null,
  projectEntity: null
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET MANAGE Package
    getProjectPackageSuccess(state, action) {
      state.isLoading = false;
      state.packageLists = action.payload;
    },
    // GET MANAGE Package
    getPackageIDSuccess(state, action) {
      state.isLoading = false;
      state.projectPackageDetails = action.payload;
    },
    // GET MANAGE PE
    getProjectEntitySuccess(state, action) {
      state.isLoading = false;
      state.projectEntity = action.payload;
    },
    // GET MANAGE UPDATE PE
    getProjectEntityDetailSuccess(state, action) {
      state.isLoading = false;
      state.projectEntityDetail = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProjectPackage(projectId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await ProjectAPI.getProjectPackage({ id: projectId });
      dispatch(slice.actions.getProjectPackageSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getPackageID(Id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await ProjectAPI.getPackageID({ id: Id });
      dispatch(slice.actions.getPackageIDSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getProjectEntityID(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await ProjectAPI.getProjectEntityID({ id: id });
      dispatch(slice.actions.getProjectEntityDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getProjectEntityIDUpdate(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await ProjectAPI.getProjectEntityID({ id: id });
      dispatch(slice.actions.getProjectEntityDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function delProjectEntityID(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await ProjectAPI.delProjectEntityID({ id: id });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function delProjectPackageID(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await ProjectAPI.delPackageID({ id: id });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getAllProjectEntity(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await ProjectAPI.getAllProjectEntity({ id: id });
      dispatch(slice.actions.getProjectEntityDetailSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
