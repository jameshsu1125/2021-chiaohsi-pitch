// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute float layer;
attribute float ran;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform float uPy;
uniform float uPx;
uniform float uRadius;
uniform float uSpeed;
uniform float uMode;
uniform float uMaxTime;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify:snoise_1_2=require(glsl-noise/simplex/2d);

float random(float n){
	return fract(sin(n)*43758.5453123);
}

void main(){
	vUv = uv;
	
	// particle uv
	vec2 puv = offset.xy / uTextureSize;
	vPUv = puv;
	
	// pixel color
	vec4 colA = texture2D( uTexture, puv);
	//float grey = colA.r *.21 + colA.g *.71 + colA.b * .17;
	
	// displacement
	vec3 displaced = offset;

	// center
	displaced.xy -= uTextureSize * .5;
	
	float rndz = snoise_1_2( vec2( pindex, uTime * 0.1 ) ) ;
	displaced.z += rndz * uDepth;

	float px;
	float py;
	float minfiy = 0.01 * uSpeed;
	float deg = ran * uTime * minfiy;

	float disTime = uMaxTime - uTime + ( 360.0 - ran ) * .05;
	if(disTime < 0.0){
		disTime = 0.0;
	}
	
	float nRaduis;
	if(uTime > uMaxTime - ( 360.0 - ran ) * .05){
		nRaduis = disTime * 0.01;
	}
	else {
		nRaduis = uRadius;
	}

	if(uMode < 0.1){
		px = cos( deg ) * nRaduis * layer;
		py = sin( deg ) * -nRaduis * layer;
	}
	else if(uMode > 0.9 && uMode < 1.1){
		px = cos( deg ) * -nRaduis * rndz * layer;
		py = tan( deg ) * -nRaduis * layer;
	}
	else if(uMode > 1.9 && uMode <= 2.1){
		px = tan( deg * 2.0 ) * nRaduis * layer;
		py = tan( deg ) * -nRaduis * layer;
	}
	else {
		px = tan( deg * rndz * 0.05 ) * nRaduis * layer;
		py = cos( deg ) * nRaduis * layer;
	}

	displaced.x += uPx + px;
	displaced.y += uPy + py;
	
	// particle size
	float psize = 1.0;
	psize *= uSize;
	
	
	
	// final position
	vec4 mvPosition = modelViewMatrix * vec4( displaced , 1.0 );
	mvPosition.xyz += position*psize;
	vec4 finalPosition = projectionMatrix * mvPosition;
	
	gl_Position=finalPosition;
}
