// ============================================================
//  ServiCo — Full 3-Role App Screens
//  HOW TO USE:
//  1. Open your Figma file
//  2. Plugins → Scripter → paste this entire code → click ▶️ Run
//  OR
//  3. Plugins → Development → Open Console → paste → Enter
// ============================================================

const W = 390, H = 844;

// ─── Color Tokens ───────────────────────────────────────────
const BG    = {r:0.04, g:0.04, b:0.05};
const CARD  = {r:0.12, g:0.12, b:0.14};
const CARD2 = {r:0.08, g:0.08, b:0.10};
const CY    = {r:0,    g:0.79, b:1   };
const OG    = {r:1,    g:0.42, b:0.21};
const WH    = {r:1,    g:1,    b:1   };
const GR    = {r:0.52, g:0.52, b:0.56};
const LG    = {r:0.76, g:0.76, b:0.80};
const GN    = {r:0.18, g:0.83, b:0.45};
const ST    = {r:1,    g:0.80, b:0   };
const RD    = {r:0.98, g:0.28, b:0.28};
const BK    = {r:0,    g:0,    b:0   };
const NV    = {r:0.01, g:0.14, b:0.22};
const BL    = {r:0.22, g:0.50, b:0.96};
const DEEP  = {r:0.055,g:0.055,b:0.065};
const PU    = {r:0.56, g:0.28, b:1   };
const AM    = {r:1,    g:0.72, b:0   };
const PK    = {r:0.60, g:0.28, b:1   };

// ─── Helpers ─────────────────────────────────────────────────
const sf = (c, a) => {
  const p = {type:'SOLID', color:{r:c.r, g:c.g, b:c.b}};
  if (a != null && a < 1) p.opacity = a;
  return [p];
};

const box = (pr, x, y, w, h, c, a, rad) => {
  const n = figma.createRectangle();
  n.x = x; n.y = y;
  n.resize(Math.max(w,1), Math.max(h,1));
  n.fills = sf(c, a);
  if (rad) n.cornerRadius = rad;
  pr.appendChild(n);
  return n;
};

const loaded = new Set();
const loadFont = async (fam, sty) => {
  const k = fam + '|' + sty;
  if (!loaded.has(k)) { await figma.loadFontAsync({family:fam, style:sty}); loaded.add(k); }
};

const txt = async (pr, s, x, y, sz, c, sty, a) => {
  const style = sty || 'Regular';
  await loadFont('Inter', style);
  const n = figma.createText();
  n.fontName = {family:'Inter', style};
  n.characters = String(s);
  n.fontSize = sz;
  n.fills = sf(c, a);
  n.x = x; n.y = y;
  pr.appendChild(n);
  return n;
};

const mkFrame = (pg, x, name) => {
  const f = figma.createFrame();
  f.name = name; f.x = x; f.y = 0;
  f.resize(W, H);
  f.fills = sf(BG);
  f.clipsContent = true;
  pg.appendChild(f);
  return f;
};

// FIX 3: gradientTransform [[0,0,0.5],[1,0,0]] = top-to-bottom gradient
const topGrad = (f, r2, g2, b2, ht) => {
  const g = figma.createRectangle();
  g.resize(W, ht || 280);
  g.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0,0,0.5],[1,0,0]],
    gradientStops: [
      {position:0, color:{r:r2, g:g2, b:b2, a:1}},
      {position:1, color:{r:BG.r, g:BG.g, b:BG.b, a:1}}
    ]
  }];
  f.appendChild(g);
};

const statusBar = async (f) => {
  await txt(f,'9:41',20,14,15,WH,'Semi Bold');
  for (let i=0;i<4;i++){const h=5+i*3;box(f,328+i*6,21-h,4,h,WH,i===3?0.3:1,1);}
  box(f,370,18,20,11,WH,0.2,3);box(f,371,19,14,9,GN,1,2);
};

const label = async (f, s) => await txt(f,s,16,H-20,9,CY,'Semi Bold',0.38);

// FIX 1: action (singular object) not actions (array) — Figma Plugin API requirement
const link = (fr, x, y, w, h, destId) => {
  const n = figma.createRectangle();
  n.name = 'tap'; n.x = x; n.y = y;
  n.resize(Math.max(w,1), Math.max(h,1));
  n.fills = [];
  n.reactions = [{
    actions: [{
      type: 'NODE',
      destinationId: destId,
      navigation: 'NAVIGATE',
      transition: {type:'SMART_ANIMATE', easing:{type:'EASE_IN_AND_OUT'}, duration:0.3},
      preserveScrollPosition: false
    }],
    trigger: {type:'ON_CLICK'}
  }];
  fr.appendChild(n);
};

// Stat card
const statBox = async (f, x, y, w, val, lbl, c) => {
  box(f,x,y,w,70,CARD,1,14); box(f,x,y,w,3,c,1,2);
  await txt(f,val,x+12,y+12,20,c,'Bold');
  await txt(f,lbl,x+12,y+44,10,GR);
};

// Bottom nav — Customer
const navC = async (f, act) => {
  box(f,0,H-76,W,76,DEEP); box(f,0,H-76,W,1,{r:.15,g:.15,b:.17});
  const lbs=['Home','Services','Bookings','Chat','Profile'];
  for(let i=0;i<5;i++){
    const nx=14+i*74;
    if(i===act) box(f,nx+6,H-74,28,3,CY,1,2);
    await txt(f,lbs[i],nx+2,H-52,9,i===act?CY:GR);
  }
};

// Bottom nav — Provider
const navP = async (f, act) => {
  box(f,0,H-76,W,76,DEEP); box(f,0,H-76,W,1,{r:.15,g:.15,b:.17});
  const lbs=['Dashboard','Jobs','Earnings','Profile'];
  for(let i=0;i<4;i++){
    const nx=26+i*86;
    if(i===act) box(f,nx+8,H-74,34,3,OG,1,2);
    await txt(f,lbs[i],nx,H-52,9,i===act?OG:GR);
  }
};

// Bottom nav — Admin
const navA = async (f, act) => {
  box(f,0,H-76,W,76,DEEP); box(f,0,H-76,W,1,{r:.15,g:.15,b:.17});
  const lbs=['Overview','Users','Orders','Reports'];
  for(let i=0;i<4;i++){
    const nx=26+i*86;
    if(i===act) box(f,nx+8,H-74,34,3,PK,1,2);
    await txt(f,lbs[i],nx,H-52,9,i===act?PK:GR);
  }
};

// ════════════════════════════════════════════════════════════
//   PAGE SETUP — ensure 3 pages exist
// ════════════════════════════════════════════════════════════
const root = figma.root;

// Rename page 1
root.children[0].name = '01 Customer';

// Add page 2 if missing
let provPage;
if (root.children.length < 2) {
  provPage = figma.createPage();
  provPage.name = '02 Service Provider';
} else {
  provPage = root.children[1];
  provPage.name = '02 Service Provider';
}

// Add page 3 if missing
let adminPage;
if (root.children.length < 3) {
  adminPage = figma.createPage();
  adminPage.name = '03 Admin';
} else {
  adminPage = root.children[2];
  adminPage.name = '03 Admin';
}

const custPage = root.children[0];

// ════════════════════════════════════════════════════════════
//  CUSTOMER SCREENS (Page 1) — 8 screens
// ════════════════════════════════════════════════════════════
await figma.setCurrentPageAsync(custPage);

// ── C1: LOGIN ───────────────────────────────────────────────
const C1 = async () => {
  const f = mkFrame(custPage, 0, 'C1 Login');
  topGrad(f, 0.01, 0.05, 0.18, H);
  // Logo
  box(f,153,68,84,84,CY,0.1,42); box(f,161,76,68,68,CY,1,34);
  await txt(f,'S',186,91,28,BK,'Bold');
  await txt(f,'ServiCo',140,166,24,WH,'Bold');
  await txt(f,'Car Wash & Technical Services',80,198,12,GR);
  // Tab switcher
  box(f,20,230,350,44,CARD,1,22); box(f,22,232,172,40,CY,1,20);
  await txt(f,'Login',80,243,14,BK,'Bold'); await txt(f,'Register',228,243,14,GR);
  // Fields
  await txt(f,'Mobile Number',20,290,12,LG);
  box(f,20,308,350,48,CARD,1,12);
  await txt(f,'+91',32,323,13,CY,'Semi Bold');
  box(f,68,322,1,24,GR,0.3);
  await txt(f,'98765 43210',76,323,13,LG);
  await txt(f,'Password',20,370,12,LG);
  box(f,20,388,350,48,CARD,1,12);
  await txt(f,'Enter password',32,404,13,GR);
  await txt(f,'Show',330,406,11,CY);
  await txt(f,'Forgot Password?',244,452,12,CY);
  // Primary CTA
  box(f,20,478,350,52,CY,1,26);
  await txt(f,'Login to ServiCo',108,492,15,BK,'Bold');
  // Secondary
  box(f,20,542,350,48,CARD,1,24);
  await txt(f,'Login with OTP',130,556,13,LG);
  // Divider
  box(f,20,606,148,1,GR,0.2); await txt(f,'or',184,600,12,GR); box(f,226,606,144,1,GR,0.2);
  // Google
  box(f,20,622,350,48,CARD,1,24);
  box(f,36,636,22,22,WH,1,11);
  await txt(f,'G',41,639,12,BL,'Bold');
  await txt(f,'Continue with Google',72,642,13,LG);
  // Register link
  await txt(f,"Don't have an account?",68,688,12,GR);
  await txt(f,'Register Now',258,688,12,CY);
  await label(f,'C1 / LOGIN');
  return f;
};

