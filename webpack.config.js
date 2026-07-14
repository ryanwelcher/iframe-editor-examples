/**
 * Custom webpack config.
 *
 * Extends the default @wordpress/scripts config to add a standalone entry point
 * for the "iframe status" editor script. It is NOT a block — it registers an
 * editor plugin that shows a persistent notice — so it lives outside the
 * block.json discovery the default config relies on. Everything else (the demo
 * blocks) keeps building exactly as before.
 */
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry() {
		// The default `entry` is a function that globs the src directory for
		// block.json scripts; keep those and add our standalone entry.
		const blockEntries =
			typeof defaultConfig.entry === 'function'
				? defaultConfig.entry()
				: defaultConfig.entry;

		return {
			...blockEntries,
			'iframe-status/index': path.resolve(
				process.cwd(),
				'src',
				'iframe-status',
				'index.js'
			),
		};
	},
};
