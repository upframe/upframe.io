export const path = (segments = Infinity) =>
  `/${window.location.pathname
    .split('/')
    .filter(Boolean)
    .slice(0, segments)
    .join('/')}`
