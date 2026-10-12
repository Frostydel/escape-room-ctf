/* ====================== ORGANIZERS: EDIT THE TEXT BELOW ====================== */
const SITE = {
  title: "Cyber Quest: Escape the Tech Club",
  owner: "Frost",
  story: "It is the night before open day. Glitch, the Tech Club's friendly bot, has locked the club room as a surprise escape game. To open the exit door you must type a 5-letter word. Each puzzle hides a flag and one exit letter inside the clue itself, so read carefully and write the letters in your notes. Some clues help with later puzzles.",
  school: "UM6P-CC"
};
const EXIT = "AWARE";   // letter N of this word is hidden in the puzzle that says "Exit letter N is ..."
/* Stations. {flag} inside msg is replaced by the flag. lock = index of a station that must be solved first. */
const ST = [
{type:"b64", icon:"🧾", name:"Whiteboard", t:"The whiteboard note", flag:"FLAG{whiteboard_decoded}", msg:"Shift key: 7. Exit letter 3 is A. {flag}",
 story:"Someone wrote a long string of letters and numbers on the whiteboard.",
 ins:"Decode the note. It holds more than the flag, so read all of it and write down what is useful.",
 hints:["The text uses only letters, numbers, + and /. That is a common way to write data as text.","Open the Base64 decoder in the Lab bar, paste the whole note, and read the entire sentence.","The flag looks like FLAG{...}. Write the other facts in My notes."],
 line:"Glitch: Beep! Decoding is not hacking. It is just reading data written another way.",
 exp:"Base64 is an encoding, not encryption. It changes how data is written so computers can store or send it, but anyone can decode it, so it hides nothing.",
 area:"Data representation and encoding: how computers store text and files as bytes."},
{type:"caesar", icon:"📚", name:"Bookshelf", t:"The bookshelf cipher", flag:"FLAG{shifted_by_seven}", msg:"Exit letter 1 is A. {flag}", shift:7, lock:0,
 lockMsg:"This cipher needs a shift key. Look for one on the whiteboard first.",
 story:"A book has a coded page. Each letter was moved forward in the alphabet by a secret amount.",
 ins:"Find the key in your notes, then move the letters back until the message is readable.",
 hints:["Each letter was moved forward by the same amount. You must move them back.","The shift key came from the whiteboard.","Paste the coded text into the Caesar shifter, set the slider to the key, and read the whole message."],
 line:"Glitch: Beep! Only 25 shifts exist. A computer could try them all in a blink.",
 exp:"A Caesar cipher swaps each letter for another one a fixed distance away. With only 25 possible shifts it is easy to break. It is great for learning, but not secure.",
 area:"Cryptography basics: how ciphers and keys work, and why real ones need far more than a simple shift."},
{type:"meta", icon:"🖼️", name:"Poster file", t:"The hidden clue in metadata", flag:"FLAG{metadata_tells_stories}",
 story:"The club drive holds several files. Find the picture of the open-day poster.",
 ins:"Inspect the picture's details and follow the instructions you find to build the flag.",
 hints:["Use the File inspector in the Lab bar. The open-day clue is a picture file (PNG), not a text document or presentation.","One field is a comment that explains what to do and gives an exit letter.","Join the Title and Subject values with an underscore, in lowercase, inside FLAG{ }."],
 line:"Glitch: Beep! Files remember more than you think. Check before you share.",
 exp:"Metadata is data about data: who made a file, when, with what, and sometimes notes. Investigators examine it during authorized digital forensics.",
 area:"Digital investigation: examining evidence carefully and with permission."},
{type:"log", icon:"🖥️", name:"Club PC log", t:"The sign-in log", flag:"FLAG{intern7_0312}",
 story:"The club PC kept a sign-in log last night. This is your own club's log, so reviewing it is allowed. One account had repeated failed sign-ins and then got in.",
 ins:"Find the account with at least 3 failed sign-ins followed by a success. The flag is FLAG{account_HHMM}, using the time of that success without the colon.",
 hints:["Use the Log filter in the Lab bar to show FAIL lines and count which account appears most.","Then filter for that account's name to see what happened next.","Sam only failed once, so Sam is not the answer. The flag format is FLAG{account_HHMM}."],
 line:"Glitch: Beep! Reading logs is how defenders notice that something strange happened.",
 exp:"Logs record what happened on a system. Investigators filter and compare entries to spot patterns, such as many failed sign-ins before a success. This is called log analysis, and it is done on systems you are authorized to review.",
 area:"Digital forensics and monitoring: finding patterns in evidence."},
{type:"bin", icon:"📟", name:"Keypad panel", t:"The keypad panel", flag:"FLAG{bits_n_bytes}", msg:"Exit letter 5 is 01000101. {flag}",
 story:"The keypad panel shows a long row of 0s and 1s. Computers store everything as numbers, and these hide a message.",
 ins:"Work through the number representations until you can read the flag and the exit letter.",
 hints:["Use the Binary, decimal and hex converter in the Lab bar. Each group of 8 bits is one character.","Convert the binary groups to decimal numbers, then convert those numbers to hexadecimal.","Convert the hexadecimal bytes to text. The exit letter follows the same binary → decimal → hex path: 01000101 is 69 in decimal, then 45 in hexadecimal."],
 line:"Glitch: Beep! Everything on a computer is bits. Encoding just decides how to read them.",
 exp:"Characters are stored as numbers, and numbers can be written in binary or hexadecimal. Changing representation does not hide anything, and layers of encoding are not encryption.",
 area:"Data representation: binary, hexadecimal and how computers store text."}
];
const FILES = [
 {n:"open_day_poster.png",f:[["Author","Tech Club Design Team"],["Software","Club Design App 2.1"],["Title","metadata"],["Subject","tells_stories"],["Keywords","poster, open day"],["Created","2026-03-14"],["Comment","Exit letter 2 is W. Flag recipe: FLAG{Title_Subject}, using the Title and Subject values in lowercase."]]},
 {n:"club_logo.png",f:[["Author","Tech Club Design Team"],["Title","logo"],["Subject","not_this_one"],["Comment","Just the club logo."]]},
 {n:"meeting_notes.txt",f:[["Author","Sam"],["Title","notes"],["Subject","weekly_meeting"],["Comment","Snacks are on Friday."]]}];
