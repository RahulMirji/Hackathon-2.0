// Mock API endpoint for exam data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const examId = searchParams.get("examId")

  return Response.json({
    id: examId,
    title: "Sample Exam",
    duration: 60,
    questions: [
      {
        id: 1,
        text: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        type: "multiple-choice",
      },
      {
        id: 2,
        text: "Explain the concept of machine learning in your own words.",
        options: [],
        type: "short-answer",
      },
      {
        id: 3,
        text: "Which of the following is a programming language?",
        options: ["Python", "HTML", "CSS", "All of the above"],
        type: "multiple-choice",
      },
    ],
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Mock submission handling
  return Response.json({
    success: true,
    submissionId: `SUB-${Date.now()}`,
    message: "Exam submitted successfully",
    data: body,
  })
}
