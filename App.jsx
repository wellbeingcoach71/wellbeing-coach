import { useState, useEffect } from "react";

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
// Uses EmailJS public CDN — no backend needed.
// Service / template IDs below must be set up once at emailjs.com.
// The PUBLIC_KEY, SERVICE_ID and two TEMPLATE_IDs are the only values to swap.
const EJS = {
  PUBLIC_KEY:       "wVPtnWicnjtiDxzag",
  SERVICE_ID:       "wellbeing_coach",
  TEMPLATE_RESULTS: "template_qa34rqe",
  TEMPLATE_REPORT:  "template_ny13xqd",
  COACH_EMAIL:      "thebestwellbeingcoach@gmail.com",
};

function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => { window.emailjs.init({ publicKey: EJS.PUBLIC_KEY }); resolve(); };
    document.head.appendChild(s);
  });
}

// Build a plain-text score table for the email body
function buildScoresSummary(fullName, email, averages, lowCats, highCats, answers) {
  const date = new Date().toLocaleDateString("en-GB");
  const lines = [`Well-being Assessment Results`, `Participant: ${fullName} (${email})`, `Date: ${date}`, ``];
  if (lowCats.length) {
    lines.push(`⚠ DEVELOPMENT AREAS (score < 3.5)`);
    lowCats.forEach(i => lines.push(`  ${CATEGORIES_EN[i]}: ${averages[i]}/6`));
    lines.push(``);
  }
  if (highCats.length) {
    lines.push(`✦ STRENGTHS (score > 4.5)`);
    highCats.forEach(i => lines.push(`  ${CATEGORIES_EN[i]}: ${averages[i]}/6`));
    lines.push(``);
  }
  lines.push(`ALL CATEGORY AVERAGES`);
  averages.forEach((a, i) => { if (a != null) lines.push(`  ${CATEGORIES_EN[i]}: ${a}/6`); });
  lines.push(``);
  lines.push(`────────────────────────────────`);
  lines.push(`ALL 39 QUESTION RESPONSES`);
  lines.push(`────────────────────────────────`);
  const optLabels = ["","Never","Almost Never","Rarely","Sometimes","Often","Always"];
  let lastCat = -1;
  QUESTIONS.forEach((q, i) => {
    if (q.cat !== lastCat) {
      lines.push(``);
      lines.push(`[ ${CATEGORIES_EN[q.cat].toUpperCase()} ]`);
      lastCat = q.cat;
    }
    const raw = answers[i];
    if (raw != null) {
      const scored = getScore(raw, q.rev);
      const label = optLabels[raw] || raw;
      lines.push(`  • ${q.en}`);
      lines.push(`    Answer: ${label} → Score: ${scored}/6${q.rev ? " (reversed)" : ""}`);
    }
  });
  return lines.join("\n");
}

async function sendResultsEmail(fullName, participantEmail, averages, lowCats, highCats, answers) {
  await loadEmailJS();
  const body = buildScoresSummary(fullName, participantEmail, averages, lowCats, highCats, answers);
  return window.emailjs.send(EJS.SERVICE_ID, EJS.TEMPLATE_RESULTS, {
    to_email:         EJS.COACH_EMAIL,
    participant_name: fullName,
    participant_email: participantEmail,
    subject:          `Well-being Results — ${fullName}`,
    message:          body,
  });
}

async function sendReportEmail(fullName, participantEmail, reportText, fuSel, fuOther, lowCats, highCats) {
  await loadEmailJS();
  const followupLines = [];
  followupLines.push(`\n────────────────────────────────`);
  followupLines.push(`FOLLOW-UP RESPONSES`);
  followupLines.push(`────────────────────────────────`);
  [...lowCats.map(c=>({c,type:"low"})), ...highCats.map(c=>({c,type:"high"}))].forEach(({c,type})=>{
    followupLines.push(`\n[ ${CATEGORIES_EN[c].toUpperCase()} — ${type==="low"?"DEVELOPMENT AREA":"STRENGTH"} ]`);
    const pi = (fuSel["personal_"+c]||[]).filter(x=>x!=="__other__"&&x!=="__na__");
    const piOther = (fuOther||{})["other_personal_"+c]||"";
    const piNa = (fuSel["personal_"+c]||[]).includes("__na__");
    const wi = (fuSel["workplace_"+c]||[]).filter(x=>x!=="__other__"&&x!=="__na__");
    const wiOther = (fuOther||{})["other_workplace_"+c]||"";
    const wiNa = (fuSel["workplace_"+c]||[]).includes("__na__");
    if(piNa){ followupLines.push(`  Personal Impact: Not applicable`); }
    else if(pi.length||piOther){ followupLines.push(`  Personal Impact:`); pi.forEach(item => followupLines.push(`    ✓ ${item}`)); if(piOther) followupLines.push(`    ✓ Other: ${piOther}`); }
    if(wiNa){ followupLines.push(`  Workplace Impact: Not applicable`); }
    else if(wi.length||wiOther){ followupLines.push(`  Workplace Impact:`); wi.forEach(item => followupLines.push(`    ✓ ${item}`)); if(wiOther) followupLines.push(`    ✓ Other: ${wiOther}`); }
  });
  const fullMessage = reportText + followupLines.join("\n");
  return window.emailjs.send(EJS.SERVICE_ID, EJS.TEMPLATE_REPORT, {
    to_email:         EJS.COACH_EMAIL,
    participant_name: fullName,
    participant_email: participantEmail,
    subject:          `Well-being Coaching Report — ${fullName}`,
    message:          fullMessage,
  });
}

// ─── EXACT QUESTIONS FROM THE_INITIAL_QUESTIONS.DOCX ──────────────────────────
// Categories: 0=Workload 1=Energy&Wellbeing 2=Autonomy 3=Support 4=Development
//             5=Clarity 6=Balance 7=Health 8=DailyHabits 9=Hobbies 10=OverallWellbeing

const CATEGORIES_EN = [
  "Workload","Energy & Wellbeing","Autonomy","Support","Development",
  "Clarity","Work–Life Balance","Health","Daily Habits","Hobbies","Overall Well-being"
];
const CATEGORIES_IS = [
  "Vinnuálag","Orka og vellíðan","Stjórn og sjálfræði","Stuðningur","Þróun",
  "Skipulag","Jafnvægi","Heilsa","Daglegar venjur","Áhugamál","Heildarlíðan"
];

