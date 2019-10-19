import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import Api from '../utils/Api'

const Register = () => {

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [developerPass, setDevPass] = useState('')

  const handleLogin = () => {
    Api.register(email, password, name, developerPass).then((res) => {
      if (res.ok ===  1) {
        setEmail('')
        setName('')
        setPassword('')
        setDevPass('')
        alert('New mentor added')


        Api.login(email, password).then((res) => {
          if (res.ok === 1) {
            // redirect to settings page after mentor register is done successfully 
            setTimeout(() => {
              window.location.pathname = "/settings/public"
            }, 500)
          } else {
            alert('Could not log you in')
          }
        })
      } else {
        alert('Error adding new mentor')
      }
    })
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Register | Upframe</title>
        <meta property="og:title" content="Register | Upframe"></meta>
        <meta property="og:description" content="Register for Connect by Upframe"></meta>
        <meta property="og:image" content="/android-chrome-192x192.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Helmet>

      <main id='login'>
        <div className='container flex justifycontent-center'>
          <div className='flex flex-column'>
            <div className='field-group'>
              <label for='name'>Name</label>
              <input id='name' type='text' name='name' placeholder='Mr. Awesome Mentor' onChange={e => setName(e.target.value)} value={name}/>
            </div>
            <div className='field-group'>
              <label for='email'>Email</label>
              <input id='email' type='email' name='email' placeholder='awesome@upframe.io' onChange={e => setEmail(e.target.value)} value={email}/>
            </div>
            <div className='field-group'>
              <label for='password'>Password</label>
              <input id='password' type='password' placeholder='Sup3r S4f3 P4ssw0rd' onChange={e => setPassword(e.target.value)} value={password}/>
            </div>
            <div className='field-group'>
              <label for='devpass'>Upframe Dev Mode Pass</label>
              <input id='devpass' type='text' placeholder='Nuclear code' onChange={e => setDevPass(e.target.value)} value={developerPass}/>
            </div>
            <button type='submit' className='btn btn-primary center' onClick={handleLogin}>Create Account</button>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}

export default Register;