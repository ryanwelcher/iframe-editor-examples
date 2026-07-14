/**
 * ❌ BROKEN in the iframed editor.
 *
 * A classic "close the dropdown when clicking outside" pattern, with the
 * listener attached to the global `document`. In the iframed editor,
 * clicks inside the canvas happen in the canvas document — they never
 * bubble to the admin document, so this listener never sees them.
 *
 * The weird part: clicking the admin sidebar still closes it. Clicking
 * another block in the canvas does not. Same code works perfectly in the
 * non-iframed editor, where the whole editor shares one document.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { BlockHeader } from '../lib/iframe-status';

const wrapperStyle = {
	border: '2px solid #cc1818',
	borderRadius: '4px',
	padding: '1rem',
};

const menuStyle = {
	border: '1px solid #757575',
	borderRadius: '4px',
	padding: '0.5rem 1rem',
	marginTop: '0.5rem',
	background: '#f0f0f0',
};

export default function Edit() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ isIframed, setIsIframed ] = useState( false );
	const elementRef = useRef();

	// Capture the block element for the outside-click test, and report
	// whether the block's document is the admin document.
	const ref = useRefEffect( ( element ) => {
		elementRef.current = element;
		setIsIframed( element.ownerDocument !== document );
		return () => {
			elementRef.current = null;
		};
	}, [] );

	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}

		const closeOnOutsideClick = ( event ) => {
			if (
				elementRef.current &&
				! elementRef.current.contains( event.target )
			) {
				setIsOpen( false );
			}
		};

		// ❌ `document` is the admin document. Canvas-document clicks never bubble here.
		document.addEventListener( 'click', closeOnOutsideClick );
		return () => document.removeEventListener( 'click', closeOnOutsideClick );
	}, [ isOpen ] );

	return (
		<div { ...useBlockProps( { ref, style: wrapperStyle } ) }>
			<BlockHeader isIframed={ isIframed }>
				{ __( '❌ Click Outside (Broken)', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				<button type="button" onClick={ () => setIsOpen( ! isOpen ) }>
					{ __( 'Toggle dropdown', 'iframed-editor-demos' ) }
				</button>
			</p>
			{ isOpen && (
				<div style={ menuStyle }>
					{ __(
						'Now click another block in the canvas… I stay open! (Clicking the admin sidebar closes me, though.)',
						'iframed-editor-demos'
					) }
				</div>
			) }
			<p>
				{ isIframed
					? __(
							'The listener is on the admin document, so clicks in the canvas document never reach it. That is the bug.',
							'iframed-editor-demos'
					  )
					: __(
							'The whole editor shares one document, so outside-click works here. It breaks once the canvas is iframed.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
