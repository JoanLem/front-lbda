// config.ts
export const environment = {
  apiUrl: 'http://bk-lbda-env.eba-axtn3vdb.us-east-1.elasticbeanstalk.com',
  port: '',
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
