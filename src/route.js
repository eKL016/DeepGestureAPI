const router = require('koa-router')();
const ExperimentController = require('./controllers/experiment');

module.exports = (app) => {
  router.get('/experiments', ExperimentController.getList);
  router.get('/experiments.zip', ExperimentController.downloadAll);
  router.get('/experiment/:id', ExperimentController.getSingle);
  router.delete('/experiment/:id/', ExperimentController.deleteSingle);
  router.post('/experiment/', ExperimentController.createSingle);
  router.all('*', (ctx) => ctx.throw(404));
  app.use(router.routes());
};
