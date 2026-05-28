// ============================================================
//  ServiCo v2 — Enhanced 3-Role Prototype
//  19 Screens on ONE PAGE — 3 rows (Customer / Provider / Admin)
// ============================================================

const W = 390, H = 844;

// ── Color Palette ───────────────────────────────────────────
const BG   = {r:.035,g:.035,b:.045};
const SURF = {r:.07, g:.07, b:.09 };
const CARD = {r:.11, g:.115,b:.135};
const EDGE = {r:.18, g:.18, b:.22 };
const DP   = {r:.038,g:.038,b:.048};
const CY   = {r:0,   g:.82, b:1   };
const OG   = {r:1,   g:.44, b:.22 };
const WH   = {r:1,   g:1,   b:1   };
const BK   = {r:0,   g:0,   b:0   };
const GR   = {r:.46, g:.46, b:.52 };
const LG   = {r:.72, g:.72, b:.78 };
const GN   = {r:.16, g:.84, b:.44 };
const ST   = {r:1,   g:.78, b:0   };
const RD   = {r:.95, g:.27, b:.27 };
const BL   = {r:.22, g:.50, b:.96 };
const NV   = {r:.01, g:.12, b:.22 };
const PK   = {r:.60, g:.28, b:1   };
const AM   = {r:1,   g:.72, b:0   };

// ── PRE-LOAD ALL FONTS (fixes Scripter timeout) ─────────────
await Promise.all([
  figma.loadFontAsync({family:'Inter',style:'Regular'}),
  figma.loadFontAsync({family:'Inter',style:'Medium'}),
  figma.loadFontAsync({family:'Inter',style:'Semi Bold'}),
  figma.loadFontAsync({family:'Inter',style:'Bold'}),
]);
const _fl = new Set(['Inter|Regular','Inter|Medium','Inter|Semi Bold','Inter|Bold']);

// ── Core Primitives ─────────────────────────────────────────
const sf = (c,a) => {
  const p = {type:'SOLID', color:{r:c.r,g:c.g,b:c.b}};
  if (a != null && a < 1) p.opacity = a;
  return [p];
};

const bx = (p,x,y,w,h,c,a,r) => {
  const n = figma.createRectangle();
  n.x=x; n.y=y;
  n.resize(Math.max(w,1), Math.max(h,1));
  n.fills = sf(c,a);
  if (r) n.cornerRadius = r;
  p.appendChild(n);
  return n;
};

const lf = async (fam,sty) => {
  const k = fam+'|'+sty;
  if (!_fl.has(k)) { await figma.loadFontAsync({family:fam,style:sty}); _fl.add(k); }
};

const tx = async (p,s,x,y,sz,c,sty,a) => {
  const st = sty||'Regular';
  await lf('Inter',st);
  const n = figma.createText();
  n.fontName = {family:'Inter', style:st};
  n.characters = String(s);
  n.fontSize = sz;
  n.fills = sf(c,a);
  n.x=x; n.y=y;
  p.appendChild(n);
  return n;
};

const mk = (pg,x,nm,row=0) => {
  const f = figma.createFrame();
  f.name=nm; f.x=x; f.y=row*960;
  f.resize(W,H); f.fills=sf(BG); f.clipsContent=true;
  pg.appendChild(f);
  return f;
};

const tg = (f,c,ht) => {
  const n = figma.createRectangle();
  n.resize(W, ht||300);
  n.fills = [{
    type:'GRADIENT_LINEAR',
    gradientTransform:[[0,0,.5],[1,0,0]],
    gradientStops:[
      {position:0, color:{...c, a:.9}},
      {position:1, color:{...BG, a:0}}
    ]
  }];
  f.appendChild(n);
};

const lnk = (fr,x,y,w,h,dest) => {
  const n = figma.createRectangle();
  n.name='->'; n.x=x; n.y=y;
  n.resize(Math.max(w,1),Math.max(h,1));
  n.fills = [];
  n.reactions = [{
    actions:[{
      type:'NODE',
      destinationId:dest,
      navigation:'NAVIGATE',
      transition:{type:'DISSOLVE', easing:{type:'EASE_IN_AND_OUT'}, duration:0.3},
      preserveScrollPosition:false
    }],
    trigger:{type:'ON_CLICK'}
  }];
  fr.appendChild(n);
};

// ── UI Components ────────────────────────────────────────────

const SB = async (f) => {
  await tx(f,'9:41',16,14,15,WH,'Semi Bold');
  for (let i=0;i<4;i++){const h=4+i*3; bx(f,326+i*6,21-h,4,h,WH,i<3?1:.3,1);}
  bx(f,368,17,20,11,WH,.2,3); bx(f,369,18,14,9,GN,1,2); bx(f,388,20,2,5,WH,.4,1);
};

const LBL = async (f,s) => await tx(f,s,14,H-14,8,CY,'Semi Bold',.3);

const CD = (f,x,y,w,h,r=16) => {
  bx(f,x,y,w,h,CARD,1,r);
  bx(f,x+1,y,w-2,1,WH,.07,r);
};

const AV = async (f,x,y,sz,init,c) => {
  bx(f,x,y,sz,sz,c,.18,sz/2);
  bx(f,x+1,y+1,sz-2,sz-2,c,.22,sz/2-1);
  await tx(f,init, x+Math.round((sz-init.length*8)/2), y+Math.round(sz/2)-8, 14, c,'Bold');
};

const BDG = async (f,x,y,t,c) => {
  const w = Math.max(t.length*6.5+16, 36);
  bx(f,x,y,w,20,c,.15,10);
  bx(f,x,y,w,1,c,.35,10);
  await tx(f,t, x+7,y+5, 9, c,'Semi Bold');
  return w;
};

const BTN = async (f,x,y,w,t,c,tc) => {
  const bc=c||CY;
  const ftc = tc || (bc===OG||bc===RD||bc===BL||bc===PK||bc===GN ? WH : BK);
  bx(f,x,y,w,52,bc,1,26);
  bx(f,x+1,y+1,w-2,1,WH,.2,25);
  await tx(f,t, x+Math.round((w - t.length*7.2)/2), y+17, 15, ftc,'Bold');
};

const BTN2 = async (f,x,y,w,t,c) => {
  bx(f,x,y,w,48,CARD,1,24);
  bx(f,x,y,w,1,c||CY,.35,24);
  bx(f,x,y,w,48,c||CY,.06,24);
  await tx(f,t, x+Math.round((w - t.length*6.8)/2), y+15, 13, c||CY);
};

const INP = async (f,x,y,w,lbl_,val,col) => {
  if (lbl_) await tx(f,lbl_, x,y-18, 11, LG);
  bx(f,x,y,w,48,CARD,1,12);
  bx(f,x,y,w,1,WH,.05,12);
  if (col) bx(f,x,y,3,48,col,1,2);
  const muted = val.startsWith('Enter')||val.startsWith('Search')||val.startsWith('Type')||val.startsWith('e.g');
  await tx(f,val, x+16,y+15, 13, muted?GR:LG);
};

const SC = async (f,x,y,w,val,lab,c) => {
  CD(f,x,y,w,72);
  bx(f,x,y,w,3,c,1,2);
  await tx(f,val, x+12,y+12, 20, c,'Bold');
  await tx(f,lab, x+12,y+46, 9, GR);
};

const DIV = (f,y) => bx(f,20,y,350,1,EDGE,.6);

const HDR = async (f,title,sub) => {
  bx(f,16,44,36,36,SURF,1,18);
  bx(f,16,44,36,36,WH,.04,18);
  await tx(f,'<', 25,51, 18, WH,'Bold');
  await tx(f,title, 62,sub?48:53, 16, WH,'Bold');
  if (sub) await tx(f,sub, 62,68, 10, GR);
};

const NAV_C = async (f,a) => {
  bx(f,0,H-80,W,80,DP); bx(f,0,H-80,W,1,EDGE,.5);
  const ns=['Home','Services','Bookings','Chat','Profile'];
  for (let i=0;i<5;i++){
    const nx=14+i*74, ac=i===a;
    if (ac) { bx(f,nx+4,H-80,32,3,CY,1,2); bx(f,nx,H-78,40,44,CY,.08,20); }
    await tx(f,ns[i], nx+2,H-52, 9, ac?CY:GR, ac?'Semi Bold':'Regular');
  }
};

const NAV_P = async (f,a) => {
  bx(f,0,H-80,W,80,DP); bx(f,0,H-80,W,1,EDGE,.5);
  const ns=['Dashboard','Jobs','Earnings','Profile'];
  for (let i=0;i<4;i++){
    const nx=18+i*90, ac=i===a;
    if (ac) { bx(f,nx+8,H-80,38,3,OG,1,2); bx(f,nx+4,H-78,44,44,OG,.08,22); }
    await tx(f,ns[i], nx+2,H-52, 9, ac?OG:GR, ac?'Semi Bold':'Regular');
  }
};

const NAV_A = async (f,a) => {
  bx(f,0,H-80,W,80,DP); bx(f,0,H-80,W,1,EDGE,.5);
  const ns=['Overview','Users','Orders','Reports'];
  for (let i=0;i<4;i++){
    const nx=18+i*90, ac=i===a;
    if (ac) { bx(f,nx+8,H-80,38,3,PK,1,2); bx(f,nx+4,H-78,44,44,PK,.08,22); }
    await tx(f,ns[i], nx+2,H-52, 9, ac?PK:GR, ac?'Semi Bold':'Regular');
  }
};

// ── Single Page Setup ────────────────────────────────────────
// All 19 screens on one page in 3 rows
const root = figma.root;
const pg = root.children[0];
pg.name = 'ServiCo — All Screens';
// alias so all mk() calls use the same page
const custPage = pg;
const provPage = pg;
const adminPage = pg;

// ════════════════════════════════════════════════════════════
//  CUSTOMER — Row 1  (y = 0)
// ════════════════════════════════════════════════════════════

// C1: LOGIN
const C1 = async () => {
  const f = mk(custPage,0,'C1 Login');
  tg(f,NV,H);
  // Logo
  bx(f,155,54,80,80,CY,.08,40);
  bx(f,163,62,64,64,CY,.12,32);
  bx(f,171,70,48,48,CY,1,24);
  await tx(f,'S',186,82,22,BK,'Bold');
  await tx(f,'ServiCo',138,158,26,WH,'Bold');
  await tx(f,'Car Wash & Technical Services',80,192,12,GR);
  // Auth tabs
  bx(f,20,224,350,44,SURF,1,22);
  bx(f,22,226,172,40,CY,1,20);
  await tx(f,'Login',80,237,14,BK,'Bold');
  await tx(f,'Register',224,237,14,GR);
  // Form fields
  await tx(f,'Mobile Number',20,286,11,LG);
  bx(f,20,304,350,48,CARD,1,12);
  bx(f,20,304,3,48,CY,1,2);
  bx(f,20,304,350,1,WH,.05,12);
  await tx(f,'+91',34,319,12,CY,'Semi Bold');
  bx(f,68,318,1,20,GR,.35);
  await tx(f,'98765 43210',78,319,13,LG);
  await tx(f,'Password',20,368,11,LG);
  bx(f,20,386,350,48,CARD,1,12);
  bx(f,20,386,3,48,CY,1,2);
  bx(f,20,386,350,1,WH,.05,12);
  await tx(f,'••••••••••',34,401,13,LG);
  await tx(f,'Show',334,403,11,CY);
  await tx(f,'Forgot Password?',246,450,12,CY);
  // CTAs
  await BTN(f,20,472,350,'Login to ServiCo',CY);
  await BTN2(f,20,538,350,'Login with OTP',CY);
  // Divider + Google
  bx(f,20,602,145,1,EDGE); await tx(f,'or continue with',120,596,11,GR); bx(f,228,602,142,1,EDGE);
  bx(f,20,618,350,48,SURF,1,24); bx(f,20,618,350,1,WH,.05,24);
  bx(f,36,632,22,22,WH,1,11); await tx(f,'G',41,635,12,BL,'Bold');
  await tx(f,'Continue with Google',70,636,13,LG);
  // Register link
  await tx(f,"Don't have an account?",68,684,12,GR);
  await tx(f,'Register here',248,684,12,CY,'Semi Bold');
  // Trust badges
  const tbs=['Secure Login','256-bit SSL','Privacy Safe'];
  for (let i=0;i<3;i++){
    bx(f,20+i*118,714,108,42,SURF,1,10); bx(f,20+i*118,714,108,2,CY,.2,2);
    await tx(f,tbs[i],28+i*118,730,9,GR);
  }
  await LBL(f,'C1 / LOGIN');
  return f;
};

// C2: REGISTER
const C2 = async () => {
  const f = mk(custPage,450,'C2 Register');
  tg(f,NV,200);
  await SB(f);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  await tx(f,'Create Account',62,48,16,WH,'Bold');
  await tx(f,'Step 1 of 3  —  Personal Info',62,68,10,GR);
  // Progress
  bx(f,20,90,350,4,SURF,1,4); bx(f,20,90,116,4,CY,1,4);
  // Fields
  await INP(f,20,116,350,'Full Name','Ramprasad Mokka',CY);
  await INP(f,20,192,350,'Mobile Number','+91  98765 43210',CY);
  await INP(f,20,268,350,'Email Address','ramprasad@gmail.com',CY);
  await INP(f,20,344,350,'City / Area','Banjara Hills, Hyderabad',CY);
  // Vehicle type
  await tx(f,'Vehicle Type',20,410,11,LG);
  bx(f,20,428,350,48,CARD,1,12); bx(f,20,428,3,48,CY,1,2); bx(f,20,428,350,1,WH,.05,12);
  await tx(f,'Sedan',34,443,13,LG); await tx(f,'▾',334,443,13,GR);
  await INP(f,20,500,350,'Vehicle Number / Model','Maruti Swift Dzire (White)',CY);
  // OTP
  DIV(f,564);
  await tx(f,'Verify Mobile — OTP sent to +91 98765 43210',20,574,11,GR);
  const digs = ['8','4','2','_'];
  for (let i=0;i<4;i++){
    const sel=i===3;
    bx(f,20+i*86,590,74,64,sel?CY:CARD,1,14);
    if (sel) bx(f,21+i*86,591,72,62,NV,1,12);
    else bx(f,21+i*86,591,72,62,SURF,.5,13);
    await tx(f,digs[i], 44+i*86,608, 24, sel?CY:WH,'Bold');
  }
  await tx(f,'Resend OTP in',132,668,11,GR);
  await tx(f,'0:38',242,668,11,AM,'Semi Bold');
  await BTN(f,20,696,350,'Verify & Continue',CY);
  bx(f,20,762,350,32,GN,.07,10); bx(f,20,762,350,1,GN,.25,10);
  await tx(f,'Your data is encrypted and never shared with third parties',32,773,10,GN);
  await LBL(f,'C2 / REGISTER');
  return f;
};

// C3: HOME
const C3 = async () => {
  const f = mk(custPage,900,'C3 Home');
  tg(f,{r:.01,g:.08,b:.20},280);
  await SB(f);
  // Top bar
  bx(f,20,44,242,36,SURF,1,18); bx(f,20,44,242,1,WH,.05,18);
  await tx(f,'Banjara Hills, Hyderabad  v',28,53,12,LG);
  bx(f,308,44,36,36,SURF,1,18); bx(f,308,44,36,36,WH,.04,18);
  bx(f,330,46,8,8,RD,1,4);
  await tx(f,'Bell',312,53,10,LG);
  // Greeting
  await tx(f,'Good Morning,',20,92,13,GR);
  await tx(f,'What service today, Ram?',20,112,22,WH,'Bold');
  // Search
  bx(f,20,148,350,48,SURF,1,14); bx(f,20,148,350,1,WH,.05,14);
  await tx(f,'Search car wash, AC repair, tyres...',38,162,12,GR);
  bx(f,322,154,42,36,CY,.12,12); await tx(f,'Filter',326,165,9,CY,'Semi Bold');
  // Promo banner (inline frame)
  const bn = figma.createFrame();
  bn.name='Promo Banner'; bn.x=20; bn.y=210;
  bn.resize(350,108); bn.cornerRadius=18; bn.clipsContent=true; bn.fills=[];
  const bg = figma.createRectangle(); bg.resize(350,108);
  bg.fills=[{type:'GRADIENT_LINEAR',gradientTransform:[[0,0,.5],[1,0,0]],
    gradientStops:[
      {position:0,color:{r:.02,g:.14,b:.52,a:1}},
      {position:1,color:{r:0,g:.55,b:.92,a:1}}
    ]}];
  bn.appendChild(bg);
  bx(bn,222,-30,162,162,WH,.05,81); bx(bn,252,-8,124,124,WH,.04,62);
  await tx(bn,'30% OFF',16,8,30,WH,'Bold');
  await tx(bn,'First Booking | Code: FIRST30',16,50,11,WH,'Regular',.85);
  bx(bn,16,78,92,24,WH,.15,12); await tx(bn,'Book Now  ->',20,84,10,WH,'Semi Bold');
  f.appendChild(bn);
  // Categories grid
  await tx(f,'Popular Services',20,334,15,WH,'Semi Bold');
  await tx(f,'See All ->',308,336,11,CY);
  const cats=[
    {n:'Car Wash',c:CY},{n:'AC Repair',c:OG},{n:'Tyre Fix',c:GN},
    {n:'Detailing',c:PK},{n:'Engine',c:AM},{n:'Cleaning',c:BL}
  ];
  for (let i=0;i<6;i++){
    const col=i%3, row=Math.floor(i/3), ox=20+col*120, oy=358+row*94;
    CD(f,ox,oy,110,84);
    bx(f,ox+32,oy+10,46,46,cats[i].c,.12,23);
    bx(f,ox+32,oy+10,46,1,WH,.07,23);
    await tx(f,cats[i].n.substring(0,3), ox+40,oy+21, 13, cats[i].c,'Bold');
    await tx(f,cats[i].n, ox+8,oy+64, 10, LG,'Semi Bold');
  }
  // Near you
  await tx(f,'Near You',20,562,15,WH,'Semi Bold');
  await tx(f,'View All ->',302,564,11,CY);
  const pvs=[
    {n:'CleanMax Auto Spa',r:'4.9',d:'1.2 km',p:'199',c:CY},
    {n:'Swift Wash & Care', r:'4.7',d:'2.4 km',p:'149',c:GN}
  ];
  for (let i=0;i<2;i++){
    const p=pvs[i], ox=20+i*180;
    CD(f,ox,584,170,86);
    bx(f,ox+12,596,44,44,p.c,.18,22); bx(f,ox+14,598,40,40,p.c,.2,20);
    await tx(f,p.n[0], ox+28,611, 14, p.c,'Bold');
    await tx(f,p.n.substring(0,11), ox+62,592, 11, WH,'Semi Bold');
    await tx(f,'* '+p.r, ox+62,610, 10, ST);
    await tx(f,p.d+' away', ox+62,628, 9, GR);
    await tx(f,'From Rs.'+p.p, ox+62,646, 10, CY,'Semi Bold');
  }
  await NAV_C(f,0);
  await LBL(f,'C3 / HOME');
  return f;
};

// C4: PROVIDER LIST
const C4 = async () => {
  const f = mk(custPage,1350,'C4 Providers');
  await SB(f);
  await HDR(f,'Car Wash Providers');
  await tx(f,'6 providers nearby',258,53,10,GR);
  // Filter chips
  const flt=['All','Nearest','Top Rated','Budget','Express'];
  let fx=20;
  for (let i=0;i<flt.length;i++){
    const fw=flt[i].length*7+22, s=i===0;
    bx(f,fx,88,fw,30,s?CY:SURF,1,15);
    if (!s) bx(f,fx,88,fw,1,WH,.04,15);
    await tx(f,flt[i], fx+8,96, 11, s?BK:LG, s?'Semi Bold':'Regular');
    fx+=fw+8;
  }
  // Map strip
  bx(f,0,126,W,86,{r:.04,g:.08,b:.12});
  for (let i=0;i<6;i++) bx(f,0,126+i*15,W,1,WH,.022);
  for (let i=0;i<8;i++) bx(f,i*50,126,1,86,WH,.022);
  bx(f,0,188,W,7,{r:.10,g:.14,b:.18},1,4);
  bx(f,187,126,7,86,{r:.10,g:.14,b:.18},1,4);
  bx(f,82,148,20,20,CY,1,10); await tx(f,'1',88,151,9,BK,'Bold');
  bx(f,196,138,20,20,OG,1,10); await tx(f,'2',202,141,9,BK,'Bold');
  bx(f,284,154,20,20,GN,1,10); await tx(f,'3',290,157,9,BK,'Bold');
  // Sort row
  bx(f,20,222,350,32,SURF,1,10);
  await tx(f,'Sort: Distance  v',28,232,11,LG);
  await tx(f,'Filters (2)',298,232,11,CY,'Semi Bold');
  // Provider cards
  const pvds=[
    {n:'CleanMax Auto Spa',  r:'4.9',rv:'1.2K',d:'1.2 km',p:'199',tm:'30 min',bd:'Top Rated',bc:CY},
    {n:'Swift Wash & Care',  r:'4.7',rv:'843', d:'2.4 km',p:'149',tm:'45 min',bd:'Budget',   bc:GN},
    {n:'ProShine Detailing', r:'4.8',rv:'562', d:'3.1 km',p:'299',tm:'90 min',bd:'Premium',  bc:OG},
    {n:'QuickWash Express',  r:'4.6',rv:'329', d:'4.0 km',p:'99', tm:'20 min',bd:'Express',  bc:PK},
  ];
  for (let i=0;i<pvds.length;i++){
    const p=pvds[i], oy=262+i*122;
    CD(f,20,oy,350,112);
    bx(f,30,oy+14,44,44,p.bc,.2,22); bx(f,32,oy+16,40,40,p.bc,.22,20);
    await tx(f,p.n[0], 46,oy+25, 14, p.bc,'Bold');
    await BDG(f,30,oy+72,p.bd,p.bc);
    await tx(f,p.n, 90,oy+14, 13, WH,'Semi Bold');
    await tx(f,'* '+p.r+'  ('+p.rv+' reviews)', 90,oy+34, 10, ST);
    await tx(f,p.d+' away  +  '+p.tm+' avg', 90,oy+52, 10, GR);
    await tx(f,'From Rs.'+p.p, 90,oy+72, 12, CY,'Semi Bold');
    await BTN(f,268,oy+60,80,'Book',CY);
  }
  await LBL(f,'C4 / PROVIDERS');
  return f;
};

// C5: BOOKING
const C5 = async () => {
  const f = mk(custPage,1800,'C5 Booking');
  await SB(f);
  await HDR(f,'Book Service','CleanMax Auto Spa');
  // Provider summary
  CD(f,20,88,350,66);
  bx(f,30,98,44,44,CY,.2,22); await tx(f,'CM',44,112,13,BK,'Bold');
  await tx(f,'CleanMax Auto Spa', 88,98, 13, WH,'Semi Bold');
  await tx(f,'* 4.9  +  1.2 km  +  30 min avg', 88,118, 10, GR);
  await tx(f,'From Rs.199', 88,136, 11, CY,'Semi Bold');
  // Packages
  await tx(f,'Select Package',20,170,14,WH,'Semi Bold');
  const pkgs=[
    {n:'Basic Wash',    d:'Exterior only  +  30 min',  p:'Rs.199',s:false},
    {n:'Premium Wash',  d:'Interior + Exterior  +  60 min',p:'Rs.349',s:true},
    {n:'Full Detailing',d:'Complete care  +  3 hrs',   p:'Rs.699',s:false},
  ];
  for (let i=0;i<pkgs.length;i++){
    const pk=pkgs[i], oy=194+i*74;
    if (pk.s){ bx(f,19,oy-1,352,70,CY,1,14); bx(f,20,oy,350,68,NV,1,13); }
    else CD(f,20,oy,350,68);
    bx(f,32,oy+24,16,16,pk.s?CY:EDGE,1,8);
    if (pk.s) bx(f,36,oy+28,8,8,WH,1,4);
    await tx(f,pk.n, 58,oy+10, 13, pk.s?CY:WH, pk.s?'Semi Bold':'Regular');
    await tx(f,pk.d, 58,oy+30, 10, GR);
    if (pk.s) await tx(f,'Best Value', 58,oy+50, 9, CY,'Semi Bold');
    await tx(f,pk.p, 308,oy+22, 13, pk.s?CY:LG,'Bold');
  }
  // Vehicle
  await INP(f,20,440,350,'Your Vehicle','Maruti Swift Dzire (White)  v',CY);
  // Date & Time
  await tx(f,'Date & Time',20,504,14,WH,'Semi Bold');
  CD(f,20,526,350,100);
  await tx(f,'<',34,536,18,CY,'Bold'); await tx(f,'May 2026',154,538,13,WH,'Semi Bold'); await tx(f,'>',348,536,18,CY,'Bold');
  const dl=['S','M','T','W','T','F','S'];
  for (let i=0;i<7;i++) await tx(f,dl[i],29+i*48,558,10,GR);
  const dt=['25','26','27','28','29','30','31'];
  for (let i=0;i<7;i++){
    const sel=i===2;
    if (sel) bx(f,21+i*48,576,28,28,CY,1,14);
    await tx(f,dt[i], 27+i*48,581, 11, sel?BK:WH, sel?'Bold':'Regular');
  }
  // Time slots
  const sls=['9:00 AM','11:00 AM','2:00 PM','4:00 PM','6:00 PM'];
  for (let i=0;i<5;i++){
    const sel=i===1, sx=20+(i%3)*88, sy=644+Math.floor(i/3)*42;
    bx(f,sx,sy,80,32,sel?CY:SURF,1,12);
    if (!sel) bx(f,sx,sy,80,1,WH,.04,12);
    await tx(f,sls[i], sx+6,sy+10, 11, sel?BK:LG, sel?'Semi Bold':'Regular');
  }
  // Address
  await INP(f,20,706,350,'Service Address','Banjara Hills, Hyderabad - 500034',CY);
  // Footer
  bx(f,0,762,W,1,EDGE,.5); bx(f,0,763,W,81,DP);
  await tx(f,'Premium Wash  +  27 May  +  11:00 AM', 18,774, 10, LG);
  await tx(f,'Rs.349', 302,770, 16, CY,'Bold');
  bx(f,18,792,354,36,CY,1,18);
  await tx(f,'Proceed to Payment  ->', 98,804, 13, BK,'Bold');
  await LBL(f,'C5 / BOOKING');
  return f;
};

// C6: PAYMENT
const C6 = async () => {
  const f = mk(custPage,2250,'C6 Payment');
  await SB(f);
  await HDR(f,'Checkout');
  bx(f,270,46,100,30,{r:.02,g:.16,b:.26},1,15);
  bx(f,282,58,8,8,GN,1,4); await tx(f,'100% Secure',296,55,9,CY,'Semi Bold');
  // Order summary
  await tx(f,'Order Summary',20,88,14,WH,'Semi Bold');
  CD(f,20,110,350,130);
  await tx(f,'CleanMax Auto Spa', 28,122, 13, WH,'Semi Bold');
  await tx(f,'Premium Car Wash  +  Maruti Swift Dzire', 28,142, 11, GR);
  await tx(f,'27 May 2026  +  11:00 AM  +  Banjara Hills', 28,160, 10, GR);
  bx(f,20,180,350,1,EDGE,.5);
  const rows=[['Service charge','Rs.349',LG],['Platform fee','Rs.25',LG],['Discount (FIRST30)','-Rs.105',GN]];
  for (let i=0;i<rows.length;i++){
    await tx(f,rows[i][0], 28,188+i*18, 11, GR);
    await tx(f,rows[i][1], 316-rows[i][1].length*6.5,188+i*18, 11, rows[i][2]);
  }
  // Total
  bx(f,20,242,350,54,SURF,1,14); bx(f,20,242,350,1,WH,.05,14);
  await tx(f,'Total Payable', 28,258, 13, WH,'Semi Bold');
  await tx(f,'Rs. 269', 280,252, 22, CY,'Bold');
  // Promo
  bx(f,20,308,350,42,GN,.07,12); bx(f,20,308,350,1,GN,.25,12);
  bx(f,30,320,16,16,GN,1,8); await tx(f,'v',34,321,9,BK,'Bold');
  await tx(f,'FIRST30 applied — saving Rs.105', 54,314, 11, GN,'Semi Bold');
  await tx(f,'Remove',316,314,10,GR);
  // Payment methods
  await tx(f,'Payment Method',20,362,14,WH,'Semi Bold');
  const ms=[
    {n:'UPI  —  GPay / PhonePe / Paytm',c:CY,s:true},
    {n:'Credit / Debit Card',c:BL,s:false},
    {n:'Net Banking',c:GN,s:false},
    {n:'Pay Later (BNPL)',c:OG,s:false},
    {n:'Cash on Completion',c:AM,s:false},
  ];
  for (let i=0;i<ms.length;i++){
    const m=ms[i], oy=386+i*52;
    if (m.s){ bx(f,19,oy-1,352,48,CY,1,13); bx(f,20,oy,350,46,NV,1,12); }
    else CD(f,20,oy,350,46);
    bx(f,30,oy+10,26,26,m.c,.15,13);
    await tx(f,m.n, 66,oy+14, 12, m.s?CY:LG, m.s?'Semi Bold':'Regular');
    bx(f,322,oy+15,16,16,m.s?CY:EDGE,1,8);
    if (m.s) bx(f,326,oy+19,8,8,WH,1,4);
  }
  await BTN(f,20,654,350,'Pay  Rs.269  Securely',CY);
  await tx(f,'PCI-DSS Compliant  +  Encrypted  +  Razorpay',72,720,10,GR);
  await LBL(f,'C6 / PAYMENT');
  return f;
};

// C7: LIVE TRACKING
const C7 = async () => {
  const f = mk(custPage,2700,'C7 Tracking');
  // Map
  bx(f,0,0,W,410,{r:.04,g:.08,b:.12});
  for (let i=0;i<9;i++) bx(f,0,i*48,W,1,WH,.022);
  for (let i=0;i<8;i++) bx(f,i*50,0,1,410,WH,.022);
  bx(f,0,204,W,8,{r:.12,g:.16,b:.20},1,4);
  bx(f,188,0,8,410,{r:.12,g:.16,b:.20},1,4);
  bx(f,0,316,W,5,{r:.10,g:.12,b:.17},1,3);
  // Route
  for (let i=0;i<9;i++) bx(f,90+i*13,200-i*7,8,4,CY,.7,2);
  // Destination
  bx(f,168,188,36,36,GN,.12,18); bx(f,172,192,28,28,GN,.2,14); bx(f,178,198,16,16,GN,1,8);
  // Provider pin
  bx(f,72,108,52,52,CY,.15,26); bx(f,78,114,40,40,CY,1,20);
  await tx(f,'SK',92,124,11,BK,'Bold');
  // ETA
  CD(f,268,84,100,58); await tx(f,'ETA',308,94,10,GR); await tx(f,'8 min',274,108,22,CY,'Bold');
  // Header overlay
  bx(f,0,0,W,80,BK,.4);
  await SB(f);
  bx(f,16,42,36,36,BK,.5,18); await tx(f,'<',25,49,18,WH,'Bold');
  await tx(f,'Live Tracking',66,48,14,WH,'Bold');
  await tx(f,'Order #7284',66,66,10,GR);
  bx(f,248,44,122,30,{r:.02,g:.36,b:.16},1,15);
  bx(f,260,56,8,8,GN,1,4); await tx(f,'En Route',274,53,11,WH,'Semi Bold');
  // Bottom sheet
  bx(f,0,410,W,H-410,{r:.063,g:.063,b:.073});
  bx(f,0,410,W,1,EDGE,.5);
  bx(f,174,420,42,4,EDGE,1,2);
  // Provider card
  CD(f,20,436,350,84);
  bx(f,30,448,52,52,CY,1,26); await tx(f,'SK',44,466,14,BK,'Bold');
  await tx(f,'Suresh Kumar',94,448,14,WH,'Bold');
  await tx(f,'Car Wash Specialist  +  5 yrs exp',94,468,10,GR);
  await tx(f,'* 4.9  (342 reviews)',94,486,10,ST);
  bx(f,284,454,36,36,GN,.15,18); await tx(f,'Call',291,463,10,GN,'Semi Bold');
  bx(f,326,454,36,36,CY,.15,18); await tx(f,'Chat',333,463,10,CY,'Semi Bold');
  // Timeline
  await tx(f,'Job Status',20,536,14,WH,'Semi Bold');
  await tx(f,'Start OTP: 4821',294,538,10,GR);
  const steps=[
    {l:'Payment Confirmed',t:'11:00 AM',done:true, act:false},
    {l:'Provider Accepted', t:'11:02 AM',done:true, act:false},
    {l:'En Route to You',   t:'Est 11:18',done:false,act:true},
    {l:'Service Started',   t:'Upcoming', done:false,act:false},
    {l:'Job Completed',     t:'Upcoming', done:false,act:false},
  ];
  for (let i=0;i<5;i++){
    const s=steps[i], oy=558+i*34;
    const dc = s.done?CY : s.act?OG : {r:.22,g:.22,b:.26};
    bx(f,24,oy+2,14,14,dc,1,7);
    if (s.done) await tx(f,'v',28,oy+3,8,BK,'Bold');
    if (i<4) bx(f,30,oy+16,2,20,EDGE,.7,1);
    await tx(f,s.l, 48,oy+1, 12, s.done||s.act?WH:GR, s.act?'Semi Bold':'Regular');
    await tx(f,s.t, 296,oy+1, 9, s.done?CY:GR);
  }
  CD(f,20,736,160,44,22); await tx(f,'Cancel Job',54,754,13,RD,'Semi Bold');
  bx(f,190,736,180,44,CY,1,22); await tx(f,'Rate & Review',218,754,12,BK,'Semi Bold');
  await LBL(f,'C7 / TRACKING');
  return f;
};

// C8: PROFILE & HISTORY
const C8 = async () => {
  const f = mk(custPage,3150,'C8 Profile');
  tg(f,{r:.01,g:.06,b:.18},230);
  await SB(f);
  // Avatar
  bx(f,146,44,98,98,CY,.1,49); bx(f,154,52,82,82,CY,1,41);
  await tx(f,'RM',179,82,22,BK,'Bold');
  await tx(f,'Ramprasad Mokka',108,158,17,WH,'Bold');
  await tx(f,'ramprasad@gmail.com',106,180,11,GR);
  bx(f,158,202,76,22,GN,.1,11); bx(f,158,202,76,1,GN,.3,11);
  bx(f,166,210,8,8,GN,1,4); await tx(f,'Verified',180,208,10,GN,'Semi Bold');
  // Stats row
  CD(f,20,234,350,60);
  const sts=[['12','Bookings'],['4.8','Avg Rating'],['2.4K','Points']];
  for (let i=0;i<3;i++){
    const ox=44+i*114;
    await tx(f,sts[i][0], ox,244, 18, CY,'Bold');
    await tx(f,sts[i][1], ox-2,268, 10, GR);
    if (i<2) bx(f,44+(i+1)*114-8,244,1,30,EDGE,.6);
  }
  // Tabs
  bx(f,20,308,350,38,SURF,1,18);
  bx(f,22,310,172,34,CY,1,16);
  await tx(f,'Booking History',52,318,13,BK,'Bold'); await tx(f,'Complaints',234,318,13,GR);
  // Orders
  const ords=[
    {n:'CleanMax Auto',svc:'Premium Car Wash',dt:'27 May',p:'269',s:'Completed',sc:GN},
    {n:'Swift Wash',   svc:'Basic Wash',      dt:'15 May',p:'149',s:'Completed',sc:GN},
    {n:'ProShine',     svc:'Full Detailing',  dt:'02 May',p:'699',s:'Cancelled', sc:RD},
    {n:'QuickWash',    svc:'Exterior Wash',   dt:'18 Apr',p:'99', s:'Refunded',  sc:AM},
  ];
  for (let i=0;i<4;i++){
    const o=ords[i], oy=358+i*108;
    CD(f,20,oy,350,100);
    bx(f,20,oy,350,28,SURF,.4,16);
    await tx(f,'#ORD-'+(7284-i), 28,oy+8, 10, GR);
    await tx(f,o.dt+' 2026', 262,oy+8, 10, GR);
    bx(f,32,oy+34,40,40,CY,.14,20);
    await tx(f,o.n[0], 46,oy+46, 13, CY,'Bold');
    await tx(f,o.n, 84,oy+32, 12, WH,'Semi Bold');
    await tx(f,o.svc, 84,oy+50, 10, GR);
    await BDG(f,84,oy+70,o.s,o.sc);
    await tx(f,'Rs.'+o.p, 300,oy+46, 14, WH,'Bold');
    if (o.s==='Completed'){
      bx(f,264,oy+70,82,20,CY,.1,10);
      await tx(f,'Rate + Rebook',268,oy+73,9,CY);
    }
  }
  await NAV_C(f,2);
  await LBL(f,'C8 / PROFILE');
  return f;
};

