import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Skin.css'

interface SkinProps {
  backgroundImage: string
  chromas: {
    chromaId: number
    chromaColors: string[]
    downloadUrl: string
  }[]
  skinId: number
  isSelected: boolean
  selectedChromaId: number | null
  onSkinClick: (skinId: number) => void
  onChromaClick: (skinId: number, chromaId: number) => void
}

function Skin({
  backgroundImage,
  chromas,
  skinId,
  isSelected,
  selectedChromaId,
  onSkinClick,
  onChromaClick
}: SkinProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const skinRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.src = backgroundImage
    img.onload = (): void => {
      setIsLoading(false)
    }
  }, [backgroundImage])

  useEffect(() => {
    if (isSelected && skinRef.current) {
      skinRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isSelected])

  return (
    <motion.div
      ref={skinRef}
      className={`skin-holder ${isLoading ? 'skeleton' : ''}`}
      style={
        !isLoading
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: '120%',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px'
            }
          : {}
      }
      whileHover={{
        scale: 1.05,
        backgroundPosition: '60% center',
        transition: { duration: 0.3 }
      }}
      onClick={() => onSkinClick(skinId)}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: -1,
              left: -1,
              right: -1,
              bottom: -1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              borderRadius: '4px'
            }}
          />
        )}
      </AnimatePresence>

      {chromas.length > 0 && !isLoading && (
        <motion.div
          className="chromas"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ zIndex: 2, position: 'relative' }}
        >
          {chromas.map((chroma) => (
            <motion.div
              key={chroma.chromaId}
              className="chroma-color"
              style={{
                background: `linear-gradient(135deg, ${chroma.chromaColors[0]} 50%, ${chroma.chromaColors[1]} 50%)`,
                borderRadius: '50%',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{
                scale: 1.5,
                transition: { duration: 0.2 }
              }}
              animate={{
                scale: selectedChromaId === chroma.chromaId ? 1.3 : 1,
                transition: { duration: 0.3 }
              }}
              onClick={(e) => {
                e.stopPropagation()
                onChromaClick(skinId, chroma.chromaId)
              }}
            >
              {selectedChromaId === chroma.chromaId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderRadius: '50%'
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default Skin
