'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Code, Settings, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

export default function NewReviewPage() {
const router = useRouter()
const [files, setFiles] = useState<File[]>([])
const [dragActive, setDragActive] = useState(false)

const handleDrag = (e: React.DragEvent) => {
 e.preventDefault()
 e.stopPropagation()
 if (e.type === "dragenter" || e.type === "dragover") {
   setDragActive(true)
 } else if (e.type === "dragleave") {
   setDragActive(false)
 }
}

const handleDrop = (e: React.DragEvent) => {
 e.preventDefault()
 e.stopPropagation()
 setDragActive(false)
 
 const droppedFiles = Array.from(e.dataTransfer.files)
 setFiles(prev => [...prev, ...droppedFiles])
}

const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files) {
   const selectedFiles = Array.from(e.target.files)
   setFiles(prev => [...prev, ...selectedFiles])
 }
}

const removeFile = (index: number) => {
 setFiles(prev => prev.filter((_, i) => i !== index))
}

const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault()
 // Here you would typically send the code to your backend or API
 // For now, we'll just navigate to the review result page
 router.push('/review-result')
}

return (
 <div className="min-h-screen bg-background">
   <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
     <div className="container flex h-14 items-center">
       <Link 
         href="/dashboard" 
         className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
       >
         <ArrowLeft className="h-4 w-4" />
         <span className="hidden sm:inline">Back to Dashboard</span>
         <span className="sm:hidden">Back</span>
       </Link>
     </div>
   </header>

   <div className="flex justify-center">
     <main className="container max-w-4xl py-6">
       <div className="mb-6">
         <h1 className="text-3xl font-bold">New Code Review</h1>
         <p className="text-muted-foreground mt-1">Submit your code for review and analysis</p>
       </div>

       <Tabs defaultValue="code" className="space-y-6">
         <TabsList className="w-full justify-start sm:w-auto">
           <TabsTrigger value="code" className="flex items-center gap-2">
             <Code className="h-4 w-4" />
             <span className="hidden sm:inline">Code</span>
           </TabsTrigger>
           <TabsTrigger value="settings" className="flex items-center gap-2">
             <Settings className="h-4 w-4" />
             <span className="hidden sm:inline">Settings</span>
           </TabsTrigger>
         </TabsList>

         <TabsContent value="code" className="space-y-6">
           <Card>
             <CardContent className="pt-6">
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                   <Label htmlFor="title">Review Title</Label>
                   <Input 
                     id="title" 
                     placeholder="Enter a descriptive title for your review"
                     className="mt-1.5"
                   />
                 </div>

                 <div className="space-y-4">
                   <Label>Code Input</Label>
                   <div 
                     className={`
                       border-2 border-dashed rounded-lg p-4 sm:p-8
                       ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-muted'}
                       transition-colors duration-200
                     `}
                     onDragEnter={handleDrag}
                     onDragLeave={handleDrag}
                     onDragOver={handleDrag}
                     onDrop={handleDrop}
                   >
                     <div className="text-center">
                       <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                       <p className="mt-2 text-sm font-medium">
                         Drop your files here, or{' '}
                         <label className="text-blue-500 hover:text-blue-700 cursor-pointer">
                           browse
                           <input
                             type="file"
                             multiple
                             className="hidden"
                             onChange={handleFileInput}
                             accept=".js,.py,.java,.ts,.go,.rs"
                           />
                         </label>
                       </p>
                       <p className="mt-1 text-xs text-muted-foreground">
                         Supports: .js, .py, .java, .ts, .go, .rs files
                       </p>
                     </div>
                   </div>

                   {files.length > 0 && (
                     <div className="space-y-2">
                       {files.map((file, index) => (
                         <div 
                           key={index}
                           className="flex items-center justify-between p-2 bg-muted rounded-md"
                         >
                           <span className="text-sm truncate">{file.name}</span>
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => removeFile(index)}
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         </div>
                       ))}
                     </div>
                   )}

                   <div>
                     <Label htmlFor="code">Or paste your code directly</Label>
                     <Textarea
                       id="code"
                       placeholder="Paste your code here..."
                       className="mt-1.5 font-mono"
                       rows={10}
                     />
                   </div>
                 </div>
                 <div className="flex flex-col sm:flex-row justify-end gap-4">
                   <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                     <Link href="/dashboard">Cancel</Link>
                   </Button>
                   <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                     Start Review
                   </Button>
                 </div>
               </form>
             </CardContent>
           </Card>
         </TabsContent>

         <TabsContent value="settings">
           <Card>
             <CardContent className="pt-6 space-y-4">
               <div>
                 <Label htmlFor="language">Programming Language</Label>
                 <Input 
                   id="language" 
                   placeholder="Auto-detect"
                   className="mt-1.5 max-w-md"
                 />
               </div>
               <div>
                 <Label htmlFor="framework">Framework (optional)</Label>
                 <Input 
                   id="framework" 
                   placeholder="e.g., React, Django, Spring"
                   className="mt-1.5 max-w-md"
                 />
               </div>
               <div>
                 <Label htmlFor="rules">Review Rules</Label>
                 <Textarea
                   id="rules"
                   placeholder="Add custom review rules or guidelines..."
                   className="mt-1.5"
                   rows={4}
                 />
               </div>
             </CardContent>
           </Card>
         </TabsContent>
       </Tabs>
     </main>
   </div>
 </div>
)
}

