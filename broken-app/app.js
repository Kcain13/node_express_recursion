// const express = require('express');
// let axios = require('axios');
// var app = express();

// app.post('/', function (req, res, next) {
//     try {
//         let results = req.body.developers.map(async d => {
//             return await axios.get(`https://api.github.com/users/${d}`);
//         });
//         let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));

//         return res.send(JSON.stringify(out));
//     } catch {
//         next(err);
//     }
// });

// app.listen(3000);

/** ### Fix It!
Most of the script is written and working. 
There’s a least one bug in it, though, so it doesn’t work now. 
*/

// const express = require('express');
// const axios = require('axios');

// const app = express();
// // parse JSON bodies
// app.use(express.json());

// app.post('/', async (req, res, next) => {
//     try {
//         const { developers } = req.body;
//         let results = await Promise.all(
//             developers.map(async username => {
//                 let response = await axios.get(`https://api.github.com/users/${username}`);
//                 return response.data;
//             })
//         );

//         let output = results.map(user => ({
//             name: user.name,
//             bio: user.bio
//         }));

//         return res.json(output)
//     } catch (err) {
//         next(err);
//     }
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000')
// });

/** Refactor It! */

const express = require('express');
const axios = require('axios');

const app = express();
// parse JSON bodies
app.use(express.json());

// Error handling middleware for GitHub API requests
function handleGithubApiError(err, res) {
    console.error('Github API request failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch data from GitHub API' });
}

// Middleware for validating request body
function validateRequestBody(req, res, next) {
    const { developers } = req.body;
    if (!developers || !Array.isArray(developers) || developers.length === 0) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    next();
}

// Function to fetch user data from GitHub
async function fetchUserData(usernames) {
    try {
        const results = await Promise.all(
            usernames.map(async username => {
                const response = await axios.get(`https://api.github.com/users/${username}`);
                return response.data;
            })
        )
        return results.map(user => ({
            name: user.name,
            bio: user.bio
        }));
    } catch (err) {
        throw new Error('Failed to fetch user data from GitHub API')
    }
}

// POST route with middleware
app.post('/', validateRequestBody, async (req, res) => {
    const { developers } = req.body;
    try {
        const userData = await fetchUserData(developers);
        res.json(userData);

    } catch (err) {
        handleGithubApiError(err, res);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});