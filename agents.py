from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from tool import web_search, web_extractor
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv()

llm=ChatMistralAI(model="mistral-small-latest",temperature=0)
model=HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-R1",
)
critic_llm=ChatHuggingFace(llm=model,verbose=True)
def web_search_agent():
    return create_agent(llm,tools=[web_search])

def web_extractor_agent():
    return create_agent(llm,tools=[web_extractor])

#writer chain 
writer_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
You are a senior research analyst and technical writer.

Your task is to transform gathered research into a professional, evidence-based report.

Guidelines:
- Use ONLY information present in the provided research.
- Do not invent facts, statistics, quotes, or sources.
- Prioritize accuracy, depth, and clarity.
- Explain findings instead of merely listing them.
- Synthesize information from multiple sources when possible.
- Highlight trends, implications, opportunities, risks, and key insights.
- Maintain a neutral and objective tone.
- Avoid repetition and generic statements.
- Do not ask questions.
- Do not provide suggestions to the reader.
- End the report after the Sources section.
"""
    ),
    (
        "human",
        """
Topic:
{topic}

Research Data:
{research}

Generate a professional research report using the following structure:

# Executive Summary
Provide a concise overview of the topic and major findings.

# Introduction
Explain the topic, background, context, and significance.

# Key Findings

Provide at least 3 major findings.

For each finding:
- Explain the finding clearly.
- Discuss supporting evidence.
- Explain implications or significance.
- Include examples when available.

# Analysis

Analyze:
- Emerging patterns
- Relationships between findings
- Opportunities
- Risks or limitations
- Future implications

# Conclusion

Summarize the most important insights and takeaways.

# Sources

List all URLs found in the research.

Requirements:
- Be comprehensive and detailed.
- Write like a professional research analyst.
- Prefer depth over brevity.
- Use clear headings and structured paragraphs.
"""
    )
])
writer_chain = writer_prompt | llm | StrOutputParser()

#critic_chain 

critic_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
You are a senior research reviewer.

Your responsibility is to evaluate reports as if they are being submitted for publication.

Be objective, critical, and evidence-driven.

Scoring Guidelines:

10 = Publication-quality report
9 = Excellent report with minor improvements needed
8 = Strong report with noticeable weaknesses
7 = Good report but lacking depth or rigor
6 = Average report with multiple shortcomings
5 or below = Significant deficiencies

Do not inflate scores.
A score above 8 should be rare.
"""
    ),
    (
        "human",
        """
Evaluate the following research report.

Report:
{report}

Assess the report using these criteria:

1. Accuracy
- Are claims supported?
- Are there possible hallucinations?

2. Depth
- Does the report go beyond surface-level information?
- Are explanations meaningful?

3. Evidence Usage
- Are findings supported with examples or evidence?

4. Structure & Organization
- Is the report logically organized?
- Are sections coherent?

5. Clarity
- Is the writing precise and understandable?

6. Completeness
- Are important aspects of the topic missing?

7. Analytical Quality
- Does the report provide insight and interpretation rather than simple summarization?

Output Format:

Score: X/10

Category Scores:
- Accuracy: X/10
- Depth: X/10
- Evidence Usage: X/10
- Structure: X/10
- Clarity: X/10
- Completeness: X/10
- Analysis: X/10

Strengths:
- ...
- ...
- ...

Weaknesses:
- ...
- ...
- ...

Missing Information:
- ...
- ...

Improvement Instructions:
- ...
- ...
- ...

Final Verdict:
Provide a concise professional assessment of the report.
"""
    )
])

critic_chain = critic_prompt | critic_llm | StrOutputParser()