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

// Build customer screens
const c1=await C1(), c2=await C2(), c3=await C3(), c4=await C4();
const c5=await C5(), c6=await C6(), c7=await C7(), c8=await C8();
const c9=await C9(), c10=await C10(), c11=await C11(), c12=await C12();
const c13=await C13(), c14=await C14();
console.log('Customer screens done (14/32)');

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

const p1=await P1(), p2=await P2(), p3=await P3();
const p4=await P4(), p5=await P5(), p6=await P6();
const p7=await P7(), p8=await P8(), p9=await P9(), p10=await P10();
console.log('Provider screens done (24/32)');

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
    await tx(f,'Enter review notes here...', 28,dy+22, 10, GR,.35);
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

const a1=await A1(), a2=await A2(), a3=await A3(), a4=await A4(), a5=await A5();
const a6=await A6(), a7=await A7(), a8=await A8();
console.log('Admin screens done (32/32)');

// ── All 19 screens built — now add prototype links ───────────
// Wrapped in try/catch so a failed link never blocks screen rendering
try {
  // ── Customer flow ──────────────────────────────────────────
  lnk(c1,20,472,350,52,c3.id);          // Login -> Home
  lnk(c1,248,684,132,18,c2.id);         // Register here
  lnk(c2,20,696,350,52,c3.id);          // Register -> Home
  // Home category tiles -> Provider List
  for (let i=0;i<6;i++){const col=i%3,row=Math.floor(i/3); lnk(c3,20+col*120,358+row*94,110,84,c4.id);}
  lnk(c3,20,584,170,86,c4.id); lnk(c3,200,584,170,86,c4.id); // Near you cards
  // Provider List -> Provider Detail
  for (let i=0;i<4;i++) lnk(c4,20,262+i*122,330,112,c9.id);
  // Provider Detail -> Booking
  lnk(c9,192,770,178,52,c5.id);
  // Booking -> Payment
  lnk(c5,18,792,354,36,c6.id);
  // Payment -> Confirmation
  lnk(c6,20,654,350,52,c10.id);
  // Confirmation -> Tracking
  lnk(c10,20,696,350,52,c7.id);
  // Tracking -> Rate & Review
  lnk(c7,190,736,180,44,c11.id);
  // Rate & Review -> My Bookings
  lnk(c11,20,792,350,52,c12.id);
  // My Bookings -> Profile
  lnk(c12,20,82,87,36,c8.id);           // nav tab
  // Notifications -> Home
  lnk(c13,20,50,100,36,c3.id);
  // Wallet -> Home
  lnk(c14,16,44,36,36,c3.id);           // back btn

  // ── Provider flow ──────────────────────────────────────────
  lnk(p1,20,460,350,52,p2.id);          // Login -> Dashboard
  lnk(p1,316,590,60,26,p7.id);          // New partner -> KYC
  lnk(p2,82,404,70,22,p3.id);           // Accept incoming -> Request Detail
  lnk(p2,82,512,70,22,p3.id);
  lnk(p3,194,678,176,54,p4.id);         // Accept Job -> Active Jobs
  lnk(p4,32,218,132,24,p5.id);          // Mark complete btn -> Job Detail
  for (let i=0;i<3;i++) lnk(p4,268,288+i*90,72,46,p5.id); // upcoming detail
  lnk(p5,192,660,178,52,p9.id);         // Job Detail -> Completion OTP
  lnk(p9,199,666,171,52,p6.id);         // Completion -> Earnings
  lnk(p7,20,730,350,52,p2.id);          // KYC -> Dashboard
  lnk(p8,230,H-186,120,34,p5.id);       // Arrived -> Job Detail
  lnk(p10,16,44,36,36,p2.id);           // Profile back

  // ── Admin flow ─────────────────────────────────────────────
  lnk(a1,20,440,164,48,a2.id);          // quick action -> User Mgmt
  lnk(a1,198,440,164,48,a3.id);         // -> Orders
  lnk(a1,20,496,164,48,a4.id);          // -> Complaints
  lnk(a1,198,496,164,48,a5.id);         // -> Analytics
  lnk(a2,274,238,66,24,a6.id);          // User -> Provider Verify
  lnk(a3,274,170,68,22,a4.id);          // Orders -> Complaints
  lnk(a4,216,200,70,22,a1.id);          // Complaints -> Dashboard
  lnk(a5,284,742,86,16,a1.id);          // Analytics -> Dashboard
  lnk(a6,194,130+256+4+44,176,42,a2.id); // Verify -> User Mgmt
  lnk(a7,20,50,100,32,a1.id);           // Promos -> Dashboard
  lnk(a8,20,50,100,32,a1.id);           // Payouts -> Dashboard

  console.log('Prototype links added');
} catch(e) {
  console.error('Links skipped (reactions API error):', e.message);
}

figma.viewport.scrollAndZoomIntoView(pg.children);

console.log('============================================================');
console.log('ServiCo v3 Complete! All 32 screens on one page.');
console.log('Row 1 (y=0):    C1 C2 C3 C4 C5 C6 C7 C8  — Customer (existing)');
console.log('                C9 C10 C11 C12 C13 C14     — Customer (new)');
console.log('Row 2 (y=960):  P1 P2 P3 P4 P5 P6         — Provider (existing)');
console.log('                P7 P8 P9 P10               — Provider (new)');
console.log('Row 3 (y=1920): A1 A2 A3 A4 A5            — Admin (existing)');
console.log('                A6 A7 A8                   — Admin (new)');
console.log('');
console.log('Customer (14): Login, Register, Home, Provider List, Provider Detail,');
console.log('               Booking, Payment, Confirmation, Tracking, Rate+Review,');
console.log('               Profile, My Bookings, Notifications, Wallet+Promos');
console.log('Provider (10): Login, Dashboard, Request Detail, Active Jobs, Job Detail,');
console.log('               Earnings, KYC Registration, En Route, Job Completion, Profile');
console.log('Admin (8):     Dashboard, User Mgmt, Orders Monitor, Complaints, Analytics,');
console.log('               Provider Verification, Promo Management, Payout Management');
console.log('============================================================');
