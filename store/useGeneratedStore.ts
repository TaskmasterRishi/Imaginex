import { create } from 'zustand'
import z, { string } from "zod";
import { imageGenerationFormSchema } from "@/components/image-generation/Configuration";
import { generateImageAction, storeImages } from '@/app/actions/image-actions';
import { toast } from 'sonner';

interface GeneratedState {
    loading: boolean,
    images: Array<{url: string}>,
    error: string | null;
    generateImage: (values: z.infer<typeof imageGenerationFormSchema>) => Promise<void>
}

const useGeneratedStore = create<GeneratedState>((set) => ({
    loading: false,
    images: [],
    error: null,

    generateImage: async (values: z.infer<typeof imageGenerationFormSchema>) => {
        set({loading: true, error: null});

        const toastId = toast.loading("Generating image ....")

        try {
            const {error, success, data} = await generateImageAction(values);
            if(!success) {
                set({error: error, loading: false});
                return;
            }

            const dataWithURL = data.map((url:string) => {
                return{
                    url,
                    ...values
                }
            })

            console.log(dataWithURL)

            set({images: dataWithURL, loading: false});

            toast.success("Image Generated Successfully",{id: toastId})
            await storeImages(dataWithURL);
            toast.success("Image Stored Successfully",{id: toastId})

        } catch(error) {
            console.error(error);
            set({error: "Failed to generate image. Please try again!", loading: false});
        }
    }
}))

export default useGeneratedStore;