// C9: PROVIDER DETAIL
const C9 = async () => {
  const f = mk(custPage,3600,'C9 Provider Detail');
  await SB(f);
  await HDR(f,'Provider Profile');
  bx(f,0,44,W,140,{r:.01,g:.06,b:.18});
  for (let i=0;i<4;i++) bx(f,0,44+i*35,W,1,WH,.02);
  bx(f,20,108,70,70,CY,1,35); await tx(f,'CM',42,128,18,BK,'Bold');
  bx(f,16,104,78,78,CY,.2,39);
  await tx(f,'CleanMax Auto Spa',104,112,15,WH,'Bold');
  await tx(f,'* 4.9  (1.2K reviews)',104,132,11,ST);
  await tx(f,'Banjara Hills  +  1.2 km away',104,150,10,GR);
  await BDG(f,104,170,'Verified',GN); await BDG(f,162,170,'Top Rated',CY);
  CD(f,20,196,350,54);
  const pst=[['142','Jobs/mo'],['5 yrs','Experience'],['94%','Accept Rate'],['30min','Avg Time']];
  for (let i=0;i<4;i++){
    const ox=30+i*86;
    await tx(f,pst[i][0], ox,206, 14, CY,'Bold');
    await tx(f,pst[i][1], ox-2,228, 8, GR);
    if (i<3) bx(f,30+(i+1)*86-4,206,1,28,EDGE,.5);
  }
  bx(f,20,262,350,36,SURF,1,18);
  const stabs=['Packages','Reviews','Gallery'];
  for (let i=0;i<3;i++){
    const s=i===0, tw=116;
    bx(f,22+i*tw,264,tw,32,s?CY:{r:0,g:0,b:0},s?1:0,14);
    await tx(f,stabs[i], 22+i*tw+24,272, 12, s?BK:GR, s?'Semi Bold':'Regular');
  }
  await tx(f,'Select Package',20,310,14,WH,'Semi Bold');
  const ppkgs=[
    {n:'Basic Wash',d:'Exterior only',t:'30 min',p:'Rs.199',tag:''},
    {n:'Premium Wash',d:'Interior + Exterior',t:'60 min',p:'Rs.349',tag:'Best Value'},
    {n:'Full Detailing',d:'Complete care + polish',t:'3 hrs',p:'Rs.699',tag:'Popular'},
  ];
  for (let i=0;i<3;i++){
    const pk=ppkgs[i], oy=334+i*84;
    CD(f,20,oy,350,74);
    bx(f,28,oy+12,32,32,CY,.12,16); bx(f,28,oy+12,32,1,WH,.08,16);
    await tx(f,pk.n, 72,oy+12, 13, WH,'Semi Bold');
    await tx(f,pk.d+'  +  '+pk.t, 72,oy+32, 10, GR);
    if (pk.tag) await BDG(f,72,oy+52,pk.tag,CY);
    await tx(f,pk.p, 300,oy+24, 14, CY,'Bold');
    bx(f,290,oy+50,52,18,CY,.15,9); await tx(f,'Select', 296,oy+53, 9, CY);
  }
  await tx(f,'Recent Reviews',20,590,14,WH,'Semi Bold');
  await tx(f,'4.9 / 5   (1,284 reviews)',236,592,10,GR);
  for (let i=0;i<5;i++) await tx(f,'*',20+i*18,608,14,ST,'Bold');
  const revs=[
    {n:'Ramprasad M.',t:'"Excellent service, car looks brand new!"',d:'27 May'},
    {n:'Neha S.',t:'"Very professional and thorough."',d:'25 May'},
  ];
  for (let i=0;i<revs.length;i++){
    const rv=revs[i], oy=630+i*84;
    CD(f,20,oy,350,76);
    await AV(f,28,oy+14,36,rv.n[0]+rv.n[rv.n.indexOf(' ')+1],CY);
    await tx(f,rv.n, 74,oy+12, 12, WH,'Semi Bold');
    await tx(f,'* * * * *', 74,oy+30, 10, ST);
    await tx(f,rv.d, 304,oy+12, 9, GR);
    await tx(f,rv.t, 28,oy+52, 10, LG);
  }
  bx(f,0,762,W,1,EDGE,.5); bx(f,0,763,W,81,DP);
  await tx(f,'Premium Wash — Rs.349', 20,780, 11, LG);
  await BTN(f,192,770,178,'Book Now',CY);
  await LBL(f,'C9 / PROVIDER DETAIL');
  return f;
};

// C10: BOOKING CONFIRMATION
const C10 = async () => {
  const f = mk(custPage,4050,'C10 Confirmation');
  tg(f,{r:.01,g:.12,b:.08},H);
  await SB(f);
  bx(f,140,120,110,110,GN,.08,55); bx(f,148,128,94,94,GN,.12,47); bx(f,156,136,78,78,GN,1,39);
  await tx(f,'v',186,162,30,BK,'Bold');
  await tx(f,'Booking Confirmed!',86,264,20,WH,'Bold');
  await tx(f,'Your car wash is scheduled.',80,292,13,GR);
  CD(f,20,324,350,164); bx(f,20,324,350,3,GN,1,2);
  await tx(f,'Order ID: #ORD-7285',28,336,11,GR); await tx(f,'27 May 2026',280,336,10,GR);
  DIV(f,354);
  const cinfo=[
    ['Provider','CleanMax Auto Spa'],['Service','Premium Car Wash'],
    ['Time','11:00 AM — 12:00 PM'],['Address','Banjara Hills, Hyderabad'],['Amount Paid','Rs. 349'],
  ];
  for (let i=0;i<cinfo.length;i++){
    const oy=362+i*24;
    await tx(f,cinfo[i][0], 28,oy, 10, GR);
    await tx(f,cinfo[i][1], 180,oy, 10, i===4?GN:LG, i===4?'Bold':'Regular');
  }
  await tx(f,"What's Next",20,504,14,WH,'Semi Bold');
  const next=['Provider will confirm within 10 min','SMS + app notification when confirmed','Track live when provider en route','OTP to verify job start & end'];
  for (let i=0;i<4;i++){
    bx(f,20,528+i*40,20,20,CY,1,10); await tx(f,String(i+1), 27,531+i*40, 10, BK,'Bold');
    await tx(f,next[i], 50,531+i*40, 12, LG);
  }
  await BTN(f,20,696,350,'Track My Booking',CY);
  await BTN2(f,20,762,350,'Back to Home',CY);
  bx(f,130,814,130,26,SURF,1,13); await tx(f,'Share Booking',143,821,11,GR);
  await LBL(f,'C10 / CONFIRMATION');
  return f;
};

// C11: RATE & REVIEW
const C11 = async () => {
  const f = mk(custPage,4500,'C11 Rate & Review');
  await SB(f);
  await HDR(f,'Rate & Review','CleanMax Auto Spa');
  CD(f,20,88,350,68);
  bx(f,30,98,44,44,CY,1,22); await tx(f,'CM',42,114,14,BK,'Bold');
  await tx(f,'CleanMax Auto Spa', 86,98, 13, WH,'Semi Bold');
  await tx(f,'Premium Car Wash  +  27 May 2026', 86,118, 10, GR);
  await tx(f,'Order #ORD-7285  +  Rs.349', 86,136, 10, GR);
  await tx(f,'Overall Experience',20,172,14,WH,'Semi Bold');
  bx(f,20,198,350,72,SURF,1,16);
  await tx(f,'Tap to rate',154,206,11,GR);
  for (let i=0;i<5;i++){
    bx(f,42+i*62,220,48,32,i<4?ST:EDGE,.2,8);
    await tx(f,'*',57+i*62,226,18,i<4?ST:EDGE,'Bold');
  }
  await tx(f,'4 stars — Great!',146,258,11,AM,'Semi Bold');
  await tx(f,'Rate by Category',20,286,14,WH,'Semi Bold');
  const cats2=[
    {n:'Punctuality',s:5,c:GN},{n:'Service Quality',s:4,c:CY},
    {n:'Behavior',s:5,c:GN},{n:'Value for Money',s:4,c:CY},
  ];
  for (let i=0;i<cats2.length;i++){
    const oy=310+i*48;
    await tx(f,cats2[i].n, 20,oy+4, 12, LG);
    for (let j=0;j<5;j++) await tx(f,'*',180+j*34,oy,16,j<cats2[i].s?cats2[i].c:EDGE,'Bold');
    await tx(f,String(cats2[i].s)+'.0', 352,oy+4, 12, cats2[i].c,'Semi Bold');
  }
  await tx(f,'Write a Review',20,506,14,WH,'Semi Bold');
  bx(f,20,530,350,88,CARD,1,12); bx(f,20,530,350,1,WH,.05,12);
  await tx(f,'"Excellent service! The team was very professional',30,546,12,LG);
  await tx(f,'and the car looks spotless. Highly recommend."',30,566,12,LG);
  await tx(f,'Add Photos (optional)',20,632,12,GR);
  bx(f,20,654,56,56,SURF,1,12); bx(f,38,674,20,20,CY,.3,10); await tx(f,'+',44,678,14,CY,'Bold');
  bx(f,86,654,56,56,CARD,1,12); await tx(f,'IMG',104,676,10,GR);
  bx(f,152,654,56,56,CARD,1,12); await tx(f,'IMG',170,676,10,GR);
  await tx(f,'Tip (optional)',20,726,12,GR);
  const tips=['Skip','Rs.20','Rs.50','Rs.100'];
  for (let i=0;i<4;i++){
    const s=i===2;
    bx(f,20+i*84,748,76,28,s?GN:SURF,1,14);
    await tx(f,tips[i], 20+i*84+18,758, 10, s?BK:LG, s?'Semi Bold':'Regular');
  }
  await BTN(f,20,792,350,'Submit Review',GN,WH);
  await LBL(f,'C11 / RATE & REVIEW');
  return f;
};

// C12: MY BOOKINGS
const C12 = async () => {
  const f = mk(custPage,4950,'C12 My Bookings');
  await SB(f);
  await tx(f,'My Bookings',20,50,20,WH,'Bold');
  bx(f,20,82,350,36,SURF,1,18);
  const btabs=['Upcoming','Ongoing','Completed','Cancelled'];
  for (let i=0;i<4;i++){
    const s=i===2, tw=87;
    bx(f,22+i*tw,84,tw,32,s?CY:{r:0,g:0,b:0},s?1:0,14);
    await tx(f,btabs[i], 22+i*tw+8,92, 10, s?BK:GR, s?'Semi Bold':'Regular');
  }
  let bfx=20;
  const bfilt=['All Time','This Month','Rated','Unrated'];
  for (let i=0;i<bfilt.length;i++){
    const fw=bfilt[i].length*7+16, s=i===1;
    bx(f,bfx,126,fw,26,s?CY:SURF,1,13);
    if (!s) bx(f,bfx,126,fw,1,WH,.04,13);
    await tx(f,bfilt[i], bfx+6,131, 9, s?BK:LG, s?'Semi Bold':'Regular');
    bfx+=fw+6;
  }
  const bkgs=[
    {id:'7285',prov:'CleanMax Auto Spa',svc:'Premium Car Wash',dt:'27 May  +  11:00 AM',p:'Rs.349',s:'Completed',sc:GN,c:CY},
    {id:'7280',prov:'Swift Wash & Care',svc:'Basic Wash',dt:'15 May  +  10:00 AM',p:'Rs.149',s:'Completed',sc:GN,c:GN},
    {id:'7274',prov:'ProShine Detailing',svc:'Full Detailing',dt:'02 May  +  2:00 PM',p:'Rs.699',s:'Cancelled',sc:RD,c:OG},
    {id:'7268',prov:'QuickWash Express',svc:'Exterior Wash',dt:'18 Apr  +  9:00 AM',p:'Rs.99',s:'Completed',sc:GN,c:PK},
    {id:'7261',prov:'CleanMax Auto Spa',svc:'Basic Wash',dt:'05 Apr  +  11:30 AM',p:'Rs.199',s:'Refunded',sc:AM,c:CY},
  ];
  for (let i=0;i<bkgs.length;i++){
    const b=bkgs[i], oy=162+i*118;
    CD(f,20,oy,350,108);
    bx(f,20,oy,350,30,SURF,.4,16);
    await tx(f,'#ORD-'+b.id, 28,oy+8, 10, GR);
    await BDG(f,260,oy+6,b.s,b.sc);
    bx(f,30,oy+38,44,44,b.c,.18,22); bx(f,32,oy+40,40,40,b.c,.2,20);
    await tx(f,b.prov[0], 46,oy+52, 14, b.c,'Bold');
    await tx(f,b.prov, 86,oy+34, 12, WH,'Semi Bold');
    await tx(f,b.svc, 86,oy+52, 10, GR);
    await tx(f,b.dt, 86,oy+70, 9, GR);
    await tx(f,b.p, 296,oy+52, 14, WH,'Bold');
    bx(f,86,oy+86,76,16,b.s==='Cancelled'?RD:CY,.1,8);
    await tx(f,b.s==='Cancelled'?'Rebook':'Rate & Review', 90,oy+89, 9, b.s==='Cancelled'?RD:CY);
    if (b.s==='Completed'){ bx(f,172,oy+86,60,16,GN,.1,8); await tx(f,'Rebook',176,oy+89,9,GN); }
  }
  await NAV_C(f,2);
  await LBL(f,'C12 / MY BOOKINGS');
  return f;
};

// C13: NOTIFICATIONS
const C13 = async () => {
  const f = mk(custPage,5400,'C13 Notifications');
  await SB(f);
  await tx(f,'Notifications',20,50,20,WH,'Bold');
  bx(f,280,46,80,28,CY,.15,14); await tx(f,'Mark All Read',284,54,9,CY);
  await tx(f,'Today',20,92,12,GR,'Semi Bold');
  const notifs=[
    {t:'Booking Confirmed',b:'CleanMax Auto Spa accepted your booking for 11:00 AM',dt:'2 min ago',c:GN,dot:true},
    {t:'Payment Successful',b:'Rs.349 paid via UPI for Order #ORD-7285',dt:'5 min ago',c:CY,dot:true},
    {t:'Special Offer',b:'30% off on Full Detailing this weekend — Code: CLEAN30',dt:'1 hr ago',c:OG,dot:false},
    {t:'Rate Your Experience',b:'How was your last wash with Swift Wash & Care?',dt:'2 hrs ago',c:ST,dot:false},
  ];
  for (let i=0;i<notifs.length;i++){
    const n=notifs[i], oy=112+i*102;
    CD(f,20,oy,350,92);
    bx(f,28,oy+16,42,42,n.c,.15,21); bx(f,30,oy+18,38,38,n.c,.2,19);
    if (n.dot){ bx(f,352,oy+8,10,10,CY,1,5); }
    await tx(f,n.t, 82,oy+14, 13, WH,'Semi Bold');
    await tx(f,n.b.substring(0,50)+(n.b.length>50?'...':''), 82,oy+34, 10, GR);
    await tx(f,n.dt, 272,oy+14, 9, GR);
  }
  await tx(f,'Earlier',20,526,12,GR,'Semi Bold');
  const old2=[
    {t:'Provider En Route',b:'Suresh Kumar is 8 min away from your location',c:BL},
    {t:'Job Completed',b:'Car wash with CleanMax done. OTP verified.',c:GN},
    {t:'Promo Expiring',b:'FIRST30 expires in 2 days — use before it\'s gone!',c:AM},
  ];
  for (let i=0;i<old2.length;i++){
    const n=old2[i], oy=546+i*82;
    bx(f,20,oy,350,72,{r:.09,g:.09,b:.11},1,14); bx(f,20,oy,350,1,WH,.03,14);
    bx(f,28,oy+14,36,36,n.c,.12,18); bx(f,30,oy+16,32,32,n.c,.15,16);
    await tx(f,n.t, 76,oy+12, 12, GR,'Semi Bold');
    await tx(f,n.b.substring(0,48)+(n.b.length>48?'...':''), 76,oy+30, 10, GR);
  }
  await NAV_C(f,3);
  await LBL(f,'C13 / NOTIFICATIONS');
  return f;
};

// C14: WALLET & PROMOS
const C14 = async () => {
  const f = mk(custPage,5850,'C14 Wallet & Promos');
  await SB(f);
  await HDR(f,'Wallet & Promos');
  bx(f,20,88,350,112,{r:.01,g:.06,b:.20},1,20); bx(f,20,88,350,112,WH,.03,20);
  bx(f,20,88,350,3,CY,.8,2);
  for (let i=0;i<4;i++) bx(f,20+i*90,88,1,112,WH,.04);
  await tx(f,'ServiCo Wallet',30,100,12,GR);
  await tx(f,'Rs. 2,450',30,122,28,CY,'Bold');
  await tx(f,'Available Balance',30,160,10,GR);
  bx(f,248,108,106,30,CY,.15,15); await tx(f,'Add Money  +',254,116,11,CY,'Semi Bold');
  bx(f,248,148,106,30,GN,.1,15); await tx(f,'Cash Out',268,156,11,GN);
  CD(f,20,212,350,52); bx(f,20,212,350,3,AM,.7,2);
  bx(f,30,224,28,28,AM,.2,14);
  await tx(f,'*',38,228,14,AM,'Bold');
  await tx(f,'2,400 Reward Points  =  Rs.24 value',68,230,12,WH,'Semi Bold');
  await tx(f,'Use at checkout',68,248,10,GR);
  await tx(f,'Redeem ->',298,230,10,AM,'Semi Bold');
  await tx(f,'Available Coupons',20,278,14,WH,'Semi Bold');
  await tx(f,'4 active',316,280,10,GR);
  const promos=[
    {code:'FIRST30',d:'30% off on first booking',exp:'Expires: 31 May 2026',max:'Max Rs.150',c:CY},
    {code:'CLEAN50',d:'Flat Rs.50 off on Premium Wash',exp:'Expires: 15 Jun 2026',max:'Min order Rs.299',c:GN},
    {code:'WEEKEND20',d:'20% off every Saturday & Sunday',exp:'Expires: 30 Jun 2026',max:'Max Rs.100',c:OG},
    {code:'REFERRAL100',d:'Rs.100 for each referral booking',exp:'No expiry',max:'Per referral',c:PK},
  ];
  for (let i=0;i<promos.length;i++){
    const pr=promos[i], oy=302+i*112;
    CD(f,20,oy,350,104); bx(f,20,oy,350,3,pr.c,1,2);
    bx(f,28,oy+12,66,30,pr.c,.15,8); await tx(f,pr.code, 30,oy+19, 9, pr.c,'Bold');
    await tx(f,pr.d, 106,oy+14, 12, WH,'Semi Bold');
    await tx(f,pr.exp, 106,oy+34, 10, GR);
    await tx(f,pr.max, 106,oy+52, 10, GR);
    bx(f,250,oy+70,100,24,pr.c,.15,12);
    await tx(f,'Apply Coupon', 256,oy+75, 9, pr.c,'Semi Bold');
  }
  await NAV_C(f,4);
  await LBL(f,'C14 / WALLET & PROMOS');
  return f;
};


// C15: ONBOARDING SPLASH
const C15 = async () => {
  const f = mk(custPage,6300,'C15 Onboarding');
  tg(f,{r:.01,g:.06,b:.22},H);
  bx(f,0,0,W,H,{r:.01,g:.03,b:.12}); tg(f,{r:.01,g:.06,b:.22},H);
  // Circles deco
  bx(f,195,60,180,180,CY,.05,90); bx(f,215,80,140,140,CY,.07,70);
  bx(f,235,100,100,100,CY,1,50);
  await tx(f,'S',272,132,38,BK,'Bold');
  await tx(f,'ServiCo',108,222,30,WH,'Bold');
  await tx(f,'Your city. Your doorstep.',86,262,16,GR);
  await tx(f,'Car Wash  •  AC Repair  •  Tyre Fix  •  Detailing',40,294,11,GR);
  // Slide dots
  for (let i=0;i<3;i++) bx(f,172+i*24,344,i===0?28:8,8,i===0?CY:EDGE,.8,4);
  // Feature cards
  const feats=[
    {t:'Instant Booking',d:'Schedule in under 60 seconds',c:CY,y:370},
    {t:'Doorstep Service',d:'Certified pros come to you',c:GN,y:450},
    {t:'100% Safe & Tracked',d:'Live GPS, OTP, insured jobs',c:OG,y:530},
  ];
  for (const ft of feats){
    CD(f,30,ft.y,330,70);
    bx(f,40,ft.y+14,42,42,ft.c,.15,21); bx(f,42,ft.y+16,38,38,ft.c,.2,19);
    await tx(f,ft.t, 96,ft.y+16, 14, WH,'Semi Bold');
    await tx(f,ft.d, 96,ft.y+36, 11, GR);
  }
  await BTN(f,20,626,350,'Get Started',CY);
  await BTN2(f,20,692,350,'I already have an account',CY);
  bx(f,130,750,130,24,{r:0,g:0,b:0},0);
  await tx(f,'By continuing you agree to our Terms & Privacy',50,758,9,GR);
  await LBL(f,'C15 / ONBOARDING');
  return f;
};

// C16: OTP LOGIN
const C16 = async () => {
  const f = mk(custPage,6750,'C16 OTP Login');
  tg(f,NV,300); await SB(f);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  await tx(f,'Verify Mobile',62,48,16,WH,'Bold');
  await tx(f,'OTP sent to +91 98765 43210',62,68,10,GR);
  bx(f,146,118,98,98,CY,.08,49); bx(f,154,126,82,82,CY,.12,41); bx(f,162,134,66,66,CY,.15,33);
  await tx(f,'OTP',174,158,18,CY,'Bold');
  await tx(f,'Enter 6-digit OTP',110,246,14,WH,'Semi Bold');
  await tx(f,'Valid for 10 minutes',124,268,11,GR);
  const d6=['9','2','4','_','_','_'];
  for (let i=0;i<6;i++){
    const sel=i===3, fil=i<3;
    bx(f,18+i*60,296,52,60,sel?CY:fil?CARD:SURF,1,12);
    if (sel) bx(f,19+i*60,297,50,58,NV,1,11);
    else if (!fil) bx(f,19+i*60,297,50,58,SURF,.5,11);
    await tx(f,d6[i], 36+i*60,312, 22, sel?CY:fil?WH:GR,'Bold');
  }
  bx(f,18,366,352,2,CY,.3,1);
  await tx(f,'Resend OTP in',114,376,12,GR);
  await tx(f,'0:42',220,376,12,AM,'Semi Bold');
  // Number pad
  const kn=['1','2','3','4','5','6','7','8','9','*','0','<'];
  for (let i=0;i<12;i++){
    const col=i%3, rw=Math.floor(i/3);
    const ox=36+col*108, oy=410+rw*68;
    bx(f,ox,oy,96,56,i===11?{r:.18,g:.04,b:.04}:SURF,.6,14);
    if (i<11&&i!==9) bx(f,ox,oy,96,1,WH,.04,14);
    await tx(f,kn[i], ox+36,oy+18, 17, i===11?RD:i===9?GR:WH, i<3?'Bold':'Regular');
  }
  await BTN(f,20,686,350,'Verify OTP',CY);
  bx(f,20,754,350,36,GN,.07,10); bx(f,20,754,350,1,GN,.2,10);
  await tx(f,'Your number is only used for verification purposes',52,765,10,GN);
  await LBL(f,'C16 / OTP LOGIN');
  return f;
};

// C17: FORGOT PASSWORD
const C17 = async () => {
  const f = mk(custPage,7200,'C17 Forgot Password');
  tg(f,NV,350); await SB(f);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  await tx(f,'Reset Password',62,48,16,WH,'Bold');
  bx(f,140,104,110,110,CY,.07,55); bx(f,150,114,90,90,CY,.1,45); bx(f,160,124,70,70,CY,.14,35);
  await tx(f,'?',187,146,28,CY,'Bold');
  await tx(f,'Forgot your password?',68,242,18,WH,'Bold');
  await tx(f,'Enter your mobile number and we\'ll send',52,270,12,GR);
  await tx(f,'a reset link to your registered email.',70,288,12,GR);
  await INP(f,20,322,350,'Registered Mobile Number','+91  98765 43210',CY);
  // Method options
  await tx(f,'Reset via',20,390,12,GR,'Semi Bold');
  const methods=[{n:'OTP on Mobile',c:CY,s:true},{n:'Link on Email',c:BL,s:false}];
  for (let i=0;i<2;i++){
    const m=methods[i], ox=20+i*178;
    bx(f,ox,414,164,52,m.s?CY:CARD,m.s?1:.8,14);
    if (m.s) bx(f,ox+1,415,162,50,NV,1,13);
    else bx(f,ox,414,164,1,WH,.05,14);
    bx(f,ox+16,430,20,20,m.c,m.s?1:.3,10);
    await tx(f,m.n, ox+44,430, 12, m.s?m.c:LG, m.s?'Semi Bold':'Regular');
  }
  await BTN(f,20,484,350,'Send Reset OTP',CY);
  // Steps
  await tx(f,'How it works',20,554,13,WH,'Semi Bold');
  const rsteps=['Enter your registered mobile','Receive OTP in 30 seconds','Enter OTP on next screen','Create your new password'];
  for (let i=0;i<4;i++){
    bx(f,20,576+i*44,20,20,i===0?CY:SURF,1,10);
    await tx(f,String(i+1), 27,579+i*44, 10, i===0?BK:GR,'Bold');
    await tx(f,rsteps[i], 50,579+i*44, 12, i===0?WH:GR);
    if (i<3) bx(f,29,596+i*44,2,26,EDGE,.5,1);
  }
  await tx(f,'Remember password?',98,760,12,GR);
  await tx(f,'Login here',220,760,12,CY,'Semi Bold');
  await LBL(f,'C17 / FORGOT PASSWORD');
  return f;
};

// C18: SERVICE CATEGORY BROWSE
const C18 = async () => {
  const f = mk(custPage,7650,'C18 Browse Services');
  await SB(f); await tx(f,'All Services',20,50,20,WH,'Bold');
  bx(f,20,82,350,40,SURF,1,14); bx(f,20,82,350,1,WH,.05,14);
  await tx(f,'Search services...',38,98,12,GR);
  bx(f,324,86,36,32,CY,.12,10); await tx(f,'mic',330,96,9,CY,'Semi Bold');
  const allCats=[
    {n:'Car Wash',cnt:'24 providers',c:CY},   {n:'AC Repair',cnt:'18 providers',c:OG},
    {n:'Tyre Fix',cnt:'31 providers',c:GN},   {n:'Full Detailing',cnt:'12 providers',c:PK},
    {n:'Engine Check',cnt:'9 providers',c:AM}, {n:'Deep Cleaning',cnt:'22 providers',c:BL},
    {n:'Dent Repair',cnt:'7 providers',c:RD},  {n:'Battery',cnt:'15 providers',c:ST},
    {n:'Windshield',cnt:'11 providers',c:CY},  {n:'Oil Change',cnt:'28 providers',c:OG},
    {n:'Brake Service',cnt:'14 providers',c:GN},{n:'Paint Repair',cnt:'6 providers',c:PK},
  ];
  for (let i=0;i<allCats.length;i++){
    const col=i%2, rw=Math.floor(i/2);
    const ox=20+col*178, oy=134+rw*104;
    CD(f,ox,oy,164,94);
    bx(f,ox+14,oy+12,52,52,allCats[i].c,.12,26); bx(f,ox+16,oy+14,48,48,allCats[i].c,.18,24);
    await tx(f,allCats[i].n.substring(0,2), ox+30,oy+26, 16, allCats[i].c,'Bold');
    await tx(f,allCats[i].n, ox+74,oy+22, 12, WH,'Semi Bold');
    await tx(f,allCats[i].cnt, ox+74,oy+42, 10, GR);
    await BDG(f,ox+74,oy+60,'Book Now',allCats[i].c);
  }
  await NAV_C(f,1);
  await LBL(f,'C18 / BROWSE SERVICES');
  return f;
};

// C19: BOOKING DETAIL
const C19 = async () => {
  const f = mk(custPage,8100,'C19 Booking Detail');
  await SB(f);
  await HDR(f,'Booking Detail','Order #ORD-7285');
  // Status banner
  bx(f,20,88,350,48,GN,.08,14); bx(f,20,88,350,2,GN,.6,2);
  bx(f,32,102,16,16,GN,1,8); await tx(f,'Completed — 27 May 2026, 12:04 PM',58,102,12,GN,'Semi Bold');
  // Provider
  CD(f,20,148,350,88);
  bx(f,30,160,50,50,CY,1,25); await tx(f,'CM',44,178,14,BK,'Bold');
  await tx(f,'CleanMax Auto Spa', 92,160, 14, WH,'Bold');
  await tx(f,'* 4.9  (1.2K reviews)', 92,180, 11, ST);
  await tx(f,'Suresh Kumar  •  Car Wash Specialist', 92,198, 10, GR);
  bx(f,272,164,36,36,CY,.12,18); await tx(f,'Call',280,176,10,CY);
  bx(f,314,164,36,36,BL,.12,18); await tx(f,'Chat',322,176,10,BL);
  // Timeline
  await tx(f,'Job Timeline',20,250,14,WH,'Semi Bold');
  const timeline=[
    {e:'Booking Confirmed',t:'10:58 AM',d:true},{e:'Provider En Route',t:'11:02 AM',d:true},
    {e:'Arrived at Location',t:'11:14 AM',d:true},{e:'Job Started',t:'11:22 AM (OTP 4821)',d:true},
    {e:'Job Completed',t:'12:04 PM (OTP 9312)',d:true},
  ];
  for (let i=0;i<timeline.length;i++){
    const tl=timeline[i], oy=276+i*46;
    bx(f,24,oy+3,14,14,tl.d?GN:EDGE,1,7);
    if (tl.d) await tx(f,'v',28,oy+4,8,BK,'Bold');
    if (i<4) bx(f,30,oy+17,2,32,EDGE,.5,1);
    await tx(f,tl.e, 50,oy+2, 12, WH,'Semi Bold');
    await tx(f,tl.t, 252,oy+2, 9, GR);
  }
  // Bill breakdown
  await tx(f,'Payment Summary',20,520,14,WH,'Semi Bold');
  CD(f,20,544,350,128);
  const bill=[['Premium Car Wash','Rs.349'],['Platform Fee','Rs.25'],['Promo (FIRST30)','-Rs.105'],['Total Paid','Rs.269']];
  for (let i=0;i<bill.length;i++){
    const oy=558+i*28;
    if (i===3) bx(f,20,558+i*28-4,350,1,EDGE,.5);
    await tx(f,bill[i][0], 30,oy, 11, i===3?WH:GR, i===3?'Semi Bold':'Regular');
    await tx(f,bill[i][1], 310-bill[i][1].length*6.5,oy, i===3?14:11, i===2?GN:i===3?CY:LG, i>=2?'Bold':'Regular');
  }
  await tx(f,'Paid via UPI — Google Pay  •  Transaction #GPA.8271', 28,676, 9, GR);
  // Actions
  bx(f,20,700,165,52,SURF,1,26);
  await tx(f,'Download Receipt',28,718,12,LG);
  bx(f,199,700,171,52,CY,1,26); bx(f,200,701,169,1,WH,.2,25);
  await tx(f,'Book Again',250,718,13,BK,'Bold');
  bx(f,20,764,350,52,{r:.16,g:.06,b:.04},1,26);
  await tx(f,'Report an Issue with this Booking',82,782,13,RD);
  await LBL(f,'C19 / BOOKING DETAIL');
  return f;
};

// C20: LIVE CHAT
const C20 = async () => {
  const f = mk(custPage,8550,'C20 Live Chat');
  await SB(f);
  bx(f,0,32,W,60,SURF); bx(f,0,32,W,1,EDGE,.5);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  bx(f,62,48,36,36,CY,1,18); await tx(f,'SK',70,58,10,BK,'Bold');
  bx(f,48,76,10,10,GN,1,5);
  await tx(f,'Suresh Kumar',106,46,13,WH,'Bold');
  await tx(f,'Online  •  En Route to you',106,64,10,GN,'Semi Bold');
  bx(f,308,46,60,26,OG,.12,13); await tx(f,'Track',318,53,10,OG,'Semi Bold');
  // Messages
  const msgs=[
    {t:'Hello! I\'m Suresh, your car wash specialist.',from:'prov',tm:'11:00 AM'},
    {t:'I\'ve accepted your booking. Starting in 15 min.',from:'prov',tm:'11:01 AM'},
    {t:'Great! Please be careful with the dashboard.',from:'cust',tm:'11:02 AM'},
    {t:'Sure, will handle with extra care!',from:'prov',tm:'11:02 AM'},
    {t:'Also can you check the tyre pressure?',from:'cust',tm:'11:04 AM'},
    {t:'Of course, included in Premium package.',from:'prov',tm:'11:05 AM'},
    {t:'I\'m 8 minutes away. See you soon!',from:'prov',tm:'11:10 AM'},
    {t:'Perfect, I\'m at home. Gate is open.',from:'cust',tm:'11:11 AM'},
  ];
  let cy2=108;
  for (const m of msgs){
    const isp=m.from==='prov';
    const maxw=240, bw=Math.min(maxw, m.t.length*6.8+24);
    const bx2=isp?20:W-20-bw;
    bx(f,bx2,cy2,bw,40,isp?CARD:CY,1,16);
    await tx(f,m.t, bx2+10,cy2+12, 11, isp?LG:BK);
    await tx(f,m.tm, bx2+(isp?0:bw-42),cy2+44, 9, GR);
    cy2+=62;
  }
  // Quick replies
  bx(f,0,596,W,1,EDGE,.3);
  const qr=['On my way!','Thanks!','ETA?','Please hurry'];
  let qrx=14;
  for (const q of qr){
    const qw=q.length*7+16;
    bx(f,qrx,604,qw,28,SURF,1,14); bx(f,qrx,604,qw,1,WH,.05,14);
    await tx(f,q, qrx+7,610, 10, LG);
    qrx+=qw+8;
  }
  // Input bar
  bx(f,0,H-80,W,80,DP); bx(f,0,H-80,W,1,EDGE,.5);
  bx(f,12,H-62,276,44,CARD,1,22); bx(f,12,H-62,276,1,WH,.05,22);
  await tx(f,'Type a message...', 28,H-46, 12, GR);
  bx(f,296,H-62,36,44,SURF,1,18); await tx(f,'Att',304,H-48,9,GR);
  bx(f,338,H-62,36,44,CY,1,22); await tx(f,'>',349,H-48,14,BK,'Bold');
  await LBL(f,'C20 / LIVE CHAT');
  return f;
};

