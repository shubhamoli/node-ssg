const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const exphbs  = require('express-handlebars');


// custom helpers
const getGlobalContext = require('./helper').getGlobalContext;
const getPageContext = require('./helper').getPageContext;
const getRecentPosts =  require('./helper').getRecentPosts;

// define site root here
global.SITE_ROOT = path.dirname(__filename)


// set views directory
app.set('views', path.join(SITE_ROOT, 'app/views'));
// init templating engine
app.engine('hbs', exphbs({extname: '.hbs'}));
// set template engine
app.set('view engine', 'hbs')


const _globalContext = getGlobalContext();


// Register routes below
app.get('/', (req, res) => {
    // fetch index.md
    let _pageContext = getPageContext('index')

    // overwrite globalContext with pageContext
    let _context = {..._globalContext, ..._pageContext}

    // fetch recent posts, to display on home page
    _context.posts = getRecentPosts()

    res.render('home', _context)
});


app.get('/post/:postId', (req, res) => {
    let _pageContext;

    try {
        _pageContext = getPageContext('posts/' + req.params.postId)
    } catch(e) {
        // return 404 as of not
        res.status(404).send("Post Not Found!")
    }

    // overwrite globalContext with pageContext
    let _context = {..._globalContext, ..._pageContext}

    res.render('post', _context)
});


// finally, kick-off the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

