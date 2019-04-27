export function getCookies() {
  let entries = document.cookie.split('; ')
  let cookies = {}
  
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    
    let key = entry.split('=')[0]
    let value = entry.split('=')[1]
    cookies[key] = value
  }
  
  return cookies
}