// C21: ADDRESS BOOK
const C21 = async () => {
  const f = mk(custPage,9000,'C21 Address Book');
  await SB(f);
  await HDR(f,'Saved Addresses');
  bx(f,286,46,80,30,CY,.15,15); await tx(f,'+ Add New',292,54,9,CY,'Semi Bold');
  const addrs=[
    {tag:'Home',addr:'Flat 4B, Sai Towers, Road No.12, Banjara Hills',city:'Hyderabad - 500034',c:GN,def:true},
    {tag:'Office',addr:'Plot 41, Cyber Gateway, Hitech City',city:'Hyderabad - 500081',c:BL,def:false},
    {tag:'Parents',addr:'H.No 7-2-180, Santosh Nagar Colony',city:'Hyderabad - 500059',c:OG,def:false},
  ];
  for (let i=0;i<addrs.length;i++){
    const a=addrs[i], oy=88+i*154;
    CD(f,20,oy,350,140); bx(f,20,oy,4,140,a.c,1,2);
    bx(f,30,oy+14,38,38,a.c,.15,19); bx(f,32,oy+16,34,34,a.c,.2,17);
    await tx(f,a.tag[0], 44,oy+26, 12, a.c,'Bold');
    await tx(f,a.tag, 80,oy+14, 13, WH,'Bold');
    if (a.def){ bx(f,80,oy+34,70,18,GN,.12,9); await tx(f,'Default',84,oy+37,9,GN,'Semi Bold'); }
    await tx(f,a.addr, 30,oy+62, 11, LG);
    await tx(f,a.city, 30,oy+82, 10, GR);
    bx(f,30,oy+106,350-40,1,EDGE,.4);
    bx(f,30,oy+116,60,16,CY,.1,8); await tx(f,'Edit',36,oy+119,9,CY);
    bx(f,100,oy+116,60,16,RD,.1,8); await tx(f,'Delete',106,oy+119,9,RD);
    if (!a.def){ bx(f,170,oy+116,90,16,GN,.1,8); await tx(f,'Set Default',174,oy+119,9,GN); }
  }
  // Add address form teaser
  bx(f,20,558,350,56,{r:.09,g:.09,b:.11},1,16); bx(f,20,558,350,1,WH,.03,16);
  bx(f,32,568,36,36,CY,.12,18); await tx(f,'+',44,580,16,CY,'Bold');
  await tx(f,'Add New Address', 80,570, 13, WH,'Semi Bold');
  await tx(f,'Work, gym, parents, or any custom location', 80,590, 10, GR);
  await NAV_C(f,4);
  await LBL(f,'C21 / ADDRESS BOOK');
  return f;
};

// C22: VEHICLE MANAGER
const C22 = async () => {
  const f = mk(custPage,9450,'C22 My Vehicles');
  await SB(f);
  await HDR(f,'My Vehicles');
  bx(f,286,46,80,30,OG,.15,15); await tx(f,'+ Add Car',292,54,9,OG,'Semi Bold');
  const vehicles=[
    {make:'Maruti Swift Dzire',year:'2022',color:'Pearl White',plate:'TS 09 AB 1234',type:'Sedan',c:CY,default:true},
    {make:'Honda City',year:'2019',color:'Sporty Blue',plate:'TS 07 CD 5678',type:'Sedan',c:BL,default:false},
    {make:'Hyundai Creta',year:'2023',color:'Phantom Black',plate:'TS 11 EF 9012',type:'SUV',c:GR,default:false},
  ];
  for (let i=0;i<vehicles.length;i++){
    const v=vehicles[i], oy=88+i*176;
    CD(f,20,oy,350,162); bx(f,20,oy,350,3,v.c,1,2);
    // Car silhouette placeholder
    bx(f,26,oy+18,96,68,v.c,.1,12); bx(f,28,oy+20,92,64,v.c,.12,10);
    bx(f,36,oy+36,76,24,v.c,.2,6);
    bx(f,34,oy+52,14,14,{r:.1,g:.1,b:.15},1,7); bx(f,36,oy+54,10,10,GR,.3,5);
    bx(f,80,oy+52,14,14,{r:.1,g:.1,b:.15},1,7); bx(f,82,oy+54,10,10,GR,.3,5);
    await tx(f,v.make, 136,oy+18, 14, WH,'Bold');
    await tx(f,v.year+'  •  '+v.color, 136,oy+38, 11, GR);
    await tx(f,v.plate, 136,oy+58, 13, CY,'Semi Bold');
    await BDG(f,136,oy+78,v.type,v.c);
    if (v.default){ await BDG(f,136+v.type.length*6.5+36,oy+78,'Primary',GN); }
    bx(f,30,oy+112,350-50,1,EDGE,.4);
    bx(f,30,oy+124,72,26,CY,.1,13); await tx(f,'Edit',46,oy+129,10,CY);
    bx(f,112,oy+124,72,26,RD,.1,13); await tx(f,'Remove',118,oy+129,10,RD);
    if (!v.default){ bx(f,194,oy+124,102,26,GN,.1,13); await tx(f,'Set Primary',198,oy+129,10,GN); }
  }
  await NAV_C(f,4);
  await LBL(f,'C22 / MY VEHICLES');
  return f;
};

// C23: REFERRAL PROGRAM
const C23 = async () => {
  const f = mk(custPage,9900,'C23 Referrals');
  tg(f,{r:.02,g:.08,b:.20},300);
  await SB(f);
  await HDR(f,'Refer & Earn');
  // Hero
  bx(f,140,88,110,110,PK,.07,55); bx(f,150,98,90,90,PK,.1,45); bx(f,160,108,70,70,PK,1,35);
  await tx(f,'Rs',178,132,18,WH,'Bold');
  await tx(f,'Earn Rs.100 per referral!',60,224,17,WH,'Bold');
  await tx(f,'For every friend who books their first service',42,248,11,GR);
  // Your referral code
  CD(f,20,278,350,72); bx(f,20,278,350,3,PK,1,2);
  await tx(f,'Your Referral Code',28,290,11,GR);
  bx(f,28,308,220,32,{r:.14,g:.10,b:.24},1,8); bx(f,28,308,220,1,PK,.3,8);
  await tx(f,'SAKET2026',46,318,18,PK,'Bold');
  bx(f,258,308,102,32,PK,1,16); await tx(f,'Copy Code',270,318,11,BK,'Bold');
  // Stats
  const rstats=[['8','Friends Referred'],['Rs.800','Total Earned'],['3','Pending']];
  for (let i=0;i<3;i++){
    const ox=20+i*118;
    CD(f,ox,362,108,64); bx(f,ox,362,108,3,PK,.6,2);
    await tx(f,rstats[i][0], ox+16,374, 18, PK,'Bold');
    await tx(f,rstats[i][1], ox+8,404, 9, GR);
  }
  // How it works
  await tx(f,'How it works',20,440,14,WH,'Semi Bold');
  const rw=['Share your code with friends','Friend uses code on first booking','Both of you earn Rs.100 instantly','No limit — refer as many as you want'];
  for (let i=0;i<4;i++){
    bx(f,20,462+i*54,350,46,i%2===0?CARD:SURF,1,12);
    bx(f,20,462+i*54,350,1,WH,.04,12);
    bx(f,32,470+i*54,22,22,PK,1,11);
    await tx(f,String(i+1),39,474+i*54,10,BK,'Bold');
    await tx(f,rw[i], 66,472+i*54, 12, LG);
  }
  // Share button
  await BTN(f,20,686,350,'Share Your Code',PK,WH);
  bx(f,20,752,350,48,SURF,1,24); bx(f,20,752,350,1,WH,.05,24);
  await tx(f,'Share via:',34,768,11,GR);
  const shares=['WhatsApp','SMS','Email','More'];
  for (let i=0;i<4;i++) await tx(f,shares[i], 106+i*60,768, 10, CY,'Semi Bold');
  await LBL(f,'C23 / REFERRALS');
  return f;
};

// C24: SUBSCRIPTION PLANS
const C24 = async () => {
  const f = mk(custPage,10350,'C24 Subscription');
  tg(f,{r:.08,g:.04,b:.18},300);
  await SB(f);
  await HDR(f,'ServiCo+','Premium Membership');
  bx(f,20,88,350,104,{r:.08,g:.04,b:.18},1,20); bx(f,20,88,350,104,WH,.03,20);
  bx(f,20,88,350,3,PK,.9,2);
  bx(f,140,100,30,30,PK,.15,15); bx(f,142,102,26,26,PK,1,13);
  await tx(f,'*',149,108,12,BK,'Bold');
  await tx(f,'You\'re on Free Plan',178,102,13,WH,'Bold');
  await tx(f,'0 active subscriptions  •  12 total bookings',178,122,10,GR);
  bx(f,178,142,96,26,PK,.15,13); await tx(f,'Upgrade Now',184,150,10,PK,'Semi Bold');
  // Plans
  await tx(f,'Choose Your Plan',20,208,14,WH,'Semi Bold');
  const plans=[
    {n:'Basic',p:'Free',t:'/always',f:['5% cashback','Standard support','No ads'],c:GR,pop:false},
    {n:'Gold',p:'Rs.199',t:'/month',f:['15% cashback','2 free washes/mo','Priority support','Exclusive deals'],c:AM,pop:true},
    {n:'Platinum',p:'Rs.399',t:'/month',f:['25% cashback','4 free washes/mo','Dedicated manager','Early access features'],c:PK,pop:false},
  ];
  for (let i=0;i<plans.length;i++){
    const pl=plans[i], oy=234+i*170;
    if (pl.pop){ bx(f,19,oy-2,352,168,AM,1,18); bx(f,20,oy-1,350,166,NV,1,17); }
    else CD(f,20,oy,350,162);
    bx(f,20,oy,350,3,pl.c,1,2);
    if (pl.pop){ bx(f,248,oy+8,86,22,AM,.2,11); await tx(f,'Most Popular',252,oy+12,8,AM,'Bold'); }
    await tx(f,pl.n, 30,oy+14, 16, WH,'Bold');
    await tx(f,pl.p, 30,oy+38, 26, pl.c,'Bold');
    await tx(f,pl.t, 30+pl.p.length*10,oy+50, 10, GR);
    for (let j=0;j<pl.f.length;j++){
      bx(f,30,oy+72+j*20,8,8,pl.c,1,4);
      await tx(f,pl.f[j], 46,oy+70+j*20, 10, LG);
    }
    await BTN(f,210,oy+108,120,i===0?'Current':i===1?'Subscribe':'Select',pl.c,i===0?LG:BK);
  }
  await LBL(f,'C24 / SUBSCRIPTION');
  return f;
};

// C25: APP SETTINGS
const C25 = async () => {
  const f = mk(custPage,10800,'C25 Settings');
  await SB(f);
  await HDR(f,'Settings');
  const sGroups=[
    {grp:'Account',items:[
      {t:'Edit Profile',s:'Ramprasad Mokka'},
      {t:'Change Password',s:'Last changed 90 days ago'},
      {t:'Linked Accounts',s:'Google  •  Phone verified'},
    ]},
    {grp:'Notifications',items:[
      {t:'Push Notifications',s:'toggle:on'},
      {t:'SMS Alerts',s:'toggle:on'},
      {t:'Promotional Emails',s:'toggle:off'},
      {t:'Booking Reminders',s:'toggle:on'},
    ]},
    {grp:'Preferences',items:[
      {t:'Language',s:'English (India)'},
      {t:'Currency',s:'INR — Indian Rupee'},
      {t:'Distance Unit',s:'Kilometres'},
    ]},
    {grp:'Privacy & Security',items:[
      {t:'Two-Factor Auth',s:'toggle:on'},
      {t:'Location Sharing',s:'While using app'},
      {t:'Data & Analytics',s:'toggle:off'},
    ]},
    {grp:'Support',items:[
      {t:'Help & FAQ',s:'24x7 chat support'},
      {t:'Report a Bug',s:'Version 3.2.1'},
      {t:'Rate the App',s:'on App Store / Play Store'},
    ]},
  ];
  let oy2=88;
  for (const sg of sGroups){
    await tx(f,sg.grp, 20,oy2, 11, CY,'Semi Bold');
    oy2+=20;
    for (const it of sg.items){
      bx(f,20,oy2,350,52,CARD,1,12); bx(f,20,oy2,350,1,WH,.05,12);
      await tx(f,it.t, 32,oy2+12, 13, WH,'Semi Bold');
      if (it.s.startsWith('toggle:')){
        const on=it.s.endsWith('on');
        bx(f,290,oy2+16,48,20,on?GN:EDGE,1,10);
        bx(f,on?314:294,oy2+18,16,16,WH,1,8);
        await tx(f,on?'On':'Off', 296,oy2+30, 8, GR);
      } else {
        await tx(f,it.s, 32,oy2+32, 10, GR);
        await tx(f,'->',330,oy2+18,13,GR,'Bold');
      }
      oy2+=56;
    }
    oy2+=12;
  }
  await NAV_C(f,4);
  await LBL(f,'C25 / SETTINGS');
  return f;
};

// C26: HELP & SUPPORT
const C26 = async () => {
  const f = mk(custPage,11250,'C26 Help & Support');
  await SB(f);
  await HDR(f,'Help & Support');
  // Search
  bx(f,20,88,350,44,SURF,1,14); bx(f,20,88,350,1,WH,.05,14);
  await tx(f,'Search help articles...', 38,103, 12, GR);
  // Quick contact
  CD(f,20,146,350,80); bx(f,20,146,350,3,CY,1,2);
  await tx(f,'Get Instant Help',30,160,14,WH,'Bold');
  await tx(f,'Average response: 2 minutes',30,180,10,GR);
  bx(f,218,156,58,28,GN,.15,14); await tx(f,'Chat',229,165,11,GN,'Semi Bold');
  bx(f,284,156,66,28,CY,.15,14); await tx(f,'Call Us',290,165,11,CY,'Semi Bold');
  // FAQ
  await tx(f,'Frequently Asked Questions',20,242,14,WH,'Semi Bold');
  const faqs=[
    {q:'How to cancel a booking?',a:'Go to My Bookings → tap the booking → Cancel.',open:true},
    {q:'When will I get my refund?',a:'Refunds are processed in 3-5 business days.',open:false},
    {q:'How is the provider verified?',a:'All providers complete KYC + background check.',open:false},
    {q:'Can I reschedule a booking?',a:'Yes, up to 2 hours before the scheduled time.',open:false},
    {q:'What if provider doesn\'t show up?',a:'Report via app — full refund + penalty to provider.',open:false},
    {q:'How does OTP verification work?',a:'OTP confirms both job start and job completion.',open:false},
  ];
  let fy=268;
  for (const fq of faqs){
    const hh=fq.open?80:46;
    CD(f,20,fy,350,hh);
    bx(f,20,fy,4,hh,CY,.5,2);
    await tx(f,fq.q, 32,fy+14, 12, WH,'Semi Bold');
    await tx(f,fq.open?'v':'>',328,fy+14,12,fq.open?CY:GR,'Bold');
    if (fq.open){ await tx(f,fq.a, 32,fy+36, 11, GR); }
    fy+=hh+8;
  }
  // Other help
  bx(f,20,716,350,54,{r:.08,g:.04,b:.04},1,16); bx(f,20,716,350,2,RD,.4,2);
  await tx(f,'Didn\'t find your answer?',30,728,12,WH,'Semi Bold');
  await tx(f,'Submit a Support Ticket — our team will respond within 4 hrs',30,748,10,GR);
  bx(f,276,722,80,26,RD,.15,13); await tx(f,'Ticket ->',282,729,10,RD,'Semi Bold');
  await NAV_C(f,4);
  await LBL(f,'C26 / HELP & SUPPORT');
  return f;
};

// Build customer screens
const c1=await C1(), c2=await C2(), c3=await C3(), c4=await C4();
const c5=await C5(), c6=await C6(), c7=await C7(), c8=await C8();
const c9=await C9(), c10=await C10(), c11=await C11(), c12=await C12();
const c13=await C13(), c14=await C14();
const c15=await C15(), c16=await C16(), c17=await C17(), c18=await C18();
const c19=await C19(), c20=await C20(), c21=await C21(), c22=await C22();
const c23=await C23(), c24=await C24(), c25=await C25(), c26=await C26();
console.log('Customer screens done (26/84) — extended screens built after Provider & Admin definitions');

// ════════════════════════════════════════════════════════════
//  PROVIDER — Row 2  (y = 960)
// ════════════════════════════════════════════════════════════

// P1: PROVIDER LOGIN
const P1 = async () => {
  const f = mk(provPage,0,'P1 Provider Login',1);
  tg(f,{r:.06,g:.09,b:.03},H);
  bx(f,155,52,80,80,OG,.1,40); bx(f,163,60,64,64,OG,.14,32); bx(f,171,68,48,48,OG,1,24);
  await tx(f,'S',186,80,22,BK,'Bold');
  await tx(f,'ServiCo Partner',118,156,20,WH,'Bold');
  await tx(f,'Service Provider Portal',112,184,12,GR);
  bx(f,20,214,350,38,OG,.15,19); bx(f,20,214,350,1,OG,.3,19);
  await tx(f,'Partner Login',138,224,13,OG,'Semi Bold');
  await INP(f,20,280,350,'Registered Mobile','+91  94567 12345',OG);
  await INP(f,20,356,350,'Password','Enter password',OG);
  await tx(f,'Show',334,370,11,OG);
  await tx(f,'Forgot Password?',246,436,12,OG);
  await BTN(f,20,460,350,'Login to Dashboard',OG,WH);
  await BTN2(f,20,526,350,'Login with OTP',OG);
  // New partner card
  CD(f,20,590,350,56);
  bx(f,20,590,4,56,OG,1,2);
  await tx(f,'New Partner?',32,600,12,WH,'Semi Bold');
  await tx(f,'Register your business and start earning today',32,618,10,GR);
  await tx(f,'Apply ->',316,608,11,OG,'Semi Bold');
  // KYC badges
  const badges=['KYC Verified','Insured Jobs','Weekly Payout'];
  for (let i=0;i<3;i++){
    bx(f,20+i*118,664,108,50,{r:.07,g:.06,b:.03},1,12); bx(f,20+i*118,664,108,3,OG,.5,2);
    await tx(f,badges[i], 28+i*118,680, 9, LG,'Semi Bold');
    await tx(f,'Active', 28+i*118,696, 9, GN);
  }
  await LBL(f,'P1 / PROVIDER LOGIN');
  return f;
};

// P2: PROVIDER DASHBOARD
const P2 = async () => {
  const f = mk(provPage,450,'P2 Dashboard',1);
  tg(f,{r:.05,g:.10,b:.03},240);
  await SB(f);
  // Header
  await AV(f,20,42,46,'VR',OG);
  await tx(f,'Welcome back,',78,44,12,GR);
  await tx(f,'Venkat Repairs',78,62,16,WH,'Bold');
  bx(f,316,44,36,36,SURF,1,18); bx(f,316,44,36,36,WH,.04,18);
  await tx(f,'Bell',320,53,10,LG);
  // Online toggle
  CD(f,20,100,350,52); bx(f,20,100,4,52,GN,1,2);
  await tx(f,'Status: ONLINE',32,112,13,GN,'Semi Bold');
  await tx(f,'Tap to go offline',32,130,10,GR);
  bx(f,294,114,56,24,GN,1,12); bx(f,318,118,16,16,WH,1,8);
  // Today stats
  await tx(f,"Today's Overview",20,166,14,WH,'Semi Bold');
  await tx(f,'Wed 27 May 2026',274,168,10,GR);
  await SC(f,20, 190,100,'5','New Requests',OG);
  await SC(f,128,190,100,'3','Completed',GN);
  await SC(f,236,190,134,'Rs1,240','Earned Today',CY);
  // Monthly summary
  CD(f,20,274,350,58);
  const ms=[['Rs18.4K','This Month'],['94%','Accept Rate'],['4.8','Avg Rating']];
  for (let i=0;i<3;i++){
    const ox=40+i*112;
    await tx(f,ms[i][0], ox,284, 14, i===0?GN:i===1?CY:ST,'Bold');
    await tx(f,ms[i][1], ox-2,306, 9, GR);
    if (i<2) bx(f,40+(i+1)*112-8,284,1,30,EDGE,.6);
  }
  // Incoming requests
  await tx(f,'Incoming Requests',20,344,14,WH,'Semi Bold');
  bx(f,262,342,58,22,OG,.15,11); await tx(f,'2 New',270,347,10,OG,'Semi Bold');
  const reqs=[
    {n:'Ramprasad M.',  svc:'Premium Car Wash',p:'Rs349',d:'1.2 km',tm:'11:00 AM'},
    {n:'Sai Krishna T.',svc:'AC Repair',        p:'Rs599',d:'2.0 km',tm:'2:30 PM'},
  ];
  for (let i=0;i<2;i++){
    const rq=reqs[i], oy=370+i*108;
    CD(f,20,oy,350,98); bx(f,20,oy,350,3,OG,.7,2);
    bx(f,30,oy+14,40,40,OG,.2,20);
    await tx(f,rq.n[0], 44,oy+26, 14, OG,'Bold');
    await tx(f,rq.n, 82,oy+12, 13, WH,'Semi Bold');
    await tx(f,rq.svc, 82,oy+30, 11, GR);
    await tx(f,rq.d+' away  +  '+rq.tm, 82,oy+48, 10, GR);
    bx(f,82,oy+68,70,22,GN,.15,11); await tx(f,'Accept',94,oy+72,10,GN,'Semi Bold');
    bx(f,162,oy+68,60,22,RD,.12,11); await tx(f,'Reject',172,oy+72,10,RD,'Semi Bold');
    await tx(f,rq.p, 296,oy+28, 16, CY,'Bold');
  }
  // Active job
  await tx(f,'Active Job',20,594,14,WH,'Semi Bold');
  CD(f,20,614,350,62); bx(f,20,614,6,62,GN,1,3);
  bx(f,290,622,64,24,GN,.15,12); await tx(f,'In Progress',294,630,9,GN,'Semi Bold');
  await tx(f,'Neha S. — Basic Wash',34,622,13,WH,'Semi Bold');
  await tx(f,'Started 10:14 AM  +  Est completion 10:46 AM',34,642,10,GR);
  await NAV_P(f,0);
  await LBL(f,'P2 / DASHBOARD');
  return f;
};

// P3: REQUEST DETAIL
const P3 = async () => {
  const f = mk(provPage,900,'P3 Request Detail',1);
  tg(f,{r:.05,g:.10,b:.03},190);
  await SB(f);
  await HDR(f,'New Request');
  bx(f,296,46,74,30,OG,.15,15); await tx(f,'Expires 4:52',304,54,10,OG,'Semi Bold');
  // Customer card
  CD(f,20,88,350,100);
  await AV(f,30,100,52,'RM',CY);
  await tx(f,'Ramprasad Mokka',96,98,14,WH,'Bold');
  await tx(f,'Customer since 2024  +  6 bookings',96,118,10,GR);
  await tx(f,'* 4.9 avg customer rating',96,136,10,ST);
  // Service details
  await tx(f,'Service Details',20,202,14,WH,'Semi Bold');
  CD(f,20,224,350,150); bx(f,20,224,4,150,OG,1,2);
  const dets=[
    ['Service',    'Premium Car Wash'],
    ['Package',    'Exterior + Interior  +  60 min'],
    ['Vehicle',    'Maruti Swift Dzire (White)'],
    ['Date & Time','27 May 2026  +  11:00 AM'],
    ['Location',   'Banjara Hills, Hyderabad'],
  ];
  for (let i=0;i<5;i++){
    const oy=236+i*26;
    await tx(f,dets[i][0], 32,oy, 11, GR);
    await tx(f,dets[i][1], 152,oy, 11, LG,'Semi Bold');
  }
  // Earnings
  await tx(f,'Your Earnings',20,388,14,WH,'Semi Bold');
  CD(f,20,410,350,92);
  const earn=[['Customer pays','Rs.349'],['Platform fee (18%)','- Rs.63'],['Your payout','Rs.286']];
  for (let i=0;i<3;i++){
    const oy=422+i*26;
    await tx(f,earn[i][0], 32,oy, 11, i===2?WH:GR, i===2?'Semi Bold':'Regular');
    await tx(f,earn[i][1], 310-earn[i][1].length*6.5,oy, i===2?14:11, i===2?GN:LG, i===2?'Bold':'Regular');
  }
  // Mini map
  bx(f,0,518,W,88,{r:.04,g:.08,b:.12});
  for (let i=0;i<5;i++) bx(f,0,518+i*18,W,1,WH,.02);
  for (let i=0;i<8;i++) bx(f,i*50,518,1,88,WH,.02);
  bx(f,0,578,W,6,{r:.10,g:.14,b:.18},1,3);
  bx(f,160,546,16,16,OG,1,8);
  await tx(f,'Customer: Banjara Hills  +  1.2 km  +  8 min ETA',28,548,9,WH);
  // Note
  CD(f,20,620,350,44); bx(f,20,620,4,44,CY,1,2);
  await tx(f,'Customer note:',32,630,10,GR);
  await tx(f,'"Please be careful with the dashboard area"',32,646,10,LG);
  // CTAs
  bx(f,20,678,158,54,{r:.22,g:.05,b:.05},1,27);
  await tx(f,'Reject',68,695,15,RD,'Bold');
  bx(f,194,678,176,54,GN,1,27);
  bx(f,195,679,174,1,WH,.2,26);
  await tx(f,'Accept Job',240,695,15,BK,'Bold');
  await LBL(f,'P3 / REQUEST DETAIL');
  return f;
};

// P4: ACTIVE JOBS
const P4 = async () => {
  const f = mk(provPage,1350,'P4 Active Jobs',1);
  await SB(f);
  await tx(f,'My Jobs',20,50,20,WH,'Bold');
  await tx(f,'Wed 27 May',292,52,11,GR);
  // Tabs
  bx(f,20,82,350,36,SURF,1,18);
  const tabs=['Active','Upcoming','Completed'];
  for (let i=0;i<3;i++){
    const s=i===0, tw=116;
    bx(f,22+i*tw,84,tw,32,s?OG:{r:0,g:0,b:0},s?1:0,14);
    await tx(f,tabs[i], 22+i*tw+Math.round((tw-tabs[i].length*7)/2),92, 12, s?WH:GR, s?'Semi Bold':'Regular');
  }
  // Active job
  CD(f,20,130,350,122); bx(f,20,130,4,122,GN,1,2);
  bx(f,288,138,66,22,GN,.15,11); await tx(f,'In Progress',293,143,9,GN,'Semi Bold');
  await AV(f,32,142,44,'RM',CY);
  await tx(f,'Ramprasad Mokka',88,142,13,WH,'Semi Bold');
  await tx(f,'Premium Car Wash  +  Swift Dzire',88,160,10,GR);
  await tx(f,'Started 11:04 AM  +  Est end 12:04 PM',88,178,10,GR);
  bx(f,32,202,306,6,{r:.14,g:.14,b:.17},1,3);
  bx(f,32,202,170,6,GN,1,3);
  await tx(f,'55%',326,197,9,GN,'Semi Bold');
  bx(f,32,218,132,24,GN,.12,12); await tx(f,'Mark Complete',38,226,10,GN,'Semi Bold');
  bx(f,174,218,102,24,CY,.12,12); await tx(f,'Call Customer',180,226,10,CY);
  // Upcoming
  await tx(f,'Upcoming Today',20,264,14,WH,'Semi Bold');
  const ups=[
    {n:'Neha Sharma', svc:'Basic Wash',  tm:'2:00 PM',p:'Rs149',d:'3.2 km',c:CY},
    {n:'Rahul Verma', svc:'Tyre Change', tm:'4:30 PM',p:'Rs249',d:'1.8 km',c:GN},
    {n:'Priya Patel', svc:'AC Repair',   tm:'6:00 PM',p:'Rs599',d:'4.1 km',c:OG},
  ];
  for (let i=0;i<3;i++){
    const u=ups[i], oy=288+i*90;
    CD(f,20,oy,350,80);
    bx(f,30,oy+16,40,40,u.c,.2,20);
    await tx(f,u.n[0], 44,oy+27, 13, u.c,'Bold');
    await tx(f,u.n, 82,oy+14, 12, WH,'Semi Bold');
    await tx(f,u.svc, 82,oy+32, 11, GR);
    await tx(f,u.tm+'  +  '+u.d+' away', 82,oy+50, 10, GR);
    bx(f,268,oy+16,72,46,{r:.07,g:.07,b:.09},1,10);
    await tx(f,u.p, 278,oy+24, 13, CY,'Bold');
    await tx(f,'Details',280,oy+44,9,GR);
  }
  // Summary bar
  bx(f,20,562,350,50,{r:.08,g:.08,b:.10},1,14); bx(f,20,562,350,2,CY,.35,2);
  await tx(f,'Completed today: 3 jobs  +  Earned: Rs.862',28,576,11,LG);
  await NAV_P(f,1);
  await LBL(f,'P4 / ACTIVE JOBS');
  return f;
};

// P5: JOB DETAIL
const P5 = async () => {
  const f = mk(provPage,1800,'P5 Job Detail',1);
  await SB(f);
  await HDR(f,'Job #7284','In Progress');
  bx(f,272,46,92,30,GN,.15,15); bx(f,280,56,8,8,GN,1,4); await tx(f,'In Progress',294,53,10,GN,'Semi Bold');
  // Customer
  CD(f,20,88,350,80);
  await AV(f,30,100,46,'RM',CY);
  await tx(f,'Ramprasad Mokka',88,100,13,WH,'Bold');
  await tx(f,'Premium Car Wash  +  Swift Dzire',88,118,10,GR);
  await tx(f,'Banjara Hills  +  1.2 km',88,136,10,GR);
  bx(f,282,100,78,26,CY,.12,13); await tx(f,'View Map',290,108,10,CY);
  bx(f,282,134,36,26,GN,.12,13); await tx(f,'Call',290,142,10,GN);
  bx(f,324,134,34,26,BL,.12,13); await tx(f,'Chat',330,142,10,BL);
  // Checklist
  await tx(f,'Service Checklist',20,182,14,WH,'Semi Bold');
  await tx(f,'4 of 6 done',296,184,10,GR);
  const checks=[
    {l:'Pre-wash inspection + photo',done:true},
    {l:'Exterior foam wash',         done:true},
    {l:'Rinse and dry exterior',      done:true},
    {l:'Interior vacuuming',          done:true},
    {l:'Dashboard + console wipe',    done:false},
    {l:'Tyre and rim cleaning',       done:false},
  ];
  for (let i=0;i<6;i++){
    const ck=checks[i], oy=204+i*40;
    bx(f,20,oy,350,36,ck.done?{r:.07,g:.14,b:.07}:CARD,1,12);
    bx(f,20,oy,350,1,WH,.05,12);
    bx(f,32,oy+10,16,16,ck.done?GN:EDGE,1,8);
    if (ck.done) await tx(f,'v',36,oy+11,9,BK,'Bold');
    await tx(f,ck.l, 58,oy+10, 12, ck.done?GN:LG, ck.done?'Semi Bold':'Regular');
  }
  // OTP
  CD(f,20,452,350,52); bx(f,20,452,4,52,AM,1,2);
  await tx(f,'Completion OTP — share with customer to close job',32,462,10,GR);
  await tx(f,'4  8  2  1',122,474,22,AM,'Bold');
  // Payment
  await tx(f,'Payment',20,518,14,WH,'Semi Bold');
  CD(f,20,540,350,52); bx(f,20,540,4,52,CY,1,2);
  await tx(f,'Customer paid Rs.349  (UPI — verified)',32,550,12,WH,'Semi Bold');
  await tx(f,'Your payout Rs.286  (Pending settlement)',32,568,10,GR);
  bx(f,270,552,82,22,CY,.12,11); await tx(f,'View Receipt',274,558,9,CY);
  // Issue report
  CD(f,20,606,350,40);
  await tx(f,'Report issue with this job',32,619,12,GR);
  await tx(f,'->',334,619,13,GR,'Bold');
  // CTAs
  bx(f,20,660,158,52,{r:.22,g:.05,b:.05},1,26);
  await tx(f,'Cancel Job',54,677,13,RD,'Bold');
  bx(f,192,660,178,52,GN,1,26); bx(f,193,661,176,1,WH,.2,25);
  await tx(f,'Mark Complete',228,677,13,BK,'Bold');
  await tx(f,'#7284  +  Premium Wash  +  Rs.286 payout',46,728,10,GR);
  await LBL(f,'P5 / JOB DETAIL');
  return f;
};

// P6: EARNINGS
const P6 = async () => {
  const f = mk(provPage,2250,'P6 Earnings',1);
  tg(f,{r:.03,g:.09,b:.04},240);
  await SB(f);
  await tx(f,'Earnings',20,50,20,WH,'Bold');
  await tx(f,'May 2026',298,52,12,GR);
  // Big total card
  CD(f,20,84,350,112); bx(f,20,84,350,4,GN,1,4);
  await tx(f,'Total Earned — May 2026',90,96,12,GR);
  await tx(f,'Rs. 18,420',78,116,30,GN,'Bold');
  await tx(f,'vs last month  +22%',90,158,11,GN);
  bx(f,272,112,74,24,GN,.15,12); await tx(f,'Withdraw',278,118,10,GN,'Semi Bold');
  // Bar chart
  await tx(f,'Weekly Breakdown',20,210,14,WH,'Semi Bold');
  CD(f,20,232,350,102);
  const bars=[2200,3100,2800,4200,3600,1900,620];
  const days=['M','T','W','T','F','S','S'];
  for (let i=0;i<7;i++){
    const bh=Math.floor((bars[i]/4200)*70), ox=28+i*46;
    bx(f,ox,290-bh,28,bh,i===3?GN:CY,i===3?1:.5,3);
    await tx(f,days[i], ox+8,296, 9, GR);
    if (i===3) await tx(f,'4.2K', ox-2,276-bh, 8, GN,'Semi Bold');
  }
  // Stat grid
  const eg=[['24','Jobs Done',OG],['Rs762','Avg/Job',CY],['94%','Accept Rate',GN],['Rs1,240','Best Day',AM]];
  for (let i=0;i<4;i++){
    const col=i%2, row=Math.floor(i/2);
    await SC(f,20+col*178,346+row*80,164,eg[i][0],eg[i][1],eg[i][2]);
  }
  // Transactions
  await tx(f,'Recent Transactions',20,518,14,WH,'Semi Bold');
  const txns=[
    {n:'Ramprasad M.', svc:'Premium Wash',am:'+Rs286',dt:'Today 12:04',  s:'Settled',sc:GN},
    {n:'Neha Sharma',  svc:'Basic Wash',  am:'+Rs118',dt:'Today 10:46',  s:'Settled',sc:GN},
    {n:'Rahul Verma',  svc:'Tyre Change', am:'+Rs196',dt:'Yesterday',    s:'Pending',sc:AM},
    {n:'Priya Patel',  svc:'AC Repair',   am:'+Rs474',dt:'25 May',       s:'Settled',sc:GN},
  ];
  for (let i=0;i<4;i++){
    const t=txns[i], oy=542+i*58;
    CD(f,20,oy,350,50);
    bx(f,30,oy+10,30,30,GN,.15,15);
    await tx(f,'Rs',35,oy+17,10,GN,'Bold');
    await tx(f,t.n, 72,oy+10, 12, WH,'Semi Bold');
    await tx(f,t.svc+'  +  '+t.dt, 72,oy+28, 10, GR);
    await tx(f,t.am, 278,oy+10, 13, GN,'Bold');
    await BDG(f,278,oy+30,t.s,t.sc);
  }
  await NAV_P(f,2);
  await LBL(f,'P6 / EARNINGS');
  return f;
};

