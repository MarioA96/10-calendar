
export const events = [
    {
        id: '1',
        title: 'Cumpleaños de Test User',
        notes: 'Comprar un regalo',
        start: new Date('2024-04-29 13:00:00'),
        end: new Date('2024-04-29 15:00:00'),
    },
    {
        id: '2',
        title: 'Cumpleaños de Mario',
        notes: 'Comprar un regalo para Mario',
        start: new Date('2024-02-21 13:00:00'),
        end: new Date('2024-02-21 15:00:00'),
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null,
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] },
}