// ── C2: REGISTER ────────────────────────────────────────────
const C2 = async () => {
  const f = mkFrame(custPage, 450, 'C2 Register');
  await statusBar(f);
  box(f,16,42,36,36,CARD,1,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'Create Account',68,51,16,WH,'Bold');
  // Progress
  box(f,20,92,350,3,{r:.15,g:.15,b:.16},1,2); box(f,20,92,120,3,CY,1,2);
  await txt(f,'Step 1 of 3  —  Personal Info',20,102,10,GR);
  // Fields
  const flds = [['Full Name','Ramprasad Mokka',132],['Mobile','+91 98765 43210',192],['Email','ram@servico.app',252],['City','Banjara Hills, Hyderabad',312]];
  for (const fl of flds) {
    await txt(f,fl[0],20,fl[2]-14,12,LG);
    box(f,20,fl[2],350,46,CARD,1,12);
    await txt(f,fl[1],32,fl[2]+14,12,LG);
  }
  await txt(f,'Vehicle Type',20,374,12,LG);
  box(f,20,392,350,46,CARD,1,12); await txt(f,'Sedan  v',32,407,12,LG);
  // OTP section
  box(f,20,454,350,1,{r:.16,g:.16,b:.18});
  await txt(f,'OTP sent to +91 98765 43210',20,466,11,GR);
  const digs = ['8','4','2','_'];
  for (let i=0;i<4;i++) {
    const sel = i===3;
    if(sel){box(f,19+i*84,484,66,64,CY,1,13);box(f,20+i*84,485,64,62,NV,1,12);}
    else box(f,20+i*84,484,64,62,CARD,1,12);
    await txt(f,digs[i],42+i*84,505,22,sel?CY:WH,'Bold');
  }
  await txt(f,'Resend OTP in  0:38',132,562,11,GR);
  box(f,20,586,350,52,CY,1,26);
  await txt(f,'Verify & Continue',108,600,15,BK,'Bold');
  box(f,20,652,350,52,OG,1,26);
  await txt(f,'Set Password & Create Account',70,666,14,WH,'Bold');
  box(f,20,720,350,34,{r:.06,g:.22,b:.10},1,12);
  await txt(f,'Your data is encrypted and never shared',52,733,11,GN);
  await label(f,'C2 / REGISTER');
  return f;
};

// ── C3: HOME ────────────────────────────────────────────────
const C3 = async () => {
  const f = mkFrame(custPage, 900, 'C3 Home');
  topGrad(f,0.01,0.07,0.18,270);
  await statusBar(f);
  // Top bar
  box(f,20,42,272,34,CARD,1,17);
  await txt(f,'Banjara Hills, Hyderabad  v',28,51,12,LG);
  box(f,304,42,36,36,CARD,1,18); await txt(f,'Notif',310,51,10,WH);
  // Greeting
  await txt(f,'Good Morning,',20,90,13,GR);
  await txt(f,'What service today, Ram?',20,110,21,WH,'Bold');
  // Search
  box(f,20,146,350,46,CARD,1,14);
  await txt(f,'Search car wash, AC repair, tyres...',36,159,12,GR);
  // Promo banner — FIX 2: only append to f, not to custPage first
  const bn = figma.createFrame();
  bn.name='Promo'; bn.x=20; bn.y=204; bn.resize(350,106); bn.cornerRadius=16; bn.clipsContent=true; bn.fills=[];
  const bb = figma.createRectangle(); bb.resize(350,106);
  bb.fills=[{
    type:'GRADIENT_LINEAR',
    gradientTransform:[[0,0,0.5],[1,0,0]],
    gradientStops:[
      {position:0,color:{r:0,g:.79,b:1,a:1}},
      {position:1,color:{r:.04,g:.14,b:.52,a:1}}
    ]
  }];
  bn.appendChild(bb);
  box(bn,214,-22,158,158,WH,0.05,79);
  await txt(bn,'30% OFF',18,12,24,WH,'Bold');
  await txt(bn,'First booking — Use code FIRST30',18,46,11,WH,'Regular',0.88);
  box(bn,18,72,88,26,WH,1,13);
  await txt(bn,'Book Now',26,78,10,BK,'Semi Bold');
  await txt(bn,'Car',268,30,38,WH);
  f.appendChild(bn); // FIX 2: was custPage.appendChild(bn); f.appendChild(bn);
  // Services grid
  await txt(f,'Popular Services',20,324,15,WH,'Semi Bold');
  await txt(f,'See All',320,326,11,CY);
  const cats = [{n:'Car Wash',c:CY},{n:'AC Repair',c:OG},{n:'Tyre Fix',c:GN},{n:'Detailing',c:PU},{n:'Engine',c:{r:1,g:.6,b:.1}},{n:'Cleaning',c:BL}];
  for (let i=0;i<cats.length;i++) {
    const col=i%3, row=Math.floor(i/3);
    const ox=20+col*118, oy=350+row*92;
    box(f,ox,oy,108,82,CARD,1,14);
    box(f,ox+28,oy+10,46,46,cats[i].c,0.14,23);
    await txt(f,cats[i].n.slice(0,3),ox+38,oy+22,12,cats[i].c,'Semi Bold');
    await txt(f,cats[i].n,ox+8,oy+62,10,LG,'Semi Bold');
  }
  // Nearby providers
  await txt(f,'Providers Near You',20,550,15,WH,'Semi Bold');
  const pvs=[{n:'CleanMax Auto',r:'4.9',d:'1.2 km',c:CY},{n:'Swift Wash',r:'4.7',d:'2.4 km',c:GN}];
  for (let i=0;i<2;i++) {
    const p=pvs[i]; const ox=20+i*178;
    box(f,ox,574,168,80,CARD,1,14);
    box(f,ox+12,586,44,44,p.c,0.18,22);
    await txt(f,p.n[0],ox+27,599,15,p.c,'Bold');
    await txt(f,p.n,ox+64,586,11,WH,'Semi Bold');
    await txt(f,'Rtg '+p.r,ox+64,606,10,ST);
    await txt(f,p.d,ox+64,624,10,GR);
  }
  await navC(f,0);
  await label(f,'C3 / HOME');
  return f;
};

// ── C4: PROVIDER LIST ───────────────────────────────────────
const C4 = async () => {
  const f = mkFrame(custPage,1350,'C4 Providers');
  await statusBar(f);
  box(f,16,42,36,36,CARD,1,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'Car Wash Providers',68,51,16,WH,'Bold');
  await txt(f,'6 nearby',304,53,11,GR);
  // Filters
  const flt=['All','Nearest','Top Rated','Budget','Express'];
  let fx=20;
  for (let i=0;i<flt.length;i++) {
    const fw=flt[i].length*7+20; const s=i===0;
    box(f,fx,88,fw,30,s?CY:CARD,1,15);
    await txt(f,flt[i],fx+8,96,11,s?BK:LG,s?'Semi Bold':'Regular');
    fx+=fw+8;
  }
  // Mini map strip
  box(f,0,126,W,86,{r:.05,g:.09,b:.13});
  for(let i=0;i<5;i++) box(f,0,126+i*18,W,1,WH,0.022);
  for(let i=0;i<8;i++) box(f,i*50,126,1,86,WH,0.022);
  box(f,0,190,W,8,{r:.12,g:.16,b:.20},1,4);
  box(f,186,126,8,86,{r:.12,g:.16,b:.20},1,4);
  box(f,82,150,18,18,CY,1,9);  await txt(f,'1',87,153,9,BK,'Bold');
  box(f,194,140,18,18,OG,1,9); await txt(f,'2',199,143,9,BK,'Bold');
  box(f,284,156,18,18,GN,1,9); await txt(f,'3',289,159,9,BK,'Bold');
  // Provider cards
  const pvds=[
    {n:'CleanMax Auto Spa',r:'4.9',rv:'1.2K',d:'1.2 km',p:'199',tm:'30 min',bd:'Top Rated',bc:CY},
    {n:'Swift Wash & Care',r:'4.7',rv:'843', d:'2.4 km',p:'149',tm:'45 min',bd:'Budget',   bc:GN},
    {n:'ProShine Detailing',r:'4.8',rv:'562',d:'3.1 km',p:'299',tm:'90 min',bd:'Premium',  bc:OG},
    {n:'QuickWash Express', r:'4.6',rv:'329',d:'4.0 km',p:'99', tm:'20 min',bd:'Express',  bc:PU}
  ];
  for (let i=0;i<pvds.length;i++) {
    const p=pvds[i]; const oy=220+i*122;
    box(f,20,oy,350,110,CARD,1,16);
    box(f,34,oy+16,42,42,p.bc,1,21);
    await txt(f,p.n[0],48,oy+28,14,BK,'Bold');
    box(f,30,oy+70,p.bd.length*7+14,20,p.bc,0.14,10);
    await txt(f,p.bd,36,oy+74,9,p.bc,'Semi Bold');
    await txt(f,p.n,90,oy+12,13,WH,'Semi Bold');
    await txt(f,'Rtg '+p.r+' ('+p.rv+')',90,oy+32,10,ST);
    await txt(f,p.d+' away  '+p.tm,90,oy+50,10,GR);
    await txt(f,'From Rs.'+p.p,90,oy+70,12,CY,'Bold');
    box(f,268,oy+60,82,34,CY,1,17);
    await txt(f,'Book Now',274,oy+68,11,BK,'Bold');
  }
  await label(f,'C4 / PROVIDERS');
  return f;
};