// P7: KYC REGISTRATION
const P7 = async () => {
  const f = mk(provPage,2700,'P7 KYC Registration',1);
  tg(f,{r:.05,g:.10,b:.03},200);
  await SB(f);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  await tx(f,'Partner Registration',64,48,15,WH,'Bold');
  await tx(f,'Step 2 of 4 — KYC & Business Details',64,68,10,GR);
  bx(f,20,90,350,4,SURF,1,4); bx(f,20,90,175,4,OG,1,4);
  const kycSteps=['Info','KYC','Services','Bank'];
  for (let i=0;i<4;i++){
    const done=i<2, act=i===1;
    bx(f,20+i*88,82,20,20,done?OG:SURF,1,10);
    if (done) await tx(f,'v',26+i*88,85,9,BK,'Bold');
    await tx(f,kycSteps[i], 16+i*88,106, 9, done||act?OG:GR, done||act?'Semi Bold':'Regular');
  }
  await tx(f,'Business Details',20,122,14,WH,'Semi Bold');
  await INP(f,20,148,350,'Business / Shop Name','VenkatRepairs Auto Services',OG);
  await INP(f,20,222,350,'Business Type','Mobile Service Provider  v',OG);
  await INP(f,20,296,350,'City & Service Area','Hyderabad — Banjara Hills, Jubilee Hills',OG);
  await tx(f,'Identity Proof',20,368,14,WH,'Semi Bold');
  const kycdocs=['Aadhaar Card','PAN Card','Driving Licence'];
  for (let i=0;i<3;i++){
    const oy=392+i*68;
    CD(f,20,oy,350,58); bx(f,20,oy,4,58,OG,.7,2);
    await tx(f,kycdocs[i], 34,oy+10, 12, WH,'Semi Bold');
    await tx(f,i===0?'Uploaded v':(i===1?'Uploaded v':'Tap to upload'), 34,oy+30, 10, i<2?GN:GR);
    bx(f,272,oy+16,78,26,i<2?GN:OG,.15,13);
    await tx(f,i<2?'View':'Upload +', 280,oy+21, 10, i<2?GN:OG,'Semi Bold');
  }
  await tx(f,'Selfie with ID',20,602,14,WH,'Semi Bold');
  bx(f,20,626,100,88,SURF,1,14); bx(f,20,626,100,1,WH,.05,14);
  bx(f,52,646,36,36,OG,.1,18); await tx(f,'Cam',58,658,10,OG);
  bx(f,130,626,240,88,CARD,1,14); bx(f,130,626,240,1,WH,.05,14);
  await tx(f,'Take a clear selfie holding your', 142,644, 10, GR);
  await tx(f,'Aadhaar card next to your face', 142,662, 10, GR);
  bx(f,142,680,110,22,OG,.12,11); await tx(f,'Open Camera',146,686,9,OG);
  await BTN(f,20,730,350,'Save & Continue',OG,WH);
  bx(f,20,796,350,28,GN,.07,10); bx(f,20,796,350,1,GN,.2,10);
  await tx(f,'Your KYC data is encrypted and reviewed within 24 hrs',36,806,10,GN);
  await LBL(f,'P7 / KYC REGISTRATION');
  return f;
};

// P8: EN ROUTE NAVIGATION
const P8 = async () => {
  const f = mk(provPage,3150,'P8 En Route',1);
  bx(f,0,0,W,H,{r:.04,g:.08,b:.12});
  for (let i=0;i<19;i++) bx(f,0,i*46,W,1,WH,.02);
  for (let i=0;i<8;i++) bx(f,i*50,0,1,H,WH,.02);
  bx(f,140,0,18,H,{r:.08,g:.10,b:.14},1,2);
  for (let i=0;i<8;i++) bx(f,147,i*110,4,60,AM,.6,2);
  for (let i=0;i<10;i++) bx(f,90+i*15,200-i*18,12,6,CY,.8,3);
  bx(f,76,260,52,52,OG,.2,26); bx(f,82,266,40,40,OG,1,20);
  await tx(f,'VR',96,278,11,BK,'Bold');
  bx(f,68,308,62,16,BK,.7,8); await tx(f,'You',90,311,9,WH,'Semi Bold');
  bx(f,56,120,40,40,GN,.2,20); bx(f,62,126,28,28,GN,1,14);
  await tx(f,'v',72,132,11,BK,'Bold');
  bx(f,46,158,52,16,BK,.7,8); await tx(f,'Customer',48,161,9,WH,'Semi Bold');
  bx(f,0,0,W,80,BK,.7);
  await SB(f);
  bx(f,0,36,W,44,{r:.03,g:.10,b:.03},1);
  bx(f,16,42,42,30,GN,.2,8);
  await tx(f,'Turn Left in 200m',74,48,13,WH,'Bold');
  await tx(f,'onto Jubilee Hills Road 36',74,66,10,GR);
  await tx(f,'1.2 km  +  6 min',280,50,11,GN,'Semi Bold');
  bx(f,310,100,60,60,{r:.05,g:.05,b:.06},1,30);
  bx(f,322,126,18,2,WH,.5,1); bx(f,330,120,2,14,WH,.5,1);
  bx(f,0,H-200,W,200,{r:.05,g:.05,b:.065});
  bx(f,0,H-200,W,1,EDGE,.5);
  bx(f,174,H-192,42,4,EDGE,1,2);
  await tx(f,'ETA: 6 min',20,H-178,18,CY,'Bold');
  await tx(f,'1.2 km remaining',20,H-156,11,GR);
  bx(f,230,H-186,120,34,GN,.15,17); await tx(f,"I've Arrived",248,H-174,12,GN,'Semi Bold');
  CD(f,20,H-136,350,82);
  bx(f,30,H-124,44,44,CY,.2,22); await tx(f,'RM',44,H-108,14,BK,'Bold');
  await tx(f,'Ramprasad Mokka',88,H-124,13,WH,'Bold');
  await tx(f,'Premium Car Wash  +  Maruti Swift Dzire',88,H-106,10,GR);
  await tx(f,'Banjara Hills, Hyderabad',88,H-88,10,GR);
  bx(f,282,H-118,36,36,GN,.15,18); await tx(f,'Call',291,H-105,10,GN,'Semi Bold');
  bx(f,324,H-118,36,36,CY,.15,18); await tx(f,'Chat',333,H-105,10,CY,'Semi Bold');
  await LBL(f,'P8 / EN ROUTE');
  return f;
};

// P9: JOB COMPLETION OTP
const P9 = async () => {
  const f = mk(provPage,3600,'P9 Job Completion',1);
  tg(f,{r:.03,g:.12,b:.03},300);
  await SB(f);
  await HDR(f,'Complete Job','Enter customer OTP to close');
  CD(f,20,88,350,100); bx(f,20,88,350,3,GN,1,2);
  await AV(f,30,100,46,'RM',CY);
  await tx(f,'Ramprasad Mokka',88,100,13,WH,'Bold');
  await tx(f,'Premium Car Wash  +  Swift Dzire',88,118,10,GR);
  bx(f,88,134,64,24,GN,.15,12); bx(f,90,136,8,8,GN,1,4); await tx(f,'In Progress',104,138,9,GN,'Semi Bold');
  await tx(f,'Rs.286 payout',264,104,12,CY,'Bold');
  await tx(f,'Customer OTP',150,210,14,WH,'Semi Bold');
  await tx(f,'Ask customer for the 4-digit OTP shown in their app',70,234,12,GR);
  await tx(f,'to confirm job completion and release your payout',74,254,12,GR);
  const otpDigits=['8','4','*','*'];
  for (let i=0;i<4;i++){
    const filled=i<2;
    bx(f,40+i*80,278,70,72,filled?{r:.04,g:.14,b:.04}:CARD,1,16);
    bx(f,40+i*80,278,70,1,filled?GN:WH,filled?1:.05,16);
    await tx(f,otpDigits[i], 62+i*80,300, 24, filled?GN:GR,'Bold');
  }
  bx(f,40,358,310,2,CY,.3,1);
  await tx(f,'Enter the 4-digit OTP provided by the customer',60,370,11,GR);
  await tx(f,'Numpad',165,402,10,GR);
  const nums=['1','2','3','4','5','6','7','8','9','<','0','v'];
  for (let i=0;i<12;i++){
    const col=i%3, row2=Math.floor(i/3);
    const ox=52+col*94, oy=422+row2*56;
    bx(f,ox,oy,82,46,i===11?GN:SURF,i===11?1:0,12);
    if (i<11&&i!==9) bx(f,ox,oy,82,1,WH,.04,12);
    await tx(f,nums[i], ox+30,oy+14, 15, i===11?BK:i===9?RD:WH, i===11||i===9?'Bold':'Regular');
  }
  bx(f,20,666,165,52,{r:.14,g:.04,b:.04},1,26);
  await tx(f,'Flag Issue',58,682,13,RD,'Bold');
  bx(f,199,666,171,52,{r:.06,g:.14,b:.06},1,26); bx(f,200,667,169,1,WH,.2,25);
  await tx(f,'Verify OTP',228,682,13,GN,'Bold');
  CD(f,20,730,350,64); bx(f,20,730,4,64,AM,1,2);
  await tx(f,'Why OTP?',32,742,12,WH,'Semi Bold');
  await tx(f,'Confirms job is done to customer satisfaction.',32,762,10,GR);
  await tx(f,'Your payout is released immediately after verification.',32,778,10,GR);
  await LBL(f,'P9 / JOB COMPLETION');
  return f;
};

// P10: PROVIDER PROFILE
const P10 = async () => {
  const f = mk(provPage,4050,'P10 Provider Profile',1);
  tg(f,{r:.05,g:.10,b:.03},220);
  await SB(f);
  bx(f,146,44,98,98,OG,.1,49); bx(f,154,52,82,82,OG,1,41);
  await tx(f,'VR',179,82,22,BK,'Bold');
  await tx(f,'Venkat Repairs',104,158,16,WH,'Bold');
  await tx(f,'Auto Services  +  Hyderabad',100,180,11,GR);
  bx(f,150,202,90,22,GN,.1,11); bx(f,150,202,90,1,GN,.3,11);
  bx(f,158,210,8,8,GN,1,4); await tx(f,'KYC Verified',172,208,10,GN,'Semi Bold');
  CD(f,20,234,350,60);
  const pStats=[['4.8','Rating'],['142','Jobs Done'],['5 yrs','Experience'],['94%','Accept']];
  for (let i=0;i<4;i++){
    const ox=26+i*86;
    await tx(f,pStats[i][0], ox,244, 15, OG,'Bold');
    await tx(f,pStats[i][1], ox-4,266, 8, GR);
    if (i<3) bx(f,26+(i+1)*86-4,244,1,28,EDGE,.6);
  }
  await tx(f,'Account Settings',20,308,14,WH,'Semi Bold');
  const pSettings=[
    {t:'Edit Profile & Photo',c:OG},{t:'Manage Services Offered',c:OG},
    {t:'Set Availability Schedule',c:CY},{t:'Bank Account & UPI',c:GN},
    {t:'KYC Documents',c:AM},{t:'Notification Preferences',c:GR},
    {t:'Privacy & Security',c:GR},{t:'Help & Support',c:BL},{t:'Logout',c:RD},
  ];
  for (let i=0;i<pSettings.length;i++){
    const s=pSettings[i], oy=334+i*52;
    CD(f,20,oy,350,44);
    bx(f,28,oy+12,20,20,s.c,.18,10); bx(f,30,oy+14,16,16,s.c,.25,8);
    await tx(f,s.t, 60,oy+14, 13, i===8?RD:LG);
    if (i<8) await tx(f,'->',330,oy+14, 13, GR,'Bold');
  }
  await NAV_P(f,3);
  await LBL(f,'P10 / PROVIDER PROFILE');
  return f;
};


// P11: PARTNER ONBOARDING — STEP 1
const P11 = async () => {
  const f = mk(provPage,4500,'P11 Partner Step 1',1);
  tg(f,{r:.05,g:.10,b:.03},220);
  await SB(f);
  await tx(f,'Join as a Partner',78,50,17,WH,'Bold');
  await tx(f,'Step 1 of 4 — Personal Information',78,72,10,GR);
  bx(f,20,90,350,4,SURF,1,4); bx(f,20,90,87,4,OG,1,4);
  const onsteps=['Info','KYC','Services','Bank'];
  for (let i=0;i<4;i++){
    const done=i===0, act=i===0;
    bx(f,20+i*88,82,20,20,done?OG:SURF,1,10);
    if (done) await tx(f,'1',26+i*88,85,9,BK,'Bold');
    await tx(f,onsteps[i], 14+i*88,106, 9, done||act?OG:GR, done||act?'Semi Bold':'Regular');
  }
  // Earn potential card
  bx(f,20,118,350,56,{r:.06,g:.12,b:.03},1,14); bx(f,20,118,350,2,OG,.6,2);
  await tx(f,'Earn Rs.15,000 - Rs.40,000/month',30,132,12,WH,'Semi Bold');
  await tx(f,'Join 342 active partners earning from home',30,152,10,GR);
  // Form
  await INP(f,20,192,350,'Full Legal Name','Venkat Ramaiah Sharma',OG);
  await INP(f,20,266,350,'Date of Birth','15 / 06 / 1990',OG);
  await INP(f,20,340,350,'Mobile Number','+91  94567 12345',OG);
  await INP(f,20,414,350,'Email Address','venkat.sharma@gmail.com',OG);
  await INP(f,20,488,350,'City of Operation','Hyderabad',OG);
  // Gender
  await tx(f,'Gender',20,556,11,LG);
  const gens=['Male','Female','Other'];
  for (let i=0;i<3;i++){
    const s=i===0;
    bx(f,20+i*118,574,108,40,s?OG:CARD,s?1:.8,12);
    if (!s) bx(f,20+i*118,574,108,1,WH,.05,12);
    await tx(f,gens[i], 20+i*118+32,590, 12, s?BK:LG, s?'Semi Bold':'Regular');
  }
  await BTN(f,20,632,350,'Save & Continue',OG,WH);
  bx(f,20,700,350,108,CARD,1,14); bx(f,20,700,350,2,OG,.4,2);
  await tx(f,'Why join ServiCo?',30,714,12,WH,'Semi Bold');
  const why=['Set your own hours and work area','Get paid weekly directly to your bank','Access to 10,000+ customers in your city','Free insurance on all jobs'];
  for (let i=0;i<4;i++){
    bx(f,30,734+i*18,6,6,OG,1,3);
    await tx(f,why[i], 44,732+i*18, 10, GR);
  }
  await LBL(f,'P11 / PARTNER STEP 1');
  return f;
};

// P12: PARTNER SERVICES SETUP
const P12 = async () => {
  const f = mk(provPage,4950,'P12 Services Setup',1);
  tg(f,{r:.05,g:.10,b:.03},180);
  await SB(f);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  await tx(f,'Services & Skills',64,48,15,WH,'Bold');
  await tx(f,'Step 3 of 4 — What can you offer?',64,68,10,GR);
  bx(f,20,90,350,4,SURF,1,4); bx(f,20,90,263,4,OG,1,4);
  // Select services
  await tx(f,'Select services you offer (min 1)',20,108,12,GR,'Semi Bold');
  const svcs=[
    {n:'Car Wash',d:'Exterior/Interior',c:CY,s:true},
    {n:'AC Repair',d:'All brands',c:OG,s:false},
    {n:'Full Detailing',d:'Polish & wax',c:PK,s:true},
    {n:'Tyre Fix',d:'Puncture, rotation',c:GN,s:false},
    {n:'Engine Check',d:'Diagnostics',c:AM,s:false},
    {n:'Interior Cleaning',d:'Vacuum & sanitize',c:BL,s:true},
    {n:'Dent Repair',d:'Minor dents',c:RD,s:false},
    {n:'Battery Service',d:'Check & replace',c:ST,s:false},
  ];
  for (let i=0;i<svcs.length;i++){
    const col=i%2, rw=Math.floor(i/2);
    const ox=20+col*178, oy=130+rw*82;
    bx(f,ox,oy,164,72,svcs[i].s?{r:.04,g:.12,b:.04}:CARD,1,14);
    bx(f,ox,oy,164,1,svcs[i].s?GN:WH,svcs[i].s?1:.05,14);
    if (svcs[i].s){ bx(f,ox+140,oy+8,20,20,GN,.2,10); await tx(f,'v',ox+145,oy+10,9,GN,'Bold'); }
    bx(f,ox+10,oy+10,32,32,svcs[i].c,.15,16);
    await tx(f,svcs[i].n, ox+50,oy+12, 12, WH,'Semi Bold');
    await tx(f,svcs[i].d, ox+50,oy+30, 10, GR);
    await BDG(f,ox+50,oy+48,svcs[i].s?'Selected':'Tap to add',svcs[i].s?GN:EDGE);
  }
  // Pricing
  await tx(f,'Your Base Pricing',20,466,14,WH,'Semi Bold');
  await tx(f,'(You can update anytime)',220,468,9,GR);
  await INP(f,20,490,350,'Car Wash starting price (Rs.)','199',OG);
  await INP(f,20,564,350,'Full Detailing starting price (Rs.)','699',OG);
  await INP(f,20,638,350,'Interior Cleaning starting price (Rs.)','299',OG);
  await BTN(f,20,710,350,'Save & Continue',OG,WH);
  await LBL(f,'P12 / SERVICES SETUP');
  return f;
};

// P13: BANK ACCOUNT SETUP
const P13 = async () => {
  const f = mk(provPage,5400,'P13 Bank Setup',1);
  tg(f,{r:.05,g:.10,b:.03},180);
  await SB(f);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  await tx(f,'Bank & UPI Details',64,48,15,WH,'Bold');
  await tx(f,'Step 4 of 4 — Payout Information',64,68,10,GR);
  bx(f,20,90,350,4,SURF,1,4); bx(f,20,90,350,4,OG,1,4);
  bx(f,20,108,350,44,GN,.07,12); bx(f,20,108,350,1,GN,.2,12);
  bx(f,30,120,16,16,GN,1,8); await tx(f,'Weekly payouts directly to your bank account',54,122,11,GN,'Semi Bold');
  // UPI
  await tx(f,'UPI ID (Preferred)',20,168,14,WH,'Semi Bold');
  await INP(f,20,194,350,'Your UPI ID','venkat@okhdfcbank',OG);
  bx(f,20,256,350,36,GN,.07,10); bx(f,20,256,350,1,GN,.2,10);
  await tx(f,'Instant payouts via UPI — within 2 hours of job completion',28,268,10,GN);
  // Bank
  await tx(f,'Bank Account (Backup)',20,306,14,WH,'Semi Bold');
  await INP(f,20,332,350,'Account Holder Name','Venkat Ramaiah Sharma',OG);
  await INP(f,20,406,350,'Bank Account Number','XXXX XXXX 4521',OG);
  await INP(f,20,480,350,'IFSC Code','HDFC0001234',OG);
  // Bank selector
  await tx(f,'Bank Name',20,548,11,LG);
  bx(f,20,566,350,48,CARD,1,12); bx(f,20,566,3,48,OG,1,2); bx(f,20,566,350,1,WH,.05,12);
  await tx(f,'HDFC Bank', 36,581, 13, LG); await tx(f,'v',334,581,13,GR);
  // Verify
  bx(f,20,630,350,48,OG,.12,14); bx(f,20,630,350,1,OG,.3,14);
  bx(f,32,644,16,16,OG,.3,8); await tx(f,'!',37,644,10,OG,'Bold');
  await tx(f,'We will send Re.1 test transaction to verify your account',56,640,10,OG);
  await tx(f,'It will be returned within 24 hours',56,658,10,OG);
  await BTN(f,20,696,350,'Verify & Finish Registration',OG,WH);
  // What happens next
  await tx(f,"After submission:",20,762,12,GR,'Semi Bold');
  await tx(f,'Your profile goes live within 24 hrs after KYC approval',20,780,10,GR);
  await LBL(f,'P13 / BANK SETUP');
  return f;
};

// P14: AVAILABILITY CALENDAR
const P14 = async () => {
  const f = mk(provPage,5850,'P14 Availability',1);
  await SB(f);
  await tx(f,'Availability',20,50,20,WH,'Bold');
  await tx(f,'May 2026',272,52,12,GR);
  // Calendar
  CD(f,20,82,350,224);
  bx(f,20,82,350,3,OG,1,2);
  await tx(f,'<',32,98,16,CY,'Bold'); await tx(f,'May 2026',148,98,13,WH,'Semi Bold'); await tx(f,'>',332,98,16,CY,'Bold');
  const dayLbls=['Su','Mo','Tu','We','Th','Fr','Sa'];
  for (let i=0;i<7;i++) await tx(f,dayLbls[i],32+i*46,118,10,GR,'Semi Bold');
  const calDays=[[0,0,0,0,1,2,3],[4,5,6,7,8,9,10],[11,12,13,14,15,16,17],[18,19,20,21,22,23,24],[25,26,27,28,29,30,0]];
  const avail={1:1,2:1,3:1,5:1,6:0,7:1,8:1,9:1,12:1,13:0,14:1,15:0,16:1,19:1,20:1,21:1,22:1,23:0,26:1,27:0,28:1,29:1};
  for (let wk=0;wk<5;wk++){
    for (let d=0;d<7;d++){
      const day=calDays[wk][d];
      if (!day) continue;
      const ox=28+d*46, oy=136+wk*28;
      const av=avail[day];
      if (day===27){ bx(f,ox-2,oy-2,32,24,OG,1,12); }
      else bx(f,ox,oy,28,20,av===1?GN:av===0?RD:SURF,av!=null?.15:0,10);
      await tx(f,String(day), ox+5,oy+4, 11, day===27?BK:av===1?GN:av===0?RD:GR, day===27?'Bold':'Regular');
    }
  }
  bx(f,20,306,350,1,EDGE,.5);
  // Legend
  for (const [col,lbl,c] of [[28,'Available',GN],[138,'Unavailable',RD],[248,'Holiday',GR]]){
    bx(f,col,318,8,8,c,1,4); await tx(f,lbl, col+14,316, 10, LG);
  }
  // Time slots
  await tx(f,'Working Hours — May 27',20,346,14,WH,'Semi Bold');
  bx(f,250,342,90,28,OG,.15,14); await tx(f,'Edit Day',260,351,10,OG,'Semi Bold');
  CD(f,20,382,350,80);
  await tx(f,'Start: 8:00 AM',32,396,13,WH,'Semi Bold');
  await tx(f,'End: 7:00 PM',32,418,13,WH,'Semi Bold');
  await tx(f,'Max Jobs: 6  /  Booked: 3  /  Available: 3',32,440,10,GR);
  // Blocked slots
  await tx(f,'Mark Unavailable Dates',20,476,14,WH,'Semi Bold');
  bx(f,20,498,350,100,CARD,1,14);
  await tx(f,'28 May 2026  (Tomorrow)',32,512,12,WH,'Semi Bold');
  bx(f,260,508,84,26,RD,.15,13); await tx(f,'Block Day',266,515,10,RD,'Semi Bold');
  await tx(f,'Reason:',32,542,11,GR);
  bx(f,88,535,246,34,SURF,1,10); bx(f,88,535,246,1,WH,.05,10);
  await tx(f,'Personal leave  v',96,548,11,LG);
  await BTN(f,20,614,350,'Save Schedule',OG,WH);
  bx(f,20,680,350,78,{r:.07,g:.07,b:.09},1,14);
  await tx(f,'Weekly Summary',30,694,12,WH,'Semi Bold');
  await tx(f,'This week: 18 jobs booked  •  Available: 8 slots  •  Revenue est: Rs.4,860',24,714,9,GR);
  await NAV_P(f,0);
  await LBL(f,'P14 / AVAILABILITY');
  return f;
};

// P15: PROVIDER CHAT
const P15 = async () => {
  const f = mk(provPage,6300,'P15 Provider Chat',1);
  await SB(f);
  bx(f,0,32,W,60,SURF); bx(f,0,32,W,1,EDGE,.5);
  bx(f,16,44,36,36,SURF,1,18); await tx(f,'<',25,51,18,WH,'Bold');
  bx(f,62,48,36,36,CY,.2,18); await tx(f,'RM',72,58,10,BK,'Bold');
  bx(f,48,76,10,10,GN,1,5);
  await tx(f,'Ramprasad Mokka',106,46,13,WH,'Bold');
  await tx(f,'Customer  •  #ORD-7285  •  Active',106,64,10,OG,'Semi Bold');
  bx(f,316,46,44,28,OG,.15,14); await tx(f,'Map',324,53,10,OG,'Semi Bold');
  const pmsgs=[
    {t:'Hi! I\'m on my way, ETA 10 minutes.',from:'prov',tm:'11:00'},
    {t:'Great! I\'m home, main gate is open.',from:'cust',tm:'11:01'},
    {t:'Could you also check tyres please?',from:'cust',tm:'11:02'},
    {t:'Sure, that\'s included in premium.',from:'prov',tm:'11:02'},
    {t:'Please have some water or area for my equipment.',from:'prov',tm:'11:04'},
    {t:'Done, I\'ve set up near the parking.',from:'cust',tm:'11:06'},
    {t:'Reached! Starting the job now. OTP: 4821',from:'prov',tm:'11:14'},
  ];
  let pcy=104;
  for (const m of pmsgs){
    const isp=m.from==='prov';
    const bw=Math.min(230, m.t.length*6.5+24);
    const bx2=isp?20:W-20-bw;
    bx(f,bx2,pcy,bw,40,isp?CARD:OG,1,16);
    await tx(f,m.t, bx2+10,pcy+12, 11, isp?LG:BK);
    await tx(f,m.tm, bx2+(isp?0:bw-28),pcy+44, 9, GR);
    pcy+=60;
  }
  bx(f,0,566,W,1,EDGE,.3);
  const pqr=['OTP Sent!','Job Done!','On my way!','Need help?'];
  let qrx2=14;
  for (const q of pqr){
    const qw=q.length*7+16;
    bx(f,qrx2,574,qw,28,SURF,1,14); bx(f,qrx2,574,qw,1,WH,.05,14);
    await tx(f,q, qrx2+7,580, 10, LG);
    qrx2+=qw+8;
  }
  bx(f,0,H-80,W,80,DP); bx(f,0,H-80,W,1,EDGE,.5);
  bx(f,12,H-62,274,44,CARD,1,22); bx(f,12,H-62,274,1,WH,.05,22);
  await tx(f,'Type a message...', 28,H-46, 12, GR);
  bx(f,294,H-62,36,44,SURF,1,18); await tx(f,'Att',302,H-48,9,GR);
  bx(f,336,H-62,36,44,OG,1,22); await tx(f,'>',347,H-48,14,BK,'Bold');
  await LBL(f,'P15 / PROVIDER CHAT');
  return f;
};

// P16: PROVIDER NOTIFICATIONS
const P16 = async () => {
  const f = mk(provPage,6750,'P16 P Notifications',1);
  await SB(f);
  await tx(f,'Notifications',20,50,20,WH,'Bold');
  bx(f,280,46,80,28,OG,.15,14); await tx(f,'Mark Read',284,54,9,OG);
  await tx(f,'Today',20,92,12,GR,'Semi Bold');
  const pnotifs=[
    {t:'New Job Request',b:'Ramprasad M. — Premium Car Wash — Rs.349 — 1.2 km',dt:'2 min',c:OG,dot:true},
    {t:'Payment Settled',b:'Rs.286 settled for Job #7284 — credited to HDFC',dt:'1 hr',c:GN,dot:true},
    {t:'Customer Review',b:'Ramprasad gave you 5 stars! "Excellent service"',dt:'3 hrs',c:ST,dot:false},
    {t:'Job Cancelled',b:'Neha Sharma cancelled 2:00 PM booking (full payout protected)',dt:'4 hrs',c:RD,dot:false},
  ];
  let pny=112;
  for (const n of pnotifs){
    CD(f,20,pny,350,92);
    bx(f,28,pny+16,42,42,n.c,.15,21); bx(f,30,pny+18,38,38,n.c,.2,19);
    if (n.dot){ bx(f,352,pny+8,10,10,OG,1,5); }
    await tx(f,n.t, 82,pny+14, 13, WH,'Semi Bold');
    await tx(f,n.b.substring(0,48)+(n.b.length>48?'...':''), 82,pny+34, 10, GR);
    await tx(f,n.dt+' ago', 272,pny+14, 9, GR);
    pny+=100;
  }
  await tx(f,'Earlier',20,524,12,GR,'Semi Bold');
  const pold=[
    {t:'Weekly Payout',b:'Rs.3,240 transferred to your HDFC account',c:GN},
    {t:'New Feature',b:'You can now set per-hour pricing on ServiCo',c:CY},
    {t:'Performance Badge',b:'You earned "Top Rated" badge this week!',c:AM},
    {t:'KYC Reminder',b:'Please re-upload your PAN card — expires next month',c:RD},
  ];
  for (let i=0;i<pold.length;i++){
    const n=pold[i], oy=544+i*76;
    bx(f,20,oy,350,68,{r:.09,g:.09,b:.11},1,14); bx(f,20,oy,350,1,WH,.03,14);
    bx(f,28,oy+14,34,34,n.c,.12,17);
    await tx(f,n.t, 74,oy+12, 12, GR,'Semi Bold');
    await tx(f,n.b.substring(0,46)+(n.b.length>46?'...':''), 74,oy+30, 10, GR);
  }
  await NAV_P(f,0);
  await LBL(f,'P16 / P NOTIFICATIONS');
  return f;
};

// P17: JOB HISTORY DETAIL
const P17 = async () => {
  const f = mk(provPage,7200,'P17 Job History',1);
  await SB(f);
  await tx(f,'Job History',20,50,20,WH,'Bold');
  await tx(f,'May 2026  •  24 jobs',266,52,10,GR);
  // Summary
  bx(f,20,82,350,56,{r:.07,g:.07,b:.09},1,14); bx(f,20,82,350,2,OG,.4,2);
  const hsum=[['24','Jobs'],['4.8','Rating'],['94%','Accept'],['Rs18.4K','Earned']];
  for (let i=0;i<4;i++){
    await tx(f,hsum[i][0], 30+i*86,92, 14, [OG,ST,GN,CY][i],'Bold');
    await tx(f,hsum[i][1], 30+i*86,112, 9, GR);
    if (i<3) bx(f,30+(i+1)*86-4,92,1,28,EDGE,.5);
  }
  // Filter
  const hfilt=['All','Completed','Cancelled','Disputed'];
  let hfx=20;
  for (let i=0;i<hfilt.length;i++){
    const fw=hfilt[i].length*7+18, s=i===0;
    bx(f,hfx,152,fw,28,s?OG:SURF,1,14);
    if (!s) bx(f,hfx,152,fw,1,WH,.04,14);
    await tx(f,hfilt[i], hfx+6,159, 10, s?BK:LG, s?'Bold':'Regular');
    hfx+=fw+6;
  }
  // Job cards
  const jobs=[
    {id:'7284',cust:'Ramprasad Mokka',svc:'Premium Car Wash',dt:'27 May  11:00',pay:'Rs.286',r:5,s:'Completed',sc:GN},
    {id:'7283',cust:'Neha Sharma',svc:'Basic Wash',dt:'27 May  9:00',pay:'Rs.118',r:5,s:'Completed',sc:GN},
    {id:'7280',cust:'Rahul Verma',svc:'Tyre Change',dt:'26 May  4:30',pay:'Rs.196',r:4,s:'Completed',sc:GN},
    {id:'7275',cust:'Priya Patel',svc:'AC Repair',dt:'26 May  2:00',pay:'Rs.474',r:5,s:'Completed',sc:GN},
    {id:'7268',cust:'Vikram N.',svc:'Full Detail',dt:'25 May  10:00',pay:'Rs.0',r:0,s:'Cancelled',sc:RD},
    {id:'7260',cust:'Anil Kumar',svc:'Engine Check',dt:'24 May  3:00',pay:'Rs.190',r:4,s:'Completed',sc:GN},
  ];
  for (let i=0;i<jobs.length;i++){
    const j=jobs[i], oy=190+i*96;
    CD(f,20,oy,350,86); bx(f,20,oy,3,86,j.sc,1,2);
    await tx(f,'#'+j.id, 28,oy+8, 10, GR);
    await BDG(f,220,oy+6,j.s,j.sc);
    await tx(f,j.dt, 272,oy+8, 9, GR);
    bx(f,30,oy+28,36,36,CY,.18,18); await tx(f,j.cust[0], 44,oy+40, 11, CY,'Bold');
    await tx(f,j.cust, 78,oy+26, 12, WH,'Semi Bold');
    await tx(f,j.svc, 78,oy+44, 10, GR);
    if (j.r>0){ for (let s=0;s<5;s++) await tx(f,'*',78+s*14,oy+62,11,s<j.r?ST:EDGE,'Bold'); }
    await tx(f,j.pay, 290,oy+32, 14, CY,'Bold');
  }
  await NAV_P(f,1);
  await LBL(f,'P17 / JOB HISTORY');
  return f;
};

// P18: PROVIDER PERFORMANCE
const P18 = async () => {
  const f = mk(provPage,7650,'P18 Performance',1);
  tg(f,{r:.05,g:.10,b:.03},220);
  await SB(f);
  await tx(f,'My Performance',20,50,20,WH,'Bold');
  await tx(f,'May 2026',280,52,12,GR);
  // Rating card
  CD(f,20,82,350,100); bx(f,20,82,350,4,OG,1,2);
  await tx(f,'Overall Rating',30,96,12,GR);
  await tx(f,'4.8',30,114,36,OG,'Bold');
  await tx(f,'/ 5.0',92,130,14,GR);
  for (let i=0;i<5;i++) await tx(f,'*',30+i*24,156,18,i<4.8?OG:EDGE,'Bold');
  await tx(f,'Based on 342 reviews',144,160,10,GR);
  // Rating breakdown
  for (let r=5;r>=1;r--){
    const oy=196+(5-r)*28, count=[210,92,28,8,4][5-r], pct=count/342;
    await tx(f,String(r)+'*', 28,oy, 10, OG,'Semi Bold');
    bx(f,54,oy+2,220,16,SURF,1,8);
    bx(f,54,oy+2,Math.round(220*pct),16,OG,.7,8);
    await tx(f,String(count), 284,oy, 10, GR);
  }
  // KPIs
  await tx(f,'Key Metrics — This Month',20,346,14,WH,'Semi Bold');
  const kpis=[
    {v:'94%',l:'Accept Rate',c:GN,t:'+2%'},
    {v:'24',l:'Jobs Completed',c:CY,t:'+6'},
    {v:'98%',l:'On-Time Rate',c:OG,t:'+1%'},
    {v:'0',l:'Complaints',c:GN,t:'Clean'},
    {v:'30min',l:'Avg Response',c:AM,t:'-5min'},
    {v:'100%',l:'OTP Verified',c:CY,t:'Perfect'},
  ];
  for (let i=0;i<kpis.length;i++){
    const col=i%3, rw=Math.floor(i/3);
    const ox=20+col*118, oy=372+rw*82;
    CD(f,ox,oy,108,70); bx(f,ox,oy,108,3,kpis[i].c,1,2);
    await tx(f,kpis[i].v, ox+8,oy+12, 17, kpis[i].c,'Bold');
    await tx(f,kpis[i].l, ox+8,oy+40, 8, GR);
    bx(f,ox+62,oy+10,40,18,GN,.12,9); await tx(f,kpis[i].t, ox+64,oy+13, 8, GN,'Semi Bold');
  }
  // Reviews sample
  await tx(f,'Recent Reviews',20,548,14,WH,'Semi Bold');
  const prv=[
    {n:'Ramprasad M.',r:5,t:'"Suresh is the best! Super professional and fast."',d:'27 May'},
    {n:'Neha S.',r:5,t:'"Car looks showroom fresh. Will definitely rebook."',d:'25 May'},
    {n:'Rahul V.',r:4,t:'"Good work, slight delay but overall satisfied."',d:'24 May'},
  ];
  for (let i=0;i<prv.length;i++){
    const rv=prv[i], oy=572+i*84;
    CD(f,20,oy,350,76);
    await AV(f,28,oy+14,36,rv.n[0]+rv.n[rv.n.indexOf(' ')+1],CY);
    await tx(f,rv.n, 74,oy+12, 12, WH,'Semi Bold');
    for (let s=0;s<5;s++) await tx(f,'*',74+s*16,oy+30,12,s<rv.r?ST:EDGE,'Bold');
    await tx(f,rv.d, 302,oy+12, 9, GR);
    await tx(f,rv.t, 28,oy+52, 10, LG);
  }
  await NAV_P(f,2);
  await LBL(f,'P18 / PERFORMANCE');
  return f;
};

