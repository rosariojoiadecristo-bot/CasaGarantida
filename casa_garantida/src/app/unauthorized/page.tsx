import { NoSymbolIcon } from '@heroicons/react/24/outline'
import React from 'react'

function UnauthorizedPage () {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
        <p className='capitalize'>Você não tem permissão para realizar esta ação.</p>
        <NoSymbolIcon className='w-36 text-red-500'/>
    </div>
  )
}

export default UnauthorizedPage