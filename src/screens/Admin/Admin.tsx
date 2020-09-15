import React from 'react'
import { Switch, Link } from 'react-router-dom'
import styled from 'styled-components'
import AdminRoute from '../../components/AdminRoute'
import Redirects from '../Redirects'
import Logs from './Logs'
import ListsAdmin from './ListsAdmin'

export default function Admin() {
  //TODO: return 404 if user is not admin
  return (
    <Styles.Layout>
      <Styles.Links>
        <Link to="/admin/redirects">Redirects</Link>
        <Link to="/admin/lists">Lists</Link>
      </Styles.Links>
      <Switch>
        <AdminRoute path="/admin/redirects" component={Redirects} />
        <AdminRoute path="/admin/lists" component={ListsAdmin} />
      </Switch>
      <Logs />
    </Styles.Layout>
  )
}

const Styles = {
  Layout: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 46px;

    & > a:hover {
      text-decoration: underline;
    }
  `,
  Links: styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 1rem;
    padding-right: 1rem;

    > *:not(:last-child) {
      margin-bottom: 8px;
      font-size
    }
  `,
}
