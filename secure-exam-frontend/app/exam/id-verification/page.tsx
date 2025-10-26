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
    
    try {
      console.log("Requesting camera access...")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
      })
      
      console.log("Camera stream obtained:", stream)
      
      // Set camera active first to render the video element
      setCameraActive(true)
      
      // Wait for next tick to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          console.log("Setting video source...")
          videoRef.current.srcObject = stream
          setCameraLoading(false)
          console.log("Camera should be active now")
        } else {
          console.error("Video ref is still null after render")
          setCameraError("Video element not found.")
          setCameraLoading(false)
        }
      }, 100)
      
    } catch (error) {
      console.error("Error accessing camera:", error)
      const errorMessage =
        error instanceof DOMException
          ? error.name === "NotAllowedError"
            ? "Camera permission denied."
            : error.name === "NotFoundError"
              ? "No camera found."
              : "Failed to access camera."
          : "Failed to access camera."
      setCameraError(errorMessage)
      setCameraLoading(false)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")
      
      // Check if video is ready
      if (!context || video.videoWidth === 0 || video.videoHeight === 0) {
        setCameraError("Camera not ready. Please wait a moment and try again.")
        return
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Get image data
      const imageData = canvas.toDataURL("image/jpeg", 0.9)
      setPhotoData(imageData)
      setPhotoTaken(true)

      // Stop camera
      stopCamera()
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
    router.push("/exam/verification-confirmation")
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#4355f9] flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Identity Verification</h1>
                <p className="text-sm text-gray-600">Secure identity verification for exam access</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Step 2 of 4
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Left Section - Face Verification */}
          <Card className="bg-white p-5 shadow-sm border border-gray-200 rounded-lg flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#1ba94c] flex items-center justify-center">
                <User className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-gray-900">Face Verification</h2>
                <p className="text-xs text-gray-600">Take a clear photo of your face (optional)</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {/* Hidden canvas for capturing photos */}
              <canvas ref={canvasRef} className="hidden" />
              
              {!photoTaken ? (
                <div className="flex-1 flex flex-col justify-between">
                  {cameraActive ? (
                    <div className="space-y-2.5">
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-black h-56">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="w-full h-full object-cover"
                          onLoadedMetadata={() => console.log("Video metadata loaded")}
                          onPlay={() => console.log("Video playing")}
                          onError={(e) => console.error("Video error:", e)}
                        />
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
                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center h-56">
                      <div className="text-center space-y-2.5">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                          <Camera className="h-6 w-6 text-[#4355f9]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Camera Preview</h3>
                          <p className="text-xs text-gray-600">Position your face in the frame</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    {!cameraActive && !cameraLoading ? (
                      <Button onClick={startCamera} className="w-full gap-2 h-10 bg-[#4355f9] hover:bg-[#3644d9] text-white font-semibold rounded-lg text-sm">
                        <Camera className="h-4 w-4" />
                        Start Camera
                      </Button>
                    ) : cameraLoading ? (
                      <Button disabled className="w-full gap-2 h-10 text-sm">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Starting Camera...
                      </Button>
                    ) : (
                      <Button 
                        onClick={capturePhoto} 
                        className="w-full gap-2 h-10 bg-[#4355f9] hover:bg-[#3644d9] text-white font-semibold rounded-lg text-sm"
                      >
                        <Camera className="h-4 w-4" />
                        Capture Photo
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-black h-56">
                    {photoData && (
                      <img 
                        src={photoData} 
                        alt="Captured face" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                    )}
                  </div>
                  <div className="flex gap-2.5">
                    <Button onClick={retakePhoto} variant="outline" className="flex-1 h-10 border-2 border-gray-300 hover:bg-gray-50 font-semibold rounded-lg text-sm">
                      Retake Photo
                    </Button>
                    <Button className="flex-1 gap-2 h-10 bg-[#1ba94c] hover:bg-[#159a3f] text-white font-semibold rounded-lg text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Confirm Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Right Section - ID Upload */}
          <Card className="bg-white p-5 shadow-sm border border-gray-200 rounded-lg flex flex-col">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#a435f0] flex items-center justify-center">
                <FileText className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-gray-900">Government ID Upload</h2>
                <p className="text-xs text-gray-600">Upload your government-issued ID (optional)</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col justify-between">
                {/* Upload Area */}
                <div className="h-56 mb-3">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={handleIDUpload} 
                    className="hidden" 
                    id="id-upload" 
                  />
                  <label 
                    htmlFor="id-upload" 
                    className="cursor-pointer h-full block"
                  >
                    <div className={`h-full rounded-lg border-2 border-dashed p-6 text-center flex flex-col items-center justify-center transition-all duration-200 ${
                      idUploaded 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-gray-300 bg-gray-50 hover:border-[#a435f0] hover:bg-purple-50'
                    }`}>
                      {idUploaded ? (
                        <div className="space-y-2.5">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-6 w-6 text-[#1ba94c]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-0.5">ID Uploaded Successfully</h3>
                            <p className="text-xs text-gray-600">{idFileName}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                            <Upload className="h-6 w-6 text-[#a435f0]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Upload Government ID</h3>
                            <p className="text-xs text-gray-600 mb-2">
                              Click to browse or drag and drop your ID document
                            </p>
                            <div className="text-xs text-gray-500">
                              Supported: PNG, JPG, PDF • Max size: 10MB
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-auto">
                  <div className="flex gap-2.5">
                    <div className="h-4.5 w-4.5 rounded bg-[#4355f9] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Eye className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-0.5 text-xs">Verification Requirements</h4>
                      <p className="text-xs text-gray-700">
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
            className="gap-2 h-10 px-5 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-semibold rounded-lg text-sm"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue} 
            disabled={isLoading}
            style={{
              backgroundColor: (photoTaken && idUploaded) ? '#1ba94c' : 'white',
              color: (photoTaken && idUploaded) ? 'white' : '#111827',
              borderWidth: (photoTaken && idUploaded) ? '0' : '2px',
              borderColor: (photoTaken && idUploaded) ? 'transparent' : '#d1d5db'
            }}
            className="gap-2 h-10 px-7 font-semibold rounded-lg hover:opacity-90 transition-all text-sm"
          >
            {isLoading ? "Processing..." : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
