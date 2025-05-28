import React from 'react'
import Configuration from '@/components/image-generation/Configuration'
import GeneratedImages from '@/components/image-generation/GeneratedImages'

const ImageGeneration = () => {
  return (
    <section className='container mx-auto grid gap-4 grid-cols-1 md:grid-cols-3 md:h-[80vh]'>
      <div className='md:col-span-1 flex items-center justify-center'>
        <Configuration />
      </div>
      <div className='md:col-span-2 p-4 rounded-xl flex items-center justify-center bg-gray-100'>
        <GeneratedImages />
      </div>
    </section>
  )
}

export default ImageGeneration;