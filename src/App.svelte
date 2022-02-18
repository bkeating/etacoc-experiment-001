<script>
	import { fly, fade } from 'svelte/transition';
	import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox';

  import Logo from './Logo.svelte';

  const { GeolocateControl, NavigationControl, ScaleControl } = controls;
  let mapComponent;
	let menuIsOpen = false;

  $: lng = -88.4051;
  $: lat = 42.7853;

  let easttroyCenter = [-88.4051, 42.7853];
  let ldsbbq = [42.79068004431915, -88.39012856713265];

  const handleGoToEastTroy = () => {
    // mapComponent.setCenter([lng,lat], 11);
    mapComponent?.flyTo({ center: [lng, lat], zoom: 16 });
  };

  // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
  function eventHandler(e) {
    const data = e.detail;
    console.log('e.detail', e.detail);
    // do something with `data`, it's the result returned from the mapbox event
  }

  // onMount(() => {
  // 	mapComponent.setCenter([lng,lat]);
  // 	mapComponent.setZoom(13);
  // });

	const handleOpenMenu = () => {
		menuIsOpen = !menuIsOpen;
	};
</script>

<div class="relative w-screen h-full">
	<div class="absolute bottom-0 left-0 z-50 w-full">
			<div class="py-3 mx-2 text-center transition bg-blue-500 rounded-tl-lg rounded-tr-lg shadow-2xl ${menuIsOpen ? 'h-64' : 'h-auto'}">
				<button on:click={handleOpenMenu} class="flex items-center justify-center w-12 h-12 p-1 m-0 mx-auto bg-white rounded-full shadow-xl">
					<Logo />
				</button>
				{#if menuIsOpen}
					<div in:fade out:fly={{ y: 60, duration: 400 }} class="px-3 py-3 text-left transition-all">
						<h3 class="mb-2 text-xs text-white uppercase opacity-50">Demos</h3>
						<button on:click={handleGoToEastTroy} class="px-6 py-2 text-sm text-white bg-blue-600 rounded ">Head to the Square</button>
						<button on:click={() => mapComponent?.flyTo({center:[ldsbbq[1],ldsbbq[0]], zoom: 15})} class="px-6 py-2 text-sm text-white bg-blue-600 rounded ">LD's BBQ</button>
					</div>
				{/if}
			</div>

	</div>

	<Map
		accessToken="pk.eyJ1IjoiZmxvd3Bva2UiLCJhIjoiY2t6cmZoNDhoMDBidTJxcGtwemZtbnBubSJ9.rZdMVSfrkFcTmaqFt7TW5A"
		bind:this={mapComponent}
		on:recentre={(e) => console.log(e.detail.center.lat, e.detail.center.lng)}
		options={{ scrollZoom: false }}
		center={easttroyCenter}
		zoom={13}
	>
		<Marker {lat} {lng} color="rgb(255,255,255)" label="some marker label" popupClassName="class-name" />
		<NavigationControl />
		<GeolocateControl options={{ some: 'control-option' }} on:eventname={eventHandler} />
		<ScaleControl />

		<Marker lat={easttroyCenter[0]} lng={easttroyCenter[1]} />

		<Marker lat={ldsbbq[0]} lng={ldsbbq[1]}>
			<div class="active" style="color:red; font-size: 12px;">LD's BBQ!</div>

			<div class="content" slot="popup">
				<img src="/ldsbbq.png" alt="ldsbbq" class="w-24" />
				<h3 class="mt-2 text-lg font-bold">LD's BBQ</h3>
				<p class="">2511 Main St, East Troy, WI 53120</p>
				<p class="mb-3"><a href="tel:+1-414-610-7675" class="text-lg text-blue-500">(414) 610-7675</a></p>
				<p class="mb-3">LD’s BBQ serves meats that are slow smoked over 100% Seasoned Oak wood. No corners are cut to get this food to tender and juicy.</p>
				<p><span class="font-bold">Service options:</span> Dine-in · Curbside pickup · No delivery</p>
				<p><span class="font-bold">Hours:</span> Closed ⋅ Opens 11AM</p>

			</div>
		</Marker>
	</Map>
</div>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

	html, body {
		@apply w-full h-full overflow-hidden;
	}
</style>