// P19: PROVIDER HELP & SUPPORT
const P19 = async () => {
  const f = mk(provPage,8100,'P19 Provider Help',1);
  await SB(f);
  await HDR(f,'Help & Support');
  bx(f,20,88,350,72,{r:.06,g:.12,b:.03},1,14); bx(f,20,88,350,3,OG,1,2);
  await tx(f,'Partner Support',30,104,14,WH,'Bold');
  await tx(f,'Dedicated line for ServiCo partners',30,124,11,GR);
  bx(f,220,96,56,28,OG,.15,14); await tx(f,'Call',232,105,11,OG,'Semi Bold');
  bx(f,284,96,56,28,GN,.15,14); await tx(f,'Chat',296,105,11,GN,'Semi Bold');
  await tx(f,'Partner FAQs',20,176,14,WH,'Semi Bold');
  const pfaqs=[
    {q:'When do I get paid?',a:'Every Wednesday for jobs completed Mon-Sun prior week.',open:true},
    {q:'What if customer cancels last minute?',a:'You receive 50% payout for cancellations under 2 hrs.',open:false},
    {q:'How to dispute a complaint?',a:'Go to Job → Report Issue → Submit evidence in-app.',open:false},
    {q:'Can I change my service area?',a:'Yes, update in Profile → Manage Services anytime.',open:false},
    {q:'How is my rating calculated?',a:'Rolling 90-day average of all verified job ratings.',open:false},
    {q:'What if I face an issue at customer site?',a:'Call partner support 24x7 — we\'ll mediate immediately.',open:false},
  ];
  let pfay=202;
  for (const fq of pfaqs){
    const hh=fq.open?80:46;
    CD(f,20,pfay,350,hh); bx(f,20,pfay,4,hh,OG,.6,2);
    await tx(f,fq.q, 32,pfay+14, 12, WH,'Semi Bold');
    await tx(f,fq.open?'v':'>',328,pfay+14,12,fq.open?OG:GR,'Bold');
    if (fq.open){ await tx(f,fq.a, 32,pfay+36, 11, GR); }
    pfay+=hh+8;
  }
  bx(f,20,692,350,60,{r:.08,g:.04,b:.04},1,16); bx(f,20,692,350,2,RD,.4,2);
  await tx(f,'Submit a Dispute or Appeal',30,708,13,WH,'Semi Bold');
  await tx(f,'Complaints, rating appeals, payout issues — we respond in 4 hrs',30,728,10,GR);
  bx(f,268,702,80,26,RD,.15,13); await tx(f,'Submit ->',274,710,9,RD,'Semi Bold');
  await tx(f,'Partner Helpline: 1800-123-4567 (24x7 Free)',62,770,11,GR);
  await LBL(f,'P19 / PROVIDER HELP');
  return f;
};

const p1=await P1(), p2=await P2(), p3=await P3();
const p4=await P4(), p5=await P5(), p6=await P6();
const p7=await P7(), p8=await P8(), p9=await P9(), p10=await P10();
const p11=await P11(), p12=await P12(), p13=await P13(), p14=await P14();
const p15=await P15(), p16=await P16(), p17=await P17(), p18=await P18();
const p19=await P19();
console.log('Provider screens done (45/84) — extended screens built after Admin definitions');

// ════════════════════════════════════════════════════════════
//  ADMIN — Row 3  (y = 1920)
// ════════════════════════════════════════════════════════════

// A1: ADMIN DASHBOARD
const A1 = async () => {
  const f = mk(adminPage,0,'A1 Admin Dashboard',2);
  tg(f,{r:.09,g:.04,b:.18},240);
  await SB(f);
  // Header
  await AV(f,20,42,46,'AD',PK);
  await tx(f,'ServiCo Admin',78,44,12,GR);
  await tx(f,'Control Panel',78,62,15,WH,'Bold');
  bx(f,316,44,36,36,SURF,1,18); await tx(f,'Bell',320,53,10,LG);
  // KPI row 1
  await tx(f,'Live Platform Stats',20,102,14,WH,'Semi Bold');
  await tx(f,'27 May 2026  +  9:41 AM',216,104,10,GR);
  const kpi1=[['1,284','Orders Today',CY],['Rs42.6K','Revenue Today',GN],['186','Active Now',OG]];
  for (let i=0;i<3;i++){
    const ox=20+i*118;
    CD(f,ox,122,108,70); bx(f,ox,122,108,3,kpi1[i][2],1,2);
    await tx(f,kpi1[i][0], ox+8,134, 18, kpi1[i][2],'Bold');
    await tx(f,kpi1[i][1], ox+8,166, 9, GR);
  }
  // KPI row 2
  const kpi2=[['2,841','Customers',BL],['342','Providers',AM],['14','Complaints',RD],['98.2%','Uptime',GN]];
  for (let i=0;i<4;i++){
    const ox=20+i*88;
    CD(f,ox,202,80,58,12); bx(f,ox,202,80,2,kpi2[i][2],1,2);
    await tx(f,kpi2[i][0], ox+6,212, 14, kpi2[i][2],'Bold');
    await tx(f,kpi2[i][1], ox+6,238, 8, GR);
  }
  // Revenue chart
  await tx(f,'Revenue Trend — Last 7 Days',20,272,14,WH,'Semi Bold');
  CD(f,20,294,350,110);
  const rv=[28000,35000,31000,42000,38000,44000,42600];
  const rvd=['21','22','23','24','25','26','27'];
  for (let i=0;i<7;i++){
    const bh=Math.floor((rv[i]/44000)*76), ox=28+i*46;
    bx(f,ox,360-bh,28,bh,PK,i===6?1:.4,3);
    await tx(f,rvd[i], ox+5,366, 9, GR);
  }
  await tx(f,'Rs44K peak',310,298,9,PK,'Semi Bold');
  // Alerts
  await tx(f,'Platform Alerts',20,418,14,WH,'Semi Bold');
  const alerts=[
    {t:'3 complaints pending urgent review',c:RD},
    {t:'2 new provider KYC submissions',    c:AM},
    {t:'Payment gateway latency +120ms',    c:OG},
  ];
  for (let i=0;i<3;i++){
    const al=alerts[i], oy=440+i*52;
    CD(f,20,oy,350,44); bx(f,20,oy,4,44,al.c,1,2);
    bx(f,30,oy+12,20,20,al.c,.2,10);
    await tx(f,'!', 36,oy+14, 11, al.c,'Bold');
    await tx(f,al.t, 58,oy+14, 12, LG);
    await tx(f,'Review ->', 296,oy+14, 10, al.c);
  }
  // Quick actions
  await tx(f,'Quick Actions',20,598,14,WH,'Semi Bold');
  const qa=['Add Service','Block User','Send Notice','Export CSV'];
  for (let i=0;i<4;i++){
    const col=i%2, row=Math.floor(i/2), ox=20+col*178, oy=620+row*56;
    CD(f,ox,oy,164,48); bx(f,ox,oy,164,2,PK,.4,2);
    await tx(f,qa[i], ox+14,oy+15, 12, LG);
    await tx(f,'->', ox+136,oy+15, 13, PK,'Bold');
  }
  await NAV_A(f,0);
  await LBL(f,'A1 / ADMIN DASHBOARD');
  return f;
};

// A2: USER MANAGEMENT
const A2 = async () => {
  const f = mk(adminPage,450,'A2 User Management',2);
  await SB(f);
  await HDR(f,'User Management');
  // Tabs
  bx(f,20,82,350,36,SURF,1,18);
  const tabs3=['Customers','Providers','Blocked'];
  for (let i=0;i<3;i++){
    const s=i===0, tw=116;
    bx(f,22+i*tw,84,tw,32,s?PK:{r:0,g:0,b:0},s?1:0,14);
    await tx(f,tabs3[i], 22+i*tw+20,92, 12, s?WH:GR, s?'Semi Bold':'Regular');
  }
  // Search
  bx(f,20,126,350,40,SURF,1,12); bx(f,20,126,350,1,WH,.05,12);
  await tx(f,'Search name, mobile, email...', 36,138, 11, GR);
  // Summary
  bx(f,20,174,350,44,{r:.07,g:.07,b:.09},1,12);
  await tx(f,'Total: 2,841', 28,187, 11, LG);
  await tx(f,'Active: 2,798', 130,187, 11, GN,'Semi Bold');
  await tx(f,'Suspended: 43', 240,187, 11, RD);
  // Users
  const users=[
    {n:'Ramprasad Mokka', ph:'+91 98765 43210',bk:'12',s:'Active',   sc:GN,dt:'15 Jan 2024'},
    {n:'Neha Sharma',     ph:'+91 87654 32109',bk:'8', s:'Active',   sc:GN,dt:'20 Feb 2024'},
    {n:'Sai Krishna T.',  ph:'+91 65432 10987',bk:'21',s:'VIP',      sc:AM,dt:'08 Nov 2023'},
    {n:'Rahul Verma',     ph:'+91 76543 21098',bk:'3', s:'Active',   sc:GN,dt:'01 Mar 2024'},
    {n:'Priya Patel',     ph:'+91 54321 09876',bk:'0', s:'Suspended',sc:RD,dt:'12 Apr 2024'},
  ];
  for (let i=0;i<5;i++){
    const u=users[i], oy=226+i*86;
    CD(f,20,oy,350,78);
    await AV(f,30,oy+14,42,u.n[0]+u.n[u.n.indexOf(' ')+1],PK);
    await tx(f,u.n, 84,oy+12, 12, WH,'Semi Bold');
    await tx(f,u.ph, 84,oy+30, 10, GR);
    await tx(f,u.bk+' bookings  +  Joined '+u.dt, 84,oy+48, 9, GR);
    await BDG(f,84,oy+62,u.s,u.sc);
    bx(f,274,oy+12,66,24,PK,.12,12); await tx(f,'View',286,oy+19,10,PK);
    bx(f,274,oy+42,66,24,u.s==='Suspended'?GN:RD,.12,12);
    await tx(f,u.s==='Suspended'?'Restore':'Block', 278,oy+49, 10, u.s==='Suspended'?GN:RD);
  }
  await NAV_A(f,1);
  await LBL(f,'A2 / USER MANAGEMENT');
  return f;
};

// A3: ORDERS MONITOR
const A3 = async () => {
  const f = mk(adminPage,900,'A3 Orders Monitor',2);
  await SB(f);
  await tx(f,'Orders Monitor',20,50,20,WH,'Bold');
  await tx(f,'1,284 today',272,52,10,GR);
  // Filter chips
  const filt=['All','Live','Completed','Cancelled','Disputed'];
  let fx2=20;
  for (let i=0;i<filt.length;i++){
    const fw=filt[i].length*7+22, s=i===1;
    bx(f,fx2,82,fw,28,s?PK:SURF,1,14);
    if (!s) bx(f,fx2,82,fw,1,WH,.04,14);
    await tx(f,filt[i], fx2+8,89, 10, s?WH:LG, s?'Semi Bold':'Regular');
    fx2+=fw+6;
  }
  // Live strip
  bx(f,20,118,350,44,{r:.07,g:.04,b:.14},1,14); bx(f,20,118,350,2,PK,.4,2);
  await tx(f,'LIVE:',28,132,11,PK,'Bold');
  await tx(f,'186 active  +  34 en-route  +  12 in-service',72,132,11,LG);
  // Orders
  const ords2=[
    {id:'7284',cust:'Ramprasad M.', prov:'CleanMax Auto', svc:'Premium Wash', amt:'Rs349',s:'In Progress',sc:GN},
    {id:'7283',cust:'Neha S.',       prov:'Swift Wash',    svc:'Basic Wash',   amt:'Rs149',s:'En Route',   sc:CY},
    {id:'7282',cust:'Rahul V.',      prov:'ProShine',      svc:'Full Detail',  amt:'Rs699',s:'Completed',  sc:GR},
    {id:'7281',cust:'Sai K.',        prov:'QuickWash',     svc:'Ext Wash',     amt:'Rs99', s:'Completed',  sc:GR},
    {id:'7280',cust:'Priya P.',      prov:'CleanMax',      svc:'Premium Wash', amt:'Rs349',s:'Cancelled',  sc:RD},
    {id:'7279',cust:'Vikram N.',     prov:'ProShine',      svc:'Tyre Change',  amt:'Rs249',s:'Disputed',   sc:AM},
  ];
  for (let i=0;i<6;i++){
    const o=ords2[i], oy=170+i*82;
    CD(f,20,oy,350,74); bx(f,20,oy,3,74,o.sc,1,2);
    await tx(f,'#'+o.id, 28,oy+8, 10, GR);
    await BDG(f,230,oy+6,o.s,o.sc);
    await tx(f,o.cust, 28,oy+26, 12, WH,'Semi Bold');
    await tx(f,o.prov+'  +  '+o.svc, 28,oy+44, 10, GR);
    await tx(f,o.amt, 296,oy+26, 14, CY,'Bold');
    bx(f,274,oy+46,68,22,PK,.12,11); await tx(f,'Track ->',278,oy+52,9,PK);
  }
  await NAV_A(f,2);
  await LBL(f,'A3 / ORDERS MONITOR');
  return f;
};

// A4: COMPLAINTS
const A4 = async () => {
  const f = mk(adminPage,1350,'A4 Complaints',2);
  await SB(f);
  await tx(f,'Complaints',20,50,20,WH,'Bold');
  bx(f,278,46,82,30,RD,.15,15); await tx(f,'14 Open',289,54,11,RD,'Semi Bold');
  // Priority tabs
  const ptabs=['All','Critical','High','Resolved'];
  let otx=20;
  for (let i=0;i<ptabs.length;i++){
    const fw=ptabs[i].length*8+20, s=i===1;
    bx(f,otx,88,fw,30,s?RD:SURF,1,15);
    if (!s) bx(f,otx,88,fw,1,WH,.04,15);
    await tx(f,ptabs[i], otx+8,96, 11, s?WH:LG, s?'Semi Bold':'Regular');
    otx+=fw+8;
  }
  // Complaints
  const comps=[
    {id:'CMP-041',cust:'Ramprasad M.',  issue:'Provider arrived 45 min late, car scratched during wash', pri:'Critical',pc:RD,dt:'Today 11:30',s:'Pending'},
    {id:'CMP-040',cust:'Sai Krishna T.',issue:'Wrong package charged — billed Premium for Basic wash',    pri:'High',    pc:AM,dt:'Today 10:15',s:'Investigating'},
    {id:'CMP-039',cust:'Neha Sharma',   issue:'Technician was rude and unprofessional',                   pri:'Medium',  pc:OG,dt:'Yesterday',  s:'Investigating'},
    {id:'CMP-038',cust:'Priya Patel',   issue:'Refund not processed after 7 business days',               pri:'High',    pc:AM,dt:'25 May',      s:'Escalated'},
    {id:'CMP-037',cust:'Vikram N.',     issue:'App crashed during payment, money deducted, no booking',   pri:'Critical',pc:RD,dt:'24 May',      s:'Resolved'},
  ];
  for (let i=0;i<comps.length;i++){
    const c=comps[i], oy=130+i*112;
    CD(f,20,oy,350,100); bx(f,20,oy,4,100,c.pc,1,2);
    bx(f,20,oy,350,28,SURF,.4,16);
    await tx(f,c.id, 28,oy+8, 10, GR);
    await BDG(f,168,oy+6,c.pri,c.pc);
    await tx(f,c.dt, 280,oy+8, 9, GR);
    await tx(f,c.cust, 28,oy+34, 12, WH,'Semi Bold');
    await tx(f,c.issue.substring(0,54)+(c.issue.length>54?'...':''), 28,oy+52, 10, LG);
    await BDG(f,28,oy+72,c.s,c.pc);
    bx(f,216,oy+70,70,22,PK,.12,11); await tx(f,'Respond',220,oy+76,9,PK);
    bx(f,292,oy+70,60,22,c.s==='Resolved'?GN:RD,.12,11);
    await tx(f,c.s==='Resolved'?'Closed':'Escalate', 296,oy+76, 9, c.s==='Resolved'?GN:RD);
  }
  await NAV_A(f,3);
  await LBL(f,'A4 / COMPLAINTS');
  return f;
};

// A5: ANALYTICS
const A5 = async () => {
  const f = mk(adminPage,1800,'A5 Analytics',2);
  tg(f,{r:.09,g:.04,b:.18},220);
  await SB(f);
  await tx(f,'Analytics',20,50,20,WH,'Bold');
  // Period toggle
  bx(f,20,82,350,32,SURF,1,16);
  const periods=['Today','Week','Month','Year'];
  for (let i=0;i<4;i++){
    const s=i===2;
    bx(f,22+i*87,84,85,28,s?PK:{r:0,g:0,b:0},s?1:0,14);
    await tx(f,periods[i], 22+i*87+22,91, 11, s?WH:GR, s?'Semi Bold':'Regular');
  }
  // KPI grid
  const mets=[
    ['Rs4.28L','Total Revenue',GN, '+18%'],
    ['8,421',  'Orders',       CY, '+12%'],
    ['2,841',  'Active Users', BL, '+24%'],
    ['4.76',   'Avg Rating',   ST, '+0.2'],
  ];
  for (let i=0;i<4;i++){
    const col=i%2, row=Math.floor(i/2), ox=20+col*178, oy=126+row*78;
    CD(f,ox,oy,164,68); bx(f,ox,oy,164,3,mets[i][2],1,2);
    await tx(f,mets[i][0], ox+10,oy+10, 17, mets[i][2],'Bold');
    await tx(f,mets[i][1], ox+10,oy+38, 9, GR);
    bx(f,ox+110,oy+10,46,18,mets[i][2],.15,9);
    await tx(f,mets[i][3], ox+114,oy+13, 9, mets[i][2],'Semi Bold');
  }
  // Trend chart
  await tx(f,'Revenue Trend — May 2026',20,294,14,WH,'Semi Bold');
  CD(f,20,316,350,110);
  const pts=[60,48,72,42,86,58,94,64,78,52,88,70];
  for (let i=0;i<pts.length;i++){
    const dx=28+i*27, dy=400-pts[i];
    bx(f,dx,dy,6,6,PK,1,3);
    if (i<pts.length-1){
      const nx=28+(i+1)*27, ny=400-pts[i+1];
      const minY=Math.min(dy,ny), diffH=Math.max(Math.abs(dy-ny),1);
      bx(f,dx+3,minY+3,nx-dx,diffH,PK,.3,1);
    }
  }
  await tx(f,'Rs4.28L this month  +  Peak: Week 3',28,404,9,GR);
  // Top services table
  await tx(f,'Top Services',20,438,14,WH,'Semi Bold');
  bx(f,20,460,350,26,SURF,1,14);
  await tx(f,'Service',28,468,10,GR,'Semi Bold');
  await tx(f,'Orders',164,468,10,GR,'Semi Bold');
  await tx(f,'Revenue',238,468,10,GR,'Semi Bold');
  await tx(f,'Share',316,468,10,GR,'Semi Bold');
  const svcs=[
    ['Car Wash',    '3,421','Rs1.72L','40%',CY],
    ['AC Repair',   '1,840','Rs1.10L','26%',OG],
    ['Tyre Fix',    '1,203','Rs0.60L','14%',GN],
    ['Full Detail', '862',  'Rs0.60L','14%',PK],
    ['Cleaning',    '512',  'Rs0.26L','6%', BL],
  ];
  for (let i=0;i<5;i++){
    const sv=svcs[i], oy=486+i*44;
    bx(f,20,oy,350,38,i%2===0?CARD:{r:.09,g:.09,b:.11},1,10);
    bx(f,20,oy,3,38,sv[4],1,2);
    await tx(f,sv[0], 28,oy+12, 11, WH);
    await tx(f,sv[1], 160,oy+12, 11, LG);
    await tx(f,sv[2], 234,oy+12, 11, CY);
    await tx(f,sv[3], 316,oy+12, 11, sv[4],'Semi Bold');
  }
  // Footer
  bx(f,20,712,350,44,CARD,1,14); bx(f,20,712,4,44,PK,1,2);
  await tx(f,'Top City: Hyderabad  +  62% orders  +  Rs2.65L revenue',26,724,10,LG);
  await tx(f,'Export PDF ->',284,742,10,PK);
  await NAV_A(f,3);
  await LBL(f,'A5 / ANALYTICS');
  return f;
};

// A6: PROVIDER VERIFICATION
const A6 = async () => {
  const f = mk(adminPage,2250,'A6 Provider Verification',2);
  await SB(f);
  await tx(f,'Provider Verification',20,50,20,WH,'Bold');
  bx(f,270,46,90,30,AM,.15,15); await tx(f,'2 Pending',280,54,11,AM,'Semi Bold');
  const vtabs=['Pending (2)','Approved','Rejected'];
  let vfx=20;
  for (let i=0;i<vtabs.length;i++){
    const fw=vtabs[i].length*7.5+20, s=i===0;
    bx(f,vfx,88,fw,30,s?AM:SURF,1,15);
    if (!s) bx(f,vfx,88,fw,1,WH,.04,15);
    await tx(f,vtabs[i], vfx+8,96, 11, s?BK:LG, s?'Bold':'Regular');
    vfx+=fw+8;
  }
  const kycs=[
    {n:'Ramesh Nair',biz:'FastWash Mobile Services',city:'Jubilee Hills, Hyderabad',sub:'2 hrs ago',docs:['Aadhaar','PAN','Driving Licence']},
    {n:'Suresh B.',biz:'BrightShine Auto Care',city:'Gachibowli, Hyderabad',sub:'5 hrs ago',docs:['Aadhaar','PAN']},
  ];
  for (let i=0;i<kycs.length;i++){
    const k=kycs[i], oy=130+i*270;
    CD(f,20,oy,350,258); bx(f,20,oy,350,3,AM,1,2);
    bx(f,20,oy,350,30,SURF,.4,16);
    await tx(f,'Application #KYC-'+(24-i), 28,oy+8, 10, GR);
    await BDG(f,226,oy+6,'Pending',AM);
    await tx(f,k.sub, 278,oy+8, 9, GR);
    bx(f,30,oy+38,48,48,OG,.18,24); bx(f,32,oy+40,44,44,OG,.22,22);
    await tx(f,k.n[0], 50,oy+56, 14, OG,'Bold');
    await tx(f,k.n, 90,oy+38, 13, WH,'Bold');
    await tx(f,k.biz, 90,oy+58, 11, GR);
    await tx(f,k.city, 90,oy+76, 10, GR);
    await tx(f,'Submitted Documents:',28,oy+104,11,LG,'Semi Bold');
    for (let j=0;j<k.docs.length;j++){
      bx(f,28,oy+122+j*24,8,8,GN,1,4);
      await tx(f,k.docs[j]+' — Uploaded', 44,oy+120+j*24, 10, GR);
      bx(f,240,oy+118+j*24,60,18,BL,.12,9); await tx(f,'Preview',244,oy+122+j*24,9,BL);
    }
    const dy=oy+114+(k.docs.length*26);
    bx(f,20,dy,350,36,CARD,1,12);
    await tx(f,'Admin Note (optional):', 28,dy+8, 10, GR);
    await tx(f,'Enter review notes here...', 28,dy+22, 10, GR,'Regular',.35);
    bx(f,20,dy+44,158,42,{r:.22,g:.06,b:.06},1,21);
    await tx(f,'Reject', 70,dy+60, 13, RD,'Bold');
    bx(f,194,dy+44,176,42,GN,1,21); bx(f,195,dy+45,174,1,WH,.2,20);
    await tx(f,'Approve & Activate', 214,dy+60, 12, BK,'Bold');
  }
  await NAV_A(f,1);
  await LBL(f,'A6 / PROVIDER VERIFICATION');
  return f;
};

// A7: PROMO MANAGEMENT
const A7 = async () => {
  const f = mk(adminPage,2700,'A7 Promo Management',2);
  await SB(f);
  await tx(f,'Promo Management',20,50,20,WH,'Bold');
  bx(f,280,46,90,30,CY,.15,15); await tx(f,'+ New Promo',288,54,10,CY,'Semi Bold');
  bx(f,20,88,350,52,{r:.07,g:.07,b:.09},1,14); bx(f,20,88,350,2,PK,.4,2);
  const pmeta=[['12','Active Promos'],['4.2K','Uses Today'],['Rs8.6K','Discount Given']];
  for (let i=0;i<3;i++){
    await tx(f,pmeta[i][0], 32+i*112,98, 16, [CY,GN,OG][i],'Bold');
    await tx(f,pmeta[i][1], 32+i*112,120, 9, GR);
    if (i<2) bx(f,32+(i+1)*112-4,98,1,28,EDGE,.5);
  }
  const promos2=[
    {code:'FIRST30',d:'30% off — new user first booking',uses:'8,421',exp:'31 May 2026',budget:'50K',spent:'42K',s:'Active',sc:GN},
    {code:'CLEAN50',d:'Flat Rs.50 off — Premium Wash',uses:'1,284',exp:'15 Jun 2026',budget:'30K',spent:'14K',s:'Active',sc:GN},
    {code:'FLASH20',d:'20% off — flash sale (12-4 PM)',uses:'342',exp:'28 May 4PM',budget:'10K',spent:'9.8K',s:'Expiring',sc:AM},
    {code:'WEEKEND20',d:'20% off — Saturdays & Sundays',uses:'2,180',exp:'30 Jun 2026',budget:'80K',spent:'36K',s:'Active',sc:GN},
    {code:'SUMMER15',d:'15% off — summer special',uses:'0',exp:'01 Jun 2026',budget:'20K',spent:'0',s:'Scheduled',sc:CY},
  ];
  for (let i=0;i<promos2.length;i++){
    const pr=promos2[i], oy=152+i*112;
    CD(f,20,oy,350,102); bx(f,20,oy,4,102,pr.sc,1,2);
    bx(f,20,oy,350,26,SURF,.4,16);
    await tx(f,pr.code, 28,oy+7, 11, pr.sc,'Bold');
    await BDG(f,226,oy+4,pr.s,pr.sc);
    await tx(f,'Exp: '+pr.exp, 274,oy+7, 8, GR);
    await tx(f,pr.d, 28,oy+34, 12, WH,'Semi Bold');
    await tx(f,pr.uses+' uses  |  Budget: Rs'+pr.budget+'  |  Spent: Rs'+pr.spent, 28,oy+54, 9, GR);
    bx(f,28,oy+72,248,8,SURF,1,4);
    const ratio=parseFloat(pr.spent)/parseFloat(pr.budget);
    bx(f,28,oy+72,Math.round(248*Math.min(ratio||0,1)),8,pr.s==='Expiring'?RD:pr.sc,.8,4);
    bx(f,284,oy+64,48,20,PK,.12,10); await tx(f,'Edit',298,oy+68,9,PK);
    bx(f,284,oy+38,48,20,RD,.12,10); await tx(f,'Off',300,oy+42,9,RD);
  }
  await NAV_A(f,0);
  await LBL(f,'A7 / PROMO MANAGEMENT');
  return f;
};

// A8: PAYOUT MANAGEMENT
const A8 = async () => {
  const f = mk(adminPage,3150,'A8 Payout Management',2);
  await SB(f);
  await tx(f,'Payout Management',20,50,20,WH,'Bold');
  bx(f,268,46,94,30,GN,.15,15); await tx(f,'Process All',274,54,10,GN,'Semi Bold');
  const psum=[['Rs2.84L','Pending Payouts',AM],['Rs18.4K','Settled Today',GN],['342','Active Providers',CY]];
  for (let i=0;i<3;i++){
    const ox=20+i*118;
    CD(f,ox,88,108,68); bx(f,ox,88,108,3,psum[i][2],1,2);
    await tx(f,psum[i][0], ox+8,100, 14, psum[i][2],'Bold');
    await tx(f,psum[i][1], ox+8,126, 8, GR);
  }
  const pfilt=['All','Pending','Processing','Settled','Failed'];
  let pfx=20;
  for (let i=0;i<pfilt.length;i++){
    const fw=pfilt[i].length*7+18, s=i===1;
    bx(f,pfx,170,fw,28,s?AM:SURF,1,14);
    if (!s) bx(f,pfx,170,fw,1,WH,.04,14);
    await tx(f,pfilt[i], pfx+6,177, 10, s?BK:LG, s?'Bold':'Regular');
    pfx+=fw+6;
  }
  const payouts=[
    {n:'Venkat Repairs',jobs:3,amt:'Rs.862',dt:'Today',bank:'HDFC ***4521',s:'Pending',sc:AM},
    {n:'Suresh Kumar',jobs:5,amt:'Rs1,240',dt:'Today',bank:'SBI ***9823',s:'Processing',sc:CY},
    {n:'Ramesh Auto',jobs:2,amt:'Rs.586',dt:'Yesterday',bank:'ICICI ***6712',s:'Settled',sc:GN},
    {n:'Priya Services',jobs:4,amt:'Rs.974',dt:'Yesterday',bank:'Axis ***3341',s:'Settled',sc:GN},
    {n:'Clean Bros',jobs:1,amt:'Rs.286',dt:'25 May',bank:'YES ***8823',s:'Failed',sc:RD},
    {n:'AutoPro Wash',jobs:6,amt:'Rs1,680',dt:'25 May',bank:'HDFC ***2210',s:'Settled',sc:GN},
  ];
  for (let i=0;i<payouts.length;i++){
    const py=payouts[i], oy=208+i*90;
    CD(f,20,oy,350,82); bx(f,20,oy,3,82,py.sc,1,2);
    bx(f,28,oy+16,38,38,OG,.18,19); bx(f,30,oy+18,34,34,OG,.22,17);
    await tx(f,py.n[0], 44,oy+28, 12, OG,'Bold');
    await tx(f,py.n, 78,oy+14, 12, WH,'Semi Bold');
    await tx(f,py.jobs+' jobs  +  '+py.bank, 78,oy+32, 10, GR);
    await tx(f,py.dt, 78,oy+52, 9, GR);
    await BDG(f,78,oy+62,py.s,py.sc);
    await tx(f,py.amt, 268,oy+14, 15, CY,'Bold');
    if (py.s==='Pending'){
      bx(f,260,oy+40,72,22,GN,.15,11); await tx(f,'Pay Now',268,oy+46,9,GN,'Semi Bold');
    } else if (py.s==='Failed'){
      bx(f,260,oy+40,72,22,RD,.12,11); await tx(f,'Retry',274,oy+46,9,RD,'Semi Bold');
    } else if (py.s==='Processing'){
      bx(f,252,oy+40,84,22,CY,.1,11); await tx(f,'Processing...',254,oy+46,9,CY);
    }
  }
  await NAV_A(f,0);
  await LBL(f,'A8 / PAYOUT MANAGEMENT');
  return f;
};


// A9: SERVICE CATEGORY MANAGEMENT
const A9 = async () => {
  const f = mk(adminPage,3600,'A9 Category Mgmt',2);
  await SB(f);
  await tx(f,'Service Categories',20,50,19,WH,'Bold');
  bx(f,272,46,88,30,PK,.15,15); await tx(f,'+ New Category',278,54,9,PK,'Semi Bold');
  bx(f,20,88,350,40,SURF,1,14); bx(f,20,88,350,1,WH,.05,14);
  await tx(f,'Search categories...', 38,104, 12, GR);
  bx(f,20,140,350,34,{r:.07,g:.07,b:.09},1,12);
  await tx(f,'12 active  •  2 draft  •  1 archived',28,150,10,LG);
  const allCatsMgmt=[
    {n:'Car Wash',cnt:24,ord:3421,rev:'Rs1.72L',c:CY,s:'Active'},
    {n:'AC Repair',cnt:18,ord:1840,rev:'Rs1.10L',c:OG,s:'Active'},
    {n:'Tyre Fix',cnt:31,ord:1203,rev:'Rs0.60L',c:GN,s:'Active'},
    {n:'Full Detailing',cnt:12,ord:862,rev:'Rs0.60L',c:PK,s:'Active'},
    {n:'Engine Check',cnt:9,ord:421,rev:'Rs0.28L',c:AM,s:'Active'},
    {n:'Interior Cleaning',cnt:22,ord:512,rev:'Rs0.26L',c:BL,s:'Active'},
    {n:'Dent Repair',cnt:7,ord:184,rev:'Rs0.18L',c:RD,s:'Draft'},
    {n:'Battery Service',cnt:15,ord:294,rev:'Rs0.14L',c:ST,s:'Active'},
  ];
  for (let i=0;i<allCatsMgmt.length;i++){
    const cat=allCatsMgmt[i], oy=182+i*80;
    CD(f,20,oy,350,70); bx(f,20,oy,4,70,cat.c,1,2);
    bx(f,30,oy+12,36,36,cat.c,.15,18); bx(f,32,oy+14,32,32,cat.c,.2,16);
    await tx(f,cat.n, 78,oy+12, 13, WH,'Semi Bold');
    await tx(f,cat.cnt+' providers  •  '+cat.ord+' orders  •  '+cat.rev, 78,oy+32, 9, GR);
    await BDG(f,78,oy+50,cat.s,cat.s==='Active'?GN:AM);
    bx(f,254,oy+14,42,20,PK,.12,10); await tx(f,'Edit',262,oy+18,9,PK);
    bx(f,304,oy+14,36,20,cat.s==='Active'?RD:GN,.12,10);
    await tx(f,cat.s==='Active'?'Hide':'Show',306,oy+18,9,cat.s==='Active'?RD:GN);
  }
  await NAV_A(f,0);
  await LBL(f,'A9 / CATEGORY MGMT');
  return f;
};

// A10: PLATFORM SETTINGS
const A10 = async () => {
  const f = mk(adminPage,4050,'A10 Platform Settings',2);
  await SB(f);
  await HDR(f,'Platform Settings');
  const aGroups=[
    {grp:'Pricing & Fees',items:[
      {t:'Platform Commission',s:'18% per transaction'},
      {t:'Cancellation Fee',s:'Customer: Rs.50 / Provider protected'},
      {t:'Minimum Order Value',s:'Rs.99'},
      {t:'Maximum Discount Cap',s:'Rs.500 per order'},
    ]},
    {grp:'Operations',items:[
      {t:'Service Radius',s:'25 km from provider'},
      {t:'Max Providers per Order',s:'Show top 10'},
      {t:'Auto-accept Timeout',s:'5 minutes per provider'},
      {t:'OTP Expiry',s:'10 minutes'},
    ]},
    {grp:'Payment',items:[
      {t:'Payment Gateway',s:'Razorpay — Active'},
      {t:'UPI Mandate',s:'toggle:on'},
      {t:'Wallet Enabled',s:'toggle:on'},
      {t:'BNPL (Pay Later)',s:'toggle:on'},
    ]},
    {grp:'Content & Compliance',items:[
      {t:'Terms & Conditions',s:'Last updated: 01 Jan 2026'},
      {t:'Privacy Policy',s:'Last updated: 01 Jan 2026'},
      {t:'KYC Requirements',s:'Aadhaar + PAN mandatory'},
    ]},
  ];
  let ay=88;
  for (const sg of aGroups){
    await tx(f,sg.grp, 20,ay, 11, PK,'Semi Bold'); ay+=20;
    for (const it of sg.items){
      bx(f,20,ay,350,52,CARD,1,12); bx(f,20,ay,350,1,WH,.05,12);
      await tx(f,it.t, 32,ay+12, 12, WH,'Semi Bold');
      if (it.s.startsWith('toggle:')){
        const on=it.s.endsWith('on');
        bx(f,290,ay+16,48,20,on?GN:EDGE,1,10); bx(f,on?314:294,ay+18,16,16,WH,1,8);
        await tx(f,on?'On':'Off',296,ay+30,8,GR);
      } else {
        await tx(f,it.s, 32,ay+32, 10, GR);
        await tx(f,'->',330,ay+18,13,GR,'Bold');
      }
      ay+=56;
    }
    ay+=12;
  }
  await NAV_A(f,0);
  await LBL(f,'A10 / PLATFORM SETTINGS');
  return f;
};

