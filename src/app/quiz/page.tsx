import { Brain, CheckCircle, XCircle, Trophy, Target } from 'lucide-react'

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-accent-700 mb-2">
            Kuis Interaktif
          </h1>
          <p className="text-accent">
            Uji pemahaman Anda tentang materi yang telah dipelajari
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-accent mb-0.5">Poin</p>
                <p className="text-xl font-bold text-accent-700">0</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-accent mb-0.5">Akurasi</p>
                <p className="text-xl font-bold text-accent-700">0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <QuizCategoryCard
            title="Fiqih"
            description="Kuis tentang hukum fiqih"
            questionsCount={0}
            completed={0}
            gradient="from-primary-500 to-primary-600"
          />
          <QuizCategoryCard
            title="Akidah"
            description="Kuis tentang akidah Islam"
            questionsCount={0}
            completed={0}
            gradient="from-blue-500 to-blue-600"
          />
          <QuizCategoryCard
            title="Tafsir"
            description="Kuis tentang tafsir Al-Quran"
            questionsCount={0}
            completed={0}
            gradient="from-purple-500 to-purple-600"
          />
          <QuizCategoryCard
            title="Hadits"
            description="Kuis tentang hadits Nabi"
            questionsCount={0}
            completed={0}
            gradient="from-orange-500 to-orange-600"
          />
          <QuizCategoryCard
            title="Nahwu"
            description="Kuis tentang nahwu (grammar)"
            questionsCount={0}
            completed={0}
            gradient="from-green-500 to-green-600"
          />
          <QuizCategoryCard
            title="Sharaf"
            description="Kuis tentang sharaf (morfologi)"
            questionsCount={0}
            completed={0}
            gradient="from-pink-500 to-pink-600"
          />
        </div>

        {/* Getting Started */}
        <div className="card p-8 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-accent-700 mb-2">
            Mulai Kuis
          </h2>
          <p className="text-accent">
            Pilih kategori di atas untuk memulai kuis dan tingkatkan pemahaman Anda
          </p>
        </div>
      </div>
    </div>
  )
}

interface QuizCategoryCardProps {
  title: string
  description: string
  questionsCount: number
  completed: number
  gradient: string
}

function QuizCategoryCard({ title, description, questionsCount, completed, gradient }: QuizCategoryCardProps) {
  const percentage = questionsCount > 0 ? (completed / questionsCount) * 100 : 0
  
  return (
    <div className="card-elevated p-5 hover:scale-[1.02] transition-all cursor-pointer">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4`}>
        <Brain className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-accent-700 mb-1">{title}</h3>
      <p className="text-sm text-accent mb-4">{description}</p>
      
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-accent">{questionsCount} soal</span>
        <span className="text-primary font-semibold">{completed} selesai</span>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-secondary-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${gradient} rounded-full h-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
