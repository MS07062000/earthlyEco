'use client'

import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'

const Social: React.FC = () => {
  const onClick = (provider: 'google' | 'github' | 'linkedin') => {
    console.log('provider', provider)
    
  }
  return (
    <div className='flex items-center w-full gap-x-2 mb-2'>
      <Button
        size={'lg'}
        className='w-full'
        variant={'outline'}
        onClick={() => onClick('google')}
      >
        <FcGoogle className='h-5 w-5' />
      </Button>
    </div>
  )
}

export default Social
