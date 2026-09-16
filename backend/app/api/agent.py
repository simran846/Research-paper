from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Assessment
from app.schemas.assessment import ChatMessageRequest, ChatMessageResponse
from app.services.agent_service import assistant_service
from app.api.assessments import _format_assessment_response

router = APIRouter(prefix="/agent", tags=["AI Research Assistant"])

@router.post("/chat", response_model=ChatMessageResponse)
@router.post("/", response_model=ChatMessageResponse)
def chat_with_assistant(req: ChatMessageRequest, db: Session = Depends(get_db)):
    assessment_context = None
    if req.assessment_id:
        assessment = db.query(Assessment).filter(Assessment.id == req.assessment_id).first()
        if assessment:
            assessment_context = _format_assessment_response(assessment)

    res = assistant_service.generate_response(
        message=req.message,
        assessment_context=assessment_context,
        history=req.conversation_history
    )

    return {
        "reply": res["reply"],
        "suggested_followups": res["suggested_followups"],
        "context_used": res["context_used"]
    }
