const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();

  subscribers[id] = ctx;

  await new Promise((resolve) => {
    ctx.res.on('close', () => {
      delete subscribers[id];
      resolve();
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) return;

  for (const subscriber in subscribers) {
    if (subscribers.hasOwnProperty(subscriber)) {
      subscribers[subscriber].res.statusCode = 200;
      subscribers[subscriber].res.end(message);
      ctx.status = 200;
    }
  }
});

app.use(router.routes());

module.exports = app;
