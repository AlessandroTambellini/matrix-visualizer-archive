const open_matrix_nav_btn = document.querySelector('#open-matrix-nav-btn');
const open_controls_btn = document.querySelector('#open-controls-btn');
const matrix_nav = document.querySelector('#matrix-nav');
const controls = document.querySelector('#controls');
// const canvas = document.querySelector('canvas');

// controls.addEventListener('click', e => e.stopPropagation());
// matrix_nav.addEventListener('click', e => e.stopPropagation());
// open_controls_btn.addEventListener('click', e => e.stopPropagation());
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
