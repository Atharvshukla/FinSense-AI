import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getGeminiEmbedding } from '@/lib/gemini';
import { getGeminiResponse } from '@/lib/gemini';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { messages, storeId } = await req.json();
    const lastMessage = messages[messages.length - 1];
    console.log(messages);
    console.log(storeId);
    
    
    // Generate embedding for the query
    const queryEmbedding = await getGeminiEmbedding(lastMessage.content);

    // Search for relevant documents
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      store_id: storeId
    });

    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
    console.log(documents);

    // Combine relevant documents into context
    const context = documents?.map((doc:any) => doc.content).join('\n') || '';
    console.log(context);

    // Generate response using Gemini
    const prompt = `You are a helpful AI assistant for an online store. Based on the following context, please answer the user's question. If you cannot find a relevant answer in the context, politely say so and offer to help with something else.

Context:
${context}

Question: ${lastMessage.content}

Answer:`;

  console.log(prompt);


    const response = await getGeminiResponse(prompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}