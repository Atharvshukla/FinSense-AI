import { NextResponse } from 'next/server';

export async function GET() {
  // The actual chatbot script that will be injected into client websites
  const script = `
    (function() {
      // Create and inject required styles
      const style = document.createElement('style');
      style.textContent = \`
        .store-chatbot-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          width: 360px;
          height: 500px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: none;
          overflow: hidden;
        }
        .store-chatbot-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background: #000;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .store-chatbot-widget.open {
          display: block;
        }
      \`;
      document.head.appendChild(style);

      // Create chat button
      const button = document.createElement('div');
      button.className = 'store-chatbot-button';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
      document.body.appendChild(button);

      // Create chat widget
      const widget = document.createElement('div');
      widget.className = 'store-chatbot-widget';
      document.body.appendChild(widget);

      // Get store ID from the container element
      const container = document.getElementById('store-chatbot');
      const storeId = container?.getAttribute('data-store-id');
      
      if (!storeId) {
        console.error('Store Chatbot: Missing data-store-id attribute');
        return;
      }

      // Create iframe to load the chat interface
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.src = '${process.env.NEXT_PUBLIC_APP_URL}/embed/chat?storeId=' + storeId;
      widget.appendChild(iframe);

      // Toggle chat widget
      button.addEventListener('click', () => {
        widget.classList.toggle('open');
      });
    })();
  `;

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
    },
  });
}