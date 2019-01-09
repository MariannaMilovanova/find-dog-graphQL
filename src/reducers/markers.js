import * as types from '../actions/types';
import { get, toLower, omit, values } from 'lodash';
import { applyFilters } from './helpFunctions';

function markers(state = { temp: {}, selected: {}, filters: {} }, action) {
  switch (action.type) {
    case types.GET_SAVED_MARKERS:
      return { ...state, ...action.markers, selected: {}, temp: {} };
    case types.SELECT_MARKER:
      return { ...state, selected: action.marker, temp: {} };
    case types.CANCEL_ADD_PET:
      return { ...state, temp: {}, selected: {} };
    case types.ADD_TEMP_MARKER: {
      const { marker } = action;
      return {
        ...state,
        temp: marker,
        selected: {},
        filters: {},
        filtered: []
      };
    }
    case types.ClEAR_FILTERS:
      return { ...state, filters: {}, filtered: [] };
    case types.FILTER_MARKERS: {
      const { filterBy, value, isPetChanged } = action;
      const markers = omit(state, ['selected', 'temp', 'filtered', 'filters']);
      const breed = filterBy === 'breed' ? value : isPetChanged ? '' :  state.filters.breed;
      const newFilters = { ...state.filters, [filterBy]: value, breed };

      return {
        ...state,
        filters: newFilters,
        filtered: applyFilters(values(markers), newFilters)
      };
    }
    case types.UPLOAD_PICTURE: {
      const { secure_url } = action.payload.data;
      return { ...state, temp: { ...state.temp, url: secure_url } };
    }
    case types.UPDATE_DATA: {
      const { _id } = action;
      const info = get(action, 'data', {});
      const userId = localStorage.getItem('active') || 'unknown';
      const newPhoto = get(state, 'selected.url');
      const marker = {
        ...state[_id],
        type: toLower(get(info, 'foundOrLost', 'temp')),
        _id,
        info,
        userId: userId,
        url: newPhoto
      };

      const savedMarkers = JSON.parse(localStorage.getItem('markers')) || {};
      const markersToSave = { ...savedMarkers, [_id]: marker };
      localStorage.setItem('markers', JSON.stringify(markersToSave));

      return {
        ...state,
        [_id]: marker,
        temp: {},
        selected: marker
      };
    }
    case types.CHANGE_PHOTO: {
      const { _id } = action;
      const info = get(action, 'data', {});
      const userId = localStorage.getItem('active') || 'unknown';
      const { secure_url } = action.payload.data;
      const marker = {
        ...state[_id],
        type: toLower(get(info, 'foundOrLost', 'temp')),
        _id,
        info,
        userId: userId,
        url: secure_url
      };

      const savedMarkers = JSON.parse(localStorage.getItem('markers')) || {};
      const markersToSave = { ...savedMarkers, [_id]: marker };
      localStorage.setItem('markers', JSON.stringify(markersToSave));

      return {
        ...state,
        [_id]: { ...marker },
        temp: { ...state.temp, url: secure_url },
        selected: { ...state.selected, url: secure_url }
      };
    }
    case types.ADD_PET: {
      const { _id } = action;
      const info = get(action, 'data', {});
      const userId = localStorage.getItem('active') || 'unknown';
      const marker = {
        ...state.temp,
        type: toLower(get(info, 'foundOrLost', 'temp')),
        _id,
        info,
        userId: userId
      };

      const savedMarkers = JSON.parse(localStorage.getItem('markers')) || {};
      const markersToSave = { ...savedMarkers, [_id]: marker };
      localStorage.setItem('markers', JSON.stringify(markersToSave));

      return {
        ...state,
        [_id]: marker,
        temp: {}
      };
    }
    case types.DELETE_MARKER: {
      const { _id } = action;
      const savedMarkers = JSON.parse(localStorage.getItem('markers')) || {};
      const markersToSave = omit(savedMarkers, _id);

      localStorage.setItem('markers', JSON.stringify(markersToSave));
      return { ...omit(state, _id), temp: {}, selected: {} };
    }

    default:
      return state;
  }
}

export default markers;