// Context text shown on each follow-up category page
const CAT_CONTEXT = [
  // 0 Workload
  { low_en: "This may indicate that your workload or work-related demands can at times feel difficult to manage or balance in your day-to-day work.",
    high_en: "This indicates that your workload feels manageable and that you are generally able to balance work demands effectively.",
    low_is: "Þetta getur bent til þess að vinnuálag þitt eða verkefnakröfur geti á stundum virkað erfið í daglegum störfum.",
    high_is: "Þetta bendir til þess að vinnuálagið þykir viðráðanlegt og að þér gangi almennt vel að jafna við kröfur í vinnu." },
  // 1 Energy & Wellbeing
  { low_en: "This may indicate that your work does not consistently support your energy, focus, or overall well-being.",
    high_en: "This indicates that your work supports your energy, focus, and overall sense of well-being.",
    low_is: "Þetta getur bent til þess að vinnan styðji ekki alltaf við orku þína, einbeitingu eða heildarlíðan.",
    high_is: "Þetta bendir til þess að vinnan styðji við orku þína, einbeitingu og heildarlíðan." },
  // 2 Autonomy
  { low_en: "This may indicate that you have limited control or flexibility in how you organise and carry out your work.",
    high_en: "This indicates that you have a good level of control and flexibility in how you organise and carry out your work.",
    low_is: "Þetta getur bent til þess að þú hafir takmarkaða stjórn eða sveigjanleika í því hvernig þú skipuleggur og framkvæmir vinnu þína.",
    high_is: "Þetta bendir til þess að þú hafir gott stig stjórnar og sveigjanleika í því hvernig þú skipuleggur og framkvæmir vinnu þína." },
  // 3 Support
  { low_en: "This may indicate that support, feedback, or collaboration in your work environment is not always sufficient or consistent.",
    high_en: "This indicates that you experience good support, feedback, and collaboration in your work environment.",
    low_is: "Þetta getur bent til þess að stuðningur, endurgjöf eða samvinna á vinnustaðnum sé ekki alltaf nægileg eða samkvæm.",
    high_is: "Þetta bendir til þess að þú upplifir góðan stuðning, endurgjöf og samvinnu á vinnustaðnum." },
  // 4 Development
  { low_en: "This may indicate that opportunities to learn, grow, and use your strengths are not fully present in your day-to-day work.",
    high_en: "This indicates that you have good opportunities to learn, grow, and use your strengths in your work.",
    low_is: "Þetta getur bent til þess að tækifæri til að læra, vaxa og nýta styrkleika séu ekki alltaf til staðar í daglegum störfum.",
    high_is: "Þetta bendir til þess að þú hafir góð tækifæri til að læra, vaxa og nýta styrkleika þína í vinnu." },
  // 5 Clarity
  { low_en: "This may indicate that expectations, roles, or priorities are not always fully clear in your day-to-day work.",
    high_en: "This indicates that expectations, roles, and priorities are generally clear in your work.",
    low_is: "Þetta getur bent til þess að væntingar, hlutverk eða forgangsmál séu ekki alltaf skýr í daglegum störfum.",
    high_is: "Þetta bendir til þess að væntingar, hlutverk og forgangsmál séu almennt skýr í vinnu þinni." },
  // 6 Work-Life Balance
  { low_en: "This may indicate that work and personal life are not always well balanced, and that work may at times impact your time or energy outside of work.",
    high_en: "This indicates that you are generally able to maintain a good balance between your work and personal life.",
    low_is: "Þetta getur bent til þess að vinnu- og einkalíf séu ekki alltaf í góðu jafnvægi og að vinnan geti á stundum haft áhrif á tíma eða orku utan vinnu.",
    high_is: "Þetta bendir til þess að þér gangi almennt vel að viðhalda góðu jafnvægi milli vinnu og einkalífs." },
  // 7 Health
  { low_en: "This may indicate that your current work situation or routines do not consistently support your health, energy, or recovery.",
    high_en: "This indicates that your current work situation and routines support your health, energy, and recovery.",
    low_is: "Þetta getur bent til þess að núverandi vinnuaðstæður eða rútínur styðji ekki alltaf við heilsu, orku eða endurheimt.",
    high_is: "Þetta bendir til þess að núverandi vinnuaðstæður og rútínur styðji við heilsu þína, orku og endurheimt." },
  // 8 Daily Habits
  { low_en: "This may indicate that your daily routines and habits do not always support focus, recovery, or overall well-being.",
    high_en: "This indicates that your daily routines and habits support focus, recovery, and overall well-being.",
    low_is: "Þetta getur bent til þess að daglegar rútínur og venjur styðji ekki alltaf við einbeitingu, endurheimt eða heildarlíðan.",
    high_is: "Þetta bendir til þess að daglegar rútínur og venjur styðji við einbeitingu, endurheimt og heildarlíðan." },
  // 9 Hobbies
  { low_en: "This may indicate that you do not consistently have time or opportunity to engage in activities that bring you enjoyment outside of work.",
    high_en: "This indicates that you have time and opportunity to engage in activities that bring you enjoyment outside of work.",
    low_is: "Þetta getur bent til þess að þú hafir ekki alltaf tíma eða tækifæri til að stunda athafnir sem gleðja þig utan vinnu.",
    high_is: "Þetta bendir til þess að þú hafir tíma og tækifæri til að stunda athafnir sem veita þér gleði utan vinnu." },
  // 10 Overall Well-being
  { low_en: "This may indicate that your overall sense of balance, control, or satisfaction in your day-to-day life could be improved.",
    high_en: "This indicates that you generally feel satisfied, balanced, and in control in your day-to-day life.",
    low_is: "Þetta getur bent til þess að heildartilfinning þín fyrir jafnvægi, stjórn eða ánægju í daglegu lífi gæti verið betri.",
    high_is: "Þetta bendir til þess að þér líður almennt vel, ert í jafnvægi og finnur fyrir stjórn í daglegu lífi." },
];

const QUESTIONS = [
  // Workload (0)
  { en:"I feel my workload is manageable",            is:"Ég upplifi að vinnuálagið sé viðráðanlegt",             rev:false, cat:0 },
  { en:"I find it easy to prioritize tasks",          is:"Ég á auðvelt með að forgangsraða verkefnum",            rev:false, cat:0 },
  { en:"There are clear expectations for me at work", is:"Það eru skýrar væntingar til mín í starfi",              rev:false, cat:0 },
  { en:"I feel stressed at work",                     is:"Ég finn fyrir álagi í starfi mínu",                      rev:true,  cat:0 },
  { en:"Work drains my energy",                       is:"Vinnan tekur frá mér orku",                             rev:true,  cat:0 },
  // Energy & Wellbeing (1)
  { en:"My job gives me energy",                      is:"Starfið gefur mér orku",                                 rev:false, cat:1 },
  { en:"I feel satisfied with my job",                is:"Ég finn ánægju í starfinu mínu",                        rev:false, cat:1 },
  { en:"I look forward to starting my workday",       is:"Ég hlakka til að byrja vinnudaginn",                    rev:false, cat:1 },
  { en:"I feel focused at work",                      is:"Ég upplifi mig einbeitt(a)n í vinnu",                   rev:false, cat:1 },
  { en:"I am able to recharge after a workday",       is:"Ég næ að endurhlaða mig eftir vinnudag",                rev:false, cat:1 },
  // Autonomy (2)
  { en:"I have control over how I organize my work",  is:"Ég hef stjórn á því hvernig ég skipulegg vinnuna mína", rev:false, cat:2 },
  { en:"I have influence over task prioritization",   is:"Ég hef áhrif á forgangsröðun verkefna",                 rev:false, cat:2 },
  { en:"I can adapt my work to my strengths",         is:"Ég get lagað vinnuna mína að mínum styrkleikum",        rev:false, cat:2 },
  // Support (3)
  { en:"I receive support from my direct manager",    is:"Ég fæ stuðning frá næsta stjórnanda",                   rev:false, cat:3 },
  { en:"I receive support from colleagues",           is:"Ég fæ stuðning frá samstarfsfólki",                     rev:false, cat:3 },
  { en:"There is good collaboration in my team",      is:"Það er gott samstarf í teyminu mínu",                   rev:false, cat:3 },
  { en:"I regularly receive useful feedback",         is:"Ég fæ reglulega gagnlega endurgjöf",                    rev:false, cat:3 },
  // Development (4)
  { en:"I have opportunities to develop my skills",   is:"Ég fæ tækifæri til að þróa færni mína",                rev:false, cat:4 },
  { en:"I use my strengths in my job",                is:"Ég nýti styrkleika mína í starfi",                      rev:false, cat:4 },
  { en:"I have opportunities to learn new things",    is:"Ég fæ tækifæri til að læra nýja hluti",                rev:false, cat:4 },
  { en:"My job helps me grow",                        is:"Starfið hjálpar mér að vaxa",                           rev:false, cat:4 },
  // Clarity (5)
  { en:"My role is clear",                            is:"Hlutverk mitt er skýrt",                                rev:false, cat:5 },
  { en:"My tasks are well defined",                   is:"Verkefni mín eru vel skilgreind",                       rev:false, cat:5 },
  { en:"Priorities are clear",                        is:"Forgangsröðun er skýr",                                 rev:false, cat:5 },
  // Work–Life Balance (6)
  { en:"I achieve a good balance between work and personal life", is:"Ég næ góðu jafnvægi milli vinnu og einkalífs", rev:false, cat:6 },
  { en:"I have enough time for family and friends",   is:"Ég á nægan tíma fyrir fjölskyldu og vini",             rev:false, cat:6 },
  { en:"Work negatively affects my free time",        is:"Vinnan hefur neikvæð áhrif á frítíma minn",            rev:true,  cat:6 },
  // Health (7)
  { en:"I exercise regularly",                        is:"Ég hreyfi mig reglulega",                               rev:false, cat:7 },
  { en:"I have energy to take care of my health after work", is:"Ég hef orku til að sinna heilsu minni eftir vinnu", rev:false, cat:7 },
  { en:"I get enough sleep",                          is:"Ég sef nægilega vel",                                   rev:false, cat:7 },
  // Daily Habits (8)
  { en:"I spend too much time on my phone",           is:"Ég eyði of miklum tíma í símanum",                     rev:true,  cat:8 },
  { en:"I can relax easily without screen time",      is:"Ég á auðvelt með að slaka á án skjánotkunar",          rev:false, cat:8 },
  { en:"I use my free time in a constructive way",    is:"Ég nýti frítímann á uppbyggilegan hátt",               rev:false, cat:8 },
  // Hobbies (9)
  { en:"I engage in my hobbies regularly",            is:"Ég sinni áhugamálum mínum reglulega",                  rev:false, cat:9 },
  { en:"I do things that bring me joy outside of work", is:"Ég geri hluti sem veita mér gleði utan vinnu",      rev:false, cat:9 },
  { en:"I make time for what I enjoy",                is:"Ég finn tíma fyrir það sem mér finnst skemmtilegt",    rev:false, cat:9 },
  // Overall Well-being (10)
  { en:"Overall, I am satisfied with my life",        is:"Ég er almennt ánægð/ánægður með lífið mitt",           rev:false, cat:10 },
  { en:"I feel balanced in my day-to-day life",       is:"Ég finn fyrir jafnvægi í daglegu lífi",                rev:false, cat:10 },
  { en:"I have control over my time and energy",      is:"Ég hef stjórn á tíma mínum og orku",                   rev:false, cat:10 },
];

