import OpenAI from "openai";

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────
const DSA_SYSTEM_PROMPT = `You are an expert Data Structures and Algorithms (DSA) interviewer and tutor.

🚨 TOPIC RESTRICTION:
You ONLY respond to questions about:
- Data Structures & Algorithms
- Coding problems (LeetCode, Codeforces, etc.)
- Programming concepts
- Software development
- Debugging and code review

For ANY question outside these topics, respond EXACTLY with:
"I only help with coding, DSA, and software development questions. Please ask something related to programming!"

🚨 SOLUTION CONTROL:
You are FORBIDDEN from providing code/solution UNLESS the user's message contains:
- "GIVE_SOLUTION_NOW"
- "SHOW_CODE_NOW"
- "Get full solution"

WHEN USER SENDS A PROBLEM:
Respond ONLY with:

"What would you like to do next?
1. Understand the problem
2. Walk through examples
3. Discuss approach ideas (no solution)
4. Explore edge cases
5. Get full solution (type: GIVE_SOLUTION_NOW)"

FORMATTING RULES:
- Always use Markdown
- Code blocks: \`\`\`javascript or \`\`\`python
- Keep responses short and Socratic
`;

// ─── HELPERS ────────────────────────────────────────────────────────────────

const SOLUTION_TRIGGER = "GIVE_SOLUTION_NOW";
const SOLUTION_TRIGGER_ALT = "SHOW_CODE_NOW";

const OFF_TOPIC_RESPONSE = `I only help with coding, DSA, and software development questions. Please ask something related to programming!`;

/**
 * Check if query is coding/development related
 */
const isCodingRelated = (text) => {
  const t = text.toLowerCase();
  
  // Coding keywords
  const codingKeywords = [
    // DSA
    'algorithm', 'data structure', 'array', 'string', 'tree', 'graph', 
    'linked list', 'stack', 'queue', 'heap', 'hash', 'dp', 'dynamic programming',
    'recursion', 'sorting', 'searching', 'binary search', 'dfs', 'bfs',
    
    // Programming
    'code', 'function', 'variable', 'loop', 'if', 'else', 'class', 'object',
    'debug', 'error', 'exception', 'compile', 'runtime', 'syntax',
    
    // Languages
    'javascript', 'python', 'java', 'c++', 'typescript', 'rust', 'go',
    'react', 'node', 'api', 'backend', 'frontend', 'database', 'sql',
    
    // Problem platforms
    'leetcode', 'codeforces', 'hackerrank', 'problem', 'solution',
    
    // Development
    'git', 'github', 'deploy', 'build', 'test', 'framework', 'library',
    'component', 'state', 'props', 'hook', 'async', 'promise',
  ];
  
  // LeetCode/problem links
  if (/leetcode\.com|codeforces\.com|hackerrank\.com/i.test(text)) {
    return true;
  }
  
  // Code snippets
  if (/```|function|def\s+\w+|class\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+/i.test(text)) {
    return true;
  }
  
  // Check for any coding keywords
  return codingKeywords.some(keyword => t.includes(keyword));
};

const isSolutionRequest = (text) => {
  return (
    text.includes(SOLUTION_TRIGGER) ||
    text.includes(SOLUTION_TRIGGER_ALT) ||
    text.includes("Get full solution")
  );
};

const looksLikeSolution = (text) => {
  const codePatterns = [
    /function\s+\w+\s*\(/,
    /def\s+\w+\s*\(/,
    /class\s+\w+/,
    /const\s+\w+\s*=\s*\(/,
    /=>\s*{/,
    /for\s*\([^)]+\)\s*{/,
    /while\s*\([^)]+\)\s*{/,
    /if\s*\([^)]+\)\s*{.*return/s,
  ];
  
  return codePatterns.some(pattern => pattern.test(text));
};

const isProblemStatement = (text) => {
  const t = text.toLowerCase();
  
  if (text.length < 30) return false;
  
  return (
    /leetcode\.com\/problems/i.test(text) ||
    (t.includes("input") && t.includes("output")) ||
    (t.includes("example") && t.includes("constraints")) ||
    (t.includes("given") && t.includes("return"))
  );
};

const guidedResponse = `What would you like to do next?

1. Understand the problem  
2. Walk through examples  
3. Discuss approach ideas (no solution)  
4. Explore edge cases  
5. Get full solution (type: GIVE_SOLUTION_NOW)`;

// ─── MAIN FUNCTION ───────────────────────────────────────────────────────────

export const getAIResponse = async (messages, customSystemPrompt = null) => {
  const apiKey = process.env.GROK_API_KEY;

  if (!apiKey) {
    throw new Error("GROK_API_KEY is missing from environment variables.");
  }

  const systemPrompt = customSystemPrompt || DSA_SYSTEM_PROMPT;
  const isGroq = apiKey.startsWith("gsk_");

  const openai = new OpenAI({
    apiKey,
    baseURL: isGroq
      ? "https://api.groq.com/openai/v1"
      : "https://api.x.ai/v1",
    dangerouslyAllowBrowser: true,
  });

  const userLastMessage = messages[messages.length - 1]?.content || "";

  // ─── TOPIC FILTER: Block Non-Coding Questions ─────────────────
  if (!isCodingRelated(userLastMessage)) {
    console.warn("🚫 BLOCKED: Non-coding question detected");
    console.warn("User message:", userLastMessage);
    return OFF_TOPIC_RESPONSE;
  }

  // ─── EARLY RETURN: Problem Statement ──────────────────────────
  if (isProblemStatement(userLastMessage) && !isSolutionRequest(userLastMessage)) {
    return guidedResponse;
  }

  // ─── CONVERT OPTION NUMBER TO EXPLICIT TRIGGER ─────────────────
  let modifiedLastMessage = userLastMessage;
  
  if (/^\s*5\s*$/i.test(userLastMessage) || /option\s*5/i.test(userLastMessage)) {
    modifiedLastMessage = SOLUTION_TRIGGER;
  }

  const modifiedMessages = [
    ...messages.slice(0, -1),
    { role: "user", content: modifiedLastMessage }
  ];

  const openaiMessages = [
    { role: "system", content: systemPrompt },
    ...modifiedMessages,
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: isGroq ? "llama-3.3-70b-versatile" : "grok-beta",
      messages: openaiMessages,
      temperature: 0.1,
      max_tokens: 2000,
    });

    let aiResponse = completion.choices[0].message.content?.trim() || "";

    // ─── SOLUTION SAFETY CHECK ─────────────────────────────────────
    if (!isSolutionRequest(userLastMessage)) {
      if (looksLikeSolution(aiResponse)) {
        console.warn("🚨 BLOCKED: AI tried to give solution without permission");
        
        return `I can only provide the solution when you explicitly type: **GIVE_SOLUTION_NOW**

${guidedResponse}`;
      }
    }

    return aiResponse;

  } catch (error) {
    console.error("Error calling AI API:", error);
    throw new Error(`AI API Error: ${error.message}`);
  }
};

export {
  isSolutionRequest,
  looksLikeSolution,
  isProblemStatement,
  isCodingRelated,
  guidedResponse,
  SOLUTION_TRIGGER,
  OFF_TOPIC_RESPONSE,
};