"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Camera, CheckCircle2 } from "lucide-react"

export default function IDVerificationPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [idUploaded, setIdUploaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const video = videoRef.current
      video.onloadedmetadata = () => {
        video.play().catch((err) => {
          console.error("[v0] Error playing video:", err)
          setCameraError("Failed to play video stream")
        })
      }
    }
  }, [cameraActive])

  const startCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      const errorMessage =
        error instanceof DOMException
          ? error.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access."
            : error.name === "NotFoundError"
              ? "No camera found on this device."
              : "Failed to access camera."
          : "Failed to access camera."
      setCameraError(errorMessage)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setPhotoData(imageData)
        setPhotoTaken(true)

        // Stop camera
        stopCamera()
      }
    }
  }

  const retakePhoto = () => {
    setPhotoTaken(false)
    setPhotoData(null)
    setCameraError(null)
    startCamera()
  }

  const handleIDUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdUploaded(true)
    }
  }

  const handleContinue = () => {
    setIsLoading(true)
    router.push("/exam/consent")
  }

  return (
    <main className="exam-container flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Identity Verification</h1>
          <p className="text-muted-foreground">Verify your identity before starting the exam</p>
        </div>

        {/* Face Capture */}
        <Card className="exam-card space-y-4">
          <div>
            <h2 className="font-semibold mb-2">Step 1: Face Verification</h2>
            <p className="text-sm text-muted-foreground mb-4">Take a clear photo of your face for verification</p>
          </div>

          {!photoTaken ? (
            <div className="space-y-4">
              {cameraActive && (
                <div className="space-y-3">
                  <div className="relative w-full overflow-hidden rounded-lg border-2 border-accent bg-black aspect-video flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  </div>
                  {cameraError && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">{cameraError}</div>
                  )}
                </div>
              )}

              {!cameraActive && !photoTaken && (
                <div className="w-full rounded-lg border-2 border-dashed border-border bg-muted/30 aspect-video flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera feed will appear here</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {!cameraActive ? (
                  <Button onClick={startCamera} className="exam-button-primary w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                    <Button onClick={capturePhoto} className="exam-button-primary flex-1">
                      Capture Photo
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full overflow-hidden rounded-lg border border-border bg-black">
                <canvas ref={canvasRef} width={640} height={480} className="hidden" />
                {photoData && <img src={photoData || "/placeholder.svg"} alt="Captured face" className="w-full" />}
              </div>
              <div className="flex gap-3">
                <Button onClick={retakePhoto} variant="outline" className="flex-1 bg-transparent">
                  Retake
                </Button>
                <Button className="exam-button-primary flex-1">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirmed
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* ID Upload */}
        <Card className="exam-card space-y-4">
          <div>
            <h2 className="font-semibold mb-2">Step 2: Government ID Upload</h2>
            <p className="text-sm text-muted-foreground mb-4">Upload a clear photo of your government-issued ID</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
              <input type="file" accept="image/*" onChange={handleIDUpload} className="hidden" id="id-upload" />
              <label htmlFor="id-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="text-2xl">📄</div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            </div>

            {idUploaded && (
              <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-accent">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">ID document uploaded</span>
              </div>
            )}
          </div>
        </Card>

        {/* Requirements */}
        <div className="exam-alert">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">Important:</p>
              <ul className="text-sm space-y-1">
                <li>• Ensure your face is clearly visible and well-lit</li>
                <li>• ID must match your face and be currently valid</li>
                <li>• All information will be verified by our system</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline" className="flex-1">
            Back
          </Button>
          <Button onClick={handleContinue} disabled={isLoading} className="exam-button-primary flex-1">
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </div>
    </main>
  )
}
