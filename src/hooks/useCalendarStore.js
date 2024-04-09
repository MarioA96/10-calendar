import { useSelector, useDispatch } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';


export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } =useSelector( state => state.calendar );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    };

    //Async en lugar de crear un thunk, aqui mismo disparamos el evento
    const startSavingEvent = async( calendarEvent ) => {
        //TODO: llegar al backend

        //TODO: bien
        if( calendarEvent._id ){
            //Actualizando
            dispatch( onUpdateEvent({ ...calendarEvent }) );
        }
        else{
            //Creando
            dispatch( onAddNewEvent({ ...calendarEvent, _id: new Date().getTime() }) );
        }
    };

    const startDeletingEvent = () => {
        //TODO: llegar al backend
        
        dispatch( onDeleteEvent() );
    };

    return {
        //* Propiedades
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //* Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
    };

};

