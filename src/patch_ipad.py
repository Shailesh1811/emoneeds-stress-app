import re

with open('App.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add CSS rules
css_append = """      .tp{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2dd4bf;color:#0a0d1a;padding:13px 26px;border-radius:60px;font:700 13px/1 var(--f);box-shadow:0 8px 28px rgba(45,212,191,.35);animation:su .4s ease;z-index:100}
      ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px}

      @media (min-width: 1000px) and (orientation: landscape) {
        .mc { max-width: 1000px !important; padding: 30px 60px 40px !important; }
        .ht { font-size: 56px !important; margin-bottom: 20px !important; }
        .hs { font-size: 19px !important; max-width: 600px !important; margin-bottom: 34px !important; line-height: 1.6 !important; }
        .btn-p { font-size: 18px !important; padding: 22px 60px !important; }
        .h2t { font-size: 38px !important; margin-bottom: 16px !important; }
        .st { font-size: 16px !important; margin-bottom: 30px !important; }
        .g2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 24px !important; max-width: 1000px !important; }
        .g3 { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 24px !important; max-width: 1060px !important; }
        .qc { max-width: 860px !important; flex-wrap: nowrap !important; gap: 12px !important; }
        .qo { min-height: 120px !important; font-size: 16px !important; border-width: 2px !important; }
        .qo div { width: 14px !important; height: 14px !important; margin-bottom: 8px !important; }
        .fc { display: flex; flex-direction: column; justify-content: center; }
        .svg-wrap { transform: scale(1.35); margin: 30px 0 50px !important; }
        .lead-ip { font-size: 18px !important; padding: 20px 24px !important; }
        .prog-w { max-width: 700px !important; margin-bottom: 30px !important; }
        .q-text { font-size: 26px !important; max-width: 700px !important; margin-bottom: 40px !important; line-height: 1.4 !important; }
      }
    `}</style>"""
c = re.sub(r'\.tp\{.*?\n.*?::-webkit-scrollbar.*?\}\n\s*`\}\<\/style>', css_append, c)

# 2. Main container
c = c.replace('className={fd}', 'className={`${fd} mc`}')

# 3. Welcome
c = c.replace('<h1 style={{font:"900 clamp(26px,5vw,40px)/1.12 var(--f)"', '<h1 className="ht" style={{font:"900 clamp(26px,5vw,40px)/1.12 var(--f)"')
c = c.replace('<p style={{font:"400 14px/1.65 var(--f)",color:"rgba(255,255,255,.4)"', '<p className="hs" style={{font:"400 14px/1.65 var(--f)",color:"rgba(255,255,255,.4)"')
c = c.replace('<div style={{display:"flex",gap:18,marginBottom:26,font:"500 11px/1 var(--f)"', '<div className="st" style={{display:"flex",gap:18,marginBottom:26,font:"500 11px/1 var(--f)"')
c = c.replace('<button className="bp" onClick={()=>go("name")}', '<button className="bp btn-p" onClick={()=>go("name")}')

# 4. Name
c = c.replace('<h2 style={{font:"800 24px/1.2 var(--f)",color:"#fff",marginBottom:5}}>What should we call you?</h2>', '<h2 className="h2t" style={{font:"800 24px/1.2 var(--f)",color:"#fff",marginBottom:5}}>What should we call you?</h2>')
c = c.replace('<p style={{font:"400 13px/1 var(--f)",color:"rgba(255,255,255,.35)",marginBottom:26}}>Makes your results personal</p>', '<p className="st" style={{font:"400 13px/1 var(--f)",color:"rgba(255,255,255,.35)",marginBottom:26}}>Makes your results personal</p>')
c = c.replace('<input className="ip" type="text" placeholder="First name"', '<input className="ip lead-ip" type="text" placeholder="First name"')
c = c.replace('<button className="bp" onClick={()=>{if(nm.trim())setDn(nm.trim());go("facts")}}', '<button className="bp btn-p" onClick={()=>{if(nm.trim())setDn(nm.trim());go("facts")}}')

# 5. Facts
c = c.replace('<h2 style={{font:"900 26px/1.15 var(--f)",color:"#fff",marginBottom:5}}>Did You Know? 🤯</h2>', '<h2 className="h2t" style={{font:"900 26px/1.15 var(--f)",color:"#fff",marginBottom:5}}>Did You Know? 🤯</h2>')
c = c.replace('<p style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.3)",marginBottom:22}}>Mind blowing facts about your brain</p>', '<p className="st" style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.3)",marginBottom:22}}>Mind blowing facts about your brain</p>')
c = c.replace('<div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:500,marginBottom:24}}>', '<div className="g2" style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:500,marginBottom:24}}>')
c = c.replace('<div key={i} className="cd"', '<div key={i} className="cd fc"')
c = c.replace('<button className="bp" onClick={()=>go("quiz")}', '<button className="bp btn-p" onClick={()=>go("quiz")}')

# 6. Quiz
c = c.replace('return <div style={{width:"100%",maxWidth:460,margin:"0 auto 18px"}}>', 'return <div className="prog-w" style={{width:"100%",maxWidth:460,margin:"0 auto 18px"}}>')
c = c.replace('<h3 style={{font:"700 clamp(16px,3vw,20px)/1.5 var(--f)",color:"#fff",marginBottom:22,maxWidth:440}}>', '<h3 className="q-text" style={{font:"700 clamp(16px,3vw,20px)/1.5 var(--f)",color:"#fff",marginBottom:22,maxWidth:440}}>')
c = c.replace('<div style={{display:"flex",gap:7,width:"100%",maxWidth:500,flexWrap:"wrap",justifyContent:"center"}}>', '<div className="qc" style={{display:"flex",gap:7,width:"100%",maxWidth:500,flexWrap:"wrap",justifyContent:"center"}}>')
c = c.replace('<button key={o.val} className={`op${ans[cq]===o.val?" s":""}`}', '<button key={o.val} className={`op qo ${ans[cq]===o.val?" s":""}`}')

# 7. Results
c = c.replace('<Gauge score={sc} band={band}/>', '<div className="svg-wrap"><Gauge score={sc} band={band}/></div>')
c = c.replace('<h2 style={{font:"900 24px/1.2 var(--f)",color:"#fff",marginTop:2}}>', '<h2 className="h2t" style={{font:"900 24px/1.2 var(--f)",color:"#fff",marginTop:2}}>')
c = c.replace('<button className="bp" onClick={()=>go("personal")}', '<button className="bp btn-p" onClick={()=>go("personal")}')

# 8. Personal
c = c.replace('<h2 style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>What Your Answers Reveal 🔍</h2>', '<h2 className="h2t" style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>What Your Answers Reveal 🔍</h2>')
c = c.replace('<p style={{font:"400 11px/1 var(--f)",color:"rgba(255,255,255,.28)",marginBottom:18}}>Personalised insights from your response patterns</p>', '<p className="st" style={{font:"400 11px/1 var(--f)",color:"rgba(255,255,255,.28)",marginBottom:18}}>Personalised insights from your response patterns</p>')
c = c.replace('<div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:500,marginBottom:20}}>', '<div className="g2" style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:500,marginBottom:20}}>')
c = c.replace('<button className="bp" onClick={()=>go("stats")}', '<button className="bp btn-p" onClick={()=>go("stats")}')

# 9. Stats
c = c.replace('<h2 style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>India Inc. Reality Check</h2>', '<h2 className="h2t" style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>India Inc. Reality Check</h2>')
c = c.replace('<p style={{font:"400 11px/1 var(--f)",color:"rgba(255,255,255,.28)",marginBottom:18}}>The workplace mental health landscape</p>', '<p className="st" style={{font:"400 11px/1 var(--f)",color:"rgba(255,255,255,.28)",marginBottom:18}}>The workplace mental health landscape</p>')
c = c.replace('<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,width:"100%",maxWidth:500,marginBottom:14}}>', '<div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,width:"100%",maxWidth:500,marginBottom:14}}>')
c = c.replace('<button className="bp" onClick={()=>go("lead")}', '<button className="bp btn-p" onClick={()=>go("lead")}')

# 10. Lead
c = c.replace('<h2 style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>Take the First Step</h2>', '<h2 className="h2t" style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>Take the First Step</h2>')
c = c.replace('<p style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.32)",marginBottom:22}}>For your organisation\'s wellbeing</p>', '<p className="st" style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.32)",marginBottom:22}}>For your organisation\'s wellbeing</p>')
c = c.replace('<button className="bp" onClick={()=>setShA(true)}', '<button className="bp btn-p" onClick={()=>setShA(true)}')

with open('App.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Patch applied successfully.", flush=True)
