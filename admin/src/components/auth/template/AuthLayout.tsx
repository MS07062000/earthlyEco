import { Outlet } from 'react-router-dom'

const AuthLayout: React.FC = () => {
  return (
    <div className='h-full flex items-center justify-center py-16 px-8'>
      <Outlet />
    </div>
  )
}

export default AuthLayout
