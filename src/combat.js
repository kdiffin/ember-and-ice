export const MOVES={punch:{duration:.3,hit:.11,range:1.75,damage:7},kick:{duration:.52,hit:.23,range:2.35,damage:12},special:{duration:.65,hit:.25,range:0,damage:15}};
export class Duel{
 constructor(){this.reset()}
 reset(){this.wins=[0,0];this.round=1;this.events=[];this.newRound();this.state='intro'}
 newRound(){this.fighters=[-3.5,3.5].map((x,i)=>({x,y:0,vy:0,hp:100,facing:i?-1:1,energy:100,action:null,stun:0,frozen:0,block:false,walk:0}));this.projectiles=[];this.time=60;this.delay=1.4;this.state='countdown';this.events=[]}
 start(){this.reset();this.state='countdown'}
 attack(i,type){const f=this.fighters[i];if(this.state!=='fight'||f.action||f.stun>0||f.frozen>0||f.block)return false;if(type==='special'){if(f.energy<100)return false;f.energy=0}f.action={type,t:0,hit:false};return true}
 hit(i,damage,owner,freeze=false){const f=this.fighters[i];const blocked=f.block&&f.y===0;f.hp=Math.max(0,f.hp-(blocked?Math.ceil(damage*.18):damage));f.stun=blocked?.1:.27;if(freeze&&!blocked)f.frozen=.85;f.x=Math.max(-8,Math.min(8,f.x+this.fighters[owner].facing*(blocked?.08:.3)));this.events.push({type:'hit',x:f.x,y:f.y+1.6,owner,blocked});}
 finish(){const a=this.fighters[0].hp,b=this.fighters[1].hp;const winner=a===b?-1:a>b?0:1;if(winner>=0)this.wins[winner]++;this.winner=winner;this.state='roundOver';this.delay=2.5;this.projectiles=[];this.events.push({type:'round',winner});}
 step(dt,input={},input2={}){this.events=[];dt=Math.min(dt,.04);if(this.state==='countdown'){this.delay-=dt;if(this.delay<=0){this.state='fight';this.events.push({type:'fight'})}return}if(this.state==='roundOver'){this.delay-=dt;if(this.delay<=0){if(this.wins.some(w=>w>=2))this.state='finished';else{this.round++;this.newRound()}}return}if(this.state!=='fight')return;
 this.time=Math.max(0,this.time-dt);const [p,c]=this.fighters;
 for(let i=0;i<2;i++){const f=this.fighters[i],other=this.fighters[1-i],cmd=i?input2:input;f.facing=other.x>f.x?1:-1;f.stun=Math.max(0,f.stun-dt);f.frozen=Math.max(0,f.frozen-dt);f.energy=Math.min(100,f.energy+25*dt);f.block=!!cmd.block&&!f.action&&f.y===0&&f.frozen<=0;f.walk=0;
 if(f.stun<=0&&f.frozen<=0){if(!f.action&&!f.block){f.walk=cmd.move||0;f.x=Math.max(-8,Math.min(8,f.x+f.walk*4.4*dt));if(cmd.jump&&f.y===0)f.vy=8.5}if(cmd.attack)this.attack(i,cmd.attack)}
 f.vy-=23*dt;f.y=Math.max(0,f.y+f.vy*dt);if(f.y===0)f.vy=0;
 if(f.action){const a=f.action,m=MOVES[a.type];a.t+=dt;if(a.t>=m.hit&&!a.hit){a.hit=true;if(a.type==='special'){this.projectiles.push({x:f.x+f.facing*.7,y:f.y+1.5,dir:f.facing,owner:i});this.events.push({type:'cast',owner:i})}else if(Math.abs(f.x-other.x)<=m.range&&Math.abs(f.y-other.y)<1.4)this.hit(1-i,m.damage,i)}if(a.t>=m.duration)f.action=null}
 }
 if(Math.abs(p.x-c.x)<.85&&Math.abs(p.y-c.y)<2){const middle=(p.x+c.x)/2,sign=p.x<c.x?1:-1;p.x=middle-.425*sign;c.x=middle+.425*sign}
 for(const q of this.projectiles){q.x+=q.dir*8*dt;const target=this.fighters[1-q.owner];if(Math.abs(q.x-target.x)<.6&&q.y>target.y+.2&&q.y<target.y+2.8){this.hit(1-q.owner,15,q.owner,q.owner===1);q.dead=true}if(Math.abs(q.x)>10)q.dead=true}this.projectiles=this.projectiles.filter(q=>!q.dead);if(p.hp<=0||c.hp<=0||this.time<=0)this.finish();
 }
}