const OPTIONS_EN = [
  {label:"Never",       score:1},
  {label:"Almost Never",score:2},
  {label:"Rarely",      score:3},
  {label:"Sometimes",   score:4},
  {label:"Often",       score:5},
  {label:"Always",      score:6},
];
const OPTIONS_IS = [
  {label:"Aldrei",       score:1},
  {label:"Nánast aldrei",score:2},
  {label:"Sjaldan",      score:3},
  {label:"Stundum",      score:4},
  {label:"Oft",          score:5},
  {label:"Alltaf",       score:6},
];

// ─── PERSONAL IMPACT (Impact_v2.docx) — checkbox statements per category ──────
// Index matches category index 0–10.  Each entry: { low:[...], high:[...] } in EN and IS.

const PERSONAL_IMPACT = [
  // 0 Workload
  { low_en:["The quality of my work decreases","I make more mistakes or need to rework tasks more often","I am less able to meet deadlines","I have less time to do things properly or improve processes","I am less patient in interactions","Work follows me outside work more (harder to switch off)"],
    low_is:["Gæði vinnunnar minnka","Ég geri fleiri mistök eða þarf oftar að endurtaka vinnu (rework)","Ég næ síður að ljúka við verkefni á réttum tíma","Ég hef minni tíma til að vinna hlutina vel","Ég er óþolinmóðari í samskiptum","Vinnan hefur áhrif á mig utan vinnu (ég á erfitt með að skilja vinnuna eftir)"],
    high_en:["I have the time to do things properly","I am better able to meet timelines","I can support others when needed","I have time to improve how we work (continuous improvement)","I experience fewer mistakes and less rework","Work has less impact on my personal time (easier to switch off)"],
    high_is:["Ég hef svigrúm til að vinna hlutina vel","Ég næ betur að standa við tímaáætlanir","Ég get hjálpað öðrum eða stutt teymið þegar þarf","Ég hef tíma til að bæta ferla/leiðir (sífelldar umbætur)","Ég upplifi færri mistök og þarf síður að gera hlutina aftur","Vinnan hefur minni áhrif á frítíma og á auðvelt með að leggja vinnuna til hliðar"] },
  // 1 Energy
  { low_en:["I withdraw more and participate less","I find it harder to bring a positive, encouraging presence to interactions","I more often have to \"push myself\" just to get through tasks","Work feels like it costs me more than it gives back","I am less likely to go beyond the minimum required"],
    low_is:["Ég dreg mig meira í hlé og tek síður þátt","Ég á erfiðara með að vera jákvæð/ur eða hvetjandi í samskiptum","Ég þarf oftar að \"keyra mig áfram\" til að ljúka verkefni","Ég upplifi að vinnan kosti mig meira en hún skilar","Ég legg mig síður fram umfram lágmark"],
    high_en:["I bring positive energy into the team","I am more likely to go beyond the minimum required","I cope better during peak periods without burning out","I am more able to think creatively and solve problems","Work gives me constructive energy that also carries into life outside work"],
    high_is:["Ég kem með jákvæðan kraft inn í teymið","Ég er líklegri til að leggja mig fram umfram lágmark","Ég á auðveldara með að takast á við álagstíma án þess að brotna niður","Ég næ betur að vera skapandi og finna lausnir","Ég upplifi að vinnan gefi mér \"uppbyggilega orku\" sem nýtist líka utan vinnu"] },
  // 2 Autonomy
  { low_en:["I more often wait for approval or instructions before starting on a project","Decisions are delayed and work gets stuck","I avoid taking on new responsibilities to reduce risk","I experience more micromanagement or monitoring","I am less likely to suggest improvements"],
    low_is:["Ég bíð oftar eftir samþykki/leiðbeiningum áður en ég vinn verkefnin","Ákvarðanir tefjast og verkefni standa í stað","Ég forðast að taka ábyrgð á nýjum hlutum (til að lenda ekki í vanda)","Mér finnst minnstu smáatriðum stýrt","Ég legg síður fram hugmyndir um breytingar/umbætur"],
    high_en:["I make decisions faster and resolve issues independently","I take more initiative and suggest improvements","I can adapt how I work to what is most effective","I experience more trust and less micromanagement","Work flows faster"],
    high_is:["Ég tek ákvarðanir hraðar og leysi mál sjálfstætt","Ég tek meiri frumkvæði og legg fram umbótahugmyndir","Ég get lagað vinnubrögð að því sem virkar best","Ég upplifi meira traust og minni eftirlit frá yfirmanni","Verkefni flæða hraðar í gegn"] },
  // 3 Support
  { low_en:["I hold back from raising problems or risks","I get stuck for longer on tasks","Misunderstandings increase and communication becomes harder","I feel more isolated in my work","I learn less from mistakes (less feedback/guidance)"],
    low_is:["Ég held frekar aftur af mér að tala um vandamál eða áhættu","Ég sit oftar lengur með verkefni af því mig vantar aðstoð","Misskilningur eykst og samskipti verða erfiðari","Ég upplifi meiri einangrun í verkefnum","Ég læri síður af mistökum"],
    high_en:["I am more willing to raise issues early (problems/risks)","I get unblocked faster when I need help","Collaboration works better and work moves faster","I learn faster and develop more in my role","I experience greater psychological safety in communication"],
    high_is:["Ég þori af fyrra bragði að ræða mál snemma (vandamál/áhætta)","Ég leysi hraðar úr hindrunum (fæ hjálp þegar þarf)","Samvinna gengur betur og verkefni fara hraðar í gegn","Ég læri hraðar og þróast meira í starfi","Ég upplifi meira öryggi í samskiptum (auðveldara að segja frá)"] },
  // 4 Development
  { low_en:["I feel more boredom or disengagement in my tasks","I experience less progress month to month","I lower my ambition to contribute ideas or extra effort","I more often consider looking for a new job","I feel my strengths are underused"],
    low_is:["Ég upplifi meiri leiða eða áhugaleysi í verkefnum","Ég finn fyrir litlum framgangi í starfinu frá mánuði til mánaðar","Ég veigra mig við að leggja fram hugmyndir","Ég velti oftar fyrir mér að skipta um starf","Ég finn að styrkleikar mínir nýtast ekki í starfi"],
    high_en:["I feel more motivated to contribute ideas and improvements","I experience regular progress and \"next steps\"","I feel more committed to staying in the role","I am more willing to take on new challenges","I feel I am building future-relevant skills"],
    high_is:["Ég finn meiri metnað til að leggja fram hugmyndir og bæta hluti","Ég upplifi reglulega framfarir og \"næsta skref\"","Ég finn meiri helgun/áhuga á að vera áfram í starfinu","Ég tek frekar að mér áskoranir og ný verkefni","Ég upplifi að ég sé að byggja upp færni til framtíðar"] },
  // 5 Clarity
  { low_en:["I spend more time searching for information or clarification","I do more duplicate work or rework","Work is delayed due to misunderstandings or unclear handoffs","I experience more unexpected changes that disrupt flow","Ownership between people/teams becomes unclear"],
    low_is:["Ég eyði meiri tíma í að leita að upplýsingum eða fá skýringar","Ég geri oftar tvíverkningar eða vinn oft hluti sem þarf að endurtaka","Verkefni tefjast vegna misskilnings eða óljósra væntinga","Ég upplifi \"óvæntar\" breytingar sem trufla flæði","Ábyrgð milli fólks/teyma verður óljós"],
    high_en:["Work flows better (less waiting, fewer delays)","I spend less time searching for information/clarification","Fewer misunderstandings and smoother handoffs","I can plan my week better and maintain focus","Less rework and higher efficiency"],
    high_is:["Verkefni flæða betur (minni bið, færri tafir)","Ég eyði minni tíma í að leita að upplýsingum/skýringum","Færri misskilningar og betri afhendingar milli fólks/teyma","Ég get planað vikuna betur og haldið fókus","Minna rework og meiri skilvirkni"] },
  // 6 Balance
  { low_en:["I cancel plans or skip social/hobby activities more often due to work","I feel \"always on\" outside working hours","I experience less recovery during personal time","I experience more friction at home (family/friends)","I struggle more to maintain routines (exercise, meals, bedtime)"],
    low_is:["Ég hætti oft við eða sleppi félagslífi/áhugamálum vegna vinnu","Ég er oft með hugann við vinnuna utan vinnutíma","Ég upplifi minni endurheimt í frítíma (hvíli mig ekki nægilega)","Það skapast meiri núningur heima (fjölskylda/vinir)","Ég á erfiðara með að halda rútínu (hreyfing, mat, svefntími)"],
    high_en:["I am more present outside work (family/friends)","I recover better in my personal time and show up refreshed","I can maintain routines better (exercise, meals, sleep)","I can plan personal time without work interfering","Less friction at home due to work"],
    high_is:["Ég er meira \"til staðar\" utan vinnu (fjölskylda/vinir)","Ég endurheimti mig betur í frítíma og mæti endurnærð/ur","Ég get haldið rútínu betur (hreyfing, mat, svefn)","Ég get planað frítíma án þess að vinnan trufli","Minni núningur heima vegna vinnu"] },
  // 7 Health
  { low_en:["I recover less well after demanding days","I more often experience physical tension or discomfort","I more often have to \"push through\" the day","I notice reduced stamina in everyday activities","I more often have to take it easy or skip things due to physical strain"],
    low_is:["Ég næ síður að jafna mig eftir erfiða daga (endurheimt)","Ég finn oftar fyrir líkamlegri spennu eða óþægindum","Ég þarf oftar að \"harka af mér\" í gegnum daginn","Ég finn að líkamleg geta/þol er minna í daglegum verkefnum","Ég þarf oftar að taka því rólega eða sleppa hlutum vegna líkamlegrar þreytu"],
    high_en:["I recover well after demanding days","I rarely experience physical tension/discomfort","I have good stamina throughout the day and in daily life","I can do what matters to me outside work without physical strain","My physical capacity supports my work rather than limits it"],
    high_is:["Ég jafna mig vel eftir erfiða daga og finn fyrir góðri endurheimt","Ég finn sjaldnar fyrir líkamlegri spennu/óþægindum","Ég hef gott úthald yfir daginn og í daglegu lífi","Ég get sinnt því sem skiptir mig máli utan vinnu án þess að vera úrvinda","Ég finn að líkamleg geta styður mig í starfi (ekki hamlar)"] },
  // 8 Daily Habits
  { low_en:["I struggle to stick to routines and habits","I procrastinate more and find it harder to get started","I more often end up on \"autopilot\" after work","I feel more restless and less mentally calm","I do fewer activities that genuinely restore me"],
    low_is:["Ég á erfitt með að sinna rútínunni minni","Ég fresta meira (procrastination) og á erfiðara með að byrja á hlutum","Ég enda oft á sjálfsstýringunni eftir vinnu","Ég finn meiri óróleika og minna rólegt hugarástand","Ég næ síður að gera hluti sem endurnæra mig raunverulega"],
    high_en:["I maintain routines and habits that support me","I find it easier to start constructive activities after work","I more often do things that genuinely restore me","I feel calmer and clearer in daily life","I manage my personal time better (less autopilot)"],
    high_is:["Ég held góðri rútínu sem styður mig","Ég byrja auðveldara á uppbyggilegum hlutum eftir vinnu","Ég næ oftar að gera hluti sem endurnæra mig raunverulega","Ég finn meiri ró og skýrleika í daglegu lífi","Ég stýri frítíma mínum betur (fer síður á sjálfsstýringuna \"autopilot\")"] },
  // 9 Hobbies
  { low_en:["I experience less joy or lightness in life overall","I nurture relationships less (more social withdrawal)","I feel less of a sense of identity outside work (life narrows)","My personal time feels less restorative","Work crowds out what energises me"],
    low_is:["Ég finn minna fyrir gleði eða \"léttleika\" í lífinu almennt","Ég rækta síður tengsl við fólk (félagsleg einangrun eykst)","Ég upplifi að sjálfsmynd mín og trú á eigin getu er lág","Ég upplifi að frítími skili minni endurheimt","Ég finn að vinnan hefur áhrif á það sem nærir mig"],
    high_en:["I experience more joy and recovery outside work","I nurture relationships and social life better","I feel a stronger identity outside work (life feels fuller)","Hobbies help me disconnect and return refreshed","Life supports my work (not only the other way around)"],
    high_is:["Ég finn meiri gleði og endurheimt utan vinnu","Ég rækta betur tengsl og félagslíf","Ég upplifi sterkari sjálfsmynd utan vinnu","Áhugamál hjálpa mér að aftengja mig og mæta endurnærð/ur","Ég finn að lífið nærir vinnuna (ekki bara öfugt)"] },
  // 10 Overall
  { low_en:["I more often feel overwhelmed (\"too much going on\")","I am more easily irritated or short-tempered","I find it harder to enjoy time off (my mind doesn't switch off)","I feel less optimistic about the months ahead","I feel the current setup is not sustainable long-term"],
    low_is:["Ég finn oftar fyrir yfirþyrmandi tilfinningu (\"of mikið í gangi\")","Ég pirrast auðveldlega","Ég á erfiðara með að njóta frítíma því hugurinn er í vinnunni","Ég finn minni bjartsýni um næstu mánuði","Ég upplifi að \"kerfið\" sé ekki sjálfbært til lengri tíma"],
    high_en:["I feel calmer and more stable in daily life","I am more patient and even-tempered in interactions","I am better able to enjoy time off and be present","I feel more optimistic about the months ahead","I feel work and life are sustainable long-term"],
    high_is:["Ég finn meiri ró og stöðugleika í daglegu lífi","Ég er þolinmóðari og jafnari í samskiptum","Ég næ betur að njóta frítíma og vera til staðar","Ég finn meiri bjartsýni og trú á næstu mánuði","Ég upplifi að líf og vinna séu sjálfbær til lengri tíma"] },
];

