import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChatInterface } from "@/components/chat-interface";
import { FileUpload } from "@/components/file-upload";
import { AuthForm } from "@/components/auth-form";

export default async function Dashboard() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  // Fetch the session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if session exists
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  // Fetch stores associated with the user
  const { data: stores, error } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  // Handle potential errors from the database query
  if (error) {
    console.error("Error fetching stores:", error);
    return <div>Error fetching stores. Please try again later.</div>;
  }

  const storeId = stores?.id;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">FinSense ChatBot</h1>
              <p className="text-lg text-muted-foreground">
                A powerful AI assistant for your personal finance, powered by RAG technology.
              </p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-muted-foreground hover:underline"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Knowledge Base</h2>
              <FileUpload storeId={storeId} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Chat Interface</h2>
              <ChatInterface storeId={storeId} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Integration Guide</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                To embed this chatbot in your website, add the following script tag to your HTML:
              </p>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code>{`<!-- Add this div where you want the chatbot to be initialized -->
<div id="store-chatbot" data-store-id="${storeId}"></div>      
<!-- Add this script to your HTML -->
<script src="${process.env.NEXT_PUBLIC_APP_URL}/api/chatbot"></script>
`}</code>
              </pre>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  The chatbot will appear as a floating button in the bottom-right corner of your website. When clicked, it will open a chat window where your customers can interact with your store&apos;s AI assistant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
