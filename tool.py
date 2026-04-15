from langchain.tools import tool
from langchain_tavily import TavilySearch
from bs4 import BeautifulSoup
import requests
from rich import print
from dotenv import load_dotenv
load_dotenv()
tavily = TavilySearch(max_results=3)

@tool
def web_search(topic: str) -> str:
    """Searches the web and returns titles, URLs, and snifits"""
    
    results = tavily.invoke(topic)
    print(results)
    formatted_results = []
    
    for r in results['results']:
        formatted_results.append(
            f"Title: {r.get('title')}\n"
            f"Link: {r.get('url')}\n"
            f"Snippet: {r.get('content')}\n")
    
    return "\n----\n".join(formatted_results)

# print(web_search.invoke("news on Iran - America War"))

@tool
def web_extractor(links: str) -> str:
    """Scrapes content from given URLs"""
    
    urls = links.split("\n")
    all_content = []

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    for url in urls:
        try:
            response = requests.get(url.strip(), headers=headers, timeout=10)
            
            soup = BeautifulSoup(response.text, "html.parser")

            # Remove unwanted tags
            for tag in soup(["script", "style", "nav", "footer", "header"]):
                tag.decompose()

            text = soup.get_text(separator=" ", strip=True)

            all_content.append(f"URL: {url}\n{text[:2000]}\n")  

        except Exception as e:
            all_content.append(f"URL: {url}\nError: {str(e)}\n")

    return "\n\n".join(all_content)

# print(web_extractor.invoke("https://docs.mistral.ai/getting-started/introduction"))