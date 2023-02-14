const express = require('express');
const app = express();
const port = 8080;
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.API_KEY_SECRET,
});

const openai = new OpenAIApi(configuration);

app.get('/accuracy', async (req, res) => {
    try {
        const { prompt } = req.query;
        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Respond this question only with a number from 1 to 100.
            How accurate is this prompt for stable diffusion: "${prompt}"?
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

app.listen(port, () => {
    console.log('LISTENING on port ', port);
})
