'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/badge"
import { ArrowLeft, Bell, User, Menu, Star, CheckCircle, AlertCircle, Shield, Brush, Scale, LucideIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Suggestion {
  type: 'improvement' | 'warning' | 'error'
  message: string
}

interface Analysis {
  overall_score: number
  correctness_functionality: number
  code_quality_maintainability: number
  performance_efficiency: number
  security_vulnerability: number
  code_consistency_style: number
  scalability_extensibility: number
  error_handling_robustness: number
  suggestions: Suggestion[]
  improved_code?: string | null
}

const getScoreColors = (score: number) => {
  if (score > 7) {
    return {
      card: "from-green-50/50",
      text: "text-green-600",
      progress: "bg-green-500",
      icon: "text-green-500"
    }
  } else if (score >= 5) {
    return {
      card: "from-yellow-50/50",
      text: "text-yellow-600",
      progress: "bg-yellow-500",
      icon: "text-yellow-500"
    }
  } else {
    return {
      card: "from-red-50/50",
      text: "text-red-600",
      progress: "bg-red-500",
      icon: "text-red-500"
    }
  }
}

const ScoreCard = ({ 
  title, 
  score, 
  icon: Icon,
  isOverall = false
}: { 
  title: string; 
  score: number; 
  icon: LucideIcon;
  isOverall?: boolean;
}) => {
  const colors = getScoreColors(score);
  
  return (
    <Card className={`bg-gradient-to-br ${colors.card} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`${isOverall ? 'text-base font-semibold' : 'text-sm font-medium'} text-gray-900`}>
          {title}
        </CardTitle>
        <Icon className={`${isOverall ? 'h-5 w-5' : 'h-4 w-4'} ${colors.icon}`} />
      </CardHeader>
      <CardContent>
        <div className={`flex items-baseline gap-1 ${colors.text}`}>
          <span className={`${isOverall ? 'text-4xl' : 'text-2xl'} font-bold`}>
            {score}
          </span>
          <span className={`${isOverall ? 'text-lg' : 'text-sm'} font-medium text-gray-500`}>
            /10
          </span>
        </div>
        <Progress 
          value={score * 10} 
          className={`${isOverall ? 'mt-4 h-2.5' : 'mt-3 h-2'}`}
          indicatorClassName={colors.progress}
        />
      </CardContent>
    </Card>
  );
};

export default function ReviewResultPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    const savedAnalysis = localStorage.getItem('codeAnalysis')
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis) as Analysis
        setAnalysis(parsed)
      } catch (error) {
        console.error('Error parsing analysis:', error)
      }
    }
  }, [])

  if (!analysis) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No analysis results found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        <main className="container max-w-6xl py-6 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Code Review Results</h1>
            <Link href="/new-review">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                + New Review
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <ScoreCard
                  title="Overall Score"
                  score={analysis.overall_score}
                  icon={Star}
                  isOverall={true}
                />
                <ScoreCard
                  title="Correctness & Functionality"
                  score={analysis.correctness_functionality}
                  icon={CheckCircle}
                />
                <ScoreCard
                  title="Quality & Maintainability"
                  score={analysis.code_quality_maintainability}
                  icon={CheckCircle}
                />
                <ScoreCard
                  title="Performance & Efficiency"
                  score={analysis.performance_efficiency}
                  icon={AlertCircle}
                />
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <ScoreCard
                  title="Security & Vulnerability"
                  score={analysis.security_vulnerability}
                  icon={Shield}
                />
                <ScoreCard
                  title="Consistency & Style"
                  score={analysis.code_consistency_style}
                  icon={Brush}
                />
                <ScoreCard
                  title="Scalability & Extensibility"
                  score={analysis.scalability_extensibility}
                  icon={Scale}
                />
                <ScoreCard
                  title="Error Handling & Robustness"
                  score={analysis.error_handling_robustness}
                  icon={Shield}
                />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <Badge
                    variant={
                      suggestion.type === 'error'
                        ? 'destructive'
                        : suggestion.type === 'warning'
                        ? 'secondary'
                        : 'success'
                    }
                  >
                    {suggestion.type}
                  </Badge>
                  <p className="text-sm">{suggestion.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {analysis.improved_code && typeof analysis.improved_code === 'string' && (
            <Card>
              <CardHeader>
                <CardTitle>Improved Code</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code>{analysis.improved_code}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

