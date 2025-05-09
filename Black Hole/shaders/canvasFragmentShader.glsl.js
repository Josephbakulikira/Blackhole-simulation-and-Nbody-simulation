const fragmentShader = `
# define MAX_ITERATIONS 300
# define SPEED_OF_LIGHT 1.0
# define EVENT_HORIZON_RADIUS 1.0
# define BACKGROUND_DISTANCE 10000.0
# define PROJECTION_DISTANCE 1.0
# define STEP_SIZE 0.01
# define SCALE_FACTOR 1.0
# define PI 3.14159265359

varying vec2 vu;

// uniforms
uniform sampler2D uCanvasTexture;
uniform vec2 uResolution;
uniform vec3 uCameraTranslate;
uniform float uPov;

// variables
vec3 bh_pos = vec3(0.0, 0.0, 0.0);
vec3 camera_pos = vec3(0.0, 0.0, 30.0);


// -----------------
// MATRIX TRANSFORMS
// -----------------

mat4 identityMat(){
    return mat4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}

mat4 translate_ColOrder(float x, float y, float z){
    return mat4(
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1
    );
}

mat4 translate_RowOrder(float x, float y, float z){
    return mat4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1
    );
}

mat4 scale(float x, float y, float z){
    return mat4(
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
    );
}

mat4 rotate_x(float theta){
    return mat4(
        1, 0, 0, 0,
        0, cos(theta), -sin(theta), 0,
        0, sin(theta), cos(theta), 0,
        0, 0, 0, 1
    );
}

mat4 rotate_y(float theta){
    return mat4(
        cos(theta), 0, sin(theta), 0,
        0, 1, 0, 0,
        -sin(theta), 0, cos(theta), 0,
        0, 0, 0, 1
    );
}

mat4 rotate_z(float theta){
    return mat4(
        cos(theta), -sin(theta), 0, 0,
        sin(theta), cos(theta), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}

//--------------------------------------------------
//-ADJUST COORDINATE FROM PIXEL TO WORLD COORDINATE-
//--------------------------------------------------
struct Ray{
    vec4 origin;
    vec4 direction;
};

Ray pixelToWorldRay(){
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec4 look_from = rotate_y(camera_pos.x+uCameraTranslate.x) * rotate_x(camera_pos.y+uCameraTranslate.y) * vec4(camera_pos+uCameraTranslate, 1.0);
    vec3 view = vec3(-look_from.x, -look_from.y, -look_from.z);

    vec3 n_view = normalize(view);
    vec3 n_upview = normalize(cross(up, n_view));
    vec3 c_vup = cross(n_view, n_upview);

    mat4 offset = mat4(
        vec4(n_upview, 0.0),
        vec4(c_vup, 0.0),
        vec4(n_view, 0.0),
        vec4(0.0, 0.0, 0.0 , 1.0)
    ) ;
    mat4 transform = translate_RowOrder(-0.5 * uResolution.x, -0.5 * uResolution.y, PROJECTION_DISTANCE);
    mat4 look_transform = translate_RowOrder(look_from.x, look_from.y, look_from.z);

    float pov_rad = radians(uPov);
    float h = PROJECTION_DISTANCE * 2.0 * tan(0.5 * pov_rad);
    mat4 scaled_transform = scale(
        h/(uResolution.y * SCALE_FACTOR),
        h/(uResolution.y * SCALE_FACTOR),
        1.0
    );

    vec4 local_pixel_coord = vec4(gl_FragCoord.x, gl_FragCoord.y, 0.0, 1.0);
    vec4 world_coord = look_transform * offset * scaled_transform * transform * local_pixel_coord;

    Ray ray;
    ray.origin = look_from;
    ray.direction = world_coord - look_from;

    return ray;
}

// -----------------------------------
//      ------- BLACK HOLE --------
// -----------------------------------

// relativistic orbital dynamics
// The Newtonian gravity that appears when deriving orbits from 
// schwarzschild metric
vec3 geodesic_equation(vec3 position, float h2){
    return -(3.0/2.0) * h2 * position / pow(length(position), 5.0);
}

bool compute(inout vec3 position, inout vec3 velocity){
    // check if an object is in the event horizon or not
    // and perform the integration 
    // we gonna use the Runge kutta integration , because it's more accurate than euler integration

    // angular momentum constants in the geodesic equation
    vec3 perpendicular = cross(position, velocity);
    float mag = length(perpendicular);
    float h2 = pow(mag, 2.0);

    for(int i = 0; i < MAX_ITERATIONS; i++){
        // calculate the distance between the ray and the black hole 
        // assuming the black hole is at : vec3(0, 0, 0);
        float dist = length(position); 
        if(dist >= BACKGROUND_DISTANCE){
            return false;
        }
        if(dist <= EVENT_HORIZON_RADIUS){
            return true;
        }
        float step_size = dist * dist * STEP_SIZE;
        vec3 rk_delta = velocity * step_size;

        // RK-4 = runge-kutta integration
        vec3 k1 = step_size * geodesic_equation(position, h2);
        vec3 k2 = step_size * geodesic_equation(position + rk_delta + 0.5 * k1, h2);
        vec3 k3 = step_size * geodesic_equation(position + rk_delta + 0.5 * k2, h2);
        vec3 k4 = step_size * geodesic_equation(position + rk_delta + k3, h2);

        position += rk_delta;
        velocity += (k1 + 2.0 * (k2 + k3) + k4) / 6.0;
    }
    return false;
}

vec4 intersect_sphere(Ray ray, float radius){
    float a = dot(ray.direction, ray.direction);
    float b = dot(ray.direction, ray.origin) * 2.0;
    float c = dot(ray.origin, ray.origin) - radius * radius;

    float d = b * b - 4.0 * a * c;
    float q = -0.5 * (b + sign(b) * sqrt(d));

    float r1 = q/a;
    float r2 = c/q;

    float i = max(r1, r2);
    return ray.origin + i * ray.direction;
}

vec4 GetColor(Ray ray){
    vec4 positioned = intersect_sphere(ray, BACKGROUND_DISTANCE);

    // Polar coordinate of the intersection.
    float dist = length(vec2(positioned.x, positioned.z));
    float theta = atan(positioned.x / positioned.z);
    float new_z = positioned.y;
    // map the polar coordinates to the texture
    vec2 new_coord = vec2(theta/PI + 0.5, new_z/(2.0 * BACKGROUND_DISTANCE) + 0.5);

    return texture2D(uCanvasTexture, new_coord);
}

void main() {
    Ray ray = pixelToWorldRay();

    vec3 position = vec3(ray.origin);
    vec3 velocity = SPEED_OF_LIGHT * normalize(vec3(ray.direction));
    
    bool checker = compute(position, velocity);
    if(checker){
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    ray.origin = vec4(position, 1.0);
    ray.direction = vec4(velocity, 0.0);

    vec4 pixel_color = GetColor(ray);

    // Set the pixel color
    // gl_FragColor = texture2D(uCanvasTexture, vu);
    // gl_FragColor = vec4(vu.x, vu.y, 0, 1.0);
    gl_FragColor = pixel_color;
}
`;

export default fragmentShader;
