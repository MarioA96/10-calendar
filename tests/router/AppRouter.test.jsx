import { render, screen } from '@testing-library/react';
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from '../../src/router/AppRouter';
import { MemoryRouter } from 'react-router-dom';
import { CalendarPage } from '../../src/calendar';


jest.mock("../../src/hooks/useAuthStore");

//Hacemos esto para evitar crear muchos mocks y la renderizacion de los hooks dentro de este
//Hacemos solo la rendirazacion del <h1>CalendarPage</h1>
jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}));


describe('Pruebas en <AppRouter />', () => {
  
    const mockCheckAuthToken = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    })

    test('Debe de mostrar la pantalla de carga y llamar checkAuthToken', () => {
    
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });

        render( <AppRouter /> );
        expect( screen.getByText('Cargando...') ).toBeTruthy();
        expect( mockCheckAuthToken ).toHaveBeenCalled();

    });

    test('Debe de mostrar el login en caso de no estar autenticado', () => {
      
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render(
            <MemoryRouter initialEntries={['/noValidRoute']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText('Ingreso') ).toBeTruthy();
        expect( mockCheckAuthToken ).toHaveBeenCalled();
        expect( container ).toMatchSnapshot();

    });

    test('Debe de mostrar el calendario en caso de estar autenticado', () => {
      
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        render(
            <MemoryRouter initialEntries={['/noValidRoute']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText('CalendarPage') ).toBeTruthy();

    }); 

})

