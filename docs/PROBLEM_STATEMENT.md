# Report Builder V1 Problem Statement

Last updated: 2026-07-08

## Core Problem

The project is required to solve one central problem:

An area supervisor must be able to generate a complete daily Amharic supervision report for a given date by recording Amharic spoken activity information, then letting AI transcribe the audio, understand the content, organize the information, and generate the final report in the required report style.

The core value of the project is:

`record Amharic supervisor activity audio -> transcribe audio -> review transcription -> generate structured Amharic report with Addis AI -> review/correct the generatd report with Addis AI -> export report`

The application must not become only a generic report CRUD system. CRUD, dashboard, authentication, branch selection, and export are supporting features. The main purpose is automated report generation from recorded supervisor activity.

## The Most Important Product Requirement

The supervisor should not need to manually write the daily report from scratch.

The supervisor should only need to:

1. Select the report date.
2. Select the branch or branches visited.
3. Record the day's supervisor activity in Amharic.
4. Submit the audio.
5. Review the transcription.
6. Ask AI to generate the report.
7. Review the generated report.
8. Ask for correction/update if needed.
9. Export the final report.

The most important success condition is that a spoken Amharic explanation of the supervisor's day becomes a professionally organized Amharic report.

## Real-World Context

The user is employed by a company that has more than 14 branches in Addis Ababa, Ethiopia. The user works as an area supervisor. On a normal workday, the supervisor may visit one or more branches.

At each branch, the supervisor may:

- Check daily operational activities.
- Check cleanliness.
- Check employee readiness.
- Follow a checklist.
- Observe urgent branch problems.
- Communicate with staff or responsible people.
- Follow up on previously reported issues.
- Take action or give instructions.
- Form an opinion about branch performance.
- Identify things that need immediate attention.
- Identify things that can make the branch better.

At the end of each day, the supervisor must prepare a report for the boss. This report must explain the date, branch, working time, completed activities, unresolved issues, general opinion, and work exit time.

## Language Requirement

The conversation language in the recorded audio is always Amharic.

This is one of the main reasons Addis AI is selected. Addis AI is specialized in Ethiopian Amharic language and is expected to produce more accurate transcription and report generation than general AI tools that are not focused on Ethiopian language use cases.

Even though Addis AI is specialized in Amharic, the system must still provide a concrete system prompt. The AI must not be expected to guess the required report style. The system prompt must clearly define:

- The AI's responsibility.
- The report format.
- The report tone.
- The required sections.
- What information to extract.
- What information not to invent.
- How to handle missing information.
- How to handle English or technical words spoken inside Amharic audio.
- How to update/correct the generated report after user review.

## Manual Report Preparation Mental Model

The desired AI workflow can be understood through a two-person manual reporting process.

### Person 1

Person 1 is the supervisor who wants a report to be prepared.

Person 1 explains the day to Person 2 in Amharic. Person 1 may mention:

- The report date.
- The branch or branches visited.
- The time he entered work.
- The time he left work.
- The time range spent at each branch.
- The activities performed.
- The checklist-based work completed.
- The urgent issues/problems that require attention.
- The actions taken.
- The people contacted.
- The follow-up needed.
- General opinions about the branch.
- Opinions about raised issues/problems.
- Suggestions that could make things better.

Person 1 may explain the information naturally, not in report format. The explanation may be conversational, repeated, incomplete at first, or clarified later.

### Person 2

Person 2 is a friend of Person 1. Person 2 does not have any work relationship with the company. Person 2 listens carefully and tries to understand what Person 1 wants to say.

During the conversation, Person 2 may ask WH questions such as:

- What date was it?
- Which branch did you visit?
- What time did you enter work?
- What time did you leave?
- What activities did you perform?
- What problems did you find?
- What actions did you take?
- Who did you inform?
- What issue still needs a solution?
- What is your general opinion?

After listening and understanding, Person 2 writes a complete report for Person 1.

Then Person 1 reviews the report. If something is wrong, missing, unclear, or not written in the desired way, Person 1 asks Person 2 to correct it. Person 2 updates the report until Person 1 is satisfied.

## How This Mental Model Maps To The App

In the app:

- Person 1 is the user/supervisor.
- Person 2 is the Addis AI-powered system.

