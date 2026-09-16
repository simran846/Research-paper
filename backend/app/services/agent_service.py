from typing import Dict, Any, List, Optional

class NeuroTriageResearchAssistant:
    """
    NeuroTriage AI Research Assistant.
    
    Provides interactive, context-aware explainability and decision-support reasoning
    strictly aligned with academic/clinical research boundaries.
    """

    SYSTEM_PROMPT = """
You are the NeuroTriage AI Research Assistant, an intelligent decision-support conversational agent.
Your purpose is to explain multimodal AI predictions, Grouped XAI attributions, Dynamic Modality Weighting behaviors,
and triage recommendations to clinical researchers and physicians.

CRITICAL GUARDRAILS:
1. NEVER provide a definitive medical diagnosis. Always frame outputs as "model predicted trajectory stages" or "research risk stratification".
2. NEVER prescribe drugs, dosages, or therapeutic clinical interventions.
3. Clearly explain missing modality adaptations (e.g. when MRI/PET are unavailable).
4. Explain Grouped XAI attributions (Cognitive, Demographics, Genetic, Functional, Imaging) transparently.
5. Reference model confidence and calibrated uncertainty accurately.
"""

    def generate_response(
        self,
        message: str,
        assessment_context: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        msg_lower = message.lower().strip()
        
        stage = assessment_context.get("trajectory_stage", "Early MCI") if assessment_context else "Early MCI"
        confidence = assessment_context.get("confidence", 0.84) if assessment_context else 0.84
        uncertainty = assessment_context.get("uncertainty_score", 0.16) if assessment_context else 0.16
        modalities = assessment_context.get("modalities", {"clinical": True, "mri": False, "pet": False}) if assessment_context else {"clinical": True, "mri": False, "pet": False}
        weights = assessment_context.get("dynamic_weights", {"clinical": 1.0, "mri": 0.0, "pet": 0.0}) if assessment_context else {"clinical": 1.0, "mri": 0.0, "pet": 0.0}
        explanations = assessment_context.get("explanations", {}) if assessment_context else {}
        triage = assessment_context.get("triage", {}) if assessment_context else {}

        # 1. Question: Why did the model classify this patient as [Stage]?
        if any(w in msg_lower for w in ["why", "reason", "classify", "stage", "prediction", "diagnose"]):
            reply = (
                f"The ensemble stratified this patient into the **{stage}** trajectory stage with **{int(confidence * 100)}% confidence** "
                f"(estimated uncertainty: {int(uncertainty * 100)}%).\n\n"
                f"**Key Grouped Attribution Breakdown (Owen-Value Style):**\n"
                f"• **Cognitive Function ({explanations.get('cognitive_contrib', 42)}%):** "
                f"Driven by prominent variations in CDR-SB and MMSE compared to age-matched healthy baselines.\n"
                f"• **Demographics ({explanations.get('demographic_contrib', 15)}%):** "
                f"Patient age and educational reserve factors.\n"
                f"• **Genetic Risk ({explanations.get('genetic_contrib', 12)}%):** "
                f"APOE-ε4 allele carriage status.\n"
                f"• **Functional Assessment ({explanations.get('functional_contrib', 8)}%):** "
                f"Everyday functional impact captured via FAQ score.\n"
            )
            if modalities.get("mri") or modalities.get("pet"):
                reply += f"• **Neuroimaging Biomarkers ({explanations.get('imaging_contrib', 23)}%):** Hippocampal and cortical attention features contributed to refining this boundary.\n"
            else:
                reply += "\n*Note: Neuroimaging (MRI/PET) was unavailable for this patient, so the dynamic weighting engine adapted 100% of the focus to the verified tabular clinical branch.*"

            suggested = [
                "What happens if PET or MRI is missing?",
                "Why might additional imaging be suggested by the triage engine?",
                "How does Grouped XAI handle correlated cognitive features?"
            ]

        # 2. Question: Missing modalities / PET / MRI unavailable
        elif any(w in msg_lower for w in ["missing", "pet", "mri", "unavailable", "dynamic weight", "modality"]):
            reply = (
                "When expensive or specialized modalities like structural MRI or FDG-PET are unavailable, "
                "the **Dynamic Modality Weighting Engine** immediately intervenes:\n\n"
                "1. **Detection:** It senses the presence vector `[Clinical=1, MRI=0, PET=0]`.\n"
                "2. **Dynamic Redistribution:** Instead of using naive zero-imputation or synthetic hallucinations, "
                f"it recalculates fusion weights so that **Clinical Tabular receives {int(weights.get('clinical', 1.0) * 100)}%** weight.\n"
                "3. **Uncertainty Calibration:** It adds an epistemic uncertainty penalty (typically +12% to +18%) to reflect "
                "that structural hippocampal confirmation is absent.\n"
                "4. **Triage Linkage:** If the patient sits near a critical boundary (such as Early MCI), the triage layer "
                "can transparently recommend selective imaging to reduce this uncertainty."
            )
            suggested = [
                "Why does the system avoid zero-imputation?",
                "What is the triage recommendation for this patient?",
                "Show baseline model comparisons"
            ]

        # 3. Question: Triage suggestion / why suggest imaging
        elif any(w in msg_lower for w in ["triage", "suggest", "recommend", "imaging suggested", "action"]):
            triage_title = triage.get("title", "Consider Targeted Neuroimaging")
            triage_rec = triage.get("recommendation", "Consider structural MRI to confirm medial temporal lobe status.")
            reply = (
                f"**Current Triage Decision-Support Recommendation:**\n"
                f"*{triage_title}*\n\n"
                f"{triage_rec}\n\n"
                f"**Research Rationale:**\n"
                f"{triage.get('rationale', 'The assessment currently relies on clinical indicators with moderate uncertainty.')}\n\n"
                "**Important:** This is an uncertainty-minimization recommendation for research/decision-support, "
                "not a prescriptive medical order."
            )
            suggested = [
                "Explain the Grouped XAI methodology",
                "What are the 4 trajectory stages?",
                "How can I integrate ADNI data?"
            ]

        # 4. Question: Grouped XAI vs SHAP / Correlated variables
        elif any(w in msg_lower for w in ["shap", "grouped", "owen", "collinear", "correlated", "xai", "explain"]):
            reply = (
                "**Why Grouped XAI instead of raw SHAP?**\n\n"
                "Standard SHAP calculations suffer when clinical metrics are highly collinear (e.g. MMSE, CDR-SB, ADAS-Cog13 all measuring cognitive decline). "
                "Distributing attribution across 50 correlated tabular variables introduces mathematical instability and noise.\n\n"
                "Our **Owen-value-inspired Grouped XAI** aggregates variables into 5 clinically grounded domains:\n"
                "1. **Cognitive Function:** Combined cognitive composites\n"
                "2. **Demographics:** Age & education reserve\n"
                "3. **Genetics:** APOE-ε4 carrier burden\n"
                "4. **Functional Impairment:** Activities of Daily Living (FAQ)\n"
                "5. **Neuroimaging:** Medial temporal & ventricular ROIs\n\n"
                "This guarantees that attributions are robust, interpretable, and aligned with standard neurological practice."
            )
            suggested = [
                "Why did the model classify this patient as Early MCI?",
                "What happens if PET is unavailable?",
                "How does the dynamic weighting engine work?"
            ]

        # 5. Default General Clinical Research response
        else:
            reply = (
                f"I am analyzing the assessment for patient **{assessment_context.get('patient_id', 'PT-Demo') if assessment_context else 'Active Patient'}**.\n\n"
                f"• **Current Trajectory:** {stage}\n"
                f"• **Ensemble Confidence:** {int(confidence * 100)}% (Uncertainty: {int(uncertainty * 100)}%)\n"
                f"• **Active Modalities:** Clinical ({'Yes' if modalities.get('clinical') else 'No'}), "
                f"MRI ({'Yes' if modalities.get('mri') else 'No'}), PET ({'Yes' if modalities.get('pet') else 'No'})\n\n"
                "You can ask me about feature group attributions, missing modality dynamic weighting, or why a particular triage recommendation was generated."
            )
            suggested = [
                "Why did the model classify this patient?",
                "What happens if PET is unavailable?",
                "Why might additional imaging be suggested?"
            ]

        return {
            "reply": reply,
            "suggested_followups": suggested,
            "context_used": {
                "trajectory_stage": stage,
                "confidence": confidence,
                "modalities": modalities
            }
        }

assistant_service = NeuroTriageResearchAssistant()
