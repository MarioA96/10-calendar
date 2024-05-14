import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice"

describe('Pruebas en uiSlice', () => {
  
    test('Debe de regresar el estado por defecto', () => {
        
        // En el lado del modal si en algun caso se agregan mas propiedades esto va a fallar
        // Por lo cual debemos de agregar mas propiedades en las pruebas toEqual
        expect( uiSlice.getInitialState() ).toEqual({ isDateModalOpen: false });

    });

    test('Debe de cambiar el isDateModalOpen correctamente', () => {
        
        let state = uiSlice.getInitialState();

        state = uiSlice.reducer( state, onOpenDateModal() );
        expect( state ).toEqual({ isDateModalOpen: true });
        
        state = uiSlice.reducer( state, onCloseDateModal() );
        expect( state.isDateModalOpen ).toBeFalsy();  //Esta es otra forma de comprobacion

    });

})


