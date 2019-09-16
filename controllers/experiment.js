const ExperimentModel = require('../models/experiment');

module.exports = {
  createSingle: async (ctx) => {
    try {
      const success = await ExperimentModel.createSingle(ctx.request.body);
      ctx.body = success;
    } catch (err) {
      console.log(err);
      ctx.throw(500);
    }
  },
  getList: async (ctx) => {
    try {
      const listofExperiments = await ExperimentModel.getList();
      ctx.body = listofExperiments;
    } catch (err) {
      console.log(err);
      ctx.body = err.message;
    }
  },
  getSingle: async (ctx) => {
    const id = ctx.params.id;
    const download = ctx.query.download=='true';
    try {
      if (download) {
        ctx.compress = false;
        ctx.response.attachment(id+'.zip');
        ctx.body = await ExperimentModel.getSingle(id, {download: true});
      } else {
        ctx.body = await ExperimentModel.getSingle(id, {});
      }
    } catch (err) {
      console.log(err);
      ctx.body = err.message;
    }
  },
  deleteSingle: async (ctx) => {
    const id = ctx.params.id;
    try {
      const success = await ExperimentModel.deleteSingle(id);
      ctx.body = success;
    } catch (err) {
      console.log(err);
      ctx.body = err.message;
    }
  },
};
