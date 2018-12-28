let host = process.env.REACT_APP_APIHOST,
    port = process.env.REACT_APP_APIPORT,
  schema = process.env.REACT_APP_APISCHEMA

if(process.env.REACT_APP_ENV === 'dev') {
  console.log(`Using API at ${host} on port ${port} via a${schema === 'https' ? ' secure': 'n insecure'} connection.`)
}

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
  return fetch(`${schema}://${host}:${port}/auth/login`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/auth/register`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/auth/forgotmypassword`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/auth/changemyemail`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/auth/forgotmypassword`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/auth/changemyemail`, fetchData).then((res) => res.json())
}

export function verifyKeycode (keycode) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`${schema}://${host}:${port}/mentor/verify?keycode=${keycode}`, fetchData).then((res) => res.json())
}

export function verifyUniqueId(uniqueid) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`${schema}://${host}:${port}/mentor/verify?uniqueid=${uniqueid}`, fetchData).then((res) => res.json())
}

export function getRandomMentors() {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`${schema}://${host}:${port}/mentor/random`, fetchData).then((res) => res.json())
}

export function getMentorInfo(keycode) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`${schema}://${host}:${port}/mentor/${keycode}`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/meetup/`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/meetup`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/meetup/confirm?meetup=${meetupId}`, fetchData).then((res) => res.json())
}

export function refuseMeetup(meetupId) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch(`${schema}://${host}:${port}/meetup/refuse?meetup=${meetupId}`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/profile/me`, fetchData).then((res) => res.json())
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
  return fetch(`${schema}://${host}:${port}/profile/me`, fetchData).then((res) => res.json())
}

export function uploadPhoto () {
  var input = document.querySelector('input[type="file"]')

  var data = new FormData()
  data.append('file', input.files[0])

  return fetch(`${schema}://${host}:${port}/profile/image`, {
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
  return fetch(`${schema}://${host}:${port}/search/quick?term=${query}`, fetchData).then((res) => res.json())
}

export function searchFull(query) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`${schema}://${host}:${port}/search/full?term=${query}`, fetchData).then((res) => res.json())
}

export function getSearchTags() {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`${schema}://${host}:${port}/search/tags`, fetchData).then((res) => res.json())
}

export function addFreeSlots(freeSlots) {
  //Free slots vêem na forma
  // id: currentId,
  // start: slot.start,
  // end: slot.end,
  // title: 'Upframe Free Slot',
  // tag: 'upframe-free-slot'
  let updatedSlots = freeSlots.map((slot) => {
    return {
      start: slot.start,
      end: slot.end
    }
  })
  let body = {
    'updated': updatedSlots
  }
  let fetchData = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch(`${schema}://${host}:${port}/mentor/slots`, fetchData).then((res) => res.json())
}

export function getFreeSlots (start, end) {
  let fetchData = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  return fetch(`${schema}://${host}:${port}/mentor/slots?start=${start}&?end=${end}`, fetchData).then((res) => res.json())
}