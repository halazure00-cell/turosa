/**
 * OCR Provider Abstraction Layer
 * Provides unified interface for OCR using Tesseract.js
 * Supports Arabic and Indonesian text recognition
 */

import { createWorker, PSM } from 'tesseract.js'

export interface OCRResult {
  text: string
  confidence: number | null
  language: string
  detectionCount: number
}

export interface OCROptions {
  language?: string
  multiLang?: boolean
}

/**
 * Check if OCR provider is available (always true for Tesseract.js as it's built-in)
 */
export function checkOCRHealth(): { available: boolean; details: string } {
  return {
    available: true,
    details: 'Tesseract.js is built-in and always available'
  }
}

/**
 * Perform OCR on an image using Tesseract.js
 * @param imageInput - Base64 string or URL of the image
 * @param language - Language code (default: 'ara' for Arabic)
 */
export async function performOCR(
  imageInput: string,
  language: string = 'ara'
): Promise<OCRResult> {
  const worker = await createWorker(language, 1, {
    logger: (m) => {
      // Only log progress in development
      if (process.env.NODE_ENV === 'development' && m.status === 'recognizing text') {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
      }
    }
  })
  
  try {
    // Configure for better Arabic text recognition
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      preserve_interword_spaces: '1'
    })
    
    const { data } = await worker.recognize(imageInput)
    
    // Count non-empty lines as detection count
    const detectionCount = data.lines?.filter(line => line.text.trim().length > 0).length || 0
    
    return {
      text: data.text || '',
      confidence: data.confidence || null,
      language,
      detectionCount
    }
  } finally {
    await worker.terminate()
  }
}

/**
 * Perform multi-language OCR (Arabic + Indonesian)
 * Useful for documents that mix Arabic and Indonesian text
 * @param imageInput - Base64 string or URL of the image
 */
export async function performMultiLangOCR(
  imageInput: string
): Promise<OCRResult> {
  // Tesseract.js supports multiple languages with '+' separator
  const languages = 'ara+ind' // Arabic + Indonesian
  
  const worker = await createWorker(languages, 1, {
    logger: (m) => {
      if (process.env.NODE_ENV === 'development' && m.status === 'recognizing text') {
        console.log(`Multi-lang OCR Progress: ${Math.round(m.progress * 100)}%`)
      }
    }
  })
  
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      preserve_interword_spaces: '1'
    })
    
    const { data } = await worker.recognize(imageInput)
    
    const detectionCount = data.lines?.filter(line => line.text.trim().length > 0).length || 0
    
    return {
      text: data.text || '',
      confidence: data.confidence || null,
      language: 'ara+ind',
      detectionCount
    }
  } finally {
    await worker.terminate()
  }
}

/**
 * Perform OCR with automatic language detection and options
 * @param imageInput - Base64 string or URL of the image
 * @param options - OCR options including language and multiLang flag
 */
export async function performOCRWithOptions(
  imageInput: string,
  options: OCROptions = {}
): Promise<OCRResult> {
  const { language = 'ara', multiLang = false } = options
  
  if (multiLang) {
    return performMultiLangOCR(imageInput)
  }
  
  return performOCR(imageInput, language)
}
