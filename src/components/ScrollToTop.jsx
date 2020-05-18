import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'

export default withRouter(({ history }) => {
  useEffect(() => history.listen(() => window.scrollTo(0, 0)), [history])
  return null
})
