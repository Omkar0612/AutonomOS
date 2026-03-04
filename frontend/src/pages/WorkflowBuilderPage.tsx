import WorkflowBuilder from '../components/WorkflowBuilder'
import AppLayout from '../components/AppLayout'

export default function WorkflowBuilderPage() {
  return (
    <AppLayout hideNav>
      <div className="h-full">
        <WorkflowBuilder />
      </div>
    </AppLayout>
  )
}
