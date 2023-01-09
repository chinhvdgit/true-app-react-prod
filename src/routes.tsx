import * as React from 'react';
import {ErrorsPage} from '../src/app/modules/errors/ErrorsPage'
import {Logout, AuthPage} from '../src/app/modules/auth'
import {App} from '../src/app/App'
import {Outlet, Route, Routes} from 'react-router-dom'
import AppRoute from "@Components/shared/AppRoute";
import GuestLayout from "@Layouts/GuestLayout";


export const routes = <Routes>
    <Route element={<App />}>
    <Route path='/login/*' element={<AppRoute layout={GuestLayout} exact path="/login" component={AuthPage} />} />

    

          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          <Route path='auth/*' element={<AuthPage />} />
        </Route>
</Routes>;