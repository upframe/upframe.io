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