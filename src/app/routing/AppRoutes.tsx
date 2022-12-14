/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import { PrivateRoutes } from './PrivateRoutes'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { Logout, AuthPage } from '../modules/auth'
import { RootState } from '../../setup'
import { App } from '../App'
import SessionManager from "@Core/session";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
//const PUBLIC_URL = process.env.PUBLIC_URL
const { PUBLIC_URL } = process.env
console.log('PUBLIC_URL', PUBLIC_URL);
console.log('REACT_APP_PUBLIC_URL', process.env.REACT_APP_PUBLIC_URL);

const AppRoutes: FC = () => {
  // const isAuthorized = true //useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  // const isAuthorized = SessionManager.isAuthenticated; //useSelector<RootState>(({auth}) => auth.user, shallowEqual)

  const isAuthorized = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)

  console.log('AppRoutes isAuthorized', isAuthorized);

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {isAuthorized ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