const LOG = `02:58 user=maya    sign-in OK    from=lab-pc-1
03:05 user=intern7 sign-in FAIL  from=lab-pc-3
03:06 user=intern7 sign-in FAIL  from=lab-pc-3
03:07 user=jon     sign-in OK    from=lab-pc-2
03:09 user=intern7 sign-in FAIL  from=lab-pc-3
03:10 user=sam     sign-in FAIL  from=lab-pc-4
03:12 user=intern7 sign-in OK    from=lab-pc-3
03:15 user=sam     sign-in OK    from=lab-pc-4
03:20 system       NOTE: Exit letter 4 is R. Log checked.`;
const TOOLS = [["file","File inspector"],["notes","My notes"],["log","Log filter"],["bin","Binary, decimal and hex converter"],["b64","Base64 decoder"],["cae","Caesar shifter"]];

/* ====================== GAME ENGINE (no need to edit) ====================== */
const $ = (s,r=document)=>r.querySelector(s), app = $("#app"), q = id=>document.getElementById(id);
const esc = s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rot = (s,n)=>s.replace(/[a-z]/gi,c=>{const b=c<"a"?65:97;return String.fromCharCode((c.charCodeAt(0)-b+n+26)%26+b)});
const norm = s=>s.trim().replace(/\s+/g," ").toLowerCase();
const fresh = ()=>({name:"",scr:"title",cur:0,solved:[0,0,0,0,0],hints:[0,0,0,0,0],dh:0,notes:""});
let S = fresh();
try{const x=sessionStorage.getItem("eq2");if(x)S=Object.assign(S,JSON.parse(x))}catch(e){}
const save = ()=>{try{sessionStorage.setItem("eq2",JSON.stringify(S))}catch(e){}};
const nS = ()=>S.solved.filter(Boolean).length;
const isOpen = k=>ST[k].lock===undefined||!!S.solved[ST[k].lock];
const fill = c=>c.msg.replace("{flag}",c.flag);
const toBin = s=>[...s].map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");
const toHex = s=>[...s].map(c=>c.charCodeAt(0).toString(16)).join(" ");
function go(scr,cur){S.scr=scr;if(cur!==undefined)S.cur=cur;save();route();window.scrollTo(0,0)}
function route(){
  const off=S.scr==="title"||S.scr==="results";q("layout").classList.toggle("nolab",off);q("lab").hidden=off;
  ({title,room,station,door,results})[S.scr]();
}
function setFb(msg,ok){const f=q("fb");f.style.display="block";f.className="fb "+(ok?"ok":"no");f.textContent=(ok?"✔ ":"✖ ")+msg}
function reset(){S=fresh();try{sessionStorage.removeItem("eq2")}catch(e){}q("nt").value="";go("title")}
/* ---- Lab bar ---- */
function lab(){
  q("lab").innerHTML=`<h2>🧪 Lab bar</h2><p class="small">All your tools live here. Open one, paste what you found, and read the result.</p>
  <div class="row" role="group" aria-label="Lab tools">${TOOLS.map(t=>`<button type="button" data-t="${t[0]}" aria-pressed="false" aria-controls="t-${t[0]}">${t[1]}</button>`).join("")}</div>
  <section id="t-b64" hidden><label for="b-in">Paste Base64 text</label><textarea id="b-in" rows="3" autocomplete="off"></textarea><p>Decoded:</p><output id="b-out" for="b-in">nothing yet</output></section>
  <section id="t-cae" hidden><label for="c-in">Paste the coded text</label><textarea id="c-in" rows="3" autocomplete="off"></textarea><label for="c-sh">Move each letter back by: <span id="c-v">0</span></label><input type="range" id="c-sh" min="0" max="25" value="0"><p>Result:</p><output id="c-out" for="c-in c-sh">nothing yet</output></section>
  <section id="t-file" hidden><label for="f-sel">Choose a file from the club drive</label><select id="f-sel"><option value="">Pick a file...</option>${FILES.map((f,k)=>`<option value="${k}">${f.n}</option>`).join("")}</select><div id="f-out" aria-live="polite"></div></section>
  <section id="t-log" hidden><label for="l-in">Paste the log</label><textarea id="l-in" rows="4" autocomplete="off"></textarea><label for="l-f">Show only lines containing</label><input type="text" id="l-f" autocomplete="off"><p class="small" id="l-c" aria-live="polite"></p><pre class="code" id="l-out"></pre></section>
  <section id="t-bin" hidden><label for="n-in">Paste the numbers</label><textarea id="n-in" rows="4" autocomplete="off"></textarea><label for="n-m">Convert</label><select id="n-m"><option value="b">Binary (bits) to decimal</option><option value="d">Decimal to hexadecimal</option><option value="h">Hexadecimal to text</option></select><p>Result:</p><output id="n-out" for="n-in n-m">nothing yet</output></section>
  <section id="t-notes" hidden><label for="nt">My notes (kept in this tab only)</label><textarea id="nt" rows="7"></textarea></section>`;
  document.querySelectorAll("#lab [data-t]").forEach(b=>b.onclick=()=>{const on=b.getAttribute("aria-pressed")!=="true";
    document.querySelectorAll("#lab [data-t]").forEach(x=>{x.setAttribute("aria-pressed","false");q("t-"+x.dataset.t).hidden=true});
    if(on){b.setAttribute("aria-pressed","true");q("t-"+b.dataset.t).hidden=false}});
  q("b-in").oninput=()=>{try{q("b-out").textContent=atob(q("b-in").value.trim())||"nothing yet"}catch(e){q("b-out").textContent="That does not look like Base64. Copy the whole text."}};
  const cu=()=>{q("c-v").textContent=q("c-sh").value;q("c-out").textContent=rot(q("c-in").value,-q("c-sh").value)||"nothing yet"};q("c-in").oninput=cu;q("c-sh").oninput=cu;
  q("f-sel").onchange=e=>{const f=FILES[e.target.value];q("f-out").innerHTML=f?`<table>${f.f.map(r=>`<tr><th scope="row">${r[0]}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>`:""};
  const lu=()=>{const L=q("l-in").value.split("\n").filter(x=>x.trim()),k=q("l-f").value.toLowerCase(),M=L.filter(x=>x.toLowerCase().includes(k));q("l-out").textContent=M.join("\n");q("l-c").textContent=L.length?`${M.length} of ${L.length} lines shown`:""};q("l-in").oninput=lu;q("l-f").oninput=lu;
  const nu=()=>{const mode=q("n-m").value,input=q("n-in").value.trim();let out="nothing yet";
    if(input){
      if(mode==="b"){
        const groups=input.split(/\s+/);const values=groups.map(x=>/^[01]{8}$/.test(x)?parseInt(x,2):NaN);
        out=values.some(isNaN)?"Use groups of 8 binary digits separated by spaces.":values.join(" ");
      }else if(mode==="d"){
        const groups=input.split(/[\s,]+/);const values=groups.map(x=>/^\d+$/.test(x)?Number(x):NaN);
        out=values.some(x=>isNaN(x)||x>255)?"Use decimal byte values from 0 to 255, separated by spaces.":values.map(x=>x.toString(16).padStart(2,"0")).join(" ");
      }else{
        const hex=input.replace(/\s+/g,"");const groups=hex.match(/.{1,2}/g)||[];
        out=!/^[0-9a-f]+$/i.test(hex)||hex.length%2?"Use pairs of hexadecimal digits.":String.fromCharCode(...groups.map(x=>parseInt(x,16)));
      }
    }q("n-out").textContent=out};q("n-in").oninput=nu;q("n-m").onchange=nu;
  q("nt").value=S.notes;q("nt").oninput=()=>{S.notes=q("nt").value;save()};
}
/* ---- screens ---- */
function title(){
  app.innerHTML=`<h1 id="h" tabindex="-1">${SITE.title}</h1>
  <div class="note"><p>${SITE.story}</p><p><strong>Escape room owner:</strong> ${SITE.owner} · <strong>School:</strong> ${SITE.school}</p><p><strong>Time:</strong> about 20 to 30 minutes. No timers, no scores, no pressure.</p></div>
  <p><strong>How to play:</strong> click objects in the room, use the tools in the Lab bar to solve each puzzle, and type its flag. Exit letters are hidden in the clues and are not recorded for you, so keep your own notes. Hints are always available.</p>
  <p><strong>Safe and private:</strong> everything here is fictional and runs inside this page. No real systems, accounts or passwords are involved, and nothing is sent anywhere. Real cybersecurity work is only done with permission.</p>
  <label for="nm">Your name (optional)</label><input type="text" id="nm" maxlength="20" autocomplete="off" aria-describedby="nmh" value="${esc(S.name)}">
  <p class="small" id="nmh">Please skip your real full name. It stays in this browser tab only.</p>
  <div class="row"><button class="main" id="go">Enter the room</button></div>`;
  q("go").onclick=()=>{S.name=q("nm").value.trim().slice(0,20);go("room")};
}
function room(){
  app.innerHTML=`<h1 id="h" tabindex="-1">The Tech Club room${S.name?" · "+esc(S.name):""}</h1><p>${nS()} of 5 puzzles solved. Click an object to investigate it. <a class="tolab" href="#lab">Jump to the Lab bar</a></p><progress max="5" value="${nS()}" style="width:100%" aria-label="Puzzles solved"></progress>
  <div class="room" role="group" aria-label="Objects in the room">${ST.map((c,k)=>{const o=isOpen(k),d=S.solved[k];return `<button class="obj ${d?"done":""}" data-k="${k}"><span class="ic" aria-hidden="true">${c.icon}</span><span>${c.name}</span><span class="st">${d?"✔ solved":o?"open":"🔒 locked"}</span></button>`}).join("")}
  <button class="obj door" id="door"><span class="ic" aria-hidden="true">🚪</span><span>Exit door<br><span class="st">${nS()===5?"unlocked: type the exit word":"🔒 locked until all 5 are solved"}</span></span></button></div>
  <section class="note"><h2 style="margin-top:0">Flags collected</h2><ul>${ST.map((c,k)=>S.solved[k]?`<li><strong>${c.name}:</strong> <code>${c.flag}</code></li>`:"").join("")||"<li>None yet.</li>"}</ul><p class="small">Exit letters are not recorded for you. Write them in My notes (Lab bar).</p></section>
  <div class="row"><button id="rs">Restart the game</button></div>`;
  q("h").focus();
  app.querySelectorAll(".obj[data-k]").forEach(b=>b.onclick=()=>{const k=+b.dataset.k;isOpen(k)?go("station",k):(b.querySelector(".st").textContent="🔒 "+ST[k].lockMsg)});
  q("door").onclick=()=>go("door");q("rs").onclick=reset;
}
function body(c){
  const data=`<p class="small">Copy the clue and paste it into a lab tool when you are ready.</p>`;
  if(c.type==="b64")return data+`<code class="code">${btoa(fill(c))}</code>`;
  if(c.type==="caesar")return data+`<code class="code">${rot(fill(c),c.shift)}</code>`;
  if(c.type==="meta")return data+`<p>The clue is in the club drive.</p>`;
  if(c.type==="log")return data+`<pre class="code" tabindex="0" aria-label="Sign-in log">${esc(LOG)}</pre>`;
  return data+`<code class="code">${toBin(fill(c))}</code>`;
}
function station(){
  const i=S.cur,c=ST[i],dn=S.solved[i];
  app.innerHTML=`<div class="back"><button id="bk">Back to the room</button> <a class="tolab" href="#lab">Jump to the Lab bar</a></div><h1 id="h" tabindex="-1"><span aria-hidden="true">${c.icon}</span> ${c.t}</h1><div class="note"><p>${c.story}</p><p><strong>What to do:</strong> ${c.ins}</p></div>${body(c)}
  <form id="f" onsubmit="document.getElementById('sub').click();return false"><label for="fl">Your flag (looks like FLAG{...})</label><input type="text" id="fl" autocomplete="off" spellcheck="false" ${dn?`value="${c.flag}" readonly`:""}>
  <div class="row"><button type="button" class="main" id="sub" ${dn?"disabled":""}>Submit flag</button><button type="button" id="hb" ${dn?"disabled":""}>Hint</button></div></form>
  <div id="hints" aria-live="polite"></div><div id="fb" class="fb" role="status" style="display:none"></div><div id="after"></div>`;
  q("h").focus();q("bk").onclick=()=>go("room");
  const showH=()=>{q("hints").innerHTML=c.hints.slice(0,S.hints[i]).map((h,k)=>`<p class="hint"><strong>Hint ${k+1}:</strong> ${h}</p>`).join("");const hb=q("hb"),all=S.hints[i]>=c.hints.length;hb.textContent=all?"No more hints":`Hint (${S.hints[i]} of ${c.hints.length} used)`;if(all)hb.disabled=true};
  q("hb").onclick=()=>{S.hints[i]++;save();showH()};showH();
  q("sub").onclick=()=>{const v=q("fl").value;
    if(norm(v)===norm(c.flag)){S.solved[i]=1;save();q("fl").readOnly=true;q("sub").disabled=true;q("hb").disabled=true;setFb("Correct! Flag collected: "+c.flag,true);after()}
    else setFb(v.trim()?"Not the flag yet. Check the spelling, or press Hint for a nudge.":"Type your flag first. It looks like FLAG{...}.",false)};
  function after(){
    q("after").innerHTML=`<p><strong>${c.line}</strong></p><p class="small">Did the clue mention an exit letter? Write it in My notes.</p><div class="row"><button id="ex" aria-expanded="false" aria-controls="exp">Show explanation</button><button class="main" id="nx">${nS()===5?"Go to the exit door":"Back to the room"}</button></div><div id="exp" class="note" hidden><p>${c.exp}</p><p><strong>Learning area:</strong> ${c.area}</p></div>`;
    q("ex").onclick=e=>{const x=q("exp");x.hidden=!x.hidden;e.target.textContent=x.hidden?"Show explanation":"Hide explanation";e.target.setAttribute("aria-expanded",!x.hidden)};
    q("nx").onclick=()=>go(nS()===5?"door":"room")}
  if(dn){setFb("Solved! Flag collected: "+c.flag,true);after()}
}
function door(){
  const ready=nS()===5;
  app.innerHTML=`<div class="back"><button id="bk">Back to the room</button> <a class="tolab" href="#lab">Jump to the Lab bar</a></div><h1 id="h" tabindex="-1">🚪 The exit door</h1>
  ${ready?`<div class="note"><p>The keypad has five empty boxes. Each puzzle said which letter it hides, such as "Exit letter 3 is ...". Type each letter in the right box.</p></div>
  <fieldset><legend>Exit word: one letter per box</legend><div class="row">${[1,2,3,4,5].map(n=>`<label class="lt-w">Letter ${n}<input type="text" class="lt" maxlength="1" autocomplete="off" spellcheck="false" data-n="${n}"></label>`).join("")}</div></fieldset>
  <div class="row"><button class="main" id="try">Open the door</button><button id="hb" type="button">Hint</button></div><div id="hints" aria-live="polite"></div><div id="fb" class="fb" role="status" style="display:none"></div>`
  :`<div class="note"><p>The door is locked. Solve all 5 puzzles to find every letter. You have solved ${nS()} so far.</p></div>`}`;
  q("h").focus();q("bk").onclick=()=>go("room");if(!ready)return;
  const DH=["Check My notes. Each of the 5 positions needs one letter.","If a position is missing, revisit the puzzle and read its decoded clue again.","The word describes the mindset good cybersecurity needs: being ___ of risks."];
  const sh=()=>{q("hints").innerHTML=DH.slice(0,S.dh).map((h,k)=>`<p class="hint"><strong>Hint ${k+1}:</strong> ${h}</p>`).join("");if(S.dh>=DH.length){q("hb").disabled=true;q("hb").textContent="No more hints"}};
  q("hb").onclick=()=>{S.dh++;save();sh()};sh();
  const L=[...app.querySelectorAll(".lt")];L.forEach((x,k)=>{x.oninput=()=>{if(x.value&&L[k+1])L[k+1].focus()};x.onkeydown=e=>{if(e.key==="Enter")q("try").click()}});
  q("try").onclick=()=>{const got=L.map(x=>x.value.toUpperCase());
    if(got.some(c=>!c))return setFb("Fill all five boxes first.",false);
    const ok=got.filter((c,i)=>c===EXIT[i]).length;
    ok===5?go("results"):setFb(`The keypad buzzes: ${ok} of 5 letters are in the right place. Check the clues for the others.`,false)};
}
function results(){
  app.innerHTML=`<h1 id="h" tabindex="-1">You escaped${S.name?", "+esc(S.name):""}! 🎉</h1>
  <div class="note"><p>The door swings open and Glitch cheers: "Welcome to open day! One last rule: always ask permission before testing anything that is not yours. Real security work is done with consent."</p><p>The exit word was <code>${EXIT}</code>.</p></div>
  <h2>Your flags and what each puzzle taught</h2>${ST.map((c,k)=>`<div class="note"><h3>${k+1}. ${c.t}</h3><p><code>${c.flag}</code></p><p>${c.exp}</p><p><strong>Learning area:</strong> ${c.area}</p><button data-k="${k}">Review this puzzle</button></div>`).join("")}
  <h2>How this connects to our major</h2><p>Cybersecurity combines computer science, problem-solving, careful reasoning and responsible practice. Today's puzzles link to real study areas:</p>
  <ul>${ST.map(c=>`<li><strong>${c.t}:</strong> ${c.area}</li>`).join("")}</ul>
  <p>These puzzles are simplified examples. Real security work needs deeper study and is always done with permission.</p>
  <h2>School</h2><div class="ph">${SITE.school}</div><p class="small">Escape room owner: ${SITE.owner}</p>
  <div class="row"><button class="main" id="again">Play again</button></div>`;
  q("h").focus();app.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>go("station",+b.dataset.k));q("again").onclick=reset;
}
lab();route();