The supervisor provides a recorded Amharic audio explanation of the day. The app sends the audio to Addis AI speech-to-text to produce transcription. The transcription is expected to contain the needed information, but it will not be organized as a final report.

After transcription, the AI must process, extract, organize, and rewrite the information based on the required report rules, report format, tone, and system prompt.

The AI is responsible for:

- Extracting date information.
- Extracting branch names.
- Extracting working time and branch time ranges.
- Extracting performed activities.
- Extracting unresolved issues.
- Extracting urgent problems.
- Extracting actions already taken.
- Extracting general opinions.
- Organizing the extracted information into the required report format.
- Writing the report in Amharic.
- Matching the tone of the provided report samples.
- Correcting/updating the generated report when the user asks after review.

The AI must not treat the transcription as the final report. The transcription is only raw material. The generated report is the organized final output.

## Why The Current Manual Process Is Difficult

The current reporting process depends too much on manual writing after the work has already happened.

During the day, the supervisor moves from branch to branch. The supervisor may be walking, riding in a vehicle, talking with branch staff, checking branch conditions, handling unexpected problems, and managing time pressure. In this situation, writing a polished report at the workplace is often impractical.

After work, the supervisor may return home tired. At that point, writing the daily report becomes mentally heavy. The supervisor has to remember the full day, organize scattered information, choose proper Amharic wording, and prepare something suitable for a boss.

This creates a daily burden:

- Important details can be forgotten.
- Reports can be delayed.
- Reports can become shorter than they should be.
- The supervisor may feel pressure after work instead of resting.
- The quality of reports can vary depending on tiredness and available time.
- Information collected during branch visits may remain unstructured.
- The supervisor may know what happened but still struggle to turn it into a polished report.

## The Required Solution

The solution is a MERN Stack web application that automates daily report creation from Amharic voice.

For a given report date, the supervisor records Amharic audio describing the day's branch supervision activities. The supervisor can listen to the recording, discard it, and re-record before submission.

After submission:

1. The backend sends the audio to Addis AI speech-to-text.
2. Addis AI returns an Amharic transcription.
3. The app shows the transcription to the supervisor.
4. The supervisor reviews and corrects the transcription if needed.
5. The backend sends the reviewed transcription to Addis AI text generation with a strict system prompt.
6. Addis AI generates a structured Amharic report.
7. The app shows the generated report to the supervisor.
8. The supervisor can request corrections/updates.
9. The final report can be exported.

The system must transform the hard task from "write a full report manually" into "speak what happened and review the AI result."

## Report Format

The generated report must follow this tentative Amharic structure:

```text
ቀን: [ቀን]
ብራንች: [ብራንች ስም]
ስም: [ሙሉ ስም]
ስራ የገባሁበት ሰዓት: [ሰዓት]

የተሰሩ ስራዎች:
 - [ስራ 1]
 - [ስራ 2]
 - [ስራ 3]

መፍትሄ የሚፈሉ ጉዳዮች:
 - [ችግር 1]
 - [ችግር 2]

አጠቃላይ አስተያየት:
 - [አስተያየት 1]
 - [አስተያየት 2]

ከስራ የወጣሁበት ሰዓት፡ [ሰዓት]
```

The format must support one branch or multiple branches. When multiple branches are visited, the working time section should show the time range for each branch.

Example:

```text
ስራ የገባሁበት ሰዓት:
ከ02:30 - 07:40 መድኃኒዓለም ብራንች
ከ07:55 - 12:20 ኤርፖርት ብራንች
```

## Report Output Sample 1