// ── C5: BOOKING & PACKAGE ───────────────────────────────────
const C5 = async () => {
  const f = mkFrame(custPage,1800,'C5 Booking');
  await statusBar(f);
  box(f,16,42,36,36,CARD,1,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'Book Service',68,51,16,WH,'Bold');
  // Provider summary
  box(f,20,88,350,68,CARD,1,14);
  box(f,30,100,48,48,CY,1,24);
  await txt(f,'CM',44,115,13,BK,'Bold');
  await txt(f,'CleanMax Auto Spa',90,100,13,WH,'Semi Bold');
  await txt(f,'Rtg 4.9  •  1.2 km  •  30 min avg',90,120,10,GR);
  await txt(f,'From Rs.199',90,138,12,CY,'Semi Bold');
  // Packages
  await txt(f,'Select Package',20,172,14,WH,'Semi Bold');
  const pkgs=[
    {n:'Basic Wash',    d:'Exterior only  •  30 min',p:'Rs.199',s:false},
    {n:'Premium Wash',  d:'Ext + Interior  •  60 min',p:'Rs.349',s:true},
    {n:'Full Detailing',d:'Complete spa   •  3 hrs',  p:'Rs.699',s:false}
  ];
  for (let i=0;i<pkgs.length;i++) {
    const pk=pkgs[i]; const oy=196+i*64;
    if(pk.s){box(f,19,oy-1,352,58,CY,1,14);box(f,20,oy,350,56,NV,1,13);}
    else box(f,20,oy,350,56,CARD,1,13);
    box(f,32,oy+18,18,18,pk.s?CY:{r:.28,g:.28,b:.3},1,9);
    if(pk.s) box(f,36,oy+22,10,10,WH,1,5);
    await txt(f,pk.n,60,oy+10,13,pk.s?CY:WH,pk.s?'Semi Bold':'Regular');
    await txt(f,pk.d,60,oy+30,10,GR);
    await txt(f,pk.p,302,oy+18,13,pk.s?CY:LG,'Bold');
  }
  // Vehicle
  await txt(f,'Vehicle',20,394,14,WH,'Semi Bold');
  box(f,20,414,350,44,CARD,1,12);
  await txt(f,'Maruti Swift Dzire  v',32,428,12,LG);
  // Calendar
  await txt(f,'Date & Time',20,472,14,WH,'Semi Bold');
  box(f,20,494,350,98,CARD,1,16);
  await txt(f,'<',34,502,18,CY,'Bold');
  await txt(f,'May 2026',154,504,13,WH,'Semi Bold');
  await txt(f,'>',348,502,18,CY,'Bold');
  const dl=['S','M','T','W','T','F','S'];
  for(let i=0;i<7;i++) await txt(f,dl[i],29+i*48,530,10,GR);
  const dt=['25','26','27','28','29','30','31'];
  for(let i=0;i<7;i++){
    const s=i===2;
    if(s) box(f,20+i*48+12,548,26,26,CY,1,13);
    await txt(f,dt[i],20+i*48+18,553,11,s?BK:WH,s?'Bold':'Regular');
  }
  // Time slots
  const sl=['9 AM','11 AM','2 PM','4 PM','6 PM'];
  for(let i=0;i<5;i++){
    const s=i===1;
    const sx=20+(i%3)*86, sy=610+Math.floor(i/3)*42;
    box(f,sx,sy,78,30,s?CY:CARD,1,10);
    await txt(f,sl[i],sx+8,sy+9,11,s?BK:LG,s?'Semi Bold':'Regular');
  }
  // Address
  await txt(f,'Address',20,692,14,WH,'Semi Bold');
  box(f,20,712,350,42,CARD,1,12);
  await txt(f,'Banjara Hills, Hyderabad - 500034',32,726,12,LG);
  // Summary + CTA
  box(f,20,766,350,30,{r:.06,g:.06,b:.08},1,10);
  await txt(f,'Premium  •  27 May  •  11 AM',28,775,10,LG);
  await txt(f,'Rs.349',308,774,12,CY,'Bold');
  box(f,20,804,350,28,CY,1,14);
  await txt(f,'Proceed to Payment  →',112,811,12,BK,'Bold');
  await label(f,'C5 / BOOKING');
  return f;
};

// ── C6: PAYMENT ─────────────────────────────────────────────
const C6 = async () => {
  const f = mkFrame(custPage,2250,'C6 Payment');
  await statusBar(f);
  box(f,16,42,36,36,CARD,1,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'Payment',68,51,16,WH,'Bold');
  box(f,276,46,92,30,{r:.02,g:.16,b:.26},1,15);
  box(f,286,59,8,8,GN,1,4);
  await txt(f,'Secure Pay',300,55,10,CY,'Semi Bold');
  // Order summary
  await txt(f,'Order Summary',20,88,14,WH,'Semi Bold');
  box(f,20,110,350,118,CARD,1,14);
  await txt(f,'CleanMax Auto Spa',28,120,13,WH,'Semi Bold');
  await txt(f,'Premium Car Wash  •  Swift Dzire',28,140,11,GR);
  await txt(f,'27 May 2026  •  11:00 AM  •  Banjara Hills',28,158,10,GR);
  box(f,20,178,350,1,{r:.18,g:.18,b:.2});
  await txt(f,'Service',28,186,11,GR);   await txt(f,'Rs.349',314,186,11,LG);
  await txt(f,'Platform fee',28,204,11,GR); await txt(f,'Rs.25',318,204,11,LG);
  await txt(f,'Discount (FIRST30)',28,222,11,GN); await txt(f,'-Rs.105',306,222,11,GN);
  box(f,20,242,350,46,{r:.07,g:.07,b:.09},1,14);
  await txt(f,'Total Payable',28,256,13,WH,'Semi Bold');
  await txt(f,'Rs.269',296,252,20,CY,'Bold');
  // Promo
  box(f,20,300,350,44,CARD,1,12);
  box(f,28,312,18,18,GN,0.18,9);
  await txt(f,'v',31,314,9,GN,'Bold');
  await txt(f,'FIRST30 applied — you save Rs.105',52,314,12,GN,'Semi Bold');
  await txt(f,'Change',310,314,11,CY);
  // Payment methods
  await txt(f,'Payment Method',20,358,14,WH,'Semi Bold');
  const mths=[
    {n:'UPI — GPay / PhonePe / Paytm',c:CY, s:true},
    {n:'Credit / Debit Card',          c:BL, s:false},
    {n:'Net Banking',                   c:GN, s:false},
    {n:'Pay Later (BNPL)',              c:OG, s:false},
    {n:'Cash on Completion',            c:ST, s:false}
  ];
  for (let i=0;i<mths.length;i++) {
    const m=mths[i]; const oy=382+i*52;
    if(m.s){box(f,19,oy-1,352,48,CY,1,14);box(f,20,oy,350,46,NV,1,13);}
    else box(f,20,oy,350,46,CARD,1,13);
    box(f,30,oy+10,24,24,m.c,0.15,12);
    await txt(f,m.n,66,oy+14,12,m.s?CY:LG,m.s?'Semi Bold':'Regular');
    box(f,320,oy+14,18,18,m.s?CY:{r:.24,g:.24,b:.26},1,9);
    if(m.s) box(f,324,oy+18,10,10,WH,1,5);
  }
  box(f,20,648,350,52,CY,1,26);
  await txt(f,'Pay  Rs.269  Now',138,662,15,BK,'Bold');
  await txt(f,'PCI-DSS Compliant  •  Powered by Razorpay',78,718,10,GR);
  await label(f,'C6 / PAYMENT');
  return f;
};

