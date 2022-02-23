<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Map, controls } from '@beyonk/svelte-mapbox';
  import GiFoodTruck from 'svelte-icons/gi/GiFoodTruck.svelte';
  // import FaBeer from 'svelte-icons/fa/FaBeer.svelte';
  // import FaUtensils from 'svelte-icons/fa/FaUtensils.svelte';
  import IoIosMoon from 'svelte-icons/io/IoIosMoon.svelte';
  import IoIosSunny from 'svelte-icons/io/IoIosSunny.svelte';
  import IoIosCar from 'svelte-icons/io/IoIosCar.svelte';
  import FaBicycle from 'svelte-icons/fa/FaBicycle.svelte';
  import MdRefresh from 'svelte-icons/md/MdRefresh.svelte';
  // import FaMapMarkedAlt from 'svelte-icons/fa/FaMapMarkedAlt.svelte';

  import SplashType from './SplashType.svelte';
  import Logo from './Logo.svelte';

  import { appearance, showDock, showDrawer, showSplash, currentDrawerSlug, mapStyle, isRotating } from './store';

  const { GeolocateControl, NavigationControl, ScaleControl } = controls;
  let mapComponent;
  let apiKey = 'pk.eyJ1IjoiZmxvd3Bva2UiLCJhIjoiY2t6cmZoNDhoMDBidTJxcGtwemZtbnBubSJ9.rZdMVSfrkFcTmaqFt7TW5A';
  let showLogo = false;
  let introBase = 3000;
  let splashTypeColor = 'white';

  $: lng = -88.4051;
  $: lat = 42.7853;
  $: pitch = 0;
  $: bearing = 0;

  let mainMenu = [
    { label: 'Food', slug: 'food' },
    { label: 'Shopping', slug: 'shopping' },
    { label: 'Nightlife', slug: 'nightlife' },
    { label: 'Toybox', slug: 'toybox' },
  ];

  // Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
  function eventHandler(e) {
    const data = e.detail;
    // console.log('e.detail', e.detail);
    // do something with `data`, it's the result returned from the mapbox event
  }

  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
  const easeInCubic = (t) => t * t * t;
  const easeInQuad = (t) => t * t;
  const linear = (t) => t;

  const easeInOutCirc = (t) => {
    return t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
  };

  onMount(() => {
    //   let map = mapComponent?.getMap();
    //   const ne = [42.84103774367695, -88.49734216528779];
    //   const sw = [42.70040771258098, -88.2800188683067];
    //   map?.getMap().setMaxBounds([sw.reverse(), ne.reverse()]);

    // This is for returning users whom turned on dark mode in a previous session.
    if ($appearance === 'dark') {
      document.documentElement.classList.add('dark');
    };

    // Swoop down on the sqaure, fade in the logo and reveal the Dock.
    setTimeout(() => {
      mapComponent?.flyTo({ center: [lng, lat], zoom: 15, bearing: 0, pitch: 60, speed: 0.3, curve: 0.4 });
    }, introBase);
    setTimeout(() => (showLogo = true), introBase + 5500);
    setTimeout(() => showDock.set(true), introBase + 15000);


    setTimeout(() => {
      isRotating.set(true)
      rotateCamera(0);
    }, introBase + 11000);

      // setTimeout(() => {
      //   setTimeout(() => {
      //     splashTypeColor = '#000';
      //   }, 500);
      // }, introBase + 30000);
  });

  const handleOpenMenu = () => {
    showDrawer.update((n) => !n);
  };

  const handleMainMenuClick = (label) => {
    showSplash.set(false);
    currentDrawerSlug.update((n) => (n === label ? '' : label));
  };

  const handleNightLife = () => {
    setMapStyle('mapbox://styles/mapbox/dark-v10');
    appearance.set('dark');
    currentDrawerSlug.set('nightlife');
    mapComponent?.flyTo({ center: [-88.4051, 42.7853], zoom: 14, pitch: 30, bearing: 0, speed: 0.5, curve: 1.2 }); // starting point
  };

  const handleToybox = () => {
    currentDrawerSlug.update((n) => (n === 'toybox' ? '' : 'toybox'));
  };

  $: rotateCamera = (timestamp) => {
    let m = mapComponent?.getMap();
    if ($isRotating) {
      m.rotateTo((timestamp / 700) % 360);
      requestAnimationFrame(rotateCamera, { easing: easeInOutCirc });
    };
  };

  const handleCruiseNight = () => {
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
        label: 'Village Square Park',
        center: [42.78477231354394, -88.40545403606905].reverse(),
        zoom: 16,
        bearing: 0,
        pitch: 0,
        rotate: true,
        duration: 10000,
      },
      {
        label: 'East Troy Airport',
        center: [42.79722849966591, -88.37596611461682].reverse(),
        zoom: 16,
        bearing: 0,
        pitch: 0,
        rotate: true,
        duration: 160000,
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
    let s;
    let m = mapComponent?.getMap();
    if (mode === 'dark') {
      appearance.set('dark');
      s = 'mapbox://styles/mapbox/dark-v10';
      document.documentElement.classList.add('dark');
    } else {
      appearance.set('light');
      s = 'mapbox://styles/mapbox/outdoors-v11';
      document.documentElement.classList.remove('dark');
    }
    m.setStyle(s);
  };

  const setMapStyle = (mapBoxUri) => {
    let map = mapComponent?.getMap();
    map.setStyle(mapBoxUri);
  };

  const handleRecenter = (e) => {
    // (e) => console.log(e.detail.center.lat, e.detail.center.lng
  };

  // update `money` with `productionPerTick` and set a timeout to call itself after `tickSpeed` ms
