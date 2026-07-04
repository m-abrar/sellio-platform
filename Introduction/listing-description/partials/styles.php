  <style>
    :root {
      --ink:#101828; --muted:#667085; --paper:#f7f4ed; --white:#fff;
      --night:#101a2d; --night-2:#17243a; --lime:#76c043; --lime-dark:#2a7e83;
      --line:#d9d6ce; --blue:#3d6ee8; --orange:#ee7b42; --violet:#7656c9;
      --shadow:0 24px 70px rgba(16,24,40,.14); --display:'Sora',Inter,ui-sans-serif,sans-serif;
    }
    *{box-sizing:border-box} html{scroll-behavior:smooth}
    body{margin:0;background:#dedbd3;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.55;counter-reset:slide}
    a{color:inherit}.page{position:relative;width:615px;margin:32px auto;background:var(--paper);box-shadow:var(--shadow);overflow:hidden}
    .page:before{content:"";position:absolute;inset:0;z-index:40;opacity:.05;mix-blend-mode:multiply;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
    .wrap{width:min(900px,calc(100% - 64px));margin:auto}.section{position:relative;padding:56px 0;border-top:1px solid var(--line);counter-increment:slide}
    .section:after{content:counter(slide,decimal-leading-zero) " — 11";position:absolute;top:24px;right:32px;z-index:1;color:#a6a290;font-family:var(--display);font-size:10px;font-weight:700;letter-spacing:.1em}
    #explore,#preview{counter-increment:none}
    #explore:after,#preview:after{display:none}
    #explore .cards,#preview .cards{margin-top:0}
    .roles:after{color:rgba(255,255,255,.35)}
    .eyebrow{display:inline-flex;align-items:center;gap:8px;margin-bottom:18px;padding:7px 13px 7px 11px;background:var(--lime);color:#12210b;font-family:var(--display);font-size:10px;font-weight:700;letter-spacing:.11em;text-transform:uppercase}
    .eyebrow:before{content:"";width:6px;height:6px;border-radius:50%;background:#12210b}
    h1,h2,h3,p{margin-top:0} h1,h2,h3{font-family:var(--display);letter-spacing:-.02em;line-height:1.12}
    h1{max-width:520px;margin-bottom:18px;font-size:36px;font-weight:800}
    h2{max-width:480px;margin-bottom:14px;font-size:25px;font-weight:800}
    h3{font-size:17px}.lead{max-width:520px;color:var(--muted);font-size:15px;line-height:1.6}
    .button{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:16px 26px;border-radius:0;background:var(--lime);color:#12210b;font-family:var(--display);font-size:13px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;text-decoration:none}

    /* Cover */
    .cover{position:relative;padding:28px 0 48px;color:#fff;background:radial-gradient(circle at 82% 18%,rgba(191, 227, 207,.22),transparent 28%),linear-gradient(145deg,var(--night),#0b1220);overflow:hidden}
    .cover:before{content:"";position:absolute;top:-80px;right:-80px;z-index:0;width:420px;height:420px;opacity:.14;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><g fill='none' stroke='white' stroke-width='1.2'><circle cx='420' cy='0' r='120'/><circle cx='420' cy='0' r='190'/><circle cx='420' cy='0' r='260'/></g></svg>") no-repeat}
    .cover:after{content:"";position:absolute;inset:0;opacity:.08;background-image:linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px);background-size:38px 38px;pointer-events:none}
    .cover>*{position:relative;z-index:1}.navline{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px}
    .brand{display:flex;align-items:center;gap:11px;font-family:var(--display);font-weight:800;letter-spacing:.1em}.brand img{width:34px;height:34px;object-fit:contain}
    .version{padding:7px 12px;background:var(--lime);color:#12210b;font-family:var(--display);font-size:10px;font-weight:700;letter-spacing:.1em}
    .cover h1 span{color:var(--lime)}.cover .lead{color:#b7c0cf}.cover-actions{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0 32px}
    .hero-grid{display:grid;grid-template-columns:1fr;gap:32px}.hero-copy{min-width:0}
    .stackline{display:flex;flex-wrap:wrap;gap:8px}.stackline span{padding:7px 10px;border:1px solid rgba(255,255,255,.12);border-radius:0;background:rgba(255,255,255,.05);color:#d5dbea;font-size:11px;font-weight:750}
    .scope-strip{display:flex;flex-wrap:wrap;margin-top:40px;background:#101a2d;border-top:1px solid rgba(255,255,255,.11);border-left:1px solid rgba(255,255,255,.11)}
    .scope-strip span{flex:1 1 25%;box-sizing:border-box;padding:12px 4px;border-right:1px solid rgba(255,255,255,.11);border-bottom:1px solid rgba(255,255,255,.11);color:#cbd5e1;font-size:9px;font-weight:800;text-align:center;text-transform:uppercase}
    .quick-nav{position:relative;z-index:5;display:flex;flex-wrap:wrap;background:#fff;border-top:1px solid var(--line);border-left:1px solid var(--line)}.quick-nav a{flex:1 1 33.333%;box-sizing:border-box;padding:16px 8px;border-right:1px solid #eceae4;border-bottom:1px solid var(--line);color:#475467;font-size:10px;font-weight:850;letter-spacing:.06em;text-align:center;text-decoration:none;text-transform:uppercase}

    /* Editorial layouts */
    /* Eyebrow accent AND section background both rotate by section POSITION (lime/blue/orange/violet),
       not by section identity, so neighboring sections never repeat a color even after reordering the
       include list in index.php. Sections with a functional reason for a fixed color (Storefronts' grey
       screenshot backdrop, Technology's white logo backdrop, Roles/Offers' dark break sections) opt out
       via a higher-specificity `.section.<name>` rule further down that overrides the rotation. */
    .section:nth-of-type(4n+1){background:#f2f7ea}
    .section:nth-of-type(4n+2){background:#eef2fb}
    .section:nth-of-type(4n+3){background:#fdf1e9}
    .section:nth-of-type(4n){background:#f4eff9}
    .section:nth-of-type(4n+2) .eyebrow{background:var(--blue);color:#fff}
    .section:nth-of-type(4n+3) .eyebrow{background:var(--orange);color:#241004}
    .section:nth-of-type(4n) .eyebrow{background:var(--violet);color:#fff}
    .foot .eyebrow{background:var(--blue);color:#fff}

    .search-chat{position:relative;margin-top:36px}
    .chat-heading{display:block;width:fit-content;margin:0 auto 24px;padding:9px 20px;background:var(--lime);color:#12210b;font-family:var(--display);font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;text-align:center}
    .chat-timeline{position:relative;display:grid;gap:22px}
    .chat-timeline:before{content:"";position:absolute;top:4px;bottom:4px;left:50%;width:1px;background:var(--line);transform:translateX(-50%);z-index:0}
    .chat-entry{position:relative;z-index:1;display:grid;grid-template-columns:1fr 40px 1fr;align-items:center;gap:14px}
    .chat-side{display:flex}
    .chat-left .chat-side:first-child{justify-content:flex-end}
    .chat-right .chat-side:last-child{justify-content:flex-start}
    .chat-node{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;border:3px solid var(--lime-dark);overflow:hidden}
    .chat-node img{width:100%;height:100%;object-fit:cover;display:block}
    .chat-entry:nth-child(4n+2) .chat-node{border-color:var(--blue)}
    .chat-entry:nth-child(4n+3) .chat-node{border-color:#c25a1e}
    .chat-entry:nth-child(4n) .chat-node{border-color:var(--violet)}
    .chat-close{display:flex;justify-content:center;margin-top:20px}
    .chat-close-icon{position:relative;display:grid;place-items:center;width:118px;height:118px}
    .chat-close-icon:before{content:"";position:absolute;inset:18px;border-radius:50%;background:rgba(191, 227, 207,.16);filter:blur(13px)}
    .ai-brain-mark{position:relative;display:block;width:100%;height:100%;overflow:visible}
    .chat-bubble{position:relative;max-width:100%;padding:11px 15px;border-radius:16px;background:#fff;border:1px solid var(--line);color:var(--ink);font-size:12px;font-weight:600;line-height:1.5}
    .chat-left .chat-bubble:before{content:"";position:absolute;z-index:5;top:14px;right:-12px;width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent;border-left:12px solid var(--line)}
    .chat-left .chat-bubble:after{content:"";position:absolute;z-index:6;top:14px;right:-10px;width:0;height:0;border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:11px solid #fff}
    .chat-right .chat-bubble:before{content:"";position:absolute;z-index:5;top:14px;left:-12px;width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent;border-right:12px solid var(--line)}
    .chat-right .chat-bubble:after{content:"";position:absolute;z-index:6;top:14px;left:-10px;width:0;height:0;border-top:8px solid transparent;border-bottom:8px solid transparent;border-right:11px solid #fff}

    .pillars{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:28px}.pillar{padding:18px;border:1px solid var(--line);border-radius:0;background:rgba(255,255,255,.55)}
    .pillar b{display:block;margin-bottom:8px;font-family:var(--display);font-size:15px}.pillar p{margin:0;color:var(--muted);font-size:13px}.pillar-mark{display:grid;place-items:center;width:32px;height:32px;margin-bottom:16px;border-radius:0;background:var(--night);color:var(--lime)}.pillar-mark svg{width:18px;height:18px}
    .pillar:nth-child(1) .pillar-mark{background:var(--lime);color:#12210b}.pillar:nth-child(2) .pillar-mark{background:var(--blue);color:#fff}.pillar:nth-child(3) .pillar-mark{background:var(--orange);color:#241004}.pillar:nth-child(4) .pillar-mark{background:var(--violet);color:#fff}

    .section.showcase{background:#ece9e1}.screen-stage{position:relative;margin-top:30px;padding:20px;border-radius:0;background:var(--night);box-shadow:var(--shadow)}
    .screen-main{overflow:hidden;border:5px solid #26344a;border-radius:0;background:#fff;box-shadow:0 18px 45px rgba(0,0,0,.28)}
    .screen-main img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;object-position:top}
    .screen-label{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;color:#fff;font-size:12px;font-weight:800}.screen-label small{color:#93a0b5}
    .thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.thumb{overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:0;background:#1b2940}
    .thumb img{display:block;width:100%;height:68px;object-fit:cover;object-position:top}.thumb span{display:block;padding:8px 9px;color:#d8dfeb;font-size:10px;font-weight:800}

    .vertical-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:28px}.vertical{position:relative;min-height:140px;padding:18px;border-radius:0;color:#fff;overflow:hidden}
    .vertical:after{content:"";position:absolute;width:100px;height:100px;right:-30px;bottom:-35px;border:1px solid rgba(255,255,255,.18);border-radius:0}
    .vertical:nth-child(1){background:#314867}.vertical:nth-child(2){background:#5a7042}.vertical:nth-child(3){background:#784d3c}.vertical:nth-child(4){background:#6a4f83}.vertical:nth-child(5){background:#326a73}.vertical:nth-child(6){background:#8a6633}
    .vertical>*{position:relative;z-index:1}
    .vertical:nth-child(1):before{content:"";position:absolute;top:-8px;right:-8px;z-index:0;width:80px;height:80px;opacity:.2;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g fill='none' stroke='white' stroke-width='1.2'><rect x='10' y='10' width='26' height='26'/><rect x='44' y='10' width='26' height='26'/><rect x='10' y='44' width='26' height='26'/><rect x='44' y='44' width='26' height='26'/></g></svg>") no-repeat}
    .vertical:nth-child(2):before{content:"";position:absolute;top:-10px;right:-8px;z-index:0;width:80px;height:80px;opacity:.2;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g fill='none' stroke='white' stroke-width='1.2'><path d='M14 45 L40 15 L66 45'/><rect x='22' y='45' width='36' height='28'/></g></svg>") no-repeat}
    .vertical:nth-child(3):before{content:"";position:absolute;top:-6px;right:-10px;z-index:0;width:90px;height:60px;opacity:.2;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='60'><g fill='none' stroke='white' stroke-width='1.2'><path d='M8 40 L18 20 L62 20 L74 40 L74 46 L8 46 Z'/><circle cx='24' cy='46' r='7'/><circle cx='60' cy='46' r='7'/></g></svg>") no-repeat}
    .vertical:nth-child(4):before{content:"";position:absolute;top:-8px;right:-8px;z-index:0;width:90px;height:60px;opacity:.2;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='60'><g fill='none' stroke='white' stroke-width='1.2'><rect x='6' y='10' width='78' height='40'/><line x1='58' y1='10' x2='58' y2='50' stroke-dasharray='4 5'/></g></svg>") no-repeat}
    .vertical:nth-child(5):before{content:"";position:absolute;top:-8px;right:-8px;z-index:0;width:80px;height:70px;opacity:.2;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='70'><g fill='none' stroke='white' stroke-width='1.2'><rect x='8' y='24' width='64' height='40'/><path d='M28 24 V14 a8 8 0 0 1 8 -8 h8 a8 8 0 0 1 8 8 V24'/></g></svg>") no-repeat}
    .vertical:nth-child(6):before{content:"";position:absolute;top:-8px;right:-8px;z-index:0;width:84px;height:56px;opacity:.2;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='84' height='56'><g fill='none' stroke='white' stroke-width='1.2'><path d='M10 28 L30 8 H74 V48 H30 Z'/><circle cx='58' cy='28' r='5'/></g></svg>") no-repeat}
    .vertical small{display:block;margin-bottom:16px;color:rgba(255,255,255,.7);font-size:9px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.vertical h3{margin-bottom:6px;font-size:16px}.vertical p{max-width:360px;margin:0;color:rgba(255,255,255,.75);font-size:12px}

    .section.roles{color:#fff;background:var(--night);overflow:hidden}.roles .lead{color:#aeb9c9}
    .roles>.wrap{position:relative;z-index:1}
    .roles:before{content:"";position:absolute;top:50%;right:-120px;z-index:0;width:360px;height:300px;transform:translateY(-50%);opacity:.1;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='300'><g fill='none' stroke='white' stroke-width='1.2'><circle cx='120' cy='150' r='110'/><circle cx='220' cy='90' r='110'/><circle cx='220' cy='210' r='110'/></g></svg>") no-repeat}
    .role-flow{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:28px}
    .role{padding:16px;border:1px solid rgba(255,255,255,.1);border-top:3px solid var(--lime);border-radius:0;background:rgba(255,255,255,.04);color:var(--lime)}
    .role:nth-child(2){border-top-color:var(--blue);color:var(--blue)}
    .role:nth-child(3){border-top-color:var(--orange);color:var(--orange)}
    .role-connect{border-top-color:var(--violet);color:var(--violet);background:rgba(118,86,201,.14)}
    .role-connect p{margin:0;color:#ded6f2;font-size:11.5px;line-height:1.6}
    .role-icon{display:block;width:26px;height:26px;margin-bottom:14px;color:inherit}
    .role-icon svg{width:100%;height:100%}
    .role strong{display:block;margin-bottom:11px;color:inherit;font-family:var(--display);font-size:11px;text-transform:uppercase;letter-spacing:.08em}.role ul{margin:0;padding:0;list-style:none}.role li{position:relative;padding:7px 0 7px 18px;border-bottom:1px solid rgba(255,255,255,.07);color:#d0d7e3;font-size:11px}.role li:last-child{border:0}
    .role li:before{content:"\2713";position:absolute;left:0;top:7px;font-weight:800;color:var(--lime)}
    .role:nth-child(2) li:before{color:var(--blue)}
    .role:nth-child(3) li:before{color:var(--orange)}

    .journeys{display:grid;gap:10px;margin-top:28px}
    .journey{padding:18px 18px 20px;border:1px solid var(--line);border-left:4px solid var(--lime);border-radius:0;background:#fff;color:var(--lime-dark)}
    .journey:nth-child(2){border-left-color:var(--blue);color:var(--blue)}
    .journey:nth-child(3){border-left-color:var(--orange);color:#c25a1e}
    .journey:nth-child(4){border-left-color:var(--violet);color:var(--violet)}
    .journey-icon{position:relative;display:grid;place-items:center;width:48px;height:42px;margin:0 0 16px 4px;border:1px solid currentColor;background:#f5faef;clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px)}
    .journey-icon:before{content:"";position:absolute;inset:4px;border:1px solid currentColor;opacity:.2;clip-path:inherit}
    .journey-icon svg{width:22px;height:22px}
    .journey:nth-child(2) .journey-icon{background:#f1f4ff}
    .journey:nth-child(3) .journey-icon{background:#fff4ec}
    .journey:nth-child(4) .journey-icon{background:#f7f1fb}
    .journey b{display:block;margin-bottom:18px;color:var(--ink);font-family:var(--display);font-size:14px}
    .steps{position:relative;display:flex;gap:14px;margin-top:4px}
    .steps span{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:7px;flex:1;text-align:center}
    .steps:before{content:"";position:absolute;z-index:0;top:19px;left:12.5%;right:12.5%;height:1px;background:var(--line)}
    .step-icon{display:grid;place-items:center;width:38px;height:38px;border:2px solid currentColor;border-radius:50%;background:#fff;box-shadow:0 0 0 5px #fff}
    .step-icon svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .steps span:not(:last-child):after{content:"";position:absolute;z-index:2;top:15px;right:-10px;width:7px;height:7px;border-top:2px solid currentColor;border-right:2px solid currentColor;transform:rotate(45deg);opacity:.55}
    .steps span em{display:block;color:#475467;font-style:normal;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.02em}

    .section.tech{background:#fff}.tech-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:24px}.tech-item{padding:14px 8px;border:1px solid #e5e7eb;border-top:3px solid var(--lime);border-radius:0;text-align:center}.tech-item:nth-child(4n+2){border-top-color:var(--blue)}.tech-item:nth-child(4n+3){border-top-color:var(--orange)}.tech-item:nth-child(4n){border-top-color:var(--violet)}.tech-item small{display:block;color:var(--muted);font-size:9px;text-transform:uppercase}.tech-item b{font-family:var(--display);font-size:12px}
    .tech-item img,.tech-item svg{display:block;width:26px;height:26px;margin:0 auto 8px}
    .gateway-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.gateway-row span{display:inline-flex;align-items:center;gap:6px;padding:8px 10px;border:1px solid #dfe3e8;border-radius:0;background:#fafafa;font-size:10px;font-weight:800}
    .gateway-row span img,.gateway-row span svg{width:14px;height:14px;flex:0 0 14px}

    #installation{overflow:hidden}
    #installation:before{content:"";position:absolute;inset:0;z-index:0;opacity:.3;filter:grayscale(1);pointer-events:none;background:url("assets/installation.jpg") center/cover no-repeat;-webkit-mask-image:linear-gradient(to right,transparent 0%,#000 30%,#000 70%,transparent 100%);mask-image:linear-gradient(to right,transparent 0%,#000 30%,#000 70%,transparent 100%)}
    #installation>.wrap{position:relative;z-index:1}
    .install-row{display:flex;align-items:flex-start;gap:4px;margin-top:36px}
    .install-step{display:flex;flex-direction:column;align-items:center;gap:10px;flex:1;text-align:center;color:var(--lime-dark)}
    .install-step:nth-child(3){color:var(--blue)}.install-step:nth-child(5){color:#c25a1e}.install-step:nth-child(7){color:var(--violet)}.install-step:nth-child(9){color:var(--lime-dark)}
    .install-icon{position:relative;display:grid;place-items:center;width:58px;height:58px;border-radius:50%;border:2px solid currentColor;background:#fff;color:inherit}
    .install-icon svg{width:26px;height:26px;color:inherit}
    .install-icon .install-badge{position:absolute;top:-6px;right:-6px;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;border:2px solid #fff;background:var(--lime-dark);color:#fff;font-family:var(--display);font-size:11px;font-weight:800;line-height:1}
    .install-step:nth-child(3) .install-badge{background:var(--blue)}
    .install-step:nth-child(5) .install-badge{background:#c25a1e}
    .install-step:nth-child(7) .install-badge{background:var(--violet)}
    .install-step:nth-child(9) .install-badge{background:var(--lime-dark)}
    .install-step span{font-family:var(--display);font-size:9px;font-weight:800;color:#475467;text-transform:uppercase;letter-spacing:.02em}
    .install-arrow{display:flex;align-items:center;justify-content:center;height:58px;flex:0 0 20px;color:var(--night);font-style:normal;font-size:24px;font-weight:900}

    .section.truth{background:#eaf3e4}.truth-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:24px}.truth-card{padding:16px;border:1px solid #cbdcc0;border-radius:0;background:rgba(255,255,255,.68)}.truth-card b{display:block;margin-bottom:6px;font-family:var(--display);font-size:14px}.truth-card p{margin:0;color:#506046;font-size:12px}
    .ownership-band{display:grid;grid-template-columns:1fr;gap:1px;margin-top:28px;border:1px solid #cbdcc0;border-radius:0;background:#cbdcc0;overflow:hidden}.ownership-band > div{padding:16px;background:#f8fcf5}.ownership-band .ownership-title{display:flex;flex-direction:column;justify-content:center;background:var(--night);color:#fff}.ownership-title small{color:var(--lime);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.ownership-title b{font-family:var(--display);font-size:16px}.ownership-band span{display:block;margin-bottom:6px;color:var(--lime-dark);font-size:11px;font-weight:900;text-transform:uppercase}.ownership-band p{margin:0;color:#58684f;font-size:12px}
    .cards{display:grid;gap:10px;margin-top:28px}
    .cards.c3{grid-template-columns:repeat(3,1fr)}.cards.c2{grid-template-columns:repeat(2,1fr)}
    .card{display:flex;flex-direction:column;padding:16px;border:1px solid var(--line);background:#fff;text-decoration:none;color:inherit}
    .card-tag{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;margin-bottom:14px;background:var(--night);color:var(--lime);font-family:var(--display);font-size:12px;font-weight:800}
    .card-tag svg{width:14px;height:14px}
    .card:nth-child(3n+2) .card-tag{background:var(--blue);color:#fff}.card:nth-child(3n) .card-tag{background:var(--orange);color:#241004}
    .card b{display:block;margin-bottom:6px;font-family:var(--display);font-size:14px}
    .card p{margin:0;color:var(--muted);font-size:12px;flex:1}
    .card-cta{display:block;margin-top:14px;padding-top:12px;border-top:1px solid var(--line);font-family:var(--display);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--lime-dark)}
    #preview .card{background:var(--night-2);border-color:rgba(255,255,255,.12);color:#fff}
    #preview .card p{color:#c3cbdc}
    #preview .card-cta{border-top-color:rgba(255,255,255,.14);color:var(--lime)}

    #explore{background:#fff}

    .section.offers{background:var(--night);color:#fff}.offers .lead{color:#aeb9c9}
    .offers .card{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)}
    .offers .card p{color:#aeb9c9}.offers .card-cta{border-top-color:rgba(255,255,255,.12);color:var(--lime)}
    .offer-badge{display:inline-block;margin-bottom:12px;padding:5px 9px;background:var(--lime);color:#12210b;font-family:var(--display);font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}

    .cred{display:block;margin-top:12px;padding-top:12px;border-top:1px dashed var(--line);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#3a4150;line-height:1.7}
    .cred b{font-family:inherit;font-size:11px;color:var(--ink)}

    .qr-box{width:56px;height:56px;margin-bottom:14px;background:repeating-conic-gradient(#101828 0% 25%,#fff 0% 50%) 0 0/14px 14px;border:1px solid var(--line)}

    .foot{position:relative;padding:48px 0;color:#fff;background:#0b1220;overflow:hidden}.foot h2{max-width:480px}.foot p{color:#aeb9c9}.foot-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}.fineprint{margin-top:28px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);color:#77849a;font-size:10px}
    .foot>.wrap{position:relative;z-index:1}
    .foot:before{content:"";position:absolute;right:-100px;bottom:-100px;z-index:0;width:380px;height:380px;opacity:.14;pointer-events:none;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='380' height='380'><circle cx='380' cy='380' r='260' fill='none' stroke='white' stroke-width='1.4' stroke-dasharray='6 8'/></svg>") no-repeat}
  </style>
