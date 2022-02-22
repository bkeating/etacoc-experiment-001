<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox';
  import GiFoodTruck from 'svelte-icons/gi/GiFoodTruck.svelte';
  import FaBeer from 'svelte-icons/fa/FaBeer.svelte';
  import FaUtensils from 'svelte-icons/fa/FaUtensils.svelte';
  import IoIosMoon from 'svelte-icons/io/IoIosMoon.svelte';
  import IoIosSunny from 'svelte-icons/io/IoIosSunny.svelte';
  import IoIosCar from 'svelte-icons/io/IoIosCar.svelte';
  import FaMapMarkedAlt from 'svelte-icons/fa/FaMapMarkedAlt.svelte';

  import Logo from './Logo.svelte';

  const { GeolocateControl, NavigationControl, ScaleControl } = controls;
  let mapComponent;
  let menuIsOpen = false;
  let isDarkMode = false;
  let showSplash = true;
  let apiKey = 'pk.eyJ1IjoiZmxvd3Bva2UiLCJhIjoiY2t6cmZoNDhoMDBidTJxcGtwemZtbnBubSJ9.rZdMVSfrkFcTmaqFt7TW5A';

  $: mapStyle = 'mapbox://styles/mapbox/outdoors-v11';
  $: lng = -88.4051;
  $: lat = 42.7853;
  $: pitch = 0;
  $: bearing = 0;

  let easttroyCenter = [-88.4051, 42.7853];
  let ldsbbq = [42.79068004431915, -88.39012856713265];

  const resturants = [
    { name: '2894 on Main', lat: 42.786040458812955, lng: -88.40564587614594 },
    { name: 'East Troy Brewery', lat: 42.785079842503634, lng: -88.40586045286086 },
    { name: "Cousin's Subs", lat: 42.78980404142664, lng: -88.39114048982536 },
    { name: 'Sauced Pizzaria', lat: 42.78565283356933, lng: -88.4054504583307 },
    { name: 'East Troy House', lat: 42.78535886751739, lng: -88.40614946142921 },
    { name: "Gus's Drive-in", lng: 42.78411839195984, lat: -88.41752729206067 },
  ];

  const handleGoToEastTroy = () => {
    // mapComponent.setCenter([lng,lat], 11);
    mapComponent?.flyTo({ center: [lng, lat], zoom: 16 });
  };

  // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
  function eventHandler(e) {
    const data = e.detail;
    // console.log('e.detail', e.detail);
    // do something with `data`, it's the result returned from the mapbox event
  }

  onMount(() => {

    setTimeout(() => {
      mapComponent?.flyTo({ center: [lng, lat], zoom: 14, bearing: 0, pitch: 60, speed: 0.3, curve: 1 });
    }, 2000);

    const m = mapComponent.getMap();

    // m.on('load', () => {
    //   console.log('LOADED!')
    // });

    let map = mapComponent?.getMap();
    const ne = [42.84103774367695, -88.49734216528779];
    const sw = [42.70040771258098, -88.2800188683067];
    map?.getMap().setMaxBounds([sw, ne]);

    setTimeout(() => {
      rotateCamera(0);
    }, 4000);
  });

  const handleOpenMenu = () => {
    menuIsOpen = !menuIsOpen;
    showSplash = false;
  };
  const handleNightLife = () => {
    mapComponent?.flyTo({ center: easttroyCenter, zoom: 15, pitch: 0, bearing: 0, speed: 2, curve: 1 }); // starting point
    handleAppearanceMode(true); // make it dark
  };

  function rotateCamera(timestamp) {
    let m = mapComponent?.getMap();
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    m.rotateTo((timestamp / 600) % 360, { essential: true });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
  }

  const handleCruiseNight = () => {
    let currentStep = 0;
    let tourPoints = [
      {
        label: "Gus's Drive-in",
        center: [42.783958493217334, -88.41788905454426].reverse(),
        zoom: 18,
        bearing: 80,
        pitch: 60,
        rotate: false,
        duration: 0,
      },
      {
        label: 'East Troy Airport',
        center: [42.79722849966591, -88.37596611461682].reverse(),
        zoom: 16,
        bearing: 0,
        pitch: 0,
        rotate: true,
        duration: 60000,
      },
      {
        label: 'Village Square Park',
        center: [42.78477231354394, -88.40545403606905].reverse(),
        zoom: 16,
        bearing: 0,
        pitch: 0,
        rotate: true,
        duration: 10000,
      },
    ];
    // mapComponent?.flyTo({ center: cruiseNightStart, zoom: 18, pitch: 60, bearing: 80, speed: 0.3, curve: 1 });
    let m = mapComponent?.getMap();
    m.setStyle('mapbox://styles/mapbox/satellite-v9');

    tourPoints.map(({ label, center, zoom, bearing, pitch, rotate, duration }) => {
      setTimeout(() => {
        mapComponent?.flyTo({
          center: center,
          zoom: zoom,
          pitch: pitch,
          bearing: bearing,
          speed: 0.3,
          curve: 1,
          essential: true,
        });

        // .then(() => {
        // 	if (rotate) {
        // 		rotate(0)
        // 	}
        // });
        currentFocusName = label;
      }, duration);
    });

    // m.setFog({
    // 	'range': [-1, 1.5],
    // 	'color': 'white',
    // 	'horizon-blend': 0.1
    // });
    // rotateCamera(0);
  };

  const handleAppearanceMode = (mode) => {
    let m = mapComponent?.getMap();
    let style;
    if (mode === true) {
      isDarkMode = mode;
    } else {
      isDarkMode = !isDarkMode;
    }
    isDarkMode ? (style = 'mapbox://styles/mapbox/dark-v10') : (style = 'mapbox://styles/mapbox/outdoors-v11');
    m.setStyle(style);
  };

  const handleRecenter = (e) => {
    // (e) => console.log(e.detail.center.lat, e.detail.center.lng

  };

  // update `money` with `productionPerTick` and set a timeout to call itself after `tickSpeed` ms
