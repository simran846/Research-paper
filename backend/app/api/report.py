from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Assessment
from app.api.assessments import _format_assessment_response
from app.services.report_generator import generate_pdf_report

router = APIRouter(prefix="/report", tags=["Report Generation"])

@router.get("/{assessment_id}")
def download_research_report(assessment_id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    assessment_data = _format_assessment_response(assessment)
    pdf_bytes = generate_pdf_report(assessment_data)

    patient_id = assessment_data.get("patient_id", f"assessment_{assessment_id}")
    filename = f"NeuroTriage_Report_{patient_id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
