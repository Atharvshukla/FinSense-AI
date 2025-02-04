import { ChatInterface } from '@/components/chat-interface';

export default async function EmbedChatPage({ searchParams }: { searchParams: any }) {
  // Resolve searchParams if it's a Promise
  const resolvedParams = await searchParams;
  const storeId = resolvedParams?.storeId;

  if (!storeId) {
    return (
      <div className="p-4 text-red-500">
        Error: Missing store ID parameter
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ChatInterface storeId={storeId} className="h-full rounded-none shadow-none" />
    </div>
  );
}
