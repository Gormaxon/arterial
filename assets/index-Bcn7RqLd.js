(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fr="180",jf=0,kl=1,Kf=2,Hh=1,Zf=2,Xn=3,En=0,Oe=1,un=2,ui=0,xs=1,nr=2,Hl=3,Vl=4,Vh=5,Pi=100,Jf=101,Qf=102,td=103,ed=104,nd=200,ja=201,id=202,sd=203,Ka=204,ir=205,rd=206,od=207,ad=208,cd=209,ld=210,ud=211,hd=212,fd=213,dd=214,Za=0,Ja=1,Qa=2,Ms=3,tc=4,ec=5,nc=6,ic=7,ol=0,pd=1,md=2,hi=0,gd=1,_d=2,vd=3,xd=4,yd=5,Md=6,Sd=7,al=300,Ss=301,bs=302,sr=303,sc=304,Co=306,Ii=1e3,Ui=1001,rc=1002,Xe=1003,bd=1004,_r=1005,hn=1006,zo=1007,ci=1008,wn=1009,Gh=1010,Wh=1011,rr=1012,cl=1013,Ni=1014,Ln=1015,dr=1016,ll=1017,ul=1018,or=1020,Xh=35902,qh=35899,Yh=1021,$h=1022,sn=1023,ar=1026,cr=1027,jh=1028,hl=1029,Kh=1030,fl=1031,dl=1033,fo=33776,po=33777,mo=33778,go=33779,oc=35840,ac=35841,cc=35842,lc=35843,uc=36196,hc=37492,fc=37496,dc=37808,pc=37809,mc=37810,gc=37811,_c=37812,vc=37813,xc=37814,yc=37815,Mc=37816,Sc=37817,bc=37818,Ec=37819,wc=37820,Tc=37821,Ac=36492,Rc=36494,Cc=36495,Pc=36283,Lc=36284,Dc=36285,Uc=36286,Ed=3200,wd=3201,Zh=0,Td=1,Cn="",Le="srgb",Es="srgb-linear",So="linear",Jt="srgb",ki=7680,Gl=519,Ad=512,Rd=513,Cd=514,Jh=515,Pd=516,Ld=517,Dd=518,Ud=519,Ic=35044,pl=35048,Wl="300 es",Dn=2e3,bo=2001;class As{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ko=Math.PI/180,Nc=180/Math.PI;function fi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ue[i&255]+Ue[i>>8&255]+Ue[i>>16&255]+Ue[i>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]).toLowerCase()}function kt(i,t,e){return Math.max(t,Math.min(e,i))}function Id(i,t){return(i%t+t)%t}function Ho(i,t,e){return(1-e)*i+e*t}function Pn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Qt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Ot{constructor(t=0,e=0){Ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=kt(this.x,t.x,e.x),this.y=kt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=kt(this.x,t,e),this.y=kt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class pr{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3];const u=r[o+0],d=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=u,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(f!==_||c!==u||l!==d||h!==g){let m=1-a;const p=c*u+l*d+h*g+f*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const M=Math.sqrt(x),T=Math.atan2(M,p*y);m=Math.sin(m*T)/M,a=Math.sin(a*T)/M}const v=a*y;if(c=c*m+u*v,l=l*m+d*v,h=h*m+g*v,f=f*m+_*v,m===1-a){const M=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=M,l*=M,h*=M,f*=M}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=r[o],u=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+h*f+c*d-l*u,t[e+1]=c*g+h*u+l*f-a*d,t[e+2]=l*g+h*d+a*u-c*f,t[e+3]=h*g-a*f-c*u-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),f=a(r/2),u=c(n/2),d=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=u*h*f+l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f-u*d*g;break;case"YXZ":this._x=u*h*f+l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f+u*d*g;break;case"ZXY":this._x=u*h*f-l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f-u*d*g;break;case"ZYX":this._x=u*h*f-l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f+u*d*g;break;case"YZX":this._x=u*h*f+l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f-u*d*g;break;case"XZY":this._x=u*h*f-l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f+u*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(n>a&&n>f){const d=2*Math.sqrt(1+n-a-f);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>f){const d=2*Math.sqrt(1+a-n-f);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+f-n-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(kt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),f=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=o*f+this._w*u,this._x=n*f+this._x*u,this._y=s*f+this._y*u,this._z=r*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Xl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Xl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),f=2*(r*n-o*e);return this.x=e+c*l+o*f-a*h,this.y=n+c*h+a*l-r*f,this.z=s+c*f+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=kt(this.x,t.x,e.x),this.y=kt(this.y,t.y,e.y),this.z=kt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=kt(this.x,t,e),this.y=kt(this.y,t,e),this.z=kt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Vo.copy(this).projectOnVector(t),this.sub(Vo)}reflect(t){return this.sub(Vo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Vo=new P,Xl=new pr;class zt{constructor(t,e,n,s,r,o,a,c,l){zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],f=n[7],u=n[2],d=n[5],g=n[8],_=s[0],m=s[3],p=s[6],y=s[1],x=s[4],v=s[7],M=s[2],T=s[5],E=s[8];return r[0]=o*_+a*y+c*M,r[3]=o*m+a*x+c*T,r[6]=o*p+a*v+c*E,r[1]=l*_+h*y+f*M,r[4]=l*m+h*x+f*T,r[7]=l*p+h*v+f*E,r[2]=u*_+d*y+g*M,r[5]=u*m+d*x+g*T,r[8]=u*p+d*v+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],f=h*o-a*l,u=a*c-h*r,d=l*r-o*c,g=e*f+n*u+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(s*l-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=u*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=d*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Go.makeScale(t,e)),this}rotate(t){return this.premultiply(Go.makeRotation(-t)),this}translate(t,e){return this.premultiply(Go.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Go=new zt;function Qh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Eo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Nd(){const i=Eo("canvas");return i.style.display="block",i}const ql={};function lr(i){i in ql||(ql[i]=!0,console.warn(i))}function Fd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Yl=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$l=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bd(){const i={enabled:!0,workingColorSpace:Es,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Jt&&(s.r=jn(s.r),s.g=jn(s.g),s.b=jn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Jt&&(s.r=ys(s.r),s.g=ys(s.g),s.b=ys(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Cn?So:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return lr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return lr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Es]:{primaries:t,whitePoint:n,transfer:So,toXYZ:Yl,fromXYZ:$l,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Le},outputColorSpaceConfig:{drawingBufferColorSpace:Le}},[Le]:{primaries:t,whitePoint:n,transfer:Jt,toXYZ:Yl,fromXYZ:$l,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Le}}}),i}const $t=Bd();function jn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ys(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Hi;class Od{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Hi===void 0&&(Hi=Eo("canvas")),Hi.width=t.width,Hi.height=t.height;const s=Hi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Hi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Eo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=jn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(jn(e[n]/255)*255):e[n]=jn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let zd=0;class ml{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zd++}),this.uuid=fi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Wo(s[o].image)):r.push(Wo(s[o]))}else r=Wo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Wo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Od.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let kd=0;const Xo=new P;class ze extends As{constructor(t=ze.DEFAULT_IMAGE,e=ze.DEFAULT_MAPPING,n=Ui,s=Ui,r=hn,o=ci,a=sn,c=wn,l=ze.DEFAULT_ANISOTROPY,h=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kd++}),this.uuid=fi(),this.name="",this.source=new ml(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ot(0,0),this.repeat=new Ot(1,1),this.center=new Ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xo).x}get height(){return this.source.getSize(Xo).y}get depth(){return this.source.getSize(Xo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==al)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ii:t.x=t.x-Math.floor(t.x);break;case Ui:t.x=t.x<0?0:1;break;case rc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ii:t.y=t.y-Math.floor(t.y);break;case Ui:t.y=t.y<0?0:1;break;case rc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=al;ze.DEFAULT_ANISOTROPY=1;class te{constructor(t=0,e=0,n=0,s=1){te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],f=c[8],u=c[1],d=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,v=(d+1)/2,M=(p+1)/2,T=(h+u)/4,E=(f+_)/4,R=(g+m)/4;return x>v&&x>M?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=T/n,r=E/n):v>M?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=R/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=E/r,s=R/r),this.set(n,s,r,e),this}let y=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(u-h)*(u-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(f-_)/y,this.z=(u-h)/y,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=kt(this.x,t.x,e.x),this.y=kt(this.y,t.y,e.y),this.z=kt(this.z,t.z,e.z),this.w=kt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=kt(this.x,t,e),this.y=kt(this.y,t,e),this.z=kt(this.z,t,e),this.w=kt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Hd extends As{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:hn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new te(0,0,t,e),this.scissorTest=!1,this.viewport=new te(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new ze(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:hn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new ml(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fi extends Hd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class gl extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Vd extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Xe,this.minFilter=Xe,this.wrapR=Ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fe{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,mn):mn.fromBufferAttribute(r,o),mn.applyMatrix4(t.matrixWorld),this.expandByPoint(mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),vr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vr.copy(n.boundingBox)),vr.applyMatrix4(t.matrixWorld),this.union(vr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,mn),mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Us),xr.subVectors(this.max,Us),Vi.subVectors(t.a,Us),Gi.subVectors(t.b,Us),Wi.subVectors(t.c,Us),Jn.subVectors(Gi,Vi),Qn.subVectors(Wi,Gi),gi.subVectors(Vi,Wi);let e=[0,-Jn.z,Jn.y,0,-Qn.z,Qn.y,0,-gi.z,gi.y,Jn.z,0,-Jn.x,Qn.z,0,-Qn.x,gi.z,0,-gi.x,-Jn.y,Jn.x,0,-Qn.y,Qn.x,0,-gi.y,gi.x,0];return!qo(e,Vi,Gi,Wi,xr)||(e=[1,0,0,0,1,0,0,0,1],!qo(e,Vi,Gi,Wi,xr))?!1:(yr.crossVectors(Jn,Qn),e=[yr.x,yr.y,yr.z],qo(e,Vi,Gi,Wi,xr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(On[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),On[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),On[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),On[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),On[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),On[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),On[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),On[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(On),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const On=[new P,new P,new P,new P,new P,new P,new P,new P],mn=new P,vr=new fe,Vi=new P,Gi=new P,Wi=new P,Jn=new P,Qn=new P,gi=new P,Us=new P,xr=new P,yr=new P,_i=new P;function qo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){_i.fromArray(i,r);const a=s.x*Math.abs(_i.x)+s.y*Math.abs(_i.y)+s.z*Math.abs(_i.z),c=t.dot(_i),l=e.dot(_i),h=n.dot(_i);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Gd=new fe,Is=new P,Yo=new P;class Rs{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Gd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Is.subVectors(t,this.center);const e=Is.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Yo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Is.copy(t.center).add(Yo)),this.expandByPoint(Is.copy(t.center).sub(Yo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const zn=new P,$o=new P,Mr=new P,ti=new P,jo=new P,Sr=new P,Ko=new P;class Cs{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=zn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zn.copy(this.origin).addScaledVector(this.direction,e),zn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){$o.copy(t).add(e).multiplyScalar(.5),Mr.copy(e).sub(t).normalize(),ti.copy(this.origin).sub($o);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Mr),a=ti.dot(this.direction),c=-ti.dot(Mr),l=ti.lengthSq(),h=Math.abs(1-o*o);let f,u,d,g;if(h>0)if(f=o*c-a,u=o*a-c,g=r*h,f>=0)if(u>=-g)if(u<=g){const _=1/h;f*=_,u*=_,d=f*(f+o*u+2*a)+u*(o*f+u+2*c)+l}else u=r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;else u=-r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;else u<=-g?(f=Math.max(0,-(-o*r+a)),u=f>0?-r:Math.min(Math.max(-r,-c),r),d=-f*f+u*(u+2*c)+l):u<=g?(f=0,u=Math.min(Math.max(-r,-c),r),d=u*(u+2*c)+l):(f=Math.max(0,-(o*r+a)),u=f>0?r:Math.min(Math.max(-r,-c),r),d=-f*f+u*(u+2*c)+l);else u=o>0?-r:r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy($o).addScaledVector(Mr,u),d}intersectSphere(t,e){zn.subVectors(t.center,this.origin);const n=zn.dot(this.direction),s=zn.dot(zn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,s=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,s=(t.min.x-u.x)*l),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-u.z)*f,c=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,c=(t.min.z-u.z)*f),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,zn)!==null}intersectTriangle(t,e,n,s,r){jo.subVectors(e,t),Sr.subVectors(n,t),Ko.crossVectors(jo,Sr);let o=this.direction.dot(Ko),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ti.subVectors(this.origin,t);const c=a*this.direction.dot(Sr.crossVectors(ti,Sr));if(c<0)return null;const l=a*this.direction.dot(jo.cross(ti));if(l<0||c+l>o)return null;const h=-a*ti.dot(Ko);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Wt{constructor(t,e,n,s,r,o,a,c,l,h,f,u,d,g,_,m){Wt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,f,u,d,g,_,m)}set(t,e,n,s,r,o,a,c,l,h,f,u,d,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Wt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Xi.setFromMatrixColumn(t,0).length(),r=1/Xi.setFromMatrixColumn(t,1).length(),o=1/Xi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const u=o*h,d=o*f,g=a*h,_=a*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=d+g*l,e[5]=u-_*l,e[9]=-a*c,e[2]=_-u*l,e[6]=g+d*l,e[10]=o*c}else if(t.order==="YXZ"){const u=c*h,d=c*f,g=l*h,_=l*f;e[0]=u+_*a,e[4]=g*a-d,e[8]=o*l,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=d*a-g,e[6]=_+u*a,e[10]=o*c}else if(t.order==="ZXY"){const u=c*h,d=c*f,g=l*h,_=l*f;e[0]=u-_*a,e[4]=-o*f,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*h,e[9]=_-u*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const u=o*h,d=o*f,g=a*h,_=a*f;e[0]=c*h,e[4]=g*l-d,e[8]=u*l+_,e[1]=c*f,e[5]=_*l+u,e[9]=d*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const u=o*c,d=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-u*f,e[8]=g*f+d,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*f+g,e[10]=u-_*f}else if(t.order==="XZY"){const u=o*c,d=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=u*f+_,e[5]=o*h,e[9]=d*f-g,e[2]=g*f-d,e[6]=a*h,e[10]=_*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wd,t,Xd)}lookAt(t,e,n){const s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),ei.crossVectors(n,Qe),ei.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),ei.crossVectors(n,Qe)),ei.normalize(),br.crossVectors(Qe,ei),s[0]=ei.x,s[4]=br.x,s[8]=Qe.x,s[1]=ei.y,s[5]=br.y,s[9]=Qe.y,s[2]=ei.z,s[6]=br.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],f=n[5],u=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],y=n[3],x=n[7],v=n[11],M=n[15],T=s[0],E=s[4],R=s[8],b=s[12],S=s[1],C=s[5],D=s[9],I=s[13],F=s[2],k=s[6],H=s[10],$=s[14],G=s[3],st=s[7],at=s[11],Mt=s[15];return r[0]=o*T+a*S+c*F+l*G,r[4]=o*E+a*C+c*k+l*st,r[8]=o*R+a*D+c*H+l*at,r[12]=o*b+a*I+c*$+l*Mt,r[1]=h*T+f*S+u*F+d*G,r[5]=h*E+f*C+u*k+d*st,r[9]=h*R+f*D+u*H+d*at,r[13]=h*b+f*I+u*$+d*Mt,r[2]=g*T+_*S+m*F+p*G,r[6]=g*E+_*C+m*k+p*st,r[10]=g*R+_*D+m*H+p*at,r[14]=g*b+_*I+m*$+p*Mt,r[3]=y*T+x*S+v*F+M*G,r[7]=y*E+x*C+v*k+M*st,r[11]=y*R+x*D+v*H+M*at,r[15]=y*b+x*I+v*$+M*Mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],f=t[6],u=t[10],d=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*c*f-s*l*f-r*a*u+n*l*u+s*a*d-n*c*d)+_*(+e*c*d-e*l*u+r*o*u-s*o*d+s*l*h-r*c*h)+m*(+e*l*f-e*a*d-r*o*f+n*o*d+r*a*h-n*l*h)+p*(-s*a*h-e*c*f+e*a*u+s*o*f-n*o*u+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],f=t[9],u=t[10],d=t[11],g=t[12],_=t[13],m=t[14],p=t[15],y=f*m*l-_*u*l+_*c*d-a*m*d-f*c*p+a*u*p,x=g*u*l-h*m*l-g*c*d+o*m*d+h*c*p-o*u*p,v=h*_*l-g*f*l+g*a*d-o*_*d-h*a*p+o*f*p,M=g*f*c-h*_*c-g*a*u+o*_*u+h*a*m-o*f*m,T=e*y+n*x+s*v+r*M;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/T;return t[0]=y*E,t[1]=(_*u*r-f*m*r-_*s*d+n*m*d+f*s*p-n*u*p)*E,t[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*p+n*c*p)*E,t[3]=(f*c*r-a*u*r-f*s*l+n*u*l+a*s*d-n*c*d)*E,t[4]=x*E,t[5]=(h*m*r-g*u*r+g*s*d-e*m*d-h*s*p+e*u*p)*E,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*p-e*c*p)*E,t[7]=(o*u*r-h*c*r+h*s*l-e*u*l-o*s*d+e*c*d)*E,t[8]=v*E,t[9]=(g*f*r-h*_*r-g*n*d+e*_*d+h*n*p-e*f*p)*E,t[10]=(o*_*r-g*a*r+g*n*l-e*_*l-o*n*p+e*a*p)*E,t[11]=(h*a*r-o*f*r-h*n*l+e*f*l+o*n*d-e*a*d)*E,t[12]=M*E,t[13]=(h*_*s-g*f*s+g*n*u-e*_*u-h*n*m+e*f*m)*E,t[14]=(g*a*s-o*_*s-g*n*c+e*_*c+o*n*m-e*a*m)*E,t[15]=(o*f*s-h*a*s+h*n*c-e*f*c-o*n*u+e*a*u)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,f=a+a,u=r*l,d=r*h,g=r*f,_=o*h,m=o*f,p=a*f,y=c*l,x=c*h,v=c*f,M=n.x,T=n.y,E=n.z;return s[0]=(1-(_+p))*M,s[1]=(d+v)*M,s[2]=(g-x)*M,s[3]=0,s[4]=(d-v)*T,s[5]=(1-(u+p))*T,s[6]=(m+y)*T,s[7]=0,s[8]=(g+x)*E,s[9]=(m-y)*E,s[10]=(1-(u+_))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Xi.set(s[0],s[1],s[2]).length();const o=Xi.set(s[4],s[5],s[6]).length(),a=Xi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],gn.copy(this);const l=1/r,h=1/o,f=1/a;return gn.elements[0]*=l,gn.elements[1]*=l,gn.elements[2]*=l,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=f,gn.elements[9]*=f,gn.elements[10]*=f,e.setFromRotationMatrix(gn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Dn,c=!1){const l=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let g,_;if(c)g=r/(o-r),_=o*r/(o-r);else if(a===Dn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===bo)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=f,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Dn,c=!1){const l=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s);let g,_;if(c)g=1/(o-r),_=o/(o-r);else if(a===Dn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===bo)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=f,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Xi=new P,gn=new Wt,Wd=new P(0,0,0),Xd=new P(1,1,1),ei=new P,br=new P,Qe=new P,jl=new Wt,Kl=new pr;class In{constructor(t=0,e=0,n=0,s=In.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(kt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-kt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(kt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return jl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Kl.setFromEuler(this),this.setFromQuaternion(Kl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}In.DEFAULT_ORDER="XYZ";class tf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let qd=0;const Zl=new P,qi=new pr,kn=new Wt,Er=new P,Ns=new P,Yd=new P,$d=new pr,Jl=new P(1,0,0),Ql=new P(0,1,0),tu=new P(0,0,1),eu={type:"added"},jd={type:"removed"},Yi={type:"childadded",child:null},Zo={type:"childremoved",child:null};class ye extends As{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qd++}),this.uuid=fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new P,e=new In,n=new pr,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Wt},normalMatrix:{value:new zt}}),this.matrix=new Wt,this.matrixWorld=new Wt,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return qi.setFromAxisAngle(t,e),this.quaternion.multiply(qi),this}rotateOnWorldAxis(t,e){return qi.setFromAxisAngle(t,e),this.quaternion.premultiply(qi),this}rotateX(t){return this.rotateOnAxis(Jl,t)}rotateY(t){return this.rotateOnAxis(Ql,t)}rotateZ(t){return this.rotateOnAxis(tu,t)}translateOnAxis(t,e){return Zl.copy(t).applyQuaternion(this.quaternion),this.position.add(Zl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Jl,t)}translateY(t){return this.translateOnAxis(Ql,t)}translateZ(t){return this.translateOnAxis(tu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(kn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Er.copy(t):Er.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kn.lookAt(Ns,Er,this.up):kn.lookAt(Er,Ns,this.up),this.quaternion.setFromRotationMatrix(kn),s&&(kn.extractRotation(s.matrixWorld),qi.setFromRotationMatrix(kn),this.quaternion.premultiply(qi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(eu),Yi.child=t,this.dispatchEvent(Yi),Yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(jd),Zo.child=t,this.dispatchEvent(Zo),Zo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),kn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),kn.multiply(t.parent.matrixWorld)),t.applyMatrix4(kn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(eu),Yi.child=t,this.dispatchEvent(Yi),Yi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,t,Yd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,$d,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];r(t.shapes,f)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ye.DEFAULT_UP=new P(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _n=new P,Hn=new P,Jo=new P,Vn=new P,$i=new P,ji=new P,nu=new P,Qo=new P,ta=new P,ea=new P,na=new te,ia=new te,sa=new te;class De{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),_n.subVectors(t,e),s.cross(_n);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){_n.subVectors(s,e),Hn.subVectors(n,e),Jo.subVectors(t,e);const o=_n.dot(_n),a=_n.dot(Hn),c=_n.dot(Jo),l=Hn.dot(Hn),h=Hn.dot(Jo),f=o*l-a*a;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(l*c-a*h)*u,g=(o*h-a*c)*u;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Vn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Vn.x),c.addScaledVector(o,Vn.y),c.addScaledVector(a,Vn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return na.setScalar(0),ia.setScalar(0),sa.setScalar(0),na.fromBufferAttribute(t,e),ia.fromBufferAttribute(t,n),sa.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(na,r.x),o.addScaledVector(ia,r.y),o.addScaledVector(sa,r.z),o}static isFrontFacing(t,e,n,s){return _n.subVectors(n,e),Hn.subVectors(t,e),_n.cross(Hn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return _n.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),_n.cross(Hn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return De.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return De.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return De.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return De.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return De.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;$i.subVectors(s,n),ji.subVectors(r,n),Qo.subVectors(t,n);const c=$i.dot(Qo),l=ji.dot(Qo);if(c<=0&&l<=0)return e.copy(n);ta.subVectors(t,s);const h=$i.dot(ta),f=ji.dot(ta);if(h>=0&&f<=h)return e.copy(s);const u=c*f-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector($i,o);ea.subVectors(t,r);const d=$i.dot(ea),g=ji.dot(ea);if(g>=0&&d<=g)return e.copy(r);const _=d*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(ji,a);const m=h*g-d*f;if(m<=0&&f-h>=0&&d-g>=0)return nu.subVectors(r,s),a=(f-h)/(f-h+(d-g)),e.copy(s).addScaledVector(nu,a);const p=1/(m+_+u);return o=_*p,a=u*p,e.copy(n).addScaledVector($i,o).addScaledVector(ji,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ef={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},wr={h:0,s:0,l:0};function ra(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ut{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Le){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=$t.workingColorSpace){if(t=Id(t,1),e=kt(e,0,1),n=kt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ra(o,r,t+1/3),this.g=ra(o,r,t),this.b=ra(o,r,t-1/3)}return $t.colorSpaceToWorking(this,s),this}setStyle(t,e=Le){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Le){const n=ef[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=jn(t.r),this.g=jn(t.g),this.b=jn(t.b),this}copyLinearToSRGB(t){return this.r=ys(t.r),this.g=ys(t.g),this.b=ys(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Le){return $t.workingToColorSpace(Ie.copy(this),t),Math.round(kt(Ie.r*255,0,255))*65536+Math.round(kt(Ie.g*255,0,255))*256+Math.round(kt(Ie.b*255,0,255))}getHexString(t=Le){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.workingToColorSpace(Ie.copy(this),e);const n=Ie.r,s=Ie.g,r=Ie.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const f=o-a;switch(l=h<=.5?f/(o+a):f/(2-o-a),o){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.workingToColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=Le){$t.workingToColorSpace(Ie.copy(this),t);const e=Ie.r,n=Ie.g,s=Ie.b;return t!==Le?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ni),this.setHSL(ni.h+t,ni.s+e,ni.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ni),t.getHSL(wr);const n=Ho(ni.h,wr.h,e),s=Ho(ni.s,wr.s,e),r=Ho(ni.l,wr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ie=new Ut;Ut.NAMES=ef;let Kd=0;class Bi extends As{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=fi(),this.name="",this.type="Material",this.blending=xs,this.side=En,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ka,this.blendDst=ir,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ut(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ki,this.stencilZFail=ki,this.stencilZPass=ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==xs&&(n.blending=this.blending),this.side!==En&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ka&&(n.blendSrc=this.blendSrc),this.blendDst!==ir&&(n.blendDst=this.blendDst),this.blendEquation!==Pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ms&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Po extends Bi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ut(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ve=new P,Tr=new Ot;let Zd=0;class ge{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Zd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ic,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Tr.fromBufferAttribute(this,e),Tr.applyMatrix3(t),this.setXY(e,Tr.x,Tr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix3(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix4(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyNormalMatrix(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.transformDirection(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Pn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Pn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Pn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Pn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Qt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array),r=Qt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ic&&(t.usage=this.usage),t}}class nf extends ge{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class sf extends ge{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class bn extends ge{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Jd=0;const an=new Wt,oa=new ye,Ki=new P,tn=new fe,Fs=new fe,Re=new P;class Ke extends As{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jd++}),this.uuid=fi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Qh(t)?sf:nf)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,n){return an.makeTranslation(t,e,n),this.applyMatrix4(an),this}scale(t,e,n){return an.makeScale(t,e,n),this.applyMatrix4(an),this}lookAt(t){return oa.lookAt(t),oa.updateMatrix(),this.applyMatrix4(oa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ki).negate(),this.translate(Ki.x,Ki.y,Ki.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new bn(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fe);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Fs.setFromBufferAttribute(a),this.morphTargetsRelative?(Re.addVectors(tn.min,Fs.min),tn.expandByPoint(Re),Re.addVectors(tn.max,Fs.max),tn.expandByPoint(Re)):(tn.expandByPoint(Fs.min),tn.expandByPoint(Fs.max))}tn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Re.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Re));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Re.fromBufferAttribute(a,l),c&&(Ki.fromBufferAttribute(t,l),Re.add(Ki)),s=Math.max(s,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ge(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let R=0;R<n.count;R++)a[R]=new P,c[R]=new P;const l=new P,h=new P,f=new P,u=new Ot,d=new Ot,g=new Ot,_=new P,m=new P;function p(R,b,S){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,S),u.fromBufferAttribute(r,R),d.fromBufferAttribute(r,b),g.fromBufferAttribute(r,S),h.sub(l),f.sub(l),d.sub(u),g.sub(u);const C=1/(d.x*g.y-g.x*d.y);isFinite(C)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(C),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(C),a[R].add(_),a[b].add(_),a[S].add(_),c[R].add(m),c[b].add(m),c[S].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let R=0,b=y.length;R<b;++R){const S=y[R],C=S.start,D=S.count;for(let I=C,F=C+D;I<F;I+=3)p(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const x=new P,v=new P,M=new P,T=new P;function E(R){M.fromBufferAttribute(s,R),T.copy(M);const b=a[R];x.copy(b),x.sub(M.multiplyScalar(M.dot(b))).normalize(),v.crossVectors(T,b);const C=v.dot(c[R])<0?-1:1;o.setXYZW(R,x.x,x.y,x.z,C)}for(let R=0,b=y.length;R<b;++R){const S=y[R],C=S.start,D=S.count;for(let I=C,F=C+D;I<F;I+=3)E(t.getX(I+0)),E(t.getX(I+1)),E(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ge(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new P,r=new P,o=new P,a=new P,c=new P,l=new P,h=new P,f=new P;if(t)for(let u=0,d=t.count;u<d;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,f=a.normalized,u=new l.constructor(c.length*h);let d=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?d=c[_]*a.data.stride+a.offset:d=c[_]*h;for(let p=0;p<h;p++)u[g++]=l[d++]}return new ge(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ke,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,f=l.length;h<f;h++){const u=l[h],d=t(u,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,u=l.length;f<u;f++){const d=l[f];h.push(d.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],f=r[l];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const iu=new Wt,vi=new Cs,Ar=new Rs,su=new P,Rr=new P,Cr=new P,Pr=new P,aa=new P,Lr=new P,ru=new P,Dr=new P;class We extends ye{constructor(t=new Ke,e=new Po){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Lr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],f=r[c];h!==0&&(aa.fromBufferAttribute(f,t),o?Lr.addScaledVector(aa,h):Lr.addScaledVector(aa.sub(e),h))}e.add(Lr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ar.copy(n.boundingSphere),Ar.applyMatrix4(r),vi.copy(t.ray).recast(t.near),!(Ar.containsPoint(vi.origin)===!1&&(vi.intersectSphere(Ar,su)===null||vi.origin.distanceToSquared(su)>(t.far-t.near)**2))&&(iu.copy(r).invert(),vi.copy(t.ray).applyMatrix4(iu),!(n.boundingBox!==null&&vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,vi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=o[m.materialIndex],y=Math.max(m.start,d.start),x=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let v=y,M=x;v<M;v+=3){const T=a.getX(v),E=a.getX(v+1),R=a.getX(v+2);s=Ur(this,p,t,n,l,h,f,T,E,R),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const y=a.getX(m),x=a.getX(m+1),v=a.getX(m+2);s=Ur(this,o,t,n,l,h,f,y,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],p=o[m.materialIndex],y=Math.max(m.start,d.start),x=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let v=y,M=x;v<M;v+=3){const T=v,E=v+1,R=v+2;s=Ur(this,p,t,n,l,h,f,T,E,R),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),_=Math.min(c.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const y=m,x=m+1,v=m+2;s=Ur(this,o,t,n,l,h,f,y,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Qd(i,t,e,n,s,r,o,a){let c;if(t.side===Oe?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===En,a),c===null)return null;Dr.copy(a),Dr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Dr);return l<e.near||l>e.far?null:{distance:l,point:Dr.clone(),object:i}}function Ur(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Rr),i.getVertexPosition(c,Cr),i.getVertexPosition(l,Pr);const h=Qd(i,t,e,n,Rr,Cr,Pr,ru);if(h){const f=new P;De.getBarycoord(ru,Rr,Cr,Pr,f),s&&(h.uv=De.getInterpolatedAttribute(s,a,c,l,f,new Ot)),r&&(h.uv1=De.getInterpolatedAttribute(r,a,c,l,f,new Ot)),o&&(h.normal=De.getInterpolatedAttribute(o,a,c,l,f,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new P,materialIndex:0};De.getNormal(Rr,Cr,Pr,u.normal),h.face=u,h.barycoord=f}return h}class Zn extends Ke{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],f=[];let u=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new bn(l,3)),this.setAttribute("normal",new bn(h,3)),this.setAttribute("uv",new bn(f,2));function g(_,m,p,y,x,v,M,T,E,R,b){const S=v/E,C=M/R,D=v/2,I=M/2,F=T/2,k=E+1,H=R+1;let $=0,G=0;const st=new P;for(let at=0;at<H;at++){const Mt=at*C-I;for(let pt=0;pt<k;pt++){const Vt=pt*S-D;st[_]=Vt*y,st[m]=Mt*x,st[p]=F,l.push(st.x,st.y,st.z),st[_]=0,st[m]=0,st[p]=T>0?1:-1,h.push(st.x,st.y,st.z),f.push(pt/E),f.push(1-at/R),$+=1}}for(let at=0;at<R;at++)for(let Mt=0;Mt<E;Mt++){const pt=u+Mt+k*at,Vt=u+Mt+k*(at+1),Xt=u+(Mt+1)+k*(at+1),Nt=u+(Mt+1)+k*at;c.push(pt,Vt,Nt),c.push(Vt,Xt,Nt),G+=6}a.addGroup(d,G,b),d+=G,u+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ws(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){const t={};for(let e=0;e<i.length;e++){const n=ws(i[e]);for(const s in n)t[s]=n[s]}return t}function tp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function rf(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const ep={clone:ws,merge:Ve};var np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class dn extends Bi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=np,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ws(t.uniforms),this.uniformsGroups=tp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class of extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Wt,this.projectionMatrix=new Wt,this.projectionMatrixInverse=new Wt,this.coordinateSystem=Dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ii=new P,ou=new Ot,au=new Ot;class en extends of{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Nc*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ko*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Nc*2*Math.atan(Math.tan(ko*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ii.x,ii.y).multiplyScalar(-t/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ii.x,ii.y).multiplyScalar(-t/ii.z)}getViewSize(t,e){return this.getViewBounds(t,ou,au),e.subVectors(au,ou)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ko*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Zi=-90,Ji=1;class sp extends ye{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new en(Zi,Ji,t,e);s.layers=this.layers,this.add(s);const r=new en(Zi,Ji,t,e);r.layers=this.layers,this.add(r);const o=new en(Zi,Ji,t,e);o.layers=this.layers,this.add(o);const a=new en(Zi,Ji,t,e);a.layers=this.layers,this.add(a);const c=new en(Zi,Ji,t,e);c.layers=this.layers,this.add(c);const l=new en(Zi,Ji,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===bo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class af extends ze{constructor(t=[],e=Ss,n,s,r,o,a,c,l,h){super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class rp extends Fi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new af(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Zn(5,5,5),r=new dn({name:"CubemapFromEquirect",uniforms:ws(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Oe,blending:ui});r.uniforms.tEquirect.value=e;const o=new We(s,r),a=e.minFilter;return e.minFilter===ci&&(e.minFilter=hn),new sp(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Zs extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const op={type:"move"};class ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,g=.005;l.inputState.pinching&&u>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(op)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Zs;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class wo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ut(t),this.near=e,this.far=n}clone(){return new wo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class cf extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new In,this.environmentIntensity=1,this.environmentRotation=new In,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class lf{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ic,this.updateRanges=[],this.version=0,this.uuid=fi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const He=new P;class Mn{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Qt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Pn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Pn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Pn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Pn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Qt(e,this.array),n=Qt(n,this.array),s=Qt(s,this.array),r=Qt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new ge(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Mn(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class uf extends ze{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Xe,h=Xe,f,u){super(null,o,a,c,l,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const la=new P,ap=new P,cp=new zt;class Yn{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=la.subVectors(n,e).cross(ap.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(la),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||cp.getNormalMatrix(t),s=this.coplanarPoint(la).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const xi=new Rs,lp=new Ot(.5,.5),Ir=new P;class _l{constructor(t=new Yn,e=new Yn,n=new Yn,s=new Yn,r=new Yn,o=new Yn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Dn,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],f=r[5],u=r[6],d=r[7],g=r[8],_=r[9],m=r[10],p=r[11],y=r[12],x=r[13],v=r[14],M=r[15];if(s[0].setComponents(l-o,d-h,p-g,M-y).normalize(),s[1].setComponents(l+o,d+h,p+g,M+y).normalize(),s[2].setComponents(l+a,d+f,p+_,M+x).normalize(),s[3].setComponents(l-a,d-f,p-_,M-x).normalize(),n)s[4].setComponents(c,u,m,v).normalize(),s[5].setComponents(l-c,d-u,p-m,M-v).normalize();else if(s[4].setComponents(l-c,d-u,p-m,M-v).normalize(),e===Dn)s[5].setComponents(l+c,d+u,p+m,M+v).normalize();else if(e===bo)s[5].setComponents(c,u,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),xi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),xi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(xi)}intersectsSprite(t){xi.center.set(0,0,0);const e=lp.distanceTo(t.center);return xi.radius=.7071067811865476+e,xi.applyMatrix4(t.matrixWorld),this.intersectsSphere(xi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ir.x=s.normal.x>0?t.max.x:t.min.x,Ir.y=s.normal.y>0?t.max.y:t.min.y,Ir.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ir)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class up extends Bi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ut(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const cu=new Wt,Fc=new Cs,Nr=new Rs,Fr=new P;class hp extends ye{constructor(t=new Ke,e=new up){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Nr.copy(n.boundingSphere),Nr.applyMatrix4(s),Nr.radius+=r,t.ray.intersectsSphere(Nr)===!1)return;cu.copy(s).invert(),Fc.copy(t.ray).applyMatrix4(cu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,f=n.attributes.position;if(l!==null){const u=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=u,_=d;g<_;g++){const m=l.getX(g);Fr.fromBufferAttribute(f,m),lu(Fr,m,c,s,t,e,this)}}else{const u=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=u,_=d;g<_;g++)Fr.fromBufferAttribute(f,g),lu(Fr,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function lu(i,t,e,n,s,r,o){const a=Fc.distanceSqToPoint(i);if(a<e){const c=new P;Fc.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class vl extends ze{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class hf extends ze{constructor(t,e,n=Ni,s,r,o,a=Xe,c=Xe,l,h=ar,f=1){if(h!==ar&&h!==cr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:f};super(u,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ml(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ff extends ze{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Ps extends Ke{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,f=t/a,u=e/c,d=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const y=p*u-o;for(let x=0;x<l;x++){const v=x*f-r;g.push(v,-y,0),_.push(0,0,1),m.push(x/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<a;y++){const x=y+l*p,v=y+l*(p+1),M=y+1+l*(p+1),T=y+1+l*p;d.push(x,v,T),d.push(v,M,T)}this.setIndex(d),this.setAttribute("position",new bn(g,3)),this.setAttribute("normal",new bn(_,3)),this.setAttribute("uv",new bn(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ps(t.width,t.height,t.widthSegments,t.heightSegments)}}class xl extends Ke{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],f=new P,u=new P,d=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const y=[],x=p/n;let v=0;p===0&&o===0?v=.5/e:p===n&&c===Math.PI&&(v=-.5/e);for(let M=0;M<=e;M++){const T=M/e;f.x=-t*Math.cos(s+T*r)*Math.sin(o+x*a),f.y=t*Math.cos(o+x*a),f.z=t*Math.sin(s+T*r)*Math.sin(o+x*a),g.push(f.x,f.y,f.z),u.copy(f).normalize(),_.push(u.x,u.y,u.z),m.push(T+v,1-x),y.push(l++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const x=h[p][y+1],v=h[p][y],M=h[p+1][y],T=h[p+1][y+1];(p!==0||o>0)&&d.push(x,v,T),(p!==n-1||c<Math.PI)&&d.push(v,M,T)}this.setIndex(d),this.setAttribute("position",new bn(g,3)),this.setAttribute("normal",new bn(_,3)),this.setAttribute("uv",new bn(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xl(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class fp extends Bi{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ut(16777215),this.specular=new Ut(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ut(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Zh,this.normalScale=new Ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class dp extends Bi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ed,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class pp extends Bi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class yl extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ut(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class mp extends yl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ut(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ua=new Wt,uu=new P,hu=new P;class df{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ot(512,512),this.mapType=wn,this.map=null,this.mapPass=null,this.matrix=new Wt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _l,this._frameExtents=new Ot(1,1),this._viewportCount=1,this._viewports=[new te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;uu.setFromMatrixPosition(t.matrixWorld),e.position.copy(uu),hu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hu),e.updateMatrixWorld(),ua.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ua,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ua)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const fu=new Wt,Bs=new P,ha=new P;class gp extends df{constructor(){super(new en(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ot(4,2),this._viewportCount=6,this._viewports=[new te(2,1,1,1),new te(0,1,1,1),new te(3,1,1,1),new te(1,1,1,1),new te(3,0,1,1),new te(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Bs.setFromMatrixPosition(t.matrixWorld),n.position.copy(Bs),ha.copy(n.position),ha.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ha),n.updateMatrixWorld(),s.makeTranslation(-Bs.x,-Bs.y,-Bs.z),fu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fu,n.coordinateSystem,n.reversedDepth)}}class _p extends yl{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new gp}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class pf extends of{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class vp extends df{constructor(){super(new pf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xp extends yl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new vp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class yp extends Ke{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Mp extends en{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Sp extends lf{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const du=new P,Br=new P,Qi=new P,ts=new P,fa=new P,bp=new P,Ep=new P;class Nn{constructor(t=new P,e=new P){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){du.subVectors(t,this.start),Br.subVectors(this.end,this.start);const n=Br.dot(Br);let r=Br.dot(du)/n;return e&&(r=kt(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=bp,n=Ep){const s=10000000000000001e-32;let r,o;const a=this.start,c=t.start,l=this.end,h=t.end;Qi.subVectors(l,a),ts.subVectors(h,c),fa.subVectors(a,c);const f=Qi.dot(Qi),u=ts.dot(ts),d=ts.dot(fa);if(f<=s&&u<=s)return e.copy(a),n.copy(c),e.sub(n),e.dot(e);if(f<=s)r=0,o=d/u,o=kt(o,0,1);else{const g=Qi.dot(fa);if(u<=s)o=0,r=kt(-g/f,0,1);else{const _=Qi.dot(ts),m=f*u-_*_;m!==0?r=kt((_*d-g*u)/m,0,1):r=0,o=(_*r+d)/u,o<0?(o=0,r=kt(-g/f,0,1)):o>1&&(o=1,r=kt((_-g)/f,0,1))}}return e.copy(a).add(Qi.multiplyScalar(r)),n.copy(c).add(ts.multiplyScalar(o)),e.sub(n),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function pu(i,t,e,n){const s=wp(n);switch(e){case Yh:return i*t;case jh:return i*t/s.components*s.byteLength;case hl:return i*t/s.components*s.byteLength;case Kh:return i*t*2/s.components*s.byteLength;case fl:return i*t*2/s.components*s.byteLength;case $h:return i*t*3/s.components*s.byteLength;case sn:return i*t*4/s.components*s.byteLength;case dl:return i*t*4/s.components*s.byteLength;case fo:case po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case mo:case go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ac:case lc:return Math.max(i,16)*Math.max(t,8)/4;case oc:case cc:return Math.max(i,8)*Math.max(t,8)/2;case uc:case hc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case fc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case dc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case pc:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case mc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case gc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case _c:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case vc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case xc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case yc:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Mc:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Sc:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case bc:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ec:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case wc:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Tc:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ac:case Rc:case Cc:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Pc:case Lc:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Dc:case Uc:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function wp(i){switch(i){case wn:case Gh:return{byteLength:1,components:1};case rr:case Wh:case dr:return{byteLength:2,components:1};case ll:case ul:return{byteLength:2,components:4};case Ni:case cl:case Ln:return{byteLength:4,components:1};case Xh:case qh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fr);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function mf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Tp(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,f=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,a),f.length===0)i.bufferSubData(l,0,h);else{f.sort((d,g)=>d.start-g.start);let u=0;for(let d=1;d<f.length;d++){const g=f[u],_=f[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,f[u]=_)}f.length=u+1;for(let d=0,g=f.length;d<g;d++){const _=f[d];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Ap=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Cp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Lp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Up=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ip=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Np=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Fp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Bp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Op=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,kp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Hp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Vp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Gp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,qp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Yp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,$p=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,jp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Kp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Jp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Qp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,tm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,em=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,im="gl_FragColor = linearToOutputTexel( gl_FragColor );",sm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,om=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,am=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,cm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,pm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,mm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_m=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,xm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ym=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Em=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,wm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Tm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Am=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Rm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Um=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Im=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Fm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Om=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,km=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Hm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Gm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Xm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ym=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$m=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Km=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Jm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,eg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ng=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ig=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,og=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ag=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,lg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ug=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,hg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,fg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,pg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_g=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,yg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Mg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Tg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ag=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ug=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ig=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ng=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Fg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Og=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Hg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Xg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Yg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,$g=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Zg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,t0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,e0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,n0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,i0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,s0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,r0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Bt={alphahash_fragment:Ap,alphahash_pars_fragment:Rp,alphamap_fragment:Cp,alphamap_pars_fragment:Pp,alphatest_fragment:Lp,alphatest_pars_fragment:Dp,aomap_fragment:Up,aomap_pars_fragment:Ip,batching_pars_vertex:Np,batching_vertex:Fp,begin_vertex:Bp,beginnormal_vertex:Op,bsdfs:zp,iridescence_fragment:kp,bumpmap_pars_fragment:Hp,clipping_planes_fragment:Vp,clipping_planes_pars_fragment:Gp,clipping_planes_pars_vertex:Wp,clipping_planes_vertex:Xp,color_fragment:qp,color_pars_fragment:Yp,color_pars_vertex:$p,color_vertex:jp,common:Kp,cube_uv_reflection_fragment:Zp,defaultnormal_vertex:Jp,displacementmap_pars_vertex:Qp,displacementmap_vertex:tm,emissivemap_fragment:em,emissivemap_pars_fragment:nm,colorspace_fragment:im,colorspace_pars_fragment:sm,envmap_fragment:rm,envmap_common_pars_fragment:om,envmap_pars_fragment:am,envmap_pars_vertex:cm,envmap_physical_pars_fragment:xm,envmap_vertex:lm,fog_vertex:um,fog_pars_vertex:hm,fog_fragment:fm,fog_pars_fragment:dm,gradientmap_pars_fragment:pm,lightmap_pars_fragment:mm,lights_lambert_fragment:gm,lights_lambert_pars_fragment:_m,lights_pars_begin:vm,lights_toon_fragment:ym,lights_toon_pars_fragment:Mm,lights_phong_fragment:Sm,lights_phong_pars_fragment:bm,lights_physical_fragment:Em,lights_physical_pars_fragment:wm,lights_fragment_begin:Tm,lights_fragment_maps:Am,lights_fragment_end:Rm,logdepthbuf_fragment:Cm,logdepthbuf_pars_fragment:Pm,logdepthbuf_pars_vertex:Lm,logdepthbuf_vertex:Dm,map_fragment:Um,map_pars_fragment:Im,map_particle_fragment:Nm,map_particle_pars_fragment:Fm,metalnessmap_fragment:Bm,metalnessmap_pars_fragment:Om,morphinstance_vertex:zm,morphcolor_vertex:km,morphnormal_vertex:Hm,morphtarget_pars_vertex:Vm,morphtarget_vertex:Gm,normal_fragment_begin:Wm,normal_fragment_maps:Xm,normal_pars_fragment:qm,normal_pars_vertex:Ym,normal_vertex:$m,normalmap_pars_fragment:jm,clearcoat_normal_fragment_begin:Km,clearcoat_normal_fragment_maps:Zm,clearcoat_pars_fragment:Jm,iridescence_pars_fragment:Qm,opaque_fragment:tg,packing:eg,premultiplied_alpha_fragment:ng,project_vertex:ig,dithering_fragment:sg,dithering_pars_fragment:rg,roughnessmap_fragment:og,roughnessmap_pars_fragment:ag,shadowmap_pars_fragment:cg,shadowmap_pars_vertex:lg,shadowmap_vertex:ug,shadowmask_pars_fragment:hg,skinbase_vertex:fg,skinning_pars_vertex:dg,skinning_vertex:pg,skinnormal_vertex:mg,specularmap_fragment:gg,specularmap_pars_fragment:_g,tonemapping_fragment:vg,tonemapping_pars_fragment:xg,transmission_fragment:yg,transmission_pars_fragment:Mg,uv_pars_fragment:Sg,uv_pars_vertex:bg,uv_vertex:Eg,worldpos_vertex:wg,background_vert:Tg,background_frag:Ag,backgroundCube_vert:Rg,backgroundCube_frag:Cg,cube_vert:Pg,cube_frag:Lg,depth_vert:Dg,depth_frag:Ug,distanceRGBA_vert:Ig,distanceRGBA_frag:Ng,equirect_vert:Fg,equirect_frag:Bg,linedashed_vert:Og,linedashed_frag:zg,meshbasic_vert:kg,meshbasic_frag:Hg,meshlambert_vert:Vg,meshlambert_frag:Gg,meshmatcap_vert:Wg,meshmatcap_frag:Xg,meshnormal_vert:qg,meshnormal_frag:Yg,meshphong_vert:$g,meshphong_frag:jg,meshphysical_vert:Kg,meshphysical_frag:Zg,meshtoon_vert:Jg,meshtoon_frag:Qg,points_vert:t0,points_frag:e0,shadow_vert:n0,shadow_frag:i0,sprite_vert:s0,sprite_frag:r0},ot={common:{diffuse:{value:new Ut(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ut(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ut(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Ut(16777215)},opacity:{value:1},center:{value:new Ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},Rn={basic:{uniforms:Ve([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.fog]),vertexShader:Bt.meshbasic_vert,fragmentShader:Bt.meshbasic_frag},lambert:{uniforms:Ve([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Ut(0)}}]),vertexShader:Bt.meshlambert_vert,fragmentShader:Bt.meshlambert_frag},phong:{uniforms:Ve([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Ut(0)},specular:{value:new Ut(1118481)},shininess:{value:30}}]),vertexShader:Bt.meshphong_vert,fragmentShader:Bt.meshphong_frag},standard:{uniforms:Ve([ot.common,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.roughnessmap,ot.metalnessmap,ot.fog,ot.lights,{emissive:{value:new Ut(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag},toon:{uniforms:Ve([ot.common,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.gradientmap,ot.fog,ot.lights,{emissive:{value:new Ut(0)}}]),vertexShader:Bt.meshtoon_vert,fragmentShader:Bt.meshtoon_frag},matcap:{uniforms:Ve([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,{matcap:{value:null}}]),vertexShader:Bt.meshmatcap_vert,fragmentShader:Bt.meshmatcap_frag},points:{uniforms:Ve([ot.points,ot.fog]),vertexShader:Bt.points_vert,fragmentShader:Bt.points_frag},dashed:{uniforms:Ve([ot.common,ot.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Bt.linedashed_vert,fragmentShader:Bt.linedashed_frag},depth:{uniforms:Ve([ot.common,ot.displacementmap]),vertexShader:Bt.depth_vert,fragmentShader:Bt.depth_frag},normal:{uniforms:Ve([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,{opacity:{value:1}}]),vertexShader:Bt.meshnormal_vert,fragmentShader:Bt.meshnormal_frag},sprite:{uniforms:Ve([ot.sprite,ot.fog]),vertexShader:Bt.sprite_vert,fragmentShader:Bt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Bt.background_vert,fragmentShader:Bt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:Bt.backgroundCube_vert,fragmentShader:Bt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Bt.cube_vert,fragmentShader:Bt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Bt.equirect_vert,fragmentShader:Bt.equirect_frag},distanceRGBA:{uniforms:Ve([ot.common,ot.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Bt.distanceRGBA_vert,fragmentShader:Bt.distanceRGBA_frag},shadow:{uniforms:Ve([ot.lights,ot.fog,{color:{value:new Ut(0)},opacity:{value:1}}]),vertexShader:Bt.shadow_vert,fragmentShader:Bt.shadow_frag}};Rn.physical={uniforms:Ve([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Ut(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Ut(0)},specularColor:{value:new Ut(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag};const Or={r:0,b:0,g:0},yi=new In,o0=new Wt;function a0(i,t,e,n,s,r,o){const a=new Ut(0);let c=r===!0?0:1,l,h,f=null,u=0,d=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function _(x){let v=!1;const M=g(x);M===null?p(a,c):M&&M.isColor&&(p(M,1),v=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,v){const M=g(v);M&&(M.isCubeTexture||M.mapping===Co)?(h===void 0&&(h=new We(new Zn(1,1,1),new dn({name:"BackgroundCubeMaterial",uniforms:ws(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:Oe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,E,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),yi.copy(v.backgroundRotation),yi.x*=-1,yi.y*=-1,yi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(yi.y*=-1,yi.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(o0.makeRotationFromEuler(yi)),h.material.toneMapped=$t.getTransfer(M.colorSpace)!==Jt,(f!==M||u!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=M,u=M.version,d=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new We(new Ps(2,2),new dn({name:"BackgroundMaterial",uniforms:ws(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=$t.getTransfer(M.colorSpace)!==Jt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||u!==M.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,f=M,u=M.version,d=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,v){x.getRGB(Or,rf(i)),n.buffers.color.setClear(Or.r,Or.g,Or.b,v,o)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),c=v,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(a,c)},render:_,addToRenderList:m,dispose:y}}function c0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(S,C,D,I,F){let k=!1;const H=f(I,D,C);r!==H&&(r=H,l(r.object)),k=d(S,I,D,F),k&&g(S,I,D,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,v(S,C,D,I),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function f(S,C,D){const I=D.wireframe===!0;let F=n[S.id];F===void 0&&(F={},n[S.id]=F);let k=F[C.id];k===void 0&&(k={},F[C.id]=k);let H=k[I];return H===void 0&&(H=u(c()),k[I]=H),H}function u(S){const C=[],D=[],I=[];for(let F=0;F<e;F++)C[F]=0,D[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:D,attributeDivisors:I,object:S,attributes:{},index:null}}function d(S,C,D,I){const F=r.attributes,k=C.attributes;let H=0;const $=D.getAttributes();for(const G in $)if($[G].location>=0){const at=F[G];let Mt=k[G];if(Mt===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(Mt=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(Mt=S.instanceColor)),at===void 0||at.attribute!==Mt||Mt&&at.data!==Mt.data)return!0;H++}return r.attributesNum!==H||r.index!==I}function g(S,C,D,I){const F={},k=C.attributes;let H=0;const $=D.getAttributes();for(const G in $)if($[G].location>=0){let at=k[G];at===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(at=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(at=S.instanceColor));const Mt={};Mt.attribute=at,at&&at.data&&(Mt.data=at.data),F[G]=Mt,H++}r.attributes=F,r.attributesNum=H,r.index=I}function _(){const S=r.newAttributes;for(let C=0,D=S.length;C<D;C++)S[C]=0}function m(S){p(S,0)}function p(S,C){const D=r.newAttributes,I=r.enabledAttributes,F=r.attributeDivisors;D[S]=1,I[S]===0&&(i.enableVertexAttribArray(S),I[S]=1),F[S]!==C&&(i.vertexAttribDivisor(S,C),F[S]=C)}function y(){const S=r.newAttributes,C=r.enabledAttributes;for(let D=0,I=C.length;D<I;D++)C[D]!==S[D]&&(i.disableVertexAttribArray(D),C[D]=0)}function x(S,C,D,I,F,k,H){H===!0?i.vertexAttribIPointer(S,C,D,F,k):i.vertexAttribPointer(S,C,D,I,F,k)}function v(S,C,D,I){_();const F=I.attributes,k=D.getAttributes(),H=C.defaultAttributeValues;for(const $ in k){const G=k[$];if(G.location>=0){let st=F[$];if(st===void 0&&($==="instanceMatrix"&&S.instanceMatrix&&(st=S.instanceMatrix),$==="instanceColor"&&S.instanceColor&&(st=S.instanceColor)),st!==void 0){const at=st.normalized,Mt=st.itemSize,pt=t.get(st);if(pt===void 0)continue;const Vt=pt.buffer,Xt=pt.type,Nt=pt.bytesPerElement,Y=Xt===i.INT||Xt===i.UNSIGNED_INT||st.gpuType===cl;if(st.isInterleavedBufferAttribute){const K=st.data,ft=K.stride,Tt=st.offset;if(K.isInstancedInterleavedBuffer){for(let gt=0;gt<G.locationSize;gt++)p(G.location+gt,K.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let gt=0;gt<G.locationSize;gt++)m(G.location+gt);i.bindBuffer(i.ARRAY_BUFFER,Vt);for(let gt=0;gt<G.locationSize;gt++)x(G.location+gt,Mt/G.locationSize,Xt,at,ft*Nt,(Tt+Mt/G.locationSize*gt)*Nt,Y)}else{if(st.isInstancedBufferAttribute){for(let K=0;K<G.locationSize;K++)p(G.location+K,st.meshPerAttribute);S.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let K=0;K<G.locationSize;K++)m(G.location+K);i.bindBuffer(i.ARRAY_BUFFER,Vt);for(let K=0;K<G.locationSize;K++)x(G.location+K,Mt/G.locationSize,Xt,at,Mt*Nt,Mt/G.locationSize*K*Nt,Y)}}else if(H!==void 0){const at=H[$];if(at!==void 0)switch(at.length){case 2:i.vertexAttrib2fv(G.location,at);break;case 3:i.vertexAttrib3fv(G.location,at);break;case 4:i.vertexAttrib4fv(G.location,at);break;default:i.vertexAttrib1fv(G.location,at)}}}}y()}function M(){R();for(const S in n){const C=n[S];for(const D in C){const I=C[D];for(const F in I)h(I[F].object),delete I[F];delete C[D]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const C=n[S.id];for(const D in C){const I=C[D];for(const F in I)h(I[F].object),delete I[F];delete C[D]}delete n[S.id]}function E(S){for(const C in n){const D=n[C];if(D[S.id]===void 0)continue;const I=D[S.id];for(const F in I)h(I[F].object),delete I[F];delete D[S.id]}}function R(){b(),o=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:b,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function l0(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),e.update(h,n,f))}function a(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let d=0;for(let g=0;g<f;g++)d+=h[g];e.update(d,n,1)}function c(l,h,f,u){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)o(l[g],h[g],u[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,f);let g=0;for(let _=0;_<f;_++)g+=h[_]*u[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function u0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==sn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const R=E===dr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==wn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Ln&&!R)}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:M,maxSamples:T}}function h0(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Yn,a=new zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const y=r?0:n,x=y*4;let v=p.clippingState||null;c.value=v,v=h(g,u,x,d);for(let M=0;M!==x;++M)v[M]=e[M];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=d+_*4,y=u.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=d;x!==_;++x,v+=4)o.copy(f[x]).applyMatrix4(y,a),o.normal.toArray(m,v),m[v+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function f0(i){let t=new WeakMap;function e(o,a){return a===sr?o.mapping=Ss:a===sc&&(o.mapping=bs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===sr||a===sc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new rp(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const gs=4,mu=[.125,.215,.35,.446,.526,.582],Li=20,da=new pf,gu=new Ut;let pa=null,ma=0,ga=0,_a=!1;const Ci=(1+Math.sqrt(5))/2,es=1/Ci,_u=[new P(-Ci,es,0),new P(Ci,es,0),new P(-es,0,Ci),new P(es,0,Ci),new P(0,Ci,-es),new P(0,Ci,es),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],d0=new P;class vu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=d0}=r;pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel(),_a=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(pa,ma,ga),this._renderer.xr.enabled=_a,t.scissorTest=!1,zr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ss||t.mapping===bs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel(),_a=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:hn,minFilter:hn,generateMipmaps:!1,type:dr,format:sn,colorSpace:Es,depthBuffer:!1},s=xu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xu(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=p0(r)),this._blurMaterial=m0(r,t,e)}return s}_compileMaterial(t){const e=new We(this._lodPlanes[0],t);this._renderer.compile(e,da)}_sceneToCubeUV(t,e,n,s,r){const c=new en(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(gu),f.toneMapping=hi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null));const _=new Po({name:"PMREM.Background",side:Oe,depthWrite:!1,depthTest:!1}),m=new We(new Zn,_);let p=!1;const y=t.background;y?y.isColor&&(_.color.copy(y),t.background=null,p=!0):(_.color.copy(gu),p=!0);for(let x=0;x<6;x++){const v=x%3;v===0?(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[x],r.y,r.z)):v===1?(c.up.set(0,0,l[x]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[x],r.z)):(c.up.set(0,l[x],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[x]));const M=this._cubeSize;zr(s,v*M,x>2?M:0,M,M),f.setRenderTarget(s),p&&f.render(m,c),f.render(t,c)}m.geometry.dispose(),m.material.dispose(),f.toneMapping=d,f.autoClear=u,t.background=y}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ss||t.mapping===bs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mu()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new We(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;zr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,da)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=_u[(s-r-1)%_u.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new We(this._lodPlanes[s],l),u=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Li-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Li;m>Li&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Li}`);const p=[];let y=0;for(let E=0;E<Li;++E){const R=E/_,b=Math.exp(-R*R/2);p.push(b),E===0?y+=b:E<m&&(y+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/y;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:x}=this;u.dTheta.value=g,u.mipInt.value=x-n;const v=this._sizeLods[s],M=3*v*(s>x-gs?s-x+gs:0),T=4*(this._cubeSize-v);zr(e,M,T,3*v,2*v),c.setRenderTarget(e),c.render(f,da)}}function p0(i){const t=[],e=[],n=[];let s=i;const r=i-gs+1+mu.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-gs?c=mu[o-i+gs-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,f=1+l,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*d),x=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let T=0;T<d;T++){const E=T%3*2/3-1,R=T>2?0:-1,b=[E,R,0,E+2/3,R,0,E+2/3,R+1,0,E,R,0,E+2/3,R+1,0,E,R+1,0];y.set(b,_*g*T),x.set(u,m*g*T);const S=[T,T,T,T,T,T];v.set(S,p*g*T)}const M=new Ke;M.setAttribute("position",new ge(y,_)),M.setAttribute("uv",new ge(x,m)),M.setAttribute("faceIndex",new ge(v,p)),t.push(M),s>gs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function xu(i,t,e){const n=new Fi(i,t,e);return n.texture.mapping=Co,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function zr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function m0(i,t,e){const n=new Float32Array(Li),s=new P(0,1,0);return new dn({name:"SphericalGaussianBlur",defines:{n:Li,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ml(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function yu(){return new dn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ml(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Mu(){return new dn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ml(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ui,depthTest:!1,depthWrite:!1})}function Ml(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function g0(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===sr||c===sc,h=c===Ss||c===bs;if(l||h){let f=t.get(a);const u=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new vu(i)),f=l?e.fromEquirectangular(a,f):e.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),f.texture;if(f!==void 0)return f.texture;{const d=a.image;return l&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new vu(i)),f=l?e.fromEquirectangular(a):e.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),a.addEventListener("dispose",r),f.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function _0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&lr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function v0(i,t,e,n){const s={},r=new WeakMap;function o(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];const d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function c(f){const u=f.attributes;for(const d in u)t.update(u[d],i.ARRAY_BUFFER)}function l(f){const u=[],d=f.index,g=f.attributes.position;let _=0;if(d!==null){const y=d.array;_=d.version;for(let x=0,v=y.length;x<v;x+=3){const M=y[x+0],T=y[x+1],E=y[x+2];u.push(M,T,T,E,E,M)}}else if(g!==void 0){const y=g.array;_=g.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const M=x+0,T=x+1,E=x+2;u.push(M,T,T,E,E,M)}}else return;const m=new(Qh(u)?sf:nf)(u,1);m.version=_;const p=r.get(f);p&&t.remove(p),r.set(f,m)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&l(f)}else l(f);return r.get(f)}return{get:a,update:c,getWireframeAttribute:h}}function x0(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function c(u,d){i.drawElements(n,d,r,u*o),e.update(d,n,1)}function l(u,d,g){g!==0&&(i.drawElementsInstanced(n,d,r,u*o,g),e.update(d,n,g))}function h(u,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}function f(u,d,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/o,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,u,0,_,0,g);let p=0;for(let y=0;y<g;y++)p+=d[y]*_[y];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function y0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function M0(i,t,e){const n=new WeakMap,s=new te;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==f){let S=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",S)};var d=S;u!==void 0&&u.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let M=a.attributes.position.count*v,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const E=new Float32Array(M*T*4*f),R=new gl(E,M,T,f);R.type=Ln,R.needsUpdate=!0;const b=v*4;for(let C=0;C<f;C++){const D=p[C],I=y[C],F=x[C],k=M*T*4*C;for(let H=0;H<D.count;H++){const $=H*b;g===!0&&(s.fromBufferAttribute(D,H),E[k+$+0]=s.x,E[k+$+1]=s.y,E[k+$+2]=s.z,E[k+$+3]=0),_===!0&&(s.fromBufferAttribute(I,H),E[k+$+4]=s.x,E[k+$+5]=s.y,E[k+$+6]=s.z,E[k+$+7]=0),m===!0&&(s.fromBufferAttribute(F,H),E[k+$+8]=s.x,E[k+$+9]=s.y,E[k+$+10]=s.z,E[k+$+11]=F.itemSize===4?s.w:1)}}u={count:f,texture:R,size:new Ot(M,T)},n.set(a,u),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function S0(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,f=t.get(c,h);if(s.get(f)!==l&&(t.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return f}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}const gf=new ze,Su=new hf(1,1),_f=new gl,vf=new Vd,xf=new af,bu=[],Eu=[],wu=new Float32Array(16),Tu=new Float32Array(9),Au=new Float32Array(4);function Ls(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=bu[s];if(r===void 0&&(r=new Float32Array(s),bu[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Te(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Lo(i,t){let e=Eu[t];e===void 0&&(e=new Int32Array(t),Eu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function b0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function E0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function w0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function T0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function A0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Au.set(n),i.uniformMatrix2fv(this.addr,!1,Au),Ae(e,n)}}function R0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;Tu.set(n),i.uniformMatrix3fv(this.addr,!1,Tu),Ae(e,n)}}function C0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Te(e,n))return;wu.set(n),i.uniformMatrix4fv(this.addr,!1,wu),Ae(e,n)}}function P0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function L0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function D0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function U0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function I0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function N0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function F0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function B0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function O0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Su.compareFunction=Jh,r=Su):r=gf,e.setTexture2D(t||r,s)}function z0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||vf,s)}function k0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||xf,s)}function H0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||_f,s)}function V0(i){switch(i){case 5126:return b0;case 35664:return E0;case 35665:return w0;case 35666:return T0;case 35674:return A0;case 35675:return R0;case 35676:return C0;case 5124:case 35670:return P0;case 35667:case 35671:return L0;case 35668:case 35672:return D0;case 35669:case 35673:return U0;case 5125:return I0;case 36294:return N0;case 36295:return F0;case 36296:return B0;case 35678:case 36198:case 36298:case 36306:case 35682:return O0;case 35679:case 36299:case 36307:return z0;case 35680:case 36300:case 36308:case 36293:return k0;case 36289:case 36303:case 36311:case 36292:return H0}}function G0(i,t){i.uniform1fv(this.addr,t)}function W0(i,t){const e=Ls(t,this.size,2);i.uniform2fv(this.addr,e)}function X0(i,t){const e=Ls(t,this.size,3);i.uniform3fv(this.addr,e)}function q0(i,t){const e=Ls(t,this.size,4);i.uniform4fv(this.addr,e)}function Y0(i,t){const e=Ls(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function $0(i,t){const e=Ls(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function j0(i,t){const e=Ls(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function K0(i,t){i.uniform1iv(this.addr,t)}function Z0(i,t){i.uniform2iv(this.addr,t)}function J0(i,t){i.uniform3iv(this.addr,t)}function Q0(i,t){i.uniform4iv(this.addr,t)}function t_(i,t){i.uniform1uiv(this.addr,t)}function e_(i,t){i.uniform2uiv(this.addr,t)}function n_(i,t){i.uniform3uiv(this.addr,t)}function i_(i,t){i.uniform4uiv(this.addr,t)}function s_(i,t,e){const n=this.cache,s=t.length,r=Lo(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||gf,r[o])}function r_(i,t,e){const n=this.cache,s=t.length,r=Lo(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||vf,r[o])}function o_(i,t,e){const n=this.cache,s=t.length,r=Lo(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||xf,r[o])}function a_(i,t,e){const n=this.cache,s=t.length,r=Lo(e,s);Te(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||_f,r[o])}function c_(i){switch(i){case 5126:return G0;case 35664:return W0;case 35665:return X0;case 35666:return q0;case 35674:return Y0;case 35675:return $0;case 35676:return j0;case 5124:case 35670:return K0;case 35667:case 35671:return Z0;case 35668:case 35672:return J0;case 35669:case 35673:return Q0;case 5125:return t_;case 36294:return e_;case 36295:return n_;case 36296:return i_;case 35678:case 36198:case 36298:case 36306:case 35682:return s_;case 35679:case 36299:case 36307:return r_;case 35680:case 36300:case 36308:case 36293:return o_;case 36289:case 36303:case 36311:case 36292:return a_}}class l_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=V0(e.type)}}class u_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=c_(e.type)}}class h_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const va=/(\w+)(\])?(\[|\.)?/g;function Ru(i,t){i.seq.push(t),i.map[t.id]=t}function f_(i,t,e){const n=i.name,s=n.length;for(va.lastIndex=0;;){const r=va.exec(n),o=va.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Ru(e,l===void 0?new l_(a,i,t):new u_(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new h_(a),Ru(e,f)),e=f}}}class _o{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);f_(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Cu(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const d_=37297;let p_=0;function m_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Pu=new zt;function g_(i){$t._getMatrix(Pu,$t.workingColorSpace,i);const t=`mat3( ${Pu.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(i)){case So:return[t,"LinearTransferOETF"];case Jt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Lu(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+m_(i.getShaderSource(t),a)}else return r}function __(i,t){const e=g_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function v_(i,t){let e;switch(t){case gd:e="Linear";break;case _d:e="Reinhard";break;case vd:e="Cineon";break;case xd:e="ACESFilmic";break;case Md:e="AgX";break;case Sd:e="Neutral";break;case yd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const kr=new P;function x_(){$t.getLuminanceCoefficients(kr);const i=kr.x.toFixed(4),t=kr.y.toFixed(4),e=kr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function y_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Js).join(`
`)}function M_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function S_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Js(i){return i!==""}function Du(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Uu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const b_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bc(i){return i.replace(b_,w_)}const E_=new Map;function w_(i,t){let e=Bt[t];if(e===void 0){const n=E_.get(t);if(n!==void 0)e=Bt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Bc(e)}const T_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Iu(i){return i.replace(T_,A_)}function A_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nu(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function R_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Hh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Zf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Xn&&(t="SHADOWMAP_TYPE_VSM"),t}function C_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ss:case bs:t="ENVMAP_TYPE_CUBE";break;case Co:t="ENVMAP_TYPE_CUBE_UV";break}return t}function P_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case bs:t="ENVMAP_MODE_REFRACTION";break}return t}function L_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ol:t="ENVMAP_BLENDING_MULTIPLY";break;case pd:t="ENVMAP_BLENDING_MIX";break;case md:t="ENVMAP_BLENDING_ADD";break}return t}function D_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function U_(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=R_(e),l=C_(e),h=P_(e),f=L_(e),u=D_(e),d=y_(e),g=M_(r),_=s.createProgram();let m,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Js).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Js).join(`
`),p.length>0&&(p+=`
`)):(m=[Nu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Js).join(`
`),p=[Nu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hi?"#define TONE_MAPPING":"",e.toneMapping!==hi?Bt.tonemapping_pars_fragment:"",e.toneMapping!==hi?v_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Bt.colorspace_pars_fragment,__("linearToOutputTexel",e.outputColorSpace),x_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Js).join(`
`)),o=Bc(o),o=Du(o,e),o=Uu(o,e),a=Bc(a),a=Du(a,e),a=Uu(a,e),o=Iu(o),a=Iu(a),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Wl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+m+o,v=y+p+a,M=Cu(s,s.VERTEX_SHADER,x),T=Cu(s,s.FRAGMENT_SHADER,v);s.attachShader(_,M),s.attachShader(_,T),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function E(C){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(_)||"",I=s.getShaderInfoLog(M)||"",F=s.getShaderInfoLog(T)||"",k=D.trim(),H=I.trim(),$=F.trim();let G=!0,st=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,M,T);else{const at=Lu(s,M,"vertex"),Mt=Lu(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+at+`
`+Mt)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(H===""||$==="")&&(st=!1);st&&(C.diagnostics={runnable:G,programLog:k,vertexShader:{log:H,prefix:m},fragmentShader:{log:$,prefix:p}})}s.deleteShader(M),s.deleteShader(T),R=new _o(s,_),b=S_(s,_)}let R;this.getUniforms=function(){return R===void 0&&E(this),R};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,d_)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=p_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=M,this.fragmentShader=T,this}let I_=0;class N_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new F_(t),e.set(t,n)),n}}class F_{constructor(t){this.id=I_++,this.code=t,this.usedTimes=0}}function B_(i,t,e,n,s,r,o){const a=new tf,c=new N_,l=new Set,h=[],f=s.logarithmicDepthBuffer,u=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,S,C,D,I){const F=D.fog,k=I.geometry,H=b.isMeshStandardMaterial?D.environment:null,$=(b.isMeshStandardMaterial?e:t).get(b.envMap||H),G=$&&$.mapping===Co?$.image.height:null,st=g[b.type];b.precision!==null&&(d=s.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const at=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Mt=at!==void 0?at.length:0;let pt=0;k.morphAttributes.position!==void 0&&(pt=1),k.morphAttributes.normal!==void 0&&(pt=2),k.morphAttributes.color!==void 0&&(pt=3);let Vt,Xt,Nt,Y;if(st){const jt=Rn[st];Vt=jt.vertexShader,Xt=jt.fragmentShader}else Vt=b.vertexShader,Xt=b.fragmentShader,c.update(b),Nt=c.getVertexShaderID(b),Y=c.getFragmentShaderID(b);const K=i.getRenderTarget(),ft=i.state.buffers.depth.getReversed(),Tt=I.isInstancedMesh===!0,gt=I.isBatchedMesh===!0,Ht=!!b.map,ie=!!b.matcap,U=!!$,ee=!!b.aoMap,Rt=!!b.lightMap,wt=!!b.bumpMap,dt=!!b.normalMap,Kt=!!b.displacementMap,_t=!!b.emissiveMap,It=!!b.metalnessMap,me=!!b.roughnessMap,re=b.anisotropy>0,L=b.clearcoat>0,w=b.dispersion>0,z=b.iridescence>0,X=b.sheen>0,Z=b.transmission>0,q=re&&!!b.anisotropyMap,St=L&&!!b.clearcoatMap,et=L&&!!b.clearcoatNormalMap,vt=L&&!!b.clearcoatRoughnessMap,xt=z&&!!b.iridescenceMap,Q=z&&!!b.iridescenceThicknessMap,ct=X&&!!b.sheenColorMap,lt=X&&!!b.sheenRoughnessMap,ht=!!b.specularMap,it=!!b.specularColorMap,Lt=!!b.specularIntensityMap,N=Z&&!!b.transmissionMap,nt=Z&&!!b.thicknessMap,rt=!!b.gradientMap,yt=!!b.alphaMap,J=b.alphaTest>0,j=!!b.alphaHash,Et=!!b.extensions;let Ft=hi;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Ft=i.toneMapping);const se={shaderID:st,shaderType:b.type,shaderName:b.name,vertexShader:Vt,fragmentShader:Xt,defines:b.defines,customVertexShaderID:Nt,customFragmentShaderID:Y,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:gt,batchingColor:gt&&I._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&I.instanceColor!==null,instancingMorph:Tt&&I.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Es,alphaToCoverage:!!b.alphaToCoverage,map:Ht,matcap:ie,envMap:U,envMapMode:U&&$.mapping,envMapCubeUVHeight:G,aoMap:ee,lightMap:Rt,bumpMap:wt,normalMap:dt,displacementMap:u&&Kt,emissiveMap:_t,normalMapObjectSpace:dt&&b.normalMapType===Td,normalMapTangentSpace:dt&&b.normalMapType===Zh,metalnessMap:It,roughnessMap:me,anisotropy:re,anisotropyMap:q,clearcoat:L,clearcoatMap:St,clearcoatNormalMap:et,clearcoatRoughnessMap:vt,dispersion:w,iridescence:z,iridescenceMap:xt,iridescenceThicknessMap:Q,sheen:X,sheenColorMap:ct,sheenRoughnessMap:lt,specularMap:ht,specularColorMap:it,specularIntensityMap:Lt,transmission:Z,transmissionMap:N,thicknessMap:nt,gradientMap:rt,opaque:b.transparent===!1&&b.blending===xs&&b.alphaToCoverage===!1,alphaMap:yt,alphaTest:J,alphaHash:j,combine:b.combine,mapUv:Ht&&_(b.map.channel),aoMapUv:ee&&_(b.aoMap.channel),lightMapUv:Rt&&_(b.lightMap.channel),bumpMapUv:wt&&_(b.bumpMap.channel),normalMapUv:dt&&_(b.normalMap.channel),displacementMapUv:Kt&&_(b.displacementMap.channel),emissiveMapUv:_t&&_(b.emissiveMap.channel),metalnessMapUv:It&&_(b.metalnessMap.channel),roughnessMapUv:me&&_(b.roughnessMap.channel),anisotropyMapUv:q&&_(b.anisotropyMap.channel),clearcoatMapUv:St&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:et&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:lt&&_(b.sheenRoughnessMap.channel),specularMapUv:ht&&_(b.specularMap.channel),specularColorMapUv:it&&_(b.specularColorMap.channel),specularIntensityMapUv:Lt&&_(b.specularIntensityMap.channel),transmissionMapUv:N&&_(b.transmissionMap.channel),thicknessMapUv:nt&&_(b.thicknessMap.channel),alphaMapUv:yt&&_(b.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(dt||re),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!k.attributes.uv&&(Ht||yt),fog:!!F,useFog:b.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ft,skinning:I.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:Mt,morphTextureStride:pt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ft,decodeVideoTexture:Ht&&b.map.isVideoTexture===!0&&$t.getTransfer(b.map.colorSpace)===Jt,decodeVideoTextureEmissive:_t&&b.emissiveMap.isVideoTexture===!0&&$t.getTransfer(b.emissiveMap.colorSpace)===Jt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===un,flipSided:b.side===Oe,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Et&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Et&&b.extensions.multiDraw===!0||gt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return se.vertexUv1s=l.has(1),se.vertexUv2s=l.has(2),se.vertexUv3s=l.has(3),l.clear(),se}function p(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)S.push(C),S.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(y(S,b),x(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function y(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function x(b,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),b.push(a.mask)}function v(b){const S=g[b.type];let C;if(S){const D=Rn[S];C=ep.clone(D.uniforms)}else C=b.uniforms;return C}function M(b,S){let C;for(let D=0,I=h.length;D<I;D++){const F=h[D];if(F.cacheKey===S){C=F,++C.usedTimes;break}}return C===void 0&&(C=new U_(i,S,b,r),h.push(C)),C}function T(b){if(--b.usedTimes===0){const S=h.indexOf(b);h[S]=h[h.length-1],h.pop(),b.destroy()}}function E(b){c.remove(b)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:M,releaseProgram:T,releaseShaderCache:E,programs:h,dispose:R}}function O_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function z_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Fu(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Bu(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(f,u,d,g,_,m){let p=i[t];return p===void 0?(p={id:f.id,object:f,geometry:u,material:d,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},i[t]=p):(p.id=f.id,p.object=f,p.geometry=u,p.material=d,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function a(f,u,d,g,_,m){const p=o(f,u,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function c(f,u,d,g,_,m){const p=o(f,u,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function l(f,u){e.length>1&&e.sort(f||z_),n.length>1&&n.sort(u||Fu),s.length>1&&s.sort(u||Fu)}function h(){for(let f=t,u=i.length;f<u;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function k_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Bu,i.set(n,[o])):s>=r.length?(o=new Bu,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function H_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Ut};break;case"SpotLight":e={position:new P,direction:new P,color:new Ut,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Ut,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Ut,groundColor:new Ut};break;case"RectAreaLight":e={color:new Ut,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function V_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let G_=0;function W_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function X_(i){const t=new H_,e=V_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);const s=new P,r=new Wt,o=new Wt;function a(l){let h=0,f=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,y=0,x=0,v=0,M=0,T=0,E=0;l.sort(W_);for(let b=0,S=l.length;b<S;b++){const C=l[b],D=C.color,I=C.intensity,F=C.distance,k=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=D.r*I,f+=D.g*I,u+=D.b*I;else if(C.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(C.sh.coefficients[H],I);E++}else if(C.isDirectionalLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const $=C.shadow,G=e.get(C);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,n.directionalShadow[d]=G,n.directionalShadowMap[d]=k,n.directionalShadowMatrix[d]=C.shadow.matrix,y++}n.directional[d]=H,d++}else if(C.isSpotLight){const H=t.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(D).multiplyScalar(I),H.distance=F,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,n.spot[_]=H;const $=C.shadow;if(C.map&&(n.spotLightMap[M]=C.map,M++,$.updateMatrices(C),C.castShadow&&T++),n.spotLightMatrix[_]=$.matrix,C.castShadow){const G=e.get(C);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=k,v++}_++}else if(C.isRectAreaLight){const H=t.get(C);H.color.copy(D).multiplyScalar(I),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=H,m++}else if(C.isPointLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const $=C.shadow,G=e.get(C);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,G.shadowCameraNear=$.camera.near,G.shadowCameraFar=$.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=C.shadow.matrix,x++}n.point[g]=H,g++}else if(C.isHemisphereLight){const H=t.get(C);H.skyColor.copy(C.color).multiplyScalar(I),H.groundColor.copy(C.groundColor).multiplyScalar(I),n.hemi[p]=H,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ot.LTC_FLOAT_1,n.rectAreaLTC2=ot.LTC_FLOAT_2):(n.rectAreaLTC1=ot.LTC_HALF_1,n.rectAreaLTC2=ot.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const R=n.hash;(R.directionalLength!==d||R.pointLength!==g||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==y||R.numPointShadows!==x||R.numSpotShadows!==v||R.numSpotMaps!==M||R.numLightProbes!==E)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=v+M-T,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=E,R.directionalLength=d,R.pointLength=g,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=y,R.numPointShadows=x,R.numSpotShadows=v,R.numSpotMaps=M,R.numLightProbes=E,n.version=G_++)}function c(l,h){let f=0,u=0,d=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,y=l.length;p<y;p++){const x=l[p];if(x.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(x.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(x.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const v=n.point[u];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),u++}else if(x.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function Ou(i){const t=new X_(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function q_(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Ou(i),t.set(s,[a])):r>=o.length?(a=new Ou(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const Y_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function j_(i,t,e){let n=new _l;const s=new Ot,r=new Ot,o=new te,a=new dp({depthPacking:wd}),c=new pp,l={},h=e.maxTextureSize,f={[En]:Oe,[Oe]:En,[un]:un},u=new dn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ot},radius:{value:4}},vertexShader:Y_,fragmentShader:$_}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ke;g.setAttribute("position",new ge(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new We(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hh;let p=this.type;this.render=function(T,E,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),D=i.state;D.setBlending(ui),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const I=p!==Xn&&this.type===Xn,F=p===Xn&&this.type!==Xn;for(let k=0,H=T.length;k<H;k++){const $=T[k],G=$.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const st=G.getFrameExtents();if(s.multiply(st),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/st.x),s.x=r.x*st.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/st.y),s.y=r.y*st.y,G.mapSize.y=r.y)),G.map===null||I===!0||F===!0){const Mt=this.type!==Xn?{minFilter:Xe,magFilter:Xe}:{};G.map!==null&&G.map.dispose(),G.map=new Fi(s.x,s.y,Mt),G.map.texture.name=$.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const at=G.getViewportCount();for(let Mt=0;Mt<at;Mt++){const pt=G.getViewport(Mt);o.set(r.x*pt.x,r.y*pt.y,r.x*pt.z,r.y*pt.w),D.viewport(o),G.updateMatrices($,Mt),n=G.getFrustum(),v(E,R,G.camera,$,this.type)}G.isPointLightShadow!==!0&&this.type===Xn&&y(G,R),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,S,C)};function y(T,E){const R=t.update(_);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Fi(s.x,s.y)),u.uniforms.shadow_pass.value=T.map.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(E,null,R,u,_,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(E,null,R,d,_,null)}function x(T,E,R,b){let S=null;const C=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)S=C;else if(S=R.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){const D=S.uuid,I=E.uuid;let F=l[D];F===void 0&&(F={},l[D]=F);let k=F[I];k===void 0&&(k=S.clone(),F[I]=k,E.addEventListener("dispose",M)),S=k}if(S.visible=E.visible,S.wireframe=E.wireframe,b===Xn?S.side=E.shadowSide!==null?E.shadowSide:E.side:S.side=E.shadowSide!==null?E.shadowSide:f[E.side],S.alphaMap=E.alphaMap,S.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,S.map=E.map,S.clipShadows=E.clipShadows,S.clippingPlanes=E.clippingPlanes,S.clipIntersection=E.clipIntersection,S.displacementMap=E.displacementMap,S.displacementScale=E.displacementScale,S.displacementBias=E.displacementBias,S.wireframeLinewidth=E.wireframeLinewidth,S.linewidth=E.linewidth,R.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const D=i.properties.get(S);D.light=R}return S}function v(T,E,R,b,S){if(T.visible===!1)return;if(T.layers.test(E.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===Xn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const I=t.update(T),F=T.material;if(Array.isArray(F)){const k=I.groups;for(let H=0,$=k.length;H<$;H++){const G=k[H],st=F[G.materialIndex];if(st&&st.visible){const at=x(T,st,b,S);T.onBeforeShadow(i,T,E,R,I,at,G),i.renderBufferDirect(R,null,I,at,T,G),T.onAfterShadow(i,T,E,R,I,at,G)}}}else if(F.visible){const k=x(T,F,b,S);T.onBeforeShadow(i,T,E,R,I,k,null),i.renderBufferDirect(R,null,I,k,T,null),T.onAfterShadow(i,T,E,R,I,k,null)}}const D=T.children;for(let I=0,F=D.length;I<F;I++)v(D[I],E,R,b,S)}function M(T){T.target.removeEventListener("dispose",M);for(const R in l){const b=l[R],S=T.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const K_={[Za]:Ja,[Qa]:nc,[tc]:ic,[Ms]:ec,[Ja]:Za,[nc]:Qa,[ic]:tc,[ec]:Ms};function Z_(i,t){function e(){let N=!1;const nt=new te;let rt=null;const yt=new te(0,0,0,0);return{setMask:function(J){rt!==J&&!N&&(i.colorMask(J,J,J,J),rt=J)},setLocked:function(J){N=J},setClear:function(J,j,Et,Ft,se){se===!0&&(J*=Ft,j*=Ft,Et*=Ft),nt.set(J,j,Et,Ft),yt.equals(nt)===!1&&(i.clearColor(J,j,Et,Ft),yt.copy(nt))},reset:function(){N=!1,rt=null,yt.set(-1,0,0,0)}}}function n(){let N=!1,nt=!1,rt=null,yt=null,J=null;return{setReversed:function(j){if(nt!==j){const Et=t.get("EXT_clip_control");j?Et.clipControlEXT(Et.LOWER_LEFT_EXT,Et.ZERO_TO_ONE_EXT):Et.clipControlEXT(Et.LOWER_LEFT_EXT,Et.NEGATIVE_ONE_TO_ONE_EXT),nt=j;const Ft=J;J=null,this.setClear(Ft)}},getReversed:function(){return nt},setTest:function(j){j?K(i.DEPTH_TEST):ft(i.DEPTH_TEST)},setMask:function(j){rt!==j&&!N&&(i.depthMask(j),rt=j)},setFunc:function(j){if(nt&&(j=K_[j]),yt!==j){switch(j){case Za:i.depthFunc(i.NEVER);break;case Ja:i.depthFunc(i.ALWAYS);break;case Qa:i.depthFunc(i.LESS);break;case Ms:i.depthFunc(i.LEQUAL);break;case tc:i.depthFunc(i.EQUAL);break;case ec:i.depthFunc(i.GEQUAL);break;case nc:i.depthFunc(i.GREATER);break;case ic:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}yt=j}},setLocked:function(j){N=j},setClear:function(j){J!==j&&(nt&&(j=1-j),i.clearDepth(j),J=j)},reset:function(){N=!1,rt=null,yt=null,J=null,nt=!1}}}function s(){let N=!1,nt=null,rt=null,yt=null,J=null,j=null,Et=null,Ft=null,se=null;return{setTest:function(jt){N||(jt?K(i.STENCIL_TEST):ft(i.STENCIL_TEST))},setMask:function(jt){nt!==jt&&!N&&(i.stencilMask(jt),nt=jt)},setFunc:function(jt,Bn,Tn){(rt!==jt||yt!==Bn||J!==Tn)&&(i.stencilFunc(jt,Bn,Tn),rt=jt,yt=Bn,J=Tn)},setOp:function(jt,Bn,Tn){(j!==jt||Et!==Bn||Ft!==Tn)&&(i.stencilOp(jt,Bn,Tn),j=jt,Et=Bn,Ft=Tn)},setLocked:function(jt){N=jt},setClear:function(jt){se!==jt&&(i.clearStencil(jt),se=jt)},reset:function(){N=!1,nt=null,rt=null,yt=null,J=null,j=null,Et=null,Ft=null,se=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},f={},u=new WeakMap,d=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,M=null,T=null,E=new Ut(0,0,0),R=0,b=!1,S=null,C=null,D=null,I=null,F=null;const k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,$=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(G)[1]),H=$>=1):G.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),H=$>=2);let st=null,at={};const Mt=i.getParameter(i.SCISSOR_BOX),pt=i.getParameter(i.VIEWPORT),Vt=new te().fromArray(Mt),Xt=new te().fromArray(pt);function Nt(N,nt,rt,yt){const J=new Uint8Array(4),j=i.createTexture();i.bindTexture(N,j),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Et=0;Et<rt;Et++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(nt,0,i.RGBA,1,1,yt,0,i.RGBA,i.UNSIGNED_BYTE,J):i.texImage2D(nt+Et,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,J);return j}const Y={};Y[i.TEXTURE_2D]=Nt(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(i.DEPTH_TEST),o.setFunc(Ms),wt(!1),dt(kl),K(i.CULL_FACE),ee(ui);function K(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function ft(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Tt(N,nt){return f[N]!==nt?(i.bindFramebuffer(N,nt),f[N]=nt,N===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=nt),N===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=nt),!0):!1}function gt(N,nt){let rt=d,yt=!1;if(N){rt=u.get(nt),rt===void 0&&(rt=[],u.set(nt,rt));const J=N.textures;if(rt.length!==J.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Et=J.length;j<Et;j++)rt[j]=i.COLOR_ATTACHMENT0+j;rt.length=J.length,yt=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,yt=!0);yt&&i.drawBuffers(rt)}function Ht(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const ie={[Pi]:i.FUNC_ADD,[Jf]:i.FUNC_SUBTRACT,[Qf]:i.FUNC_REVERSE_SUBTRACT};ie[td]=i.MIN,ie[ed]=i.MAX;const U={[nd]:i.ZERO,[ja]:i.ONE,[id]:i.SRC_COLOR,[Ka]:i.SRC_ALPHA,[ld]:i.SRC_ALPHA_SATURATE,[ad]:i.DST_COLOR,[rd]:i.DST_ALPHA,[sd]:i.ONE_MINUS_SRC_COLOR,[ir]:i.ONE_MINUS_SRC_ALPHA,[cd]:i.ONE_MINUS_DST_COLOR,[od]:i.ONE_MINUS_DST_ALPHA,[ud]:i.CONSTANT_COLOR,[hd]:i.ONE_MINUS_CONSTANT_COLOR,[fd]:i.CONSTANT_ALPHA,[dd]:i.ONE_MINUS_CONSTANT_ALPHA};function ee(N,nt,rt,yt,J,j,Et,Ft,se,jt){if(N===ui){_===!0&&(ft(i.BLEND),_=!1);return}if(_===!1&&(K(i.BLEND),_=!0),N!==Vh){if(N!==m||jt!==b){if((p!==Pi||v!==Pi)&&(i.blendEquation(i.FUNC_ADD),p=Pi,v=Pi),jt)switch(N){case xs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case nr:i.blendFunc(i.ONE,i.ONE);break;case Hl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Vl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case xs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case nr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Hl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Vl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}y=null,x=null,M=null,T=null,E.set(0,0,0),R=0,m=N,b=jt}return}J=J||nt,j=j||rt,Et=Et||yt,(nt!==p||J!==v)&&(i.blendEquationSeparate(ie[nt],ie[J]),p=nt,v=J),(rt!==y||yt!==x||j!==M||Et!==T)&&(i.blendFuncSeparate(U[rt],U[yt],U[j],U[Et]),y=rt,x=yt,M=j,T=Et),(Ft.equals(E)===!1||se!==R)&&(i.blendColor(Ft.r,Ft.g,Ft.b,se),E.copy(Ft),R=se),m=N,b=!1}function Rt(N,nt){N.side===un?ft(i.CULL_FACE):K(i.CULL_FACE);let rt=N.side===Oe;nt&&(rt=!rt),wt(rt),N.blending===xs&&N.transparent===!1?ee(ui):ee(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);const yt=N.stencilWrite;a.setTest(yt),yt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),_t(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):ft(i.SAMPLE_ALPHA_TO_COVERAGE)}function wt(N){S!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),S=N)}function dt(N){N!==jf?(K(i.CULL_FACE),N!==C&&(N===kl?i.cullFace(i.BACK):N===Kf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ft(i.CULL_FACE),C=N}function Kt(N){N!==D&&(H&&i.lineWidth(N),D=N)}function _t(N,nt,rt){N?(K(i.POLYGON_OFFSET_FILL),(I!==nt||F!==rt)&&(i.polygonOffset(nt,rt),I=nt,F=rt)):ft(i.POLYGON_OFFSET_FILL)}function It(N){N?K(i.SCISSOR_TEST):ft(i.SCISSOR_TEST)}function me(N){N===void 0&&(N=i.TEXTURE0+k-1),st!==N&&(i.activeTexture(N),st=N)}function re(N,nt,rt){rt===void 0&&(st===null?rt=i.TEXTURE0+k-1:rt=st);let yt=at[rt];yt===void 0&&(yt={type:void 0,texture:void 0},at[rt]=yt),(yt.type!==N||yt.texture!==nt)&&(st!==rt&&(i.activeTexture(rt),st=rt),i.bindTexture(N,nt||Y[N]),yt.type=N,yt.texture=nt)}function L(){const N=at[st];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function w(){try{i.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function z(){try{i.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function X(){try{i.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Z(){try{i.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function q(){try{i.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{i.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function et(){try{i.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function vt(){try{i.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xt(){try{i.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{i.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ct(N){Vt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Vt.copy(N))}function lt(N){Xt.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),Xt.copy(N))}function ht(N,nt){let rt=l.get(nt);rt===void 0&&(rt=new WeakMap,l.set(nt,rt));let yt=rt.get(N);yt===void 0&&(yt=i.getUniformBlockIndex(nt,N.name),rt.set(N,yt))}function it(N,nt){const yt=l.get(nt).get(N);c.get(nt)!==yt&&(i.uniformBlockBinding(nt,yt,N.__bindingPointIndex),c.set(nt,yt))}function Lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},st=null,at={},f={},u=new WeakMap,d=[],g=null,_=!1,m=null,p=null,y=null,x=null,v=null,M=null,T=null,E=new Ut(0,0,0),R=0,b=!1,S=null,C=null,D=null,I=null,F=null,Vt.set(0,0,i.canvas.width,i.canvas.height),Xt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:ft,bindFramebuffer:Tt,drawBuffers:gt,useProgram:Ht,setBlending:ee,setMaterial:Rt,setFlipSided:wt,setCullFace:dt,setLineWidth:Kt,setPolygonOffset:_t,setScissorTest:It,activeTexture:me,bindTexture:re,unbindTexture:L,compressedTexImage2D:w,compressedTexImage3D:z,texImage2D:xt,texImage3D:Q,updateUBOMapping:ht,uniformBlockBinding:it,texStorage2D:et,texStorage3D:vt,texSubImage2D:X,texSubImage3D:Z,compressedTexSubImage2D:q,compressedTexSubImage3D:St,scissor:ct,viewport:lt,reset:Lt}}function J_(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ot,h=new WeakMap;let f;const u=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,w){return d?new OffscreenCanvas(L,w):Eo("canvas")}function _(L,w,z){let X=1;const Z=re(L);if((Z.width>z||Z.height>z)&&(X=z/Math.max(Z.width,Z.height)),X<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const q=Math.floor(X*Z.width),St=Math.floor(X*Z.height);f===void 0&&(f=g(q,St));const et=w?g(q,St):f;return et.width=q,et.height=St,et.getContext("2d").drawImage(L,0,0,q,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+q+"x"+St+")."),et}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),L;return L}function m(L){return L.generateMipmaps}function p(L){i.generateMipmap(L)}function y(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(L,w,z,X,Z=!1){if(L!==null){if(i[L]!==void 0)return i[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let q=w;if(w===i.RED&&(z===i.FLOAT&&(q=i.R32F),z===i.HALF_FLOAT&&(q=i.R16F),z===i.UNSIGNED_BYTE&&(q=i.R8)),w===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(q=i.R8UI),z===i.UNSIGNED_SHORT&&(q=i.R16UI),z===i.UNSIGNED_INT&&(q=i.R32UI),z===i.BYTE&&(q=i.R8I),z===i.SHORT&&(q=i.R16I),z===i.INT&&(q=i.R32I)),w===i.RG&&(z===i.FLOAT&&(q=i.RG32F),z===i.HALF_FLOAT&&(q=i.RG16F),z===i.UNSIGNED_BYTE&&(q=i.RG8)),w===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(q=i.RG8UI),z===i.UNSIGNED_SHORT&&(q=i.RG16UI),z===i.UNSIGNED_INT&&(q=i.RG32UI),z===i.BYTE&&(q=i.RG8I),z===i.SHORT&&(q=i.RG16I),z===i.INT&&(q=i.RG32I)),w===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(q=i.RGB8UI),z===i.UNSIGNED_SHORT&&(q=i.RGB16UI),z===i.UNSIGNED_INT&&(q=i.RGB32UI),z===i.BYTE&&(q=i.RGB8I),z===i.SHORT&&(q=i.RGB16I),z===i.INT&&(q=i.RGB32I)),w===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),z===i.UNSIGNED_INT&&(q=i.RGBA32UI),z===i.BYTE&&(q=i.RGBA8I),z===i.SHORT&&(q=i.RGBA16I),z===i.INT&&(q=i.RGBA32I)),w===i.RGB&&(z===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(q=i.R11F_G11F_B10F)),w===i.RGBA){const St=Z?So:$t.getTransfer(X);z===i.FLOAT&&(q=i.RGBA32F),z===i.HALF_FLOAT&&(q=i.RGBA16F),z===i.UNSIGNED_BYTE&&(q=St===Jt?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function v(L,w){let z;return L?w===null||w===Ni||w===or?z=i.DEPTH24_STENCIL8:w===Ln?z=i.DEPTH32F_STENCIL8:w===rr&&(z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ni||w===or?z=i.DEPTH_COMPONENT24:w===Ln?z=i.DEPTH_COMPONENT32F:w===rr&&(z=i.DEPTH_COMPONENT16),z}function M(L,w){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==Xe&&L.minFilter!==hn?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function T(L){const w=L.target;w.removeEventListener("dispose",T),R(w),w.isVideoTexture&&h.delete(w)}function E(L){const w=L.target;w.removeEventListener("dispose",E),S(w)}function R(L){const w=n.get(L);if(w.__webglInit===void 0)return;const z=L.source,X=u.get(z);if(X){const Z=X[w.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&b(L),Object.keys(X).length===0&&u.delete(z)}n.remove(L)}function b(L){const w=n.get(L);i.deleteTexture(w.__webglTexture);const z=L.source,X=u.get(z);delete X[w.__cacheKey],o.memory.textures--}function S(L){const w=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(w.__webglFramebuffer[X]))for(let Z=0;Z<w.__webglFramebuffer[X].length;Z++)i.deleteFramebuffer(w.__webglFramebuffer[X][Z]);else i.deleteFramebuffer(w.__webglFramebuffer[X]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[X])}else{if(Array.isArray(w.__webglFramebuffer))for(let X=0;X<w.__webglFramebuffer.length;X++)i.deleteFramebuffer(w.__webglFramebuffer[X]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let X=0;X<w.__webglColorRenderbuffer.length;X++)w.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[X]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const z=L.textures;for(let X=0,Z=z.length;X<Z;X++){const q=n.get(z[X]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),o.memory.textures--),n.remove(z[X])}n.remove(L)}let C=0;function D(){C=0}function I(){const L=C;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),C+=1,L}function F(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function k(L,w){const z=n.get(L);if(L.isVideoTexture&&It(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&z.__version!==L.version){const X=L.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(z,L,w);return}}else L.isExternalTexture&&(z.__webglTexture=L.sourceTexture?L.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+w)}function H(L,w){const z=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&z.__version!==L.version){Y(z,L,w);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+w)}function $(L,w){const z=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&z.__version!==L.version){Y(z,L,w);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+w)}function G(L,w){const z=n.get(L);if(L.version>0&&z.__version!==L.version){K(z,L,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+w)}const st={[Ii]:i.REPEAT,[Ui]:i.CLAMP_TO_EDGE,[rc]:i.MIRRORED_REPEAT},at={[Xe]:i.NEAREST,[bd]:i.NEAREST_MIPMAP_NEAREST,[_r]:i.NEAREST_MIPMAP_LINEAR,[hn]:i.LINEAR,[zo]:i.LINEAR_MIPMAP_NEAREST,[ci]:i.LINEAR_MIPMAP_LINEAR},Mt={[Ad]:i.NEVER,[Ud]:i.ALWAYS,[Rd]:i.LESS,[Jh]:i.LEQUAL,[Cd]:i.EQUAL,[Dd]:i.GEQUAL,[Pd]:i.GREATER,[Ld]:i.NOTEQUAL};function pt(L,w){if(w.type===Ln&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===hn||w.magFilter===zo||w.magFilter===_r||w.magFilter===ci||w.minFilter===hn||w.minFilter===zo||w.minFilter===_r||w.minFilter===ci)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,st[w.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,st[w.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,st[w.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,at[w.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,at[w.minFilter]),w.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Mt[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Xe||w.minFilter!==_r&&w.minFilter!==ci||w.type===Ln&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(L,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Vt(L,w){let z=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",T));const X=w.source;let Z=u.get(X);Z===void 0&&(Z={},u.set(X,Z));const q=F(w);if(q!==L.__cacheKey){Z[q]===void 0&&(Z[q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),Z[q].usedTimes++;const St=Z[L.__cacheKey];St!==void 0&&(Z[L.__cacheKey].usedTimes--,St.usedTimes===0&&b(w)),L.__cacheKey=q,L.__webglTexture=Z[q].texture}return z}function Xt(L,w,z){return Math.floor(Math.floor(L/z)/w)}function Nt(L,w,z,X){const q=L.updateRanges;if(q.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,z,X,w.data);else{q.sort((Q,ct)=>Q.start-ct.start);let St=0;for(let Q=1;Q<q.length;Q++){const ct=q[St],lt=q[Q],ht=ct.start+ct.count,it=Xt(lt.start,w.width,4),Lt=Xt(ct.start,w.width,4);lt.start<=ht+1&&it===Lt&&Xt(lt.start+lt.count-1,w.width,4)===it?ct.count=Math.max(ct.count,lt.start+lt.count-ct.start):(++St,q[St]=lt)}q.length=St+1;const et=i.getParameter(i.UNPACK_ROW_LENGTH),vt=i.getParameter(i.UNPACK_SKIP_PIXELS),xt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let Q=0,ct=q.length;Q<ct;Q++){const lt=q[Q],ht=Math.floor(lt.start/4),it=Math.ceil(lt.count/4),Lt=ht%w.width,N=Math.floor(ht/w.width),nt=it,rt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Lt),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,Lt,N,nt,rt,z,X,w.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,et),i.pixelStorei(i.UNPACK_SKIP_PIXELS,vt),i.pixelStorei(i.UNPACK_SKIP_ROWS,xt)}}function Y(L,w,z){let X=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(X=i.TEXTURE_3D);const Z=Vt(L,w),q=w.source;e.bindTexture(X,L.__webglTexture,i.TEXTURE0+z);const St=n.get(q);if(q.version!==St.__version||Z===!0){e.activeTexture(i.TEXTURE0+z);const et=$t.getPrimaries($t.workingColorSpace),vt=w.colorSpace===Cn?null:$t.getPrimaries(w.colorSpace),xt=w.colorSpace===Cn||et===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let Q=_(w.image,!1,s.maxTextureSize);Q=me(w,Q);const ct=r.convert(w.format,w.colorSpace),lt=r.convert(w.type);let ht=x(w.internalFormat,ct,lt,w.colorSpace,w.isVideoTexture);pt(X,w);let it;const Lt=w.mipmaps,N=w.isVideoTexture!==!0,nt=St.__version===void 0||Z===!0,rt=q.dataReady,yt=M(w,Q);if(w.isDepthTexture)ht=v(w.format===cr,w.type),nt&&(N?e.texStorage2D(i.TEXTURE_2D,1,ht,Q.width,Q.height):e.texImage2D(i.TEXTURE_2D,0,ht,Q.width,Q.height,0,ct,lt,null));else if(w.isDataTexture)if(Lt.length>0){N&&nt&&e.texStorage2D(i.TEXTURE_2D,yt,ht,Lt[0].width,Lt[0].height);for(let J=0,j=Lt.length;J<j;J++)it=Lt[J],N?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,it.width,it.height,ct,lt,it.data):e.texImage2D(i.TEXTURE_2D,J,ht,it.width,it.height,0,ct,lt,it.data);w.generateMipmaps=!1}else N?(nt&&e.texStorage2D(i.TEXTURE_2D,yt,ht,Q.width,Q.height),rt&&Nt(w,Q,ct,lt)):e.texImage2D(i.TEXTURE_2D,0,ht,Q.width,Q.height,0,ct,lt,Q.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){N&&nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,ht,Lt[0].width,Lt[0].height,Q.depth);for(let J=0,j=Lt.length;J<j;J++)if(it=Lt[J],w.format!==sn)if(ct!==null)if(N){if(rt)if(w.layerUpdates.size>0){const Et=pu(it.width,it.height,w.format,w.type);for(const Ft of w.layerUpdates){const se=it.data.subarray(Ft*Et/it.data.BYTES_PER_ELEMENT,(Ft+1)*Et/it.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,Ft,it.width,it.height,1,ct,se)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,it.width,it.height,Q.depth,ct,it.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,ht,it.width,it.height,Q.depth,0,it.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?rt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,it.width,it.height,Q.depth,ct,lt,it.data):e.texImage3D(i.TEXTURE_2D_ARRAY,J,ht,it.width,it.height,Q.depth,0,ct,lt,it.data)}else{N&&nt&&e.texStorage2D(i.TEXTURE_2D,yt,ht,Lt[0].width,Lt[0].height);for(let J=0,j=Lt.length;J<j;J++)it=Lt[J],w.format!==sn?ct!==null?N?rt&&e.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,it.width,it.height,ct,it.data):e.compressedTexImage2D(i.TEXTURE_2D,J,ht,it.width,it.height,0,it.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,it.width,it.height,ct,lt,it.data):e.texImage2D(i.TEXTURE_2D,J,ht,it.width,it.height,0,ct,lt,it.data)}else if(w.isDataArrayTexture)if(N){if(nt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,yt,ht,Q.width,Q.height,Q.depth),rt)if(w.layerUpdates.size>0){const J=pu(Q.width,Q.height,w.format,w.type);for(const j of w.layerUpdates){const Et=Q.data.subarray(j*J/Q.data.BYTES_PER_ELEMENT,(j+1)*J/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,Q.width,Q.height,1,ct,lt,Et)}w.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ct,lt,Q.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,ht,Q.width,Q.height,Q.depth,0,ct,lt,Q.data);else if(w.isData3DTexture)N?(nt&&e.texStorage3D(i.TEXTURE_3D,yt,ht,Q.width,Q.height,Q.depth),rt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ct,lt,Q.data)):e.texImage3D(i.TEXTURE_3D,0,ht,Q.width,Q.height,Q.depth,0,ct,lt,Q.data);else if(w.isFramebufferTexture){if(nt)if(N)e.texStorage2D(i.TEXTURE_2D,yt,ht,Q.width,Q.height);else{let J=Q.width,j=Q.height;for(let Et=0;Et<yt;Et++)e.texImage2D(i.TEXTURE_2D,Et,ht,J,j,0,ct,lt,null),J>>=1,j>>=1}}else if(Lt.length>0){if(N&&nt){const J=re(Lt[0]);e.texStorage2D(i.TEXTURE_2D,yt,ht,J.width,J.height)}for(let J=0,j=Lt.length;J<j;J++)it=Lt[J],N?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ct,lt,it):e.texImage2D(i.TEXTURE_2D,J,ht,ct,lt,it);w.generateMipmaps=!1}else if(N){if(nt){const J=re(Q);e.texStorage2D(i.TEXTURE_2D,yt,ht,J.width,J.height)}rt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct,lt,Q)}else e.texImage2D(i.TEXTURE_2D,0,ht,ct,lt,Q);m(w)&&p(X),St.__version=q.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function K(L,w,z){if(w.image.length!==6)return;const X=Vt(L,w),Z=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+z);const q=n.get(Z);if(Z.version!==q.__version||X===!0){e.activeTexture(i.TEXTURE0+z);const St=$t.getPrimaries($t.workingColorSpace),et=w.colorSpace===Cn?null:$t.getPrimaries(w.colorSpace),vt=w.colorSpace===Cn||St===et?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const xt=w.isCompressedTexture||w.image[0].isCompressedTexture,Q=w.image[0]&&w.image[0].isDataTexture,ct=[];for(let j=0;j<6;j++)!xt&&!Q?ct[j]=_(w.image[j],!0,s.maxCubemapSize):ct[j]=Q?w.image[j].image:w.image[j],ct[j]=me(w,ct[j]);const lt=ct[0],ht=r.convert(w.format,w.colorSpace),it=r.convert(w.type),Lt=x(w.internalFormat,ht,it,w.colorSpace),N=w.isVideoTexture!==!0,nt=q.__version===void 0||X===!0,rt=Z.dataReady;let yt=M(w,lt);pt(i.TEXTURE_CUBE_MAP,w);let J;if(xt){N&&nt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Lt,lt.width,lt.height);for(let j=0;j<6;j++){J=ct[j].mipmaps;for(let Et=0;Et<J.length;Et++){const Ft=J[Et];w.format!==sn?ht!==null?N?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et,0,0,Ft.width,Ft.height,ht,Ft.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et,Lt,Ft.width,Ft.height,0,Ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et,0,0,Ft.width,Ft.height,ht,it,Ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et,Lt,Ft.width,Ft.height,0,ht,it,Ft.data)}}}else{if(J=w.mipmaps,N&&nt){J.length>0&&yt++;const j=re(ct[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,yt,Lt,j.width,j.height)}for(let j=0;j<6;j++)if(Q){N?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ct[j].width,ct[j].height,ht,it,ct[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Lt,ct[j].width,ct[j].height,0,ht,it,ct[j].data);for(let Et=0;Et<J.length;Et++){const se=J[Et].image[j].image;N?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et+1,0,0,se.width,se.height,ht,it,se.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et+1,Lt,se.width,se.height,0,ht,it,se.data)}}else{N?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ht,it,ct[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Lt,ht,it,ct[j]);for(let Et=0;Et<J.length;Et++){const Ft=J[Et];N?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et+1,0,0,ht,it,Ft.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Et+1,Lt,ht,it,Ft.image[j])}}}m(w)&&p(i.TEXTURE_CUBE_MAP),q.__version=Z.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function ft(L,w,z,X,Z,q){const St=r.convert(z.format,z.colorSpace),et=r.convert(z.type),vt=x(z.internalFormat,St,et,z.colorSpace),xt=n.get(w),Q=n.get(z);if(Q.__renderTarget=w,!xt.__hasExternalTextures){const ct=Math.max(1,w.width>>q),lt=Math.max(1,w.height>>q);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,q,vt,ct,lt,w.depth,0,St,et,null):e.texImage2D(Z,q,vt,ct,lt,0,St,et,null)}e.bindFramebuffer(i.FRAMEBUFFER,L),_t(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,Z,Q.__webglTexture,0,Kt(w)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,Z,Q.__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Tt(L,w,z){if(i.bindRenderbuffer(i.RENDERBUFFER,L),w.depthBuffer){const X=w.depthTexture,Z=X&&X.isDepthTexture?X.type:null,q=v(w.stencilBuffer,Z),St=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=Kt(w);_t(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,et,q,w.width,w.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,et,q,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,q,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,St,i.RENDERBUFFER,L)}else{const X=w.textures;for(let Z=0;Z<X.length;Z++){const q=X[Z],St=r.convert(q.format,q.colorSpace),et=r.convert(q.type),vt=x(q.internalFormat,St,et,q.colorSpace),xt=Kt(w);z&&_t(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,xt,vt,w.width,w.height):_t(w)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xt,vt,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,vt,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function gt(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=n.get(w.depthTexture);X.__renderTarget=w,(!X.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),k(w.depthTexture,0);const Z=X.__webglTexture,q=Kt(w);if(w.depthTexture.format===ar)_t(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0);else if(w.depthTexture.format===cr)_t(w)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Ht(L){const w=n.get(L),z=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const X=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),X){const Z=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,X.removeEventListener("dispose",Z)};X.addEventListener("dispose",Z),w.__depthDisposeCallback=Z}w.__boundDepthTexture=X}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");const X=L.texture.mipmaps;X&&X.length>0?gt(w.__webglFramebuffer[0],L):gt(w.__webglFramebuffer,L)}else if(z){w.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[X]),w.__webglDepthbuffer[X]===void 0)w.__webglDepthbuffer[X]=i.createRenderbuffer(),Tt(w.__webglDepthbuffer[X],L,!1);else{const Z=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,q)}}else{const X=L.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),Tt(w.__webglDepthbuffer,L,!1);else{const Z=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,q)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ie(L,w,z){const X=n.get(L);w!==void 0&&ft(X.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Ht(L)}function U(L){const w=L.texture,z=n.get(L),X=n.get(w);L.addEventListener("dispose",E);const Z=L.textures,q=L.isWebGLCubeRenderTarget===!0,St=Z.length>1;if(St||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=w.version,o.memory.textures++),q){z.__webglFramebuffer=[];for(let et=0;et<6;et++)if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer[et]=[];for(let vt=0;vt<w.mipmaps.length;vt++)z.__webglFramebuffer[et][vt]=i.createFramebuffer()}else z.__webglFramebuffer[et]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer=[];for(let et=0;et<w.mipmaps.length;et++)z.__webglFramebuffer[et]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(St)for(let et=0,vt=Z.length;et<vt;et++){const xt=n.get(Z[et]);xt.__webglTexture===void 0&&(xt.__webglTexture=i.createTexture(),o.memory.textures++)}if(L.samples>0&&_t(L)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let et=0;et<Z.length;et++){const vt=Z[et];z.__webglColorRenderbuffer[et]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[et]);const xt=r.convert(vt.format,vt.colorSpace),Q=r.convert(vt.type),ct=x(vt.internalFormat,xt,Q,vt.colorSpace,L.isXRRenderTarget===!0),lt=Kt(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,ct,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+et,i.RENDERBUFFER,z.__webglColorRenderbuffer[et])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Tt(z.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),pt(i.TEXTURE_CUBE_MAP,w);for(let et=0;et<6;et++)if(w.mipmaps&&w.mipmaps.length>0)for(let vt=0;vt<w.mipmaps.length;vt++)ft(z.__webglFramebuffer[et][vt],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,vt);else ft(z.__webglFramebuffer[et],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);m(w)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let et=0,vt=Z.length;et<vt;et++){const xt=Z[et],Q=n.get(xt);let ct=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ct=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,Q.__webglTexture),pt(ct,xt),ft(z.__webglFramebuffer,L,xt,i.COLOR_ATTACHMENT0+et,ct,0),m(xt)&&p(ct)}e.unbindTexture()}else{let et=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(et=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(et,X.__webglTexture),pt(et,w),w.mipmaps&&w.mipmaps.length>0)for(let vt=0;vt<w.mipmaps.length;vt++)ft(z.__webglFramebuffer[vt],L,w,i.COLOR_ATTACHMENT0,et,vt);else ft(z.__webglFramebuffer,L,w,i.COLOR_ATTACHMENT0,et,0);m(w)&&p(et),e.unbindTexture()}L.depthBuffer&&Ht(L)}function ee(L){const w=L.textures;for(let z=0,X=w.length;z<X;z++){const Z=w[z];if(m(Z)){const q=y(L),St=n.get(Z).__webglTexture;e.bindTexture(q,St),p(q),e.unbindTexture()}}}const Rt=[],wt=[];function dt(L){if(L.samples>0){if(_t(L)===!1){const w=L.textures,z=L.width,X=L.height;let Z=i.COLOR_BUFFER_BIT;const q=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(L),et=w.length>1;if(et)for(let xt=0;xt<w.length;xt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer);const vt=L.texture.mipmaps;vt&&vt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let xt=0;xt<w.length;xt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),et){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[xt]);const Q=n.get(w[xt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Q,0)}i.blitFramebuffer(0,0,z,X,0,0,z,X,Z,i.NEAREST),c===!0&&(Rt.length=0,wt.length=0,Rt.push(i.COLOR_ATTACHMENT0+xt),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Rt.push(q),wt.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,wt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Rt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),et)for(let xt=0;xt<w.length;xt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.RENDERBUFFER,St.__webglColorRenderbuffer[xt]);const Q=n.get(w[xt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xt,i.TEXTURE_2D,Q,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const w=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function Kt(L){return Math.min(s.maxSamples,L.samples)}function _t(L){const w=n.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function It(L){const w=o.render.frame;h.get(L)!==w&&(h.set(L,w),L.update())}function me(L,w){const z=L.colorSpace,X=L.format,Z=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||z!==Es&&z!==Cn&&($t.getTransfer(z)===Jt?(X!==sn||Z!==wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),w}function re(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=D,this.setTexture2D=k,this.setTexture2DArray=H,this.setTexture3D=$,this.setTextureCube=G,this.rebindTextures=ie,this.setupRenderTarget=U,this.updateRenderTargetMipmap=ee,this.updateMultisampleRenderTarget=dt,this.setupDepthRenderbuffer=Ht,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=_t}function Q_(i,t){function e(n,s=Cn){let r;const o=$t.getTransfer(s);if(n===wn)return i.UNSIGNED_BYTE;if(n===ll)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ul)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Xh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===qh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Gh)return i.BYTE;if(n===Wh)return i.SHORT;if(n===rr)return i.UNSIGNED_SHORT;if(n===cl)return i.INT;if(n===Ni)return i.UNSIGNED_INT;if(n===Ln)return i.FLOAT;if(n===dr)return i.HALF_FLOAT;if(n===Yh)return i.ALPHA;if(n===$h)return i.RGB;if(n===sn)return i.RGBA;if(n===ar)return i.DEPTH_COMPONENT;if(n===cr)return i.DEPTH_STENCIL;if(n===jh)return i.RED;if(n===hl)return i.RED_INTEGER;if(n===Kh)return i.RG;if(n===fl)return i.RG_INTEGER;if(n===dl)return i.RGBA_INTEGER;if(n===fo||n===po||n===mo||n===go)if(o===Jt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===fo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===go)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===fo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===po)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===mo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===go)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===oc||n===ac||n===cc||n===lc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===oc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ac)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===lc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===uc||n===hc||n===fc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===uc||n===hc)return o===Jt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===dc||n===pc||n===mc||n===gc||n===_c||n===vc||n===xc||n===yc||n===Mc||n===Sc||n===bc||n===Ec||n===wc||n===Tc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===dc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===pc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===mc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===gc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_c)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===vc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Mc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Sc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===bc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ec)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Tc)return o===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ac||n===Rc||n===Cc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ac)return o===Jt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Rc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Cc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Pc||n===Lc||n===Dc||n===Uc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Pc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Lc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Dc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Uc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===or?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const tv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ev=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class nv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new ff(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new dn({vertexShader:tv,fragmentShader:ev,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new We(new Ps(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class iv extends As{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,f=null,u=null,d=null,g=null;const _=typeof XRWebGLBinding<"u",m=new nv,p={},y=e.getContextAttributes();let x=null,v=null;const M=[],T=[],E=new Ot;let R=null;const b=new en;b.viewport=new te;const S=new en;S.viewport=new te;const C=[b,S],D=new Mp;let I=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let K=M[Y];return K===void 0&&(K=new ca,M[Y]=K),K.getTargetRaySpace()},this.getControllerGrip=function(Y){let K=M[Y];return K===void 0&&(K=new ca,M[Y]=K),K.getGripSpace()},this.getHand=function(Y){let K=M[Y];return K===void 0&&(K=new ca,M[Y]=K),K.getHandSpace()};function k(Y){const K=T.indexOf(Y.inputSource);if(K===-1)return;const ft=M[K];ft!==void 0&&(ft.update(Y.inputSource,Y.frame,l||o),ft.dispatchEvent({type:Y.type,data:Y.inputSource}))}function H(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",$);for(let Y=0;Y<M.length;Y++){const K=T[Y];K!==null&&(T[Y]=null,M[Y].disconnect(K))}I=null,F=null,m.reset();for(const Y in p)delete p[Y];t.setRenderTarget(x),d=null,u=null,f=null,s=null,v=null,Nt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(x=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",H),s.addEventListener("inputsourceschange",$),y.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(E),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ft=null,Tt=null,gt=null;y.depth&&(gt=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ft=y.stencil?cr:ar,Tt=y.stencil?or:Ni);const Ht={colorFormat:e.RGBA8,depthFormat:gt,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ht),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),v=new Fi(u.textureWidth,u.textureHeight,{format:sn,type:wn,depthTexture:new hf(u.textureWidth,u.textureHeight,Tt,void 0,void 0,void 0,void 0,void 0,void 0,ft),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ft={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,ft),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Fi(d.framebufferWidth,d.framebufferHeight,{format:sn,type:wn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Nt.setContext(s),Nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(Y){for(let K=0;K<Y.removed.length;K++){const ft=Y.removed[K],Tt=T.indexOf(ft);Tt>=0&&(T[Tt]=null,M[Tt].disconnect(ft))}for(let K=0;K<Y.added.length;K++){const ft=Y.added[K];let Tt=T.indexOf(ft);if(Tt===-1){for(let Ht=0;Ht<M.length;Ht++)if(Ht>=T.length){T.push(ft),Tt=Ht;break}else if(T[Ht]===null){T[Ht]=ft,Tt=Ht;break}if(Tt===-1)break}const gt=M[Tt];gt&&gt.connect(ft)}}const G=new P,st=new P;function at(Y,K,ft){G.setFromMatrixPosition(K.matrixWorld),st.setFromMatrixPosition(ft.matrixWorld);const Tt=G.distanceTo(st),gt=K.projectionMatrix.elements,Ht=ft.projectionMatrix.elements,ie=gt[14]/(gt[10]-1),U=gt[14]/(gt[10]+1),ee=(gt[9]+1)/gt[5],Rt=(gt[9]-1)/gt[5],wt=(gt[8]-1)/gt[0],dt=(Ht[8]+1)/Ht[0],Kt=ie*wt,_t=ie*dt,It=Tt/(-wt+dt),me=It*-wt;if(K.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(me),Y.translateZ(It),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),gt[10]===-1)Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const re=ie+It,L=U+It,w=Kt-me,z=_t+(Tt-me),X=ee*U/L*re,Z=Rt*U/L*re;Y.projectionMatrix.makePerspective(w,z,X,Z,re,L),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Mt(Y,K){K===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(K.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let K=Y.near,ft=Y.far;m.texture!==null&&(m.depthNear>0&&(K=m.depthNear),m.depthFar>0&&(ft=m.depthFar)),D.near=S.near=b.near=K,D.far=S.far=b.far=ft,(I!==D.near||F!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),I=D.near,F=D.far),D.layers.mask=Y.layers.mask|6,b.layers.mask=D.layers.mask&3,S.layers.mask=D.layers.mask&5;const Tt=Y.parent,gt=D.cameras;Mt(D,Tt);for(let Ht=0;Ht<gt.length;Ht++)Mt(gt[Ht],Tt);gt.length===2?at(D,b,S):D.projectionMatrix.copy(b.projectionMatrix),pt(Y,D,Tt)};function pt(Y,K,ft){ft===null?Y.matrix.copy(K.matrixWorld):(Y.matrix.copy(ft.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(K.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(K.projectionMatrix),Y.projectionMatrixInverse.copy(K.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Nc*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(u===null&&d===null))return c},this.setFoveation=function(Y){c=Y,u!==null&&(u.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(Y){return p[Y]};let Vt=null;function Xt(Y,K){if(h=K.getViewerPose(l||o),g=K,h!==null){const ft=h.views;d!==null&&(t.setRenderTargetFramebuffer(v,d.framebuffer),t.setRenderTarget(v));let Tt=!1;ft.length!==D.cameras.length&&(D.cameras.length=0,Tt=!0);for(let U=0;U<ft.length;U++){const ee=ft[U];let Rt=null;if(d!==null)Rt=d.getViewport(ee);else{const dt=f.getViewSubImage(u,ee);Rt=dt.viewport,U===0&&(t.setRenderTargetTextures(v,dt.colorTexture,dt.depthStencilTexture),t.setRenderTarget(v))}let wt=C[U];wt===void 0&&(wt=new en,wt.layers.enable(U),wt.viewport=new te,C[U]=wt),wt.matrix.fromArray(ee.transform.matrix),wt.matrix.decompose(wt.position,wt.quaternion,wt.scale),wt.projectionMatrix.fromArray(ee.projectionMatrix),wt.projectionMatrixInverse.copy(wt.projectionMatrix).invert(),wt.viewport.set(Rt.x,Rt.y,Rt.width,Rt.height),U===0&&(D.matrix.copy(wt.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Tt===!0&&D.cameras.push(wt)}const gt=s.enabledFeatures;if(gt&&gt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=n.getBinding();const U=f.getDepthInformation(ft[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(gt&&gt.includes("camera-access")&&_){t.state.unbindTexture(),f=n.getBinding();for(let U=0;U<ft.length;U++){const ee=ft[U].camera;if(ee){let Rt=p[ee];Rt||(Rt=new ff,p[ee]=Rt);const wt=f.getCameraImage(ee);Rt.sourceTexture=wt}}}}for(let ft=0;ft<M.length;ft++){const Tt=T[ft],gt=M[ft];Tt!==null&&gt!==void 0&&gt.update(Tt,K,l||o)}Vt&&Vt(Y,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const Nt=new mf;Nt.setAnimationLoop(Xt),this.setAnimationLoop=function(Y){Vt=Y},this.dispose=function(){}}}const Mi=new In,sv=new Wt;function rv(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,rf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),f(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),u(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,y,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Oe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Oe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p),x=y.envMap,v=y.envMapRotation;x&&(m.envMap.value=x,Mi.copy(v),Mi.x*=-1,Mi.y*=-1,Mi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Mi.y*=-1,Mi.z*=-1),m.envMapRotation.value.setFromMatrix4(sv.makeRotationFromEuler(Mi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,y,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Oe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ov(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,x){const v=x.program;n.uniformBlockBinding(y,v)}function l(y,x){let v=s[y.id];v===void 0&&(g(y),v=h(y),s[y.id]=v,y.addEventListener("dispose",m));const M=x.program;n.updateUBOMapping(y,M);const T=t.render.frame;r[y.id]!==T&&(u(y),r[y.id]=T)}function h(y){const x=f();y.__bindingPointIndex=x;const v=i.createBuffer(),M=y.__size,T=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,M,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,v),v}function f(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const x=s[y.id],v=y.uniforms,M=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let T=0,E=v.length;T<E;T++){const R=Array.isArray(v[T])?v[T]:[v[T]];for(let b=0,S=R.length;b<S;b++){const C=R[b];if(d(C,T,b,M)===!0){const D=C.__offset,I=Array.isArray(C.value)?C.value:[C.value];let F=0;for(let k=0;k<I.length;k++){const H=I[k],$=_(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,D+F,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,F),F+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(y,x,v,M){const T=y.value,E=x+"_"+v;if(M[E]===void 0)return typeof T=="number"||typeof T=="boolean"?M[E]=T:M[E]=T.clone(),!0;{const R=M[E];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return M[E]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function g(y){const x=y.uniforms;let v=0;const M=16;for(let E=0,R=x.length;E<R;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let S=0,C=b.length;S<C;S++){const D=b[S],I=Array.isArray(D.value)?D.value:[D.value];for(let F=0,k=I.length;F<k;F++){const H=I[F],$=_(H),G=v%M,st=G%$.boundary,at=G+st;v+=st,at!==0&&M-at<$.storage&&(v+=M-at),D.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=v,v+=$.storage}}}const T=v%M;return T>0&&(v+=M-T),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function m(y){const x=y.target;x.removeEventListener("dispose",m);const v=o.indexOf(x.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class av{constructor(t={}){const{canvas:e=Nd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const y=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let M=!1;this._outputColorSpace=Le;let T=0,E=0,R=null,b=-1,S=null;const C=new te,D=new te;let I=null;const F=new Ut(0);let k=0,H=e.width,$=e.height,G=1,st=null,at=null;const Mt=new te(0,0,H,$),pt=new te(0,0,H,$);let Vt=!1;const Xt=new _l;let Nt=!1,Y=!1;const K=new Wt,ft=new P,Tt=new te,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ht=!1;function ie(){return R===null?G:1}let U=n;function ee(A,B){return e.getContext(A,B)}try{const A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${fr}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",yt,!1),e.addEventListener("webglcontextcreationerror",J,!1),U===null){const B="webgl2";if(U=ee(B,A),U===null)throw ee(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Rt,wt,dt,Kt,_t,It,me,re,L,w,z,X,Z,q,St,et,vt,xt,Q,ct,lt,ht,it,Lt;function N(){Rt=new _0(U),Rt.init(),ht=new Q_(U,Rt),wt=new u0(U,Rt,t,ht),dt=new Z_(U,Rt),wt.reversedDepthBuffer&&u&&dt.buffers.depth.setReversed(!0),Kt=new y0(U),_t=new O_,It=new J_(U,Rt,dt,_t,wt,ht,Kt),me=new f0(v),re=new g0(v),L=new Tp(U),it=new c0(U,L),w=new v0(U,L,Kt,it),z=new S0(U,w,L,Kt),Q=new M0(U,wt,It),et=new h0(_t),X=new B_(v,me,re,Rt,wt,it,et),Z=new rv(v,_t),q=new k_,St=new q_(Rt),xt=new a0(v,me,re,dt,z,d,c),vt=new j_(v,z,wt),Lt=new ov(U,Kt,wt,dt),ct=new l0(U,Rt,Kt),lt=new x0(U,Rt,Kt),Kt.programs=X.programs,v.capabilities=wt,v.extensions=Rt,v.properties=_t,v.renderLists=q,v.shadowMap=vt,v.state=dt,v.info=Kt}N();const nt=new iv(v,U);this.xr=nt,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const A=Rt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Rt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(A){A!==void 0&&(G=A,this.setSize(H,$,!1))},this.getSize=function(A){return A.set(H,$)},this.setSize=function(A,B,V=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=A,$=B,e.width=Math.floor(A*G),e.height=Math.floor(B*G),V===!0&&(e.style.width=A+"px",e.style.height=B+"px"),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(H*G,$*G).floor()},this.setDrawingBufferSize=function(A,B,V){H=A,$=B,G=V,e.width=Math.floor(A*V),e.height=Math.floor(B*V),this.setViewport(0,0,A,B)},this.getCurrentViewport=function(A){return A.copy(C)},this.getViewport=function(A){return A.copy(Mt)},this.setViewport=function(A,B,V,W){A.isVector4?Mt.set(A.x,A.y,A.z,A.w):Mt.set(A,B,V,W),dt.viewport(C.copy(Mt).multiplyScalar(G).round())},this.getScissor=function(A){return A.copy(pt)},this.setScissor=function(A,B,V,W){A.isVector4?pt.set(A.x,A.y,A.z,A.w):pt.set(A,B,V,W),dt.scissor(D.copy(pt).multiplyScalar(G).round())},this.getScissorTest=function(){return Vt},this.setScissorTest=function(A){dt.setScissorTest(Vt=A)},this.setOpaqueSort=function(A){st=A},this.setTransparentSort=function(A){at=A},this.getClearColor=function(A){return A.copy(xt.getClearColor())},this.setClearColor=function(){xt.setClearColor(...arguments)},this.getClearAlpha=function(){return xt.getClearAlpha()},this.setClearAlpha=function(){xt.setClearAlpha(...arguments)},this.clear=function(A=!0,B=!0,V=!0){let W=0;if(A){let O=!1;if(R!==null){const tt=R.texture.format;O=tt===dl||tt===fl||tt===hl}if(O){const tt=R.texture.type,ut=tt===wn||tt===Ni||tt===rr||tt===or||tt===ll||tt===ul,bt=xt.getClearColor(),mt=xt.getClearAlpha(),Pt=bt.r,Dt=bt.g,At=bt.b;ut?(g[0]=Pt,g[1]=Dt,g[2]=At,g[3]=mt,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Pt,_[1]=Dt,_[2]=At,_[3]=mt,U.clearBufferiv(U.COLOR,0,_))}else W|=U.COLOR_BUFFER_BIT}B&&(W|=U.DEPTH_BUFFER_BIT),V&&(W|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",yt,!1),e.removeEventListener("webglcontextcreationerror",J,!1),xt.dispose(),q.dispose(),St.dispose(),_t.dispose(),me.dispose(),re.dispose(),z.dispose(),it.dispose(),Lt.dispose(),X.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",Tn),nt.removeEventListener("sessionend",Il),pi.stop()};function rt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function yt(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=Kt.autoReset,B=vt.enabled,V=vt.autoUpdate,W=vt.needsUpdate,O=vt.type;N(),Kt.autoReset=A,vt.enabled=B,vt.autoUpdate=V,vt.needsUpdate=W,vt.type=O}function J(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function j(A){const B=A.target;B.removeEventListener("dispose",j),Et(B)}function Et(A){Ft(A),_t.remove(A)}function Ft(A){const B=_t.get(A).programs;B!==void 0&&(B.forEach(function(V){X.releaseProgram(V)}),A.isShaderMaterial&&X.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,V,W,O,tt){B===null&&(B=gt);const ut=O.isMesh&&O.matrixWorld.determinant()<0,bt=Gf(A,B,V,W,O);dt.setMaterial(W,ut);let mt=V.index,Pt=1;if(W.wireframe===!0){if(mt=w.getWireframeAttribute(V),mt===void 0)return;Pt=2}const Dt=V.drawRange,At=V.attributes.position;let Gt=Dt.start*Pt,Zt=(Dt.start+Dt.count)*Pt;tt!==null&&(Gt=Math.max(Gt,tt.start*Pt),Zt=Math.min(Zt,(tt.start+tt.count)*Pt)),mt!==null?(Gt=Math.max(Gt,0),Zt=Math.min(Zt,mt.count)):At!=null&&(Gt=Math.max(Gt,0),Zt=Math.min(Zt,At.count));const de=Zt-Gt;if(de<0||de===1/0)return;it.setup(O,W,bt,V,mt);let oe,ne=ct;if(mt!==null&&(oe=L.get(mt),ne=lt,ne.setIndex(oe)),O.isMesh)W.wireframe===!0?(dt.setLineWidth(W.wireframeLinewidth*ie()),ne.setMode(U.LINES)):ne.setMode(U.TRIANGLES);else if(O.isLine){let Ct=W.linewidth;Ct===void 0&&(Ct=1),dt.setLineWidth(Ct*ie()),O.isLineSegments?ne.setMode(U.LINES):O.isLineLoop?ne.setMode(U.LINE_LOOP):ne.setMode(U.LINE_STRIP)}else O.isPoints?ne.setMode(U.POINTS):O.isSprite&&ne.setMode(U.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)lr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ne.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))ne.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ct=O._multiDrawStarts,le=O._multiDrawCounts,Yt=O._multiDrawCount,Ze=mt?L.get(mt).bytesPerElement:1,zi=_t.get(W).currentProgram.getUniforms();for(let Je=0;Je<Yt;Je++)zi.setValue(U,"_gl_DrawID",Je),ne.render(Ct[Je]/Ze,le[Je])}else if(O.isInstancedMesh)ne.renderInstances(Gt,de,O.count);else if(V.isInstancedBufferGeometry){const Ct=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,le=Math.min(V.instanceCount,Ct);ne.renderInstances(Gt,de,le)}else ne.render(Gt,de)};function se(A,B,V){A.transparent===!0&&A.side===un&&A.forceSinglePass===!1?(A.side=Oe,A.needsUpdate=!0,gr(A,B,V),A.side=En,A.needsUpdate=!0,gr(A,B,V),A.side=un):gr(A,B,V)}this.compile=function(A,B,V=null){V===null&&(V=A),p=St.get(V),p.init(B),x.push(p),V.traverseVisible(function(O){O.isLight&&O.layers.test(B.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),A!==V&&A.traverseVisible(function(O){O.isLight&&O.layers.test(B.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();const W=new Set;return A.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const tt=O.material;if(tt)if(Array.isArray(tt))for(let ut=0;ut<tt.length;ut++){const bt=tt[ut];se(bt,V,O),W.add(bt)}else se(tt,V,O),W.add(tt)}),p=x.pop(),W},this.compileAsync=function(A,B,V=null){const W=this.compile(A,B,V);return new Promise(O=>{function tt(){if(W.forEach(function(ut){_t.get(ut).currentProgram.isReady()&&W.delete(ut)}),W.size===0){O(A);return}setTimeout(tt,10)}Rt.get("KHR_parallel_shader_compile")!==null?tt():setTimeout(tt,10)})};let jt=null;function Bn(A){jt&&jt(A)}function Tn(){pi.stop()}function Il(){pi.start()}const pi=new mf;pi.setAnimationLoop(Bn),typeof self<"u"&&pi.setContext(self),this.setAnimationLoop=function(A){jt=A,nt.setAnimationLoop(A),A===null?pi.stop():pi.start()},nt.addEventListener("sessionstart",Tn),nt.addEventListener("sessionend",Il),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(B),B=nt.getCamera()),A.isScene===!0&&A.onBeforeRender(v,A,B,R),p=St.get(A,x.length),p.init(B),x.push(p),K.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Xt.setFromProjectionMatrix(K,Dn,B.reversedDepth),Y=this.localClippingEnabled,Nt=et.init(this.clippingPlanes,Y),m=q.get(A,y.length),m.init(),y.push(m),nt.enabled===!0&&nt.isPresenting===!0){const tt=v.xr.getDepthSensingMesh();tt!==null&&Bo(tt,B,-1/0,v.sortObjects)}Bo(A,B,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(st,at),Ht=nt.enabled===!1||nt.isPresenting===!1||nt.hasDepthSensing()===!1,Ht&&xt.addToRenderList(m,A),this.info.render.frame++,Nt===!0&&et.beginShadows();const V=p.state.shadowsArray;vt.render(V,A,B),Nt===!0&&et.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,O=m.transmissive;if(p.setupLights(),B.isArrayCamera){const tt=B.cameras;if(O.length>0)for(let ut=0,bt=tt.length;ut<bt;ut++){const mt=tt[ut];Fl(W,O,A,mt)}Ht&&xt.render(A);for(let ut=0,bt=tt.length;ut<bt;ut++){const mt=tt[ut];Nl(m,A,mt,mt.viewport)}}else O.length>0&&Fl(W,O,A,B),Ht&&xt.render(A),Nl(m,A,B);R!==null&&E===0&&(It.updateMultisampleRenderTarget(R),It.updateRenderTargetMipmap(R)),A.isScene===!0&&A.onAfterRender(v,A,B),it.resetDefaultState(),b=-1,S=null,x.pop(),x.length>0?(p=x[x.length-1],Nt===!0&&et.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Bo(A,B,V,W){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)V=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Xt.intersectsSprite(A)){W&&Tt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(K);const ut=z.update(A),bt=A.material;bt.visible&&m.push(A,ut,bt,V,Tt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Xt.intersectsObject(A))){const ut=z.update(A),bt=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Tt.copy(A.boundingSphere.center)):(ut.boundingSphere===null&&ut.computeBoundingSphere(),Tt.copy(ut.boundingSphere.center)),Tt.applyMatrix4(A.matrixWorld).applyMatrix4(K)),Array.isArray(bt)){const mt=ut.groups;for(let Pt=0,Dt=mt.length;Pt<Dt;Pt++){const At=mt[Pt],Gt=bt[At.materialIndex];Gt&&Gt.visible&&m.push(A,ut,Gt,V,Tt.z,At)}}else bt.visible&&m.push(A,ut,bt,V,Tt.z,null)}}const tt=A.children;for(let ut=0,bt=tt.length;ut<bt;ut++)Bo(tt[ut],B,V,W)}function Nl(A,B,V,W){const O=A.opaque,tt=A.transmissive,ut=A.transparent;p.setupLightsView(V),Nt===!0&&et.setGlobalState(v.clippingPlanes,V),W&&dt.viewport(C.copy(W)),O.length>0&&mr(O,B,V),tt.length>0&&mr(tt,B,V),ut.length>0&&mr(ut,B,V),dt.buffers.depth.setTest(!0),dt.buffers.depth.setMask(!0),dt.buffers.color.setMask(!0),dt.setPolygonOffset(!1)}function Fl(A,B,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new Fi(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?dr:wn,minFilter:ci,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const tt=p.state.transmissionRenderTarget[W.id],ut=W.viewport||C;tt.setSize(ut.z*v.transmissionResolutionScale,ut.w*v.transmissionResolutionScale);const bt=v.getRenderTarget(),mt=v.getActiveCubeFace(),Pt=v.getActiveMipmapLevel();v.setRenderTarget(tt),v.getClearColor(F),k=v.getClearAlpha(),k<1&&v.setClearColor(16777215,.5),v.clear(),Ht&&xt.render(V);const Dt=v.toneMapping;v.toneMapping=hi;const At=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),Nt===!0&&et.setGlobalState(v.clippingPlanes,W),mr(A,V,W),It.updateMultisampleRenderTarget(tt),It.updateRenderTargetMipmap(tt),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let Gt=!1;for(let Zt=0,de=B.length;Zt<de;Zt++){const oe=B[Zt],ne=oe.object,Ct=oe.geometry,le=oe.material,Yt=oe.group;if(le.side===un&&ne.layers.test(W.layers)){const Ze=le.side;le.side=Oe,le.needsUpdate=!0,Bl(ne,V,W,Ct,le,Yt),le.side=Ze,le.needsUpdate=!0,Gt=!0}}Gt===!0&&(It.updateMultisampleRenderTarget(tt),It.updateRenderTargetMipmap(tt))}v.setRenderTarget(bt,mt,Pt),v.setClearColor(F,k),At!==void 0&&(W.viewport=At),v.toneMapping=Dt}function mr(A,B,V){const W=B.isScene===!0?B.overrideMaterial:null;for(let O=0,tt=A.length;O<tt;O++){const ut=A[O],bt=ut.object,mt=ut.geometry,Pt=ut.group;let Dt=ut.material;Dt.allowOverride===!0&&W!==null&&(Dt=W),bt.layers.test(V.layers)&&Bl(bt,B,V,mt,Dt,Pt)}}function Bl(A,B,V,W,O,tt){A.onBeforeRender(v,B,V,W,O,tt),A.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),O.onBeforeRender(v,B,V,W,A,tt),O.transparent===!0&&O.side===un&&O.forceSinglePass===!1?(O.side=Oe,O.needsUpdate=!0,v.renderBufferDirect(V,B,W,O,A,tt),O.side=En,O.needsUpdate=!0,v.renderBufferDirect(V,B,W,O,A,tt),O.side=un):v.renderBufferDirect(V,B,W,O,A,tt),A.onAfterRender(v,B,V,W,O,tt)}function gr(A,B,V){B.isScene!==!0&&(B=gt);const W=_t.get(A),O=p.state.lights,tt=p.state.shadowsArray,ut=O.state.version,bt=X.getParameters(A,O.state,tt,B,V),mt=X.getProgramCacheKey(bt);let Pt=W.programs;W.environment=A.isMeshStandardMaterial?B.environment:null,W.fog=B.fog,W.envMap=(A.isMeshStandardMaterial?re:me).get(A.envMap||W.environment),W.envMapRotation=W.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,Pt===void 0&&(A.addEventListener("dispose",j),Pt=new Map,W.programs=Pt);let Dt=Pt.get(mt);if(Dt!==void 0){if(W.currentProgram===Dt&&W.lightsStateVersion===ut)return zl(A,bt),Dt}else bt.uniforms=X.getUniforms(A),A.onBeforeCompile(bt,v),Dt=X.acquireProgram(bt,mt),Pt.set(mt,Dt),W.uniforms=bt.uniforms;const At=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(At.clippingPlanes=et.uniform),zl(A,bt),W.needsLights=Xf(A),W.lightsStateVersion=ut,W.needsLights&&(At.ambientLightColor.value=O.state.ambient,At.lightProbe.value=O.state.probe,At.directionalLights.value=O.state.directional,At.directionalLightShadows.value=O.state.directionalShadow,At.spotLights.value=O.state.spot,At.spotLightShadows.value=O.state.spotShadow,At.rectAreaLights.value=O.state.rectArea,At.ltc_1.value=O.state.rectAreaLTC1,At.ltc_2.value=O.state.rectAreaLTC2,At.pointLights.value=O.state.point,At.pointLightShadows.value=O.state.pointShadow,At.hemisphereLights.value=O.state.hemi,At.directionalShadowMap.value=O.state.directionalShadowMap,At.directionalShadowMatrix.value=O.state.directionalShadowMatrix,At.spotShadowMap.value=O.state.spotShadowMap,At.spotLightMatrix.value=O.state.spotLightMatrix,At.spotLightMap.value=O.state.spotLightMap,At.pointShadowMap.value=O.state.pointShadowMap,At.pointShadowMatrix.value=O.state.pointShadowMatrix),W.currentProgram=Dt,W.uniformsList=null,Dt}function Ol(A){if(A.uniformsList===null){const B=A.currentProgram.getUniforms();A.uniformsList=_o.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function zl(A,B){const V=_t.get(A);V.outputColorSpace=B.outputColorSpace,V.batching=B.batching,V.batchingColor=B.batchingColor,V.instancing=B.instancing,V.instancingColor=B.instancingColor,V.instancingMorph=B.instancingMorph,V.skinning=B.skinning,V.morphTargets=B.morphTargets,V.morphNormals=B.morphNormals,V.morphColors=B.morphColors,V.morphTargetsCount=B.morphTargetsCount,V.numClippingPlanes=B.numClippingPlanes,V.numIntersection=B.numClipIntersection,V.vertexAlphas=B.vertexAlphas,V.vertexTangents=B.vertexTangents,V.toneMapping=B.toneMapping}function Gf(A,B,V,W,O){B.isScene!==!0&&(B=gt),It.resetTextureUnits();const tt=B.fog,ut=W.isMeshStandardMaterial?B.environment:null,bt=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Es,mt=(W.isMeshStandardMaterial?re:me).get(W.envMap||ut),Pt=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Dt=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),At=!!V.morphAttributes.position,Gt=!!V.morphAttributes.normal,Zt=!!V.morphAttributes.color;let de=hi;W.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(de=v.toneMapping);const oe=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ne=oe!==void 0?oe.length:0,Ct=_t.get(W),le=p.state.lights;if(Nt===!0&&(Y===!0||A!==S)){const ke=A===S&&W.id===b;et.setState(W,A,ke)}let Yt=!1;W.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==le.state.version||Ct.outputColorSpace!==bt||O.isBatchedMesh&&Ct.batching===!1||!O.isBatchedMesh&&Ct.batching===!0||O.isBatchedMesh&&Ct.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ct.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ct.instancing===!1||!O.isInstancedMesh&&Ct.instancing===!0||O.isSkinnedMesh&&Ct.skinning===!1||!O.isSkinnedMesh&&Ct.skinning===!0||O.isInstancedMesh&&Ct.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ct.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ct.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ct.instancingMorph===!1&&O.morphTexture!==null||Ct.envMap!==mt||W.fog===!0&&Ct.fog!==tt||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==et.numPlanes||Ct.numIntersection!==et.numIntersection)||Ct.vertexAlphas!==Pt||Ct.vertexTangents!==Dt||Ct.morphTargets!==At||Ct.morphNormals!==Gt||Ct.morphColors!==Zt||Ct.toneMapping!==de||Ct.morphTargetsCount!==ne)&&(Yt=!0):(Yt=!0,Ct.__version=W.version);let Ze=Ct.currentProgram;Yt===!0&&(Ze=gr(W,B,O));let zi=!1,Je=!1,Ds=!1;const ue=Ze.getUniforms(),rn=Ct.uniforms;if(dt.useProgram(Ze.program)&&(zi=!0,Je=!0,Ds=!0),W.id!==b&&(b=W.id,Je=!0),zi||S!==A){dt.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),ue.setValue(U,"projectionMatrix",A.projectionMatrix),ue.setValue(U,"viewMatrix",A.matrixWorldInverse);const Ye=ue.map.cameraPosition;Ye!==void 0&&Ye.setValue(U,ft.setFromMatrixPosition(A.matrixWorld)),wt.logarithmicDepthBuffer&&ue.setValue(U,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ue.setValue(U,"isOrthographic",A.isOrthographicCamera===!0),S!==A&&(S=A,Je=!0,Ds=!0)}if(O.isSkinnedMesh){ue.setOptional(U,O,"bindMatrix"),ue.setOptional(U,O,"bindMatrixInverse");const ke=O.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),ue.setValue(U,"boneTexture",ke.boneTexture,It))}O.isBatchedMesh&&(ue.setOptional(U,O,"batchingTexture"),ue.setValue(U,"batchingTexture",O._matricesTexture,It),ue.setOptional(U,O,"batchingIdTexture"),ue.setValue(U,"batchingIdTexture",O._indirectTexture,It),ue.setOptional(U,O,"batchingColorTexture"),O._colorsTexture!==null&&ue.setValue(U,"batchingColorTexture",O._colorsTexture,It));const on=V.morphAttributes;if((on.position!==void 0||on.normal!==void 0||on.color!==void 0)&&Q.update(O,V,Ze),(Je||Ct.receiveShadow!==O.receiveShadow)&&(Ct.receiveShadow=O.receiveShadow,ue.setValue(U,"receiveShadow",O.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(rn.envMap.value=mt,rn.flipEnvMap.value=mt.isCubeTexture&&mt.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&B.environment!==null&&(rn.envMapIntensity.value=B.environmentIntensity),Je&&(ue.setValue(U,"toneMappingExposure",v.toneMappingExposure),Ct.needsLights&&Wf(rn,Ds),tt&&W.fog===!0&&Z.refreshFogUniforms(rn,tt),Z.refreshMaterialUniforms(rn,W,G,$,p.state.transmissionRenderTarget[A.id]),_o.upload(U,Ol(Ct),rn,It)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(_o.upload(U,Ol(Ct),rn,It),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ue.setValue(U,"center",O.center),ue.setValue(U,"modelViewMatrix",O.modelViewMatrix),ue.setValue(U,"normalMatrix",O.normalMatrix),ue.setValue(U,"modelMatrix",O.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const ke=W.uniformsGroups;for(let Ye=0,Oo=ke.length;Ye<Oo;Ye++){const mi=ke[Ye];Lt.update(mi,Ze),Lt.bind(mi,Ze)}}return Ze}function Wf(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function Xf(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(A,B,V){const W=_t.get(A);W.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),_t.get(A.texture).__webglTexture=B,_t.get(A.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:V,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,B){const V=_t.get(A);V.__webglFramebuffer=B,V.__useDefaultFramebuffer=B===void 0};const qf=U.createFramebuffer();this.setRenderTarget=function(A,B=0,V=0){R=A,T=B,E=V;let W=!0,O=null,tt=!1,ut=!1;if(A){const mt=_t.get(A);if(mt.__useDefaultFramebuffer!==void 0)dt.bindFramebuffer(U.FRAMEBUFFER,null),W=!1;else if(mt.__webglFramebuffer===void 0)It.setupRenderTarget(A);else if(mt.__hasExternalTextures)It.rebindTextures(A,_t.get(A.texture).__webglTexture,_t.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const At=A.depthTexture;if(mt.__boundDepthTexture!==At){if(At!==null&&_t.has(At)&&(A.width!==At.image.width||A.height!==At.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");It.setupDepthRenderbuffer(A)}}const Pt=A.texture;(Pt.isData3DTexture||Pt.isDataArrayTexture||Pt.isCompressedArrayTexture)&&(ut=!0);const Dt=_t.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Dt[B])?O=Dt[B][V]:O=Dt[B],tt=!0):A.samples>0&&It.useMultisampledRTT(A)===!1?O=_t.get(A).__webglMultisampledFramebuffer:Array.isArray(Dt)?O=Dt[V]:O=Dt,C.copy(A.viewport),D.copy(A.scissor),I=A.scissorTest}else C.copy(Mt).multiplyScalar(G).floor(),D.copy(pt).multiplyScalar(G).floor(),I=Vt;if(V!==0&&(O=qf),dt.bindFramebuffer(U.FRAMEBUFFER,O)&&W&&dt.drawBuffers(A,O),dt.viewport(C),dt.scissor(D),dt.setScissorTest(I),tt){const mt=_t.get(A.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+B,mt.__webglTexture,V)}else if(ut){const mt=B;for(let Pt=0;Pt<A.textures.length;Pt++){const Dt=_t.get(A.textures[Pt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Pt,Dt.__webglTexture,V,mt)}}else if(A!==null&&V!==0){const mt=_t.get(A.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,mt.__webglTexture,V)}b=-1},this.readRenderTargetPixels=function(A,B,V,W,O,tt,ut,bt=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let mt=_t.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ut!==void 0&&(mt=mt[ut]),mt){dt.bindFramebuffer(U.FRAMEBUFFER,mt);try{const Pt=A.textures[bt],Dt=Pt.format,At=Pt.type;if(!wt.textureFormatReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!wt.textureTypeReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-W&&V>=0&&V<=A.height-O&&(A.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+bt),U.readPixels(B,V,W,O,ht.convert(Dt),ht.convert(At),tt))}finally{const Pt=R!==null?_t.get(R).__webglFramebuffer:null;dt.bindFramebuffer(U.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(A,B,V,W,O,tt,ut,bt=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let mt=_t.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ut!==void 0&&(mt=mt[ut]),mt)if(B>=0&&B<=A.width-W&&V>=0&&V<=A.height-O){dt.bindFramebuffer(U.FRAMEBUFFER,mt);const Pt=A.textures[bt],Dt=Pt.format,At=Pt.type;if(!wt.textureFormatReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!wt.textureTypeReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Gt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Gt),U.bufferData(U.PIXEL_PACK_BUFFER,tt.byteLength,U.STREAM_READ),A.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+bt),U.readPixels(B,V,W,O,ht.convert(Dt),ht.convert(At),0);const Zt=R!==null?_t.get(R).__webglFramebuffer:null;dt.bindFramebuffer(U.FRAMEBUFFER,Zt);const de=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Fd(U,de,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Gt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,tt),U.deleteBuffer(Gt),U.deleteSync(de),tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,B=null,V=0){const W=Math.pow(2,-V),O=Math.floor(A.image.width*W),tt=Math.floor(A.image.height*W),ut=B!==null?B.x:0,bt=B!==null?B.y:0;It.setTexture2D(A,0),U.copyTexSubImage2D(U.TEXTURE_2D,V,0,0,ut,bt,O,tt),dt.unbindTexture()};const Yf=U.createFramebuffer(),$f=U.createFramebuffer();this.copyTextureToTexture=function(A,B,V=null,W=null,O=0,tt=null){tt===null&&(O!==0?(lr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),tt=O,O=0):tt=0);let ut,bt,mt,Pt,Dt,At,Gt,Zt,de;const oe=A.isCompressedTexture?A.mipmaps[tt]:A.image;if(V!==null)ut=V.max.x-V.min.x,bt=V.max.y-V.min.y,mt=V.isBox3?V.max.z-V.min.z:1,Pt=V.min.x,Dt=V.min.y,At=V.isBox3?V.min.z:0;else{const on=Math.pow(2,-O);ut=Math.floor(oe.width*on),bt=Math.floor(oe.height*on),A.isDataArrayTexture?mt=oe.depth:A.isData3DTexture?mt=Math.floor(oe.depth*on):mt=1,Pt=0,Dt=0,At=0}W!==null?(Gt=W.x,Zt=W.y,de=W.z):(Gt=0,Zt=0,de=0);const ne=ht.convert(B.format),Ct=ht.convert(B.type);let le;B.isData3DTexture?(It.setTexture3D(B,0),le=U.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(It.setTexture2DArray(B,0),le=U.TEXTURE_2D_ARRAY):(It.setTexture2D(B,0),le=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment);const Yt=U.getParameter(U.UNPACK_ROW_LENGTH),Ze=U.getParameter(U.UNPACK_IMAGE_HEIGHT),zi=U.getParameter(U.UNPACK_SKIP_PIXELS),Je=U.getParameter(U.UNPACK_SKIP_ROWS),Ds=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,oe.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,oe.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Pt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Dt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,At);const ue=A.isDataArrayTexture||A.isData3DTexture,rn=B.isDataArrayTexture||B.isData3DTexture;if(A.isDepthTexture){const on=_t.get(A),ke=_t.get(B),Ye=_t.get(on.__renderTarget),Oo=_t.get(ke.__renderTarget);dt.bindFramebuffer(U.READ_FRAMEBUFFER,Ye.__webglFramebuffer),dt.bindFramebuffer(U.DRAW_FRAMEBUFFER,Oo.__webglFramebuffer);for(let mi=0;mi<mt;mi++)ue&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,_t.get(A).__webglTexture,O,At+mi),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,_t.get(B).__webglTexture,tt,de+mi)),U.blitFramebuffer(Pt,Dt,ut,bt,Gt,Zt,ut,bt,U.DEPTH_BUFFER_BIT,U.NEAREST);dt.bindFramebuffer(U.READ_FRAMEBUFFER,null),dt.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(O!==0||A.isRenderTargetTexture||_t.has(A)){const on=_t.get(A),ke=_t.get(B);dt.bindFramebuffer(U.READ_FRAMEBUFFER,Yf),dt.bindFramebuffer(U.DRAW_FRAMEBUFFER,$f);for(let Ye=0;Ye<mt;Ye++)ue?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,on.__webglTexture,O,At+Ye):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,on.__webglTexture,O),rn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ke.__webglTexture,tt,de+Ye):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ke.__webglTexture,tt),O!==0?U.blitFramebuffer(Pt,Dt,ut,bt,Gt,Zt,ut,bt,U.COLOR_BUFFER_BIT,U.NEAREST):rn?U.copyTexSubImage3D(le,tt,Gt,Zt,de+Ye,Pt,Dt,ut,bt):U.copyTexSubImage2D(le,tt,Gt,Zt,Pt,Dt,ut,bt);dt.bindFramebuffer(U.READ_FRAMEBUFFER,null),dt.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else rn?A.isDataTexture||A.isData3DTexture?U.texSubImage3D(le,tt,Gt,Zt,de,ut,bt,mt,ne,Ct,oe.data):B.isCompressedArrayTexture?U.compressedTexSubImage3D(le,tt,Gt,Zt,de,ut,bt,mt,ne,oe.data):U.texSubImage3D(le,tt,Gt,Zt,de,ut,bt,mt,ne,Ct,oe):A.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,tt,Gt,Zt,ut,bt,ne,Ct,oe.data):A.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,tt,Gt,Zt,oe.width,oe.height,ne,oe.data):U.texSubImage2D(U.TEXTURE_2D,tt,Gt,Zt,ut,bt,ne,Ct,oe);U.pixelStorei(U.UNPACK_ROW_LENGTH,Yt),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ze),U.pixelStorei(U.UNPACK_SKIP_PIXELS,zi),U.pixelStorei(U.UNPACK_SKIP_ROWS,Je),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ds),tt===0&&B.generateMipmaps&&U.generateMipmap(le),dt.unbindTexture()},this.initRenderTarget=function(A){_t.get(A).__webglFramebuffer===void 0&&It.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?It.setTextureCube(A,0):A.isData3DTexture?It.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?It.setTexture2DArray(A,0):It.setTexture2D(A,0),dt.unbindTexture()},this.resetState=function(){T=0,E=0,R=null,dt.reset(),it.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}}const cv=ye.prototype.updateMatrixWorld;function yf(i,t=!1){if(i.updateMatrixWorld!==cv){i.updateMatrixWorld(t);return}i.matrixAutoUpdate&&i.updateMatrix(),(i.matrixWorldNeedsUpdate||t)&&(i.matrixWorldAutoUpdate&&(i.parent===null?i.matrixWorld.copy(i.matrix):i.matrixWorld.multiplyMatrices(i.parent.matrixWorld,i.matrix)),i.matrixWorldNeedsUpdate=!1,t=!0);const e=i.children,n=i.isLOD;for(let s=0;s<e.length;s++){const r=e[s];if(r.visible||n||r.isBone){yf(r,t);continue}r.matrixAutoUpdate&&r.updateMatrix(),r.matrixWorldAutoUpdate&&(t||r.matrixWorldNeedsUpdate)&&r.matrixWorld.multiplyMatrices(i.matrixWorld,r.matrix),r.matrixWorldNeedsUpdate=!0}}class lv{map=new Map;taps=new Set;on(t,e){let n=this.map.get(t);return n||(n=new Set,this.map.set(t,n)),n.add(e),()=>this.off(t,e)}off(t,e){this.map.get(t)?.delete(e)}tap(t){this.taps.add(t),this.tapList=null}emit(t,e){let n=this.tapList;n||(n=this.tapList=[...this.taps]);for(let r=0;r<n.length;r++)n[r](t,e);const s=this.map.get(t);if(!(!s||s.size===0)){if(s.size===1){for(const r of s)r(e);return}for(const r of[...s])r(e)}}tapList=null;clear(){this.map.clear()}}const Mf=`layout(std140) uniform SgLights {
	PointLight point[ NUM_POINT_LIGHTS ];
	DirectionalLight dir[ NUM_DIR_LIGHTS ];
	HemisphereLight hemi[ NUM_HEMI_LIGHTS ];
} sgL;
#define pointLights sgL.point
#define directionalLights sgL.dir
#define hemisphereLights sgL.hemi`,Sf="#if NUM_POINT_LIGHTS > 0 && NUM_DIR_LIGHTS > 0 && NUM_HEMI_LIGHTS > 0",uv=`${Sf}
struct DirectionalLight { vec3 direction; vec3 color; };
struct PointLight { vec3 position; vec3 color; float distance; float decay; };
struct HemisphereLight { vec3 direction; vec3 skyColor; vec3 groundColor; };
${Mf}
#elif NUM_POINT_LIGHTS > 0
struct PointLight { vec3 position; vec3 color; float distance; float decay; };
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
#endif`;{const i=Bt;let t=i.lights_pars_begin;if(!t.includes("SgLights")){const e=n=>{if(!t.includes(n))throw new Error(`lightblock: three.js's lights_pars_begin has no "${n}"`);t=t.replace(n,`#ifndef SG_LIGHT_BLOCK
	${n}
	#endif`)};e("uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];"),e("uniform PointLight pointLights[ NUM_POINT_LIGHTS ];"),e("uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];"),i.lights_pars_begin=`${Sf}
#define SG_LIGHT_BLOCK
#endif
${t}
#ifdef SG_LIGHT_BLOCK
${Mf}
#endif
`}}const zu=4096;class hv{constructor(t,e){this.renderer=t,this.scene=e,this.gl=t.getContext(),this.bind();const n=this;Bi.prototype.onBeforeRender=function(s,r){r===n.scene&&n.send(s)},t.domElement.addEventListener("webglcontextrestored",()=>{this.gl=t.getContext(),this.point=this.dir=this.hemi=null,this.restored=!0,this.sentFrame=-1,this.bind()})}gl;buffer=null;data=new Float32Array(zu/4);point=null;dir=null;hemi=null;sentFrame=-1;restored=!1;bind(){const t=this.gl;this.buffer=t.createBuffer(),t.bindBuffer(t.UNIFORM_BUFFER,this.buffer),t.bufferData(t.UNIFORM_BUFFER,zu,t.DYNAMIC_DRAW),t.bindBufferBase(t.UNIFORM_BUFFER,0,this.buffer)}adopt(){let t=null;return this.scene.traverse(e=>{if(t)return;const n=e.material;for(const s of Array.isArray(n)?n:n?[n]:[]){const r=this.renderer.properties.get(s).uniforms;if(r?.pointLights&&r.directionalLights&&r.hemisphereLights){t=s,this.point=r.pointLights.value,this.dir=r.directionalLights.value,this.hemi=r.hemisphereLights.value;return}}}),t&&this.check(t),t!==null}check(t){const e=this.renderer.properties.get(t).currentProgram?.program;if(!e)return;const n=this.gl,s=["SgLights.point[0].color","SgLights.point[0].distance","SgLights.dir[0].direction","SgLights.hemi[0].groundColor"],r=n.getUniformIndices(e,s);if(!r||r.some(l=>l===n.INVALID_INDEX))return;const o=n.getActiveUniforms(e,r,n.UNIFORM_OFFSET),a=this.point.length,c=[16,28,48*a,48*a+32*this.dir.length+32];c.some((l,h)=>o[h]!==l)&&console.warn("lightblock: the driver lays the light block out otherwise",o,c)}send(t){const e=t.info.render.frame;if(e===this.sentFrame)return;if(this.sentFrame=e,this.restored){if(!this.adopt())return;this.restored=!1}const n=this.point,s=this.dir,r=this.hemi;if(!n||!s||!r)return;const o=this.data,a=48*n.length,c=a+32*s.length,l=c+48*r.length>>2;if(l>o.length)return;for(let f=0;f<n.length;f++){const u=n[f],d=f*12;o[d]=u.position.x,o[d+1]=u.position.y,o[d+2]=u.position.z,o[d+4]=u.color.r,o[d+5]=u.color.g,o[d+6]=u.color.b,o[d+7]=u.distance,o[d+8]=u.decay}for(let f=0;f<s.length;f++){const u=s[f],d=(a>>2)+f*8;o[d]=u.direction.x,o[d+1]=u.direction.y,o[d+2]=u.direction.z,o[d+4]=u.color.r,o[d+5]=u.color.g,o[d+6]=u.color.b}for(let f=0;f<r.length;f++){const u=r[f],d=(c>>2)+f*12;o[d]=u.direction.x,o[d+1]=u.direction.y,o[d+2]=u.direction.z,o[d+4]=u.skyColor.r,o[d+5]=u.skyColor.g,o[d+6]=u.skyColor.b,o[d+8]=u.groundColor.r,o[d+9]=u.groundColor.g,o[d+10]=u.groundColor.b}const h=this.gl;h.bindBuffer(h.UNIFORM_BUFFER,this.buffer),h.bufferSubData(h.UNIFORM_BUFFER,0,o,0,l)}}const ur=512;let Fn=ur;function Sn(i,t,e){let n=Math.imul(i,374761393)+Math.imul(t,668265263)+Math.imul(e,1274126177);return n=n^n>>>13|0,n=Math.imul(n,1274126177),((n^n>>>16)>>>0)/4294967295}function fv(i,t,e,n){const s=Math.floor(i),r=Math.floor(t),o=i-s,a=t-r,c=o*o*(3-2*o),l=a*a*(3-2*a),h=M=>(M%e+e)%e,f=h(s),u=h(s+1),d=h(r),g=h(r+1),_=Sn(f,d,n),m=Sn(u,d,n),p=Sn(f,g,n),y=Sn(u,g,n),x=_+(m-_)*c,v=p+(y-p)*c;return x+(v-x)*l}function Oc(i,t,e,n,s){let r=0,o=.5,a=n,c=0;for(let l=0;l<e;l++)r+=fv(i*a/n,t*a/n,a,s+l*17)*o,c+=o,o*=.5,a*=2;return r/c}function he(i,t,e,n,s){return Oc(i*n/Fn,t*n/Fn,e,n,s)}function dv(i,t,e,n,s){const r=Math.floor(i),o=Math.floor(t),a=i-r,c=t-o,l=a*a*(3-2*a),h=c*c*(3-2*c),f=E=>(E%e+e)%e,u=E=>(E%n+n)%n,d=f(r),g=f(r+1),_=u(o),m=u(o+1),p=Sn(d,_,s),y=Sn(g,_,s),x=Sn(d,m,s),v=Sn(g,m,s),M=p+(y-p)*l,T=x+(v-x)*l;return M+(T-M)*h}function bf(i,t,e,n,s,r){let o=0,a=.5,c=0,l=n,h=s;for(let f=0;f<e;f++)o+=dv(i*l/Fn,t*h/Fn,l,h,r+f*17)*a,c+=a,a*=.5,l*=2,h*=2;return o/c}function Ef(i,t,e){const n=Math.max(0,Math.min(1,(e-i)/(t-i)));return n*n*(3-2*n)}function wf(i){if(typeof document>"u")return null;const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d");return e?{c:t,ctx:e}:null}function pv(i,t){const e=wf(t);if(!e)return null;Fn=t;const n=e.ctx.createImageData(t,t),s=new Float32Array(t*t);for(let r=0;r<t;r++)for(let o=0;o<t;o++){const{rgb:a,h:c}=i(o,r),l=(r*t+o)*4;n.data[l]=a[0],n.data[l+1]=a[1],n.data[l+2]=a[2],n.data[l+3]=255,s[r*t+o]=c}return e.ctx.putImageData(n,0,0),Fn=ur,{color:e.c,height:s}}function mv(i,t,e){const n=wf(e);if(!n)return null;const s=n.ctx.createImageData(e,e),r=(o,a)=>i[(a%e+e)%e*e+(o%e+e)%e]??0;for(let o=0;o<e;o++)for(let a=0;a<e;a++){const c=r(a-1,o-1)+2*r(a-1,o)+r(a-1,o+1)-(r(a+1,o-1)+2*r(a+1,o)+r(a+1,o+1)),l=r(a-1,o-1)+2*r(a,o-1)+r(a+1,o-1)-(r(a-1,o+1)+2*r(a,o+1)+r(a+1,o+1));let h=c*t,f=l*t;const u=1,d=Math.hypot(h,f,u)||1;h/=d,f/=d;const g=(o*e+a)*4;s.data[g]=(h*.5+.5)*255,s.data[g+1]=(f*.5+.5)*255,s.data[g+2]=u/d*.5*255+128,s.data[g+3]=255}return n.ctx.putImageData(s,0,0),n.c}function ku(i,t){const e=new vl(i);return e.wrapS=Ii,e.wrapT=Ii,e.anisotropy=16,e.colorSpace=t?Le:Cn,e}function qt(i){return i<0?0:i>255?255:i}function gv(i){return i<0?0:i>1?1:i}function ai(i){return i*Fn/ur}function Sl(i){return Fn/i}function _v(i,t){const e=Fn,n=e/4,s=e/2,r=Math.floor(i/n),o=Math.floor(t/s),a=i-r*n,c=t-o*s,l=(Sn(r&3,o&1,71)-.5)*10,h=he(i,t,2,96,3),f=he(i,t,3,20,9),u=he(i,t,3,5,21),d=bf(i,t,2,40,3,33);let g=190+(h-.5)*14+(f-.5)*12+(u-.5)*16+l;g-=Math.max(0,d-.55)*34;let _=.5+(h-.5)*.07+(f-.5)*.12;const m=Math.min(a,n-a,c,s-c),p=ai(1.6);if(m<p){const E=1-m/p;g-=26*E,_+=.22*E}const y=a-n*.5,x=c-s*(c<s*.5?.25:.75),v=Math.hypot(y,x),M=e*.0065;if(v<M){const E=Math.min(1,(1-v/M)*1.8);g-=72*E,_-=.6*E}else if(v<M*1.7){const E=1-(v-M)/(M*.7);g+=7*E,_+=.08*E}const T=he(i,t,2,64,44);if(T>.83){const E=(T-.83)*6;g-=40*E,_-=.7*E}return{rgb:[qt(g),qt(g*.995),qt(g*.982)],h:_}}function vv(i,t){const e=Fn,n=e/4,s=Math.floor(t/n),r=e/2,o=(i+s%2*r*.5)%e,a=Math.floor(o/r),c=o-a*r,l=t-s*n,h=Sn(a&1,s&3,19)-.5,f=he(i,t,3,32,5),u=bf(i,t,2,4,72,15);let d=178+h*16+(f-.5)*9+(u-.5)*12,g=.62+(f-.5)*.06;const _=Math.min(c,r-c,l,n-l),m=ai(2.6),p=ai(4);if(_<m){const T=1-_/m;d-=62*T,g=.18}else if(_<m+p){const T=Ef(0,1,(_-m)/p);g=.18+.44*T,d+=5*(1-T)}const y=Math.max(0,(l/n-.55)/.45)*(.4+he(i,t,2,24,88));d-=y*16;const x=r/8,v=(c%x+x)%x-x/2,M=ai(3.2);for(const T of[l-ai(10),l-(n-ai(10))]){const E=Math.hypot(v,T);if(E<M){const R=1-E/M;d+=30*R,g+=.34*R}}return{rgb:[qt(d),qt(d*.99),qt(d*.968)],h:g}}function Hu(i,t){const e=he(i*.18,t*1.8,2,128,11),n=he(i,t,3,24,31),s=176+(e-.5)*26+(n-.5)*26,r=.5+(e-.5)*.5;return{rgb:[qt(s*.96),qt(s*.98),qt(s*1.04)],h:r}}function xv(i,t){const e=Sl(16),n=i%e,s=t%e,r=ai(9),o=n<r||s<r,a=he(i,t,3,32,7);if(o){const l=168+(a-.5)*28;return{rgb:[qt(l*.97),qt(l),qt(l*1.03)],h:.95}}const c=28+(a-.5)*16;return{rgb:[qt(c),qt(c),qt(c*1.1)],h:.05}}function yv(i,t){const e=Sl(10.67),n=(i+t)%e/e,s=ai(1.1)/e,r=.5+.5*Math.max(-1,Math.min(1,Math.sin(2*Math.PI*n)/(2*Math.PI*s))),o=he(i,t,3,20,13),a=he(i,t,3,6,29),c=he(i,t,2,56,37),l=c>.79?Math.min(1,(c-.79)*12):0,h=o>.64?(o-.64)*2.4:0,f=34+(o-.5)*20+h*70,u=(206+(o-.5)*22)*(1-h*.25);let d=u+(f-u)*r,g=u*.72+(f*.96-u*.72)*r,_=u*.14+(f*.9-u*.14)*r;const m=1-Math.max(0,a-.5)*.35;d*=m,g*=m,_*=m;const p=96+(o-.5)*20;return d+=(p-d)*l,g+=(p-g)*l,_+=(p*1.02-_)*l,{rgb:[qt(d),qt(g),qt(_)],h:.55-r*.04+h*.1-l*.22}}function Mv(i,t){const e=he(i,t,3,8,17),n=he(i,t,2,16,29),s=gv((e-.34)*2.4-(n-.5)*.5),r=s*s*(3-2*s),o=1-r,a=o*o,c=40+a*215,l=12+a*a*138,h=6+a*a*a*34,f=16+n*20,u=r;return{rgb:[qt(c*(1-u)+f*1.25*u),qt(l*(1-u)+f*.8*u),qt(h*(1-u)+f*.85*u)],h:.38+r*.42+n*.08}}function Sv(i,t){const e=he(i*.25,t*4,3,16,23),n=he(i,t,3,6,71),s=he(i,t,2,40,83);let r=.84+(e-.5)*.26+(n-.5)*.16;const o=s>.76?(s-.76)*3.2:0,a=196*r,c=28*r,l=48*r,h=112*r;return{rgb:[qt(a+(h-a)*o),qt(c+(h-c)*o),qt(l+(h*1.04-l)*o)],h:.5+(e-.5)*.4-o*.25}}function bv(i,t){const e=he(i,t,4,20,37),n=he(i,t,2,5,91),s=he(i*.3,t*3.2,2,32,101),r=46+(e-.5)*26+(n-.5)*12,o=.5+(e-.5)*.7+(n-.5)*.25+(s-.5)*.3;return{rgb:[qt(r),qt(r),qt(r*1.14)],h:o}}function Ev(i,t){const e=Sl(8),n=Math.floor(i/e),s=Math.floor(t/e),r=i-n*e,o=t-s*e,a=Math.min(r,e-r,o,e-o),c=Math.max(1.5,e*.032),l=e*.055,h=he(i,t,3,48,41);if(a<c){const p=116+(h-.5)*18;return{rgb:[qt(p),qt(p*.99),qt(p*.97)],h:.1}}const f=Sn(n&7,s&7,53)-.5,u=he(i,t,2,150,61),d=he(i,t,3,4,77);let g=205+f*18+(h-.5)*7-(d-.5)*12;u>.7?g-=(u-.7)*150:u<.28&&(g+=(.28-u)*55);const m=.1+.7*Ef(0,1,(a-c)/l)+(h-.5)*.03;return{rgb:[qt(g*(1+f*.018)),qt(g*.992),qt(g*(.978-f*.018))],h:m}}const Tf={concrete:{fn:_v,scale:.25,normalStrength:1.3},panel:{fn:vv,scale:.18,normalStrength:2.6},metal:{fn:Hu,scale:.3,normalStrength:1.2},grate:{fn:xv,scale:.4,normalStrength:3.4},hazard:{fn:yv,scale:.25,normalStrength:1.2},lava:{fn:Mv,scale:.16,normalStrength:2.2},accent:{fn:Sv,scale:.3,normalStrength:1},dark:{fn:bv,scale:.3,normalStrength:1.2},tile:{fn:Ev,scale:.2,normalStrength:2.4},padglow:{fn:Hu,scale:.3,normalStrength:1}},Vu=new Map;let Gu=null;function wv(){const i=Gu;return Gu=null,i}function zc(i){const t=Vu.get(i);if(t)return t;const e=Tf[i],n=pv(e.fn,ur),s={map:null,normalMap:null,scale:e.scale};if(n){s.map=ku(n.color,!0);const r=mv(n.height,e.normalStrength,ur);r&&(s.normalMap=ku(r,!1))}return Vu.set(i,s),s}const Ts=Object.keys(Tf),kc={concrete:{color:16777215,shininess:2,specular:460551},panel:{color:16777215,shininess:8,specular:1184276},metal:{color:16777215,shininess:22,specular:2369067},grate:{color:16777215,shininess:14,specular:1513757},hazard:{color:16777215,shininess:6,specular:921098},lava:{color:16777215,shininess:2,specular:0,emissive:16747052,emissiveIntensity:2.1},accent:{color:16777215,shininess:7,specular:1181449},dark:{color:16777215,shininess:11,specular:921105},tile:{color:16777215,shininess:18,specular:1710622},padglow:{color:16777215,shininess:2,specular:0,emissive:3992319,emissiveIntensity:2.6}},Hc=new Map;function Tv(i){for(const[t,e]of Hc)if(e===i)return t}function Av(i){const t=Hc.get("lava");if(!t)return;const e=i*.013,n=i*.021;t.map&&t.map.offset.set(e,n),t.normalMap&&t.normalMap.offset.set(e,n),t.map?.updateMatrix(),t.normalMap?.updateMatrix();const s=Math.sin(i*1.1)*.5+Math.sin(i*.37)*.3;t.emissiveIntensity=2.1+s*.42;const r=Hc.get("padglow");r&&(r.emissiveIntensity=2.6+Math.sin(i*2.6)*.55)}function Rv(i){return zc(i).scale}const Cv=`
vec2 lvHash2( vec2 p ) {
  p = vec2( dot( p, vec2( 127.1, 311.7 ) ), dot( p, vec2( 269.5, 183.3 ) ) );
  return fract( sin( p ) * 43758.5453 );
}
float lvHash( vec2 p ) { return fract( sin( dot( p, vec2( 41.3, 289.1 ) ) ) * 45758.5453 ); }
float lvNoise( vec2 p ) {
  vec2 i = floor( p ), f = fract( p );
  f = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( lvHash( i ), lvHash( i + vec2( 1.0, 0.0 ) ), f.x ), mix( lvHash( i + vec2( 0.0, 1.0 ) ), lvHash( i + vec2( 1.0, 1.0 ) ), f.x ), f.y );
}
float lvFbm( vec2 p ) { return 0.62 * lvNoise( p ) + 0.38 * lvNoise( p * 2.07 + 13.1 ); }
// The crust's cells: distance to the nearest plate centre, distance to the crack (second nearest minus nearest), the plate.
vec3 lvCells( vec2 p, float t ) {
  vec2 i = floor( p ), f = fract( p );
  float d1 = 8.0, d2 = 8.0, id = 0.0;
  for ( int y = -1; y <= 1; y ++ ) {
    for ( int x = -1; x <= 1; x ++ ) {
      vec2 g = vec2( float( x ), float( y ) );
      vec2 o = lvHash2( i + g );
      // Plates jostle: their centres wander a little, so the cracks open and close.
      o = 0.5 + 0.36 * sin( t * 0.3 + 6.2831 * o );
      vec2 r = g + o - f;
      float d = dot( r, r );
      if ( d < d1 ) { d2 = d1; d1 = d; id = lvHash( i + g ); } else if ( d < d2 ) { d2 = d; }
    }
  }
  return vec3( sqrt( d1 ), sqrt( d2 ) - sqrt( d1 ), id );
}
// p: metres on the surface. t: seconds. par: the line of sight's slant (how far it travels across per metre down).
void lvSurface( vec2 p, float t, vec2 par, out vec3 emis, out vec3 albedo, out float h ) {
  // The current: the whole skin drifts, warped so it moves like something thick rather than sliding as a sheet.
  vec2 warp = vec2( lvFbm( p * 0.19 + vec2( 0.0, t * 0.035 ) ), lvFbm( p * 0.19 + vec2( 5.2, -t * 0.03 ) ) );
  vec2 q = p * 0.55 + warp * 2.3 + vec2( t * 0.045, t * 0.028 );
  // Ragged edges: the cells are looked up through a fine jitter, so no crack runs straight.
  vec2 jag = vec2( lvNoise( q * 3.1 ), lvNoise( q * 3.1 + 7.7 ) ) - 0.5;
  vec3 c = lvCells( q + jag * 0.24, t );
  // Channels where the crust has torn open and the melt runs in rivers between broken bits of it.
  float chan = smoothstep( 0.56, 0.8, lvFbm( p * 0.11 + vec2( t * 0.018, -t * 0.011 ) ) );
  // The grain of the basalt: rough, pitted rock, not a smooth fill.
  float grain = lvFbm( q * 5.3 );
  // A few plates still soft, glowing through in patches, each on its own slow beat.
  float soft = smoothstep( 0.84, 1.0, c.z ) * ( 0.35 + 0.65 * lvNoise( q * 2.6 + t * 0.15 ) ) * ( 0.8 + 0.2 * sin( t * ( 0.6 + c.z ) + c.z * 40.0 ) );
  // The melt under the crust, seen at a depth along the view: it slides against the plates as you move.
  float m = lvFbm( q * 1.9 + par * 0.55 + vec2( t * 0.12, -t * 0.09 ) );
  // Cracks from hairlines to gaps, per plate and along their length; wide open in the channels.
  float crackW = ( 0.015 + 0.13 * lvNoise( q * 0.9 + c.z * 5.0 ) ) * ( 1.0 + 3.5 * chan );
  float crack = 1.0 - smoothstep( 0.0, crackW, c.y );
  // Just inside a plate's edge it is still red-hot.
  float rim = exp( -c.y * 13.0 ) * ( 1.0 - crack );
  vec3 melt = mix( vec3( 1.0, 0.2, 0.02 ), vec3( 1.0, 0.7, 0.22 ), m * m ) * ( 1.5 + 1.5 * m );
  emis = melt * ( crack * ( 0.7 + 0.6 * m ) + soft * 0.34 * ( 1.0 - crack ) ) + vec3( 0.9, 0.15, 0.02 ) * rim * 0.5;
  // Cooled basalt, a little warm where it is nearest the heat.
  albedo = mix( vec3( 0.03, 0.024, 0.022 ), vec3( 0.085, 0.065, 0.055 ), grain );
  albedo = mix( albedo, vec3( 0.16, 0.05, 0.02 ), max( rim, soft * 0.6 ) );
  // Plates proud, rounded off at their edges; soft ones sag; pitted all over; the cracks low.
  h = smoothstep( 0.0, 0.24, c.y ) * ( 1.0 - 0.6 * soft ) + 0.38 * grain;
}
// Relief from a height, per pixel, from the height's own screen derivatives (no tangents needed).
vec3 lvBump( vec3 surfPos, vec3 surfNorm, float height, float scale ) {
  vec3 sx = dFdx( surfPos ), sy = dFdy( surfPos );
  vec3 r1 = cross( sy, surfNorm ), r2 = cross( surfNorm, sx );
  float det = dot( sx, r1 );
  vec2 dh = vec2( dFdx( height ), dFdy( height ) ) * scale;
  vec3 grad = sign( det ) * ( dh.x * r1 + dh.y * r2 );
  return normalize( abs( det ) * surfNorm - grad );
}
`;function hr(i){return Ts.indexOf(i)}const je=Ts.length;let Si=null;const Ne={uMapArray:{value:null},uNormalArray:{value:null},uSpecular:{value:Array.from({length:je},()=>new Ut(0,0,0))},uShininess:{value:Array.from({length:je},()=>30)},uEmissive:{value:Array.from({length:je},()=>new Ut(0,0,0))},uOffset:{value:Array.from({length:je},()=>new Ot(0,0))},uMean:{value:Array.from({length:je},()=>new Ut(.5,.5,.5))},uLavaTime:{value:0}},Pv=1.15,Lv=.18,xa=[[.89,.98,1.14],[1.11,1,.85],[.94,1.07,.93],[1,1,1],[1.1,.95,.95],[.9,1.04,1.07]],Dv={concrete:1,panel:1,metal:.8,tile:.8,dark:.7,grate:.6};let Wu=[];function Uv(i,t,e){const n=new Uint8Array(t*t*4),s=i?.image;if(!i||!s||typeof document>"u"){for(let c=0;c<n.length;c+=4)n[c]=e[0],n[c+1]=e[1],n[c+2]=e[2],n[c+3]=255;return n}const r=document.createElement("canvas");r.width=r.height=t;const o=r.getContext("2d",{willReadFrequently:!0});o.drawImage(s,0,0,t,t);const a=o.getImageData(0,0,t,t).data;if(i.flipY){const c=t*4;for(let l=0;l<t;l++)n.set(a.subarray((t-1-l)*c,(t-l)*c),l*c)}else n.set(a);return n}function Xu(i,t,e){let n=0;for(const a of Ts){const c=i(a)?.image;c?.width&&(n=Math.max(n,c.width))}n===0&&(n=4);const s=n*n*4,r=new Uint8Array(s*je);Ts.forEach((a,c)=>r.set(Uv(i(a),n,t),c*s));const o=new gl(r,n,n,je);return o.format=sn,o.type=wn,o.wrapS=Ii,o.wrapT=Ii,o.magFilter=hn,o.minFilter=ci,o.generateMipmaps=!0,o.anisotropy=2,o.colorSpace=e?Le:Cn,o.needsUpdate=!0,o}function Iv(){Ts.forEach((i,t)=>{const e=kc[i];Ne.uSpecular.value[t].set(e.specular),Ne.uShininess.value[t]=e.shininess,e.emissive!==void 0?Ne.uEmissive.value[t].set(e.emissive).multiplyScalar(e.emissiveIntensity??1):Ne.uEmissive.value[t].set(0)})}function Nv(){for(const o of Wu)o.dispose();const i=Xu(o=>zc(o).map,[200,200,200],!0),t=Xu(o=>zc(o).normalMap,[128,128,255],!1);Wu=[i,t];const e=i.image.data,n=i.image.width*i.image.height,s=o=>{const a=o/255;return a<=.04045?a/12.92:((a+.055)/1.055)**2.4},r=Math.max(1,Math.floor(n/4096));for(let o=0;o<je;o++){let a=0,c=0,l=0,h=0;for(let f=0;f<n;f+=r,h++){const u=(o*n+f)*4;a+=s(e[u]),c+=s(e[u+1]),l+=s(e[u+2])}Ne.uMean.value[o].setRGB(a/h,c/h,l/h)}Ne.uMapArray.value=i,Ne.uNormalArray.value=t}function Fv(i){Object.assign(i.uniforms,Ne);const t=Bt;i.vertexShader=i.vertexShader.replace("void main() {",`attribute vec4 aSurface;
flat varying float vLayer;
flat varying vec2 vTone;
varying vec3 vPointDiffuse;
varying vec3 vLavaWorld;
${uv}
void main() {
	vLayer = aSurface.x;
	vTone = aSurface.yz / 255.0;`).replace("#include <project_vertex>",`#include <project_vertex>
	vLavaWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;
	vPointDiffuse = vec3( 0.0 );
#if NUM_POINT_LIGHTS > 0
	{
		vec3 pn = normalize( transformedNormal );
		for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
			vec3 L = pointLights[ i ].position - mvPosition.xyz;
			float dd = dot( L, L );
			float range = pointLights[ i ].distance;
			// Out of its reach it lights nothing (its fall-off is zero there): the rest is not worked out.
			if ( range > 0.0 && dd >= range * range ) continue;
			float d = sqrt( dd );
			// (Its decay is 2 for every lamp the game makes: the square, not pow.)
			float fall = 1.0 / max( pointLights[ i ].decay == 2.0 ? dd : pow( d, pointLights[ i ].decay ), 0.01 );
			if ( range > 0.0 ) fall *= pow2( saturate( 1.0 - pow4( d / range ) ) );
			vPointDiffuse += pointLights[ i ].color * fall * saturate( dot( pn, L / d ) );
		}
	}
#endif`);const e=`
uniform highp sampler2DArray uMapArray;
uniform highp sampler2DArray uNormalArray;
uniform vec3 uSpecular[ ${je} ];
uniform float uShininess[ ${je} ];
uniform vec3 uEmissive[ ${je} ];
uniform vec2 uOffset[ ${je} ];
uniform vec3 uMean[ ${je} ];
const vec3 uTints[ ${xa.length} ] = vec3[]( ${xa.map(u=>`vec3( ${u.map(d=>d.toFixed(3)).join(", ")} )`).join(", ")} );
const float uTintAmount[ ${je} ] = float[]( ${Ts.map(u=>(Dv[u]??0).toFixed(2)).join(", ")} );
flat varying float vLayer;
flat varying vec2 vTone;
varying vec3 vPointDiffuse;
uniform float uLavaTime;
varying vec3 vLavaWorld;
const int LAVA_LAYER = ${hr("lava")};
${Cv}
`,n=t.normal_fragment_maps.replace(/texture2D\( normalMap, vNormalMapUv \)/g,"texture( uNormalArray, vec3( vNormalMapUv + uOffset[ li ], vLayer ) )"),s=t.lights_phong_fragment.replace("= specular;","= uSpecular[ li ];").replace("= shininess;","= uShininess[ li ];"),o=t.lights_phong_pars_fragment.replace("#define RE_Direct",`
void RE_Direct_Diffuse( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	reflectedLight.directDiffuse += dotNL * directLight.color * BRDF_Lambert( material.diffuseColor );
}
`+"#define RE_Direct");let a=t.lights_fragment_begin;const c=a.indexOf("#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )"),l=a.indexOf("#endif",a.indexOf("#pragma unroll_loop_end",c))+6;c>=0&&l>c&&(a=a.slice(0,c)+`#if ( NUM_POINT_LIGHTS > 0 )
	reflectedLight.directDiffuse += vPointDiffuse * BRDF_Lambert( material.diffuseColor );
#endif`+a.slice(l));const h=a.indexOf("getDirectionalLightInfo( directionalLight, directLight );"),f=a.indexOf("RE_Direct( directLight",h);if(h>=0&&f>=0){const u=a.indexOf(";",f)+1,d=a.slice(f,u);a=a.slice(0,f)+`if ( UNROLLED_LOOP_INDEX == 0 ) { ${d} } else { ${d.replace("RE_Direct(","RE_Direct_Diffuse(")} }`+a.slice(u)}i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
${e}`).replace("#include <map_fragment>",`int li = int( vLayer + 0.5 );
vec4 sampledDiffuseColor = texture( uMapArray, vec3( vMapUv + uOffset[ li ], vLayer ) );
vec3 texel = max( uMean[ li ] + ( sampledDiffuseColor.rgb - uMean[ li ] ) * ${Pv.toFixed(3)}, 0.0 );
float shade = 1.0 + ( vTone.x - 0.5 ) * ${Lv.toFixed(3)};
vec3 tint = mix( vec3( 1.0 ), uTints[ int( vTone.y * ${(xa.length-.001).toFixed(3)} ) ], uTintAmount[ li ] );
diffuseColor.rgb *= texel * shade * tint;
diffuseColor.a *= sampledDiffuseColor.a;
// Lava is not a picture: it is worked out here, in the world, every frame (lavaglsl.ts).
bool isLava = li == LAVA_LAYER;
vec3 lvEmis = vec3( 0.0 );
float lvH = 0.0;
if ( isLava ) {
	vec3 lvAlbedo;
	vec3 lvSight = vLavaWorld - cameraPosition;
	lvSurface( vLavaWorld.xz, uLavaTime, lvSight.xz / max( 0.25, -lvSight.y ), lvEmis, lvAlbedo, lvH );
	diffuseColor.rgb = lvAlbedo;
}`).replace("#include <normal_fragment_maps>",`${n}
// The crust's relief: plates proud of the glowing cracks, lit by the room.
if ( isLava ) normal = lvBump( - vViewPosition, normalize( vNormal ), lvH, 0.14 );`).replace("#include <emissivemap_fragment>","totalEmissiveRadiance = isLava ? lvEmis : uEmissive[ li ] * sampledDiffuseColor.rgb;").replace("#include <lights_phong_fragment>",s).replace("#include <lights_phong_pars_fragment>",o).replace("#include <lights_fragment_begin>",a)}function Qs(){if(Si)return Si;Iv(),Nv();const i=new uf(new Uint8Array([255,255,255,255]),1,1);return i.needsUpdate=!0,Si=new fp({color:16777215,map:i,normalMap:i}),Si.normalScale.set(.85,.85),Si.onBeforeCompile=Fv,Si.customProgramCacheKey=()=>"level-surfaces-v8",Si}let bi=null;function qu(){return bi||(bi=new Po({colorWrite:!1}),bi.polygonOffset=!0,bi.polygonOffsetFactor=1,bi.polygonOffsetUnits=1,bi)}function Bv(i){Qs(),Ne.uMapArray.value&&i.initTexture(Ne.uMapArray.value),Ne.uNormalArray.value&&i.initTexture(Ne.uNormalArray.value)}function Ov(i){const t=hr("lava"),e=hr("padglow");if(Ne.uLavaTime.value=i,t>=0){Ne.uOffset.value[t].set(i*.013,i*.021);const n=kc.lava,s=Math.sin(i*1.1)*.5+Math.sin(i*.37)*.3;Ne.uEmissive.value[t].set(n.emissive).multiplyScalar(2.1+s*.42)}if(e>=0){const n=kc.padglow;Ne.uEmissive.value[e].set(n.emissive).multiplyScalar(2.6+Math.sin(i*2.6)*.55)}}const ns=Math.PI/180;class Do{id;name;tags=new Set;object=new ye;enabled=!0;removed=!1;transient=!1;world;isStatic=!0;needsUpdate=!1;get tickPerFrame(){return!1}frameOwed=0;get frameUrgent(){return!1}constructor(t){this.id=t.id??"",this.name=t.name??"";for(const e of t.tags??[])this.tags.add(e);t.pos&&this.object.position.fromArray(t.pos),t.rot&&this.object.rotation.set((t.rot[0]??0)*ns,(t.rot[1]??0)*ns,(t.rot[2]??0)*ns),t.scale&&this.object.scale.fromArray(t.scale),this.object.updateMatrix(),this.object.matrixAutoUpdate=!this.isStatic}eventsFired(){return[]}eventsHeard(){return[]}onSpawn(){}onUpdate(t){}onDestroy(){}saveState(){}loadState(t){}serializeProps(){return{}}serialize(){const t={type:this.type,id:this.id};this.name&&(t.name=this.name),this.tags.size&&(t.tags=[...this.tags]);const e=this.object.position;(e.x!==0||e.y!==0||e.z!==0)&&(t.pos=[Gn(e.x),Gn(e.y),Gn(e.z)]);const n=this.object.rotation;(n.x!==0||n.y!==0||n.z!==0)&&(t.rot=[Gn(n.x/ns),Gn(n.y/ns),Gn(n.z/ns)]);const s=this.object.scale;(s.x!==1||s.y!==1||s.z!==1)&&(t.scale=[Gn(s.x),Gn(s.y),Gn(s.z)]);const r=this.serializeProps();return Object.keys(r).length&&(t.props=r),t}}function Gn(i){return Math.round(i*1e4)/1e4}function ya(i,t,e){const n=i?.[t];return typeof n=="number"&&Number.isFinite(n)?n:e}function bl(i,t,e){const n=i?.[t];return typeof n=="string"?n:e}function Vc(i,t,e){const n=i?.[t];return typeof n=="boolean"?n:e}function Af(i,t,e){const n=i?.[t];return Array.isArray(n)&&n.length===3&&n.every(s=>typeof s=="number")?[n[0],n[1],n[2]]:e}function zv(i){const[t,e]=i.count,n=new Float32Array(t*e*2);let s=0;for(let r=0;r<e;r++)for(let o=0;o<t;o++)n[s++]=(o+.5-t/2)*i.tile[0],n[s++]=(r+.5-e/2)*i.tile[2];return n}const _s=new Map,vn=new P,Ma=new Wt,Sa=new Cs,Yu=new P,ba=new P,kv=3;function Gc(i){return i.map(t=>{t.geometry.computeBoundingBox();const e=t.geometry.boundingBox.clone(),n=e.getSize(vn);return{box:e,surface:t.surface,volume:n.x*n.y*n.z}})}function Rf(i,t){i!==null&&t.length>0&&!_s.has(i)&&_s.set(i,Gc(t))}class Wc extends Do{solid=!0;visible=!0;hazard=!1;molten=!1;size=new P(1,1,1);constructor(t){super(t)}bakeKey(){return null}bakeTiles(){return null}ownBoxes=null;ownBoxesAt=new P;surfaceAt(t){const e=this.surfaceBoxes();if(e.length===0)return null;if(e.length===1)return e[0].surface;this.object.updateMatrixWorld(),this.object.worldToLocal(vn.copy(t));const n=this.bakeTiles();n&&this.intoTile(n,vn,0,0);let s=null,r=1/0;for(const o of e){const{min:a,max:c}=o.box,l=o.box.containsPoint(vn)?Math.min(vn.x-a.x,c.x-vn.x,vn.y-a.y,c.y-vn.y,vn.z-a.z,c.z-vn.z):o.box.distanceToPoint(vn);(l<r-1e-4||Math.abs(l-r)<=1e-4&&s&&o.volume<s.volume)&&(s=o,r=l)}return s?s.surface:null}holeAt(t,e,n,s){const r=this.surfaceBoxes();if(r.length===0)return!1;this.object.updateMatrixWorld(),Ma.copy(this.object.matrixWorld).invert();const o=Sa.direction.copy(e).transformDirection(Ma),a=Sa.origin.copy(t).applyMatrix4(Ma).addScaledVector(o,-.01);let c=kv,l=null;const h=this.bakeTiles(),f=h?1:0;ba.copy(a);let u=0,d=0;for(let v=-f;v<=f;v++)for(let M=-f;M<=f;M++){a.copy(ba);const[T,E]=h?this.intoTile(h,a,v,M):[0,0];for(const R of r){const b=R.box.containsPoint(a)?0:Sa.intersectBox(R.box,Yu)?Yu.distanceTo(a):1/0;b<c&&(c=b,l=R,u=T,d=E)}}if(a.copy(ba),!l)return!1;n.copy(a).addScaledVector(o,c);const{min:g,max:_}=l.box,m=n.x-u,p=n.z-d,y=[m-g.x,_.x-m,n.y-g.y,_.y-n.y,p-g.z,_.z-p];let x=0;for(let v=1;v<6;v++)Math.abs(y[v])<Math.abs(y[x])&&(x=v);return s.set(x===0?-1:x===1?1:0,x===2?-1:x===3?1:0,x===4?-1:x===5?1:0),n.applyMatrix4(this.object.matrixWorld),s.transformDirection(this.object.matrixWorld),!0}surfaceBoxes(){const t=this.bakeTiles();if(t){let n=_s.get(t.key);if(!n){const s=t.build();_s.set(t.key,n=Gc(s));for(const r of s)r.geometry.dispose()}return n}const e=this.bakeKey();if(e!==null){let n=_s.get(e);return n||_s.set(e,n=this.makeSurfaceBoxes()),n}return(!this.ownBoxes||!this.ownBoxesAt.equals(this.size))&&(this.ownBoxes=this.makeSurfaceBoxes(),this.ownBoxesAt.copy(this.size)),this.ownBoxes}surfaceParts(){return this.buildParts()}makeSurfaceBoxes(){const t=this.surfaceParts(),e=Gc(t);for(const n of t)n.geometry.dispose();return e}intoTile(t,e,n,s){const[r,o]=t.count,a=Math.min(r-1,Math.max(0,Math.floor(e.x/t.tile[0]+r/2)))+n,c=Math.min(o-1,Math.max(0,Math.floor(e.z/t.tile[2]+o/2)))+s,l=(Math.min(r-1,Math.max(0,a))+.5-r/2)*t.tile[0],h=(Math.min(o-1,Math.max(0,c))+.5-o/2)*t.tile[2];return e.x-=l,e.z-=h,[l,h]}computeAABB(t){this.object.updateMatrix();const e=this.object.matrix.elements,n=this.size.x/2,s=this.size.y/2,r=this.size.z/2,o=Math.abs(e[0])*n+Math.abs(e[4])*s+Math.abs(e[8])*r,a=Math.abs(e[1])*n+Math.abs(e[5])*s+Math.abs(e[9])*r,c=Math.abs(e[2])*n+Math.abs(e[6])*s+Math.abs(e[10])*r,l=this.object.position;return t.min.set(l.x-o,l.y-a,l.z-c),t.max.set(l.x+o,l.y+a,l.z+c),t}get displayName(){return this.name||this.id}}function vo(i){return Math.round(i*1e4)/1e4}const Pe=1e-4,$u=6;function Hv(i){const t=[];for(const o of i){if(o.leaf!==void 0)continue;const a=o.geometry;if(!(a instanceof Zn))continue;a.computeBoundingBox();const c=a.boundingBox,l=a.parameters;l.widthSegments!==1||l.heightSegments!==1||l.depthSegments!==1||Math.abs(c.max.x-c.min.x-l.width)>Pe||Math.abs(c.max.y-c.min.y-l.height)>Pe||Math.abs(c.max.z-c.min.z-l.depth)>Pe||t.push({geometry:a,min:[c.min.x,c.min.y,c.min.z],max:[c.max.x,c.max.y,c.max.z]})}if(t.length<2)return 0;const e=o=>Math.round(o*1e3),n=[new Map,new Map,new Map],s=[new Map,new Map,new Map];for(const o of t)for(let a=0;a<3;a++)for(const[c,l]of[[n[a],o.min[a]],[s[a],o.max[a]]]){const h=e(l),f=c.get(h);f?f.push(o):c.set(h,[o])}let r=0;for(const o of t){const a=[!1,!1,!1,!1,!1,!1];let c=!1;for(let f=0;f<6;f++){const u=f>>1,d=(f&1)===0,g=d?o.max[u]:o.min[u],_=(u+1)%3,m=(u+2)%3,p=o.min[_],y=o.max[_],x=o.min[m],v=o.max[m],M=[],T=d?n[u]:s[u],E=e(g);for(let R=-1;R<=1;R++){const b=T.get(E+R);if(b)for(const S of b){if(S===o||!(d?Math.abs(S.min[u]-g)<Pe:Math.abs(S.max[u]-g)<Pe))continue;const D=Math.max(p,S.min[_]),I=Math.min(y,S.max[_]),F=Math.max(x,S.min[m]),k=Math.min(v,S.max[m]);I-D>Pe&&k-F>Pe&&M.push([D,I,F,k])}}M.length>0&&Vv(p,y,x,v,M)&&(a[f]=!0,c=!0)}if(!c)continue;const l=o.geometry.index.array,h=[];for(let f=0;f<6;f++){if(a[f]){r+=2;continue}for(let u=0;u<$u;u++)h.push(l[f*$u+u])}o.geometry.setIndex(h)}return r}function Vv(i,t,e,n,s){for(const l of s)if(l[0]<=i+Pe&&l[1]>=t-Pe&&l[2]<=e+Pe&&l[3]>=n-Pe)return!0;const r=(t-i)*(n-e);let o=0;for(const l of s)o+=(l[1]-l[0])*(l[3]-l[2]);if(o<r-Pe*(t-i+n-e))return!1;if(s.length>Gv)return Wv(s)>=r-Pe*(t-i+n-e);const a=[i,t],c=[e,n];for(const l of s)a.push(l[0],l[1]),c.push(l[2],l[3]);a.sort((l,h)=>l-h),c.sort((l,h)=>l-h);for(let l=0;l+1<a.length;l++){if(a[l+1]-a[l]<Pe)continue;const h=(a[l]+a[l+1])/2;for(let f=0;f+1<c.length;f++){if(c[f+1]-c[f]<Pe)continue;const u=(c[f]+c[f+1])/2;let d=!1;for(const g of s)if(h>=g[0]&&h<=g[1]&&u>=g[2]&&u<=g[3]){d=!0;break}if(!d)return!1}}return!0}const Gv=24;function Wv(i){const t=[];for(const f of i)t.push(f[2],f[3]);t.sort((f,u)=>f-u);const e=[];for(const f of t)(e.length===0||f-e[e.length-1]>Pe*.01)&&e.push(f);const n=e.length-1;if(n<=0)return 0;const s=f=>{let u=0,d=e.length-1;for(;u<d;){const g=u+d>>1;e[g]<f-Pe*.01?u=g+1:d=g}return u},r=new Int32Array(4*n),o=new Float64Array(4*n),a=(f,u,d,g,_,m)=>{if(!(_<=u||d<=g)){if(g<=u&&d<=_)r[f]+=m;else{const p=u+d>>1;a(f*2,u,p,g,_,m),a(f*2+1,p,d,g,_,m)}r[f]>0?o[f]=e[d]-e[u]:d-u===1?o[f]=0:o[f]=o[f*2]+o[f*2+1]}},c=[];for(const f of i){const u=s(f[2]),d=s(f[3]);d<=u||c.push([f[0],1,u,d],[f[1],-1,u,d])}c.sort((f,u)=>f[0]-u[0]||u[1]-f[1]);let l=0,h=c.length?c[0][0]:0;for(const[f,u,d,g]of c)l+=o[1]*(f-h),h=f,a(1,0,n,d,g,u);return l}function Xc(i,t,e){let n=Math.imul(Math.round(i*2)|0,73856093)^Math.imul(Math.round(t*2)|0,19349663)^Math.imul(Math.round(e*2)|0,83492791);return n=Math.imul(n^n>>>16,2246822507),n=Math.imul(n^n>>>13,3266489909),(n^n>>>16)>>>0}const Xv=1,Un=new Map,Hr=new Map,El=1500;function ju(i){const t=i.buildParts();return Rf(i.bakeKey(),t),Cf(t)}function Cf(i){const t=Hv(i),e=[];let n=0;for(const s of i){const r=s.geometry,o=r.attributes.position,a=r.attributes.normal,c=r.attributes.uv,l=r.index,h=new Int32Array(o.count).fill(-1);let f=0;const u=l?l.count:o.count;for(let v=0;v<u;v++){const M=l?l.getX(v):v;h[M]<0&&(h[M]=f++)}const d={surface:s.surface,fine:!1,pos:new Float32Array(f*3),nrm:new Float32Array(f*3),uv:new Float32Array(f*2),index:new Uint32Array(u),vertices:f};let g=1/0,_=1/0,m=1/0,p=-1/0,y=-1/0,x=-1/0;for(let v=0;v<o.count;v++){const M=h[v];if(M<0)continue;const T=o.getX(v),E=o.getY(v),R=o.getZ(v);d.pos[M*3]=T,d.pos[M*3+1]=E,d.pos[M*3+2]=R,d.nrm[M*3]=a.getX(v),d.nrm[M*3+1]=a.getY(v),d.nrm[M*3+2]=a.getZ(v),d.uv[M*2]=c.getX(v),d.uv[M*2+1]=c.getY(v),T<g&&(g=T),E<_&&(_=E),R<m&&(m=R),T>p&&(p=T),E>y&&(y=E),R>x&&(x=R)}for(let v=0;v<u;v++)d.index[v]=h[l?l.getX(v):v];d.fine=Math.max(p-g,y-_,x-m)<Xv&&!s.core,n+=u/3,e.push(d),r.dispose()}return{parts:e,triangles:n,culled:t}}function Pf(i){let t=Un.get(i.key);if(!t){Un.size>=El&&Un.clear();const e=i.build();Rf(i.key,e),t=Cf(e),Un.set(i.key,t)}return t}function Lf(i){const t=i.bakeKey();if(t===null)return ju(i);let e=Un.get(t);return e||(Un.size>=El&&Un.clear(),e=ju(i),Un.set(t,e)),e}const qv={structure:!0,detail:!0,collision:!0},Vr=new Wt,Ea=(()=>{const i=new Zn(1,1,1).toNonIndexed(),t=Array.from(i.attributes.position.array);return i.dispose(),t})();function Yv(i){const t=i.bakeKey();if(t===null)return i.collisionBoxes();const e=`${t}|${i.solid?1:0}`;let n=Hr.get(e);return n||(Hr.size>=El&&Hr.clear(),n=i.collisionBoxes(),Hr.set(e,n)),n}function $v(i,t=1/0){const e=performance.now();let n=0;for(const s of i){const r=s.bakeTiles();if(r){if(Un.has(r.key))continue;if(Pf(r),n++,performance.now()-e>t)break;continue}const o=s.bakeKey();if(!(o===null||Un.has(o))&&(Lf(s),n++,performance.now()-e>t))break}return n}function wa(i,t,e=qv){const n=[],s=new Map;let r=0,o=0,a=0;for(const g of e.structure||e.detail?i:[]){g.object.updateMatrix();const _=g.bakeTiles(),m=_?Pf(_):Lf(g);if(m.parts.length===0)continue;if(_){const y=g.object.position,x=Xc(y.x,y.y,y.z),v=zv(_);for(let M=0;M<v.length;M+=2)Vr.makeTranslation(v[M],0,v[M+1]).premultiply(g.object.matrix),n.push({template:m,e:Float32Array.from(Vr.elements),tone:x})}else{const y=Float32Array.from(g.object.matrix.elements);n.push({template:m,e:y,tone:Xc(y[12],y[13],y[14])})}const p=_?_.count[0]*_.count[1]:1;e.structure&&(a+=m.culled*p);for(const y of m.parts){if(y.fine?!e.detail:!e.structure)continue;const x=y.fine?"d":"s";let v=s.get(x);v||s.set(x,v={detail:y.fine,vertices:0,indices:0,filledVertices:0,filledIndices:0}),v.vertices+=y.vertices*p,v.indices+=y.index.length*p,r+=y.index.length/3*p,y.fine&&(o+=y.index.length/3*p)}}for(const g of s.values())g.pos=new Float32Array(g.vertices*3),g.nrm=new Int8Array(g.vertices*4),g.uv=new Float32Array(g.vertices*2),g.surf=new Uint8Array(g.vertices*4),g.idx=g.vertices<65536?new Uint16Array(g.indices):new Uint32Array(g.indices);for(const{template:g,e:_,tone:m}of n){const p=_[0],y=_[1],x=_[2],v=_[4],M=_[5],T=_[6],E=_[8],R=_[9],b=_[10],S=_[12],C=_[13],D=_[14];for(const I of g.parts){const F=s.get(I.fine?"d":"s");if(!F)continue;const k=hr(I.surface),H=F.filledVertices,$=F.pos,G=F.nrm,st=F.uv;for(let pt=0;pt<I.vertices;pt++){const Vt=I.pos[pt*3],Xt=I.pos[pt*3+1],Nt=I.pos[pt*3+2],Y=(H+pt)*3;$[Y]=p*Vt+v*Xt+E*Nt+S,$[Y+1]=y*Vt+M*Xt+R*Nt+C,$[Y+2]=x*Vt+T*Xt+b*Nt+D;const K=I.nrm[pt*3],ft=I.nrm[pt*3+1],Tt=I.nrm[pt*3+2],gt=(H+pt)*4;G[gt]=Math.round((p*K+v*ft+E*Tt)*127),G[gt+1]=Math.round((y*K+M*ft+R*Tt)*127),G[gt+2]=Math.round((x*K+T*ft+b*Tt)*127),st[(H+pt)*2]=I.uv[pt*2],st[(H+pt)*2+1]=I.uv[pt*2+1],F.surf[(H+pt)*4]=k,F.surf[(H+pt)*4+1]=m&255,F.surf[(H+pt)*4+2]=m>>>8&255}const at=F.idx,Mt=F.filledIndices;for(let pt=0;pt<I.index.length;pt++)at[Mt+pt]=I.index[pt]+H;F.filledVertices+=I.vertices,F.filledIndices+=I.index.length}}const c=[];for(const g of s.values()){const _=new Ke;_.setAttribute("position",new ge(g.pos,3)),_.setAttribute("normal",new ge(g.nrm,4,!0)),_.setAttribute("uv",new ge(g.uv,2)),_.setAttribute("aSurface",new ge(g.surf,4)),_.setIndex(new ge(g.idx,1)),_.computeBoundingBox(),_.computeBoundingSphere(),c.push({detail:g.detail,geometry:_,triangles:g.indices/3})}if(!e.collision)return{layers:c,collision:null,owners:new Uint32Array(0),collisionTriangles:0,renderTriangles:r,detailTriangles:o,culledTriangles:a};let l=0;const h=[];for(const g of i){const _=Yv(g);_.length!==0&&(l+=_.length,Vr.copy(g.object.matrix),h.push({boxes:_,owner:t(g),e:Float32Array.from(Vr.elements)}))}let f=null;const u=new Uint32Array(l*12);let d=0;if(l>0){const g=new Float32Array(l*36*3);let _=0,m=0;for(const{boxes:p,owner:y,e:x}of h)for(const v of p){for(let M=0;M<36;M++){const T=Ea[M*3]*v.w+v.x,E=Ea[M*3+1]*v.h+v.y,R=Ea[M*3+2]*v.d+v.z;g[_++]=x[0]*T+x[4]*E+x[8]*R+x[12],g[_++]=x[1]*T+x[5]*E+x[9]*R+x[13],g[_++]=x[2]*T+x[6]*E+x[10]*R+x[14]}for(let M=0;M<12;M++)u[m++]=y}d=m,f=new Ke,f.setAttribute("position",new ge(g,3))}return{layers:c,collision:f,owners:u,collisionTriangles:d,renderTriangles:r,detailTriangles:o,culledTriangles:a}}function Df(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Ke;let l=0;for(let h=0;h<i.length;++h){const f=i[h];let u=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(e){let h=0;const f=[];for(let u=0;u<i.length;++u){const d=i[u].index;for(let g=0;g<d.count;++g)f.push(d.getX(g)+h);h+=i[u].attributes.position.count}c.setIndex(f)}for(const h in r){const f=Ku(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,f)}for(const h in o){const f=o[h][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let u=0;u<f;++u){const d=[];for(let _=0;_<o[h].length;++_)d.push(o[h][_][u]);const g=Ku(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Ku(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new ge(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const f=c/e;for(let u=0,d=h.count;u<d;u++)for(let g=0;g<e;g++){const _=h.getComponent(u,g);a.setComponent(u+f,g,_)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}const Zu=96,jv=80,Ju=-1e3,Qu=60,Kv=40,th=12,Zv=5,Jv=60,eh=()=>new Promise(i=>setTimeout(i,0)),Qv=new fe;class wl{constructor(t,e){this.scene=t,this.collision=e}table=[];indexes=new Map;cells=new Map;cellList=[];focus=new P;lastCamera=null;drawDistance=600;depthScene=wl.stillScene();static stillScene(){const t=new cf;return t.matrixAutoUpdate=!1,t.matrixWorldAutoUpdate=!1,t}mergeAllowed=!0;version=0;mergedVersion=-1;merged={structure:null,detail:null,depth:null};get isMerged(){return this.mergedVersion>=0}mergeNow(){if(!this.mergeAllowed||this.cellList.length===0||this.cellList.length>th){this.unmerge();return}if(this.mergedVersion===this.version)return;this.unmerge();const t=[];for(const s of this.cellList)t.push(...s.entities);const e={};for(const s of["structure","detail"]){const o=wa(t,this.indexOf,this.layerWant(s)).layers[0];o&&(e[s]=o.geometry)}if(e.structure){const s=this.levelMesh(e.structure.clone(),qu());s.renderOrder=Ju,this.depthScene.add(s),this.merged.depth=s}const n=e.structure&&e.detail?Df([e.structure,e.detail],!1):null;if(n){e.structure.dispose(),e.detail.dispose();const s=this.levelMesh(n,Qs());this.scene.add(s),this.merged.structure=s}else for(const s of["structure","detail"]){const r=e[s];if(!r)continue;const o=this.levelMesh(r,Qs());this.scene.add(o),this.merged[s]=o}this.mergedVersion=this.version,this.showCells(!1)}unmerge(){if(!(this.mergedVersion<0&&!this.merged.structure&&!this.merged.detail)){for(const t of["structure","detail","depth"]){const e=this.merged[t];e&&(e.parent?.remove(e),e.geometry.dispose(),this.merged[t]=null)}this.mergedVersion=-1,this.showCells(!0)}}showCells(t){for(const e of this.cellList)e.structure&&(e.structure.visible=t),e.detail&&(e.detail.visible=t),e.structureDepth&&(e.structureDepth.visible=t)}levelMesh(t,e){const n=new We(t,e);n.matrixAutoUpdate=!1,n.raycast=()=>{};for(const s of[...Object.values(t.attributes),t.index])s.onUpload(()=>void(s.array=null));return n}entityAt(t){return this.table[t]??null}indexOf=t=>{let e=this.indexes.get(t);return e===void 0&&(e=this.table.length,this.table.push(t),this.indexes.set(t,e)),e};get cellCount(){return this.cells.size}get hasCamera(){return this.lastCamera!==null}get builtCellCount(){let t=0;for(const e of this.cellList)e.structureReady&&t++;return t}sum(t){let e=0;for(const n of this.cellList)e+=t(n);return e}get renderTriangles(){return this.sum(t=>t.structureTriangles+t.detailTriangles)}get detailTriangles(){return this.sum(t=>t.detailTriangles)}get culledTriangles(){return this.sum(t=>t.culledTriangles)}get collisionTriangles(){return this.sum(t=>t.collisionTriangles)}clear(){this.unmerge(),this.version++;for(const t of this.cellList)this.disposeCell(t);this.cells.clear(),this.cellList=[],this.table.length=0,this.indexes.clear(),this.collision.clear(),this.lastCamera=null}disposeLayer(t,e){e==="structure"?t.structureReady=!1:t.detailReady=!1;const n=t[e];e==="structure"&&t.structureDepth&&(this.depthScene.remove(t.structureDepth),t.structureDepth=null),n&&(this.scene.remove(n),n.geometry.dispose(),t[e]=null,e==="structure"?t.structureTriangles=0:t.detailTriangles=0)}disposeCell(t){this.disposeLayer(t,"structure"),this.disposeLayer(t,"detail"),this.collision.removeChunk(t.key)}invalidateRender(){for(const t of this.cellList)this.disposeLayer(t,"structure"),this.disposeLayer(t,"detail")}plan(t){const e=new Map;for(const n of t){const s=n.object.position,r=`${Math.floor(s.x/Zu)},${Math.floor(s.z/Zu)}`;let o=e.get(r);o||e.set(r,o=[]),o.push(n)}return e}signature(t){const e=[];for(const n of t){const s=n.object.position,r=n.object.quaternion,o=n.bakeKey()??JSON.stringify(n.serialize());e.push(`${o}@${s.x},${s.y},${s.z}/${r.x},${r.y},${r.z},${r.w}/${n.solid?1:0}`)}return e.join(";")}diff(t){const e=this.plan(t),n=[];for(const[r,o]of e){const a=this.signature(o);this.cells.get(r)?.signature!==a&&n.push([r,o,a])}const s=[...this.cells.keys()].filter(r=>!e.has(r));return{todo:n,gone:s,total:e.size}}layerWant(t){return{structure:t==="structure",detail:t==="detail",collision:!1}}buildLayer(t,e){this.disposeLayer(t,e);const n=wa(t.entities,this.indexOf,this.layerWant(e));e==="structure"?t.structureReady=!0:t.detailReady=!0;const s=n.layers[0];if(!s)return;const r=new We(s.geometry,Qs());r.matrixAutoUpdate=!1,r.raycast=()=>{};for(const o of[...Object.values(s.geometry.attributes),s.geometry.index])o.onUpload(()=>void(o.array=null));if(this.scene.add(r),t[e]=r,r.visible=!this.isMerged,e==="structure"){const o=new We(s.geometry,qu());o.matrixAutoUpdate=!1,o.renderOrder=Ju,o.raycast=r.raycast,o.visible=!this.isMerged,this.depthScene.add(o),t.structureDepth=o,t.structureTriangles=n.renderTriangles,t.culledTriangles=n.culledTriangles}else t.detailTriangles=n.renderTriangles}rebuild(t,e,n){this.version++;const s=this.cells.get(t),r=s??{key:t,signature:n,entities:e,bounds:new fe,structure:null,detail:null,structureDepth:null,structureReady:!1,detailReady:!1,structureTriangles:0,detailTriangles:0,culledTriangles:0,collisionTriangles:0};r.signature=n,r.entities=e,r.bounds.makeEmpty();for(const a of e)r.bounds.union(a.computeAABB(Qv));const o=wa(e,this.indexOf,{structure:!1,detail:!1,collision:!0});r.collisionTriangles=o.collisionTriangles,o.collision?this.collision.setChunk(t,o.collision,o.owners):this.collision.removeChunk(t),r.structureReady&&this.buildLayer(r,"structure"),r.detailReady&&this.buildLayer(r,"detail"),s||(this.cells.set(t,r),this.cellList.push(r))}removeGone(t){t.length>0&&this.version++;for(const e of t){const n=this.cells.get(e);this.disposeCell(n),this.cells.delete(e)}t.length>0&&(this.cellList=[...this.cells.values()])}get detailRange(){return this.mergeAllowed&&this.cellList.length>0&&this.cellList.length<=th?1/0:jv}missing(){const t=[];for(const e of this.cellList){const n=e.bounds.distanceToPoint(this.focus);!e.structureReady&&n<this.drawDistance&&t.push({cell:e,layer:"structure",d:n}),!e.detailReady&&n<this.detailRange&&t.push({cell:e,layer:"detail",d:n})}return t.sort((e,n)=>e.d-n.d)}releaseFar(){for(const t of this.cellList){const e=t.bounds.distanceToPoint(this.focus);t.structureReady&&e>this.drawDistance+Qu&&this.disposeLayer(t,"structure"),t.detailReady&&e>this.detailRange+Qu&&this.disposeLayer(t,"detail")}}prime(){this.releaseFar();for(const t of this.missing())this.buildLayer(t.cell,t.layer)}async primeAsync(t,e=eh,n=14){this.releaseFar();const s=this.missing();let r=performance.now();for(let o=0;o<s.length;o++)this.buildLayer(s[o].cell,s[o].layer),t?.((o+1)/s.length),performance.now()-r>n&&(await e(),r=performance.now())}update(t){const e=this.lastCamera!==null&&this.lastCamera.distanceTo(t)>Kv;this.lastCamera=this.lastCamera??new P,this.lastCamera.copy(t),this.focus.copy(t),this.releaseFar(),this.mergeNow();const n=this.missing();if(n.length===0)return;const s=e?Jv:Zv,r=performance.now();for(const o of n)if(this.buildLayer(o.cell,o.layer),performance.now()-r>s)break}sync(t){const e=performance.now(),{todo:n,gone:s,total:r}=this.diff(t);this.removeGone(s);let o=0;for(const[a,c,l]of n){const h=performance.now();this.rebuild(a,c,l),o=Math.max(o,performance.now()-h)}return this.prime(),{cells:r,rebuilt:n.length,removed:s.length,ms:performance.now()-e,slowestCell:o}}async syncAsync(t,e,n=eh,s=14){const r=performance.now(),{todo:o,gone:a,total:c}=this.diff(t);this.removeGone(a);let l=performance.now();const h=t.filter(u=>u.bakeKey()!==null);for(let u=0;u<h.length;u+=64){const d=$v(h.slice(u,u+64),s);e?.(.15*Math.min(1,(u+64)/h.length)),d>0&&performance.now()-l>s&&(await n(),l=performance.now())}let f=0;for(let u=0;u<o.length;u++){const[d,g,_]=o[u],m=performance.now();this.rebuild(d,g,_),f=Math.max(f,performance.now()-m),e?.(.15+.45*((u+1)/o.length)),performance.now()-l>s&&(await n(),l=performance.now())}return await this.primeAsync(u=>e?.(.6+.4*u),n,s),e?.(1),{cells:c,rebuilt:o.length,removed:a.length,ms:performance.now()-r,slowestCell:f}}}const tx=3,ex=.25;class nx{constructor(t,e=tx){this.scene=t,this.max=e}sources=[];slots=[];wanted=[];scores=[];get sourceCount(){return this.sources.length}get liveCount(){return this.slots.length}register(t){if(this.sources.push(t),this.slots.length<this.max&&this.sources.length>this.slots.length){const e=new _p(16777215,0,0);this.scene.add(e),this.slots.push({light:e,source:null,level:0,target:0,hex:-1})}this.sources.length<=this.slots.length&&this.assignDirect()}unregister(t){const e=this.sources.indexOf(t);if(!(e<0)){this.sources.splice(e,1);for(const n of this.slots)n.source===t&&(n.source=null,n.level=0,n.target=0,n.light.intensity=0);this.sources.length<=this.slots.length&&this.assignDirect()}}assignDirect(){for(let t=0;t<this.slots.length;t++){const e=this.slots[t],n=this.sources[t]??null;e.source!==n&&(e.source=n,e.level=n?1:0,e.target=n?1:0),this.apply(e)}}apply(t){const e=t.source;if(!e){t.light.intensity=0;return}t.light.position.copy(e.position),t.hex!==e.color&&(t.hex=e.color,t.light.color.setHex(e.color)),t.light.distance=e.distance,t.light.intensity=e.intensity*t.level}update(t,e=1/60){if(this.sources.length<=this.slots.length){for(const l of this.slots)this.apply(l);return}const n=this.slots.length,s=this.wanted,r=this.scores;s.length=0,r.length=0;const o=this.sources;for(let l=0;l<o.length;l++){const h=o[l],f=h.position.distanceTo(t)-(h.distance||40)*.5;if(s.length===n&&f>=r[n-1])continue;let u=s.length<n?s.length:n-1;for(;u>0&&r[u-1]>f;)r[u]=r[u-1],s[u]=s[u-1],u--;r[u]=f,s[u]=h}const a=this.slots;for(let l=0;l<n;l++){const h=a[l];h.source&&(h.target=s.includes(h.source)?1:0)}for(let l=0;l<s.length;l++){const h=s[l];let f=!1;for(let d=0;d<n;d++)a[d].source===h&&(f=!0);if(f)continue;let u=null;for(let d=0;d<n&&!u;d++){const g=a[d];(g.source===null||g.target===0&&g.level<=.02)&&(u=g)}u&&(u.source=h,u.level=0,u.target=1)}const c=e/ex;for(let l=0;l<n;l++){const h=a[l];h.level+=Math.max(-c,Math.min(c,h.target-h.level)),h.target===0&&h.level<=.02&&h.source&&!s.includes(h.source)&&(h.source=null,h.level=0),this.apply(h)}}}const ix=new Set;function sx(i){ix.add(i)}const An=64,is=3,Tl=1e-4;function rx(i,t,e,n,s,r){if(n>Tl){const o=(1-Math.exp(-n*s))/n;r.set(i.x+t.x*o,i.y+t.y*o-e/n*(s-o),i.z+t.z*o)}else r.set(i.x+t.x*s,i.y+t.y*s-.5*e*s*s,i.z+t.z*s);return r}function nh(i,t,e,n,s){if(n>Tl){const r=(1-Math.exp(-n*s))/n;return i+t*r-e/n*(s-r)}return i+t*s-.5*e*s*s}function ox(i,t,e,n,s,r){if(i<=s)return t<0?0:-1;if(nh(i,t,e,n,r)>s)return-1;let o=0;t>0&&e>0&&(o=n>Tl?Math.log(1+n*t/e)/n:t/e,o=Math.min(o,r));let a=r;for(let c=0;c<22;c++){const l=(o+a)*.5;nh(i,t,e,n,l)>s?o=l:a=l}return a}const Uo=`
vec3 ptTraj(vec3 p0, vec3 v0, float g, float k, float t) {
  if (k > 1e-4) {
    float f = (1.0 - exp(-k * t)) / k;
    return vec3(p0.x + v0.x * f, p0.y + v0.y * f - (g / k) * (t - f), p0.z + v0.z * f);
  }
  return vec3(p0.x + v0.x * t, p0.y + v0.y * t - 0.5 * g * t * t, p0.z + v0.z * t);
}
vec3 ptVel(vec3 v0, float g, float k, float t) {
  if (k > 1e-4) {
    float e = exp(-k * t);
    return vec3(v0.x * e, v0.y * e - (g / k) * (1.0 - e), v0.z * e);
  }
  return vec3(v0.x, v0.y - g * t, v0.z);
}
`,Io=`
uniform highp sampler2D uRamp;
vec4 ptRamp(float row, float a) {
  float x = clamp(a, 0.0, 1.0) * ${An-1}.0;
  int x0 = int(floor(x));
  int x1 = min(x0 + 1, ${An-1});
  int r = int(row + 0.5);
  return mix(texelFetch(uRamp, ivec2(x0, r), 0), texelFetch(uRamp, ivec2(x1, r), 0), fract(x));
}
vec4 ptConst(float row, int i) {
  return texelFetch(uRamp, ivec2(i, int(row + 0.5) + 2), 0);
}
`,nn=(i,t,e)=>i+(t-i)*e,Ta=i=>i<=.04045?i/12.92:Math.pow((i+.055)/1.055,2.4);function Aa(i,t){const e=[[0,1,.96,.82],[.12,1,.82,.38],[.38,1,.5,.12],[.7,.78,.2,.05],[1,.35,.06,.02]];let n=0;for(;n<e.length-2&&i>e[n+1][0];)n++;const[s,r,o,a]=e[n],[c,l,h,f]=e[n+1],u=Math.min(1,Math.max(0,(i-s)/(c-s)));t.r=nn(r,l,u),t.g=nn(o,h,u),t.b=nn(a,f,u)}const ih={puff(i,t,e){const n=1-i;e.r=nn(t.color.r,t.colorEnd.r,i),e.g=nn(t.color.g,t.colorEnd.g,i),e.b=nn(t.color.b,t.colorEnd.b,i),e.a=t.alpha*Math.min(1,i/Math.max(.001,t.fadeIn))*Math.pow(n,1.25),e.size=1+(t.grow-1)*(1-n*n),e.width=1},spark(i,t,e){const n=1-i,s=Math.max(0,1-i*4.5),r=.25+.75*Math.min(1,n*1.6);e.r=(t.color.r+(1-t.color.r)*s*.7)*r,e.g=(t.color.g+(1-t.color.g)*s*.7)*r*(.55+.45*n),e.b=(t.color.b+(1-t.color.b)*s*.7)*r*(.35+.65*n),e.a=t.alpha*Math.min(1,i/.04)*Math.min(1,n*2.2),e.width=.55*(.35+.65*n),e.size=1},flame(i,t,e){Aa(i,e),e.r=Ta(e.r),e.g=Ta(e.g),e.b=Ta(e.b);const n=i<.08?i/.08:1-Math.pow((i-.08)/.92,1.6);e.a=t.alpha*n,e.size=(.32+i*1.25)/.32,e.width=1},smoke(i,t,e){e.r=nn(t.color.r,t.colorEnd.r,i),e.g=nn(t.color.g,t.colorEnd.g,i),e.b=nn(t.color.b,t.colorEnd.b,i),e.a=t.alpha*(i<.2?i/.2:1-(i-.2)/.8),e.size=1+(t.grow-1)*i,e.width=1},"fireball-core"(i,t,e){const n=1-Math.pow(1-i,3);Aa(Math.min(1,i*1.2),e),e.a=t.alpha*(1-i),e.size=(.25+.55*n)/.25,e.width=1},"fireball-shell"(i,t,e){const n=1-Math.pow(1-i,3);Aa(Math.min(1,i*1.2),e),e.r*=.9,e.g*=.5,e.b*=.3,e.a=t.alpha*(1-i)*(1-i),e.size=(.35+.85*n)/.35,e.width=1},constant(i,t,e){e.r=t.color.r,e.g=t.color.g,e.b=t.color.b,e.a=t.alpha,e.size=1,e.width=1}};function sh(i,t){if(i.length===0)return 1;if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++){const[n,s]=i[e];if(t<=n){const[r,o]=i[e-1];return nn(o,s,(t-r)/Math.max(1e-6,n-r))}}return i[i.length-1][1]}const Gr=new Ut,Wr=new Ut;function ax(i,t,e){if(i.length===0)return;let n=1;for(;n<i.length-1&&t>i[n][0];)n++;const[s,r]=i[Math.max(0,n-1)],[o,a]=i[Math.min(i.length-1,n)];Gr.set(r),Wr.set(a);const c=o>s?Math.min(1,Math.max(0,(t-s)/(o-s))):0;e.r=nn(Gr.r,Wr.r,c),e.g=nn(Gr.g,Wr.g,c),e.b=nn(Gr.b,Wr.b,c)}const ae=16,cx=`
float ptSeed(float id) { return fract(sin(id * 12.9898 + 78.233) * 43758.5453); }
`;class Uf{constructor(t){this.capacity=t,this.data=new Float32Array(t*ae)}data;object;written=0;lastDeath=-1;deathStale=!1;dirtyLo=-1;dirtyHi=-1;claim(){const t=this.written%this.capacity;return this.written++,this.dirtyLo<0&&(this.dirtyLo=this.written-1),this.dirtyHi=this.written,t*ae}slotOf(t){return t<0||t>=this.written||t<this.written-this.capacity?-1:t%this.capacity}touch(t){const e=this.buffer;e.addUpdateRange(t*ae,ae),e.needsUpdate=!0}flush(t){if(this.dirtyLo<0&&!this.object.visible&&t>=this.lastDeath)return;const e=this.buffer;if(this.dirtyLo>=0){const s=this.dirtyHi-this.dirtyLo;if(s>=this.capacity)e.addUpdateRange(0,this.capacity*ae);else{const r=this.dirtyLo%this.capacity,o=r+s;o<=this.capacity?e.addUpdateRange(r*ae,s*ae):(e.addUpdateRange(r*ae,(this.capacity-r)*ae),e.addUpdateRange(0,(o-this.capacity)*ae))}e.needsUpdate=!0,this.dirtyLo=this.dirtyHi=-1}if(this.deathStale){let s=-1;const r=this.data;for(let o=3,a=Math.min(this.written,this.capacity)*ae;o<a;o+=ae){const c=r[o]+r[o+4];c>s&&(s=c)}this.lastDeath=s,this.deathStale=!1}const n=t<this.lastDeath;this.object.visible=n,n&&this.setDrawCount(Math.min(this.written,this.capacity))}rebase(t){const e=Math.min(this.written,this.capacity);for(let n=0;n<e;n++)this.data[n*ae+3]-=t;this.lastDeath>0&&(this.lastDeath-=t),this.buffer.addUpdateRange(0,e*ae),this.buffer.needsUpdate=!0}clear(){const t=Math.min(this.written,this.capacity);for(let e=0;e<t;e++)this.data[e*ae+7]=0;t>0&&(this.buffer.addUpdateRange(0,t*ae),this.buffer.needsUpdate=!0),this.lastDeath=-1,this.deathStale=!1,this.object.visible=!1}}function Xr(i,t){const e=Math.sin(i*127.1+t*311.7)*43758.5453;return e-Math.floor(e)}function Ra(i,t){const e=Math.floor(i),n=Math.floor(t),s=i-e,r=t-n,o=s*s*(3-2*s),a=r*r*(3-2*r),c=Xr(e,n),l=Xr(e+1,n),h=Xr(e,n+1),f=Xr(e+1,n+1);return c+(l-c)*o+(h-c)*a+(c-l-h+f)*o*a}let ss;function lx(){if(ss!==void 0)return ss;if(ss=null,typeof document>"u")return null;const i=128,t=document.createElement("canvas");t.width=i*2,t.height=i;const e=t.getContext("2d");if(!e)return null;const n=e.createImageData(i*2,i);for(let s=0;s<i;s++)for(let r=0;r<i;r++){const o=(r+.5)/i-.5,a=(s+.5)/i-.5,c=Math.hypot(o,a)*2,h=.5+.5*(Ra(r*.09,s*.09)*.5+Ra(r*.19+7,s*.19+3)*.3+Ra(r*.41+1,s*.41+9)*.2),f=Math.min(1,Math.max(0,(h-c)/.4)),u=f*f*(3-2*f)*(.82+.18*Math.exp(-c*c*3)),d=.12*Math.sin(Math.atan2(a,o)*5+1.3),g=Math.min(1,Math.max(0,(c-(.35+d))/(1-(.35+d)))),_=c>=1?0:1-g*g*(3-2*g),m=(s*i*2+r)*4;n.data[m]=n.data[m+1]=n.data[m+2]=255,n.data[m+3]=Math.round(255*Math.min(1,u));const p=(s*i*2+r+i)*4;n.data[p]=n.data[p+1]=n.data[p+2]=255,n.data[p+3]=Math.round(255*Math.min(1,_))}return e.putImageData(n,0,0),ss=new vl(t),ss.colorSpace=Le,ss}const ux=`
attribute float aBirth;
attribute vec4 aVel;    // xyz velocity, w life
attribute vec4 aPhys;   // gravity, drag, size, row
attribute vec4 aMisc;   // rotation, spin, alpha, bearing from the emitter's axis
uniform float uTime;
uniform float uScale;
uniform float uMaxPx;
varying vec3 vColor;
varying float vAlpha;
varying vec2 vRot;
varying float vCell;
varying vec2 vMode;
${Io}
${Uo}
${cx}
void main() {
  float age = uTime - aBirth;
  float life = aVel.w;
  if (age < 0.0 || age >= life) {
    // Unborn or dead: outside the clip volume, no raster.
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    return;
  }
  float a = age / life;
  float row = aPhys.w;
  vec3 p = ptTraj(position, aVel.xyz, aPhys.x, aPhys.y, age);
  vec4 k = ptConst(row, 0);
  if (k.x > 0.0) {
    // Wander, growing over the life, out of phase per particle.
    float s = ptSeed(float(gl_VertexID)) * 40.0;
    float w = 6.2832 * k.y * age;
    p.xz += k.x * a * vec2(sin(w + s), cos(w * 0.87 + s * 1.3));
  }
  vec4 k1 = ptConst(row, 1);
  if (k1.w > 0.0) {
    // Billow: thrown out from the column's axis, slowly and then faster, as a rising flame or plume spreads.
    p.xz += k1.w * a * a * vec2(cos(aMisc.w), sin(aMisc.w));
  }
  vec4 look = ptRamp(row, a);
  vec4 sz = ptRamp(row + 1.0, a);
  vCell = k1.z * 0.5;
  // (Mixed batch) added on, and lit from above: the layer's own (effects.ts RampTable.bake).
  vMode = ptConst(row, 2).zw;
  // Everything that is the same over a whole sprite is done here, once, not per pixel.
  vColor = pow(max(look.rgb, vec3(0.0)), vec3(0.4545));
  float rot = aMisc.x + aMisc.y * age;
  vRot = vec2(cos(rot), sin(rot));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float px = aPhys.z * sz.x * uScale / max(-mv.z, 0.001);
  // A sprite swollen to a large part of the screen is nothing but overdraw: it thins out
  // as it nears the cap and is never drawn larger.
  vAlpha = look.a * aMisc.z * (1.0 - smoothstep(uMaxPx * 0.45, uMaxPx, px));
  gl_PointSize = min(px, uMaxPx);
  gl_Position = projectionMatrix * mv;
  if (vAlpha < 0.004) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,hx=`
uniform sampler2D uMap;
varying vec3 vColor;
varying float vAlpha;
varying vec2 vRot;
varying float vCell;
varying vec2 vMode;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  vec2 p = vec2(vRot.x * q.x - vRot.y * q.y, vRot.y * q.x + vRot.x * q.y) + 0.5;
  // Rotation can carry a corner outside the cell; clamp so it never reads the neighbouring sprite.
  p = clamp(p, 0.004, 0.996);
  float a = texture2D(uMap, vec2(vCell + p.x * 0.5, p.y)).a * vAlpha;
#ifdef MIXED
  // Every sprite style in one draw: colour premultiplied by its alpha, blended ONE / ONE_MINUS_SRC_ALPHA — which is the
  // ordinary blend for dust and smoke, and an added glow when the alpha written is 0.
  float lit = vMode.y > 0.5 ? mix(1.18, 0.62, smoothstep(-0.45, 0.45, q.y)) : 1.0;
  gl_FragColor = vec4(vColor * lit * a, vMode.x > 0.5 ? 0.0 : a);
#elif defined(SHADED)
  // Smoke is a volume lit from above: brighter at the top of each puff, darker underneath,
  // denser in the middle. Unrotated coordinates, so the light stays overhead as it spins.
  float lit = mix(1.18, 0.62, smoothstep(-0.45, 0.45, q.y));
  gl_FragColor = vec4(vColor * lit, a);
#else
  gl_FragColor = vec4(vColor, a);
#endif
}`,qc=-1;class fx extends Uf{constructor(t,e,n,s,r){super(t),this.shared=e,this.blending=n,this.shaded=s,this.order=r,this.object=this.build()}buffer;geometry;material;build(){this.buffer=new lf(this.data,ae).setUsage(pl);const t=new Ke;t.setAttribute("position",new Mn(this.buffer,3,0)),t.setAttribute("aBirth",new Mn(this.buffer,1,3)),t.setAttribute("aVel",new Mn(this.buffer,4,4)),t.setAttribute("aPhys",new Mn(this.buffer,4,8)),t.setAttribute("aMisc",new Mn(this.buffer,4,12)),t.setDrawRange(0,0),t.boundingSphere=new Rs(new P,1e6),this.geometry=t,this.material=new dn({uniforms:{uTime:this.shared.uTime,uRamp:this.shared.uRamp,uMap:{value:lx()},uScale:{value:600},uMaxPx:{value:400}},defines:this.blending===qc?{MIXED:""}:this.shaded?{SHADED:""}:{},vertexShader:ux,fragmentShader:hx,transparent:!0,depthWrite:!1,blending:this.blending===qc?Vh:this.blending,blendSrc:ja,blendDst:ir,blendSrcAlpha:ja,blendDstAlpha:ir});const e=new hp(t,this.material);return e.frustumCulled=!1,e.renderOrder=this.order,e.visible=!1,e.onBeforeRender=(n,s,r)=>dx(n,r,this.material),e}setDrawCount(t){this.geometry.setDrawRange(0,t)}}const If=new Ot;function dx(i,t,e){const n=t;if(!n.isPerspectiveCamera)return;const s=i.getRenderTarget(),r=s?s.height:i.getDrawingBufferSize(If).y,o=n.view&&n.view.enabled?n.view.fullHeight/n.view.height:1,a=r*o/(2*Math.tan(n.fov*Math.PI/360)/n.zoom),c=e.uniforms;c.uScale.value=a,c.uMaxPx.value=r*.4}const px=`
attribute vec4 iA;   // birth position, birth
attribute vec4 iB;   // velocity, life
attribute vec4 iC;   // gravity, drag, size, row
attribute vec4 iD;   // -, -, alpha, floor-hit age
uniform float uTime;
varying vec3 vCol;
varying vec2 vUv;
varying float vA;
${Io}
${Uo}
void main() {
  float age = uTime - iA.w;
  float life = iB.w;
  if (age < 0.0 || age >= life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  float row = iC.w;
  float a = age / life;
  vec3 p; vec3 v;
  float th = iD.w;
  if (th >= 0.0 && age > th) {
    // Off the floor: where and how fast it hit, the bounce, then the same motion again.
    vec3 p1 = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, th);
    vec3 v1 = ptVel(iB.xyz, iC.x, iC.y, th);
    float keep = ptConst(row, 0).w;
    v1 = vec3(v1.x * 0.72, -v1.y * keep, v1.z * 0.72);
    p = ptTraj(p1, v1, iC.x, iC.y, age - th);
    v = ptVel(v1, iC.x, iC.y, age - th);
    // One bounce is drawn; after it, it slides rather than sinking through.
    if (p.y < p1.y) { p.y = p1.y; v.y = 0.0; }
  } else {
    p = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, age);
    v = ptVel(iB.xyz, iC.x, iC.y, age);
  }
  vec4 look = ptRamp(row, a);
  float width = iC.z * ptRamp(row + 1.0, a).y;
  float stretch = ptConst(row, 0).z;
  vec4 vp = viewMatrix * vec4(p, 1.0);
  vec3 vv = (viewMatrix * vec4(v, 0.0)).xyz;
  // Only motion across the screen draws as length: a spark flying at you is a dot.
  float sp = length(vv.xy);
  vec2 d = sp > 1e-4 ? vv.xy / sp : vec2(0.0, 1.0);
  float len = max(width * 1.4, sp * stretch);
  vec2 perp = vec2(-d.y, d.x);
  vp.xy += perp * position.x * width + d * (position.y - 0.5) * len;
  gl_Position = projectionMatrix * vp;
  vCol = look.rgb;
  vUv = uv;
  vA = look.a * iD.z;
}`,mx=`
varying vec3 vCol;
varying vec2 vUv;
varying float vA;
void main() {
  float h = vUv.y;
  float across = smoothstep(0.0, 0.7, 1.0 - abs(vUv.x * 2.0 - 1.0));
  float along = pow(h, 1.5);
  float core = smoothstep(0.72, 1.0, h) * across;
  vec3 c = vCol * (0.55 + along) + vec3(core) * 0.55;
  // Linear to sRGB by square root: within a few percent for hot colours, far cheaper than pow.
  gl_FragColor = vec4(sqrt(max(c, vec3(0.0))), vA * along * across);
}`;class Al extends Uf{buffer;geometry;material;instanced(t,e,n){this.buffer=new Sp(this.data,ae).setUsage(pl);const s=new yp;s.index=t.index,s.setAttribute("position",t.attributes.position),t.attributes.uv&&s.setAttribute("uv",t.attributes.uv),t.attributes.normal&&s.setAttribute("normal",t.attributes.normal),s.setAttribute("iA",new Mn(this.buffer,4,0)),s.setAttribute("iB",new Mn(this.buffer,4,4)),s.setAttribute("iC",new Mn(this.buffer,4,8)),s.setAttribute("iD",new Mn(this.buffer,4,12)),s.instanceCount=0,s.boundingSphere=new Rs(new P,1e6),this.geometry=s,this.material=e;const r=new We(s,e);return r.frustumCulled=!1,r.renderOrder=n,r.visible=!1,r}setDrawCount(t){this.geometry.instanceCount=t}}class gx extends Al{constructor(t,e){super(t),this.shared=e,this.object=this.build()}build(){return this.instanced(new Ps(1,1),new dn({uniforms:{uTime:this.shared.uTime,uRamp:this.shared.uRamp},vertexShader:px,fragmentShader:mx,transparent:!0,depthWrite:!1,blending:nr,side:un,forceSinglePass:!0}),5)}}const _x=`
attribute vec4 iA;   // birth position, birth
attribute vec4 iB;   // velocity, life
attribute vec4 iC;   // gravity, drag, width, row
attribute vec4 iD;   // drawn-from point (muzzle), alpha
uniform float uTime;
uniform float uViewH;  // pixel height of what it is drawn into
varying vec3 vCol;
varying vec2 vQ;       // along the streak from its tail, and across it, in core widths
varying float vL;      // the streak's length, in core widths
varying float vA;
${Io}
${Uo}
// Distance flown along the line and the speed now, under drag that goes as v² (a round's).
vec2 quadFlight(float v0, float d, float t) {
  if (d < 1e-6) return vec2(v0 * t, v0);
  float q = 1.0 + d * v0 * t;
  return vec2(log(q) / d, v0 / q);
}
// Where the round is at time t, which way it is going, how far it has come and how fast it is going now.
void flight(float t, float quad, out vec3 head, out vec3 dir, out float flown, out float speed) {
  float v0 = length(iB.xyz);
  vec3 d0 = iB.xyz / max(v0, 1e-4);
  if (quad > 0.5) {
    // A round: drag as v² along the line, gravity across it.
    vec2 f = quadFlight(v0, iC.y, t);
    head = iA.xyz + d0 * f.x - vec3(0.0, 0.5 * iC.x * t * t, 0.0);
    vec3 v = d0 * f.y - vec3(0.0, iC.x * t, 0.0);
    dir = normalize(v);
    flown = f.x;
    speed = length(v);
  } else {
    head = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, t);
    vec3 v = ptVel(iB.xyz, iC.x, iC.y, t);
    dir = normalize(v);
    flown = length(head - iA.xyz);
    speed = length(v);
  }
}
const float LINGER = 0.09;
const float TR = 3.0;   // the glow's reach round the line, in core widths
/** Metres in front of the eye a tracer is cut at (see the cut below). */
const float NEAR_CUT = 0.3;
void main() {
  float age = uTime - iA.w;
  float life = iB.w;
  if (age < 0.0 || age >= life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  float row = iC.w;
  vec4 k1 = ptConst(row, 1);
  vec4 k2 = ptConst(row, 2);
  vec3 head; vec3 dir; float flown; float speed;
  // Ended (negative alpha): the round stopped at life - LINGER. The head stays there; the tail keeps coming.
  bool ended = iD.w < 0.0;
  float stopAt = ended ? max(0.0, life - LINGER) : 1e9;
  flight(min(age, stopAt), k1.y, head, dir, flown, speed);
  // As long as the effect says, and never shorter than the stretch of flight the eye keeps between frames.
  float len = max(k1.x, speed * k2.y);
  float tailLen = min(len, flown);
  float burn = 1.0;
  if (ended && age > stopAt) {
    // Stopped: the tail draws in to the head over LINGER and burns out. Slower than the round itself would run it
    // in, on purpose: a round reaches a wall ten metres off in a hundredth of a second, and the streak the eye
    // keeps of it is the only tracer anyone sees.
    float k = (age - stopAt) / LINGER;
    tailLen *= 1.0 - k;
    burn = 1.0 - k * k;
  }
  // Tumbling (a ricochet): brightest each time it turns side-on, a dull spark end-on; fatter as it flares.
  float flare = 1.0;
  if (k2.x > 0.0) {
    float turn = abs(sin(age * k2.x * 3.14159 + fract(iA.w * 7.31) * 6.2832));
    flare = 0.25 + 0.75 * turn * turn;
  }
  vec3 tail = head - dir * tailLen;
  // For the first few metres the tail is drawn back to where it was fired from — a muzzle —
  // so a round that really left the eye still appears to leave the barrel.
  tail = mix(iD.xyz, tail, clamp(flown / 6.0, 0.0, 1.0));
  vec4 vh = viewMatrix * vec4(head, 1.0);
  vec4 vt = viewMatrix * vec4(tail, 1.0);
  // A round that has flown past you has one end behind the eye. The width is held to a few pixels at the two ENDS
  // only, and between them it is blended — so a streak running from in front of you to behind you was blended through
  // the space just in front of the eye, where a few centimetres fill the screen: a round whipping past drew as a bar
  // fanning across the whole view. The streak is cut where it comes within NEAR_CUT of the eye, so both ends are
  // always in front and the width holds along all of it; one wholly behind the eye is not drawn.
  if (vh.z > -NEAR_CUT && vt.z > -NEAR_CUT) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  if (vh.z > -NEAR_CUT) vh.xyz = mix(vt.xyz, vh.xyz, (-NEAR_CUT - vt.z) / (vh.z - vt.z));
  else if (vt.z > -NEAR_CUT) vt.xyz = mix(vh.xyz, vt.xyz, (-NEAR_CUT - vh.z) / (vt.z - vh.z));
  float w = iC.z * ptRamp(row + 1.0, age / life).y * (0.75 + 0.5 * flare);
  // A round coming straight at you is end-on: it is drawn as what it is then, a burning point growing toward you (the
  // rod's round end seen face on; see below). It used to be stretched into a short streak pointing whichever way its
  // flight happened to project, which read as a stray dash, not as fire coming in.
  // A rod of burning light, not a strip: the quad turned about the streak's own 3D line to face the eye, carried past
  // both ends so they are round, and shaded by distance from the line (TRACER_FRAG). The old flat strip, faced to the
  // screen by its 2D direction and square at both ends, read as a sticker in the air from every side.
  float t = position.y + 0.5;
  vec3 a3 = vt.xyz;
  vec3 b3 = vh.xyz;
  vec3 d3 = b3 - a3;
  float len3 = length(d3);
  d3 = len3 > 1e-5 ? d3 / len3 : vec3(0.0, 1.0, 0.0);
  vec3 vp = mix(a3, b3, t);
  // Never thinner than a couple of pixels wherever it is: a far tracer stays a thin bright line instead of breaking
  // up into crawling dots. A widened one is dimmed by as much, so it does not get brighter for being far away.
  float px = 2.0 * max(-vp.z, 0.05) / (projectionMatrix[1][1] * uViewH);
  // And never fatter than several pixels either: a round whipping past a metre from the eye is a fast streak, not a
  // flame filling a corner of the screen (its width is real metres, and that close a centimetre is huge). Between the
  // two it keeps its real width, each end by its own distance: one near is fatter than one far, and one running away
  // from you narrows down its length — held to the same few pixels everywhere, they read as strokes on the glass.
  float core = clamp(w, px * 1.8, px * 9.0);
  vec3 eye3 = normalize(-vp);
  vec3 side3 = cross(d3, eye3);
  float sl = length(side3);
  side3 = sl > 1e-4 ? side3 / sl : vec3(1.0, 0.0, 0.0);
  // The quad's other axis across the line of sight too (the streak as the eye sees it): end on, a round point.
  vec3 along3 = normalize(cross(eye3, side3));
  float seen = len3 * sqrt(max(0.0, 1.0 - dot(d3, eye3) * dot(d3, eye3)));
  float ext = TR * core;
  vp = mix(a3, b3, t) + along3 * (t * 2.0 - 1.0) * ext + side3 * position.x * 2.0 * ext;
  gl_Position = projectionMatrix * vec4(vp, 1.0);
  vec4 look = ptRamp(row, age / life);
  vCol = look.rgb;
  vQ = vec2((t * (seen + 2.0 * ext) - ext) / core, position.x * 2.0 * TR);
  vL = seen / core;
  vA = look.a * abs(iD.w) * min(1.0, sqrt(w / core)) * burn * flare;
}`,vx=`
varying vec3 vCol;
varying vec2 vQ;
varying float vL;
varying float vA;
const float TR = 3.0;
void main() {
  // Distance from the streak's line (the segment, so the head and tail are round), in core widths.
  float dA = vQ.x < 0.0 ? -vQ.x : max(0.0, vQ.x - vL);
  float d = length(vec2(dA, vQ.y));
  float u = d / TR;                     // 0 on the line, 1 at the edge of the glow
  if (u >= 1.0) discard;
  float t = 1.0 - clamp(vQ.x / max(vL, 1e-3), 0.0, 1.0);   // 0 at the head, 1 at the tail
  // A comet, not a stroke: the rod is fattest at its head and narrows to its tail (the burning compound and the hot
  // gas it leaves, thinning as it cools), so it has a shape the eye reads as a solid thing flying, nose first.
  float r = mix(1.15, 0.4, t);
  float dr = d / r;
  // A white-hot thread, a round tube of the tracer's colour (brightest down its middle, rounding off to its sides,
  // as light through a burning rod does), and a faint halo.
  float thread = exp(-dr * dr * 4.5);
  float tube = 1.4;
  float body = dr < tube ? sqrt(1.0 - (dr / tube) * (dr / tube)) : 0.0;
  float halo = exp(-u * u * 4.0) * (1.0 - u * u);
  // Brightest at the head, the burning compound, then trailing off; the very end of the tail feathers out.
  float head = exp(-t * 9.0);
  float trail = pow(1.0 - t, 1.6) * smoothstep(1.0, 0.86, t);
  // The burning compound itself: a white-hot ball at the nose, a little fatter than the rod behind it.
  vec2 nose = vec2(vQ.x - vL, vQ.y);
  float bulb = exp(-dot(nose, nose) * 1.1);
  float hot = thread * (0.6 + 0.9 * head) * (0.35 + trail) + bulb * 0.9;
  float glow = body * (0.55 + 0.9 * head) * trail + halo * 0.3 * (0.4 + trail) + bulb * 0.5;
  float a = min(1.0, hot * 1.5 + glow) * vA;
  vec3 c = mix(vCol, vec3(1.0, 0.96, 0.86), clamp(hot * 1.3, 0.0, 1.0));
  gl_FragColor = vec4(sqrt(max(c, vec3(0.0))), a);
}`;class xx extends Al{constructor(t,e){super(t),this.shared=e,this.object=this.build()}build(){return this.instanced(new Ps(1,1),new dn({uniforms:{uTime:this.shared.uTime,uRamp:this.shared.uRamp,uViewH:{value:760}},vertexShader:_x,fragmentShader:vx,transparent:!0,depthWrite:!1,blending:nr,side:un,forceSinglePass:!0}),4)}instanced(t,e,n){const s=super.instanced(t,e,n);return s.onBeforeRender=r=>{const o=r.getRenderTarget();e.uniforms.uViewH.value=o?o.height:r.getDrawingBufferSize(If).y},s}}const Nf=`
float fbHash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float fbNoise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(fbHash(i), fbHash(i + vec3(1, 0, 0)), f.x), mix(fbHash(i + vec3(0, 1, 0)), fbHash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(fbHash(i + vec3(0, 0, 1)), fbHash(i + vec3(1, 0, 1)), f.x), mix(fbHash(i + vec3(0, 1, 1)), fbHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float fbFbm(vec3 p) { return 0.6 * fbNoise(p) + 0.3 * fbNoise(p * 2.1 + 7.3) + 0.1 * fbNoise(p * 4.3 + 3.1); }`,yx=`
attribute vec4 iA;
attribute vec4 iB;
attribute vec4 iC;
attribute vec4 iD;
uniform float uTime;
varying vec3 vCol;
varying float vA;
varying float vAge;
varying vec3 vNoiseAt;
varying vec3 vNormalV;
varying vec3 vViewV;
${Io}
${Uo}
${Nf}
void main() {
  float age = uTime - iA.w;
  float life = iB.w;
  if (age < 0.0 || age >= life) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vA = 0.0; return; }
  float a = age / life;
  float row = iC.w;
  vec3 c = ptTraj(iA.xyz, iB.xyz, iC.x, iC.y, age);
  float r = iC.z * ptRamp(row + 1.0, a).x;
  vec4 look = ptRamp(row, a);
  // Its own pattern: seeded from where and when it was born.
  vec3 seed = vec3(fbHash(iA.xyz + iA.w), fbHash(iA.zxy - iA.w), fbHash(iA.yzx + 3.7)) * 40.0;
  vec3 n = normalize(position);
  vec3 at = n * 1.8 + seed + vec3(0.0, -age * 1.6, 0.0);
  // Lumpy from the start, more so as it billows out.
  float bulge = (fbFbm(at) - 0.5) * (0.45 + 0.35 * a);
  vec3 wp = c + n * r * (1.0 + bulge);
  vec4 mv = modelViewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mv;
  vNormalV = normalize((modelViewMatrix * vec4(n, 0.0)).xyz);
  vViewV = -mv.xyz;
  vNoiseAt = n * 3.2 + seed + vec3(0.0, -age * 2.4, 0.0);
  vAge = a;
  vCol = look.rgb;
  vA = look.a * iD.z;
}`,Mx=`
varying vec3 vCol;
varying float vA;
varying float vAge;
varying vec3 vNoiseAt;
varying vec3 vNormalV;
varying vec3 vViewV;
${Nf}
void main() {
  // Facing you: looking deep into the fire. Toward the rim: a thin skin of it, fading out softly.
  float facing = abs(dot(normalize(vNormalV), normalize(vViewV)));
  float depth = pow(facing, 1.3);
  float churn = fbFbm(vNoiseAt);
  // Soot spreading through it as it cools: the fire is left in ragged tongues, then goes out.
  float soot = smoothstep(0.62 - 0.55 * vAge, 0.95 - 0.5 * vAge, 1.0 - churn);
  float heat = (0.45 + 0.9 * churn) * (0.35 + 0.65 * depth);
  vec3 col = vCol * heat * (1.0 - 0.85 * soot);
  // The hottest folds burn toward white.
  col += vec3(1.0, 0.85, 0.55) * pow(max(churn - 0.55, 0.0) * 2.2, 2.0) * (1.0 - vAge) * depth;
  float a = vA * smoothstep(0.0, 0.45, facing) * (1.0 - 0.7 * soot);
  gl_FragColor = vec4(sqrt(max(col, vec3(0.0))), a);
}`;class Sx extends Al{constructor(t,e){super(t),this.shared=e,this.object=this.build()}build(){return this.instanced(new xl(1,28,18),new dn({uniforms:{uTime:this.shared.uTime,uRamp:this.shared.uRamp},vertexShader:yx,fragmentShader:Mx,transparent:!0,depthWrite:!1,blending:nr}),6)}}const bx={soft:"puff",smoke:"puff",glow:"puff",streak:"spark",tracer:"constant",fireball:"fireball-core",chunk:"constant"};function Me(i,t,e){return i===void 0?e:typeof i=="number"?i:i[0]+(i[1]-i[0])*t}class Ex{constructor(t){this.maxLayers=t,this.data=new Float32Array(An*t*is*4),this.texture=new uf(this.data,An,t*is,sn,Ln),this.texture.minFilter=Xe,this.texture.magFilter=Xe,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0}texture;data;rowsUsed=0;allocate(){if(this.rowsUsed+is>this.maxLayers*is)throw new Error("particles: out of effect layers");const t=this.rowsUsed;return this.rowsUsed+=is,t}spriteStyle(t){const e=(Math.round(t)+2)*An*4;return this.data[e+10]>.5?"glow":this.data[e+11]>.5?"smoke":"soft"}get layersUsed(){return this.rowsUsed/is}bake(t,e,n){const s=ih[e.model??bx[n]]??ih.puff,r={color:new Ut(e.color??16777215),colorEnd:new Ut(e.colorEnd??e.color??16777215),alpha:1,grow:e.grow??1.8,fadeIn:e.fadeIn??.08},o={r:0,g:0,b:0,a:0,size:1,width:1},a=this.data;for(let l=0;l<An;l++){const h=l/(An-1);s(h,r,o),e.colorCurve&&ax(e.colorCurve,h,o),e.alphaCurve&&(o.a=sh(e.alphaCurve,h)),e.sizeCurve&&(o.size=sh(e.sizeCurve,h));const f=(t*An+l)*4;a[f]=o.r,a[f+1]=o.g,a[f+2]=o.b,a[f+3]=o.a;const u=((t+1)*An+l)*4;a[u]=o.size,a[u+1]=o.width,a[u+2]=0,a[u+3]=0}const c=(t+2)*An*4;a[c]=e.turbulence??0,a[c+1]=e.turbulenceFreq??1.4,a[c+2]=e.stretch??.045,a[c+3]=e.bounce??0,a[c+4]=e.length??4.2,a[c+5]=e.quadraticDrag?1:0,a[c+6]=e.sprite==="lick"?1:0,a[c+7]=e.billow??0,a[c+8]=e.tumble??0,a[c+9]=e.lengthTime??0,a[c+10]=n==="glow"?1:0,a[c+11]=n==="smoke"?1:0,this.texture.needsUpdate=!0}}class wx{constructor(t){this.ramps=t}effects=new Map;rows=new Map;register(t,e){const n=this.rows.get(t)??[],s=[],r=e.layers.map((c,l)=>{const h=n[l]??this.ramps.allocate();return s.push(h),c.style!=="chunk"&&this.ramps.bake(h,c,c.style),{def:c,style:c.style,row:h}});for(let c=s.length;c<n.length;c++)s.push(n[c]);this.rows.set(t,s);const o=e.cullDistance??150,a={name:t,def:e,layers:r,cullDistanceSq:o*o};return this.effects.set(t,a),a}get(t){return this.effects.get(t)}has(t){return this.effects.has(t)}names(){return[...this.effects.keys()].sort()}}class Tx{constructor(t){this.effect=t}position=new P;direction=new P(0,1,0);follow=null;rate=1;intensity=1;active=!0;range=80;radius=null;extent=null;velocity=new P;floor=null;carry=[]}const Ax=new P,rh=new P,oh=new P,Ca=new P,rs=new P,qr=new P,Rx=new P,Cx={},ah=new P(0,1,0),ch={},Px={},lh=.09;function Lx(i){const t=Math.floor(i);return t+(Math.random()<i-t?1:0)}const Dx=15,Ux={soft:1024,smoke:512,glow:2048,streak:1024,tracer:128,fireball:32};class Ix{ramps=new Ex(192);effects=new wx(this.ramps);root=new Zs;focus=new P;density=1;time=0;shared;batches;batchList;chunkList=[];chunks=new Map;emitters=new Set;seenView=!1;constructor(t,e,n={}){const s={...Ux,...n};this.shared={uTime:{value:0},uRamp:{value:this.ramps.texture}};const r=new fx(s.smoke+s.soft+s.glow,this.shared,qc,!1,5);this.batches={smoke:r,soft:r,glow:r,streak:new gx(s.streak,this.shared),tracer:new xx(s.tracer,this.shared),fireball:new Sx(s.fireball,this.shared)},this.batchList=[...new Set(Object.values(this.batches))];let o=0;for(const a of this.batchList)o+=a.capacity;this.countPer=Math.ceil(o/Dx),this.root.name="particles";for(const a of this.batchList)this.root.add(a.object);t.add(this.root),this.root.matrixAutoUpdate=!1,this.root.matrixWorldAutoUpdate=!1,sx(this.root),e.tap((a,c)=>{a==="fx"&&this.onEvent(c)})}register(t,e){this.effects.register(t,e)}has(t){return this.effects.get(t)!==void 0}registerChunk(t,e){const n=this.chunks.get(t);n&&(this.root.remove(n.mesh),this.chunkList.splice(this.chunkList.indexOf(n),1)),this.chunks.set(t,e),this.chunkList.push(e),this.root.add(e.mesh)}chunkPool(t){return this.chunks.get(t)}fire(t,e,n=ch){return this.fireDelayed(t,e,n,0)}fireDelayed(t,e,n,s){const r=this.effects.get(t);if(!r||this.seenView&&e.distanceToSquared(this.focus)>r.cullDistanceSq)return!1;const o=n.intensity??1,a=(n.count??1)*this.density;for(const c of r.layers){const l=c.def;if(l.minIntensity!==void 0&&o<l.minIntensity)continue;const h=Lx(Me(l.count,o,1)*a);h<=0||(c.style==="chunk"?this.burstChunks(c,e,n,h,o):this.spawnLayer(c,e,n,o,h,s+(l.delay??0),null,-1))}return!0}emitter(t){const e=new Tx(t);return this.emitters.add(e),e}removeEmitter(t){this.emitters.delete(t)}get emitterCount(){return this.emitters.size}tracer(t,e,n,s,r,o,a){const l=this.effects.get(t)?.layers.find(g=>g.style==="tracer");if(!l)return-1;const h=this.batches.tracer,f=h.written,u=h.claim(),d=h.data;return d[u]=e.x,d[u+1]=e.y,d[u+2]=e.z,d[u+3]=this.time,d[u+4]=n.x,d[u+5]=n.y,d[u+6]=n.z,d[u+7]=a,d[u+8]=r,d[u+9]=o,d[u+10]=Me(l.def.size,1,.085),d[u+11]=l.row,d[u+12]=s.x,d[u+13]=s.y,d[u+14]=s.z,d[u+15]=Me(l.def.alpha,1,1),h.lastDeath=Math.max(h.lastDeath,this.time+a),f}endTracer(t,e){const n=this.batches.tracer,s=n.slotOf(t);if(s<0)return;const r=s*ae,o=this.time-n.data[r+3];if(n.data[r+15]<0||o>=n.data[r+7])return;const a=Math.max(0,e??o);n.data[r+3]+n.data[r+7]>=n.lastDeath-.001&&(n.deathStale=!0),n.data[r+7]=a+lh,n.data[r+15]=-Math.abs(n.data[r+15]),n.lastDeath=Math.max(n.lastDeath,n.data[r+3]+a+lh),n.touch(s)}spawnLayer(t,e,n,s,r,o,a,c){const l=t.def,h=t.style,f=this.batches[h],u=f.data,d=t.row,g=l.offsetY,_=l.shape??"point",m=_==="ring"?1:_==="disc"?2:_==="box"?3:0,p=m===1?a?.radius??Me(l.radius,s,.28):m===2?a?.radius??Me(l.radius,s,.5):0,y=l.lift??.07,x=a?.extent,v=m===3?x?x.x:l.extent?.[0]??.5:0,M=m===3?x?x.y:l.extent?.[1]??.5:0,T=m===3?x?x.z:l.extent?.[2]??.5:0,E=Me(l.jitter,s,0);let R=0,b=0,S=0;if(l.dir)R=l.dir[0],b=l.dir[1],S=l.dir[2];else{const U=n.dir??ah;R=U.x,b=U.y,S=U.z}const C=Me(l.spread,s,m===1?.1:.5),D=1-C,I=l.speedVariance??.45,F=Me(l.speed,s,0),k=1-I,H=l.inherit??1,$=n.velocity&&H!==0?n.velocity:null,G=l.pinch,st=Me(l.life,s,1),at=l.lifeVariance??.35,Mt=Me(l.size,s,.1),pt=l.sizeVariance??.4,Vt=Me(l.gravity,s,0),Xt=Me(l.drag,s,1.4),Nt=h==="soft"||h==="smoke"||h==="glow",Y=Me(l.alpha,s,Nt?.75:1),K=h==="streak",ft=h==="tracer",Tt=K?n.floor??a?.floor??null:null,gt=K&&l.bounce!==void 0&&Tt!==null?Tt+(l.floorOffset??0):null,Ht=l.spin??1.1,ie=l.onDeath;for(let U=0;U<r;U++){const ee=c>=0?-c*((U+Math.random())/r):o;let Rt=e.x,wt=e.y,dt=e.z;g&&(wt+=g);let Kt=R,_t=b,It=S;if(m===1){const ht=(U+Math.random()*.8)/r*Math.PI*2,it=Math.cos(ht),Lt=Math.sin(ht);Rt+=it*p,dt+=Lt*p,Kt=it,_t=y,It=Lt}else if(m===2){const ht=Math.random()*Math.PI*2,it=Math.sqrt(Math.random())*p;Rt+=Math.cos(ht)*it,dt+=Math.sin(ht)*it}else m===3&&(Rt+=(Math.random()*2-1)*v,wt+=(Math.random()*2-1)*M,dt+=(Math.random()*2-1)*T);E>0&&(Rt+=(Math.random()-.5)*E,wt+=(Math.random()-.5)*E,dt+=(Math.random()-.5)*E);const me=Math.random()*Math.PI*2,re=Math.random()*2-1,L=Math.sqrt(Math.max(0,1-re*re));let w=L*Math.cos(me),z=L*Math.sin(me),X=re;w*=C,z*=C,X*=C,w+=Kt*D,z+=_t*D,X+=It*D,w*w+z*z+X*X<1e-8&&(w=Kt,z=_t,X=It);const Z=1/(Math.sqrt(w*w+z*z+X*X)||1);w*=Z,z*=Z,X*=Z;const q=F*(k+Math.random()*2*I);let St=w*q,et=z*q,vt=X*q;if($&&(St+=$.x*H,et+=$.y*H,vt+=$.z*H),G){let ht=Rt-e.x,it=wt-e.y,Lt=dt-e.z;const N=-(ht*w+it*z+Lt*X);ht+=w*N,it+=z*N,Lt+=X*N,St+=ht*-G,et+=it*-G,vt+=Lt*-G}const xt=st*(1-at*Math.random()),Q=Mt*(1-pt*Math.random()),ct=this.time+ee,lt=f.claim();if(u[lt]=Rt,u[lt+1]=wt,u[lt+2]=dt,u[lt+3]=ct,u[lt+4]=St,u[lt+5]=et,u[lt+6]=vt,u[lt+7]=xt,u[lt+8]=Vt,u[lt+9]=Xt,u[lt+10]=Q,u[lt+11]=d,K)u[lt+12]=0,u[lt+13]=0,u[lt+14]=Y,u[lt+15]=gt!==null?ox(wt,et,Vt,Xt,gt,xt):-1;else if(ft)u[lt+12]=Rt,u[lt+13]=wt,u[lt+14]=dt,u[lt+15]=Y;else{u[lt+12]=Math.random()*Math.PI*2,u[lt+13]=(Math.random()*2-1)*Ht,u[lt+14]=Y;const ht=Rt-e.x,it=dt-e.z;u[lt+15]=ht*ht+it*it>1e-6?Math.atan2(it,ht):Math.random()*Math.PI*2}f.lastDeath=Math.max(f.lastDeath,ct+xt),ie&&Math.random()<(ie.chance??1)&&(oh.set(Rt,wt,dt),rh.set(St,et,vt),rx(oh,rh,Vt,Xt,xt,Ca),(ie.minRise===void 0||Ca.y-e.y>=ie.minRise)&&this.fireDelayed(ie.effect,Rx.copy(Ca),ch,ee+xt))}}burstChunks(t,e,n,s,r){const o=t.def,a=this.chunks.get(o.chunk??"");a&&a.burst(e,{count:s,normal:o.dir?Ax.set(o.dir[0],o.dir[1],o.dir[2]):n.dir??ah,speed:Me(o.speed,r,6),spread:Me(o.spread,r,.3),minSize:Me(o.minSize,r,.05),maxSize:Me(o.maxSize,r,.15),restY:(n.floor??e.y)+(o.floorOffset??0),life:Me(o.life,r,2.6)})}onEvent(t){const e=t;if(!e||typeof e.effect!="string")return;const n=uh(e.at,rs);if(!n)return;const s=uh(e.dir,qr),r=Px;r.dir=s?s.normalize():void 0,r.intensity=typeof e.intensity=="number"?e.intensity:void 0,this.fire(e.effect,n,r)}streamDt=0;streamEach(t){this.stream(t,this.streamDt)}update(t,e){if(this.time+=t,this.streamDt=t,this.time>2048){for(const n of this.batchList)n.rebase(1024);this.time-=1024}this.shared.uTime.value=this.time,e&&(e.getWorldPosition(this.focus),this.seenView=!0),this.emitters.size>0&&this.emitters.forEach(this.streamEach,this);for(let n=0;n<this.chunkList.length;n++){const s=this.chunkList[n];s.active>0&&s.update(t)}for(let n=0;n<this.batchList.length;n++)this.batchList[n].flush(this.time);this.countSlice()}countSlice(){const t=this.time;let e=this.countPer;for(;e>0;){const n=this.batchList[this.countBatch];if(!n){let c=this.countSum;for(let l=0;l<this.chunkList.length;l++)c+=this.chunkList[l].active;this.activeCount=c,this.countBatch=0,this.countAt=0,this.countSum=0;return}const s=Math.min(n.written,n.capacity);if(t>=n.lastDeath||this.countAt>=s){this.countBatch++,this.countAt=0;continue}const r=Math.min(s,this.countAt+e),o=n.data;let a=0;for(let c=this.countAt*ae+3,l=r*ae+3;c<l;c+=ae){const h=t-o[c];h>=0&&h<o[c+4]&&a++}this.countSum+=a,e-=r-this.countAt,this.countAt=r}}stream(t,e){if(!t.active||t.rate<=0)return;const n=this.effects.get(t.effect);if(!n)return;if(t.follow?(rs.copy(t.position).applyMatrix4(t.follow.matrixWorld),qr.copy(t.direction).transformDirection(t.follow.matrixWorld)):(rs.copy(t.position),qr.copy(t.direction).normalize()),this.seenView&&rs.distanceToSquared(this.focus)>t.range*t.range){t.carry.length=0;return}const s=Cx;s.dir=qr,s.intensity=t.intensity,s.velocity=t.velocity,s.floor=t.floor??void 0;const r=t.rate*this.density;for(let o=0;o<n.layers.length;o++){const a=n.layers[o],c=Me(a.def.rate,t.intensity,0)*r;if(c<=0)continue;const l=(t.carry[o]??0)+c*e,h=Math.floor(l);if(t.carry[o]=l-h,!(h<=0)){if(a.style==="chunk"){this.burstChunks(a,rs,s,h,t.intensity);continue}this.spawnLayer(a,rs,s,t.intensity,h,0,t,e)}}}clear(){for(const t of this.batchList)t.clear();for(const t of this.chunkList)t.clear();this.activeCount=0,this.countBatch=0,this.countAt=0,this.countSum=0}live(){const t={soft:0,smoke:0,glow:0,streak:0,tracer:0,fireball:0,chunk:0},e=new Set;for(const[n,s]of Object.entries(this.batches)){if(e.has(s))continue;e.add(s);const r=s===this.batches.soft,o=Math.min(s.written,s.capacity);let a=0;for(let c=0;c<o;c++){const l=this.time-s.data[c*ae+3];l>=0&&l<s.data[c*ae+7]&&(r?t[this.ramps.spriteStyle(s.data[c*ae+11])]++:a++)}r||(t[n]=a)}for(const n of this.chunks.values())t.chunk+=n.active;return t}get active(){return this.activeCount}activeCount=0;countBatch=0;countAt=0;countSum=0;countPer;batch(t){return this.batches[t]}warm(t){const e="__warm";this.effects.has(e)||this.register(e,{cullDistance:1e9,layers:[{style:"soft",count:1,life:1,size:.3},{style:"smoke",count:1,life:1,size:.3},{style:"glow",count:1,life:1,size:.3},{style:"streak",count:1,life:1,size:.05,speed:1},{style:"tracer",count:1,life:1,size:.05,speed:1},{style:"fireball",count:1,life:1,size:.1},...[...this.chunks.keys()].map(s=>({style:"chunk",chunk:s,count:1,life:1,speed:.1}))]});const n=this.density;this.density=1,this.fire(e,t),this.density=n,this.update(.001)}}function uh(i,t){return i instanceof P?t.copy(i):Array.isArray(i)&&i.length===3&&i.every(e=>typeof e=="number")?t.set(i[0],i[1],i[2]):null}new Wt;new P;new P;new P;function hh(i){for(let t=i;t;t=t.parent)if(!t.visible)return!1;return!0}class Nx{constructor(t,e,n,s,r=-1){this.batch=t,this.geometry=e,this.placer=n,this.onRebuilt=s,this.layer=r,this.count=e.index?e.index.count:0}start=-1;count;placedAt=new Wt;shown=!0;setRange(t,e,n){this.batch.setRange(this,t,e,n)}}class Fx{constructor(t,e){this.material=t,this.scene=e}slots=[];mesh=null;original=null;dirty=!0;rebuild(){this.dirty=!1,this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh=null,this.original=null);const t=[],e=[];for(const o of this.slots){if(o.start=-1,o.count===0)continue;o.placer.updateWorldMatrix(!0,!1),o.placedAt.copy(o.placer.matrixWorld);const a=o.geometry.clone().applyMatrix4(o.placer.matrixWorld);if(o.layer>=0){const c=a.attributes.position.count,l=new Float32Array(c*4),h=o.placer.matrixWorld.elements,f=Xc(h[12],h[13],h[14]);for(let u=0;u<c;u++)l[u*4]=o.layer,l[u*4+1]=f&255,l[u*4+2]=f>>>8&255;a.setAttribute("aSurface",new ge(l,4));for(const u of Object.keys(a.attributes))u!=="position"&&u!=="normal"&&u!=="uv"&&u!=="aSurface"&&a.deleteAttribute(u);a.attributes.uv||a.setAttribute("uv",new bn(new Float32Array(c*2),2))}t.push(a),e.push(o)}if(t.length===0)return;const n=t.length===1?t[0]:Df(t,!1);if(t.length>1)for(const o of t)o.dispose();if(!n||!n.index)return;let s=0;for(const o of e)o.start=s,s+=o.count;n.index.setUsage(pl),n.computeBoundingSphere(),this.original=n.index.array.slice();const r=new We(n,this.material);r.matrixAutoUpdate=!1,r.name="static-batch",this.scene.add(r),this.mesh=r;for(const o of e)o.shown=hh(o.placer),o.shown?o.onRebuilt():this.setRange(o,0,o.count,!1)}syncShown(){const t=this.slots;for(let e=0;e<t.length;e++)this.syncOne(t[e])}syncOne(t){const e=hh(t.placer);e!==t.shown&&(t.shown=e,this.setRange(t,0,t.count,t.shown),t.shown&&t.onRebuilt())}setRange(t,e,n,s){const r=this.mesh?.geometry.index;if(!r||!this.original||t.start<0||n<=0)return;const o=t.start+e,a=r.array;s?a.set(this.original.subarray(o,o+n),o):a.fill(a[o]??0,o,o+n),r.addUpdateRange(o,n),r.needsUpdate=!0}}class Bx{constructor(t){this.scene=t}batches=new Map;batchList=[];add(t,e,n,s){const r=Tv(t),o=r?Qs():t;let a=this.batches.get(o);a||(this.batches.set(o,a=new Fx(o,this.scene)),this.batchList.push(a));const c=new Nx(a,e,n,s,r?hr(r):-1);return a.slots.push(c),a.dirty=!0,c}syncNow(t){t.batch.syncOne(t)}remove(t){const e=t.batch,n=e.slots.indexOf(t);n<0||(e.slots.splice(n,1),t.geometry.dispose(),e.dirty=!0)}update(t=!0){const e=this.batchList;for(let n=0;n<e.length;n++){const s=e[n];if(!s.dirty&&t)for(let r=0;r<s.slots.length;r++){const o=s.slots[r];if(o.placer.updateWorldMatrix(!0,!1),!o.placer.matrixWorld.equals(o.placedAt)){s.dirty=!0;break}}s.dirty?s.rebuild():s.syncShown()}}sinceChecked=0;tick(t){this.sinceChecked++;const e=t||this.sinceChecked>=30;e&&(this.sinceChecked=0),this.update(e)}stats(){let t=0,e=0;for(const n of this.batches.values())n.mesh&&t++,e+=n.slots.length;return{batches:t,slots:e}}clear(){for(const t of this.batches.values()){for(const e of t.slots)e.geometry.dispose();t.slots.length=0,t.rebuild()}}}const Ff=0,Ox=1,zx=2,fh=2,Pa=1.25,dh=1,Fe=32,be=Fe/4,Bf=65535,xo=Math.pow(2,-24),Rl=Symbol("SKIP_GENERATION"),Of={strategy:Ff,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[Rl]:!1};function pe(i,t,e){return e.min.x=t[i],e.min.y=t[i+1],e.min.z=t[i+2],e.max.x=t[i+3],e.max.y=t[i+4],e.max.z=t[i+5],e}function Yc(i){let t=-1,e=-1/0;for(let n=0;n<3;n++){const s=i[n+3]-i[n];s>e&&(e=s,t=n)}return t}function ph(i,t){t.set(i)}function mh(i,t,e){let n,s;for(let r=0;r<3;r++){const o=r+3;n=i[r],s=t[r],e[r]=n<s?n:s,n=i[o],s=t[o],e[o]=n>s?n:s}}function Yr(i,t,e){for(let n=0;n<3;n++){const s=t[i+2*n],r=t[i+2*n+1],o=s-r,a=s+r;o<e[n]&&(e[n]=o),a>e[n+3]&&(e[n+3]=a)}}function Os(i){const t=i[3]-i[0],e=i[4]-i[1],n=i[5]-i[2];return 2*(t*e+e*n+n*t)}function _e(i,t){return t[i+15]===Bf}function Ce(i,t){return t[i+6]}function Be(i,t){return t[i+14]}function Ee(i){return i+be}function we(i,t){const e=t[i+6];return i+e*be}function Cl(i,t){return t[i+7]}function La(i,t,e,n,s){let r=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0,f=1/0,u=1/0,d=1/0,g=-1/0,_=-1/0,m=-1/0;const p=i.offset||0;for(let y=(t-p)*6,x=(t+e-p)*6;y<x;y+=6){const v=i[y+0],M=i[y+1],T=v-M,E=v+M;T<r&&(r=T),E>c&&(c=E),v<f&&(f=v),v>g&&(g=v);const R=i[y+2],b=i[y+3],S=R-b,C=R+b;S<o&&(o=S),C>l&&(l=C),R<u&&(u=R),R>_&&(_=R);const D=i[y+4],I=i[y+5],F=D-I,k=D+I;F<a&&(a=F),k>h&&(h=k),D<d&&(d=D),D>m&&(m=D)}n[0]=r,n[1]=o,n[2]=a,n[3]=c,n[4]=l,n[5]=h,s[0]=f,s[1]=u,s[2]=d,s[3]=g,s[4]=_,s[5]=m}const qn=32,kx=(i,t)=>i.candidate-t.candidate,si=new Array(qn).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),$r=new Float32Array(6);function Hx(i,t,e,n,s,r){let o=-1,a=0;if(r===Ff)o=Yc(t),o!==-1&&(a=(t[o]+t[o+3])/2);else if(r===Ox)o=Yc(i),o!==-1&&(a=Vx(e,n,s,o));else if(r===zx){const c=Os(i);let l=Pa*s;const h=e.offset||0,f=(n-h)*6,u=(n+s-h)*6;for(let d=0;d<3;d++){const g=t[d],p=(t[d+3]-g)/qn;if(s<qn/4){const y=[...si];y.length=s;let x=0;for(let M=f;M<u;M+=6,x++){const T=y[x];T.candidate=e[M+2*d],T.count=0;const{bounds:E,leftCacheBounds:R,rightCacheBounds:b}=T;for(let S=0;S<3;S++)b[S]=1/0,b[S+3]=-1/0,R[S]=1/0,R[S+3]=-1/0,E[S]=1/0,E[S+3]=-1/0;Yr(M,e,E)}y.sort(kx);let v=s;for(let M=0;M<v;M++){const T=y[M];for(;M+1<v&&y[M+1].candidate===T.candidate;)y.splice(M+1,1),v--}for(let M=f;M<u;M+=6){const T=e[M+2*d];for(let E=0;E<v;E++){const R=y[E];T>=R.candidate?Yr(M,e,R.rightCacheBounds):(Yr(M,e,R.leftCacheBounds),R.count++)}}for(let M=0;M<v;M++){const T=y[M],E=T.count,R=s-T.count,b=T.leftCacheBounds,S=T.rightCacheBounds;let C=0;E!==0&&(C=Os(b)/c);let D=0;R!==0&&(D=Os(S)/c);const I=dh+Pa*(C*E+D*R);I<l&&(o=d,l=I,a=T.candidate)}}else{for(let v=0;v<qn;v++){const M=si[v];M.count=0,M.candidate=g+p+v*p;const T=M.bounds;for(let E=0;E<3;E++)T[E]=1/0,T[E+3]=-1/0}for(let v=f;v<u;v+=6){let E=~~((e[v+2*d]-g)/p);E>=qn&&(E=qn-1);const R=si[E];R.count++,Yr(v,e,R.bounds)}const y=si[qn-1];ph(y.bounds,y.rightCacheBounds);for(let v=qn-2;v>=0;v--){const M=si[v],T=si[v+1];mh(M.bounds,T.rightCacheBounds,M.rightCacheBounds)}let x=0;for(let v=0;v<qn-1;v++){const M=si[v],T=M.count,E=M.bounds,b=si[v+1].rightCacheBounds;T!==0&&(x===0?ph(E,$r):mh(E,$r,$r)),x+=T;let S=0,C=0;x!==0&&(S=Os($r)/c);const D=s-x;D!==0&&(C=Os(b)/c);const I=dh+Pa*(S*x+C*D);I<l&&(o=d,l=I,a=M.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${r} used.`);return{axis:o,pos:a}}function Vx(i,t,e,n){let s=0;const r=i.offset;for(let o=t,a=t+e;o<a;o++)s+=i[(o-r)*6+n*2];return s/e}class Da{constructor(){this.boundingData=new Float32Array(6)}}function Gx(i,t,e,n,s,r){let o=n,a=n+s-1;const c=r.pos,l=r.axis*2,h=e.offset||0;for(;;){for(;o<=a&&e[(o-h)*6+l]<c;)o++;for(;o<=a&&e[(a-h)*6+l]>=c;)a--;if(o<a){for(let f=0;f<t;f++){let u=i[o*t+f];i[o*t+f]=i[a*t+f],i[a*t+f]=u}for(let f=0;f<6;f++){const u=o-h,d=a-h,g=e[u*6+f];e[u*6+f]=e[d*6+f],e[d*6+f]=g}o++,a--}else return o}}let zf,yo,$c,kf;const Wx=Math.pow(2,32);function jc(i){return"count"in i?1:1+jc(i.left)+jc(i.right)}function Xx(i,t,e){return zf=new Float32Array(e),yo=new Uint32Array(e),$c=new Uint16Array(e),kf=new Uint8Array(e),Kc(i,t)}function Kc(i,t){const e=i/4,n=i/2,s="count"in t,r=t.boundingData;for(let o=0;o<6;o++)zf[e+o]=r[o];if(s)return t.buffer?(kf.set(new Uint8Array(t.buffer),i),i+t.buffer.byteLength):(yo[e+6]=t.offset,$c[n+14]=t.count,$c[n+15]=Bf,i+Fe);{const{left:o,right:a,splitAxis:c}=t,l=i+Fe;let h=Kc(l,o);const f=i/Fe,d=h/Fe-f;if(d>Wx)throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");return yo[e+6]=d,yo[e+7]=c,Kc(h,a)}}function qx(i,t,e,n,s,r){const{maxDepth:o,verbose:a,targetLeafSize:c,_strictLeafSize:l=1/0,strategy:h,onProgress:f}=s,u=i.primitiveBuffer,d=i.primitiveBufferStride,g=new Float32Array(6);let _=!1;const m=new Da;return La(t,e,n,m.boundingData,g),y(m,e,n,g),m;function p(x){f&&f((x-r.offset)/r.count)}function y(x,v,M,T=null,E=0){!_&&E>=o&&(_=!0,a&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));const R=M>l;if(M<=c&&!R||E>=o)return p(v+M),x.offset=v,x.count=M,x;const b=Hx(x.boundingData,T,t,v,M,h);let S=b.axis===-1?-1:Gx(u,d,t,v,M,b);if(b.axis===-1||S===v||S===v+M){if(!R)return p(v+M),x.offset=v,x.count=M,x;b.axis=Math.max(0,Yc(x.boundingData)),S=v+Math.max(1,Math.floor(M/2))}x.splitAxis=b.axis;const C=new Da,D=v,I=S-v;x.left=C,La(t,D,I,C.boundingData,g),y(C,D,I,g,E+1);const F=new Da,k=S,H=M-I;return x.right=F,La(t,k,H,F.boundingData,g),y(F,k,H,g,E+1),x}}function Yx(i,t){const e=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=i.getRootRanges(t.range),s=n[0],r=n[n.length-1],o={offset:s.offset,count:r.offset+r.count-s.offset},a=new Float32Array(6*o.count);a.offset=o.offset,i.computePrimitiveBounds(o.offset,o.count,a),i._roots=n.map(c=>{const l=qx(i,a,c.offset,c.count,t,o),h=jc(l),f=new e(Fe*h);return Xx(0,l,f),f})}class Pl{constructor(t){this._getNewPrimitive=t,this._primitives=[]}getPrimitive(){const t=this._primitives;return t.length===0?this._getNewPrimitive():t.pop()}releasePrimitive(t){this._primitives.push(t)}}class $x{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const t=[];let e=null;this.setBuffer=n=>{e&&t.push(e),e=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,t.length!==0&&this.setBuffer(t.pop())}}}const ce=new $x;let li,vs;const os=[],jr=new Pl(()=>new fe);function jx(i,t,e,n,s,r){li=jr.getPrimitive(),vs=jr.getPrimitive(),os.push(li,vs),ce.setBuffer(i._roots[t]);const o=Zc(0,i.geometry,e,n,s,r);ce.clearBuffer(),jr.releasePrimitive(li),jr.releasePrimitive(vs),os.pop(),os.pop();const a=os.length;return a>0&&(vs=os[a-1],li=os[a-2]),o}function Zc(i,t,e,n,s=null,r=0,o=0){const{float32Array:a,uint16Array:c,uint32Array:l}=ce;let h=i*2;if(_e(h,c)){const g=Ce(i,l),_=Be(h,c);return pe(i,a,li),n(g,_,!1,o,r+i/be,li)}else{let D=function(F){const{uint16Array:k,uint32Array:H}=ce;let $=F*2;for(;!_e($,k);)F=Ee(F),$=F*2;return Ce(F,H)},I=function(F){const{uint16Array:k,uint32Array:H}=ce;let $=F*2;for(;!_e($,k);)F=we(F,H),$=F*2;return Ce(F,H)+Be($,k)};var u=D,d=I;const g=Ee(i),_=we(i,l);let m=g,p=_,y,x,v,M;if(s&&(v=li,M=vs,pe(m,a,v),pe(p,a,M),y=s(v),x=s(M),x<y)){m=_,p=g;const F=y;y=x,x=F,v=M}v||(v=li,pe(m,a,v));const T=_e(m*2,c),E=e(v,T,y,o+1,r+m/be);let R;if(E===fh){const F=D(m),H=I(m)-F;R=n(F,H,!0,o+1,r+m/be,v)}else R=E&&Zc(m,t,e,n,s,r,o+1);if(R)return!0;M=vs,pe(p,a,M);const b=_e(p*2,c),S=e(M,b,x,o+1,r+p/be);let C;if(S===fh){const F=D(p),H=I(p)-F;C=n(F,H,!0,o+1,r+p/be,M)}else C=S&&Zc(p,t,e,n,s,r,o+1);return!!C}}const tr=new ce.constructor,To=new ce.constructor,oi=new Pl(()=>new fe),as=new fe,cs=new fe,Ua=new fe,Ia=new fe;let Na=!1;function Kx(i,t,e,n){if(Na)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");Na=!0;const s=i._roots,r=t._roots;let o,a=0,c=0;const l=new Wt().copy(e).invert();for(let h=0,f=s.length;h<f;h++){tr.setBuffer(s[h]),c=0;const u=oi.getPrimitive();pe(0,tr.float32Array,u),u.applyMatrix4(l);for(let d=0,g=r.length;d<g&&(To.setBuffer(r[d]),o=xn(0,0,e,l,n,a,c,0,0,u),To.clearBuffer(),c+=r[d].byteLength/Fe,!o);d++);if(oi.releasePrimitive(u),tr.clearBuffer(),a+=s[h].byteLength/Fe,o)break}return Na=!1,o}function xn(i,t,e,n,s,r=0,o=0,a=0,c=0,l=null,h=!1){let f,u;h?(f=To,u=tr):(f=tr,u=To);const d=f.float32Array,g=f.uint32Array,_=f.uint16Array,m=u.float32Array,p=u.uint32Array,y=u.uint16Array,x=i*2,v=t*2,M=_e(x,_),T=_e(v,y);let E=!1;if(T&&M)h?E=s(Ce(t,p),Be(t*2,y),Ce(i,g),Be(i*2,_),c,o+t/be,a,r+i/be):E=s(Ce(i,g),Be(i*2,_),Ce(t,p),Be(t*2,y),a,r+i/be,c,o+t/be);else if(T){const R=oi.getPrimitive();pe(t,m,R),R.applyMatrix4(e);const b=Ee(i),S=we(i,g);pe(b,d,as),pe(S,d,cs);const C=R.intersectsBox(as),D=R.intersectsBox(cs);E=C&&xn(t,b,n,e,s,o,r,c,a+1,R,!h)||D&&xn(t,S,n,e,s,o,r,c,a+1,R,!h),oi.releasePrimitive(R)}else{const R=Ee(t),b=we(t,p);pe(R,m,Ua),pe(b,m,Ia);const S=l.intersectsBox(Ua),C=l.intersectsBox(Ia);if(S&&C)E=xn(i,R,e,n,s,r,o,a,c+1,l,h)||xn(i,b,e,n,s,r,o,a,c+1,l,h);else if(S)if(M)E=xn(i,R,e,n,s,r,o,a,c+1,l,h);else{const D=oi.getPrimitive();D.copy(Ua).applyMatrix4(e);const I=Ee(i),F=we(i,g);pe(I,d,as),pe(F,d,cs);const k=D.intersectsBox(as),H=D.intersectsBox(cs);E=k&&xn(R,I,n,e,s,o,r,c,a+1,D,!h)||H&&xn(R,F,n,e,s,o,r,c,a+1,D,!h),oi.releasePrimitive(D)}else if(C)if(M)E=xn(i,b,e,n,s,r,o,a,c+1,l,h);else{const D=oi.getPrimitive();D.copy(Ia).applyMatrix4(e);const I=Ee(i),F=we(i,g);pe(I,d,as),pe(F,d,cs);const k=D.intersectsBox(as),H=D.intersectsBox(cs);E=k&&xn(b,I,n,e,s,o,r,c,a+1,D,!h)||H&&xn(b,F,n,e,s,o,r,c,a+1,D,!h),oi.releasePrimitive(D)}}return E}const Fa=new class{constructor(){let i=null,t=null,e=null,n=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(r,o)=>{if(n)throw new Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");this.root=o,this.buffer=i=r._roots[o],this.uint16Array=e=new Uint16Array(i),this.uint32Array=t=new Uint32Array(i)},this.reset=()=>{this.root=null,this.buffer=i=null,this.uint16Array=e=null,this.uint32Array=t=null},this.getRangeStart=r=>{let o=r*2;for(;!_e(o,e);)r=Ee(r),o=r*2;return Ce(r,t)},this.getRangeEnd=r=>{let o=r*2;for(;!_e(o,e);)r=we(r,t),o=r*2;return Ce(r,t)+Be(o,e)};const s=(r,o,a)=>{const c=o*2,l=_e(c,e);if(!r(a,l,o)&&!l){const f=Ee(o),u=we(o,t);s(r,f,a+1),s(r,u,a+1)}};this.traverseBuffer=r=>{if(n)throw new Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");n=!0;try{s(r,0,0)}finally{n=!1}},this.traverse=r=>{this.traverseBuffer((o,a,c)=>{if(a){const l=c*2,h=t[c+6],f=e[l+14];return r(o,a,new Float32Array(i,c*4,6),h,f)}else{const l=Cl(c,t);return r(o,a,new Float32Array(i,c*4,6),l)}})}}},gh=new fe,ls=new Float32Array(6);class Zx{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(t){t={...Of,...t},"maxLeafSize"in t&&(console.warn('BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.'),t={...t,targetLeafSize:t.maxLeafSize}),Yx(this,t)}getRootRanges(){throw new Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw new Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(t,e,n,s){let r=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0;for(let f=t,u=t+e;f<u;f++){this.writePrimitiveBounds(f,ls,0);const[d,g,_,m,p,y]=ls;d<r&&(r=d),m>c&&(c=m),g<o&&(o=g),p>l&&(l=p),_<a&&(a=_),y>h&&(h=y)}return n[s+0]=r,n[s+1]=o,n[s+2]=a,n[s+3]=c,n[s+4]=l,n[s+5]=h,n}computePrimitiveBounds(t,e,n){const s=n.offset||0;for(let r=t,o=t+e;r<o;r++){this.writePrimitiveBounds(r,ls,0);const[a,c,l,h,f,u]=ls,d=(a+h)/2,g=(c+f)/2,_=(l+u)/2,m=(h-a)/2,p=(f-c)/2,y=(u-l)/2,x=(r-s)*6;n[x+0]=d,n[x+1]=m+(Math.abs(d)+m)*xo,n[x+2]=g,n[x+3]=p+(Math.abs(g)+p)*xo,n[x+4]=_,n[x+5]=y+(Math.abs(_)+y)*xo}return n}shiftPrimitiveOffsets(t){const e=this._indirectBuffer;if(e)for(let n=0,s=e.length;n<s;n++)e[n]+=t;else{const n=this._roots;for(let s=0;s<n.length;s++){const r=n[s],o=new Uint32Array(r),a=new Uint16Array(r),c=r.byteLength/Fe;for(let l=0;l<c;l++){const h=be*l,f=2*h;_e(f,a)&&(o[h+6]+=t)}}}}traverse(t,e=0){Fa.setBVH(this,e),Fa.traverse(t),Fa.reset()}refit(){const t=this._roots;for(let e=0,n=t.length;e<n;e++){const s=t[e],r=new Uint32Array(s),o=new Uint16Array(s),a=new Float32Array(s),c=s.byteLength/Fe;for(let l=c-1;l>=0;l--){const h=l*be,f=h*2;if(_e(f,o)){const d=Ce(h,r),g=Be(f,o);this.writePrimitiveRangeBounds(d,g,ls,0),a.set(ls,h)}else{const d=Ee(h),g=we(h,r);for(let _=0;_<3;_++){const m=a[d+_],p=a[d+_+3],y=a[g+_],x=a[g+_+3];a[h+_]=m<y?m:y,a[h+_+3]=p>x?p:x}}}}}getBoundingBox(t){return t.makeEmpty(),this._roots.forEach(n=>{pe(0,new Float32Array(n),gh),t.union(gh)}),t}shapecast(t){let{boundsTraverseOrder:e,intersectsBounds:n,intersectsRange:s,intersectsPrimitive:r,scratchPrimitive:o,iterate:a}=t;if(s&&r){const f=s;s=(u,d,g,_,m)=>f(u,d,g,_,m)?!0:a(u,d,this,r,g,_,o)}else s||(r?s=(f,u,d,g)=>a(f,u,this,r,d,g,o):s=(f,u,d)=>d);let c=!1,l=0;const h=this._roots;for(let f=0,u=h.length;f<u;f++){const d=h[f];if(c=jx(this,f,n,s,e,l),c)break;l+=d.byteLength/Fe}return c}bvhcast(t,e,n){let{intersectsRanges:s}=n;return Kx(this,t,e,s)}}function Jx(){return typeof SharedArrayBuffer<"u"}function Ll(i){return i.index?i.index.count:i.attributes.position.count}function No(i){return Ll(i)/3}function Qx(i,t=ArrayBuffer){return i>65535?new Uint32Array(new t(4*i)):new Uint16Array(new t(2*i))}function ty(i,t){if(!i.index){const e=i.attributes.position.count,n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,s=Qx(e,n);i.setIndex(new ge(s,1));for(let r=0;r<e;r++)s[r]=r}}function ey(i,t,e){const n=Ll(i)/e,s=t||i.drawRange,r=s.start/e,o=(s.start+s.count)/e,a=Math.max(0,r),c=Math.min(n,o)-a;return{offset:Math.floor(a),count:Math.floor(c)}}function ny(i,t){return i.groups.map(e=>({offset:e.start/t,count:e.count/t}))}function _h(i,t,e){const n=ey(i,t,e),s=ny(i,e);if(!s.length)return[n];const r=[],o=n.offset,a=n.offset+n.count,c=Ll(i)/e,l=[];for(const u of s){const{offset:d,count:g}=u,_=d,m=isFinite(g)?g:c-d,p=d+m;_<a&&p>o&&(l.push({pos:Math.max(o,_),isStart:!0}),l.push({pos:Math.min(a,p),isStart:!1}))}l.sort((u,d)=>u.pos!==d.pos?u.pos-d.pos:u.type==="end"?-1:1);let h=0,f=null;for(const u of l){const d=u.pos;h!==0&&d!==f&&r.push({offset:f,count:d-f}),h+=u.isStart?1:-1,f=d}return r}function iy(i,t){const e=i[i.length-1],n=e.offset+e.count>2**16,s=i.reduce((l,h)=>l+h.count,0),r=n?4:2,o=t?new SharedArrayBuffer(s*r):new ArrayBuffer(s*r),a=n?new Uint32Array(o):new Uint16Array(o);let c=0;for(let l=0;l<i.length;l++){const{offset:h,count:f}=i[l];for(let u=0;u<f;u++)a[c+u]=h+u;c+=f}return a}class sy extends Zx{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(t){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(t){}constructor(t,e={}){if(t.isBufferGeometry){if(t.index&&t.index.isInterleavedBufferAttribute)throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("BVH: Only BufferGeometries are supported.");if(e.useSharedArrayBuffer&&!Jx())throw new Error("BVH: SharedArrayBuffer is not available.");super(),this.geometry=t,this.resolvePrimitiveIndex=e.indirect?n=>this._indirectBuffer[n]:n=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,e={...Of,...e},e[Rl]||this.init(e)}init(t){const{geometry:e,primitiveStride:n}=this;if(t.indirect){const s=_h(e,t.range,n),r=iy(s,t.useSharedArrayBuffer);this._indirectBuffer=r}else ty(e,t);super.init(t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new fe))}getRootRanges(t){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:_h(this.geometry,t,this.primitiveStride)}raycastObject3D(){throw new Error("BVH: raycastObject3D() not implemented")}}class Kn{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(t,e){let n=1/0,s=-1/0;for(let r=0,o=t.length;r<o;r++){const c=t[r][e];n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}setFromPoints(t,e){let n=1/0,s=-1/0;for(let r=0,o=e.length;r<o;r++){const a=e[r],c=t.dot(a);n=c<n?c:n,s=c>s?c:s}this.min=n,this.max=s}isSeparated(t){return this.min>t.max||t.min>this.max}}Kn.prototype.setFromBox=(function(){const i=new P;return function(e,n){const s=n.min,r=n.max;let o=1/0,a=-1/0;for(let c=0;c<=1;c++)for(let l=0;l<=1;l++)for(let h=0;h<=1;h++){i.x=s.x*c+r.x*(1-c),i.y=s.y*l+r.y*(1-l),i.z=s.z*h+r.z*(1-h);const f=e.dot(i);o=Math.min(f,o),a=Math.max(f,a)}this.min=o,this.max=a}})();const ry=(function(){const i=new P,t=new P,e=new P;return function(s,r,o){const a=s.start,c=i,l=r.start,h=t;e.subVectors(a,l),i.subVectors(s.end,s.start),t.subVectors(r.end,r.start);const f=e.dot(h),u=h.dot(c),d=h.dot(h),g=e.dot(c),m=c.dot(c)*d-u*u;let p,y;m!==0?p=(f*u-g*d)/m:p=0,y=(f+p*u)/d,o.x=p,o.y=y}})(),Dl=(function(){const i=new Ot,t=new P,e=new P;return function(s,r,o,a){ry(s,r,i);let c=i.x,l=i.y;if(c>=0&&c<=1&&l>=0&&l<=1){s.at(c,o),r.at(l,a);return}else if(c>=0&&c<=1){l<0?r.at(0,a):r.at(1,a),s.closestPointToPoint(a,!0,o);return}else if(l>=0&&l<=1){c<0?s.at(0,o):s.at(1,o),r.closestPointToPoint(o,!0,a);return}else{let h;c<0?h=s.start:h=s.end;let f;l<0?f=r.start:f=r.end;const u=t,d=e;if(s.closestPointToPoint(f,!0,t),r.closestPointToPoint(h,!0,e),u.distanceToSquared(f)<=d.distanceToSquared(h)){o.copy(u),a.copy(f);return}else{o.copy(h),a.copy(d);return}}}})(),oy=(function(){const i=new P,t=new P,e=new Yn,n=new Nn;return function(r,o){const{radius:a,center:c}=r,{a:l,b:h,c:f}=o;if(n.start=l,n.end=h,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a||(n.start=l,n.end=f,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a)||(n.start=h,n.end=f,n.closestPointToPoint(c,!0,i).distanceTo(c)<=a))return!0;const _=o.getPlane(e);if(Math.abs(_.distanceToPoint(c))<=a){const p=_.projectPoint(c,t);if(o.containsPoint(p))return!0}return!1}})(),ay=["x","y","z"],$n=1e-15,vh=$n*$n;function cn(i){return Math.abs(i)<$n}class pn extends De{constructor(...t){super(...t),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new P),this.satBounds=new Array(4).fill().map(()=>new Kn),this.points=[this.a,this.b,this.c],this.plane=new Yn,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new Nn,this.needsUpdate=!0}intersectsSphere(t){return oy(t,this)}update(){const t=this.a,e=this.b,n=this.c,s=this.points,r=this.satAxes,o=this.satBounds,a=r[0],c=o[0];this.getNormal(a),c.setFromPoints(a,s);const l=r[1],h=o[1];l.subVectors(t,e),h.setFromPoints(l,s);const f=r[2],u=o[2];f.subVectors(e,n),u.setFromPoints(f,s);const d=r[3],g=o[3];d.subVectors(n,t),g.setFromPoints(d,s);const _=l.length(),m=f.length(),p=d.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,_<$n?m<$n||p<$n?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(n)):m<$n?p<$n?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(t)):p<$n&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(e)),this.plane.setFromNormalAndCoplanarPoint(a,t),this.needsUpdate=!1}}pn.prototype.closestPointToSegment=(function(){const i=new P,t=new P,e=new Nn;return function(s,r=null,o=null){const{start:a,end:c}=s,l=this.points;let h,f=1/0;for(let u=0;u<3;u++){const d=(u+1)%3;e.start.copy(l[u]),e.end.copy(l[d]),Dl(e,s,i,t),h=i.distanceToSquared(t),h<f&&(f=h,r&&r.copy(i),o&&o.copy(t))}return this.closestPointToPoint(a,i),h=a.distanceToSquared(i),h<f&&(f=h,r&&r.copy(i),o&&o.copy(a)),this.closestPointToPoint(c,i),h=c.distanceToSquared(i),h<f&&(f=h,r&&r.copy(i),o&&o.copy(c)),Math.sqrt(f)}})();pn.prototype.intersectsTriangle=(function(){const i=new pn,t=new Kn,e=new Kn,n=new P,s=new P,r=new P,o=new P,a=new Nn,c=new Nn,l=new P,h=new Ot,f=new Ot;function u(x,v,M,T){const E=n;!x.isDegenerateIntoPoint&&!x.isDegenerateIntoSegment?E.copy(x.plane.normal):E.copy(v.plane.normal);const R=x.satBounds,b=x.satAxes;for(let D=1;D<4;D++){const I=R[D],F=b[D];if(t.setFromPoints(F,v.points),I.isSeparated(t)||(o.copy(E).cross(F),t.setFromPoints(o,x.points),e.setFromPoints(o,v.points),t.isSeparated(e)))return!1}const S=v.satBounds,C=v.satAxes;for(let D=1;D<4;D++){const I=S[D],F=C[D];if(t.setFromPoints(F,x.points),I.isSeparated(t)||(o.crossVectors(E,F),t.setFromPoints(o,x.points),e.setFromPoints(o,v.points),t.isSeparated(e)))return!1}return M&&(T||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),M.start.set(0,0,0),M.end.set(0,0,0)),!0}function d(x,v,M,T,E,R,b,S,C,D,I){let F=b/(b-S);D.x=T+(E-T)*F,I.start.subVectors(v,x).multiplyScalar(F).add(x),F=b/(b-C),D.y=T+(R-T)*F,I.end.subVectors(M,x).multiplyScalar(F).add(x)}function g(x,v,M,T,E,R,b,S,C,D,I){if(E>0)d(x.c,x.a,x.b,T,v,M,C,b,S,D,I);else if(R>0)d(x.b,x.a,x.c,M,v,T,S,b,C,D,I);else if(S*C>0||b!=0)d(x.a,x.b,x.c,v,M,T,b,S,C,D,I);else if(S!=0)d(x.b,x.a,x.c,M,v,T,S,b,C,D,I);else if(C!=0)d(x.c,x.a,x.b,T,v,M,C,b,S,D,I);else return!0;return!1}function _(x,v,M,T){const E=v.degenerateSegment,R=x.plane.distanceToPoint(E.start),b=x.plane.distanceToPoint(E.end);return cn(R)?cn(b)?u(x,v,M,T):(M&&(M.start.copy(E.start),M.end.copy(E.start)),x.containsPoint(E.start)):cn(b)?(M&&(M.start.copy(E.end),M.end.copy(E.end)),x.containsPoint(E.end)):x.plane.intersectLine(E,n)!=null?(M&&(M.start.copy(n),M.end.copy(n)),x.containsPoint(n)):!1}function m(x,v,M){const T=v.a;return cn(x.plane.distanceToPoint(T))&&x.containsPoint(T)?(M&&(M.start.copy(T),M.end.copy(T)),!0):!1}function p(x,v,M){const T=x.degenerateSegment,E=v.a;return T.closestPointToPoint(E,!0,n),E.distanceToSquared(n)<vh?(M&&(M.start.copy(E),M.end.copy(E)),!0):!1}function y(x,v,M,T){if(x.isDegenerateIntoSegment)if(v.isDegenerateIntoSegment){const E=x.degenerateSegment,R=v.degenerateSegment,b=s,S=r;E.delta(b),R.delta(S);const C=n.subVectors(R.start,E.start),D=b.x*S.y-b.y*S.x;if(cn(D))return!1;const I=(C.x*S.y-C.y*S.x)/D,F=-(b.x*C.y-b.y*C.x)/D;if(I<0||I>1||F<0||F>1)return!1;const k=E.start.z+b.z*I,H=R.start.z+S.z*F;return cn(k-H)?(M&&(M.start.copy(E.start).addScaledVector(b,I),M.end.copy(E.start).addScaledVector(b,I)),!0):!1}else return v.isDegenerateIntoPoint?p(x,v,M):_(v,x,M,T);else{if(x.isDegenerateIntoPoint)return v.isDegenerateIntoPoint?v.a.distanceToSquared(x.a)<vh?(M&&(M.start.copy(x.a),M.end.copy(x.a)),!0):!1:v.isDegenerateIntoSegment?p(v,x,M):m(v,x,M);if(v.isDegenerateIntoPoint)return m(x,v,M);if(v.isDegenerateIntoSegment)return _(x,v,M,T)}}return function(v,M=null,T=!1){this.needsUpdate&&this.update(),v.isExtendedTriangle?v.needsUpdate&&v.update():(i.copy(v),i.update(),v=i);const E=y(this,v,M,T);if(E!==void 0)return E;const R=this.plane,b=v.plane;let S=b.distanceToPoint(this.a),C=b.distanceToPoint(this.b),D=b.distanceToPoint(this.c);cn(S)&&(S=0),cn(C)&&(C=0),cn(D)&&(D=0);const I=S*C,F=S*D;if(I>0&&F>0)return!1;let k=R.distanceToPoint(v.a),H=R.distanceToPoint(v.b),$=R.distanceToPoint(v.c);cn(k)&&(k=0),cn(H)&&(H=0),cn($)&&($=0);const G=k*H,st=k*$;if(G>0&&st>0)return!1;s.copy(R.normal),r.copy(b.normal);const at=s.cross(r);let Mt=0,pt=Math.abs(at.x);const Vt=Math.abs(at.y);Vt>pt&&(pt=Vt,Mt=1),Math.abs(at.z)>pt&&(Mt=2);const Nt=ay[Mt],Y=this.a[Nt],K=this.b[Nt],ft=this.c[Nt],Tt=v.a[Nt],gt=v.b[Nt],Ht=v.c[Nt];if(g(this,Y,K,ft,I,F,S,C,D,h,a))return u(this,v,M,T);if(g(v,Tt,gt,Ht,G,st,k,H,$,f,c))return u(this,v,M,T);if(h.y<h.x){const ie=h.y;h.y=h.x,h.x=ie,l.copy(a.start),a.start.copy(a.end),a.end.copy(l)}if(f.y<f.x){const ie=f.y;f.y=f.x,f.x=ie,l.copy(c.start),c.start.copy(c.end),c.end.copy(l)}return h.y<f.x||f.y<h.x?!1:(M&&(f.x>h.x?M.start.copy(c.start):M.start.copy(a.start),f.y<h.y?M.end.copy(c.end):M.end.copy(a.end)),!0)}})();pn.prototype.distanceToPoint=(function(){const i=new P;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();pn.prototype.distanceToTriangle=(function(){const i=new P,t=new P,e=["a","b","c"],n=new Nn,s=new Nn;return function(o,a=null,c=null){const l=a||c?n:null;if(this.intersectsTriangle(o,l,!0))return(a||c)&&(a&&l.getCenter(a),c&&l.getCenter(c)),0;let h=1/0;for(let f=0;f<3;f++){let u;const d=e[f],g=o[d];this.closestPointToPoint(g,i),u=g.distanceToSquared(i),u<h&&(h=u,a&&a.copy(i),c&&c.copy(g));const _=this[d];o.closestPointToPoint(_,i),u=_.distanceToSquared(i),u<h&&(h=u,a&&a.copy(_),c&&c.copy(i))}for(let f=0;f<3;f++){const u=e[f],d=e[(f+1)%3];n.set(this[u],this[d]);for(let g=0;g<3;g++){const _=e[g],m=e[(g+1)%3];s.set(o[_],o[m]),Dl(n,s,i,t);const p=i.distanceToSquared(t);p<h&&(h=p,a&&a.copy(i),c&&c.copy(t))}}return Math.sqrt(h)}})();class qe{constructor(t,e,n){this.isOrientedBox=!0,this.min=new P,this.max=new P,this.matrix=new Wt,this.invMatrix=new Wt,this.points=new Array(8).fill().map(()=>new P),this.satAxes=new Array(3).fill().map(()=>new P),this.satBounds=new Array(3).fill().map(()=>new Kn),this.alignedSatBounds=new Array(3).fill().map(()=>new Kn),this.needsUpdate=!1,t&&this.min.copy(t),e&&this.max.copy(e),n&&this.matrix.copy(n)}set(t,e,n){this.min.copy(t),this.max.copy(e),this.matrix.copy(n),this.needsUpdate=!0}copy(t){this.min.copy(t.min),this.max.copy(t.max),this.matrix.copy(t.matrix),this.needsUpdate=!0}}qe.prototype.update=(function(){return function(){const t=this.matrix,e=this.min,n=this.max,s=this.points;for(let l=0;l<=1;l++)for(let h=0;h<=1;h++)for(let f=0;f<=1;f++){const u=1*l|2*h|4*f,d=s[u];d.x=l?n.x:e.x,d.y=h?n.y:e.y,d.z=f?n.z:e.z,d.applyMatrix4(t)}const r=this.satBounds,o=this.satAxes,a=s[0];for(let l=0;l<3;l++){const h=o[l],f=r[l],u=1<<l,d=s[u];h.subVectors(a,d),f.setFromPoints(h,s)}const c=this.alignedSatBounds;c[0].setFromPointsField(s,"x"),c[1].setFromPointsField(s,"y"),c[2].setFromPointsField(s,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();qe.prototype.intersectsBox=(function(){const i=new Kn;return function(e){this.needsUpdate&&this.update();const n=e.min,s=e.max,r=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(i.min=n.x,i.max=s.x,a[0].isSeparated(i)||(i.min=n.y,i.max=s.y,a[1].isSeparated(i))||(i.min=n.z,i.max=s.z,a[2].isSeparated(i)))return!1;for(let c=0;c<3;c++){const l=o[c],h=r[c];if(i.setFromBox(l,e),h.isSeparated(i))return!1}return!0}})();qe.prototype.intersectsTriangle=(function(){const i=new pn,t=new Array(3),e=new Kn,n=new Kn,s=new P;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(i.copy(o),i.update(),o=i);const a=this.satBounds,c=this.satAxes;t[0]=o.a,t[1]=o.b,t[2]=o.c;for(let u=0;u<3;u++){const d=a[u],g=c[u];if(e.setFromPoints(g,t),d.isSeparated(e))return!1}const l=o.satBounds,h=o.satAxes,f=this.points;for(let u=0;u<3;u++){const d=l[u],g=h[u];if(e.setFromPoints(g,f),d.isSeparated(e))return!1}for(let u=0;u<3;u++){const d=c[u];for(let g=0;g<4;g++){const _=h[g];if(s.crossVectors(d,_),e.setFromPoints(s,t),n.setFromPoints(s,f),e.isSeparated(n))return!1}}return!0}})();qe.prototype.closestPointToPoint=(function(){return function(t,e){return this.needsUpdate&&this.update(),e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}})();qe.prototype.distanceToPoint=(function(){const i=new P;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();qe.prototype.distanceToBox=(function(){const i=["x","y","z"],t=new Array(12).fill().map(()=>new Nn),e=new Array(12).fill().map(()=>new Nn),n=new P,s=new P;return function(o,a=0,c=null,l=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(c||l)&&(o.getCenter(s),this.closestPointToPoint(s,n),o.closestPointToPoint(n,s),c&&c.copy(n),l&&l.copy(s)),0;const h=a*a,f=o.min,u=o.max,d=this.points;let g=1/0;for(let m=0;m<8;m++){const p=d[m];s.copy(p).clamp(f,u);const y=p.distanceToSquared(s);if(y<g&&(g=y,c&&c.copy(p),l&&l.copy(s),y<h))return Math.sqrt(y)}let _=0;for(let m=0;m<3;m++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){const x=(m+1)%3,v=(m+2)%3,M=p<<x|y<<v,T=1<<m|p<<x|y<<v,E=d[M],R=d[T];t[_].set(E,R);const S=i[m],C=i[x],D=i[v],I=e[_],F=I.start,k=I.end;F[S]=f[S],F[C]=p?f[C]:u[C],F[D]=y?f[D]:u[C],k[S]=u[S],k[C]=p?f[C]:u[C],k[D]=y?f[D]:u[C],_++}for(let m=0;m<=1;m++)for(let p=0;p<=1;p++)for(let y=0;y<=1;y++){s.x=m?u.x:f.x,s.y=p?u.y:f.y,s.z=y?u.z:f.z,this.closestPointToPoint(s,n);const x=s.distanceToSquared(n);if(x<g&&(g=x,c&&c.copy(n),l&&l.copy(s),x<h))return Math.sqrt(x)}for(let m=0;m<12;m++){const p=t[m];for(let y=0;y<12;y++){const x=e[y];Dl(p,x,n,s);const v=n.distanceToSquared(s);if(v<g&&(g=v,c&&c.copy(n),l&&l.copy(s),v<h))return Math.sqrt(v)}}return Math.sqrt(g)}})();class cy extends Pl{constructor(){super(()=>new pn)}}const fn=new cy,zs=new P,Ba=new P;function ly(i,t,e={},n=0,s=1/0){const r=n*n,o=s*s;let a=1/0,c=null;if(i.shapecast({boundsTraverseOrder:h=>(zs.copy(t).clamp(h.min,h.max),zs.distanceToSquared(t)),intersectsBounds:(h,f,u)=>u<a&&u<o,intersectsTriangle:(h,f)=>{h.closestPointToPoint(t,zs);const u=t.distanceToSquared(zs);return u<a&&(Ba.copy(zs),a=u,c=f),u<r}}),a===1/0)return null;const l=Math.sqrt(a);return e.point?e.point.copy(Ba):e.point=Ba.clone(),e.distance=l,e.faceIndex=c,e}const Kr=parseInt(fr)>=169,uy=parseInt(fr)<=161,Ei=new P,wi=new P,Ti=new P,Zr=new Ot,Jr=new Ot,Qr=new Ot,xh=new P,yh=new P,Mh=new P,ks=new P;function hy(i,t,e,n,s,r,o,a){let c;if(r===Oe?c=i.intersectTriangle(n,e,t,!0,s):c=i.intersectTriangle(t,e,n,r!==un,s),c===null)return null;const l=i.origin.distanceTo(s);return l<o||l>a?null:{distance:l,point:s.clone()}}function Sh(i,t,e,n,s,r,o,a,c,l,h){Ei.fromBufferAttribute(t,r),wi.fromBufferAttribute(t,o),Ti.fromBufferAttribute(t,a);const f=hy(i,Ei,wi,Ti,ks,c,l,h);if(f){if(n){Zr.fromBufferAttribute(n,r),Jr.fromBufferAttribute(n,o),Qr.fromBufferAttribute(n,a),f.uv=new Ot;const d=De.getInterpolation(ks,Ei,wi,Ti,Zr,Jr,Qr,f.uv);Kr||(f.uv=d)}if(s){Zr.fromBufferAttribute(s,r),Jr.fromBufferAttribute(s,o),Qr.fromBufferAttribute(s,a),f.uv1=new Ot;const d=De.getInterpolation(ks,Ei,wi,Ti,Zr,Jr,Qr,f.uv1);Kr||(f.uv1=d),uy&&(f.uv2=f.uv1)}if(e){xh.fromBufferAttribute(e,r),yh.fromBufferAttribute(e,o),Mh.fromBufferAttribute(e,a),f.normal=new P;const d=De.getInterpolation(ks,Ei,wi,Ti,xh,yh,Mh,f.normal);f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1),Kr||(f.normal=d)}const u={a:r,b:o,c:a,normal:new P,materialIndex:0};if(De.getNormal(Ei,wi,Ti,u.normal),f.face=u,f.faceIndex=r,Kr){const d=new P;De.getBarycoord(ks,Ei,wi,Ti,d),f.barycoord=d}}return f}function bh(i){return i&&i.isMaterial?i.side:i}function Fo(i,t,e,n,s,r,o){const a=n*3;let c=a+0,l=a+1,h=a+2;const{index:f,groups:u}=i;i.index&&(c=f.getX(c),l=f.getX(l),h=f.getX(h));const{position:d,normal:g,uv:_,uv1:m}=i.attributes;if(Array.isArray(t)){const p=n*3;for(let y=0,x=u.length;y<x;y++){const{start:v,count:M,materialIndex:T}=u[y];if(p>=v&&p<v+M){const E=bh(t[T]),R=Sh(e,d,g,_,m,c,l,h,E,r,o);if(R)if(R.faceIndex=n,R.face.materialIndex=T,s)s.push(R);else return R}}}else{const p=bh(t),y=Sh(e,d,g,_,m,c,l,h,p,r,o);if(y)if(y.faceIndex=n,y.face.materialIndex=0,s)s.push(y);else return y}return null}function xe(i,t,e,n){const s=i.a,r=i.b,o=i.c;let a=t,c=t+1,l=t+2;e&&(a=e.getX(a),c=e.getX(c),l=e.getX(l)),s.x=n.getX(a),s.y=n.getY(a),s.z=n.getZ(a),r.x=n.getX(c),r.y=n.getY(c),r.z=n.getZ(c),o.x=n.getX(l),o.y=n.getY(l),o.z=n.getZ(l)}function fy(i,t,e,n,s,r,o,a){const{geometry:c,_indirectBuffer:l}=i;for(let h=n,f=n+s;h<f;h++)Fo(c,t,e,h,r,o,a)}function dy(i,t,e,n,s,r,o){const{geometry:a,_indirectBuffer:c}=i;let l=1/0,h=null;for(let f=n,u=n+s;f<u;f++){let d;d=Fo(a,t,e,f,null,r,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function py(i,t,e,n,s,r,o){const{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=i,f=t+i;h<f;h++){let u;if(u=h,xe(o,u*3,c,l),o.needsUpdate=!0,n(o,u,s,r))return!0}return!1}function my(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,o,a,c,l=0;const h=i._roots;for(let u=0,d=h.length;u<d;u++)r=h[u],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),f(0,l),l+=r.byteLength;function f(u,d,g=!1){const _=u*2;if(_e(_,a)){const m=Ce(u,o),p=Be(_,a);let y=1/0,x=1/0,v=1/0,M=-1/0,T=-1/0,E=-1/0;for(let R=3*m,b=3*(m+p);R<b;R++){let S=n[R];const C=s.getX(S),D=s.getY(S),I=s.getZ(S);C<y&&(y=C),C>M&&(M=C),D<x&&(x=D),D>T&&(T=D),I<v&&(v=I),I>E&&(E=I)}return c[u+0]!==y||c[u+1]!==x||c[u+2]!==v||c[u+3]!==M||c[u+4]!==T||c[u+5]!==E?(c[u+0]=y,c[u+1]=x,c[u+2]=v,c[u+3]=M,c[u+4]=T,c[u+5]=E,!0):!1}else{const m=Ee(u),p=we(u,o);let y=g,x=!1,v=!1;if(t){if(!y){const S=m/be+d/Fe,C=p/be+d/Fe;x=t.has(S),v=t.has(C),y=!x&&!v}}else x=!0,v=!0;const M=y||x,T=y||v;let E=!1;M&&(E=f(m,d,y));let R=!1;T&&(R=f(p,d,y));const b=E||R;if(b)for(let S=0;S<3;S++){const C=m+S,D=p+S,I=c[C],F=c[C+3],k=c[D],H=c[D+3];c[u+S]=I<k?I:k,c[u+S+3]=F>H?F:H}return b}}}function di(i,t,e,n,s){let r,o,a,c,l,h;const f=1/e.direction.x,u=1/e.direction.y,d=1/e.direction.z,g=e.origin.x,_=e.origin.y,m=e.origin.z;let p=t[i],y=t[i+3],x=t[i+1],v=t[i+3+1],M=t[i+2],T=t[i+3+2];return f>=0?(r=(p-g)*f,o=(y-g)*f):(r=(y-g)*f,o=(p-g)*f),u>=0?(a=(x-_)*u,c=(v-_)*u):(a=(v-_)*u,c=(x-_)*u),r>c||a>o||((a>r||isNaN(r))&&(r=a),(c<o||isNaN(o))&&(o=c),d>=0?(l=(M-m)*d,h=(T-m)*d):(l=(T-m)*d,h=(M-m)*d),r>h||l>o)?!1:((l>r||r!==r)&&(r=l),(h<o||o!==o)&&(o=h),r<=s&&o>=n)}function gy(i,t,e,n,s,r,o,a){const{geometry:c,_indirectBuffer:l}=i;for(let h=n,f=n+s;h<f;h++){let u=l?l[h]:h;Fo(c,t,e,u,r,o,a)}}function _y(i,t,e,n,s,r,o){const{geometry:a,_indirectBuffer:c}=i;let l=1/0,h=null;for(let f=n,u=n+s;f<u;f++){let d;d=Fo(a,t,e,c?c[f]:f,null,r,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function vy(i,t,e,n,s,r,o){const{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=i,f=t+i;h<f;h++){let u;if(u=e.resolveTriangleIndex(h),xe(o,u*3,c,l),o.needsUpdate=!0,n(o,u,s,r))return!0}return!1}function xy(i,t,e,n,s,r,o){ce.setBuffer(i._roots[t]),Jc(0,i,e,n,s,r,o),ce.clearBuffer()}function Jc(i,t,e,n,s,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=ce,h=i*2;if(_e(h,c)){const u=Ce(i,l),d=Be(h,c);fy(t,e,n,u,d,s,r,o)}else{const u=Ee(i);di(u,a,n,r,o)&&Jc(u,t,e,n,s,r,o);const d=we(i,l);di(d,a,n,r,o)&&Jc(d,t,e,n,s,r,o)}}const yy=["x","y","z"];function My(i,t,e,n,s,r){ce.setBuffer(i._roots[t]);const o=Qc(0,i,e,n,s,r);return ce.clearBuffer(),o}function Qc(i,t,e,n,s,r){const{float32Array:o,uint16Array:a,uint32Array:c}=ce;let l=i*2;if(_e(l,a)){const f=Ce(i,c),u=Be(l,a);return dy(t,e,n,f,u,s,r)}else{const f=Cl(i,c),u=yy[f],g=n.direction[u]>=0;let _,m;g?(_=Ee(i),m=we(i,c)):(_=we(i,c),m=Ee(i));const y=di(_,o,n,s,r)?Qc(_,t,e,n,s,r):null;if(y){const M=y.point[u];if(g?M<=o[m+f]:M>=o[m+f+3])return y}const v=di(m,o,n,s,r)?Qc(m,t,e,n,s,r):null;return y&&v?y.distance<=v.distance?y:v:y||v||null}}const to=new fe,us=new pn,hs=new pn,Hs=new Wt,Eh=new qe,eo=new qe;function Sy(i,t,e,n){ce.setBuffer(i._roots[t]);const s=tl(0,i,e,n);return ce.clearBuffer(),s}function tl(i,t,e,n,s=null){const{float32Array:r,uint16Array:o,uint32Array:a}=ce;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),Eh.set(e.boundingBox.min,e.boundingBox.max,n),s=Eh),_e(c,o)){const h=t.geometry,f=h.index,u=h.attributes.position,d=e.index,g=e.attributes.position,_=Ce(i,a),m=Be(c,o);if(Hs.copy(n).invert(),e.boundsTree)return pe(i,r,eo),eo.matrix.copy(Hs),eo.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:y=>eo.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(n),y.b.applyMatrix4(n),y.c.applyMatrix4(n),y.needsUpdate=!0;for(let x=_*3,v=(m+_)*3;x<v;x+=3)if(xe(hs,x,f,u),hs.needsUpdate=!0,y.intersectsTriangle(hs))return!0;return!1}});{const p=No(e);for(let y=_*3,x=(m+_)*3;y<x;y+=3){xe(us,y,f,u),us.a.applyMatrix4(Hs),us.b.applyMatrix4(Hs),us.c.applyMatrix4(Hs),us.needsUpdate=!0;for(let v=0,M=p*3;v<M;v+=3)if(xe(hs,v,d,g),hs.needsUpdate=!0,us.intersectsTriangle(hs))return!0}}}else{const h=Ee(i),f=we(i,a);return pe(h,r,to),!!(s.intersectsBox(to)&&tl(h,t,e,n,s)||(pe(f,r,to),s.intersectsBox(to)&&tl(f,t,e,n,s)))}}const no=new Wt,Oa=new qe,Vs=new qe,by=new P,Ey=new P,wy=new P,Ty=new P;function Ay(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),Oa.set(t.boundingBox.min,t.boundingBox.max,e),Oa.needsUpdate=!0;const a=i.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,f=t.index,u=fn.getPrimitive(),d=fn.getPrimitive();let g=by,_=Ey,m=null,p=null;s&&(m=wy,p=Ty);let y=1/0,x=null,v=null;return no.copy(e).invert(),Vs.matrix.copy(no),i.shapecast({boundsTraverseOrder:M=>Oa.distanceToBox(M),intersectsBounds:(M,T,E)=>E<y&&E<o?(T&&(Vs.min.copy(M.min),Vs.max.copy(M.max),Vs.needsUpdate=!0),!0):!1,intersectsRange:(M,T)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:R=>Vs.distanceToBox(R),intersectsBounds:(R,b,S)=>S<y&&S<o,intersectsRange:(R,b)=>{for(let S=R,C=R+b;S<C;S++){xe(d,3*S,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let D=M,I=M+T;D<I;D++){xe(u,3*D,l,c),u.needsUpdate=!0;const F=u.distanceToTriangle(d,g,m);if(F<y&&(_.copy(g),p&&p.copy(m),y=F,x=D,v=S),F<r)return!0}}}});{const E=No(t);for(let R=0,b=E;R<b;R++){xe(d,3*R,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let S=M,C=M+T;S<C;S++){xe(u,3*S,l,c),u.needsUpdate=!0;const D=u.distanceToTriangle(d,g,m);if(D<y&&(_.copy(g),p&&p.copy(m),y=D,x=S,v=R),D<r)return!0}}}}}),fn.releasePrimitive(u),fn.releasePrimitive(d),y===1/0?null:(n.point?n.point.copy(_):n.point=_.clone(),n.distance=y,n.faceIndex=x,s&&(s.point?s.point.copy(p):s.point=p.clone(),s.point.applyMatrix4(no),_.applyMatrix4(no),s.distance=_.sub(s.point).length(),s.faceIndex=v),n)}function Ry(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position;let r,o,a,c,l=0;const h=i._roots;for(let u=0,d=h.length;u<d;u++)r=h[u],o=new Uint32Array(r),a=new Uint16Array(r),c=new Float32Array(r),f(0,l),l+=r.byteLength;function f(u,d,g=!1){const _=u*2;if(_e(_,a)){const m=Ce(u,o),p=Be(_,a);let y=1/0,x=1/0,v=1/0,M=-1/0,T=-1/0,E=-1/0;for(let R=m,b=m+p;R<b;R++){const S=3*i.resolveTriangleIndex(R);for(let C=0;C<3;C++){let D=S+C;D=n?n[D]:D;const I=s.getX(D),F=s.getY(D),k=s.getZ(D);I<y&&(y=I),I>M&&(M=I),F<x&&(x=F),F>T&&(T=F),k<v&&(v=k),k>E&&(E=k)}}return c[u+0]!==y||c[u+1]!==x||c[u+2]!==v||c[u+3]!==M||c[u+4]!==T||c[u+5]!==E?(c[u+0]=y,c[u+1]=x,c[u+2]=v,c[u+3]=M,c[u+4]=T,c[u+5]=E,!0):!1}else{const m=Ee(u),p=we(u,o);let y=g,x=!1,v=!1;if(t){if(!y){const S=m/be+d/Fe,C=p/be+d/Fe;x=t.has(S),v=t.has(C),y=!x&&!v}}else x=!0,v=!0;const M=y||x,T=y||v;let E=!1;M&&(E=f(m,d,y));let R=!1;T&&(R=f(p,d,y));const b=E||R;if(b)for(let S=0;S<3;S++){const C=m+S,D=p+S,I=c[C],F=c[C+3],k=c[D],H=c[D+3];c[u+S]=I<k?I:k,c[u+S+3]=F>H?F:H}return b}}}function Cy(i,t,e,n,s,r,o){ce.setBuffer(i._roots[t]),el(0,i,e,n,s,r,o),ce.clearBuffer()}function el(i,t,e,n,s,r,o){const{float32Array:a,uint16Array:c,uint32Array:l}=ce,h=i*2;if(_e(h,c)){const u=Ce(i,l),d=Be(h,c);gy(t,e,n,u,d,s,r,o)}else{const u=Ee(i);di(u,a,n,r,o)&&el(u,t,e,n,s,r,o);const d=we(i,l);di(d,a,n,r,o)&&el(d,t,e,n,s,r,o)}}const Py=["x","y","z"];function Ly(i,t,e,n,s,r){ce.setBuffer(i._roots[t]);const o=nl(0,i,e,n,s,r);return ce.clearBuffer(),o}function nl(i,t,e,n,s,r){const{float32Array:o,uint16Array:a,uint32Array:c}=ce;let l=i*2;if(_e(l,a)){const f=Ce(i,c),u=Be(l,a);return _y(t,e,n,f,u,s,r)}else{const f=Cl(i,c),u=Py[f],g=n.direction[u]>=0;let _,m;g?(_=Ee(i),m=we(i,c)):(_=we(i,c),m=Ee(i));const y=di(_,o,n,s,r)?nl(_,t,e,n,s,r):null;if(y){const M=y.point[u];if(g?M<=o[m+f]:M>=o[m+f+3])return y}const v=di(m,o,n,s,r)?nl(m,t,e,n,s,r):null;return y&&v?y.distance<=v.distance?y:v:y||v||null}}const io=new fe,fs=new pn,ds=new pn,Gs=new Wt,wh=new qe,so=new qe;function Dy(i,t,e,n){ce.setBuffer(i._roots[t]);const s=il(0,i,e,n);return ce.clearBuffer(),s}function il(i,t,e,n,s=null){const{float32Array:r,uint16Array:o,uint32Array:a}=ce;let c=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),wh.set(e.boundingBox.min,e.boundingBox.max,n),s=wh),_e(c,o)){const h=t.geometry,f=h.index,u=h.attributes.position,d=e.index,g=e.attributes.position,_=Ce(i,a),m=Be(c,o);if(Gs.copy(n).invert(),e.boundsTree)return pe(i,r,so),so.matrix.copy(Gs),so.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:y=>so.intersectsBox(y),intersectsTriangle:y=>{y.a.applyMatrix4(n),y.b.applyMatrix4(n),y.c.applyMatrix4(n),y.needsUpdate=!0;for(let x=_,v=m+_;x<v;x++)if(xe(ds,3*t.resolveTriangleIndex(x),f,u),ds.needsUpdate=!0,y.intersectsTriangle(ds))return!0;return!1}});{const p=No(e);for(let y=_,x=m+_;y<x;y++){const v=t.resolveTriangleIndex(y);xe(fs,3*v,f,u),fs.a.applyMatrix4(Gs),fs.b.applyMatrix4(Gs),fs.c.applyMatrix4(Gs),fs.needsUpdate=!0;for(let M=0,T=p*3;M<T;M+=3)if(xe(ds,M,d,g),ds.needsUpdate=!0,fs.intersectsTriangle(ds))return!0}}}else{const h=Ee(i),f=we(i,a);return pe(h,r,io),!!(s.intersectsBox(io)&&il(h,t,e,n,s)||(pe(f,r,io),s.intersectsBox(io)&&il(f,t,e,n,s)))}}const ro=new Wt,za=new qe,Ws=new qe,Uy=new P,Iy=new P,Ny=new P,Fy=new P;function By(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),za.set(t.boundingBox.min,t.boundingBox.max,e),za.needsUpdate=!0;const a=i.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,f=t.index,u=fn.getPrimitive(),d=fn.getPrimitive();let g=Uy,_=Iy,m=null,p=null;s&&(m=Ny,p=Fy);let y=1/0,x=null,v=null;return ro.copy(e).invert(),Ws.matrix.copy(ro),i.shapecast({boundsTraverseOrder:M=>za.distanceToBox(M),intersectsBounds:(M,T,E)=>E<y&&E<o?(T&&(Ws.min.copy(M.min),Ws.max.copy(M.max),Ws.needsUpdate=!0),!0):!1,intersectsRange:(M,T)=>{if(t.boundsTree){const E=t.boundsTree;return E.shapecast({boundsTraverseOrder:R=>Ws.distanceToBox(R),intersectsBounds:(R,b,S)=>S<y&&S<o,intersectsRange:(R,b)=>{for(let S=R,C=R+b;S<C;S++){const D=E.resolveTriangleIndex(S);xe(d,3*D,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let I=M,F=M+T;I<F;I++){const k=i.resolveTriangleIndex(I);xe(u,3*k,l,c),u.needsUpdate=!0;const H=u.distanceToTriangle(d,g,m);if(H<y&&(_.copy(g),p&&p.copy(m),y=H,x=I,v=S),H<r)return!0}}}})}else{const E=No(t);for(let R=0,b=E;R<b;R++){xe(d,3*R,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let S=M,C=M+T;S<C;S++){const D=i.resolveTriangleIndex(S);xe(u,3*D,l,c),u.needsUpdate=!0;const I=u.distanceToTriangle(d,g,m);if(I<y&&(_.copy(g),p&&p.copy(m),y=I,x=S,v=R),I<r)return!0}}}}}),fn.releasePrimitive(u),fn.releasePrimitive(d),y===1/0?null:(n.point?n.point.copy(_):n.point=_.clone(),n.distance=y,n.faceIndex=x,s&&(s.point?s.point.copy(p):s.point=p.clone(),s.point.applyMatrix4(ro),_.applyMatrix4(ro),s.distance=_.sub(s.point).length(),s.faceIndex=v),n)}function Th(i,t,e){return i===null?null:(i.point.applyMatrix4(t.matrixWorld),i.distance=i.point.distanceTo(e.ray.origin),i.object=t,i)}const oo=new qe,ao=new Cs,Ah=new P,Rh=new Wt,Ch=new P,ka=["getX","getY","getZ"];class Ao extends sy{static serialize(t,e={}){e={cloneBuffers:!0,...e};const n=t.geometry,s=t._roots,r=t._indirectBuffer,o=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};return e.cloneBuffers?(a.roots=s.map(c=>c.slice()),a.index=o?o.array.slice():null,a.indirectBuffer=r?r.slice():null):(a.roots=s,a.index=o?o.array:null,a.indirectBuffer=r),a}static deserialize(t,e,n={}){n={setIndex:!0,indirect:!!t.indirectBuffer,...n};const{index:s,roots:r,indirectBuffer:o}=t;t.version||(console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),c(r));const a=new Ao(e,{...n,[Rl]:!0});if(a._roots=r,a._indirectBuffer=o||null,n.setIndex){const l=e.getIndex();if(l===null){const h=new ge(t.index,1,!1);e.setIndex(h)}else l.array!==s&&(l.array.set(s),l.needsUpdate=!0)}return a;function c(l){for(let h=0;h<l.length;h++){const f=l[h],u=new Uint32Array(f),d=new Uint16Array(f);for(let g=0,_=f.byteLength/Fe;g<_;g++){const m=be*g,p=2*m;_e(p,d)||(u[m+6]=u[m+6]/be-g)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(t,e={}){e.maxLeafTris&&(console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.'),e={...e,targetLeafSize:e.maxLeafTris}),super(t,e)}shiftTriangleOffsets(t){return super.shiftPrimitiveOffsets(t)}writePrimitiveBounds(t,e,n){const s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,l=(r?r[t]:t)*3;let h=l+0,f=l+1,u=l+2;a&&(h=a[h],f=a[f],u=a[u]);for(let d=0;d<3;d++){const g=o[ka[d]](h),_=o[ka[d]](f),m=o[ka[d]](u);let p=g;_<p&&(p=_),m<p&&(p=m);let y=g;_>y&&(y=_),m>y&&(y=m),e[n+d]=p,e[n+d+3]=y}return e}computePrimitiveBounds(t,e,n){const s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,c=o.normalized;if(t<0||e+t-n.offset>n.length/6)throw new Error("MeshBVH: compute triangle bounds range is invalid.");const l=o.array,h=o.offset||0;let f=3;o.isInterleavedBufferAttribute&&(f=o.data.stride);const u=["getX","getY","getZ"],d=n.offset;for(let g=t,_=t+e;g<_;g++){const p=(r?r[g]:g)*3,y=(g-d)*6;let x=p+0,v=p+1,M=p+2;a&&(x=a[x],v=a[v],M=a[M]),c||(x=x*f+h,v=v*f+h,M=M*f+h);for(let T=0;T<3;T++){let E,R,b;c?(E=o[u[T]](x),R=o[u[T]](v),b=o[u[T]](M)):(E=l[x+T],R=l[v+T],b=l[M+T]);let S=E;R<S&&(S=R),b<S&&(S=b);let C=E;R>C&&(C=R),b>C&&(C=b);const D=(C-S)/2,I=T*2;n[y+I+0]=S+D,n[y+I+1]=D+(Math.abs(S)+D)*xo}}return n}raycastObject3D(t,e,n=[]){const{material:s}=t;if(s===void 0)return;Rh.copy(t.matrixWorld).invert(),ao.copy(e.ray).applyMatrix4(Rh),Ch.setFromMatrixScale(t.matrixWorld),Ah.copy(ao.direction).multiply(Ch);const r=Ah.length(),o=e.near/r,a=e.far/r;if(e.firstHitOnly===!0){let c=this.raycastFirst(ao,s,o,a);c=Th(c,t,e),c&&n.push(c)}else{const c=this.raycast(ao,s,o,a);for(let l=0,h=c.length;l<h;l++){const f=Th(c[l],t,e);f&&n.push(f)}}return n}refit(t=null){return(this.indirect?Ry:my)(this,t)}raycast(t,e=En,n=0,s=1/0){const r=this._roots,o=[],a=this.indirect?Cy:xy;for(let c=0,l=r.length;c<l;c++)a(this,c,e,t,o,n,s);return o}raycastFirst(t,e=En,n=0,s=1/0){const r=this._roots;let o=null;const a=this.indirect?Ly:My;for(let c=0,l=r.length;c<l;c++){const h=a(this,c,e,t,n,s);h!=null&&(o==null||h.distance<o.distance)&&(o=h)}return o}intersectsGeometry(t,e){let n=!1;const s=this._roots,r=this.indirect?Dy:Sy;for(let o=0,a=s.length;o<a&&(n=r(this,o,t,e),!n);o++);return n}shapecast(t){const e=fn.getPrimitive(),n=super.shapecast({...t,intersectsPrimitive:t.intersectsTriangle,scratchPrimitive:e,iterate:this.indirect?vy:py});return fn.releasePrimitive(e),n}bvhcast(t,e,n){let{intersectsRanges:s,intersectsTriangles:r}=n;const o=fn.getPrimitive(),a=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?g=>{const _=this.resolveTriangleIndex(g);xe(o,_*3,a,c)}:g=>{xe(o,g*3,a,c)},h=fn.getPrimitive(),f=t.geometry.index,u=t.geometry.attributes.position,d=t.indirect?g=>{const _=t.resolveTriangleIndex(g);xe(h,_*3,f,u)}:g=>{xe(h,g*3,f,u)};if(r){if(!(t instanceof Ao))throw new Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');const g=(_,m,p,y,x,v,M,T)=>{for(let E=p,R=p+y;E<R;E++){d(E),h.a.applyMatrix4(e),h.b.applyMatrix4(e),h.c.applyMatrix4(e),h.needsUpdate=!0;for(let b=_,S=_+m;b<S;b++)if(l(b),o.needsUpdate=!0,r(o,h,b,E,x,v,M,T))return!0}return!1};if(s){const _=s;s=function(m,p,y,x,v,M,T,E){return _(m,p,y,x,v,M,T,E)?!0:g(m,p,y,x,v,M,T,E)}}else s=g}return super.bvhcast(t,e,{intersectsRanges:s})}intersectsBox(t,e){return oo.set(t.min,t.max,e),oo.needsUpdate=!0,this.shapecast({intersectsBounds:n=>oo.intersectsBox(n),intersectsTriangle:n=>oo.intersectsTriangle(n)})}intersectsSphere(t){return this.shapecast({intersectsBounds:e=>t.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(t)})}closestPointToGeometry(t,e,n={},s={},r=0,o=1/0){return(this.indirect?By:Ay)(this,t,e,n,s,r,o)}closestPointToPoint(t,e={},n=0,s=1/0){return ly(this,t,e,n,s)}}const yn=new P,Xs={normal:yn,depth:0};function co(i,t,e){return i<t?t:i>e?e:i}function Oy(i,t,e,n=Number.POSITIVE_INFINITY){const s=i.start.x,r=i.start.z,o=Math.min(i.start.y,i.end.y),a=Math.max(i.start.y,i.end.y),c=co(s,e.min.x,e.max.x),l=co(r,e.min.z,e.max.z);let h,f;a<e.min.y?(h=a,f=e.min.y):o>e.max.y?(h=o,f=e.max.y):(h=co((o+a)*.5,e.min.y,e.max.y),f=h);const u=s-c,d=h-f,g=r-l,_=u*u+d*d+g*g;if(_>=t*t)return null;if(_>1e-10){const p=Math.sqrt(_);yn.set(u/p,d/p,g/p),Xs.depth=t-p}else{const p=co((o+a)*.5,e.min.y,e.max.y),y=s-e.min.x+t,x=e.max.x-s+t,v=p-e.min.y+t,M=e.max.y-p+t,T=r-e.min.z+t,E=e.max.z-r+t;let R=y;yn.set(-1,0,0),x<R&&(R=x,yn.set(1,0,0)),v<R&&(R=v,yn.set(0,-1,0)),M<R&&(R=M,yn.set(0,1,0)),T<R&&(R=T,yn.set(0,0,-1)),E<R&&(R=E,yn.set(0,0,1)),Xs.depth=R}const m=Math.min(Xs.depth,n);return i.start.addScaledVector(yn,m),i.end.addScaledVector(yn,m),Xs.normal=yn,Xs}const Ha=.6,zy=.45,Ai=4,ky=24,Ph=.35,Lh=(i,t)=>(i+4096)*8192+(t+4096);function Hy(){return{hit:!1,grounded:!1,onWall:!1,groundNormal:new P,wallNormal:new P,groundBody:null,brushIndex:-1,ceiling:!1}}const Dh=new fe,ln=new fe,Vy=new fe,Uh=new P,Ih=new P,Ri=new P,Gy=new P,Wy=new P,qs=new P,Xy=1.25,Ys=new pn,Va=new Cs,Ro=new P,Mo=new P,Nh={distance:0,point:Ro,normal:Mo},Ga=new Cs,Wa=new P,$s=new P,$e={distance:0,point:new P,normal:new P,body:null,faceIndex:-1};function qy(i,t,e){let n=0,s=e,r=-1,o=1;for(let a=0;a<3;a++){const c=i.origin.getComponent(a),l=i.direction.getComponent(a),h=t.min.getComponent(a),f=t.max.getComponent(a);if(Math.abs(l)<1e-9){if(c<h||c>f)return null;continue}const u=1/l;let d=(h-c)*u,g=(f-c)*u,_=-1;if(d>g){const m=d;d=g,g=m,_=1}if(d>n&&(n=d,r=a,o=_),g<s&&(s=g),n>s)return null}return n<0||n>e?null:(Nh.distance=n,Ro.copy(i.origin).addScaledVector(i.direction,n),Mo.set(0,0,0),r<0?Mo.copy(i.direction).negate():Mo.setComponent(r,o),Nh)}const Xa=1<<21;class Yy{chunkMap=new Map;chunkById=new Map;chunkList=[];nextChunkId=1;dynamics=[];get hasStatic(){return this.chunkList.length>0}get chunkCount(){return this.chunkList.length}get triangleCount(){let t=0;for(const e of this.chunkList)t+=e.owners.length;return t}setChunk(t,e,n){this.removeChunk(t),e.computeBoundingBox();const s=new Ao(e),r={id:this.nextChunkId++,bounds:e.boundingBox.clone(),bvh:s,owners:n,geometryIndex:e.index.array};this.chunkMap.set(t,r),this.chunkById.set(r.id,r),this.chunkList=[...this.chunkMap.values()],this.sig=null,this.staticVersion++}sig=null;staticVersion=0;near={box:new fe,version:-1,tris:new Float32Array(9*256),brush:new Int32Array(256),n:0};get signature(){return this.sig??=[...this.chunkMap.entries()].map(([t,e])=>`${t}:${e.geometryIndex.length}:${e.bounds.min.toArray().map(n=>n.toFixed(2))}:${e.bounds.max.toArray().map(n=>n.toFixed(2))}`).sort().join("|"),this.sig}staticBounds(t){t.makeEmpty();for(const e of this.chunkList)t.union(e.bounds);return t}removeChunk(t){const e=this.chunkMap.get(t);e&&(this.chunkMap.delete(t),this.chunkById.delete(e.id),this.chunkList=[...this.chunkMap.values()],this.sig=null,this.staticVersion++)}chunkBrush(t,e){const n=t.geometryIndex[e*3]??0;return t.owners[n/3|0]??-1}brushForTriangle(t){const e=Math.floor(t/Xa),n=this.chunkById.get(e);return n?this.chunkBrush(n,t-e*Xa):-1}dynamicsVersion=0;addDynamic(t){this.dynamicsVersion++,this.dynamics.push(t),this.filed&&!t.still?this.unfiled.push(t):this.filed=!1}removeDynamic(t){const e=this.dynamics.indexOf(t);if(e<0)return;this.dynamicsVersion++,this.dynamics.splice(e,1);const n=this.filed&&!t.still?this.unfiled.indexOf(t):-1;n>=0?this.unfiled.splice(n,1):this.filed=!1}moved(t){this.filed=!1}stillCells=new Map;unfiled=[];rayBodies=[];capBodies=[];stillReach=0;filed=!1;file(){this.stillCells.clear(),this.unfiled.length=0,this.stillReach=0;for(const t of this.dynamics){if(!t.still){this.unfiled.push(t);continue}const e=t.aabb,n=Math.max(e.max.x-e.min.x,e.max.z-e.min.z)/2;if(e.isEmpty()||!(n<=Ai)){this.unfiled.push(t);continue}this.stillReach=Math.max(this.stillReach,n);const s=Lh(Math.floor((e.min.x+e.max.x)/2/Ai),Math.floor((e.min.z+e.max.z)/2/Ai));let r=this.stillCells.get(s);r||this.stillCells.set(s,r=[]),r.push(t)}this.filed=!0}bodiesIn(t,e,n,s,r){this.filed||this.file(),r.length=0;const o=this.stillReach,a=Math.floor((t-o)/Ai),c=Math.floor((e+o)/Ai),l=Math.floor((n-o)/Ai),h=Math.floor((s+o)/Ai);if(!((c-a+1)*(h-l+1)<=ky)){for(let u=0;u<this.dynamics.length;u++)r.push(this.dynamics[u]);return r}const f=this.unfiled;for(let u=0;u<f.length;u++)r.push(f[u]);for(let u=a;u<=c;u++)for(let d=l;d<=h;d++){const g=this.stillCells.get(Lh(u,d));if(g)for(let _=0;_<g.length;_++)r.push(g[_])}return r}clear(){this.chunkMap.clear(),this.chunkById.clear(),this.chunkList=[],this.dynamics.length=0,this.unfiled.length=0,this.filed=!1,this.sig=null,this.staticVersion++}curOut=Hy();curSegment=new Nn;curRadius=0;bestGroundY=Ha;touch(t,e){{const n=this.curSegment,s=this.curRadius,r=t.a,o=t.b,a=t.c,c=n.start,l=n.end;if(Math.max(r.x,o.x,a.x)<Math.min(c.x,l.x)-s||Math.min(r.x,o.x,a.x)>Math.max(c.x,l.x)+s||Math.max(r.y,o.y,a.y)<Math.min(c.y,l.y)-s||Math.min(r.y,o.y,a.y)>Math.max(c.y,l.y)+s||Math.max(r.z,o.z,a.z)<Math.min(c.z,l.z)-s||Math.min(r.z,o.z,a.z)>Math.max(c.z,l.z)+s)return;qs.crossVectors(Gy.subVectors(o,r),Wy.subVectors(a,r));const h=qs.length();if(h>1e-12){const g=qs.dot(r),_=(qs.dot(c)-g)/h,m=(qs.dot(l)-g)/h;if(_>=s&&m>=s||_<=-s&&m<=-s)return}const f=t.closestPointToSegment(n,Uh,Ih);if(f>=s)return;const u=s-f;Ri.subVectors(Ih,Uh);const d=Ri.length();d<1e-6?t.getNormal(Ri):Ri.divideScalar(d),n.start.addScaledVector(Ri,u),n.end.addScaledVector(Ri,u),this.classify(Ri,null,e)}}gatherChunk=null;gatherCast={intersectsBounds:t=>t.intersectsBox(this.near.box),intersectsTriangle:(t,e)=>(this.keepNear(t,e),!1)};gatherNear(t){const e=this.near;e.box.copy(t),e.version=this.staticVersion,e.n=0;for(let n=0;n<this.chunkList.length;n++){const s=this.chunkList[n];s.bounds.intersectsBox(t)&&(this.gatherChunk=s,s.bvh.shapecast(this.gatherCast))}}keepNear(t,e){const n=this.near;if(n.n===n.brush.length){const o=new Float32Array(n.tris.length*2);o.set(n.tris),n.tris=o;const a=new Int32Array(n.brush.length*2);a.set(n.brush),n.brush=a}const s=n.n*9,r=n.tris;r[s]=t.a.x,r[s+1]=t.a.y,r[s+2]=t.a.z,r[s+3]=t.b.x,r[s+4]=t.b.y,r[s+5]=t.b.z,r[s+6]=t.c.x,r[s+7]=t.c.y,r[s+8]=t.c.z,n.brush[n.n]=this.chunkBrush(this.gatherChunk,e),n.n++}classify(t,e,n){const s=this.curOut;s.hit=!0,t.y>this.bestGroundY?(this.bestGroundY=t.y,s.grounded=!0,s.groundNormal.copy(t),s.groundBody=e,s.brushIndex=n):Math.abs(t.y)<zy?(s.onWall=!0,s.wallNormal.add(t)):t.y<-Ha&&(s.ceiling=!0)}resolve(t,e,n){n.hit=!1,n.grounded=!1,n.onWall=!1,n.groundNormal.set(0,0,0),n.wallNormal.set(0,0,0),n.groundBody=null,n.brushIndex=-1,n.ceiling=!1,this.curOut=n,this.curSegment=t,this.curRadius=e,this.bestGroundY=Ha,ln.makeEmpty(),ln.expandByPoint(t.start),ln.expandByPoint(t.end),ln.min.addScalar(-e),ln.max.addScalar(e);const s=Ph,r=this.bodiesIn(ln.min.x-s,ln.max.x+s,ln.min.z-s,ln.max.z+s,this.capBodies);for(let c=0;c<r.length;c++){const l=r[c];if(!l.solid)continue;const h=l.delta.length()+Ph;if(!l.aabb.intersectsBox(Vy.copy(ln).expandByScalar(h)))continue;const f=Oy(t,e,l.aabb,h);f&&this.classify(f.normal,l,-1)}const o=this.near;(o.version!==this.staticVersion||!o.box.containsBox(ln))&&(Dh.copy(ln).expandByScalar(Xy),this.gatherNear(Dh));const a=o.tris;for(let c=0;c<o.n;c++){const l=c*9;Ys.a.set(a[l],a[l+1],a[l+2]),Ys.b.set(a[l+3],a[l+4],a[l+5]),Ys.c.set(a[l+6],a[l+7],a[l+8]),Ys.needsUpdate=!0,this.touch(Ys,o.brush[c])}n.onWall&&(n.wallNormal.lengthSq()>1e-8?n.wallNormal.normalize():n.onWall=!1)}raycast(t,e,n){if(this.chunkList.length===0)return null;Ga.set(t,e);let s=null,r=n;const o=t.x,a=t.y,c=t.z,l=Number.isFinite(n),h=o+e.x*n,f=a+e.y*n,u=c+e.z*n,d=Math.min(o,h),g=Math.max(o,h),_=Math.min(a,f),m=Math.max(a,f),p=Math.min(c,u),y=Math.max(c,u),x=this.chunkList;for(let v=0;v<x.length;v++){const M=x[v],T=M.bounds;if(l&&(T.min.x>g||T.max.x<d||T.min.y>m||T.max.y<_||T.min.z>y||T.max.z<p)||!M.bounds.containsPoint(t)&&(!Ga.intersectBox(M.bounds,Ro)||Ro.distanceTo(t)>r))continue;const E=M.bvh.raycastFirst(Ga,En,0,r);E&&E.faceIndex!==void 0&&E.faceIndex!==null&&(r=E.distance,E.faceIndex=M.id*Xa+E.faceIndex,s=E)}return s}wallsBetween(t,e,n,s,r,o){Wa.copy(t),$s.set(e,n,s).sub(t);let a=$s.length()-r;if(a<=0)return 0;$s.normalize();let c=0;for(;c<o&&a>0;){const l=this.raycast(Wa,$s,a);if(!l)break;c++;const h=l.distance+.05;Wa.addScaledVector($s,h),a-=h}return c}raycastAny(t,e,n,s=!1,r=null,o=null,a=!0,c=null){let l=!1;const h=a?this.raycast(t,e,n):null;h&&($e.distance=h.distance,$e.point.copy(h.point),$e.normal.copy(h.face?.normal??e),$e.body=null,$e.faceIndex=h.faceIndex??-1,l=!0),Va.set(t,e);const f=l?Math.min(n,$e.distance):n,u=t.x,d=t.y,g=t.z,_=u+e.x*f,m=d+e.y*f,p=g+e.z*f,y=Math.min(u,_),x=Math.max(u,_),v=Math.min(d,m),M=Math.max(d,m),T=Math.min(g,p),E=Math.max(g,p),R=o??this.bodiesIn(y,x,T,E,this.rayBodies);for(let b=0;b<R.length;b++){const S=R[b];if(S===r||!S.solid&&!(s&&S.hittable)||c!==null&&c(S)||S.nearRay&&!S.nearRay(t,e,f))continue;const C=S.aabb;if(C.min.x>x||C.max.x<y||C.min.y>M||C.max.y<v||C.min.z>E||C.max.z<T)continue;const D=l?Math.min(n,$e.distance):n;let I=qy(Va,S.aabb,D);I&&S.rayHit&&(I=S.rayHit(Va,D)),I&&(l&&I.distance>=$e.distance||($e.distance=I.distance,$e.point.copy(I.point),$e.normal.copy(I.normal),$e.body=S,$e.faceIndex=-1,l=!0))}return l?$e:null}}const Se=1,$y=.5,jy=.6,Ky=2.4,Zy=6,Jy=90,Wn=65535,Qy=4,ps=new P,lo=new P,tM=new P(0,-1,0);class eM{constructor(t){this.collision=t}minX=0;minZ=0;nx=0;nz=0;floor=new Float32Array(0);side=new Uint8Array(0);ready=!1;ground=0;builtFor="";building=null;buildingFor="";dist=new Uint16Array(0);next=new Uint16Array(0);blocked=new Uint8Array(0);queue=new Int32Array(0);qHead=0;qTail=0;filling=!1;target=-1;fillTarget=-1;sinceFill=1/0;fieldReady=!1;forget(){this.fieldReady=!1,this.filling=!1,this.target=-1}build(){for(const t of this.buildSteps());}async buildAsync(t=async()=>{},e=14){let n=performance.now();for(const s of this.buildSteps())performance.now()-n>e&&(await t(),n=performance.now())}get current(){return this.ready&&this.builtFor===this.collision.signature}*buildSteps(){const t=this.collision.signature,e=this.collision.staticBounds(new fe);if(this.ready=!1,e.isEmpty()){this.builtFor=t;return}const n=Math.max(1,Math.ceil((e.max.x-e.min.x)/Se)),s=Math.max(1,Math.ceil((e.max.z-e.min.z)/Se)),r=new Float32Array(n*s),o=new Uint8Array(n*s),a=this.ground+Ky;for(let l=0;l<s;l++){for(let h=0;h<n;h++){ps.set(e.min.x+(h+.5)*Se,a,e.min.z+(l+.5)*Se);const f=this.collision.raycast(ps,tM,Zy);r[l*n+h]=f&&(f.face?.normal.y??1)>.5?f.point.y:NaN}yield}const c=(l,h,f,u,d,g)=>{const _=r[l],m=r[h];if(Number.isNaN(_)||Number.isNaN(m)||Math.abs(_-m)>jy)return!1;const p=Math.max(_,m)+$y;return ps.set(e.min.x+(f+.5)*Se,p,e.min.z+(u+.5)*Se),lo.set(d-f,0,g-u),this.collision.raycast(ps,lo,Se)?!1:(ps.set(e.min.x+(d+.5)*Se,p,e.min.z+(g+.5)*Se),lo.negate(),!this.collision.raycast(ps,lo,Se))};for(let l=0;l<s;l++){for(let h=0;h<n;h++){const f=l*n+h;h+1<n&&c(f,f+1,h,l,h+1,l)&&(o[f]|=1),l+1<s&&c(f,f+n,h,l,h,l+1)&&(o[f]|=2)}yield}for(let l=1;l<s-1;l++)for(let h=1;h<n-1;h++){const f=l*n+h,u=r[f];Number.isNaN(u)||(o[f]&3)!==3||(o[f-1]&1)===0||(o[f-n]&2)===0||[f-1,f+1,f-n,f+n].every(d=>Math.abs(r[d]-u)<.01)&&(o[f]|=4)}this.minX=e.min.x,this.minZ=e.min.z,this.nx=n,this.nz=s,this.floor=r,this.side=o,this.dist=new Uint16Array(n*s).fill(Wn),this.next=new Uint16Array(n*s).fill(Wn),this.blocked=new Uint8Array(n*s),this.queue=new Int32Array(n*s),this.filling=!1,this.fieldReady=!1,this.target=-1,this.sinceFill=1/0,this.builtFor=t,this.ready=!0}cellAt(t,e){const n=Math.floor((t-this.minX)/Se),s=Math.floor((e-this.minZ)/Se);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}open(t,e){if(this.blocked[e])return!1;const n=e-t;return n===1?(this.side[t]&1)!==0&&t%this.nx+1<this.nx:n===-1?(this.side[e]&1)!==0&&t%this.nx>0:n===this.nx?(this.side[t]&2)!==0:n===-this.nx?(this.side[e]&2)!==0:!1}tick(t,e,n,s){const r=performance.now()+n;if(!this.current){const a=this.collision.signature;for((!this.building||this.buildingFor!==a)&&(this.building=this.buildSteps(),this.buildingFor=a);performance.now()<r;)if(this.building.next().done){this.building=null;break}if(!this.current)return}this.sinceFill+=e;const o=this.cellAt(t.x,t.z);if(!this.filling){if(o<0||o===this.target&&this.sinceFill<1/Qy)return;this.beginFill(o,s)}this.fill(r)}beginFill(t,e){this.blocked.fill(0);for(const n of e){if(!n.solid)continue;const s=n.aabb,r=Math.max(0,Math.floor((s.min.x-this.minX)/Se)),o=Math.min(this.nx-1,Math.floor((s.max.x-this.minX)/Se)),a=Math.max(0,Math.floor((s.min.z-this.minZ)/Se)),c=Math.min(this.nz-1,Math.floor((s.max.z-this.minZ)/Se));if(!((o-r+1)*(c-a+1)>400))for(let l=a;l<=c;l++)for(let h=r;h<=o;h++){const f=l*this.nx+h,u=this.floor[f];!Number.isNaN(u)&&s.min.y<u+1.6&&s.max.y>u+.25&&(this.blocked[f]=1)}}this.next.fill(Wn),this.fillTarget=t,this.next[t]=0,this.queue[0]=t,this.qHead=0,this.qTail=1,this.filling=!0}fill(t){const e=this.nx,n=this.next,s=this.queue,r=this.blocked,o=this.side,a=n.length;let c=this.qHead,l=this.qTail,h=0;for(;c<l;){const u=s[c++],d=n[u]+1;if(d<=Jy&&e>1){const g=u%e,_=o[u];let m=u+1;g+1<e&&(_&1)!==0&&n[m]===Wn&&!r[m]&&(n[m]=d,s[l++]=m),m=u-1,g>0&&(o[m]&1)!==0&&n[m]===Wn&&!r[m]&&(n[m]=d,s[l++]=m),m=u+e,m<a&&(_&2)!==0&&n[m]===Wn&&!r[m]&&(n[m]=d,s[l++]=m),m=u-e,m>=0&&(o[m]&2)!==0&&n[m]===Wn&&!r[m]&&(n[m]=d,s[l++]=m)}if((++h&63)===0&&performance.now()>t){this.qHead=c,this.qTail=l;return}}this.qHead=c,this.qTail=l;const f=this.dist;this.dist=this.next,this.next=f,this.target=this.fillTarget,this.filling=!1,this.sinceFill=0,this.fieldReady=!0}toward(t,e){if(!this.fieldReady)return null;const n=this.cellAt(t.x,t.z);if(n<0)return null;const s=this.dist[n];if(s===Wn)return null;const r=this.nx;let o=s,a=0,c=0;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++){if(!d&&!u)continue;const g=n+u*r+d;if(g<0||g>=this.dist.length)continue;if(d&&u){if(!this.open(n,n+d)||!this.open(n+d,g)||!this.open(n,n+u*r)||!this.open(n+u*r,g))continue}else if(!this.open(n,g))continue;const _=this.dist[g]+(d&&u?.4:0);_<o&&(o=_,a=d,c=u)}if(a===0&&c===0)return null;const l=this.minX+(n%r+a+.5)*Se,h=this.minZ+(Math.floor(n/r)+c+.5)*Se;e.set(l-t.x,0,h-t.z);const f=e.length();return f<1e-4?e.set(a,0,c).normalize():e.divideScalar(f)}flatFloor(t,e){if(!this.ready)return null;const n=this.cellAt(t,e);return n<0||(this.side[n]&4)===0||this.blocked[n]?null:this.floor[n]}canEnter(t,e,n,s){if(!this.ready)return!0;const r=this.cellAt(t,e);if(r<0||Number.isNaN(this.floor[r]))return!0;const o=this.cellAt(n,s);if(o===r)return!0;if(o<0)return!1;const a=this.nx,c=o%a-r%a,l=Math.floor(o/a)-Math.floor(r/a);if(c<-1||c>1||l<-1||l>1)return!0;if(c&&l){const h=r+c,f=r+l*a;return this.open(r,h)&&this.open(h,o)||this.open(r,f)&&this.open(f,o)}return this.open(r,o)}distanceAt(t){if(!this.fieldReady)return 1/0;const e=this.cellAt(t.x,t.z);if(e<0)return 1/0;const n=this.dist[e];return n===Wn?1/0:n}clear(t,e,n){if(!this.ready)return null;let s=this.cellAt(t.x,t.z);if(s<0||Number.isNaN(this.floor[s]))return null;const r=Math.max(1,Math.ceil(n/(Se*.5)));for(let o=1;o<=r;o++){const a=n*o/r,c=this.cellAt(t.x+e.x*a,t.z+e.z*a);if(c<0)return!1;if(c===s)continue;const l=c%this.nx-s%this.nx,h=Math.floor(c/this.nx)-Math.floor(s/this.nx);if(l&&h){const f=s+l,u=s+h*this.nx;if(!(this.open(s,f)&&this.open(f,c)||this.open(s,u)&&this.open(u,c)))return!1}else if(!this.open(s,c))return!1;s=c}return!0}}const Fh=1.5,nM=250,iM=.3,sM=3,rM=.05,oM=.066,aM=["map","alphaMap","aoMap","bumpMap","displacementMap","emissiveMap","lightMap","metalnessMap","normalMap","roughnessMap","specularMap"],Bh=new Set,Hf=new Map;function uo(i,t,e){Hf.set(i,t)}function Oh(i){let t=!1;return i.traverse(e=>{(e.isMesh||e.isSprite||e.isPoints||e.isLine||e.isLight)&&(t=!0)}),t}class Ul{scene=Ul.walkedScene();events=new lv;static walkedScene(){const t=new cf;return t.matrixWorldAutoUpdate=!1,t.onBeforeRender=()=>{const e=t.children;for(let n=0;n<e.length;n++){const s=e[n];if(s.matrixWorldAutoUpdate||s.matrixWorldNeedsUpdate){if(!s.visible){s.matrixAutoUpdate&&s.updateWorldMatrix(!1,!1);continue}yf(s,!1)}}},t}collision=new Yy;entities=new Map;byType=new Map;byTag=new Map;updating=[];playerPosition=new P;viewPosition=null;detail=1;levelName="";statics=new wl(this.scene,this.collision);lights=new nx(this.scene);particles=new Ix(this.scene,this.events);batches=new Bx(this.scene);get building(){return this.buildingNow}set building(t){t!==this.buildingNow&&(this.buildingNow=t,this.statics.mergeAllowed=!t,t?this.thawStill():this.freezeStill())}buildingNow=!1;frozen=[];frozenRoots=[];undrawn=[];freezeStill(){this.thawStill(),this.scene.matrixAutoUpdate=!1,this.scene.updateMatrix(),this.scene.traverse(t=>{const e=t.material;if(e)for(const n of Array.isArray(e)?e:[e])for(const s of aM){const r=n[s];!r||!r.isTexture||!r.matrixAutoUpdate||(r.updateMatrix(),r.matrixAutoUpdate=!1,this.heldTextures.push(r))}});for(const t of this.entities.values())t.needsUpdate||(t.object.updateMatrixWorld(!0),t.object.traverse(e=>{e.matrixAutoUpdate&&(e.matrixAutoUpdate=!1,this.frozen.push(e))}),t.object.parent===this.scene&&t.object.matrixWorldAutoUpdate&&(t.object.matrixWorldAutoUpdate=!1,this.frozenRoots.push(t.object)),t.object.parent===this.scene&&!Oh(t.object)?(this.scene.remove(t.object),this.undrawn.push(t.object)):t.object.parent===this.scene&&this.hideBare(t.object))}hideBare(t){for(const e of t.children)e.visible&&(Oh(e)?this.hideBare(e):(e.visible=!1,this.bare.push(e)))}bare=[];heldTextures=[];thawStill(){for(const t of this.heldTextures)t.matrixAutoUpdate=!0;this.heldTextures.length=0;for(const t of this.frozen)t.matrixAutoUpdate=!0;this.frozen.length=0;for(const t of this.frozenRoots)t.matrixWorldAutoUpdate=!0;this.frozenRoots.length=0;for(const t of this.undrawn)t.parent||this.scene.add(t);this.undrawn.length=0;for(const t of this.bare)t.visible=!0;this.bare.length=0}lastBake={cells:0,rebuilt:0,removed:0,ms:0,slowestCell:0};idCounter=0;nextId(){let t;do t=`e${++this.idCounter}`;while(this.entities.has(t));return t}add(t){if(!t.id)t.id=this.nextId();else{if(this.entities.has(t.id))throw new Error(`World: duplicate entity id "${t.id}"`);{const n=/^e(\d+)$/.exec(t.id);n&&(this.idCounter=Math.max(this.idCounter,Number(n[1])))}}t.world=this,t.removed=!1,this.entities.set(t.id,t);let e=this.byType.get(t.type);e||this.byType.set(t.type,e=new Set),e.add(t);for(const n of t.tags){let s=this.byTag.get(n);s||this.byTag.set(n,s=new Set),s.add(t)}return t.needsUpdate&&this.updating.push(t),t.onSpawn(),t}spawn(t){const e=Hf.get(t.type);if(!e)throw new Error(`World: unknown entity type "${t.type}"`);const n=performance.now(),s=this.add(e(t));return this.time("spawn",performance.now()-n),s}remove(t){if(!this.entities.delete(t.id))return;t.removed=!0,t.onDestroy(),this.byType.get(t.type)?.delete(t);for(const r of t.tags)this.byTag.get(r)?.delete(t);const e=this.updating.indexOf(t);e>=0&&this.updating.splice(e,1);const n=this.undrawn.indexOf(t.object);n>=0&&this.undrawn.splice(n,1);const s=this.frozenRoots.indexOf(t.object);s>=0&&this.frozenRoots.splice(s,1)}byId(t){return this.entities.get(t)}byName(t){for(const e of this.entities.values())if(e.name===t)return e}ofType(t){return[...this.byType.get(t)??[]]}tagged(t){return[...this.byTag.get(t)??[]]}typeView(t){return this.byType.get(t)??Bh}tagView(t){return this.byTag.get(t)??Bh}brushAtTriangle(t){return this.brushByIndex(this.collision.brushForTriangle(t))}surfaceAt(t,e,n){const s=t?t.owner:e>=0?this.brushAtTriangle(e):null;return s instanceof Wc?s.surfaceAt(n):null}brushByIndex(t){return this.statics.entityAt(t)}get triangleCount(){return this.collision.triangleCount}get renderTriangles(){return this.statics.renderTriangles}get builtCellCount(){return this.statics.builtCellCount}get drawDistance(){const t=this.scene.fog;return t&&t.far>0?Math.max(60,t.far*1.1+12):600}get cellCount(){return this.statics.cellCount}get culledTriangles(){return this.statics.culledTriangles}get detailTriangles(){return this.statics.detailTriangles}buildables(){const t=[];for(const e of this.entities.values())e instanceof Wc&&t.push(e);return t.sort((e,n)=>e.id<n.id?-1:e.id>n.id?1:0),t}beginLevel(t){return this.clear(),this.levelName=typeof t?.name=="string"?t.name:"",t.background!==void 0&&(this.scene.background=new Ut(t.background)),t.fog&&(this.scene.fog=new wo(t.fog.color,t.fog.near,t.fog.far)),Array.isArray(t?.entities)?t.entities:[]}spawnOne(t){try{this.spawn(t)}catch(e){console.warn("World: skipped an entity that failed to load",t,e)}}load(t){this.thawStill();for(const e of this.beginLevel(t))this.spawnOne(e);this.bake(),this.building||this.freezeStill()}async loadAsync(t,e,n=()=>new Promise(r=>setTimeout(r,0)),s=14){this.thawStill();const r=this.beginLevel(t),o=.25;let a=performance.now();for(let c=0;c<r.length;c++)this.spawnOne(r[c]),performance.now()-a>s&&(e?.(o*(c+1)/r.length),await n(),a=performance.now());e?.(o),this.aimStatics(),this.lastBake=await this.statics.syncAsync(this.staticBuildables(),c=>e?.(o+(1-o)*c),n,s),this.building||this.freezeStill()}aimStatics(){if(this.statics.drawDistance=this.drawDistance,!this.statics.hasCamera){const t=this.spawnPoint();t?this.statics.focus.copy(t.object.position):this.statics.focus.set(0,0,0)}}staticBuildables(){return this.buildables().filter(t=>t.isStatic)}bake(){this.aimStatics(),this.lastBake=this.statics.sync(this.staticBuildables())}updateLod(t,e=1/60,n=this.drawDistance){if((this.viewPosition??=new P).copy(t),this.lodOwed+=e,this.detail<=.5&&!this.building){const s=this.lodSkip++%3;s===0?(this.statics.drawDistance=n,this.statics.update(t)):s===1?(this.lights.update(t,this.lodOwed),this.lodOwed=0):this.batches.tick(this.building);return}this.lodOwed=0,this.statics.drawDistance=n,this.statics.update(t),this.lights.update(t,e),this.batches.tick(this.building)}lodSkip=0;lodOwed=0;tickList=[];beginFrame(){this.framed=!0,this.frameOpen=!0,this.frameEntityMs=0,this.stepEntityMs=0;const t=this.timings;for(const e in t)t[e]=0;this.navAtFrameEnd||this.navTick(1/0)}navSlice(t){this.navAtFrameEnd=!0,this.navTick(t)}navAtFrameEnd=!1;navMsLast=0;navTick(t){if(this.building)return;const e=performance.now();let n=Math.min(this.detail<=.5?Fh/3:Fh,t);if(n<.1){if(this.lastFrameAt&&e-this.lastFrameAt<nM){this.navMsLast=0;return}n=iM}const s=this.lastFrameAt?Math.min(.25,(e-this.lastFrameAt)/1e3):0;this.lastFrameAt=e,this.nav.current||(this.nav.ground=this.spawnPoint()?.object.position.y??0);const r=performance.now();this.nav.tick(this.playerPosition,s,n,this.collision.dynamics),this.navMsLast=performance.now()-r,this.time("nav",this.navMsLast)}timings={pose:0,decide:0,wreck:0,spawn:0,nav:0};time(t,e){this.timings[t]=(this.timings[t]??0)+e}nav=new eM(this.collision);lastFrameAt=0;frameEntityMs=0;stepEntityMs=0;framed=!1;frameOpen=!1;ticks=0;frameBudgetMs=sM;frameDeferLowS=oM;frameTurn=0;frameList=[];update(t){this.ticks++;const e=this.tickList;e.length=0;const n=this.updating;for(let l=0;l<n.length;l++)e.push(n[l]);const s=this.frameOpen||!this.framed;this.frameOpen=!1;const r=performance.now();let o=0;const a=this.frameList;a.length=0;for(let l=0;l<e.length;l++){const h=e[l];!h.enabled||h.removed||(h.tickPerFrame?(h.frameOwed+=t,s&&a.push(h)):h.onUpdate(t))}const c=a.length;if(c>0){const l=this.frameTurn%c;let h=-1;const f=this.detail<=.5,u=f?this.frameBudgetMs/2:this.frameBudgetMs,d=f?this.frameDeferLowS:rM;for(let g=0;g<c;g++){const _=a[(l+g)%c];if(_.removed)continue;if(o>=u&&_.frameOwed<d&&!_.frameUrgent){h<0&&(h=(l+g)%c);continue}const m=_.frameOwed;_.frameOwed=0;const p=performance.now();_.onUpdate(m),o+=performance.now()-p}this.frameTurn=h<0?l:h,a.length=0}e.length=0,this.frameEntityMs+=o,this.stepEntityMs+=performance.now()-r-o}spawnPoint(){for(const t of this.typeView("spawn"))return t;return null}serialize(){const t={name:this.levelName,version:1,entities:[]},e=this.scene.background;e instanceof Ut&&(t.background=e.getHex());const n=this.scene.fog;n instanceof wo&&(t.fog={color:n.color.getHex(),near:n.near,far:n.far});const s=[...this.entities.values()].sort((r,o)=>r.id<o.id?-1:r.id>o.id?1:0);for(const r of s)r.transient||t.entities.push(r.serialize());return t}clear(){for(const t of[...this.entities.values()])this.remove(t);this.entities.clear(),this.byType.clear(),this.byTag.clear(),this.updating.length=0,this.events.clear(),this.statics.clear(),this.particles.clear(),this.nav.forget()}}const cM=60,ms=1/cM,zh=8;class lM{constructor(t,e,n){this.fixed=t,this.render=e,this.beginFrame=n}stats={fps:0,frameMs:0,simMs:0,renderMs:0,steps:0,lateMs:0,workMs:0};frameStart=0;afterFrame=null;endFrame=null;simulate=!0;holdUntil=0;holdScale=1;slow=1;realDt=0;accumulator=0;last=0;running=!1;token=0;rafId=0;fpsSmooth=0;start(){this.running||(this.running=!0,this.token++,this.last=performance.now(),this.schedule())}stop(){this.running=!1,this.token++,cancelAnimationFrame(this.rafId)}schedule(){if(!this.running)return;const t=this.token;this.rafId=requestAnimationFrame(e=>{t===this.token&&this.frame(e)})}frame(t){if(!this.running)return;this.schedule();const e=t-this.last;this.last=t;const n=performance.now();this.stats.lateMs=n-t,this.step(e),this.stats.workMs=performance.now()-n,this.afterFrame?.()}hold(t,e=.05){const n=performance.now();n>=this.holdUntil?this.holdScale=e:this.holdScale=Math.min(this.holdScale,e),this.holdUntil=Math.max(this.holdUntil,n+t)}get holding(){return performance.now()<this.holdUntil}get scale(){return(performance.now()<this.holdUntil?this.holdScale:1)*this.slow}advance(t){this.step(t)}step(t){if(this.frameStart=performance.now(),this.realDt=Math.min(t,250)/1e3,this.simulate){const h=performance.now()<this.holdUntil?this.holdScale:1;this.accumulator+=Math.min(t,250)/1e3*h,this.beginFrame?.()}else this.accumulator=0;const e=performance.now();let n=0;const s=ms*Math.max(.01,Math.min(1,this.slow));for(;this.simulate&&this.accumulator>=ms&&n<zh;)this.fixed(s),this.accumulator-=ms,n++;n===zh&&this.accumulator>=ms&&(this.accumulator%=ms);const r=performance.now()-e,o=performance.now();this.render(this.accumulator/ms);const a=performance.now()-o;this.simulate&&this.endFrame?.();const c=this.stats,l=t>0?1e3/t:0;this.fpsSmooth=this.fpsSmooth===0?l:this.fpsSmooth*.9+l*.1,c.fps=this.fpsSmooth,c.frameMs=t,c.simMs=r,c.renderMs=a,c.steps=n}}const uM={sens:{min:.25,max:3,step:.05},fov:{min:70,max:110,step:1},volume:{min:0,max:1,step:.05},fsrTarget:{min:1,max:2,step:.05}},Vf={resolution:[0,.5,.66,.75,.9,1,1.25,1.5],frameGen:[0,1],fsr:[0,1],fsrMode:[0,1,2,3,4],frameGenMult:[2,3,4,5,6],aa:[4,2,0]},hM=i=>i in Vf,sl={sens:1,fov:90,volume:1,resolution:1,frameGen:0,aa:4,fsr:0,fsrMode:2,fsrTarget:1,frameGenMult:2},fM="sanguine.settings",dM=2;function pM(i,t){const e=typeof i=="number"&&Number.isFinite(i)?i:sl[t];if(hM(t)){const s=Vf[t];return s.reduce((r,o)=>Math.abs(o-e)<Math.abs(r-e)?o:r,s[0])}const n=uM[t];return Math.min(n.max,Math.max(n.min,e))}const mM=new Set;function gM(){const i={...sl};try{const t=JSON.parse(localStorage.getItem(fM)??"{}");t.v!==dM&&delete t.resolution;for(const e of Object.keys(sl))typeof t[e]=="number"&&mM.add(e),i[e]=pM(t[e],e)}catch{}return i}gM();const js=1024,ho=512;function qa(i){return i<0?0:i>255?255:i}function _M(){const i=wv();if(i)return i.mapping=sr,i.colorSpace=Le,i;if(typeof document>"u")return null;const t=document.createElement("canvas");t.width=js,t.height=ho;const e=t.getContext("2d");if(!e)return null;const n=e.createImageData(js,ho),s=.62,r=.54;for(let a=0;a<ho;a++){const c=a/ho;for(let l=0;l<js;l++){const h=l/js,f=1-Math.abs(c-.5)*2,u=Math.max(0,1-c*2);let d=10+f*f*46,g=10+f*f*16,_=14+u*20+f*f*14,m=Math.abs(h-s);m>.5&&(m=1-m);const p=c-r,y=Math.exp(-(m*m)/.012-p*p/.004);d+=y*210,g+=y*74,_+=y*28;const x=Math.sin(c*Math.PI),v=Oc(l*.55,a*2.1,5,64,91),M=Math.max(0,v-.48)*2.1*x,T=.25+y*1.5;d+=M*70*T,g+=M*40*T,_+=M*44*T;const E=(Oc(l,a,2,128,7)-.5)*7,R=(a*js+l)*4;n.data[R]=qa(d+E),n.data[R+1]=qa(g+E),n.data[R+2]=qa(_+E),n.data[R+3]=255}}e.putImageData(n,0,0);const o=new vl(t);return o.mapping=sr,o.colorSpace=Le,o}function vM(i){const t=_M();if(!t)return null;t.generateMipmaps=!1,t.minFilter=hn,t.mapping=al;const e=new Po({map:t,side:Oe,depthWrite:!1,fog:!1});e.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace("void main() {",`varying vec3 vSkyDir;
void main() {
	vSkyDir = position;`).replace("#include <project_vertex>",`#include <project_vertex>
	gl_Position.z = gl_Position.w;`),s.fragmentShader=s.fragmentShader.replace("void main() {",`varying vec3 vSkyDir;
void main() {`).replace("#include <map_fragment>",`vec4 sampledDiffuseColor = texture2D( map, equirectUv( normalize( vSkyDir ) ) );
diffuseColor *= sampledDiffuseColor;`)};const n=new We(new Zn(2,2,2),e);return n.name="sky",n.frustumCulled=!1,n.matrixAutoUpdate=!1,n.raycast=()=>{},n.renderOrder=1e6,n.onBeforeRender=(s,r,o)=>{n.matrixWorld.makeTranslation(o.matrixWorld.elements[12],o.matrixWorld.elements[13],o.matrixWorld.elements[14]),n.modelViewMatrix.multiplyMatrices(o.matrixWorldInverse,n.matrixWorld)},i.background=null,i.add(n),n}function xM(i,t){const{x:e,y:n,z:s,w:r,h:o,d:a}=i,c=new Zn(r,o,a),l=Rv(t),h=c.attributes.uv,f=[[a,o],[a,o],[r,a],[r,a],[r,o],[r,o]];for(let u=0;u<6;u++){const d=f[u],g=d[0]*l,_=d[1]*l;for(let m=0;m<4;m++){const p=u*4+m;h.setXY(p,h.getX(p)*g,h.getY(p)*_)}}return h.needsUpdate=!0,c.translate(e,n,s),{geometry:c,surface:t}}const yM={floor:"tile",wall:"concrete",chute:"concrete",platform:"panel",accent:"accent",hazard:"hazard"};class MM extends Wc{type="brush";surface="wall";constructor(t){super(t);const e=Af(t.props,"size",[1,1,1]);this.size.set(e[0],e[1],e[2]),this.surface=bl(t.props,"surface","wall"),this.solid=Vc(t.props,"solid",!0),this.visible=Vc(t.props,"visible",!0)}get material(){return yM[this.surface]??"concrete"}surfaceAt(){return this.material}bakeKey(){return`b|${this.surface}|${this.size.x}|${this.size.y}|${this.size.z}|${this.visible?1:0}`}buildParts(){return this.visible?[xM({x:0,y:0,z:0,w:this.size.x,h:this.size.y,d:this.size.z},this.material)]:[]}collisionBoxes(){return this.solid?[{x:0,y:0,z:0,w:this.size.x,h:this.size.y,d:this.size.z}]:[]}scalableAxes(){return[!0,!0,!0]}minSize(){return[.5,.5,.5]}get displayName(){return this.name||`${this.surface} brush`}serializeProps(){const t={size:[vo(this.size.x),vo(this.size.y),vo(this.size.z)],surface:this.surface};return this.solid||(t.solid=!1),this.visible||(t.visible=!1),t}}const er=vo,Ya=new P;class SM extends Do{type="spawn";get yaw(){return Ya.set(0,0,-1).applyQuaternion(this.object.quaternion),Math.atan2(-Ya.x,-Ya.z)}}class bM extends Do{type="trigger";isStatic=!1;needsUpdate=!0;size=new P(4,4,4);event="";once=!1;inside=!1;spent=!1;aabb=new fe;constructor(t){super(t);const e=Af(t.props,"size",[4,4,4]);this.size.set(e[0],e[1],e[2]),this.event=bl(t.props,"event",""),this.once=Vc(t.props,"once",!1)}get eventName(){return this.event||this.name||`trigger:${this.id}`}eventsFired(){return[this.eventName,`${this.eventName}:exit`]}onUpdate(t){if(this.spent)return;const e=this.object.position;this.aabb.min.set(e.x-this.size.x/2,e.y-this.size.y/2,e.z-this.size.z/2),this.aabb.max.set(e.x+this.size.x/2,e.y+this.size.y/2,e.z+this.size.z/2);const n=this.aabb.containsPoint(this.world.playerPosition);if(n===this.inside)return;this.inside=n;const s={trigger:this,event:this.eventName};n?(this.world.events.emit(this.eventName,s),this.once&&(this.spent=!0)):this.world.events.emit(`${this.eventName}:exit`,s)}saveState(){return this.inside||this.spent?{inside:this.inside,spent:this.spent}:void 0}loadState(t){const e=t;this.inside=e?.inside===!0,this.spent=e?.spent===!0}serializeProps(){const t={size:[er(this.size.x),er(this.size.y),er(this.size.z)]};return this.event&&(t.event=this.event),this.once&&(t.once=!0),t}}class EM extends Do{type="light";kind="point";color=16777215;intensity=1;distance=0;light=null;source=null;constructor(t){super(t),this.kind=bl(t.props,"kind","point"),this.color=ya(t.props,"color",16777215),this.intensity=ya(t.props,"intensity",1),this.distance=ya(t.props,"distance",0)}onSpawn(){switch(this.kind){case"ambient":{const t=new Ut(this.color).multiplyScalar(1.3),e=new Ut(this.color).multiplyScalar(.62);this.light=new mp(t,e,this.intensity);break}case"directional":this.light=new xp(this.color,this.intensity);break;default:{const t=this;this.source={position:this.object.position,get color(){return t.color},get intensity(){return t.intensity},get distance(){return t.distance}},this.world.lights.register(this.source),this.world.scene.add(this.object);return}}this.object.add(this.light),this.world.scene.add(this.object)}onDestroy(){this.source&&this.world.lights.unregister(this.source),this.world.scene.remove(this.object),this.light?.dispose()}serializeProps(){const t={kind:this.kind,color:this.color,intensity:er(this.intensity)};return this.kind==="point"&&this.distance&&(t.distance=er(this.distance)),t}}function wM(){uo("brush",i=>new MM(i)),uo("spawn",i=>new SM(i)),uo("trigger",i=>new bM(i)),uo("light",i=>new EM(i))}wM();const Oi=new av({antialias:!0});Oi.setPixelRatio(Math.min(devicePixelRatio,2));Oi.setSize(innerWidth,innerHeight);document.body.appendChild(Oi.domElement);const Di=new en(70,innerWidth/innerHeight,.1,400);addEventListener("resize",()=>{Oi.setSize(innerWidth,innerHeight),Di.aspect=innerWidth/innerHeight,Di.updateProjectionMatrix()});const Ge=new Ul;Bv(Oi);vM(Ge.scene);Ge.scene.add(Ge.statics.depthScene);const TM=new hv(Oi,Ge.scene),ri=(i,t,e="wall")=>({type:"brush",pos:i,props:{size:t,surface:e}}),AM={name:"example",version:1,entities:[{type:"spawn",pos:[0,1,12]},ri([0,-.5,0],[40,1,40],"floor"),ri([0,3,-20],[40,6,1]),ri([-20,3,0],[1,6,40]),ri([20,3,0],[1,6,40]),ri([-6,2.5,-4],[2,5,2],"accent"),ri([6,2.5,-4],[2,5,2],"accent"),ri([0,3,-12],[10,.5,4],"platform"),ri([0,.05,4],[6,.1,6],"hazard"),{type:"light",pos:[0,8,0],props:{kind:"point",color:16762250,intensity:40,distance:30}},{type:"light",pos:[0,0,0],props:{kind:"ambient",color:8949928,intensity:.6}},{type:"light",pos:[10,20,8],props:{kind:"directional",color:16777215,intensity:1.4}}]};Ge.load(AM);let kh=!1;Ge.particles.register("smoke",{layers:[{style:"smoke",model:"smoke",rate:9,shape:"disc",radius:.3,dir:[0,1,0],speed:2.4,spread:.12,life:5,size:.7,grow:4.5,alpha:.42,color:3815478,colorEnd:5657166,drag:.35,gravity:-.15,turbulence:.9,turbulenceFreq:.35,spin:.4}]});Ge.particles.register("sparks",{layers:[{style:"streak",count:24,speed:9,spread:.9,life:.6,size:.05,color:16760944,gravity:14,drag:1.2}]});const RM=Ge.particles.emitter("smoke");RM.position.set(6,5,-4);let $a=0;const CM=document.getElementById("info");let Ks=0;const rl=new lM(i=>{Ks+=i,Ge.update(i),$a-=i,$a<=0&&($a=1.2,Ge.particles.fire("sparks",new P(-6,5,-4),{dir:new P(0,1,0)}))},()=>{Di.position.set(Math.sin(Ks*.15)*16,6,Math.cos(Ks*.15)*16),Di.lookAt(0,2,-4),Ge.updateLod(Di.position),Ge.particles.update(rl.stats.frameMs/1e3,Di),Av(Ks),Ov(Ks),Oi.render(Ge.scene,Di),kh||(kh=TM.adopt()),CM.textContent=`${rl.stats.fps.toFixed(0)} fps · ${Ge.renderTriangles} level triangles · ${Object.values(Ge.particles.live()).reduce((i,t)=>i+t,0)} particles`});rl.start();
