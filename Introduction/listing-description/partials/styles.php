  <style>
    :root {
      --ink:#101828; --muted:#667085; --paper:#f7f4ed; --white:#fff;
      --night:#101a2d; --night-2:#17243a; --lime:#76c043; --lime-dark:#477d25;
      --line:#d9d6ce; --blue:#3d6ee8; --orange:#ee7b42; --violet:#7656c9;
      --shadow:0 24px 70px rgba(16,24,40,.14); --display:'Sora',Inter,ui-sans-serif,sans-serif;
    }
    *{box-sizing:border-box} html{scroll-behavior:smooth}
    body{margin:0;background:#dedbd3;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.55;counter-reset:slide}
    a{color:inherit}.page{position:relative;width:615px;margin:32px auto;background:var(--paper);box-shadow:var(--shadow);overflow:hidden}
    .page:before{content:"";position:absolute;inset:0;z-index:40;opacity:.05;mix-blend-mode:multiply;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
    .wrap{width:min(900px,calc(100% - 64px));margin:auto}.section{position:relative;padding:56px 0;border-top:1px solid var(--line);counter-increment:slide}
    .section:after{content:counter(slide,decimal-leading-zero) " — 13";position:absolute;top:24px;right:32px;z-index:1;color:#a6a290;font-family:var(--display);font-size:10px;font-weight:700;letter-spacing:.1em}
    .roles:after{color:rgba(255,255,255,.35)}
    .eyebrow{display:inline-flex;align-items:center;gap:8px;margin-bottom:18px;padding:7px 13px 7px 11px;background:var(--lime);color:#12210b;font-family:var(--display);font-size:10px;font-weight:700;letter-spacing:.11em;text-transform:uppercase}
    .eyebrow:before{content:"";width:6px;height:6px;border-radius:50%;background:#12210b}
    h1,h2,h3,p{margin-top:0} h1,h2,h3{font-family:var(--display);letter-spacing:-.02em;line-height:1.12}
    h1{max-width:520px;margin-bottom:18px;font-size:36px;font-weight:800}
    h2{max-width:480px;margin-bottom:14px;font-size:25px;font-weight:800}
    h3{font-size:17px}.lead{max-width:520px;color:var(--muted);font-size:15px;line-height:1.6}
    .button{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:16px 26px;border-radius:0;background:var(--lime);color:#12210b;font-family:var(--display);font-size:13px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;text-decoration:none}

    /* Cover */
    .cover{position:relative;padding:28px 0 48px;color:#fff;background:radial-gradient(circle at 82% 18%,rgba(118,192,67,.22),transparent 28%),linear-gradient(145deg,var(--night),#0b1220);overflow:hidden}
    .cover:after{content:"";position:absolute;inset:0;opacity:.08;background-image:linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px);background-size:38px 38px;pointer-events:none}
    .cover>*{position:relative;z-index:1}.navline{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px}
    .brand{display:flex;align-items:center;gap:11px;font-family:var(--display);font-weight:800;letter-spacing:.1em}.brand img{width:34px;height:34px;object-fit:contain}
    .version{padding:7px 12px;background:var(--lime);color:#12210b;font-family:var(--display);font-size:10px;font-weight:700;letter-spacing:.1em}
    .cover h1 span{color:var(--lime)}.cover .lead{color:#b7c0cf}.cover-actions{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0 32px}
    .hero-grid{display:grid;grid-template-columns:1fr;gap:32px}.hero-copy{min-width:0}
    .blueprint-orbit{position:relative;aspect-ratio:1;max-width:250px;margin:0 auto;border:1px solid rgba(255,255,255,.1);border-radius:50%;background:radial-gradient(circle,rgba(118,192,67,.13),transparent 54%)}
    .blueprint-orbit:before,.blueprint-orbit:after{content:"";position:absolute;border:1px dashed rgba(255,255,255,.13);border-radius:50%}.blueprint-orbit:before{inset:14%}.blueprint-orbit:after{inset:31%}
    .orbit-core{position:absolute;left:50%;top:50%;z-index:2;transform:translate(-50%,-50%);display:grid;place-items:center;width:74px;height:74px;border-radius:50%;background:var(--lime);color:#17230f;font-family:var(--display);font-size:12px;font-weight:800;letter-spacing:.1em;box-shadow:0 0 0 10px rgba(118,192,67,.1),0 18px 40px rgba(0,0,0,.25)}
    .orbit-node{position:absolute;z-index:2;padding:6px 8px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:#18263c;color:#d7deea;font-size:8px;font-weight:850;text-transform:uppercase;letter-spacing:.03em;box-shadow:0 7px 18px rgba(0,0,0,.25)}
    .orbit-node.n1{left:4%;top:18%}.orbit-node.n2{right:0;top:19%}.orbit-node.n3{left:-3%;top:49%}.orbit-node.n4{right:-2%;top:50%}.orbit-node.n5{left:13%;bottom:12%}.orbit-node.n6{right:13%;bottom:11%}.orbit-node.n7{left:50%;top:-3%;transform:translateX(-50%)}
    .stackline{display:flex;flex-wrap:wrap;gap:8px}.stackline span{padding:7px 10px;border:1px solid rgba(255,255,255,.12);border-radius:0;background:rgba(255,255,255,.05);color:#d5dbea;font-size:11px;font-weight:750}
    .scope-strip{display:flex;flex-wrap:wrap;margin-top:40px;background:#101a2d;border-top:1px solid rgba(255,255,255,.11);border-left:1px solid rgba(255,255,255,.11)}
    .scope-strip span{flex:1 1 25%;box-sizing:border-box;padding:12px 4px;border-right:1px solid rgba(255,255,255,.11);border-bottom:1px solid rgba(255,255,255,.11);color:#cbd5e1;font-size:9px;font-weight:800;text-align:center;text-transform:uppercase}
    .quick-nav{position:relative;z-index:5;display:flex;flex-wrap:wrap;background:#fff;border-top:1px solid var(--line);border-left:1px solid var(--line)}.quick-nav a{flex:1 1 33.333%;box-sizing:border-box;padding:16px 8px;border-right:1px solid #eceae4;border-bottom:1px solid var(--line);color:#475467;font-size:10px;font-weight:850;letter-spacing:.06em;text-align:center;text-decoration:none;text-transform:uppercase}

    /* Editorial layouts */
    #foundation .eyebrow{background:var(--blue);color:#fff}
    #modules .eyebrow{background:var(--violet);color:#fff}
    #workflows .eyebrow{background:var(--blue);color:#fff}
    #installation .eyebrow{background:var(--orange);color:#241004}
    .showcase .eyebrow{background:var(--orange);color:#241004}
    .tech .eyebrow{background:var(--violet);color:#fff}
    .foot .eyebrow{background:var(--blue);color:#fff}
    #explore .eyebrow{background:var(--orange);color:#241004}
    #preview .eyebrow{background:var(--violet);color:#fff}
    #access .eyebrow{background:var(--blue);color:#fff}
    #platforms .eyebrow{background:var(--violet);color:#fff}
    .chapter{position:relative}
    .chapter-no{position:absolute;top:-20px;left:-4px;z-index:0;color:rgba(16,24,40,.06);font-family:var(--display);font-size:128px;font-weight:800;letter-spacing:-.05em;line-height:1;pointer-events:none;user-select:none}
    .chapter>div:last-child{position:relative;z-index:1}
    .pillars{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:28px}.pillar{padding:18px;border:1px solid var(--line);border-radius:0;background:rgba(255,255,255,.55)}
    .pillar b{display:block;margin-bottom:8px;font-family:var(--display);font-size:15px}.pillar p{margin:0;color:var(--muted);font-size:13px}.pillar-mark{display:grid;place-items:center;width:32px;height:32px;margin-bottom:16px;border-radius:0;background:var(--night);color:var(--lime);font-family:var(--display);font-weight:800}
    .pillar:nth-child(1) .pillar-mark{background:var(--lime);color:#12210b}.pillar:nth-child(2) .pillar-mark{background:var(--blue);color:#fff}.pillar:nth-child(3) .pillar-mark{background:var(--orange);color:#241004}.pillar:nth-child(4) .pillar-mark{background:var(--violet);color:#fff}

    .showcase{background:#ece9e1}.screen-stage{position:relative;margin-top:30px;padding:20px;border-radius:0;background:var(--night);box-shadow:var(--shadow)}
    .screen-main{overflow:hidden;border:5px solid #26344a;border-radius:0;background:#fff;box-shadow:0 18px 45px rgba(0,0,0,.28)}
    .screen-main img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;object-position:top}
    .screen-label{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;color:#fff;font-size:12px;font-weight:800}.screen-label small{color:#93a0b5}
    .thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.thumb{overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:0;background:#1b2940}
    .thumb img{display:block;width:100%;height:80px;object-fit:cover;object-position:top}.thumb span{display:block;padding:8px 9px;color:#d8dfeb;font-size:10px;font-weight:800}

    .vertical-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:28px}.vertical{position:relative;min-height:140px;padding:18px;border-radius:0;color:#fff;overflow:hidden}
    .vertical:after{content:"";position:absolute;width:100px;height:100px;right:-30px;bottom:-35px;border:1px solid rgba(255,255,255,.18);border-radius:0}
    .vertical:nth-child(1){background:#314867}.vertical:nth-child(2){background:#5a7042}.vertical:nth-child(3){background:#784d3c}.vertical:nth-child(4){background:#6a4f83}.vertical:nth-child(5){background:#326a73}.vertical:nth-child(6){background:#8a6633}
    .vertical small{display:block;margin-bottom:16px;color:rgba(255,255,255,.7);font-size:9px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.vertical h3{margin-bottom:6px;font-size:16px}.vertical p{max-width:360px;margin:0;color:rgba(255,255,255,.75);font-size:12px}

    .roles{color:#fff;background:var(--night)}.roles .lead{color:#aeb9c9}
    .role-flow{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:28px}.role{padding:18px;border:1px solid rgba(255,255,255,.1);border-radius:0;background:rgba(255,255,255,.04)}
    .role strong{display:block;margin-bottom:11px;color:var(--lime);font-family:var(--display);font-size:11px;text-transform:uppercase;letter-spacing:.08em}.role ul{margin:0;padding:0;list-style:none}.role li{padding:7px 0;border-bottom:1px solid rgba(255,255,255,.07);color:#d0d7e3;font-size:12px}.role li:last-child{border:0}

    .journeys{display:grid;gap:10px;margin-top:28px}.journey{display:grid;grid-template-columns:1fr;gap:10px;padding:14px 16px;border:1px solid var(--line);border-radius:0;background:#fff}
    .journey b{font-family:var(--display);font-size:13px}.steps{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.steps span{padding:6px 8px;border-radius:0;background:#f1f3f5;color:#475467;font-size:10px;font-weight:800}.steps i{color:var(--lime-dark);font-style:normal}

    .tech{background:#fff}.tech-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:24px}.tech-item{padding:14px 8px;border:1px solid #e5e7eb;border-top:3px solid var(--lime);border-radius:0;text-align:center}.tech-item:nth-child(4n+2){border-top-color:var(--blue)}.tech-item:nth-child(4n+3){border-top-color:var(--orange)}.tech-item:nth-child(4n){border-top-color:var(--violet)}.tech-item small{display:block;color:var(--muted);font-size:9px;text-transform:uppercase}.tech-item b{font-family:var(--display);font-size:12px}
    .gateway-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.gateway-row span{padding:8px 10px;border:1px solid #dfe3e8;border-radius:0;background:#fafafa;font-size:10px;font-weight:800}

    .installer{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:center}.install-list{counter-reset:install;display:grid;gap:8px}.install-list div{counter-increment:install;display:flex;align-items:center;gap:10px;padding:11px;border:1px solid var(--line);border-radius:0;background:#fff;font-size:12px;font-weight:750}.install-list div:before{content:counter(install);display:grid;place-items:center;width:24px;height:24px;flex:0 0 24px;border-radius:0;background:var(--night);color:var(--lime);font-size:10px;font-weight:900}

    .truth{background:#eaf3e4}.truth-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:24px}.truth-card{padding:16px;border:1px solid #cbdcc0;border-radius:0;background:rgba(255,255,255,.68)}.truth-card b{display:block;margin-bottom:6px;font-family:var(--display);font-size:14px}.truth-card p{margin:0;color:#506046;font-size:12px}
    .ownership-band{display:grid;grid-template-columns:1fr;gap:1px;margin-top:28px;border:1px solid #cbdcc0;border-radius:0;background:#cbdcc0;overflow:hidden}.ownership-band > div{padding:16px;background:#f8fcf5}.ownership-band .ownership-title{display:flex;flex-direction:column;justify-content:center;background:var(--night);color:#fff}.ownership-title small{color:var(--lime);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.ownership-title b{font-family:var(--display);font-size:16px}.ownership-band span{display:block;margin-bottom:6px;color:var(--lime-dark);font-size:11px;font-weight:900;text-transform:uppercase}.ownership-band p{margin:0;color:#58684f;font-size:12px}
    .cards{display:grid;gap:10px;margin-top:28px}
    .cards.c3{grid-template-columns:repeat(3,1fr)}.cards.c2{grid-template-columns:repeat(2,1fr)}
    .card{display:flex;flex-direction:column;padding:16px;border:1px solid var(--line);background:#fff;text-decoration:none;color:inherit}
    .card-tag{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;margin-bottom:14px;background:var(--night);color:var(--lime);font-family:var(--display);font-size:12px;font-weight:800}
    .card:nth-child(3n+2) .card-tag{background:var(--blue);color:#fff}.card:nth-child(3n) .card-tag{background:var(--orange);color:#241004}
    .card b{display:block;margin-bottom:6px;font-family:var(--display);font-size:14px}
    .card p{margin:0;color:var(--muted);font-size:12px;flex:1}
    .card-cta{display:block;margin-top:14px;padding-top:12px;border-top:1px solid var(--line);font-family:var(--display);font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--lime-dark)}

    #explore{background:#fff}

    .offers{background:var(--night);color:#fff}.offers .lead{color:#aeb9c9}
    .offers .card{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)}
    .offers .card p{color:#aeb9c9}.offers .card-cta{border-top-color:rgba(255,255,255,.12);color:var(--lime)}
    .offer-badge{display:inline-block;margin-bottom:12px;padding:5px 9px;background:var(--lime);color:#12210b;font-family:var(--display);font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}

    .access{background:#eef1f6}
    .cred{display:block;margin-top:12px;padding-top:12px;border-top:1px dashed var(--line);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#3a4150;line-height:1.7}
    .cred b{font-family:inherit;font-size:11px;color:var(--ink)}

    .qr-box{width:56px;height:56px;margin-bottom:14px;background:repeating-conic-gradient(#101828 0% 25%,#fff 0% 50%) 0 0/14px 14px;border:1px solid var(--line)}

    .foot{padding:48px 0;color:#fff;background:#0b1220}.foot h2{max-width:480px}.foot p{color:#aeb9c9}.foot-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}.fineprint{margin-top:28px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);color:#77849a;font-size:10px}
  </style>
