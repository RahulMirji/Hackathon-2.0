"use client"

import { AlertTriangle, XCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface ExamTerminationModalProps {
  isOpen: boolean
  violationType: "tab-switch" | "fullscreen-exit" | "general"
  onClose?: () => void
  onViewResults?: () => void
}

export function ExamTerminationModal({
  isOpen,
  violationType,
  onClose,
  onViewResults,
}: ExamTerminationModalProps) {
  const router = useRouter()

  const handleQuit = () => {
    router.push("/")
  }

  const getViolationMessage = () => {
    switch (violationType) {
      case "tab-switch":
        return {
          title: "Exam Terminated - Tab Switch Detected",
          description: "You attempted to switch tabs during the exam. This violates our examination integrity terms.",
          reason: "Tab switching is not allowed during the exam to ensure fair and secure assessment.",
        }
      case "fullscreen-exit":
        return {
          title: "Exam Terminated - Fullscreen Exit",
          description: "You exited fullscreen mode during the exam. This violates our examination integrity terms.",
          reason: "Fullscreen mode must remain active throughout the exam to prevent distractions and cheating.",
        }
      default:
        return {
          title: "Exam Terminated - Terms Violation",
          description: "You have violated the examination terms and conditions.",
          reason: "Your exam has been automatically terminated and submitted.",
        }
    }
  }

  const violation = getViolationMessage()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-red-600 bg-red-50 dark:bg-red-950/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <DialogTitle className="text-red-600">{violation.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main message */}
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-semibold">
              {violation.description}
            </p>
          </div>

          {/* Reason */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {violation.reason}
            </p>
          </div>

          {/* Warning */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Results Status
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your exam has been automatically submitted. Due to the terms violation, your results <span className="font-bold text-red-600">will not be declared</span> and the violation will be recorded in your exam history.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={onViewResults}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              View Details
            </Button>
            <Button
              onClick={handleQuit}
              variant="default"
              className="gap-2 bg-gray-800 hover:bg-gray-900"
            >
              <LogOut className="w-4 h-4" />
              Quit & Return Home
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
