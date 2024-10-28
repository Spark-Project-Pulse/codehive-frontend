'use client'

import { type Question } from '@/types/Questions'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">{question.title}</h1>
      <p className="text-lg text-gray-600">{question.description}</p>
      <p className="mt-4 text-gray-500">
        Asked by: {question.asker_info?.username ? question.asker_info.username : 'Anonymous User'}
      </p>
    </div>
  )
}