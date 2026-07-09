/**
 * "legacyLib" — a stand-in for any older third-party library (sliders,
 * masonry layouts, lightboxes…) that assumes a single global context.
 *
 * Note the two classic sins:
 *   1. It finds its targets with `document.querySelectorAll()`.
 *   2. It binds behavior to the global `window`.
 *
 * Neither works when the elements live inside the editor canvas iframe:
 * the global `document` simply does not contain them.
 */
export function enhance( selector ) {
	// ❌ Global document — sees nothing inside the canvas iframe.
	const targets = document.querySelectorAll( selector );

	targets.forEach( ( target ) => {
		if ( target.dataset.iedEnhanced ) {
			return;
		}
		target.dataset.iedEnhanced = 'true';
		target.style.boxShadow = '0 0 0 4px #dba617';

		const badge = target.ownerDocument.createElement( 'p' );
		badge.textContent = '✨ enhanced by legacyLib';
		badge.style.background = '#dba617';
		badge.style.padding = '0.25rem 0.5rem';
		badge.style.margin = '0.5rem 0 0';
		target.appendChild( badge );
	} );

	return targets.length;
}
