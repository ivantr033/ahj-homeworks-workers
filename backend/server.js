import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

// Manual middleware to emulate hardware slowness (2-second load time)
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // If the browser sends a pre-flight (OPTIONS) request, we immediately respond with success
    if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
        return;
    }

    await next();
});

// MIDDLEWARE 2: The Delay of the Skeletons
app.use(async (ctx, next) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await next();
});

// Database of film models
const movieNews = [
    {
        id: 1,
        date: '18:04 25.03.2019',
        title: '"Люди Икс: Тёмный Феникс" - свой против своих. Показ стартует 7 июня'
    },
    {
        id: 2,
        date: '18:04 20.03.2019',
        title: '"Джон Уик 3" - продолжение истории наёмного убийцы уже 16 мая в кино'
    },
    {
        id: 3,
        date: '18:04 19.03.2019',
        title: '"Мстители 4: Финал" показ стартует 25 апреля'
    }
];

// ENDPOINT BUGGY: 50% probability of crashing with a 500 error code.
router.get('/api/news', async (ctx) => {
    const isBuggy = Math.random() > 0.5;

    if (isBuggy) {
        ctx.status = 500;
        ctx.body = { status: 'error', message: 'Internal Server Error' };
        console.log('❌ The Buggy Service crashed, simulating a 500 error.');
    } else {
        ctx.status = 200;
        ctx.body = { status: 'ok', data: movieNews };
        console.log('✅ The Buggy Service dispatched the news successfully.');
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(7070, () => {
    console.log('🚀 The unstable Koa server is running at http://localhost:7070');
});
