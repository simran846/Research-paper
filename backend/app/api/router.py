from fastapi import APIRouter
from app.api.patients import router as patients_router
from app.api.assessments import router as assessments_router
from app.api.predict import router as predict_router
from app.api.upload import router as upload_router
from app.api.analytics import router as analytics_router
from app.api.ablation import router as ablation_router
from app.api.agent import router as agent_router
from app.api.report import router as report_router

api_router = APIRouter()

api_router.include_router(patients_router)
api_router.include_router(assessments_router)
api_router.include_router(predict_router)
api_router.include_router(upload_router)
api_router.include_router(analytics_router)
api_router.include_router(ablation_router)
api_router.include_router(agent_router)
api_router.include_router(report_router)
