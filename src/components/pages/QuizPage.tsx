'use client'
import { useState } from 'react'
import Link from 'next/link'

const STEPS = [
  {q:"What best describes your business?",key:'type',options:[{v:'local',l:'Local Business',d:'Restaurant, salon, clinic, shop',icon:'🏪'},{v:'startup',l:'Startup',d:'Early-stage, building from scratch',icon:'🚀'},{v:'ecommerce',l:'E-commerce',d:'Selling products online',icon:'🛒'},{v:'service',l:'Service Business',d:'Freelancer, agency, consultant',icon:'💼'},{v:'personal',l:'Personal Brand',d:'Creator, influencer, coach',icon:'🎤'}]},
  {q:"What's your #1 goal right now?",key:'goal',options:[{v:'awareness',l:'Get discovered',d:'Build brand awareness',icon:'📣'},{v:'leads',l:'Generate leads',d:'Turn social into inquiries',icon:'🎯'},{v:'sales',l:'Drive sales',d:'Convert traffic into customers',icon:'💰'},{v:'presence',l:'Build a professional presence',d:'Look credible and consistent',icon:'✨'},{v:'scale',l:"Scale what's working",d:'Amplify existing momentum',icon:'📈'}]},
  {q:"Where are you with marketing?",key:'state',options:[{v:'none',l:'Starting from zero',d:'No social presence yet',icon:'🔴'},{v:'inconsistent',l:'Posting inconsistently',d:'No real strategy or system',icon:'🟡'},{v:'active',l:'Posting regularly',d:'Not seeing strong results',icon:'🟢'},{v:'scaling',l:'Already running ads + content',d:'Want to optimize and scale',icon:'🔵'}]},
  {q:"What's your monthly budget?",key:'budget',options:[{v:'low',l:'Under $200/month',d:'Starting lean',icon:'💚'},{v:'mid',l:'$200 – $400/month',d:'Ready to invest consistently',icon:'💛'},{v:'high',l:'$400+/month',d:'Serious about scaling',icon:'💙'},{v:'unsure',l:'Not sure yet',d:'Let the recommendation guide me',icon:'🤔'}]},
]

const PLANS:{[key:string]:{name:string,price:number,feats:string[],reason:string}} = {
  launch:{name:'Launch',price:149,feats:['8 static posts/month','2 short-form videos','Caption writing & hashtag research','Monthly performance report'],reason:'You need a solid foundation first. Launch gives you consistent, professional content to build credibility before scaling.'},
  grow:{name:'Grow',price:299,feats:['12 static posts/month','4 short-form videos','Meta Ads management','Monthly strategy call'],reason:"Most businesses at your stage see the strongest ROI here. It balances content volume, strategy, and paid advertising."},
  dominate:{name:'Dominate',price:499,feats:['16 static posts/month','8 short-form videos','Full Meta Ads management','Performance dashboard','Priority support'],reason:'Based on your goals and maturity level, Dominate gives you the infrastructure to scale aggressively.'},
}

function recommend(answers:{[key:string]:string}) {
  let score={launch:0,grow:0,dominate:0}
  if(answers.state==='none')score.launch+=3
  if(answers.state==='inconsistent')score.grow+=2
  if(answers.state==='active')score.grow+=3
  if(answers.state==='scaling')score.dominate+=4
  if(answers.goal==='presence')score.launch+=2
  if(answers.goal==='awareness')score.grow+=2
  if(answers.goal==='leads')score.grow+=3
  if(answers.goal==='sales')score.dominate+=2
  if(answers.goal==='scale')score.dominate+=3
  if(answers.budget==='low')score.launch+=3
  if(answers.budget==='mid')score.grow+=2
  if(answers.budget==='high')score.dominate+=3
  return Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0]
}

