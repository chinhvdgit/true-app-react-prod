import * as React from "react";
import { Route, RouteProps, Navigate, Routes } from "react-router";
import SessionManager from "@Core/session";
import responseContext from "@Core/responseContext";

export interface IProps extends RouteProps {
    layout: React.ComponentClass<any>;
    statusCode?: number;
}

const AppRoute: React.FC<IProps> =
    ({ component: Component, layout: Layout, statusCode: statusCode, path: Path, ...rest }: IProps) => {

console.log('AppRoute');

        var isLoginPath = Path === "/login";

        if (!SessionManager.isAuthenticated && !isLoginPath) {
            return <Navigate to="/login" />;
        }

        if (SessionManager.isAuthenticated && isLoginPath) {
            return <Navigate to="/" />;
        }

        if (statusCode == null) {
            responseContext.statusCode = 200;
        } else {
            responseContext.statusCode = statusCode;
        }

        // return <Route {...rest} render={props => (
        //     <Layout>
        //         <Component {...props} />
        //     </Layout>
        // )} />;

        return <Route {...rest} render={props => (
            <Layout>
                <Component {...props} />
            </Layout>
        )} />;
    };

export default AppRoute;