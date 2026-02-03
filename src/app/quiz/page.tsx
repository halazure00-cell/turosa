import { Brain, CheckCircle, XCircle } from 'lucide-react'

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Kuis Interaktif</h1>
          <p className="text-lg text-gray-700">
            Uji pemahaman Anda tentang materi yang telah dipelajari
          </p>
        </div>

        {/* Quiz Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuizCategoryCard
            title="Fiqih"
            description="Kuis tentang hukum fiqih"
            questionsCount={0}
            completed={0}
          />
          <QuizCategoryCard
            title="Akidah"
            description="Kuis tentang akidah Islam"
            questionsCount={0}
            completed={0}
          />
          <QuizCategoryCard
            title="Tafsir"
            description="Kuis tentang tafsir Al-Quran"
            questionsCount={0}
            completed={0}
          />
          <QuizCategoryCard
            title="Hadits"
            description="Kuis tentang hadits Nabi"
            questionsCount={0}
            completed={0}
          />
          <QuizCategoryCard
            title="Nahwu"
            description="Kuis tentang nahwu (grammar)"
            questionsCount={0}
            completed={0}
          />
          <QuizCategoryCard
            title="Sharaf"
            description="Kuis tentang sharaf (morfologi)"
            questionsCount={0}
            completed={0}
          />
        </div>

        {/* Quiz Preview */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-accent mb-2">
              Mulai Kuis
            </h2>
            <p className="text-gray-600">
              Pilih kategori di atas untuk memulai kuis
            </p>
          </div>
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
}

function QuizCategoryCard({ title, description, questionsCount, completed }: QuizCategoryCardProps) {
  const percentage = questionsCount > 0 ? (completed / questionsCount) * 100 : 0
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
      <h3 className="text-xl font-bold text-accent mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{questionsCount} soal</span>
        <span className="text-primary font-medium">{completed} selesai</span>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary rounded-full h-2 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
