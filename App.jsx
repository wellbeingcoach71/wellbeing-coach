import { useState, useEffect, useRef } from "react";

const EMAILJS_SERVICE_ID = "wellbeing_coach";
const EMAILJS_TEMPLATE_INITIAL = "template_ny13xqd";
const EMAILJS_TEMPLATE_FINAL = "template_j3jhq6t";
const EMAILJS_PUBLIC_KEY = "wVPtnWicnjtiDxzag";

const LANG = {
  en: {
    title: "Well-being Assessment",
    subtitle: "",
    step_info: "Your information",
    step_questions: "Assessment",
    step_followup: "Follow-up",
    step_complete: "Complete",
    full_name: "Full name",
    email: "Email address",
    language: "Language preference",
    next: "Continue",
    back: "Back",
    submit: "Submit",
    never: "Never", almost_never: "Almost Never", rarely: "Rarely", sometimes: "Sometimes", often: "Often", always: "Always",
    sending: "Generating your report…",
    sent_title: "Thank you!",
    sent_body: "Your responses have been processed and a report has been sent to your coach.",
    select_all: "Select all that apply",
    personal_impact: "Personal impact",
    workplace_impact: "Workplace & collaboration impact",
    areas_low: "Areas where you may be struggling:",
    areas_high: "Areas where you are thriving:",
    impact_low_personal: "How does this affect you personally, for example in terms of energy, focus, or overall wellbeing?",
    impact_low_workplace: "How does it affect your work, such as how you approach tasks, manage your time, or collaborate with others?",
    impact_high_personal: "How does this support you personally, for example in terms of energy, focus, or overall wellbeing?",
    impact_high_workplace: "How does it support your work, such as how you approach tasks, manage your time, or collaborate with others?",
    followup_intro: "Based on your responses, please tell us more about the impact in these areas.",
    name_placeholder: "Enter your full name",
    email_placeholder: "your@email.com",
    required: "Please fill in all fields",
    invalid_email: "Please enter a valid email",
    generating: "Generating AI summary & final report…",
    q_required: "Please answer all questions before continuing.",
    your_profile: "Your well-being profile",
    score_overview: "Score overview",
    followup_summary: "Your follow-up responses",
    followup_summary_intro: "Below is an overview of what you selected in the follow-up questions. Your coach will use this as a starting point for your conversation.",
    personal_impact: "Personal impact",
    workplace_impact: "Workplace & collaboration impact",
    limiting: "Limiting condition",
    strength: "Performance strength",
    radar_legend_you: "Your score",
    radar_legend_mid: "Midpoint (3.5)",
    coach_summary: "AI coaching summary (for coach)",
    new_assessment: "Start new assessment",
    save_pdf: "Save as PDF",
    coach_name: "Name of Coach",
    coach_placeholder: "Enter coach name",
    followup_intro1: "Following the assessment you completed, here are follow\u2011up questions focusing on the areas that scored highest and lowest in your responses, to better understand how these factors influence you and your work in day\u2011to\u2011day practice.",
    followup_intro2: "We are particularly interested in how these areas impact you \u2014 both personally, in terms of your well-being and energy, and in your work environment, including your daily work and collaboration with others.",
    followup_intro3: "Please take a moment to reflect on how these areas show up for you. Select what feels most relevant, and make sure to add your own thoughts under 'Other'. Your own words are often the most useful for the coaching conversation.",
    disclaimer: "This assessment was designed by Jóna Björk Sigurjónsdóttir (jonabjork@proton.me). Your responses are confidential and will only be shared with your coach. The purpose of this assessment is to support your coaching conversation — it is not an evaluation or performance review.",
    welcome_text: "This assessment looks at the conditions that support or limit your performance and wellbeing at work. It takes around 10 minutes. Your responses will form the basis for your coaching conversation.",
    assessment_intro1: "The assessment below focuses on key aspects of the work environment, including support, energy, and well\u2011being, with the aim of identifying opportunities to improve working conditions. It is designed to help us better understand how you experience your work, workload, and work\u2013life balance, and how these factors impact your day\u2011to\u2011day life.",
    assessment_intro2: "Your responses will form the basis for meaningful dialogue and guide our next steps and actions.",
    assessment_intro3: "Please select one option for each statement.",
    no_triggers: "Your scores are all in the moderate range. No follow-up categories triggered.",
  },
  is: {
    title: "Vellíðunarmat",
    subtitle: "",
    step_info: "Þínar upplýsingar",
    step_questions: "Könnun",
    step_followup: "Eftirfylgni",
    step_complete: "Lokið",
    full_name: "Fullt nafn",
    email: "Netfang",
    language: "Tungumál",
    next: "Áfram",
    back: "Til baka",
    submit: "Senda",
    never: "Aldrei", almost_never: "Nánast aldrei", rarely: "Sjaldan", sometimes: "Stundum", often: "Oft", always: "Alltaf",
    sending: "Búinn til skýrslu…",
    sent_title: "Takk!",
    sent_body: "Svörin þín hafa verið unnin og skýrsla send til þjálfarans.",
    select_all: "Veldu allt sem við á",
    personal_impact: "Persónuleg áhrif",
    workplace_impact: "Áhrif á vinnustað og samstarf",
    areas_low: "Svæði sem gæti verið gagnlegt að skoða nánar:",
    areas_high: "Svæði þar sem þú blómstrar:",
    impact_low_personal: "Hvernig hefur þetta áhrif á þig persónulega, til dæmis með tilliti til orku, einbeitingar eða líðanar?",
    impact_low_workplace: "Hvernig hefur þetta áhrif á vinnuna þína, til dæmis hvernig þú nálgast verkefni, stjórnar tíma þínum eða samstarfar við aðra?",
    impact_high_personal: "Hvernig styður þetta þig persónulega, til dæmis með tilliti til orku, einbeitingar eða líðanar?",
    impact_high_workplace: "Hvernig styður þetta vinnuna þína, til dæmis hvernig þú nálgast verkefni, stjórnar tíma þínum eða samstarfar við aðra?",
    followup_intro: "Út frá svörunum þínum, vinsamlega segðu okkur meira um áhrif á þessum sviðum.",
    q_required: "Vinsamlega svaraðu öllum spurningum áður en þú heldur áfram.",
    name_placeholder: "Sláðu inn fullt nafn",
    email_placeholder: "þitt@netfang.is",
    required: "Vinsamlega fylltu út alla reiti",
    invalid_email: "Vinsamlega sláðu inn gilt netfang",
    generating: "Búinn til AI samantekt og lokaskýrslu…",
    your_profile: "Vellíðunarprófíll",
    score_overview: "Yfirlit yfir stig",
    followup_summary: "Svör þín úr framhaldsspurningunum",
    followup_summary_intro: "Hér að neðan eru þau svör sem þú valdir í framhaldsspurningunum. Þjálfarinn mun nota þetta sem upphafsgrunn fyrir samtalið.",
    personal_impact: "Persónuleg áhrif",
    workplace_impact: "Áhrif á vinnustað og samstarf",
    limiting: "Takmarkandi þáttur",
    strength: "Styrkleiki",
    radar_legend_you: "Stigin þín",
    radar_legend_mid: "Miðpunktur (3.5)",
    coach_summary: "AI þjálfunarsamantekt (fyrir þjálfara)",
    new_assessment: "Byrja nýja könnun",
    save_pdf: "Vista sem PDF",
    coach_name: "Nafn þjálfara",
    coach_placeholder: "Sláðu inn nafn þjálfarans",
    followup_intro1: "Hér eru eftirfylgnispurningar sem tengjast þeim svæðum sem komu hæst og lægst út í könnuninni. Markmiðið er að skilja betur hvernig þessir þættir hafa áhrif á þig og vinnuna þína í daglegu lífi.",
    followup_intro2: "Við höfum sérstaklega áhuga á að fá dýpri innsýn í hvernig þessi svæði birtast hjá þér — bæði persónulega, með tilliti til líðanar og orku, og í vinnuumhverfinu þínu, til dæmis í daglegu starfi og samstarfi við aðra.",
    followup_intro3: "Gefðu þér smá stund til að hugsa um hvernig þessir þættir koma fram hjá þér. Veldu það sem á best við og mundu að bæta við eigin hugsun undir 'Annað'. Eigin orð þín eru oft gagnlegust fyrir þjálfunarsamtalið.",
    disclaimer: "Þessi könnun var hönnuð af Jónu Björk Sigurjónsdóttur (jonabjork@proton.me). Svörin þín eru trúnaðarmál og verða eingöngu deilt með þjálfaranum þínum. Markmið könnunarinnar er að styðja við þjálfunarsamtalið, þetta er ekki mat á frammistöðu.",
    welcome_text: "Þessi könnun skoðar þær aðstæður sem styðja eða takmarka frammistöðu þína og líðan í starfi. Hún tekur um 10 mínútur. Svörin þín munu nýtast sem grundvöllur í samtali þínu við þjálfarann.",
    assessment_intro1: "Könnunin hér að neðan beinir sjónum að lykilþáttum vinnuumhverfisins, þar á meðal stuðningi, orku og vellíðan, með það að markmiði að bera kennsl á tækifæri til að bæta starfsaðstæður. Hún er hönnuð til að hjálpa okkur að skilja betur hvernig þú upplifir vinnuna þína, vinnuálagið og jafnvægi milli vinnu og einkalífs, og hvernig þessir þættir hafa áhrif á daglegt líf þitt.",
    assessment_intro2: "Svör þín munu mynda grundvöll fyrir þroskandi samræður og leiðbeina okkur í næstu skrefum og aðgerðum.",
    assessment_intro3: "Vinsamlega veldu einn valmöguleika fyrir hverja fullyrðingu.",
    no_triggers: "Allar stigin eru í miðlungssvæði. Engar eftirfylgniflokkar komu upp.",
  }
};

const SCORE_LABELS_EN = ["Never","Almost Never","Rarely","Sometimes","Often","Always"];
const SCORE_LABELS_IS = ["Aldrei","Nánast aldrei","Sjaldan","Stundum","Oft","Alltaf"];

const QUESTIONS = {
  en: [
    { cat: "Workload", q: "I feel my workload is manageable", rev: false },
    { cat: "Workload", q: "I find it easy to prioritize tasks", rev: false },
    { cat: "Workload", q: "There are clear expectations for me at work", rev: false },
    { cat: "Workload", q: "I feel stressed at work", rev: true },
    { cat: "Workload", q: "Work drains my energy", rev: true },
    { cat: "Energy", q: "My job gives me energy", rev: false },
    { cat: "Energy", q: "I feel satisfied with my job", rev: false },
    { cat: "Energy", q: "I look forward to starting my workday", rev: false },
    { cat: "Energy", q: "I feel focused at work", rev: false },
    { cat: "Energy", q: "I am able to recharge after a workday", rev: false },
    { cat: "Autonomy", q: "I have control over how I organize my work", rev: false },
    { cat: "Autonomy", q: "I have influence over task prioritization", rev: false },
    { cat: "Autonomy", q: "I can adapt my work to my strengths", rev: false },
    { cat: "Support", q: "I receive support from my direct manager", rev: false },
    { cat: "Support", q: "I receive support from colleagues", rev: false },
    { cat: "Support", q: "There is good collaboration in my team", rev: false },
    { cat: "Support", q: "I regularly receive useful feedback", rev: false },
    { cat: "Development", q: "I have opportunities to develop my skills", rev: false },
    { cat: "Development", q: "I use my strengths in my job", rev: false },
    { cat: "Development", q: "I have opportunities to learn new things", rev: false },
    { cat: "Development", q: "My job helps me grow", rev: false },
    { cat: "Clarity", q: "My role is clear", rev: false },
    { cat: "Clarity", q: "My tasks are well defined", rev: false },
    { cat: "Clarity", q: "Priorities are clear", rev: false },
    { cat: "Balance", q: "I achieve a good balance between work and personal life", rev: false },
    { cat: "Balance", q: "I have enough time for family and friends", rev: false },
    { cat: "Balance", q: "Work negatively affects my free time", rev: true },
    { cat: "Health", q: "I exercise regularly", rev: false },
    { cat: "Health", q: "I have energy to take care of my health after work", rev: false },
    { cat: "Health", q: "I get enough sleep", rev: false },
    { cat: "Habits", q: "I spend too much time on my phone", rev: true },
    { cat: "Habits", q: "I can relax easily without screen time", rev: false },
    { cat: "Habits", q: "I use my free time in a constructive way", rev: false },
    { cat: "Hobbies", q: "I engage in my hobbies regularly", rev: false },
    { cat: "Hobbies", q: "I do things that bring me joy outside of work", rev: false },
    { cat: "Hobbies", q: "I make time for what I enjoy", rev: false },
    { cat: "Overall", q: "Overall, I am satisfied with my life", rev: false },
    { cat: "Overall", q: "I feel balanced in my day-to-day life", rev: false },
    { cat: "Overall", q: "I have control over my time and energy", rev: false },
  ],
  is: [
    { cat: "Vinnuálag", q: "Ég upplifi að vinnuálagið sé viðráðanlegt", rev: false },
    { cat: "Vinnuálag", q: "Ég á auðvelt með að forgangsraða verkefnum", rev: false },
    { cat: "Vinnuálag", q: "Það eru skýrar væntingar til mín í starfi", rev: false },
    { cat: "Vinnuálag", q: "Ég finn fyrir álagi í starfi mínu", rev: true },
    { cat: "Vinnuálag", q: "Vinnan tekur frá mér orku", rev: true },
    { cat: "Orka", q: "Starfið gefur mér orku", rev: false },
    { cat: "Orka", q: "Ég finn ánægju í starfinu mínu", rev: false },
    { cat: "Orka", q: "Ég hlakka til að byrja vinnudaginn", rev: false },
    { cat: "Orka", q: "Ég upplifi mig einbeitt(a)n í vinnu", rev: false },
    { cat: "Orka", q: "Ég næ að endurhlaða mig eftir vinnudag", rev: false },
    { cat: "Sjálfræði", q: "Ég hef stjórn á því hvernig ég skipulegg vinnuna mína", rev: false },
    { cat: "Sjálfræði", q: "Ég hef áhrif á forgangsröðun verkefna", rev: false },
    { cat: "Sjálfræði", q: "Ég get lagað vinnuna mína að mínum styrkleikum", rev: false },
    { cat: "Stuðningur", q: "Ég fæ stuðning frá næsta stjórnanda", rev: false },
    { cat: "Stuðningur", q: "Ég fæ stuðning frá samstarfsfólki", rev: false },
    { cat: "Stuðningur", q: "Það er gott samstarf í teyminu mínu", rev: false },
    { cat: "Stuðningur", q: "Ég fæ reglulega gagnlega endurgjöf", rev: false },
    { cat: "Þróun", q: "Ég fæ tækifæri til að þróa færni mína", rev: false },
    { cat: "Þróun", q: "Ég nýti styrkleika mína í starfi", rev: false },
    { cat: "Þróun", q: "Ég fæ tækifæri til að læra nýja hluti", rev: false },
    { cat: "Þróun", q: "Starfið hjálpar mér að vaxa", rev: false },
    { cat: "Skipulag", q: "Hlutverk mitt er skýrt", rev: false },
    { cat: "Skipulag", q: "Verkefni mín eru vel skilgreind", rev: false },
    { cat: "Skipulag", q: "Forgangsröðun er skýr", rev: false },
    { cat: "Jafnvægi", q: "Ég næ góðu jafnvægi milli vinnu og einkalífs", rev: false },
    { cat: "Jafnvægi", q: "Ég á nægan tíma fyrir fjölskyldu og vini", rev: false },
    { cat: "Jafnvægi", q: "Vinnan hefur neikvæð áhrif á frítíma minn", rev: true },
    { cat: "Heilsa", q: "Ég hreyfi mig reglulega", rev: false },
    { cat: "Heilsa", q: "Ég hef orku til að sinna heilsu minni eftir vinnu", rev: false },
    { cat: "Heilsa", q: "Ég sef nægilega vel", rev: false },
    { cat: "Venjur", q: "Ég eyði of miklum tíma í símanum", rev: true },
    { cat: "Venjur", q: "Ég á auðvelt með að slaka á án skjánotkunar", rev: false },
    { cat: "Venjur", q: "Ég nýti frítímann á uppbyggilegan hátt", rev: false },
    { cat: "Áhugamál", q: "Ég sinni áhugamálum mínum reglulega", rev: false },
    { cat: "Áhugamál", q: "Ég geri hluti sem veita mér gleði utan vinnu", rev: false },
    { cat: "Áhugamál", q: "Ég finn tíma fyrir það sem mér finnst skemmtilegt", rev: false },
    { cat: "Heildarlíðan", q: "Ég er almennt ánægð/ánægður með lífið mitt", rev: false },
    { cat: "Heildarlíðan", q: "Ég finn fyrir jafnvægi í daglegu lífi", rev: false },
    { cat: "Heildarlíðan", q: "Ég hef stjórn á tíma mínum og orku", rev: false },
  ]
};

const CAT_MAP_EN = {
  "Workload": "Workload", "Energy": "Energy & Well-being", "Autonomy": "Autonomy",
  "Support": "Support", "Development": "Development", "Clarity": "Clarity",
  "Balance": "Work–Life Balance", "Health": "Health", "Habits": "Daily Habits",
  "Hobbies": "Hobbies", "Overall": "Overall Well-being"
};
const CAT_MAP_IS = {
  "Vinnuálag": "Vinnuálag", "Orka": "Orka og vellíðan", "Sjálfræði": "Stjórn og sjálfræði",
  "Stuðningur": "Stuðningur", "Þróun": "Þróun", "Skipulag": "Skipulag",
  "Jafnvægi": "Jafnvægi vinnu og einkalífs", "Heilsa": "Heilsa",
  "Venjur": "Daglegar venjur", "Áhugamál": "Áhugamál", "Heildarlíðan": "Heildarlíðan"
};

const CATS_EN = ["Workload","Energy","Autonomy","Support","Development","Clarity","Balance","Health","Habits","Hobbies","Overall"];
const CATS_IS_KEY = ["Vinnuálag","Orka","Sjálfræði","Stuðningur","Þróun","Skipulag","Jafnvægi","Heilsa","Venjur","Áhugamál","Heildarlíðan"];

const IMPACT_PERSONAL_EN = {
  "Workload": { low: ["The quality of my work decreases","I make more mistakes or need to rework tasks more often","I am less able to meet deadlines","I have less time to do things properly or improve processes","I am less patient in interactions","Work follows me outside work more (harder to switch off)"], high: ["I have the time to do things properly","I am better able to meet timelines","I can support others when needed","I have time to improve how we work (continuous improvement)","I experience fewer mistakes and less rework","Work has less impact on my personal time (easier to switch off)"] },
  "Energy": { low: ["I withdraw more and participate less","I find it harder to bring a positive, encouraging presence to interactions","I more often have to push myself just to get through tasks","Work feels like it costs me more than it gives back","I am less likely to go beyond the minimum required"], high: ["I bring positive energy into the team","I am more likely to go beyond the minimum required","I cope better during peak periods without burning out","I am more able to think creatively and solve problems","Work gives me constructive energy that also carries into life outside work"] },
  "Autonomy": { low: ["I more often wait for approval or instructions before starting on a project","Decisions are delayed and work gets stuck","I avoid taking on new responsibilities to reduce risk","I experience more micromanagement or monitoring","I am less likely to suggest improvements"], high: ["I make decisions faster and resolve issues independently","I take more initiative and suggest improvements","I can adapt how I work to what is most effective","I experience more trust and less micromanagement","Work flows faster"] },
  "Support": { low: ["I hold back from raising problems or risks","I get stuck for longer on tasks","Misunderstandings increase and communication becomes harder","I feel more isolated in my work","I learn less from mistakes (less feedback/guidance)"], high: ["I am more willing to raise issues early (problems/risks)","I get unblocked faster when I need help","Collaboration works better and work moves faster","I learn faster and develop more in my role","I experience greater psychological safety in communication"] },
  "Development": { low: ["I feel more boredom or disengagement in my tasks","I experience less progress month to month","I lower my ambition to contribute ideas or extra effort","I more often consider looking for a new job","I feel my strengths are underused"], high: ["I feel more motivated to contribute ideas and improvements","I experience regular progress and next steps","I feel more committed to staying in the role","I am more willing to take on new challenges","I feel I am building future-relevant skills"] },
  "Clarity": { low: ["I spend more time searching for information or clarification","I do more duplicate work or rework","Work is delayed due to misunderstandings or unclear handoffs","I experience more unexpected changes that disrupt flow","Ownership between people/teams becomes unclear"], high: ["Work flows better (less waiting, fewer delays)","I spend less time searching for information/clarification","Fewer misunderstandings and smoother handoffs","I can plan my week better and maintain focus","Less rework and higher efficiency"] },
  "Balance": { low: ["I cancel plans or skip social/hobby activities more often due to work","I feel always on outside working hours","I experience less recovery during personal time","I experience more friction at home (family/friends)","I struggle more to maintain routines (exercise, meals, bedtime)"], high: ["I am more present outside work (family/friends)","I recover better in my personal time and show up refreshed","I can maintain routines better (exercise, meals, sleep)","I can plan personal time without work interfering","Less friction at home due to work"] },
  "Health": { low: ["I recover less well after demanding days","I more often experience physical tension or discomfort","I more often have to push through the day","I notice reduced stamina in everyday activities","I more often have to take it easy or skip things due to physical strain"], high: ["I recover well after demanding days","I rarely experience physical tension/discomfort","I have good stamina throughout the day and in daily life","I can do what matters to me outside work without physical strain","My physical capacity supports my work rather than limits it"] },
  "Habits": { low: ["I struggle to stick to routines and habits","I procrastinate more and find it harder to get started","I more often end up on autopilot after work","I feel more restless and less mentally calm","I do fewer activities that genuinely restore me"], high: ["I maintain routines and habits that support me","I find it easier to start constructive activities after work","I more often do things that genuinely restore me","I feel calmer and clearer in daily life","I manage my personal time better (less autopilot)"] },
  "Hobbies": { low: ["I experience less joy or lightness in life overall","I nurture relationships less (more social withdrawal)","I feel less of a sense of identity outside work (life narrows)","My personal time feels less restorative","Work crowds out what energises me"], high: ["I experience more joy and recovery outside work","I nurture relationships and social life better","I feel a stronger identity outside work (life feels fuller)","Hobbies help me disconnect and return refreshed","Life supports my work (not only the other way around)"] },
  "Overall": { low: ["I more often feel overwhelmed (too much going on)","I am more easily irritated or short-tempered","I find it harder to enjoy time off (my mind doesn't switch off)","I feel less optimistic about the months ahead","I feel the current setup is not sustainable long-term"], high: ["I feel calmer and more stable in daily life","I am more patient and even-tempered in interactions","I am better able to enjoy time off and be present","I feel more optimistic about the months ahead","I feel work and life are sustainable long-term"] }
};

