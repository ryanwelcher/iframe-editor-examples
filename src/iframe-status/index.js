/**
 * DEMO: Is the editor canvas iframed right now?
 *
 * Registers an editor plugin that shows a persistent, non-dismissible notice at
 * the top of the editor reporting whether the block editor canvas is currently
 * rendered inside an iframe. Because the iframe can be toggled at runtime (e.g.
 * inserting a legacy apiVersion 2 block de-iframes the editor in WP 7.0), the
 * status is re-evaluated whenever the editor DOM changes.
 *
 * The canvas iframe is identified by `iframe[name="editor-canvas"]`, the name
 * Gutenberg gives the editor canvas frame.
 */
import { registerPlugin } from '@wordpress/plugins';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const NOTICE_ID = 'iframed-demos/iframe-status';

/**
 * Whether the editor canvas is currently rendered inside an iframe.
 *
 * @return {boolean} True when the canvas iframe is present.
 */
function isCanvasIframed() {
	return !! document.querySelector( 'iframe[name="editor-canvas"]' );
}

function IframeStatusNotice() {
	const { createNotice, removeNotice } = useDispatch( noticesStore );
	const [ iframed, setIframed ] = useState( isCanvasIframed );

	// Re-check whenever the editor DOM mutates so the notice stays accurate if
	// the iframe is added or removed at runtime. querySelector is cheap and
	// React bails on identical state, so the observer stays inexpensive.
	useEffect( () => {
		const check = () => setIframed( isCanvasIframed() );
		check();

		const observer = new window.MutationObserver( check );
		observer.observe( document.body, {
			childList: true,
			subtree: true,
		} );

		return () => observer.disconnect();
	}, [] );

	// Mirror the current status into a persistent notice. Re-creating with the
	// same id replaces the previous one, so the message updates in place.
	useEffect( () => {
		createNotice(
			iframed ? 'success' : 'warning',
			iframed
				? __(
						'Editor canvas IS iframed.',
						'iframed-editor-demos'
				  )
				: __(
						'Editor canvas is NOT iframed.',
						'iframed-editor-demos'
				  ),
			{
				id: NOTICE_ID,
				isDismissible: false,
			}
		);

		return () => removeNotice( NOTICE_ID );
	}, [ iframed, createNotice, removeNotice ] );

	return null;
}

registerPlugin( 'iframed-demos-iframe-status', {
	render: IframeStatusNotice,
} );
