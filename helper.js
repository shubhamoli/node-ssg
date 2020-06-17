/***
 * helper.js
 *
 * To be used by ssd.js
 */

const path = require('path')
const fs = require('fs')

const fm = require('front-matter');
const yaml = require('js-yaml')
const MarkdownIt = require('markdown-it')()


// parse config.yml in app dir
let getGlobalContext = () => {
    let _context = {}

    try {
        let configPath = path.join(global.SITE_ROOT, 'app/config.yml')
        _context = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));

    } catch (e) {
        console.log("ParseError: ", e);
        _context = {}
    }

    return _context;
}


// parse .md file with frontmatter
let getPageContext = (file) => {

    let data;
    try {
        let filePath = path.join(global.SITE_ROOT, 'app', file + '.md')
        data = fs.readFileSync(filePath, 'utf8')
    } catch(e) {
        throw e
    }

    let content = fm(data)

    return {
        ...content.attributes,
        // render markdown to html
        content: MarkdownIt.render(content.body)
    }

}

// return recent posts
// default limit 5
let getRecentPosts = (limit = 5) => {
    posts = []
    postsPath = path.join(global.SITE_ROOT, 'app/posts')

    fs.readdirSync(postsPath).forEach(file => {
        file = path.parse(file).name
        posts.push({
            permalink: '/post/' + file,
            title: file
        });
    });

    return posts.slice(0, limit)
}



module.exports = {
    getGlobalContext: getGlobalContext,
    getPageContext: getPageContext,
    getRecentPosts: getRecentPosts
}
