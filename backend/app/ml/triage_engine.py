from typing import Dict, Any, List

class AITriageEngine:
    """
    Transparent AI Triage Layer.
    Combines ensemble trajectory predictions, confidence metrics, and modality presence
    to produce non-prescriptive, uncertainty-grounded research triage recommendations.
    """

    def evaluate(
        self,
        trajectory_stage: str,
        confidence: float,
        uncertainty_score: float,
        modalities: Dict[str, bool],
        features: Dict[str, Any]
    ) -> Dict[str, Any]:
        has_imaging = modalities.get("mri", False) or modalities.get("pet", False)
        
        # Rule 1: Missing imaging with borderline or MCI stage -> Recommend selective imaging
        if not has_imaging and trajectory_stage in ["Early MCI", "Late MCI"]:
            status = "RECOMMEND_IMAGING_CONFIRMATION"
            title = "Consider Targeted Neuroimaging for Uncertainty Reduction"
            recommendation = "Research prototype suggests that secondary structural MRI or FDG-PET could be considered to confirm hippocampal atrophy and reduce model uncertainty."
            rationale = (
                f"The current assessment relies solely on clinical/cognitive parameters with an estimated uncertainty of {int(uncertainty_score * 100)}%. "
                "In borderline MCI trajectories, neuroimaging biomarkers (such as medial temporal lobe volumetry) significantly improve trajectory separation."
            )
            suggested_actions = [
                "Consider high-resolution 3D T1-weighted structural MRI to assess medial temporal lobe volume",
                "Perform repeat cognitive testing (e.g. MoCA / ADAS-Cog) at 6-month research follow-up",
                "Correlate cognitive deficit with patient's baseline educational reserve"
            ]

        # Rule 2: Normal Aging with high confidence
        elif trajectory_stage == "Normal Aging" and confidence >= 0.75:
            status = "HIGH_CONFIDENCE_STANDARD"
            title = "Standard Age-Appropriate Clinical Protocol"
            recommendation = "Low estimated risk of active neurodegenerative progression. Routine longitudinal monitoring recommended."
            rationale = (
                f"Model displays {int(confidence * 100)}% confidence in Normal Aging trajectory with stable cognitive composites (MMSE: {features.get('mmse')}, CDR-SB: {features.get('cdrsb')})."
            )
            suggested_actions = [
                "Maintain standard annual cognitive check-ups",
                "Encourage lifestyle factors: cardiovascular health and cognitive engagement",
                "Re-evaluate if subjective cognitive complaints emerge"
            ]

        # Rule 3: Late MCI or AD with high confidence / imaging confirmed
        elif trajectory_stage in ["Late MCI", "Alzheimer's Disease"]:
            status = "URGENT_MULTIDISCIPLINARY_REVIEW"
            title = "Recommend Comprehensive Multidisciplinary Evaluation"
            recommendation = "High risk profile detected along the Alzheimer's disease continuum. Comprehensive clinical review advised."
            rationale = (
                f"Multi-domain impairments across memory, CDR-SB ({features.get('cdrsb')}), and functional activity index ({features.get('faq_score')}) "
                f"indicate progression aligned with {trajectory_stage} (Model confidence: {int(confidence * 100)}%)."
            )
            suggested_actions = [
                "Schedule formal multidisciplinary memory clinic evaluation",
                "Review safety, functional independence, and family/caregiver support systems",
                "Evaluate for reversible confounding factors (B12, thyroid function, sleep apnea, depression)"
            ]

        # Rule 4: General Low Confidence Fallback
        else:
            status = "UNCERTAIN_TRAJECTORY_OBSERVATION"
            title = "Moderate Uncertainty - Closer Longitudinal Monitoring"
            recommendation = "Patient exhibits mixed cognitive markers. Additional longitudinal data recommended."
            rationale = (
                f"Model confidence is moderate ({int(confidence * 100)}%) with {int(uncertainty_score * 100)}% residual uncertainty. "
                "Discordant clinical scores warrant observation."
            )
            suggested_actions = [
                "Repeat comprehensive neuropsychological battery in 3 to 6 months",
                "Investigate potential transient cognitive stress or medication interactions",
                "Consider baseline neuroimaging if not previously acquired"
            ]

        return {
            "status": status,
            "title": title,
            "recommendation": recommendation,
            "rationale": rationale,
            "suggested_actions": suggested_actions
        }

triage_engine = AITriageEngine()
