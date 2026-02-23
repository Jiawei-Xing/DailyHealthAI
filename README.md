<div align="center">
<img width="1200" alt="Overview" src="img/Overview.png" />
</div>

# Problem
The goal of this project is to provide access to personalized health coaching. While modern technology offers endless lifestyle choices, it also contributes to widespread health crises, including poor nutrition, sedentary behavior, and chronic stress. While we visit doctors for acute illnesses, the majority of health outcomes are determined by daily decisions—what we eat, how we move, how we sleep, and how we manage emotion. Furthermore, generic health advice fails to account for individual medical histories and genetic backgrounds. There is a critical need for a system that bridges the gap between clinical medical records and daily lifestyle choices to prevent disease, reduce medical burdens, and improve overall quality of life.

# Solution
Personal health is a multimodal challenge involving distinct, complex domains: nutrition, physiology, sleep science, psychology, and medicine. A single general-purpose AI model often struggles to maintain deep expertise across all these verticals simultaneously. An agentic architecture is the ideal solution because it allows for separation of concerns. We can assign a specialized "Persona" and specific instructions to each domain (e.g., a Jungian analyst for sleep, a clinical thinker for medicine). These agents can operate independently to gather deep data, and then collaborate to form a holistic view of the user, mirroring a real-world board of health experts.

# Architecture
I built DailyHealth AI, a comprehensive health ecosystem powered by the Google Gemini API. The architecture utilizes a Multi-Agent System consisting of five specialists: a Dietitian, Trainer, Sleep Specialist, Counselor, and Medical Specialist (all defined in `geminiService.ts`). These agents operate sequentially throughout the day to ingest multimodal user data (images, text, metrics). At the end of the day, a Lead Coordinator Agent aggregates these distinct logs, retrieves long-term context (medical history), and synthesizes a "Daily Board Meeting" report. This generates a cohesive strategy for the user's next day, ensuring that advice from one domain (e.g., exercise) is safe given the context of another (e.g., medical conditions).

The project implements key concepts of AI agents:

* Multi-Agent System: Five distinct personas powered by Gemini Flash and Pro models work in parallel to gather data, with a sequential Coordinator agent handling synthesis.
* Sessions & Memory: I implemented a robust state management system where static context (medical history) and episodic memory (daily summaries) are persisted and retrieved to ground agent responses.
* Context Engineering: To manage context window limits, daily detailed logs are "compacted" into executive summaries before being stored in long-term memory.
* Deployment: The application is live and hosted on Google Cloud Run.

# Set up

### View app in Google AI Studio:
https://ai.studio/apps/drive/1cKOVrcPRArWwCj1XXFs6Tg1zYPtsh3p7?fullscreenApplet=true

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

### Run on Google Cloud:
This app is deployed on Google Cloud by Google AI Studio: https://dailyhealth-ai-672214102683.us-west1.run.app/

### Run Locally:

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# Instruction

### Demo in YouTube video: 
https://www.youtube.com/shorts/yDilStyoBCM

### Demo in images:

**Authentication & Privacy:** Secure login ensures sensitive health data remains private.
<div align="center">
<img width="250" alt="Login" src="img/Login.png" />
</div>

**Onboarding:** The system establishes a baseline by capturing demographics and goals, which initiates the long-term memory context.
<div align="center">
<img width="250" alt="Background1" src="img/Background1.png" />
<img width="250" alt="Background2" src="img/Background2.png" />
<img width="250" alt="Background3" src="img/Background3.png" />
</div>

**Dietitian Agent:** Utilizing Gemini’s vision capabilities, this agent analyzes food photos to extract calories and macros, updating the user’s nutritional profile instantly.
<div align="center">
<img width="250" alt="Dietitian" src="img/Dietitian.png" />
</div>

**Trainer Agent:** This agent designs bespoke workouts based on real-time variables (energy levels, time constraints) and cross-references them with medical safety protocols.
<div align="center">
<img width="250" alt="Trainer" src="img/Trainer.png" />
</div>

**Sleep Specialist:** Beyond tracking duration, this agent performs qualitative analysis, including Jungian dream interpretation.
<div align="center">
<img width="250" alt="Sleep" src="img/Sleep.png" />
</div>

**Counselor Agent:** A dedicated mental health support interface that tracks emotional valence and provides empathetic dialogue.
<div align="center">
<img width="250" alt="Counselor" src="img/Counselor.png" />
   <img width="250" alt="Counselor" src="img/Counselor2.png" />
</div>

**Medical Specialist:** This agent ingests complex medical documents (like test results) to update the user's risk profile and answers clinical questions.
<div align="center">
<img width="250" alt="Medical" src="img/Medical.png" />
</div>

**The Consensus Meeting:** The core feature where the Coordinator Agent leads a synthesis of all data streams, producing a strategic executive summary.
<div align="center">
<img width="250" alt="Meeting1" src="img/Meeting1.png" />
<img width="250" alt="Meeting2" src="img/Meeting2.png" />
</div>

**Archival Memory:** Daily summaries are compressed and archived, allowing the system to detect long-term trends.
<div align="center">
<img width="250" alt="Profile" src="img/Profile.png" />
<img width="250" alt="Record" src="img/Record.png" />
</div>

# Future work
* Tool Integration: Currently, the agents rely on LLM knowledge. I would integrate Model Context Protocol (MCP) to connect specialized tools to increase accuracy, such as Apple Health for biometric data, Apple Fitness for exercises, and Cal AI for exact calorie counting.
* Agent-to-Agent (A2A) Protocol: I would implement a chat loop where agents can debate. For example, the Trainer could propose a workout, and the Medical Agent could veto it based on a new symptom, requiring the Trainer to regenerate the plan before presenting it to the user.
* Evaluation Framework: I would implement automated eval sets to ensure that advice remains medically safe and consistent with the user's history over long periods.
* Privacy & Compliance: Given the sensitivity of medical data, I would implement HIPAA-compliant encryption and local-first data storage options.
