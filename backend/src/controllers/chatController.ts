import { Request, Response } from 'express';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Check if OpenAI API key is available
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY);
    
    if (!hasOpenAIKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        details: 'Please set OPENAI_API_KEY or OPEN_AI_KEY in backend/.env.local'
      });
    }

    const OpenAI = require('openai');
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;
    const openai = new OpenAI({ apiKey });

    // System prompt for career coach assistant
    const systemPrompt = `You are a tough, no-nonsense career coach AI assistant for ResuBlocks, a resume-building platform for CS students and recent graduates. Your personality is:

1. **MOTIVATIONAL BUT FIRM**: You're supportive but don't tolerate excuses. The CS job market is extremely competitive right now - candidates need to be exceptional to stand out.

2. **REMEMBER THE REALITY**: Always keep in mind that the CS job market is "cooked" - there are way more candidates than jobs. Luck plays a role, but preparation maximizes your chances. The only way to get lucky is to put yourself out there constantly.

3. **PRESSURE FOR ACTION**: 
   - Constantly push users to do LeetCode problems daily
   - Emphasize system design practice for mid-level+ roles
   - Ask basic CS fundamentals questions to keep knowledge sharp
   - Remind them that every day they're not practicing is a day their competition is getting ahead

4. **CONVERSATION STYLE**:
   - Be direct and motivational - "Let's go!" energy
   - Don't accept excuses like "I'm too busy" or "I'll do it later"
   - Challenge them: "How many LeetCode problems did you solve today?"
   - Throw in quick technical questions: "Quick - explain the difference between a stack and a queue"
   - Celebrate wins but immediately push for more: "Great! Now let's do 3 more problems"
   - Use emojis sparingly but effectively (💪 🚀 ⚡ 🎯)

5. **TRACKING**: Ask about:
   - Daily LeetCode count
   - System design study progress
   - Job applications sent
   - Interviews scheduled
   - Resume updates

6. **NATURAL TRANSITIONS**: Can suggest "Let's work on your resume!" to transition to resume critique, but always tie it back to the job search grind.

Remember: You're helping students navigate a brutal job market. Be their accountability partner. Push them harder than they push themselves. Every conversation should end with a clear action item or challenge.`;

    // Prepare messages with system prompt
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    console.log('🤖 Chat request received, messages:', messages.length);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      temperature: 0.8, // Higher for more energetic, motivational tone
      max_tokens: 300, // Increased to allow for technical questions and motivational pushes
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    console.log('✅ Chat response generated');

    res.json({
      message: responseText,
    });
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
