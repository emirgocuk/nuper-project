# rag-implementation
Source: https://antigravity.codes/agent-skills/ai-tools/rag-implementation

## AI Worker Instructions
When the user requests functionality related to rag-implementation, follow these guidelines and utilize this context.

## Scraped Content

# rag-implementation
```
from langgraph.graph import StateGraph, START, ENDfrom langchain_anthropic import ChatAnthropicfrom langchain_voyageai import VoyageAIEmbeddingsfrom langchain_pinecone import PineconeVectorStorefrom langchain_core.documents import Documentfrom langchain_core.prompts import ChatPromptTemplatefrom langchain_text_splitters import RecursiveCharacterTextSplitterfrom typing import TypedDict, Annotatedclass RAGState(TypedDict):    question: str    context: list[Document]    answer: str# Initialize componentsllm = ChatAnthropic(model="claude-sonnet-4-5")embeddings = VoyageAIEmbeddings(model="voyage-3-large")vectorstore = PineconeVectorStore(index_name="docs", embedding=embeddings)retriever = vectorstore.as_retriever(search_kwargs={"k": 4})# RAG promptrag_prompt = ChatPromptTemplate.from_template(    """Answer based on the context below. If you cannot answer, say so.    Context:    {context}    Question: {question}    Answer:""")async def retrieve(state: RAGState) -> RAGState:    """Retrieve relevant documents."""    docs = await retriever.ainvoke(state["question"])    return {"context": docs}async def generate(state: RAGState) -> RAGState:    """Generate answer from context."""    context_text = "\n\n".join(doc.page_content for doc in state["context"])    messages = rag_prompt.format_messages(        context=context_text,        question=state["question"]    )    response = await llm.ainvoke(messages)    return {"answer": response.content}# Build RAG graphbuilder = StateGraph(RAGState)builder.add_node("retrieve", retrieve)builder.add_node("generate", generate)builder.add_edge(START, "retrieve")builder.add_edge("retrieve", "generate")builder.add_edge("generate", END)rag_chain = builder.compile()# Useresult = await rag_chain.ainvoke({"question": "What are the main features?"})print(result["answer"])
```
```
from langgraph.graph import StateGraph, START, ENDfrom langchain_anthropic import ChatAnthropicfrom langchain_voyageai import VoyageAIEmbeddingsfrom langchain_pinecone import PineconeVectorStorefrom langchain_core.documents import Documentfrom langchain_core.prompts import ChatPromptTemplatefrom langchain_text_splitters import RecursiveCharacterTextSplitterfrom typing import TypedDict, Annotatedclass RAGState(TypedDict):    question: str    context: list[Document]    answer: str# Initialize componentsllm = ChatAnthropic(model="claude-sonnet-4-5")embeddings = VoyageAIEmbeddings(model="voyage-3-large")vectorstore = PineconeVectorStore(index_name="docs", embedding=embeddings)retriever = vectorstore.as_retriever(search_kwargs={"k": 4})# RAG promptrag_prompt = ChatPromptTemplate.from_template(    """Answer based on the context below. If you cannot answer, say so.    Context:    {context}    Question: {question}    Answer:""")async def retrieve(state: RAGState) -> RAGState:    """Retrieve relevant documents."""    docs = await retriever.ainvoke(state["question"])    return {"context": docs}async def generate(state: RAGState) -> RAGState:    """Generate answer from context."""    context_text = "\n\n".join(doc.page_content for doc in state["context"])    messages = rag_prompt.format_messages(        context=context_text,        question=state["question"]    )    response = await llm.ainvoke(messages)    return {"answer": response.content}# Build RAG graphbuilder = StateGraph(RAGState)builder.add_node("retrieve", retrieve)builder.add_node("generate", generate)builder.add_edge(START, "retrieve")builder.add_edge("retrieve", "generate")builder.add_edge("generate", END)rag_chain = builder.compile()# Useresult = await rag_chain.ainvoke({"question": "What are the main features?"})print(result["answer"])
```
```
from langchain_community.retrievers import BM25Retrieverfrom langchain.retrievers import EnsembleRetriever# Sparse retriever (BM25 for keyword matching)bm25_retriever = BM25Retriever.from_documents(documents)bm25_retriever.k = 10# Dense retriever (embeddings for semantic search)dense_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})# Combine with Reciprocal Rank Fusion weightsensemble_retriever = EnsembleRetriever(    retrievers=[bm25_retriever, dense_retriever],    weights=[0.3, 0.7]  # 30% keyword, 70% semantic)
```
```
from langchain_community.retrievers import BM25Retrieverfrom langchain.retrievers import EnsembleRetriever# Sparse retriever (BM25 for keyword matching)bm25_retriever = BM25Retriever.from_documents(documents)bm25_retriever.k = 10# Dense retriever (embeddings for semantic search)dense_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})# Combine with Reciprocal Rank Fusion weightsensemble_retriever = EnsembleRetriever(    retrievers=[bm25_retriever, dense_retriever],    weights=[0.3, 0.7]  # 30% keyword, 70% semantic)
```
```
from langchain.retrievers.multi_query import MultiQueryRetriever# Generate multiple query perspectives for better recallmulti_query_retriever = MultiQueryRetriever.from_llm(    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),    llm=llm)# Single query → multiple variations → combined resultsresults = await multi_query_retriever.ainvoke("What is the main topic?")
```
```
from langchain.retrievers.multi_query import MultiQueryRetriever# Generate multiple query perspectives for better recallmulti_query_retriever = MultiQueryRetriever.from_llm(    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),    llm=llm)# Single query → multiple variations → combined resultsresults = await multi_query_retriever.ainvoke("What is the main topic?")
```
```
from langchain.retrievers import ContextualCompressionRetrieverfrom langchain.retrievers.document_compressors import LLMChainExtractor# Compressor extracts only relevant portionscompressor = LLMChainExtractor.from_llm(llm)compression_retriever = ContextualCompressionRetriever(    base_compressor=compressor,    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10}))# Returns only relevant parts of documentscompressed_docs = await compression_retriever.ainvoke("specific query")
```
```
from langchain.retrievers import ContextualCompressionRetrieverfrom langchain.retrievers.document_compressors import LLMChainExtractor# Compressor extracts only relevant portionscompressor = LLMChainExtractor.from_llm(llm)compression_retriever = ContextualCompressionRetriever(    base_compressor=compressor,    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10}))# Returns only relevant parts of documentscompressed_docs = await compression_retriever.ainvoke("specific query")
```
```
from langchain.retrievers import ParentDocumentRetrieverfrom langchain.storage import InMemoryStorefrom langchain_text_splitters import RecursiveCharacterTextSplitter# Small chunks for precise retrieval, large chunks for contextchild_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)# Store for parent documentsdocstore = InMemoryStore()parent_retriever = ParentDocumentRetriever(    vectorstore=vectorstore,    docstore=docstore,    child_splitter=child_splitter,    parent_splitter=parent_splitter)# Add documents (splits children, stores parents)await parent_retriever.aadd_documents(documents)# Retrieval returns parent documents with full contextresults = await parent_retriever.ainvoke("query")
```
```
from langchain.retrievers import ParentDocumentRetrieverfrom langchain.storage import InMemoryStorefrom langchain_text_splitters import RecursiveCharacterTextSplitter# Small chunks for precise retrieval, large chunks for contextchild_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)# Store for parent documentsdocstore = InMemoryStore()parent_retriever = ParentDocumentRetriever(    vectorstore=vectorstore,    docstore=docstore,    child_splitter=child_splitter,    parent_splitter=parent_splitter)# Add documents (splits children, stores parents)await parent_retriever.aadd_documents(documents)# Retrieval returns parent documents with full contextresults = await parent_retriever.ainvoke("query")
```
```
from langchain_core.prompts import ChatPromptTemplateclass HyDEState(TypedDict):    question: str    hypothetical_doc: str    context: list[Document]    answer: strhyde_prompt = ChatPromptTemplate.from_template(    """Write a detailed passage that would answer this question:    Question: {question}    Passage:""")async def generate_hypothetical(state: HyDEState) -> HyDEState:    """Generate hypothetical document for better retrieval."""    messages = hyde_prompt.format_messages(question=state["question"])    response = await llm.ainvoke(messages)    return {"hypothetical_doc": response.content}async def retrieve_with_hyde(state: HyDEState) -> HyDEState:    """Retrieve using hypothetical document."""    # Use hypothetical doc for retrieval instead of original query    docs = await retriever.ainvoke(state["hypothetical_doc"])    return {"context": docs}# Build HyDE RAG graphbuilder = StateGraph(HyDEState)builder.add_node("hypothetical", generate_hypothetical)builder.add_node("retrieve", retrieve_with_hyde)builder.add_node("generate", generate)builder.add_edge(START, "hypothetical")builder.add_edge("hypothetical", "retrieve")builder.add_edge("retrieve", "generate")builder.add_edge("generate", END)hyde_rag = builder.compile()
```
```
from langchain_core.prompts import ChatPromptTemplateclass HyDEState(TypedDict):    question: str    hypothetical_doc: str    context: list[Document]    answer: strhyde_prompt = ChatPromptTemplate.from_template(    """Write a detailed passage that would answer this question:    Question: {question}    Passage:""")async def generate_hypothetical(state: HyDEState) -> HyDEState:    """Generate hypothetical document for better retrieval."""    messages = hyde_prompt.format_messages(question=state["question"])    response = await llm.ainvoke(messages)    return {"hypothetical_doc": response.content}async def retrieve_with_hyde(state: HyDEState) -> HyDEState:    """Retrieve using hypothetical document."""    # Use hypothetical doc for retrieval instead of original query    docs = await retriever.ainvoke(state["hypothetical_doc"])    return {"context": docs}# Build HyDE RAG graphbuilder = StateGraph(HyDEState)builder.add_node("hypothetical", generate_hypothetical)builder.add_node("retrieve", retrieve_with_hyde)builder.add_node("generate", generate)builder.add_edge(START, "hypothetical")builder.add_edge("hypothetical", "retrieve")builder.add_edge("retrieve", "generate")builder.add_edge("generate", END)hyde_rag = builder.compile()
```
```
from langchain_text_splitters import RecursiveCharacterTextSplittersplitter = RecursiveCharacterTextSplitter(    chunk_size=1000,    chunk_overlap=200,    length_function=len,    separators=["\n\n", "\n", ". ", " ", ""]  # Try in order)chunks = splitter.split_documents(documents)
```
```
from langchain_text_splitters import RecursiveCharacterTextSplittersplitter = RecursiveCharacterTextSplitter(    chunk_size=1000,    chunk_overlap=200,    length_function=len,    separators=["\n\n", "\n", ". ", " ", ""]  # Try in order)chunks = splitter.split_documents(documents)
```
```
from langchain_text_splitters import TokenTextSplittersplitter = TokenTextSplitter(    chunk_size=512,    chunk_overlap=50,    encoding_name="cl100k_base"  # OpenAI tiktoken encoding)
```
```
from langchain_text_splitters import TokenTextSplittersplitter = TokenTextSplitter(    chunk_size=512,    chunk_overlap=50,    encoding_name="cl100k_base"  # OpenAI tiktoken encoding)
```
```
from langchain_experimental.text_splitter import SemanticChunkersplitter = SemanticChunker(    embeddings=embeddings,    breakpoint_threshold_type="percentile",    breakpoint_threshold_amount=95)
```
```
from langchain_experimental.text_splitter import SemanticChunkersplitter = SemanticChunker(    embeddings=embeddings,    breakpoint_threshold_type="percentile",    breakpoint_threshold_amount=95)
```
```
from langchain_text_splitters import MarkdownHeaderTextSplitterheaders_to_split_on = [    ("#", "Header 1"),    ("##", "Header 2"),    ("###", "Header 3"),]splitter = MarkdownHeaderTextSplitter(    headers_to_split_on=headers_to_split_on,    strip_headers=False)
```
```
from langchain_text_splitters import MarkdownHeaderTextSplitterheaders_to_split_on = [    ("#", "Header 1"),    ("##", "Header 2"),    ("###", "Header 3"),]splitter = MarkdownHeaderTextSplitter(    headers_to_split_on=headers_to_split_on,    strip_headers=False)
```
```
from pinecone import Pinecone, ServerlessSpecfrom langchain_pinecone import PineconeVectorStore# Initialize Pinecone clientpc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])# Create index if neededif "my-index" not in pc.list_indexes().names():    pc.create_index(        name="my-index",        dimension=1024,  # voyage-3-large dimensions        metric="cosine",        spec=ServerlessSpec(cloud="aws", region="us-east-1")    )# Create vector storeindex = pc.Index("my-index")vectorstore = PineconeVectorStore(index=index, embedding=embeddings)
```
```
from pinecone import Pinecone, ServerlessSpecfrom langchain_pinecone import PineconeVectorStore# Initialize Pinecone clientpc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])# Create index if neededif "my-index" not in pc.list_indexes().names():    pc.create_index(        name="my-index",        dimension=1024,  # voyage-3-large dimensions        metric="cosine",        spec=ServerlessSpec(cloud="aws", region="us-east-1")    )# Create vector storeindex = pc.Index("my-index")vectorstore = PineconeVectorStore(index=index, embedding=embeddings)
```
```
import weaviatefrom langchain_weaviate import WeaviateVectorStoreclient = weaviate.connect_to_local()  # or connect_to_weaviate_cloud()vectorstore = WeaviateVectorStore(    client=client,    index_name="Documents",    text_key="content",    embedding=embeddings)
```
```
import weaviatefrom langchain_weaviate import WeaviateVectorStoreclient = weaviate.connect_to_local()  # or connect_to_weaviate_cloud()vectorstore = WeaviateVectorStore(    client=client,    index_name="Documents",    text_key="content",    embedding=embeddings)
```
```
from langchain_chroma import Chromavectorstore = Chroma(    collection_name="my_collection",    embedding_function=embeddings,    persist_directory="./chroma_db")
```
```
from langchain_chroma import Chromavectorstore = Chroma(    collection_name="my_collection",    embedding_function=embeddings,    persist_directory="./chroma_db")
```
```
from langchain_postgres.vectorstores import PGVectorconnection_string = "postgresql+psycopg://user:pass@localhost:5432/vectordb"vectorstore = PGVector(    embeddings=embeddings,    collection_name="documents",    connection=connection_string,)
```
```
from langchain_postgres.vectorstores import PGVectorconnection_string = "postgresql+psycopg://user:pass@localhost:5432/vectordb"vectorstore = PGVector(    embeddings=embeddings,    collection_name="documents",    connection=connection_string,)
```
```
from langchain_core.documents import Document# Add metadata during indexingdocs_with_metadata = []for doc in documents:    doc.metadata.update({        "source": doc.metadata.get("source", "unknown"),        "category": determine_category(doc.page_content),        "date": datetime.now().isoformat()    })    docs_with_metadata.append(doc)# Filter during retrievalresults = await vectorstore.asimilarity_search(    "query",    filter={"category": "technical"},    k=5)
```
```
from langchain_core.documents import Document# Add metadata during indexingdocs_with_metadata = []for doc in documents:    doc.metadata.update({        "source": doc.metadata.get("source", "unknown"),        "category": determine_category(doc.page_content),        "date": datetime.now().isoformat()    })    docs_with_metadata.append(doc)# Filter during retrievalresults = await vectorstore.asimilarity_search(    "query",    filter={"category": "technical"},    k=5)
```
```
# Balance relevance with diversityresults = await vectorstore.amax_marginal_relevance_search(    "query",    k=5,    fetch_k=20,  # Fetch 20, return top 5 diverse    lambda_mult=0.5  # 0=max diversity, 1=max relevance)
```
```
# Balance relevance with diversityresults = await vectorstore.amax_marginal_relevance_search(    "query",    k=5,    fetch_k=20,  # Fetch 20, return top 5 diverse    lambda_mult=0.5  # 0=max diversity, 1=max relevance)
```
```
from sentence_transformers import CrossEncoderreranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')async def retrieve_and_rerank(query: str, k: int = 5) -> list[Document]:    # Get initial results    candidates = await vectorstore.asimilarity_search(query, k=20)    # Rerank    pairs = [[query, doc.page_content] for doc in candidates]    scores = reranker.predict(pairs)    # Sort by score and take top k    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)    return [doc for doc, score in ranked[:k]]
```
```
from sentence_transformers import CrossEncoderreranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')async def retrieve_and_rerank(query: str, k: int = 5) -> list[Document]:    # Get initial results    candidates = await vectorstore.asimilarity_search(query, k=20)    # Rerank    pairs = [[query, doc.page_content] for doc in candidates]    scores = reranker.predict(pairs)    # Sort by score and take top k    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)    return [doc for doc, score in ranked[:k]]
```
```
from langchain.retrievers import CohereRerankfrom langchain_cohere import CohereRerankreranker = CohereRerank(model="rerank-english-v3.0", top_n=5)# Wrap retriever with rerankingreranked_retriever = ContextualCompressionRetriever(    base_compressor=reranker,    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 20}))
```
```
from langchain.retrievers import CohereRerankfrom langchain_cohere import CohereRerankreranker = CohereRerank(model="rerank-english-v3.0", top_n=5)# Wrap retriever with rerankingreranked_retriever = ContextualCompressionRetriever(    base_compressor=reranker,    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 20}))
```
```
rag_prompt = ChatPromptTemplate.from_template(    """Answer the question based on the context below. Include citations using [1], [2], etc.    If you cannot answer based on the context, say "I don't have enough information."    Context:    {context}    Question: {question}    Instructions:    1. Use only information from the context    2. Cite sources with [1], [2] format    3. If uncertain, express uncertainty    Answer (with citations):""")
```
```
rag_prompt = ChatPromptTemplate.from_template(    """Answer the question based on the context below. Include citations using [1], [2], etc.    If you cannot answer based on the context, say "I don't have enough information."    Context:    {context}    Question: {question}    Instructions:    1. Use only information from the context    2. Cite sources with [1], [2] format    3. If uncertain, express uncertainty    Answer (with citations):""")
```
```
from pydantic import BaseModel, Fieldclass RAGResponse(BaseModel):    answer: str = Field(description="The answer based on context")    confidence: float = Field(description="Confidence score 0-1")    sources: list[str] = Field(description="Source document IDs used")    reasoning: str = Field(description="Brief reasoning for the answer")# Use with structured outputstructured_llm = llm.with_structured_output(RAGResponse)
```
```
from pydantic import BaseModel, Fieldclass RAGResponse(BaseModel):    answer: str = Field(description="The answer based on context")    confidence: float = Field(description="Confidence score 0-1")    sources: list[str] = Field(description="Source document IDs used")    reasoning: str = Field(description="Brief reasoning for the answer")# Use with structured outputstructured_llm = llm.with_structured_output(RAGResponse)
```
```
from typing import TypedDictclass RAGEvalMetrics(TypedDict):    retrieval_precision: float  # Relevant docs / retrieved docs    retrieval_recall: float     # Retrieved relevant / total relevant    answer_relevance: float     # Answer addresses question    faithfulness: float         # Answer grounded in context    context_relevance: float    # Context relevant to questionasync def evaluate_rag_system(    rag_chain,    test_cases: list[dict]) -> RAGEvalMetrics:    """Evaluate RAG system on test cases."""    metrics = {k: [] for k in RAGEvalMetrics.__annotations__}    for test in test_cases:        result = await rag_chain.ainvoke({"question": test["question"]})        # Retrieval metrics        retrieved_ids = {doc.metadata["id"] for doc in result["context"]}        relevant_ids = set(test["relevant_doc_ids"])        precision = len(retrieved_ids & relevant_ids) / len(retrieved_ids)        recall = len(retrieved_ids & relevant_ids) / len(relevant_ids)        metrics["retrieval_precision"].append(precision)        metrics["retrieval_recall"].append(recall)        # Use LLM-as-judge for quality metrics        quality = await evaluate_answer_quality(            question=test["question"],            answer=result["answer"],            context=result["context"],            expected=test.get("expected_answer")        )        metrics["answer_relevance"].append(quality["relevance"])        metrics["faithfulness"].append(quality["faithfulness"])        metrics["context_relevance"].append(quality["context_relevance"])    return {k: sum(v) / len(v) for k, v in metrics.items()}
```
```
from typing import TypedDictclass RAGEvalMetrics(TypedDict):    retrieval_precision: float  # Relevant docs / retrieved docs    retrieval_recall: float     # Retrieved relevant / total relevant    answer_relevance: float     # Answer addresses question    faithfulness: float         # Answer grounded in context    context_relevance: float    # Context relevant to questionasync def evaluate_rag_system(    rag_chain,    test_cases: list[dict]) -> RAGEvalMetrics:    """Evaluate RAG system on test cases."""    metrics = {k: [] for k in RAGEvalMetrics.__annotations__}    for test in test_cases:        result = await rag_chain.ainvoke({"question": test["question"]})        # Retrieval metrics        retrieved_ids = {doc.metadata["id"] for doc in result["context"]}        relevant_ids = set(test["relevant_doc_ids"])        precision = len(retrieved_ids & relevant_ids) / len(retrieved_ids)        recall = len(retrieved_ids & relevant_ids) / len(relevant_ids)        metrics["retrieval_precision"].append(precision)        metrics["retrieval_recall"].append(recall)        # Use LLM-as-judge for quality metrics        quality = await evaluate_answer_quality(            question=test["question"],            answer=result["answer"],            context=result["context"],            expected=test.get("expected_answer")        )        metrics["answer_relevance"].append(quality["relevance"])        metrics["faithfulness"].append(quality["faithfulness"])        metrics["context_relevance"].append(quality["context_relevance"])    return {k: sum(v) / len(v) for k, v in metrics.items()}
```
Unlock the true potential of large language models by integrating external knowledge with the RAG Implementation Agent Skill. This essential capability empowers your AI applications to move beyond their training data, providing accurate, up-to-date, and verifiable responses. By leveraging vector databases and sophisticated semantic search, you can build systems that reduce hallucinations, ground answers in specific information sources, and deliver precise insights across various domains. Elevate your coding assistant's ability to create intelligent, knowledge-aware solutions for complex data challenges, transforming how you build enterprise-grade AI.

# When to Use This Skill
- •Building Q&A systems over proprietary documents
- •Creating chatbots with current, factual information
- •Implementing semantic search with natural language queries
- •Reducing hallucinations with grounded responses

# Pro Tips
- 💡Strategically choose your vector database based on project scale and required features; Pinecone for managed scalability or Chroma for lightweight local development.
- 💡Experiment with different embedding models, such as `voyage-3-large`, to find the optimal balance between performance and accuracy for your specific domain and data.
- 💡Develop robust document chunking strategies to optimize retrieval relevance, ensuring contextually rich snippets are passed to the LLM.

