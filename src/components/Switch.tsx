/* 
  custom switch component that flattens children so that react router correctly redirects
  if some of the routes are wrapped in a fragments
*/

import React, { Fragment, ReactNode, Children, isValidElement } from 'react'
import { Switch as RouterSwitch } from 'react-router-dom'

const flatten = (children: ReactNode) =>
  Children.map(children, child => {
    if (!isValidElement(child)) return []
    if (child.type === Fragment) return flatten(child.props.children)
    return [child]
  })

const Switch: React.FC = ({ children }) => (
  <RouterSwitch>{flatten(children)}</RouterSwitch>
)

export default Switch
