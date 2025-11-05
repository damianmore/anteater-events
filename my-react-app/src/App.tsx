import { useRef, useEffect, useState } from 'react'
import FloatingActionButtons from './components/FloatingActionButton'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'
import addGeoJSONMarkers from './components/marker';
import CreateDetails, { type CreateFormData } from './components/create_details'
import createMarker from './utils/createMarker'
import waitForMapClick from './utils/waitForMapClick'

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

function App() {
  //mapRef hold the map instance
  const mapRef = useRef<mapboxgl.Map | null>(null);
  //mapContainerRef hold the map container div
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lng: number; lat: number } | null>(null)

  // choose location first, then open the modal
  const handleCreate = () => {
    const map = mapRef.current
    if (!map) {
      //opening modal without location if map not ready
      setSelectedLocation(null)
      setIsCreateOpen(true)
      return
    }
    // wait for a single map click
    waitForMapClick(map).then(({ lng, lat }) => {
      setSelectedLocation({ lng, lat })
      setIsCreateOpen(true)
    })
  }

  // called when the modal form is submitted
  const handleCreateSubmit = (data: CreateFormData) => {
    setIsCreateOpen(false)
    const loc = selectedLocation
    if (!loc) {
      console.warn('No location selected — cannot place marker')
      return
    }

    const map = mapRef.current
    if (!map) return

    // delegate marker creation to utility
    createMarker(map, loc.lng, loc.lat, data)

    // clear selected location
    setSelectedLocation(null)
  }
  
  //Create map when component mounts
  useEffect(() => {
    if (MAPBOX_KEY) {
      mapboxgl.accessToken = MAPBOX_KEY;
    } else {
      console.warn('Token not found! Map not loaded correctly.');
    }
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-117.841019, 33.645198],
      zoom: 16
    });

    // add demo markers from public/location.geojson
    let removeMarkers: (() => void) | undefined
    if (mapRef.current) {
      addGeoJSONMarkers(mapRef.current).then(rem => { removeMarkers = rem }).catch(err => console.warn(err))
    }

    return () => {
      if (removeMarkers) removeMarkers()
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, [])
    return (
      <>
        <div id='map-container' ref={mapContainerRef}>
          <FloatingActionButtons onCreate={handleCreate}></FloatingActionButtons>
        </div>
        <CreateDetails open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreateSubmit} />
      </>
    )
}

export default App