</script>

<div class="relative w-screen h-full select-none">
  {#if showSplash}
    <div class="absolute top-0 left-0 z-50 w-screen h-screen bg-white opacity-70" transition:fade>
      <div class="flex items-center justify-center w-full h-full">
        <img src="/east-troy-splash.png" alt="East Troy Maps" class="relative -top-40" style="max-width: 73%; animation: fadein 3s;" />
      </div>
    </div>
  {/if}

  <div class="absolute transition-all duration-300 left-0 z-50 w-full {menuIsOpen ? 'bottom-0' : 'bottom-4'}">
    <div class="w-full max-w-3xl mx-auto text-center">
      <div
        class="mx-2 text-center relative transition-all duration-300 ease-in-out overflow-hidden bg-blue-500 shadow-2xl rounded-tl-2xl rounded-tr-2xl {menuIsOpen
          ? 'rounded-br-none rounded-bl-none'
          : 'rounded-bl-2xl rounded-br-2xl'}"
        style="height: {menuIsOpen ? '300px' : '55px'}"
      >
        <button
          on:click={handleOpenMenu}
          class="relative flex items-center justify-center w-10 h-10 m-0 mx-auto mb-3 bg-transparent top-2"
        >
          <Logo />
        </button>

        <div class="absolute top-0 left-2 h-[55px] p-2  flex items-center" />

        <div class="absolute top-0 right-2 h-[55px] p-2  flex items-center">
          <button
            class="flex items-center mr-3 text-xs text-white"
            title="night light"
            on:click={handleAppearanceMode}
          >
            <div class="w-6 h-6 ml-1 text-white">
              {#if isDarkMode}
                <IoIosMoon />
              {:else}
                <IoIosSunny />
              {/if}
            </div>
          </button>
        </div>

        {#if menuIsOpen}
          <div
            in:fly={{ y: 60, duration: 500, delay: 100 }}
            out:fly={{ y: 60, duration: 200 }}
            class="w-full h-full px-3 py-3 pb-32 overflow-x-hidden overflow-y-scroll text-left"
          >
            <div class="p-3 m-3 mb-6 text-xs text-white border border-blue-100 rounded">
              <p>
                This is an innovation experiment to interact and explore the East Troy area from a geographical
                perspective. There will be layers of different meta to show/hide as well as community
                curated content. Geoloco information for East Troy, by East Troy.
              </p>
            </div>

            <h3 class="mb-2 text-xs text-white uppercase opacity-50">Demos</h3>
            <button on:click={handleGoToEastTroy} class="px-6 py-2 text-sm text-white bg-blue-600 rounded "
              >Village Square Park</button
            >
            <button
              on:click={() => mapComponent?.flyTo({ center: [ldsbbq[1], ldsbbq[0]], zoom: 16 })}
              class="px-6 py-2 text-sm text-white bg-blue-600 rounded ">LD's BBQ</button
            >


<div class="mt-6 space-y-3">

                  <button
                    class="flex items-center mr-3 text-xs text-white"
                    title="night light"
                    on:click={handleNightLife}
                  >
                    <div class="w-6 h-6 mr-1 text-white">
                      <FaBeer />
                    </div>
                    <span>Night Life</span>
                  </button>

                  <button
                    class="flex items-center mr-3 text-xs text-white"
                    title="night light"
                    on:click={handleCruiseNight}
                  >
                    <div class="w-6 h-6 mr-1 text-white">
                      <IoIosCar />
                    </div>

                    <span>Cruise Night</span>
                  </button>

                  <button
                    class="flex items-center mr-3 text-xs text-white"
                    title="night light"
                    on:click={handleCruiseNight}
                  >
                    <div class="w-6 h-6 mr-1 text-white">
                      <FaMapMarkedAlt />
                    </div>

                    <span>Take a Tour</span>
                  </button>
</div>



            <!-- <h3 class="mt-3 mb-2 text-xs text-white uppercase opacity-50">Restaurants</h3> -->

            <!-- <ul class="space-y-3 text-white">
              <li><a href="/">2894 On Main</a></li>
              <li><a href="/">LD's BBQ</a></li>
            </ul> -->

            <!-- <div class="flex items-center my-3 text-white" on:click={() => (leftMenuIsOpen = !leftMenuIsOpen)}>
              <div class="w-6 mr-1 text-white">
                <GiFoodTruck />
              </div>
              <span>Food Truck Fest 2022</span>
            </div> -->
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- {#if leftMenuIsOpen}
    <div
      in:fly={{ x: -180, duration: 300 }}
      out:fly={{ x: -180, duration: 300 }}
      class="absolute top-0 left-0 z-40 w-64 px-6 text-left bg-gray-800 h-1/2"
    >
      <h4 class="mt-3 mb-6 text-white">Food Truck Fest 2022</h4>

			<h5 class="mb-2 text-lg text-white">My Beer Check List</h5>
			<ul class="space-y-1 text-white">
				<li><input type="checkbox" /> <span>Elephant</span></li>
				<li><input type="checkbox" /> <span>Hazy IPA</span></li>
				<li><input type="checkbox" /> <span>Aloha Double IPA</span></li>
				<li><input type="checkbox" /> <span>Now That's Local Stout</span></li>
			</ul>
    </div>
  {/if} -->

  <Map
    accessToken={apiKey}
    bind:this={mapComponent}
    on:recentre={handleRecenter}
    options={{ scrollZoom: false, pitch: pitch, bearing: bearing }}
    center={easttroyCenter}
    zoom={13}
    style={mapStyle}
  >
    <Marker {lat} {lng} color="rgb(255,255,255)" label="some marker label" popupClassName="class-name" />
    <NavigationControl options={{ visualizePitch: true }} />
    <GeolocateControl options={{ some: 'control-option' }} on:eventname={eventHandler} />
    <ScaleControl />

    {#each resturants as { name, lat, lng }}
      <Marker {lat} {lng}>
        <div class="w-4 h-4 text-orange-500 active" style="">
          <FaUtensils />
        </div>

        <div class="content" slot="popup">
          <h3 class="mt-2 text-lg font-bold">{name}</h3>
        </div>
      </Marker>
    {/each}

    <Marker lat={ldsbbq[0]} lng={ldsbbq[1]}>
      <div class="w-4 h-4 text-orange-500 active" style="">
        <FaUtensils />
      </div>

      <div class="content" slot="popup">
        <img
          src="https://easttroy.org/media/daguerre/2017/03/17/2699ee8b0fe657930de3.jpeg"
          alt="ldsbbq"
          class="w-24"
        />
        <h3 class="mt-2 text-lg font-bold">LD's BBQ</h3>
        <p class="">2511 Main St, East Troy, WI 53120</p>
        <p class="mb-3"><a href="tel:+1-414-610-7675" class="text-lg text-blue-500">(414) 610-7675</a></p>
        <p class="mb-3">
          LD’s BBQ serves meats that are slow smoked over 100% Seasoned Oak wood. No corners are cut to get this food
          to tender and juicy.
        </p>
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

  html,
  body {
    @apply w-full h-full overflow-hidden;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