// ── C7: LIVE TRACKING ───────────────────────────────────────
const C7 = async () => {
  const f = mkFrame(custPage,2700,'C7 Tracking');
  // Map
  box(f,0,0,W,410,{r:.05,g:.09,b:.13});
  for(let i=0;i<9;i++) box(f,0,i*50,W,1,WH,0.02);
  for(let i=0;i<8;i++) box(f,i*50,0,1,410,WH,0.02);
  box(f,0,200,W,8,{r:.12,g:.16,b:.20},1,4);
  box(f,186,0,8,410,{r:.12,g:.16,b:.20},1,4);
  box(f,0,312,W,5,{r:.10,g:.12,b:.16},1,3);
  // Destination
  box(f,162,186,38,38,GN,0.1,19); box(f,168,192,26,26,GN,0.2,13); box(f,174,198,14,14,GN,1,7);
  // Tech pin
  box(f,80,110,50,50,CY,0.18,25); box(f,86,116,38,38,CY,1,19);
  await txt(f,'SK',94,126,11,BK,'Bold');
  // Route
  for(let i=0;i<7;i++) box(f,108+i*12,194-i*8,8,4,CY,0.6,2);
  // ETA card
  box(f,272,88,98,56,CARD,1,14);
  await txt(f,'ETA',308,96,10,GR);
  await txt(f,'8 min',278,108,22,CY,'Bold');
  // Labels
  box(f,54,88,90,22,BK,0.8,8);  await txt(f,'Suresh  8 min',60,93,9,WH);
  box(f,146,168,80,22,BK,0.8,8); await txt(f,'Your Location',152,173,9,WH);
  // Header
  await statusBar(f);
  box(f,16,42,36,36,BK,0.5,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'Tracking #7284',68,51,14,WH,'Bold');
  box(f,250,44,116,30,{r:.02,g:.38,b:.16},1,15);
  box(f,262,56,8,8,GN,1,4);
  await txt(f,'En Route',278,53,11,WH,'Semi Bold');
  // Bottom sheet
  box(f,0,410,W,H-410,DEEP,1,24);
  box(f,175,420,40,4,{r:.24,g:.24,b:.28},1,2);
  // Technician card
  box(f,20,436,350,82,CARD,1,16);
  box(f,30,448,52,52,CY,1,26); await txt(f,'SK',43,467,14,BK,'Bold');
  await txt(f,'Suresh Kumar',94,448,13,WH,'Bold');
  await txt(f,'Car Wash Specialist  •  5 yrs',94,468,10,GR);
  await txt(f,'Rtg 4.9  (342 reviews)',94,486,10,ST);
  box(f,286,454,36,36,GN,0.15,18); await txt(f,'Call',292,463,10,WH);
  box(f,328,454,36,36,CY,0.15,18); await txt(f,'Chat',334,463,10,WH);
  // Job timeline
  await txt(f,'Live Job Status',20,536,14,WH,'Semi Bold');
  await txt(f,'Start OTP: 4821',276,538,10,GR);
  const steps=[
    {l:'Payment Confirmed', t:'11:00 AM',d:true, a:false},
    {l:'Provider Accepted',  t:'11:02 AM',d:true, a:false},
    {l:'En Route to You',    t:'11:18 AM',d:false,a:true },
    {l:'Service Started',    t:'Upcoming', d:false,a:false},
    {l:'Completed',          t:'Upcoming', d:false,a:false}
  ];
  for(let i=0;i<steps.length;i++){
    const s=steps[i]; const oy=560+i*32;
    const dc=s.d?CY:s.a?OG:{r:.22,g:.22,b:.25};
    box(f,24,oy+3,12,12,dc,1,6);
    if(i<4) box(f,29,oy+15,2,18,{r:.18,g:.18,b:.2},1,1);
    await txt(f,s.l,46,oy+1,11,s.d||s.a?WH:GR,s.a?'Semi Bold':'Regular');
    await txt(f,s.t,296,oy+1,9,s.d?CY:GR);
  }
  box(f,20,728,158,44,CARD,1,22);
  await txt(f,'Cancel',58,747,13,RD,'Semi Bold');
  box(f,190,728,180,44,CY,1,22);
  await txt(f,'Rate & Review',218,747,12,BK,'Semi Bold');
  await label(f,'C7 / TRACKING');
  return f;
};

// ── C8: HISTORY & PROFILE ───────────────────────────────────
const C8 = async () => {
  const f = mkFrame(custPage,3150,'C8 History & Profile');
  topGrad(f,0.01,0.06,0.18,220);
  await statusBar(f);
  // Profile header
  box(f,144,44,102,102,CY,0.1,51);
  box(f,152,52,86,86,CY,1,43);
  await txt(f,'RM',178,83,22,BK,'Bold');
  await txt(f,'Ramprasad Mokka',112,160,17,WH,'Bold');
  await txt(f,'ramsmokka@gmail.com',110,182,11,GR);
  box(f,160,202,72,22,{r:.06,g:.22,b:.10},1,11);
  box(f,168,210,8,8,GN,1,4);
  await txt(f,'Verified',182,208,10,GN,'Semi Bold');
  // Stats
  box(f,20,238,350,60,CARD,1,16);
  const sts=[['12','Bookings'],['4.8','Rating'],['2.4K','Saved']];
  for(let i=0;i<sts.length;i++){
    const ox=48+i*110;
    await txt(f,sts[i][0],ox,248,18,CY,'Bold');
    await txt(f,sts[i][1],ox-2,270,10,GR);
    if(i<2) box(f,48+(i+1)*110-6,248,1,28,{r:.2,g:.2,b:.22});
  }
  // Tabs
  box(f,20,314,350,36,CARD,1,18);
  box(f,22,316,170,32,CY,1,16);
  await txt(f,'Booking History',56,324,13,BK,'Bold');
  await txt(f,'Complaints',238,324,13,GR);
  // Orders
  const ords=[
    {n:'CleanMax Auto',svc:'Premium Car Wash',dt:'27 May',p:'269',s:'Completed',sc:GN},
    {n:'Swift Wash',   svc:'Basic Wash',       dt:'15 May',p:'149',s:'Completed',sc:GN},
    {n:'ProShine',     svc:'Full Detailing',   dt:'02 May',p:'699',s:'Cancelled', sc:RD},
    {n:'QuickWash',    svc:'Exterior Wash',    dt:'18 Apr',p:'99', s:'Refund',   sc:OG}
  ];
  for(let i=0;i<ords.length;i++){
    const o=ords[i]; const oy=362+i*108;
    box(f,20,oy,350,98,CARD,1,16);
    box(f,20,oy,350,28,{r:.09,g:.09,b:.10},1,16);
    await txt(f,'#ORD-'+(7284-i),28,oy+8,10,GR);
    await txt(f,o.dt+' 2026',260,oy+8,10,GR);
    box(f,32,oy+36,40,40,CY,0.14,20);
    await txt(f,o.n[0],44,oy+47,13,CY,'Bold');
    await txt(f,o.n,84,oy+34,12,WH,'Semi Bold');
    await txt(f,o.svc,84,oy+52,10,GR);
    box(f,84,oy+70,o.s.length*7+14,20,o.sc,0.14,10);
    await txt(f,o.s,88,oy+73,9,o.sc,'Semi Bold');
    await txt(f,'Rs.'+o.p,298,oy+48,14,WH,'Bold');
    if(o.s==='Completed'){box(f,264,oy+70,86,20,CY,0.1,10);await txt(f,'Rate + Rebook',268,oy+73,9,CY);}
    if(o.s==='Cancelled'){box(f,276,oy+70,74,20,RD,0.1,10);await txt(f,'File Complaint',278,oy+73,9,RD);}
  }
  await navC(f,2);
  await label(f,'C8 / HISTORY');
  return f;
};

// Build Customer screens
const c1=await C1(), c2=await C2(), c3=await C3(), c4=await C4();
const c5=await C5(), c6=await C6(), c7=await C7(), c8=await C8();

// Customer prototypes
link(c1,20,478,350,52,c3.id);
link(c1,258,688,122,18,c2.id);
link(c2,20,586,350,52,c3.id);
for(let i=0;i<6;i++){const col=i%3,row=Math.floor(i/3);link(c3,20+col*118,350+row*92,108,82,c4.id);}
link(c4,268,246,82,34,c5.id); link(c4,268,368,82,34,c5.id);
link(c4,268,490,82,34,c5.id); link(c4,268,612,82,34,c5.id);
link(c5,20,804,350,28,c6.id);
link(c6,20,648,350,52,c7.id);
link(c7,190,728,180,44,c8.id);

figma.viewport.scrollAndZoomIntoView(custPage.children);
console.log('Customer screens done (8/19)');

// ════════════════════════════════════════════════════════════
//  PROVIDER SCREENS (Page 2) — 6 screens
// ════════════════════════════════════════════════════════════
await figma.setCurrentPageAsync(provPage);

// ── P1: PROVIDER LOGIN ──────────────────────────────────────
const P1 = async () => {
  const f = mkFrame(provPage,0,'P1 Provider Login');
  topGrad(f,0.05,0.08,0.02,H);
  box(f,153,60,84,84,OG,0.12,42); box(f,161,68,68,68,OG,1,34);
  await txt(f,'S',185,83,28,BK,'Bold');
  await txt(f,'ServiCo Partner',118,158,20,WH,'Bold');
  await txt(f,'Service Partner Portal',114,186,12,GR);
  box(f,20,216,350,40,OG,0.15,20);
  await txt(f,'Partner Login',134,226,13,OG,'Semi Bold');
  await txt(f,'Registered Mobile',20,274,12,LG);
  box(f,20,292,350,48,CARD,1,12); await txt(f,'+91  94567 12345',32,307,13,LG);
  await txt(f,'Password',20,356,12,LG);
  box(f,20,374,350,48,CARD,1,12); await txt(f,'Enter password',32,390,13,GR); await txt(f,'Show',330,392,11,OG);
  await txt(f,'Forgot Password?',244,438,12,OG);
  box(f,20,462,350,52,OG,1,26);
  await txt(f,'Login to Dashboard',100,476,15,WH,'Bold');
  box(f,20,526,350,48,CARD,1,24);
  await txt(f,'Login with OTP',130,540,13,LG);
  box(f,20,592,350,56,CARD,1,16);
  box(f,20,592,4,56,OG,1,2);
  await txt(f,'New Partner?',32,602,12,WH,'Semi Bold');
  await txt(f,'Register your business and start earning',32,620,10,GR);
  await txt(f,'Apply Now ->',296,612,11,OG);
  const badges=['KYC Verified','Insured Jobs','Weekly Payout'];
  for(let i=0;i<3;i++){
    const ox=20+i*118;
    box(f,ox,668,108,48,CARD2,1,12); box(f,ox,668,108,3,OG,0.6,2);
    await txt(f,badges[i],ox+8,682,9,LG,'Semi Bold');
  }
  await label(f,'P1 / PROVIDER LOGIN');
  return f;
};

