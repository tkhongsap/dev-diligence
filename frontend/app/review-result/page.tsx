'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/badge"
import { ArrowLeft, Bell, User, Menu, Star, CheckCircle, AlertCircle, Shield, Brush, Scale, LucideIcon, ClipboardCopy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Suggestion {
  type: 'improvement' | 'warning' | 'error'
  message: string
}

interface DimensionExplanation {
  score: number;
  explanation: string;
  key_findings: string[];
  improvement_suggestions: string[];
}

interface ImprovementSummary {
  critical_improvements: string[];
  recommended_improvements: string[];
  positive_aspects: string[];
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
  dimension_explanations?: {
    [key: string]: DimensionExplanation;
  };
  improvement_summary?: ImprovementSummary;
  suggested_implementation?: {
    code: string;
    improvements: string[];
    benefits: string[];
    explanation: string;
  };
}

const getScoreColors = (score: number, isOverall = false) => {
  if (score > 7) {
    return {
      card: isOverall 
        ? "from-blue-50/50 to-green-50/50" 
        : "from-green-50/50",
      text: isOverall 
        ? "text-blue-600" 
        : "text-green-600",
      progress: isOverall 
        ? "bg-blue-500" 
        : "bg-green-500",
      icon: isOverall 
        ? "text-blue-500" 
        : "text-green-500"
    }
  } else if (score >= 5) {
    return {
      card: isOverall 
        ? "from-blue-50/50 to-yellow-50/50" 
        : "from-yellow-50/50",
      text: isOverall 
        ? "text-blue-600" 
        : "text-yellow-600",
      progress: isOverall 
        ? "bg-blue-500" 
        : "bg-yellow-500",
      icon: isOverall 
        ? "text-blue-500" 
        : "text-yellow-500"
    }
  } else {
    return {
      card: isOverall 
        ? "from-blue-50/50 to-red-50/50" 
        : "from-red-50/50",
      text: isOverall 
        ? "text-blue-600" 
        : "text-red-600",
      progress: isOverall 
        ? "bg-blue-500" 
        : "bg-red-500",
      icon: isOverall 
        ? "text-blue-500" 
        : "text-red-500"
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
  const colors = getScoreColors(score, isOverall);
  
  return (
    <Card className={`
      bg-gradient-to-br ${colors.card} 
      transition-all duration-200 
      ${isOverall 
        ? 'shadow-lg hover:shadow-xl border-2 border-blue-100 ring-1 ring-blue-100/50' 
        : 'hover:shadow-md'
      }
    `}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`
          ${isOverall ? 'text-base font-semibold' : 'text-sm font-medium'} 
          ${isOverall ? 'text-blue-900' : 'text-gray-900'}
        `}>
          {title}
        </CardTitle>
        <Icon className={`
          ${isOverall ? 'h-6 w-6' : 'h-4 w-4'} 
          ${colors.icon}
          ${isOverall ? 'opacity-90' : 'opacity-75'}
        `} />
      </CardHeader>
      <CardContent>
        <div className={`flex items-baseline gap-1 ${colors.text}`}>
          <span className={`
            ${isOverall ? 'text-5xl' : 'text-2xl'} 
            font-bold
            ${isOverall ? 'tracking-tight' : ''}
          `}>
            {score}
          </span>
          <span className={`
            ${isOverall ? 'text-lg' : 'text-sm'} 
            font-medium 
            ${isOverall ? 'text-blue-400' : 'text-gray-500'}
          `}>
            /10
          </span>
        </div>
        <Progress 
          value={score * 10} 
          className={`
            ${isOverall ? 'mt-4 h-3' : 'mt-3 h-2'}
            ${isOverall ? 'bg-blue-100' : ''}
          `}
          indicatorClassName={`${colors.progress} ${isOverall ? 'transition-all duration-700' : ''}`}
        />
      </CardContent>
    </Card>
  );
};

const DimensionDetail = ({
  title,
  explanation,
  score
}: {
  title: string;
  explanation: DimensionExplanation;
  score: number;
}) => {
  const getScoreColor = (score: number) => {
    if (score > 7) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <div className={`font-semibold ${getScoreColor(score)}`}>
          Score: {score}/10
        </div>
      </div>
      <p className="text-gray-700">{explanation.explanation}</p>
      
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-900">Key Findings</h4>
        <ul className="list-disc pl-5 space-y-1">
          {explanation.key_findings.map((finding, index) => (
            <li key={index} className="text-sm text-gray-600">{finding}</li>
          ))}
        </ul>
      </div>
      
      {explanation.improvement_suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900">Improvement Suggestions</h4>
          <ul className="list-disc pl-5 space-y-1">
            {explanation.improvement_suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SuggestedCodeImprovement = ({
  analysis
}: {
  analysis: Analysis;
}) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (analysis.suggested_implementation?.code) {
      navigator.clipboard.writeText(analysis.suggested_implementation.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Suggested Code Improvement</span>
          <Badge variant="outline" className="text-blue-600 bg-blue-50">Target Score: 9+/10</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {analysis.suggested_implementation?.explanation || 
            "Below is a suggested implementation that addresses all identified issues and follows best practices to achieve a higher overall score."}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-900">Key Improvements Made:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {analysis.suggested_implementation?.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-gray-900">Improved Implementation:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className={`text-xs flex items-center gap-2 transition-all duration-200 ${
                copied 
                  ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-3 w-3" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
            <code className="text-gray-800">{analysis.suggested_implementation?.code || ''}</code>
          </pre>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm text-blue-900 mb-2">Benefits of this Implementation:</h4>
          <ul className="space-y-1 text-sm text-blue-700">
            {analysis.suggested_implementation?.benefits.map((benefit, index) => (
              <li key={index}>• {benefit}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const isKeyOfAnalysis = (key: string): key is keyof Analysis => {
  return [
    'overall_score',
    'correctness_functionality',
    'code_quality_maintainability',
    'performance_efficiency',
    'security_vulnerability',
    'code_consistency_style',
    'scalability_extensibility',
    'error_handling_robustness'
  ].includes(key);
};

export default function ReviewResultPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    const savedAnalysis = localStorage.getItem('codeAnalysis')
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis) as Analysis
        setAnalysis(parsed)
      } catch (err) {
        console.error('Error parsing analysis:', err)
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

          <div className="space-y-6">
            {analysis.improvement_summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysis.improvement_summary.critical_improvements?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-red-600">Critical Improvements Needed</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.improvement_summary.critical_improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-600">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysis.improvement_summary.recommended_improvements?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-yellow-600">Recommended Improvements</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.improvement_summary.recommended_improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-600">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysis.improvement_summary.positive_aspects?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-green-600">Positive Aspects</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.improvement_summary.positive_aspects.map((aspect, index) => (
                          <li key={index} className="text-sm text-gray-600">{aspect}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {analysis.dimension_explanations && (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {Object.entries(analysis.dimension_explanations || {}).map(([key, explanation]) => {
                    if (!isKeyOfAnalysis(key)) return null;
                    
                    const score = Number(analysis[key]);
                    if (isNaN(score)) return null;
                    
                    const title = key.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                    
                    return (
                      <DimensionDetail
                        key={key}
                        title={title}
                        explanation={explanation}
                        score={score}
                      />
                    );
                  }).filter(Boolean)}
                </CardContent>
              </Card>
            )}
          </div>

          <SuggestedCodeImprovement analysis={analysis} />
        </main>
      </div>
    </div>
  )
}

