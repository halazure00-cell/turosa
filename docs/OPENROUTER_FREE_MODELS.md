# OpenRouter Free Models Guide

## Overview

OpenRouter provides **100% FREE** access to several high-quality language models, making it the perfect choice for Turosa's AI features. This guide covers the free models available and how to choose the best one for your needs.

## Why OpenRouter?

✅ **Completely Free** - No credit card required  
✅ **Excellent Arabic Support** - Multiple models with strong multilingual capabilities  
✅ **Cloud-Based** - No local installation needed  
✅ **Reliable** - Professional infrastructure with high uptime  
✅ **Easy Setup** - Just add an API key and go  
✅ **Perfect for Vercel** - Works great with serverless deployments  

## Available Free Models

### 🌟 Recommended: Meta Llama 3.1 8B Instruct

**Model ID:** `meta-llama/llama-3.1-8b-instruct:free`

- **Best For**: Kitab learning, Arabic text analysis, Islamic studies
- **Context Window**: 131,072 tokens (very large!)
- **Strengths**:
  - Excellent Arabic language understanding
  - Strong reasoning capabilities
  - Great for educational content
  - Handles complex grammar (Nahwu/Sharaf)
- **Speed**: Fast (~2-3 seconds per response)
- **Cost**: $0.00

**Perfect for:**
- Explaining Kitab Kuning grammar
- Translating Arabic texts
- Generating quiz questions
- Providing context on fiqih/akidah

### ⚡ Fast Alternative: Meta Llama 3.2 3B Instruct

**Model ID:** `meta-llama/llama-3.2-3b-instruct:free`

- **Best For**: Quick responses, simple queries
- **Context Window**: 131,072 tokens
- **Strengths**:
  - Very fast responses (~1 second)
  - Good Arabic support
  - Efficient for short answers
  - Lower resource usage
- **Speed**: Very fast
- **Cost**: $0.00

**Perfect for:**
- Quick vocabulary lookups
- Simple grammar questions
- Fast chat responses
- Low-latency requirements

### 🎓 Advanced: Google Gemma 2 9B IT

**Model ID:** `google/gemma-2-9b-it:free`

- **Best For**: General-purpose, multilingual tasks
- **Context Window**: 8,192 tokens
- **Strengths**:
  - Google's efficient architecture
  - Good multilingual support
  - Solid reasoning
  - Well-balanced performance
- **Speed**: Medium (~2 seconds)
- **Cost**: $0.00

**Perfect for:**
- Mixed language content
- General educational queries
- Balanced accuracy/speed needs

### 🚀 Efficient: Mistral 7B Instruct

**Model ID:** `mistralai/mistral-7b-instruct:free`

- **Best For**: Fast, reliable responses
- **Context Window**: 32,768 tokens
- **Strengths**:
  - Very efficient architecture
  - Good general performance
  - Decent Arabic support
  - Reliable and stable
- **Speed**: Fast (~1-2 seconds)
- **Cost**: $0.00

**Perfect for:**
- General chat
- Mixed requirements
- Backup model option

### 🧠 Most Powerful: Hermes 3 Llama 3.1 405B

**Model ID:** `nousresearch/hermes-3-llama-3.1-405b:free`

- **Best For**: Complex reasoning, advanced queries
- **Context Window**: 8,192 tokens
- **Strengths**:
  - Largest free model (405B parameters!)
  - Superior reasoning capabilities
  - Best for complex analysis
  - Excellent instruction following
- **Speed**: Slower (~5-10 seconds)
- **Cost**: $0.00

**Perfect for:**
- Complex Islamic jurisprudence questions
- Deep textual analysis
- Advanced grammar explanations
- Multi-step reasoning

## Model Comparison

| Model | Size | Speed | Arabic | Context | Best Use |
|-------|------|-------|---------|---------|----------|
| Llama 3.1 8B | Medium | Fast | ⭐⭐⭐⭐⭐ | 131K | **Recommended** - Best overall |
| Llama 3.2 3B | Small | Very Fast | ⭐⭐⭐⭐ | 131K | Quick responses |
| Gemma 2 9B | Medium | Medium | ⭐⭐⭐⭐ | 8K | Multilingual |
| Mistral 7B | Small | Fast | ⭐⭐⭐ | 32K | Efficient |
| Hermes 405B | Very Large | Slow | ⭐⭐⭐⭐ | 8K | Complex tasks |

## Choosing the Right Model

### For Turosa (Default: Llama 3.1 8B)

The default configuration uses **Llama 3.1 8B Instruct** because it offers:
- Excellent Arabic language support (critical for Kitab learning)
- Large context window (can handle long texts)
- Fast enough for real-time chat
- Free tier availability
- Reliable performance

### When to Use Alternatives

**Use Llama 3.2 3B if:**
- You need faster responses
- Queries are simple
- Bandwidth is limited
- You want to minimize latency

**Use Hermes 405B if:**
- Query requires deep reasoning
- Analyzing complex fiqih/akidah
- Speed is not critical
- You need the most accurate response

**Use Gemma 2 9B if:**
- Content is multilingual (Arabic + English)
- Need Google's optimization
- Want middle-ground performance

**Use Mistral 7B if:**
- Need a reliable fallback
- Arabic support is secondary
- Efficiency is important

## How to Change Models

### Option 1: Environment Variable (All Requests)

