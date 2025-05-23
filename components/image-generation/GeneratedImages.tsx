import React from "react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const images = [
  {
    src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
    alt: "Charismatic Young Man with a Warm Smile and Stylish Tousled Hair",
  },
  {
    src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
    alt: "Confident Businesswoman on Turquoise Backdrop",
  },
  {
    src: "/hero-images/Man in Brown Suit.jpeg",
    alt: "Man in Brown Suit",
  },
  {
    src: "/hero-images/Professional Business Portrait.jpeg",
    alt: "Professional Business Portrait",
  },
];

const GeneratedImages = () => {
  if (images.length === 0) {
    return (
      <Card className="w-full max-h-2xl bg-muted">
        <CardContent className="flex items-center justify-center aspect-square p-6">
          <p className="text-2xl font-bold">No images generated yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((images, index) => (
          <CarouselItem key={index}>
            <div className="flex relative items-center justify-center rounded-xl overflow-hidden aspect-square">
              <Image
                src={images.src}
                alt={images.alt}
                fill
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default GeneratedImages;
