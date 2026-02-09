# Getting Started with ChatFlow

This guide will help you get ChatFlow up and running in under 5 minutes.

## Step 1: Install Dependencies

From the project root:

```bash
npm install
```

This will install all dependencies for both frontend and backend packages.

## Step 2: Get an Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

## Step 3: Configure the Backend

1. Open `packages/backend/.env`
2. Replace `your-key-here` with your actual Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api01-your-actual-key-here
```

Save the file.

## Step 4: Start the Application

### Option A: Run Everything Together (Recommended)

From the project root:

```bash
npm run dev
```

This starts both frontend and backend simultaneously.

### Option B: Run Separately (Advanced)

**Terminal 1 - Backend:**
```bash
cd packages/backend
npm run dev
```

Wait for: `🚀 ChatFlow backend running on http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd packages/frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

## Step 5: Open ChatFlow

Open your browser and navigate to:

```
http://localhost:5173
```

You should see the ChatFlow landing page with a floating chat button in the bottom-right corner.

## Step 6: Test the Chat

1. Click the chat button (💬) in the bottom-right corner
2. The chat window will open
3. Type a message like: "Hello, what can you help me with?"
4. Press Enter or click the Send button
5. You should see Claude's response appear in the chat

### Example Conversations

Try these messages to test the functionality:

**Basic greeting:**
```
Hello! What can you do?
```

**Ask about capabilities:**
```
What integrations will ChatFlow support?
```

**General conversation:**
```
Tell me about the features you'll have
```

## What's Next?

### Current Features (Slice 1)
- ✅ Chat interface with floating button
- ✅ Real-time conversations with Claude
- ✅ Clean, modern UI

### Coming Soon (Future Slices)
- 🔜 **Slice 2**: Tool integration via MCP (Model Context Protocol)
- 🔜 **Slice 3**: Supabase integration (create projects, manage API keys)
- 🔜 **Slice 4**: Secure credential vault
- 🔜 **Slice 5**: Conversation history persistence
- 🔜 **Slice 6**: Production-ready polish

## Troubleshooting

### "ANTHROPIC_API_KEY is missing"

**Problem**: The backend can't find your API key.

**Solution**:
1. Check that `packages/backend/.env` exists
2. Verify the API key is correctly set (no quotes needed)
3. Restart the backend server

### "Failed to send message"

**Problem**: Frontend can't connect to backend.

**Solution**:
1. Verify the backend is running on `http://localhost:3000`
2. Check the backend terminal for errors
3. Try opening `http://localhost:3000/api/health` in your browser - should return `{"status":"ok"}`

### Port 3000 or 5173 already in use

**Problem**: Another application is using the port.

**Solution**:

**For backend (port 3000)**:
Edit `packages/backend/.env`:
```env
PORT=3001
```

**For frontend (port 5173)**:
Edit `packages/frontend/vite.config.ts`:
```typescript
server: {
  port: 5174,  // Changed from 5173
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### Chat window doesn't open

**Problem**: JavaScript error or build issue.

**Solution**:
1. Check browser console for errors (F12 → Console tab)
2. Try clearing browser cache and hard refresh (Ctrl+Shift+R)
3. Restart the frontend development server

### "Module not found" errors

**Problem**: Dependencies not installed correctly.

**Solution**:
```bash
# Clean and reinstall
npm run clean
npm install
```

## Development Tips

### Auto-Reload

Both frontend and backend have auto-reload enabled:
- **Frontend**: Changes to `.tsx`, `.ts`, `.css` files will hot-reload instantly
- **Backend**: Changes to `.ts` files will automatically restart the server

### Viewing Logs

**Backend logs** appear in the terminal where you ran `npm run dev` (backend)
- Look for request logs: `POST /api/chat`
- API errors will be logged here

**Frontend logs** appear in the browser console (F12 → Console)
- Check for network errors
- View API request/response details in Network tab

### Project Structure

```
chatflow/
├── packages/frontend/      ← React UI
│   └── src/
│       ├── components/    ← Chat UI components
│       ├── lib/          ← API client, state
│       └── App.tsx       ← Main app
│
└── packages/backend/      ← Express API
    └── src/
        ├── routes/       ← API endpoints
        └── services/     ← Claude integration
```

### Making Changes

**To modify the UI**:
- Edit files in `packages/frontend/src/components/`
- Changes will hot-reload automatically

**To modify the backend**:
- Edit files in `packages/backend/src/`
- Server will auto-restart

**To change the AI's behavior**:
- Edit `SYSTEM_PROMPT` in `packages/backend/src/services/claude.ts`

## Next Steps

1. **Explore the codebase**: Check out `CLAUDE.md` for architecture details
2. **Track progress**: See `CONTEXT.md` for what's built and what's next
3. **Customize**: Modify the UI colors, add features, experiment!

## Need Help?

- **Architecture questions**: Read `CLAUDE.md`
- **Current status**: Check `CONTEXT.md`
- **API reference**: See `README.md`

---

**Congratulations! You're now running ChatFlow locally.** 🎉

Try chatting with the assistant and stay tuned for upcoming features like Supabase integration and secure credential management!
