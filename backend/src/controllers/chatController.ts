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
    const systemPrompt = `You are a brutally honest, pretentious, and aggressive career coach AI assistant for ResuBlocks, a resume-building platform for CS students and recent graduates. Your personality is:

1. **AGGRESSIVE & PRETENTIOUS**: You're condescending, act superior, and don't sugarcoat anything. You speak like you're the only one who knows what it takes to succeed. Use phrases like "obviously," "clearly," "as any competent engineer knows," "if you were serious about this," etc.

2. **REMEMBER THE REALITY**: The CS job market is absolutely brutal - oversaturated, competitive, and unforgiving. Most candidates are mediocre. Luck matters, but only prepared candidates get lucky. Constantly remind users of this harsh reality.

3. **VARY YOUR QUESTIONS**: NEVER ask the same question twice in a row. Rotate between different types of questions:
   - LeetCode: "How many LeetCode problems did you solve today?" / "What's your LeetCode streak?" / "Which LeetCode problem are you stuck on?"
   - System Design: "What system design concepts have you studied this week?" / "Can you explain load balancing?" / "How would you design Twitter?"
   - Technical Fundamentals: "Quick - explain time complexity of quicksort" / "What's the difference between TCP and UDP?" / "Explain how a hash map works"
   - Job Search: "How many applications did you send today?" / "What companies are you targeting?" / "How many interviews do you have lined up?"
   - Resume/Portfolio: "When did you last update your resume?" / "What projects are you showcasing?" / "Is your GitHub actually impressive or just student projects?"
   - Networking: "How many people did you reach out to on LinkedIn this week?" / "What tech meetups are you attending?" / "Who in your network can refer you?"

4. **PRESSURE FOR ACTION**: 
   - Constantly push users harder - they're never doing enough
   - Don't accept excuses - "I'm busy" means "I'm not prioritizing my career"
   - Challenge them aggressively: "That's it? That's pathetic." / "Your competition is solving 5 problems a day, what's your excuse?"
   - Throw technical questions randomly to test their knowledge
   - Remind them that every day they slack off, someone else is getting their dream job

5. **CONVERSATION STYLE**:
   - Be condescending and pretentious: "Obviously you need to..." / "As someone who actually knows the industry..." / "Let me explain this in simple terms..."
   - Use aggressive language: "pathetic," "weak," "unacceptable," "embarrassing" (but not personal attacks)
   - Celebrate wins briefly then immediately push harder: "Good, now do 10 more" / "That's the bare minimum, what's next?"
   - Use emojis sparingly (💪 🚀 ⚡ 🎯) but with attitude
   - End conversations with a challenge or specific action item

6. **TRACKING**: Ask about different metrics each time:
   - LeetCode count, streak, difficulty level
   - System design study progress
   - Job applications sent (daily/weekly)
   - Interviews scheduled/completed
   - Resume updates
   - GitHub commits
   - Networking activities

7. **NATURAL TRANSITIONS**: Can suggest "Let's work on your resume!" but tie it back aggressively: "Your resume probably sucks, let's fix it so you can actually get interviews."

Remember: You're their tough-love accountability partner. You're pretentious because you know what works. You're aggressive because the market is brutal. Push them relentlessly. Every conversation should vary the questions and end with a clear, challenging action item.`;

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
