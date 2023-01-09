import ReactDOM from 'react-dom'
// Redux
// https://github.com/rt2zz/redux-persist
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import * as _redux from './setup'
import store, { persistor } from './setup/redux/Store'
// Axios
import axios from 'axios'
import { Chart, registerables } from 'chart.js'

// Apps
import { MetronicI18nProvider } from './_metronic/i18n/Metronici18n'
/**
 * TIP: Replace this style import with dark styles to enable dark mode
 *
 * import './_metronic/assets/sass/style.dark.scss'
 *
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/
import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/style.react.scss'
import { AppRoutes } from './app/routing/AppRoutes'

import SessionManager, { IIsomorphicSessionData, ISsrSessionData } from "@Core/session";
import { isNode, showApplicationLoader, hideApplicationLoader } from "@Utils";
import { IApplicationState } from "@Store/index";

import configureStore from "@Store/configureStore";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { ReduxRouter } from '@lagunovsky/redux-react-router';
import { Route, Routes } from 'react-router';
import {App} from '../src/app/App';
import { Navigate, BrowserRouter} from 'react-router-dom';
import {Logout, AuthPage} from '../src/app/modules/auth';
import * as RoutesModule from "./routes";


/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */

/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
// _redux.setupAxios(axios, store)

let routes = RoutesModule.routes;

Chart.register(...registerables)

function setupSession() {
  window["session"] = { serviceUser: null };

  if (!isNode()) {
    SessionManager.resetSession();
    SessionManager.initSession({
      isomorphic: window["session"] as IIsomorphicSessionData,
      ssr: {} as ISsrSessionData
    });
  }
};

setupSession();

// Create browser history to use in the Redux store.
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
const history = createBrowserHistory({ basename: baseUrl });
console.log('baseUrl', baseUrl);
console.log('history', history);

const initialState = (window as any).initialReduxState as IApplicationState;
const store = configureStore(history, initialState);

// _redux.setupAxios(axios, store)

console.log('renderApp history', history);

ReactDOM.render(
  <MetronicI18nProvider>
    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
        {/* <BrowserRouter children={routes}></BrowserRouter> */}
        <AppRoutes />
        {/* <ConnectedRouter history={history} children={<AppRoutes />} /> */}
        {/* <ReduxRouter history={history}> */}
        {/* <Routes>
        <Route element={<App />}>
        <Route path='auth/*' element={<AuthPage />} />

          <Route path='*' element={<Navigate to='/auth' />} />
        </Route>
      </Routes> */}
        {/* <AppRoutes /> */}

        {/* </ReduxRouter> */}
      </PersistGate>
    </Provider>
  </MetronicI18nProvider>,
  document.getElementById('root')
)