// ─── WORKPLACE IMPACT (Workplace_2.docx) ──────────────────────────────────────

const WORKPLACE_IMPACT = [
  // 0 Workload
  { low_en:["Work or service quality decreases","Tasks are delayed or pile up","More rework and errors","Workload spills over to others","Less time for improvement and development"],
    low_is:["Gæði eða þjónusta við viðskiptavini getur verið lakari","Verkefni tefjast eða safnast upp","Meiri hætta á misstökum","Álag færist yfir á aðra í teyminu","Minni tími til umbóta og þróunar"],
    high_en:["Quality and delivery remain stable","Work flows more smoothly","Workload is shared more evenly","Time is available for improvement","Work is more sustainable long-term"],
    high_is:["Gæði og afhending haldast stöðug","Verkefni flæða betur í gegn","Álag dreifist jafnar í teyminu","Tími skapast fyrir umbætur","Vinnan er sjálfbær til lengri tíma"] },
  // 1 Energy
  { low_en:["Lower participation and initiative","Fatigue or negativity spreads","Peak periods are harder to manage","Higher risk of absence","Reduced operational flexibility"],
    low_is:["Minni þátttaka og frumkvæði innan teymisins","Þreyta eða neikvæð stemning hefur áhrif á samstarfsfólk","Erfiðara að takast á við álagstíma","Meiri hætta á fjarvistum","Minni sveigjanleiki í rekstri"],
    high_en:["Positive energy in the team","Better resilience during high pressure","Fewer absences","Greater day-to-day stability","Better customer/user experience"],
    high_is:["Jákvæð orka í teyminu","Betri seigla þegar álag eykst","Færri fjarvistir","Meiri stöðugleiki í daglegum rekstri","Betri upplifun fyrir viðskiptavini/notendur"] },
  // 2 Autonomy
  { low_en:["Decision-making slows down","Process bottlenecks increase","Lower employee initiative","More micromanagement","Unclear ownership"],
    low_is:["Ákvarðanir tefjast","Flöskuhálsar og verkefni eiga á hættu að sitja föst","Minna frumkvæði hjá starfsfólki","Meira einblínt á smáatriði","Óljós ábyrgð"],
    high_en:["Faster decisions","Work progresses independently","Higher initiative and problem-solving","Less need for micromanagement","Clear ownership"],
    high_is:["Ákvarðanir teknar hraðar","Verkefni flæða sjálfstæðar í gegn","Meira frumkvæði og lausnamiðun","Minni þörf fyrir smáatriðastýringu","Skýr ábyrgð í teyminu"] },
  // 3 Support
  { low_en:["Issues surface too late","Tasks remain blocked longer","More communication breakdowns","Less learning from mistakes","Less trust in the team"],
    low_is:["Vandamál koma seint upp","Flöskuháls myndast","Meiri misskilningur í samskiptum","Minni lærdómur af mistökum","Minna traust innan teymisins"],
    high_en:["Issues are raised early","Work gets unblocked faster","Better collaboration and information flow","More learning and development","Stronger psychological safety"],
    high_is:["Vandamál eru leyst snemma","Verkefni leysast hraðar","Betri samvinna og upplýsingaflæði","Meiri lærdómur og þróun","Sterkara sálrænt öryggi"] },
  // 4 Development
  { low_en:["Less innovation and improvement","Role stagnation","Higher turnover intention","Underutilised skills","Weaker future capability"],
    low_is:["Minni nýsköpun og umbætur","Stöðnun innan teymisins og ekki hægt að fá meiri ábyrgð","Hugsa oftar um að hætta í starfinu","Færni mín nýtist verr innan teymisins","Erfiðara að byggja framtíðarhæfni"],
    high_en:["More innovation and development","People grow into responsibility","Lower turnover","Better use of strengths","Stronger future capability"],
    high_is:["Meiri nýsköpun og þróun","Fólk vex inn í ábyrgð","Minni starfsmannavelta","Styrkleikar nýtast betur","Betri framtíðarhæfni vinnustaðar"] },
  // 5 Clarity
  { low_en:["Work is delayed due to lack of clarity","More duplicate work or rework","Misunderstandings between teams","Unexpected changes disrupt flow","Unclear handoffs"],
    low_is:["Verkefni tefjast vegna óskýrleika","Meiri tvíverknaður","Misskilningur milli teyma","Ófyrirséðar breytingar trufla flæði","Óljóst hver eigi að ljúka verkefninu"],
    high_en:["Work flows more smoothly","Fewer misunderstandings","Clear handoffs","Better planning and focus","Less wasted time"],
    high_is:["Verkefni flæða betur í gegn","Færri misskilningar","Skýr afhending milli teyma","Betri skipulagning og fókus","Minna sóun á tíma"] },
  // 6 Balance
  { low_en:["Fatigue spreads in the team","Harder to staff peak periods","Higher burnout risk","Less operational stability","Increased absence"],
    low_is:["Meiri þreyta smitast í teymið","Erfiðara að manna álagstíma","Meiri líkur á kulnun","Minni stöðugleiki í rekstri","Aukin fjarvist eða veikindi"],
    high_en:["People show up more refreshed","Better coverage during peak periods","Lower burnout risk","Greater stability","More sustainable workplace"],
    high_is:["Fólk mætir endurnært til vinnu","Betri viðvera í álagstímum","Minni kulnunaráhætta","Meiri stöðugleiki","Sjálfbærari vinnustaður"] },
  // 7 Health
  { low_en:["Physical strain affects work contribution","Reduced stamina over the day","Higher risk of illness","Harder to maintain consistent performance","Greater vulnerability to pressure"],
    low_is:["Meiri líkamleg þreyta hefur áhrif á vinnuframlag","Færni og þol minnka yfir daginn","Meiri líkur á veikindum","Erfiðara að halda jöfnum afköstum","Meiri viðkvæmni fyrir álagi"],
    high_en:["More consistent performance","Better stamina throughout the day","Fewer sick days","More energy in the team","Healthier work environment"],
    high_is:["Jöfn og stöðug frammistaða","Betra úthald yfir vinnudaginn","Færri veikindadagar","Meiri orka í teyminu","Heilsusamlegra vinnuumhverfi"] },
  // 8 Daily Habits
  { low_en:["Lower day-to-day focus","Harder to maintain routines","More distraction and disorganisation","Lower efficiency","Harder to sustain balance"],
    low_is:["Minni einbeiting í daglegu starfi","Erfiðara að halda rútínu í teyminu","Meiri truflun og óskipulag","Minni skilvirkni","Erfiðara að viðhalda jafnvægi"],
    high_en:["Better daily focus","Clearer routines","Higher efficiency","Fewer distractions","More stable work flow"],
    high_is:["Betri einbeiting í daglegu starfi","Skýrari rútína í teyminu","Meiri skilvirkni","Minni truflun","Stöðugra vinnuflæði"] },
  // 9 Hobbies
  { low_en:["Less recovery outside work","More fatigue at work","Life becomes too work-centred","Lower long-term resilience","Higher burnout risk"],
    low_is:["Minni endurheimt utan vinnu","Meiri þreyta í vinnu","Lífið þrengist of mikið að vinnu","Minni langtímaseigla","Aukin kulnunaráhætta"],
    high_en:["Better recovery between workdays","More energy at work","Stronger long-term resilience","Life supports work (not only the other way around)","Healthier balance"],
    high_is:["Betri endurheimt milli vinnudaga","Meiri orka í vinnu","Betri langtímaseigla","Mitt eigið líf styður vinnuna","Heilbrigðara jafnvægi"] },
  // 10 Overall
  { low_en:["Tension spreads in interactions","Collaboration under pressure becomes harder","Lower optimism in the team","Weaker connection to the workplace","Reduced organisational sustainability"],
    low_is:["Spenna verður í samskiptum","Erfiðara að vinna saman undir álagi","Minni bjartsýni í teyminu","Veikari tenging við vinnustaðinn","Sjálfbærni vinnustaðarins veikist"],
    high_en:["Calm and stability in collaboration","Better teamwork under pressure","Higher optimism and trust","Stronger connection to the workplace","More sustainable organisational culture"],
    high_is:["Ró og stöðugleiki í samstarfi","Betri samvinna í krefjandi aðstæðum","Meiri bjartsýni og traust","Sterkari tenging við vinnustaðinn","Sjálfbær vinnustaðamenning"] },
];

