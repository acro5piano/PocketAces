import winston from 'winston'
import { Service } from 'typedi'

@Service()
export class LoggerService {
  logger!: winston.Logger

  initialize() {
    const env = process.env.NODE_ENV || 'development'

    const formats = [
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.json(),
    ]

    if (env === 'development') {
      formats.push(winston.format.prettyPrint())
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(...formats),
      defaultMeta: {
        env,
      },
      transports: [new winston.transports.Console()],
    })
  }
}
