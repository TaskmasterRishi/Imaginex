import React from 'react'
import { Card, CardContent } from '../ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'

const images = [
  {
    src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
    title: "Charismatic Young Man with a Warm Smile and Stylish Tousled Hair"
  },
  {
    src: "/hero-images/Professional Woman in Navy Blue Suit.jpeg",
    title: "Professional Woman in Navy Blue Suit"
  },
  {
    src: "/hero-images/Futuristic Woman in Armor.jpeg",
    title: "Futuristic Woman in Armor"
  },
  {
    src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
    title: "Confident Businesswoman on Turquoise Backdrop"
  }
]

const GeneratedImages = () => {
  if (images.length === 0) {
    return (
      <Card className='w-full max-w-2xl bg-muted'>
        <CardContent className='flex aspect-square items-center justify-center'>
          <span className='text-2xl'>No images found</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1 flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
              <Image 
                src={image.src} 
                alt={image.title} 
                fill 
                className='w-full h-full object-cover'
                priority
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default GeneratedImages