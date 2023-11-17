from llama_index.node_parser import SimpleNodeParser
from llama_index.text_splitter import SentenceSplitter
from transformers import AutoTokenizer
class NodeParser:
    def sentence_splitter(self):
        tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-large-en-v1.5")
        text_splitter = SentenceSplitter(
        separator=" ",
        chunk_size=1024,
        chunk_overlap=20,
        paragraph_separator="\n\n\n",
        secondary_chunking_regex="[^,.;。]+[,.;。]?",
        tokenizer=tokenizer
        )
        node_parser = SimpleNodeParser.from_defaults(chunk_size=519, chunk_overlap=10,text_splitter=text_splitter)
        return node_parser