// A11: REVENUE REPORTS
const A11 = async () => {
  const f = mk(adminPage,4500,'A11 Revenue Reports',2);
  tg(f,{r:.09,g:.04,b:.18},220);
  await SB(f);
  await tx(f,'Revenue Reports',20,50,20,WH,'Bold');
  bx(f,268,46,92,30,GN,.15,15); await tx(f,'Export CSV',274,54,10,GN,'Semi Bold');
  // Period
  bx(f,20,88,350,32,SURF,1,16);
  const rperiods=['Today','Week','Month','Quarter','Year'];
  for (let i=0;i<rperiods.length;i++){
    const s=i===2, tw=70;
    bx(f,22+i*69,90,tw,28,s?PK:{r:0,g:0,b:0},s?1:0,12);
    await tx(f,rperiods[i], 22+i*69+12,97, 10, s?WH:GR, s?'Semi Bold':'Regular');
  }
  // Main KPIs
  CD(f,20,132,350,80); bx(f,20,132,350,3,GN,1,2);
  await tx(f,'May 2026 Revenue',28,148,12,GR);
  await tx(f,'Rs. 4,28,420',28,168,26,GN,'Bold');
  await tx(f,'+18% vs Apr 2026',28,204,11,GN);
  bx(f,248,148,96,28,PK,.12,14); await tx(f,'Full Report',256,157,10,PK,'Semi Bold');
  // Breakdown
  await tx(f,'Revenue Breakdown',20,228,14,WH,'Semi Bold');
  const rbreaks=[
    {l:'Gross Order Value','v':'Rs5.23L',c:CY},
    {l:'Platform Commission (18%)','v':'Rs94.1K',c:OG},
    {l:'Promo Discounts','v':'-Rs86.0K',c:RD},
    {l:'Refunds & Cancellations','v':'-Rs21.4K',c:AM},
    {l:'Net Revenue','v':'Rs4.28L',c:GN},
  ];
  for (let i=0;i<rbreaks.length;i++){
    const oy=252+i*44;
    bx(f,20,oy,350,36,i===4?{r:.04,g:.12,b:.04}:i%2===0?CARD:{r:.09,g:.09,b:.11},1,10);
    bx(f,20,oy,3,36,rbreaks[i].c,1,2);
    await tx(f,rbreaks[i].l, 30,oy+12, 11, i===4?WH:GR, i===4?'Semi Bold':'Regular');
    await tx(f,rbreaks[i].v, 290,oy+8, 14, rbreaks[i].c,'Bold');
  }
  // Top earners
  await tx(f,'Top Service Categories',20,486,14,WH,'Semi Bold');
  const topsvc=[['Car Wash','Rs1.72L','40%',CY],['AC Repair','Rs1.10L','26%',OG],['Tyre Fix','Rs0.60L','14%',GN],['Detailing','Rs0.60L','14%',PK],['Cleaning','Rs0.26L','6%',BL]];
  for (let i=0;i<5;i++){
    const oy=510+i*42;
    bx(f,20,oy,350,34,i%2===0?CARD:{r:.09,g:.09,b:.11},1,10);
    bx(f,20,oy,3,34,topsvc[i][3],1,2);
    await tx(f,topsvc[i][0], 30,oy+12, 11, WH);
    await tx(f,topsvc[i][1], 160,oy+12, 11, CY,'Semi Bold');
    bx(f,228,oy+7,Math.round(120*(parseInt(topsvc[i][2])/100)),20,topsvc[i][3],.3,4);
    await tx(f,topsvc[i][2], 318,oy+12, 11, topsvc[i][3],'Semi Bold');
  }
  bx(f,20,730,350,42,CARD,1,14); bx(f,20,730,4,42,PK,1,2);
  await tx(f,'Best City: Hyderabad  •  62% share  •  Rs2.65L this month',28,744,10,LG);
  await NAV_A(f,3);
  await LBL(f,'A11 / REVENUE REPORTS');
  return f;
};

// A12: PUSH NOTIFICATIONS CENTER
const A12 = async () => {
  const f = mk(adminPage,4950,'A12 Push Notifications',2);
  await SB(f);
  await tx(f,'Push Notifications',20,50,18,WH,'Bold');
  bx(f,264,46,96,30,PK,.15,15); await tx(f,'Send New',272,54,10,PK,'Semi Bold');
  // Compose
  CD(f,20,88,350,196); bx(f,20,88,350,3,PK,1,2);
  await tx(f,'Compose Notification',28,102,13,WH,'Semi Bold');
  await tx(f,'Target Audience',28,124,11,GR);
  bx(f,28,142,294,34,SURF,1,10); bx(f,28,142,294,1,WH,.05,10);
  await tx(f,'All Customers  v',36,154,11,LG);
  await tx(f,'3 segments  v',228,154,11,CY,'Semi Bold');
  await tx(f,'Title',28,188,11,GR);
  bx(f,28,206,294,34,CARD,1,10); bx(f,28,206,294,1,WH,.05,10);
  await tx(f,'Exclusive Weekend Offer!',38,218,12,LG);
  await tx(f,'Message',28,250,11,GR);
  bx(f,28,268,294,50,CARD,1,10); bx(f,28,268,294,1,WH,.05,10);
  await tx(f,'Get 20% off this Saturday & Sunday. Use code: WEEKEND20',36,278,10,LG);
  // Preview card
  await tx(f,'Preview',28,300,9,GR);
  bx(f,20,314,350,72,{r:.04,g:.04,b:.06},1,14); bx(f,20,314,350,1,WH,.03,14);
  bx(f,32,326,32,32,CY,.15,16); await tx(f,'S',42,336,10,BK,'Bold');
  await tx(f,'ServiCo',74,326,11,WH,'Bold');
  await tx(f,'Exclusive Weekend Offer!',74,344,12,WH,'Semi Bold');
  await tx(f,'Get 20% off this Sat & Sun. Code: WEEKEND20',74,362,9,GR);
  // Delivery options
  await tx(f,'Delivery Options',20,400,13,WH,'Semi Bold');
  bx(f,20,422,350,38,CARD,1,12);
  await tx(f,'Send Now',32,434,12,WH,'Semi Bold');
  bx(f,254,430,20,20,CY,1,10); bx(f,258,434,12,12,WH,1,6);
  bx(f,20,468,350,38,CARD,1,12);
  await tx(f,'Schedule for: Sat 31 May  •  9:00 AM',32,480,12,LG);
  bx(f,254,476,20,20,SURF,1,10);
  await tx(f,'Channels:',20,520,11,GR,'Semi Bold');
  const channels=['Push Notification','SMS','In-App Banner','Email'];
  for (let i=0;i<4;i++){
    const s=i<3;
    bx(f,20,540+i*42,350,34,CARD,1,10); bx(f,20,540+i*42,350,1,WH,.04,10);
    await tx(f,channels[i], 32,552+i*42, 12, WH);
    bx(f,294,548+i*42,20,20,s?GN:SURF,1,10);
    if (s) { bx(f,296,550+i*42,16,16,WH,.2,8); await tx(f,'v',300,551+i*42,8,GN,'Bold'); }
  }
  await BTN(f,20,716,350,'Send to 2,841 Customers',PK,WH);
  bx(f,20,780,350,32,{r:.07,g:.07,b:.09},1,10);
  await tx(f,'Last sent: "FLASH20" — 5 hrs ago  •  4.2K delivered  •  31% open rate',28,790,9,GR);
  await NAV_A(f,0);
  await LBL(f,'A12 / PUSH NOTIFICATIONS');
  return f;
};

// A13: SUPPORT TICKETS
const A13 = async () => {
  const f = mk(adminPage,5400,'A13 Support Tickets',2);
  await SB(f);
  await tx(f,'Support Tickets',20,50,20,WH,'Bold');
  bx(f,272,46,88,30,RD,.15,15); await tx(f,'28 Open',280,54,11,RD,'Semi Bold');
  const stabs=['All','Open','In Review','Resolved','Closed'];
  let stfx=20;
  for (let i=0;i<stabs.length;i++){
    const fw=stabs[i].length*7+18, s=i===1;
    bx(f,stfx,88,fw,28,s?RD:SURF,1,14);
    if (!s) bx(f,stfx,88,fw,1,WH,.04,14);
    await tx(f,stabs[i], stfx+6,96, 10, s?WH:LG, s?'Bold':'Regular');
    stfx+=fw+6;
  }
  bx(f,20,126,350,40,SURF,1,14); bx(f,20,126,350,1,WH,.05,14);
  await tx(f,'Search tickets...', 38,141, 12, GR);
  const tickets=[
    {id:'TKT-284',u:'Ramprasad M.',t:'Refund not credited after 7 days',pri:'Critical',pc:RD,dt:'Today 11:30',s:'Open',a:'Unassigned'},
    {id:'TKT-283',u:'Neha Sharma',t:'Provider damaged car during service',pri:'Critical',pc:RD,dt:'Today 10:15',s:'Open',a:'Ravi (Admin)'},
    {id:'TKT-282',u:'Sai Krishna',t:'Double charged for single booking',pri:'High',pc:AM,dt:'Yesterday',s:'In Review',a:'Priya (Admin)'},
    {id:'TKT-281',u:'Rahul Verma',t:'App crashed during payment — money deducted',pri:'High',pc:AM,dt:'Yesterday',s:'In Review',a:'Ravi (Admin)'},
    {id:'TKT-280',u:'Vikram N.',t:'Cannot login — OTP not received',pri:'Medium',pc:OG,dt:'25 May',s:'Resolved',a:'Meena (Admin)'},
  ];
  for (let i=0;i<tickets.length;i++){
    const t=tickets[i], oy=174+i*104;
    CD(f,20,oy,350,96); bx(f,20,oy,4,96,t.pc,1,2);
    bx(f,20,oy,350,28,SURF,.4,16);
    await tx(f,t.id, 28,oy+8, 10, GR);
    await BDG(f,148,oy+6,t.pri,t.pc);
    await BDG(f,220,oy+6,t.s,t.s==='Resolved'?GN:t.s==='In Review'?CY:RD);
    await tx(f,t.dt, 276,oy+8, 9, GR);
    await tx(f,t.u, 28,oy+34, 12, WH,'Semi Bold');
    await tx(f,t.t.substring(0,48)+(t.t.length>48?'...':''), 28,oy+52, 10, LG);
    await tx(f,'Assigned: '+t.a, 28,oy+70, 9, GR);
    bx(f,266,oy+66,66,22,PK,.12,11); await tx(f,'Respond',270,oy+72,9,PK);
  }
  await NAV_A(f,3);
  await LBL(f,'A13 / SUPPORT TICKETS');
  return f;
};

// A14: PROVIDER PERFORMANCE DETAIL
const A14 = async () => {
  const f = mk(adminPage,5850,'A14 Provider Detail',2);
  await SB(f);
  await HDR(f,'Provider Performance','Venkat Repairs — May 2026');
  // Provider card
  CD(f,20,88,350,88);
  bx(f,30,100,52,52,OG,1,26); await tx(f,'VR',44,118,14,BK,'Bold');
  await tx(f,'Venkat Repairs',94,100,14,WH,'Bold');
  await tx(f,'Hyderabad  •  5 yrs exp  •  KYC Verified',94,120,10,GR);
  await tx(f,'Partner since 2021',94,138,10,GR);
  bx(f,264,100,86,26,PK,.12,13); await tx(f,'Full Profile',270,108,10,PK,'Semi Bold');
  bx(f,264,134,86,26,RD,.12,13); await tx(f,'Suspend',272,142,10,RD,'Semi Bold');
  // Perf KPIs
  await tx(f,'May 2026 Stats',20,192,14,WH,'Semi Bold');
  const pkpis=[['4.8','Rating',ST],['24','Jobs Done',OG],['94%','Accept Rate',GN],['0','Complaints',GN],['Rs.18.4K','Earned',CY],['98%','On-Time',AM]];
  for (let i=0;i<6;i++){
    const col=i%3, rw=Math.floor(i/3);
    const ox=20+col*118, oy=214+rw*72;
    CD(f,ox,oy,108,62); bx(f,ox,oy,108,3,pkpis[i][2],1,2);
    await tx(f,pkpis[i][0], ox+8,oy+10, 16, pkpis[i][2],'Bold');
    await tx(f,pkpis[i][1], ox+8,oy+38, 8, GR);
  }
  // Last 7 days jobs
  await tx(f,'Jobs — Last 7 Days',20,376,14,WH,'Semi Bold');
  CD(f,20,398,350,80);
  const dj=[2,3,4,3,0,4,5];
  const dlbls=['Tu','We','Th','Fr','Sa','Su','Mo'];
  for (let i=0;i<7;i++){
    const bh=dj[i]*14, ox=30+i*46;
    if (bh>0) bx(f,ox,460-bh,28,bh,OG,.7,3);
    bx(f,ox,462,28,4,SURF,1,2);
    await tx(f,dlbls[i], ox+5,470, 9, GR);
    if (dj[i]>0) await tx(f,String(dj[i]), ox+8,456-bh, 8, OG,'Semi Bold');
  }
  // Recent jobs from this provider
  await tx(f,'Recent Jobs',20,494,14,WH,'Semi Bold');
  const provJobs=[
    {cust:'Ramprasad M.',svc:'Premium Wash',dt:'Today 11:00',pay:'Rs.349',r:5,s:'Completed'},
    {cust:'Neha Sharma',svc:'Basic Wash',dt:'Today 9:00',pay:'Rs.149',r:5,s:'Completed'},
    {cust:'Rahul Verma',svc:'Tyre Change',dt:'Yesterday',pay:'Rs.249',r:4,s:'Completed'},
    {cust:'Sai Krishna',svc:'AC Repair',dt:'Yesterday',pay:'Rs.599',r:5,s:'Completed'},
  ];
  for (let i=0;i<provJobs.length;i++){
    const j=provJobs[i], oy=518+i*68;
    CD(f,20,oy,350,60); bx(f,20,oy,3,60,GN,1,2);
    await tx(f,j.cust, 30,oy+10, 12, WH,'Semi Bold');
    await tx(f,j.svc+'  •  '+j.dt, 30,oy+28, 10, GR);
    for (let s=0;s<5;s++) await tx(f,'*',30+s*14,oy+46,10,s<j.r?ST:EDGE,'Bold');
    await tx(f,j.pay, 288,oy+14, 14, CY,'Bold');
    await BDG(f,256,oy+38,j.s,GN);
  }
  await NAV_A(f,1);
  await LBL(f,'A14 / PROVIDER DETAIL');
  return f;
};

// ════════════════════════════════════════════════════════════
//  CUSTOMER — Additional Screens  C27–C36
// ════════════════════════════════════════════════════════════

// C27: MAP VIEW — Browse providers spatially
const C27 = async () => {
  const f = mk(custPage,11700,'C27 Map View');
  await SB(f);
  // Map background
  bx(f,0,0,W,H,{r:.05,g:.09,b:.06},1);
  // Grid lines simulating map tiles
  for (let i=0;i<8;i++) bx(f,0,i*110,W,1,{r:.12,g:.17,b:.12},.6);
  for (let i=0;i<5;i++) bx(f,i*100,0,1,H,{r:.12,g:.17,b:.12},.6);
  // Roads
  bx(f,0,320,W,8,{r:.14,g:.18,b:.14},1); bx(f,180,0,8,H,{r:.14,g:.18,b:.14},1);
  bx(f,0,560,W,5,{r:.12,g:.16,b:.12},1); bx(f,90,0,5,H,{r:.12,g:.16,b:.12},1);
  // Provider pins
  const pins=[
    {x:140,y:180,nm:'Ravi Auto Spa',rt:'4.9',pr:'₹299',c:CY},
    {x:240,y:270,nm:'Vijay Clean',rt:'4.7',pr:'₹199',c:OG},
    {x:80,y:400,nm:'SparkShine',rt:'4.8',pr:'₹349',c:GN},
    {x:300,y:480,nm:'AquaWash',rt:'4.6',pr:'₹149',c:PK},
    {x:180,y:600,nm:'ProWash',rt:'4.5',pr:'₹249',c:AM},
  ];
  for (const p of pins){
    bx(f,p.x-16,p.y-36,32,32,p.c,.9,16); bx(f,p.x-2,p.y-4,4,12,p.c,1,2);
    await tx(f,'★',p.x-8,p.y-30,14,WH,'Bold');
    // Popup on first pin
    if(p.c===CY){
      bx(f,p.x-60,p.y-78,130,38,CARD,1,8); bx(f,p.x-60,p.y-78,130,2,CY,.7,2);
      await tx(f,p.nm,p.x-54,p.y-72,9,WH,'Semi Bold');
      await tx(f,'★ '+p.rt+'  '+p.pr,p.x-54,p.y-58,8,LG);
    }
  }
  // User location pin
  bx(f,183,317,14,14,BL,1,7); bx(f,185,319,10,10,WH,.6,5);
  bx(f,189,325,2,8,BL,1,1);
  // Top search bar
  bx(f,16,50,318,44,CARD,1,22); bx(f,16,50,318,1,WH,.08,22);
  await tx(f,'🔍',26,63,14,GR);
  await tx(f,'Search services near you',48,63,12,GR);
  bx(f,280,58,58,28,CY,.15,14); await tx(f,'Filter',286,64,9,CY,'Semi Bold');
  // Bottom sheet — featured providers
  bx(f,0,660,W,184,DP,1,0); bx(f,0,660,W,1,EDGE,.5);
  bx(f,172,668,46,4,EDGE,1,2);
  await tx(f,'Nearby Providers',16,678,14,WH,'Bold');
  await tx(f,'5 within 3 km',290,682,10,GR);
  const provList=[{nm:'Ravi Auto Spa',dist:'0.8 km',rt:'4.9',pr:'₹299'},{nm:'SparkShine',dist:'1.2 km',rt:'4.8',pr:'₹349'}];
  for (let i=0;i<provList.length;i++){
    const p=provList[i], oy=702+i*66;
    CD(f,16,oy,358,58,10); bx(f,16,oy,3,58,CY,1,2);
    bx(f,24,oy+9,40,40,SURF,1,20);
    await tx(f,'🚗',28,oy+17,20,WH);
    await tx(f,p.nm,74,oy+10,12,WH,'Semi Bold');
    await tx(f,'★ '+p.rt+'  •  '+p.dist,74,oy+28,10,GR);
    await tx(f,p.pr,300,oy+18,13,CY,'Bold');
  }
  await LBL(f,'C27 / MAP VIEW');
  return f;
};

// C28: SEARCH RESULTS
const C28 = async () => {
  const f = mk(custPage,12150,'C28 Search Results');
  bx(f,0,0,W,108,SURF,1);
  await SB(f);
  // Search bar active
  bx(f,16,44,318,44,CARD,1,22); bx(f,16,44,318,1,CY,.4,22);
  await tx(f,'←',22,54,16,CY,'Bold');
  await tx(f,'car wash',52,56,13,WH);
  bx(f,316,50,18,18,GR,.3,9); await tx(f,'✕',319,53,10,GR);
  // Recent searches
  await tx(f,'Recent Searches',20,102,11,GR);
  const recents=['AC Repair','Bike Service','Deep Cleaning','Tyre Change'];
  for (let i=0;i<recents.length;i++){
    bx(f,20+i*88,118,80,28,CARD,1,14); bx(f,20+i*88,118,80,1,EDGE,.3,14);
    await tx(f,'🕐',26+i*88,124,10,GR); await tx(f,recents[i],42+i*88,125,9,GR);
  }
  // Filter chips
  await tx(f,'Car Wash',20,162,11,LG);
  bx(f,90,156,64,24,CY,.15,12); bx(f,90,156,64,1,CY,.4,12);
  await tx(f,'★ 4.5+',96,161,9,CY,'Semi Bold');
  bx(f,162,156,58,24,CARD,1,12); await tx(f,'₹0–500',166,161,9,GR);
  bx(f,228,156,54,24,CARD,1,12); await tx(f,'Today',232,161,9,GR);
  bx(f,290,156,64,24,CARD,1,12); await tx(f,'Nearest',294,161,9,GR);
  // Result count
  await tx(f,'24 providers found',20,194,12,LG);
  await tx(f,'Sort: Recommended ▾',256,194,10,CY);
  DIV(f,210);
  // Results list
  const results=[
    {nm:'Ravi Auto Spa',svc:'Car Wash & Polish',rt:'4.9',rv:432,dist:'0.8 km',pr:'₹299',tag:'Best Rated',tc:ST},
    {nm:'AquaWash Pro',svc:'Premium Car Wash',rt:'4.7',rv:218,dist:'1.4 km',pr:'₹199',tag:'Fastest',tc:GN},
    {nm:'SparkShine',svc:'Full Detailing',rt:'4.8',rv:367,dist:'2.1 km',pr:'₹349',tag:'Top Pick',tc:CY},
    {nm:'GlossyWash',svc:'Basic + Interior',rt:'4.5',rv:129,dist:'2.8 km',pr:'₹149',tag:'Budget',tc:AM},
  ];
  for (let i=0;i<results.length;i++){
    const r=results[i], oy=218+i*140;
    CD(f,20,oy,350,128,12);
    bx(f,20,oy,350,128,WH,.02,12);
    // Thumbnail
    bx(f,28,oy+12,80,80,SURF,1,8); bx(f,34,oy+24,68,56,EDGE,.4,6);
    await tx(f,'🚗',56,oy+34,28,CY);
    await BDG(f,28,oy+8,r.tag,r.tc);
    // Details
    await tx(f,r.nm,118,oy+16,14,WH,'Bold');
    await tx(f,r.svc,118,oy+34,10,GR);
    await tx(f,'★ '+r.rt,118,oy+52,11,ST,'Semi Bold');
    await tx(f,'('+r.rv+' reviews)',152,oy+54,9,GR);
    await tx(f,'📍 '+r.dist,118,oy+70,10,GR);
    await tx(f,r.pr,280,oy+16,16,CY,'Bold');
    await tx(f,'per session',270,oy+36,8,GR);
    await BTN(f,210,oy+86,148,'Book Now',CY);
  }
  await NAV_C(f,1);
  await LBL(f,'C28 / SEARCH RESULTS');
  return f;
};

// C29: EDIT PROFILE
const C29 = async () => {
  const f = mk(custPage,12600,'C29 Edit Profile');
  bx(f,0,0,W,130,SURF,1);
  await SB(f);
  await HDR(f,'Edit Profile');
  // Avatar upload
  bx(f,155,84,80,80,CY,.1,40); bx(f,155,84,80,80,CY,.08,40);
  await AV(f,155,84,80,'RM',CY);
  bx(f,213,128,28,28,OG,1,14); await tx(f,'📷',218,133,12,WH);
  await tx(f,'Change Photo',145,170,12,CY);
  // Form fields
  await INP(f,20,196,350,'Full Name','Ramprasad Mokka',CY);
  await INP(f,20,272,350,'Mobile Number','+91 98765 43210',CY);
  await INP(f,20,348,350,'Email Address','ramprasad@gmail.com',CY);
  await INP(f,20,424,350,'Date of Birth','12 March 1990',CY);
  // Gender
  await tx(f,'Gender',20,486,11,LG);
  const genders=['Male','Female','Other'];
  for (let i=0;i<genders.length;i++){
    const sel=i===0;
    bx(f,20+i*120,502,110,40,sel?CY:CARD,sel?.15:1,20);
    if(sel){bx(f,20+i*120,502,110,1,CY,.5,20);}
    await tx(f,genders[i],46+i*120,517,12,sel?CY:GR,sel?'Semi Bold':'Regular');
  }
  await INP(f,20,558,350,'City / Area','Banjara Hills, Hyderabad',CY);
  // Language
  await tx(f,'Preferred Language',20,622,11,LG);
  bx(f,20,638,350,48,CARD,1,12); bx(f,20,638,350,1,WH,.05,12); bx(f,20,638,3,48,CY,1,2);
  await tx(f,'English',36,654,13,LG); await tx(f,'▾',334,654,13,GR);
  await tx(f,'Telugu  •  Hindi  •  +2 more',36,670,9,GR);
  await BTN(f,20,706,350,'Save Changes',CY);
  await LBL(f,'C29 / EDIT PROFILE');
  return f;
};

// C30: PAYMENT METHODS
const C30 = async () => {
  const f = mk(custPage,13050,'C30 Payment Methods');
  await SB(f);
  await HDR(f,'Payment Methods','Manage your saved options');
  bx(f,0,0,W,44,SURF,1);
  // Wallet balance card
  bx(f,20,92,350,88,NV,1,16); bx(f,20,92,350,1,CY,.3,16);
  bx(f,20,92,350,88,CY,.05,16);
  await tx(f,'ServiCo Wallet',28,104,13,LG);
  await tx(f,'₹ 1,250.00',28,122,26,WH,'Bold');
  await tx(f,'Available Balance',28,154,10,GR);
  bx(f,270,110,80,32,CY,.15,16); bx(f,270,110,80,1,CY,.3,16);
  await tx(f,'+ Add Money',276,118,9,CY,'Semi Bold');
  // Saved cards
  await tx(f,'Saved Cards',20,196,13,WH,'Semi Bold');
  const cards=[
    {type:'VISA',num:'•••• •••• •••• 4521',exp:'12/26',c:BL,def:true},
    {type:'MASTERCARD',num:'•••• •••• •••• 8834',exp:'09/25',c:OG,def:false},
  ];
  for (let i=0;i<cards.length;i++){
    const card=cards[i], oy=216+i*96;
    CD(f,20,oy,350,84,12); bx(f,20,oy,350,84,card.c,.05,12);
    bx(f,28,oy+14,48,32,card.c,.2,6);
    await tx(f,card.type,32,oy+24,8,card.c,'Bold');
    await tx(f,card.num,90,oy+22,13,WH,'Semi Bold');
    await tx(f,'Exp: '+card.exp,90,oy+42,10,GR);
    if(card.def) await BDG(f,260,oy+14,'Default',GN);
    bx(f,316,oy+32,28,20,RD,.15,10); await tx(f,'Del',320,oy+37,8,RD);
  }
  // UPI
  await tx(f,'UPI',20,414,13,WH,'Semi Bold');
  CD(f,20,434,350,64,12);
  await tx(f,'ramprasad@upi',36,450,13,WH); await tx(f,'Primary UPI ID',36,468,10,GR);
  await BDG(f,278,448,'Active',GN);
  // BNPL
  await tx(f,'Buy Now Pay Later',20,512,13,WH,'Semi Bold');
  CD(f,20,532,350,64,12); bx(f,20,532,350,64,PK,.04,12);
  await tx(f,'ServiCo BNPL — ₹5,000 limit',36,548,12,WH);
  await tx(f,'₹0 used  •  ₹5,000 available',36,566,10,GR);
  await BDG(f,278,548,'Active',PK);
  // Add new
  bx(f,20,612,350,52,CARD,1,26); bx(f,20,612,350,1,CY,.2,26);
  bx(f,20,612,350,52,CY,.05,26);
  await tx(f,'+ Add New Payment Method',100,626,13,CY,'Semi Bold');
  // Auto-pay toggle
  CD(f,20,678,350,64,12);
  await tx(f,'Auto-pay for Subscriptions',36,694,13,WH,'Semi Bold');
  await tx(f,'Charge saved card automatically',36,712,10,GR);
  bx(f,306,698,36,20,GN,1,10); bx(f,322,700,16,16,WH,1,8);
  await LBL(f,'C30 / PAYMENT METHODS');
  return f;
};

// C31: COMPLAINT / ISSUE FILING
const C31 = async () => {
  const f = mk(custPage,13500,'C31 Complaint Filing');
  await SB(f);
  await HDR(f,'Report an Issue','Booking #SVC-2024-8821');
  bx(f,0,0,W,44,SURF,1);
  // Booking reference
  CD(f,20,92,350,72,12);
  await tx(f,'Booking Reference',28,106,11,GR);
  await tx(f,'#SVC-2024-8821  —  Car Wash',28,122,13,WH,'Semi Bold');
  await tx(f,'Ravi Auto Spa  •  Today 2:00 PM  •  ₹299',28,142,10,GR);
  // Issue type
  await tx(f,'What went wrong?',20,180,13,WH,'Semi Bold');
  const issues=['Service not completed','Quality was poor','Provider was late','Overcharged','Safety concern','Provider misconduct'];
  for (let i=0;i<issues.length;i++){
    const sel=i===1, oy=200+i*50;
    CD(f,20,oy,350,42,8);
    if(sel){bx(f,20,oy,350,42,RD,.08,8); bx(f,20,oy,3,42,RD,1,2);}
    bx(f,322,oy+11,20,20,sel?RD:EDGE,sel?.3:.15,10);
    if(sel){bx(f,328,oy+15,8,8,RD,1,4);}
    await tx(f,issues[i],40,oy+13,12,sel?RD:LG,sel?'Semi Bold':'Regular');
  }
  // Description
  await tx(f,'Describe the issue',20,508,13,WH,'Semi Bold');
  bx(f,20,528,350,100,CARD,1,12); bx(f,20,528,350,1,WH,.05,12); bx(f,20,528,3,100,RD,.7,2);
  await tx(f,'The car was returned with scratches on the\nleft side door that were not there before.',28,540,11,LG);
  // Photo evidence
  await tx(f,'Attach Evidence (optional)',20,642,13,WH,'Semi Bold');
  const evBoxes=['Photo 1','Photo 2','+ Add'];
  for (let i=0;i<evBoxes.length;i++){
    bx(f,20+i*120,660,110,72,CARD,1,8); bx(f,20+i*120,660,110,1,EDGE,.3,8);
    await tx(f,evBoxes[i],i===2?56+i*120:44+i*120,690,10,i===2?CY:GR,i===2?'Semi Bold':'Regular');
  }
  await BTN(f,20,752,350,'Submit Complaint',RD);
  await LBL(f,'C31 / COMPLAINT FILING');
  return f;
};

// C32: REFUND STATUS
const C32 = async () => {
  const f = mk(custPage,13950,'C32 Refund Status');
  await SB(f);
  await HDR(f,'Refund Status');
  bx(f,0,0,W,44,SURF,1);
  // Status hero
  bx(f,130,90,130,130,GN,.08,65);
  await tx(f,'₹',174,102,28,GN,'Bold');
  await tx(f,'↩',180,120,38,GN,'Bold');
  await tx(f,'Refund Initiated',100,236,18,WH,'Bold');
  await tx(f,'₹ 299.00',140,262,22,GN,'Bold');
  await tx(f,'Expected in 3–5 business days',80,292,11,GR);
  // Details card
  CD(f,20,320,350,140,12);
  const refDets=[['Booking ID','#SVC-2024-8821'],['Service','Car Wash - Premium'],['Refund Reason','Service not completed'],['Initiated On','28 May 2024, 4:30 PM'],['To Account','VISA •••• 4521']];
  for (let i=0;i<refDets.length;i++){
    await tx(f,refDets[i][0],32,336+i*24,10,GR);
    await tx(f,refDets[i][1],200,336+i*24,10,LG,'Semi Bold');
  }
  // Timeline
  await tx(f,'Refund Timeline',20,476,13,WH,'Semi Bold');
  const steps=[
    {label:'Complaint Received',dt:'28 May 2:30 PM',done:true},
    {label:'Refund Approved',dt:'28 May 4:30 PM',done:true},
    {label:'Bank Processing',dt:'Est. 29–30 May',done:false},
    {label:'Amount Credited',dt:'Est. 31 May',done:false},
  ];
  for (let i=0;i<steps.length;i++){
    const s=steps[i], oy=498+i*64;
    bx(f,36,oy,20,20,s.done?GN:EDGE,1,10);
    if(s.done) await tx(f,'✓',40,oy+3,11,WH,'Bold');
    if(i<steps.length-1) bx(f,45,oy+20,2,44,s.done?GN:EDGE,.5);
    await tx(f,s.label,66,oy+1,12,s.done?WH:GR,s.done?'Semi Bold':'Regular');
    await tx(f,s.dt,66,oy+18,10,s.done?GN:GR);
  }
  await BTN2(f,20,764,350,'Contact Support',CY);
  await LBL(f,'C32 / REFUND STATUS');
  return f;
};

// C33: RECOMMENDATIONS / EXPLORE
const C33 = async () => {
  const f = mk(custPage,14400,'C33 Explore & Discover');
  await SB(f);
  bx(f,0,0,W,44,SURF,1);
  // Header
  bx(f,0,44,W,56,SURF,1); bx(f,0,100,W,1,EDGE,.3);
  await tx(f,'Explore',20,54,22,WH,'Bold');
  await tx(f,'Discover services for you',20,78,11,GR);
  bx(f,330,50,36,36,SURF,1,18); await tx(f,'🔍',340,57,14,GR);
  // Personalized banner
  bx(f,20,110,350,100,NV,1,16); bx(f,20,110,350,100,CY,.06,16);
  bx(f,20,110,350,3,CY,1,2);
  await tx(f,'Personalized For You',28,122,13,CY,'Semi Bold');
  await tx(f,'Based on your 12 past bookings',28,140,10,GR);
  await tx(f,'★ Car Wash  |  AC Repair  |  Tyre Service',28,160,11,LG);
  await BTN(f,224,178,136,'View All',CY);
  // Trending
  await tx(f,'Trending Near You 🔥',20,226,14,WH,'Bold');
  const trending=[
    {nm:'Deep Interior Clean',pr:'₹399',bk:'2.1k bookings'},
    {nm:'Ceramic Coating',pr:'₹999',bk:'1.3k bookings'},
    {nm:'AC Gas Refill',pr:'₹599',bk:'3.4k bookings'},
  ];
  for (let i=0;i<trending.length;i++){
    const t=trending[i], ox=20+i*122;
    CD(f,ox,248,114,100,10);
    bx(f,ox,248,114,3,OG,1,2);
    bx(f,ox+8,258,50,40,SURF,1,8);
    await tx(f,'🔥',ox+18,266,22,OG);
    await tx(f,t.nm,ox+6,304,9,WH,'Semi Bold');
    await tx(f,t.pr,ox+6,320,12,CY,'Bold');
    await tx(f,t.bk,ox+6,336,8,GR);
  }
  // Seasonal offers
  await tx(f,'Monsoon Specials 🌧',20,364,14,WH,'Bold');
  bx(f,20,384,350,88,{r:.01,g:.06,b:.14},1,12); bx(f,20,384,350,88,BL,.1,12);
  bx(f,20,384,350,3,BL,.7,2);
  await tx(f,'20% off on Waterproofing Services',28,396,13,WH,'Semi Bold');
  await tx(f,'Use code: MONSOON20  •  Ends 30 May',28,416,10,GR);
  bx(f,28,436,120,28,BL,.2,14); bx(f,28,436,120,1,BL,.4,14);
  await tx(f,'Claim Offer →',34,443,10,BL,'Semi Bold');
  // Recently viewed
  await tx(f,'Recently Viewed',20,488,14,WH,'Bold');
  const recent=[
    {nm:'Ravi Auto Spa',tag:'4.9 ★',c:CY},
    {nm:'AquaWash Pro',tag:'4.7 ★',c:OG},
    {nm:'SparkShine',tag:'4.8 ★',c:GN},
  ];
  for (let i=0;i<recent.length;i++){
    const r=recent[i], ox=20+i*122;
    CD(f,ox,508,114,80,10); bx(f,ox,508,114,3,r.c,1,2);
    bx(f,ox+8,518,50,36,SURF,1,8);
    await tx(f,'🚗',ox+18,524,18,r.c);
    await tx(f,r.nm,ox+4,560,8,WH,'Semi Bold');
    await tx(f,r.tag,ox+4,575,8,r.c);
  }
  // Top categories
  await tx(f,'All Categories',20,604,14,WH,'Bold');
  const cats=[['🚗','Car Wash'],['❄','AC Repair'],['🔧','Mechanic'],['🏠','Home Clean'],['⚡','Electrical'],['🔩','Plumbing']];
  for (let i=0;i<cats.length;i++){
    const col=i%3, row=Math.floor(i/3), ox=20+col*122, oy=624+row*80;
    CD(f,ox,oy,114,72,10);
    await tx(f,cats[i][0],ox+44,oy+10,24,WH);
    await tx(f,cats[i][1],ox+8,oy+48,9,LG);
  }
  await NAV_C(f,1);
  await LBL(f,'C33 / EXPLORE & DISCOVER');
  return f;
};

