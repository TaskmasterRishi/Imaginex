import { fetchModels } from "@/app/actions/model-actions";
import ModelList from "@/components/models/ModelList";
import React from "react";

const Models = async () => {
  const data = await fetchModels();

  return (
    <section className="w-full h-full flex flex-col px-10 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Models</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your models
        </p>
      </div>
      <ModelList models={data}/>
    </section>
  );
};

export default Models;
