"use client"
import CreatePostClient from '@/components/CreatePostClient'
import { Sidebar } from '@/components/Sidebar';

const createPost = () => {

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