// config.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:',
  port: '8080',
  path: {
    apointment: '/appointments',
    barber: '/barbers',
    client: '/clients',
  },
  method: {
    findByPhone: 'find-client-x-Phone',
  },
  // Otras configuraciones
};
