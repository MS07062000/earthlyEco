import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface BackButtonProps {
  label: string
  href: string
}

const BackButton: React.FC<BackButtonProps> = ({ label, href }) => {
  return (
    <Button variant={'link'} className='font-normal w-full' size={'sm'} asChild>
      <Link className='text-xs' to={href}>
        {label}
      </Link>
    </Button>
  )
}

export default BackButton
