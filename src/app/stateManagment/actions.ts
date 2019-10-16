import { createAction, props } from '@ngrx/store';
import { ICity } from 'src/shared/models/ICity.model';

interface Action{
    currentCity:ICity
}
export const CHANGE_TEMP_UNIT =createAction('[Search-box Component]  CHANGE_TEMP_UNIT');
export const SET_CURRENT_CONDITIONS=createAction('[Search-box Component] SET_CURRENT_CONDITIONS',props<{currentCity:ICity}>())