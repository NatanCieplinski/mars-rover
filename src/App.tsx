import { useEffect, useRef, useState } from 'react'

const toRadians = (degrees: number) => degrees * (Math.PI / 180)
const gridSize = 600

// Adjust y-coordinate using Mercator projection
const mercatorProjection = (latitude: number) => {
  const clampedLatitude = Math.max(Math.min(latitude, 89.9), -89.9)
  return Math.log(Math.tan(Math.PI / 4 + toRadians(clampedLatitude) / 2))
}

function App() {
  const [roverPosition, setRoverPosition] = useState({
    lat: 0,
    lon: 0,
    orientation: 'N',
  })
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current as HTMLCanvasElement

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    ctx.clearRect(0, 0, gridSize, gridSize) // Clear existing grid

    // Calculate canvas coordinates
    const x = ((roverPosition.lon + 180) / 360) * gridSize
    const y =
      (1 -
        (mercatorProjection(roverPosition.lat) - mercatorProjection(-90)) /
          (mercatorProjection(90) - mercatorProjection(-90))) *
      gridSize

    // Draw the rover
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()

    // Draw grid lines for latitude adjusted for Mercator projection
    const numberOfLines = 10
    for (let i = 0; i <= numberOfLines; i++) {
      const lat = 90 - (i * 180) / numberOfLines // From +90 to -90 degrees
      const mercatorY =
        (1 -
          (mercatorProjection(lat) - mercatorProjection(-90)) /
            (mercatorProjection(90) - mercatorProjection(-90))) *
        gridSize
      ctx.beginPath()
      ctx.moveTo(0, mercatorY)
      ctx.lineTo(gridSize, mercatorY)
      ctx.stroke()
    }

    // Draw grid lines for longitude
    for (let i = 0; i <= numberOfLines; i++) {
      const lineX = (i * gridSize) / numberOfLines
      ctx.beginPath()
      ctx.moveTo(lineX, 0)
      ctx.lineTo(lineX, gridSize)
      ctx.stroke()
    }
  }, [roverPosition])

  // Wrap latitude within the poles and longitude globally
  const wrapCoordinates = (latitude: number, longitude: number) => {
    let wrappedLat = latitude
    let wrappedLon = longitude

    // Wrap longitude from -180 to 180
    if (wrappedLon > 180) {
      wrappedLon = -360 + wrappedLon
    } else if (wrappedLon < -180) {
      wrappedLon = 360 + wrappedLon
    }

    // Restrict latitude to stay between -90 and +90, reflect at poles
    if (wrappedLat > 90) {
      wrappedLat = -180 + wrappedLat
    } else if (wrappedLat < -90) {
      wrappedLat = 180 + wrappedLat
    }

    return { lat: wrappedLat, lon: wrappedLon }
  }

  const move = (forward = true) => {
    const moveStep = 10 // Degrees to move at a time
    // eslint-disable-next-line prefer-const
    let { lat, lon, orientation } = roverPosition

    if (orientation === 'N') {
      lat += forward ? moveStep : -moveStep
    } else if (orientation === 'S') {
      lat += forward ? -moveStep : moveStep
    } else if (orientation === 'E') {
      lon += forward ? moveStep : -moveStep
    } else if (orientation === 'W') {
      lon += forward ? -moveStep : moveStep
    }

    // Apply wrapping
    const wrappedCoordinates = wrapCoordinates(lat, lon)
    setRoverPosition({ ...roverPosition, ...wrappedCoordinates })
  }

  const rotate = (left = true) => {
    const orientations = ['N', 'E', 'S', 'W']
    const currentIndex = orientations.indexOf(roverPosition.orientation)
    const newOrientationIndex = left
      ? (currentIndex + 3) % 4
      : (currentIndex + 1) % 4
    setRoverPosition({
      ...roverPosition,
      orientation: orientations[newOrientationIndex],
    })
  }

  return (
    <div>
      <h1>Mars Rover Simulator</h1>
      <canvas
        ref={canvasRef}
        width={gridSize}
        height={gridSize}
        style={{ border: '1px solid black' }}
      />
      <div>
        <button onClick={() => move(true)}>Move Forward</button>
        <button onClick={() => move(false)}>Move Backward</button>
        <button onClick={() => rotate(true)}>Rotate Left</button>
        <button onClick={() => rotate(false)}>Rotate Right</button>
      </div>
      <div>
        Coordinates: Latitude: {roverPosition.lat.toFixed(2)}, Longitude:{' '}
        {roverPosition.lon.toFixed(2)}, Orientation: {roverPosition.orientation}
      </div>
    </div>
  )
}

export default App
