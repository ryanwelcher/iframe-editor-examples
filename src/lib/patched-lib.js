/**
 * "legacyLib", patched for iframe compatibility.
 *
 * This is exactly what you would produce with `patch-package` against a
 * real dependency: the API now accepts a root element and resolves the
 * correct document from it via `ownerDocument` instead of reaching for
 * the global `document`.
 *
 * The diff against legacy-lib.js is two lines — that's typical of these
 * patches. See the block migration guide for a real-world example
 * patching @panzoom/panzoom.
 */
export function enhance( selector, root ) {
	// ✅ Resolve the document from the element we were handed.
	const doc = root ? root.ownerDocument : document;
	const targets = doc.querySelectorAll( selector );

	targets.forEach( ( target ) => {
		if ( target.dataset.iedEnhanced ) {
			return;
		}
		target.dataset.iedEnhanced = 'true';
		target.style.boxShadow = '0 0 0 4px #00a32a';

		const badge = target.ownerDocument.createElement( 'p' );
		badge.textContent = '✨ enhanced by legacyLib (patched)';
		badge.style.background = '#00a32a';
		badge.style.color = '#fff';
		badge.style.padding = '0.25rem 0.5rem';
		badge.style.margin = '0.5rem 0 0';
		target.appendChild( badge );
	} );

	return targets.length;
}
