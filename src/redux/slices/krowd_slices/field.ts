import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import axios from 'axios';
import { Field } from '../../../@types/krowd/fields';
import { FieldAPI } from '_apis_/krowd_apis/field';

// ----------------------------------------------------------------------

export type FieldState = {
  isLoading: boolean;
  error: boolean;
  fieldList: {
    numOfField: number;
    listOfField: Field[];
  };
  activeFieldId: Field | null;
};

const initialState: FieldState = {
  isLoading: false,
  error: false,
  activeFieldId: null,
  fieldList: {
    numOfField: 0,
    listOfField: []
  }
};

const slice = createSlice({
  name: 'fields',
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

    getFieldByIdSuccess(state, action) {
      state.isLoading = false;
      state.activeFieldId = action.payload;
    },
    // GET MANAGE USERS
    getFieldListSuccess(state, action) {
      state.isLoading = false;
      state.fieldList = action.payload;
    },
    // GET MANAGE USERS
    getFieldListSuccessFollowByBusinessId(state, action) {
      state.isLoading = false;
      state.fieldList.listOfField = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export function getFieldList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await FieldAPI.gets();
      dispatch(slice.actions.getFieldListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getFieldListFollowbyBusinessID() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await FieldAPI.gets();
      dispatch(slice.actions.getFieldListSuccessFollowByBusinessId(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getFieldById(fieldId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `https://ec2-13-215-197-250.ap-southeast-1.compute.amazonaws.com/api/v1.0/fields/${fieldId}`
      );
      dispatch(slice.actions.getFieldByIdSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
