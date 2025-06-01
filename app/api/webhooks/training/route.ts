import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { EmailTemplate } from "@/components/email-templates/EmailTemplate";
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  console.log("Webhook is working", req);

  try {
    const body = await req.json();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    //To validate webhook
    const id = req.headers.get("webhook-id") ?? "";
    const timestamp = req.headers.get("webhook-timestamp") ?? "";
    const webhookSignature = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${id}.${timestamp}.${JSON.stringify(body)}`;
    const secret = await replicate.webhooks.default.secret.get();

    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");
    console.log(signature);

    const expectedSignatures = webhookSignature
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === signature
    );

    if(!isValid){
        return NextResponse.json("Invalid signature", {status: 401})
    }

    //get user data
    const {data: user, error: userError} = await supabaseAdmin.auth.admin.getUserById(userId);

    if(userError || !user){
        return NextResponse.json("User not found!", {status: 401})
    }

    const userEmail = user.user.email ?? "";
    const userName = user.user.user_metadata.full_name ?? "";

    if(body.status === "succeeded"){
        //send a successfull status email
        await resend.emails.send({
          from: 'ImaginX AI <>',
          to: [userEmail],
          subject: 'Your model training is complete',
          react: EmailTemplate({ userName, message:"Your model training is completed!" }) as React.ReactElement,
        });
        //update the supabase table
        await supabaseAdmin.from("models").update({
            training_status: body.status,
            training_time : body.metric?.toatl_time ?? null,
            version: body.output?.version.split(":")[1] ?? null,
        }).eq("user_id",userId).eq("model_name",modelName);

        //delete the training data from supabase storage
        supabaseAdmin.storage.from("training-data").remove([`${fileName}`])
    } else {

        //handle failed or canceled status
        await resend.emails.send({
            from: 'ImaginX AI <onboarding@resend.dev>',
            to: [userEmail],
            subject: `Your model training is ${body.status}`,
            react: EmailTemplate({ userName, message:`Your model training is ${body.status}!` }) as React.ReactElement,
          });
          //update the supabase table
          await supabaseAdmin.from("models").update({
              training_status: body.status,
          }).eq("user_id",userId).eq("model_name",modelName);
  
          //delete the training data from supabase storage
          supabaseAdmin.storage.from("training-data").remove([`${fileName}`])
    }

    return new NextResponse("Ok", { status: 200 });
  } catch (error) {
    console.log("Webhook error : ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