```text
ቀን: 29-10-18
ብራንች: መድኃኒዓለም / ኤርፖርት
ስም: ቤዛ አያሌው
ስራ የገባሁበት ሰዓት:
ከ02:30 - 07:40 መድኃኒዓለም ብራንች
ከ07:55 - 12:20 ኤርፖርት ብራንች

የተሰሩ ስራዎች:
በመድኃኒዓለምና በኤርፖርት ቅርንጫፎች በቼክሊስቱ መሰረት የዕለት ተዕለት የአሰራር ሂደቶችን፣ የንፅህና ሁኔታዎችን እና የሰራተኞችን ዝግጁነት አረጋግጫለሁ።
በመድኃኒዓለም ብራንች ትናንት ሪፖርት የተደረጉት ሁሉም የጥገና ችግሮች አሁን ላይ ተስተካክለዋል።
በኤርፖርት ቅርንጫፍ የአዲሶቹ ሶፋዎች እግሮች መሰበራቸውን ለቶማስ አሳውቄው፤ እሱም ነገ ቴክኒሻን እንደሚልክ ገልጾልኛል።

መፍትሄ የሚፈሉ ጉዳዮች:
በኤርፖርት ቅርንጫፍ፡ የወንዶች ሎከር ጣሪያ አሁንም እያፈሰሰ ነው፤ ይህ ችግር ከዚህ ቀደም (13-10-18) ሪፖርት የተደረገ ሲሆን እልባት አላገኝም። በተጨማሪም በኪችን ውስጥ ያለው የጭስ ማስወጫ ኤግዝስት ፋን መጽዳት ይፈልጋል፣ የበርገር ሥጋው መጠኑ አነስተኛ ሲሆን ከዳቦ ጋር የተመጣጠነ አይደለም። ስለሆነም እነዚህ ችግሮች መፍትሄ እንዲያገኙ እጠይቃለሁ።

አጠቃላይ አስተያየት:
በሁለቱም ቅርንጫፎች የሥራ እንቅስቃሴው ጥሩ ነበር።

ከስራ የወጣሁበት ሰዓት: 12:20
```

## Report Output Sample 2

```text
ቀን: 26-10-18
ብራንች: ኤርፖርት / መድኃኒዓለም / ቡልቡላ
ስም: ቤዛ አያሌው
ስራ የገባሁበት ሰዓት:
ከ01:50 - 04:10 ኤርፖርት ብራንች
ከ04:20 - 07:30 መድኃኔዓለም ብራንች
ከ08:05 - 12:30 ቡልቡላ ብራንች

የተሰሩ ስራዎች:
በኤርፖርትና በመድኃኒዓለም ብራንቾች በቼክሊስቱ መሠረት የዕለት ተዕለት የአሠራር ሂደቶችን፣ የንፅህና ሁኔታዎችን እና የሠራተኞችን ዝግጁነት አረጋግጫለሁ።
በቡልቡላ ብራንች በተዘጋጀው የካሸሮች ሥልጠና ላይ ተሳትፌያለሁ።

መፍትሄ የሚፈሉ ጉዳዮች:
ለሳምቡሳ ዝግጅት የሚያስፈልጉ ግብዓቶች ስቶር ባለመኖራቸው፣ ወደ ብራንቹ ሳምቡሳ አልተላከም። ስለዚህ በተቻለ ፍጥነት ግብዓቶቹ እንዲሟሉ እጠይቃለሁ።
በመድኃኒዓለም ብራንች የግሪሉ ግማሽ ክፍል አይሠራም። በመሆኑም ማቲያስ በተቻለ ፍጥነት እንዲጠግነው ጥሪ አድርጌ ነበር፤ ነገር ግን ሥራ እንደበዛበት አስታውቆኛል፣ ቢሆንም አሁንም እንዲስተካከል እጠይቃለሁ።

አጠቃላይ አስተያየት:
በአጠቃላይ በሦስቱም ቅርንጫፎች የሥራ እንቅስቃሴው ጥሩ ነበር።

ከስራ የወጣሁበት ሰዓት: 12:30
```

## Report Output Sample 3

```text
ቀን: 22-10-18
ብራንች: መድኃኒዓለም
ስም: ቤዛ አያሌው
ስራ የገባሁበት ሰዓት: 01:55

የተሰሩ ስራዎች:
በቼክሊስቱ መሰረት በመድኃኒዓለም ቅርንጫፍ የሚከናወኑ መደበኛ የአሰራር ሂደቶች፣ የንፅህና አጠባበቅ ሁኔታ እና የሰራተኞች ዝግጁነት በተገቢው መልኩ መሆናቸውን አረጋግጫለሁ።
ኤፍሬም በህመም እረፍት ላይ ስለነበር የእሱን የሥራ ቦታ ሸፍኜያለሁ።

መፍትሄ የሚፈሉ ጉዳዮች:
በዋናው መግቢያ በር ላይ የሚቀመጠው ምንጣፍ (ካርፔት) እንዲገዛልን ቀደም ሲል ጠይቄ የነበረ ሲሆን አሁንም በተቻለ ፍጥነት እንዲሟላልን እጠይቃለሁ።

አጠቃላይ አስተያየት:
በአጠቃላይ የሥራ እንቅስቃሴው ጥሩ ነበር።

ከስራ የወጣሁበት ሰዓት: 09:30
```

