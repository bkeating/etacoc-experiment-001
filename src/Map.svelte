<script>
	import { onMount } from 'svelte';
	// Named export 'Loader' not found. The requested module '@googlemaps/js-api-loader'
	// is a CommonJS module, which may not support all module.exports as named
	// exports. CommonJS modules can always be imported via the default export:
	import * as pkg from '@googlemaps/js-api-loader';
	const { Loader } = pkg;

	export let lat = 39.449844;
	export let lng = -119.7508379;
	export let zoom = 9

	let map; // This becomes the Google Map

	// Google Maps doesn't like loading and unloading the map into the same named
	// element too quickly. We discovered that giving each map instance a unique
	// ID kees things running smoothly.
	let randomMapDivId = (Math.random() + 1).toString(36).substring(7);

	onMount(() => {
		const loader = new Loader({
			apiKey: 'AIzaSyDm78XdfTy_w9X35fmYliB6_1dswiznkFM',
			version: 'weekly',
			libraries: ['places']
		});

		loader
			.load()
			.then((google) => {
				map = new google.maps.Map(document.getElementById(`map-${randomMapDivId}`), {
					zoom: zoom,
					center: { lat, lng },
					mapTypeId: google.maps.MapTypeId.HYBRID
				});

				// Coverage Bounds. This is the green layer overlay.
				let image = '/assets/map-coverage-layer.png';
				const bounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng( 12.8716156139361,-156.8791),
                    new google.maps.LatLng( 48.6873243860639,-115.1914)
				);

				class USGSOverlay extends google.maps.GroundOverlay {
					constructor(bounds, image) {
						super();
						this.bounds = bounds;
						this.image = image;
					}
					onAdd() {
						this.div = document.createElement('div');
						this.div.style = { borderStyle: 'none', borderWidth: '0px', position: 'absolute' };

						const img = document.createElement('img');
						img.src = this.image;
						img.style = { width: '100%', height: '100%', position: 'absolute' };
						this.div.appendChild(img);
						const panes = this.getPanes();
						panes.overlayLayer.appendChild(this.div);
					}
					draw() {
						const overlayProjection = this.getProjection();
						const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
						const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
						if (this.div) {
							this.div.style = {
								left: `${sw.x}px`,
								top: `${ne.y}px`,
								width: `${ne.x - sw.x}px`,
								height: `${sw.y - ne.y}px`
							};
						}
					}
				}
				const overlay = new google.maps.GroundOverlay(image, bounds);
				overlay.setMap(map);
			})
			.catch((e) => console.error(e));
	});
</script>

<div id={`map-${randomMapDivId}`} class="map" />

<style>
	.map {
		min-height: 300px;
		@apply w-full rounded-xl h-full shadow-xl;
	}
</style>
