import calendarApi from "../../src/api/calendarApi"


describe('Prueba en el calendar API', () => {
  
    test('Debe de tener la configuracion por defecto', () => {
        
        // console.log(calendarApi);
        expect( calendarApi.defaults.baseURL ).toBe(process.env.VITE_API_URL);

    });

    test('Debe de tener el x-token en el header de todas la peticiones', async() => {
        
        const token = 'ABC123';

        localStorage.setItem('token', token);
        const res = await calendarApi.get('/auth');

        expect( res.config.headers['x-token'] ).toBe(token);

    });
    
    

})


