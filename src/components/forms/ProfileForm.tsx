'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { EditUserProfileSchema } from '@/lib/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

type props = {
  user: any
  onUpdate?: any
}

const ProfileForm = ({user, onUpdate}: props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EditUserProfileSchema>>({
    mode: 'onChange',
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const handleSubmit = async (data: z.infer<typeof EditUserProfileSchema>) => {
    setIsLoading(true);
    const response = await onUpdate(data.name);
    setIsLoading(false);
  }

  useEffect(() => {
    form.reset({name: user.name, email: user.email})
  }, [user])


  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex flex-col gap-6'
      >
        <FormField 
          disabled={isLoading}
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          disabled={true}
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type='email' {...field} />
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
          )} Save User Settings
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm