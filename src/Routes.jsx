import React from 'react'
import { Route, Switch } from 'react-router-dom'

const Main = React.lazy(() => import('./screens/Main/Main'))
const Login = React.lazy(() => import('./screens/Login'))
const Register = React.lazy(() => import('./screens/Signup/Signup'))
const Settings = React.lazy(() => import('./screens/Settings/Settings'))
const Profile = React.lazy(() => import('./screens/Mentor/Profile'))
const MeetupConfirm = React.lazy(() => import('./screens/Meetup/Confirm'))
const MeetupCancel = React.lazy(() => import('./screens/Meetup/Cancel'))
const ErrorPage = React.lazy(() => import('./screens/404'))
const List = React.lazy(() => import('./screens/List'))
const ResetPassword = React.lazy(() => import('./screens/ResetPassword'))
const ResetEmail = React.lazy(() => import('./screens/ResetEmail'))
const Privacy = React.lazy(() => import('./screens/Privacy'))

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/(list|tag)/:list" component={List} />
      <Route exact path="/search" component={List} />
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup/:token?" component={Register} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/settings/:page" component={Settings} />
      <Route exact path="/meetup/confirm/:meetupid" component={MeetupConfirm} />
      <Route exact path="/meetup/cancel/:meetupid" component={MeetupCancel} />
      <Route exact path="/404" component={ErrorPage} />
      <Route exact path="/:handle" component={Profile} />
      <Route exact path="/reset/password/:token?" component={ResetPassword} />
      <Route exact path="/reset/email/:token?" component={ResetEmail} />
      <Route component={ErrorPage} />
    </Switch>
  )
}