// ── P2: PROVIDER DASHBOARD ──────────────────────────────────
const P2 = async () => {
  const f = mkFrame(provPage,450,'P2 Dashboard');
  topGrad(f,0.04,0.09,0.03,230);
  await statusBar(f);
  box(f,20,42,46,46,OG,1,23); await txt(f,'VR',30,55,14,WH,'Bold');
  await txt(f,'Welcome back,',76,44,12,GR);
  await txt(f,'Venkat Repairs',76,62,16,WH,'Bold');
  box(f,316,44,36,36,CARD,1,18); await txt(f,'Bell',320,54,10,WH);
  // Online toggle
  box(f,20,100,350,52,CARD,1,16); box(f,20,100,4,52,GN,1,2);
  await txt(f,'Status: ONLINE',32,110,13,GN,'Semi Bold');
  await txt(f,'Tap to go offline',32,130,10,GR);
  box(f,294,114,56,24,GN,1,12); box(f,320,118,16,16,WH,1,8);
  // Today stats
  await txt(f,"Today's Overview",20,168,14,WH,'Semi Bold');
  await txt(f,'Wed 27 May 2026',276,170,10,GR);
  await statBox(f,20, 192,100,'5','New Requests',OG);
  await statBox(f,128,192,100,'3','Completed',GN);
  await statBox(f,236,192,134,'Rs1,240','Earned Today',CY);
  // Monthly
  box(f,20,274,350,58,CARD,1,14);
  const ms=[['Rs18.4K','This Month'],['94%','Acceptance'],['4.8','Avg Rating']];
  for(let i=0;i<ms.length;i++){
    const ox=44+i*110;
    await txt(f,ms[i][0],ox,284,14,i===0?GN:i===1?CY:ST,'Bold');
    await txt(f,ms[i][1],ox-4,306,9,GR);
    if(i<2) box(f,44+(i+1)*110-8,284,1,30,{r:.2,g:.2,b:.22});
  }
  // Incoming requests
  await txt(f,'Incoming Requests',20,346,14,WH,'Semi Bold');
  box(f,264,344,56,22,OG,0.15,11);
  await txt(f,'2 New',272,349,10,OG,'Semi Bold');
  const reqs=[
    {n:'Ramprasad M.',  svc:'Premium Car Wash',p:'Rs349',d:'1.2 km',tm:'11:00 AM'},
    {n:'Sai Krishna T.',svc:'AC Repair',        p:'Rs599',d:'2.0 km',tm:'2:30 PM'}
  ];
  for(let i=0;i<reqs.length;i++){
    const rq=reqs[i]; const oy=372+i*106;
    box(f,20,oy,350,96,CARD,1,14); box(f,20,oy,350,3,OG,0.8,2);
    box(f,30,oy+14,40,40,OG,0.2,20);
    await txt(f,rq.n[0],44,oy+25,14,OG,'Bold');
    await txt(f,rq.n,82,oy+12,13,WH,'Semi Bold');
    await txt(f,rq.svc,82,oy+30,11,GR);
    await txt(f,rq.d+' away  '+rq.tm,82,oy+48,10,GR);
    box(f,82,oy+66,70,22,GN,0.15,11); await txt(f,'Accept',94,oy+70,10,GN,'Semi Bold');
    box(f,162,oy+66,60,22,RD,0.12,11); await txt(f,'Reject',172,oy+70,10,RD,'Semi Bold');
    await txt(f,rq.p,296,oy+30,16,CY,'Bold');
  }
  // Active job
  await txt(f,'Active Job',20,592,14,WH,'Semi Bold');
  box(f,20,614,350,60,CARD,1,14); box(f,20,614,6,60,GN,1,3);
  box(f,292,622,62,24,GN,0.15,12); await txt(f,'In Progress',296,630,9,GN,'Semi Bold');
  await txt(f,'Neha S. — Basic Wash',34,622,13,WH,'Semi Bold');
  await txt(f,'Started 10:14 AM  •  Ends approx 10:46 AM',34,644,10,GR);
  await navP(f,0);
  await label(f,'P2 / DASHBOARD');
  return f;
};

// ── P3: REQUEST DETAIL ──────────────────────────────────────
const P3 = async () => {
  const f = mkFrame(provPage,900,'P3 Request Detail');
  topGrad(f,0.04,0.09,0.03,180);
  await statusBar(f);
  box(f,16,42,36,36,CARD,1,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'New Request',68,51,16,WH,'Bold');
  box(f,298,46,72,30,OG,0.15,15); await txt(f,'Expires 4:52',306,54,10,OG,'Semi Bold');
  // Customer card
  box(f,20,88,350,100,CARD,1,16);
  box(f,30,100,52,52,CY,0.18,26);
  await txt(f,'RM',44,117,14,CY,'Bold');
  await txt(f,'Ramprasad Mokka',94,98,14,WH,'Bold');
  await txt(f,'Customer since 2024  •  6 bookings',94,118,10,GR);
  await txt(f,'Rating 4.9 avg',94,136,10,ST);
  // Service details
  await txt(f,'Service Details',20,202,14,WH,'Semi Bold');
  box(f,20,224,350,148,CARD,1,16); box(f,20,224,4,148,OG,1,2);
  const dets=[
    ['Service','Premium Car Wash'],
    ['Package','Exterior + Interior  •  60 min'],
    ['Vehicle','Maruti Swift Dzire (White)'],
    ['Date & Time','27 May 2026  •  11:00 AM'],
    ['Location','Banjara Hills, Hyderabad']
  ];
  for(let i=0;i<dets.length;i++){
    const oy=236+i*26;
    await txt(f,dets[i][0],32,oy,11,GR);
    await txt(f,dets[i][1],152,oy,11,LG,'Semi Bold');
  }
  // Payment breakdown
  await txt(f,'Your Earnings',20,386,14,WH,'Semi Bold');
  box(f,20,408,350,90,CARD,1,14);
  const pay=[['Customer Pays','Rs.349'],['Platform Commission 18%','-Rs.63'],['Your Earnings','Rs.286']];
  for(let i=0;i<pay.length;i++){
    const oy=420+i*26;
    await txt(f,pay[i][0],32,oy,11,i===2?WH:GR,i===2?'Semi Bold':'Regular');
    await txt(f,pay[i][1],i===2?300:296,oy,i===2?14:11,i===2?GN:LG,i===2?'Bold':'Regular');
  }
  // Map strip
  box(f,0,514,W,88,{r:.05,g:.09,b:.13});
  for(let i=0;i<5;i++) box(f,0,514+i*18,W,1,WH,0.02);
  for(let i=0;i<8;i++) box(f,i*50,514,1,88,WH,0.02);
  box(f,0,576,W,6,{r:.12,g:.16,b:.2},1,3);
  box(f,162,544,14,14,OG,1,7);
  await txt(f,'Customer: Banjara Hills  •  1.2 km away  •  8 min ETA',28,544,9,WH);
  // Customer note
  box(f,20,616,350,44,CARD,1,12); box(f,20,616,4,44,CY,1,2);
  await txt(f,'Customer note:',32,626,10,GR);
  await txt(f,'"Please be careful with the dashboard area"',32,642,10,LG);
  // CTAs
  box(f,20,676,156,54,{r:.22,g:.05,b:.05},1,27);
  await txt(f,'Reject',66,693,15,RD,'Bold');
  box(f,194,676,176,54,GN,1,27);
  await txt(f,'Accept Job',238,693,15,BK,'Bold');
  await label(f,'P3 / REQUEST DETAIL');
  return f;
};

// ── P4: ACTIVE JOBS LIST ────────────────────────────────────
const P4 = async () => {
  const f = mkFrame(provPage,1350,'P4 Active Jobs');
  await statusBar(f);
  await txt(f,'My Jobs',20,50,20,WH,'Bold');
  await txt(f,'Wed 27 May',294,52,11,GR);
  // Tabs
  box(f,20,82,350,36,CARD,1,18);
  const tabs=['Active','Upcoming','Completed'];
  for(let i=0;i<3;i++){
    const s=i===0; const tw=116;
    box(f,22+i*tw,84,tw,32,s?OG:{r:0,g:0,b:0},s?1:0,14);
    await txt(f,tabs[i],22+i*tw+(tw-tabs[i].length*7)/2,92,12,s?WH:GR,s?'Semi Bold':'Regular');
  }
  // Active job
  box(f,20,130,350,120,CARD,1,14); box(f,20,130,4,120,GN,1,2);
  box(f,288,138,66,22,GN,0.15,11); await txt(f,'In Progress',293,143,9,GN,'Semi Bold');
  box(f,32,142,44,44,CY,0.18,22); await txt(f,'RM',46,155,12,CY,'Bold');
  await txt(f,'Ramprasad Mokka',88,142,13,WH,'Semi Bold');
  await txt(f,'Premium Car Wash  •  Swift Dzire',88,160,10,GR);
  await txt(f,'Started 11:04 AM  •  Est end 12:04 PM',88,178,10,GR);
  box(f,32,202,306,6,{r:.15,g:.15,b:.17},1,3);
  box(f,32,202,170,6,GN,1,3);
  await txt(f,'55% done',322,198,9,GN,'Semi Bold');
  box(f,32,220,130,24,GN,0.12,12); await txt(f,'Mark Complete',38,228,10,GN,'Semi Bold');
  box(f,172,220,100,24,CY,0.12,12); await txt(f,'Call Customer',178,228,10,CY);
  // Upcoming
  await txt(f,'Upcoming Today',20,264,14,WH,'Semi Bold');
  const ups=[
    {n:'Neha Sharma',   svc:'Basic Wash',    tm:'2:00 PM',p:'Rs149',d:'3.2 km',c:CY},
    {n:'Rahul Verma',   svc:'Tyre Change',   tm:'4:30 PM',p:'Rs249',d:'1.8 km',c:GN},
    {n:'Priya Patel',   svc:'AC Repair',     tm:'6:00 PM',p:'Rs599',d:'4.1 km',c:OG}
  ];
  for(let i=0;i<ups.length;i++){
    const u=ups[i]; const oy=288+i*90;
    box(f,20,oy,350,80,CARD,1,14);
    box(f,30,oy+16,40,40,u.c,0.2,20);
    await txt(f,u.n[0],44,oy+27,13,u.c,'Bold');
    await txt(f,u.n,82,oy+14,12,WH,'Semi Bold');
    await txt(f,u.svc,82,oy+32,11,GR);
    await txt(f,u.tm+'  •  '+u.d+' away',82,oy+50,10,GR);
    box(f,268,oy+16,72,44,{r:.08,g:.08,b:.10},1,10);
    await txt(f,u.p,278,oy+24,13,CY,'Bold');
    await txt(f,'Details',280,oy+44,9,GR);
  }
  // Summary
  box(f,20,562,350,50,CARD2,1,14); box(f,20,562,350,3,CY,0.4,2);
  await txt(f,'Completed today: 3 jobs  •  Total earned: Rs.862',28,578,11,LG);
  await navP(f,1);
  await label(f,'P4 / ACTIVE JOBS');
  return f;
};

