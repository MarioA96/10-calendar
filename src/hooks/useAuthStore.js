
// Este archivo es un custom hook que se encarga de manejar el estado de autenticación de la aplicación.
// Interacciones con el estado de autenticación se hacen a través de este hook.
// Esto en lugar de estar creando un thunks o actions en el store de Redux.

import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) => {
        dispatch( onChecking() );

        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime()); //? Fecha para despues determinar la expiración del token
            dispatch( onLogin({ name: data.name, uid: data.uid }) );

        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }

    };

    const startRegister = async({ name, email, password }) => {
        dispatch( onChecking() );

        try {
            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime()); //? Fecha para despues determinar la expiración del token
            dispatch( onLogin({ name: data.name, uid: data.uid })  );

        } catch (error) {
            dispatch( onLogout( error.response.data?.msg || '---' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    };

    const checkAuthToken = async() => {

        const token = localStorage.getItem('token') || '';
        if( !token ) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('/auth/renew');
            console.log(data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch( onLogin({ name: data.name, uid: data.uid })  );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }

    };

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
    };


    return {
        //* Properties
        status,
        user,
        errorMessage,

        //* Methods
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
};


