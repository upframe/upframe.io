import React from 'react'
import { Route, Switch } from 'react-router-dom'

const Main = React.lazy(() => import('./screens/Main/Main'))
const Login = React.lazy(() => import('./screens/Login/Login'))
const Register = React.lazy(() => import('./screens/Signup/Signup'))
const Settings = React.lazy(() => import('./screens/Settings/Settings'))
const ChangeEmail = React.lazy(() =>
  import('./screens/ChangeEmail/ChangeEmail')
)
const ResetPassword = React.lazy(() =>
  import('./screens/ResetPassword/ResetPassword')
)
const Profile = React.lazy(() => import('./screens/Mentor/Profile'))
const MeetupConfirm = React.lazy(() => import('./screens/Meetup/Confirm'))
const MeetupRefuse = React.lazy(() => import('./screens/Meetup/Refuse'))
const ErrorPage = React.lazy(() => import('./screens/404'))
const Sync = React.lazy(() => import('./screens/Sync/Sync'))

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/(product|design|software)?" component={Main} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/(register|signup)" component={Register} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/settings/:page" component={Settings} />
      <Route exact path="/404" component={ErrorPage} />
      <Route exact path="/changemyemail/:token" component={ChangeEmail} />
      <Route exact path="/resetmypassword/:token" component={ResetPassword} />
      <Route exact path="/meetup/confirm/:meetupid" component={MeetupConfirm} />
      <Route exact path="/meetup/re fuse/:meetupid" component={MeetupRefuse} />
      <Route exact path="/sync" component={Sync} />
      <Route exact path="/:keycode" component={Profile} />
      <Route component={ErrorPage} />
    </Switch>
  )
}