// ── P5: JOB DETAIL ──────────────────────────────────────────
const P5 = async () => {
  const f = mkFrame(provPage,1800,'P5 Job Detail');
  await statusBar(f);
  box(f,16,42,36,36,CARD,1,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'Job #7284',68,51,16,WH,'Bold');
  box(f,274,46,90,30,GN,0.15,15);
  box(f,282,56,8,8,GN,1,4);
  await txt(f,'In Progress',296,53,10,GN,'Semi Bold');
  // Customer
  box(f,20,88,350,80,CARD,1,14);
  box(f,30,100,46,46,CY,0.2,23); await txt(f,'RM',44,116,13,CY,'Bold');
  await txt(f,'Ramprasad Mokka',88,100,13,WH,'Bold');
  await txt(f,'Premium Car Wash  •  Swift Dzire',88,118,10,GR);
  await txt(f,'Banjara Hills  •  1.2 km',88,136,10,GR);
  box(f,284,100,76,26,CY,0.12,13); await txt(f,'View Map',292,108,10,CY);
  box(f,284,134,36,26,GN,0.12,13); await txt(f,'Call',292,142,10,GN);
  box(f,326,134,34,26,BL,0.12,13); await txt(f,'Chat',332,142,10,BL);
  // Checklist
  await txt(f,'Service Checklist',20,182,14,WH,'Semi Bold');
  await txt(f,'4 of 6 done',298,184,10,GR);
  const checks=[
    {l:'Pre-wash inspection & photo',   d:true },
    {l:'Exterior foam wash',             d:true },
    {l:'Rinse and dry exterior',         d:true },
    {l:'Interior vacuuming',             d:true },
    {l:'Dashboard & console wipe',       d:false},
    {l:'Tyre & rim cleaning',            d:false}
  ];
  for(let i=0;i<checks.length;i++){
    const ck=checks[i]; const oy=204+i*40;
    box(f,20,oy,350,36,ck.d?{r:.08,g:.14,b:.08}:CARD,1,12);
    box(f,32,oy+10,16,16,ck.d?GN:{r:.25,g:.25,b:.28},1,8);
    if(ck.d) await txt(f,'v',36,oy+11,10,WH,'Bold');
    await txt(f,ck.l,58,oy+10,12,ck.d?GN:LG,ck.d?'Semi Bold':'Regular');
  }
  // Completion OTP
  box(f,20,450,350,52,CARD,1,14); box(f,20,450,4,52,AM,1,2);
  await txt(f,'Completion OTP (share with customer to finish job)',32,460,10,GR);
  await txt(f,'4  8  2  1',120,472,22,AM,'Bold');
  // Payment status
  await txt(f,'Payment Status',20,518,14,WH,'Semi Bold');
  box(f,20,540,350,52,CARD,1,14); box(f,20,540,4,52,CY,1,2);
  await txt(f,'Customer paid: Rs.349  (UPI — verified)',32,550,12,WH,'Semi Bold');
  await txt(f,'Your payout: Rs.286  (Pending settlement)',32,570,10,GR);
  box(f,272,552,80,22,CY,0.12,11); await txt(f,'View Receipt',276,558,9,CY);
  // Report issue
  box(f,20,604,350,40,CARD2,1,12);
  await txt(f,'Report issue with this job',32,617,12,GR);
  await txt(f,'->',330,617,13,GR,'Bold');
  // CTAs
  box(f,20,658,156,52,{r:.22,g:.05,b:.05},1,26);
  await txt(f,'Cancel Job',52,675,13,RD,'Bold');
  box(f,194,658,176,52,GN,1,26);
  await txt(f,'Mark Complete',228,675,13,BK,'Bold');
  await txt(f,'#7284  •  Premium Wash  •  Rs.286 payout',46,728,10,GR);
  await label(f,'P5 / JOB DETAIL');
  return f;
};

// ── P6: EARNINGS ─────────────────────────────────────────────
const P6 = async () => {
  const f = mkFrame(provPage,2250,'P6 Earnings');
  topGrad(f,0.02,0.08,0.04,230);
  await statusBar(f);
  await txt(f,'Earnings',20,50,20,WH,'Bold');
  await txt(f,'May 2026',298,52,12,GR);
  // Big card
  box(f,20,84,350,112,CARD,1,20); box(f,20,84,350,4,GN,1,4);
  await txt(f,'Total Earned — May 2026',90,96,12,GR);
  await txt(f,'Rs. 18,420',82,116,30,GN,'Bold');
  await txt(f,'vs last month  +22%',90,158,11,GN);
  box(f,274,112,72,24,GN,0.15,12); await txt(f,'Withdraw',280,118,10,GN,'Semi Bold');
  // Bar chart
  await txt(f,'Weekly Breakdown',20,210,14,WH,'Semi Bold');
  box(f,20,232,350,100,CARD,1,14);
  const bars=[2200,3100,2800,4200,3600,1900,620];
  const daysB=['M','T','W','T','F','S','S'];
  for(let i=0;i<7;i++){
    const bh=Math.floor((bars[i]/4200)*68);
    const ox=28+i*46;
    box(f,ox,288-bh,28,bh,i===3?GN:CY,i===3?1:0.5,3);
    await txt(f,daysB[i],ox+8,294,9,GR);
    if(i===3) await txt(f,'4.2K',ox-2,274-bh,8,GN,'Semi Bold');
  }
  // Stats grid
  const e2=[['24','Jobs Done',OG],['Rs762','Avg/Job',CY],['94%','Accept Rate',GN],['Rs1,240','Best Day',AM]];
  for(let i=0;i<4;i++){
    const col=i%2,row=Math.floor(i/2);
    await statBox(f,20+col*178,344+row*80,164,e2[i][0],e2[i][1],e2[i][2]);
  }
  // Transactions
  await txt(f,'Recent Transactions',20,516,14,WH,'Semi Bold');
  const txns=[
    {n:'Ramprasad M.',svc:'Premium Wash',am:'+Rs286',dt:'Today 12:04',s:'Settled', sc:GN},
    {n:'Neha Sharma',  svc:'Basic Wash',  am:'+Rs118',dt:'Today 10:46',s:'Settled', sc:GN},
    {n:'Rahul Verma',  svc:'Tyre Change', am:'+Rs196',dt:'Yesterday',  s:'Pending', sc:AM},
    {n:'Priya P.',     svc:'AC Repair',   am:'+Rs474',dt:'25 May',     s:'Settled', sc:GN}
  ];
  for(let i=0;i<txns.length;i++){
    const t2=txns[i]; const oy=540+i*58;
    box(f,20,oy,350,50,CARD,1,12);
    box(f,32,oy+10,30,30,GN,0.15,15);
    await txt(f,'Rs',36,oy+17,10,GN,'Bold');
    await txt(f,t2.n,72,oy+10,12,WH,'Semi Bold');
    await txt(f,t2.svc+'  •  '+t2.dt,72,oy+28,10,GR);
    await txt(f,t2.am,278,oy+10,13,GN,'Bold');
    box(f,278,oy+28,t2.s.length*6+12,16,t2.sc,0.15,8);
    await txt(f,t2.s,282,oy+30,9,t2.sc,'Semi Bold');
  }
  await navP(f,2);
  await label(f,'P6 / EARNINGS');
  return f;
};

const p1=await P1(),p2=await P2(),p3=await P3();
const p4=await P4(),p5=await P5(),p6=await P6();

link(p1,20,462,350,52,p2.id);
link(p2,82,404,70,22,p3.id); link(p2,82,510,70,22,p3.id);
link(p3,194,676,176,54,p4.id);
link(p4,32,220,130,24,p5.id);
for(let i=0;i<3;i++) link(p4,268,288+i*90,72,44,p5.id);
link(p5,194,658,176,52,p6.id);

figma.viewport.scrollAndZoomIntoView(provPage.children);
console.log('Provider screens done (14/19)');

// ════════════════════════════════════════════════════════════
//  ADMIN SCREENS (Page 3) — 5 screens
// ════════════════════════════════════════════════════════════
await figma.setCurrentPageAsync(adminPage);

