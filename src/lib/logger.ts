/**
 * Centralized Logging System
 * Provides structured logging for different parts of the application
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export enum LogCategory {
  UPLOAD = 'UPLOAD',
  OCR = 'OCR',
  AUTH = 'AUTH',
  PROGRESS = 'PROGRESS',
  API = 'API',
  ERROR = 'ERROR',
  SYSTEM = 'SYSTEM'
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  data?: any
  userId?: string
  stackTrace?: string
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, category, message, data } = entry
    const color = this.getColor(level)
    const reset = '\x1b[0m'
    
    let formatted = `${color}[${timestamp}] [${level}] [${category}]${reset} ${message}`
    
    if (data && this.isDevelopment) {
      formatted += `\n${color}Data:${reset} ${JSON.stringify(data, null, 2)}`
    }
    
    if (entry.stackTrace && this.isDevelopment) {
      formatted += `\n${color}Stack:${reset} ${entry.stackTrace}`
    }
    
    return formatted
  }

  private getColor(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m'  // Red
    }
    return colors[level] || '\x1b[0m'
  }

  private log(level: LogLevel, category: LogCategory, message: string, data?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      stackTrace: error?.stack
    }

    // In development, log to console with formatting
    if (this.isDevelopment) {
      const formatted = this.formatLog(entry)
      
      switch (level) {
        case LogLevel.ERROR:
          console.error(formatted)
          break
        case LogLevel.WARN:
          console.warn(formatted)
          break
        default:
          console.log(formatted)
      }
    } else {
      // In production, use structured logging (can be extended to send to external service)
      const structuredLog = JSON.stringify(entry)
      
      switch (level) {
        case LogLevel.ERROR:
          console.error(structuredLog)
          break
        case LogLevel.WARN:
          console.warn(structuredLog)
          break
        default:
          console.log(structuredLog)
      }
    }
  }

  debug(category: LogCategory, message: string, data?: any) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, category, message, data)
    }
  }

  info(category: LogCategory, message: string, data?: any) {
    this.log(LogLevel.INFO, category, message, data)
  }

  warn(category: LogCategory, message: string, data?: any) {
    this.log(LogLevel.WARN, category, message, data)
  }

  error(category: LogCategory, message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, category, message, data, error)
  }

  // Specialized logging methods
  uploadStart(fileName: string, fileSize: number) {
    this.info(LogCategory.UPLOAD, 'Upload started', {
      fileName,
      fileSize,
      fileSizeMB: (fileSize / 1024 / 1024).toFixed(2)
    })
  }

  uploadProgress(fileName: string, progress: number) {
    this.debug(LogCategory.UPLOAD, `Upload progress: ${progress}%`, { fileName, progress })
  }

  uploadSuccess(fileName: string, url: string) {
    this.info(LogCategory.UPLOAD, 'Upload successful', { fileName, url })
  }

  uploadError(fileName: string, error: Error) {
    this.error(LogCategory.UPLOAD, `Upload failed: ${fileName}`, error, { fileName })
  }

  ocrStart(imageUrl: string) {
    this.info(LogCategory.OCR, 'OCR processing started', { imageUrl })
  }

  ocrSuccess(imageUrl: string, textLength: number, processingTime: number) {
    this.info(LogCategory.OCR, 'OCR processing successful', {
      imageUrl,
      textLength,
      processingTimeMs: processingTime
    })
  }

  ocrError(imageUrl: string, error: Error) {
    this.error(LogCategory.OCR, 'OCR processing failed', error, { imageUrl })
  }

  authSuccess(userId: string, action: 'login' | 'signup' | 'logout') {
    this.info(LogCategory.AUTH, `Authentication ${action} successful`, { userId, action })
  }

  authError(action: 'login' | 'signup' | 'logout', error: Error) {
    this.error(LogCategory.AUTH, `Authentication ${action} failed`, error, { action })
  }

  progressUpdate(userId: string, bookId: string, chapterId: string, action: string) {
    this.info(LogCategory.PROGRESS, `Progress updated: ${action}`, {
      userId,
      bookId,
      chapterId,
      action
    })
  }

  apiCall(method: string, endpoint: string, status?: number) {
    const message = status 
      ? `API ${method} ${endpoint} - Status: ${status}`
      : `API ${method} ${endpoint}`
    
    this.debug(LogCategory.API, message, { method, endpoint, status })
  }

  apiError(method: string, endpoint: string, error: Error) {
    this.error(LogCategory.API, `API error: ${method} ${endpoint}`, error, { method, endpoint })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience methods
export const log = {
  debug: (category: LogCategory, message: string, data?: any) => 
    logger.debug(category, message, data),
  
  info: (category: LogCategory, message: string, data?: any) => 
    logger.info(category, message, data),
  
  warn: (category: LogCategory, message: string, data?: any) => 
    logger.warn(category, message, data),
  
  error: (category: LogCategory, message: string, error?: Error, data?: any) => 
    logger.error(category, message, error, data),
  
  // Specialized methods
  upload: {
    start: (fileName: string, fileSize: number) => logger.uploadStart(fileName, fileSize),
    progress: (fileName: string, progress: number) => logger.uploadProgress(fileName, progress),
    success: (fileName: string, url: string) => logger.uploadSuccess(fileName, url),
    error: (fileName: string, error: Error) => logger.uploadError(fileName, error)
  },
  
  ocr: {
    start: (imageUrl: string) => logger.ocrStart(imageUrl),
    success: (imageUrl: string, textLength: number, processingTime: number) => 
      logger.ocrSuccess(imageUrl, textLength, processingTime),
    error: (imageUrl: string, error: Error) => logger.ocrError(imageUrl, error)
  },
  
  auth: {
    success: (userId: string, action: 'login' | 'signup' | 'logout') => 
      logger.authSuccess(userId, action),
    error: (action: 'login' | 'signup' | 'logout', error: Error) => 
      logger.authError(action, error)
  },
  
  progress: (userId: string, bookId: string, chapterId: string, action: string) => 
    logger.progressUpdate(userId, bookId, chapterId, action),
  
  api: {
    call: (method: string, endpoint: string, status?: number) => 
      logger.apiCall(method, endpoint, status),
    error: (method: string, endpoint: string, error: Error) => 
      logger.apiError(method, endpoint, error)
  }
}
