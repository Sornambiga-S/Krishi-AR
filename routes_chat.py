from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.agronomist_ai import agronomist_ai

router = APIRouter(prefix="/api/ask-doctor", tags=["AI Agronomist Q&A"])

@router.post("", response_model=ChatResponse, summary="Agronomic Q&A with TNAU Knowledge Base")
def ask_agronomist(req: ChatRequest):
    answer = agronomist_ai.answer_question(req.question, req.contextCrop)
    return ChatResponse(answer=answer)
