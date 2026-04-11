import OpenAI from "openai";

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────
const DSA_SYSTEM_PROMPT = `You are a friendly and helpful DSA tutor, like a senior developer mentoring a junior.

🎯 YOUR PERSONALITY:
- Casual, encouraging, and conversational
- Use greetings: "Hey!", "Sure thing!", "Let's dig in!"
- Natural language - not robotic
- Be understanding of typos and informal language

🚨 TOPIC RESTRICTION:
You ONLY respond to questions about:
- Data Structures & Algorithms
- Coding problems (LeetCode, Codeforces, etc.)
- Programming concepts
- Software development
- Debugging and code review

For non-coding topics, politely redirect:
"Hey! I'm specifically here to help with coding and DSA. Got any programming questions?"

🚨 SOLUTION CONTROL:
NEVER give full code solutions UNLESS the user clearly wants it through phrases like:
- "give/show/provide/explain the solution"
- "full solution"
- "complete code"
- "how to solve this"
- "what's the answer"
- Variations with typos: "soluton", "explin solution", etc.

WHEN USER JUST MENTIONS A PROBLEM NAME (like "two sum", "trapping rain water"):
Respond naturally:

"Ah, [Problem Name]! Classic problem. What would you like to do?

1. Understand what the problem is asking
2. Walk through examples
3. Discuss possible approaches
4. Think about edge cases
5. See the full solution"

FORMATTING:
- Markdown for structure
- Code blocks: \`\`\`javascript or \`\`\`python
- Keep it conversational but helpful
`;

// ─── HELPERS ────────────────────────────────────────────────────────────────

const OFF_TOPIC_RESPONSE = `Hey! I'm specifically here to help with coding and DSA. Got any programming questions? 😊`;

const famousProblems = [
  // Arrays
  { pattern: /\b(two|2)[\s\-_]*sum\b/i, name: "Two Sum" },
  { pattern: /\b(three|3)[\s\-_]*sum\b/i, name: "Three Sum" },
  { pattern: /\b(four|4)[\s\-_]*sum\b/i, name: "Four Sum" },
  { pattern: /\btrapp(ing|ed)?[\s\-_]*(rain[\s\-_]*)?water\b/i, name: "Trapping Rain Water" },
  { pattern: /\bcontainer[\s\-_]*(with[\s\-_]*)?most[\s\-_]*water\b/i, name: "Container With Most Water" },
  { pattern: /\bbest[\s\-_]*time[\s\-_]*(to[\s\-_]*)?(buy|sell)[\s\-_]*stock\b/i, name: "Best Time to Buy and Sell Stock" },
  { pattern: /\bproduct[\s\-_]*of[\s\-_]*array[\s\-_]*except[\s\-_]*self\b/i, name: "Product of Array Except Self" },
  { pattern: /\bmaximum[\s\-_]*subarray\b/i, name: "Maximum Subarray (Kadane's)" },
  { pattern: /\brotate[\s\-_]*(array|image)\b/i, name: "Rotate Array/Image" },

  // Strings
  { pattern: /\blongest[\s\-_]*substring[\s\-_]*without[\s\-_]*repeat/i, name: "Longest Substring Without Repeating Characters" },
  { pattern: /\blongest[\s\-_]*palindrom(e|ic)[\s\-_]*substring\b/i, name: "Longest Palindromic Substring" },
  { pattern: /\bvalid[\s\-_]*paren(theses|s)?\b/i, name: "Valid Parentheses" },
  { pattern: /\bgroup[\s\-_]*anagrams\b/i, name: "Group Anagrams" },
  { pattern: /\blongest[\s\-_]*common[\s\-_]*subsequence\b/i, name: "Longest Common Subsequence" },
  { pattern: /\bedit[\s\-_]*distance\b/i, name: "Edit Distance" },

  // Linked Lists
  { pattern: /\breverse[\s\-_]*linked[\s\-_]*list\b/i, name: "Reverse Linked List" },
  { pattern: /\bmerge[\s\-_]*(two[\s\-_]*)?sorted[\s\-_]*lists?\b/i, name: "Merge Two Sorted Lists" },
  { pattern: /\blinked[\s\-_]*list[\s\-_]*cycle\b/i, name: "Linked List Cycle" },
  { pattern: /\blru[\s\-_]*cache\b/i, name: "LRU Cache" },

  // Trees
  { pattern: /\binvert[\s\-_]*binary[\s\-_]*tree\b/i, name: "Invert Binary Tree" },
  { pattern: /\bmaximum[\s\-_]*depth[\s\-_]*(of[\s\-_]*)?binary[\s\-_]*tree\b/i, name: "Maximum Depth of Binary Tree" },
  { pattern: /\bvalidate[\s\-_]*bst\b/i, name: "Validate Binary Search Tree" },
  { pattern: /\blowest[\s\-_]*common[\s\-_]*ancestor\b/i, name: "Lowest Common Ancestor" },
  { pattern: /\blevel[\s\-_]*order[\s\-_]*traversal\b/i, name: "Binary Tree Level Order Traversal" },
  { pattern: /\bserialize[\s\-_]*(and[\s\-_]*)?deserialize\b/i, name: "Serialize and Deserialize Binary Tree" },

  // Graphs
  { pattern: /\bnumber[\s\-_]*of[\s\-_]*islands\b/i, name: "Number of Islands" },
  { pattern: /\bcourse[\s\-_]*schedule\b/i, name: "Course Schedule" },
  { pattern: /\bclone[\s\-_]*graph\b/i, name: "Clone Graph" },
  { pattern: /\bword[\s\-_]*ladder\b/i, name: "Word Ladder" },
  { pattern: /\bpacific[\s\-_]*atlantic\b/i, name: "Pacific Atlantic Water Flow" },

  // DP
  { pattern: /\bclimbing[\s\-_]*stairs\b/i, name: "Climbing Stairs" },
  { pattern: /\bcoin[\s\-_]*change\b/i, name: "Coin Change" },
  { pattern: /\bhouse[\s\-_]*robber\b/i, name: "House Robber" },
  { pattern: /\blongest[\s\-_]*increasing[\s\-_]*subsequence\b/i, name: "Longest Increasing Subsequence" },
  { pattern: /\blongest[\s\-_]*consecutive[\s\-_]*(sequence)?\b/i, name: "Longest Consecutive Sequence" },
  { pattern: /\bknapsack\b/i, name: "0/1 Knapsack Problem" },
  { pattern: /\bword[\s\-_]*break\b/i, name: "Word Break" },

  // Other classics
  { pattern: /\bmerge[\s\-_]*intervals\b/i, name: "Merge Intervals" },
  { pattern: /\binsert[\s\-_]*interval\b/i, name: "Insert Interval" },
  { pattern: /\bslid(d)?ing[\s\-_]*window[\s\-_]*maximum\b/i, name: "Sliding Window Maximum" },
  { pattern: /\btop[\s\-_]*k[\s\-_]*frequent\b/i, name: "Top K Frequent Elements" },
  { pattern: /\bkth[\s\-_]*largest\b/i, name: "Kth Largest Element" },
  { pattern: /\bmedian[\s\-_]*(of[\s\-_]*)?two[\s\-_]*sorted[\s\-_]*arrays\b/i, name: "Median of Two Sorted Arrays" },
];

