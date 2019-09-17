const ExperimentModel = require('../models/experiment');

module.exports = {
  createSingle: async (ctx) => {
    try {
      await ExperimentModel.createSingle(ctx.request.body);
    } catch (err) {
      if (err.code === 'ConditionalCheckFailedException') {
        ctx.throw(409, 'Target Already Exists');
      }
    }
    ctx.status = 201;
    ctx.body ={
      'statusCode': 201,
      'message': 'Created',
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
