<?php
/**
 * Plugin Name:       Iframed Editor Demos
 * Description:       Companion demo blocks for the WordPress 7.1 iframed post editor changes — broken and fixed versions of common patterns.
 * Requires at least: 6.9
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Ryan Welcher
 * Author URI:        https://ryanwelcher.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       iframed-editor-demos
 *
 * @package IframedEditorDemos
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register every block found in the build directory.
 */
function iframed_demos_register_blocks() {
	$block_json_files = glob( __DIR__ . '/build/*/block.json' );

	if ( empty( $block_json_files ) ) {
		return;
	}

	foreach ( $block_json_files as $block_json ) {
		register_block_type( dirname( $block_json ) );
	}
}
add_action( 'init', 'iframed_demos_register_blocks' );

/**
 * Enqueue the "iframe status" editor script.
 *
 * This is a standalone editor plugin (not a block) built via a custom webpack
 * entry point. It shows a persistent notice reporting whether the editor canvas
 * is currently iframed.
 */
function iframed_demos_enqueue_iframe_status() {
	$asset_file = __DIR__ . '/build/iframe-status/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'ied-iframe-status',
		plugins_url( 'build/iframe-status/index.js', __FILE__ ),
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'iframed_demos_enqueue_iframe_status' );

/**
 * DEMO: The "broken" way to style blocks in the editor.
 *
 * Styles enqueued via enqueue_block_editor_assets load in the ADMIN page,
 * not inside the editor canvas iframe. When the post editor is iframed
 * (WordPress 7.1 on block themes, Gutenberg 22.6+ everywhere), these styles
 * never reach the block. Use the editorStyle property in block.json instead.
 */
function iframed_demos_enqueue_broken_editor_styles() {
	wp_enqueue_style(
		'ied-broken-editor-style',
		plugins_url( 'assets/broken-editor-style.css', __FILE__ ),
		array(),
		'0.1.0'
	);
}
add_action( 'enqueue_block_editor_assets', 'iframed_demos_enqueue_broken_editor_styles' );
