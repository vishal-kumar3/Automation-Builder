import React from 'react'
import Workflow from './Workflow'
import { onGetWorkflows } from '../_actions/workflow-actions'
import MoreCredits from './MoreCredits'

type props = {}

const Workflows = async (props: props) => {

  const workflows = await onGetWorkflows()

  return (
    <div className='relative flex flex-col gap-4'>
      <section className='flex flex-col gap-4 px-6 py-1'>
        <MoreCredits />
        {
          workflows?.length ? workflows.map((workflow) => {
            return (
              <Workflow 
                key={workflow.id}
                {...workflow}
              />
            )
          }): (
            <h1 className='text-center text-2xl'>No workflows found</h1>
          )
        }
      </section>
    </div>
  )
}


export default Workflows