// ── A1: ADMIN DASHBOARD ─────────────────────────────────────
const A1 = async () => {
  const f = mkFrame(adminPage,0,'A1 Admin Dashboard');
  topGrad(f,0.08,0.04,0.16,230);
  await statusBar(f);
  box(f,20,42,46,46,PK,1,23); await txt(f,'AD',30,55,14,WH,'Bold');
  await txt(f,'ServiCo Admin',76,44,12,GR);
  await txt(f,'Control Panel',76,62,15,WH,'Bold');
  box(f,316,44,36,36,CARD,1,18); await txt(f,'Bell',320,54,10,WH);
  // KPI row 1
  await txt(f,'Live Platform Stats',20,104,14,WH,'Semi Bold');
  await txt(f,'27 May 2026  •  9:41 AM',218,106,10,GR);
  const kpi1=[['1,284','Orders Today',CY],['Rs42.6K','Revenue Today',GN],['186','Active Now',OG]];
  for(let i=0;i<3;i++){
    const ox=20+i*118;
    box(f,ox,124,108,68,CARD,1,14); box(f,ox,124,108,3,kpi1[i][2],1,2);
    await txt(f,kpi1[i][0],ox+8,136,18,kpi1[i][2],'Bold');
    await txt(f,kpi1[i][1],ox+8,166,9,GR);
  }
  // KPI row 2
  const kpi2=[['2,841','Customers',BL],['342','Providers',AM],['14','Complaints',RD],['98.2%','Uptime',GN]];
  for(let i=0;i<4;i++){
    const ox=20+i*88;
    box(f,ox,202,80,58,CARD,1,12); box(f,ox,202,80,2,kpi2[i][2],1,2);
    await txt(f,kpi2[i][0],ox+8,212,14,kpi2[i][2],'Bold');
    await txt(f,kpi2[i][1],ox+8,238,8,GR);
  }
  // Revenue chart
  await txt(f,'Revenue Trend — Last 7 Days',20,274,14,WH,'Semi Bold');
  box(f,20,296,350,108,CARD,1,14);
  const rv=[28000,35000,31000,42000,38000,44000,42600];
  const rvd=['21','22','23','24','25','26','27'];
  for(let i=0;i<7;i++){
    const bh=Math.floor((rv[i]/44000)*76);
    const ox=28+i*46;
    box(f,ox,362-bh,28,bh,PK,i===6?1:0.4,3);
    await txt(f,rvd[i],ox+6,368,9,GR);
  }
  await txt(f,'Rs44K peak',310,300,9,PK,'Semi Bold');
  // Alerts
  await txt(f,'Platform Alerts',20,418,14,WH,'Semi Bold');
  const alerts=[
    {t:'3 complaints pending urgent review',c:RD},
    {t:'2 new provider KYC submissions',    c:AM},
    {t:'Payment gateway latency +120ms',    c:OG}
  ];
  for(let i=0;i<alerts.length;i++){
    const al=alerts[i]; const oy=440+i*52;
    box(f,20,oy,350,44,CARD,1,12); box(f,20,oy,4,44,al.c,1,2);
    box(f,30,oy+12,20,20,al.c,0.2,10);
    await txt(f,'!',37,oy+14,11,al.c,'Bold');
    await txt(f,al.t,58,oy+14,12,LG);
    await txt(f,'Review ->',298,oy+14,10,al.c);
  }
  // Quick actions
  await txt(f,'Quick Actions',20,598,14,WH,'Semi Bold');
  const qa=['Add Service','Block User','Send Notice','Export CSV'];
  for(let i=0;i<4;i++){
    const col=i%2,row=Math.floor(i/2);
    const ox=20+col*178, oy=620+row*56;
    box(f,ox,oy,164,48,CARD,1,12); box(f,ox,oy,164,2,PK,0.5,2);
    await txt(f,qa[i],ox+14,oy+15,12,LG);
    await txt(f,'->',ox+136,oy+15,13,PK,'Bold');
  }
  await navA(f,0);
  await label(f,'A1 / ADMIN DASHBOARD');
  return f;
};

// ── A2: USER MANAGEMENT ─────────────────────────────────────
const A2 = async () => {
  const f = mkFrame(adminPage,450,'A2 User Management');
  await statusBar(f);
  box(f,16,42,36,36,CARD,1,18); await txt(f,'<',24,49,18,WH,'Bold');
  await txt(f,'User Management',68,51,16,WH,'Bold');
  // Tabs
  box(f,20,82,350,36,CARD,1,18);
  const tabs3=['Customers','Providers','Blocked'];
  for(let i=0;i<3;i++){
    const s=i===0; const tw=116;
    box(f,22+i*tw,84,tw,32,s?PK:{r:0,g:0,b:0},s?1:0,14);
    await txt(f,tabs3[i],22+i*tw+20,92,12,s?WH:GR,s?'Semi Bold':'Regular');
  }
  // Search
  box(f,20,126,350,40,CARD,1,12);
  await txt(f,'Search name, mobile, email...',36,138,11,GR);
  // Summary
  box(f,20,174,350,44,CARD2,1,12);
  await txt(f,'Total: 2,841',28,187,11,LG);
  await txt(f,'Active: 2,798',132,187,11,GN,'Semi Bold');
  await txt(f,'Suspended: 43',242,187,11,RD);
  // Users
  const users=[
    {n:'Ramprasad Mokka', ph:'+91 98765 43210',bk:'12',s:'Active',   sc:GN,dt:'15 Jan 2024'},
    {n:'Neha Sharma',     ph:'+91 87654 32109',bk:'8', s:'Active',   sc:GN,dt:'20 Feb 2024'},
    {n:'Rahul Verma',     ph:'+91 76543 21098',bk:'3', s:'Active',   sc:GN,dt:'01 Mar 2024'},
    {n:'Sai Krishna T.',  ph:'+91 65432 10987',bk:'21',s:'VIP',      sc:AM,dt:'08 Nov 2023'},
    {n:'Priya Patel',     ph:'+91 54321 09876',bk:'0', s:'Suspended',sc:RD,dt:'12 Apr 2024'}
  ];
  for(let i=0;i<users.length;i++){
    const u=users[i]; const oy=226+i*86;
    box(f,20,oy,350,78,CARD,1,14);
    box(f,30,oy+14,42,42,PK,0.15,21);
    await txt(f,u.n[0],44,oy+26,13,PK,'Bold');
    await txt(f,u.n,84,oy+12,12,WH,'Semi Bold');
    await txt(f,u.ph,84,oy+30,10,GR);
    await txt(f,u.bk+' bookings  •  Joined '+u.dt,84,oy+48,9,GR);
    box(f,84,oy+60,u.s.length*7+12,16,u.sc,0.15,8);
    await txt(f,u.s,88,oy+62,9,u.sc,'Semi Bold');
    box(f,274,oy+12,66,24,PK,0.12,12); await txt(f,'View',286,oy+19,10,PK);
    box(f,274,oy+42,66,24,u.s==='Suspended'?GN:RD,0.12,12);
    await txt(f,u.s==='Suspended'?'Restore':'Block',278,oy+49,10,u.s==='Suspended'?GN:RD);
  }
  await navA(f,1);
  await label(f,'A2 / USER MANAGEMENT');
  return f;
};

// ── A3: ORDERS MONITOR ──────────────────────────────────────
const A3 = async () => {
  const f = mkFrame(adminPage,900,'A3 Orders Monitor');
  await statusBar(f);
  await txt(f,'Orders Monitor',20,50,20,WH,'Bold');
  await txt(f,'1,284 total today',246,52,10,GR);
  // Filters
  const filt2=['All','Live','Completed','Cancelled','Disputed'];
  let fx2=20;
  for(let i=0;i<filt2.length;i++){
    const fw=filt2[i].length*7+20; const s=i===1;
    box(f,fx2,82,fw,28,s?PK:CARD,1,14);
    await txt(f,filt2[i],fx2+8,89,10,s?WH:LG,s?'Semi Bold':'Regular');
    fx2+=fw+6;
  }
  // Live strip
  box(f,20,118,350,44,{r:.06,g:.04,b:.12},1,14);
  box(f,20,118,350,2,PK,0.5,2);
  await txt(f,'LIVE:',28,132,11,PK,'Bold');
  await txt(f,'186 active  •  34 en-route  •  12 in-service',70,132,11,LG);
  // Orders
  const ords2=[
    {id:'7284',cust:'Ramprasad M.', prov:'CleanMax Auto', svc:'Premium Wash',amt:'Rs349',s:'In Progress',sc:GN},
    {id:'7283',cust:'Neha S.',       prov:'Swift Wash',    svc:'Basic Wash',   amt:'Rs149',s:'En Route',   sc:CY},
    {id:'7282',cust:'Rahul V.',      prov:'ProShine',      svc:'Full Detailing',amt:'Rs699',s:'Completed', sc:GR},
    {id:'7281',cust:'Sai K.',        prov:'QuickWash',     svc:'Ext Wash',     amt:'Rs99', s:'Completed',  sc:GR},
    {id:'7280',cust:'Priya P.',      prov:'CleanMax',      svc:'Premium Wash', amt:'Rs349',s:'Cancelled',  sc:RD},
    {id:'7279',cust:'Vikram N.',     prov:'ProShine',      svc:'Tyre Change',  amt:'Rs249',s:'Disputed',   sc:AM}
  ];
  for(let i=0;i<ords2.length;i++){
    const o=ords2[i]; const oy=170+i*82;
    box(f,20,oy,350,74,CARD,1,12); box(f,20,oy,3,74,o.sc,1,2);
    await txt(f,'#'+o.id,28,oy+8,10,GR);
    box(f,230,oy+6,100,18,o.sc,0.15,9); await txt(f,o.s,234,oy+8,9,o.sc,'Semi Bold');
    await txt(f,o.cust,28,oy+26,12,WH,'Semi Bold');
    await txt(f,o.prov+'  •  '+o.svc,28,oy+44,10,GR);
    await txt(f,o.amt,296,oy+26,14,CY,'Bold');
    box(f,274,oy+46,68,22,PK,0.12,11); await txt(f,'Track ->',278,oy+52,9,PK);
  }
  await navA(f,2);
  await label(f,'A3 / ORDERS MONITOR');
  return f;
};

