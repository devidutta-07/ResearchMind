from agents import web_search_agent, web_extractor_agent,writer_chain, critic_chain


state={}

def run_agents(topic:str)->dict:

    print("step 1 - search agent is working ...")

    search_agent=web_search_agent()
    search_results=search_agent.invoke({
        "messages":[("user", f"Find recent, reliable and detailed information about: {topic}")]
    }
    )
    state["search_results"]=search_results['messages'][-1].content

    print("\n search result ",state['search_results'])

    print("step 2 - Reader agent is scraping top resources ...")

    scraper_agent=web_extractor_agent()
    scrap_results=scraper_agent.invoke({
        "messages":[("user",
                f"Based on the following search results about '{topic}', "
                f"pick the most relevant URL and scrape it for deeper content.\n\n"
                f"Search Results:\n{state['search_results'][:800]}")]
    }
    )
    state['scrap_results']=scrap_results['messages'][-1].content
    print("\nscraped content: \n", state['scrap_results'])
    print("step 3 - Writer is drafting the report ...")

    combined_result=(
        f"SEARCH RESULT :\n{state["search_results"]}\n\n"
        f"SCRAP RESULT : \n{state["scrap_results"]}"
    )
    state['report']=writer_chain.invoke({
        "topic":topic,
        "research":combined_result
    })

    print("\n final report :\n",state['report'])

    print("step 4 - critic is reviewing the report ")

    state['feedback']=critic_chain.invoke({"report":state['report']})
    print("\n feedback :\n",state['feedback'])
    return state

if __name__=="__main__":
    topic=input("Enter a topic :")
    run_agents(topic)