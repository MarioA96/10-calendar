import { act, renderHook } from "@testing-library/react"
import { useUiStore } from "../../src/hooks"
import { Provider } from "react-redux";
import { uiSlice } from "../../src/store";
import { configureStore } from "@reduxjs/toolkit";

//Aqui se crea un mock store para poder hacer pruebas con el hook
//useUiStore, se le pasa un estado inicial para que el store tenga valores
const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
}

describe('Pruebas en useUiStore', () => {
  
    test('Debe de regresar los valores por defecto', () => {
      
        const mockStore = getMockStore({ isDateModalOpen: false });

        //Aqui se hace el render del hook y se le pasa el store como provider
        //para que pueda acceder a los valores del store
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        expect(result.current).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any(Function),
            closeDateModal: expect.any(Function),
            toggleDateModal: expect.any(Function),
        });

    });

    test('openDateModal debe de colocar true en el isDateModal', () => {
      
        const mockStore = getMockStore({ isDateModalOpen: false });

        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        const { openDateModal } = result.current;

        //Aqui se llama a la funcion openDateModal y se espera que el valor
        //de isDateModalOpen sea true
        //debemos de envolver la llamada a la funcion en un act
        act( () => {
            openDateModal();
        } );

        expect( result.current.isDateModalOpen ).toBeTruthy();

    });

    test('closeDateModal debe de colocar false en el isDateModal', () => {
      
        const mockStore = getMockStore({ isDateModalOpen: true });

        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        act( () => {
            //Es lo mismo que arriba solo que de manera simpiificada
            result.current.closeDateModal();
        } );

        expect( result.current.isDateModalOpen ).toBeFalsy();

    });
    
    test('toggleDateModal debe de cambiar el estado respectivamente', () => {
      
        const mockStore = getMockStore({ isDateModalOpen: true });

        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        act( () => {
            result.current.toggleDateModal();
        } );
        expect( result.current.isDateModalOpen ).toBeFalsy();

        act( () => {
            result.current.toggleDateModal();
        } );
        expect( result.current.isDateModalOpen ).toBeTruthy();

    });

})


