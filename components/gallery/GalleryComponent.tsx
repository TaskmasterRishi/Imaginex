'use client'
import { Tables } from '@/database.types'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ImageDialog from './ImageDialog'

type ImageProps = {
    url: string | undefined,
} & Tables<'generated_images'>

interface GalleryProps {
    images: ImageProps[]
}

const GalleryComponent = ({images}: GalleryProps) => {
    const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null)
    console.log(images)
    if(images.length === 0){
       return(
        <div className='flex justify-center items-center h-[50vh] text-muted-foreground'>
            No Images Found!!.
        </div>
       )
    }
    return (
        <div className='h-full w-full mx-auto py-8'>
            <div className='columns-4 gap-4 space-y-4'>
                {images.map((image, index) => (
                    <div key={index} className='relative overflow-hidden cursor-pointer transition-transform'
                    onClick={() => setSelectedImage(image)}>
                        <motion.div
                            className='absolute inset-0 bg-black rounded-lg'
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 0.7 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className='flex justify-center items-center h-full'>
                                <p className='text-primary-foreground text-lg font-semibold'>View Details</p>
                            </div>
                        </motion.div>
                        <Image 
                            src={image.url || ''} 
                            alt={image.prompt || 'Generated image'} 
                            width={image.width || 500} 
                            height={image.height || 500} 
                            className='object-cover rounded-lg'
                        />
                    </div>
                ))}
            </div>
            {selectedImage && <ImageDialog image={selectedImage} onClose={() => setSelectedImage(null)} />}
        </div>
    )
}

export default GalleryComponent