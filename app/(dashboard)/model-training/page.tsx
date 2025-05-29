'use client'
import ModelTrainingFrom from "@/components/models/ModelTrainingFrom";
import React from "react";


const ModelTraining = () => {
  return (
    <section className="w-full h-full flex flex-col px-20 mx-auto">
      <h1 className="text-3xl font-bold mb-2">Train Model</h1>
      <p className="text-muted-foreground mb-6">
        Train model with your own image
      </p>
      <ModelTrainingFrom />
    </section>
  );
};

export default ModelTraining;
