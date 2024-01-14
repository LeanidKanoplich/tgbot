import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { removeFile } from './utils.js'

// Установка директории, в которой находится текущий модуль.
const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConverter {
  constructor() {
    // Устанавливаем путь к исполняемому файлу ffmpeg, используя ffmpeg-installer.
    ffmpeg.setFfmpegPath(installer.path);
  }

  toMp3(input, output) {
    // Пытаемся выполнить конвертацию в MP3.
    try {
      // Резолвим путь к выходному MP3 файлу.
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      // Возвращаем промис, который разрешится после завершения конвертации.
      return new Promise((resolve, reject) => {
        ffmpeg(input)
          .inputOption('-t 30') // Ограничиваем длительность до 30 секунд.
          .output(outputPath)   // Указываем путь к выходному файлу.
          .on('end', () => {
            removeFile(input)
            resolve(outputPath)
          })
            // Событие завершения конвертации.
          .on('error', (err) => reject(err.message)) // Событие ошибки.
          .run(); // Запускаем конвертацию.
      });
    } catch (e) {
      // Ловим ошибки в синхронном коде.
      console.log('Error while creating mp3', e.message);
    }
  }

  async create(url, filename) {
    // Пытаемся выполнить скачивание файла.
    try {
      // Резолвим путь к скачиваемому OGG файлу.
      const oggPath = resolve(__dirname, '..', 'voices', `${filename}.ogg`);
      // Получаем поток для скачивания файла.
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });
      // Возвращаем промис, который разрешится после записи файла.
      return new Promise((resolve, reject) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on('finish', () => resolve(oggPath)); // Событие завершения записи.
        stream.on('error', reject); // Добавлен обработчик ошибки при записи.
      });
    } catch (e) {
      // Ловим ошибки при скачивании файла.
      console.log('Error while creating ogg', e.message);
    }
  }
}

export const ogg = new OggConverter();
