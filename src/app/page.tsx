import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChatInterface } from "@/components/chat-interface";
import { FileUpload } from "@/components/file-upload";
import { AuthForm } from "@/components/auth-form";
import LandingPage from "@/components/landingpage";

export default function Home() {
  return <LandingPage />;
}
