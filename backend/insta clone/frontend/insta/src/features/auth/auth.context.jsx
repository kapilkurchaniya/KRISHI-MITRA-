import { createContext,useState } from "react";
import { login, register} from "./Services/auth.api";


const AuthContext = createContext()
export default AuthContext;

export function AuthProvider({children}) {
    const [ user , setUser ] = useState(null)
    const [ loading , setLoading ] = useState(false)

    const handlelogin = async (username , password) => {
        setLoading(true)
        try {
        const response = await login(username , password)
        setUser(response.user)
        }   
        catch(err) {
            console.log(err)
        }
       finally{ setLoading(false) }
    }   

    const handleRegister = async (username , email , password) => {
        setLoading(true)
        try {
        const response = await register(username , email , password)
        setUser(response.user)
        }
        catch(err) {
            console.log(err)
        }
        finally{
        setLoading(false)
        }}


    return (
        <AuthContext.Provider value={{ user , loading ,setLoading,setUser , handleRegister,handlelogin}} >
            {children}
        </AuthContext.Provider>
    )
}