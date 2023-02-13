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
  const level = req.body.level;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(level),
      temperature: 1,
      max_tokens: 20,
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

function generatePrompt(level) {
  return `As an English language expert, you've been asked to generate a random English word that is suitable for a student at level ${level} of English proficiency. There are six levels: A1, A2, B1, B2, C1, and C2.
  
  Please choose a word that is appropriate for the student's level and write it within curly braces, e.g. {desk}. Aim to be as random as possible in your choice, ensuring that the word is both challenging and educational for the student.`;
}

