import { useAuth } from '../hooks/useauth';
import { Navigate } from 'react-router';




const Protected = ({children}) => {
    
    const { user, loading } = useAuth();
  
    if(loading){
        return <div>loading...</div> 
    }
    if (!user) {
     return <Navigate to = "/login"/>
    }



    return children;
}


export default Protected;