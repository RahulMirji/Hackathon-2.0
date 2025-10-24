"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Eye, Wifi } from "lucide-react"

interface MonitoringData {
  faceDetected: boolean
  attentionScore: number
  deviceDetected: boolean
  connectionStatus: "connected" | "warning" | "disconnected"
}

export function MonitoringOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [monitoring, setMonitoring] = useState<MonitoringData>({
    faceDetected: false,
    attentionScore: 85,
    deviceDetected: true,
    connectionStatus: "connected",
  })

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    startCamera()

    // Simulate monitoring updates
    const interval = setInterval(() => {
      setMonitoring((prev) => ({
        ...prev,
        faceDetected: Math.random() > 0.1,
        attentionScore: Math.max(60, Math.min(100, prev.attentionScore + (Math.random() - 0.5) * 10)),
        deviceDetected: true,
        connectionStatus: Math.random() > 0.95 ? "warning" : "connected",
      }))
    }, 2000)

    return () => {
      clearInterval(interval)
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const getAttentionColor = (score: number) => {
    if (score >= 80) return "text-accent"
    if (score >= 60) return "text-yellow-500"
    return "text-destructive"
  }

  const getConnectionColor = (status: string) => {
    if (status === "connected") return "text-accent"
    if (status === "warning") return "text-yellow-500"
    return "text-destructive"
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border bg-black">
      {/* Video Feed */}
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

      {/* Face Detection Box */}
      {monitoring.faceDetected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-64 border-2 border-accent rounded-lg animate-pulse" />
        </div>
      )}

      {/* Monitoring Indicators */}
      <div className="absolute top-4 left-4 right-4 space-y-2">
        {/* Face Detection Status */}
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur px-3 py-2 rounded-lg text-sm">
          <Eye className={`h-4 w-4 ${monitoring.faceDetected ? "text-accent" : "text-destructive"}`} />
          <span className="text-foreground">{monitoring.faceDetected ? "Face Detected" : "Face Not Detected"}</span>
        </div>

        {/* Connection Status */}
        <div
          className={`flex items-center gap-2 bg-black/70 backdrop-blur px-3 py-2 rounded-lg text-sm ${getConnectionColor(monitoring.connectionStatus)}`}
        >
          <Wifi className="h-4 w-4" />
          <span className="capitalize">{monitoring.connectionStatus}</span>
        </div>
      </div>

      {/* Attention Score */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Attention Score</span>
          <span className={`text-lg font-bold ${getAttentionColor(monitoring.attentionScore)}`}>
            {Math.round(monitoring.attentionScore)}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              monitoring.attentionScore >= 80
                ? "bg-accent"
                : monitoring.attentionScore >= 60
                  ? "bg-yellow-500"
                  : "bg-destructive"
            }`}
            style={{ width: `${monitoring.attentionScore}%` }}
          />
        </div>
      </div>

      {/* Warning Overlay */}
      {!monitoring.faceDetected && (
        <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-destructive/90 text-destructive-foreground px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Face not detected - Please look at camera</span>
          </div>
        </div>
      )}
    </div>
  )
}