// ─── DETECT FAMOUS PROBLEM (async, AI fallback) ──────────────────────────────

const detectFamousProblem = async (text, openai) => {
  const t = text.toLowerCase().trim();

  // 1. Static patterns first (instant, free)
  for (const prob of famousProblems) {
    if (prob.pattern.test(t)) return prob.name;
  }

  // 2. AI fallback for unknown problems (max_tokens: 20 = very cheap)
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Is "${text}" a real DSA or LeetCode problem? If yes, reply with ONLY the exact problem name. If no, reply with ONLY "null".`
      }],
      max_tokens: 20,
      temperature: 0,
    });

    const result = response.choices[0].message.content?.trim();
    return result === "null" ? null : result;
  } catch {
    return null;
  }
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

const isFollowUpToGuidedMenu = (messages) => {
  if (messages.length < 2) return false;

  // Check last 6 messages (3 exchanges) instead of just the last assistant msg
  const recentMessages = messages.slice(-6);
  const hasRecentMenu = recentMessages
    .filter(m => m.role === "assistant")
    .some(m => /See the full solution|Walk through examples|Discuss possible approaches|Break down the problem/i
      .test(m.content));

  if (hasRecentMenu) return true;

  // Also allow short replies when AI just gave an explanation
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant");
  if (!lastAssistantMsg) return false;

  const isShortReply = messages[messages.length - 1]?.content?.trim().split(" ").length <= 4;
  const lastMsgWasDSA = /sequence|array|integer|consecutive|function|input|output/i
    .test(lastAssistantMsg.content);

  return isShortReply && lastMsgWasDSA;
};

const isCodingRelated = (text) => {
  const t = text.toLowerCase();

  const codingKeywords = [
    'algorithm', 'data structure', 'array', 'string', 'tree', 'graph',
    'linked list', 'stack', 'queue', 'heap', 'hash', 'dp', 'dynamic programming',
    'recursion', 'sorting', 'searching', 'binary search', 'dfs', 'bfs',
    'greedy', 'sliding window', 'two pointer', 'backtrack',
    'code', 'function', 'variable', 'loop', 'if', 'else', 'class', 'object',
    'debug', 'error', 'exception', 'compile', 'runtime', 'syntax',
    'method', 'return', 'parameter', 'argument',
    'javascript', 'python', 'java', 'c++', 'typescript', 'rust', 'go',
    'react', 'node', 'api', 'backend', 'frontend', 'database', 'sql',
    'leetcode', 'codeforces', 'hackerrank', 'problem', 'solution',
    'neetcode', 'interview',
    'git', 'github', 'deploy', 'build', 'test', 'framework', 'library',
    'component', 'state', 'props', 'hook', 'async', 'promise',
    'walk through', 'discuss', 'break down', 'edge case', 'approach', 'example',
  ];

  const greetings = ['hi', 'hello', 'hey', 'sup', 'yo'];
  if (greetings.some(g => t.trim() === g)) return true;

  if (/leetcode\.com|codeforces\.com|hackerrank\.com/i.test(text)) return true;
  if (/```|function|def\s+\w+|class\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+/i.test(text)) return true;

  return codingKeywords.some(keyword => t.includes(keyword));
};

