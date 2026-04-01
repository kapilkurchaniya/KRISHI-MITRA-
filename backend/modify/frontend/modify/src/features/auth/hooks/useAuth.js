import { login, register, getMe, logout } from "../services/auth.api";
import { useContext, useEffect, useCallback} from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    async function handleRegister({ username, email, password }) {
        setLoading(true);
        const data = await register({ username, email, password });
        setUser(data.user);
        setLoading(false);
    }

async function handleLogin({username, email, password }) {
    setLoading(true);
    const data = await login({ username , email, password }); // only send needed fields
    setUser(data.user);
    setLoading(false);
}

   const handleGetMe = useCallback(async () => {
    try {
        setLoading(true);
        const data = await getMe();
        setUser(data.user);
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
}, []);

useEffect(() => {
    handleGetMe();
}, [handleGetMe]);

    async function handleLogout() {
        setLoading(true);
        await logout();
        setUser(null);
        setLoading(false);
    }

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout
    };
};