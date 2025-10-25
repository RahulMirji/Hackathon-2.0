"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, BookOpen, FileText, Clock, CheckCircle, Terminal } from "lucide-react"
import { MonitoringOverlay } from "@/components/exam/monitoring-overlay"
import { ViolationTracker } from "@/components/exam/violation-tracker"

export default function ExamSectionsPage() {
  const router = useRouter()

  const sections = [
    {
      id: "mcq1",
      title: "MCQ 1",
      subtitle: "General & Technical",
      questions: 25,
      duration: "40 min",
      icon: FileText,
      color: "from-blue-600 to-cyan-600",
      description: "General knowledge and technical concepts",
    },
    {
      id: "mcq2",
      title: "MCQ 2",
      subtitle: "Coding Questions",
      questions: 25,
      duration: "45 min",
      icon: Code,
      color: "from-purple-600 to-pink-600",
      description: "Programming and coding challenges",
    },
    {
      id: "mcq3",
      title: "MCQ 3",
      subtitle: "English Language",
      questions: 10,
      duration: "15 min",
      icon: BookOpen,
      color: "from-green-600 to-teal-600",
      description: "Grammar, vocabulary, and comprehension",
    },
    {
      id: "coding",
      title: "Coding",
      subtitle: "Programming Tasks",
      questions: 2,
      duration: "30 min",
      icon: Terminal,
      color: "from-orange-600 to-red-600",
      description: "Write and submit code solutions",
    },
  ]

  const handleStartSection = (sectionId: string) => {
    router.push(`/exam/environment?section=${sectionId}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">HP</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">Computer Science - Final Assessment</h1>
              <p className="text-sm text-muted-foreground">Select a section to begin your exam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left & Center - Section Selection */}
          <div className="lg:col-span-3 space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Exam Section</h2>
              <p className="text-muted-foreground text-sm">
                Complete all sections to finish your assessment. You can take them in any order.
              </p>
            </div>

            {/* Section Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card
                key={section.id}
                className="exam-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer border-2 border-gray-200 dark:border-gray-700"
              >
                <div className={`bg-gradient-to-r ${section.color} text-white px-3 py-2.5 -mx-6 -mt-6 mb-3`}>
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="h-6 w-6" />
                    <div className="text-right">
                      <div className="text-xl font-bold">{section.questions}</div>
                      <div className="text-[10px] opacity-90">Questions</div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold mb-0.5">{section.title}</h3>
                  <p className="text-[11px] opacity-90">{section.subtitle}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-medium">{section.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      <span className="font-medium">{section.questions} Questions</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartSection(section.id)}
                    className={`w-full h-9 text-sm font-semibold bg-gradient-to-r ${section.color} hover:opacity-90 text-white shadow-md`}
                  >
                    Start {section.title}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
          </div>

          {/* Right Sidebar - Monitoring */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-3">
              <Card className="exam-card p-0 overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 h-52">
                <MonitoringOverlay />
              </Card>

              {/* Violation Tracker */}
              <ViolationTracker />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
