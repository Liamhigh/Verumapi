const functions = require("firebase-functions");
const { OpenAI } = require("openai");

exports.verumAI = functions.https.onCall(async (data, context) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing API key in Firebase Secret");
    }

    const openai = new OpenAI({ apiKey });
    const prompt = data.prompt;

    if (!prompt) {
      throw new Error("No prompt received");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return { result: completion.choices[0].message.content };
  } catch (err) {
    return { error: err.message };
  }
});
