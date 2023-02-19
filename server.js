const express = require('express');
const app = express();
const port = 8080;
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const cors = require('cors');
const axios = require("axios");
app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.CHATGPT_API_KEY_SECRET,
});

const openai = new OpenAIApi(configuration);

app.get('/generateImg', (req, res) => {
        const { prompt } = req.query;
        axios.post('https://api.openai.com/v1/images/generations', {
            "prompt": prompt,
            "size": "1024x1024",
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.IMG_GENERATION_KEY_SECRET}`
            }
        }).then(response => {
            return res.status(200).json({
                success: true,
                data: response.data.data[0].url
            })
        }).catch(err => {
                return res.status(400).json({
                    success: false,
                    error: err.response
                    ? err.response.data
                    : 'There was an issue on the server'
                })
        })
})

app.get('/accuracy', async (req, res) => {
    try {
        const { prompt } = req.query;
        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Respond this question only with a number from 1 to 100.
            Calculate how accurate is this prompt for stable diffusion: "${prompt}"?
            Pay attention to this, I want a max 2 character length response.`,
            max_tokens: 100,
        });

        return res.status(200).json({
            success: true,
            data: completion.data.choices[0].text
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response
            ? error.response.data
            : "There was a issue on the server"
        })
    }
})

app.get('/explanation', async (req, res) => {
    try {
        const { prompt } = req.query;
        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Tell me in less than 100 words how can i improve the accuracy of this prompt for stable diffusion: "${prompt}"?`,
            max_tokens: 256,
        });

        return res.status(200).json({
            success: true,
            data: completion.data.choices[0].text
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response
                ? error.response.data
                : "There was a issue on the server"
        })
    }
})

app.listen(port, () => {
    console.log('LISTENING on port ', port);
})