const isSolutionRequest = (text) => {
  const solutionPhrases = [
    /\b(give|show|provide|explain|get)\s*(me\s*)?(the\s*)?(full\s*)?(complete\s*)?(code\s*)?solu?ti?o?n/i,
    /\bfull\s*(code|solution)/i,
    /\bshow\s*(code|solution)/i,
    /\bexplain\s*(the\s*)?(code|solution|approach|answer)/i,
    /\bhow\s*(to\s*)?(solve|code)\s*(this|it)/i,
    /\bwhat'?s\s*the\s*(solution|answer|code)/i,
    /\b(give|show)\s*(me\s*)?code/i,
    /\bcomplete\s*(solution|code)/i,
    /option\s*5/i,
    /^\s*5\s*$/,
  ];
  return solutionPhrases.some(pattern => pattern.test(text));
};

const looksLikeSolution = (text) => {
  const codePatterns = [
    /function\s+\w+\s*\(/,
    /def\s+\w+\s*\(/,
    /class\s+\w+\s*{/,
    /const\s+\w+\s*=\s*\(/,
    /=>\s*{/,
    /for\s*\([^)]+\)\s*{/,
    /while\s*\([^)]+\)\s*{/,
    /if\s*\([^)]+\)\s*{.*return/s,
  ];
  return codePatterns.filter(p => p.test(text)).length >= 2;
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

const createGuidedResponse = (problemName = null) => {
  if (problemName) {
    return `Ah, **${problemName}**! Classic problem. What would you like to do?

1. Understand what the problem is asking
2. Walk through examples
3. Discuss possible approaches
4. Think about edge cases
5. See the full solution`;
  }
  return `Alright, let's tackle this! What do you want to focus on?

1. Break down the problem  
2. Go through some examples  
3. Brainstorm approaches (no code yet)  
4. Think about edge cases  
5. See the full solution`;
};

// ─── MAIN FUNCTION ───────────────────────────────────────────────────────────

export const getAIResponse = async (messages, customSystemPrompt = null) => {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error("GROK_API_KEY is missing from environment variables.");

  const systemPrompt = customSystemPrompt || DSA_SYSTEM_PROMPT;
  const isGroq = apiKey.startsWith("gsk_");

  const openai = new OpenAI({
    apiKey,
    baseURL: isGroq ? "https://api.groq.com/openai/v1" : "https://api.x.ai/v1",
    dangerouslyAllowBrowser: true,
  });

  const userLastMessage = messages[messages.length - 1]?.content || "";

  // ─── GREETINGS ────────────────────────────────────────────────
  if (/^\s*(hi|hello|hey|sup|yo|what'?s up)\s*!*$/i.test(userLastMessage)) {
    return "Hey! 👋 Ready to tackle some DSA problems? Drop a question or paste a LeetCode link!";
  }

  // ─── DETECT PROBLEM (static + AI fallback) ────────────────────
  const detectedProblem = await detectFamousProblem(userLastMessage, openai);
  if (detectedProblem && !isSolutionRequest(userLastMessage)) {
    return createGuidedResponse(detectedProblem);
  }

  // ─── TOPIC FILTER ─────────────────────────────────────────────
  if (!isCodingRelated(userLastMessage) && !isFollowUpToGuidedMenu(messages)) {
    console.warn("🚫 BLOCKED: Non-coding question detected");
    return OFF_TOPIC_RESPONSE;
  }

  // ─── PROBLEM STATEMENT ────────────────────────────────────────
  if (isProblemStatement(userLastMessage) && !isSolutionRequest(userLastMessage) && !isFollowUpToGuidedMenu(messages)) {
    return createGuidedResponse();
  }

  // ─── PASS TO AI ───────────────────────────────────────────────
  const openaiMessages = [{ role: "system", content: systemPrompt }, ...messages];

  try {
    const completion = await openai.chat.completions.create({
      model: isGroq ? "llama-3.3-70b-versatile" : "grok-beta",
      messages: openaiMessages,
      temperature: 0.3,
      max_tokens: 2000,
    });

    let aiResponse = completion.choices[0].message.content?.trim() || "";

    if (!isSolutionRequest(userLastMessage) && looksLikeSolution(aiResponse)) {
      console.warn("🚨 BLOCKED: AI tried to give solution without permission");
      return `I can help you understand the approach, but I'll hold off on the full code for now. Want to:

- Discuss the strategy?
- Walk through examples?
- **Or type "explain solution" to see the code**`;
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
  createGuidedResponse,
  detectFamousProblem,
  OFF_TOPIC_RESPONSE,
};