import { Configuration, OpenAIApi } from 'openai';
import config from 'config';
import speech from '@google-cloud/speech';
import { createReadStream } from 'fs';

class OpenAI {
  constructor(apiKey) {
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
    this.client = new speech.SpeechClient(); // Создаем клиент Google Speech-to-Text
  }

  chat()

  async transcription() {
    try {
     const response = await this.openai.createTranscription(
        createReadStream(filepath),
        'wisper-1'
     )
     return response.data.text
    } catch (e) {
        console.log('Error while transcription', e.message)
    }
    }
}