const IMPACT_WORKPLACE_EN = {
  "Workload": { low: ["Work or service quality decreases","Tasks are delayed or pile up","More rework and errors","Workload spills over to others","Less time for improvement and development"], high: ["Quality and delivery remain stable","Work flows more smoothly","Workload is shared more evenly","Time is available for improvement","Work is more sustainable long-term"] },
  "Energy": { low: ["Lower participation and initiative","Fatigue or negativity spreads","Peak periods are harder to manage","Higher risk of absence","Reduced operational flexibility"], high: ["Positive energy in the team","Better resilience during high pressure","Fewer absences","Greater day-to-day stability","Better customer/user experience"] },
  "Autonomy": { low: ["Decision-making slows down","Process bottlenecks increase","Lower employee initiative","More micromanagement","Unclear ownership"], high: ["Faster decisions","Work progresses independently","Higher initiative and problem-solving","Less need for micromanagement","Clear ownership"] },
  "Support": { low: ["Issues surface too late","Tasks remain blocked longer","More communication breakdowns","Less learning from mistakes","Less trust in the team"], high: ["Issues are raised early","Work gets unblocked faster","Better collaboration and information flow","More learning and development","Stronger psychological safety"] },
  "Development": { low: ["Less innovation and improvement","Role stagnation","Higher turnover intention","Underutilised skills","Weaker future capability"], high: ["More innovation and development","People grow into responsibility","Lower turnover","Better use of strengths","Stronger future capability"] },
  "Clarity": { low: ["Work is delayed due to lack of clarity","More duplicate work or rework","Misunderstandings between teams","Unexpected changes disrupt flow","Unclear handoffs"], high: ["Work flows more smoothly","Fewer misunderstandings","Clear handoffs","Better planning and focus","Less wasted time"] },
  "Balance": { low: ["Fatigue spreads in the team","Harder to staff peak periods","Higher burnout risk","Less operational stability","Increased absence"], high: ["People show up more refreshed","Better coverage during peak periods","Lower burnout risk","Greater stability","More sustainable workplace"] },
  "Health": { low: ["Physical strain affects work contribution","Reduced stamina over the day","Higher risk of illness","Harder to maintain consistent performance","Greater vulnerability to pressure"], high: ["More consistent performance","Better stamina throughout the day","Fewer sick days","More energy in the team","Healthier work environment"] },
  "Habits": { low: ["Lower day-to-day focus","Harder to maintain routines","More distraction and disorganisation","Lower efficiency","Harder to sustain balance"], high: ["Better daily focus","Clearer routines","Higher efficiency","Fewer distractions","More stable work flow"] },
  "Hobbies": { low: ["Less recovery outside work","More fatigue at work","Life becomes too work-centred","Lower long-term resilience","Higher burnout risk"], high: ["Better recovery between workdays","More energy at work","Stronger long-term resilience","Life supports work (not only the other way around)","Healthier balance"] },
  "Overall": { low: ["Tension spreads in interactions","Collaboration under pressure becomes harder","Lower optimism in the team","Weaker connection to the workplace","Reduced organisational sustainability"], high: ["Calm and stability in collaboration","Better teamwork under pressure","Higher optimism and trust","Stronger connection to the workplace","More sustainable organisational culture"] }
};

const IMPACT_PERSONAL_IS = {
  "Vinnuálag": { low: ["Gæði vinnunnar minnka","Ég geri fleiri mistök eða þarf oftar að endurtaka vinnu","Ég næ síður að ljúka við verkefni á réttum tíma","Ég hef minni tíma til að vinna hlutina vel","Ég er óþolinmóðari í samskiptum","Vinnan hefur áhrif á mig utan vinnu (ég á erfitt með að skilja vinnuna eftir)"], high: ["Ég hef svigrúm til að vinna hlutina vel","Ég næ betur að standa við tímaáætlanir","Ég get hjálpað öðrum eða stutt teymið þegar þarf","Ég hef tíma til að bæta ferla/leiðir","Ég upplifi færri mistök og þarf síður að gera hlutina aftur","Vinnan hefur minni áhrif á frítíma og á auðvelt með að leggja vinnuna til hliðar"] },
  "Orka": { low: ["Ég dreg mig meira í hlé og tek síður þátt","Ég á erfiðara með að vera jákvæð/ur eða hvetjandi í samskiptum","Ég þarf oftar að keyra mig áfram til að ljúka verkefni","Ég upplifi að vinnan kosti mig meira en hún skilar","Ég legg mig síður fram umfram lágmark"], high: ["Ég kem með jákvæðan kraft inn í teymið","Ég er líklegri til að leggja mig fram umfram lágmark","Ég á auðveldara með að takast á við álagstíma án þess að brotna niður","Ég næ betur að vera skapandi og finna lausnir","Ég upplifi að vinnan gefi mér uppbyggilega orku sem nýtist líka utan vinnu"] },
  "Sjálfræði": { low: ["Ég bíð oftar eftir samþykki/leiðbeiningum áður en ég vinn verkefnin","Ákvarðanir tefjast og verkefni standa í stað","Ég forðast að taka ábyrgð á nýjum hlutum","Mér finnst minnstu smáatriðum stýrt","Ég legg síður fram hugmyndir um breytingar/umbætur"], high: ["Ég tek ákvarðanir hraðar og leysi mál sjálfstætt","Ég tek meiri frumkvæði og legg fram umbótahugmyndir","Ég get lagað vinnubrögð að því sem virkar best","Ég upplifi meira traust og minni eftirlit frá yfirmanni","Verkefni flæða hraðar í gegn"] },
  "Stuðningur": { low: ["Ég held frekar aftur af mér að tala um vandamál eða áhættu","Ég sit oftar lengur með verkefni af því mig vantar aðstoð","Misskilningur eykst og samskipti verða erfiðari","Ég upplifi meiri einangrun í verkefnum","Ég læri síður af mistökum"], high: ["Ég þori af fyrra bragði að ræða mál snemma","Ég leysi hraðar úr hindrunum (fæ hjálp þegar þarf)","Samvinna gengur betur og verkefni fara hraðar í gegn","Ég læri hraðar og þróast meira í starfi","Ég upplifi meira öryggi í samskiptum"] },
  "Þróun": { low: ["Ég upplifi meiri leiða eða áhugaleysi í verkefnum","Ég finn fyrir litlum framgangi í starfinu frá mánuði til mánaðar","Ég veigra mig við að leggja fram hugmyndir","Ég velti oftar fyrir mér að skipta um starf","Ég finn að styrkleikar mínir nýtast ekki í starfi"], high: ["Ég finn meiri metnað til að leggja fram hugmyndir og bæta hluti","Ég upplifi reglulega framfarir og næsta skref","Ég finn meiri helgun/áhuga á að vera áfram í starfinu","Ég tek frekar að mér áskoranir og ný verkefni","Ég upplifi að ég sé að byggja upp færni til framtíðar"] },
  "Skipulag": { low: ["Ég eyði meiri tíma í að leita að upplýsingum eða fá skýringar","Ég geri oftar tvíverkningar eða vinn oft hluti sem þarf að endurtaka","Verkefni tefjast vegna misskilnings eða óljósra væntinga","Ég upplifi óvæntar breytingar sem trufla flæði","Ábyrgð milli fólks/teyma verður óljós"], high: ["Verkefni flæða betur (minni bið, færri tafir)","Ég eyði minni tíma í að leita að upplýsingum/skýringum","Færri misskilningar og betri afhendingar milli fólks/teyma","Ég get planað vikuna betur og haldið fókus","Minna rework og meiri skilvirkni"] },
  "Jafnvægi": { low: ["Ég hætti oft við eða sleppi félagslífi/áhugamálum vegna vinnu","Ég er oft með hugann við vinnuna utan vinnutíma","Ég upplifi minni endurheimt í frítíma","Það skapast meiri núningur heima","Ég á erfiðara með að halda rútínu"], high: ["Ég er meira til staðar utan vinnu (fjölskylda/vinir)","Ég endurheimti mig betur í frítíma og mæti endurnærð/ur","Ég get haldið rútínu betur (hreyfing, mat, svefn)","Ég get planað frítíma án þess að vinnan trufli","Minni núningur heima vegna vinnu"] },
  "Heilsa": { low: ["Ég næ síður að jafna mig eftir erfiða daga","Ég finn oftar fyrir líkamlegri spennu eða óþægindum","Ég þarf oftar að harka af mér í gegnum daginn","Ég finn að líkamleg geta/þol er minna í daglegum verkefnum","Ég þarf oftar að taka því rólega eða sleppa hlutum vegna líkamlegrar þreytu"], high: ["Ég jafna mig vel eftir erfiða daga og finn fyrir góðri endurheimt","Ég finn sjaldnar fyrir líkamlegri spennu/óþægindum","Ég hef gott úthald yfir daginn og í daglegu lífi","Ég get sinnt því sem skiptir mig máli utan vinnu án þess að vera úrvinda","Ég finn að líkamleg geta styður mig í starfi"] },
  "Venjur": { low: ["Ég á erfitt með að sinna rútínunni minni","Ég fresta meira og á erfiðara með að byrja á hlutum","Ég enda oft á sjálfsstýringunni eftir vinnu","Ég finn meiri óróleika og minna rólegt hugarástand","Ég næ síður að gera hluti sem endurnæra mig raunverulega"], high: ["Ég held góðri rútínu sem styður mig","Ég byrja auðveldara á uppbyggilegum hlutum eftir vinnu","Ég næ oftar að gera hluti sem endurnæra mig raunverulega","Ég finn meiri ró og skýrleika í daglegu lífi","Ég stýri frítíma mínum betur"] },
  "Áhugamál": { low: ["Ég finn minna fyrir gleði eða léttleika í lífinu almennt","Ég rækta síður tengsl við fólk","Ég upplifi að sjálfsmynd mín og trú á eigin getu er lág","Ég upplifi að frítími skili minni endurheimt","Ég finn að vinnan hefur áhrif á það sem nærir mig"], high: ["Ég finn meiri gleði og endurheimt utan vinnu","Ég rækta betur tengsl og félagslíf","Ég upplifi sterkari sjálfsmynd utan vinnu","Áhugamál hjálpa mér að aftengja mig og mæta endurnærð/ur","Ég finn að lífið nærir vinnuna (ekki bara öfugt)"] },
  "Heildarlíðan": { low: ["Ég finn oftar fyrir yfirþyrmandi tilfinningu (of mikið í gangi)","Ég pirrast auðveldlega","Ég á erfiðara með að njóta frítíma því hugurinn er í vinnunni","Ég finn minni bjartsýni um næstu mánuði","Ég upplifi að kerfið sé ekki sjálfbært til lengri tíma"], high: ["Ég finn meiri ró og stöðugleika í daglegu lífi","Ég er þolinmóðari og jafnari í samskiptum","Ég næ betur að njóta frítíma og vera til staðar","Ég finn meiri bjartsýni og trú á næstu mánuði","Ég upplifi að líf og vinna séu sjálfbær til lengri tíma"] }
};

const IMPACT_WORKPLACE_IS = {
  "Vinnuálag": { low: ["Gæði eða þjónusta við viðskiptavini getur verið lakari","Verkefni tefjast eða safnast upp","Meiri hætta á mistökum","Álag færist yfir á aðra í teyminu","Minni tími til umbóta og þróunar"], high: ["Gæði og afhending haldast stöðug","Verkefni flæða betur í gegn","Álag dreifist jafnar í teyminu","Tími skapast fyrir umbætur","Vinnan er sjálfbær til lengri tíma"] },
  "Orka": { low: ["Minni þátttaka og frumkvæði innan teymisins","Þreyta eða neikvæð stemning hefur áhrif á samstarfsfólk","Erfiðara að takast á við álagstíma","Meiri hætta á fjarvistum","Minni sveigjanleiki í rekstri"], high: ["Jákvæð orka í teyminu","Betri seigla þegar álag eykst","Færri fjarvistir","Meiri stöðugleiki í daglegum rekstri","Betri upplifun fyrir viðskiptavini/notendur"] },
  "Sjálfræði": { low: ["Ákvarðanir tefjast","Flöskuhálsar og verkefni eiga á hættu að sitja föst","Minna frumkvæði hjá starfsfólki","Meira einblínt á smáatriði","Óljós ábyrgð"], high: ["Ákvarðanir teknar hraðar","Verkefni flæða sjálfstæðar í gegn","Meira frumkvæði og lausnamiðun","Minni þörf fyrir smáatriðastýringu","Skýr ábyrgð í teyminu"] },
  "Stuðningur": { low: ["Vandamál koma seint upp","Flöskuháls myndast","Meiri misskilningur í samskiptum","Minni lærdómur af mistökum","Minna traust innan teymisins"], high: ["Vandamál eru leyst snemma","Verkefni leysast hraðar","Betri samvinna og upplýsingaflæði","Meiri lærdómur og þróun","Sterkara sálrænt öryggi"] },
  "Þróun": { low: ["Minni nýsköpun og umbætur","Stöðnun innan teymisins","Hugsa oftar um að hætta í starfinu","Færni mín nýtist verr innan teymisins","Erfiðara að byggja framtíðarhæfni"], high: ["Meiri nýsköpun og þróun","Fólk vex inn í ábyrgð","Minni starfsmannavelta","Styrkleikar nýtast betur","Betri framtíðarhæfni vinnustaðar"] },
  "Skipulag": { low: ["Verkefni tefjast vegna óskýrleika","Meiri tvíverknaður","Misskilningur milli teyma","Ófyrirséðar breytingar trufla flæði","Óljóst hver eigi að ljúka verkefninu"], high: ["Verkefni flæða betur í gegn","Færri misskilningar","Skýr afhending milli teyma","Betri skipulagning og fókus","Minna sóun á tíma"] },
  "Jafnvægi": { low: ["Meiri þreyta smitast í teymið","Erfiðara að manna álagstíma","Meiri líkur á kulnun","Minni stöðugleiki í rekstri","Aukin fjarvist eða veikindi"], high: ["Fólk mætir endurnært til vinnu","Betri viðvera í álagstímum","Minni kulnunaráhætta","Meiri stöðugleiki","Sjálfbærari vinnustaður"] },
  "Heilsa": { low: ["Meiri líkamleg þreyta hefur áhrif á vinnuframlag","Færni og þol minnka yfir daginn","Meiri líkur á veikindum","Erfiðara að halda jöfnum afköstum","Meiri viðkvæmni fyrir álagi"], high: ["Jöfn og stöðug frammistaða","Betra úthald yfir vinnudaginn","Færri veikindadagar","Meiri orka í teyminu","Heilsusamlegra vinnuumhverfi"] },
  "Venjur": { low: ["Minni einbeiting í daglegu starfi","Erfiðara að halda rútínu í teyminu","Meiri truflun og óskipulag","Minni skilvirkni","Erfiðara að viðhalda jafnvægi"], high: ["Betri einbeiting í daglegu starfi","Skýrari rútína í teyminu","Meiri skilvirkni","Minni truflun","Stöðugra vinnuflæði"] },
  "Áhugamál": { low: ["Minni endurheimt utan vinnu","Meiri þreyta í vinnu","Lífið þrengist of mikið að vinnu","Minni langtímaseigla","Aukin kulnunaráhætta"], high: ["Betri endurheimt milli vinnudaga","Meiri orka í vinnu","Betri langtímaseigla","Mitt eigið líf styður vinnuna","Heilbrigðara jafnvægi"] },
  "Heildarlíðan": { low: ["Spenna verður í samskiptum","Erfiðara að vinna saman undir álagi","Minni bjartsýni í teyminu","Veikari tenging við vinnustaðinn","Sjálfbærni vinnustaðarins veikist"], high: ["Ró og stöðugleiki í samstarfi","Betri samvinna í krefjandi aðstæðum","Meiri bjartsýni og traust","Sterkari tenging við vinnustaðinn","Sjálfbær vinnustaðamenning"] }
};

function computeScores(answers, lang) {
  const questions = QUESTIONS[lang];
  const catScores = {}, catCounts = {};
  answers.forEach((val, i) => {
    if (val === null || val === undefined) return;
    const q = questions[i];
    const score = q.rev ? (7 - val) : val;
    if (!catScores[q.cat]) { catScores[q.cat] = 0; catCounts[q.cat] = 0; }
    catScores[q.cat] += score;
    catCounts[q.cat]++;
  });
  const avgs = {};
  Object.keys(catScores).forEach(c => { avgs[c] = catScores[c] / catCounts[c]; });
  return avgs;
}

function getBottomTop(avgs) {
  const entries = Object.entries(avgs).sort((a, b) => a[1] - b[1]);
  const low = entries.filter(([,v]) => v < 3.5).slice(0, 4).map(([k]) => k);
  const high = entries.filter(([,v]) => v > 4.5).reverse().slice(0, 4).map(([k]) => k);
  return { low, high };
}

const ScoreBar = ({ value }) => {
  const pct = Math.round(((value - 1) / 5) * 100);
  const color = value < 3.5 ? "#E24B4A" : value > 4.5 ? "#1D9E75" : "#BA7517";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "var(--color-background-tertiary)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", minWidth: 28 }}>{value.toFixed(1)}</span>
    </div>
  );
};

