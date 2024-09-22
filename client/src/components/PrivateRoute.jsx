import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'  //useNavigate is a hook , Navigate is a component

export default function PrivateRoute() {
    const {currentUser} = useSelector((state) => state.user)
  return currentUser ? <Outlet /> : <Navigate to='/sign-in'/>
}
