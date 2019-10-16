import { CHANGE_TEMP_UNIT, SET_CURRENT_CONDITIONS } from './actions';
import { createReducer, on } from '@ngrx/store';
import { ICity } from 'src/shared/models/ICity.model';

export const tempUnitInitState = "Metric";
export interface State {
    currentCity: ICity
}

export const currCondInitState:State = {
    currentCity: null
}

const _tempUnitReducer = createReducer(tempUnitInitState,
    on(CHANGE_TEMP_UNIT, state => {
        return (state == "Metric") ? "Imperial" : "Metric";
    }
));

const _currentConditionsReducer = createReducer(currCondInitState,
    on(SET_CURRENT_CONDITIONS, (state,{currentCity}) => {
        return { ...state, currentCity:currentCity }
    })

);

export function currentConditionsReducer(state, action) {
    return _currentConditionsReducer(state, action);
}

export function tempUnitReducer(state, action) {
    return _tempUnitReducer(state, action);
}