export default function QuizPage() {
  const [step,setStep]=useState(0)
  const [answers,setAnswers]=useState<{[key:string]:string}>({})
  const [result,setResult]=useState<string|null>(null)

  const select=(key:string,val:string)=>{
    const newAnswers={...answers,[key]:val}
    setAnswers(newAnswers)
    if(step<STEPS.length-1){
      setTimeout(()=>setStep(step+1),300)
    } else {
      setTimeout(()=>setResult(recommend(newAnswers)),300)
    }
  }

  const plan=result?PLANS[result]:null

  return (
    <div style={{minHeight:'100vh',paddingTop:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 6% 80px'}}>
      {/* Progress */}
      {!result&&(
        <div style={{width:'100%',maxWidth:'640px',marginBottom:'48px'}}>
          <div style={{height:'3px',background:'rgba(249,253,254,0.08)',borderRadius:'2px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${((step)/STEPS.length)*100}%`,background:'linear-gradient(90deg,var(--sky),var(--purple))',borderRadius:'2px',transition:'width 0.5s'}}/>
          </div>
          <div style={{fontSize:'0.65rem',color:'var(--text-dim)',marginTop:'6px',textAlign:'center'}}>Step {step+1} of {STEPS.length}</div>
        </div>
      )}

      <div style={{width:'100%',maxWidth:'640px'}}>
        {!result?(
          <div key={step} style={{animation:'pageIn 0.4s var(--transition) both'}}>
            <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(1.4rem,4vw,2rem)',color:'var(--white)',letterSpacing:'-0.5px',marginBottom:'32px',lineHeight:1.2}}>
              {STEPS[step].q}
            </h1>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {STEPS[step].options.map(o=>(
                <button key={o.v} onClick={()=>select(STEPS[step].key,o.v)}
                  style={{display:'flex',alignItems:'center',gap:'16px',background:answers[STEPS[step].key]===o.v?'rgba(16,161,219,0.07)':'rgba(249,253,254,0.03)',border:answers[STEPS[step].key]===o.v?'1.5px solid var(--sky)':'1.5px solid var(--glass-border)',borderRadius:'14px',padding:'16px 20px',cursor:'pointer',transition:'all 0.2s',textAlign:'left',width:'100%'}}>
                  <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'rgba(16,161,219,0.08)',border:'1px solid rgba(16,161,219,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{o.icon}</div>
                  <div>
                    <div style={{fontSize:'0.9rem',fontWeight:600,color:'var(--white)',marginBottom:'2px'}}>{o.l}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--text-dim)',fontWeight:300}}>{o.d}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{textAlign:'center',marginTop:'24px'}}>
              <Link href="/packages" style={{fontSize:'0.75rem',color:'var(--text-dim)',textDecoration:'none'}}>Skip → View all packages</Link>
            </div>
          </div>
        ):(
          <div style={{animation:'pageIn 0.4s var(--transition) both'}}>
            <div style={{background:'linear-gradient(135deg,rgba(1,32,76,0.5),rgba(16,161,219,0.08))',border:'1px solid rgba(16,161,219,0.25)',borderRadius:'20px',padding:'32px',marginBottom:'16px'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,var(--sky),var(--purple))',color:'#fff',fontSize:'0.6rem',fontWeight:800,letterSpacing:'1.5px',textTransform:'uppercase',padding:'4px 12px',borderRadius:'100px',marginBottom:'16px'}}>⭐ Best Match</div>
              <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'2.5rem',color:'var(--white)',letterSpacing:'-1px',marginBottom:'4px'}}>{plan!.name}</h2>
              <div style={{fontSize:'0.9rem',color:'var(--sky)',fontWeight:600,marginBottom:'12px'}}>${plan!.price} / month</div>
              <p style={{fontSize:'0.85rem',lineHeight:1.75,color:'rgba(249,253,254,0.6)',fontWeight:300,marginBottom:'20px'}}>{plan!.reason}</p>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'7px'}}>
                {plan!.feats.map(f=><li key={f} style={{display:'flex',gap:'8px',fontSize:'0.78rem',color:'rgba(249,253,254,0.65)',fontWeight:300}}><span style={{color:'var(--sky)',fontWeight:700}}>✓</span>{f}</li>)}
              </ul>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <a href={process.env.NEXT_PUBLIC_BOOKING_URL} target="_blank" rel="noopener" className="btn-primary" style={{width:'100%',justifyContent:'center',fontSize:'0.95rem',padding:'16px'}}>Book a Free Strategy Call →</a>
              <Link href="/packages" className="btn-secondary" style={{width:'100%',justifyContent:'center'}}>Browse All Packages</Link>
            </div>
            <div style={{textAlign:'center',marginTop:'20px'}}>
              <button onClick={()=>{setStep(0);setAnswers({});setResult(null)}} style={{fontSize:'0.75rem',color:'var(--text-dim)',background:'none',border:'none',cursor:'pointer'}}>← Start Over</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