function RadarChart({ scores, catMap, userName, t }) {
  const svgRef = useRef(null);
  const cats = Object.keys(scores);
  const n = cats.length;
  const cx = 210, cy = 210, R = 150;

  function angle(i) { return (Math.PI * 2 * i / n) - Math.PI / 2; }
  function toXY(val, i) {
    const r = (val / 6) * R;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  }

  const gridLevels = [1, 2, 3, 4, 5, 6];

  const userPoly = cats.map((c, i) => toXY(scores[c], i).join(",")).join(" ");
  const midPoly = cats.map((_, i) => toXY(3.5, i).join(",")).join(" ");

  const PAD = 52;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
          <span style={{ width: 24, height: 3, background: "#1D9E75", display: "inline-block", borderRadius: 2 }}></span>
          {t.radar_legend_you}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
          <span style={{ width: 24, height: 2, background: "#B4B2A9", display: "inline-block", borderRadius: 2, borderTop: "2px dashed #B4B2A9" }}></span>
          {t.radar_legend_mid}
        </span>
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${(cx + R + PAD) * 2} ${(cy + R + PAD) * 2 - 90}`} style={{ width: "100%", display: "block", marginBottom: "-16px" }}
        role="img" aria-label={`Radar chart showing well-being scores for ${userName} across ${n} categories`}>

        {gridLevels.map(lv => {
          const pts = cats.map((_, i) => toXY(lv, i).join(",")).join(" ");
          return <polygon key={lv} points={pts}
            fill={lv === 3 ? "rgba(136,135,128,0.06)" : "none"}
            stroke={lv === 6 ? "rgba(136,135,128,0.35)" : "rgba(136,135,128,0.18)"}
            strokeWidth={lv === 6 ? "1.5" : "0.8"} />;
        })}

        {cats.map((_, i) => {
          const [x2, y2] = toXY(6, i);
          return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(136,135,128,0.2)" strokeWidth="0.8" />;
        })}

        <polygon points={midPoly} fill="none" stroke="#B4B2A9" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.7" />

        <polygon points={userPoly}
          fill="rgba(29,158,117,0.15)"
          stroke="#1D9E75" strokeWidth="2.5" strokeLinejoin="round" />

        {cats.map((c, i) => {
          const [px, py] = toXY(scores[c], i);
          const isLow = scores[c] < 3.5, isHigh = scores[c] > 4.5;
          const dotColor = isLow ? "#E24B4A" : isHigh ? "#1D9E75" : "#BA7517";
          return (
            <g key={c}>
              <circle cx={px} cy={py} r="5.5" fill={dotColor} stroke="white" strokeWidth="2" />
            </g>
          );
        })}

        {cats.map((c, i) => {
          const ang = angle(i);
          const lx = cx + (R + PAD - 6) * Math.cos(ang);
          const ly = cy + (R + PAD - 6) * Math.sin(ang);
          const anchor = Math.abs(Math.cos(ang)) < 0.2 ? "middle" : Math.cos(ang) < 0 ? "end" : "start";
          const isLow = scores[c] < 3.5, isHigh = scores[c] > 4.5;
          const scoreCol = isLow ? "#A32D2D" : isHigh ? "#0F6E56" : "#854F0B";
          const label = catMap[c] || c;
          const shortLabel = label.length > 12 ? label.split(/[\s–\-]/)[0] : label;

          return (
            <g key={c}>
              <text x={lx} y={ly - 6} textAnchor={anchor} fontSize="11" fontWeight="500"
                fill="var(--color-text-secondary, #555)">{shortLabel}</text>
              <text x={lx} y={ly + 9} textAnchor={anchor} fontSize="12" fontWeight="600"
                fill={scoreCol}>{scores[c].toFixed(1)}</text>
            </g>
          );
        })}

        {[2, 4, 6].map(lv => {
          const [tx, ty] = toXY(lv, 0);
          return (
            <text key={lv} x={tx + 4} y={ty + 3} fontSize="9" fill="rgba(136,135,128,0.5)" textAnchor="start">{lv}</text>
          );
        })}
      </svg>
    </div>
  );
}


async function generateReportPDF(name, email, scores, catMapLabel, lang) {
  // Wait for jsPDF
  let attempts = 0;
  while (!window.jspdf && attempts < 40) {
    await new Promise(r => setTimeout(r, 150));
    attempts++;
  }
  if (!window.jspdf) return null;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const ml = 18, mr = 18, contentW = W - ml - mr;

  // ── Helpers ──
  const hex2rgb = h => {
    const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
    return [r,g,b];
  };
  const setFill = (col) => { const [r,g,b] = hex2rgb(col); doc.setFillColor(r,g,b); };
  const setDraw = (col) => { const [r,g,b] = hex2rgb(col); doc.setDrawColor(r,g,b); };
  const setTxt  = (col) => { const [r,g,b] = hex2rgb(col); doc.setTextColor(r,g,b); };

  // ── Header bar ──
  setFill("#1D9E75");
  doc.rect(0, 0, W, 22, "F");
  doc.setFont("helvetica","bold");
  doc.setFontSize(13);
  setTxt("#FFFFFF");
  doc.text("Well-being Coaching Report", ml, 14);
  doc.setFont("helvetica","normal");
  doc.setFontSize(9);
  doc.text(new Date().toLocaleDateString("en-GB", {day:"numeric",month:"long",year:"numeric"}), W - mr, 14, { align: "right" });

  // ── Participant info ──
  let y = 32;
  setTxt("#1a1a1a");
  doc.setFont("helvetica","bold"); doc.setFontSize(16);
  doc.text(name, ml, y); y += 7;
  doc.setFont("helvetica","normal"); doc.setFontSize(9);
  setTxt("#666666");
  doc.text(email, ml, y); y += 10;

  // ── Divider ──
  setDraw("#e0e0e0"); doc.setLineWidth(0.3);
  doc.line(ml, y, W - mr, y); y += 8;

  // ── Radar Chart ──
  setTxt("#1a1a1a");
  doc.setFont("helvetica","bold"); doc.setFontSize(11);
  doc.text(lang === "en" ? "Your Well-being Profile" : "Líðansnið þitt", ml, y); y += 8;

  const cats = Object.keys(scores);
  const n = cats.length;
  const cx = W / 2, cy = y + 52, R = 42;
  const ang = i => (Math.PI * 2 * i / n) - Math.PI / 2;
  const toXY = (val, i) => [cx + (val/6)*R*Math.cos(ang(i)), cy + (val/6)*R*Math.sin(ang(i))];

  // Grid rings
  [1,2,3,4,5,6].forEach(lv => {
    const pts = cats.map((_,i) => toXY(lv,i));
    doc.setLineWidth(lv===6 ? 0.4 : 0.2);
    setDraw(lv===6 ? "#aaaaaa" : "#dddddd");
    doc.setFillColor(255,255,255);
    pts.forEach((p,i) => i===0 ? doc.moveTo ? null : null : null);
    for (let i=0;i<pts.length;i++){
      const [x1,y1]=pts[i], [x2,y2]=pts[(i+1)%pts.length];
      doc.line(x1,y1,x2,y2);
    }
  });

  // Midpoint dashed ring (3.5)
  const midPts = cats.map((_,i)=>toXY(3.5,i));
  setDraw("#B4B2A9"); doc.setLineWidth(0.35);
  for(let i=0;i<midPts.length;i++){
    const [x1,y1]=midPts[i],[x2,y2]=midPts[(i+1)%midPts.length];
    doc.setLineDashPattern([0.8,0.8],0);
    doc.line(x1,y1,x2,y2);
  }
  doc.setLineDashPattern([],0);

  // Axes
  cats.forEach((_,i)=>{
    const [x2,y2]=toXY(6,i);
    setDraw("#cccccc"); doc.setLineWidth(0.2);
    doc.line(cx,cy,x2,y2);
  });

  // User polygon fill
  const userPts = cats.map((c,i)=>toXY(scores[c],i));
  doc.setFillColor(29,158,117);
  doc.setGState(new doc.GState({opacity:0.15}));
  // Draw filled polygon
  const polyLines = userPts.map((p,i)=>({op: i===0?"m":"l", x:p[0], y:p[1]}));
  // jsPDF polygon via lines
  doc.setLineWidth(0); setDraw("#1D9E75");
  // Fill workaround: draw as closed path
  doc.setGState(new doc.GState({opacity:1}));
  // Stroke
  setDraw("#1D9E75"); doc.setLineWidth(0.7);
  userPts.forEach((p,i)=>{
    const next=userPts[(i+1)%userPts.length];
    doc.line(p[0],p[1],next[0],next[1]);
  });

  // Dots
  cats.forEach((c,i)=>{
    const v = scores[c];
    const [px,py]=toXY(v,i);
    const isLow=v<3.5,isHigh=v>4.5;
    setFill(isLow?"#E24B4A":isHigh?"#1D9E75":"#BA7517");
    doc.circle(px,py,1.4,"F");
    setFill("#ffffff");
    doc.circle(px,py,0.6,"F");
  });

  // Labels
  const PAD = 13;
  cats.forEach((c,i)=>{
    const a=ang(i);
    const lx=cx+(R+PAD)*Math.cos(a), ly=cy+(R+PAD)*Math.sin(a);
    const anchor=Math.abs(Math.cos(a))<0.2?"center":Math.cos(a)<0?"right":"left";
    const v=scores[c]; const isLow=v<3.5,isHigh=v>4.5;
    const label=(catMapLabel[c]||c).split(/[\s–\-]/)[0];
    doc.setFont("helvetica","normal"); doc.setFontSize(6.5);
    setTxt("#555555");
    doc.text(label, lx, ly-1.5, {align: anchor});
    doc.setFont("helvetica","bold"); doc.setFontSize(7);
    setTxt(isLow?"#A32D2D":isHigh?"#0F6E56":"#854F0B");
    doc.text(v.toFixed(1), lx, ly+3.5, {align: anchor});
  });

  y = cy + R + PAD + 12;

  // ── Divider ──
  setDraw("#e0e0e0"); doc.setLineWidth(0.3);
  doc.line(ml, y, W-mr, y); y += 8;

  // ── Score Overview ──
  setTxt("#1a1a1a");
  doc.setFont("helvetica","bold"); doc.setFontSize(11);
  doc.text(lang==="en"?"Score Overview":"Yfirlit yfir stig", ml, y); y += 7;

  const sorted = Object.entries(scores).sort((a,b)=>a[1]-b[1]);
  const barMaxW = contentW - 40;

  sorted.forEach(([cat,val]) => {
    const isLow=val<3.5, isHigh=val>4.5;
    const col=isLow?"#E24B4A":isHigh?"#1D9E75":"#BA7517";
    const label=catMapLabel[cat]||cat;
    // Label
    doc.setFont("helvetica", isLow||isHigh?"bold":"normal");
    doc.setFontSize(8.5);
    setTxt(isLow?"#A32D2D":isHigh?"#0F6E56":"#333333");
    doc.text(label, ml, y+2.5);
    // Bar background
    setFill("#eeeeee");
    doc.roundedRect(ml+38, y-1.5, barMaxW, 5, 1, 1, "F");
    // Bar fill
    const fillW = ((val-1)/5)*barMaxW;
    setFill(col);
    doc.roundedRect(ml+38, y-1.5, fillW, 5, 1, 1, "F");
    // Score number
    doc.setFont("helvetica","bold"); doc.setFontSize(8.5);
    setTxt(isLow?"#A32D2D":isHigh?"#0F6E56":"#555555");
    doc.text(val.toFixed(1), W-mr, y+2.5, {align:"right"});
    y += 8;
  });

  y += 4;

  // ── Legend ──
  const legendItems = [
    {col:"#E24B4A", label: lang==="en"?"Struggling (<3.5)":"Erfitt (<3.5)"},
    {col:"#BA7517", label: lang==="en"?"Moderate":"Miðlungs"},
    {col:"#1D9E75", label: lang==="en"?"Thriving (>4.5)":"Blómstrar (>4.5)"}
  ];
  let lx2 = ml;
  legendItems.forEach(({col,label})=>{
    setFill(col); doc.circle(lx2+1.5, y, 1.5, "F");
    doc.setFont("helvetica","normal"); doc.setFontSize(7.5);
    setTxt("#666666");
    doc.text(label, lx2+5, y+1);
    lx2 += doc.getTextWidth(label) + 12;
  });

  y += 10;

  // ── Footer ──
  setFill("#f5f5f5");
  doc.rect(0, H-14, W, 14, "F");
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5);
  setTxt("#999999");
  doc.text("Well-being Coaching Report — Confidential", ml, H-6);
  doc.text(`Generated for ${name}`, W-mr, H-6, {align:"right"});

  return doc.output("datauristring").split(",")[1];
}


function printReport(name, email, coachName, scores, catMapLabel, aiSummary, lang) {
  const isLow = v => v < 3.5;
  const isHigh = v => v > 4.5;
  const color = v => isLow(v) ? "#A32D2D" : isHigh(v) ? "#0F6E56" : "#5a4a00";
  const barColor = v => isLow(v) ? "#E24B4A" : isHigh(v) ? "#1D9E75" : "#BA7517";

  const sorted = Object.entries(scores).sort((a,b) => a[1]-b[1]);
  const maxW = 320;

  const scoreRows = sorted.map(([cat, val]) => {
    const fill = Math.round(((val-1)/5)*maxW);
    return `<tr>
      <td style="padding:4px 0;font-size:12px;color:${color(val)};font-weight:${isLow(val)||isHigh(val)?600:400};width:160px">${catMapLabel[cat]||cat}</td>
      <td style="padding:4px 8px;width:${maxW}px">
        <div style="background:#eee;border-radius:4px;height:8px;width:${maxW}px">
          <div style="background:${barColor(val)};height:8px;width:${fill}px;border-radius:4px"></div>
        </div>
      </td>
      <td style="padding:4px 0;font-size:12px;font-weight:600;color:${color(val)};text-align:right">${val.toFixed(1)}</td>
    </tr>`;
  }).join("");

  // Radar SVG
  const radarSVG = (() => {
    const cats = Object.keys(scores);
    const n = cats.length;
    const cx = 220, cy = 220, R = 160, PAD = 48;
    const W = (cx + R + PAD) * 2;
    const H = (cy + R + PAD) * 2 - 90;
    const ang = i => (Math.PI * 2 * i / n) - Math.PI / 2;
    const toXY = (val, i) => [cx + (val/6)*R*Math.cos(ang(i)), cy + (val/6)*R*Math.sin(ang(i))];

    // Grid rings
    let gridLines = "";
    for (let lv = 1; lv <= 6; lv++) {
      const pts = cats.map((_,i) => toXY(lv,i).join(",")).join(" ");
      gridLines += `<polygon points="${pts}" fill="${lv===3?"rgba(136,135,128,0.06)":"none"}" stroke="${lv===6?"rgba(136,135,128,0.4)":"rgba(136,135,128,0.2)"}" stroke-width="${lv===6?1.5:0.7}"/>`;
    }

    // Axes
    let axes = cats.map((_,i) => {
      const [x2,y2] = toXY(6,i);
      return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="rgba(136,135,128,0.2)" stroke-width="0.7"/>`;
    }).join("");

    // Midpoint dashed
    const midPts = cats.map((_,i) => toXY(3.5,i).join(",")).join(" ");
    const midLine = `<polygon points="${midPts}" fill="none" stroke="#B4B2A9" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.7"/>`;

    // User polygon
    const userPts = cats.map((c,i) => toXY(scores[c],i).join(",")).join(" ");
    const userPoly = `<polygon points="${userPts}" fill="rgba(29,158,117,0.15)" stroke="#1D9E75" stroke-width="2.5" stroke-linejoin="round"/>`;

    // Dots
    const dots = cats.map((c,i) => {
      const [px,py] = toXY(scores[c],i);
      const dc = isLow(scores[c])?"#E24B4A":isHigh(scores[c])?"#1D9E75":"#BA7517";
      return `<circle cx="${px}" cy="${py}" r="5.5" fill="${dc}" stroke="white" stroke-width="2"/>`;
    }).join("");

    // Labels
    const labels = cats.map((c,i) => {
      const a = ang(i);
      const lx = cx + (R+PAD-4)*Math.cos(a);
      const ly = cy + (R+PAD-4)*Math.sin(a);
      const anchor = Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) < 0 ? "end" : "start";
      const sc = isLow(scores[c])?"#A32D2D":isHigh(scores[c])?"#0F6E56":"#854F0B";
      const lbl = (catMapLabel[c]||c).split(/[\s–-]/)[0];
      return `<text x="${lx}" y="${ly-5}" text-anchor="${anchor}" font-size="11" font-weight="500" fill="#555">${lbl}</text>
              <text x="${lx}" y="${ly+9}" text-anchor="${anchor}" font-size="12" font-weight="700" fill="${sc}">${scores[c].toFixed(1)}</text>`;
    }).join("");

    // Legend
    const legend = `<g transform="translate(${W/2-100},12)">
      <line x1="0" y1="7" x2="22" y2="7" stroke="#1D9E75" stroke-width="2.5"/>
      <text x="26" y="11" font-size="10" fill="#555">Your score</text>
      <line x1="100" y1="7" x2="122" y2="7" stroke="#B4B2A9" stroke-width="1.5" stroke-dasharray="5 3"/>
      <text x="126" y="11" font-size="10" fill="#555">Midpoint (3.5)</text>
    </g>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;max-width:500px;margin:0 auto">
      ${legend}${gridLines}${axes}${midLine}${userPoly}${dots}${labels}
    </svg>`;
  })();

  // Score badges
  const badges = Object.entries(scores).map(([cat,val]) => `
    <div style="display:inline-block;margin:4px;padding:4px 10px;border-radius:20px;background:${isLow(val)?"#FCEBEB":isHigh(val)?"#E1F5EE":"#f5f5f5"};border:1px solid ${isLow(val)?"#F09595":isHigh(val)?"#5DCAA5":"#ddd"}">
      <span style="font-size:11px;color:${color(val)};font-weight:600">${catMapLabel[cat]||cat}</span>
      <span style="font-size:12px;font-weight:700;color:${color(val)};margin-left:6px">${val.toFixed(1)}</span>
    </div>`).join("");

  const formattedSummary = (() => {
    if (!aiSummary) return "";
    const out = [];
    for (const line of aiSummary.split("\n")) {
      const t = line.trim();
      if (!t) { out.push("<br>"); continue; }
      if (t.startsWith("## ")) { out.push(`<h2 style="font-size:15px;font-weight:700;color:#1D9E75;margin:20px 0 6px;border-bottom:1px solid #e0e0e0;padding-bottom:4px">${t.slice(3)}</h2>`); continue; }
      if (t.startsWith("### ")) { out.push(`<h3 style="font-size:13px;font-weight:700;color:#333;margin:14px 0 4px">${t.slice(4)}</h3>`); continue; }
      if (t.startsWith("- ") || t.startsWith("* ")) { out.push(`<li style="margin:3px 0;font-size:12px;line-height:1.6">${t.slice(2).replace(/[*][*](.+?)[*][*]/g, "<strong>$1</strong>")}</li>`); continue; }
      out.push(`<p style="margin:5px 0;font-size:12px;line-height:1.6">${t.replace(/[*][*](.+?)[*][*]/g, "<strong>$1</strong>")}</p>`);
    }
    return out.join("");
  })();

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>Well-being Report — ${name}</title>
  <style>
    body { font-family: Georgia, serif; margin: 0; padding: 0; color: #222; }
    @media print { @page { margin: 15mm 12mm; size: A4; } }
    .header { background: #1D9E75; color: white; padding: 20px 30px; }
    .content { padding: 24px 30px; }
    table { border-collapse: collapse; }
  </style>
</head><body>
  <div class="header">
    <div style="font-size:20px;font-weight:700">Well-being Coaching Report</div>
    <div style="font-size:13px;margin-top:4px;opacity:0.9">${name} &nbsp;|&nbsp; ${email} &nbsp;|&nbsp; ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}${coachName ? " &nbsp;|&nbsp; Coach: " + coachName : ""}</div>
  </div>
  <div class="content">
    <h2 style="font-size:15px;font-weight:700;color:#1D9E75;margin:0 0 10px;border-bottom:1px solid #e0e0e0;padding-bottom:4px">Well-being Profile</h2>
    ${radarSVG}
    <div style="margin:0 0 12px">${badges}</div>
    <div style="display:flex;gap:12px;font-size:11px;color:#666;margin-bottom:20px">
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#E24B4A;margin-right:4px"></span>Struggling (&lt;3.5)</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#BA7517;margin-right:4px"></span>Moderate</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#1D9E75;margin-right:4px"></span>Thriving (&gt;4.5)</span>
    </div>
    <h2 style="font-size:15px;font-weight:700;color:#1D9E75;margin:0 0 10px;border-bottom:1px solid #e0e0e0;padding-bottom:4px">Score Overview</h2>
    <table style="width:100%;margin-bottom:24px">${scoreRows}</table>
    ${formattedSummary}
    <div style="margin-top:30px;padding-top:10px;border-top:1px solid #eee;font-size:10px;color:#999;text-align:center">Well-being Coaching Report — Confidential — Generated for ${name}</div>
  </div>
</body></html>`;

  // Remove any existing print iframe
  const existing = document.getElementById("print-iframe");
  if (existing) existing.remove();

  const iframe = document.createElement("iframe");
  iframe.id = "print-iframe";
  iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:99999;background:white;";
  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      // After print dialog closes, remove iframe
      setTimeout(() => {
        iframe.remove();
      }, 2000);
    }, 500);
  };

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  iframe.src = url;
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function generateParticipantHTML(name, coachName, scores, catMapLabel, bottomTop, personalSelections, workplaceSelections, personalOther, workplaceOther, lang) {
  const isLow = v => v < 3.5;
  const isHigh = v => v > 4.5;
  const barColor = v => isLow(v) ? "#E24B4A" : isHigh(v) ? "#1D9E75" : "#BA7517";
  const textColor = v => isLow(v) ? "#A32D2D" : isHigh(v) ? "#0F6E56" : "#5a4a00";
  const sorted = Object.entries(scores).sort((a,b) => a[1]-b[1]);
  const maxW = 280;

  const scoreRows = sorted.map(([cat, val]) => {
    const fill = Math.round(((val-1)/5)*maxW);
    return `<tr>
      <td style="padding:4px 0;font-size:12px;color:${textColor(val)};font-weight:${isLow(val)||isHigh(val)?600:400};width:150px;white-space:nowrap">${catMapLabel[cat]||cat}</td>
      <td style="padding:4px 8px;width:${maxW}px">
        <div style="background:#eee;border-radius:4px;height:7px;width:${maxW}px">
          <div style="background:${barColor(val)};height:7px;width:${fill}px;border-radius:4px"></div>
        </div>
      </td>
      <td style="padding:4px 0;font-size:12px;font-weight:600;color:${textColor(val)};text-align:right;white-space:nowrap">${val.toFixed(1)}</td>
    </tr>`;
  }).join("");

  const cats = Object.keys(scores);
  const n = cats.length;
  const cx = 200, cy = 190, R = 140, PAD = 46;
  const W = (cx + R + PAD) * 2;
  const H = (cy + R + PAD) * 2 - 80;
  const ang = i => (Math.PI * 2 * i / n) - Math.PI / 2;
  const toXY = (val, i) => [cx + (val/6)*R*Math.cos(ang(i)), cy + (val/6)*R*Math.sin(ang(i))];
  let gridLines = "";
  for (let lv = 1; lv <= 6; lv++) {
    const pts = cats.map((_,i) => toXY(lv,i).join(",")).join(" ");
    gridLines += `<polygon points="${pts}" fill="${lv===3?"rgba(136,135,128,0.06)":"none"}" stroke="${lv===6?"rgba(136,135,128,0.4)":"rgba(136,135,128,0.18)"}" stroke-width="${lv===6?1.5:0.7}"/>`;
  }
  const axes = cats.map((_,i) => { const [x2,y2]=toXY(6,i); return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="rgba(136,135,128,0.2)" stroke-width="0.7"/>`; }).join("");
  const midPts = cats.map((_,i) => toXY(3.5,i).join(",")).join(" ");
  const userPts = cats.map((c,i) => toXY(scores[c],i).join(",")).join(" ");
  const dots = cats.map((c,i) => { const [px,py]=toXY(scores[c],i); const dc=isLow(scores[c])?"#E24B4A":isHigh(scores[c])?"#1D9E75":"#BA7517"; return `<circle cx="${px}" cy="${py}" r="5" fill="${dc}" stroke="white" stroke-width="2"/>`; }).join("");
  const labels = cats.map((c,i) => {
    const a=ang(i); const lx=cx+(R+PAD-4)*Math.cos(a); const ly=cy+(R+PAD-4)*Math.sin(a);
    const anchor=Math.abs(Math.cos(a))<0.2?"middle":Math.cos(a)<0?"end":"start";
    const sc=isLow(scores[c])?"#A32D2D":isHigh(scores[c])?"#0F6E56":"#854F0B";
    const lbl=(catMapLabel[c]||c).split(/[\s\u2013-]/)[0];
    return `<text x="${lx}" y="${ly-5}" text-anchor="${anchor}" font-size="10.5" font-weight="500" fill="#555">${lbl}</text><text x="${lx}" y="${ly+8}" text-anchor="${anchor}" font-size="11" font-weight="700" fill="${sc}">${scores[c].toFixed(1)}</text>`;
  }).join("");
  const radarSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;max-width:480px;margin:0 auto">
    ${gridLines}${axes}
    <polygon points="${midPts}" fill="none" stroke="#B4B2A9" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.7"/>
    <polygon points="${userPts}" fill="rgba(29,158,117,0.15)" stroke="#1D9E75" stroke-width="2.5" stroke-linejoin="round"/>
    ${dots}${labels}
  </svg>`;

  const allCats = [...(bottomTop.low||[]), ...(bottomTop.high||[])];
  const followupHTML = allCats.map(c => {
    const isL = (bottomTop.low||[]).includes(c);
    const borderCol = isL ? "#E24B4A" : "#1D9E75";
    const bgCol = isL ? "#FDF2F2" : "#F0FAF6";
    const labelCol = isL ? "#A32D2D" : "#0F6E56";
    const badgeLabel = isL ? (lang==="en"?"Limiting condition":"Takmarkandi þáttur") : (lang==="en"?"Performance strength":"Styrkleiki");
    const pItems = (personalSelections[c]||[]).filter(x=>x!=="__other__");
    const pOther = personalOther[c] ? [personalOther[c]] : [];
    const wItems = (workplaceSelections[c]||[]).filter(x=>x!=="__other__");
    const wOther = workplaceOther[c] ? [workplaceOther[c]] : [];
    const allP = [...pItems,...pOther];
    const allW = [...wItems,...wOther];
    if (!allP.length && !allW.length) return "";
    return `<div style="margin-bottom:10px;border:0.5px solid ${borderCol};border-radius:8px;overflow:hidden">
      <div style="padding:7px 12px;background:${bgCol};border-bottom:0.5px solid ${borderCol};display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:13px;font-weight:600;color:${labelCol}">${catMapLabel[c]||c}</span>
        <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:white;border:0.5px solid ${borderCol};color:${labelCol}">${badgeLabel}</span>
      </div>
      <div style="padding:10px 12px">
        ${allP.length>0?`<p style="font-size:10px;font-weight:600;color:#666;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.04em">${lang==="en"?"Personal impact":"Persónuleg áhrif"}</p><ul style="margin:0 0 8px;padding-left:14px">${allP.map(i=>`<li style="font-size:11px;color:#333;line-height:1.7">${i}</li>`).join("")}</ul>`:""}
        ${allW.length>0?`<p style="font-size:10px;font-weight:600;color:#666;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.04em">${lang==="en"?"Workplace impact":"Áhrif á vinnustað"}</p><ul style="margin:0;padding-left:14px">${allW.map(i=>`<li style="font-size:11px;color:#333;line-height:1.7">${i}</li>`).join("")}</ul>`:""}
      </div>
    </div>`;
  }).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${lang==="en"?"Well-being Profile":"Vellíðunarprófíll"} — ${name}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Georgia, serif; margin: 0; padding: 0; color: #222; }
  @media print { @page { margin: 12mm 10mm; size: A4; } }
  .header { background: #1D9E75; color: white; padding: 20px 28px; }
  .section { padding: 14px 28px; border-bottom: 1px solid #eee; }
  .section-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin-bottom: 10px; }
  table { border-collapse: collapse; width: 100%; }
  .footer { padding: 10px 28px; font-size: 10px; color: #aaa; text-align: center; background: #f9f9f7; }
</style>
</head><body>
  <div class="header">
    <div style="font-size:16px;font-weight:600;margin-bottom:4px">${lang==="en"?"Well-being Profile":"Vellíðunarprófíll"}</div>
    <div style="font-size:10px;opacity:0.7;margin-bottom:8px;letter-spacing:0.05em">${lang==="en"?"PARTICIPANT COPY — FOR USE IN COACHING CONVERSATION":"EINTAK ÞÁTTTAKANDA — TIL NOTKUNAR Í ÞJÁLFUNARSAMTALI"}</div>
    <div style="font-size:12px;opacity:0.9;display:flex;flex-wrap:wrap;gap:16px">
      <span>&#128100; ${name}</span>
      <span>&#128101; ${lang==="en"?"Coach":"Þjálfari"}: ${coachName||"—"}</span>
      <span>&#128197; ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>
    </div>
  </div>
  <div class="section">
    <div class="section-title">${lang==="en"?"Well-being profile":"Vellíðunarprófíll"}</div>
    ${radarSVG}
    <div style="display:flex;justify-content:center;gap:20px;margin-top:8px;font-size:11px;color:#888">
      <span><span style="display:inline-block;width:20px;height:2.5px;background:#1D9E75;margin-right:5px;vertical-align:middle;border-radius:2px"></span>${lang==="en"?"Your score":"Stigin þín"}</span>
      <span><span style="display:inline-block;width:20px;height:0;border-top:1.5px dashed #B4B2A9;margin-right:5px;vertical-align:middle"></span>${lang==="en"?"Midpoint (3.5)":"Miðpunktur (3.5)"}</span>
    </div>
  </div>
  <div class="section">
    <div class="section-title">${lang==="en"?"Score overview":"Yfirlit yfir stig"}</div>
    <table>${scoreRows}</table>
    <div style="display:flex;gap:16px;margin-top:10px">
      ${[["#E24B4A",lang==="en"?"Below 3.5":"Undir 3.5"],["#BA7517",lang==="en"?"Moderate":"Miðlungs"],["#1D9E75",lang==="en"?"Above 4.5":"Yfir 4.5"]].map(([col,lbl])=>`<span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#888"><span style="width:8px;height:8px;border-radius:50%;background:${col};display:inline-block"></span>${lbl}</span>`).join("")}
    </div>
  </div>
  ${allCats.length>0?`<div class="section">
    <div class="section-title">${lang==="en"?"Your follow-up responses":"Svör þín úr framhaldsspurningunum"}</div>
    <p style="font-size:11px;color:#666;margin:0 0 12px;line-height:1.6;font-style:italic">${lang==="en"?"What you selected in the follow-up questions. Your coach will use this as a starting point for your conversation.":"Það sem þú valdir í framhaldsspurningunum. Þjálfarinn mun nota þetta sem upphafsgrunn fyrir samtalið."}</p>
    ${followupHTML}
  </div>`:""}
  <div class="footer">${lang==="en"?"Well-being Profile — Participant Copy — Confidential":"Vellíðunarprófíll — Eintak þátttakanda — Trúnaðarmál"} — ${name} — ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
