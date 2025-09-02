import { draw_parallelepiped, p1, p2, p3 } from './paint.js';

const open_matrix_nav_btn = document.querySelector('#open-matrix-nav-btn');
const open_controls_btn = document.querySelector('#open-controls-btn');
const matrix_nav = document.querySelector('#matrix-nav');
const controls = document.querySelector('#controls');

const custom_matrix_vectors = controls.querySelectorAll(".custom-matrix-vector");
const scalar_inputs = controls.querySelectorAll('.v-scalar-input');
const scalars = controls.querySelectorAll('.v-scalar');

// open_matrix_nav_btn.addEventListener('click', e => e.stopPropagation());

let controls_are_open = false;
let matrix_nav_is_open = false;

open_controls_btn.addEventListener('click', () => 
{    
    matrix_nav_is_open = false;

    if (!controls_are_open) {
        open_controls_btn.classList.remove('display-opaque');
        switch_class(controls, 'display-none', 'display-block');
        switch_class(matrix_nav, 'display-block', 'display-none');
        open_matrix_nav_btn.classList.add('display-opaque');
    } else {
        close_navigation();
    }

    controls_are_open = !controls_are_open;
});

open_matrix_nav_btn.addEventListener('click', () => 
{    
    controls_are_open = false;

    if (!matrix_nav_is_open)
    {
        open_matrix_nav_btn.classList.remove('display-opaque');
        switch_class(controls, 'display-block', 'display-none');
        switch_class(matrix_nav, 'display-none', 'display-block');
        open_controls_btn.classList.add('display-opaque');
    } else {
        close_navigation();
    }

    matrix_nav_is_open = !matrix_nav_is_open;
});

function close_navigation() 
{
    open_controls_btn.classList.remove('display-opaque');
    open_matrix_nav_btn.classList.remove('display-opaque');
    switch_class(controls, 'display-block', 'display-none'); 
    switch_class(matrix_nav, 'display-block', 'display-none'); 
}

function switch_class(element, old, _new) {
    element.classList.remove(old);
    element.classList.add(_new)
}

document.querySelector("#custom-matrix").addEventListener('submit', e => 
{
    e.preventDefault()
    
    // get input values
    const v1 = custom_matrix_vectors[0].querySelectorAll("input");
    const v2 = custom_matrix_vectors[1].querySelectorAll("input");
    const v3 = custom_matrix_vectors[2].querySelectorAll("input");

    p1.set(v1[0].value, v1[1].value, v1[2].value);
    p2.set(v2[0].value, v2[1].value, v2[2].value);
    p3.set(v3[0].value, v3[1].value, v3[2].value);

    // Don't consider the slider values. 
    // In case, let the user set them later.
    draw_parallelepiped(1, 1, 1);
    resetScalars();
});

let v1_scalar = 1, v2_scalar = 1, v3_scalar = 1;

scalar_inputs.forEach(scalar_input => 
{
    scalar_input.addEventListener('input', function() 
    {
        if (this.id === 'v1-scalar-input') v1_scalar = this.value;
        else if (this.id === 'v2-scalar-input') v2_scalar = this.value;
        else if (this.id === 'v3-scalar-input') v3_scalar = this.value;
        else console.error(`Unknown id: ${this.id}`);

        document.querySelector(`#${this.id} ~ .v-scalar`).textContent = this.value;
        draw_parallelepiped(v1_scalar, v2_scalar, v3_scalar);
    });
});

document.querySelectorAll('.card > footer > button').forEach(btn => 
{
    btn.addEventListener('click', () => 
    {
        if (btn.id === 'symm-mat-btn')
        {
            p1.set(1, 2, 3);
            p2.set(2, 1, 2);
            p3.set(3, 2, 1);
        }
        else if (btn.id === 'skew-symm-mat-btn')
        {
            p1.set(1, 2, 3);
            p2.set(-2, 1, 2);
            p3.set(-3, -2, 1);
        }
        else if (btn.id === 'diag-mat-btn')
        {
            p1.set(1, 0, 0);
            p2.set(0, 2, 0);
            p3.set(0, 0, 3);
        }
        else if (btn.id === 'triang-mat-btn')
        {
            // This is an upper-triangular matrix to be precise
            p1.set(1, 0, 0);
            p2.set(1, 2, 0);
            p3.set(1, 2, 3);
        }
        else if (btn.id === 'ortho-mat-btn')
        {
            p1.set(1, 0, 0);
            p2.set(0, 0, 1);
            p3.set(0, -1, 0);
        }
        else if (btn.id === 'toeplitz-mat-btn') 
        {
            p1.set(1, 4, 5);
            p2.set(2, 1, 4);
            p3.set(3, 2, 1);
        }
        else if (btn.id === 'hankel-mat-btn')
        {
            p1.set(3, 2, 1);
            p2.set(2, 1, 4);
            p3.set(1, 4, 5);
        }   
        else console.error(`Unknown matrix: ${btn.id}`);

        draw_parallelepiped(1, 1, 1);
        resetScalars();
    });
});

function resetScalars() 
{
    scalars.forEach(scalar => scalar.textContent = 1);
    scalar_inputs.forEach(slider => slider.value = 1);
    v1_scalar = v2_scalar = v3_scalar = 1;
}
