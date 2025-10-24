"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AlertCircle, Eye, AlertTriangle, Wifi } from "lucide-react"

interface Warning {
  id: number
  type: "face-detection" | "attention" | "device" | "connection"
  severity: "low" | "medium" | "high"
  message: string
  timestamp: Date
  count: number
}

export function WarningHistory() {
  const [warnings] = useState<Warning[]>([
    {
      id: 1,
      type: "face-detection",
      severity: "high",
      message: "Face not detected",
      timestamp: new Date(Date.now() - 5 * 60000),
      count: 3,
    },
    {
      id: 2,
      type: "attention",
      severity: "medium",
      message: "Low attention score",
      timestamp: new Date(Date.now() - 10 * 60000),
      count: 2,
    },
    {
      id: 3,
      type: "connection",
      severity: "low",
      message: "High latency detected",
      timestamp: new Date(Date.now() - 15 * 60000),
      count: 1,
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "face-detection":
        return <Eye className="h-4 w-4" />
      case "attention":
        return <AlertTriangle className="h-4 w-4" />
      case "connection":
        return <Wifi className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="exam-card space-y-3">
      <h3 className="font-semibold text-sm">Warning History</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {warnings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No warnings recorded</p>
        ) : (
          warnings.map((warning) => (
            <div key={warning.id} className="flex items-start gap-2 p-2 rounded border border-border text-sm">
              <div className={`mt-0.5 ${getSeverityColor(warning.severity)}`}>{getIcon(warning.type)}</div>
              <div className="flex-1">
                <p className="font-medium">{warning.message}</p>
                <p className="text-xs text-muted-foreground">
                  {warning.timestamp.toLocaleTimeString()} • Occurred {warning.count}x
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
