import * as THREE from 'three'
import { scene, origin } from './index.js';

let v1_scalar = 1, v2_scalar = 1, v3_scalar = 1;
let parallelepiped, parallelepiped_wireframe;

const parallelepiped_geom = new THREE.BufferGeometry();
const parallelepiped_edges_geom = new THREE.BufferGeometry();
const parallelepiped_material = new THREE.MeshBasicMaterial({ 
    color: 'lightblue', 
    side: THREE.DoubleSide, 
    transparent: true, 
    opacity: .5 
});
const parallelepiped_edges_material = new THREE.LineBasicMaterial({ 
    color: 'lightblue', 
    linewidth: 2 
});

// Init values
let p1 = new THREE.Vector3(5, 4, 1);
let p2 = new THREE.Vector3(-2, 3, -4);
let p3 = new THREE.Vector3(3, -4, -6);

let arrow1 = new THREE.ArrowHelper(p1.clone().normalize(), origin, p1.length(), 'yellow', 0.4, 0.2);
let arrow2 = new THREE.ArrowHelper(p2.clone().normalize(), origin, p2.length(), 'yellow', 0.4, 0.2);
let arrow3 = new THREE.ArrowHelper(p3.clone().normalize(), origin, p3.length(), 'yellow', 0.4, 0.2);

document.querySelectorAll('.v-slider').forEach(slider => {
    slider.addEventListener('input', function() {
        if (this.id === 'v1-slider') v1_scalar = this.value;
        if (this.id === 'v2-slider') v2_scalar = this.value;
        if (this.id === 'v3-slider') v3_scalar = this.value;
        
        document.querySelector(`#${this.parentElement.id} .v-scalar`).textContent = this.value;
        updateParallelepiped(v1_scalar, v2_scalar, v3_scalar);
    });
});

document.querySelector("#custom-matrix").addEventListener('submit', e => {
    e.preventDefault()
    
    // get input values
    const v1 = document.querySelectorAll("#custom-matrix .custom-matrix-vector")[0].querySelectorAll("input");
    const v2 = document.querySelectorAll("#custom-matrix .custom-matrix-vector")[1].querySelectorAll("input");
    const v3 = document.querySelectorAll("#custom-matrix .custom-matrix-vector")[2].querySelectorAll("input");

    p1 = new THREE.Vector3(v1[0].value, v1[1].value, v1[2].value);
    p2 = new THREE.Vector3(v2[0].value, v2[1].value, v2[2].value);
    p3 = new THREE.Vector3(v3[0].value, v3[1].value, v3[2].value);

    updateParallelepiped(1, 1, 1);
    resetScalars();
}) 

document.querySelectorAll('.card > footer > button').forEach(btn => {
    btn.addEventListener('click', () => {
        drawMatrix(btn.id)
    });
})

function updateArrows(v1, v2, v3) 
{
    scene.remove(arrow1, arrow2, arrow3);
    arrow1 = new THREE.ArrowHelper(v1.clone().normalize(), origin, v1.length(), 'yellow', 0.4, 0.2);
    arrow2 = new THREE.ArrowHelper(v2.clone().normalize(), origin, v2.length(), 'yellow', 0.4, 0.2);
    arrow3 = new THREE.ArrowHelper(v3.clone().normalize(), origin, v3.length(), 'yellow', 0.4, 0.2);
    scene.add(arrow1, arrow2, arrow3);
}

function resetScalars() 
{
    document.querySelectorAll('.v-scalar').forEach(scalar => scalar.textContent = 1);
    document.querySelectorAll('.v-slider').forEach(slider => slider.value = 1);
    v1_scalar = v2_scalar = v3_scalar = 1;
}

function updateParallelepiped(v1_scalar, v2_scalar, v3_scalar) {

    // remove the current one before painting the next one
    scene.remove(parallelepiped, parallelepiped_wireframe);

    updateArrows(p1, p2, p3);

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

    // Create parallelepiped
    parallelepiped_geom.setAttribute('position', new THREE.Float32BufferAttribute(parallelepiped_vertices, 3));
    parallelepiped_geom.setIndex(parallelepiped_indices);
    parallelepiped = new THREE.Mesh(parallelepiped_geom, parallelepiped_material);
    
    // Create parallelepiped wireframe
    parallelepiped_edges_geom.setFromPoints(parallelepiped_edges);
    parallelepiped_wireframe = new THREE.LineSegments(parallelepiped_edges_geom, parallelepiped_edges_material);

    scene.add(parallelepiped, parallelepiped_wireframe);
}

function drawMatrix(btn_id) {
    if (btn_id === 'symm-mat-btn') createSymmetricMatrix();
    else if (btn_id === 'skew-symm-mat-btn') createSkewSymmetricMatrix();
    else if (btn_id === 'diag-mat-btn') createDiagonalMatrix();
    else if (btn_id === 'triang-mat-btn') createTriangularMatrix();
    else if (btn_id === 'ortho-mat-btn') createOrthogonalMatrix();
    else if (btn_id === 'toeplitz-mat-btn') createToeplitzMatrix();
    else if (btn_id === 'hankel-mat-btn') createHankelMatrix();   

    updateParallelepiped(1, 1, 1);
    resetScalars();
}

function createSymmetricMatrix() {
    // Set default values
    p1 = new THREE.Vector3(1, 2, 3)
    p2 = new THREE.Vector3(2, 1, 2)
    p3 = new THREE.Vector3(3, 2, 1)
}

function createSkewSymmetricMatrix() {
    p1 = new THREE.Vector3(1, 2, 3)
    p2 = new THREE.Vector3(-2, 1, 2)
    p3 = new THREE.Vector3(-3, -2, 1)
}

function createDiagonalMatrix() {
    p1 = new THREE.Vector3(1, 0, 0)
    p2 = new THREE.Vector3(0, 2, 0)
    p3 = new THREE.Vector3(0, 0, 3)
}

function createTriangularMatrix() {
    // The points below form an upper-triangular matrix
    p1 = new THREE.Vector3(1, 0, 0)
    p2 = new THREE.Vector3(1, 2, 0)
    p3 = new THREE.Vector3(1, 2, 3)
}

function createOrthogonalMatrix() {
    p1 = new THREE.Vector3(1, 0, 0)
    p2 = new THREE.Vector3(0, 0, 1)
    p3 = new THREE.Vector3(0, -1, 0)
}

function createToeplitzMatrix() {
    p1 = new THREE.Vector3(1, 4, 5)
    p2 = new THREE.Vector3(2, 1, 4)
    p3 = new THREE.Vector3(3, 2, 1)
}

function createHankelMatrix() {
    p1 = new THREE.Vector3(3, 2, 1)
    p2 = new THREE.Vector3(2, 1, 4)
    p3 = new THREE.Vector3(1, 4, 5)
}

(function initialPaint() {
    scene.add(arrow1, arrow2, arrow3)
    updateParallelepiped(1, 1, 1)
})();

