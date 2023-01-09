// Import polyfills.
import "core-js/stable";
import "custom-event-polyfill";
import "event-source-polyfill";

// Import global styles.
import "bootstrap/dist/css/bootstrap.min.css";
import "@Styles/main.scss";
import "@Styles/loaders/queryLoader.scss";
import "react-toastify/dist/ReactToastify.css";

// Other imports.
import * as React from "react";
import * as ReactDOM from "react-dom";
import configureStore from "@Store/configureStore";
import SessionManager, { IIsomorphicSessionData, ISsrSessionData } from "@Core/session";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { isNode, showApplicationLoader, hideApplicationLoader } from "@Utils";
import * as RoutesModule from "./routes";
import { IApplicationState } from "@Store/index";
import AccountService from '@Services/AccountService';

import ReactDOM from 'react-dom'
// Redux
// https://github.com/rt2zz/redux-persist
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import * as _redux from './setup'
import {persistStore} from 'redux-persist'
// import store, { persistor } from './setup/redux/Store'
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

let routes = RoutesModule.routes;

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

function setupGlobalPlugins() {
    // Use this function to configure plugins on the client side.
};

function setupEvents() {

    showApplicationLoader();

    document.addEventListener("DOMContentLoaded", () => {
        hideApplicationLoader();
    });
};

// Create browser history to use in the Redux store.
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as IApplicationState;
const store = configureStore(history, initialState);
const persistor = persistStore(store);

function renderApp() {

    console.log('renderApp');

    // This code starts up the React app when it runs in a browser. 
    // It sets up the routing configuration and injects the app into a DOM element.
    // ReactDOM.hydrate(
    //     <AppContainer>
    //         <Provider store={store}>
    //             <ConnectedRouter history={history} children={routes} />
    //         </Provider>
    //     </AppContainer>,
    //     document.getElementById("root")
    // );

    ReactDOM.render(
        <MetronicI18nProvider>
            <Provider store={store}>
                {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
                <PersistGate persistor={persistor} loading={<div>Loading...</div>}>
                    <AppRoutes />
                </PersistGate>
            </Provider>
        </MetronicI18nProvider>,
        document.getElementById("root")
    );
}

// Setup the application and render it.
setupSession();
setupGlobalPlugins();
setupEvents();
// renderApp();


console.log('begin renderApp');
const service = new AccountService();
renderApp()
// service.refreshToken().then(result => renderApp());


// Allow Hot Module Replacement.
if (module.hot) {
    console.log('module.hot', module.hot);

    module.hot.accept("./routes", () => {
        routes = require<typeof RoutesModule>("./routes").routes;
        renderApp();
    });
}