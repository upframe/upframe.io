export function login (email, password) {
  let fetchBody = {email, password}
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(fetchBody),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/auth/login', fetchData).then((res) => res.json())
}

export function register (email, password, name) {
  let fetchBody = {email, password, name}
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(fetchBody),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/auth/register', fetchData).then((res) => res.json())
}

export function resetPassword(email) {
  let resetInfo = {email}
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/auth/forgotmypassword', fetchData).then((res) => res.json())
}

export function changeEmail(email) {
  let resetInfo = {email}
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/auth/changemyemail', fetchData).then((res) => res.json())
}

export function resetPasswordWithToken(token, password) {
  let resetInfo = {token, password}
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/auth/forgotmypassword', fetchData).then((res) => res.json())
}

export function changeEmailWithToken(token, email) {
  let resetInfo = {email, token}
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(resetInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/auth/changemyemail', fetchData).then((res) => res.json())
}

export function verifyKeycode (keycode) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`https://api.upframe.io/mentor/verify?keycode=${keycode}`, fetchData).then((res) => res.json())
}

export function verifyUniqueId(uniqueid) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`https://api.upframe.io/mentor/verify?uniqueid=${uniqueid}`, fetchData).then((res) => res.json())
}

export function getRandomMentors() {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch('https://api.upframe.io/mentor/random', fetchData).then((res) => res.json())
}

export function getMentorInfo(keycode) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`https://api.upframe.io/mentor/${keycode}`, fetchData).then((res) => res.json())
}

export function createMeetup (location, start, mentorKeycode) {
  let fetchBody = {location, start, mentorKeycode}
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(fetchBody),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/meetup/', fetchData).then((res) => res.json())
}

export function getMeetups() {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/meetup', fetchData).then((res) => res.json())
}

export function confirmMeetup(meetupId) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch(`https://api.upframe.io/meetup/confirm?meetup=${meetupId}`, fetchData).then((res) => res.json())
}

export function getUserInfo () {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch('https://api.upframe.io/profile/me', fetchData).then((res) => res.json())
}

export function updateUserInfo (updateInfo) {
  let fetchData = {
    method: 'PATCH',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(updateInfo),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch('https://api.upframe.io/profile/me', fetchData).then((res) => res.json())
}

export function uploadPhoto () {
  var input = document.querySelector('input[type="file"]')

  var data = new FormData()
  data.append('file', input.files[0])

  return fetch('https://api.upframe.io/profile/image', {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    body: data
  }).then((res) => res.json())
}

export function searchQuick(query) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`https://api.upframe.io/search/quick?term=${query}`, fetchData).then((res) => res.json())
}

export function searchFull(query) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`https://api.upframe.io/search/full?term=${query}`, fetchData).then((res) => res.json())
}

export function getSearchTags() {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch('https://api.upframe.io/search/tags', fetchData).then((res) => res.json())
}