'use client'
import { WorkflowFormSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { onCreateWorkflow } from '@/app/(main)/(pages)/workflows/_actions/workflow-actions'
import { useModal } from '@/providers/modal-provider'

type props = {
  title?:string
  subTitle?:string
}

const WorkflowForm = ({title, subTitle}: props) => {
  const { setClose } = useModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof WorkflowFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(WorkflowFormSchema),
    defaultValues: {
      title: title || '',
      description: subTitle || '',
    },
  })

  const handleSubmit = async (values: z.infer<typeof WorkflowFormSchema>) => {
    const workflow = await onCreateWorkflow(values.title, values.description)

    if(workflow){
      toast.success('Workflow created successfully')
      router.refresh()
    }

    setClose()
  }
  
  const isLoading = form.formState.isSubmitting

  return (
    <Card className="w-full max-w-[650px] border-none">
      {
        title && subTitle && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subTitle}</CardDescription>
          </CardHeader>
        )
      }
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-col gap-4 text-left'
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name='title'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Title' type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='description'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Description' type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className={clsx(
                'self-start font-bold text-black',
                !isLoading && 'hover:bg-[#2F006B] hover:text-white',
                isLoading && 'cursor-not-allowed opacity-50',
              )}
            >
              {isLoading && (
                <Loader2 className='mr-2 size-4 animate-spin' />
              )} Add Workflow
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default WorkflowForm