</body></html>`;
}

function generateReportHTML(name, email, coachName, scores, catMapLabel, bottomTop, personalSelections, workplaceSelections, personalOther, workplaceOther, aiSummary, lang) {
  const isLow = v => v < 3.5;
  const isHigh = v => v > 4.5;
  const barColor = v => isLow(v) ? "#E24B4A" : isHigh(v) ? "#1D9E75" : "#BA7517";
  const textColor = v => isLow(v) ? "#A32D2D" : isHigh(v) ? "#0F6E56" : "#5a4a00";
  const sorted = Object.entries(scores).sort((a,b) => a[1]-b[1]);
  const maxW = 280;
  const t = {
    profile: lang==="en"?"Well-being profile":"Vellíðunarprófíll",
    scoreOverview: lang==="en"?"Score overview":"Yfirlit yfir stig",
    heatmap: lang==="en"?"Flow & performance heatmap":"Flæði- og frammistöðuhitakort",
    followup: lang==="en"?"Follow-up responses — what the participant selected":"Svörin sem þátttakandinn valdi",
    aiReport: lang==="en"?"AI coaching report":"AI þjálfunaskýrsla",
    part1title: lang==="en"?"Before the conversation":"Fyrir samtalið",
    part1desc: lang==="en"?"Read this to prepare — scores, patterns, and key observations":"Lestu þetta til undirbúnings — stig, mynstur og lykilathuganir",
    part2title: lang==="en"?"In the conversation":"Í samtali",
    part2desc: lang==="en"?"Keep this open during the session — coaching questions per area and conversation guide":"Hafðu þetta opið í samtali — þjálfunarspurningar og samtalsrammi",
    coachingFocus: lang==="en"?"Coaching focus — per area":"Þjálfunarfókus — eftir svæðum",
    coachingFocusIntro: lang==="en"?"Use the participant's own follow-up responses as entry points. The insight below is context for you — not a script.":"Notaðu eigin framhaldsspurningasvör þátttakandans sem inngangspunkta. Innsæið hér að neðan er samhengi fyrir þig — ekki handrit.",
    convFlow: lang==="en"?"Suggested conversation flow":"Tillaga að uppbyggingu samtals",
    convFlowIntro: lang==="en"?"Based on the DBW flow interview model. Use as a guide, not a script.":"Byggt á DBW flæðiviðtalslíkaninu. Notaðu sem leiðarvísi, ekki handrit.",
    limiting: lang==="en"?"Limiting":"Takmarkandi",
    strong: lang==="en"?"Strong":"Sterkur",
    personal: lang==="en"?"Personal":"Persónulegt",
    workplace: lang==="en"?"Workplace":"Vinnustaður",
    yourScore: lang==="en"?"Your score":"Stigin þín",
    midpoint: lang==="en"?"Midpoint (3.5)":"Miðpunktur (3.5)",
    limitingLabel: lang==="en"?"Limiting (<3.5)":"Takmarkandi (<3.5)",
    moderate: lang==="en"?"Moderate":"Miðlungs",
    strongLabel: lang==="en"?"Strong (>4.5)":"Sterkur (>4.5)",
    aiPending: lang==="en"?"AI report pending...":"AI skýrsla í vinnslu...",
    reminders: lang==="en"?"General reminders":"Almennar ábendingar",
    convo: lang==="en"?"Confidential — For coaching use only":"Trúnaðarmál — Eingöngu til þjálfunarnotkunar",
  };

  // Score bars
  const scoreRows = sorted.map(([cat, val]) => {
    const fill = Math.round(((val-1)/5)*maxW);
    return `<tr>
      <td style="padding:4px 0;font-size:12px;color:${textColor(val)};font-weight:${isLow(val)||isHigh(val)?600:400};width:150px;white-space:nowrap">${catMapLabel[cat]||cat}</td>
      <td style="padding:4px 8px;width:${maxW}px"><div style="background:#eee;border-radius:4px;height:7px;width:${maxW}px"><div style="background:${barColor(val)};height:7px;width:${fill}px;border-radius:4px"></div></div></td>
      <td style="padding:4px 0;font-size:12px;font-weight:600;color:${textColor(val)};text-align:right;white-space:nowrap">${val.toFixed(1)}</td>
    </tr>`;
  }).join("");

  // Radar SVG
  const cats = Object.keys(scores);
  const n = cats.length;
  const cx = 200, cy = 185, R = 135, PAD = 46;
  const W = (cx + R + PAD) * 2;
  const H = (cy + R + PAD) * 2 - 80;
  const ang = i => (Math.PI * 2 * i / n) - Math.PI / 2;
  const toXY = (val, i) => [cx + (val/6)*R*Math.cos(ang(i)), cy + (val/6)*R*Math.sin(ang(i))];
  let gridLines = "";
  for (let lv = 1; lv <= 6; lv++) {
    const pts = cats.map((_,i) => toXY(lv,i).join(",")).join(" ");
    gridLines += `<polygon points="${pts}" fill="${lv===3?"rgba(136,135,128,0.06)":"none"}" stroke="${lv===6?"rgba(136,135,128,0.4)":"rgba(136,135,128,0.18)"}" stroke-width="${lv===6?1.5:0.7}"/>`;
  }
  const axes = cats.map((_,i) => { const [x2,y2]=toXY(6,i); return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="rgba(136,135,128,0.2)" stroke-width="0.7"/>`; }).join("");
  const midPts = cats.map((_,i) => toXY(3.5,i).join(",")).join(" ");
  const userPts = cats.map((c,i) => toXY(scores[c],i).join(",")).join(" ");
  const dots = cats.map((c,i) => { const [px,py]=toXY(scores[c],i); const dc=isLow(scores[c])?"#E24B4A":isHigh(scores[c])?"#1D9E75":"#BA7517"; return `<circle cx="${px}" cy="${py}" r="5" fill="${dc}" stroke="white" stroke-width="2"/>`; }).join("");
  const labels = cats.map((c,i) => {
    const a=ang(i); const lx=cx+(R+PAD-4)*Math.cos(a); const ly=cy+(R+PAD-4)*Math.sin(a);
    const anchor=Math.abs(Math.cos(a))<0.2?"middle":Math.cos(a)<0?"end":"start";
    const sc=isLow(scores[c])?"#A32D2D":isHigh(scores[c])?"#0F6E56":"#854F0B";
    const lbl=(catMapLabel[c]||c).split(" ")[0];
    return `<text x="${lx}" y="${ly-5}" text-anchor="${anchor}" font-size="10.5" font-weight="500" fill="#555">${lbl}</text><text x="${lx}" y="${ly+8}" text-anchor="${anchor}" font-size="11" font-weight="700" fill="${sc}">${scores[c].toFixed(1)}</text>`;
  }).join("");
  const radarSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;max-width:480px;margin:0 auto">
    ${gridLines}${axes}
    <polygon points="${midPts}" fill="none" stroke="#B4B2A9" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.7"/>
    <polygon points="${userPts}" fill="rgba(29,158,117,0.15)" stroke="#1D9E75" stroke-width="2.5" stroke-linejoin="round"/>
    ${dots}${labels}
  </svg>`;

  // Flow drivers
  const flowDrivers = [
    {name:"Purpose", val:+(scores["clarity"]||scores[Object.keys(scores)[5]]||4)*0.45+(scores["development"]||4)*0.25+(scores["overall"]||scores[Object.keys(scores)[10]]||4)*0.20+(scores["support"]||4)*0.10},
    {name:"Motivation", val:+(scores["energy"]||scores[Object.keys(scores)[1]]||4)*0.30+(scores["hobbies"]||scores[Object.keys(scores)[9]]||4)*0.25+(scores["development"]||4)*0.20+(scores["overall"]||scores[Object.keys(scores)[10]]||4)*0.15+(scores["autonomy"]||4)*0.10},
    {name:"Challenge", val:+(scores["workload"]||scores[Object.keys(scores)[0]]||4)*0.45+(scores["development"]||4)*0.35+(scores["energy"]||scores[Object.keys(scores)[1]]||4)*0.20},
    {name:"Feedback", val:+(scores["support"]||4)*0.50+(scores["clarity"]||scores[Object.keys(scores)[5]]||4)*0.30+(scores["development"]||4)*0.20},
    {name:"Control", val:+(scores["autonomy"]||4)*0.50+(scores["workload"]||scores[Object.keys(scores)[0]]||4)*0.20+(scores["habits"]||scores[Object.keys(scores)[8]]||4)*0.20+(scores["clarity"]||scores[Object.keys(scores)[5]]||4)*0.10},
    {name:"Focus", val:+(scores["clarity"]||scores[Object.keys(scores)[5]]||4)*0.25+(scores["habits"]||scores[Object.keys(scores)[8]]||4)*0.20+(scores["health"]||scores[Object.keys(scores)[7]]||4)*0.20+(scores["workload"]||scores[Object.keys(scores)[0]]||4)*0.15+(scores["balance"]||scores[Object.keys(scores)[6]]||4)*0.10+(scores["energy"]||scores[Object.keys(scores)[1]]||4)*0.10},
    {name:"Personal growth", val:+(scores["development"]||4)*0.40+(scores["hobbies"]||scores[Object.keys(scores)[9]]||4)*0.20+(scores["health"]||scores[Object.keys(scores)[7]]||4)*0.15+(scores["overall"]||scores[Object.keys(scores)[10]]||4)*0.15+(scores["workload"]||scores[Object.keys(scores)[0]]||4)*0.10},
  ];

  // Calculate flow drivers properly from sorted score values
  const scoreVals = Object.values(scores);
  const fd = [
    {name:"Purpose", val:+(scoreVals[5]||4)*0.45+(scoreVals[4]||4)*0.25+(scoreVals[10]||4)*0.20+(scoreVals[3]||4)*0.10},
    {name:"Motivation", val:+(scoreVals[1]||4)*0.30+(scoreVals[9]||4)*0.25+(scoreVals[4]||4)*0.20+(scoreVals[10]||4)*0.15+(scoreVals[2]||4)*0.10},
    {name:"Challenge", val:+(scoreVals[0]||4)*0.45+(scoreVals[4]||4)*0.35+(scoreVals[1]||4)*0.20},
    {name:"Feedback", val:+(scoreVals[3]||4)*0.50+(scoreVals[5]||4)*0.30+(scoreVals[4]||4)*0.20},
    {name:"Control", val:+(scoreVals[2]||4)*0.50+(scoreVals[0]||4)*0.20+(scoreVals[8]||4)*0.20+(scoreVals[5]||4)*0.10},
    {name:"Focus", val:+(scoreVals[5]||4)*0.25+(scoreVals[8]||4)*0.20+(scoreVals[7]||4)*0.20+(scoreVals[0]||4)*0.15+(scoreVals[6]||4)*0.10+(scoreVals[1]||4)*0.10},
    {name:"Personal growth", val:+(scoreVals[4]||4)*0.40+(scoreVals[9]||4)*0.20+(scoreVals[7]||4)*0.15+(scoreVals[10]||4)*0.15+(scoreVals[0]||4)*0.10},
  ].map(d => ({...d, val: Math.round(d.val*10)/10}));

  const heatmapCards = fd.map(({name,val}) => {
    const isS=val>=4.5,isL=val<3.5;
    const sc=isS?"#0F6E56":isL?"#A32D2D":"#854F0B";
    const bg=isS?"#E1F5EE":isL?"#FCEBEB":"#FAEEDA";
    const lbl=isS?(lang==="en"?"Strong":"Sterkur"):isL?(lang==="en"?"Limiting":"Takmarkandi"):(lang==="en"?"Functional":"Virkt");
    return `<div style="padding:9px 11px;border-radius:8px;border:0.5px solid #e8e8e4;background:#fafaf8">
      <div style="font-size:11px;color:#666;margin-bottom:3px">${name}</div>
      <div style="font-size:17px;font-weight:500;color:${sc};margin-bottom:3px">${val.toFixed(1)}</div>
      <span style="display:inline-block;font-size:9px;font-weight:500;padding:2px 7px;border-radius:8px;background:${bg};color:${sc}">${lbl}</span>
    </div>`;
  }).join("");

  // Follow-up cards (Part 1 — no insight boxes)
  const allCats = [...(bottomTop.low||[]), ...(bottomTop.high||[])];
  const followupCardsSimple = allCats.map(c => {
    const isL=(bottomTop.low||[]).includes(c);
    const borderCol=isL?"#E24B4A":"#1D9E75";
    const bgCol=isL?"#FDF2F2":"#F0FAF6";
    const labelCol=isL?"#A32D2D":"#0F6E56";
    const pItems=(personalSelections[c]||[]).filter(x=>x!=="__other__");
    const pOther=personalOther[c]?[personalOther[c]]:[];
    const wItems=(workplaceSelections[c]||[]).filter(x=>x!=="__other__");
    const wOther=workplaceOther[c]?[workplaceOther[c]]:[];
    const allP=[...pItems,...pOther]; const allW=[...wItems,...wOther];
    if(!allP.length&&!allW.length) return "";
    return `<div style="margin-bottom:8px;border:0.5px solid ${borderCol};border-radius:8px;overflow:hidden">
      <div style="padding:7px 12px;background:${bgCol};border-bottom:0.5px solid ${borderCol};display:flex;align-items:center;justify-content:space-between">
        <span style="font-family:Georgia,serif;font-size:13px;font-weight:500;color:${labelCol}">${catMapLabel[c]||c} <span style="font-weight:400;font-size:11px;opacity:0.7">${scores[c].toFixed(1)}</span></span>
        <span style="font-size:9px;padding:2px 8px;border-radius:9px;background:white;border:0.5px solid ${borderCol};color:${labelCol}">${isL?t.limiting:t.strong}</span>
      </div>
      <div style="padding:10px 12px">
        ${allP.length>0?`<p style="font-size:10px;font-weight:500;color:#666;margin:0 0 3px;letter-spacing:0.03em">${t.personal}</p><ul style="padding-left:13px;margin:0 0 7px">${allP.map(i=>`<li style="font-size:11px;line-height:1.7">${i}</li>`).join("")}</ul>`:""}
        ${allW.length>0?`<p style="font-size:10px;font-weight:500;color:#666;margin:0 0 3px;letter-spacing:0.03em">${t.workplace}</p><ul style="padding-left:13px;margin:0">${allW.map(i=>`<li style="font-size:11px;line-height:1.7">${i}</li>`).join("")}</ul>`:""}
      </div>
    </div>`;
  }).join("");

  // Insight boxes for Part 2
  const insightData = {
    workload: { low: true,
      why: lang==="en"?"Workload is the primary flow blocker when demand consistently exceeds capacity. Quality degrades and switching off becomes harder — both confirmed by the participant's selections. Strong development and support scores suggest this is a capacity problem, not a motivation or environment problem.":"Vinnuálag er aðal flæðihindrandi þáttur þegar krafa er stöðugt meiri en geta. Gæði versna og erfitt verður að slökkna — bæði staðfest af svörum þátttakandans.",
      qs: lang==="en"?["Where does the workload feel most unsustainable — and what would need to change first?","How do you decide what to prioritise when everything feels urgent?"]:["Hvar líðst vinnuálagið ósjálfbærast — og hvað þyrfti fyrst að breytast?","Hvernig ákveður þú forgangsröðun þegar allt líðst brýnt?"],
      tags: lang==="en"?[["hack","🔧 Work hack: one 90-min focus block before checking messages"],["proactive","⚡ Job crafting: reduce demands"],["watch","⚠ Watch for: taking on more to avoid saying no"]]:
        [["hack","🔧 Work hack: eitt 90 mín einbeitingarglugga áður en þú skoðar skilaboð"],["proactive","⚡ Vinnumótun: dragðu úr kröfum"],["watch","⚠ Fylgstu með: taka á sig meira til að forðast að segja nei"]]
    },
    balance: { low: true,
      why: lang==="en"?"Recovery is a performance condition. When personal time no longer restores energy, next-day capacity is already reduced before it begins. Disrupted routines and incomplete recovery create a compounding pattern.":"Endurheimt er frammistöðuskilyrði. Þegar persónulegur tími endurnærir ekki lengur orku er næsta dags geta þegar minnkuð.",
      qs: lang==="en"?["How do you know when work has followed you into personal time — and what triggers it?","What would a truly restorative evening or weekend look like for you?"]:["Hvernig veist þú þegar vinna hefur fylgt þér inn í persónulegan tíma?","Hvernig myndi raunverulega endurnærandi kvöld eða helgi líta út fyrir þig?"],
      tags: lang==="en"?[["hack","🔧 Work hack: short shutdown ritual to end the workday"],["hack","🔧 Work hack: one protected evening per week"],["proactive","⚡ Proactive vitality management"],["watch","⚠ Watch for: checking messages in the evening"]]:
        [["hack","🔧 Work hack: stuttur lokarritual til að ljúka vinnudeginum"],["proactive","⚡ Frumkvæðisorkulýðheilsa"],["watch","⚠ Fylgstu með: að skoða skilaboð á kvöldin"]]
    },
    habits: { low: true,
      why: lang==="en"?"Daily structure is the foundation of sustained focus — one of the seven flow drivers. Without consistent recovery routines, attention is harder to direct. This likely compounds the workload pressure.":"Dagleg uppbygging er grunnur sjálfbærrar einbeitingar. Án samræmdra endurheimt-rútína er erfiðara að stýra athygli.",
      qs: lang==="en"?["When during the day do you feel most focused — and how are you using that time?","What one routine, if consistent, would make the biggest difference?"]:["Hvenær á daginn ert þú einbeittastur — og hvernig notar þú þann tíma?","Hvaða ein rútína, ef stöðug, myndi skipta mestu máli?"],
      tags: lang==="en"?[["hack","🔧 Work hack: short shutdown ritual at end of day"],["hack","🔧 Work hack: turn off notifications during focus blocks"],["proactive","⚡ Proactive vitality management"],["watch","⚠ Watch for: passive screen time as false recovery"]]:
        [["hack","🔧 Work hack: slökktu á tilkynningum í einbeitingarblokk"],["proactive","⚡ Frumkvæðisorkulýðheilsa"],["watch","⚠ Fylgstu með: óvirk skjátími sem falsk endurheimt"]]
    },
    health: { low: true,
      why: lang==="en"?"Physical recovery directly affects capacity to focus and perform. When health is a limiting condition, cognitive performance and stamina follow. This is often the last area people address — and one of the first to show results.":"Líkamleg endurheimt hefur bein áhrif á einbeitingu og frammistöðu. Þegar heilsa er takmarkandi þáttur fylgir vitræn frammmistaða.",
      qs: lang==="en"?["How is your physical energy affecting your capacity for demanding work right now?","What one health-related change would most improve how you feel at work?"]:["Hvernig hefur líkamleg orka þín áhrif á getu þína til krefjandi vinnu?","Hvaða ein heilsutengd breyting myndi mest bæta líðan þína í vinnu?"],
      tags: lang==="en"?[["hack","🔧 Work hack: take a 5-minute movement break between demanding tasks"],["proactive","⚡ Proactive vitality management"],["watch","⚠ Watch for: treating tiredness as a character trait rather than a signal"]]:
        [["hack","🔧 Work hack: taktu 5 mínútna hreyfingahlé milli krefjandi verkefna"],["proactive","⚡ Frumkvæðisorkulýðheilsa"],["watch","⚠ Fylgstu með: að meðhöndla þreytu sem einkenni frekar en merki"]]
    },
    development: { low: false,
      why: lang==="en"?"Personal growth is one of the strongest flow drivers. This is a genuine performance asset that sustains motivation and engagement naturally over time. The risk is that workload pressure eventually crowds it out.":"Persónuleg þróun er einn af sterkustu flæðiþáttunum. Þetta er raunverulegt frammistöðueign sem viðheldur hvatningu náttúrulega.",
      qs: lang==="en"?["What are you learning right now that energises you — and how intentional is that?","How do you make sure development stays a priority when workload increases?"]:["Hvað ert þú að læra núna sem gefur þér orku — og hversu meðvitað er þetta?","Hvernig tryggir þú að þróun haldist forgangur þegar vinnuálag eykst?"],
      tags: lang==="en"?[["proactive","⚡ Strengths use: leverage learning drive for stretch assignments"],["flow","🌊 Flow driver: personal growth — currently strong"]]:
        [["proactive","⚡ Nýting styrkleika: nýttu námsdrif til áskorunarverkefna"],["flow","🌊 Flæðiþáttur: persónuleg þróun — nú sterkur"]]
    },
    support: { low: false,
      why: lang==="en"?"Strong support and psychological safety are structural advantages. Feedback — one of the seven flow drivers — depends directly on this foundation. The question is whether this resource is being used proactively or mainly reactively.":"Sterkur stuðningur og sálfræðilegt öryggi eru skipulegar kostir. Endurgjöf — einn af sjö flæðiþáttum — er beint háður þessum grunni.",
      qs: lang==="en"?["How are you using the support available to you — and where could you lean on it more?","Where do you still hold back from raising things early — and what gets in the way?"]:["Hvernig nýtir þú þér þann stuðning sem er í boði — og hvar gætirðu treyst meira á hann?","Hvar hesjar þú þig enn við að koma málum upp snemma — og hvað kemur í veg fyrir það?"],
      tags: lang==="en"?[["proactive","⚡ Expressing voice: use to surface ideas and influence work design"],["flow","🌊 Flow driver: feedback — leverage for clearer progress signals"]]:
        [["proactive","⚡ Að tjá sig: notaðu til að koma hugmyndum á framfæri"],["flow","🌊 Flæðiþáttur: endurgjöf — nýttu til skýrari framgangsmerkja"]]
    },
    hobbies: { low: false,
      why: lang==="en"?"Hobbies are a key recovery mechanism that protect motivation by ensuring life does not become too work-centred. Given the workload pressure, this strength may be playing a more important role than is immediately obvious.":"Áhugamál eru lykilendurheimt-búnaður sem verndar hvatningu með því að tryggja að lífið verði ekki of vinnumiðað.",
      qs: lang==="en"?["How reliably are your hobbies getting space in your week — and what threatens that most?","What happens to your energy at work when outside interests get squeezed?"]:["Hversu áreiðanlega fá áhugamálin þín pláss í vikunni þinni — og hvað ógnir því mest?","Hvað gerist við orku þína í vinnu þegar ytri áhugamál eru þrengd út?"],
      tags: lang==="en"?[["proactive","⚡ Proactive vitality: protect recovery time as non-negotiable"],["flow","🌊 Flow driver: motivation — hobbies sustain intrinsic energy"]]:
        [["proactive","⚡ Frumkvæðisorkulýðheilsa: verndaðu endurheimt tíma sem óumsemjanleg"],["flow","🌊 Flæðiþáttur: hvatning — áhugamál viðhalda innri orku"]]
    },
    overall: { low: false,
      why: lang==="en"?"High overall wellbeing alongside limiting workload scores is an important pattern — it suggests resilience, but also a risk. High wellbeing can mask how unsustainable the current conditions actually are.":"Há heildarlíðan ásamt takmarkandi vinnuálagsstigi er mikilvægt mynstur — það gefur til kynna seiglu en einnig áhættu.",
      qs: lang==="en"?["What is keeping things steady right now — and how long can that continue?","What would need to change for the current situation to feel sustainable rather than just manageable?"]:["Hvað heldur hlutunum stöðugum núna — og hversu lengi getur það haldið áfram?","Hvað þyrfti að breytast til að núverandi staða líðist sjálfbær frekar en bara stjórnanlegt?"],
      tags: lang==="en"?[["flow","🌊 Flow driver: motivation — overall wellbeing sustains drive"],["watch","⚠ Watch for: resilience masking unsustainable conditions"]]:
        [["flow","🌊 Flæðiþáttur: hvatning — heildarlíðan viðheldur drifi"],["watch","⚠ Fylgstu með: seigla sem hylja ósjálfbærar aðstæður"]]
    },
    autonomy: { low: false,
      why: lang==="en"?"High autonomy is a direct flow enabler. Control — one of the seven flow drivers — is supported by this score. The question is whether this ownership is being used to its full potential.":"Hátt sjálfræði er beinn flæðiupplyfting. Stjórn — einn af sjö flæðiþáttum — er studdur af þessum stigi.",
      qs: lang==="en"?["Where are you using your autonomy most effectively right now?","Where could you exercise more ownership over how the work is done?"]:["Hvar notar þú sjálfræðið þitt mest á áhrifaríkan hátt núna?","Hvar gætirðu tekið meira eignarhald yfir hvernig vinnunni er sinnt?"],
      tags: lang==="en"?[["proactive","⚡ Job crafting: use autonomy to improve person-role fit"],["flow","🌊 Flow driver: control — currently strong"]]:
        [["proactive","⚡ Vinnumótun: notaðu sjálfræði til að bæta samræmi"],["flow","🌊 Flæðiþáttur: stjórn — nú sterkur"]]
    },
    clarity: { low: false,
      why: lang==="en"?"High clarity is a direct enabler of focus and purpose — two of the seven flow drivers. When priorities are clear and expectations well-defined, cognitive load drops and deep work becomes more accessible.":"Hár skýrleiki er beinn stuðningsþáttur einbeitingar og tilgangs — tveggja af sjö flæðiþáttum.",
      qs: lang==="en"?["How are you using the clarity you have to protect your most important work from overload?","Does your clarity extend to what can be deprioritised — or mainly to what needs to be done?"]:["Hvernig notar þú skýrleikann sem þú hefur til að vernda mikilvægustu vinnuna þína?","Nær skýrleikinn þinn til þess sem hægt er að taka úr forgangi — eða aðallega til þess sem þarf að gera?"],
      tags: lang==="en"?[["proactive","⚡ Job crafting: use clarity to reduce demand and protect focus"],["flow","🌊 Flow driver: purpose — clarity directly supports direction"]]:
        [["proactive","⚡ Vinnumótun: notaðu skýrleika til að draga úr kröfum"],["flow","🌊 Flæðiþáttur: tilgangur — skýrleiki styður beint stefnu"]]
    },
    energy: { low: false,
      why: lang==="en"?"Strong energy and wellbeing directly support motivation and focus — two key flow drivers. This is a resource worth protecting and leveraging intentionally, especially during demanding periods.":"Sterk orka og vellíðan styðja beint hvatningu og einbeitingu — tvo lykilflæðiþætti.",
      qs: lang==="en"?["How do you currently protect your energy during high-demand periods?","What helps you recover most effectively between demanding work blocks?"]:["Hvernig verndar þú nú orku þína í tímum mikilla krafna?","Hvað hjálpar þér að endurheimt mest á áhrifaríkan hátt milli krefjandi vinnublokka?"],
      tags: lang==="en"?[["proactive","⚡ Proactive vitality: align demanding work with peak energy"],["flow","🌊 Flow driver: motivation — energy directly supports drive"]]:
        [["proactive","⚡ Frumkvæðisorkulýðheilsa: samræmdu krefjandi vinnu við orkutind"],["flow","🌊 Flæðiþáttur: hvatning — orka styður beint drif"]]
    },
  };

  const tagColors = {hack:["#E6F1FB","#185FA5"], proactive:["#EAF3DE","#3B6D11"], watch:["#FAEEDA","#BA7517"], flow:["#EEEDFE","#534AB7"]};

  const catKeys = Object.keys(scores);
  const insightCardsHTML = allCats.map(c => {
    const isL=(bottomTop.low||[]).includes(c);
    const borderCol=isL?"#E24B4A":"#1D9E75";
    const bgCol=isL?"#FDF2F2":"#F0FAF6";
    const labelCol=isL?"#A32D2D":"#0F6E56";
    const key = c.toLowerCase().replace(/[^a-z]/g,"").replace("controlautonomy","autonomy").replace("organisationclarity","clarity").replace("worklifebalance","balance").replace("energywellbeing","energy").replace("dailyhabits","habits").replace("overallwellbeing","overall");
    const insight = insightData[key] || insightData[isL?"workload":"development"];
    const pItems=(personalSelections[c]||[]).filter(x=>x!=="__other__");
    const pOther=personalOther[c]?[personalOther[c]]:[];
    const wItems=(workplaceSelections[c]||[]).filter(x=>x!=="__other__");
    const wOther=workplaceOther[c]?[workplaceOther[c]]:[];
    const allP=[...pItems,...pOther]; const allW=[...wItems,...wOther];
    const tagsHTML = insight.tags.map(([type,text]) => {
      const [bg,col] = tagColors[type]||tagColors.hack;
      return `<span style="font-size:10px;padding:2px 7px;border-radius:8px;background:${bg};color:${col};margin-right:4px;margin-bottom:4px;display:inline-block">${text}</span>`;
    }).join("");
    return `<div style="margin-bottom:8px;border:0.5px solid ${borderCol};border-radius:8px;overflow:hidden">
      <div style="padding:7px 12px;background:${bgCol};border-bottom:0.5px solid ${borderCol};display:flex;align-items:center;justify-content:space-between">
        <span style="font-family:Georgia,serif;font-size:13px;font-weight:500;color:${labelCol}">${catMapLabel[c]||c} <span style="font-weight:400;font-size:11px;opacity:0.7">${scores[c].toFixed(1)}</span></span>
        <span style="font-size:9px;padding:2px 8px;border-radius:9px;background:white;border:0.5px solid ${borderCol};color:${labelCol}">${isL?t.limiting:t.strong}</span>
      </div>
      <div style="padding:10px 12px">
        <div style="margin-bottom:8px;padding:8px 10px;border-radius:0 6px 6px 0;border-left:2.5px solid ${borderCol};background:#fafaf8">
          <p style="font-size:11px;color:#666;line-height:1.65;margin-bottom:7px;font-style:italic">${insight.why}</p>
          <p style="font-size:9px;font-weight:500;color:#aaa;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px">${lang==="en"?"Conversation questions":"Samtalsspurningar"}</p>
          <ul style="padding-left:13px;margin-bottom:7px">
            ${insight.qs.map(q=>`<li style="font-size:11px;color:#555;line-height:1.7">${q}</li>`).join("")}
          </ul>
          <div>${tagsHTML}</div>
        </div>
      </div>
    </div>`;
  }).join("");

  // AI summary formatted
  const fmtAI = (() => {
    if (!aiSummary) return `<p style="font-size:12px;color:#999;font-style:italic">${t.aiPending}</p>`;
    const out = [];
    for (const line of aiSummary.split("\n")) {
      const tx = line.trim();
      if (!tx) { out.push("<br>"); continue; }
      if (tx.startsWith("## ")) { out.push(`<h2 style="font-family:Georgia,serif;font-size:13px;font-weight:500;color:#0F6E56;margin:16px 0 4px;padding-bottom:3px;border-bottom:0.5px solid #eee">${tx.slice(3)}</h2>`); continue; }
      if (tx.startsWith("### ")) { out.push(`<h3 style="font-size:12px;font-weight:500;color:#1a1a18;margin:10px 0 3px">${tx.slice(4)}</h3>`); continue; }
      if (tx.startsWith("- ") || tx.startsWith("* ")) { out.push(`<li style="margin:2px 0;font-size:11px;line-height:1.6">${tx.slice(2).replace(/[*][*](.+?)[*][*]/g,"<strong>$1</strong>")}</li>`); continue; }
      out.push(`<p style="margin:4px 0;font-size:12px;line-height:1.7;color:#5f5e5a">${tx.replace(/[*][*](.+?)[*][*]/g,"<strong>$1</strong>")}</p>`);
    }
    return out.join("");
  })();

  // Flow interview phases
  const phases = [
    { num:1, bg:"#E1F5EE", nbg:"#1D9E75", col:"#0F6E56",
      title: lang==="en"?"Opening":"Opnun", time:"5 min", note:"",
      qs: [
        {l:lang==="en"?"Opening":"Opnun", q:lang==="en"?'"Before we dive in — how are you doing today?"':'"Áður en við förum í gögn — hvernig líður þér í dag?"', s:lang==="en"?"Build rapport before introducing data.":"Skapaðu tengsl áður en þú kynnir gögnin."},
        {l:lang==="en"?"Frame":"Rammi", q:lang==="en"?'"Today we use the assessment as a map — not a verdict."':'"Í dag notum við könnunina sem kort — ekki sem dóm."', s:""},
        {l:lang==="en"?"Reaction":"Viðbrögð", q:lang==="en"?'"When you look at your profile, what stands out — or surprised you?"':'"Þegar þú lítur á prófílinn þinn, hvað stendur upp úr — eða kom þér á óvart?"', s:lang==="en"?"Let the participant set the agenda.":"Láttu þátttakandann setja dagskrána."}
      ]},
    { num:2, bg:"#FAEEDA", nbg:"#BA7517", col:"#854F0B",
      title: lang==="en"?"Explore limiting conditions":"Kannaðu takmarkandi þætti", time:"10–15 min",
      note: lang==="en"?"Focus on 1–2 areas. Use follow-up responses as entry points.":"Einbeittu þér að 1–2 svæðum. Notaðu framhaldsspurningasvör sem inngangspunkta.",
      qs: [
        {l:lang==="en"?"Open":"Opnaðu", q:lang==="en"?'"You selected [impact statement]. Can you tell me more about when that shows up?"':'"Þú valdir [áhrifasetning]. Getur þú sagt mér meira um hvenær þetta kemur fram?"', s:""},
        {l:lang==="en"?"Deepen":"Dýpkaðu", q:lang==="en"?'"What triggers it — and what does it feel like when it happens?"':'"Hvað veldur þessu — og hvernig líður þér þegar þetta gerist?"', s:""},
        {l:lang==="en"?"Agency":"Frumkvæði", q:lang==="en"?'"What is within your control to change here?"':'"Hvað er í þínum höndum að breyta hér?"', s:lang==="en"?"Do not rush to solutions.":"Ekki flýta sér í lausnir."}
      ]},
    { num:3, bg:"#E6F1FB", nbg:"#185FA5", col:"#0C447C",
      title: lang==="en"?"Explore strengths":"Kannaðu styrkleika", time:"5–8 min",
      note: lang==="en"?"Don't skip this — strengths often contain resources needed to address limiting conditions.":"Slepptu ekki þessum hluta — styrkleikarnir innihalda oft auðlindir sem þarf.",
      qs: [
        {l:lang==="en"?"Anchor":"Festu", q:lang==="en"?'"You scored highly in [area]. What does that look like in practice?"':'"Þú fékkst hátt stig í [svæði]. Hvernig lítur þetta út í reynd?"', s:""},
        {l:lang==="en"?"Leverage":"Nýttu", q:lang==="en"?'"How could you use this strength more intentionally where things feel more difficult?"':'"Hvernig gætirðu notað þennan styrkleika þar sem hlutir líðast erfiðari?"', s:""}
      ]},
    { num:4, bg:"#EEEDFE", nbg:"#534AB7", col:"#3C3489",
      title: lang==="en"?"Close & commit":"Lokið og skuldbinding", time:"5 min", note:"",
      qs: [
        {l:lang==="en"?"Summary":"Samantekt", q:lang==="en"?'"Let me reflect back what I have heard… Does that feel accurate?"':'"Leyfðu mér að endurspegla það sem ég hef heyrt… Er þetta nákvæmt?"', s:lang==="en"?"Keep it short. Let the participant correct.":"Haltu þessu stuttu. Láttu þátttakandann leiðrétta."},
        {l:lang==="en"?"Insight":"Innsæi", q:lang==="en"?'"What is your main takeaway from today?"':'"Hvað er helsta niðurstaðan þín úr samtali dagsins?"', s:lang==="en"?"Let the participant own the insight.":"Láttu þátttakandann eiga innsæið."},
        {l:lang==="en"?"Action":"Aðgerð", q:lang==="en"?'"What is one small thing you want to try in the next two weeks?"':'"Hvað eitt lítið viltu prófa á næstu tveimur vikum?"', s:""},
        {l:lang==="en"?"Work hack":"Work hack", q:lang==="en"?'"Would you like me to suggest one or two practical work hacks?"':'"Máttu fá tillögur að einu eða tveimur praktískum work hacks?"', s:lang==="en"?"Coaching first, advice second.":"Þjálfun fyrst, ráðgjöf á eftir."}
      ]}
  ];

  const phasesHTML = phases.map(ph => `
    <div style="border:0.5px solid #e8e8e4;border-radius:8px;overflow:hidden;margin-bottom:8px">
      <div style="padding:8px 13px;background:${ph.bg};display:flex;align-items:center;gap:9px">
        <div style="width:22px;height:22px;border-radius:50%;background:${ph.nbg};color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;flex-shrink:0">${ph.num}</div>
        <span style="font-size:12px;font-weight:500;color:${ph.col}">${ph.title}</span>
        <span style="font-size:10px;color:${ph.col};margin-left:auto">${ph.time}</span>
      </div>
      <div style="padding:10px 13px">
        ${ph.note?`<p style="font-size:10px;color:#888;font-style:italic;margin:0 0 7px;line-height:1.6">${ph.note}</p>`:""}
        ${ph.qs.map((q,i)=>`
          ${i>0?'<div style="border-top:0.5px solid #eee;margin:6px 0"></div>':""}
          <div style="display:flex;gap:8px;align-items:flex-start">
            <span style="font-size:9px;font-weight:500;min-width:58px;padding-top:2px;text-transform:uppercase;letter-spacing:0.05em;color:${ph.col}">${q.l}</span>
            <div>
              <p style="font-size:11px;color:#555;line-height:1.6;margin:0">${q.q}</p>
              ${q.s?`<p style="font-size:10px;color:#888;font-style:italic;margin:1px 0 0">${q.s}</p>`:""}
            </div>
          </div>`).join("")}
      </div>
    </div>`).join("");

  const reminders = lang==="en"
    ? ["Talk less, ask more","Pause before the next question","Let the participant speak last","Avoid leading questions",'"Tell me more about that"',"Coaching first, advice second"]
    : ["Talaðu minna, spurðu meira","Gefðu þér tíma milli spurninga","Láttu þátttakandann tala síðast","Forðastu leiðandi spurningar",'"Segðu mér meira um það"',"Þjálfun fyrst, ráðgjöf á eftir"];

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Flow-Based Performance Coach Report — ${name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',Georgia,sans-serif;background:#fafaf8;color:#1a1a18;font-size:13px;line-height:1.6;max-width:780px;margin:0 auto;padding:0}
  @media print{@page{margin:10mm 10mm;size:A4}.no-print{display:none}.part-break{page-break-before:always}}
  .hdr{background:#1D9E75;color:white;padding:20px 28px}
  .sec{background:#fff;border-bottom:0.5px solid #e8e8e4;padding:16px 28px}
  .lbl{font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:#9a9890;margin-bottom:12px}
  table{border-collapse:collapse;width:100%}
  .print-btn{display:inline-flex;align-items:center;gap:6px;margin:16px 28px;padding:8px 16px;background:#1D9E75;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer}
  .footer{padding:10px 28px;font-size:10px;color:#9a9890;text-align:center;background:#fafaf8;border-top:0.5px solid #e8e8e4}
</style>
</head><body>
<button class="print-btn no-print" onclick="window.print()">&#8595; ${lang==="en"?"Save as PDF":"Vista sem PDF"}</button>
<div class="hdr">
  <div style="font-family:Georgia,serif;font-size:18px;font-weight:500;margin-bottom:2px">${lang==="en"?"Flow-Based Performance Coach Report":"Flæðibasert frammistöðuskýrsla þjálfara"}</div>
  <div style="font-size:9px;opacity:0.6;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">${t.convo}</div>
  <div style="font-size:12px;opacity:0.92;display:flex;flex-wrap:wrap;gap:14px">
    <span>&#128100; ${name}</span><span>&#9993; ${email}</span><span>&#128101; ${lang==="en"?"Coach":"Þjálfari"}: ${coachName||"—"}</span>
    <span>&#128197; ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>
  </div>
</div>

<!-- PART 1 -->
<div style="padding:10px 28px;background:#f5f4f0;border-bottom:0.5px solid #e8e8e4;display:flex;align-items:center;gap:10px">
  <div style="width:26px;height:26px;border-radius:50%;background:#1D9E75;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;flex-shrink:0">1</div>
  <div>
    <div style="font-family:Georgia,serif;font-size:14px;font-weight:500">${t.part1title}</div>
    <div style="font-size:11px;color:#9a9890">${t.part1desc}</div>
  </div>
</div>

<div class="sec">
  <div class="lbl">${t.profile}</div>
  ${radarSVG}
  <div style="display:flex;justify-content:center;gap:20px;margin-top:8px;font-size:11px;color:#888">
    <span style="display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:22px;height:2.5px;background:#1D9E75;border-radius:2px"></span>${t.yourScore}</span>
    <span style="display:flex;align-items:center;gap:6px"><span style="display:inline-block;width:22px;height:0;border-top:1.5px dashed #B4B2A9"></span>${t.midpoint}</span>
  </div>
  <div style="border-top:0.5px solid #e8e8e4;padding-top:12px;margin-top:12px">
    <div class="lbl">${t.scoreOverview}</div>
    <table>${scoreRows}</table>
    <div style="display:flex;gap:16px;margin-top:10px">
      ${[["#E24B4A",t.limitingLabel],["#BA7517",t.moderate],["#1D9E75",t.strongLabel]].map(([col,lbl])=>`<span style="display:flex;align-items:center;gap:5px;font-size:10px;color:#888"><span style="width:8px;height:8px;border-radius:50%;background:${col};display:inline-block"></span>${lbl}</span>`).join("")}
    </div>
  </div>
</div>

<div class="sec">
  <div class="lbl">${t.heatmap}</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px">${heatmapCards}</div>
</div>

<div class="sec">
  <div class="lbl">${t.followup}</div>
  ${followupCardsSimple || `<p style="font-size:12px;color:#aaa;font-style:italic">${lang==="en"?"No follow-up categories triggered.":"Engar framhaldsspurningaflokkar komu upp."}</p>`}
</div>

<div class="sec">
  <div class="lbl">${t.aiReport}</div>
  ${fmtAI}
</div>

<!-- PART 2 -->
<div style="padding:10px 28px;background:#f0f0f8;border-bottom:0.5px solid #e8e8e4;display:flex;align-items:center;gap:10px;margin-top:4px" class="part-break">
  <div style="width:26px;height:26px;border-radius:50%;background:#534AB7;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;flex-shrink:0">2</div>
  <div>
    <div style="font-family:Georgia,serif;font-size:14px;font-weight:500">${t.part2title}</div>
    <div style="font-size:11px;color:#9a9890">${t.part2desc}</div>
  </div>
</div>

<div class="sec">
  <div class="lbl">${t.coachingFocus}</div>
  <p style="font-size:11px;color:#666;line-height:1.6;margin-bottom:14px;font-style:italic">${t.coachingFocusIntro}</p>
  ${insightCardsHTML || `<p style="font-size:12px;color:#aaa;font-style:italic">${lang==="en"?"No follow-up categories triggered.":"Engar framhaldsspurningaflokkar komu upp."}</p>`}
</div>

<div class="sec">
  <div class="lbl">${t.convFlow}</div>
  <p style="font-size:11px;color:#666;line-height:1.6;margin-bottom:12px;font-style:italic">${t.convFlowIntro}</p>
  ${phasesHTML}
  <div style="padding:9px 13px;background:#fafaf8;border-radius:8px;border:0.5px solid #e8e8e4;margin-top:4px">
    <div style="font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.07em;color:#aaa;margin-bottom:6px">${t.reminders}</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">${reminders.map(r=>`<span style="font-size:10px;padding:2px 7px;border-radius:6px;background:white;border:0.5px solid #ddd;color:#666">${r}</span>`).join("")}</div>
  </div>
</div>

<div class="footer">Flow-Based Performance Coach Report — ${t.convo} — ${name} — ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
</body></html>`;

  return html;
}


