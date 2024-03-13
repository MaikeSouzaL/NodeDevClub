import express from 'express';
import routes from './routes';

import { resolve } from 'path';

import './database';

class App {
  constructor() {
    // sempre que for instanciada o metodo constructor sera o primeiro a ser chamado
    this.app = express(); // estamos referenciando nossa class e crando uma pariavel  app que ira receber o valor do express
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // este método "função" server para que possamos dar mais segurança ao nosso projeto
    this.app.use(express.json()); // iniciamos o nosso middleware infomando ao express que vamos usar dados como Json
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );
    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app; // vamos precsar apenas do nosso .app para iniciar nossa aplicaão