## Required Report Tone

The generated report must sound like the samples above.

The tone should be:

- Professional.
- Direct.
- Clear.
- Work-report oriented.
- Written from the supervisor's perspective.
- Suitable to present to a boss.
- Natural in Amharic.
- Not overly decorative.
- Not conversational.
- Not casual.
- Not like a chatbot answer.

The AI must transform conversation into report language.

For example, if the audio says something conversational like "እኔ ዛሬ መድኃኒዓለም ሄጄ ቼክሊስቱን አይቼ ነበር", the report should not simply repeat the conversation. It should write in the report style, for example:

```text
በቼክሊስቱ መሰረት በመድኃኒዓለም ቅርንጫፍ የሚከናወኑ መደበኛ የአሰራር ሂደቶችን አረጋግጫለሁ።
```

## Strict AI Generation Rules

The AI must follow these rules when generating the report:

1. Generate the report in Amharic.
2. Use the exact section structure required by the report format.
3. Match the tone and writing style of the provided samples.
4. Use the reviewed transcription as the source of truth.
5. Do not invent missing dates, branch names, times, actions, people, problems, or opinions.
6. If required information is missing, leave it blank or mark it as not specified according to the chosen prompt rule.
7. Separate completed activities from unresolved issues.
8. Put urgent problems under `መፍትሄ የሚፈሉ ጉዳዮች`.
9. Put general branch opinion or improvement opinion under `አጠቃላይ አስተያየት`.
10. Preserve branch-specific details when multiple branches are mentioned.
11. Preserve time ranges per branch when the audio contains them.
12. Write from the supervisor's point of view.
13. Do not output an explanation of how the report was generated.
14. Do not include unrelated conversation content.
15. Do not include Person 2's questions unless the answer contains report information.
16. When the user asks for correction/update after review, update the report according to the user's instruction without changing unrelated correct content.

## Strict Rule For English And Technical Words In The Audio

The audio conversation is Amharic, but it may include English or technical workplace words. The AI must not translate such words literally into unnatural Amharic. The AI must also not leave them in English spelling if the expected report style uses Amharic phonetic writing.

Instead, the AI must write English or technical words in the common Amharic workplace pronunciation/transliteration style.

Example:

- If the audio mentions `deep fryer`, the report must not write `deep fryer`.
- It also must not translate it literally as `ጥልቅ መጥበሻ`.
- It must write `ዲፕ ፍራየር`.

This rule applies to all English or technical words, not only `deep fryer`.

More examples of the intended principle:

- `locker` should be written as `ሎከር` when that is the natural workplace term.
- `kitchen` should be written as `ኪችን` when that is the natural workplace term.
- `exhaust fan` should be written as `ኤግዝስት ፋን` when that is the natural workplace term.
- `technician` should be written as `ቴክኒሻን` when that is the natural workplace term.
- `store` should be written as `ስቶር` when that is the natural workplace term.

The goal is to produce a report that sounds natural to the company/workplace context, not a formal dictionary translation.

## What The Transcription Represents

The transcription is not the final report.

The transcription is only the raw Amharic text version of the recorded conversation or spoken explanation. It may include:

- Repetition.
- Unordered information.
- Questions and answers.
- Informal wording.
- Clarifications.
- Corrections.
- Side comments.
- Mixed technical terms.

When someone reads the transcription, they should be able to understand the information. But the transcription itself cannot be used directly as the report because it is not organized, polished, or formatted.

The AI must process the transcription and convert it into the required report structure.

## Required Correction And Update Behavior

After the AI generates the report, the supervisor must be able to review it.

If the supervisor says something like:

