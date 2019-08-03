const EXPIRY = 60 * 1000;

export class Api {
  constructor() {
    this.cache = {}
    this.time = null
    this.cached = false
    this.host = process.env.REACT_APP_APIHOST
    this.port = process.env.REACT_APP_APIPORT
    this.schema = process.env.REACT_APP_APISCHEMA
    if (process.env.REACT_APP_ENV === 'dev') {
      console.log(`Using API at ${this.host} on port ${this.port} via a${this.schema === 'https' ? ' secure' : 'n insecure'} connection.`)
    }
  }

  login(email, password) {
    let fetchBody = {
      email,
      password
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(fetchBody),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/login`, fetchData).then((res) => res.json())
  }

  logout() {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return fetch(`${this.schema}://${this.host}:${this.port}/auth/logout`, fetchData).then((res) => res.json())
  }

  register(email, password, name, developerPass) {
    let fetchBody = {
      email,
      password,
      type: 'mentor',
      name,
      developerPass
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(fetchBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/register`, fetchData).then((res) => res.json())
  }

  resetPassword(email) {
    let resetInfo = {
      email
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(resetInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/forgotmypassword`, fetchData).then((res) => res.json())
  }

  changeEmail(email) {
    let resetInfo = {
      email
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(resetInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/changemyemail`, fetchData).then((res) => res.json())
  }

  resetPasswordWithToken(token, password) {
    let resetInfo = {
      token,
      password
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(resetInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/forgotmypassword`, fetchData).then((res) => res.json())
  }

  changeEmailWithToken(token, email) {
    let resetInfo = {
      email,
      token
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(resetInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/changemyemail`, fetchData).then((res) => res.json())
  }

  verifyKeycode(keycode) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/mentor/verify?keycode=${keycode}`, fetchData).then((res) => res.json())
  }

  verifyUniqueId(uniqueid) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/mentor/verify?uniqueid=${uniqueid}`, fetchData).then((res) => res.json())
  }

  async getAllMentors(slots) {
    if (this.cached && this.time > Date.now() - EXPIRY) {
      return this.cache
    }
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    let req = fetch(`${this.schema}://${this.host}:${this.port}/mentor/all${slots ? '?slots=true' : ''}`, fetchData).then((res) => res.json())
    this.time = Date.now()
    this.cached = true
    this.cache = req
    return await req
  }

  getRandomMentors() {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/mentor/random`, fetchData).then((res) => res.json())
  }

  getMentorInfo(keycode) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/mentor/${keycode}`, fetchData).then((res) => res.json())
  }

  createMeetup(sid, location, message, email, name, timeoffset) {
    let fetchBody = {
      sid,
      location,
      message,
      email,
      name,
      timeoffset
    }

    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(fetchBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/meetup/`, fetchData).then((res) => res.json())
  }

  getMeetups() {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/meetup`, fetchData).then((res) => res.json())
  }

  confirmMeetup(meetupId) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/meetup/confirm?meetup=${meetupId}`, fetchData).then((res) => res.json())
  }

  refuseMeetup(meetupId) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/meetup/refuse?meetup=${meetupId}`, fetchData).then((res) => res.json())
  }

  getUserInfo() {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/profile/me`, fetchData).then((res) => res.json())
  }

  updateUserInfo(updateInfo) {
    let fetchData = {
      method: 'PATCH',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(updateInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/profile/me`, fetchData).then((res) => res.json())
  }

  uploadPhoto() {
    let input = document.querySelector('input[type="file"]')
    let data = new FormData()
    data.append('file', input.files[0])
    let fetchData = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      body: data
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/profile/image`, fetchData).then((res) => res.json())
  }

  searchQuick(query) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/search/quick?term=${query}`, fetchData).then((res) => res.json())
  }

  searchFull(query) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/search/full?term=${query}`, fetchData).then((res) => res.json())
  }

  getSearchTags() {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/search/tags`, fetchData).then((res) => res.json())
  }

  addFreeSlots(freeSlotsToSave, freeSlotsToDelete) {
    //Free slots vêem na forma
    // id: currentId,
    // start: slot.start,
    // end: slot.end,
    // title: 'Upframe Free Slot',
    // tag: 'upframe-free-slot'
    let updatedSlots = freeSlotsToSave.map((slot) => {
      return {
        start: slot.start,
        end: slot.end,
        recurrency: 'UNIQUE'
      }
    })
    let deletedSlots = freeSlotsToDelete.map((slot) => slot.id)
    let body = {
      'updated': updatedSlots,
      'deleted': deletedSlots
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
    return fetch(`${this.schema}://${this.host}:${this.port}/mentor/slots`, fetchData).then((res) => res.json())
  }

  getFreeSlots(start, end) {
    let fetchData = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/mentor/slots?start=${start}&?end=${end}`, fetchData).then((res) => res.json()) //?start=${start}&?end=${end}
  }

  getGoogleSyncUrl() {
    const fetchData = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/google`, fetchData).then((res) => res.json())
  }

  getTokens(code) {
    const fetchData = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/auth/oauthcode?code=` + code, fetchData).then((res) => res.json())
  }

  requestTimeSlot(keycode, email, name, message, timeoffset ) {
    let fetchBody = {
      keycode,
      email,
      name,
      message,
      timeoffset
    }
    let fetchData = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(fetchBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(`${this.schema}://${this.host}:${this.port}/mentor/request`, fetchData).then((res) => res.json())
  }

}

export default new Api();