// C34: LOYALTY & REWARDS
const C34 = async () => {
  const f = mk(custPage,14850,'C34 Loyalty & Rewards');
  await SB(f);
  await HDR(f,'Rewards & Loyalty');
  bx(f,0,0,W,44,SURF,1);
  // Gold tier card
  bx(f,20,90,350,120,{r:.14,g:.10,b:.01},1,16); bx(f,20,90,350,120,ST,.12,16);
  bx(f,20,90,350,3,ST,.8,2);
  for (let i=0;i<6;i++) bx(f,20+i*60,90,30,120,ST,.03,0);
  await tx(f,'🏆',28,106,28,ST);
  await tx(f,'GOLD MEMBER',66,102,11,ST,'Bold');
  await tx(f,'Ramprasad Mokka',66,120,15,WH,'Bold');
  await tx(f,'Member since Jan 2023',66,140,9,GR);
  await tx(f,'2,840',250,100,28,ST,'Bold'); await tx(f,'Points',254,130,10,GR);
  // Progress to Platinum
  await tx(f,'Progress to Platinum',28,166,10,GR);
  bx(f,28,180,294,6,SURF,1,3); bx(f,28,180,204,6,ST,1,3);
  await tx(f,'2,840 / 4,000 pts',28,192,9,GR); await tx(f,'1,160 pts to go',262,192,9,ST);
  // Points history
  await tx(f,'Points History',20,222,13,WH,'Semi Bold');
  const hist=[
    {ev:'Car Wash - Premium',pts:'+50',dt:'Today',c:GN},
    {ev:'Referral Bonus',pts:'+200',dt:'Yesterday',c:PK},
    {ev:'Redeemed — ₹100 off',pts:'-100',dt:'25 May',c:RD},
    {ev:'AC Repair Booking',pts:'+120',dt:'20 May',c:GN},
    {ev:'First Review Bonus',pts:'+50',dt:'15 May',c:GN},
  ];
  for (let i=0;i<hist.length;i++){
    const h=hist[i], oy=242+i*56;
    DIV(f,oy); CD(f,20,oy+2,350,50,8);
    await tx(f,h.ev,32,oy+12,12,WH,'Semi Bold');
    await tx(f,h.dt,32,oy+30,10,GR);
    await tx(f,h.pts,302,oy+18,14,h.c,'Bold');
  }
  // Redeem section
  await tx(f,'Redeem Points',20,534,13,WH,'Semi Bold');
  const redeems=[
    {pts:'500 pts','val':'₹50 off',c:CY},
    {pts:'1000 pts','val':'₹120 off',c:OG},
    {pts:'2000 pts','val':'Free Service',c:GN},
  ];
  for (let i=0;i<redeems.length;i++){
    const r=redeems[i], ox=20+i*122;
    CD(f,ox,554,114,84,10); bx(f,ox,554,114,3,r.c,1,2);
    await tx(f,r.val,ox+10,564,13,r.c,'Bold');
    await tx(f,r.pts,ox+8,582,9,GR);
    bx(f,ox+8,598,98,24,r.c,.15,12); bx(f,ox+8,598,98,1,r.c,.3,12);
    await tx(f,'Redeem',ox+34,604,9,r.c,'Semi Bold');
  }
  // Tiers
  await tx(f,'Membership Tiers',20,654,13,WH,'Semi Bold');
  const tiers=[{nm:'Bronze',c:AM,pts:'0–999'},{nm:'Silver',c:LG,pts:'1k–2.4k'},{nm:'Gold',c:ST,pts:'2.5k–4k'},{nm:'Platinum',c:CY,pts:'4k+'}];
  for (let i=0;i<tiers.length;i++){
    const t=tiers[i], ox=20+i*90;
    bx(f,ox,672,80,56,t.c,i===2?.2:.06,8); bx(f,ox,672,80,2,t.c,i===2?.8:.3,2);
    await tx(f,t.nm,ox+8,682,9,t.c,i===2?'Bold':'Regular');
    await tx(f,t.pts,ox+4,698,8,i===2?t.c:GR);
    if(i===2){await tx(f,'YOU',ox+26,712,7,ST,'Bold');}
  }
  await LBL(f,'C34 / LOYALTY & REWARDS');
  return f;
};

// C35: INVOICE / RECEIPT
const C35 = async () => {
  const f = mk(custPage,15300,'C35 Invoice & Receipt');
  await SB(f);
  await HDR(f,'Invoice','Booking #SVC-2024-8821');
  bx(f,0,0,W,44,SURF,1);
  // Invoice card
  CD(f,20,90,350,440,16);
  // Header
  bx(f,20,90,350,60,CY,.1,16); bx(f,20,90,350,3,CY,1,2);
  await tx(f,'INVOICE',36,102,18,CY,'Bold');
  await tx(f,'#SVC-INV-2024-8821',36,124,10,GR);
  await tx(f,'28 May 2024  •  4:30 PM',230,124,9,GR);
  // From/To
  await tx(f,'FROM',36,166,9,GR,'Bold');
  await tx(f,'Ravi Auto Spa',36,180,12,WH,'Semi Bold');
  await tx(f,'Banjara Hills, Hyderabad',36,196,10,GR);
  await tx(f,'GST: 36ABCDE1234F1Z5',36,210,9,GR);
  await tx(f,'TO',240,166,9,GR,'Bold');
  await tx(f,'Ramprasad Mokka',240,180,12,WH,'Semi Bold');
  await tx(f,'+91 98765 43210',240,196,10,GR);
  await tx(f,'ramprasad@gmail.com',240,210,9,GR);
  DIV(f,232);
  // Services table
  await tx(f,'SERVICE',36,244,9,GR,'Bold');
  await tx(f,'AMOUNT',296,244,9,GR,'Bold');
  DIV(f,258);
  const lineItems=[
    ['Premium Car Wash','₹249'],
    ['Interior Vacuuming','₹50'],
    ['Dashboard Polish (add-on)','₹50'],
  ];
  for (let i=0;i<lineItems.length;i++){
    const oy=268+i*28;
    await tx(f,lineItems[i][0],36,oy,11,LG);
    await tx(f,lineItems[i][1],304,oy,11,LG,'Semi Bold');
  }
  DIV(f,356);
  const summary=[['Subtotal','₹349'],['GST (18%)','₹62.82'],['Promo (FIRST10)','–₹34.90'],];
  for(let i=0;i<summary.length;i++){
    await tx(f,summary[i][0],36,366+i*24,11,GR);
    await tx(f,summary[i][1],286,366+i*24,11,GR,'Semi Bold');
  }
  DIV(f,438);
  await tx(f,'TOTAL PAID',36,450,12,WH,'Bold');
  await tx(f,'₹ 376.92',254,448,16,CY,'Bold');
  await tx(f,'Paid via VISA •••• 4521',36,470,10,GR);
  await BDG(f,220,466,'Payment Successful',GN);
  DIV(f,492);
  await tx(f,'Thank you for using ServiCo! 🙏',68,502,11,GR);
  // Action buttons
  bx(f,20,548,168,48,CARD,1,24); bx(f,20,548,168,1,CY,.3,24);
  await tx(f,'📥  Download PDF',42,564,11,CY,'Semi Bold');
  bx(f,202,548,168,48,CARD,1,24); bx(f,202,548,168,1,GN,.3,24);
  await tx(f,'📤  Share Receipt',224,564,11,GN,'Semi Bold');
  // Rate & Rebook
  await tx(f,'How was your experience?',20,614,12,LG);
  const stars=[1,2,3,4,5];
  for (let i=0;i<stars.length;i++) await tx(f,'★',22+i*34,632,24,i<4?ST:EDGE,'Bold');
  await BTN(f,20,684,350,'Book Again',CY);
  await LBL(f,'C35 / INVOICE & RECEIPT');
  return f;
};

// C36: BOOKING ADD-ONS / EXTRAS
const C36 = async () => {
  const f = mk(custPage,15750,'C36 Booking Add-ons');
  await SB(f);
  await HDR(f,'Add-on Services','Customise your booking');
  bx(f,0,0,W,44,SURF,1);
  // Base service chip
  CD(f,20,90,350,56,10); bx(f,20,90,3,56,CY,1,2);
  await tx(f,'Base: Premium Car Wash',32,102,12,WH,'Semi Bold');
  await tx(f,'₹249  •  40 mins  •  Ravi Auto Spa',32,120,10,GR);
  // Add-on category tabs
  await tx(f,'Exterior',20,160,11,CY,'Semi Bold');
  bx(f,20,174,66,3,CY,1,2);
  await tx(f,'Interior',96,160,11,GR);
  await tx(f,'Protection',162,160,11,GR);
  await tx(f,'Detailing',238,160,11,GR);
  DIV(f,178);
  // Add-on items
  const addons=[
    {nm:'Interior Vacuum',desc:'Deep vacuum + dust removal',pr:'+₹50',dur:'+15 min',sel:true},
    {nm:'Dashboard Polish',desc:'Dashboard + console clean & shine',pr:'+₹50',dur:'+10 min',sel:true},
    {nm:'Tyre Dressing',desc:'Tyre shine + wheel arch clean',pr:'+₹80',dur:'+20 min',sel:false},
    {nm:'Seat Shampoo',desc:'Full seat deep clean & dry',pr:'+₹150',dur:'+30 min',sel:false},
    {nm:'Engine Bay Clean',desc:'Degreasing & pressure wash',pr:'+₹200',dur:'+45 min',sel:false},
  ];
  for (let i=0;i<addons.length;i++){
    const a=addons[i], oy=190+i*92;
    CD(f,20,oy,350,84,10);
    if(a.sel){bx(f,20,oy,350,84,CY,.05,10); bx(f,20,oy,3,84,CY,1,2);}
    bx(f,28,oy+14,48,48,a.sel?CY:EDGE,a.sel?.15:.08,8);
    await tx(f,a.sel?'✓':'➕',38,oy+26,20,a.sel?CY:GR,'Bold');
    await tx(f,a.nm,86,oy+14,13,WH,'Semi Bold');
    await tx(f,a.desc,86,oy+32,10,GR);
    await tx(f,a.dur,86,oy+50,10,GR);
    await tx(f,a.pr,292,oy+14,13,a.sel?CY:LG,'Bold');
    // Toggle
    bx(f,314,oy+30,28,16,a.sel?CY:EDGE,a.sel?1:.3,8);
    bx(f,a.sel?326:316,oy+32,12,12,WH,1,6);
  }
  // Order summary
  bx(f,0,660,W,104,SURF,1); bx(f,0,660,W,1,EDGE,.5);
  await tx(f,'Order Summary',20,672,12,WH,'Semi Bold');
  await tx(f,'Base service + 2 add-ons',20,690,10,GR);
  await tx(f,'₹ 349',280,668,20,CY,'Bold');
  await tx(f,'Est. total  •  55 mins',280,690,9,GR);
  await BTN(f,20,710,350,'Confirm & Proceed to Payment',CY);
  await LBL(f,'C36 / BOOKING ADD-ONS');
  return f;
};

// ════════════════════════════════════════════════════════════
//  PROVIDER — Additional Screens  P20–P26
// ════════════════════════════════════════════════════════════

// P20: AVAILABILITY & SERVICE AREA SETUP (Onboarding Step 4)
const P20 = async () => {
  const f = mk(provPage,8550,'P20 Availability Setup',1);
  bx(f,0,0,W,H,BG,1);
  await SB(f);
  await tx(f,'Step 4 of 4',20,50,11,OG,'Semi Bold');
  await tx(f,'Availability &',20,68,24,WH,'Bold');
  await tx(f,'Service Area',20,96,24,WH,'Bold');
  // Progress bar
  bx(f,20,126,350,4,SURF,1,4); bx(f,20,126,350,4,OG,1,4);
  // Working days
  await tx(f,'Working Days',20,148,13,WH,'Semi Bold');
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const daysSel=[true,true,true,true,true,true,false];
  for (let i=0;i<days.length;i++){
    const ox=20+i*52, sel=daysSel[i];
    bx(f,ox,168,44,40,sel?OG:CARD,sel?1:1,8);
    if(sel)bx(f,ox,168,44,2,WH,.2,2);
    await tx(f,days[i],ox+6,180,9,sel?BK:GR,sel?'Bold':'Regular');
  }
  // Time slots
  await tx(f,'Working Hours',20,222,13,WH,'Semi Bold');
  bx(f,20,240,160,48,CARD,1,12); bx(f,20,240,160,1,WH,.05,12);
  await tx(f,'Start Time',28,252,10,GR); await tx(f,'8:00 AM',28,266,14,WH,'Semi Bold');
  await tx(f,'▾',160,264,14,GR);
  bx(f,190,240,160,48,CARD,1,12); bx(f,190,240,160,1,WH,.05,12);
  await tx(f,'End Time',198,252,10,GR); await tx(f,'8:00 PM',198,266,14,WH,'Semi Bold');
  await tx(f,'▾',330,264,14,GR);
  // Service radius
  await tx(f,'Service Radius',20,304,13,WH,'Semi Bold');
  await tx(f,'How far will you travel for jobs?',20,322,11,GR);
  bx(f,20,338,350,6,SURF,1,4); bx(f,20,338,245,6,OG,1,4);
  bx(f,255,332,18,18,OG,1,9); bx(f,259,336,10,10,WH,1,5);
  await tx(f,'7 km radius',150,350,11,GR);
  // Service areas map
  await tx(f,'Coverage Area',20,376,13,WH,'Semi Bold');
  bx(f,20,394,350,160,{r:.04,g:.08,b:.05},1,12);
  // Simplified map
  bx(f,20,394,350,160,{r:.06,g:.10,b:.06},.7,12);
  for (let i=0;i<5;i++) bx(f,20,394+i*32,350,1,{r:.09,g:.13,b:.09},.5);
  for (let i=0;i<5;i++) bx(f,20+i*88,394,1,160,{r:.09,g:.13,b:.09},.5);
  // Coverage circle overlay
  bx(f,115,434,160,80,OG,.08,80);
  bx(f,120,439,150,70,OG,.06,75);
  bx(f,192,470,8,8,OG,1,4);
  await tx(f,'Your location',168,484,9,OG,'Semi Bold');
  // Service area tags
  await tx(f,'Covered Areas:',20,566,11,GR);
  const areas=['Banjara Hills','Jubilee Hills','Madhapur','Gachibowli'];
  for (let i=0;i<areas.length;i++){
    const w=areas[i].length*6.5+18;
    const ox = i<2 ? 130+i*(w+8) : 130+(areas[i-2].length*6.5+26);
    const oy = i<2 ? 562 : 582;
    bx(f,ox,oy,w,22,OG,.15,11); bx(f,ox,oy,w,1,OG,.3,11);
    await tx(f,areas[i],ox+8,oy+6,9,OG,'Semi Bold');
  }
  // Breaks / unavailability
  await tx(f,'Lunch Break',20,606,13,WH,'Semi Bold');
  bx(f,20,624,350,48,CARD,1,12); bx(f,20,624,350,1,WH,.05,12);
  await tx(f,'1:00 PM – 2:00 PM (daily)',36,642,12,LG); await tx(f,'▾',334,642,14,GR);
  await BTN(f,20,692,350,'Complete Setup & Go Live',OG);
  await tx(f,'You can update this anytime from Settings',60,752,10,GR);
  await LBL(f,'P20 / AVAILABILITY SETUP');
  return f;
};

// P21: PROVIDER EDIT PROFILE
const P21 = async () => {
  const f = mk(provPage,9000,'P21 Provider Edit Profile',1);
  await SB(f);
  await HDR(f,'Edit Profile','Provider Account');
  bx(f,0,0,W,44,SURF,1);
  // Avatar
  bx(f,155,84,80,80,OG,.1,40);
  await AV(f,155,84,80,'RK',OG);
  bx(f,213,128,28,28,OG,1,14); await tx(f,'📷',218,133,12,WH);
  await tx(f,'Ravi Kumar',130,170,14,WH,'Bold');
  await tx(f,'Partner ID: PRV-2024-0042  •  Verified ✓',80,190,9,GN);
  // Form
  await INP(f,20,210,350,'Full Name','Ravi Kumar',OG);
  await INP(f,20,286,350,'Mobile','9876543210',OG);
  await INP(f,20,362,350,'Email','ravi.kumar@gmail.com',OG);
  await INP(f,20,438,350,'Years of Experience','5 years',OG);
  // Specializations
  await tx(f,'Specializations',20,502,11,LG);
  const specs=['Car Wash','Tyre Service','Oil Change','Detailing'];
  for(let i=0;i<specs.length;i++){
    const sel=i<3;
    bx(f,20+i*90,518,82,28,sel?OG:CARD,sel?.15:1,14);
    if(sel)bx(f,20+i*90,518,82,1,OG,.3,14);
    await tx(f,specs[i],26+i*90,524,9,sel?OG:GR,sel?'Semi Bold':'Regular');
  }
  // Bio
  await tx(f,'Bio / About',20,560,11,LG);
  bx(f,20,578,350,80,CARD,1,12); bx(f,20,578,350,1,WH,.05,12); bx(f,20,578,3,80,OG,1,2);
  await tx(f,'5+ years of experience in car detailing\nand wash services. Passionate about\ngiving cars a showroom finish.',28,590,10,LG);
  // Service area
  await INP(f,20,672,350,'Primary Area','Banjara Hills, Hyderabad',OG);
  await BTN(f,20,752,350,'Save Profile',OG);
  await NAV_P(f,3);
  await LBL(f,'P21 / EDIT PROFILE');
  return f;
};

// P22: SERVICE/PACKAGE EDITOR
const P22 = async () => {
  const f = mk(provPage,9450,'P22 Service Editor',1);
  await SB(f);
  await HDR(f,'My Services','Manage your offerings');
  bx(f,0,0,W,44,SURF,1);
  // Add new service button
  bx(f,20,90,350,44,OG,.15,22); bx(f,20,90,350,1,OG,.4,22);
  await tx(f,'+ Add New Service / Package',100,104,12,OG,'Semi Bold');
  // Service list
  const services=[
    {nm:'Basic Car Wash',dur:'30 min',pr:'₹149',active:true,bk:342},
    {nm:'Premium Wash + Polish',dur:'60 min',pr:'₹299',active:true,bk:218},
    {nm:'Full Interior Detailing',dur:'90 min',pr:'₹499',active:true,bk:87},
    {nm:'Engine Bay Cleaning',dur:'45 min',pr:'₹349',active:false,bk:12},
  ];
  for (let i=0;i<services.length;i++){
    const s=services[i], oy=146+i*132;
    CD(f,20,oy,350,124,12);
    if(!s.active)bx(f,20,oy,350,124,BG,.5,12);
    await tx(f,s.nm,32,oy+12,13,s.active?WH:GR,'Semi Bold');
    await tx(f,s.dur+'  •  '+s.bk+' bookings',32,oy+30,10,GR);
    // Price edit
    bx(f,32,oy+48,120,38,SURF,1,8); bx(f,32,oy+48,3,38,OG,.7,2);
    await tx(f,'Price',38,oy+52,9,GR);
    await tx(f,s.pr,38,oy+64,16,OG,'Bold');
    // Actions
    bx(f,170,oy+48,72,38,SURF,1,8); await tx(f,'✏ Edit',180,oy+62,10,CY);
    bx(f,252,oy+48,60,38,SURF,1,8); await tx(f,'📋 Copy',258,oy+62,10,GR);
    bx(f,322,oy+48,44,38,s.active?GN:EDGE,s.active?.15:.08,8);
    await tx(f,s.active?'ON':'OFF',328,oy+62,9,s.active?GN:GR,'Semi Bold');
    // Rating
    await tx(f,'★ 4.8  ('+Math.floor(s.bk*.6)+' reviews)',32,oy+98,10,ST);
    await BDG(f,222,oy+94,s.active?'Active':'Paused',s.active?GN:GR);
  }
  await NAV_P(f,0);
  await LBL(f,'P22 / SERVICE EDITOR');
  return f;
};

// P23: IN-JOB PHOTO DOCUMENTATION
const P23 = async () => {
  const f = mk(provPage,9900,'P23 Photo Documentation',1);
  await SB(f);
  await HDR(f,'Job Documentation','#JOB-2024-5521');
  bx(f,0,0,W,44,SURF,1);
  // Job info banner
  CD(f,20,90,350,48,10); bx(f,20,90,3,48,AM,1,2);
  await tx(f,'Ramprasad Mokka  •  Premium Wash',32,100,12,WH,'Semi Bold');
  await tx(f,'Sedan White  •  TS 09 AB 1234',32,116,10,GR);
  // Before photos
  await tx(f,'BEFORE Photos (Required)',20,154,12,WH,'Semi Bold');
  await tx(f,'3/4 required',296,158,9,GN);
  const beforeSlots=[{done:true},{done:true},{done:true},{done:false}];
  for (let i=0;i<beforeSlots.length;i++){
    const ox=20+i*88, b=beforeSlots[i];
    bx(f,ox,172,80,80,b.done?SURF:CARD,1,8);
    if(b.done){
      bx(f,ox,172,80,80,{r:.1,g:.12,b:.1},.7,8);
      bx(f,ox+28,172,24,80,WH,.03,4);
      await BDG(f,ox+4,242,'✓',GN);
    } else {
      bx(f,ox,172,80,80,EDGE,.15,8); bx(f,ox,172,80,1,EDGE,.3,8);
      await tx(f,'+',ox+32,196,24,GR,'Bold');
    }
    await tx(f,['Front L','Front R','Rear','Interior'][i],ox+4,258,8,GR);
  }
  // After photos
  await tx(f,'AFTER Photos (Required)',20,278,12,WH,'Semi Bold');
  await tx(f,'0/4 required',296,282,9,GR);
  for (let i=0;i<4;i++){
    const ox=20+i*88;
    bx(f,ox,296,80,80,EDGE,.1,8); bx(f,ox,296,80,1,EDGE,.2,8);
    await tx(f,'+',ox+32,320,24,GR,'Bold');
    await tx(f,['Front L','Front R','Rear','Interior'][i],ox+4,382,8,GR);
  }
  // Checklist
  await tx(f,'Completion Checklist',20,400,13,WH,'Semi Bold');
  const checks=[
    {task:'Exterior washed & dried',done:true},
    {task:'Windows cleaned (inside & out)',done:true},
    {task:'Interior vacuumed',done:true},
    {task:'Dashboard wiped & polished',done:false},
    {task:'Tyre shine applied',done:false},
    {task:'Final inspection completed',done:false},
  ];
  for(let i=0;i<checks.length;i++){
    const c=checks[i], oy=420+i*48;
    CD(f,20,oy,350,40,8);
    bx(f,28,oy+10,22,22,c.done?GN:EDGE,c.done?.25:.08,5);
    if(c.done)await tx(f,'✓',32,oy+12,11,GN,'Bold');
    await tx(f,c.task,60,oy+13,12,c.done?WH:GR,c.done?'Semi Bold':'Regular');
  }
  // Notes
  await tx(f,'Job Notes (optional)',20,710,12,WH,'Semi Bold');
  bx(f,20,728,350,60,CARD,1,10); bx(f,20,728,350,1,WH,.05,10);
  await tx(f,'Add any notes about the job...',28,748,11,GR);
  await BTN(f,20,798,350,'Submit & Complete Job',GN);
  await LBL(f,'P23 / PHOTO DOCUMENTATION');
  return f;
};

// P24: PAYOUT HISTORY DETAIL
const P24 = async () => {
  const f = mk(provPage,10350,'P24 Payout Detail',1);
  await SB(f);
  await HDR(f,'Payout Details','Settlement #PAY-2024-0089');
  bx(f,0,0,W,44,SURF,1);
  // Hero amount
  bx(f,20,90,350,100,NV,1,16); bx(f,20,90,350,100,OG,.1,16); bx(f,20,90,350,3,OG,.7,2);
  await tx(f,'Settled Amount',28,102,11,GR);
  await tx(f,'₹ 4,821.00',28,120,28,WH,'Bold');
  await tx(f,'Settled on 28 May 2024 at 11:30 AM',28,156,10,GR);
  await BDG(f,270,110,'Credited',GN);
  await tx(f,'To: HDFC •••• 8834',28,172,10,GR);
  // Breakdown
  await tx(f,'Earning Breakdown',20,206,13,WH,'Semi Bold');
  CD(f,20,224,350,200,12);
  const breakdown=[
    ['Gross Earnings (8 jobs)','₹5,680'],
    ['Platform Commission (15%)','–₹852'],
    ['GST on Commission (18%)','–₹153.36'],
    ['Performance Bonus','₹200'],
    ['Referral Credit','₹0'],
    ['Adjustment / Penalty','₹0'],
  ];
  for(let i=0;i<breakdown.length;i++){
    const oy=234+i*30;
    await tx(f,breakdown[i][0],32,oy,11,GR);
    await tx(f,breakdown[i][1],290,oy,11,i===0||i===3?GN:i>0&&i<3?RD:LG,'Semi Bold');
  }
  DIV(f,416); await tx(f,'Net Payout',32,422,12,WH,'Semi Bold'); await tx(f,'₹4,821.00',278,420,14,OG,'Bold');
  // Jobs in this payout
  await tx(f,'Jobs in this Settlement (8)',20,452,13,WH,'Semi Bold');
  const jobs=[
    {id:'JOB-5521',svc:'Premium Wash',earn:'₹299',cust:'Ramprasad M.'},
    {id:'JOB-5498',svc:'Interior Detail',earn:'₹499',cust:'Priya Reddy'},
    {id:'JOB-5476',svc:'Basic Wash',earn:'₹149',cust:'Kiran Kumar'},
    {id:'JOB-5453',svc:'Full Service',earn:'₹799',cust:'Anitha S.'},
  ];
  for(let i=0;i<jobs.length;i++){
    const j=jobs[i], oy=472+i*66;
    CD(f,20,oy,350,58,8);
    await tx(f,j.id,32,oy+8,10,GR);
    await tx(f,j.svc,32,oy+24,12,WH,'Semi Bold');
    await tx(f,j.cust,32,oy+40,10,GR);
    await tx(f,j.earn,298,oy+22,14,OG,'Bold');
  }
  await BTN2(f,20,742,350,'Download Settlement Report',OG);
  await NAV_P(f,2);
  await LBL(f,'P24 / PAYOUT DETAIL');
  return f;
};

// P25: INCENTIVES & BONUSES
const P25 = async () => {
  const f = mk(provPage,10800,'P25 Incentives & Bonuses',1);
  await SB(f);
  await HDR(f,'Incentives & Bonuses');
  bx(f,0,0,W,44,SURF,1);
  // Current earnings highlight
  bx(f,20,90,350,88,{r:.08,g:.06,b:.01},1,16); bx(f,20,90,350,88,AM,.15,16); bx(f,20,90,350,3,AM,1,2);
  await tx(f,'Bonus Earned This Month 🏆',28,102,12,AM,'Semi Bold');
  await tx(f,'₹ 1,200',28,120,26,WH,'Bold');
  await tx(f,'From 3 active bonus schemes',28,154,10,GR);
  // Active schemes
  await tx(f,'Active Bonus Schemes',20,194,13,WH,'Semi Bold');
  const schemes=[
    {nm:'Peak Hour Surge',desc:'Earn 2x on jobs 8–10 AM & 6–8 PM',pr:'2× rate',prog:3,goal:5,c:OG},
    {nm:'Weekend Warrior',desc:'Complete 5+ jobs on Sat–Sun',pr:'₹300 bonus',prog:4,goal:5,c:PK},
    {nm:'5-Star Streak',desc:'Get 10 consecutive 5-star ratings',pr:'₹500 bonus',prog:7,goal:10,c:ST},
    {nm:'Top Provider of Month',desc:'Rank #1 in your area',pr:'₹2,000',prog:2,goal:1,c:CY},
  ];
  for(let i=0;i<schemes.length;i++){
    const s=schemes[i], oy=212+i*110;
    CD(f,20,oy,350,102,12); bx(f,20,oy,3,102,s.c,1,2);
    await tx(f,s.nm,32,oy+12,13,WH,'Semi Bold');
    await tx(f,s.desc,32,oy+30,10,GR);
    // Progress bar
    bx(f,32,oy+52,240,6,SURF,1,4);
    const pct=Math.min(s.prog/s.goal,1);
    if(pct>0)bx(f,32,oy+52,Math.round(240*pct),6,s.c,1,4);
    await tx(f,s.prog+'/'+s.goal,280,oy+48,10,s.c,'Semi Bold');
    await tx(f,'Reward: '+s.pr,32,oy+68,10,GR);
    await BDG(f,260,oy+64,pct>=1?'Completed!':'In Progress',pct>=1?GN:s.c);
  }
  // Completed bonuses
  await tx(f,'Recently Earned',20,660,13,WH,'Semi Bold');
  const earned=[{nm:'Referral Bonus',amt:'₹200',dt:'25 May'},{nm:'Quick Acceptance Bonus',amt:'₹50',dt:'22 May'}];
  for(let i=0;i<earned.length;i++){
    CD(f,20,678+i*62,350,54,8);
    await tx(f,earned[i].nm,32,678+i*62+12,12,WH,'Semi Bold');
    await tx(f,earned[i].dt,32,678+i*62+30,10,GR);
    await tx(f,earned[i].amt,298,678+i*62+18,14,GN,'Bold');
  }
  await NAV_P(f,2);
  await LBL(f,'P25 / INCENTIVES & BONUSES');
  return f;
};

// P26: TRAINING & RESOURCES
const P26 = async () => {
  const f = mk(provPage,11250,'P26 Training & Resources',1);
  await SB(f);
  await HDR(f,'Training & Resources');
  bx(f,0,0,W,44,SURF,1);
  // Completion progress
  bx(f,20,90,350,64,SURF,1,12); bx(f,20,90,350,64,OG,.05,12);
  await tx(f,'Training Progress',28,102,12,OG,'Semi Bold');
  await tx(f,'8 of 12 modules completed',28,120,11,GR);
  bx(f,28,138,294,6,EDGE,1,4); bx(f,28,138,196,6,OG,1,4);
  await tx(f,'67%',316,134,9,OG,'Semi Bold');
  // Mandatory modules
  await tx(f,'Mandatory Modules',20,168,13,WH,'Semi Bold');
  const mandatory=[
    {nm:'Safety & Health Standards',dur:'15 min',done:true},
    {nm:'Customer Service Excellence',dur:'20 min',done:true},
    {nm:'Professional Conduct',dur:'10 min',done:true},
    {nm:'ServiCo App Walkthrough',dur:'25 min',done:false},
  ];
  for(let i=0;i<mandatory.length;i++){
    const m=mandatory[i], oy=186+i*66;
    CD(f,20,oy,350,58,10);
    bx(f,28,oy+9,40,40,m.done?GN:SURF,m.done?.12:.08,8);
    await tx(f,m.done?'✓':'▶',m.done?38:36,oy+19,14,m.done?GN:GR,'Bold');
    await tx(f,m.nm,78,oy+12,12,m.done?WH:LG,'Semi Bold');
    await tx(f,m.dur,78,oy+30,10,GR);
    await BDG(f,262,oy+16,m.done?'Done':'Required',m.done?GN:OG);
  }
  // Optional courses
  await tx(f,'Skill Upgrades (Optional)',20,456,13,WH,'Semi Bold');
  const optional=[
    {nm:'Advanced Car Detailing',dur:'40 min',c:CY},
    {nm:'AC & HVAC Basics',dur:'35 min',c:BL},
    {nm:'Electric Vehicle Care',dur:'30 min',c:GN},
    {nm:'Customer Upselling',dur:'20 min',c:AM},
  ];
  for(let i=0;i<optional.length;i++){
    const m=optional[i], oy=474+i*64;
    CD(f,20,oy,350,56,10); bx(f,20,oy,3,56,m.c,1,2);
    bx(f,28,oy+8,40,40,m.c,.12,8);
    await tx(f,'📖',34,oy+16,18,m.c);
    await tx(f,m.nm,78,oy+12,12,WH,'Semi Bold');
    await tx(f,m.dur+'  •  Certificate awarded',78,oy+30,10,GR);
    bx(f,296,oy+14,44,28,m.c,.2,14); bx(f,296,oy+14,44,1,m.c,.4,14);
    await tx(f,'Start',304,oy+21,9,m.c,'Semi Bold');
  }
  await NAV_P(f,0);
  await LBL(f,'P26 / TRAINING & RESOURCES');
  return f;
};

// ════════════════════════════════════════════════════════════
//  ADMIN — Additional Screens  A15–A22
// ════════════════════════════════════════════════════════════

// A15: USER DETAIL VIEW
const A15 = async () => {
  const f = mk(adminPage,6300,'A15 User Detail',2);
  await SB(f);
  await HDR(f,'Customer Profile','#USR-2024-0042');
  bx(f,0,0,W,44,SURF,1);
  // User hero
  await AV(f,20,90,64,'RM',CY);
  await tx(f,'Ramprasad Mokka',92,96,16,WH,'Bold');
  await tx(f,'+91 98765 43210  •  ramprasad@gmail.com',92,116,9,GR);
  await tx(f,'Gold Member  •  Since Jan 2023',92,132,9,ST);
  await BDG(f,92,150,'Active',GN);
  bx(f,300,100,66,28,RD,.15,14); bx(f,300,100,66,1,RD,.3,14);
  await tx(f,'⚑ Flag',308,108,10,RD,'Semi Bold');
  DIV(f,174);
  // Stats row
  const uStats=[{v:'42',l:'Bookings'},{v:'₹12.4k',l:'Spent'},{v:'4.8',l:'Avg Rating'},{v:'2,840',l:'Points'}];
  for(let i=0;i<uStats.length;i++) await SC(f,20+i*88,182,80,uStats[i].v,uStats[i].l,CY);
  // Booking history
  await tx(f,'Recent Bookings',20,276,13,WH,'Semi Bold');
  await tx(f,'View All',304,280,10,CY);
  const bkHist=[
    {svc:'Premium Car Wash',dt:'28 May',pr:'₹299',st:'Completed'},
    {svc:'AC Repair',dt:'22 May',pr:'₹599',st:'Completed'},
    {svc:'Tyre Change',dt:'15 May',pr:'₹249',st:'Cancelled'},
  ];
  for(let i=0;i<bkHist.length;i++){
    const b=bkHist[i], oy=296+i*64;
    CD(f,20,oy,350,56,8);
    await tx(f,b.svc,32,oy+10,12,WH,'Semi Bold');
    await tx(f,b.dt,32,oy+28,10,GR);
    await tx(f,b.pr,290,oy+12,13,CY,'Bold');
    await BDG(f,246,oy+28,b.st,b.st==='Completed'?GN:b.st==='Cancelled'?RD:AM);
  }
  // Complaints
  await tx(f,'Complaints / Flags',20,494,13,WH,'Semi Bold');
  CD(f,20,512,350,56,8); bx(f,20,512,3,56,RD,1,2);
  await tx(f,'Service not completed — Car Wash',32,524,12,WH,'Semi Bold');
  await tx(f,'28 May 2024  •  Refund ₹299 initiated',32,542,10,GR);
  await BDG(f,274,520,'Under Review',AM);
  // Admin actions
  await tx(f,'Admin Actions',20,582,13,WH,'Semi Bold');
  const adminActs=['Send Message','Block Account','Issue Refund','Adjust Points'];
  for(let i=0;i<adminActs.length;i++){
    const col=i%2, row=Math.floor(i/2), ox=20+col*182, oy=600+row*52;
    bx(f,ox,oy,174,44,CARD,1,10); bx(f,ox,oy,174,1,EDGE,.3,10);
    await tx(f,adminActs[i],ox+30,oy+14,11,LG,'Semi Bold');
  }
  await NAV_A(f,1);
  await LBL(f,'A15 / USER DETAIL');
  return f;
};

