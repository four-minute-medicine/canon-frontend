# RAG ChatBot - Next.js Frontend

A modern, beautiful chatbot interface built with Next.js, TypeScript, and Tailwind CSS that connects to a RAG (Retrieval-Augmented Generation) backend using FastAPI, Pinecone, and AI language models.

![ChatBot Interface](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ Features

### Frontend Features
- 🎨 **Beautiful Modern UI** - Gradient backgrounds, glassmorphism effects, and smooth animations
- 🧠 **Dual Chat Modes** - Standard and Reasoning modes for different AI capabilities
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Status** - Backend connection monitoring with visual indicators
- 🔄 **Live Typing Indicators** - Enhanced UX with realistic typing animations
- 📚 **Source Citations** - View sources and relevance scores from knowledge base
- 🧭 **Reasoning Display** - See the AI's step-by-step thinking process
- 🗑️ **Chat Management** - Clear conversations and manage chat history

### Backend Integration
- 🔗 **RAG Integration** - Connects to FastAPI backend with Pinecone vector database
- 🔍 **Vector Search** - Retrieval-augmented generation with semantic search
- 🤖 **Multiple AI Models** - Support for different reasoning and chat models
- ⚠️ **Error Handling** - Graceful degradation when backend is unavailable
- 🔄 **Health Monitoring** - Automatic backend health checks

## 🚀 Quick Start

### Prerequisites

1. **Backend Setup** - Ensure your RAG backend is running:
   ```bash
   cd /path/to/project-x
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

2. **Environment Variables** - Your backend should have these configured:
   - `GROQ_API_KEY`
   - `PINECONE_API_KEY`
   - `PINECONE_INDEX`
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`

### Frontend Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd chatbot-app
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Component Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx           # Main chatbot component
│   └── globals.css        # Global styles and Tailwind directives
```

### API Integration
The frontend communicates with your FastAPI backend through two endpoints:

- **`/chat`** - Standard RAG chat with vector search
- **`/reasoning-chat`** - Enhanced chat with step-by-step reasoning
- **`/health`** - Backend health check endpoint

## 💡 Usage

### Chat Modes

**Standard Mode (Default)**
- Quick responses using vector search
- Best for direct questions and information retrieval
- Shows sources and relevance scores

**Reasoning Mode** 
- Enhanced AI reasoning with step-by-step thinking
- Better for complex questions requiring analysis
- Displays both reasoning process and final answer

### Features Overview

1. **Real-time Status Indicator**
   - Green: Backend online and connected
   - Red: Backend offline or unreachable
   - Yellow: Checking connection status

2. **Source Citations**
   - View top sources used for each response
   - Relevance scores for transparency
   - Preview of source content

3. **Enhanced UX**
   - Smooth scrolling to new messages
   - Typing indicators during processing
   - Keyboard shortcuts (Enter to send)
   - One-click chat clearing

## 🔧 Configuration

### Backend URL
By default, the frontend expects the backend at `http://localhost:8000`. To change this, modify the `API_BASE_URL` constant in `src/app/page.tsx`:

```typescript
const API_BASE_URL = 'http://your-backend-url:port'
```

### CORS Setup
Your backend is already configured for CORS with the frontend URL. If running on a different port, update the CORS origins in your FastAPI backend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🎨 Customisation

### Styling
The interface uses Tailwind CSS with a dark theme and gradient design. Key colour schemes:
- Primary: Purple to Blue gradients
- Background: Slate with glassmorphism
- Accent: Purple for reasoning, Blue for actions

### Icons
Icons are provided by Lucide React:
- `Brain` - Reasoning mode and analysis
- `Bot` - AI assistant avatar  
- `User` - User avatar
- `Send` - Message sending
- `Zap` - Sources and citations

## 📱 Responsive Design

The interface is fully responsive with breakpoints for:
- **Mobile** (< 640px): Compact layout, stacked elements
- **Tablet** (640px - 1024px): Balanced spacing
- **Desktop** (> 1024px): Full-width chat with sidebars

## 🐛 Troubleshooting

### Backend Connection Issues
1. **Check Backend Status**: Ensure FastAPI server is running on port 8000
2. **CORS Errors**: Verify frontend URL is in CORS allowlist
3. **API Endpoints**: Confirm `/chat`, `/reasoning-chat`, and `/health` endpoints exist

### UI Issues
1. **Styling Problems**: Clear browser cache and restart dev server
2. **TypeScript Errors**: Run `npm run build` to check for issues
3. **Missing Icons**: Ensure `lucide-react` is properly installed

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Docker
- Traditional hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- **Next.js** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **FastAPI** - Modern Python web framework for the backend
- **Pinecone** - Vector database for semantic search

---

**Built with ❤️ using Next.js and TypeScript**

