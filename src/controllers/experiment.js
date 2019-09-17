const ExperimentModel = require('../models/experiment');

module.exports = {
  createSingle: async (ctx) => {
    const success = await ExperimentModel.createSingle(ctx.request.body);
    ctx.body = success;
  },
  getList: async (ctx) => {
    const listofExperiments = await ExperimentModel.getList();
    ctx.body = listofExperiments;
  },
  getSingle: async (ctx) => {
    const id = ctx.params.id;
    const download = ctx.query.download=='true';

    if (download) {
      ctx.compress = false;
      ctx.response.attachment(id+'.zip');
      ctx.body = await ExperimentModel.getSingle(id, {download: true});
    } else {
      ctx.body = await ExperimentModel.getSingle(id, {});
    }
  },
  deleteSingle: async (ctx) => {
    const id = ctx.params.id;
    const success = await ExperimentModel.deleteSingle(id);
    ctx.body = success;
  },
};
