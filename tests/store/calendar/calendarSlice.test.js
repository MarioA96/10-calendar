import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { initialState, calendarWithEventsState, events, calendarWithActiveEventState } from "../../__fixtures__/calendarStates";

describe('Pruebas en calendarSlice', () => {
  
    test('Debe de regresar el estado por defecto', () => {

        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );

    });

    test('onSetActiveEvent debe de activar el evento', () => {
        
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect( state.activeEvent ).toEqual( events[0] );

    });

    test('onAddNewEvent debe de agregar el nuevo evento', () => {
        
        const newEvent = {
            id: '3',
            title: 'Cumpleaños de Nora',
            notes: 'Esta es una nota',
            start: new Date('2024-09-26 14:00:00'),
            end: new Date('2024-09-26 17:00:00'),
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        //Esparcimos las notas previas y esperamos este en el arreglo la nueva nota agregada
        expect( state.events ).toEqual([...events, newEvent]);

    });
        
    test('onUpdateEvent debe de actualizar el evento', () => {
        
        const updatedEvent = {
            id: '1',
            title: 'Cumpleaños de Nora actualizado',
            notes: 'Esta es una nota pero actualizada',
            start: new Date('2024-09-26 14:00:00'),
            end: new Date('2024-09-26 17:00:00'),
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );

    });

    test('onDeleteEvent debe de eliminar el evento', () => {

        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        expect( state.activeEvent ).toBe( null );
        expect( state.events ).not.toContain( events[0] );
    
    });

    test('onLoadEvents debe de establecer los eventos', () => {
      
        //const state = calendarSlice.reducer( initialState, { type: 'calendar/onLoadEvents', payload: events } );
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        expect( state.isLoadingEvents ).toBeFalsy();
        expect( state.events ).toEqual( events );

        const newState = calendarSlice.reducer( state, onLoadEvents( events ) );
        expect( state.events.length ).toBe( events.length );

    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
      
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState );

    })
    
    
    

})