</script>

<div class="relative w-screen h-full select-none">
  {#if $showSplash}
    <div
      class="absolute top-0 left-0 z-50 w-screen h-screen bg-[rgba(0,0,0,0.1)]"
      out:fade|local={{ duration: 1000, easing: easeOutQuint }}
    >
      {#if showLogo}
        <div
          class="flex items-center justify-center w-full h-full"
          in:fly|local={{ y: -80, duration: 3000 }}
          out:fly={{ y: 10, duration: 2000 }}
        >
          <div class="mx-auto" style="width: 100%; max-width: 76%; min-height: 400px;">
            <div class="relative mx-auto" style="width: 100%; min-width: 200px; max-width: 500px; animation: fadein 2s; top: -15rem;">
              <SplashType fillColor={splashTypeColor} />
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}

  {#if $showDock}
    <div
      class="absolute transition-all duration-300 ease-in-out left-0 z-50 w-full {$showDrawer
        ? 'bottom-0'
        : 'bottom-4'}"
      in:fly={{ y: 80, duration: 900 }}
      out:fly={{ y: 80, duration: 800 }}
    >
      <div class="w-full max-w-3xl mx-auto text-center">
        <div
          class="mx-2 text-center relative transition-all duration-500 ease-in-out overflow-hidden bg-blue-500 dark:bg-gray-800 rounded-tl-2xl rounded-tr-2xl {$showDrawer
            ? 'rounded-br-none rounded-bl-none shadow-2xl'
            : 'rounded-bl-2xl rounded-br-2xl shadow-xl'}"
          style="height: {$showDrawer ? '300px' : '55px'}"
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
                title="Orbit"
                on:click={() => {isRotating.update(n => n = !$isRotating); rotateCamera(0); }}
                in:fly={{ x: 80, duration: 300 }}
                out:fly={{ y: 80, duration: 300 }}
              >
                <div class="w-6 h-6 ml-1">
                  <div class="text-blue-300 dark:text-gray-500 {$isRotating ? 'rotate-spin' : ''}">
                    <MdRefresh />
                  </div>
                </div>
              </button>
            {#if !$showSplash}
              <button
                class="flex items-center mr-3 text-xs text-white"
                title="night light"
                on:click={handleAppearanceMode($appearance === 'dark' ? 'light' : 'dark')}
                in:fly={{ x: 80, duration: 300 }}
                out:fly={{ y: 80, duration: 300 }}
              >
                <div class="w-6 h-6 ml-1 text-white">
                  {#if $appearance === 'dark'}
                    <IoIosMoon />
                  {:else}
                    <IoIosSunny />
                  {/if}
                </div>
              </button>
            {/if}
          </div>

          {#if $showDrawer}
            <div
              in:fly={{ y: 60, duration: 500, delay: 100 }}
              out:fly|local={{ y: 60, duration: 200 }}
              class="w-full h-full px-3 py-3 pb-32 overflow-x-hidden overflow-y-scroll text-left"
            >
              <div class="transition-all overflow-hidden {$currentDrawerSlug === '' ? 'h-[115px]' : 'h-0'}">
                <div
                  class="p-3 m-1 text-sm text-blue-100 border border-blue-400 rounded dark:text-gray-500 dark:border-gray-700 transition-color"
                >
                  <p>
                    Welcome to East Troy Maps! This is an innovation experiment in exploring the East Troy area through
                    an interactive map. There will be layers of different meta to show/hide as well as the ability to
                    contribute your own content. This is a work in progress.
                  </p>
                </div>
              </div>

              <div class="sticky top-0 z-50 flex items-center flex-auto w-full pb-2 mt-3 transition-all duration-500 bg-blue-500 justify-items-stretch dark:bg-gray-800">
                {#each mainMenu as { label, slug }}
                  <button
                    class="mainmenu {$currentDrawerSlug === slug ? 'active' : 'inactive'}"
                    on:mousedown={() => handleMainMenuClick(slug)}
                  >
                    {label}
                  </button>
                {/each}
              </div>

              {#if $currentDrawerSlug === 'shopping'}
                <div class="px-4 mt-3" in:fly={{ x: 80, duration: 300 }} out:fly={{ x: 80, duration: 300 }}>

                  <h2 class="text-3xl text-white">Shopping</h2>
                  <p class="mt-2 mb-4 text-sm text-white opacity-80 dark:text-gray-400">
                    Do business with the finest local businesses.
                  </p>

                </div>
              {/if}

              {#if $currentDrawerSlug === 'nightlife'}
                <div class="px-4 mt-3" in:fly={{ x: 80, duration: 300 }} out:fly={{ x: 80, duration: 300 }}>

                  <h2 class="text-3xl text-white">Nightlife</h2>
                  <p class="mt-2 mb-4 text-sm text-white opacity-80 dark:text-gray-400">
                    Bars, clubs, pubs, special events, and more.
                  </p>

                </div>
              {/if}

              {#if $currentDrawerSlug === 'toybox'}
                <div class="px-4 mt-3" in:fly={{ x: 80, duration: 300 }} out:fly={{ x: 80, duration: 300 }}>

                  <h2 class="text-3xl text-white">Toybox 🎉</h2>
                  <p class="mt-2 mb-4 text-sm text-white opacity-80 dark:text-gray-400">
                    Random ideas, experiments and layers to play with.
                  </p>

                  <div class="flex items-center justify-items-stretch">
                    <button
                      class="flex items-center px-6 py-3 mr-3 text-white border border-blue-400 rounded dark:border-gray-600"
                      title="night light"
                      on:click={handleCruiseNight}
                    >
                      <div class="w-6 h-6 mr-1 text-white">
                        <IoIosCar />
                      </div>
                      <span>Cruise Night</span>
                    </button>

                    <button
                      class="flex items-center px-6 py-3 mr-3 text-white border border-blue-400 rounded dark:border-gray-600"
                      title="night light"
                    >
                      <div class="w-6 h-6 mr-1 text-white">
                        <GiFoodTruck />
                      </div>
                      <span>Food Truck Fest</span>
                    </button>

                    <button
                      class="flex items-center px-6 py-3 mr-3 text-white border border-blue-400 rounded dark:border-gray-600"
                      title="night light"
                    >
                      <div class="w-6 h-6 mr-1 text-white">
                        <FaBicycle />
                      </div>
                      <span>Bike Race</span>
                    </button>
                  </div>
                </div>
              {/if}

            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <Map
    accessToken={apiKey}
    bind:this={mapComponent}
    on:recentre={handleRecenter}
    on:load={() => console.log('map loaded')}
    options={{ scrollZoom: false, pitch: pitch, bearing: bearing }}
    center={[-88.4051, 42.7853]}
    zoom={13}
    style={$mapStyle}
  >
    {#if !$showSplash}
      <NavigationControl options={{ visualizePitch: true }} />
      <GeolocateControl options={{ some: 'control-option' }} on:eventname={eventHandler} />
      <ScaleControl />
    {/if}
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

  :global(.mapboxgl-map) {
    height: 100%;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  button.mainmenu {
    @apply font-semibold w-1/4 py-3 mx-1 text-sm transition-all rounded md:text-base md:px-9;
  }
  button.mainmenu.active {
    @apply bg-white text-gray-800 dark:bg-blue-500 dark:text-white;
  }
  button.mainmenu.inactive {
    @apply bg-blue-600 text-white dark:bg-gray-700;
  }

  .rotate-spin { animation: spin 4s linear infinite; }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
