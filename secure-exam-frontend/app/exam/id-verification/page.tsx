"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Camera, CheckCircle2, Upload, User, FileText, ArrowRight, Shield, Eye } from "lucide-react"

export default function IDVerificationPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [idUploaded, setIdUploaded] = useState(false)
  const [idFileName, setIdFileName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraLoading, setCameraLoading] = useState(false)



  const startCamera = async () => {
    setCameraError(null)
    setCameraLoading(true)
    
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      setCameraLoading(false)
      setCameraError("Camera is taking too long to start. You can skip this step and continue.")
    }, 5000) // 5 second timeout
    
    try {
      // Use lower resolution for faster startup
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 480, max: 640 },
          height: { ideal: 360, max: 480 },
          frameRate: { ideal: 15, max: 30 }
        },
      })
      
      clearTimeout(timeout) // Clear timeout if successful
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Simplified approach - set active immediately and let video load
        setCameraActive(true)
        setCameraLoading(false)
        
        // Auto-play the video
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch((err) => {
              console.error("Error playing video:", err)
              setCameraError("Failed to start video playback. You can skip this step and continue.")
            })
          }
        }, 100)
      }
    } catch (error) {
      clearTimeout(timeout) // Clear timeout on error
      console.error("Error accessing camera:", error)
      const errorMessage =
        error instanceof DOMException
          ? error.name === "NotAllowedError"
            ? "Camera permission denied. You can skip this step and continue."
            : error.name === "NotFoundError"
              ? "No camera found. You can skip this step and continue."
              : "Failed to access camera. You can skip this step and continue."
          : "Failed to access camera. You can skip this step and continue."
      setCameraError(errorMessage)
      setCameraLoading(false)
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
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        // Get image data
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setPhotoData(imageData)
        setPhotoTaken(true)

        // Stop camera
        stopCamera()
      } else {
        setCameraError("Camera not ready. Please wait a moment and try again.")
      }
    }
  }

  const retakePhoto = () => {
    setPhotoTaken(false)
    setPhotoData(null)
    setCameraError(null)
    startCamera()
  }

  // Debug function to check video state
  const debugCamera = () => {
    if (videoRef.current) {
      console.log("Video element:", videoRef.current)
      console.log("Video width:", videoRef.current.videoWidth)
      console.log("Video height:", videoRef.current.videoHeight)
      console.log("Video ready state:", videoRef.current.readyState)
      console.log("Video paused:", videoRef.current.paused)
    }
  }

  const handleIDUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdUploaded(true)
      setIdFileName(e.target.files[0].name)
    }
  }

  const handleContinue = () => {
    setIsLoading(true)
    router.push("/exam/consent")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Identity Verification</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Secure identity verification for exam access</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                Step 2 of 4
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Left Section - Face Verification */}
          <Card className="p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Face Verification</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Take a clear photo of your face (optional)</p>
              </div>
              {photoTaken && (
                <div className="ml-auto">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {!photoTaken ? (
                <div className="space-y-4">
                  {cameraActive ? (
                    <div className="space-y-3">
                      <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-black flex items-center justify-center h-64">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-xl pointer-events-none">
                          <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
                          <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>
                        </div>
                      </div>
                      {cameraError && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {cameraError}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 flex items-center justify-center h-64">
                      <div className="text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center mx-auto">
                          <Camera className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Camera Preview</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Position your face in the frame</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    {!cameraActive && !cameraLoading ? (
                      <Button onClick={startCamera} className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Camera className="h-4 w-4" />
                        Start Camera
                      </Button>
                    ) : cameraLoading ? (
                      <Button disabled className="w-full gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Starting Camera...
                      </Button>
                    ) : (
                      <>
                        <Button onClick={stopCamera} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                        <Button 
                          onClick={capturePhoto} 
                          className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <Camera className="h-4 w-4" />
                          Capture Photo
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 relative overflow-hidden rounded-xl border-2 border-green-200 bg-black min-h-[300px]">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
                    {photoData && (
                      <img 
                        src={photoData} 
                        alt="Captured face" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Captured
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={retakePhoto} variant="outline" className="flex-1">
                      Retake Photo
                    </Button>
                    <Button className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Confirm Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Right Section - ID Upload */}
          <Card className="p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Government ID Upload</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Upload your government-issued ID (optional)</p>
              </div>
              {idUploaded && (
                <div className="ml-auto">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="h-64">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleIDUpload} 
                    className="hidden" 
                    id="id-upload" 
                  />
                  <label 
                    htmlFor="id-upload" 
                    className="cursor-pointer h-full block"
                  >
                    <div className={`h-full rounded-xl border-2 border-dashed p-8 text-center flex flex-col items-center justify-center transition-all duration-200 ${
                      idUploaded 
                        ? 'border-green-300 bg-green-50 dark:bg-green-950/20' 
                        : 'border-gray-300 bg-gray-50 dark:bg-gray-800 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20'
                    }`}>
                      {idUploaded ? (
                        <div className="space-y-4">
                          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">ID Uploaded Successfully</h3>
                            <p className="text-sm text-green-600 dark:text-green-400">{idFileName}</p>
                          </div>
                          <Button variant="outline" size="sm" className="mt-4">
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center mx-auto">
                            <Upload className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Government ID</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              Click to browse or drag and drop your ID document
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Supported: PNG, JPG, PDF • Max size: 10MB
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Requirements */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex gap-2">
                    <Eye className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-1 text-sm">Verification Requirements</h4>
                      <p className="text-xs text-blue-800 dark:text-blue-300">
                        Clear, well-lit face photo and readable, valid ID document
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex justify-between items-center">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="gap-2"
          >
            Back to Compatibility Check
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {photoTaken || idUploaded ? (
                <span className="text-green-600 font-medium">✓ Ready to continue</span>
              ) : (
                <span>Identity verification is optional</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleContinue} 
                variant="outline"
                disabled={isLoading}
                className="gap-2"
              >
                Skip Verification
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleContinue} 
                disabled={isLoading}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? "Processing..." : "Continue to Consent"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
