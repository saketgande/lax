// ============================================================
//  ServiCo v2 — Enhanced 3-Role Prototype
//  19 Screens: Customer(8) + Provider(6) + Admin(5)
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

const mk = (pg,x,nm) => {
  const f = figma.createFrame();
  f.name=nm; f.x=x; f.y=0;
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
    actions:[{type:'NODE',destinationId:dest,navigation:'NAVIGATE',transition:null}],
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

// ── Page Setup ───────────────────────────────────────────────
const root = figma.root;
root.children[0].name = '01 Customer';
const custPage = root.children[0];

const provPage = root.children.length < 2 ? figma.createPage() : root.children[1];
provPage.name = '02 Service Provider';

const adminPage = root.children.length < 3 ? figma.createPage() : root.children[2];
adminPage.name = '03 Admin';

// ════════════════════════════════════════════════════════════
//  CUSTOMER — 8 Screens
// ════════════════════════════════════════════════════════════
await figma.setCurrentPageAsync(custPage);

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

// Build customer screens
const c1=await C1(), c2=await C2(), c3=await C3(), c4=await C4();
const c5=await C5(), c6=await C6(), c7=await C7(), c8=await C8();

// Customer prototype links
lnk(c1,20,472,350,52,c3.id);
lnk(c1,248,684,132,18,c2.id);
lnk(c2,20,696,350,52,c3.id);
for (let i=0;i<6;i++){const col=i%3,row=Math.floor(i/3); lnk(c3,20+col*120,358+row*94,110,84,c4.id);}
lnk(c3,20,584,170,86,c4.id); lnk(c3,200,584,170,86,c4.id);
for (let i=0;i<4;i++) lnk(c4,268,262+i*122,80,52,c5.id);
lnk(c5,18,792,354,36,c6.id);
lnk(c6,20,654,350,52,c7.id);
lnk(c7,190,736,180,44,c8.id);

figma.viewport.scrollAndZoomIntoView(custPage.children);
console.log('Customer screens done (8/19)');

// ════════════════════════════════════════════════════════════
//  PROVIDER — 6 Screens
// ════════════════════════════════════════════════════════════
await figma.setCurrentPageAsync(provPage);

// P1: PROVIDER LOGIN
const P1 = async () => {
  const f = mk(provPage,0,'P1 Provider Login');
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
  const f = mk(provPage,450,'P2 Dashboard');
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
  const f = mk(provPage,900,'P3 Request Detail');
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
  const f = mk(provPage,1350,'P4 Active Jobs');
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
  const f = mk(provPage,1800,'P5 Job Detail');
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
  const f = mk(provPage,2250,'P6 Earnings');
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

const p1=await P1(), p2=await P2(), p3=await P3();
const p4=await P4(), p5=await P5(), p6=await P6();

lnk(p1,20,460,350,52,p2.id);
lnk(p2,82,404,70,22,p3.id); lnk(p2,82,512,70,22,p3.id);
lnk(p3,194,678,176,54,p4.id);
lnk(p4,32,218,132,24,p5.id);
for (let i=0;i<3;i++) lnk(p4,268,288+i*90,72,46,p5.id);
lnk(p5,192,660,178,52,p6.id);

figma.viewport.scrollAndZoomIntoView(provPage.children);
console.log('Provider screens done (14/19)');

// ════════════════════════════════════════════════════════════
//  ADMIN — 5 Screens
// ════════════════════════════════════════════════════════════
await figma.setCurrentPageAsync(adminPage);

// A1: ADMIN DASHBOARD
const A1 = async () => {
  const f = mk(adminPage,0,'A1 Admin Dashboard');
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
  const f = mk(adminPage,450,'A2 User Management');
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
  const f = mk(adminPage,900,'A3 Orders Monitor');
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
  const f = mk(adminPage,1350,'A4 Complaints');
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
  const f = mk(adminPage,1800,'A5 Analytics');
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

const a1=await A1(), a2=await A2(), a3=await A3(), a4=await A4(), a5=await A5();

// Admin prototype links
lnk(a1,20,440,164,48,a2.id);
lnk(a1,198,440,164,48,a3.id);
lnk(a1,20,620,164,48,a4.id);
lnk(a1,198,620,164,48,a5.id);
lnk(a2,274,238,66,24,a3.id);
lnk(a3,274,170,68,22,a4.id);
lnk(a4,216,200,70,22,a1.id);
lnk(a5,284,742,86,16,a1.id);

figma.viewport.scrollAndZoomIntoView(adminPage.children);

console.log('====================================');
console.log('ServiCo v2 Complete! All 19 screens built.');
console.log('Page 1 (Customer):  C1>C2>C3>C4>C5>C6>C7>C8');
console.log('Page 2 (Provider):  P1>P2>P3>P4>P5>P6');
console.log('Page 3 (Admin):     A1>A2>A3>A4>A5');
console.log('====================================');
