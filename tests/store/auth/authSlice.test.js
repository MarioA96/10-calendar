import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState } from "../../__fixtures__/authStates";
import { testUserCredentials } from "../../__fixtures__/testUser";

describe('Pruebas en authSlice', () => {
  
    test('Debe de regresar el estado inicial', () => {
        
        expect( authSlice.getInitialState() ).toEqual( initialState );

    });

    test('Debe de realizar un login', () => {
            
            const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );
            expect( state ).toEqual({
                status: 'authenticated',
                user: testUserCredentials,
                errorMessage: undefined,
            });
       
    })
    
    test('Debe der realizar el logout', () => {
        // .reduce(estadoActual (state), accion a realizar (payload));
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined,
        });
    });

    test('Debe der realizar el logout con mensaje de error', () => {
        
        const errorMessage = 'Credenciales no validas';

        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage,
        });
    });

    test('Debe de limpiar el mensaje de error', () => {
      
        const errorMessage = 'Credenciales no validas';

        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        const newState = authSlice.reducer( state, clearErrorMessage() );

        expect( newState.errorMessage ).toBe( undefined );

    });
    
    

});


