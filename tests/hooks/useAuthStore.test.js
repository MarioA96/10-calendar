import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks";
import { Provider } from "react-redux";
import { authSlice } from "../../src/store";
import { authenticatedState, initialState, notAuthenticatedState } from "../__fixtures__/authStates";
import { testUserCredentials } from "../__fixtures__/testUser";
import { calendarApi } from "../../src/api";


const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
};


describe('Pruebas en useAuthStore', () => {
  
    beforeEach(() =>  localStorage.clear() );

    test('Debe de regresar los valores por defecto', () => {
      
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        });

    });
   
    test('startLogin debe de realizar el login correctamente', async() => {
            
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.startLogin( testUserCredentials );
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '662c72924ac303c21b3099e1' },
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
        
    });
    
    test('startLogin debe de fallar la autenticacion', async() => {
      
        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.startLogin({ email: 'failed@gmail.com', password: '123456' });
        } );

        const { errorMessage, status, user } = result.current;
        
        expect(localStorage.getItem('token')).toBeNull();
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {},
        });

        waitFor(
            () => expect( result.current.errorMessage ).toBeUndefined()
        );

    });

    test('startRegister debe de crear un usuario', async() => {
      
        const newUser = { email: 'valid@gmail.com', password: '123456', name: 'Test Valid User' };

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        //Creamos un spy para evitar hacer un post
        const spy = jest.spyOn( calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: '123456789',
                name: 'Test Valid User',
                token: 'valid-token'
            }
        });

        await act( async() => {
            await result.current.startRegister( newUser );
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test Valid User', uid: '123456789' },
        });

        // Hacemos spy.mockRestore() para que el spy deje de interceptar las llamadas
        spy.mockRestore();

    });
    
    test('startRegister debe de fallar la creacion', async() => {
      
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.startRegister( testUserCredentials );
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Un usuario existe con ese correo",
            status: 'not-authenticated',
            user: {},
        });

    });

    test('checkAuthToken debe de fallar si no hay token', async() => {
      
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.checkAuthToken();
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });

    });
    
    test('chechkAuthToken debe de autenticar el usuario si hay un token', async() => {
      
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.checkAuthToken();
        } );

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '662c72924ac303c21b3099e1'}
        });

    });

    test('startLogut debe de borrar el estado tras ser llamado y que las funciones fueran llamadas', () => {
      
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        act( () => {
            result.current.startLogout();
        } );

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        });

        expect( localStorage.getItem('token') ).toBeNull();
        expect( localStorage.getItem('token-init-date') ).toBeNull();

        //We make sure dispatch( onLogoutCalendar() ) was called toHaveBeenCalled()
        expect( mockStore.getState().calendar ).toEqual( undefined );
        //We make sure dispatch( onLogout() ) was called
        expect( mockStore.getState().auth ).toEqual( notAuthenticatedState );

    })
    
    

});