function CoachGuide({ lang, onBack }) {
  const isEN = lang === "en";
  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 10px", color: "var(--color-text-primary)" }}>{title}</h2>
      {children}
    </div>
  );
  const SubSection = ({ title, children }) => (
    <div style={{ marginBottom: 12 }}>
      <h3 style={{ fontSize: 13, fontWeight: 500, margin: "0 0 4px", color: "#1D9E75" }}>{title}</h3>
      {children}
    </div>
  );
  const P = ({ children }) => <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 6px" }}>{children}</p>;
  const Tag = ({ color, bg, children }) => (
    <span style={{ display: "inline-block", fontSize: 10, padding: "2px 8px", borderRadius: 8, background: bg, color: color, marginRight: 4, marginBottom: 4 }}>{children}</span>
  );
  const InfoBox = ({ children }) => (
    <div style={{ padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)", marginBottom: 10 }}>
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{children}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", marginBottom: "1.5rem", padding: 0 }}>
        ← {isEN ? "Back to Assessment" : "Til baka í könnunina"}
      </button>

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>
          {isEN ? "Information for Coaches" : "Upplýsingar fyrir þjálfara"}
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: 0 }}>
          {isEN ? "Everything you need to know to use this assessment effectively." : "Allt sem þú þarft að vita til að nota þessa könnun á áhrifaríkan hátt."}
        </p>
      </div>

      {/* ABOUT */}
      <Section title={isEN ? "About this assessment" : "Um þessa könnun"}>
        <P>{isEN
          ? "This is a Flow-Based Performance and Wellbeing Assessment designed to support coaching conversations. It is not a clinical diagnostic tool or a performance review — it is a structured reflection instrument that helps coaches and participants understand the conditions that support or limit sustainable performance."
          : "Þetta er líðunar- og frammistöðumat byggt á flæðifræði, hannað til að styðja þjálfunarsamtöl. Þetta er ekki klínískt greiningartól eða mat á frammistöðu — þetta er skipulegt ígrundunartól sem hjálpar þjálfurum og þátttakendum að skilja þær aðstæður sem styðja eða takmarka sjálfbæra frammistöðu."
        }</P>
        <InfoBox>{isEN
          ? "Core innovation: Most assessments stop at presenting scores. This tool continues by translating scores into personalised impact reflections and coaching-ready insights — connecting assessment, follow-up, and conversation in one flow."
          : "Kjarnaframlægi: Flest mat stoppar við að sýna stig. Þetta tól heldur áfram með því að þýða stig yfir í persónulegar ígrundanir og þjálfunartilbúnar innsæi — sem tengir mat, eftirfylgni og samtal í eitt flæði."
        }</InfoBox>
        <P>{isEN
          ? "Designed by Jóna Björk Sigurjónsdóttir. Questions: jonabjork@proton.me"
          : "Hönnuð af Jónu Björk Sigurjónsdóttur. Spurningar: jonabjork@proton.me"
        }</P>
      </Section>

      {/* THEORETICAL FOUNDATION */}
      <Section title={isEN ? "Theoretical foundation" : "Fræðilegur grunnur"}>
        <P>{isEN
          ? "The assessment draws on three complementary frameworks:"
          : "Matið byggir á þremur fræðilegum grunnum:"
        }</P>
        <P>{isEN
          ? "The 11 categories were selected to capture both job demands (Workload, Work–Life Balance) and job resources (Support, Autonomy, Development, Clarity) from the JD-R model, alongside personal recovery and wellbeing factors (Health, Habits, Hobbies, Energy, Overall Well-being) that influence sustainable performance."
          : "11 flokkarnir voru valdir til að ná yfir bæði kröfur (Vinnuálag, Jafnvægi vinnu og einkalífs) og auðlindir (Stuðningur, Sjálfræði, Þróun, Skipulag) úr JD-R líkaninu, ásamt persónulegum endurheimt- og líðanarþáttum (Heilsa, Venjur, Áhugamál, Orka, Heildarlíðan) sem hafa áhrif á sjálfbæra frammistöðu."
        }</P>
        <SubSection title={isEN ? "Job Demands-Resources (JD-R) model" : "JD-R líkanið (Job Demands-Resources)"}>
          <P>{isEN
            ? "The 11 assessment categories are grounded in the JD-R model, which distinguishes between job demands (factors that cost energy, such as workload) and job resources (factors that support performance and recovery, such as support, autonomy, and development). The balance between demands and resources is a key predictor of engagement, burnout risk, and sustainable performance."
            : "11 flokkarnir í matinu byggjast á JD-R líkaninu, sem greinir á milli krafna (þættir sem kosta orku, eins og vinnuálag) og auðlinda (þættir sem styðja frammistöðu og endurheimt, eins og stuðningur, sjálfræði og þróun). Jafnvægið milli krafna og auðlinda er lykilspáþáttur fyrir þátttöku, kulnunaráhættu og sjálfbæra frammistöðu."
          }</P>
        </SubSection>
        <SubSection title={isEN ? "Flow theory (Csikszentmihalyi)" : "Flæðifræði (Csikszentmihalyi)"}>
          <P>{isEN
            ? "Flow is a state of complete absorption in a task where focus is effortless and performance is strong. It is not random — it is a predictable outcome of specific conditions. The seven flow drivers in the coach report (purpose, motivation, challenge, feedback, control, focus, personal growth) identify which conditions are currently supporting or limiting access to flow."
            : "Flæði er ástand fullkominnar einbeitingar þar sem einbeiting er auðveld og frammistaða sterk. Þetta er ekki tilviljun — þetta er fyrirsjáanleg niðurstaða þegar ákveðin skilyrði eru uppfyllt. Sjö flæðiþættirnir í þjálfunaskýrslunni (tilgangur, hvatning, áskorun, endurgjöf, stjórn, einbeiting, persónuleg þróun) greina hvaða skilyrði styðja eða takmarka aðgang að flæði."
          }</P>
        </SubSection>
        <SubSection title={isEN ? "Proactive work behaviour" : "Frumkvæðishegðun í vinnu"}>
          <P>{isEN
            ? "The follow-up module and coach report reference six forms of proactive work behaviour — including job crafting, strengths use, and meaning making — as practical levers for improving performance conditions. These are evidence-based behavioural strategies that individuals can apply within their existing role."
            : "Framhaldsmódúlinn og þjálfunaskýrslan vísa til sex forma frumkvæðishegðunar — þar á meðal vinnumótunar, nýtingar styrkleika og merkingarsköpunar — sem praktískar hækjur til að bæta frammistöðuskilyrði. Þetta eru gagnreyndar hegðunarstrategíur sem einstaklingar geta beitt innan núverandi hlutverks."
          }</P>
        </SubSection>
      </Section>

      {/* HOW IT WORKS */}
      <Section title={isEN ? "How it works" : "Hvernig það virkar"}>
        {[
          isEN ? ["1. Participant information", "The participant enters their name, email, and the coach's name and selects their preferred language (English or Icelandic)."] : ["1. Upplýsingar þátttakanda", "Þátttakandinn slær inn nafn, netfang og nafn þjálfara og velur tungumál (enska eða íslenska)."],
          isEN ? ["2. Wellbeing questionnaire", "39 questions across 11 categories answered on a 6-point scale (Never to Always). Some items are reverse-scored. Takes approximately 10 minutes."] : ["2. Líðankönnun", "39 spurningar í 11 flokkum svaraðar á 6 þrepa kvarða (Aldrei til Alltaf). Sumar spurningar eru með öfugum stigum. Tekur um 10 mínútur."],
          isEN ? ["3. Follow-up questions", "The system identifies categories scoring below 3.5 (limiting) or above 4.5 (strong). The participant selects impact statements and can add their own reflections under 'Other'."] : ["3. Framhaldsspurningar", "Kerfið greinir flokka undir 3.5 (takmarkandi) eða yfir 4.5 (sterkir). Þátttakandinn velur áhrifasetningar og getur bætt við eigin ígrundun undir 'Annað'."],
          isEN ? ["4. Coach reports", "Two emails are sent to the coach: an initial score summary after the questionnaire, and a full Flow-Based Performance Coach Report with AI analysis as an HTML attachment after the follow-up is complete."] : ["4. Þjálfunaskýrslur", "Tveir tölvupóstar berast þjálfaranum: upphafleg stigasamantekt eftir spurningalistann, og full Flow-Based skýrsla með AI-greiningu sem HTML viðhengi eftir að framhaldsspurningunum er lokið."],
        ].map(([title, text], i) => (
          <SubSection key={i} title={title}><P>{text}</P></SubSection>
        ))}
      </Section>

      {/* READING THE REPORTS */}
      <Section title={isEN ? "How to read the reports" : "Hvernig á að lesa skýrslurnar"}>

        <SubSection title={isEN ? "Well-being Profile (radar chart)" : "Vellíðunarprófíll (radarrit)"}>
          <P>{isEN
            ? "The radar chart shows all 11 category scores at a glance. Each axis represents one category — the further from the centre, the higher the score. The dashed inner ring marks 3.5 (the threshold between functional and limiting). The shape of the profile is often more informative than individual scores: a lopsided shape points to imbalance between demands and resources."
            : "Radarritið sýnir öll 11 flokkastigin í einu. Hver ás táknar einn flokk — því lengra frá miðjunni, því hærra stigið. Brotalínan í miðjunni markar 3.5 (mörkin milli virks og takmarkandi). Lögun prófílsins er oft upplýsingameiri en einstök stig: skakk lögun bendir til ójafnvægis milli krafna og auðlinda."
          }</P>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            {[["#E24B4A", "#FCEBEB", isEN ? "Red dot = below 3.5 (limiting)" : "Rauður punktur = undir 3.5 (takmarkandi)"],
              ["#BA7517", "#FAEEDA", isEN ? "Amber dot = 3.5–4.5 (functional)" : "Gulbrúnn punktur = 3.5–4.5 (virkt)"],
              ["#1D9E75", "#E1F5EE", isEN ? "Green dot = above 4.5 (strong)" : "Grænn punktur = yfir 4.5 (sterkur)"]
            ].map(([col, bg, label]) => (
              <div key={col} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: col, display: "inline-block", flexShrink: 0 }}></span>
                <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{label}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title={isEN ? "Score Overview (bar chart)" : "Yfirlit yfir stig (stikurit)"}>
          <P>{isEN
            ? "Categories are sorted from lowest to highest score. The colour coding makes patterns immediately visible. Look for clusters — multiple red bars together suggest a systemic demand overload, while multiple green bars alongside red ones suggest strong resources that are not yet fully offsetting the pressure."
            : "Flokkar eru raðaðir frá lægsta til hæsta stigi. Litakóðunin gerir mynstur sýnileg strax. Leitaðu að þyrpingum — margar rauðar stikur saman gefa til kynna kerfisbundið vinnuálagsofálag, á meðan margar grænar stikur samhliða rauðum benda til sterkra auðlinda sem eru ekki enn að jafna þrýstinginn að fullu."
          }</P>
        </SubSection>

        <SubSection title={isEN ? "Flow & Performance Heatmap" : "Flæði- og frammistöðuhitakort"}>
          <P>{isEN
            ? "The heatmap converts the 11 category scores into 7 flow driver scores using weighted calculations. This reveals underlying performance dynamics that single category scores may not show. For example, a participant can have a moderate workload score but a low Focus score — because habits, health, and clarity are also contributing to focus difficulties."
            : "Hitakortið umbreytir 11 flokkastigunum í 7 flæðiþáttastig með vegnum útreikningum. Þetta afhjúpar undirliggjandi frammistöðudýnamík sem einstök flokkastig sýna kannski ekki. Til dæmis getur þátttakandi haft meðallag vinnuálagsstig en lágt einbeitingarstig — vegna þess að venjur, heilsa og skipulag stuðla einnig að einbeytingarvandræðum."
          }</P>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px", marginTop: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", margin: "0 0 6px" }}>{isEN ? "How flow driver scores are calculated (examples):" : "Hvernig flæðiþáttastig eru reiknuð (dæmi):"}</p>
            {[
              ["Focus", isEN ? "25% Clarity + 20% Daily Habits + 20% Health + 15% Workload + 10% Balance + 10% Energy" : "25% Skipulag + 20% Venjur + 20% Heilsa + 15% Vinnuálag + 10% Jafnvægi + 10% Orka"],
              ["Feedback", isEN ? "50% Support + 30% Clarity + 20% Development" : "50% Stuðningur + 30% Skipulag + 20% Þróun"],
              ["Challenge", isEN ? "45% Workload + 35% Development + 20% Energy" : "45% Vinnuálag + 35% Þróun + 20% Orka"],
            ].map(([name, formula]) => (
              <div key={name} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ minWidth: 70, fontSize: 11, fontWeight: 500, color: "#534AB7" }}>{name}</span>
                <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{formula}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title={isEN ? "Score thresholds" : "Stigamörk"}>
          {[
            ["4.5 – 6.0", isEN ? "Strong performance condition" : "Sterk frammistöðuaðstaða", "#0F6E56", "#E1F5EE"],
            ["3.5 – 4.49", isEN ? "Functional — not fully leveraged" : "Virkt — ekki nýtt til fulls", "#854F0B", "#FAEEDA"],
            [isEN ? "Below 3.5" : "Undir 3.5", isEN ? "Likely performance constraint or limiting condition" : "Líklega takmarkandi þáttur", "#A32D2D", "#FCEBEB"],
          ].map(([range, label, color, bg]) => (
            <div key={range} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Tag color={color} bg={bg}>{range}</Tag>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{label}</span>
            </div>
          ))}
        </SubSection>
      </Section>

      {/* FOLLOW-UP LOGIC */}
      <Section title={isEN ? "About the follow-up module" : "Um framhaldsmódúlinn"}>
        <P>{isEN
          ? "The follow-up module is the core innovation of this tool. Rather than leaving participants with a set of abstract scores, it asks them to reflect on how those scores show up in their actual experience — both personally and at work."
          : "Framhaldsmódúlinn er kjarnaframlægi þessa tóls. Í stað þess að skilja þátttakendur eftir með óhlutbundin stig, biður hann þá um að ígrunda hvernig þau stig birtast í raunverulegri reynd þeirra — bæði persónulega og í vinnu."
        }</P>
        <P>{isEN
          ? "Impact statements are predefined based on research and practice, but participants are always invited to add their own words under 'Other'. These personal additions are often the most valuable material for the coaching conversation — they move beyond recognition into genuine reflection."
          : "Áhrifasetningarnar eru fyrirframskilgreindar byggt á rannsóknum og reynslu, en þátttakendum er alltaf boðið að bæta við eigin orðum undir 'Annað'. Þessar persónulegu viðbætur eru oft gagnlegasta efnið í þjálfunarsamtalinu — þær fara lengra en viðurkenning yfir í raunverulega ígrundun."
        }</P>
        <InfoBox>{isEN
          ? "Note on follow-up selection: The tool currently triggers follow-up questions for categories scoring below 3.5 (up to 4) and above 4.5 (up to 4). This means participants with scores mostly in the moderate range may not see follow-up questions. This is by design — moderate scores suggest no strong constraint or strength worth exploring in depth."
          : "Athugasemd um eftirfylgni: Tólið kveikir nú á framhaldsspurningum fyrir flokka með stig undir 3.5 (allt að 4) og yfir 4.5 (allt að 4). Þetta þýðir að þátttakendur með stig að mestu í miðlungssvæði sjá kannski ekki framhaldsspurningar. Þetta er af ásettu ráði — miðlungsstig gefa til kynna engar sterkar takmarkanir eða styrkleika sem þykir vert að kanna ítarlega."
        }</InfoBox>
      </Section>

      {/* 7 FLOW DRIVERS */}
      <Section title={isEN ? "The 7 Flow Drivers" : "7 flæðiþættirnir"}>
        <P>{isEN
          ? "Flow drivers are the underlying conditions that make focused, energised, sustainable performance more likely. They are derived from flow theory and work design research. A driver score below 3.5 suggests that condition is limiting performance; above 4.5 suggests it is actively supporting it."
          : "Flæðiþættirnir eru undirliggjandi skilyrði sem gera einbeyttar, orkufullnar og sjálfbærar frammistöður líklegri. Þeir eru fengnar úr flæðifræði og vinnuhönnunarrannsóknum. Flæðiþáttastig undir 3.5 gefur til kynna að það skilyrði takmarki frammistöðu; yfir 4.5 gefur til kynna að það styðji frammistöðu virkt."
        }</P>
        {[
          ["Purpose", isEN ? "The sense that work is meaningful and direction is clear. Supported by clarity, development, and overall wellbeing." : "Tilfinningin að vinnan sé þýðingarmikil og stefnan skýr. Studd af skipulagi, þróun og heildarlíðan."],
          ["Motivation", isEN ? "Internal drive to engage, contribute, and persist. Supported by energy, hobbies, and development." : "Innri hvati til að taka þátt, leggja af mörkum og halda áfram. Studdur af orku, áhugamálum og þróun."],
          ["Challenge", isEN ? "The right level of stretch — not too easy, not overwhelming. Primarily driven by workload and development." : "Rétt magn af togstreitu — ekki of auðvelt, ekki yfirþyrmandi. Aðallega drifinn af vinnuálagi og þróun."],
          ["Feedback", isEN ? "Clear signals about whether performance is on track. Supported by support, clarity, and development." : "Skýrar merkingar um hvort frammistaðan sé á réttri leið. Studdur af stuðningi, skipulagi og þróun."],
          ["Control", isEN ? "Ownership and agency over how work is done. Supported by autonomy, workload, and habits." : "Eignarréttur og sjálfræði yfir hvernig vinnunni er sinnt. Studdur af sjálfræði, vinnuálagi og venjum."],
          ["Focus", isEN ? "The ability to concentrate deeply. Supported by clarity, habits, health, and workload." : "Getan til að einbeita sér djúpt. Studd af skipulagi, venjum, heilsu og vinnuálagi."],
          ["Personal Growth", isEN ? "A sense of progress and evolving capability. Supported by development, hobbies, and health." : "Tilfinning fyrir framgangi og vaxandi hæfni. Studd af þróun, áhugamálum og heilsu."],
        ].map(([name, desc]) => (
          <div key={name} style={{ display: "flex", gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            <span style={{ minWidth: 110, fontSize: 12, fontWeight: 500, color: "#1D9E75", paddingTop: 2 }}>{name}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{desc}</span>
          </div>
        ))}
      </Section>

      {/* WORK HACKS */}
      <Section title={isEN ? "Work hacks in the report" : "Work hacks í skýrslunni"}>
        <P>{isEN
          ? "Work hacks are small, practical behavioural adjustments that reduce friction and protect the conditions needed for focused, sustainable performance. They appear as tags in the coach report alongside each category."
          : "Work hacks eru litlar, praktískar hegðunarbreytingar sem draga úr núningi og vernda þær aðstæður sem þarf til að ná einbeittri og sjálfbærri frammistöðu. Þær birtast sem merki í þjálfunaskýrslunni við hvern flokk."
        }</P>
        {[
          [isEN ? "Block one 90-minute focus window before checking messages" : "Bókaðu eitt 90 mínútna einbeitingarglugga áður en þú skoðar skilaboð", "#185FA5", "#E6F1FB"],
          [isEN ? "Use a short shutdown ritual to create a clear end to the workday" : "Notaðu stuttan lokarritual til að skapa skýrar lok á vinnudaginn", "#185FA5", "#E6F1FB"],
          [isEN ? "Take a 5-minute break between demanding tasks" : "Taktu 5 mínútna hlé milli krefjandi verkefna", "#185FA5", "#E6F1FB"],
          [isEN ? "Turn off notifications during focus blocks" : "Slökktu á tilkynningum í einbeitingarblokk", "#185FA5", "#E6F1FB"],
          [isEN ? "Align demanding work with your highest-energy period of the day" : "Settu krefjandi vinnu í þann tíma dagsins þegar orkan er mest", "#185FA5", "#E6F1FB"],
        ].map(([hack, col, bg], i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, padding: "6px 10px", background: bg, borderRadius: "var(--border-radius-md)" }}>
            <span style={{ color: col, fontSize: 13 }}>🔧</span>
            <span style={{ fontSize: 12, color: col, lineHeight: 1.6 }}>{hack}</span>
          </div>
        ))}
      </Section>

      {/* PROACTIVE BEHAVIOURS */}
      <Section title={isEN ? "Proactive behaviours" : "Frumkvæðishegðun"}>
        <P>{isEN
          ? "The report references six evidence-based forms of proactive work behaviour as practical levers for the coaching conversation."
          : "Skýrslan vísar til sex gagnreyndra forma frumkvæðishegðunar í vinnu sem praktískar hækjur í þjálfunarsamtalið."
        }</P>
        {[
          [isEN ? "Meaning Making" : "Merkingarsköpun", isEN ? "Finding or creating purpose and value in daily tasks." : "Að finna eða skapa tilgang og gildi í daglegum verkefnum.", "#3B6D11", "#EAF3DE"],
          [isEN ? "Proactive Vitality Management" : "Frumkvæðisorkulýðheilsa", isEN ? "Deliberately protecting and restoring energy throughout the day." : "Að vernda og endurheimta orku af vísvitandi hætti yfir daginn.", "#3B6D11", "#EAF3DE"],
          [isEN ? "Strengths Use" : "Nýting styrkleika", isEN ? "Actively seeking opportunities to use talents and capabilities." : "Að leita virkt að tækifærum til að nýta hæfileika og styrkleika.", "#3B6D11", "#EAF3DE"],
          [isEN ? "Job Crafting" : "Vinnumótun", isEN ? "Reshaping tasks, relationships, or how work is approached to improve fit." : "Að endurmóta verkefni, tengsl eða nálgun til að bæta samræmi.", "#3B6D11", "#EAF3DE"],
          [isEN ? "Expressing Voice" : "Að tjá sig", isEN ? "Speaking up with ideas, concerns, and suggestions." : "Að koma með hugmyndir, áhyggjur og tillögur.", "#3B6D11", "#EAF3DE"],
          [isEN ? "Playful Work Design" : "Leikleg vinnuhönnun", isEN ? "Adding challenge, humour, or creativity to difficult or repetitive tasks." : "Að bæta við áskorun, húmor eða sköpunarkraft í erfið eða endurtekin verkefni.", "#3B6D11", "#EAF3DE"],
        ].map(([name, desc, col, bg]) => (
          <div key={name} style={{ display: "flex", gap: 8, marginBottom: 6, padding: "6px 10px", background: bg, borderRadius: "var(--border-radius-md)" }}>
            <span style={{ color: col, fontSize: 13 }}>⚡</span>
            <div>
              <span style={{ fontSize: 12, fontWeight: 500, color: col }}>{name}: </span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{desc}</span>
            </div>
          </div>
        ))}
      </Section>

      {/* USING THE REPORT */}
      <Section title={isEN ? "Using the report in conversation" : "Notkun skýrslunnar í samtali"}>
        {[
          isEN
            ? ["Start with the pattern, not the score", "The flow heatmap gives you the overall picture. Use it to identify one or two areas most worth exploring — not to work through every category systematically."]
            : ["Byrjaðu á mynstrinu, ekki stiginu", "Flæðihitakortið gefur þér heildarmyndina. Notaðu það til að greina eitt eða tvö svæði sem mest þykir vert að kanna — ekki til að fara kerfisbundið í gegnum hvern flokk."],
          isEN
            ? ["Use the follow-up responses as entry points", "The impact statements the participant selected reveal how scores show up in practice. The personal additions under 'Other' are often the most useful starting point."]
            : ["Notaðu framhaldssvarið sem inngangspunkta", "Áhrifasetningarnar sem þátttakandinn valdi sýna hvernig stigin birtast í reynd. Persónulegar viðbætur undir 'Annað' eru oft gagnlegasti upphafsstaðurinn."],
          isEN
            ? ["Look for tensions, not just low scores", "A high overall wellbeing alongside low workload and balance scores is more interesting than either alone. Tensions point to the most productive coaching territory."]
            : ["Leitaðu að spennum, ekki bara lágum stigum", "Há heildarlíðan samhliða lágu vinnuálagi og jafnvægi er áhugaverðara en hvort tveggja eitt og sér. Spenna bendir á gagnlegasta þjálfunarsvæðið."],
          isEN
            ? ["The report opens questions, not answers", "The coaching questions in the report are entry points. The participant's own reflection — in conversation — is where the real insight emerges."]
            : ["Skýrslan opnar spurningar, gefur ekki svör", "Þjálfunarspurningarnar í skýrslunni eru inngangspunktar. Eigin ígrundun þátttakandans — í samtali — er þar sem raunverulegt innsæi kemur fram."],
        ].map(([title, text], i) => (
          <SubSection key={i} title={title}><P>{text}</P></SubSection>
        ))}
      </Section>

      <Section title={isEN ? "Suggested conversation flow" : "Tillaga að uppbyggingu samtals"}>
        <P>{isEN
          ? "A suggested structure based on the DBW flow interview model. Use the report as preparation — not as a script. Let the participant's own words guide the depth."
          : "Tillaga að uppbyggingu byggð á DBW flæðiviðtalslíkaninu. Notaðu skýrsluna sem undirbúning — ekki sem handrit. Láttu eigin orð þátttakandans leiða dýptina."
        }</P>

        {[
          {
            num: 1,
            hdrBg: "#E1F5EE", numBg: "#1D9E75", col: "#0F6E56",
            title: isEN ? "Opening" : "Opnun",
            time: "5 min",
            note: null,
            qs: [
              { label: isEN ? "Opening" : "Opnun", q: isEN ? '"Before we dive into the report, I would like to start simply — how are you doing today?"' : '"Áður en við förum í skýrsluna, vil ég byrja einfalt — hvernig líður þér í dag?"', sub: isEN ? "Build rapport before introducing the data." : "Skapaðu tengsl áður en þú kynnir gögnin." },
              { label: isEN ? "Frame" : "Rammi", q: isEN ? '"You completed a wellbeing assessment. Today we use it as a map for our conversation — not as a verdict."' : '"Þú kláraðir líðankönnun. Í dag notum við hana sem kort fyrir samtalið okkar — ekki sem dóm."', sub: isEN ? "This is not a performance review. It is a reflection tool." : "Þetta er ekki mat á frammistöðu. Þetta er ígrundunartól." },
              { label: isEN ? "First reaction" : "Fyrsta viðbrögð", q: isEN ? '"When you look at your profile, what stands out to you — or what surprised you?"' : '"Þegar þú lítur á prófílinn þinn, hvað stendur upp úr — eða hvað kom þér á óvart?"', sub: isEN ? "Let the participant set the agenda. Their reaction reveals what matters most." : "Láttu þátttakandann setja dagskrána. Viðbrögðin sýna hvað skiptir mestu máli." },
            ]
          },
          {
            num: 2,
            hdrBg: "#FAEEDA", numBg: "#BA7517", col: "#854F0B",
            title: isEN ? "Explore limiting conditions" : "Kannaðu takmarkandi þætti",
            time: "10–15 min",
            note: isEN ? "Focus on 1–2 areas from the report, not all of them. Use the follow-up impact statements as entry points." : "Einbeittu þér að 1–2 svæðum úr skýrslunni, ekki öllum. Notaðu framhaldsspurningasvörin sem inngangspunkta.",
            qs: [
              { label: isEN ? "Open" : "Opnaðu", q: isEN ? '"You selected that [impact statement]. Can you tell me more about when that shows up for you?"' : '"Þú valdir að [áhrifasetning]. Getur þú sagt mér meira um hvenær þetta kemur fram hjá þér?"', sub: isEN ? "Use their own words from the 'Other' field if they added one." : "Notaðu eigin orð þeirra úr 'Annað' reitnum ef þeir bættu við." },
              { label: isEN ? "Deepen" : "Dýpkaðu", q: isEN ? '"What tends to trigger that — and what does it feel like when it's happening?"' : '"Hvað veldur þessu venjulega — og hvernig líður þér þegar þetta er að gerast?"', sub: isEN ? "Move from recognition to lived experience." : "Farðu frá viðurkennningu yfir í lifaða reynslu." },
              { label: isEN ? "Impact" : "Áhrif", q: isEN ? '"How does this affect the work that matters most to you?"' : '"Hvernig hefur þetta áhrif á þá vinnu sem skiptir þig mestu máli?"', sub: null },
              { label: isEN ? "Agency" : "Frumkvæði", q: isEN ? '"What, if anything, is within your control to change here?"' : '"Hvað, ef eitthvað, er í þínum höndum að breyta hér?"', sub: isEN ? "Do not rush to solutions. Let the participant explore first." : "Ekki flýta sér í lausnir. Láttu þátttakandann kanna fyrst." },
            ]
          },
          {
            num: 3,
            hdrBg: "#E6F1FB", numBg: "#185FA5", col: "#0C447C",
            title: isEN ? "Explore strengths" : "Kannaðu styrkleika",
            time: "5–8 min",
            note: isEN ? "Do not skip this section. Strengths often contain the resources needed to address the limiting conditions." : "Slepptu ekki þessum hluta. Styrkleikarnir innihalda oft þær auðlindir sem þarf til að takast á við takmarkandi þættina.",
            qs: [
              { label: isEN ? "Anchor" : "Festu", q: isEN ? '"You scored highly in [strength area]. What does that look like in practice for you?"' : '"Þú fékkst hátt stig í [styrkleikaflokkur]. Hvernig lítur þetta út í reynd hjá þér?"', sub: null },
              { label: isEN ? "Leverage" : "Nýttu", q: isEN ? '"How could you use this strength more intentionally — especially where things feel more difficult?"' : '"Hvernig gætirðu notað þennan styrkleika af meiri ásettu ráði — sérstaklega þar sem hlutir líðast erfiðari?"', sub: null },
              { label: isEN ? "Protect" : "Verndaðu", q: isEN ? '"What would need to stay in place to make sure this strength doesn't get eroded by other pressures?"' : '"Hvað þarf að vera til staðar til að tryggja að þessi styrkleiki veikist ekki vegna annars þrýstings?"', sub: null },
            ]
          },
          {
            num: 4,
            hdrBg: "#EEEDFE", numBg: "#534AB7", col: "#3C3489",
            title: isEN ? "Close & commit" : "Lokið og skuldbinding",
            time: "5 min",
            note: null,
            qs: [
              { label: isEN ? "Summary" : "Samantekt", q: isEN ? '"Let me reflect back what I have heard… [2–3 key points]. Does that feel accurate?"' : '"Leyfðu mér að endurspegla það sem ég hef heyrt… [2–3 lykilatriði]. Er þetta nákvæmt?"', sub: isEN ? "Keep it short. Let the participant correct or add." : "Haltu þessu stuttu. Láttu þátttakandann leiðrétta eða bæta við." },
              { label: isEN ? "Insight" : "Innsæi", q: isEN ? '"What is your main takeaway from today's conversation?"' : '"Hvað er helsta niðurstaðan þín úr samtali dagsins?"', sub: isEN ? "Let the participant own the insight — do not give it to them." : "Láttu þátttakandann eiga innsæið — gefðu þeim það ekki." },
              { label: isEN ? "Action" : "Aðgerð", q: isEN ? '"What is one small thing you want to try in the next two weeks?"' : '"Hvað eitt lítið viltu prófa á næstu tveimur vikum?"', sub: isEN ? "Small and specific beats ambitious and vague." : "Lítið og nákvæmt er betra en metnaðarfullt og óljóst." },
              { label: isEN ? "Work hack" : "Work hack", q: isEN ? '"Would you like me to suggest one or two practical work hacks based on what you've shared?"' : '"Máttu fá tillögur að einu eða tveimur praktískum work hacks út frá því sem þú deildir?"', sub: isEN ? "Only offer this if appropriate — coaching first, advice second." : "Bjóddu þetta aðeins ef við á — þjálfun fyrst, ráðgjöf á eftir." },
            ]
          },
        ].map((phase, pi) => (
          <div key={pi} style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", marginBottom: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", background: phase.hdrBg, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: phase.numBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0 }}>{phase.num}</div>
              <span style={{ fontSize: 13, fontWeight: 500, color: phase.col }}>{phase.title}</span>
              <span style={{ fontSize: 11, color: phase.col, marginLeft: "auto" }}>{phase.time}</span>
            </div>
            <div style={{ padding: "12px 16px" }}>
              {phase.note && <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontStyle: "italic", margin: "0 0 10px", lineHeight: 1.6 }}>{phase.note}</p>}
              {phase.qs.map((q, qi) => (
                <div key={qi}>
                  {qi > 0 && <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", margin: "8px 0" }}/>}
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 500, minWidth: 70, paddingTop: 2, textTransform: "uppercase", letterSpacing: "0.05em", color: phase.col }}>{q.label}</span>
                    <div>
                      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{q.q}</p>
                      {q.sub && <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.6, margin: "2px 0 0", fontStyle: "italic" }}>{q.sub}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ padding: "12px 16px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-secondary)", marginTop: 4 }}>
          <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-tertiary)", margin: "0 0 8px" }}>{isEN ? "General reminders" : "Almennar ábendingar"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {(isEN
              ? ["Talk less, ask more", "Pause before the next question", "Let the participant speak last", "Avoid leading questions", '"Tell me more about that"', "Coaching first, advice second"]
              : ["Talaðu minna, spurðu meira", "Gefðu þér tíma milli spurninga", "Láttu þátttakandann tala síðast", "Forðastu leiðandi spurningar", '"Segðu mér meira um það"', "Þjálfun fyrst, ráðgjöf á eftir"]
            ).map((r, i) => (
              <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", color: "var(--color-text-secondary)" }}>{r}</span>
            ))}
          </div>
        </div>
      </Section>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button onClick={onBack} style={{ padding: "10px 24px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
          ← {isEN ? "Back to Assessment" : "Til baka í könnunina"}
        </button>
      </div>
    </div>
  );
}


