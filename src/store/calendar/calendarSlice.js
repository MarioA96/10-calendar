
import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

const tempEvent = {
    _id: new Date().getTime(),
    title: 'Cumpleaños del Jefe',
    notes: 'Comprar un regalo',
    start: new Date(),
    end: addHours( new Date(), 2 ),
    bgColor: '#fafafa', //Aqui podria ir un color random o un color por usuario
    user: {
        _id: '123',
        name: 'Mario'
    }
};

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        events: [
            tempEvent
        ],
        activeEvent: null,
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push( payload );
            state.activeEvent = null;
        },
        onUpdateEvent: ( state, { payload } ) => {
            state.events = state.events.map( e => {
                if( e._id === payload._id ){
                    return payload;
                }
                
                return e;
            } );
        },
        onDeleteEvent: ( state ) => {
            if( state.activeEvent ){
                state.events = state.events.filter( e => e._id !== state.activeEvent._id );
                state.activeEvent = null;
            }
        },
    }
});


// Action creators are generated for each case reducer function
export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent } = calendarSlice.actions;
