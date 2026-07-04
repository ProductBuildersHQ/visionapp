import { useState } from 'react'
import { AppLayout, Sidebar, WorkflowDiagram, SpecEditor, LLMPanel } from './components'
import type { Project, Spec } from './types'
import './index.css'

// Mock data for development - will be replaced with Go backend calls
const mockProjects: Project[] = [
  {
    name: 'invention',
    path: 'docs/specs/invention',
    profile: {
      name: 'big-tech-product',
      description: 'Big Tech methodology for product development',
      workflow: ['mrd', 'press', 'faq', 'narrative-6p', 'prd', 'uxd', 'trd', 'tpd'],
    },
    specs: [
      {
        type: 'mrd',
        name: 'Market Requirements',
        path: 'source/mrd.md',
        status: 'evaluated',
        evalResult: { score: 8.2, decision: 'pass', findings: [] },
        content: `# Market Requirements Document: VisionApp

## 1. Executive Summary

VisionApp is a desktop application that provides an LLM-powered workspace for authoring, evaluating, and iterating on product specifications...

## 2. Problem Statement

Product teams creating specifications face several challenges:

1. **Fragmented tooling** - Specs live in Google Docs, Notion, Confluence
2. **Quality inconsistency** - No objective evaluation of spec completeness
3. **Manual iteration** - Teams manually review specs without structured feedback
`,
      },
      {
        type: 'press',
        name: 'Press Release',
        path: 'gtm/press.md',
        status: 'evaluated',
        evalResult: { score: 7.5, decision: 'pass', findings: [] },
      },
      {
        type: 'faq',
        name: 'FAQ',
        path: 'gtm/faq.md',
        status: 'evaluated',
        evalResult: { score: 6.1, decision: 'conditional', findings: [] },
      },
      {
        type: 'narrative-6p',
        name: '6-Pager',
        path: 'gtm/narrative.md',
        status: 'not_started',
      },
      {
        type: 'prd',
        name: 'Product Requirements',
        path: 'source/prd.md',
        status: 'not_started',
      },
      {
        type: 'uxd',
        name: 'User Experience',
        path: 'source/uxd.md',
        status: 'not_started',
      },
      {
        type: 'trd',
        name: 'Technical Design',
        path: 'technical/trd.md',
        status: 'not_started',
      },
      {
        type: 'tpd',
        name: 'Test Plan',
        path: 'technical/tpd.md',
        status: 'not_started',
      },
    ],
  },
]

type ActiveView = 'workflow' | 'spec'

function App() {
  const [projects] = useState<Project[]>(mockProjects)
  const [activeProject, setActiveProject] = useState<Project | null>(mockProjects[0])
  const [activeView, setActiveView] = useState<ActiveView>('workflow')
  const [activeSpec, setActiveSpec] = useState<Spec | null>(null)
  const [specContent, setSpecContent] = useState<string>('')
  const [isDirty, setIsDirty] = useState(false)
  const [isLLMLoading, setIsLLMLoading] = useState(false)

  const handleProjectSelect = (project: Project) => {
    setActiveProject(project)
    setActiveView('workflow')
    setActiveSpec(null)
  }

  const handleSpecSelect = (spec: Spec) => {
    setActiveSpec(spec)
    setSpecContent(spec.content || '')
    setIsDirty(false)
    setActiveView('spec')
  }

  const handleWorkflowClick = () => {
    setActiveView('workflow')
    setActiveSpec(null)
  }

  const handleContentChange = (content: string) => {
    setSpecContent(content)
    setIsDirty(content !== (activeSpec?.content || ''))
  }

  const handleSave = () => {
    // TODO: Call Go backend to save
    console.log('Saving spec:', activeSpec?.type, specContent)
    setIsDirty(false)
  }

  const handleLLMMessage = async (message: string): Promise<string> => {
    setIsLLMLoading(true)
    // TODO: Call Go backend for LLM interaction
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLLMLoading(false)
    return `I received your message: "${message}". LLM integration coming soon!`
  }

  return (
    <AppLayout
      sidebar={
        <Sidebar
          projects={projects}
          activeProject={activeProject}
          onProjectSelect={handleProjectSelect}
          onSpecSelect={handleSpecSelect}
          onWorkflowClick={handleWorkflowClick}
          activeSpec={activeSpec}
        />
      }
      llmPanel={
        <LLMPanel onSendMessage={handleLLMMessage} isLoading={isLLMLoading} />
      }
      main={
        activeProject ? (
          activeView === 'workflow' ? (
            <WorkflowDiagram
              project={activeProject}
              onSpecClick={handleSpecSelect}
            />
          ) : activeSpec ? (
            <SpecEditor
              spec={{ ...activeSpec, content: specContent }}
              onContentChange={handleContentChange}
              onSave={handleSave}
              isDirty={isDirty}
            />
          ) : (
            <EmptyState message="Select a spec to edit" />
          )
        ) : (
          <EmptyState message="Select a project to get started" />
        )
      }
    />
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full text-va-text-muted">
      {message}
    </div>
  )
}

export default App