// ─── SCORING ──────────────────────────────────────────────────────────────────

function getScore(raw, reversed) { return reversed ? 7 - raw : raw; }

function computeAverages(answers) {
  const sums = new Array(11).fill(0), counts = new Array(11).fill(0);
  QUESTIONS.forEach((q, i) => {
    if (answers[i] != null) { sums[q.cat] += getScore(answers[i], q.rev); counts[q.cat]++; }
  });
  return sums.map((s, i) => counts[i] ? +(s / counts[i]).toFixed(2) : null);
}

function getFlags(avgs) {
  const withIdx = avgs.map((a, i) => ({ a, i })).filter(x => x.a != null);
  const low  = withIdx.filter(x => x.a < 3.5).sort((a,b)=>a.a-b.a).slice(0,4).map(x=>x.i);
  const high = withIdx.filter(x => x.a > 4.5).sort((a,b)=>b.a-a.a).slice(0,4).map(x=>x.i);
  return { low, high };
}

// ─── AI REPORT ────────────────────────────────────────────────────────────────

async function generateAIReport(userData) {
  const { fullName, email, lang, answers, averages, lowCats, highCats, followupSelections } = userData;
  const catNamesEN = CATEGORIES_EN;

  const avgLines = averages.map((a,i)=>a!=null?`${catNamesEN[i]}: ${a}/6`:"").filter(Boolean).join("\n");

  const followupLines = [
    ...lowCats.map(ci=>({ ci, type:"low" })),
    ...highCats.map(ci=>({ ci, type:"high" }))
  ].map(({ci, type})=>{
    const piRaw = (followupSelections[`personal_${ci}`]||[]);
    const wiRaw = (followupSelections[`workplace_${ci}`]||[]);
    const piNa = piRaw.includes("__na__");
    const wiNa = wiRaw.includes("__na__");
    const piOtherText = (followupOther||{})[`other_personal_${ci}`]||"";
    const wiOtherText = (followupOther||{})[`other_workplace_${ci}`]||"";
    const piItems = piRaw.filter(x=>x!=="__na__"&&x!=="__other__");
    const wiItems = wiRaw.filter(x=>x!=="__na__"&&x!=="__other__");
    if(piOtherText) piItems.push("Other: "+piOtherText);
    if(wiOtherText) wiItems.push("Other: "+wiOtherText);
    const pi = piNa ? "Not applicable" : piItems.join("; ") || "(none selected)";
    const wi = wiNa ? "Not applicable" : wiItems.join("; ") || "(none selected)";
    return `\n[${catNamesEN[ci]} — ${type.toUpperCase()}]\nPersonal impact selected: ${pi||"(none)"}\nWorkplace impact selected: ${wi||"(none)"}`;
  }).join("\n");

  const prompt = `Generate a well-being coaching report for ${fullName} (${email}).

CATEGORY AVERAGES (1–6 scale):
${avgLines}

LOW-SCORING (below 3.5): ${lowCats.map(i=>catNamesEN[i]).join(", ")||"None"}
HIGH-SCORING (above 4.5): ${highCats.map(i=>catNamesEN[i]).join(", ")||"None"}

FOLLOW-UP IMPACT SELECTIONS:
${followupLines||"(No follow-up required)"}

Write a structured coaching report with:
1. Executive Summary (2–3 sentences)
2. Areas of Strength — what is working well and what the high scores suggest
3. Areas for Development — key challenges, patterns, and what the low scores + follow-up selections reveal
4. Key Themes & Patterns observed across categories
5. Recommended Coaching Focus (3–5 specific, actionable suggestions)
6. Suggested Conversation Starters for the coaching session

Be specific, empathetic, and reference the participant's actual selected impacts. Write for a professional coach who will use this to prepare.`;

  const res = await fetch("/api/generate", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-haiku-4-5-20251001",
      max_tokens:1000,
      system:"You are an expert well-being coach and report writer. Write professional, warm, and insightful coaching reports.",
      messages:[{role:"user",content:prompt}]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Report generation failed.";
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

function ProgressBar({current, total}) {
  const pct = Math.round((current/total)*100);
  return (
    <div style={{marginBottom:"1.75rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.72rem",color:"var(--muted)",marginBottom:"0.35rem",letterSpacing:"0.08em",textTransform:"uppercase"}}>
        <span>{current} / {total}</span><span>{pct}%</span>
      </div>
      <div style={{height:"3px",background:"var(--track)",borderRadius:"99px",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:"var(--accent)",borderRadius:"99px",transition:"width 0.5s ease"}}/>
      </div>
    </div>
  );
}

function ScoreBar({avg}) {
  const pct = ((avg-1)/5)*100;
  const col = avg<3.5?"#c1121f":avg>4.5?"#2d6a4f":"#d4a017";
  return (
    <div style={{flex:1,height:"5px",background:"var(--track)",borderRadius:"99px",overflow:"hidden",minWidth:60}}>
      <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:"99px",transition:"width 0.7s ease"}}/>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen]   = useState("intro");   // intro|quiz|results|followup|generating|done
  const [lang, setLang]       = useState("en");
  const [fullName, setName]   = useState("");
  const [email, setEmail]     = useState("");
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [answers, setAnswers] = useState({});
  const [qIdx, setQIdx]       = useState(0);
  const [revealed, setRevealed] = useState(false);

  const [averages, setAverages] = useState([]);
  const [lowCats, setLowCats]   = useState([]);
  const [highCats, setHighCats] = useState([]);

  // followup
  const [fuGroups, setFuGroups]       = useState([]); // [{cat, type}]
  const [fuStep, setFuStep]           = useState(0);
  const [fuSection, setFuSection]     = useState("personal"); // personal|workplace
  const [fuSel, setFuSel]             = useState({});  // key: `personal_${cat}` or `workplace_${cat}` → [str]
  const [fuOther, setFuOther]           = useState({});  // key: `other_personal_${cat}` etc → string

  const [report, setReport]   = useState("");

  const opts = lang==="en" ? OPTIONS_EN : OPTIONS_IS;
  const catN = lang==="en" ? CATEGORIES_EN : CATEGORIES_IS;
  const q    = QUESTIONS[qIdx];

  // ── Intro submit ──
  function handleStart() {
    let ok=true;
    if(!fullName.trim()){setNameErr(lang==="en"?"Please enter your full name.":"Vinsamlegast sláðu inn fullt nafn.");ok=false;}else setNameErr("");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setEmailErr(lang==="en"?"Please enter a valid email.":"Vinsamlegast sláðu inn gilt netfang.");ok=false;}else setEmailErr("");
    if(ok){setScreen("quiz");}
  }

  // ── Answer selection ──
  function selectOpt(score) {
    const upd = {...answers,[qIdx]:score};
    setAnswers(upd);
    setRevealed(true);
    setTimeout(()=>{
      setRevealed(false);
      if(qIdx<QUESTIONS.length-1){ setQIdx(qIdx+1); }
      else {
        const avgs = computeAverages(upd);
        setAverages(avgs);
        const {low,high} = getFlags(avgs);
        setLowCats(low); setHighCats(high);
        // Email 1: scores summary → coach
        sendResultsEmail(fullName, email, avgs, low, high, upd).catch(()=>{});
        setScreen("results");
      }
    }, 300);
  }

  // ── Start follow-up ──
  function startFollowup() {
    const groups = [
      ...lowCats.map(cat=>({cat,type:"low"})),
      ...highCats.map(cat=>({cat,type:"high"}))
    ];
    if(groups.length===0){generateReport(); return;}
    setFuGroups(groups);
    setFuStep(0);
    setFuSection("personal");
    setScreen("followup");
  }

  // ── Toggle checkbox ──
  function toggleItem(key, item) {
    setFuSel(prev=>{
      const cur = prev[key]||[];
      return {...prev, [key]: cur.includes(item) ? cur.filter(x=>x!==item) : [...cur,item]};
    });
  }

  // ── Next followup step ──
  function fuNext() {
    if(fuSection==="personal"){setFuSection("workplace");return;}
    if(fuStep<fuGroups.length-1){setFuStep(fuStep+1);setFuSection("personal");return;}
    generateReport();
  }

  // ── Generate report ──
  async function generateReport() {
    setScreen("generating");
    let txt = "";
    try {
      txt = await generateAIReport({fullName,email,lang,answers,averages,lowCats,highCats,followupSelections:fuSel,followupOther:fuOther});
    } catch(e) {
      txt = `Report generation encountered an error: ${e.message}\n\nScores:\n${averages.map((a,i)=>a!=null?`${CATEGORIES_EN[i]}: ${a}/6`:"").filter(Boolean).join("\n")}`;
    }
    setReport(txt);
    // Email 2: always send regardless of whether AI report succeeded
    try { await sendReportEmail(fullName, email, txt, fuSel, fuOther, lowCats, highCats); } catch(e) {}
    setScreen("done");
  }

  function resetAll() {
    setScreen("intro");setAnswers({});setQIdx(0);setName("");setEmail("");
    setAverages([]);setLowCats([]);setHighCats([]);setFuSel({});setFuOther({});setReport("");
  }

  // ── Current followup data ──
  const fuGroup = fuGroups[fuStep];
  const fuImpactData = fuGroup ? (fuSection==="personal"?PERSONAL_IMPACT[fuGroup.cat]:WORKPLACE_IMPACT[fuGroup.cat]) : null;
  const fuKey = fuGroup ? `${fuSection}_${fuGroup.cat}` : "";
  const fuOtherKey = fuGroup ? `other_${fuSection}_${fuGroup.cat}` : "";
  const fuOtherSel = fuGroup ? (fuSel[fuKey]||[]).includes("__other__") : false;
  const fuItems = fuGroup && fuImpactData
    ? (fuGroup.type==="low"
       ? (lang==="en"?fuImpactData.low_en:fuImpactData.low_is)
       : (lang==="en"?fuImpactData.high_en:fuImpactData.high_is))
    : [];

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        :root{
          --bg:#f4f1ec;--card:#fff;--text:#1c1917;--muted:#78716c;
          --accent:#2d6a4f;--accent2:#52b788;--low:#b91c1c;--high:#2d6a4f;
          --track:#e7e3dc;--border:#e5e0d8;
          --r:18px;--sh:0 2px 32px rgba(0,0,0,.07),0 1px 4px rgba(0,0,0,.04);
        }
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);font-family:'DM Sans',sans-serif;color:var(--text);}
        .root{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:2rem 1rem 5rem;}
        .card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);padding:2.5rem 2rem;width:100%;max-width:660px;}
        h1{font-family:'Fraunces',serif;font-size:clamp(2rem,5vw,2.8rem);font-weight:500;line-height:1.1;margin-bottom:.5rem;}
        h2{font-family:'Fraunces',serif;font-size:1.6rem;font-weight:500;margin-bottom:.9rem;}
        h3{font-family:'Fraunces',serif;font-size:1.15rem;font-weight:500;margin-bottom:.5rem;}
        .sub{color:var(--muted);font-size:.93rem;line-height:1.65;margin-bottom:1.8rem;}
        .lang-row{display:flex;gap:.5rem;margin-bottom:2rem;}
        .lang-btn{flex:1;padding:.65rem;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);font-family:inherit;font-size:.9rem;font-weight:500;cursor:pointer;color:var(--muted);transition:all .2s;}
        .lang-btn.on{border-color:var(--accent);background:var(--accent);color:#fff;}
        .field{margin-bottom:1.15rem;}
        label.lbl{display:block;font-size:.74rem;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin-bottom:.35rem;}
        input{width:100%;padding:.75rem 1rem;border:1.5px solid var(--border);border-radius:10px;font-family:inherit;font-size:.93rem;background:var(--bg);color:var(--text);outline:none;transition:border-color .2s;}
        input:focus{border-color:var(--accent2);}
        .err{color:var(--low);font-size:.78rem;margin-top:.28rem;}
        .btn{display:block;width:100%;padding:.82rem 1.5rem;background:var(--accent);color:#fff;border:none;border-radius:10px;font-family:inherit;font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;text-align:center;}
        .btn:hover{background:#1c4d37;transform:translateY(-1px);}
        .btn:disabled{opacity:.45;cursor:not-allowed;transform:none;}
        .btn-out{background:transparent;color:var(--accent);border:1.5px solid var(--accent);}
        .btn-out:hover{background:var(--accent);color:#fff;}
        .btn-sm{width:auto;padding:.55rem 1.2rem;font-size:.85rem;}
        .btn-row{display:flex;gap:.7rem;margin-top:1.2rem;}
        .divider{border:none;border-top:1px solid var(--border);margin:1.5rem 0;}
        /* Quiz */
        .q-cat{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent2);margin-bottom:.4rem;}
        .q-text{font-family:'Fraunces',serif;font-size:1.22rem;font-weight:300;line-height:1.5;margin-bottom:1.8rem;}
        .opts{display:flex;flex-direction:column;gap:.45rem;}
        .opt{padding:.82rem 1.1rem;border:1.5px solid var(--border);border-radius:10px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:.91rem;transition:all .15s;user-select:none;}
        .opt:hover{border-color:var(--accent2);background:#f0faf5;}
        .opt.sel{border-color:var(--accent);background:#e6f4ec;}
        .opt-dot{width:8px;height:8px;border-radius:50%;border:1.5px solid var(--border);}
        .opt.sel .opt-dot{background:var(--accent);border-color:var(--accent);}
        .q-nav{display:flex;justify-content:space-between;align-items:center;margin-top:1.3rem;}
        .back-btn{background:none;border:none;color:var(--muted);font-size:.83rem;cursor:pointer;font-family:inherit;}
        .back-btn:hover{color:var(--text);}
        /* Results */
        .sec-label{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:1.4rem 0 .7rem;}
        .cat-row{display:flex;align-items:center;gap:.9rem;padding:.65rem 0;border-bottom:1px solid var(--border);}
        .cat-row:last-child{border-bottom:none;}
        .cat-name{width:160px;font-size:.86rem;flex-shrink:0;}
        .cat-avg{font-size:.82rem;font-weight:600;width:32px;text-align:right;flex-shrink:0;}
        .badge{display:inline-block;padding:.18rem .55rem;border-radius:99px;font-size:.68rem;font-weight:700;letter-spacing:.04em;flex-shrink:0;}
        .badge-low{background:#fde8e8;color:var(--low);}
        .badge-high{background:#e6f4ec;color:var(--high);}
        .badge-mid{background:#fef3e0;color:#92400e;}
        /* Follow-up */
        .fu-header{display:flex;align-items:center;gap:.75rem;padding:.7rem 1rem;border-radius:10px;margin-bottom:1.2rem;}
        .fu-header.low{background:#fde8e8;}
        .fu-header.high{background:#e6f4ec;}
        .fu-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
        .fu-dot.low{background:var(--low);}
        .fu-dot.high{background:var(--high);}
        .fu-title{font-weight:600;font-size:.9rem;}
        .sec-tabs{display:flex;gap:.5rem;margin-bottom:1.2rem;}
        .sec-tab{flex:1;padding:.55rem;border-radius:8px;border:1.5px solid var(--border);background:var(--bg);font-family:inherit;font-size:.8rem;font-weight:600;cursor:pointer;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);transition:all .2s;}
        .sec-tab.on{border-color:var(--accent2);background:#e6f4ec;color:var(--accent);}
        .fu-intro{font-size:.88rem;color:var(--muted);margin-bottom:1rem;line-height:1.55;}
        .checks{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.2rem;}
        .check-item{display:flex;align-items:flex-start;gap:.75rem;padding:.75rem .9rem;border:1.5px solid var(--border);border-radius:10px;cursor:pointer;transition:all .15s;font-size:.88rem;line-height:1.45;}
        .check-item:hover{border-color:var(--accent2);background:#f0faf5;}
        .check-item.on{border-color:var(--accent);background:#e6f4ec;}
        .check-box{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--border);flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;transition:all .15s;}
        .check-item.on .check-box{background:var(--accent);border-color:var(--accent);}
        .check-tick{color:#fff;font-size:.75rem;font-weight:700;line-height:1;}
        .fu-stepper{display:flex;gap:.35rem;margin-bottom:1.5rem;flex-wrap:wrap;}
        .fu-pip{width:8px;height:8px;border-radius:50%;background:var(--track);flex-shrink:0;}
        .fu-pip.done{background:var(--accent2);}
        .fu-pip.cur{background:var(--accent);}
        /* Report */
        .report-box{background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:1.4rem;font-size:.87rem;line-height:1.75;white-space:pre-wrap;max-height:520px;overflow-y:auto;margin-bottom:1.4rem;}
        .spin{display:inline-block;width:28px;height:28px;border:3px solid var(--track);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .gen-area{display:flex;flex-direction:column;align-items:center;gap:1.2rem;padding:3.5rem 0;text-align:center;}
        .logo{display:flex;align-items:center;gap:.6rem;margin-bottom:1.5rem;}
        .logo-dot{width:9px;height:9px;border-radius:50%;background:var(--accent);}
        .logo-name{font-family:'Fraunces',serif;font-size:1.05rem;}
        @media(max-width:480px){.card{padding:1.4rem .9rem;}.cat-name{width:110px;font-size:.8rem;}}
      `}</style>

      <div className="card">
        <div className="logo"><div className="logo-dot"/><span className="logo-name">Wellbeing Coach</span></div>

        {/* ══ INTRO ══════════════════════════════════════════════════════════ */}
        {screen==="intro" && <>
          <h1>Well-being<br/><em style={{fontStyle:"italic",fontWeight:300}}>Assessment</em></h1>
          <p className="sub">This confidential questionnaire covers 11 well-being dimensions across your work and personal life. It takes about 5–7 minutes. Your responses help your coach personalise the conversation.</p>

          <div style={{marginBottom:".6rem"}}><label className="lbl">Language / Tungumál</label></div>
          <div className="lang-row">
            <button className={`lang-btn${lang==="en"?" on":""}`} onClick={()=>setLang("en")}>🇬🇧 English</button>
            <button className={`lang-btn${lang==="is"?" on":""}`} onClick={()=>setLang("is")}>🇮🇸 Íslenska</button>
          </div>

          <div className="field">
            <label className="lbl">{lang==="en"?"Full Name":"Fullt nafn"}</label>
            <input value={fullName} onChange={e=>setName(e.target.value)} placeholder={lang==="en"?"Jane Doe":"Jón Jónsson"}/>
            {nameErr && <div className="err">{nameErr}</div>}
          </div>
          <div className="field">
            <label className="lbl">{lang==="en"?"Email Address":"Netfang"}</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/>
            {emailErr && <div className="err">{emailErr}</div>}
          </div>
          <button className="btn" onClick={handleStart}>{lang==="en"?"Begin Assessment →":"Hefja mat →"}</button>
        </>}

        {/* ══ QUIZ ═══════════════════════════════════════════════════════════ */}
        {screen==="quiz" && <>
          <ProgressBar current={qIdx+1} total={QUESTIONS.length}/>
          <div className="q-cat">{catN[q.cat]}</div>
          <div className="q-text">{lang==="en"?q.en:q.is}</div>
          <div className="opts">
            {opts.map(o=>(
              <div key={o.score}
                className={`opt${answers[qIdx]===o.score?" sel":""}`}
                onClick={()=>selectOpt(o.score)}>
                <span>{o.label}</span>
                <div className="opt-dot"/>
              </div>
            ))}
          </div>
          <div className="q-nav">
            <button className="back-btn" onClick={()=>qIdx>0&&setQIdx(qIdx-1)}>
              {qIdx>0?(lang==="en"?"← Back":"← Til baka"):""}
            </button>
            {answers[qIdx]!=null && qIdx<QUESTIONS.length-1 &&
              <button className="btn btn-sm btn-out" onClick={()=>setQIdx(qIdx+1)}>
                {lang==="en"?"Next →":"Næsta →"}
              </button>}
          </div>
        </>}

        {/* ══ RESULTS ════════════════════════════════════════════════════════ */}
        {screen==="results" && <>
          <h2>{lang==="en"?"Your Results":"Niðurstöður þínar"}</h2>
          <p className="sub">
            {lang==="en"
              ?`Scores across all 11 categories. ${(lowCats.length||highCats.length)?"Categories outside the normal range will be explored in follow-up questions.":"All scores fall within the normal range."}`
              :`Niðurstöður yfir alla 11 flokka. ${(lowCats.length||highCats.length)?"Flokkar utan eðlilegra marka verða skoðaðir í eftirfylgnispurningum.":"Allar niðurstöður eru innan eðlilegra marka."}`}
          </p>

          {lowCats.length>0 && <>
            <div className="sec-label">⚠ {lang==="en"?"Development Areas":"Þróunarsvæði"}</div>
            {lowCats.map(i=>(
              <div className="cat-row" key={i}>
                <span className="cat-name">{catN[i]}</span>
                <ScoreBar avg={averages[i]}/>
                <span className="cat-avg" style={{color:"var(--low)"}}>{averages[i]}</span>
                <span className="badge badge-low">{lang==="en"?"Low":"Lágt"}</span>
              </div>
            ))}
          </>}

          {highCats.length>0 && <>
            <div className="sec-label">✦ {lang==="en"?"Strengths":"Styrkleikarnir"}</div>
            {highCats.map(i=>(
              <div className="cat-row" key={i}>
                <span className="cat-name">{catN[i]}</span>
                <ScoreBar avg={averages[i]}/>
                <span className="cat-avg" style={{color:"var(--high)"}}>{averages[i]}</span>
                <span className="badge badge-high">{lang==="en"?"High":"Hátt"}</span>
              </div>
            ))}
          </>}

          <div className="sec-label">{lang==="en"?"All Categories":"Allir flokkar"}</div>
          {averages.map((avg,i)=>avg!=null&&!lowCats.includes(i)&&!highCats.includes(i)?(
            <div className="cat-row" key={i}>
              <span className="cat-name">{catN[i]}</span>
              <ScoreBar avg={avg}/>
              <span className="cat-avg" style={{color:"var(--muted)"}}>{avg}</span>
              <span className="badge badge-mid">{lang==="en"?"Mid":"Miðlungs"}</span>
            </div>
          ):null)}

          <hr className="divider"/>
          {(lowCats.length||highCats.length) && (
            <div style={{background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:"10px",padding:"1rem 1.2rem",marginBottom:"1.3rem",fontSize:".88rem",lineHeight:"1.65",color:"var(--muted)"}}>
              {lang==="en"
                ? "Following the questionnaire you just completed, you will now be asked a few short follow-up questions. These focus on the areas that scored highest and lowest in your responses, helping to deepen the understanding of how they shape your day-to-day experience at work. Your input is valuable – it helps identify where change is needed and what is important to protect and strengthen moving forward."
                : "Í kjölfar spurningalistans sem þú varst að svara færðu nokkrar stuttar eftirfylgnispurningar. Þær beinast að þeim svæðum sem fengu hæstu og lægstu einkunn í svörum þínum og hjálpa til við að dýpka skilninginn á því hvernig þær móta daglega upplifun þína í vinnunni. Framlag þitt er dýrmætt – það hjálpar til við að greina hvar þörf er á breytingum og hvað er mikilvægt að vernda og styrkja til framtíðar."}
            </div>
          )}
          <button className="btn" onClick={startFollowup}>
            {(lowCats.length||highCats.length)
              ?(lang==="en"?"Continue to Follow-up →":"Halda áfram →")
              :(lang==="en"?"Submit →":"Senda →")}
          </button>
        </>}

        {/* ══ FOLLOW-UP ══════════════════════════════════════════════════════ */}
        {screen==="followup" && fuGroup && <>
          <ProgressBar current={fuStep*2+(fuSection==="personal"?1:2)} total={fuGroups.length*2}/>

          {/* stepper pips */}
          <div className="fu-stepper">
            {fuGroups.map((g,i)=>{
              const done = i<fuStep || (i===fuStep&&fuSection==="workplace"&&(fuSel[`personal_${g.cat}`]||[]).length>0);
              const cur  = i===fuStep;
              return <div key={i} className={`fu-pip${done?" done":cur?" cur":""}`}/>;
            })}
          </div>

          <div className={`fu-header ${fuGroup.type}`}>
            <div className={`fu-dot ${fuGroup.type}`}/>
            <div>
              <div className="fu-title">{catN[fuGroup.cat]}</div>
              <div style={{fontSize:".78rem",color:"var(--muted)"}}>
                {fuGroup.type==="low"
                  ?(lang==="en"
                    ?`This category scored low in your responses (${averages[fuGroup.cat]}/6)`
                    :`Þessi flokkur fékk lágar einkunnir í svörum þínum (${averages[fuGroup.cat]}/6)`)
                  :(lang==="en"
                    ?`This category scored high in your responses (${averages[fuGroup.cat]}/6)`
                    :`Þessi flokkur fékk háar einkunnir í svörum þínum (${averages[fuGroup.cat]}/6)`)}
              </div>
            </div>
          </div>

          {/* Category context text */}
          {CAT_CONTEXT[fuGroup.cat] && (
            <div style={{fontSize:".88rem",lineHeight:"1.65",color:"var(--muted)",marginBottom:"1.2rem",padding:".85rem 1rem",background:"var(--bg)",borderRadius:"10px",border:"1.5px solid var(--border)"}}>
              {fuGroup.type==="low"
                ?(lang==="en"?CAT_CONTEXT[fuGroup.cat].low_en:CAT_CONTEXT[fuGroup.cat].low_is)
                :(lang==="en"?CAT_CONTEXT[fuGroup.cat].high_en:CAT_CONTEXT[fuGroup.cat].high_is)}
            </div>
          )}

          <div className="sec-tabs">
            <button className={`sec-tab${fuSection==="personal"?" on":""}`} onClick={()=>setFuSection("personal")}>
              {lang==="en"?"Personal Impact":"Persónuleg áhrif"}
            </button>
            <button className={`sec-tab${fuSection==="workplace"?" on":""}`} onClick={()=>setFuSection("workplace")}>
              {lang==="en"?"Workplace Impact":"Áhrif á vinnustað"}
            </button>
          </div>

          <div className="fu-intro">
            {fuSection==="personal"
              ?(lang==="en"?"What impact does this have on you? (Select all that apply)":"Hvaða áhrif hefur þetta helst á þig? (Veldu allt sem við á)")
              :(lang==="en"?"What impact do you think this has on the workplace and collaboration? (Select all that apply)":"Hvaða áhrif telur þú að þetta hafi helst á vinnustaðinn og samstarf? (Veldu allt sem við á)")}
          </div>

          <div className="checks">
            {fuItems.map((item,i)=>{
              const sel = (fuSel[fuKey]||[]).includes(item);
              return (
                <div key={i} className={`check-item${sel?" on":""}`} onClick={()=>toggleItem(fuKey,item)}>
                  <div className="check-box">{sel&&<span className="check-tick">✓</span>}</div>
                  <span>{item}</span>
                </div>
              );
            })}
            {/* Other option */}
            <div className={`check-item${fuOtherSel?" on":""}`} onClick={()=>toggleItem(fuKey,"__other__")}>
              <div className="check-box">{fuOtherSel&&<span className="check-tick">✓</span>}</div>
              <span style={{fontStyle:"italic"}}>{lang==="en"?"Other…":"Annað…"}</span>
            </div>
            {fuOtherSel && (
              <textarea
                style={{marginTop:".4rem"}}
                placeholder={lang==="en"?"Please describe…":"Vinsamlegast lýstu…"}
                value={fuOther[fuOtherKey]||""}
                onChange={e=>setFuOther(prev=>({...prev,[fuOtherKey]:e.target.value}))}
              />
            )}
            {/* Not applicable option */}
            {(() => {
              const naSel = (fuSel[fuKey]||[]).includes("__na__");
              return (
                <div className={`check-item${naSel?" on":""}`} onClick={()=>toggleItem(fuKey,"__na__")}>
                  <div className="check-box">{naSel&&<span className="check-tick">✓</span>}</div>
                  <span style={{color:"var(--muted)",fontStyle:"italic"}}>{lang==="en"?"Not applicable":"Á ekki við"}</span>
                </div>
              );
            })()}
          </div>

          <hr className="divider"/>
          <div className="btn-row">
            {(fuStep>0||fuSection==="workplace") &&
              <button className="btn btn-out" style={{flex:1}} onClick={()=>{
                if(fuSection==="workplace"){setFuSection("personal");}
                else{setFuStep(fuStep-1);setFuSection("workplace");}
              }}>
                {lang==="en"?"← Back":"← Til baka"}
              </button>}
            <button className="btn" style={{flex:2}} onClick={fuNext}>
              {fuSection==="personal"
                ?(lang==="en"?"Workplace Impact →":"Áhrif á vinnustað →")
                :fuStep<fuGroups.length-1
                  ?(lang==="en"?"Next Category →":"Næsti flokkur →")
                  :(lang==="en"?"Submit →":"Senda →")}
            </button>
          </div>
        </>}

        {/* ══ GENERATING ═════════════════════════════════════════════════════ */}
        {screen==="generating" && (
          <div className="gen-area">
            <div className="spin"/>
            <h2 style={{marginBottom:0}}>{lang==="en"?"Almost done…":"Næstum búið…"}</h2>
            <p style={{color:"var(--muted)",fontSize:".9rem",maxWidth:360}}>
              {lang==="en"
                ?"Please wait a moment while we process your responses."
                :"Vinsamlegast bíddu á meðan við vinnslu svörin þín."}
            </p>
          </div>
        )}

        {/* ══ DONE ═══════════════════════════════════════════════════════════ */}
        {screen==="done" && <>
          <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1.8rem"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:"#e6f4ec",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>✓</div>
            <div>
              <h2 style={{marginBottom:0}}>{lang==="en"?"Thank You":"Takk fyrir"}</h2>
              <p style={{color:"var(--muted)",fontSize:".82rem"}}>{fullName} · {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <p style={{fontSize:"1rem",lineHeight:"1.75",color:"var(--text)",marginBottom:"2rem"}}>
            {lang==="en"
              ? "You have now completed the questionnaires. Thank you for your thoughtful participation – taking time to reflect on your well-being is an important step. Your results can provide valuable insights into your energy, engagement, and needs. For further support and interpretation, please contact your well-being coach. Wishing you a mindful and energizing day."
              : "Þú hefur nú lokið spurningalistunum. Takk fyrir þátttökuna – að gefa sér tíma til að velta fyrir sér eigin líðan er mikilvægt skref. Niðurstöðurnar geta veitt dýrmætar upplýsingar um orku þína, þátttöku og þarfir. Fyrir frekari stuðning og túlkun skaltu hafa samband við líðanarþjálfara þinn. Við óskum þér meðvitundarfullrar og orkuríkrar dags."}
          </p>
          <button className="btn" onClick={resetAll}>
            {lang==="en"?"Start New Assessment":"Hefja nýtt mat"}
          </button>
        </>}
      </div>
    </div>
  );
}