- "ይህን ችግር ወደ መፍትሄ የሚፈሉ ጉዳዮች አስገባው"
- "የመውጫ ሰዓቱን 12:30 አድርገው"
- "ይህን አስተያየት አጠቃላይ አስተያየት ውስጥ አስገባው"
- "ይህን ክፍል አጥፋው"
- "ቃሉን እንደዚህ ቀይረው"

The AI must update only the relevant part of the generated report. It must not rewrite correct unrelated sections unnecessarily.

## Product Workflow

The intended user workflow is:

1. The supervisor opens the app.
2. The supervisor logs in.
3. The supervisor goes to Reports.
4. The supervisor creates a report for a selected date.
5. The supervisor selects the branch or branches visited.
6. The supervisor records Amharic audio describing the day.
7. The supervisor listens to the recording.
8. If the recording is not good, the supervisor records again.
9. The supervisor submits the final audio.
10. The app transcribes the audio using Addis AI.
11. The supervisor reviews and corrects the transcription.
12. The supervisor asks Addis AI to generate the report using the system prompt.
13. The app creates a structured Amharic report.
14. The supervisor previews the report.
15. The supervisor asks for corrections or manually edits if needed.
16. The supervisor exports the final report.

## Main Pain Points To Solve

### 1. Manual Report Writing Takes Too Much Effort

The supervisor should not need to write the whole report manually after a long workday.

### 2. The Supervisor Is Mobile During The Day

Because the supervisor moves between branches, recording audio is more realistic than typing.

### 3. The Source Information Is Conversational

The spoken explanation may not follow the final report order. The AI must organize it.

### 4. Amharic Accuracy Matters

The conversation is always Amharic. The system must treat Amharic quality as a core requirement, not as an optional language feature.

### 5. Report Tone Must Match Existing Reports

The output must sound like the provided report samples. A generic AI summary is not enough.

### 6. Technical Words Must Sound Natural

English workplace terms must be represented in natural Amharic workplace transliteration, not literal translation.

### 7. The User Must Stay In Control

The supervisor must review transcription and generated report before final export.

## What The Project Is Not Mainly About

The project is not mainly about:

- A generic dashboard.
- Generic note taking.
- Generic file upload.
- Generic CRUD.
- Generic AI chat.
- A decorative landing page.

Those features may exist, but they are secondary. The central problem is daily Amharic report generation from recorded supervisor activity.

## Supporting Features Needed Because Of The Core Problem

The following features support the central workflow:

- Authentication, so reports belong to the correct user.
- Profile, so supervisor identity can appear in reports.
- Branch management, so visited branches can be selected.
- Report list and grid views, so previous reports can be found.
- Audio recording, so the supervisor can speak instead of writing.
- Audio playback and re-recording, so the supervisor can confirm the recording before submission.
- Addis AI speech-to-text, so Amharic audio becomes text.
- Transcription review, so the user can correct raw AI transcription before report generation.
- Addis AI text generation, so raw transcription becomes a structured report.
- Report preview/edit, so the user can approve the final output.
- Export, so the report can be shared or archived.

## Success Definition

The project succeeds if the supervisor can reliably produce a boss-ready Amharic daily report from recorded Amharic supervisor activity with far less manual writing.

A successful V1 must allow the supervisor to:

- Create a report for a date.
- Select one or more branches.
- Record Amharic activity audio.
- Re-record before submission.
- Submit audio for transcription.
- Review and correct transcription.
- Generate an Amharic report with Addis AI.
- Match the sample report tone and format.
- Request correction/update after review.
- Preview and edit the generated report.
- Export the final report.

## Failure Definition

The project fails if it becomes a normal report CRUD app where the supervisor still has to manually write the report from scratch.

The project also fails if:

- The audio workflow is unreliable.
- The transcription is skipped.
- The user cannot review transcription before report generation.
- Addis AI is used without a concrete system prompt.
- Amharic quality is poor.
- The output does not match the sample report tone.
- English technical words are translated unnaturally.
- The generated report fabricates information.
- The generated report cannot be corrected after review.
- Exported reports are not usable.

## Product Principle

Every major technical, design, and AI-prompt decision should be checked against this question:

Does this help the supervisor generate a boss-ready Amharic daily report from recorded Amharic supervisor activity faster, more accurately, and with less manual writing?

If the answer is no, the feature is secondary and should not distract from the core workflow.
