export function login (email, password) {
  let loginInfo = {
    email: email,
    password: password
  }
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(loginInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('http://localhost/auth/login', fetchData).then(res => res.json())
}

export function verify () {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch('http://localhost/profile/me', fetchData).then(res => res.json())
}

export function update (updateInfo) {
  updateInfo['suggestions'] = undefined
  updateInfo['tags'] = JSON.stringify(updateInfo['tags'])
  let fetchData = {
    method: 'PATCH',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(updateInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('http://localhost/profile/me', fetchData).then(res => res.json())
}

export function uploadPhoto () {
  var input = document.querySelector('input[type="file"]')

  var data = new FormData()
  data.append('file', input.files[0])

  return fetch('http://localhost/profile/image', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: data
  }).then(res => res.json())
}

export function resetPassword(email) {
  let resetInfo = {
    email: email
  }
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('http://localhost/auth/forgotmypassword', fetchData).then(res => res.json())
}

export function changeEmail(email, token) {
  let resetInfo = {
    email: email
  }
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('http://localhost/auth/changemyemail', fetchData).then(res => res.json())
}

export function resetPasswordWithToken (token, password) {
  let resetInfo = {
    token: token,
    password: password
  }
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('http://localhost/auth/forgotmypassword', fetchData).then(res => res.json())
}

export function changeEmailWithToken (token, email) {
  let resetInfo = {
    email: email,
    token: token
  }
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('http://localhost/auth/changemyemail', fetchData).then(res => res.json())
}