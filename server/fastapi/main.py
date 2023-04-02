"""Main entrypoint for the app."""
import pickle
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    global retriever
    with open("fortigate-vector.pkl", "rb") as f:
        vectorstore = pickle.load(f)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 8})


@app.post("/chat")
async def chat_endpoint(request: Request):
    body = await request.json()
    query = body.get("query")
    docs = retriever.get_relevant_documents(query)
    docs_string = ""
    for doc in docs:
        docs_string += doc.page_content
        docs_string += "\n" + query
    chat = ChatOpenAI(temperature=0.8)
    messages = [
        [
            SystemMessage(
                content="""As a senior Fortinet FortiGate firewall engineer, you are approached by a student who has a question related to the firewall administration guide. 
                They have provided you with the relevant documents from the guide and their question. 
                Your task is to provide an accurate answer to the question using only the information provided in the documents. 
                It is important that you do not invent commands or information beyond what is contained in the documents. 
                If you are asked for cli commands you are to provide them in a nice format, and only what pertains to the request. Do not provide commands that are not relevant to the request.
                Also if the student asks for CLI commands and the command requires "edit number" you will use "edit 0" as the command, unless otherwise specified. This is to avoid editing the wrong configuration object,
                using "edit 0" will add to the configuration object that is currently being edited.
                For example:
                ```
                cli command1
                cli command2
                cli command3
                ```
                """
            ),
            HumanMessage(content=docs_string),
        ]
    ]
    data = chat.generate(messages)
    return {"response": data}