export default function WellbeingApp() {
  const [step, setStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(Array(39).fill(null));
  const [error, setError] = useState("");
  const [scores, setScores] = useState(null);
  const [bottomTop, setBottomTop] = useState(null);
  const scoresRef = useRef(null);
  const bottomTopRef = useRef(null);
  const [pendingStep, setPendingStep] = useState(null);
  const [personalSelections, setPersonalSelections] = useState({});
  const [workplaceSelections, setWorkplaceSelections] = useState({});
  const [personalOther, setPersonalOther] = useState({});
  const [workplaceOther, setWorkplaceOther] = useState({});
  const [sending, setSending] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const topRef = useRef(null);

  const t = LANG[lang];
  const questions = QUESTIONS[lang];
  const scoreLabels = lang === "en" ? SCORE_LABELS_EN : SCORE_LABELS_IS;
  const catMapLabel = lang === "en" ? CAT_MAP_EN : CAT_MAP_IS;
  const impPersonal = lang === "en" ? IMPACT_PERSONAL_EN : IMPACT_PERSONAL_IS;
  const impWork = lang === "en" ? IMPACT_WORKPLACE_EN : IMPACT_WORKPLACE_IS;

  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" }); }, [step]);



  const handleInfoNext = () => {
    if (!name.trim()) { setError(t.required); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(t.invalid_email); return; }
    setError(""); setStep(1);
  };

  const handleAnswerNext = () => {
    if (answers.some(a => a === null)) { setError(t.q_required); return; }
    setError("");
    const s = computeScores(answers, lang);
    const bt = getBottomTop(s);
    setScores(s);
    setBottomTop(bt);

    // Send initial email in background with scores only
    setTimeout(() => {
      if (window.emailjs) {
        const catMapLabelLocal = lang === "en" ? CAT_MAP_EN : CAT_MAP_IS;
        const sortedScores = Object.entries(s).sort((a,b) => a[1]-b[1]);
        const scoreLinesInitial = sortedScores.map(([k,v]) => {
          const isLow = v < 3.5, isHigh = v > 4.5;
          const marker = isLow ? "[LOW] " : isHigh ? "[HIGH] " : "";
          return marker + (catMapLabelLocal[k]||k) + ": " + v.toFixed(2);
        }).join("\n");
        const lowListInitial = bt.low.map(c => catMapLabelLocal[c]||c).join(", ") || "None";
        const highListInitial = bt.high.map(c => catMapLabelLocal[c]||c).join(", ") || "None";
        const initialParts = [
          "WELL-BEING ASSESSMENT - INITIAL SCORES",
          "============================================",
          "Participant: " + name,
          "Email: " + email,
          "Coach: " + (coachName || "Not specified"),
          "Assessment date: " + new Date().toLocaleDateString("en-GB", {day:"numeric",month:"long",year:"numeric"}),
          "",
          "============================================",
          "CATEGORY SCORES (1-6 scale)",
          "============================================",
          scoreLinesInitial,
          "",
          "Limiting conditions (below 3.5): " + lowListInitial,
          "Strong conditions (above 4.5): " + highListInitial,
          "",
          "--------------------------------------------",
          "Follow-up questions have been sent to the participant.",
          "You will receive a second report with follow-up responses and AI analysis once completed.",
        ];
        window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_INITIAL, {
          participant_name: name,
          participant_email: email,
          coach_name: coachName || "Not specified",
          message: initialParts.join("\n"),
          name: name,
        }, EMAILJS_PUBLIC_KEY).catch(e => console.error("Initial email failed:", e));
      }
    }, 0);

    setStep(2);
  };

  const toggleSelection = (state, setState, cat, item) => {
    const prev = state[cat] || [];
    const next = prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item];
    setState({ ...state, [cat]: next });
  };

  const handleFollowupNext = async () => {
    setSending(true);
    let aiSummaryText = "";
    const lowCats = bottomTop.low, highCats = bottomTop.high;
    const allCats = [...lowCats, ...highCats];
    console.log("AI Summary - lowCats:", lowCats, "highCats:", highCats, "allCats:", allCats);

    const summaryPrompt = `You are creating a Flow-Based Performance Coach Report based on a wellbeing and performance assessment.

This is a coaching-oriented, flow-based performance report. Its purpose is to identify the conditions that support or limit sustainable performance, and to highlight the most useful areas to explore further in conversation.

==================================================
CORE POSITIONING
==================================================

High performance depends on the conditions that make focus, motivation, challenge, feedback, autonomy, recovery, and growth possible over time. Use a flow and sustainable performance lens throughout.

==================================================
TONE AND STYLE
==================================================

Tone: clear, calm, intelligent, practical, coaching-oriented, premium and professional, performance-focused but human.

Preferred wording: sustainable performance, performance conditions, flow drivers, performance constraints, leverage points, friction, recovery, challenge-skill fit, clarity, ownership, momentum, repeatable performance, long-term resilience.

Avoid: struggling, weakness, problem, vulnerable, emotionally drained, fix, personal issue.
Use instead: limiting condition, performance risk, opportunity to strengthen, friction point, recommended next step, reduced recovery, lower sustainability.

Use phrasing like: "This pattern suggests...", "This may be worth exploring", "A useful question may be..."
Avoid: "The participant struggles with...", "This is clearly a problem...", "The person should..."

==================================================
SCORING GUIDELINES
==================================================

4.5-5.0 = strong performance condition
3.5-4.49 = functional but not fully leveraged
below 3.5 = likely performance constraint or limiting condition

==================================================
FLOW DRIVER SCORING
==================================================

Calculate 7 flow-driver scores from the category scores using these weights:

Purpose: 45% Organisation & Clarity + 25% Development + 20% Overall Wellbeing + 10% Support
Motivation: 30% Energy & Wellbeing + 25% Hobbies + 20% Development + 15% Overall Wellbeing + 10% Control & Autonomy
Challenge: 45% Workload + 35% Development + 20% Energy & Wellbeing
Feedback: 50% Support + 30% Organisation & Clarity + 20% Development
Control: 50% Control & Autonomy + 20% Workload + 20% Daily Habits + 10% Organisation & Clarity
Focus: 25% Organisation & Clarity + 20% Daily Habits + 20% Health + 15% Workload + 10% Work-Life Balance + 10% Energy & Wellbeing
Personal Growth: 40% Development + 20% Hobbies + 15% Health + 15% Overall Wellbeing + 10% Workload

Status labels: 4.5-5.0 = Strong / 3.5-4.49 = Functional / below 3.5 = Limiting

Work design levers (use when relevant): Meaning Making, Proactive Vitality Management, Strengths Use, Job Crafting, Voice, Playful Work Design.

==================================================
REPORT STRUCTURE
==================================================

Write the full report in this exact order:

1. FLOW-BASED PERFORMANCE COACH REPORT
Confidential - For Coaching Use
Participant: ${name}
Email: ${email}
Coach: ${coachName || "Not specified"}
Assessment date: ${new Date().toLocaleDateString("en-GB", {day:"numeric",month:"long",year:"numeric"})}

2. Executive Summary
- Strongest 2 performance-supporting conditions
- Top 2-3 limiting conditions
- Overall pattern summary (3-4 sentences)

3. Category Score Overview
All 11 category scores, clean and easy to scan.

4. Flow & Performance Heatmap
Calculate all 7 flow-driver scores. Show each with its status (Strong/Functional/Limiting). Add one short interpretation paragraph explaining which drivers are most supportive and which may be limiting consistency or sustainability.

5. Top Performance Constraints
Select 2-3 most relevant flow drivers based on patterns (not just lowest scores). For each:
- What this may look like in practice
- Why it matters for performance
- 3 coaching questions
- Leverage points

6. Category-Level Performance Insights
Most important categories only. Label as Performance Strength / Performance Risk / Opportunity to Strengthen. Each: 2-3 sentence insight + one simple next step.

7. Conversation Focus Areas
3-5 areas. For each:
Area name
Why this may be worth exploring: (1-2 sentences)
Suggested questions: (3 questions)
Relevant work design lever: (one of the 6 levers)

8. Coaching Priorities for the Next 30 Days
Priority 1: protect one condition already supporting strong performance
Priority 2: reduce one major source of friction
Priority 3: strengthen one missing or under-leveraged flow condition

9. Recommended Coaching Focus
Explain the coaching opportunity is to improve conditions that make focused, sustainable performance easier (clearer priorities, better recovery, stronger feedback loops, more ownership, stronger challenge-skill fit).

10. Suggested Coaching Prompts
5 practical coaching questions.

11. Closing Summary
2-3 sentences on how performance is shaped by the interaction between clarity, recovery, challenge, control, support, and growth.

==================================================
PARTICIPANT DATA
==================================================

Participant: ${name}
Email: ${email}

CATEGORY SCORES (1-6 scale):
${Object.entries(scores).map(([k, v]) => (catMapLabel[k] || k) + ": " + v.toFixed(2)).join("\n")}

Limiting conditions (below 3.5): ${lowCats.map(c => catMapLabel[c] || c).join(", ") || "None"}
Strong conditions (above 4.5): ${highCats.map(c => catMapLabel[c] || c).join(", ") || "None"}

FOLLOW-UP IMPACT RESPONSES:
${allCats.map(c => {
  const isLow = lowCats.includes(c);
  const pItems = (personalSelections[c] || []).filter(x => x !== "__other__");
  const pOther = personalOther[c] ? ["Other: " + personalOther[c]] : [];
  const wItems = (workplaceSelections[c] || []).filter(x => x !== "__other__");
  const wOther = workplaceOther[c] ? ["Other: " + workplaceOther[c]] : [];
  return "[ " + (catMapLabel[c] || c).toUpperCase() + " - " + (isLow ? "LIMITING CONDITION" : "PERFORMANCE STRENGTH") + " ]\nPersonal Impact:\n" + [...pItems, ...pOther].map(i => "- " + i).join("\n") + "\nWorkplace Impact:\n" + [...wItems, ...wOther].map(i => "- " + i).join("\n");
}).join("\n\n")}`

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: summaryPrompt })
      });
      const data = await res.json();
      const summaryText = data.text || "";
      setAiSummary(summaryText);
      aiSummaryText = summaryText;
    } catch (e) {
      console.error("AI summary error:", e);
      setAiSummary("");
      aiSummaryText = "";
    }
    setSending(false);

    try {
      console.log("EmailJS send starting, emailjs available:", !!window.emailjs);
      if (window.emailjs) {
        const catMapLabelLocal = lang === "en" ? CAT_MAP_EN : CAT_MAP_IS;
        const scoreLines = Object.entries(scores).map(([k, v]) => `${catMapLabelLocal[k] || k}: ${v.toFixed(2)}`).join("\n");
        const lowList = bottomTop.low.map(c => catMapLabelLocal[c] || c).join(", ") || (lang === "en" ? "None" : "Enginn");
        const highList = bottomTop.high.map(c => catMapLabelLocal[c] || c).join(", ") || (lang === "en" ? "None" : "Enginn");
        const personalLines = [...bottomTop.low, ...bottomTop.high]
          .map(c => {
            const items = (personalSelections[c] || []).filter(x => x !== "__other__");
            const other = personalOther[c] ? `Other: ${personalOther[c]}` : "";
            const all = [...items, ...(other ? [other] : [])];
            return `${catMapLabelLocal[c] || c}: ${all.join("; ") || "-"}`;
          }).join("\n");
        const workplaceLines = [...bottomTop.low, ...bottomTop.high]
          .map(c => {
            const items = (workplaceSelections[c] || []).filter(x => x !== "__other__");
            const other = workplaceOther[c] ? `Other: ${workplaceOther[c]}` : "";
            const all = [...items, ...(other ? [other] : [])];
            return `${catMapLabelLocal[c] || c}: ${all.join("; ") || "-"}`;
          }).join("\n");
        const followupLines = [...bottomTop.low, ...bottomTop.high].map(c => {
          const pItems = (personalSelections[c] || []).filter(x => x !== "__other__");
          const pOther = personalOther[c] ? ["Other: " + personalOther[c]] : [];
          const wItems = (workplaceSelections[c] || []).filter(x => x !== "__other__");
          const wOther = workplaceOther[c] ? ["Other: " + workplaceOther[c]] : [];
          const isLow = bottomTop.low.includes(c);
          return `[ ${(catMapLabelLocal[c] || c).toUpperCase()} — ${isLow ? "LIMITING CONDITION" : "PERFORMANCE STRENGTH"} ]
Personal Impact:
${[...pItems, ...pOther].map(i => "- " + i).join("\n") || "- None selected"}
Workplace Impact:
${[...wItems, ...wOther].map(i => "- " + i).join("\n") || "- None selected"}`;
        }).join("\n\n");


        const msgParts = [
          "FLOW-BASED PERFORMANCE COACH REPORT",
          "Confidential - For Coaching Use",
          "============================================",
          "Participant: " + name,
          "Email: " + email,
          "Coach: " + (coachName || "Not specified"),
          "Assessment date: " + new Date().toLocaleDateString("en-GB", {day:"numeric",month:"long",year:"numeric"}),
          
          "",
          "============================================",
          "CATEGORY SCORES (1-6 scale)",
          "============================================",
          scoreLines,
          "",
          "Limiting conditions (below 3.5): " + (lowList || "None"),
          "Strong conditions (above 4.5): " + (highList || "None"),
          "",
          "============================================",
          "FOLLOW-UP IMPACT RESPONSES",
          "============================================",
          followupLines,
          "",
          "============================================",
          "AI COACHING REPORT",
          "============================================",
          aiSummaryText || "",
        ];
        const fullMessage = msgParts.join("\n");

        // Generate HTML report
        const reportHTML = generateReportHTML(name, email, coachName, scores, catMapLabelLocal, bottomTop, personalSelections, workplaceSelections, personalOther, workplaceOther, aiSummaryText, lang);

        // Encode HTML to base64
        const encodeHTML = html => { const u = new TextEncoder().encode(html); let b=""; u.forEach(x=>b+=String.fromCharCode(x)); return btoa(b); };
        const reportB64 = encodeHTML(reportHTML);

        // Generate participant profile
        const participantHTML = generateParticipantHTML(name, coachName, scores, catMapLabelLocal, bottomTop, personalSelections, workplaceSelections, personalOther, workplaceOther, lang);
        const participantB64 = encodeHTML(participantHTML);

        console.log("Sending email with EmailJS...");

        const result = await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_FINAL, {
          participant_name: name,
          participant_email: email,
          coach_name: coachName || "Not specified",
          message: fullMessage,
          name: name,
          attachment_data: reportB64,
          attachment_name: "coach_report_" + name.replace(/\s+/g,"_") + ".html",
          attachment_data_2: participantB64,
          attachment_name_2: "participant_profile_" + name.replace(/\s+/g,"_") + ".html",
        }, EMAILJS_PUBLIC_KEY);
        console.log("EmailJS result:", result);
      }
    } catch (e) { console.error("EmailJS final send failed:", e); alert("Email send error: " + e.message); }

    setStep(3);
  };

  const STEPS = [t.step_info, t.step_questions, t.step_followup, t.step_complete];
  const displayStep = step;

  const resetApp = () => {
    setStep(0); setName(""); setEmail(""); setCoachName(""); setAnswers(Array(39).fill(null));
    setScores(null); setBottomTop(null); setPersonalSelections({});
    setWorkplaceSelections({}); setPersonalOther({}); setWorkplaceOther({}); setAiSummary("");
  };

  useEffect(() => {
    const loadScript = (src, onload) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = onload;
      document.head.appendChild(s);
    };
    if (!window.emailjs) {
      loadScript("https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
        () => window.emailjs.init(EMAILJS_PUBLIC_KEY));
    }
    if (!window.jspdf) {
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", () => {});
    }
  }, []);

  if (showGuide) return <CoachGuide lang={lang} onBack={() => setShowGuide(false)} />;

  return (
    <div ref={topRef} style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem 1rem" }}>
      <h2 className="sr-only">Well-being Coaching Questionnaire</h2>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= displayStep ? "#1D9E75" : "var(--color-background-secondary)", transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {STEPS.map((s, i) => (
            <span key={i} style={{ fontSize: 11, color: i === displayStep ? "var(--color-text-primary)" : "var(--color-text-tertiary)", fontWeight: i === displayStep ? 500 : 400, flex: 1, textAlign: i === 0 ? "left" : i === STEPS.length - 1 ? "right" : "center" }}>{s}</span>
          ))}
        </div>
      </div>

      {step === 0 && (
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 10px" }}>{t.title}</h1>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>{t.welcome_text}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{t.language}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["en","is"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: "10px 16px", borderRadius: "var(--border-radius-md)", border: lang === l ? "2px solid #1D9E75" : "0.5px solid var(--color-border-secondary)", background: lang === l ? "#E1F5EE" : "var(--color-background-primary)", color: lang === l ? "#0F6E56" : "var(--color-text-primary)", fontWeight: lang === l ? 500 : 400, cursor: "pointer", fontSize: 14 }}>
                  {l === "en" ? "🇬🇧 English" : "🇮🇸 Íslenska"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{t.full_name}</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t.name_placeholder} style={{ width: "100%", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.email_placeholder} style={{ width: "100%", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{t.coach_name}</label>
            <input value={coachName} onChange={e => setCoachName(e.target.value)} placeholder={t.coach_placeholder} style={{ width: "100%", boxSizing: "border-box" }} />
          </div>
          {error && <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button onClick={handleInfoNext} style={{ width: "100%", padding: "12px 24px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>{t.next} →</button>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={() => setShowGuide(true)} style={{ background: "none", border: "none", color: "var(--color-text-tertiary)", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
              {lang === "en" ? "ℹ Information for coaches" : "ℹ Upplýsingar fyrir þjálfara"}
            </button>
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.6, margin: 0 }}>{t.disclaimer}</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>{t.step_questions}</h1>
            <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 16px" }}>{name}</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 10px", lineHeight: 1.7 }}>{t.assessment_intro1}</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 10px", lineHeight: 1.7 }}>{t.assessment_intro2}</p>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.7 }}>{t.assessment_intro3}</p>
          </div>
          {(lang === "en" ? CATS_EN : CATS_IS_KEY).map(cat => {
            const qs = questions.filter(q => q.cat === cat);
            const label = catMapLabel[cat] || cat;
            return (
              <div key={cat} style={{ marginBottom: "1.5rem", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
                <div style={{ padding: "10px 1.25rem", background: "var(--color-background-secondary)", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--color-text-primary)" }}>{label}</h3>
                </div>
                <div style={{ padding: "0.75rem 1.25rem" }}>
                {qs.map((q, qIdx) => {
                  const idx = questions.indexOf(q);
                  return (
                    <div key={idx} style={{ borderBottom: qIdx < qs.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", paddingBottom: 14, paddingTop: qIdx === 0 ? 4 : 14 }}>
                      <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: "0 0 10px", lineHeight: 1.5, fontWeight: 400 }}>{q.q}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {[1,2,3,4,5,6].map(v => {
                          const sel = answers[idx] === v;
                          return (
                            <button key={v} onClick={() => { const a = [...answers]; a[idx] = v; setAnswers(a); }}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: "var(--border-radius-md)", border: sel ? "1.5px solid #1D9E75" : "0.5px solid var(--color-border-secondary)", background: sel ? "#E1F5EE" : "var(--color-background-secondary)", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                              <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: "50%", border: sel ? "none" : "1.5px solid #ccc", background: sel ? "#1D9E75" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {sel && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "block" }}></span>}
                              </div>
                              <span style={{ fontSize: 12, color: sel ? "#0F6E56" : "var(--color-text-secondary)", fontWeight: sel ? 600 : 400, lineHeight: 1.3 }}>{scoreLabels[v-1]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            );
          })}
          {error && <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          {(() => {
            const answered = answers.filter(a => a !== null).length;
            const total = questions.length;
            const pct = Math.round((answered / total) * 100);
            const remaining = total - answered;
            return (
              <div style={{ marginBottom: 12, padding: "10px 14px", background: answered === total ? "#E1F5EE" : "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", border: `0.5px solid ${answered === total ? "#5DCAA5" : "var(--color-border-secondary)"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: answered === total ? "#0F6E56" : "var(--color-text-secondary)" }}>
                  {answered === total
                    ? (lang === "en" ? "All questions answered ✓" : "Allar spurningar svaraðar ✓")
                    : (lang === "en" ? `${remaining} question${remaining !== 1 ? "s" : ""} remaining` : `${remaining} spurning${remaining !== 1 ? "ar" : ""} eftir`)}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: answered === total ? "#0F6E56" : "var(--color-text-secondary)" }}>{answered}/{total}</span>
              </div>
            );
          })()}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setStep(0)} style={{ flex: 1, padding: "12px", background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: 14 }}>{t.back}</button>
            <button onClick={handleAnswerNext} style={{ flex: 2, padding: "12px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>{t.next} →</button>
          </div>
        </div>
      )}

      {step === 2 && scores && bottomTop && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.7 }}>{t.followup_intro1}</p>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.7 }}>{t.followup_intro2}</p>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>{t.followup_intro3}</p>
          </div>

          {bottomTop.low.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#A32D2D", margin: "0 0 12px" }}>{t.areas_low}</p>
              {bottomTop.low.map(cat => {
                const label = catMapLabel[cat] || cat;
                const pItems = impPersonal[cat]?.low || [];
                const wItems = impWork[cat]?.low || [];
                return (
                  <div key={cat} style={{ marginBottom: 16, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
                    <div style={{ padding: "10px 1.25rem", background: "#FDF2F2", borderBottom: "0.5px solid #F5C6C6", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E24B4A", display: "inline-block", flexShrink: 0 }}></span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#A32D2D", flex: 1 }}>{label}</h3>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#A32D2D", background: "#FCEBEB", padding: "2px 8px", borderRadius: 20, border: "0.5px solid #F09595" }}>{scores[cat]?.toFixed(1)}</span>
                    </div>
                    <div style={{ padding: "1rem 1.25rem" }}>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px", fontWeight: 600 }}>{t.personal_impact}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 4px", lineHeight: 1.5, fontStyle: "italic" }}>{t.impact_low_personal}</p>
                    <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 8px" }}>{t.select_all}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                      {pItems.map(item => {
                        const sel = (personalSelections[cat] || []).includes(item);
                        return (
                          <button key={item} onClick={() => toggleSelection(personalSelections, setPersonalSelections, cat, item)}
                            style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: sel ? "#FCEBEB" : "var(--color-background-secondary)", border: sel ? "1.5px solid #E24B4A" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                            <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: sel ? "none" : "1px solid #ccc", background: sel ? "#E24B4A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                              {sel && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{item}</span>
                          </button>
                        );
                      })}
                      {(() => {
                        const selOther = (personalSelections[cat] || []).includes("__other__");
                        return (
                          <div key="__other_p__">
                            <button onClick={() => toggleSelection(personalSelections, setPersonalSelections, cat, "__other__")}
                              style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: selOther ? "#FCEBEB" : "var(--color-background-secondary)", border: selOther ? "1.5px solid #E24B4A" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                              <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: selOther ? "none" : "1px solid #ccc", background: selOther ? "#E24B4A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                                {selOther && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{lang === "en" ? "Other" : "Annað"}</span>
                            </button>
                            {selOther && (
                              <textarea value={personalOther[cat] || ""} onChange={e => setPersonalOther({ ...personalOther, [cat]: e.target.value })}
                                placeholder={lang === "en" ? "Please describe…" : "Lýstu nánar…"}
                                style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: "8px 10px", fontSize: 12, borderRadius: "var(--border-radius-md)", border: "1px solid #E24B4A", minHeight: 72, resize: "vertical" }} />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px", fontWeight: 500 }}>{t.workplace_impact}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 4px", lineHeight: 1.5, fontStyle: "italic" }}>{t.impact_low_workplace}</p>
                    <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 8px" }}>{t.select_all}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {wItems.map(item => {
                        const sel = (workplaceSelections[cat] || []).includes(item);
                        return (
                          <button key={item} onClick={() => toggleSelection(workplaceSelections, setWorkplaceSelections, cat, item)}
                            style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: sel ? "#FCEBEB" : "var(--color-background-secondary)", border: sel ? "1.5px solid #E24B4A" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                            <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: sel ? "none" : "1px solid #ccc", background: sel ? "#E24B4A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                              {sel && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{item}</span>
                          </button>
                        );
                      })}
                      {(() => {
                        const selOther = (workplaceSelections[cat] || []).includes("__other__");
                        return (
                          <div key="__other_w__">
                            <button onClick={() => toggleSelection(workplaceSelections, setWorkplaceSelections, cat, "__other__")}
                              style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: selOther ? "#FCEBEB" : "var(--color-background-secondary)", border: selOther ? "1.5px solid #E24B4A" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                              <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: selOther ? "none" : "1px solid #ccc", background: selOther ? "#E24B4A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                                {selOther && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{lang === "en" ? "Other" : "Annað"}</span>
                            </button>
                            {selOther && (
                              <textarea value={workplaceOther[cat] || ""} onChange={e => setWorkplaceOther({ ...workplaceOther, [cat]: e.target.value })}
                                placeholder={lang === "en" ? "Please describe…" : "Lýstu nánar…"}
                                style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: "8px 10px", fontSize: 12, borderRadius: "var(--border-radius-md)", border: "1px solid #E24B4A", minHeight: 72, resize: "vertical" }} />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {bottomTop.high.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#0F6E56", margin: "0 0 12px" }}>{t.areas_high}</p>
              {bottomTop.high.map(cat => {
                const label = catMapLabel[cat] || cat;
                const pItems = impPersonal[cat]?.high || [];
                const wItems = impWork[cat]?.high || [];
                return (
                  <div key={cat} style={{ marginBottom: 16, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
                    <div style={{ padding: "10px 1.25rem", background: "#F0FAF6", borderBottom: "0.5px solid #A8DFC9", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#1D9E75", display: "inline-block", flexShrink: 0 }}></span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#0F6E56", flex: 1 }}>{label}</h3>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0F6E56", background: "#E1F5EE", padding: "2px 8px", borderRadius: 20, border: "0.5px solid #5DCAA5" }}>{scores[cat]?.toFixed(1)}</span>
                    </div>
                    <div style={{ padding: "1rem 1.25rem" }}>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px", fontWeight: 600 }}>{t.personal_impact}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 4px", lineHeight: 1.5, fontStyle: "italic" }}>{t.impact_high_personal}</p>
                    <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 8px" }}>{t.select_all}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                      {pItems.map(item => {
                        const sel = (personalSelections[cat] || []).includes(item);
                        return (
                          <button key={item} onClick={() => toggleSelection(personalSelections, setPersonalSelections, cat, item)}
                            style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: sel ? "#E1F5EE" : "var(--color-background-secondary)", border: sel ? "1.5px solid #1D9E75" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                            <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: sel ? "none" : "1px solid #ccc", background: sel ? "#1D9E75" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                              {sel && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{item}</span>
                          </button>
                        );
                      })}
                      {(() => {
                        const selOther = (personalSelections[cat] || []).includes("__other__");
                        return (
                          <div key="__other_gp__">
                            <button onClick={() => toggleSelection(personalSelections, setPersonalSelections, cat, "__other__")}
                              style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: selOther ? "#E1F5EE" : "var(--color-background-secondary)", border: selOther ? "1.5px solid #1D9E75" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                              <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: selOther ? "none" : "1px solid #ccc", background: selOther ? "#1D9E75" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                                {selOther && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{lang === "en" ? "Other" : "Annað"}</span>
                            </button>
                            {selOther && (
                              <textarea value={personalOther[cat] || ""} onChange={e => setPersonalOther({ ...personalOther, [cat]: e.target.value })}
                                placeholder={lang === "en" ? "Please describe…" : "Lýstu nánar…"}
                                style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: "8px 10px", fontSize: 12, borderRadius: "var(--border-radius-md)", border: "1px solid #1D9E75", minHeight: 72, resize: "vertical" }} />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px", fontWeight: 500 }}>{t.workplace_impact}</p>
                    <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 4px", lineHeight: 1.5, fontStyle: "italic" }}>{t.impact_high_workplace}</p>
                    <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 8px" }}>{t.select_all}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {wItems.map(item => {
                        const sel = (workplaceSelections[cat] || []).includes(item);
                        return (
                          <button key={item} onClick={() => toggleSelection(workplaceSelections, setWorkplaceSelections, cat, item)}
                            style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: sel ? "#E1F5EE" : "var(--color-background-secondary)", border: sel ? "1.5px solid #1D9E75" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                            <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: sel ? "none" : "1px solid #ccc", background: sel ? "#1D9E75" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                              {sel && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                            </div>
                            <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{item}</span>
                          </button>
                        );
                      })}
                      {/* Other - workplace high */}
                      {(() => {
                        const selOther = (workplaceSelections[cat] || []).includes("__other__");
                        return (
                          <div>
                            <button onClick={() => toggleSelection(workplaceSelections, setWorkplaceSelections, cat, "__other__")}
                              style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--border-radius-md)", background: selOther ? "#E1F5EE" : "var(--color-background-secondary)", border: selOther ? "1.5px solid #1D9E75" : "0.5px solid var(--color-border-secondary)", width: "100%", textAlign: "left" }}>
                              <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: 4, border: selOther ? "none" : "1px solid #ccc", background: selOther ? "#1D9E75" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 }}>
                                {selOther && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{lang === "en" ? "Other" : "Annað"}</span>
                            </button>
                            {selOther && (
                              <textarea value={workplaceOther[cat] || ""} onChange={e => setWorkplaceOther({ ...workplaceOther, [cat]: e.target.value })}
                                placeholder={lang === "en" ? "Please describe…" : "Lýstu nánar…"}
                                style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: "8px 10px", fontSize: 12, borderRadius: "var(--border-radius-md)", border: "1px solid #1D9E75", minHeight: 72, resize: "vertical" }} />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {bottomTop.low.length === 0 && bottomTop.high.length === 0 && (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 14 }}>{t.no_triggers}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setStep(1)} disabled={sending} style={{ flex: 1, padding: "12px", background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: 14 }}>{t.back}</button>
            <button onClick={handleFollowupNext} disabled={sending}
              style={{ flex: 2, padding: "12px", background: sending ? "#9FE1CB" : "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 15, fontWeight: 500, cursor: sending ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
              {sending ? t.generating : `${t.submit} →`}
            </button>
          </div>
        </div>
      )}

      {step === 3 && scores && (
        <div id="print-root">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
            <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#0F6E56" }}>✓</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{t.sent_title}</h1>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: 0 }}>{t.sent_body}</p>
            </div>
          </div>

          <div style={{ padding: "1.25rem", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 2px" }}>{t.your_profile}</p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 16px" }}>{name}{coachName ? ` — Coach: ${coachName}` : ""}</p>
            <RadarChart scores={scores} catMap={catMapLabel} userName={name} t={t} />

            <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 6, marginTop: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 10px" }}>{t.score_overview}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(scores).sort((a, b) => a[1] - b[1]).map(([cat, val]) => {
                  const isLow = val < 3.5, isHigh = val > 4.5;
                  return (
                    <div key={cat} style={{ display: "grid", gridTemplateColumns: "140px 1fr 36px", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: isLow ? "#A32D2D" : isHigh ? "#0F6E56" : "var(--color-text-secondary)", fontWeight: isLow || isHigh ? 500 : 400 }}>
                        {catMapLabel[cat] || cat}
                      </span>
                      <div style={{ height: 6, background: "var(--color-background-tertiary)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${Math.round(((val - 1) / 5) * 100)}%`, height: "100%", background: isLow ? "#E24B4A" : isHigh ? "#1D9E75" : "#BA7517", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: isLow ? "#A32D2D" : isHigh ? "#0F6E56" : "var(--color-text-secondary)", textAlign: "right" }}>{val.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                {[{col:"#E24B4A",label: lang === "en" ? "Struggling (<3.5)" : "Erfitt (<3.5)"}, {col:"#BA7517",label: lang === "en" ? "Moderate" : "Miðlungs"}, {col:"#1D9E75",label: lang === "en" ? "Thriving (>4.5)" : "Blómstrar (>4.5)"}].map(({col,label}) => (
                  <span key={col} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, display: "inline-block" }}></span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {bottomTop && [...(bottomTop.low||[]), ...(bottomTop.high||[])].length > 0 && (
            <div style={{ padding: "1rem 1.25rem", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>{t.followup_summary}</p>
              <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 14px", lineHeight: 1.6 }}>{t.followup_summary_intro}</p>
              {[...(bottomTop.low||[]), ...(bottomTop.high||[])].map(cat => {
                const isLow = (bottomTop.low||[]).includes(cat);
                const borderCol = isLow ? "#E24B4A" : "#1D9E75";
                const bgCol = isLow ? "#FDF2F2" : "#F0FAF6";
                const labelCol = isLow ? "#A32D2D" : "#0F6E56";
                const pItems = (personalSelections[cat]||[]).filter(x=>x!=="__other__");
                const pOther = personalOther[cat] ? [personalOther[cat]] : [];
                const wItems = (workplaceSelections[cat]||[]).filter(x=>x!=="__other__");
                const wOther = workplaceOther[cat] ? [workplaceOther[cat]] : [];
                const allP = [...pItems, ...pOther];
                const allW = [...wItems, ...wOther];
                if (!allP.length && !allW.length) return null;
                return (
                  <div key={cat} style={{ marginBottom: 10, border: `0.5px solid ${borderCol}`, borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
                    <div style={{ padding: "7px 12px", background: bgCol, borderBottom: `0.5px solid ${borderCol}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: labelCol }}>{catMapLabel[cat] || cat}</span>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "white", border: `0.5px solid ${borderCol}`, color: labelCol }}>{isLow ? t.limiting : t.strength}</span>
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      {allP.length > 0 && (
                        <div style={{ marginBottom: allW.length > 0 ? 8 : 0 }}>
                          <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{t.personal_impact}</p>
                          <ul style={{ paddingLeft: 14, margin: 0 }}>
                            {allP.map((item, i) => <li key={i} style={{ fontSize: 11, color: "var(--color-text-primary)", lineHeight: 1.7 }}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                      {allW.length > 0 && (
                        <div>
                          <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{t.workplace_impact}</p>
                          <ul style={{ paddingLeft: 14, margin: 0 }}>
                            {allW.map((item, i) => <li key={i} style={{ fontSize: 11, color: "var(--color-text-primary)", lineHeight: 1.7 }}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {aiSummary && (
            <div style={{ padding: "1rem 1.25rem", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.coach_summary}</p>
              <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{aiSummary}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => printReport(name, email, coachName, scores, catMapLabel, aiSummary, lang)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              <span>⬇</span> {t.save_pdf}
            </button>
            <button onClick={resetApp} style={{ padding: "10px 24px", background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: 14 }}>
              {t.new_assessment}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
