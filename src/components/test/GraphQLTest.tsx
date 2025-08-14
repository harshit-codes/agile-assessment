"use client"

import { useGraphQLQuiz } from "@/hooks/useGraphQLQuiz"

export default function GraphQLTest() {
  const quiz = useGraphQLQuiz()

  return (
    <div className="p-6 bg-card rounded-lg border">
      <h2 className="text-xl font-bold mb-4">GraphQL Migration Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Quiz Status:</h3>
          <p className={quiz.isLoading ? "text-yellow-500" : quiz.quiz ? "text-green-500" : "text-red-500"}>
            {quiz.isLoading ? "Loading..." : quiz.quiz ? "Loaded Successfully" : "Failed to Load"}
          </p>
        </div>

        {quiz.quiz && (
          <div>
            <h3 className="font-semibold">Quiz Data:</h3>
            <pre className="text-sm bg-muted p-2 rounded mt-2 overflow-auto">
              {JSON.stringify({
                title: quiz.quiz.title,
                sectionsCount: quiz.quiz.sections?.length,
                totalQuestions: quiz.overallProgress.totalQuestions
              }, null, 2)}
            </pre>
          </div>
        )}

        {quiz.error && (
          <div>
            <h3 className="font-semibold text-red-500">Error:</h3>
            <p className="text-red-400">{quiz.error}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold">Session Status:</h3>
          <p className={quiz.sessionId ? "text-green-500" : "text-gray-500"}>
            {quiz.sessionId ? `Session ID: ${quiz.sessionId.slice(0, 8)}...` : "No active session"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Progress:</h3>
          <p>
            {quiz.overallProgress.answeredQuestions} / {quiz.overallProgress.totalQuestions} 
            ({quiz.overallProgress.percentage}%)
          </p>
        </div>
      </div>
    </div>
  )
}