import * as THREE from './node_modules/three.module.js';
import { OrbitControls } from './node_modules/OrbitControls.js';

const canvas = document.querySelector('canvas');

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0)
camera.position.set(0, 5, 20);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const origin = new THREE.Vector3();
const scene = new THREE.Scene();

/*
 *
 *  Create the Plane
 */

const x_axis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-10, 0, 0), 20, 'red', 0.4)
const y_axis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -10, 0), 20, 'green', 0.4)
const z_axis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -10), 20, 'blue', 0.4)

const xz_plane_vertices = [
    new THREE.Vector3(9, 0, 9), 
    new THREE.Vector3(-9, 0, 9), 
    new THREE.Vector3(-9, 0, -9), 
    new THREE.Vector3(9, 0, -9)
];

const positions_xz_plane = new Float32Array([
    xz_plane_vertices[0].x, xz_plane_vertices[0].y, xz_plane_vertices[0].z, 
    xz_plane_vertices[1].x, xz_plane_vertices[1].y, xz_plane_vertices[1].z, 
    xz_plane_vertices[2].x, xz_plane_vertices[2].y, xz_plane_vertices[2].z, 
    xz_plane_vertices[3].x, xz_plane_vertices[3].y, xz_plane_vertices[3].z, 
]);

const xz_plane_indices = [
    0, 1, 2,
    0, 2, 3
];

const xz_plane_triang_geom = new THREE.BufferGeometry()
    .setAttribute('position', new THREE.BufferAttribute(positions_xz_plane, 3))
    .setIndex(xz_plane_indices);

const xz_plane_material = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide, transparent: true, opacity: 0.1 });

const xz_plane = new THREE.Mesh(xz_plane_triang_geom, xz_plane_material)

// Create the xz plane-grid
const grid_material = new THREE.LineBasicMaterial({ color: 'grey', linewidth: 1, opacity: 0.4, transparent: true });
for (let i = 1; i <= 9; i++) 
{
    // parallel to x-axis
    const geom_left = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(10, 0, -i), new THREE.Vector3(-10, 0, -i)
    ]);
    const geom_right = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(10, 0, i), new THREE.Vector3(-10, 0, i)
    ]);
    
    // parallel to z-axis
    const geom_front = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-i, 0, 10), new THREE.Vector3(-i, 0, -10)
    ]);
    const geom_back = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, 0, 10), new THREE.Vector3(i, 0, -10)
    ]);

    scene.add(
        new THREE.Line(geom_left, grid_material), 
        new THREE.Line(geom_right, grid_material),
        new THREE.Line(geom_front, grid_material),
        new THREE.Line(geom_back, grid_material),
    );
}

/*
 *
 *  Create the initial Matrix
 */

const p1 = new THREE.Vector3(5, 4, 1);
const p2 = new THREE.Vector3(-2, 3, -4);
const p3 = new THREE.Vector3(3, -4, -6);

let arrow1, arrow2, arrow3;
let parallelepiped, parallelepiped_wireframe;

// Actually it's draw or update (re-draw)
function draw_parallelepiped(v1_scalar, v2_scalar, v3_scalar) 
{
    scene.remove(arrow1, arrow2, arrow3);
    scene.remove(parallelepiped, parallelepiped_wireframe);

    arrow1 = new THREE.ArrowHelper(p1.clone().normalize(), origin, p1.length(), 'yellow', 0.4, 0.2);
    arrow2 = new THREE.ArrowHelper(p2.clone().normalize(), origin, p2.length(), 'yellow', 0.4, 0.2);
    arrow3 = new THREE.ArrowHelper(p3.clone().normalize(), origin, p3.length(), 'yellow', 0.4, 0.2);

    // parallelepiped points
    const P0 = origin;
    const P1 = p1.clone().multiplyScalar(v1_scalar);
    const P2 = p2.clone().multiplyScalar(v2_scalar);
    const P3 = p3.clone().multiplyScalar(v3_scalar);
    const P4 = P1.clone().add(P2);
    const P5 = P2.clone().add(P3);
    const P6 = P1.clone().add(P3);
    const P7 = P4.clone().add(P3);

    const parallelepiped_vertices = [ // the 6 faces
        P0, P1, P4, P2,
        P0, P1, P6, P3,
        P0, P2, P5, P3,
        P2, P4, P7, P5,
        P1, P6, P7, P4,
        P3, P6, P7, P5
    ].flatMap(v => v.toArray()); // Convert each vector structure to an array of coordinates

    // Each face is splitted into 2 triangles
    const parallelepiped_indices = [
        0, 1, 2,  0, 2, 3,  
        4, 5, 6,  4, 6, 7,  
        8, 9, 10, 8, 10, 11, 
        12, 13, 14, 12, 14, 15, 
        16, 17, 18, 16, 18, 19, 
        20, 21, 22, 20, 22, 23  
    ];

    const parallelepiped_edges = [ // (12 connections)
        P0, P1, P0, P2, P0, P3,
        P1, P6, P3, P6,
        P2, P5, P3, P5,
        P2, P4, P1, P4,
        P5, P7,
        P4, P7,
        P6, P7,
    ];

    const parallelepiped_geom = new THREE.BufferGeometry()
        .setAttribute('position', new THREE.Float32BufferAttribute(parallelepiped_vertices, 3));
    parallelepiped_geom.setIndex(parallelepiped_indices);
    parallelepiped = new THREE.Mesh(parallelepiped_geom, new THREE.MeshBasicMaterial(
        { 
            color: 'lightblue', 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: .5 
        })
    );
    
    const parallelepiped_edges_geom = new THREE.BufferGeometry().setFromPoints(parallelepiped_edges);
    parallelepiped_wireframe = new THREE.LineSegments(parallelepiped_edges_geom, new THREE.LineBasicMaterial(
        { 
            color: 'lightblue', 
            linewidth: 2 
        })
    );

    scene.add(arrow1, arrow2, arrow3);
    scene.add(parallelepiped, parallelepiped_wireframe);
}

// It has to be before the renderer loop
(function initialPaint() {
    scene.add(x_axis, y_axis, z_axis);
    scene.add(xz_plane);
    // scene.add(arrow1, arrow2, arrow3);
    draw_parallelepiped(1, 1, 1);
})();

// Render Loop
(function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
})();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

export {
    draw_parallelepiped,
    p1,
    p2,
    p3,
};
