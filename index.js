const Koa = require('koa2');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const errorHandler = require('koa-better-error-handler');
const koa404Handler = require('koa-404-handler');
const router = require('./route');

const app = new Koa();

app.context.onerror = errorHandler;
app.context.api = true;
app.use(compress());
app.use(bodyParser({jsonLimit: '5mb'}));
app.use(logger());
app.use( async (ctx, next) => {
  const startTime = Date.now();
  await next();
  const ms = Date.now() - startTime;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
router(app);

app.use(koa404Handler);
app.listen(3000);
