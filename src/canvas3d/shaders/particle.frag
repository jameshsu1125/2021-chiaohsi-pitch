// @author brunoimbrizi / http://brunoimbrizi.com

precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

void main() {
	vec4 color = vec4(0.0);
	vec2 uv = vUv;
	vec2 puv = vPUv;
	vec4 colB;

	// pixel color
	vec4 colA = texture2D(uTexture, puv);

	// greyscale
	float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
	if(grey > 0.6)
	{
		colB = vec4(grey, grey, grey, 1.0);
	}
	else
	{
		colB = vec4(grey, grey, grey, 0.5);
	}
	

	// circle
	float border = 0.0;
	float radius = 0.5;
	float dist = radius - distance(uv, vec2(0.5));
	float t = smoothstep(1.0, border, dist);

	// final color
	color = colA;
	color.a = t;

	gl_FragColor = color;
}