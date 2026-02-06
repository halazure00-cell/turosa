'use client'

/**
 * Learning Path Guide Component
 * Interactive onboarding guide untuk first-time users
 */

import { useState } from 'react'
import { 
  Upload, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  Trophy,
  ChevronRight,
  X
} from 'lucide-react'
import Link from 'next/link'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  actionText: string
  actionUrl: string
  color: string
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Upload Kitab',
    description: 'Mulai dengan mengunggah Kitab Kuning Anda dalam format PDF. Tambahkan cover dan metadata untuk kemudahan pencarian.',
    icon: <Upload className="w-8 h-8" />,
    actionText: 'Upload Kitab Pertama',
    actionUrl: '/upload',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Digitisasi (OCR)',
    description: 'Ekstrak teks Arab dari gambar menggunakan teknologi OCR untuk pembelajaran interaktif dan fitur lanjutan.',
    icon: <Sparkles className="w-8 h-8" />,
    actionText: 'Pelajari Digitisasi',
    actionUrl: '/library',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Baca & Belajar',
    description: 'Baca kitab chapter-by-chapter dengan bantuan AI Chat. Progress Anda akan tersimpan otomatis.',
    icon: <BookOpen className="w-8 h-8" />,
    actionText: 'Mulai Membaca',
    actionUrl: '/library',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    title: 'Quiz & Test',
    description: 'Uji pemahaman Anda dengan quiz yang di-generate otomatis dari materi kitab menggunakan AI.',
    icon: <Trophy className="w-8 h-8" />,
    actionText: 'Coba Quiz',
    actionUrl: '/quiz',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 5,
    title: 'Diskusi Komunitas',
    description: 'Bergabung dengan komunitas pembelajar. Tanya jawab, berbagi insight, dan belajar bersama.',
    icon: <MessageSquare className="w-8 h-8" />,
    actionText: 'Join Diskusi',
    actionUrl: '/forum',
    color: 'from-red-500 to-red-600'
  }
]

interface LearningPathGuideProps {
  onClose?: () => void
  showCloseButton?: boolean
}

export default function LearningPathGuide({ onClose, showCloseButton = true }: LearningPathGuideProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentStep = steps[currentStepIndex]

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleSkip = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="card p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-accent-700">Panduan Pembelajaran</h2>
          <p className="text-sm text-accent mt-1">
            Langkah {currentStepIndex + 1} dari {steps.length}
          </p>
        </div>
        {showCloseButton && (
          <button
            onClick={handleSkip}
            className="text-accent hover:text-accent-700 transition-colors"
            aria-label="Close guide"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex gap-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex-1 h-2 rounded-full transition-all ${
                index <= currentStepIndex
                  ? 'bg-primary'
                  : 'bg-secondary-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Icon */}
          <div className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center text-white shadow-lg`}>
            {currentStep.icon}
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-accent-700 mb-2">
              {currentStep.title}
            </h3>
            <p className="text-accent">
              {currentStep.description}
            </p>
          </div>
        </div>
      </div>

      {/* All Steps Overview */}
      <div className="mb-8 p-4 bg-secondary-50 rounded-lg">
        <h4 className="text-sm font-semibold text-accent-700 mb-3">Alur Pembelajaran:</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStepIndex(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  index === currentStepIndex
                    ? 'bg-primary text-white'
                    : index < currentStepIndex
                    ? 'bg-green-100 text-green-700'
                    : 'bg-secondary-200 text-accent'
                }`}
              >
                {step.title}
              </button>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-accent mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </button>
        
        <Link 
          href={currentStep.actionUrl}
          className="btn-primary flex-1 text-center"
        >
          {currentStep.actionText}
        </Link>

        {currentStepIndex < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="btn-secondary flex-1"
          >
            Selanjutnya
          </button>
        ) : (
          <button
            onClick={handleSkip}
            className="btn-secondary flex-1"
          >
            Selesai
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tips:</strong> Anda bisa mengikuti alur ini secara bertahap atau langsung mulai dari step manapun yang Anda butuhkan.
        </p>
      </div>
    </div>
  )
}

// Compact version untuk dashboard
export function CompactLearningPathGuide() {
  return (
    <div className="card p-4">
      <h3 className="text-lg font-bold text-accent-700 mb-3">
        🎯 Perjalanan Pembelajaran Anda
      </h3>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <Link
            key={step.id}
            href={step.actionUrl}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-white flex-shrink-0`}>
              {step.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-accent-700 group-hover:text-primary transition-colors">
                {index + 1}. {step.title}
              </div>
              <div className="text-xs text-accent line-clamp-1">
                {step.description}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
