"use client"

import { useEffect, useRef } from "react"

export function MonitoringOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border bg-black">
      {/* Video Feed */}
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
    </div>
  )
}
