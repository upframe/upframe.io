import { useState, useEffect, useContext } from 'react'
import Api from 'utils/Api'
import context from 'components/AppContext'

export function useUser() {
  const [user, setUser] = useState()
  useEffect(() => {
    async function getUser() {
      const { user } = await Api.getUserInfo()
      setUser(user)
    }
    getUser()
  }, [])
  return user
}

export const useToast = () => useContext(context).showToast
