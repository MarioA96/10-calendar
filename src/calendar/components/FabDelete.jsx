import { useCalendarStore } from "../../hooks";

export const FabDelete = () => {

    const { startDeletingEvent, hasEventSelected } = useCalendarStore();

    const handleDelete = () => {
        startDeletingEvent();
    }

    return (
        <button
            aria-label="btn-delete"
            className="btn btn-danger fab-danger"
            onClick={ handleDelete }
            style={{ 
                display: hasEventSelected ? '' : 'none'
                /*Aqui puedo agregar un isModalClose para que si esta abierto el modal el boton delete no aparezca*/
            }}
        >
            <i className="fas fa-trash-alt"></i>
        </button>
    )
};
