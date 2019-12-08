import React from 'react'
import styles from './socialIcon.module.scss'

const platforms = {
  facebook: {
    icon: '/media/fb_icon.svg',
    url: 'facebook.com',
  },
  twitter: {
    icon: '/media/twitter_icon.svg',
    url: 'twitter.com',
  },
  linkedin: {
    icon: '/media/linkedin_icon.svg',
    url: 'linkedin.com/in',
  },
  github: {
    icon: '/media/github_icon.svg',
    url: 'github.com',
  },
  dribbble: {
    icon: '/media/dribbble_icon.svg',
    url: 'dribbble.com',
  },
}

export default function SocialIcon({ link, ...props }) {
  const name = Object.keys(platforms).find(platform => platform in props)
  if (!link || link.length <= 1 || !name) return null
  const url = `https://${platforms[name].url}/${(link
    .replace(/http(s?):\/\//, '')
    .replace(/^\w{3}\./, '')
    .startsWith(platforms[name].url)
    ? link
        .replace(/\/$/, '')
        .split('/')
        .pop()
    : link
  ).replace(/^\//, '')}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.socialIcon}
    >
      <img src={platforms[name].icon} alt={name} />
    </a>
  )
}