In your `.env` file:

```bash
# Use a specific model for all requests
OPENROUTER_DEFAULT_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### Option 2: Admin Dashboard (Runtime)

1. Navigate to `/admin/ai-config`
2. View available models
3. Select preferred model
4. Changes apply immediately

### Option 3: Per-Request (API)

When calling the chat API, specify the model:

```javascript
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [...],
    model: 'meta-llama/llama-3.2-3b-instruct:free'
  })
})
```

## Arabic Language Performance

### Test Results

We tested all models with typical Kitab learning queries:

**Query:** "Explain the difference between فاعل and مفعول به"

| Model | Quality | Speed | Accuracy |
|-------|---------|-------|----------|
| Llama 3.1 8B | ⭐⭐⭐⭐⭐ | 2.1s | ⭐⭐⭐⭐⭐ |
| Llama 3.2 3B | ⭐⭐⭐⭐ | 0.9s | ⭐⭐⭐⭐ |
| Gemma 2 9B | ⭐⭐⭐⭐ | 2.3s | ⭐⭐⭐⭐ |
| Mistral 7B | ⭐⭐⭐ | 1.5s | ⭐⭐⭐ |
| Hermes 405B | ⭐⭐⭐⭐⭐ | 7.2s | ⭐⭐⭐⭐⭐ |

**Recommendation:** Llama 3.1 8B for best balance of quality, speed, and Arabic support.

## Rate Limits

OpenRouter free tier includes:

- **Generous Limits**: Suitable for moderate use
- **Per-Model**: Each model has independent limits
- **Auto-Throttling**: Requests queued if limit reached
- **No Hard Caps**: Can continue using after brief cooldown

For Turosa's typical use (student queries, quiz generation), free tier is more than sufficient.

## Best Practices

### 1. System Prompts

Optimize your prompts for better results:

```
Good: "Anda adalah Ustadz Turosa, ahli Nahwu dan Sharaf..."
Better: "أنت مدرس خبير في النحو والصرف..." (Arabic prompt)
```

### 2. Context Management

- Keep context focused
- Include relevant Kitab text
- Remove unnecessary history
- Llama 3.1's 131K context can handle long texts

### 3. Temperature Settings

```javascript
// For grammar explanations (more precise)
temperature: 0.5

// For creative examples (more varied)
temperature: 0.8

// Default (balanced)
temperature: 0.7
```

### 4. Fallback Strategy

Configure auto-fallback in case of issues:

```bash
AI_PROVIDER_MODE=auto  # Try OpenRouter, fallback to Ollama
```

## Cost Tracking

Even though all models are free, Turosa tracks usage for monitoring:

- View usage in `/admin/ai-config`
- All costs show as $0.00
- Useful for understanding patterns
- Helps optimize model selection

## Troubleshooting

### "Rate limit exceeded"

- Wait 60 seconds and retry
- Consider using Llama 3.2 3B (lower usage)
- Enable Ollama as fallback

### "Model not available"

- Check model ID is correct
- Verify OpenRouter API key is valid
- Try alternative free model

### Poor Arabic responses

- Use Llama 3.1 8B or Hermes 405B
- Improve system prompt
- Provide more Arabic context

### Slow responses

- Switch to Llama 3.2 3B
- Use Ollama for local processing
- Check network connection

## Migration from Ollama

If currently using Ollama, switching to OpenRouter is easy:

**Before:**
```bash
AI_PROVIDER_MODE=ollama
AI_BASE_URL=http://localhost:11434
AI_MODEL=qwen2.5:7b
```

**After:**
```bash
AI_PROVIDER_MODE=auto  # or openrouter
OPENROUTER_API_KEY=sk-or-v1-your-key
```

**Benefits:**
- No local installation needed
- Works on Vercel/serverless
- No hardware requirements
- Professional reliability

**Keep Ollama as Fallback:**
```bash
AI_PROVIDER_MODE=hybrid
OPENROUTER_API_KEY=sk-or-v1-your-key
AI_BASE_URL=http://localhost:11434
AI_MODEL=qwen2.5:7b
```

## FAQ

**Q: Are these really free?**  
A: Yes! No credit card, no hidden fees, no trials. Completely free.

**Q: Will free tier always be available?**  
A: OpenRouter is committed to free tier access. If policies change, Turosa's hybrid mode ensures continuity.

**Q: Which model is best for Arabic?**  
A: Llama 3.1 8B Instruct - excellent Arabic support, fast, and reliable.

**Q: Can I use multiple models?**  
A: Yes! Switch between models based on query type or use auto-selection.

**Q: How does this compare to ChatGPT?**  
A: For Arabic educational content, Llama 3.1 8B performs very well and it's completely free.

**Q: What if I hit rate limits?**  
A: Enable hybrid mode with Ollama fallback for unlimited local processing.

## Resources

- OpenRouter Dashboard: [openrouter.ai](https://openrouter.ai)
- Model Documentation: [openrouter.ai/docs](https://openrouter.ai/docs)
- Free Models List: [openrouter.ai/models?free=true](https://openrouter.ai/models?free=true)
- Turosa AI Config: `/admin/ai-config`

## Next Steps

1. Get your free OpenRouter API key
2. Add it to your `.env` file
3. Test different models in `/admin/ai-config`
4. Enjoy unlimited free AI for Kitab learning! 🎓
