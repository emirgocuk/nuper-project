# chunking-strategy
Source: https://antigravity.codes/agent-skills/ai-tools/chunking-strategy

## AI Worker Instructions
When the user requests functionality related to chunking-strategy, follow these guidelines and utilize this context.

## Scraped Content

# chunking-strategy
```
from langchain.text_splitter import RecursiveCharacterTextSplitter# Configure for factoid queriessplitter = RecursiveCharacterTextSplitter(    chunk_size=256,    chunk_overlap=25,    length_function=len)chunks = splitter.split_documents(documents)
```
```
from langchain.text_splitter import RecursiveCharacterTextSplitter# Configure for factoid queriessplitter = RecursiveCharacterTextSplitter(    chunk_size=256,    chunk_overlap=25,    length_function=len)chunks = splitter.split_documents(documents)
```
```
def chunk_python_code(code):    """Split Python code into semantic chunks"""    import ast    tree = ast.parse(code)    chunks = []    for node in ast.walk(tree):        if isinstance(node, (ast.FunctionDef, ast.ClassDef)):            chunks.append(ast.get_source_segment(code, node))    return chunks
```
```
def chunk_python_code(code):    """Split Python code into semantic chunks"""    import ast    tree = ast.parse(code)    chunks = []    for node in ast.walk(tree):        if isinstance(node, (ast.FunctionDef, ast.ClassDef)):            chunks.append(ast.get_source_segment(code, node))    return chunks
```
```
def semantic_chunk(text, similarity_threshold=0.8):    """Chunk text based on semantic boundaries"""    sentences = split_into_sentences(text)    embeddings = generate_embeddings(sentences)    chunks = []    current_chunk = [sentences[0]]    for i in range(1, len(sentences)):        similarity = cosine_similarity(embeddings[i-1], embeddings[i])        if similarity < similarity_threshold:            chunks.append(" ".join(current_chunk))            current_chunk = [sentences[i]]        else:            current_chunk.append(sentences[i])    chunks.append(" ".join(current_chunk))    return chunks
```
```
def semantic_chunk(text, similarity_threshold=0.8):    """Chunk text based on semantic boundaries"""    sentences = split_into_sentences(text)    embeddings = generate_embeddings(sentences)    chunks = []    current_chunk = [sentences[0]]    for i in range(1, len(sentences)):        similarity = cosine_similarity(embeddings[i-1], embeddings[i])        if similarity < similarity_threshold:            chunks.append(" ".join(current_chunk))            current_chunk = [sentences[i]]        else:            current_chunk.append(sentences[i])    chunks.append(" ".join(current_chunk))    return chunks
```
Efficiently processing and retrieving information from vast datasets is crucial for modern AI applications. This skill empowers developers to architect robust Retrieval-Augmented Generation (RAG) systems by mastering the art of document chunking. Instead of feeding entire documents, learn to segment content into contextually rich, manageable units. This precision not only enhances the accuracy and relevance of AI responses but also significantly boosts the performance of vector searches and embedding generation, transforming raw data into actionable intelligence for your AI agents.

# When to Use This Skill
- •Building new Retrieval-Augmented Generation (RAG) systems from scratch.
- •Optimizing vector search performance and reducing latency in existing AI applications.
- •Implementing robust document processing pipelines for diverse data types like PDFs, HTML, or Markdown.
- •Improving the quality and relevance of responses from large language models by providing better context.

# Pro Tips
- 💡Always test different chunk sizes and overlaps on a representative dataset to find the optimal balance between context preservation and retrieval efficiency for your specific use case.
- 💡Consider the downstream task: for factoid Q&A, smaller chunks might be better, while for summarization or analytical queries, larger, more contextual chunks are often preferred.
- 💡Combine structural chunking with metadata enrichment to provide more robust retrieval cues, allowing your RAG system to not just find relevant text but also understand its context within the original document.

