import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import mixpanel from 'mixpanel-browser'

mixpanel.init('993a3d7a78434079b7a9bec245dbaec2')

ReactDOM.render(<App />, document.getElementById('root'))
