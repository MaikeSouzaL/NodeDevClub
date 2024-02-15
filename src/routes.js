import { Router } from 'express'; // estamos importando apenas a class Router do express

const routes = new Router(); // sabendo que o Router e uma class estamos guardando ele em uma raviavel para facilitar o uso dele

// criando a primerira rota
routes.get('/', (req, res) => res.json({ message: ' Olá mundo 🌏' }));

export default routes; // apenas exportando o routes estamos exportando todas nossas rotas
