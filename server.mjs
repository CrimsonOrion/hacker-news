// Get Express with a static 'public' folder
import express from 'express';
import { join } from 'path';
import { got } from 'got';
const app = express();
import dateFns from 'date-fns';
app.use((join('public')));


app.set('view engine', 'pug');

// homepage
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Search Hacker News'
    })
});

async function searchHN(query) {
    const response = await got(`https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`);
    return response.data;
}

// search
app.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    if(!searchQuery) {
        res.redirect(302, '/');
        return;
    }
    const results = await searchHN(searchQuery);
    res.render('search', {
        title: `Search results for: ${searchQuery}`,
        searchResults: results,
        searchQuery
    })
    .catch((error) => {
        next(err);
    });
});

app.use(function (err, req, res, next) {
    console.error(err);
    res.set('Content-Type', 'text/html');
    res.status(500).send('<h1>Internal Server Error</h1>');
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Hacker news server started on port: ${server.address().port}`);
});