import { useState, useEffect, useRef } from "react";

const EMAILJS_SERVICE_ID = "wellbeing_coach";
const EMAILJS_TEMPLATE_INITIAL = "template_ny13xqd";
const EMAILJS_TEMPLATE_FINAL = "template_qa34rqe";
const EMAILJS_PUBLIC_KEY = "wVPtnWicnjtiDxzag";

const LANG = {
  en: {
    title: "Well-being Assessment",
    subtitle: "Coaching Intake Questionnaire",
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
    followup_intro: "Based on your responses, please tell us more about the impact in these areas.",
    name_placeholder: "Enter your full name",
    email_placeholder: "your@email.com",
    required: "Please fill in all fields",
    invalid_email: "Please enter a valid email",
    generating: "Generating AI summary & final report…",
    q_required: "Please answer all questions before continuing.",
    your_profile: "Your well-being profile",
    score_overview: "Score overview",
    radar_legend_you: "Your score",
    radar_legend_mid: "Midpoint (3.5)",
    coach_summary: "AI coaching summary (for coach)",
    new_assessment: "Start new assessment",
    no_triggers: "Your scores are all in the moderate range. No follow-up categories triggered.",
  },
  is: {
    title: "Líðankannanir",
    subtitle: "Upptaksspurningar í þjálfun",
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
    areas_low: "Svæði þar sem gæti verið erfitt:",
    areas_high: "Svæði þar sem þú blómstrar:",
    followup_intro: "Út frá svörunum þínum, vinsamlega segðu okkur meira um áhrif á þessum sviðum.",
    q_required: "Vinsamlega svaraðu öllum spurningum áður en þú heldur áfram.",
    name_placeholder: "Sláðu inn fullt nafn",
    email_placeholder: "þitt@netfang.is",
    required: "Vinsamlega fylltu út alla reiti",
    invalid_email: "Vinsamlega sláðu inn gilt netfang",
    generating: "Búinn til AI samantekt og lokaskýrslu…",
    your_profile: "Líðansnið þitt",
    score_overview: "Yfirlit yfir stig",
    radar_legend_you: "Stigin þín",
    radar_legend_mid: "Miðpunktur (3.5)",
    coach_summary: "AI þjálfunarsamantekt (fyrir þjálfara)",
    new_assessment: "Byrja nýja könnun",
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
      <svg ref={svgRef} viewBox={`0 0 ${(cx + R + PAD) * 2} ${(cy + R + PAD) * 2 - 30}`} style={{ width: "100%", display: "block" }}
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

export default function WellbeingApp() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");
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
    // Fire email in background - don't block navigation
    const catMapLabelLocal = lang === "en" ? CAT_MAP_EN : CAT_MAP_IS;
    const scoreLines = Object.entries(s).map(([k, v]) => `${catMapLabelLocal[k] || k}: ${v.toFixed(2)}`).join("\n");
    const lowList = bt.low.map(c => catMapLabelLocal[c] || c).join(", ") || (lang === "en" ? "None" : "Enginn");
    const highList = bt.high.map(c => catMapLabelLocal[c] || c).join(", ") || (lang === "en" ? "None" : "Enginn");
    setTimeout(() => {
      if (window.emailjs) {
        window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_INITIAL, {
          participant_name: name,
          participant_email: email,
          scores: scoreLines,
          struggling: lowList,
          thriving: highList,
        }, EMAILJS_PUBLIC_KEY).catch(e => console.error("EmailJS initial send failed:", e));
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
    const summaryPrompt = `You are a professional well-being coach assistant. A client completed a well-being questionnaire. Write a concise, empathetic coaching summary (max 350 words) for the coach.

Client: ${name} (${email})

Category Scores (1–6 scale):
${Object.entries(scores).map(([k, v]) => `- ${catMapLabel[k] || k}: ${v.toFixed(2)}`).join("\n")}

Struggling (below 3.5): ${lowCats.map(c => catMapLabel[c] || c).join(", ") || "None"}
Thriving (above 4.5): ${highCats.map(c => catMapLabel[c] || c).join(", ") || "None"}

Personal impact — struggling:
${lowCats.map(c => `${catMapLabel[c] || c}: ${(personalSelections[c] || []).join("; ") || "None selected"}`).join("\n")}
Workplace impact — struggling:
${lowCats.map(c => `${catMapLabel[c] || c}: ${(workplaceSelections[c] || []).join("; ") || "None selected"}`).join("\n")}
Personal impact — thriving:
${highCats.map(c => `${catMapLabel[c] || c}: ${(personalSelections[c] || []).join("; ") || "None selected"}`).join("\n")}
Workplace impact — thriving:
${highCats.map(c => `${catMapLabel[c] || c}: ${(workplaceSelections[c] || []).join("; ") || "None selected"}`).join("\n")}

Write a structured summary with: (1) Key observations about struggling areas with empathy, (2) Strengths to leverage from thriving areas, (3) 2–3 suggested coaching focus areas. Be warm, professional, and actionable.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: summaryPrompt }] })
      });
      const data = await res.json();
      const summaryText = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
      setAiSummary(summaryText);
      aiSummaryText = summaryText;
    } catch (e) {
      const fallback = "Summary generation unavailable. Coach to review raw data.";
      setAiSummary(fallback);
      aiSummaryText = fallback;
    }
    setSending(false);

    try {
      if (window.emailjs) {
        const catMapLabelLocal = lang === "en" ? CAT_MAP_EN : CAT_MAP_IS;
        const scoreLines = Object.entries(scores).map(([k, v]) => `${catMapLabelLocal[k] || k}: ${v.toFixed(2)}`).join("\n");
        const lowList = bottomTop.low.map(c => catMapLabelLocal[c] || c).join(", ") || (lang === "en" ? "None" : "Enginn");
        const highList = bottomTop.high.map(c => catMapLabelLocal[c] || c).join(", ") || (lang === "en" ? "None" : "Enginn");
        const personalLines = [...bottomTop.low, ...bottomTop.high]
          .map(c => `${catMapLabelLocal[c] || c}: ${(personalSelections[c] || []).join("; ") || "-"}`)
          .join("\n");
        const workplaceLines = [...bottomTop.low, ...bottomTop.high]
          .map(c => `${catMapLabelLocal[c] || c}: ${(workplaceSelections[c] || []).join("; ") || "-"}`)
          .join("\n");
        const pdfB64Final = await generateReportPDF(name, email, scores, catMapLabelLocal, lang);
        const finalParams = {
          participant_name: name,
          participant_email: email,
          scores: scoreLines,
          struggling: lowList,
          thriving: highList,
          personal_impact: personalLines,
          workplace_impact: workplaceLines,
          ai_summary: aiSummaryText,
        };
        if (pdfB64Final) {
          finalParams.attachment_data = pdfB64Final;
          finalParams.attachment_name = `wellbeing_final_report_${name.replace(/\s+/g,"_")}.pdf`;
          finalParams.attachment_mime = "application/pdf";
        }
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_FINAL, finalParams, EMAILJS_PUBLIC_KEY);
      }
    } catch (e) { console.error("EmailJS final send failed:", e); }

    setStep(3);
  };

  const STEPS = [t.step_info, t.step_questions, t.step_followup, t.step_complete];
  const displayStep = step;

  const resetApp = () => {
    setStep(0); setName(""); setEmail(""); setAnswers(Array(39).fill(null));
    setScores(null); setBottomTop(null); setPersonalSelections({});
    setWorkplaceSelections({}); setAiSummary("");
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
            <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>{t.title}</h1>
            <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: 14 }}>{t.subtitle}</p>
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
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.email_placeholder} style={{ width: "100%", boxSizing: "border-box" }} />
          </div>
          {error && <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button onClick={handleInfoNext} style={{ width: "100%", padding: "12px 24px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>{t.next} →</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>{t.step_questions}</h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: 0 }}>{name}</p>
          </div>
          {(lang === "en" ? CATS_EN : CATS_IS_KEY).map(cat => {
            const qs = questions.filter(q => q.cat === cat);
            const label = catMapLabel[cat] || cat;
            return (
              <div key={cat} style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 1rem" }}>{label}</h3>
                {qs.map(q => {
                  const idx = questions.indexOf(q);
                  return (
                    <div key={idx} style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 8px", lineHeight: 1.5 }}>{q.q}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4 }}>
                        {[1,2,3,4,5,6].map(v => (
                          <button key={v} onClick={() => { const a = [...answers]; a[idx] = v; setAnswers(a); }}
                            style={{ padding: "6px 2px", borderRadius: "var(--border-radius-md)", border: answers[idx] === v ? "2px solid #1D9E75" : "0.5px solid var(--color-border-secondary)", background: answers[idx] === v ? "#E1F5EE" : "var(--color-background-secondary)", color: answers[idx] === v ? "#0F6E56" : "var(--color-text-secondary)", fontSize: 10, fontWeight: answers[idx] === v ? 500 : 400, cursor: "pointer", lineHeight: 1.3 }}>
                            {scoreLabels[v-1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {error && <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setStep(0)} style={{ flex: 1, padding: "12px", background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: 14 }}>{t.back}</button>
            <button onClick={handleAnswerNext} style={{ flex: 2, padding: "12px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "var(--border-radius-md)", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>{t.next} →</button>
          </div>
        </div>
      )}

      {step === 2 && scores && bottomTop && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 4px" }}>{t.step_followup}</h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: 0 }}>{t.followup_intro}</p>
          </div>

          {bottomTop.low.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#A32D2D", margin: "0 0 12px" }}>{t.areas_low}</p>
              {bottomTop.low.map(cat => {
                const label = catMapLabel[cat] || cat;
                const pItems = impPersonal[cat]?.low || [];
                const wItems = impWork[cat]?.low || [];
                return (
                  <div key={cat} style={{ marginBottom: 16, padding: "1rem 1.25rem", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", borderLeft: "3px solid #E24B4A" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 12px" }}>{label} — {scores[cat]?.toFixed(1)}</h3>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>{t.personal_impact}</p>
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
                    </div>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>{t.workplace_impact}</p>
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
                  <div key={cat} style={{ marginBottom: 16, padding: "1rem 1.25rem", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", borderLeft: "3px solid #1D9E75" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 12px" }}>{label} — {scores[cat]?.toFixed(1)}</h3>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>{t.personal_impact}</p>
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
                    </div>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 6px", fontWeight: 500 }}>{t.workplace_impact}</p>
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
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
            <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#0F6E56" }}>✓</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{t.sent_title}</h1>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: 0 }}>{t.sent_body}</p>
            </div>
          </div>

          <div style={{ padding: "1.25rem", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 2px" }}>{t.your_profile}</p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 16px" }}>{name}</p>
            <RadarChart scores={scores} catMap={catMapLabel} userName={name} t={t} />

            <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 16, marginTop: 8 }}>
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

          {aiSummary && (
            <div style={{ padding: "1rem 1.25rem", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.coach_summary}</p>
              <p style={{ fontSize: 13, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{aiSummary}</p>
            </div>
          )}

          <button onClick={resetApp} style={{ padding: "10px 24px", background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: 14 }}>
            {t.new_assessment}
          </button>
        </div>
      )}
    </div>
  );
}
