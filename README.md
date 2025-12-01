<div align="center">
<img width="1200" alt="Overview" src="Overview.png" />
</div>

# Problem
The goal of this project is to provide access to personalized health coaching. While modern technology offers endless lifestyle choices, it also contributes to widespread health crises, including poor nutrition, sedentary behavior, and chronic stress. While we visit doctors for acute illnesses, the majority of health outcomes are determined by daily decisions—what we eat, how we move, how we sleep, and how we manage emotion. Furthermore, generic health advice fails to account for individual medical histories and genetic backgrounds. There is a critical need for a system that bridges the gap between clinical medical records and daily lifestyle choices to prevent disease, reduce medical burdens, and improve overall quality of life.

# Solution
Personal health is a multimodal challenge involving distinct, complex domains: nutrition, physiology, sleep science, psychology, and medicine. A single general-purpose AI model often struggles to maintain deep expertise across all these verticals simultaneously. An agentic architecture is the ideal solution because it allows for separation of concerns. We can assign a specialized "Persona" and specific instructions to each domain (e.g., a Jungian analyst for sleep, a clinical thinker for medicine). These agents can operate independently to gather deep data, and then collaborate to form a holistic view of the user, mirroring a real-world board of health experts.

# Architecture
I built DailyHealth AI, a comprehensive health ecosystem powered by the Google Gemini API. The architecture utilizes a Multi-Agent System consisting of five specialists: a Dietitian, Trainer, Sleep Specialist, Counselor, and Medical Specialist. These agents operate sequentially throughout the day to ingest multimodal user data (images, text, metrics). At the end of the day, a Lead Coordinator Agent aggregates these distinct logs, retrieves long-term context (medical history), and synthesizes a "Daily Board Meeting" report. This generates a cohesive strategy for the user's next day, ensuring that advice from one domain (e.g., exercise) is safe given the context of another (e.g., medical conditions).

The project implements key concepts from the [AI Agents Intensive course](https://www.kaggle.com/competitions/agents-intensive-capstone-project/overview#agents-intensive-course-capstone-2025/):

* Multi-Agent System: Five distinct personas powered by Gemini 2.5 Flash and Pro models work in parallel to gather data, with a sequential Coordinator agent handling synthesis.
* Sessions & Memory: I implemented a robust state management system where static context (medical history) and episodic memory (daily summaries) are persisted and retrieved to ground agent responses.
* Context Engineering: To manage context window limits, daily detailed logs are "compacted" into executive summaries before being stored in long-term memory.
* Deployment: The application is live and hosted on Google Cloud Run.

# Set up

### View app in Google AI Studio
https://ai.studio/apps/drive/1cKOVrcPRArWwCj1XXFs6Tg1zYPtsh3p7

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

### Run on Google Cloud
https://dailyhealth-ai-672214102683.us-west1.run.app/

### Run Locally:

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# Instruction

### Demo in YouTube video: 

### Demo in images:

**Authentication & Privacy:** Secure login ensures sensitive health data remains private.
<div align="center">
<img width="250" alt="Login" src="Login.png" />
</div>

**Onboarding:** The system establishes a baseline by capturing demographics and goals, which initiates the long-term memory context.
<div align="center">
<img width="250" alt="Background1" src="Background1.png" />
<img width="250" alt="Background2" src="Background2.png" />
<img width="250" alt="Background3" src="Background3.png" />
</div>

**Dietitian Agent:** Utilizing Gemini’s vision capabilities, this agent analyzes food photos to extract calories and macros, updating the user’s nutritional profile instantly.
<div align="center">
<img width="250" alt="Dietitian" src="Dietitian.png" />
</div>

**Trainer Agent:** This agent designs bespoke workouts based on real-time variables (energy levels, time constraints) and cross-references them with medical safety protocols.
<div align="center">
<img width="250" alt="Trainer" src="Trainer.png" />
</div>

**Sleep Specialist:** Beyond tracking duration, this agent performs qualitative analysis, including Jungian dream interpretation.
<div align="center">
<img width="250" alt="Sleep" src="Sleep.png" />
</div>

**Counselor Agent:** A dedicated mental health support interface that tracks emotional valence and provides empathetic dialogue.
<div align="center">
<img width="250" alt="Counselor" src="Counselor.png" />
</div>

**Medical Specialist:** This agent ingests complex medical documents (like test results) to update the user's risk profile and answers clinical questions.
<div align="center">
<img width="250" alt="Medical" src="Medical.png" />
</div>

**The Consensus Meeting:** The core feature where the Coordinator Agent leads a synthesis of all data streams, producing a strategic executive summary.
<div align="center">
<img width="250" alt="Meeting1" src="Meeting1.png" />
<img width="250" alt="Meeting2" src="Meeting2.png" />
</div>

**Archival Memory:** Daily summaries are compressed and archived, allowing the system to detect long-term trends.
<div align="center">
<img width="250" alt="Record" src="Record.png" />
</div>
