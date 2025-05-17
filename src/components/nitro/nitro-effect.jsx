import { useEffect, useRef, useState } from "react"
import videoUrl from "../../assets/videos/nitro-effect.mp4"
import { FaTimes } from "react-icons/fa"
import "./style.css"

export default function IntroScreen({ duration = 4000 }) {
  const [visible, setVisible] = useState(true)
  const videoRef = useRef(null)

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro")

    if (hasSeenIntro) {
      setVisible(false)
      return
    }

    const timer = setTimeout(() => {
      setVisible(false)
      localStorage.setItem("hasSeenIntro", "true")
    }, duration)

    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video playback failed:", error)
      })
    }

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setVisible(false)
    localStorage.setItem("hasSeenIntro", "true")
  }

  if (!visible) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={handleClose} className="close-button" aria-label="Close intro video">
          <FaTimes className="close-icon" />
        </button>
        <div className="intro-screen">
          <video ref={videoRef} className="intro-video" autoPlay muted playsInline>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  )
}
