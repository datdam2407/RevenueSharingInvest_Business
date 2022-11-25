import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../../store';
// utils
import { Areas } from '../../../@types/krowd/areaKrowd';
import axios from 'axios';
import { AreaAPI } from '_apis_/krowd_apis/area';

// ----------------------------------------------------------------------

type AreasState = {
  isLoading: boolean;
  error: boolean;
  areaList: Areas[];
  areaListFilter: Areas[];
};

const initialState: AreasState = {
  isLoading: false,
  error: false,
  areaList: [],
  areaListFilter: []
};

const slice = createSlice({
  name: 'area',
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

    // GET MANAGE USERS
    getAreaListSuccess(state, action) {
      state.isLoading = false;
      state.areaList = action.payload;
    },
    getAreaListFilterSuccess(state, action) {
      state.isLoading = false;
      state.areaListFilter = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getAreasList() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await AreaAPI.gets();
      dispatch(slice.actions.getAreaListSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function filterAreas(areaList: Areas[], city: string | null) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = city ? areaList.filter((area) => area.city === city) : [];
      dispatch(slice.actions.getAreaListFilterSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
