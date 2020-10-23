// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform float uPx;
uniform float uPy;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify:snoise_1_2=require(glsl-noise/simplex/2d);

float random(float n){
	return fract(sin(n)*43758.5453123);
}

void main(){
	vUv=uv;
	
	// particle uv
	vec2 puv=offset.xy/uTextureSize;
	vPUv=puv;
	
	// pixel color
	vec4 colA=texture2D(uTexture,puv);
	float grey=colA.r*.21+colA.g*.71+colA.b*.17;
	
	// displacement
	vec3 displaced=offset;
	
	displaced.xy+=vec2(random(pindex)-0.5,random(offset.x+pindex)-0.5)*uRandom;
	float rndz=(random(pindex)+snoise_1_2(vec2(pindex*.1,uTime*0.1)));
	displaced.z+=rndz*(random(pindex)*2.*uDepth);
	
	// center
	displaced.xy-=uTextureSize*.5;
	
	// randomise
	
	displaced.x+=cos(angle)*uPx;
	displaced.y+=sin(angle)*uPx;
	
	//displaced.xy-=cos(angle)*20.;
	//displaced.xy+=cos(angle)*10.;
	//displaced.z+=cos(angle)*100.;
	//displaced.x+=tan(angle)*1.;
	
	//displaced.x+=cos(angle)*uPx*grey;
	//displaced.y+=sin(angle)*uPx*grey;
	
	// particle size
	float psize= (snoise_1_2(vec2(uTime*.3,pindex)*2.0)+20.5);
	//psize*=max(grey,0.5);
	psize *= .06;
	psize*=uSize;
	
	// final position
	vec4 mvPosition=modelViewMatrix*vec4(displaced,1.);
	mvPosition.xyz+=position*psize;
	vec4 finalPosition=projectionMatrix*mvPosition;
	
	gl_Position=finalPosition;
}