// ── A4: COMPLAINTS ───────────────────────────────────────────
const A4 = async () => {
  const f = mkFrame(adminPage,1350,'A4 Complaints');
  await statusBar(f);
  await txt(f,'Complaints',20,50,20,WH,'Bold');
  box(f,280,46,80,30,RD,0.15,15); await txt(f,'14 Open',291,54,11,RD,'Semi Bold');
  // Priority tabs
  const ptabs=['All','Critical','High','Resolved'];
  let otx=20;
  for(let i=0;i<ptabs.length;i++){
    const fw=ptabs[i].length*8+20; const s=i===1;
    box(f,otx,90,fw,30,s?RD:CARD,1,15);
    await txt(f,ptabs[i],otx+8,98,11,s?WH:LG,s?'Semi Bold':'Regular');
    otx+=fw+8;
  }
  // Complaints
  const comps=[
    {id:'CMP-041',cust:'Ramprasad M.',   issue:'Provider arrived 45 min late, car got scratched during wash',pri:'Critical',pc:RD,dt:'Today 11:30',s:'Pending'},
    {id:'CMP-040',cust:'Sai Krishna T.', issue:'Wrong package charged — billed Premium for Basic wash',       pri:'High',    pc:AM,dt:'Today 10:15',s:'Investigating'},
    {id:'CMP-039',cust:'Neha Sharma',    issue:'Technician was rude and unprofessional during service',       pri:'Medium',  pc:OG,dt:'Yesterday',  s:'Investigating'},
    {id:'CMP-038',cust:'Priya Patel',    issue:'Refund not processed after 7 business days',                  pri:'High',    pc:AM,dt:'25 May',      s:'Escalated'},
    {id:'CMP-037',cust:'Vikram N.',      issue:'App crashed during payment, money deducted, no booking',      pri:'Critical',pc:RD,dt:'24 May',      s:'Resolved'}
  ];
  for(let i=0;i<comps.length;i++){
    const c2=comps[i]; const oy=130+i*112;
    box(f,20,oy,350,100,CARD,1,14); box(f,20,oy,4,100,c2.pc,1,2);
    box(f,20,oy,350,28,{r:.09,g:.09,b:.10},1,14);
    await txt(f,c2.id,28,oy+8,10,GR);
    box(f,170,oy+6,c2.pri.length*7+14,18,c2.pc,0.15,9);
    await txt(f,c2.pri,174,oy+8,9,c2.pc,'Semi Bold');
    await txt(f,c2.dt,282,oy+8,9,GR);
    await txt(f,c2.cust,28,oy+34,12,WH,'Semi Bold');
    await txt(f,c2.issue.substring(0,52)+(c2.issue.length>52?'...':''),28,oy+52,10,LG);
    box(f,28,oy+72,c2.s.length*7+12,20,c2.pc,0.15,10);
    await txt(f,c2.s,32,oy+75,9,c2.pc,'Semi Bold');
    box(f,218,oy+70,68,22,PK,0.12,11); await txt(f,'Respond',222,oy+76,9,PK);
    box(f,294,oy+70,58,22,c2.s==='Resolved'?GN:RD,0.12,11);
    await txt(f,c2.s==='Resolved'?'Closed':'Escalate',298,oy+76,9,c2.s==='Resolved'?GN:RD);
  }
  await navA(f,3);
  await label(f,'A4 / COMPLAINTS');
  return f;
};

// ── A5: ANALYTICS ────────────────────────────────────────────
const A5 = async () => {
  const f = mkFrame(adminPage,1800,'A5 Analytics');
  topGrad(f,0.08,0.04,0.16,210);
  await statusBar(f);
  await txt(f,'Analytics',20,50,20,WH,'Bold');
  // Period toggle
  box(f,20,82,350,32,CARD,1,16);
  const periods=['Today','Week','Month','Year'];
  for(let i=0;i<4;i++){
    const s=i===2;
    box(f,22+i*87,84,85,28,s?PK:{r:0,g:0,b:0},s?1:0,14);
    await txt(f,periods[i],22+i*87+20,91,11,s?WH:GR,s?'Semi Bold':'Regular');
  }
  // KPI cards
  const mets=[
    ['Rs4.28L','Total Revenue',  GN, '+18%'],
    ['8,421',  'Orders',         CY, '+12%'],
    ['2,841',  'Active Users',   BL, '+24%'],
    ['4.76',   'Avg Rating',     ST, '+0.2']
  ];
  for(let i=0;i<4;i++){
    const col=i%2,row=Math.floor(i/2);
    const ox=20+col*178, oy=126+row*78;
    box(f,ox,oy,164,68,CARD,1,14); box(f,ox,oy,164,3,mets[i][2],1,2);
    await txt(f,mets[i][0],ox+10,oy+10,17,mets[i][2],'Bold');
    await txt(f,mets[i][1],ox+10,oy+38,9,GR);
    box(f,ox+110,oy+10,44,18,mets[i][2],0.15,9);
    await txt(f,mets[i][3],ox+114,oy+13,9,mets[i][2],'Semi Bold');
  }
  // Trend chart (dot line)
  await txt(f,'Revenue Trend — May 2026',20,294,14,WH,'Semi Bold');
  box(f,20,316,350,108,CARD,1,14);
  const pts=[60,48,72,42,86,58,94,64,78,52,88,70];
  for(let i=0;i<pts.length;i++){
    const dx=30+i*27, dy=398-pts[i];
    box(f,dx,dy,6,6,PK,1,3);
    if(i<pts.length-1){
      const nx=30+(i+1)*27, ny=398-pts[i+1];
      box(f,dx+3,Math.min(dy,ny)+3,nx-dx,Math.max(Math.abs(dy-ny),1),PK,0.3,1);
    }
  }
  await txt(f,'Rs4.28L this month  •  Peak: Week 3',30,400,9,GR);
  // Top services table
  await txt(f,'Top Services by Revenue',20,436,14,WH,'Semi Bold');
  box(f,20,458,350,26,{r:.09,g:.09,b:.10},1,14);
  await txt(f,'Service',28,466,10,GR,'Semi Bold');
  await txt(f,'Orders',164,466,10,GR,'Semi Bold');
  await txt(f,'Revenue',238,466,10,GR,'Semi Bold');
  await txt(f,'Share',316,466,10,GR,'Semi Bold');
  const svcs3=[
    ['Car Wash',     '3,421','Rs1.72L','40%',CY],
    ['AC Repair',    '1,840','Rs1.10L','26%',OG],
    ['Tyre Fix',     '1,203','Rs0.60L','14%',GN],
    ['Full Detail',  '862',  'Rs0.60L','14%',PU],
    ['Cleaning',     '512',  'Rs0.26L','6%', BL]
  ];
  for(let i=0;i<svcs3.length;i++){
    const sv=svcs3[i]; const oy=484+i*44;
    box(f,20,oy,350,38,i%2===0?CARD:CARD2,1,10);
    box(f,20,oy,3,38,sv[4],1,2);
    await txt(f,sv[0],28,oy+12,11,WH);
    await txt(f,sv[1],160,oy+12,11,LG);
    await txt(f,sv[2],234,oy+12,11,CY);
    await txt(f,sv[3],316,oy+12,11,sv[4],'Semi Bold');
  }
  // City strip
  box(f,20,710,350,44,CARD,1,14); box(f,20,710,4,44,PK,1,2);
  await txt(f,'Top City: Hyderabad  •  62% of orders  •  Rs2.65L revenue',26,722,10,LG);
  await txt(f,'Export PDF ->',284,740,10,PK);
  await navA(f,3);
  await label(f,'A5 / ANALYTICS');
  return f;
};

const a1=await A1(),a2=await A2(),a3=await A3(),a4=await A4(),a5=await A5();

// Admin prototypes
link(a1,20,438,164,48,a2.id);
link(a1,198,438,164,48,a3.id);
link(a1,20,620,164,48,a4.id);
link(a1,198,620,164,48,a5.id);
link(a2,274,238,66,24,a3.id);
link(a3,274,170,68,22,a4.id);
link(a4,218,200,68,22,a1.id);
link(a5,284,740,86,16,a1.id);

figma.viewport.scrollAndZoomIntoView(adminPage.children);

console.log('====================================');
console.log('ServiCo Complete! All 19 screens built.');
console.log('Page 1 (Customer):  C1 Login > C2 Register > C3 Home > C4 Providers > C5 Booking > C6 Payment > C7 Tracking > C8 History');
console.log('Page 2 (Provider):  P1 Login > P2 Dashboard > P3 Request > P4 Jobs > P5 Job Detail > P6 Earnings');
console.log('Page 3 (Admin):     A1 Dashboard > A2 Users > A3 Orders > A4 Complaints > A5 Analytics');
console.log('====================================');
