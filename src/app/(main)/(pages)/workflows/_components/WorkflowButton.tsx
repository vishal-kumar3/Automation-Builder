'use client'
import WorkflowForm from '@/components/forms/WorkflowForm'
import CustomModal from '@/components/global/customModal'
import { Button } from '@/components/ui/button'
import { useBilling } from '@/providers/billing-provider'
import { useModal } from '@/providers/modal-provider'
import { Plus } from 'lucide-react'
import React from 'react'

type props = {}

const WorkflowButton = (props: props) => {
  const {setOpen, setClose} = useModal()
  const { credit } = useBilling()

  const handleClick = () => {
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Create a new workflow automation to automate your business processes."
      >
        <WorkflowForm />
      </CustomModal>
    )

  }
  
  return (
    <Button
      size={'icon'}
      {
        ...(credit !== '0'
          ? { onClick: handleClick }
          : { disabled: true }
        )
      }
    >
      <Plus />
    </Button>
  )
}

export default WorkflowButton