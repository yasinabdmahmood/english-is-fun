import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const word = req.body.word;
  const description = req.body.description;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(word,description),
      temperature: 0.6,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(word, description) {
  return `As an English language expert, you've been asked to evaluate a student's description of the word "${word}". The student provided the following description: "${description}".
  
  Please grade their description on a scale of 1-10, taking into consideration the accuracy, detail, and creativity of their writing. Don't hold back, be honest and provide constructive feedback to help the student improve. Remember, you are addressing the student directly, so refer to them as "you".`;
}