// A16: PROVIDER DETAIL (Admin view - more detailed than A14)
const A16 = async () => {
  const f = mk(adminPage,6750,'A16 Provider Full Detail',2);
  await SB(f);
  await HDR(f,'Provider Profile','PRV-2024-0042');
  bx(f,0,0,W,44,SURF,1);
  // Provider hero
  await AV(f,20,90,64,'RK',OG);
  await tx(f,'Ravi Kumar',92,96,16,WH,'Bold');
  await tx(f,'Car Wash Specialist  •  Banjara Hills',92,116,10,GR);
  await BDG(f,92,136,'Verified ✓',GN); await BDG(f,152,136,'Gold Partner',ST);
  // Risk / trust score
  bx(f,290,96,72,44,SURF,1,10);
  await tx(f,'Trust Score',294,100,8,GR);
  await tx(f,'94',300,112,20,GN,'Bold'); await tx(f,'/100',322,118,9,GR);
  DIV(f,168);
  // Performance stats
  const pStats=[{v:'342',l:'Jobs Done'},{v:'₹58k',l:'Earned'},{v:'4.9',l:'Rating'},{v:'97%',l:'Acceptance'}];
  for(let i=0;i<pStats.length;i++) await SC(f,20+i*88,176,80,pStats[i].v,pStats[i].l,OG);
  // KYC Status
  await tx(f,'KYC & Documents',20,272,13,WH,'Semi Bold');
  const kyc=[['Aadhaar','Verified','28 Jan 2024'],['PAN','Verified','28 Jan 2024'],['Bank Account','Verified','28 Jan 2024'],['BG Check','Cleared','15 Feb 2024']];
  for(let i=0;i<kyc.length;i++){
    const oy=290+i*38;
    bx(i===0?f:f,20,oy,350,32,SURF,.5,6);
    await tx(f,kyc[i][0],30,oy+10,11,LG);
    await BDG(f,140,oy+8,kyc[i][1],GN);
    await tx(f,kyc[i][2],250,oy+10,9,GR);
  }
  // Service coverage
  await tx(f,'Services Offered',20,444,13,WH,'Semi Bold');
  const svcs=['Basic Wash','Premium Wash','Interior Detail','Engine Clean'];
  for(let i=0;i<svcs.length;i++){
    bx(f,20+i*90,462,82,28,OG,.12,14); bx(f,20+i*90,462,82,1,OG,.3,14);
    await tx(f,svcs[i],24+i*90,468,8,OG,'Semi Bold');
  }
  // Action bar
  await tx(f,'Admin Actions',20,506,13,WH,'Semi Bold');
  const acts=[['Suspend Partner',RD],['Adjust Rating',AM],['Send Warning',OG],['Add Bonus',GN]];
  for(let i=0;i<acts.length;i++){
    const col=i%2, row=Math.floor(i/2);
    const ox=20+col*182, oy=524+row*52;
    bx(f,ox,oy,174,44,acts[i][1],.12,10); bx(f,ox,oy,174,1,acts[i][1],.3,10);
    await tx(f,acts[i][0],ox+18,oy+14,11,acts[i][1],'Semi Bold');
  }
  // Recent complaints
  await tx(f,'Open Complaints (1)',20,636,13,WH,'Semi Bold');
  CD(f,20,654,350,56,8); bx(f,20,654,3,56,AM,1,2);
  await tx(f,'Customer reports overcharge — ₹50',32,666,12,WH,'Semi Bold');
  await tx(f,'28 May 2024  •  Being investigated',32,684,10,GR);
  await BDG(f,268,662,'Under Review',AM);
  await NAV_A(f,1);
  await LBL(f,'A16 / PROVIDER FULL DETAIL');
  return f;
};

// A17: ORDER DETAIL VIEW
const A17 = async () => {
  const f = mk(adminPage,7200,'A17 Order Detail',2);
  await SB(f);
  await HDR(f,'Order Detail','#SVC-2024-8821');
  bx(f,0,0,W,44,SURF,1);
  // Order summary
  bx(f,20,90,350,72,SURF,1,12); bx(f,20,90,3,72,CY,1,2);
  await tx(f,'Premium Car Wash',32,100,14,WH,'Bold');
  await tx(f,'Ramprasad Mokka  →  Ravi Kumar',32,120,10,GR);
  await tx(f,'28 May 2024  •  2:00 PM  •  Banjara Hills',32,136,10,GR);
  await BDG(f,240,100,'Completed',GN);
  await tx(f,'₹ 299',298,98,16,CY,'Bold');
  // Order timeline
  await tx(f,'Order Timeline',20,176,13,WH,'Semi Bold');
  const timeline=[
    {ev:'Order Placed',tm:'1:42 PM',done:true,c:GN},
    {ev:'Provider Accepted',tm:'1:45 PM',done:true,c:GN},
    {ev:'Provider En Route',tm:'1:58 PM',done:true,c:GN},
    {ev:'Service Started',tm:'2:05 PM',done:true,c:GN},
    {ev:'Service Completed',tm:'2:45 PM',done:true,c:GN},
    {ev:'Payment Received',tm:'2:46 PM',done:true,c:GN},
  ];
  for(let i=0;i<timeline.length;i++){
    const t=timeline[i], oy=194+i*52;
    bx(f,28,oy,20,20,t.c,.25,10); await tx(f,'✓',32,oy+3,10,t.c,'Bold');
    if(i<timeline.length-1) bx(f,37,oy+20,2,32,t.c,.3);
    await tx(f,t.ev,58,oy+3,12,WH,'Semi Bold');
    await tx(f,t.tm,292,oy+5,10,GR);
  }
  // Payment
  DIV(f,510);
  await tx(f,'Payment Details',20,518,13,WH,'Semi Bold');
  const payDets=[['Service Amount','₹299'],['Promo Applied','–₹0'],['Net Amount','₹299'],['Provider Payout','₹254.15'],['Platform Earn','₹44.85']];
  for(let i=0;i<payDets.length;i++){
    await tx(f,payDets[i][0],30,536+i*24,11,i>2?GR:LG);
    await tx(f,payDets[i][1],296,536+i*24,11,i===3?OG:i===4?PK:LG,'Semi Bold');
  }
  DIV(f,660);
  // Admin actions
  await tx(f,'Admin Actions',20,668,13,WH,'Semi Bold');
  bx(f,20,686,110,40,RD,.15,10); bx(f,20,686,110,1,RD,.3,10);
  await tx(f,'Issue Refund',26,700,10,RD,'Semi Bold');
  bx(f,138,686,110,40,AM,.15,10); bx(f,138,686,110,1,AM,.3,10);
  await tx(f,'Flag Order',148,700,10,AM,'Semi Bold');
  bx(f,256,686,110,40,BL,.15,10); bx(f,256,686,110,1,BL,.3,10);
  await tx(f,'View Chat',266,700,10,BL,'Semi Bold');
  await NAV_A(f,2);
  await LBL(f,'A17 / ORDER DETAIL');
  return f;
};

// A18: CONTENT MODERATION
const A18 = async () => {
  const f = mk(adminPage,7650,'A18 Content Moderation',2);
  await SB(f);
  await HDR(f,'Content Moderation','Reviews & Reports');
  bx(f,0,0,W,44,SURF,1);
  // Summary stats
  const modStats=[{v:'14',l:'Flagged Reviews',c:RD},{v:'6',l:'Fake Suspected',c:AM},{v:'238',l:'Auto-Approved',c:GN}];
  for(let i=0;i<modStats.length;i++){
    bx(f,20+i*118,90,108,64,CARD,1,10); bx(f,20+i*118,90,108,3,modStats[i].c,1,2);
    await tx(f,modStats[i].v,50+i*118,102,24,modStats[i].c,'Bold');
    await tx(f,modStats[i].l,24+i*118,130,8,GR);
  }
  // Filter tabs
  const tabs=['All','Flagged','Fake','Approved'];
  for(let i=0;i<tabs.length;i++){
    const sel=i===1;
    bx(f,20+i*90,166,82,30,sel?RD:CARD,sel?.15:1,15);
    if(sel)bx(f,20+i*90,166,82,1,RD,.4,15);
    await tx(f,tabs[i],28+i*90,178,10,sel?RD:GR,sel?'Semi Bold':'Regular');
  }
  DIV(f,200);
  // Review items
  const reviews=[
    {usr:'Kiran K.',svc:'Car Wash',rating:1,rev:'Service was terrible, car not cleaned at all.',flag:'Dispute',c:RD},
    {usr:'Anonymous',svc:'AC Repair',rating:5,rev:'Best service ever!! 10/10 will always use!',flag:'Fake Suspected',c:AM},
    {usr:'Meera S.',svc:'Plumbing',rating:2,rev:'Plumber arrived 2 hours late and work was shoddy.',flag:'Legitimate',c:GN},
  ];
  for(let i=0;i<reviews.length;i++){
    const r=reviews[i], oy=208+i*168;
    CD(f,20,oy,350,160,10);
    bx(f,20,oy,3,160,r.c,1,2);
    await tx(f,r.usr,32,oy+12,12,WH,'Semi Bold');
    await tx(f,'for '+r.svc,32,oy+28,10,GR);
    for(let s=0;s<5;s++) await tx(f,'★',32+s*16,oy+44,12,s<r.rating?ST:EDGE,'Bold');
    await BDG(f,196,oy+40,r.flag,r.c);
    bx(f,28,oy+64,294,52,SURF,.5,8);
    await tx(f,'"'+r.rev.substring(0,60)+(r.rev.length>60?'…':'')+'"',32,oy+74,10,LG);
    // Action row
    bx(f,28,oy+124,88,28,GN,.15,10); bx(f,28,oy+124,88,1,GN,.3,10);
    await tx(f,'✓ Approve',42,oy+130,9,GN,'Semi Bold');
    bx(f,124,oy+124,88,28,RD,.15,10); bx(f,124,oy+124,88,1,RD,.3,10);
    await tx(f,'✕ Remove',136,oy+130,9,RD,'Semi Bold');
    bx(f,220,oy+124,88,28,AM,.15,10); bx(f,220,oy+124,88,1,AM,.3,10);
    await tx(f,'⚑ Flag',234,oy+130,9,AM,'Semi Bold');
    bx(f,316,oy+124,46,28,BL,.15,10); bx(f,316,oy+124,46,1,BL,.3,10);
    await tx(f,'Chat',322,oy+130,9,BL,'Semi Bold');
  }
  await NAV_A(f,2);
  await LBL(f,'A18 / CONTENT MODERATION');
  return f;
};

// A19: INCENTIVE MANAGEMENT
const A19 = async () => {
  const f = mk(adminPage,8100,'A19 Incentive Management',2);
  await SB(f);
  await HDR(f,'Incentive Management','Provider Bonus Schemes');
  bx(f,0,0,W,44,SURF,1);
  // Summary
  const incStats=[{v:'6',l:'Active Schemes',c:OG},{v:'₹48k',l:'Paid This Month',c:GN},{v:'234',l:'Beneficiaries',c:CY}];
  for(let i=0;i<incStats.length;i++){
    bx(f,20+i*118,90,108,64,CARD,1,10); bx(f,20+i*118,90,108,3,incStats[i].c,1,2);
    await tx(f,incStats[i].v,44+i*118,100,22,incStats[i].c,'Bold');
    await tx(f,incStats[i].l,26+i*118,128,8,GR);
  }
  bx(f,20,166,350,44,OG,.15,22); bx(f,20,166,350,1,OG,.4,22);
  await tx(f,'+ Create New Incentive Scheme',95,181,12,OG,'Semi Bold');
  // Scheme list
  const schemes=[
    {nm:'Peak Hour Surge',type:'Multiplier',val:'2× earnings 8–10 AM',active:true,uses:89},
    {nm:'Weekend Warrior',type:'Completion Bonus',val:'₹300 for 5+ weekend jobs',active:true,uses:34},
    {nm:'5-Star Streak Bonus',type:'Quality Bonus',val:'₹500 for 10× 5-star',active:true,uses:12},
    {nm:'New City Launch',type:'Signup Bonus',val:'₹1,000 first 50 providers',active:false,uses:0},
  ];
  for(let i=0;i<schemes.length;i++){
    const s=schemes[i], oy=222+i*120;
    CD(f,20,oy,350,112,10);
    bx(f,20,oy,3,112,s.active?OG:EDGE,1,2);
    await tx(f,s.nm,32,oy+12,13,WH,'Semi Bold');
    await tx(f,s.type,32,oy+30,10,GR);
    await tx(f,s.val,32,oy+48,10,LG);
    await tx(f,s.uses+' providers using',32,oy+66,10,GR);
    await BDG(f,240,oy+12,s.active?'Active':'Paused',s.active?GN:GR);
    bx(f,270,oy+70,36,28,CY,.15,8); await tx(f,'Edit',276,oy+79,9,CY);
    bx(f,314,oy+70,36,28,s.active?RD:GN,s.active?.15:.15,8);
    await tx(f,s.active?'Off':'On',s.active?318:318,oy+79,9,s.active?RD:GN);
  }
  await NAV_A(f,0);
  await LBL(f,'A19 / INCENTIVE MGMT');
  return f;
};

// A20: GEOGRAPHIC ANALYTICS
const A20 = async () => {
  const f = mk(adminPage,8550,'A20 Geographic Analytics',2);
  await SB(f);
  await HDR(f,'Geographic Analytics','City Performance');
  bx(f,0,0,W,44,SURF,1);
  // City selector
  bx(f,20,90,350,36,CARD,1,18); bx(f,20,90,350,1,PK,.3,18);
  await tx(f,'City: Hyderabad ▾',28,101,12,LG); await tx(f,'May 2024 ▾',270,101,12,GR);
  // Heatmap simulation
  bx(f,20,138,350,200,{r:.04,g:.07,b:.04},1,12);
  for(let i=0;i<7;i++) bx(f,20,138+i*28,350,1,{r:.08,g:.11,b:.08},.5);
  for(let i=0;i<5;i++) bx(f,20+i*88,138,1,200,{r:.08,g:.11,b:.08},.5);
  // Heatmap dots
  const heatDots=[
    {x:120,y:190,sz:50,c:RD,a:.5},{x:220,y:210,sz:40,c:OG,a:.45},
    {x:90,y:260,sz:35,c:AM,a:.4},{x:280,y:175,sz:30,c:AM,a:.35},
    {x:170,y:300,sz:28,c:GN,a:.3},{x:300,y:260,sz:20,c:GN,a:.25},
  ];
  for(const d of heatDots){bx(f,d.x,d.y,d.sz,d.sz,d.c,d.a,d.sz/2);}
  await tx(f,'🔴 High Demand  🟡 Medium  🟢 Low',60,350,9,GR);
  // Area breakdown
  await tx(f,'Area Performance',20,374,13,WH,'Semi Bold');
  await tx(f,'Bookings  •  Revenue  •  Providers',180,378,9,GR);
  const areas=[
    {nm:'Banjara Hills',bk:342,rev:'₹1.2L',prov:18,c:RD},
    {nm:'Jubilee Hills',bk:218,rev:'₹78k',prov:12,c:OG},
    {nm:'Madhapur / HITEC',bk:189,rev:'₹65k',prov:10,c:AM},
    {nm:'Gachibowli',bk:156,rev:'₹54k',prov:9,c:GN},
    {nm:'Kondapur',bk:98,rev:'₹34k',prov:6,c:GN},
  ];
  for(let i=0;i<areas.length;i++){
    const a=areas[i], oy=392+i*72;
    CD(f,20,oy,350,64,8);
    bx(f,20,oy,4,64,a.c,1,2);
    await tx(f,a.nm,32,oy+8,12,WH,'Semi Bold');
    // Mini bar
    const barW=Math.round((a.bk/342)*180);
    bx(f,32,oy+30,180,8,SURF,1,4); bx(f,32,oy+30,barW,8,a.c,.6,4);
    await tx(f,a.bk+' bookings',32,oy+44,9,GR);
    await tx(f,a.rev,268,oy+10,13,CY,'Bold');
    await tx(f,a.prov+' providers',268,oy+30,9,GR);
  }
  await NAV_A(f,3);
  await LBL(f,'A20 / GEOGRAPHIC ANALYTICS');
  return f;
};

// A21: AUDIT LOG
const A21 = async () => {
  const f = mk(adminPage,9000,'A21 Audit Log',2);
  await SB(f);
  await HDR(f,'Audit Log','All Admin Actions');
  bx(f,0,0,W,44,SURF,1);
  // Search & filters
  bx(f,20,90,230,40,CARD,1,10); bx(f,20,90,230,1,WH,.05,10);
  await tx(f,'🔍  Search actions...',30,103,11,GR);
  bx(f,258,90,112,40,CARD,1,10); bx(f,258,90,112,1,EDGE,.3,10);
  await tx(f,'Filter ▾',286,103,11,GR);
  // Type filters
  const logTypes=['All','User','Provider','Finance','System'];
  for(let i=0;i<logTypes.length;i++){
    const sel=i===0;
    bx(f,20+i*74,140,66,26,sel?PK:CARD,sel?.15:1,13);
    if(sel)bx(f,20+i*74,140,66,1,PK,.4,13);
    await tx(f,logTypes[i],28+i*74,148,9,sel?PK:GR,sel?'Semi Bold':'Regular');
  }
  DIV(f,172);
  // Log entries
  const logs=[
    {admin:'Suresh M.',action:'Suspended provider PRV-0088',cat:'Provider',tm:'28 May 4:45 PM',sev:'high'},
    {admin:'Deepa R.',action:'Issued refund ₹299 for SVC-8821',cat:'Finance',tm:'28 May 4:30 PM',sev:'medium'},
    {admin:'Suresh M.',action:'Approved KYC for PRV-0094',cat:'Provider',tm:'28 May 3:12 PM',sev:'low'},
    {admin:'Anand K.',action:'Updated promo code MONSOON20',cat:'System',tm:'28 May 2:00 PM',sev:'low'},
    {admin:'Deepa R.',action:'Banned user USR-0223 (fraud)',cat:'User',tm:'28 May 11:30 AM',sev:'high'},
    {admin:'Anand K.',action:'Pushed notification to all users',cat:'System',tm:'28 May 10:00 AM',sev:'medium'},
    {admin:'Suresh M.',action:'Exported revenue report May 2024',cat:'Finance',tm:'28 May 9:00 AM',sev:'low'},
  ];
  const sevColors={high:RD,medium:AM,low:GN};
  for(let i=0;i<logs.length;i++){
    const l=logs[i], oy=180+i*84;
    CD(f,20,oy,350,76,8);
    bx(f,20,oy,3,76,sevColors[l.sev],1,2);
    await tx(f,l.admin,32,oy+8,11,WH,'Semi Bold');
    await tx(f,l.cat,240,oy+8,9,LG);
    await tx(f,l.action,32,oy+26,11,LG);
    await tx(f,l.tm,32,oy+48,9,GR);
    await BDG(f,270,oy+44,l.sev.charAt(0).toUpperCase()+l.sev.slice(1),sevColors[l.sev]);
  }
  await NAV_A(f,3);
  await LBL(f,'A21 / AUDIT LOG');
  return f;
};

// A22: API & INTEGRATION SETTINGS
const A22 = async () => {
  const f = mk(adminPage,9450,'A22 API & Integrations',2);
  await SB(f);
  await HDR(f,'API & Integrations','System Configuration');
  bx(f,0,0,W,44,SURF,1);
  // Warning banner
  bx(f,20,90,350,44,{r:.14,g:.08,b:.01},1,10); bx(f,20,90,350,3,AM,1,2);
  await tx(f,'⚠  Changes here affect live production systems.',32,102,10,AM,'Semi Bold');
  await tx(f,'Proceed with caution.',32,118,10,GR);
  // API Keys section
  await tx(f,'API Keys',20,148,13,WH,'Semi Bold');
  const apis=[
    {nm:'Payment Gateway (Razorpay)',key:'rzp_live_••••••••••••••KL',env:'Live',c:GN},
    {nm:'Maps & Geo (Google Maps)',key:'AIza••••••••••••••••••••',env:'Live',c:GN},
    {nm:'SMS / OTP (MSG91)',key:'MSG91••••••••••••••',env:'Live',c:GN},
    {nm:'Push Notifications (FCM)',key:'AAAA••••••••••••••••••',env:'Live',c:GN},
  ];
  for(let i=0;i<apis.length;i++){
    const a=apis[i], oy=166+i*92;
    CD(f,20,oy,350,84,10);
    bx(f,20,oy,3,84,a.c,1,2);
    await tx(f,a.nm,32,oy+10,11,WH,'Semi Bold');
    bx(f,32,oy+28,240,28,SURF,1,6);
    await tx(f,a.key,38,oy+35,9,GR);
    bx(f,280,oy+28,44,28,CY,.12,8); await tx(f,'Copy',288,oy+36,9,CY);
    bx(f,332,oy+28,30,28,OG,.12,8); await tx(f,'Edit',334,oy+36,9,OG);
    await BDG(f,232,oy+8,a.env,a.c);
  }
  // Webhooks
  await tx(f,'Webhooks',20,542,13,WH,'Semi Bold');
  const hooks=[
    {url:'https://api.servico.app/webhook/payment',ev:'payment.success',active:true},
    {url:'https://api.servico.app/webhook/otp',ev:'otp.delivered',active:true},
    {url:'https://api.servico.app/webhook/fraud',ev:'fraud.alert',active:false},
  ];
  for(let i=0;i<hooks.length;i++){
    const h=hooks[i], oy=560+i*72;
    CD(f,20,oy,350,64,8);
    await tx(f,h.ev,32,oy+8,10,CY,'Semi Bold');
    await tx(f,h.url.replace('https://',''),32,oy+26,8,GR);
    bx(f,306,oy+14,36,20,h.active?GN:EDGE,h.active?1:.3,10);
    bx(f,h.active?322:308,oy+16,16,16,WH,1,8);
  }
  bx(f,20,778,350,44,CY,.15,22); bx(f,20,778,350,1,CY,.4,22);
  await tx(f,'Save All Integration Settings',90,793,12,CY,'Semi Bold');
  await NAV_A(f,0);
  await LBL(f,'A22 / API & INTEGRATIONS');
  return f;
};

// ── Build ALL screens ─────────────────────────────────────
// Customer C1–C26 (row 0) — built before new screens
// Customer C27–C36 (row 0, continued)
const c27=await C27(), c28=await C28(), c29=await C29(), c30=await C30();
const c31=await C31(), c32=await C32(), c33=await C33(), c34=await C34();
const c35=await C35(), c36=await C36();
console.log('Customer extended screens done (36/84)');

// Provider P20–P26 (row 1, continued)
const p20=await P20(), p21=await P21(), p22=await P22(), p23=await P23();
const p24=await P24(), p25=await P25(), p26=await P26();
console.log('Provider extended screens done (45/84 provider)');

// Admin A1–A14 + A15–A22 (row 2)
const a1=await A1(), a2=await A2(), a3=await A3(), a4=await A4(), a5=await A5();
const a6=await A6(), a7=await A7(), a8=await A8();
const a9=await A9(), a10=await A10(), a11=await A11(), a12=await A12();
const a13=await A13(), a14=await A14();
const a15=await A15(), a16=await A16(), a17=await A17(), a18=await A18();
const a19=await A19(), a20=await A20(), a21=await A21(), a22=await A22();
console.log('All screens done (84/84)');

// ── All 19 screens built — now add prototype links ───────────
// Wrapped in try/catch so a failed link never blocks screen rendering
try {
  // ── Customer flow ──────────────────────────────────────────
  lnk(c15,20,626,350,52,c1.id);         // Onboarding -> Login
  lnk(c15,20,692,350,48,c1.id);         // Already have account
  lnk(c1,20,472,350,52,c3.id);          // Login -> Home
  lnk(c1,248,684,132,18,c2.id);         // Register here
  lnk(c1,246,450,100,18,c17.id);        // Forgot Password
  lnk(c2,20,696,350,52,c3.id);          // Register -> Home (OTP verified)
  lnk(c16,20,686,350,52,c3.id);         // OTP Login -> Home
  lnk(c3,308,44,36,36,c13.id);          // Bell -> Notifications
  for (let i=0;i<6;i++){const col=i%3,row=Math.floor(i/3); lnk(c3,20+col*120,358+row*94,110,84,c18.id);}
  lnk(c3,308,336,82,18,c18.id);         // See All services
  lnk(c3,20,584,170,86,c9.id); lnk(c3,200,584,170,86,c9.id); // Near you -> Provider Detail
  lnk(c4,20,262,330,112,c9.id); lnk(c4,20,384,330,112,c9.id);
  lnk(c4,20,506,330,112,c9.id); lnk(c4,20,628,330,112,c9.id);
  lnk(c9,192,770,178,52,c5.id);         // Provider Detail -> Booking
  lnk(c5,18,792,354,36,c6.id);          // Booking -> Payment
  lnk(c6,20,654,350,52,c10.id);         // Payment -> Confirmation
  lnk(c10,20,696,350,52,c7.id);         // Confirmation -> Tracking
  lnk(c7,190,736,180,44,c11.id);        // Tracking -> Rate & Review
  lnk(c11,20,792,350,52,c12.id);        // Rate -> My Bookings
  lnk(c12,20,162,350,108,c19.id);       // Booking row -> Detail
  lnk(c19,20,700,165,52,c12.id);        // Detail -> back to list
  lnk(c8,264,790,82,20,c11.id);         // Profile Rate+Rebook
  lnk(c18,20,134,164,94,c4.id);         // Category Browse -> Provider List
  lnk(c20,16,44,36,36,c7.id);           // Chat back -> Tracking
  lnk(c21,16,44,36,36,c8.id);           // Address back -> Profile
  lnk(c22,16,44,36,36,c8.id);
  lnk(c23,20,686,350,52,c3.id);         // Referral -> Home
  lnk(c24,16,44,36,36,c8.id);
  lnk(c25,16,44,36,36,c8.id);
  lnk(c26,16,44,36,36,c8.id);

  // ── Provider flow ──────────────────────────────────────────
  lnk(p1,20,460,350,52,p2.id);          // Login -> Dashboard
  lnk(p1,316,590,60,26,p11.id);         // New partner -> Onboarding step 1
  lnk(p11,20,632,350,52,p7.id);         // Step 1 -> KYC (step 2)
  lnk(p7,20,730,350,52,p12.id);         // KYC -> Services (step 3)
  lnk(p12,20,710,350,52,p13.id);        // Services -> Bank (step 4)
  lnk(p13,20,696,350,52,p2.id);         // Bank -> Dashboard (live!)
  lnk(p2,82,404,70,22,p3.id);           // Accept incoming -> Request Detail
  lnk(p2,82,512,70,22,p3.id);
  lnk(p3,194,678,176,54,p4.id);         // Accept Job -> Active Jobs
  lnk(p4,32,218,132,24,p5.id);          // Mark complete -> Job Detail
  for (let i=0;i<3;i++) lnk(p4,268,288+i*90,72,46,p5.id);
  lnk(p5,192,660,178,52,p9.id);         // Job Detail -> Completion OTP
  lnk(p9,199,666,171,52,p6.id);         // OTP -> Earnings
  lnk(p8,230,H-186,120,34,p5.id);       // Arrived -> Job Detail
  lnk(p14,20,614,350,52,p2.id);         // Calendar -> Dashboard
  lnk(p15,16,44,36,36,p4.id);           // Chat -> Active Jobs
  lnk(p16,16,44,36,36,p2.id);           // Notif -> Dashboard
  lnk(p17,16,44,36,36,p2.id);           // History -> Dashboard
  lnk(p18,16,44,36,36,p2.id);           // Performance -> Dashboard
  lnk(p19,16,44,36,36,p2.id);           // Help -> Dashboard
  lnk(p10,16,44,36,36,p2.id);           // Profile back

  // ── Admin flow ─────────────────────────────────────────────
  lnk(a1,20,440,164,48,a2.id);          // quick actions
  lnk(a1,198,440,164,48,a3.id);
  lnk(a1,20,496,164,48,a4.id);
  lnk(a1,198,496,164,48,a5.id);
  lnk(a2,274,238,66,24,a6.id);          // User -> Provider Verify
  lnk(a3,274,170,68,22,a4.id);          // Orders -> Complaints
  lnk(a4,216,200,70,22,a1.id);
  lnk(a5,268,742,92,16,a11.id);         // Analytics -> Revenue Reports
  lnk(a6,16,44,36,36,a2.id);            // Verify back
  lnk(a7,16,44,36,36,a1.id);            // Promos back
  lnk(a8,16,44,36,36,a1.id);            // Payouts back
  lnk(a9,16,44,36,36,a1.id);
  lnk(a10,16,44,36,36,a1.id);
  lnk(a11,16,44,36,36,a5.id);
  lnk(a12,16,44,36,36,a1.id);
  lnk(a13,16,44,36,36,a4.id);
  lnk(a14,16,44,36,36,a2.id);

  // ── Extended Customer links ─────────────────────────────
  lnk(c3,20,44,36,36,c27.id);              // Home map icon -> Map View
  lnk(c3,20,90,350,44,c28.id);             // Home search bar -> Search Results
  lnk(c27,16,50,318,44,c28.id);            // Map search -> Search Results
  lnk(c28,20,218,350,128,c9.id);           // Search result -> Provider Detail
  lnk(c8,16,44,36,36,c29.id);              // Profile edit button -> Edit Profile
  lnk(c29,20,706,350,52,c8.id);            // Edit Profile save -> Profile
  lnk(c8,20,350,350,52,c30.id);            // Profile payment methods -> Payment Methods
  lnk(c6,20,130,350,44,c30.id);            // Payment screen -> Payment Methods
  lnk(c11,16,44,36,36,c31.id);             // Review screen report issue -> Complaint
  lnk(c31,20,752,350,52,c32.id);           // Complaint submit -> Refund Status
  lnk(c32,20,764,350,48,c26.id);           // Refund -> Support
  lnk(c3,160,226,50,36,c33.id);            // Home explore -> Recommendations
  lnk(c33,20,248,114,100,c9.id);           // Trending card -> Provider Detail
  lnk(c8,20,450,350,52,c34.id);            // Profile rewards -> Loyalty
  lnk(c12,20,162,350,108,c35.id);          // My Bookings -> Invoice/Receipt
  lnk(c35,20,684,350,52,c5.id);            // Invoice rebook -> Booking
  lnk(c5,20,90,350,56,c36.id);             // Booking add-ons -> Add-ons screen
  lnk(c36,20,710,350,44,c6.id);            // Add-ons confirm -> Payment

  // ── Extended Provider links ─────────────────────────────
  lnk(p13,20,696,350,52,p20.id);           // Bank Setup -> Availability (Step 4)
  lnk(p20,20,692,350,52,p2.id);            // Availability -> Dashboard (live!)
  lnk(p10,16,44,36,36,p21.id);             // Provider Profile -> Edit Profile
  lnk(p21,20,752,350,52,p10.id);           // Edit Profile save -> Profile
  lnk(p12,20,710,350,52,p22.id);           // Services Setup -> Service Editor
  lnk(p22,16,44,36,36,p2.id);              // Service Editor -> Dashboard
  lnk(p5,192,660,178,52,p23.id);           // Job Detail -> Photo Documentation
  lnk(p23,20,798,350,38,p9.id);            // Photo docs submit -> Completion OTP
  lnk(p6,16,44,36,36,p24.id);              // Earnings -> Payout Detail
  lnk(p24,20,742,350,48,p6.id);            // Payout Detail -> Earnings
  lnk(p6,200,650,160,44,p25.id);           // Earnings -> Incentives
  lnk(p25,16,44,36,36,p6.id);              // Incentives -> Earnings
  lnk(p19,20,300,350,64,p26.id);           // Provider Help -> Training
  lnk(p26,16,44,36,36,p2.id);              // Training -> Dashboard

  // ── Extended Admin links ────────────────────────────────
  lnk(a15,16,44,36,36,a2.id);              // User Detail -> User Mgmt
  lnk(a2,20,296,350,56,a15.id);            // User row -> User Detail
  lnk(a16,16,44,36,36,a2.id);              // Provider Full Detail -> User Mgmt
  lnk(a14,16,44,36,36,a16.id);             // Old Provider Detail -> new detail
  lnk(a17,16,44,36,36,a3.id);              // Order Detail -> Orders
  lnk(a3,20,220,350,100,a17.id);           // Order row -> Order Detail
  lnk(a18,16,44,36,36,a3.id);              // Content Moderation back
  lnk(a5,20,600,350,44,a18.id);            // Analytics -> Moderation
  lnk(a19,16,44,36,36,a1.id);              // Incentive Mgmt -> Dashboard
  lnk(a1,198,496,164,48,a19.id);           // Dashboard quick action -> Incentives
  lnk(a20,16,44,36,36,a5.id);              // Geo Analytics -> Analytics
  lnk(a5,20,400,350,44,a20.id);            // Analytics -> Geo
  lnk(a21,16,44,36,36,a1.id);              // Audit Log -> Dashboard
  lnk(a22,16,44,36,36,a10.id);             // API Settings -> Platform Settings
  lnk(a10,20,600,350,52,a22.id);           // Platform Settings -> API Settings

  console.log('Prototype links added (84 screens)');
} catch(e) {
  console.error('Links skipped (reactions API error):', e.message);
}

figma.viewport.scrollAndZoomIntoView(pg.children);

console.log('============================================================');
console.log('ServiCo v5 — PRODUCTION COMPLETE! 84 screens on one page.');
console.log('');
console.log('CUSTOMER (36 screens — Row y=0):');
console.log('  C1  Login            C2  Register          C3  Home');
console.log('  C4  Provider List    C5  Booking           C6  Payment');
console.log('  C7  Tracking         C8  Profile           C9  Provider Detail');
console.log('  C10 Confirmation     C11 Rate & Review     C12 My Bookings');
console.log('  C13 Notifications    C14 Wallet & Promos   C15 Onboarding');
console.log('  C16 OTP Login        C17 Forgot Password   C18 Browse Services');
console.log('  C19 Booking Detail   C20 Live Chat         C21 Address Book');
console.log('  C22 Vehicle Manager  C23 Referrals         C24 Subscription');
console.log('  C25 Settings         C26 Help & Support    C27 Map View');
console.log('  C28 Search Results   C29 Edit Profile      C30 Payment Methods');
console.log('  C31 Complaint Filing C32 Refund Status     C33 Explore & Discover');
console.log('  C34 Loyalty Rewards  C35 Invoice Receipt   C36 Booking Add-ons');
console.log('');
console.log('PROVIDER (26 screens — Row y=960):');
console.log('  P1  Login            P2  Dashboard         P3  Request Detail');
console.log('  P4  Active Jobs      P5  Job Detail        P6  Earnings');
console.log('  P7  KYC Step 2       P8  En Route          P9  Job Completion');
console.log('  P10 Profile          P11 Onboarding Step1  P12 Services Setup');
console.log('  P13 Bank Setup       P14 Calendar          P15 Chat');
console.log('  P16 Notifications    P17 Job History       P18 Performance');
console.log('  P19 Help             P20 Availability Setup P21 Edit Profile');
console.log('  P22 Service Editor   P23 Photo Docs        P24 Payout Detail');
console.log('  P25 Incentives       P26 Training & Resources');
console.log('');
console.log('ADMIN (22 screens — Row y=1920):');
console.log('  A1  Dashboard        A2  User Management   A3  Orders Monitor');
console.log('  A4  Complaints       A5  Analytics         A6  Provider Verify');
console.log('  A7  Promo Management A8  Payout Management A9  Category Mgmt');
console.log('  A10 Platform Settings A11 Revenue Reports  A12 Push Notifications');
console.log('  A13 Support Tickets  A14 Provider Detail   A15 User Detail View');
console.log('  A16 Provider Full Detail A17 Order Detail  A18 Content Moderation');
console.log('  A19 Incentive Mgmt   A20 Geographic Analytics A21 Audit Log');
console.log('  A22 API & Integrations');
console.log('============================================================');
