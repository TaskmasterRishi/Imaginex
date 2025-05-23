'use client'

import React, { useState } from 'react'
import { logout } from '@/app/actions/auth-action'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

const LogoutBtn = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
    setIsLoading(false)
  }

  return (
    <Button type="submit" className="w-full  cursor-pointer" disabled={isLoading} onClick={handleLogout}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      Logout
    </Button>
  );
};

export default LogoutBtn;