import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_pdf_report(assessment_data: dict) -> bytes:
    """
    Generates a professional clinical decision support / research summary PDF report.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    header_title_style = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0B132B'),
        fontName='Helvetica-Bold'
    )
    
    subhead_style = ParagraphStyle(
        'Subhead',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#4A5568')
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1C2541'),
        fontName='Helvetica-Bold',
        spaceBefore=10,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#2D3748')
    )
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#C53030'),
        fontName='Helvetica-Oblique'
    )

    story = []

    # Title & Header
    story.append(Paragraph("NeuroTriage AI — Research Summary Report", header_title_style))
    story.append(Paragraph("Explainable Multimodal Risk Stratification & Clinical Decision Support Prototype", subhead_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#3A86FF'), spaceAfter=12))

    # Patient & Meta Table
    patient_id = assessment_data.get("patient_id", "N/A")
    date_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    stage = assessment_data.get("trajectory_stage", "Unknown")
    confidence = assessment_data.get("confidence", 0.0)
    risk_level = assessment_data.get("risk_level", "Unknown")
    uncertainty = assessment_data.get("uncertainty_score", 0.0)

    meta_table_data = [
        [
            Paragraph("<b>Patient Identifier:</b> " + str(patient_id), body_style),
            Paragraph("<b>Report Date:</b> " + date_str, body_style)
        ],
        [
            Paragraph("<b>Trajectory Stage:</b> <font color='#3A86FF'><b>" + stage + "</b></font>", body_style),
            Paragraph(f"<b>Model Confidence:</b> {int(confidence * 100)}% (Uncertainty: {int(uncertainty * 100)}%)", body_style)
        ],
        [
            Paragraph("<b>Assigned Risk Level:</b> " + risk_level, body_style),
            Paragraph("<b>Prototype Version:</b> v1.0.0 (Research Demo)", body_style)
        ]
    ]

    meta_table = Table(meta_table_data, colWidths=[260, 260])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F7FAFC')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#EDF2F7')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # Modality Availability & Dynamic Weights
    story.append(Paragraph("1. Multimodal Availability & Dynamic Modality Weighting", section_heading))
    modalities = assessment_data.get("modalities", {})
    weights = assessment_data.get("dynamic_weights", {})
    
    modality_table_data = [
        ["Modality", "Availability Status", "Dynamic Fusion Weight (alpha)", "Modality Role"],
        [
            "Clinical & Cognitive Tabular",
            "AVAILABLE" if modalities.get("clinical", True) else "MISSING",
            f"{int(weights.get('clinical', 1.0) * 100)}%",
            "Core baseline cognitive & functional composite"
        ],
        [
            "Structural 3D MRI",
            "AVAILABLE" if modalities.get("mri", False) else "UNAVAILABLE (Missing)",
            f"{int(weights.get('mri', 0.0) * 100)}%",
            "Hippocampal / Ventricular volumetric extraction"
        ],
        [
            "Metabolic FDG/Amyloid PET",
            "AVAILABLE" if modalities.get("pet", False) else "UNAVAILABLE (Missing)",
            f"{int(weights.get('pet', 0.0) * 100)}%",
            "Cortical parietotemporal hypometabolism"
        ],
    ]
    mod_table = Table(modality_table_data, colWidths=[140, 110, 110, 160])
    mod_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1C2541')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(mod_table)
    story.append(Spacer(1, 10))

    # Grouped Explainable AI (Owen-Value Style)
    story.append(Paragraph("2. Grouped Explainable AI (Owen-Value Style Attribution)", section_heading))
    explanations = assessment_data.get("explanations", {})
    
    xai_table_data = [
        ["Feature Group", "Relative Attribution (%)", "Key Grounded Biomarkers / Features Included"],
        ["Cognitive Function", f"{explanations.get('cognitive_contrib', 0.0)}%", "MMSE, CDR-SB, ADAS-Cog13, Memory & Executive z-scores"],
        ["Neuroimaging Markers", f"{explanations.get('imaging_contrib', 0.0)}%", "Medial Temporal / Hippocampal & Ventricular ROIs"],
        ["Demographics", f"{explanations.get('demographic_contrib', 0.0)}%", "Age (years), Formal Education Cognitive Reserve"],
        ["Genetic Risk", f"{explanations.get('genetic_contrib', 0.0)}%", "APOE-ε4 Allele Count (0, 1, or 2)"],
        ["Functional Activities", f"{explanations.get('functional_contrib', 0.0)}%", "FAQ (Functional Activities Questionnaire) Score"],
    ]
    xai_table = Table(xai_table_data, colWidths=[130, 110, 280])
    xai_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2B6CB0')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(xai_table)
    story.append(Spacer(1, 10))

    # AI Triage & Recommendation
    story.append(Paragraph("3. AI Triage & Decision-Support Recommendation", section_heading))
    triage = assessment_data.get("triage", {})
    triage_title = triage.get("title", "Clinical Review")
    recommendation = triage.get("recommendation", "")
    rationale = triage.get("rationale", "")

    triage_text = f"<b>Recommendation:</b> {triage_title}<br/>{recommendation}<br/><br/><b>Rationale:</b> {rationale}"
    story.append(Paragraph(triage_text, body_style))
    story.append(Spacer(1, 12))

    # Academic Disclaimer Footer
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#E53E3E'), spaceAfter=8))
    disclaimer_text = (
        "<b>ACADEMIC RESEARCH PROTOTYPE DISCLAIMER:</b> This report is generated by NeuroTriage AI, an experimental "
        "decision-support research prototype. It is NOT a medical device and is NOT intended for primary clinical diagnosis, "
        "treatment planning, or medication prescription. Model predictions and explainability attributions reflect statistical "
        "associations on simulated/research cohorts and must always be interpreted by a certified medical specialist."
    )
    story.append(Paragraph(disclaimer_text, disclaimer_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
