from fastapi import FastAPI, UploadFile
#from . import models
# from .database import engine
from .routers import knowledge_base, evaluation, mono
#models.Base.metadata.create_all(bind=engine)

from dotenv import load_dotenv
load_dotenv()
app = FastAPI()



app.include_router(mono.router)
app.include_router(knowledge_base.router)
app.include_router(evaluation.router)
#app.include_router(user.router)




