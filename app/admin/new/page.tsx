"use client"
import CreatePostClient from '@/components/CreatePostClient'
import { Sidebar } from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const createPost = () => {
  const router = useRouter();

  return (
    <section className='w-full bg-background flex min-h-screen'>
        <Sidebar/>
        <div className='w-full mt-20'>
        <CreatePostClient/>
        </div>
    </section>
  )
}

export default createPost