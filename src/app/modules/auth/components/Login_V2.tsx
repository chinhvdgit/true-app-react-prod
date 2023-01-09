/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState, useRef } from 'react'
import {useDispatch} from 'react-redux'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, Navigate } from 'react-router-dom'
import { Helmet } from "react-helmet";

import {useFormik} from 'formik'
import { Formik, Field } from "formik";
import FormValidator from "@Components/shared/FormValidator";
import { FormGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import * as auth from '../redux/AuthRedux'
import {login} from '../redux/AuthCRUD'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import { Redirect, RouteComponentProps } from "react-router";
import { withStore } from "@Store/index";
import { ILoginModel } from "@Models/ILoginModel";
import * as loginStore from "@Store/loginStore";
import SessionManager from "@Core/session";
import {getUserByToken} from '../redux/AuthCRUD'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: 'admin@demo.com',
  password: 'demo',
}

import { useLocation, useNavigate, useParams } from 'react-router-dom';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        location={location}
        params={params}
        navigate={navigate}
      />
    );
  }

  return ComponentWithRouterProp;
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

type Props = RouteComponentProps<{}> & typeof loginStore.actionCreators & loginStore.ILoginStoreState;

const Login: React.FC<Props> = (props: Props) => {
  const formValidator = useRef<FormValidator>(null);
  const dispatch = useDispatch();

  const onSubmit = async (data: ILoginModel) => {
      if (formValidator.current.isValid()) {
        console.log('onsubmit', data);
        

            await props.login(data);

            // dispatch(auth.actions.login("$2y$10$lzYGs3CVjxdlR2ERLfZOyezaXM8qXLGd5fHEkjoBmDxznEl.CvAdC"));

            // const {data: user} = await getUserByToken("$2y$10$lzYGs3CVjxdlR2ERLfZOyezaXM8qXLGd5fHEkjoBmDxznEl.CvAdC")

            const user = {};
          dispatch(auth.actions.fulfillUser(user))


      }
  };

  console.log('SessionManager.isAuthenticated', SessionManager.isAuthenticated);

  if (SessionManager.isAuthenticated && props.isLoginSuccess) {
       return <Navigate to="/dashboard" />;


  }

  // if (SessionManager.isAuthenticated && props.isLoginSuccess) {
  //   // return <Navigate to="/" state={{ from: location }} replace />; //return <Redirect to="/" />;
  //   // return <Navigate to="/error/404" />;
  //   return <Navigate to='/dashboard' />;
  // }

  return <div id="loginPage">

      <Helmet>
          <title>Login page - TrueApplication_ClientApp</title>
      </Helmet>

      <div id="loginContainer">

          <p className="text-center">Type any login and password to enter.</p>

          <Formik
              enableReinitialize
              initialValues={{} as ILoginModel}
              onSubmit={async (values, { setSubmitting }) => {
                  await onSubmit(values);
              }}
          >
              {({ values, handleSubmit }) => {

                  return <FormValidator ref={x => formValidator.current = x}>

                      <FormGroup>
                          <Field name={nameof.full<ILoginModel>(x => x.login)}>
                              {({ field }) => (
                                  <>
                                      <label className="control-label" htmlFor="login">Login</label>
                                      <input
                                          type="text"
                                          className="form-control"
                                          id="login"
                                          name={field.name}
                                          data-val-required="true"
                                          data-msg-required="Login is required."
                                          value={field.value || ''}
                                          onChange={field.onChange}
                                      />
                                  </>
                              )}
                          </Field>
                      </FormGroup>

                      <FormGroup>
                          <Field name={nameof.full<ILoginModel>(x => x.password)}>
                              {({ field }) => (
                                  <>
                                      <label htmlFor="password">Password</label>
                                      <input
                                          type="password"
                                          className="form-control"
                                          id="password"
                                          name={field.name}
                                          data-val-required="true"
                                          data-msg-required="Password is required."
                                          value={field.value || ''}
                                          onChange={field.onChange}
                                      />
                                  </>
                              )}
                          </Field>
                      </FormGroup>

                      <div className="form-inline">
                          <Button onClick={() => handleSubmit()}>Sign in</Button>
                      </div>

                  </FormValidator>
              }}
          </Formik>

      </div>
  </div>;
}

// Connect component with Redux store.
var connectedComponent = withStore(
    Login,
    state => state.login, // Selects which state properties are merged into the component's props.
    loginStore.actionCreators, // Selects which action creators are merged into the component's props.
);

// Attach the React Router to the component to have an opportunity
// to interract with it: use some navigation components, 
// have an access to React Router fields in the component's props, etc.
export default withRouter(connectedComponent);
