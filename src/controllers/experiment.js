const ExperimentModel = require('../models/experiment');

module.exports = {
  createSingle: async (ctx) => {
    await ExperimentModel.createSingle(ctx.request.body);
    ctx.body ={
      'statusCode': 200,
      'message': 'Uploaded',
    };
  },
  getList: async (ctx) => {
    const listofExperiments = await ExperimentModel.getList();
    ctx.body = {
      'statusCode': 200,
      'payload': listofExperiments,
    };
  },
  getSingle: async (ctx) => {
    const id = ctx.params.id;
    const download = ctx.query.download=='true';

    if (download) {
      ctx.compress = false;
      ctx.response.attachment(id+'.zip');
      ctx.body = await ExperimentModel.getSingle(id, {download: true});
    } else {
      const exp = await ExperimentModel.getSingle(id, {});
      ctx.body = {
        'statusCode': 200,
        'payload': exp,
      };
    }
  },
  deleteSingle: async (ctx) => {
    const id = ctx.params.id;
    await ExperimentModel.deleteSingle(id);
    ctx.body = {
      'statusCode': 200,
      'message': 'Deleted',
    };
  },
};
