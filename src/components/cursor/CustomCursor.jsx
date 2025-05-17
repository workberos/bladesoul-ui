/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { GiCrossedSwords } from "react-icons/gi"
import "./style.css"

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 300 }
  const trailingX = useSpring(cursorX, springConfig)
  const trailingY = useSpring(cursorY, springConfig)

  const outerSpringConfig = { damping: 15, stiffness: 150 }
  const outerX = useSpring(cursorX, outerSpringConfig)
  const outerY = useSpring(cursorY, outerSpringConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const checkIfPointer = () => {
      const hoveredElement = document.elementFromPoint(
        cursorX.get(),
        cursorY.get()
      )
      
      if (hoveredElement) {
        const computedStyle = window.getComputedStyle(hoveredElement)
        const cursorStyle = computedStyle.getPropertyValue("cursor")
        setIsPointer(cursorStyle === "pointer")
      }
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mouseenter", handleMouseEnter)
    
    const intervalId = setInterval(checkIfPointer, 100)

    document.body.style.cursor = "none"

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mouseenter", handleMouseEnter)
      clearInterval(intervalId)
      
      document.body.style.cursor = "auto"
    }
  }, [cursorX, cursorY])

  return (
    <>
      <motion.div
        className={`game-cursor ${isVisible ? "visible" : ""} ${isClicking ? "clicking" : ""}`}
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <div className="cursor-dot"></div>
      </motion.div>

      <motion.div
        className={`game-cursor-trail ${isVisible ? "visible" : ""} ${isPointer ? "pointer" : ""} ${isClicking ? "clicking" : ""}`}
        style={{
          x: trailingX,
          y: trailingY,
        }}
      >
        {isPointer ? (
          <div className="cursor-pointer">
            <GiCrossedSwords />
          </div>
        ) : (
          <div className="cursor-ring"></div>
        )}
      </motion.div>

      <motion.div
        className={`game-cursor-outer ${isVisible ? "visible" : ""} ${isClicking ? "clicking" : ""}`}
        style={{
          x: outerX,
          y: outerY,
        }}
      >
        <div className="cursor-outer-ring"></div>
      </motion.div>
    </>
  )
}

export default CustomCursor
