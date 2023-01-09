import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest, select} from 'redux-saga/effects'
import {UserModel} from '../modules/auth/models/UserModel'
import {getUserByToken} from "../modules/auth/redux/AuthCRUD";
import AccountService from '@Services/AccountService';
export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
}

const initialAuthState: IAuthState = {
  user: undefined,
  accessToken: undefined,
}

export interface IAuthState {
  user?: UserModel
  accessToken?: string
}

export const reducer = persistReducer(
  {storage, key: 'v100-demo1-auth', whitelist: ['user', 'accessToken']},
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
    console.log('authStore login');

        const accessToken = action.payload?.accessToken
        return {accessToken, user: undefined}
      }

      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken
        return {accessToken, user: undefined}
      }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        return {...state, user}
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return {...state, user}
      }

      default:
        return state
    }
  }
)

export const actions = {
  login: (accessToken: string) => ({type: actionTypes.Login, payload: {accessToken}}),
  register: (accessToken: string) => ({
    type: actionTypes.Register,
    payload: {accessToken},
  }),
  logout: () => ({type: actionTypes.Logout}),
  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),
  fulfillUser: (user: UserModel) => ({type: actionTypes.UserLoaded, payload: {user}}),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}})
}

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    console.log('authStore login');
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    console.log('authStore UserRequested');

    const service = new AccountService();

    const model = {login: "admin", password: "1"};

    yield service.login(model);

    // @ts-ignore
    const getToken = (state) => state.auth.accessToken;
    // @ts-ignore
    let token = yield select(getToken)
    const {data: user} = yield getUserByToken(token)
    yield put(actions.fulfillUser(user))
  })
}
