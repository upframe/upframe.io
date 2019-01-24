import React from 'react';
import Loadable from 'react-loadable'

export const preload = () => {
  Loadable.preloadAll()
}

const Loading = (props) => {
  console.log('Loading component props')
  console.log(props)
  if (props.error) {
    return <div>Error! <button onClick={props.retry}>Retry</button></div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

export const Main = Loadable({
  loader: () => import('../screens/Main'),
  loading: Loading,
});

export const Login = Loadable({
  loader: () => import('../screens/Login'),
  loading: Loading,
});

export const Onboarding = Loadable({
  loader: () => import('../screens/Onboarding'),
  loading: Loading,
});

export const Settings = Loadable({
  loader: () => import('../screens/Settings'),
  loading: Loading,
});

export const ChangeEmail = Loadable({
  loader: () => import('../screens/ChangeEmail'),
  loading: Loading,
});

export const ResetPassword = Loadable({
  loader: () => import('../screens/ResetPassword'),
  loading: Loading,
});

export const People = Loadable({
  loader: () => import('../screens/People'),
  loading: Loading,
});

export const Expertise = Loadable({
  loader: () => import('../screens/Expertise'),
  loading: Loading,
});

export const Meetup = Loadable({
  loader: () => import('../screens/Meetup'),
  loading: Loading,
});

export const Company = Loadable({
  loader: () => import('../screens/Company'),
  loading: Loading,
});

export const ErrorPage = Loadable({
  loader: () => import('../screens/404'),
  loading: Loading,
});

export const DevPlayground = Loadable({
  loader: () => import('../screens/DevPlayground'),
  loading: Loading,
});

export const GoogleSync = Loadable({
  loader: () => import('../screens/Sync'),
  loading: Loading,
});