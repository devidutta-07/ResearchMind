from langchain.agents import create_agent
from langchain_mistralai import ChatMistralAI
from tool import web_search, web_extractor
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv()

llm=ChatMistralAI(model_name="mistral-small-latest",temperature=0)

def web_search_agent():
    return create_agent(llm,tools=[web_search])

def web_extractor_agent():
    return create_agent(llm,tools=[web_extractor])

#writer chain 

writer_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert research writer."),
    ("human", """Write a structured, factual report.

Topic: {topic}
Research: {research}

Format:
- Introduction
- Key Findings (min 3, well explained)
- Conclusion
- Sources (all URLs)

Rules:
- Do NOT ask questions or suggest anything
- Do NOT include lines like "Would you like..." or "Let me know..."
- End strictly after the Sources section

Be clear, professional, and complete."""),
])
writer_chain = writer_prompt | llm | StrOutputParser()

#critic_chain 

critic_prompt = ChatPromptTemplate.from_messages([
     ("system", "You are a sharp and constructive research critic. Be honest and specific."),
    ("human", """Review the research report below and evaluate it strictly.

Report:
{report}

Respond in this exact format:

Score: X/10

Strengths:
- ...
- ...

Areas to Improve:
- ...
- ...

One line verdict:
..."""),
])

critic_chain = critic_prompt | llm | StrOutputParser()