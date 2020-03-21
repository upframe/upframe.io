import React from 'react'
import { Route, Switch } from 'react-router-dom'

const Main = React.lazy(() => import('./screens/Main/Main'))
const Login = React.lazy(() => import('./screens/Login/Login'))
const Register = React.lazy(() => import('./screens/Signup/Signup'))
const Settings = React.lazy(() => import('./screens/Settings/Settings'))
const Profile = React.lazy(() => import('./screens/Mentor/Profile'))
const MeetupConfirm = React.lazy(() => import('./screens/Meetup/Confirm'))
const MeetupCancel = React.lazy(() => import('./screens/Meetup/Cancel'))
const ErrorPage = React.lazy(() => import('./screens/404'))
const Sync = React.lazy(() => import('./screens/Sync/Sync'))
const List = React.lazy(() => import('./screens/List'))

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/list/:list" component={List} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/(register|signup)" component={Register} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/settings/:page" component={Settings} />
      <Route exact path="/404" component={ErrorPage} />
      <Route exact path="/meetup/confirm/:meetupid" component={MeetupConfirm} />
      <Route exact path="/meetup/cancel/:meetupid" component={MeetupCancel} />
      <Route exact path="/sync" component={Sync} />
      <Route exact path="/:handle" component={Profile} />
      <Route component={ErrorPage} />
    </Switch>
  )
}
