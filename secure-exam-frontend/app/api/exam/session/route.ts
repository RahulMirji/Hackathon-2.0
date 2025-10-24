// Mock API endpoint for exam session management
export async function POST(request: Request) {
  const body = await request.json()

  const sessionId = `SESSION-${Date.now()}`

  return Response.json({
    sessionId,
    userId: body.userId,
    examId: body.examId,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: "active",
    monitoringData: {
      faceDetections: 0,
      attentionWarnings: 0,
      connectionIssues: 0,
      deviceViolations: 0,
    },
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  return Response.json({
    sessionId,
    status: "active",
    timeRemaining: 3600,
    monitoringData: {
      faceDetections: 45,
      attentionWarnings: 2,
      connectionIssues: 0,
      deviceViolations: 0,
    },
  })
}
